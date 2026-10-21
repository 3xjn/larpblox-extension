const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const sent=[];let polls=0;const storage=new Map();
const context={...require('./helpers/render-locks.cjs')(),AbortController,setTimeout,clearTimeout,Date,localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},document:{querySelector(){return null}},fetch:async(url,options)=>{const id=JSON.parse(options.body).avatarDefinition.assets[0].id;sent.push({id,time:Date.now()});return {ok:true,status:200,headers:{get(){return null}},json:async()=>id===1&&++polls<3?{state:'Pending'}:{state:'Completed',imageUrl:'https://tr.rbxcdn.com/'+id}}}};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../larpblox-avatar-requests.js'),'utf8'),context);
(async()=>{const requests=context.LarpbloxAvatarRequests;
const old=requests.render({assets:[{id:1}]},123,new AbortController().signal);
await new Promise(r=>setTimeout(r,20));
const fresh=requests.render({assets:[{id:2}]},123,new AbortController().signal);
assert.equal(await fresh,'https://tr.rbxcdn.com/2');
assert.equal(sent[1].id,2,'a pending old avatar must not block the newly equipped accessory behind all of its polls');
await old;
for(let i=1;i<sent.length;i++)assert.ok(sent[i].time-sent[i-1].time>=950,'requests must retain the shared one-second rate limit');
const count=sent.length;await requests.render({assets:[{id:2}]},123,new AbortController().signal);assert.equal(sent.length,count,'re-equipping a cached look should not send another request');
const controller=new AbortController();controller.abort();await assert.rejects(requests.render({assets:[{id:3}]},123,controller.signal),{name:'AbortError'});
// A stalled response body must time out instead of locking the shared queue.
const normalFetch=context.fetch;
context.setTimeout=(fn,ms)=>setTimeout(fn,ms===20000?30:ms);
context.fetch=async(url,options)=>JSON.parse(options.body).avatarDefinition.assets[0].id===4
 ? {ok:true,status:200,headers:{get(){return null}},json:()=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(Object.assign(new Error('body aborted'),{name:'AbortError'})),{once:true}))}
 : normalFetch(url,options);
const stalled=requests.render({assets:[{id:4}]},123,new AbortController().signal);
await assert.rejects(stalled,{name:'AbortError'});
assert.equal(await requests.render({assets:[{id:5}]},123,new AbortController().signal),'https://tr.rbxcdn.com/5');
// Server-requested cooldown still applies across different outfits.
const cooldownStarts=[];context.fetch=async(url,options)=>{cooldownStarts.push(Date.now());const id=JSON.parse(options.body).avatarDefinition.assets[0].id;return {ok:id!==6,status:id===6?429:200,headers:{get(name){return name==='retry-after'?'1':null}},json:async()=>({state:'Completed',imageUrl:'https://tr.rbxcdn.com/'+id})}};
const limited=requests.render({assets:[{id:6}]},123,new AbortController().signal);const allowed=requests.render({assets:[{id:7}]},123,new AbortController().signal);
await assert.rejects(limited,{status:429});await allowed;
assert.ok(cooldownStarts[1]-cooldownStarts[0]>=950,'server cooldown must survive multiple queued outfits');
// A new tab/reloaded module must inherit the exponential 429 backoff too.
context.fetch=async()=>({ok:false,status:429,headers:{get(){return null}}});
const firstFailure=await requests.render({assets:[{id:8}]},123,new AbortController().signal).catch(error=>error);
assert.equal(firstFailure.retryAfter,20);
const timing=JSON.parse(storage.get('larpblox.avatar-render-timing'));
storage.set('larpblox.avatar-render-timing',JSON.stringify({...timing,nextRequest:0,blockedUntil:0}));
storage.set('larpblox.avatar-render-cooldown','0');context.LarpbloxRenderBlockedUntil=0;
vm.runInContext(fs.readFileSync(path.join(__dirname,'../larpblox-avatar-requests.js'),'utf8'),context);
const secondFailure=await context.LarpbloxAvatarRequests.render({assets:[{id:9}]},123,new AbortController().signal).catch(error=>error);
assert.equal(secondFailure.retryAfter,40,'reload must not reset the shared backoff counter');
context.navigator=undefined;
await assert.rejects(context.LarpbloxAvatarRequests.render({assets:[{id:10}]},123,new AbortController().signal),/cannot coordinate avatar requests/);
console.log('PASS: new accessory render bypasses pending polls, cached outfits are immediate, cancellation and request spacing remain intact.');
})().catch(e=>{console.error(e);process.exitCode=1});
