const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/captured-friend-cards.json'), 'utf8'));
const source = name => fs.readFileSync(path.join(__dirname, `../${name}`), 'utf8');
const sourceBridge = source('larpblox-peer-identities.js');
const sharedSource = source('larpbux-shared-users.js');
const avatarSource = source('larpbux-avatar-surfaces.js');
const identitySource = source('identity-gate.js');
const styleSource = source('larpbux.css');
const peerImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';
function oldCard(peer) { return `<div class="friends-carousel-tile"><div><button type="button" class="options-dropdown" id="friend-tile-button"><div class="friend-tile-content"><div class="avatar avatar-card-fullbody" data-testid="avatar-card-container"><a href="https://www.roblox.com/users/${peer.userId}/profile" class="avatar-card-link" data-testid="avatar-card-link"><span class="thumbnail-2d-container avatar-card-image"><img style="width:90px;height:90px" src="${peer.nativeImage}" alt=""></span></a><div class="avatar-status"><span data-testid="presence-icon" title="Playing" class="game icon-game"></span></div></div><a href="https://www.roblox.com/users/${peer.userId}/profile" class="friends-carousel-tile-labels" data-testid="friends-carousel-tile-labels"><div class="friends-carousel-tile-label"><div class="friends-carousel-tile-name"><span class="friends-carousel-display-name">${peer.native}</span></div></div><div class="friends-carousel-tile-sublabel"><div class="friends-carousel-tile-experience">Playing</div></div></a></div></button></div></div>`; }
function card(peer) { return `<div class="game-card-friend-info"><div class="info-avatar"><div class="avatar-card" data-test-id="${peer.userId}"><span class="avatar avatar-headshot"><img class="avatar-card-image" src="${peer.nativeImage}"></span></div></div></div><div data-testid="game-players-player-interaction-modal"><img class="game-image" src="game.png"><li class="interaction-item" data-test-id="${peer.userId}"><span class="avatar avatar-headshot"><img class="avatar-card-image" src="${peer.nativeImage}"></span><div class="player-info"><span class="player-name">${peer.native}</span><button onclick="window.__joined=true">Join</button></div></li></div>`; }
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
    await page.goto('https://www.roblox.com/home'); await page.addStyleTag({content:styleSource}); await page.addScriptTag({content:identitySource}); await page.addScriptTag({content:avatarSource}); await page.addScriptTag({content:sharedSource}); await page.evaluate(() => { for (const root of document.querySelectorAll('[data-test-id]')) root.querySelector('img').__reactFiber$test = {type:function pI(){},memoizedProps:{user:{id:root.getAttribute('data-test-id')}}}; }); await page.addScriptTag({content:sourceBridge});
    await page.evaluate(() => LarpbloxSharedUsers.update({userId:'999',mode:false})); await page.waitForFunction(() => window.__relay.length === 1);
    for (const root of await page.locator('[data-test-id]').all()) assert.equal(await root.locator('img').evaluate(n => getComputedStyle(n).visibility), 'hidden');
    await page.evaluate(() => window.__releaseRelay());
    for (const peer of fixture.players) {
      const roots = page.locator(`[data-test-id="${peer.userId}"]`);
      for (const root of await roots.all()) { await root.locator('img').waitFor({state:'visible'}); assert.equal(await root.locator('img').getAttribute('src'), peerImage); }
      assert.equal(await page.locator(`.interaction-item[data-test-id="${peer.userId}"] .player-name`).textContent(), peer.displayName);
    }
    await page.getByRole('button', {name:'Join',exact:true}).first().click();
    assert.equal(await page.evaluate(() => window.__joined), true);
    assert.equal(await page.locator('.game-image').first().getAttribute('src'), 'game.png');
    assert.deepEqual(errors, []); console.log('PASS: game facepiles and Experience rows gate native portraits, replace headshots/names, preserve game images and Join.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
