const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<a id="action" href="/users/456/profile">View Profile<img src="profile-icon.svg"></a><a id="name" href="/users/456/profile">Real Name</a>'}));
  await page.goto('https://www.roblox.com/home');
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
  assert.equal(await page.evaluate(()=>LarpbloxAvatarSurfaces.ownImage(document.querySelector('#action img'),'456')),false,'profile action icon is not an avatar');
  await page.evaluate(()=>{
   window.LarpbloxAvatarSurfaces={createForPeer:()=>({update(){}})};
   window.LarpbloxGameBridge={validateSnapshot(){}};
   window.LarpbloxExtension={sendMessage:async()=>({ok:true,data:{players:[{userId:'456',verified:true,name:{enabled:true,username:'Alias',displayName:'Alias'},snapshot:{definition:{}}}]}})};
  });
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-verification.js')});
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-shared-users.js')});
  await page.evaluate(()=>{LarpbloxVerification.update({mode:true,userId:'123'});LarpbloxSharedUsers.update({mode:true,userId:'123'});});
  await page.waitForFunction(()=>document.querySelector('#name').textContent==='Alias');
  assert.equal(await page.locator('#action').innerText(),'View Profile');
  assert.equal(await page.locator('#action img').getAttribute('src'),'profile-icon.svg');
  assert.equal(await page.locator('#action .larpblox-verified-badge').count(),0,'profile action does not receive an identity badge');
  console.log('PASS: View Profile label and native icon remain intact while friend identity is customized.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
