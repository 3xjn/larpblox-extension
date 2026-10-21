const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:`<div class="profile-avatar-left" style="width:700px;height:250px"><canvas></canvas></div><div class="user-profile-header-details-avatar-container"><span class="avatar-card-image"><img id="portrait" src="native.png"></span></div>`}));
  await page.goto('https://www.roblox.com/users/123/profile');
  await page.evaluate(()=>{
   const canvas=document.createElement('canvas');canvas.width=canvas.height=32;
   canvas.getContext('2d').fillRect(8,2,16,28);window.photo=canvas.toDataURL();window.calls=[];
   window.LarpbloxAvatarRequests={cached:()=>undefined,render:async(d,u,s,type)=>{
    calls.push(type);if(type==='2d')return photo;throw Object.assign(new Error('Avatar render failed (429).'),{retryAfter:120});
   }};
  });
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
  await page.evaluate(()=>LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'cold',loadDefinition:async()=>({assets:[{id:808}]})}));
  await page.waitForFunction(()=>document.querySelector('#portrait').src.startsWith('data:image/'));
  await page.locator('.larpblox-own-profile-preview img').waitFor();
  assert.deepEqual(await page.evaluate(()=>calls),['2d','3d']);
  assert.equal(await page.locator('#portrait').evaluate(el=>getComputedStyle(el).visibility),'visible');
  assert.ok(await page.evaluate(()=>localStorage.getItem('larpblox-profile-pictures:123')));
  console.log('PASS: cold profiles fetch a matching 2D image and keep both portrait and banner visible when 3D is rate limited.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
