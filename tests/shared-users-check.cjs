const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Bridge = require('../larpbux-game-bridge.js');

const userId = '1';
const peerId = '2';
const snapshot = {
  version: 1, userId: peerId,
  definition: {assets: [], bodyColors: Object.fromEntries(['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'].map(part => [`${part}Color`, 'ffffff'])), scales: {}, playerAvatarType: {playerAvatarType: 'R15'}},
  items: [],
};
const anchors = ['1', '2', '3'].map(id => ({
  getAttribute(name) { return name === 'href' ? `/users/${id}/profile` : null; },
  getClientRects() { return [1]; },
  matches() { return true; },
  childNodes: [],
}));
let payload;
let relayResult = {version: 1, players: [{version: 1, userId: peerId, snapshot, name: {enabled: true, username: 'PeerName', displayName: 'Peer Name'}, imageUrl: 'https://tr.rbxcdn.com/peer.png'}, {...snapshot, userId, version: 1}]};
const applied = [];
const document = {
  hidden: false,
  querySelectorAll(selector) { return selector === 'a[href]' ? anchors : []; },
  createTreeWalker() { return {nextNode() { return null; }}; },
};
const context = {
  document,
  location: {origin: 'https://www.roblox.com', pathname: '/home'},
  URL,
  NodeFilter: {SHOW_TEXT: 4},
  Node: {TEXT_NODE: 3, ELEMENT_NODE: 1},
  requestAnimationFrame(callback) { callback(); },
  setInterval() {},
  chrome: {runtime: {async sendMessage(message) { payload = message; return {ok: true, data: relayResult}; }}},
  LarpbloxGameBridge: Bridge,
  LarpbloxAvatarSurfaces: {createForPeer() { return {update(value) { applied.push(value); }}; }},
};
vm.runInNewContext(fs.readFileSync(require.resolve('../larpbux-shared-users.js'), 'utf8'), context);

(async () => {
  context.LarpbloxSharedUsers.update({userId, mode: true});
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(Array.from(payload.userIds), ['2', '3'], 'only visible linked users are queried, and current user is excluded');
  assert.equal(applied.some(value => value.userId === peerId && value.imageUrl === 'https://tr.rbxcdn.com/peer.png'), true);
  assert.equal(applied.some(value => value.userId === userId), false, 'relay cannot replace the local account appearance');

  context.LarpbloxSharedUsers.update({userId, mode: false});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(applied.some(value => value.active === false), true, 'turning mode off restores peer surfaces');
  console.log('Shared-user visibility, account-isolation, and cleanup checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });

