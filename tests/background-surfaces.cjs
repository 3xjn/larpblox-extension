const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<div class="profile-avatar-thumb"><img id="portrait" src="real.png"><canvas></canvas></div>'}));
  await page.goto('https://www.roblox.com/users/123/profile');
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
  await page.evaluate(()=>{
   globalThis.LarpbloxAvatarRequests={render:async(d,u,s,kind)=>kind==='2d'?'https://tr.rbxcdn.com/background.png':'descriptor'};
   window.definitions=[];
   globalThis.LarpbloxAvatar3D={create:async(host,url,options)=>{definitions.push(options.definition);const canvas=document.createElement('canvas');host.append(canvas);return {capture:()=> 'data:image/png;base64,AA==',dispose(){canvas.remove()}}}};
  });
  await page.evaluate(()=>LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'bg',loadDefinition:async()=>({backgroundRequestModel:{id:75789087422384}})}));
  assert.equal(await page.locator('#portrait').getAttribute('src'),'data:image/png;base64,AA==');
  assert.equal(await page.locator('.larpblox-own-profile-preview canvas').count(),1);
  assert.ok(await page.evaluate(()=>definitions.every(d=>d.backgroundRequestModel.id===75789087422384)));
  await page.evaluate(()=>LarpbloxAvatarSurfaces.update({active:false}));
  assert.equal(await page.locator('#portrait').getAttribute('src'),'real.png');
  assert.equal(await page.locator('.larpblox-own-profile-preview').count(),0);
  console.log('PASS: profile background image, canvas replacement, and restoration.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
