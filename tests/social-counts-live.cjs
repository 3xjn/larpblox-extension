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
const {localSocialCounts} = require('../larpbux.js');
const sharedSource = fs.readFileSync(process.env.SHARED_USERS_SOURCE || path.join(__dirname, '../larpbux-shared-users.js'), 'utf8');
const definition = {assets: [], bodyColors: {}, scales: {}, playerAvatarType: {playerAvatarType: 'R15'}};

const records = new Map();
const recordFor = userId => ({
  userId: String(userId),
  snapshot: {version: 1, userId: String(userId), definition, items: []},
  socialCounts: records.get(String(userId))?.socialCounts,
});

async function main() {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const own = await browser.newPage();
    const peer = await browser.newPage();
    for (const [page, userId] of [[own, '123'], [peer, '456']]) {
      page.setDefaultTimeout(4000);
      await page.addInitScript(({definition, userId}) => {
        window.LarpbloxAvatarSurfaces = {createForPeer: () => ({update() {}})};
        window.LarpbloxGameBridge = {validateSnapshot(snapshot) { return snapshot; }};
        window.chrome = {runtime: {sendMessage: async message => {
          if (message.type === 'larpblox-popup-profile-counts') {
            const response = await window.__saveCounts(message.socialCounts);
            return {ok: true, ...response};
          }
          if (message.type === 'larpblox-shared-users') return window.__sharedUsers(message.userIds);
          if (message.type === 'larpblox-publish-profile') return window.__publishProfile(message.record);
          return {ok: true};
        }}};
        window.__userId = userId;
      }, {definition, userId});
      await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:'<main></main>'}));
      await page.goto('https://www.roblox.com/users/123/profile');
      await page.addScriptTag({content: sharedSource});
      await page.evaluate(() => window.LarpbloxSharedUsers.update({userId: window.__userId, mode: true, socialCounts: null}));
    }

    await own.exposeFunction('__saveCounts', value => {
      const parsed = localSocialCounts(value);
      return own.evaluate(counts => {
        window.__ownCounts = counts;
        window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: counts});
        window.LarpbloxSharedUsers.publishProfile({userId:'123',active:true,signature:'same-outfit',socialCounts:counts,loadSnapshot:async()=>({version:1,userId:'123',definition:{assets:[]},items:[]})});
        return {socialCounts: counts};
      }, parsed);
    });
    await own.exposeFunction('__publishProfile', record => { records.set('123',record); return {ok:true}; });
    await own.exposeFunction('__sharedUsers', userIds => ({
      ok: true,
      data: {players: userIds.filter(id => records.has(String(id))).map(id => recordFor(id))},
    }));
    await peer.exposeFunction('__saveCounts', async () => ({socialCounts: null}));
    await peer.exposeFunction('__sharedUsers', userIds => ({
      ok: true,
      data: {players: userIds.filter(id => records.has(String(id))).map(id => recordFor(id))},
    }));

    await own.evaluate(() => {
      document.body.innerHTML = '<header class="user-profile-header">' +
        '<button id="followers">12K Followers</button>' +
        '<button id="following"><span>34</span> Following</button>' +
        '<button id="friends">56 Friends</button></header>';
      window.LarpbloxSharedUsers.update({userId: '123', mode: true, socialCounts: null});
    });
    await peer.evaluate(() => {
      document.body.innerHTML = '<a id="peerFollowers" href="/users/123/friends#!/followers">12K Followers</a>' +
        '<a id="peerFollowing" href="/users/123/friends#!/following">34 Following</a>' +
        '<a id="peerFriends" href="/users/123/friends#!/friends">56 Friends</a>';
      window.LarpbloxSharedUsers.update({userId: '456', mode: true, socialCounts: null});
    });

    await own.evaluate(() => window.chrome.runtime.sendMessage({
      type: 'larpblox-popup-profile-counts',
      socialCounts: {followers: '156000', following: '0', friends: '1000'},
    }));
    // The popup save is the publication event; the viewer receives it through
    // its normal shared-users refresh without navigating away from the page.
    await peer.evaluate(() => window.LarpbloxSharedUsers.update({userId: '456', mode: true, socialCounts: null}));
    await peer.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await own.waitForFunction(() => document.querySelector('#followers')?.textContent === '156K Followers' &&
      document.querySelector('#following')?.textContent === '0 Following' &&
      document.querySelector('#friends')?.textContent === '1K Friends');
    await peer.waitForFunction(() => document.querySelector('#peerFollowers')?.textContent === '156K Followers' &&
      document.querySelector('#peerFollowing')?.textContent === '0 Following' &&
      document.querySelector('#peerFriends')?.textContent === '1K Friends', null, {timeout: 3000});

    await own.evaluate(() => {
      document.querySelector('#followers').textContent = '12K Followers';
      document.querySelector('#following').innerHTML = '<span>34</span> Following';
      document.querySelector('#friends').replaceWith(Object.assign(document.createElement('button'), {id: 'friends', textContent: '56 Friends'}));
    });
    await own.waitForFunction(() => document.querySelector('#followers')?.textContent === '156K Followers' &&
      document.querySelector('#following')?.textContent === '0 Following' &&
      document.querySelector('#friends')?.textContent === '1K Friends', null, {timeout: 1000});

    await own.evaluate(() => window.chrome.runtime.sendMessage({type:'larpblox-popup-profile-counts',socialCounts:{followers:'200000',following:'1',friends:'999'}}));
    await peer.waitForFunction(() => document.querySelector('#peerFollowers')?.textContent === '200K Followers' && document.querySelector('#peerFriends')?.textContent === '999 Friends',null,{timeout:3000});

    await own.evaluate(() => window.chrome.runtime.sendMessage({type: 'larpblox-popup-profile-counts', socialCounts: null}));
    await own.waitForFunction(() => document.querySelector('#followers')?.textContent === '12K Followers' &&
      document.querySelector('#following')?.textContent === '34 Following' &&
      document.querySelector('#friends')?.textContent === '56 Friends');
    await peer.waitForFunction(() => document.querySelector('#peerFollowers')?.textContent === '12K Followers' && document.querySelector('#peerFriends')?.textContent === '56 Friends',null,{timeout:3000});
    await own.evaluate(() => window.LarpbloxSharedUsers.update({userId: '123', mode: false, socialCounts: {followers: 9, following: 9, friends: 9}}));
    await own.waitForFunction(() => document.querySelector('#followers')?.textContent === '12K Followers' &&
      document.querySelector('#following')?.textContent === '34 Following' &&
      document.querySelector('#friends')?.textContent === '56 Friends');

    assert.deepEqual(localSocialCounts({followers: '1', following: '2', friends: '1000'}), {followers: 1, following: 2, friends: 1000});
    assert.throws(() => localSocialCounts({followers: '1', following: '2', friends: '1001'}), /Friends/);
    console.log('PASS: saved counts publish to a peer, survive redraws, reset and mode-off restore native values, and friends are capped at 1,000.');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
