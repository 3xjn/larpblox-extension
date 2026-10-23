const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 for(const peer of [false,true]) {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<div class="user-profile-header-details-avatar-container"><img id="head" src="native.png"></div><div class="profile-avatar-left"><img id="body" src="native.png"><canvas></canvas></div>'}));
  await page.goto('https://www.roblox.com/users/123/profile');
  await page.evaluate(()=>{
   window.calls=[];window.captures=[];
   window.LarpbloxAvatarRequests={cached:(d,u,kind)=>kind==='3d'?'descriptor':undefined,render:async()=> 'descriptor',gearPose:async()=> 'pose-descriptor'};
   window.LarpbloxAvatar3D={create:async(host,url,options)=>{calls.push(options);const canvas=document.createElement('canvas');host.append(canvas);return {capture:kind=>{captures.push(kind);return `data:image/png;base64,${kind}`;},dispose(){canvas.remove();}};}};
  });
  await page.addScriptTag({path:path.resolve(__dirname,'../larpbux-avatar-surfaces.js')});
  await page.evaluate(async peer=>{
   const surface=peer?LarpbloxAvatarSurfaces.createForPeer():LarpbloxAvatarSurfaces;
   await surface.update({userId:'123',active:true,signature:'effects',items:[{id:99119240,assetType:19},{id:999,assetType:8},{id:998,assetType:8}],loadDefinition:async()=>({assets:[{id:99119240},{id:999}]})});
  },peer);
  assert.equal(await page.locator('#head').getAttribute('src'),'data:image/png;base64,headshot');
  assert.equal(await page.locator('#body').getAttribute('src'),'data:image/png;base64,fullBody');
  const calls=await page.evaluate(()=>calls.map(c=>({static:c.static,items:c.items,poseDescriptorUrl:c.poseDescriptorUrl})));
  assert.equal(calls.length,2,'both static portrait capture and live full-profile viewer are enhanced');
  for(const call of calls)assert.equal(call.poseDescriptorUrl,'pose-descriptor','static and interactive profiles use the same restored pose');
  for(const call of calls)assert.deepEqual(call.items,[{id:99119240,assetType:19},{id:999,assetType:8}],'only equipped effect items reach each viewer');
  await page.close();
 }
 console.log('PASS: own and peer profiles pass equipped gear and hats to headshot captures and the full-avatar viewer.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
