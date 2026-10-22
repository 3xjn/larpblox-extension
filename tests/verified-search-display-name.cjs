const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const page=await browser.newPage();
 await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-name="RealUser" data-displayname="Real Display"><main><div class="player-search-results-grid"><article>Native result</article></div></main>'}));
 await page.goto('https://www.roblox.com/search/users?keyword=Pilot_7');
 await page.evaluate(()=>{
 const record={userId:'123',name:{enabled:true,username:'Pilot_7',displayName:'Captain Seven'},verified:true,snapshot:{definition:{},items:[]}};
 window.chrome={runtime:{sendMessage:async()=>({ok:true,data:{players:[record]}})}};
 window.LarpbloxGameBridge={validateSnapshot:v=>v};
 window.LarpbloxAvatarSurfaces={createForPeer:()=>({update(){}})};
 });
 for(const name of ['larpbux-names.js','larpbux-verification.js','larpbux-shared-users.js']) await page.addScriptTag({path:path.join(__dirname,'..',name)});
 await page.evaluate(()=>{LarpbloxSharedUsers.update({userId:'123',mode:true});LarpbloxVerification.update({userId:'123',mode:true,verified:true});});
 await page.waitForSelector('.larpblox-person-card .larpblox-verified-badge');
 for(let i=0;i<3;i++){
 await page.evaluate(()=>LarpbloxNames.update({userId:'123',mode:true,username:'Pilot_7',displayName:'Captain Seven'}));
 assert.equal(await page.locator('.larpblox-person-card .display-name').innerText(),'Captain Seven');
 assert.equal(await page.locator('.larpblox-person-card .username').innerText(),'@Pilot_7');
 }
 console.log('PASS: verified own search card keeps separate display name after account-name refreshes');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
