const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage({viewport:{width:600,height:600},deviceScaleFactor:1});
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<div id="preview" style="width:277px;height:352px"></div>'}));
  await page.goto('https://www.roblox.com/my/avatar');
  const texture=await page.evaluate(()=>{
   const c=document.createElement('canvas');c.width=840;c.height=420;const g=c.getContext('2d');
   g.fillStyle='#00ff00';g.fillRect(0,0,840,420);g.fillStyle='#0000ff';g.fillRect(0,0,35,420);g.fillRect(805,0,35,420);
   return c.toDataURL().split(',')[1];
  });
  const cors={'Access-Control-Allow-Origin':'*'};
  await page.route('https://assetdelivery.roblox.com/**',r=>r.fulfill({headers:{...cors,'Access-Control-Allow-Credentials':'true','Access-Control-Allow-Origin':'https://www.roblox.com'},json:{locations:[{location:r.request().url().endsWith('/456')?'https://tr.rbxcdn.com/original-background.png':'https://tr.rbxcdn.com/background-definition.xml'}]}}));
  await page.route('https://thumbnails.roblox.com/**',r=>r.fulfill({headers:cors,json:{data:[{targetId:92,state:'Completed',imageUrl:'https://tr.rbxcdn.com/background.png'}]}}));
  await page.route('https://tr.rbxcdn.com/**',r=>{
   const name=new URL(r.request().url()).pathname;
   if(name==='/background-definition.xml')return r.fulfill({headers:cors,body:'<roblox><Item class="IntValue"><Properties><string name="Name">ImageId</string><int64 name="Value">456</int64></Properties></Item></roblox>'});
   if(name==='/background.png'||name==='/original-background.png')return r.fulfill({headers:cors,contentType:'image/png',body:Buffer.from(texture,'base64')});
   if(name==='/descriptor')return r.fulfill({headers:cors,json:{obj:'https://tr.rbxcdn.com/model.obj',mtl:'https://tr.rbxcdn.com/model.mtl',textures:[],camera:{fov:35,position:{x:0,y:1,z:8},direction:{x:0,y:0,z:-1}}}});
   return r.fulfill({headers:cors,body:name.endsWith('.obj')?'o Head\nv -0.5 0 0\nv 0.5 0 0\nv 0 2 0\nusemtl avatar\nf 1 2 3\n':'newmtl avatar\nKd 1 0 0\n'});
  });
  await page.addScriptTag({path:path.join(process.env.EXTENSION_ROOT || path.join(__dirname,'..'),'larpbux-avatar-3d.js')});
  await page.evaluate(async()=>{
   window.viewer=await LarpbloxAvatar3D.create(document.querySelector('#preview'),'https://tr.rbxcdn.com/descriptor',{definition:{backgroundRequestModel:{id:92}}});
  });
  const before=await page.evaluate(()=>viewer.getView());
  await page.waitForTimeout(300);
  const spinning=await page.evaluate(()=>viewer.getView());
  assert.notDeepEqual(spinning.position,before.position,'avatar must continue spinning with its background');
  await page.mouse.move(140,150);await page.mouse.down();await page.mouse.move(210,160,{steps:4});await page.mouse.up();
  const dragged=await page.evaluate(()=>viewer.getView());
  assert.notDeepEqual(dragged.position,spinning.position,'dragging must turn the avatar');
  const edges=await page.evaluate(async()=>{
   viewer.capture(); // Render immediately before reading the drawing buffer.
   const canvas=document.querySelector('#preview canvas'), image=new Image();image.src=canvas.toDataURL();await image.decode();
   const copy=document.createElement('canvas');copy.width=image.width;copy.height=image.height;
   const g=copy.getContext('2d');g.drawImage(image,0,0);
   return [[1,1],[1,copy.height/2],[copy.width-2,copy.height-2]].map(([x,y])=>Array.from(g.getImageData(x,y,1,1).data));
  });
  for(const pixel of edges)assert.deepEqual(pixel,[0,255,0,255],'background must cover the tall preview without bars or stretching');
  const alpha=await page.evaluate(async()=>{
   const image=new Image();image.src=viewer.capture('fullBody',{background:false});await image.decode();
   const c=document.createElement('canvas');c.width=c.height=420;const g=c.getContext('2d');g.drawImage(image,0,0);
   return g.getImageData(1,1,1,1).data[3];
  });
  assert.equal(alpha,0,'the centered profile avatar must have transparent corners');
  assert.equal(await page.evaluate(()=>viewer.getBackgroundUrl()),'https://tr.rbxcdn.com/original-background.png','use the original background ImageId, not its square catalog thumbnail');
  assert.equal(await page.evaluate(()=>viewer.getBackgroundAspect()),2);
  await page.evaluate(()=>viewer.dispose());
  assert.equal(await page.locator('#preview canvas').count(),0);
  await page.setViewportSize({width:1100,height:500});
  await page.evaluate(()=>{
   history.replaceState({},'', '/users/123/profile');
   document.body.innerHTML='<div class="currently-wearing-avatar-with-background"><div class="profile-avatar-left" style="width:970px;height:300px;position:relative"><div class="thumbnail-holder-position" style="position:absolute;inset:0;z-index:5"><div class="avatar-card-image profile-avatar-thumb" style="width:300px;height:300px;margin:auto"><canvas></canvas></div></div></div></div>';
   const original=LarpbloxAvatar3D.create;
   window.LarpbloxAvatar3D={...LarpbloxAvatar3D,create:async(host,url,options)=>{const result=await original(host,url,options);if(host.className==='larpblox-own-profile-preview')window.profileViewer=result;return result}};
   window.LarpbloxAvatarRequests={render:async()=> 'https://tr.rbxcdn.com/descriptor'};
  });
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
  await page.evaluate(()=>LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'profile',loadDefinition:async()=>({backgroundRequestModel:{id:92}})}));
  assert.equal(await page.evaluate(()=>document.elementFromPoint(450,150)?.classList.contains('larpblox-own-avatar-canvas')),true,'native thumbnail layer must not intercept profile dragging');
  const profileBefore=await page.evaluate(()=>profileViewer.getView());
  await page.mouse.move(450,150);await page.mouse.down();await page.mouse.move(550,155,{steps:5});await page.mouse.up();
  const profileAfter=await page.evaluate(()=>profileViewer.getView().position);
  assert.ok(Math.hypot(...profileAfter.map((n,i)=>n-profileBefore.position[i]))>1,'profile dragging must turn the avatar beyond its small automatic spin');
  await page.evaluate(()=>LarpbloxAvatarSurfaces.update({active:false}));
  console.log('PASS: real WebGL background covers the editor, preserves spin and dragging, captures, and disposes.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
