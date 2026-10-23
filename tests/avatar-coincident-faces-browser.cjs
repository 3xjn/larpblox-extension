const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
// The same coplanar, opposite-winding pattern found in Doombringer's mesh.
const obj=['o Hat','v -1 -1 0','v 1 -1 0','v 0 1 0','vt .25 .5','vt .75 .5',
  'usemtl HatMtl','f 1/1 2/1 3/1','f 3/2 2/2 1/2'].join('\n');
const mtl='newmtl HatMtl\nKd 1 1 1\nmap_Kd https://a.rbxcdn.com/two-sides.svg';
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
  try {
    const page=await browser.newPage({viewport:{width:320,height:320}});
    await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<div id="preview" style="width:300px;height:300px"></div>'}));
    await page.route('https://a.rbxcdn.com/**',r=>r.fulfill({headers:{'Access-Control-Allow-Origin':'*'},contentType:'image/svg+xml',
      body:'<svg xmlns="http://www.w3.org/2000/svg" width="2" height="1"><path fill="red" d="M0 0h1v1H0z"/><path fill="blue" d="M1 0h1v1H1z"/></svg>'}));
    await page.route('https://tr.rbxcdn.com/**',r=>{
      const name=new URL(r.request().url()).pathname.slice(1);
      const descriptor={obj:'https://tr.rbxcdn.com/hat.obj',mtl:'https://tr.rbxcdn.com/hat.mtl',textures:[],camera:{fov:35,position:{x:0,y:0,z:5},direction:{x:0,y:0,z:-1}}};
      return r.fulfill({headers:{'Access-Control-Allow-Origin':'*'},contentType:name==='descriptor'?'application/json':'text/plain',
        body:name==='descriptor'?JSON.stringify(descriptor):name==='hat.obj'?obj:mtl});
    });
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({path:process.env.RENDERER_BUNDLE||path.join(root,'larpbux-avatar-3d.js')});
    const front=await page.evaluate(async()=>{
      window.viewer=await LarpbloxAvatar3D.create(document.querySelector('#preview'),'https://tr.rbxcdn.com/descriptor',{static:true});
      const image=new Image();image.src=viewer.capture();await image.decode();
      const copy=document.createElement('canvas');copy.width=image.width;copy.height=image.height;
      const ctx=copy.getContext('2d');ctx.drawImage(image,0,0);
      return Array.from(ctx.getImageData(Math.floor(image.width/2),Math.floor(image.height/2),1,1).data);
    });
    assert.ok(front[0]>150&&front[2]<80&&front[3]>200,`front of hat must show its red front texture, not the coincident blue inside: ${front}`);
    await page.evaluate(()=>viewer.dispose());
    console.log('PASS: real WebGL editor preview shows the correct outward face of overlapping old hat geometry.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
