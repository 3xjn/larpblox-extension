const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  for (const connected of [true,false]) {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><main></main>'}));
  await page.goto('https://www.roblox.com/users/123/profile');
  await page.evaluate(connected=>{
   const definition={assets:[],bodyColors:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(p=>[p+'Color','ffffff'])),scales:{},playerAvatarType:{playerAvatarType:'R15'}};
   window.snapshot={version:1,userId:'123',items:[],definition,backgroundId:0};window.publishes=0;window.reads=0;window.signatures=[];
   localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,pendingOutfit:true,balance:999999,items:[{id:42,itemType:'Asset',assetType:92,name:'Background'}],equipped:[],backgroundId:42,...(connected?{gameLook:snapshot}:{})}));
   window.LarpbloxExtension={onMessage:{addListener(fn){window.receive=fn}},sendMessage:async message=>{
    if(message.action==='publish')publishes++;if(message.action==='read')reads++;
    return {ok:true,data:{connected:true,snapshot}};
   }};
   window.LarpbloxAvatarSurfaces={update:options=>signatures.push(options.signature)};
  },connected);
  for(const file of ['larpbux-game-bridge.js','larpbux.js'])await page.addScriptTag({path:path.join(__dirname,'..',file)});
  await page.waitForFunction(()=>publishes===1 && reads>=3);
  assert.equal(await page.evaluate(()=>publishes),1,'an accepted outfit awaiting a matching game snapshot must not be resent on every read');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).pendingOutfit),true);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).backgroundId),42,'initial connection preserves the pending browser selection');
  const signature = await page.evaluate(()=>signatures.at(-1));
  await page.evaluate(()=>receive({type:'larpblox-popup-username',username:'ChangedAlias'},null,()=>{}));
  assert.equal(await page.evaluate(()=>signatures.at(-1)),signature,'name-only changes must not restart avatar renders');
  await page.evaluate(()=>{snapshot={...snapshot,backgroundId:42,backgrounds:[{id:42,name:'Background'}]};receive({type:'larpblox-game-state',userId:'123'},null,()=>{});});
  await page.waitForFunction(()=>!JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).pendingOutfit);
  assert.equal(await page.evaluate(()=>publishes),1);
  await page.close();
  }
  console.log('PASS: one publication waits for background confirmation, matching state clears pending edits, and renames preserve the render signature.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
