const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;
let sharedSource = fs.readFileSync(path.join(__dirname, '../larpbux-shared-users.js'), 'utf8');
if (process.env.REPRO_OLD_CARD_NAMES) sharedSource = sharedSource.replace('roots.push(...card.querySelectorAll(cardNameSelector))', "roots.push(...card.querySelectorAll('.avatar-name,.avatar-card-label'))");
const avatarSource = fs.readFileSync(path.join(__dirname, '../larpbux-avatar-surfaces.js'), 'utf8');
const identitySource = fs.readFileSync(path.join(__dirname, '../identity-gate.js'), 'utf8');
const styleSource = fs.readFileSync(path.join(__dirname, '../larpbux.css'), 'utf8');

const peers = [
  {id: '2290829441', native: 'LmaoImTheBest1', display: 'Larp qos', username: 'qos'},
  {id: '2290829442', native: 'GoldLikaTroll', display: 'Larp Gold', username: 'gold'},
];
const image = 'data:image/png;base64,peer-render';
const fixture = () => `<meta name="user-data" data-userid="999"><main><section class="friends-carousel-container" aria-label="Friends"><div class="friends-carousel-list-container">${peers.map(peer => `
  <div class="friends-carousel-tile"><div class="friend-tile-content">
    <div class="avatar avatar-card-fullbody" data-testid="avatar-card-container">
      <a class="avatar-card-link" data-testid="avatar-card-link" href="/users/${peer.id}/profile"><img class="avatar-card-image" style="width:48px;height:48px;border-radius:50%" src="native-${peer.id}.png"></a>
      <div class="avatar-status"><img class="presence-icon" data-presence="online" src="status-${peer.id}.png"></div>
    </div>
    <${peer.id === '2290829441' ? 'a href="/users/2290829441/profile"' : 'div'} class="friends-carousel-tile-labels" data-testid="friends-carousel-tile-labels"><div class="friends-carousel-tile-label"><div class="friends-carousel-tile-name"><span class="friends-carousel-display-name">${peer.native}</span></div></div><div class="friends-carousel-tile-sublabel"><div class="friends-carousel-tile-experience">Playing</div></div></${peer.id === '2290829441' ? 'a' : 'div'}>
  </div></div>`).join('')}</div></section></main>`;

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    const errors=[];
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(6000);
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType: 'text/html', body: `<!doctype html><html><body>${fixture()}</body></html>`}));
    await page.addInitScript(({peers, image}) => {
      localStorage.setItem('larpblox-cosmetics-v1:999', JSON.stringify({mode: false}));
      window.__relay = [];
      window.__relayGate = new Promise(resolve => { window.__releaseRelay = resolve; });
      window.LarpbloxGameBridge = {validateSnapshot(value) { return value; }};
      window.LarpbloxAvatarRequests = {
        cached() { return image; },
        definitionKey(value) { return JSON.stringify(value); },
        async render() { return image; },
      };
      window.LarpbloxAvatar3D = {
        async create(host) {
          await new Promise(resolve => setTimeout(resolve, 120));
          const canvas = document.createElement('canvas'); host.append(canvas);
          return {capture() { return image; }, dispose() {}};
        },
      };
      window.LarpbloxExtension = {sendMessage: async message => {
        if (message.type !== 'larpblox-shared-users') return {ok: true};
        window.__relay.push(message.userIds);
        await window.__relayGate;
        return {ok: true, data: {players: message.userIds.map(id => {
          const peer = peers.find(item => item.id === String(id));
          return {version: 1, userId: peer.id, name: {enabled: true, username: peer.username, displayName: peer.display}, imageUrl: image,
            snapshot: {version: 1, userId: peer.id, definition: {assets: []}, items: []}};
        })}};
      }};
    }, {peers, image});
    await page.goto('https://www.roblox.com/home');
    await page.addStyleTag({content: styleSource});
    await page.addScriptTag({content: identitySource});
    await page.addScriptTag({content: avatarSource});
    await page.addScriptTag({content: sharedSource});
    assert.equal(await page.locator('.friends-carousel-display-name').first().evaluate(node=>getComputedStyle(node).visibility),'hidden');
    assert.equal(await page.locator('.avatar-card-image').first().evaluate(node=>getComputedStyle(node).visibility),'hidden');
    await page.evaluate(() => { LarpbloxSharedUsers.update({userId: '999', mode: false}); });
    await page.waitForFunction(() => window.__relay.length === 1);
    for (const peer of peers) {
      const card = page.locator(`.friends-carousel-tile:has(a[href="/users/${peer.id}/profile"])`);
      assert.equal(await card.locator('.friends-carousel-display-name').evaluate(node => getComputedStyle(node).visibility), 'hidden');
      assert.equal(await card.locator('.avatar-card-image').evaluate(node => getComputedStyle(node).visibility), 'hidden');
    }
    await page.evaluate(() => window.__releaseRelay());
    for (const peer of peers) {
      const card = page.locator(`.friends-carousel-tile:has(a[href="/users/${peer.id}/profile"])`);
      await card.locator('.friends-carousel-display-name').waitFor({state: 'visible'});
      assert.equal(await card.locator('.friends-carousel-display-name').textContent(), peer.display);
      await card.locator('.avatar-card-image').waitFor({state:'visible'});
      assert.equal(await card.locator('.avatar-card-image').getAttribute('src'), image);
      assert.equal(await card.locator('.presence-icon').getAttribute('src'), `status-${peer.id}.png`);
    }
    await page.evaluate(() => { const root = document.querySelector('.friends-carousel-list-container'); root.insertAdjacentHTML('beforeend', `<div class="friends-carousel-tile"><div class="friend-tile-content"><div class="avatar avatar-card-fullbody"><a class="avatar-card-link" href="/users/2290829442/profile"><img class="avatar-card-image" style="width:48px;height:48px;border-radius:50%" src="rerender.png"></a></div><a class="friends-carousel-tile-labels" href="/users/2290829442/profile"><span class="friends-carousel-display-name">Native Again</span></a></div></div>`); });
    await page.waitForFunction(() => [...document.querySelectorAll('.friends-carousel-display-name')].filter(n => n.textContent === 'Larp Gold').length === 2);
    await page.goto('https://www.roblox.com/users/999/profile');
    await page.addStyleTag({content: styleSource});
    await page.addScriptTag({content: identitySource});
    await page.addScriptTag({content: avatarSource});
    await page.addScriptTag({content: sharedSource});
    await page.evaluate(() => { window.__relayGate = new Promise(resolve => { window.__releaseRelay = resolve; }); window.LarpbloxSharedUsers.update({userId: '999', mode: false}); });
    await page.waitForFunction(() => window.__relay.length === 1);
    await page.evaluate(() => window.__releaseRelay());
    await page.waitForFunction(() => document.querySelector('.friends-carousel-display-name')?.textContent === 'Larp qos');
    await page.evaluate(() => window.LarpbloxSharedUsers.update({userId: null, mode: false}));
    await page.waitForFunction(() => document.querySelector('.friends-carousel-display-name')?.textContent === 'LmaoImTheBest1');
    assert.equal(await page.locator('.avatar-card-image').first().getAttribute('src'), 'native-2290829441.png');
    await page.evaluate(()=>{
      history.pushState({},'', '/users/999/friends');
      document.querySelector('main').innerHTML='<ul><li class="list-item avatar-card"><div class="avatar-card-container"><div class="avatar-card-content"><div class="avatar avatar-card-fullbody"><a class="avatar-card-link" href="/users/2290829441/profile"><div class="avatar-card-image"><img src="native-list.png"></div></a><div class="avatar-status"><img id="list-status" src="status.png"></div></div><div class="avatar-card-caption"><div class="avatar-name-container"><a class="avatar-name" href="/users/2290829441/profile">LmaoImTheBest1</a></div><div class="avatar-card-label">@LmaoImTheBest1</div></div></div></div></li></ul>';
      window.__relayGate=new Promise(resolve=>window.__releaseRelay=resolve);
      LarpbloxSharedUsers.update({userId:'999',mode:false});
    });
    assert.equal(await page.locator('.avatar-card-image img').evaluate(n=>getComputedStyle(n).visibility),'hidden');
    await page.evaluate(()=>window.__releaseRelay());
    await page.waitForFunction(()=>document.querySelector('.avatar-name').textContent==='Larp qos'&&document.querySelector('.avatar-card-label').textContent==='@qos');
    await page.locator('.avatar-card-image img').waitFor({state:'visible'});
    assert.equal(await page.locator('#list-status').getAttribute('src'),'status.png');
    assert.deepEqual(errors,[], 'the complete identity stack must not throw on Home');
    console.log('PASS: exact native FriendsCarousel cards gate peer identity before relay, replace both names and avatars after delayed render, preserve status, repair rerenders on home/profile, and restore native mode.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
