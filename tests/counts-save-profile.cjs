const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const bridge = path.join(__dirname, '../larpbux-game-bridge.js');
const sharedUsers = path.join(__dirname, '../larpbux-shared-users.js');
const larpbux = path.join(__dirname, '../larpbux.js');

const nativeProfile = counts => `<!doctype html><html><head>
  <meta name="user-data" data-userid="123" data-name="Native Name">
  </head><body><main class="profile-header-overlay"><div class="user-profile-header">
    <a><div aria-hidden="true"></div><span>${counts.friends} Friends</span></a>
    <a><div aria-hidden="true"></div><span>${counts.followers} Followers</span></a>
    <a><div aria-hidden="true"></div><span>${counts.following} Following</span></a>
  </div></main></body></html>`;

async function install(page) {
  await page.addScriptTag({path: bridge});
  await page.addScriptTag({path: sharedUsers});
  await page.addScriptTag({path: larpbux});
  await page.waitForFunction(() => typeof window.__popupMessage === 'function');
}

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      window.chrome = {
        runtime: {
          onMessage: {addListener(listener) { window.__popupMessage = listener; }},
          sendMessage: async message => {
            if (message.type === 'larpblox-game-bridge') return {ok: true, data: {connected: false}};
            if (message.type === 'larpblox-shared-users') return {ok: true, data: {players: []}};
            if (message.type === 'larpblox-publish-profile') return {ok: true};
            return {ok: true};
          },
        },
      };
      window.LarpbloxAppearance = {get: () => 'modern', set() {}};
      window.LarpbloxAvatarRequests = {
        cached: () => undefined,
        render: async () => null,
        retryAfter: () => 1,
      };
      window.LarpbloxAvatarSurfaces = {update() {}, createForPeer: () => ({update() {}})};
    });
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: nativeProfile({friends: 13, followers: 6000, following: 6700}),
    }));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.evaluate(() => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({
      version: 1, mode: true, sharing: true, balance: 100,
    })));
    await install(page);

    const saveCounts = counts => page.evaluate(value => new Promise(resolve => {
      window.__popupMessage({type: 'larpblox-popup-profile-counts', socialCounts: value}, {}, resolve);
    }), counts);
    const text = label => page.locator('.user-profile-header a').filter({hasText: label});

    await page.waitForFunction(() => document.querySelector('.user-profile-header a:nth-of-type(2)')?.textContent === '6000 Followers');

    const popup = await browser.newPage({viewport: {width: 390, height: 850}});
    popup.on('console', message => console.error('popup console:', message.text()));
    popup.on('pageerror', error => console.error('popup error:', error.message));
    await popup.exposeFunction('__profileRuntime', envelope => page.evaluate(value => new Promise(resolve => {
      window.__popupMessage(value, {}, resolve);
    }), envelope.message || envelope));
    const popupHtml = fs.readFileSync(path.join(__dirname, '../popup.html'), 'utf8').replace('<iframe id="popup"', '<iframe sandbox="allow-scripts" id="popup"');
    const sandboxHtml = fs.readFileSync(path.join(__dirname, '../popup-sandbox.html'), 'utf8');
    const sandboxJs = fs.readFileSync(path.join(__dirname, '../popup-sandbox.js'), 'utf8');
    const hostJs = fs.readFileSync(path.join(__dirname, '../popup-host.js'), 'utf8');
    const popupCss = fs.readFileSync(path.join(__dirname, '../assets/popup/popup.css'), 'utf8');
    const popupJs = process.env.POPUP_JS_PATH
      ? fs.readFileSync(process.env.POPUP_JS_PATH, 'utf8')
      : process.env.POPUP_JS_VERSION
        ? execFileSync('git', ['show', `${process.env.POPUP_JS_VERSION}:assets/popup/popup.js`], {encoding: 'utf8'})
        : fs.readFileSync(path.join(__dirname, '../assets/popup/popup.js'), 'utf8');
    await popup.addInitScript(({popupCss, popupJs}) => {
      window.chrome = {
        tabs: {query: async () => [{id: 1, url: 'https://www.roblox.com/users/123/profile'}]},
        runtime: {sendMessage: async message => {
          if (message.type === 'larpblox-website-update') return {ok: true, version: 'test', popup: {css: popupCss, js: popupJs}};
          if (message.type === 'larpblox-popup-relay') return window.__profileRuntime(message);
          return {ok: true};
        }},
      };
    }, {popupCss, popupJs});
    await popup.route('https://popup.test/popup.html', route => route.fulfill({contentType: 'text/html', body: popupHtml}));
    await popup.route('https://popup.test/popup-host.js', route => route.fulfill({contentType: 'text/javascript', body: hostJs}));
    await popup.route('https://popup.test/popup-sandbox.html*', route => route.fulfill({contentType: 'text/html', body: sandboxHtml}));
    await popup.route('https://popup.test/popup-sandbox.js', route => route.fulfill({contentType: 'text/javascript', body: sandboxJs}));
    await popup.goto('https://popup.test/popup.html');
    const popupFrame = popup.frameLocator('#popup');
    await popupFrame.getByRole('button', {name: 'More settings'}).click();
    await popupFrame.getByLabel('Followers', {exact: true}).fill('157');
    await popupFrame.getByLabel('Following', {exact: true}).fill('0');
    await popupFrame.getByLabel('Friends', {exact: true}).fill('13');
    await popupFrame.getByRole('button', {name: 'Save counts', exact: true}).click();
    await popupFrame.getByText('Profile counts saved.', {exact: true}).waitFor();
    const response = await page.evaluate(() => new Promise(resolve => {
      window.__popupMessage({type: 'larpblox-popup-get-state'}, {}, resolve);
    }));
    assert.equal(response.ok, true, response.error);
    await page.waitForFunction(() => document.querySelector('.user-profile-header a:nth-of-type(2)')?.textContent === '157 Followers');
    assert.equal(await text('157 Followers').textContent(), '157 Followers');
    assert.equal(await text('0 Following').textContent(), '0 Following');
    assert.equal(await text('13 Friends').textContent(), '13 Friends');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).socialCounts), {followers: 157, following: 0, friends: 13});

    await popupFrame.getByLabel('Friends', {exact: true}).fill('1001');
    await popupFrame.getByRole('button', {name: 'Save counts', exact: true}).click();
    await page.waitForTimeout(100);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).socialCounts), {followers: 157, following: 0, friends: 13});
    await popupFrame.getByLabel('Followers', {exact: true}).fill('158');
    await popupFrame.getByLabel('Friends', {exact: true}).fill('13');
    await popupFrame.getByLabel('Friends', {exact: true}).press('Enter');
    await popupFrame.getByText('Profile counts saved.', {exact: true}).waitFor();
    await page.waitForFunction(() => document.querySelector('.user-profile-header a:nth-of-type(2)')?.textContent === '158 Followers');

    const nextResponse = await saveCounts({followers: 231, following: 4, friends: 7});
    assert.equal(nextResponse.ok, true, nextResponse.error);
    await page.waitForFunction(() => document.querySelector('.user-profile-header a:nth-of-type(2)')?.textContent === '231 Followers');
    assert.equal(await text('4 Following').textContent(), '4 Following');
    assert.equal(await text('7 Friends').textContent(), '7 Friends');

    await page.reload();
    await install(page);
    await page.waitForFunction(() => document.querySelector('.user-profile-header a:nth-of-type(2)')?.textContent === '231 Followers');

    await page.evaluate(() => {
      document.querySelector('.user-profile-header').innerHTML = '<a><div aria-hidden="true"></div><span>13 Friends</span></a><a><div aria-hidden="true"></div><span>6K Followers</span></a><a><div aria-hidden="true"></div><span>6.7K Following</span></a>';
    });
    await page.waitForFunction(() => document.querySelector('.user-profile-header a:nth-of-type(2)')?.textContent === '231 Followers');
    assert.equal(await text('231 Followers').textContent(), '231 Followers');
    assert.equal(await text('4 Following').textContent(), '4 Following');
    assert.equal(await text('7 Friends').textContent(), '7 Friends');
    console.log('PASS: actual popup save updates the native own profile counts, persists across reload, and redraws over native markup.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
