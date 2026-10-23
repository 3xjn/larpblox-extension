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
const identitySource = fs.readFileSync(process.env.IDENTITY_GATE_SOURCE || path.join(__dirname, '../identity-gate.js'), 'utf8');
const sharedSource = fs.readFileSync(path.join(__dirname, '../larpbux-shared-users.js'), 'utf8');

const cases = [
  {
    name: 'own cached title',
    storage: {own: {mode: true, names: {username: 'Noah', displayName: 'Noah'}}},
    expected: 'Noah - Roblox',
  },
  {
    name: 'peer cached title',
    storage: {peer: {displayName: 'Captain Seven', expires: Date.now() + 60_000}},
    expected: 'Captain Seven - Roblox',
  },
  {
    name: 'own title mode off',
    storage: {own: {mode: false, names: {username: 'Noah', displayName: 'Noah'}}},
    expected: 'Native profile - Roblox',
  },
  {
    name: 'expired peer title',
    storage: {peer: {displayName: 'Captain Seven', expires: Date.now() - 1}},
    expected: 'Roblox',
  },
  {name: 'uncached profile title', storage: {}, expected: 'Roblox'},
];

async function runCase(browser, testCase) {
  const context = await browser.newContext();
  const seed = JSON.stringify(testCase.storage);
  await context.addInitScript({content: `
    (() => {
      const storage = ${seed};
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify(storage.own || null));
      localStorage.setItem('larpblox-profile-title:123', JSON.stringify(storage.peer || null));
      window.__titleAtDOMContentLoaded = undefined;
      document.addEventListener('DOMContentLoaded', () => {
        window.__titleAtDOMContentLoaded = document.title;
      }, {once: true});
    })();
    ${identitySource}
  `});
  await context.route('https://www.roblox.com/**', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html><head><title>Native profile - Roblox</title><meta name="user-data" data-userid="123" data-name="RealName"></head><body><main></main></body></html>',
  }));
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  await page.goto('https://www.roblox.com/users/123/profile');
  await page.waitForFunction(() => typeof window.__titleAtDOMContentLoaded === 'string');
  assert.equal(await page.evaluate(() => window.__titleAtDOMContentLoaded), testCase.expected, testCase.name);
  assert.equal(await page.title(), testCase.expected, testCase.name);

  await page.evaluate(() => { document.title = 'Native rewrite - Roblox'; });
  await page.waitForTimeout(50);
  const afterMutation = await page.title();
  if (!testCase.expected.startsWith('Native ')) {
    assert.equal(afterMutation, testCase.expected, `${testCase.name}: native rewrite was not kept behind the cached title`);
  } else {
    assert.equal(afterMutation, 'Native rewrite - Roblox', `${testCase.name}: native title should remain available`);
  }
  await context.close();
}

async function runSharedIntegration(browser) {
  const record = {
    version: 1,
    userId: '123',
    snapshot: {version: 1, userId: '123', definition: {assets: []}, items: []},
    name: {enabled: true, username: 'Pilot_7', displayName: 'Fresh Seven'},
  };
  async function open(storage, relay) {
    const context = await browser.newContext();
    await context.addInitScript({content: `
      (() => {
        const storage = ${JSON.stringify(storage)};
        localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify(storage.own || null));
        localStorage.setItem('larpblox-profile-title:123', JSON.stringify(storage.peer || null));
        window.LarpbloxGameBridge = {validateSnapshot(value) { return value; }};
        window.LarpbloxAvatarSurfaces = {createForPeer: () => ({update() {}})};
        window.chrome = {runtime: {sendMessage: (...args) => window.__relay(...args)}};
      })();
      ${identitySource}
    `});
    await context.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><head><title>Native profile - Roblox</title><meta name="user-data" data-userid="999" data-name="RealName"></head><body><main></main></body></html>',
    }));
    const page = await context.newPage();
    await page.exposeFunction('__relay', relay);
    page.setDefaultTimeout(5000);
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.addScriptTag({content: sharedSource});
    return {context, page};
  }

  const delayed = await open(
    {peer: {displayName: 'Cached Seven', expires: Date.now() + 60_000}},
    async message => {
      if (message.type !== 'larpblox-shared-users') return {ok: true};
      await new Promise(resolve => setTimeout(resolve, 300));
      return {ok: true, data: {players: [record]}};
    },
  );
  try {
    await delayed.page.evaluate(() => LarpbloxSharedUsers.update({userId: '999', mode: true}));
    await delayed.page.waitForFunction(() => document.title === 'Cached Seven - Roblox');
    await delayed.page.waitForTimeout(100);
    assert.equal(await delayed.page.title(), 'Cached Seven - Roblox', 'cached peer title should remain during relay wait');
    await delayed.page.waitForFunction(() => document.title === 'Fresh Seven - Roblox');
  } finally {
    await delayed.context.close();
  }

  const disabled = await open(
    {own: {mode: true, names: {username: 'Noah', displayName: 'Noah'}}},
    async () => ({ok: true, data: {players: []}}),
  );
  try {
    await disabled.page.evaluate(() => LarpbloxSharedUsers.update({userId: '123', mode: true, names: {username: 'Noah', displayName: 'Noah'}}));
    await disabled.page.waitForFunction(() => document.title === 'Noah - Roblox');
    await disabled.page.evaluate(() => {
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode: false}));
      LarpbloxSharedUsers.update({userId: '123', mode: false});
    });
    await disabled.page.waitForFunction(() => document.title === 'Native profile - Roblox');
  } finally {
    await disabled.context.close();
  }

  const missing = await open(
    {peer: {displayName: 'Cached Seven', expires: Date.now() + 60_000}},
    async message => message.type === 'larpblox-shared-users' ? {ok: true, data: {players: []}} : {ok: true},
  );
  try {
    await missing.page.evaluate(() => LarpbloxSharedUsers.update({userId: '999', mode: true}));
    await missing.page.waitForFunction(() => document.title === 'Cached Seven - Roblox');
    await missing.page.waitForFunction(() => document.title === 'Native profile - Roblox');
  } finally {
    await missing.context.close();
  }
  const cold = await open({}, async message => {
    if (message.type !== 'larpblox-shared-users') return {ok:true};
    await new Promise(resolve => setTimeout(resolve, 500));
    return {ok:true,data:{players:[record]}};
  });
  try {
    assert.equal(await cold.page.title(), 'Roblox');
    await cold.page.evaluate(() => LarpbloxSharedUsers.update({userId:'999',mode:true}));
    await cold.page.waitForTimeout(100);
    assert.equal(await cold.page.title(), 'Roblox', 'uncached title stays neutral during lookup');
    await cold.page.evaluate(() => {document.title='Real account - Roblox';});
    await cold.page.waitForTimeout(50);
    assert.equal(await cold.page.title(), 'Roblox', 'native rewrites stay hidden while pending');
    await cold.page.waitForFunction(() => document.title === 'Fresh Seven - Roblox');
  } finally { await cold.context.close(); }
}

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    for (const testCase of cases) await runCase(browser, testCase);
    await runSharedIntegration(browser);
    console.log('PASS: cached titles load immediately, uncached/expired titles stay neutral until resolved, and disabled/non-Larp profiles restore native titles.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
