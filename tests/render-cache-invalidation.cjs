const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
(async()=>{
 const data=new Map();let calls=0;
 const context=vm.createContext({console,URL,Response,TextEncoder,AbortController,DOMException,crypto:require('node:crypto').webcrypto,setTimeout,clearTimeout,
  navigator:{locks:{request:async(name,options,work)=>work()}},
  localStorage:{getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)},document:{querySelector:()=>null},
  fetch:async()=>{calls++;return new Response(JSON.stringify({state:'Completed',imageUrl:`https://tr.rbxcdn.com/generated-${calls}.png`}),{headers:{'Content-Type':'application/json'}})}
 });
 const root=path.resolve(__dirname,'..');
 const source=process.env.BASELINE ? require('node:child_process').execFileSync('git',['show','HEAD:larpblox-avatar-requests.js'],{cwd:root,encoding:'utf8'}) : fs.readFileSync(path.join(root,'larpblox-avatar-requests.js'),'utf8');
 vm.runInContext(source,context);const api=context.LarpbloxAvatarRequests;
 const definition={assets:[{id:123}],playerAvatarType:{playerAvatarType:'R15'}};
 const first=await api.render(definition,'7',new AbortController().signal,'2d');
 data.set('larpblox-characters-v1:7',JSON.stringify({profiles:[{id:'one',name:'Saved',thumbnail:first,snapshot:{userId:'7',definition}}]}));
 data.set('larpblox-characters-v1:8',JSON.stringify({profiles:[{thumbnail:first}]}));
 api.forget(first,'7');
 assert.equal(api.cached(definition,'7','2d'),undefined,'broken URLs leave both saved and render caches');
 const second=await api.render(definition,'7',new AbortController().signal,'2d');
 assert.notEqual(first,second,'completed in-memory render is invalidated too');assert.equal(calls,2);
 const profile=JSON.parse(data.get('larpblox-characters-v1:7')).profiles[0];assert.equal(profile.name,'Saved');assert.deepEqual(profile.snapshot,{userId:'7',definition});
 assert.equal(JSON.parse(data.get('larpblox-characters-v1:8')).profiles[0].thumbnail,first,'other account cache is untouched');
 console.log('PASS: broken pictures clear account-specific disk and memory caches while saved outfits stay intact.');
})().catch(e=>{console.error(e);process.exitCode=1});
