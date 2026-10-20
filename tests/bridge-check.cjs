const assert = require('node:assert/strict');
const Bridge = require('../larpbux-game-bridge.js');

const userId = '1585368861';
const snapshot = {
  version: 1,
  userId,
  definition: {
    assets: [{ id: 123 }],
    bodyColors: Object.fromEntries(['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'].map(part => [`${part}Color`, 'ffffff'])),
    scales: { height: 1 },
    playerAvatarType: { playerAvatarType: 'R15' },
  },
  items: [{ id: 123, itemType: 'Asset', assetType: 8, name: 'Hat' }],
};

assert.equal(Bridge.validateSnapshot(snapshot, userId), snapshot);
assert.throws(() => Bridge.validateSnapshot(snapshot, '2'), /different account/);
assert.equal(Bridge.validImageUrl('https://tr.rbxcdn.com/example.png'), true);
assert.equal(Bridge.validImageUrl('https://attacker.example/example.png'), false);
assert.equal(Bridge.validImageUrl('https://tr.rbxcdn.com/example.png?token=x'), false);
assert.equal(Bridge.validateImage({version: 1, userId, definition: snapshot.definition, imageUrl: 'https://tr.rbxcdn.com/example.png'}, userId).imageUrl, 'https://tr.rbxcdn.com/example.png');
assert.throws(() => Bridge.validateImage({version: 1, userId, definition: snapshot.definition, imageUrl: 'https://attacker.example/avatar.png'}, userId), /Invalid avatar image/);
assert.deepEqual(Bridge.validateNames({version: 1, userId, enabled: false, name: ''}, userId), {version: 1, userId, enabled: false, name: ''});
assert.throws(() => Bridge.validateNames({version: 1, userId: '2', enabled: true, name: 'Alias'}, userId), /Invalid game name/);

const visible = new Set(['2', userId]);
const sharedRecord = {version: 1, userId: '2', snapshot: {...snapshot, userId: '2'}, name: {enabled: true, username: 'PeerName', displayName: 'Peer Name'}, imageUrl: 'https://tr.rbxcdn.com/peer.png'};
assert.equal(Bridge.validateSharedRecord(sharedRecord, visible, userId).imageUrl, sharedRecord.imageUrl);
assert.equal(Bridge.validateSharedRecord({...sharedRecord, name: {enabled: false, username: '', displayName: ''}}, visible, userId).userId, '2');
assert.equal(Bridge.validateSharedRecord({...sharedRecord, imageUrl: 'https://attacker.example/avatar.png'}, visible, userId).imageUrl, undefined);
assert.equal(Bridge.validateSharedRecord(sharedRecord, visible, '2'), null, 'relay must never replace the current account');
assert.equal(Bridge.validateSharedRecord(sharedRecord, new Set(), userId), null, 'only visible peer IDs may be used');
assert.throws(() => Bridge.validateSharedRecord({...sharedRecord, name: {...sharedRecord.name, username: '<script>'}}, visible, userId), /Invalid shared name/);
console.log('Bridge and shared-record validation checks passed.');
