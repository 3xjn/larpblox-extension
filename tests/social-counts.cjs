const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const source = fs.readFileSync(path.join(__dirname, '../larpbux-shared-users.js'), 'utf8');
const definition = {assets: [], backgroundRequestModel: {id: 1}};

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    let mode = 'peer';
    await page.addInitScript(({definition}) => {
      window.LarpbloxAvatarSurfaces = {createForPeer: () => ({update() {}})};
      window.LarpbloxGameBridge = {validateSnapshot() {}};
      window.__definition = definition;
      window.chrome = {runtime: {sendMessage: async message => {
        if (message.type !== 'larpblox-shared-users') return {ok: true};
        return window.__socialResponse;
      }}};
    }, {definition});
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType: 'text/html', body: '<main></main>'}));
    await page.goto('https://www.roblox.com/users/456/profile');
    await page.evaluate(() => {
      window.__socialResponse = {ok: true, data: {players: [{userId: '456', snapshot: {version: 1, userId: '456', definition: window.__definition, items: []}, socialCounts: {followers: 1234567, following: 1}}]}};
      document.querySelector('main').innerHTML = '<a id="plain" href="/users/456/friends#!/followers">6K Follower</a><a id="wrapped" href="/users/456/friends#!/following"><span>2</span> Following</a>';
    });
    await page.addScriptTag({content: source});
    await page.evaluate(() => window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: {followers: 0, following: 0}}));
    await page.waitForFunction(() => document.querySelector('#plain')?.textContent === '1.2M Follower' && document.querySelector('#wrapped')?.textContent === '1 Following');
    assert.equal(await page.locator('#plain').getAttribute('href'), '/users/456/friends#!/followers');
    assert.equal(await page.locator('#plain').getAttribute('title'), '1234567');
    assert.equal(await page.locator('#wrapped span').getAttribute('title'), '1');

    await page.evaluate(() => {
      history.pushState({}, '', '/users/123/profile');
      document.querySelector('main').innerHTML = '<a id="ownPlain" href="/friends#!/followers">6K Followers</a><a id="ownWrapped" href="/users/123/friends#!/following"><span>2</span> Following</a><div class="profile-header-overlay"><a id="ownNoHref">6K Follower</a></div>';
      window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: {followers: 0, following: 0}});
    });
    await page.evaluate(() => {
      window.LarpbloxSharedUsers.update({userId: '123', mode: false, socialCounts: null});
      window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: {followers: 0, following: 0}});
    });
    await page.evaluate(() => window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: {followers: 0, following: 0}}));
    await page.waitForFunction(() => document.querySelector('#ownPlain')?.textContent === '0 Followers' && document.querySelector('#ownWrapped')?.textContent === '0 Following' && document.querySelector('#ownNoHref')?.textContent === '0 Follower');
    assert.equal(await page.locator('#ownPlain').getAttribute('href'), '/friends#!/followers');
    assert.equal(await page.locator('#ownNoHref').getAttribute('href'), null);
    await page.evaluate(() => window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: null}));
    await page.waitForFunction(() => document.querySelector('#ownPlain')?.textContent === '6K Followers');
    await page.evaluate(() => window.LarpbloxSharedUsers.update({userId: '123', mode: false, socialCounts: {followers: 9, following: 9}}));
    await page.waitForFunction(() => document.querySelector('#ownWrapped')?.textContent === '2 Following' && document.querySelector('#ownNoHref')?.textContent === '6K Follower');

    await page.evaluate(() => {
      history.pushState({}, '', '/users/456/profile');
      document.querySelector('main').innerHTML = '<a id="invalid" href="/users/456/friends#!/followers">6K Followers</a>';
      window.__socialResponse = {ok: true, data: {players: [{userId: '456', snapshot: {version: 1, userId: '456', definition: window.__definition, items: []}, socialCounts: {followers: -1, following: 2}}]}};
      window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: null});
    });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#invalid').textContent(), '6K Followers');
    console.log('PASS: peer and own social counts render, preserve links/labels, and restore on reset/mode-off; invalid peer counts are ignored.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
