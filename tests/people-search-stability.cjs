const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.join(__dirname, '..');
const sharedPath = path.join(root, 'larpbux-shared-users.js');

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: '<main><div id="react-player-search-web-app"><div class="player-search-results-grid" data-testid="player-search-results" aria-busy="true"><article class="native-card"><img class="native-avatar" src="/slow-avatar.png"><span>Loading</span></article></div></div></main>'
    }));
    await page.goto('https://www.roblox.com/search/users?keyword=Alias');
    await page.evaluate(() => {
      window.__now = 100000;
      Date.now = () => window.__now;
      window.__intervals = [];
      window.setInterval = (fn, ms) => { window.__intervals.push({fn, ms}); return window.__intervals.length; };
    });
    await page.addStyleTag({path: path.join(root, 'larpbux.css')});
    await page.addScriptTag({path: path.join(root, 'larpbux-verification.js')});
    let sharedSource = fs.readFileSync(sharedPath, 'utf8');
    if (process.env.BASELINE === '1') {
      sharedSource = require('node:child_process').execFileSync('git', ['show', '4fc08b8:larpbux-shared-users.js'], {cwd:root, encoding:'utf8'});
    }
    await page.addScriptTag({content: sharedSource});

    await page.evaluate(() => {
      window.__relay = {failed: false, users: {
        Alias: [{userId: '123', name: {enabled: true, username: 'Alias', displayName: 'Alias Display'}, verified: true, snapshot: {definition: {}, items: []}}],
        Other: [{userId: '456', name: {enabled: true, username: 'Other', displayName: 'Other Display'}, verified: false, snapshot: {definition: {}, items: []}}]
      }};
      window.chrome = {runtime: {sendMessage: async message => {
        if (message.type !== 'larpblox-search-users') return {ok: true, data: {players: []}};
        if (window.__relay.failed) return {ok: false};
        return {ok: true, data: {players: window.__relay.users[message.keyword] || []}};
      }}};
      window.LarpbloxGameBridge = {validateSnapshot: () => {}};
      window.LarpbloxAvatarSurfaces = {createForPeer: () => ({update: () => {}})};
      const image = document.querySelector('.native-avatar');
      Object.defineProperty(image, 'complete', {configurable: true, value: false});
    });

    await page.evaluate(() => LarpbloxSharedUsers.update({mode: true, userId: '123'}));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.locator('#larpblox-people-results').count(), 0, 'initial skeleton keeps Larp results hidden');

    await page.evaluate(() => {
      const grid = document.querySelector('.player-search-results-grid');
      grid.removeAttribute('aria-busy');
      const image = grid.querySelector('.native-avatar');
      Object.defineProperty(image, 'complete', {configurable: true, value: true});
      grid.querySelector('span').textContent = 'Alias native result';
      LarpbloxSharedUsers.update({mode: true, userId: '123'});
    });
    await page.waitForSelector('#larpblox-people-results .larpblox-person-card');
    assert.equal(await page.locator('.larpblox-person-card .display-name').textContent(), 'Alias Display');

    await page.evaluate(() => {
      window.__root = document.querySelector('#larpblox-people-results');
      window.__card = document.querySelector('.larpblox-person-card');
      const grid = document.querySelector('.player-search-results-grid');
      grid.setAttribute('aria-busy', 'true');
      Object.defineProperty(grid.querySelector('.native-avatar'), 'complete', {configurable: true, value: false});
      LarpbloxSharedUsers.update({mode: true, userId: '123'});
    });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.locator('#larpblox-people-results').count(), 1, 'later native loading keeps visible Larp results');
    assert.equal(await page.locator('.larpblox-person-card').count(), 1);

    await page.evaluate(() => {
      const grid = document.querySelector('.player-search-results-grid');
      const replacement = document.createElement('article');
      replacement.className = 'native-card';
      replacement.textContent = 'Alias native replacement';
      grid.replaceChildren(replacement);
    });
    await page.waitForFunction(() => document.querySelector('#larpblox-people-results') === window.__root &&
      document.querySelector('.larpblox-person-card') === window.__card &&
      document.querySelector('.player-search-results-grid').firstElementChild === window.__root);

    for (let redraw = 0; redraw < 20; redraw++) {
      await page.evaluate(async () => {
        const grid = document.querySelector('.player-search-results-grid');
        grid.replaceChildren(Object.assign(document.createElement('article'), {className:'native-card', textContent:'Native redraw'}));
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      assert.equal(await page.evaluate(() => document.querySelector('#larpblox-people-results') === window.__root && document.querySelector('.larpblox-person-card') === window.__card), true, 'redraw restores same root and card before polling');
      assert.equal(await page.locator('.larpblox-person-card').count(), 1, 'redraw never duplicates the card');
    }

    await page.evaluate(async () => {
      window.__now += 5001;
      window.__relay.failed = true;
      const timer = window.__intervals.find(entry => entry.ms < 60000);
      await timer.fn();
    });
    assert.equal(await page.locator('.larpblox-person-card .display-name').textContent(), 'Alias Display', 'failed relay preserves visible result');

    await page.evaluate(() => {
      window.__relay.failed = false;
      history.pushState({}, '', '/search/users?keyword=Other');
      const grid = document.querySelector('.player-search-results-grid');
      grid.setAttribute('aria-busy', 'true');
      grid.replaceChildren(Object.assign(document.createElement('article'), {className: 'native-card', textContent: 'Loading new query'}));
      LarpbloxSharedUsers.update({mode: true, userId: '123'});
    });
    await page.waitForFunction(() => !document.querySelector('#larpblox-people-results'));
    await page.evaluate(() => {
      const grid = document.querySelector('.player-search-results-grid');
      grid.removeAttribute('aria-busy');
      const result = document.createElement('article');
      result.className = 'native-card'; result.textContent = 'Other native result';
      grid.replaceChildren(result);
      LarpbloxSharedUsers.update({mode: true, userId: '123'});
    });
    await page.waitForSelector('#larpblox-people-results .larpblox-person-card');
    assert.equal(await page.locator('.larpblox-person-card .display-name').textContent(), 'Other Display', 'new query waits for new native results');
    assert.equal(await page.locator('.larpblox-person-card').count(), 1);
    console.log(`PASS: people search stability (${process.env.BASELINE === '1' ? 'baseline' : 'fixed'})`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
