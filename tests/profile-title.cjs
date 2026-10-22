const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let playwright;
try {
  playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
} catch (_) {
  playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1');
}
const {chromium} = playwright;
const sharedSource = fs.readFileSync(process.env.SHARED_USERS_SOURCE || path.join(__dirname, '../larpbux-shared-users.js'), 'utf8');

const names = {username: 'Pilot_7', displayName: 'Captain Seven'};
const snapshot = {version: 1, userId: '123', definition: {assets: []}, items: []};

async function prepare(page, url, title, handlers) {
  page.setDefaultTimeout(4000);
  await page.exposeFunction('__publishRecord', handlers.publish);
  await page.exposeFunction('__sharedUsers', handlers.shared);
  await page.addInitScript(() => {
    window.LarpbloxGameBridge = {validateSnapshot(value) { return value; }};
    window.LarpbloxAvatarSurfaces = {createForPeer: () => ({update() {}})};
    window.chrome = {runtime: {sendMessage: async message => {
      if (message.type === 'larpblox-publish-profile') {
        await window.__publishRecord(message.record);
        return {ok: true};
      }
      if (message.type === 'larpblox-shared-users') return window.__sharedUsers(message.userIds);
      return {ok: true};
    }}};
  });
  await page.route('https://www.roblox.com/**', route => route.fulfill({
    contentType: 'text/html',
    body: `<title>${title}</title><main></main>`,
  }));
  await page.goto(`https://www.roblox.com${url}`);
  await page.addScriptTag({content: sharedSource});
}

async function main() {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const published = new Map();
  try {
    const own = await browser.newPage();
    await prepare(own, '/users/123/profile', 'Native own profile - Roblox', {
      publish: record => { published.set(String(record.userId), record); },
      shared: async userIds => ({ok: true, data: {players: userIds.map(String).filter(id => published.has(id)).map(id => published.get(id))}}),
    });
    await own.evaluate(({names, snapshot}) => {
      LarpbloxSharedUsers.update({userId: '123', mode: true, names});
      LarpbloxSharedUsers.publishProfile({userId: '123', active: true, names, loadSnapshot: async () => snapshot});
    }, {names, snapshot});
    await own.waitForFunction(() => document.title === 'Captain Seven - Roblox');
    await own.evaluate(() => { document.title = 'Roblox'; });
    await own.waitForFunction(() => document.title === 'Captain Seven - Roblox');
    await own.evaluate(() => LarpbloxSharedUsers.update({
      userId: '123', mode: true, names: {username: 'Pilot_7', displayName: 'Noah'},
    }));
    await own.waitForFunction(() => document.title === 'Noah - Roblox');

    const peer = await browser.newPage();
    await prepare(peer, '/users/123/profile', 'Native peer profile - Roblox', {
      publish: async () => {},
      shared: async userIds => ({ok: true, data: {players: userIds.map(String).filter(id => published.has(id)).map(id => published.get(id))}}),
    });
    await peer.evaluate(() => LarpbloxSharedUsers.update({userId: '999', mode: true}));
    await peer.waitForFunction(() => document.title === 'Captain Seven - Roblox');

    await peer.evaluate(() => {
      history.pushState({}, '', '/users/456/profile');
      document.title = 'Native other profile - Roblox';
      dispatchEvent(new PopStateEvent('popstate'));
    });
    await peer.waitForFunction(() => document.title === 'Native other profile - Roblox');
    await peer.evaluate(() => {
      history.pushState({}, '', '/home');
      document.title = 'Roblox home';
      dispatchEvent(new PopStateEvent('popstate'));
    });
    await peer.waitForFunction(() => document.title === 'Roblox home');
    await peer.evaluate(() => {
      history.pushState({}, '', '/users/123/profile');
      document.title = 'Roblox';
      dispatchEvent(new PopStateEvent('popstate'));
    });
    await peer.waitForFunction(() => document.title === 'Captain Seven - Roblox');

    await own.evaluate(() => {
      LarpbloxSharedUsers.update({userId: '123', mode: false});
    });
    await own.waitForFunction(() => document.title === 'Roblox');
    console.log('PASS: profile titles apply to own and shared profiles, survive Roblox rewrites, navigate safely, and restore when disabled.');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
