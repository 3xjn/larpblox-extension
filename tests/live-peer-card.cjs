const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;
const root = path.join(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');
(async () => {
  const live = process.env.LARPBLOX_PEER_CAPTURE ? JSON.parse(fs.readFileSync(process.env.LARPBLOX_PEER_CAPTURE, 'utf8').replace(/^\uFEFF/,'' )).presence : await (await fetch('https://larp.3xjn.dev/v1/players?userIds=2290829441')).json();
  const record = live.players[0];
  assert.ok(record?.name?.enabled, 'live peer must be sharing a display name');
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:`<!doctype html><html><body><meta name="user-data" data-userid="999"><div class="friends-carousel-tile"><a class="avatar-card-link" href="/users/${record.userId}/profile"><div class="avatar-card-image"><img src="native.png"></div></a><div class="friends-carousel-tile-labels"><span class="friends-carousel-display-name">LmaoImTheBest1</span></div><div class="avatar-status"><img src="status.png"></div></div></body></html>`}));
    await page.addInitScript(({record}) => {
      window.LarpbloxGameBridge = undefined;
      window.__release = null; window.__gate = new Promise(resolve => { window.__release = resolve; });
      window.LarpbloxExtension = {sendMessage: async message => message.type === 'larpblox-shared-users' ? (await window.__gate, {ok:true, data:{players:[record]}}) : ({ok:true})};
      window.LarpbloxAvatarSurfaces = {createForPeer: () => ({update(options) { if (!options.active) return; const image = document.querySelector('.avatar-card-image img'); image.src = options.imageUrl; image.dataset.larpbloxPeerAvatar = options.imageUrl; }, reset() {}})};
    }, {record});
    await page.goto('https://www.roblox.com/home');
    await page.addStyleTag({content:source('larpbux.css')});
    await page.addScriptTag({content:source('larpbux-game-bridge.js')});
    await page.addScriptTag({content:source('larpbux-verification.js')});
    await page.addScriptTag({content:source('larpbux-names.js')});
    await page.addScriptTag({content:source('identity-gate.js')});
    await page.addScriptTag({content:source('larpbux-shared-users.js')});
    await page.evaluate(() => LarpbloxSharedUsers.update({userId:'999', mode:false}));
    assert.equal(await page.locator('.friends-carousel-display-name').evaluate(node => getComputedStyle(node).visibility), 'hidden');
    await page.evaluate(() => window.__release());
    await page.waitForFunction(name => document.querySelector('.friends-carousel-display-name')?.textContent === name, record.name.displayName);
    assert.equal(await page.locator('.friends-carousel-display-name').textContent(), record.name.displayName);
    assert.equal(await page.locator('.avatar-card-image img').getAttribute('src'), record.imageUrl);
    assert.equal(await page.locator('.avatar-status img').getAttribute('src'), 'status.png');
    console.log(`PASS: live peer ${record.userId} validates through the real bridge and replaces the native card name with ${record.name.displayName}.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
