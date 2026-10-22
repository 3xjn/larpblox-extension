const assert = require('node:assert/strict');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;

(async()=>{
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:`
      <div class="user-profile-header-details-avatar-container"><span class="avatar-card-image"><img id="portrait" src="native.png"></span></div>
      <div class="profile-avatar-left"><span class="avatar-card-image"><img id="banner" src="native.png"></span></div>`}));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.evaluate(() => {
      const definition = {assets:[{id:808}]};
      const headshot = 'data:image/png;base64,headshot';
      const fullBody = 'data:image/png;base64,fullbody';
      localStorage.setItem('larpblox-profile-pictures:123', JSON.stringify({version:3, key:JSON.stringify(definition), expires:Date.now()+60000, result:{headshot,fullBody,transparentBody:fullBody}}));
      window.LarpbloxAvatarRequests = {definitionKey: JSON.stringify, render: async () => { throw Object.assign(new Error('rate limited'), {retryAfter:120}); }};
    });
    await page.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
    await page.evaluate(() => LarpbloxAvatarSurfaces.update({userId:'123', active:true, signature:'headshot-surface', loadDefinition:async()=>({assets:[{id:808}]})}));
    await page.waitForFunction(() => document.querySelector('#portrait').src === 'data:image/png;base64,headshot');
    assert.equal(await page.locator('#banner').getAttribute('src'), 'data:image/png;base64,fullbody');
    const cold = await browser.newPage();
    await cold.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:`
      <div class="user-profile-header-details-avatar-container"><img id="portrait" src="native.png"></div>
      <div class="profile-avatar-left"><img id="banner" src="native.png"></div>`}));
    await cold.goto('https://www.roblox.com/users/123/profile');
    await cold.evaluate(() => {
      const flat = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
      window.LarpbloxAvatarRequests = {cached: () => flat, render: async () => { throw Object.assign(new Error('rate limited'), {retryAfter:120}); }};
    });
    await cold.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
    await cold.evaluate(() => LarpbloxAvatarSurfaces.update({userId:'123', active:true, signature:'flat-fallback', loadDefinition:async()=>({assets:[{id:808}]})}));
    await cold.waitForFunction(() => document.querySelector('#banner').src.startsWith('data:image/png;base64,'), null, {timeout:5000});
    assert.ok(await cold.locator('#portrait').evaluate(el=>el.src.endsWith('/native.png')), 'flat full-body fallback must not replace the headshot');
    assert.equal(await cold.evaluate(() => localStorage.getItem('larpblox-profile-pictures:123')), null, 'flat fallback must not be persisted as a headshot cache');
    await cold.close();
    const peer = await browser.newPage();
    await peer.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:`
      <div class="user-profile-header-details-avatar-container"><img id="peer-portrait" src="native.png"></div>
      <div class="profile-avatar-left"><img id="peer-banner" src="native.png"></div>`}));
    await peer.goto('https://www.roblox.com/users/123/profile');
    await peer.evaluate(() => {
      window.LarpbloxAvatarRequests = {render: async () => 'descriptor'};
      window.LarpbloxAvatar3D = {create: async () => ({capture: type => type === 'headshot' ? 'data:image/png;base64,peer-headshot' : 'data:image/png;base64,peer-body', dispose(){}})};
    });
    await peer.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
    await peer.evaluate(() => LarpbloxAvatarSurfaces.createForPeer().update({userId:'123', active:true, signature:'peer', imageUrl:'data:image/png;base64,peer', loadDefinition:async()=>({assets:[{id:808}]})}));
    await peer.waitForFunction(() => document.querySelector('#peer-portrait').src === 'data:image/png;base64,peer-headshot');
    assert.equal(await peer.locator('#peer-banner').getAttribute('src'), 'data:image/png;base64,peer-body');
    await peer.close();
    console.log('PASS: genuine headshots win, flat full-body fallback preserves native portraits and is not cached, and peer surfaces use their supplied image.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
