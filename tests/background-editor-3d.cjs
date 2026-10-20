const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-back" style="width:277px;height:352px;background:tan"><div class="avatar-thumbnail" style="width:277px;height:352px"><canvas></canvas></div></div><button class="toggle-three-dee">2D</button><div class="breadcrumb-container">Backgrounds</div><div class="items-list avatar-item-list"></div></main>'}));
  await page.route('https://thumbnails.roblox.com/**',r=>r.fulfill({json:{data:[]}}));
  await page.goto('https://www.roblox.com/my/avatar');
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-game-bridge.js')});
  await page.evaluate(()=>{
   document.documentElement.classList.add('larpblox-modern');
   const bg={id:75789087422384,itemType:'Asset',assetType:92,name:'Background',assetTypeVerified:true,limitedVerified:true};
   const bodyColors=Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(p=>[p+'Color','#ffffff']));
   localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,balance:1000,items:[bg],equipped:[],backgroundId:bg.id,gameLook:{version:1,userId:'123',items:[],definition:{assets:[],bodyColors,scales:{},playerAvatarType:{playerAvatarType:'R15'}}}}));
   window.renders=[];window.viewers=[];
   window.LarpbloxAvatarRequests={render:async(def,u,s,kind)=>{renders.push({def,kind});return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII='}};
   window.LarpbloxAvatar3D={create:async(host,url,options)=>{viewers.push(options);host.append(document.createElement('canvas'));return {dispose(){},getView(){return {position:[1,2,3]}}}}};
  });
  await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});
  await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});
  await page.waitForFunction(()=>renders.length>0);
  assert.equal(await page.evaluate(()=>renders[0].kind),'3d','a background must not force an immovable 2D avatar');
  await page.locator('.larpbux-avatar-look canvas').waitFor();
  assert.equal(await page.evaluate(()=>viewers[0].definition.backgroundRequestModel.id),75789087422384);
  const size=await page.locator('.larpbux-avatar-scene').boundingBox();
  assert.equal(size.width,277);assert.equal(size.height,352);
  await page.locator('.avatar-thumbnail').evaluate(e=>e.classList.add('larpbux-hat-tab'));
  await page.addStyleTag({content:'.avatar-back:has(.larpbux-hat-tab) .avatar-thumbnail {width:calc(100% - 33px);margin-left:33px}'});
  const frame=await page.locator('.avatar-back').boundingBox();
  const fullCanvas=await page.locator('.larpbux-avatar-look canvas').boundingBox();
  assert.equal(fullCanvas.x,frame.x,'opening Hats must not expose a strip of the outer avatar backdrop');
  assert.equal(fullCanvas.width,frame.width,'background must fill the outer frame, not the inset native thumbnail');
  await page.addStyleTag({content:'#avatar-web-app .larpbux-hat-tab canvas {margin-left:33px;width:calc(100% - 33px)}'});
  const canvasBox=await page.locator('.larpbux-avatar-look canvas').boundingBox();
  assert.equal(canvasBox.x,size.x,'native Hats canvas margins must not shift the background');
  assert.equal(canvasBox.width,size.width);
  const hatsSize=await page.locator('.larpbux-avatar-scene').boundingBox();
  assert.equal(hatsSize.x,size.x);assert.equal(hatsSize.width,size.width,'opening Hats must not shrink the background');
  console.log('PASS: equipped backgrounds retain the interactive 3D editor and fill its rectangular preview.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
