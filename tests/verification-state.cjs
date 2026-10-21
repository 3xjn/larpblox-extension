const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

const source = path.join(__dirname, '../larpbux.js');
const bridge = path.join(__dirname, '../larpbux-game-bridge.js');
const verification = path.join(__dirname, '../larpbux-verification.js');
const verificationCss = path.join(__dirname, '../larpbux-verification.css');
const initial = {
  version: 1,
  mode: true,
  balance: 2222,
  names: {username: 'LarpTester'},
  sharing: true,
  items: [{itemType: 'Asset', id: 9001, name: 'Larp Hat', assetType: 8, price: 100, quantity: 1}],
  equipped: ['Asset:9001']
};

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><head><meta name="user-data" data-userid="123"></head><body>
        <nav><a id="nav-own" href="/users/123/profile">Real name</a></nav>
        <div id="profile-header-title-container-name">Real name</div>
      </body></html>`
    }));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.evaluate(value => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify(value)), initial);

    async function install() {
      await page.evaluate(() => {
        window.bridgeMessages = [];
        window.LarpbloxExtension = {
          onMessage: {addListener(listener) { window.larpbloxMessage = listener; }},
          sendMessage(message) { window.bridgeMessages.push(message); return Promise.resolve({ok: true, data: {connected: false}}); },
          getManifest() { return {version: 'test'}; }
        };
        window.LarpbloxAppearance = {get: () => 'modern', set() {}};
        window.LarpbloxAvatarRequests = {render: async () => null};
      });
      await page.addStyleTag({path: verificationCss});
      await page.addScriptTag({path: verification});
      await page.addScriptTag({path: bridge});
      await page.addScriptTag({path: source});
      await page.waitForFunction(() => typeof window.larpbloxMessage === 'function');
    }
    await install();

    const message = value => page.evaluate(value => new Promise(resolve => window.larpbloxMessage(value, {}, resolve)), value);
    const state = () => message({type: 'larpblox-popup-get-state'});
    const first = await state();
    assert.equal(first.ok, true);
    assert.equal(first.verified, false, 'verification defaults off for existing saved state');

    const enabled = await message({type: 'larpblox-popup-update', verified: true});
    assert.equal(enabled.ok, true);
    assert.equal(enabled.verified, true);
    assert.equal(enabled.balance, initial.balance);
    assert.equal(enabled.username, initial.names.username);
    await page.waitForFunction(() => document.querySelectorAll('.larpblox-verified-badge').length === 2);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.equal(saved.verified, true);
    assert.equal(saved.balance, initial.balance);
    assert.deepEqual(saved.equipped, initial.equipped);
    assert.deepEqual(saved.names, initial.names);

    await page.reload();
    await install();
    const reloaded = await state();
    assert.equal(reloaded.verified, true, 'verified setting survives page reload');
    assert.equal(await page.locator('.larpblox-verified-badge').count(), 2);

    const invalid = await message({type: 'larpblox-popup-update', verified: 'true'});
    assert.equal(invalid.ok, false);
    assert.match(invalid.error, /valid verification setting/i);
    assert.equal((await state()).verified, true);

    const disabled = await message({type: 'larpblox-popup-update', mode: false});
    assert.equal(disabled.ok, true);
    assert.equal(disabled.verified, true, 'saved preference remains while mode is off');
    await page.waitForFunction(() => document.querySelectorAll('.larpblox-verified-badge').length === 0);
    await page.waitForFunction(() => bridgeMessages.some(message => message.action === 'publishNames' && message.names?.verified === false));
    const lastNames = await page.evaluate(() => bridgeMessages.filter(message => message.action === 'publishNames').at(-1).names);
    assert.equal(lastNames.enabled, false);
    assert.equal(lastNames.verified, false);
    assert.equal(lastNames.name, initial.names.username);
    console.log('PASS: popup verification state defaults, persists, preserves cosmetics, rejects invalid values, and disables publication/badges with Larp mode.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
