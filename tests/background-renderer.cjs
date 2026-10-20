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
   const c=document.createElement('canvas');c.width=c.height=420;const g=c.getContext('2d');
   g.fillStyle='#00ff00';g.fillRect(0,0,420,420);g.fillStyle='#0000ff';g.fillRect(0,0,35,420);g.fillRect(385,0,35,420);
   return c.toDataURL().split(',')[1];
  });
  const cors={'Access-Control-Allow-Origin':'*'};
  await page.route('https://thumbnails.roblox.com/**',r=>r.fulfill({headers:cors,json:{data:[{targetId:92,state:'Completed',imageUrl:'https://tr.rbxcdn.com/background.png'}]}}));
  await page.route('https://tr.rbxcdn.com/**',r=>{
   const name=new URL(r.request().url()).pathname;
   if(name==='/background.png')return r.fulfill({headers:cors,contentType:'image/png',body:Buffer.from(texture,'base64')});
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
  await page.evaluate(()=>viewer.dispose());
  assert.equal(await page.locator('#preview canvas').count(),0);
  console.log('PASS: real WebGL background covers the editor, preserves spin and dragging, captures, and disposes.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
