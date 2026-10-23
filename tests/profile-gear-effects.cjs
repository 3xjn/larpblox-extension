const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const native2d='https://native-2d.test/avatar.png';
 const native2dBytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
 for(const peer of [false,true]) {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<div class="user-profile-header-details-avatar-container"><img id="head" src="native.png"></div><a href="/users/123/profile"><span class="avatar-headshot"><img id="friend" src="native.png"></span></a><div id="nav-profile"><img id="nav" src="native.png"></div><div class="profile-avatar-left"><img id="body" src="native.png"><canvas></canvas></div>'}));
  await page.route(native2d,r=>r.fulfill({status:200,headers:{'access-control-allow-origin':'*'},contentType:'image/png',body:native2dBytes}));
  await page.goto('https://www.roblox.com/users/123/profile');
  await page.evaluate(native2d=>{
   window.calls=[];window.captures=[];
   window.LarpbloxAvatarRequests={cached:(d,u,kind)=>kind==='3d'?'descriptor':undefined,render:async(d,u,s,kind)=>kind==='2d'?native2d:'descriptor',gearPose:async()=> 'pose-descriptor'};
   window.LarpbloxAvatar3D={create:async(host,url,options)=>{calls.push(options);const canvas=document.createElement('canvas');host.append(canvas);return {capture:kind=>{captures.push(kind);return `data:image/png;base64,${kind}`;},dispose(){canvas.remove();}};}};
  },native2d);
  await page.addScriptTag({path:path.resolve(__dirname,'../larpbux-avatar-surfaces.js')});
  await page.evaluate(async peer=>{
   const surface=peer?LarpbloxAvatarSurfaces.createForPeer():LarpbloxAvatarSurfaces;
   await surface.update({userId:'123',active:true,signature:'effects',items:[{id:99119240,assetType:19},{id:999,assetType:8},{id:998,assetType:8}],loadDefinition:async()=>({assets:[{id:99119240},{id:999},{id:1055299}]})});
  },peer);
  await page.waitForTimeout(50);

  const bodySrc=await page.locator('#body').getAttribute('src');
  assert.equal(await page.locator('#head').getAttribute('src'),bodySrc,'header picture must use the same native 2D render');
  assert.equal(await page.locator('#friend').getAttribute('src'),bodySrc,'friend pictures use native 2D');
  if(!peer) assert.equal(await page.locator('#nav').getAttribute('src'),bodySrc,'navigation picture uses native 2D');
  assert.notEqual(bodySrc,'data:image/png;base64,fullBody','native 2D full-body still must not be replaced by local capture');
  assert.ok(bodySrc?.startsWith('data:image/png'),'native 2D fixture must be applied as an image');
  const calls=await page.evaluate(()=>calls.map(c=>({static:c.static,effects:c.effects,items:c.items,poseDescriptorUrl:c.poseDescriptorUrl})));
  assert.equal(calls.length,1,'only the interactive viewer needs a 3D model');
  assert.deepEqual(calls.map(call=>call.effects),[false],'profile viewers must disable effects');
  for(const call of calls)assert.equal(call.poseDescriptorUrl,'pose-descriptor','static and interactive profiles use the same restored pose');
  for(const call of calls)assert.deepEqual(call.items,[],'profile viewers must not receive effect items');
  await page.close();
 }
 console.log('PASS: own and peer profiles retain native 2D body images and disable invented effects in portrait and interactive 3D viewers.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
