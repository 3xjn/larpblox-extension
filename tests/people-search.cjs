const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage();
  await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:'<style>.player-search-results-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:940px}.native-card{height:180px}</style><main><h1>People Results</h1><div id="react-player-search-web-app"><div class="player-search-results-grid" data-testid="player-search-results"><article class="native-card"><a href="/users/999/profile">Alias</a></article></div></div></main>'}));
  await page.goto('https://www.roblox.com/search/users?keyword=Alias');
  await page.evaluate(() => {
   window.savedNativeCard=document.querySelector('.native-card');window.savedNativeCard.remove();
   window.testRecords=[{userId:'123',name:{enabled:true,username:'Alias',displayName:'Alias'},verified:true,snapshot:{definition:{},items:[]}}, {userId:'456',name:{enabled:true,username:'Alias2',displayName:'Alias2'},verified:false,snapshot:{definition:{},items:[]}}];
   window.chrome={runtime:{sendMessage:async message=>({ok:true,data:{players:message.type==='larpblox-search-users'?window.testRecords:[]}})}};
   window.LarpbloxGameBridge={validateSnapshot:()=>{}};
   window.LarpbloxAvatarSurfaces={createForPeer:()=>({update:()=>{}})};
  });
  await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});
  await page.addStyleTag({path:path.join(__dirname,'../larpbux-verification.css')});
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-verification.js')});
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-shared-users.js')});
  await page.evaluate(()=>{LarpbloxVerification.update({mode:true,userId:'123',verified:true});LarpbloxSharedUsers.update({mode:true,userId:'123'});});
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#larpblox-people-results').count(),0, 'Larp cards wait while native results are still loading');
  await page.evaluate(()=>{document.querySelector('.player-search-results-grid').append(window.savedNativeCard);LarpbloxSharedUsers.update({mode:true,userId:'123'});});
  await page.waitForSelector('#larpblox-people-results .larpblox-verified-badge', {timeout:2000});
  assert.equal(await page.locator('.larpblox-person-card').count(),2);
  // Measured on Roblox_RTC's native search card: badge 28x28, name gap 2px.
  const badgeSize = await page.locator('.larpblox-person-card .larpblox-verified-badge').evaluate(node => {
    const rect=node.getBoundingClientRect(), image=node.querySelector('img').getBoundingClientRect();
    return {width:rect.width,height:rect.height,imageWidth:image.width,imageHeight:image.height,gap:getComputedStyle(node.parentElement).columnGap};
  });
  assert.deepEqual(badgeSize,{width:28,height:28,imageWidth:28,imageHeight:28,gap:'2px'}, 'Larp badge matches native Roblox search dimensions and spacing');
  assert.equal(await page.locator('.player-search-results-grid > #larpblox-people-results:first-child').count(),1, 'Larp cards belong inside the native grid');
  const boxes=await page.locator('.larpblox-person-card, .native-card').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width};}));
  assert.ok(boxes.every(box=>Math.abs(box.width-boxes[0].width)<2), 'Larp and real cards have the same column width');
  assert.ok(boxes.every(box=>Math.abs(box.y-boxes[0].y)<2), 'Larp and real cards share the first row');
  assert.ok(boxes[0].x < boxes[1].x && boxes[1].x < boxes[2].x, 'Larp cards push real players to the next slots');
  assert.equal(await page.locator('.larpblox-person-card').first().locator('.display-name').getAttribute('href'),'https://www.roblox.com/users/123/profile');
  assert.equal(await page.locator('.larpblox-person-card').nth(1).locator('.larpblox-verified-badge').count(),0);
  await page.evaluate(()=>{history.pushState({},'', '/search/users?keyword=Other');window.testRecords=[];LarpbloxSharedUsers.update({mode:true,userId:'123'});});
  await page.waitForFunction(()=>!document.getElementById('larpblox-people-results'));
  assert.equal(await page.locator('.player-search-results-grid a').textContent(),'Alias');
  await page.evaluate(()=>LarpbloxSharedUsers.update({mode:false,userId:'123'}));
  console.log('PASS: Larp search priority, own/peer profiles, badge setting, profile links, and changed-query cleanup');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});


