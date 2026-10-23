const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const hook = path.join(__dirname, '..', 'larpbux-body-colors.js');
(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"></main>'}));
    await page.route('https://avatar.roblox.com/**', r => r.fulfill({json:{playerAvatarType:'R15', assets:[{id:42}], scales:{height:1}}}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(() => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:true, gameLook:{definition:{playerAvatarType:{playerAvatarType:'R6'}}}})));
    const load = () => page.addScriptTag({path:hook});
    const fetchRig = () => page.evaluate(async () => (await (await fetch('https://avatar.roblox.com/v2/avatar/avatar')).json()).playerAvatarType);
    const xhrRig = (json = false) => page.evaluate(json => new Promise(resolve => {
      const xhr = new XMLHttpRequest(); xhr.open('GET', 'https://avatar.roblox.com/v1/avatar');
      if (json) xhr.responseType = 'json';
      xhr.onload = () => resolve((json ? xhr.response : JSON.parse(xhr.responseText)).playerAvatarType);
      xhr.send();
    }), json);
    await load();
    assert.equal(await fetchRig(), 'R6', 'editor bootstrap must read saved R6 before Larp UI mounts');
    assert.deepEqual(await page.evaluate(async () => await (await fetch(new Request('https://avatar.roblox.com/v2/avatar/avatar'))).json()), {playerAvatarType:'R6', assets:[{id:42}], scales:{height:1}}, 'only the rig field changes');
    assert.equal(await xhrRig(), 'R6');
    assert.equal(await xhrRig(true), 'R6');
    await page.goto('https://www.roblox.com/home');
    await load();
    assert.equal(await fetchRig(), 'R15', 'other pages keep native avatar reads');
    await page.goto('https://www.roblox.com/my/avatar'); await load();
    assert.equal(await fetchRig(), 'R6', 'returning to the editor must keep R6 selected');
    await page.reload(); await load();
    assert.equal(await xhrRig(true), 'R6', 'reload must keep R6 selected');
    await page.evaluate(() => document.querySelector('#avatar-web-app').setAttribute('data-larpbux-avatar-view', 'real'));
    assert.equal(await fetchRig(), 'R15', 'Real avatar view must read the real rig');
    assert.equal(await xhrRig(), 'R15');
    await page.evaluate(() => {document.querySelector('#avatar-web-app').removeAttribute('data-larpbux-avatar-view'); localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:false,gameLook:{definition:{playerAvatarType:{playerAvatarType:'R6'}}}}));});
    assert.equal(await fetchRig(), 'R15', 'disabled Larp mode must pass through');
    await page.evaluate(() => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:true,gameLook:{definition:{playerAvatarType:{playerAvatarType:'R15'}}}})));
    assert.equal(await fetchRig(), 'R15', 'changing saved rig must not leave an R6 cache');
    console.log('PASS: native avatar reads restore saved rig on editor entry, return and reload; real mode stays native (fetch and XHR).');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
