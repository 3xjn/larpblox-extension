const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 for(const standalone of [false,true]) {
 const page=await browser.newPage();
 await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:`<meta name="user-data" data-userid="123"><div id="header"><a id="nav-profile" href="/users/123/profile"><img id="nav" src="native-nav.png"></a></div><div class="container-main"><img class="presence-icon" id="presence-before" src="presence-before.png"><div><a href="/users/123/profile">nomstomp</a></div><div><img id="edit" src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-example-Png/150/150/AvatarHeadshot/Png/noFilter" srcset="native-large.png 2x"></div><div>Name <span>nom</span></div><img class="presence-icon" id="presence" src="presence.png"></div>`}));
 await page.goto('https://www.roblox.com/users/profile/edit');
 if(standalone) await page.evaluate(()=>{const root=document.querySelector('.container-main');root.removeAttribute('class');const photo=document.querySelector('#edit');const header=document.createElement('header');photo.replaceWith(header);header.append(photo);});
 await page.addScriptTag({path:path.resolve(__dirname,'../identity-gate.js')});
 assert.equal(await page.evaluate(()=>LarpbloxIdentityGate.editProfileImage()?.id),'edit','Edit Profile avatar must be found inside the current Roblox content wrapper');
 await page.addScriptTag({path:path.resolve(__dirname,'../larpbux-avatar-surfaces.js')});
 await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=c.height=20;c.getContext('2d').fillRect(5,2,10,18);const url=c.toDataURL();
  localStorage.setItem('larpblox-profile-pictures:123',JSON.stringify({version:12,expires:Date.now()+60000,result:{headshot:url,fullBody:url,transparentBody:url}}));
  LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'pending',loadDefinition:()=>new Promise(()=>{})});
 });
 assert.equal(await page.locator('#edit').getAttribute('src'),await page.locator('#nav').getAttribute('src'),'Edit Profile must show the cached headshot immediately, even while outfit loading is pending');
 await page.evaluate(()=>localStorage.removeItem('larpblox-profile-pictures:123'));
 await page.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=c.height=20;c.getContext('2d').fillRect(5,2,10,18);const url=c.toDataURL();
  window.LarpbloxAvatarRequests={render:async(d,u,s,t)=>t==='2d'?url:'descriptor'};
  window.updateAvatar=()=>LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'edit',loadDefinition:async()=>({assets:[]}),items:[]});
  await updateAvatar();
 });
 const avatar=await page.locator('#edit').getAttribute('src');
 assert.ok(avatar.startsWith('data:image/png'),'edit portrait must use Larp image');
 assert.equal(avatar,await page.locator('#nav').getAttribute('src'),'edit portrait must exactly match navigation portrait');
 assert.equal(await page.locator('#edit').getAttribute('srcset'),null);
 await page.evaluate(async()=>{document.querySelector('#edit').src='real-again.png';await updateAvatar();});
 assert.equal(await page.locator('#edit').getAttribute('src'),avatar,'React image updates must be replaced again');
 assert.equal(await page.locator('#presence-before').getAttribute('src'),'presence-before.png');
 assert.equal(await page.locator('#presence').getAttribute('src'),'presence.png','native indicators stay untouched');
 await page.evaluate(()=>LarpbloxAvatarSurfaces.update({active:false}));
 assert.equal(await page.locator('#edit').getAttribute('src'),'real-again.png','disabling restores latest native picture');
 await page.close();
 }
 console.log('PASS: Edit Profile uses the same Larp headshot as navigation, survives native updates, and leaves indicators untouched.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
