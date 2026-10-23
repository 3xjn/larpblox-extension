const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;
const sharedSource = fs.readFileSync(path.join(__dirname, '../larpbux-shared-users.js'), 'utf8');
const avatarSource = fs.readFileSync(path.join(__dirname, '../larpbux-avatar-surfaces.js'), 'utf8');

const peerId = '123';
const peerImage = 'https://cdn.example.test/larp-peer.png';
const peerRecord = id => ({
  version: 1,
  userId: String(id),
  name: {enabled: true, username: String(id) === peerId ? 'lmaoImTheBest' : `friend_${id}`, displayName: String(id) === peerId ? 'Lmao The Best' : `Larp Friend ${id}`},
  imageUrl: String(id) === peerId ? peerImage : `https://cdn.example.test/larp-${id}.png`,
  snapshot: {version: 1, userId: String(id), definition: {assets: []}, items: []},
});

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(4000);
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><body>
        <section class="friends-carousel-container" aria-label="Friends">
          <a id="friend-card" data-user-id="${peerId}" href="#">
            <span class="avatar"><img id="friend-avatar" src="native-avatar.png" alt="Native friend avatar"></span>
            <span id="friend-name" class="friend-name">Native Friend Name</span>
            <img id="friend-status" class="presence-icon" data-presence="online" aria-label="Online" src="native-status.png">
          </a>
        </section>
      </body></html>`,
    }));
    await page.addInitScript(() => {
      window.__sharedCalls = [];
      const makeRecord = id => ({version: 1, userId: String(id),
        name: {enabled: true, username: String(id) === '123' ? 'lmaoImTheBest' : `friend_${id}`, displayName: String(id) === '123' ? 'Lmao The Best' : `Larp Friend ${id}`},
        imageUrl: String(id) === '123' ? 'https://cdn.example.test/larp-peer.png' : `https://cdn.example.test/larp-${id}.png`,
        snapshot: {version: 1, userId: String(id), definition: {assets: []}, items: []}});
      window.LarpbloxGameBridge = {validateSnapshot(value) { return value; }};
      window.LarpbloxExtension = {sendMessage: async message => {
        if (message.type === 'larpblox-shared-users') {
          window.__sharedCalls.push(message.userIds);
          return {ok: true, data: {players: message.userIds.map(String).map(makeRecord)}};
        }
        return {ok: true};
      }};
    });
    await page.goto('https://www.roblox.com/home');
    await page.addScriptTag({content: avatarSource});
    await page.addScriptTag({content: sharedSource});

    await page.evaluate(() => LarpbloxSharedUsers.update({userId: '999', mode: true}));
    await page.waitForFunction(() => document.querySelector('#friend-name').textContent === 'Lmao The Best', null, {timeout: 4000});
    await page.waitForFunction(() => document.querySelector('#friend-avatar').getAttribute('src') === 'https://cdn.example.test/larp-peer.png', null, {timeout: 4000});
    assert.ok((await page.evaluate(() => window.__sharedCalls)).some(ids => ids.includes(peerId)), 'relay should receive the carousel card user ID');
    assert.equal(await page.locator('#friend-name').textContent(), 'Lmao The Best');
    assert.equal(await page.locator('#friend-avatar').getAttribute('src'), peerImage);
    assert.equal(await page.locator('#friend-status').getAttribute('data-presence'), 'online');
    assert.equal(await page.locator('#friend-status').getAttribute('aria-label'), 'Online');
    assert.equal(await page.locator('#friend-status').getAttribute('src'), 'native-status.png');

    await page.evaluate(() => {
      const root = document.querySelector('.friends-carousel-container');
      const addCard = (id, label = 'Native Friend Name') => {
        const card = document.createElement('a');
        card.className = 'friend-card'; card.dataset.userId = String(id); card.href = '#';
        card.innerHTML = `<span class="avatar"><img class="friend-avatar" src="native-${id}.png"></span><span class="friend-name">${label}</span>`;
        root.append(card);
      };
      for (let id = 2000; id < 2055; id++) addCard(id);
      addCard(2060);
      const first = document.querySelector('#friend-card');
      first.dataset.userId = '2061';
    });
    await page.waitForTimeout(1400);
    await page.waitForFunction(() => document.querySelector('[data-user-id="2000"] .friend-name')?.textContent === 'Larp Friend 2000', null, {timeout: 4000});
    await page.waitForFunction(() => document.querySelector('[data-user-id="2060"] .friend-name')?.textContent === 'Larp Friend 2060', null, {timeout: 4000});
    await page.waitForFunction(() => document.querySelector('#friend-card .friend-name')?.textContent === 'Larp Friend 2061', null, {timeout: 4000});
    assert.equal(await page.locator('[data-user-id="2000"] .friend-avatar').getAttribute('src'), 'https://cdn.example.test/larp-2000.png');
    assert.equal(await page.locator('[data-user-id="2060"] .friend-avatar').getAttribute('src'), 'https://cdn.example.test/larp-2060.png');
    assert.equal(await page.locator('#friend-avatar').getAttribute('src'), 'https://cdn.example.test/larp-2061.png');
    assert.equal(await page.locator('#friend-status').getAttribute('src'), 'native-status.png');
    const calls = await page.evaluate(() => window.__sharedCalls);
    assert.ok(calls.length >= 3, `expected initial and batched follow-up relay calls, got ${calls.length}`);
    assert.ok(calls.every(ids => ids.length <= 50), 'each relay request must stay within the 50-user limit');
    const requested = new Set(calls.flat());
    for (const id of ['2000', '2054', '2060', '2061']) assert.ok(requested.has(id), `relay should receive ${id}`);
    console.log('PASS: carousel peers replace names/avatars, late and retargeted cards refresh, relay batches stay <=50, and native presence imagery remains unchanged.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
