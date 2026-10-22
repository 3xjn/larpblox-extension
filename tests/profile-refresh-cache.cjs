const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1');
const extensionRoot = process.env.EXTENSION_ROOT || path.join(__dirname, '..');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:`
      <div class="user-profile-header-details-avatar-container"><img id="portrait" src="native.png"></div>
      <div class="currently-wearing-avatar-with-background"><div class="profile-avatar-left"><img id="banner" src="native.png"><canvas id="native-canvas"></canvas></div></div>
      <div class="profile-avatar-left" id="blank-banner"><img src="native.png"></div>`}));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.addStyleTag({path:path.join(extensionRoot, 'larpbux.css')});
    await page.evaluate(() => {
      document.documentElement.dataset.larpbloxIdentityChecked = 'true';
      document.documentElement.dataset.larpbloxIdentityOwnProfile = 'true';
      document.documentElement.dataset.larpbloxIdentityAvatar = 'true';
      localStorage.setItem('larpblox-profile-pictures:123', JSON.stringify({version:8, key:'old-outfit', expires:Date.now()+60000, result:{headshot:'data:image/png;base64,old-head', fullBody:'data:image/png;base64,old-body', transparentBody:'data:image/png;base64,old-body'}}));
      const flat = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
      window.resolveFresh = null;
      window.LarpbloxAvatarRequests = {definitionKey: JSON.stringify, render: async (definition, userId, signal, type) => {
        if (type === '2d') return flat;
        await new Promise(resolve => window.resolveFresh = resolve);
        return 'new-descriptor';
      }};
      window.LarpbloxAvatar3D = {create: async (host, descriptor, options) => { const canvas = document.createElement('canvas'); host.append(canvas); return {capture: type => `data:image/png;base64,new-${type}`, getBackgroundUrl: () => 'data:image/png;base64,new-background', getBackgroundAspect: () => 2, dispose() {}}; }};
    });
    await page.addScriptTag({path:path.join(extensionRoot, 'larpbux-avatar-surfaces.js')});
    await page.evaluate(() => { void LarpbloxAvatarSurfaces.update({userId:'123', active:true, signature:'new-outfit', loadDefinition:async()=>({assets:[{id:1055299}]})}); });
    await page.waitForFunction(() => document.querySelector('#portrait').src === 'data:image/png;base64,old-head');
    await page.evaluate(() => window.resolveFresh());
    await page.waitForFunction(() => document.querySelector('#portrait').src === 'data:image/png;base64,new-headshot');
    assert.equal(await page.locator('#banner').getAttribute('src'), 'data:image/png;base64,new-fullBody');
    assert.equal(await page.locator('#native-canvas').evaluate(el => getComputedStyle(el).visibility), 'hidden');
    assert.equal(await page.locator('.profile-avatar-left canvas.larpblox-own-avatar-canvas').count(), 2);
    assert.equal(await page.locator('#banner').locator('..').locator('canvas.larpblox-own-avatar-canvas').evaluate(el => getComputedStyle(el).visibility), 'visible');
    assert.equal(await page.locator('#blank-banner canvas.larpblox-own-avatar-canvas').count(), 1, 'blank banners still receive a fresh render');
    console.log('PASS: stale cached portraits are replaced in headshot and banner while native canvas remains hidden and the rendered canvas is visible.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
