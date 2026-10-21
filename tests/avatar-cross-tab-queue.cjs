const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright');
const root = path.resolve(__dirname,'..');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate) {
  const deadline=Date.now()+10000;
  while(!predicate()) { assert.ok(Date.now()<deadline,'expected request did not reach the test server'); await pause(10); }
}

(async()=>{
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const context = await browser.newContext();
  const sent=[], attempts=new Map(); let active=0, maxActive=0;
  const headers={'Access-Control-Allow-Origin':'https://www.roblox.com','Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'content-type,x-csrf-token','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Expose-Headers':'Retry-After'};
  try {
    await context.route('https://www.roblox.com/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Queue test</title>'}));
    await context.route('https://avatar.roblox.com/v1/avatar/render',async route=>{
      if(route.request().method()==='OPTIONS') return route.fulfill({status:204,headers});
      const body=route.request().postDataJSON(), id=body.avatarDefinition.assets[0].id;
      const count=(attempts.get(id)||0)+1;attempts.set(id,count);
      const entry={id,count,at:Date.now()};sent.push(entry);active++;maxActive=Math.max(maxActive,active);
      await pause(150);
      active--;
      const limited=id===501;
      await route.fulfill({status:limited?429:200,headers:{...headers,...(limited?{'Retry-After':'2'}:{})},json:limited?{}:
        {state:((id===101&&count<3)||(id===301&&count<2)||(id===401&&count<2))?'Pending':'Completed',imageUrl:`https://tr.rbxcdn.com/${id}.png`}}).catch(()=>{});
      entry.finished=Date.now();
    });
    const tabs=await Promise.all([0,1,2].map(async id=>{
      const page=await context.newPage();await page.goto(`https://www.roblox.com/queue-test?tab=${id}`);
      await page.addScriptTag({path:path.join(root,'larpblox-avatar-requests.js')});return page;
    }));
    const render=(page,id,extra={})=>page.evaluate(({id,extra})=>LarpbloxAvatarRequests.render({assets:[{id},...(extra.second?[{id:102}]:[])],...extra.definition},'123',new AbortController().signal,extra.type||'3d'),{id,extra});

    // Different object/asset order and irrelevant 3D backdrop fields must share
    // one pending poll sequence, even though each tab has its own JS globals.
    const same=await Promise.all([
      render(tabs[0],101,{second:true,definition:{backgroundId:7,backgroundRequestModel:{id:7}}}),
      tabs[1].evaluate(()=>LarpbloxAvatarRequests.render({assets:[{id:102},{id:101}],backgroundId:8},123,new AbortController().signal,'3d')),
      render(tabs[2],101,{second:true}),
    ]);
    assert.deepEqual(same,Array(3).fill('https://tr.rbxcdn.com/101.png'));
    assert.equal(attempts.get(101),3,'three tabs must share three polls, not send nine');
    const polls=sent.filter(e=>e.id===101);
    assert.ok(polls[2].at-polls[1].at>=1900,'pending polls must back off rather than repeat every second');
    console.log('PASS: three tabs share one canonical render and one backed-off polling sequence.');

    await Promise.all(tabs.map((page,index)=>render(page,201+index)));
    assert.equal(maxActive,1,'different tabs must never overlap render POST requests');
    for(let i=1;i<sent.length;i++) assert.ok(sent[i].at-sent[i-1].at>=900,'request pacing must apply across tabs');
    console.log('PASS: different outfits use one network queue with global request spacing.');

    const leader=render(tabs[0],301);
    await until(()=>attempts.has(301));
    const aborted=await tabs[1].evaluate(async()=>{
      const controller=new AbortController();setTimeout(()=>controller.abort(),50);
      try{await LarpbloxAvatarRequests.render({assets:[{id:301}]},123,controller.signal);return 'unexpected success';}
      catch(error){return error.name;}
    });
    assert.equal(aborted,'AbortError');assert.equal(await leader,'https://tr.rbxcdn.com/301.png');
    assert.equal(attempts.get(301),2,'cancelling a waiting tab must not restart the live job');

    const closing=render(tabs[0],401).catch(()=>{});
    await until(()=>attempts.has(401));
    await pause(220);
    const takeover=render(tabs[2],401);
    await tabs[0].close();await closing;
    assert.equal(await takeover,'https://tr.rbxcdn.com/401.png');
    console.log('PASS: waiting callers cancel independently; closing the leader releases its locks for takeover.');

    const limited=render(tabs[1],501).then(()=>{throw Error('expected 429');},error=>String(error));
    await until(()=>attempts.has(501));
    const queued=render(tabs[2],502);
    assert.match(await limited,/429/);
    const before=sent.length;
    assert.match(await render(tabs[1],501).then(()=>'',error=>String(error)),/429/);
    assert.equal(sent.length,before,'a second attempt during cooldown must not hit the network');
    assert.equal(await queued,'https://tr.rbxcdn.com/502.png');
    const rate=sent.find(e=>e.id===501), resumed=sent.find(e=>e.id===502);
    assert.ok(resumed.at-rate.finished>=1850,'another tab must honor Retry-After before its queued POST');
    await tabs[1].reload();await tabs[1].addScriptTag({path:path.join(root,'larpblox-avatar-requests.js')});
    const cachedCount=sent.length;await render(tabs[1],502);assert.equal(sent.length,cachedCount,'a reload must reuse a completed render from another tab');
    console.log('PASS: 429 cooldown is shared before lock release, and results survive reloads.');

    const lastCount=sent.length;
    const unavailable=await tabs[1].evaluate(async()=>{
      const original=Storage.prototype.setItem;
      Storage.prototype.setItem=function(key,value){if(key==='larpblox.avatar-render-timing') throw Error('blocked');return original.call(this,key,value);};
      try{await LarpbloxAvatarRequests.render({assets:[{id:999}]},123,new AbortController().signal);return 'unexpected success';}
      catch(error){return error.message;}
      finally{Storage.prototype.setItem=original;}
    });
    assert.match(unavailable,/storage is unavailable/);assert.equal(sent.length,lastCount);
    await fs.mkdir(path.join(root,'.test-artifacts'),{recursive:true});
    await fs.writeFile(path.join(root,'.test-artifacts/avatar-queue-results.json'),JSON.stringify({maxActive,requests:sent},null,2));
    console.log('PASS: unavailable shared storage stops requests instead of silently reverting to per-tab spam.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
