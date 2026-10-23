const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const native2d='https://native-2d.test/avatar.png';
 for(const peer of [false,true]) for(const gear of [false,true]) {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<div class="user-profile-header-details-avatar-container"><img id="head" src="native.png"></div><a href="/users/123/profile"><span class="avatar-headshot"><img id="friend" src="native.png"></span></a><div id="nav-profile"><img id="nav" src="native.png"></div><div class="profile-avatar-left"><img id="body" src="native.png"><canvas></canvas></div>'}));
  const fixture=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=420;const x=c.getContext('2d');x.fillStyle='red';x.fillRect(175,50,70,70);x.fillStyle='orange';x.fillRect(180,20,60,30);x.fillStyle='blue';x.fillRect(150,120,120,130);x.fillStyle='green';x.fillRect(165,250,90,140);return c.toDataURL().split(',')[1];});
  await page.route(native2d,r=>r.fulfill({status:200,headers:{'access-control-allow-origin':'*'},contentType:'image/png',body:Buffer.from(fixture,'base64')}));
  await page.goto('https://www.roblox.com/users/123/profile');
  await page.evaluate(native2d=>{
   window.calls=[];window.captures=[];
   window.LarpbloxAvatarRequests={cached:(d,u,kind)=>kind==='3d'?'descriptor':undefined,render:async(d,u,s,kind)=>kind==='2d'?native2d:'descriptor',gearPose:async()=> 'pose-descriptor'};
   window.LarpbloxAvatar3D={create:async(host,url,options)=>{calls.push(options);const canvas=document.createElement('canvas');host.append(canvas);return {capture:kind=>{captures.push(kind);return `data:image/png;base64,${kind}`;},dispose(){canvas.remove();}};}};
  },native2d);
  await page.addScriptTag({path:path.resolve(__dirname,'../larpbux-avatar-surfaces.js')});
  await page.evaluate(async ({peer,gear,native2d})=>{
   const surface=peer?LarpbloxAvatarSurfaces.createForPeer():LarpbloxAvatarSurfaces;
   await surface.update({userId:'123',active:true,signature:'effects',imageUrl:native2d,items:[{id:99119240,assetType:gear?19:8},{id:999,assetType:8},{id:998,assetType:8}],loadDefinition:async()=>({assets:[{id:99119240},{id:999},{id:1055299}]})});
  },{peer,gear,native2d});
  await page.waitForTimeout(50);

  const bodySrc=await page.locator('#body').getAttribute('src');
  const headSrc=await page.locator('#head').getAttribute('src');
  if(gear) assert.equal(headSrc,bodySrc,'gear picture framing must remain unchanged');
  else assert.notEqual(headSrc,bodySrc,'no-gear circles must be headshots, not full-body images');
  assert.equal(await page.locator('#friend').getAttribute('src'),headSrc,'friend pictures use native 2D');
  if(!peer) assert.equal(await page.locator('#nav').getAttribute('src'),headSrc,'navigation picture uses native 2D');
  const colorCounts=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height).data;let legs=0,effects=0;for(let i=0;i<d.length;i+=4){if(d[i+3]>200&&d[i+1]>100&&d[i]<10)legs++;if(d[i+3]>200&&d[i]>200&&d[i+1]>100&&d[i+2]<10)effects++;}return {legs,effects};},headSrc);
  assert.ok(colorCounts.effects>100,'native effect pixels must survive portrait creation');
  if(gear)assert.ok(colorCounts.legs>100,'gear retains the entire avatar');
  else assert.equal(colorCounts.legs,0,'head-and-shoulders circles must exclude legs');
  assert.notEqual(bodySrc,'data:image/png;base64,fullBody','native 2D full-body still must not be replaced by local capture');
  assert.ok(bodySrc?.startsWith('data:image/png'),'native 2D fixture must be applied as an image');
  const calls=await page.evaluate(()=>calls.map(c=>({static:c.static,effects:c.effects,items:c.items,poseDescriptorUrl:c.poseDescriptorUrl})));
  assert.equal(calls.length,1,'only the interactive viewer needs a 3D model');
  assert.deepEqual(calls.map(call=>call.effects),[false],'profile viewers must disable effects');
  for(const call of calls)assert.equal(call.poseDescriptorUrl,'pose-descriptor','static and interactive profiles use the same restored pose');
  for(const call of calls)assert.deepEqual(call.items,[],'profile viewers must not receive effect items');
  await page.close();
 }
 console.log('PASS: own/peer headshots crop to the upper body with native effect pixels; gear framing and effect-free interactive 3D remain unchanged.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
