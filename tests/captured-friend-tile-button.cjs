const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/captured-friend-cards.json'), 'utf8'));
const source = name => fs.readFileSync(path.join(__dirname, `../${name}`), 'utf8');
const sharedSource = source('larpbux-shared-users.js');
const avatarSource = source('larpbux-avatar-surfaces.js');
const identitySource = source('identity-gate.js');
const styleSource = source('larpbux.css');
const peerImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';
function card(peer) { return `<div class="friends-carousel-tile"><div><button type="button" class="options-dropdown" id="friend-tile-button"><div class="friend-tile-content"><div class="avatar avatar-card-fullbody" data-testid="avatar-card-container"><a href="https://www.roblox.com/users/${peer.userId}/profile" class="avatar-card-link" data-testid="avatar-card-link"><span class="thumbnail-2d-container avatar-card-image"><img style="width:90px;height:90px" src="${peer.nativeImage}" alt=""></span></a><div class="avatar-status"><span data-testid="presence-icon" title="Playing" class="game icon-game"></span></div></div><a href="https://www.roblox.com/users/${peer.userId}/profile" class="friends-carousel-tile-labels" data-testid="friends-carousel-tile-labels"><div class="friends-carousel-tile-label"><div class="friends-carousel-tile-name"><span class="friends-carousel-display-name">${peer.native}</span></div></div><div class="friends-carousel-tile-sublabel"><div class="friends-carousel-tile-experience">Playing</div></div></a></div></button></div></div>`; }
(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:`<!doctype html><html data-larpblox-peer-cards-enabled="true"><head><meta name="user-data" data-userid="999"></head><body><main><section class="friends-carousel-container"><div class="friends-carousel-list-container">${fixture.addFriends}${fixture.players.map(card).join('')}</div></section></main></body></html>`}));
    await page.addInitScript(({players, peerImage}) => {
      window.__relay = []; window.__releaseRelay = null; window.LarpbloxGameBridge = {validateSnapshot(v) { return v; }};
      window.LarpbloxAvatarRequests = {cached() { return peerImage; }, definitionKey(v) { return JSON.stringify(v); }, async render() { return peerImage; }};
      window.LarpbloxAvatar3D = {async create(host) { host.append(document.createElement('canvas')); return {capture() { return peerImage; }, dispose() {}}; }};
      window.LarpbloxExtension = {sendMessage: async message => { if (message.type !== 'larpblox-shared-users') return {ok:true}; window.__relay.push(message.userIds); await new Promise(resolve => { window.__releaseRelay = resolve; }); return {ok:true, data:{players:players.map(peer => ({version:1,userId:peer.userId,verified:peer.verified,imageUrl:peerImage,name:{enabled:true,username:peer.username,displayName:peer.displayName},snapshot:{version:1,userId:peer.userId,definition:{assets:[]},items:[]}}))}}; }};
    }, {players: fixture.players, peerImage});
    await page.goto('https://www.roblox.com/home'); await page.addStyleTag({content:styleSource}); await page.addScriptTag({content:identitySource}); await page.addScriptTag({content:avatarSource}); await page.addScriptTag({content:sharedSource});
    await page.evaluate(() => LarpbloxSharedUsers.update({userId:'999',mode:false})); await page.waitForFunction(() => window.__relay.length === 1);
    for (const peer of fixture.players) {
      const tile = page.locator(`.friends-carousel-tile:has(a[href="https://www.roblox.com/users/${peer.userId}/profile"])`);
      assert.equal(await tile.locator('.friends-carousel-display-name').evaluate(n => getComputedStyle(n).visibility), 'hidden');
      assert.equal(await tile.locator('.avatar-card-image img').evaluate(n => getComputedStyle(n).visibility), 'hidden');
      assert.equal(await tile.locator('.avatar-status').count(), 1); assert.equal(await tile.locator('#friend-tile-button').count(), 1);
    }
    assert.equal(await page.getByText('Add Friends').evaluate(n => getComputedStyle(n).visibility), 'visible');
    await page.evaluate(() => window.__releaseRelay());
    for (const peer of fixture.players) { const tile = page.locator(`.friends-carousel-tile:has(a[href="https://www.roblox.com/users/${peer.userId}/profile"])`); await tile.locator('.friends-carousel-display-name').waitFor({state:'visible'}); assert.equal(await tile.locator('.friends-carousel-display-name').textContent(), peer.displayName); await tile.locator('.avatar-card-image img').waitFor({state:'visible'}); assert.equal(await tile.locator('.avatar-card-image img').getAttribute('src'), peerImage); }
    // Roblox renders the friend hover menu separately from the name on the tile.
    await page.evaluate(peer => {
      const menu = document.createElement('div');
      menu.className = 'friend-tile-dropdown friend-tile-dropdown--iarc'; menu.id = 'presence-menu';
      menu.innerHTML = `<div class="friend-presence-info"><span class="friend-tile-is-playing"></span><span class="friend-tile-game-name">Murder Mystery 2</span></div><button onclick="window.__joined=true">Join</button><button onclick="window.__chatted=true">Chat</button><a href="/users/${peer.userId}/profile">View Profile</a>`;
      const title = menu.querySelector('.friend-tile-is-playing');
      title.append(document.createTextNode(peer.native), document.createTextNode(' '), document.createTextNode('is playing'));
      document.body.append(menu);
    }, fixture.players[1]);
    await page.waitForFunction(display => document.querySelector('.friend-tile-is-playing').textContent === `${display} is playing`, fixture.players[1].displayName, {timeout:2500});
    // React can replace the text while the menu is open, then reuse it for a
    // different friend. Keep the translated suffix and resolve by profile ID.
    await page.evaluate(peer => {
      document.querySelector('.friend-tile-is-playing').firstChild.nodeValue = peer.native;
    }, fixture.players[1]);
    await page.waitForFunction(display => document.querySelector('.friend-tile-is-playing').textContent === `${display} is playing`, fixture.players[1].displayName);
    await page.evaluate(peer => {
      document.querySelector('#presence-menu a').href = `/users/${peer.userId}/profile`;
      document.querySelector('.friend-tile-is-playing').textContent = `${peer.native} is playing`;
    }, fixture.players[0]);
    await page.waitForFunction(display => document.querySelector('.friend-tile-is-playing').textContent === `${display} is playing`, fixture.players[0].displayName);
    await page.evaluate(peer => {
      const title = document.querySelector('.friend-tile-is-playing');
      title.replaceChildren(document.createTextNode(peer.native), document.createTextNode(' joue actuellement'));
    }, fixture.players[0]);
    await page.waitForFunction(display => document.querySelector('.friend-tile-is-playing').textContent === `${display} joue actuellement`, fixture.players[0].displayName);
    assert.equal(await page.locator('.friend-tile-game-name').textContent(), 'Murder Mystery 2');
    assert.equal(await page.locator('#presence-menu a').textContent(), 'View Profile');
    await page.getByRole('button', {name:'Join',exact:true}).click();
    await page.getByRole('button', {name:'Chat',exact:true}).click();
    assert.equal(await page.evaluate(() => window.__joined && window.__chatted), true);
    assert.deepEqual(errors, []); console.log('PASS: friend cards and playing popovers show Larp display names, handle rerenders/reused menus/localized text, and preserve native actions.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
