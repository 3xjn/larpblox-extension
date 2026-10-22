const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {localNames, changeUsername} = require('../larpbux.js');
const {validateNames} = require('../larpbux-game-bridge.js');

const names = {username:'Pilot_7', displayName:'Captain Seven'};
assert.deepEqual(localNames(names), names);
assert.equal(changeUsername({names,balance:2000},'NewPilot').names.displayName, names.displayName);
for (const displayName of ['', '\n', 'a\u0000b', 'x'.repeat(51), {}]) assert.throws(() => localNames({...names,displayName}));
assert.equal(validateNames({version:1,userId:'123',enabled:true,name:names.username,displayName:names.displayName},'123').displayName,names.displayName);
assert.throws(() => validateNames({version:1,userId:'123',enabled:true,name:names.username,displayName:'a\u0000b'},'123'));

(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**',route => route.fulfill({contentType:'text/html',body:'<meta name="user-data" data-name="RealUser" data-displayname="Real Display"><h1 class="profile-header-title">Real Display</h1><span class="profile-header-username">@RealUser</span>'}));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.evaluate(() => {
      window.LarpbloxGameBridge={validateSnapshot:value=>value};
      window.LarpbloxAvatarSurfaces={createForPeer:()=>({update(){}})};
      window.chrome={runtime:{sendMessage:async message=>{
        if(message.type==='larpblox-publish-profile') window.published=message.record;
        return {ok:true,data:{players:window.published ? [window.published] : []}};
      }}};
    });
    await page.addScriptTag({path:path.join(__dirname,'../larpbux-shared-users.js')});
    await page.evaluate(names => LarpbloxSharedUsers.publishProfile({userId:'123',active:true,names,loadSnapshot:async()=>({version:1,userId:'123',definition:{assets:[]},items:[]})}),names);
    await page.waitForFunction(()=>window.published);
    assert.deepEqual(await page.evaluate(()=>window.published.name),{enabled:true,...names});
    await page.evaluate(()=>LarpbloxSharedUsers.update({userId:'456',mode:true}));
    await page.waitForFunction(()=>document.querySelector('h1').textContent==='Captain Seven');
    assert.equal(await page.locator('.profile-header-username').textContent(),'@Pilot_7');
    await page.evaluate(()=>LarpbloxSharedUsers.update({userId:'456',mode:false}));
    await page.waitForFunction(()=>document.querySelector('h1').textContent==='Real Display');
    assert.equal(await page.locator('.profile-header-username').textContent(),'@RealUser');
    console.log('PASS: separate display names validate, survive username changes, publish to peers, and restore correctly.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
