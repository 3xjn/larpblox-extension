const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage();
  await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:'<main><h1>People Results</h1><div class="people-list"><a href="/users/999/profile">Alias</a></div></main>'}));
  await page.goto('https://www.roblox.com/search/users?keyword=Alias');
  await page.evaluate(() => {
   window.testRecords=[{userId:'123',name:{enabled:true,username:'Alias',displayName:'Alias'},verified:true,snapshot:{definition:{},items:[]}}, {userId:'456',name:{enabled:true,username:'Alias2',displayName:'Alias2'},verified:false,snapshot:{definition:{},items:[]}}];
   window.chrome={runtime:{sendMessage:async message=>({ok:true,data:{players:message.type==='larpblox-search-users'?window.testRecords:[]}})}};
   window.LarpbloxGameBridge={validateSnapshot:()=>{}};
   window.LarpbloxAvatarSurfaces={createForPeer:()=>({update:()=>{}})};
  });
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-verification.js')});
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-shared-users.js')});
  await page.evaluate(()=>{LarpbloxVerification.update({mode:true,userId:'123',verified:true});LarpbloxSharedUsers.update({mode:true,userId:'123'});});
  await page.waitForSelector('#larpblox-people-results .larpblox-verified-badge');
  assert.equal(await page.locator('.larpblox-person-card').count(),2);
  assert.equal(await page.locator('#larpblox-people-results + .people-list').count(),1);
  assert.equal(await page.locator('.larpblox-person-card').first().locator('.display-name').getAttribute('href'),'https://www.roblox.com/users/123/profile');
  assert.equal(await page.locator('.larpblox-person-card').nth(1).locator('.larpblox-verified-badge').count(),0);
  await page.evaluate(()=>{history.pushState({},'', '/search/users?keyword=Other');window.testRecords=[];LarpbloxSharedUsers.update({mode:true,userId:'123'});});
  await page.waitForFunction(()=>!document.getElementById('larpblox-people-results'));
  assert.equal(await page.locator('.people-list a').textContent(),'Alias');
  await page.evaluate(()=>LarpbloxSharedUsers.update({mode:false,userId:'123'}));
  console.log('PASS: Larp search priority, own/peer profiles, badge setting, profile links, and changed-query cleanup');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});


