const assert = require('assert');
const {changedBodyScales,gameOutfitMatches} = require('../larpbux.js');

assert.deepEqual(changedBodyScales({height:1, width:1}, {bodyHeightScale:1.25, WidthScale:0.8}), {height:1.25, width:0.8});
assert.deepEqual(changedBodyScales({}, {HeadScale:'1.4', BodyTypeScale:0}), {head:1.4, bodyType:0});
assert.throws(() => changedBodyScales({}, {heightScale:6}), /body scale/);
assert.throws(() => changedBodyScales({}, {unrelated:1}), /body scale/);

const snapshot = {userId:'123', items:[], definition:{assets:[],bodyColors:{},scales:{height:1,width:1},playerAvatarType:{playerAvatarType:'R15'}}};
const scaled = {...snapshot, definition:{...snapshot.definition,scales:{height:1.1,width:1}}};
assert.equal(gameOutfitMatches(snapshot,scaled),false,'old game scales must not confirm a new scale edit');
assert.equal(gameOutfitMatches(scaled,scaled),true);
const r6 = {...snapshot, definition:{...snapshot.definition,playerAvatarType:{playerAvatarType:'R6'}}};
assert.equal(gameOutfitMatches(snapshot,r6),false,'old game rig must not confirm an R6 edit');

console.log('PASS: scale normalization and game confirmations reject stale scales and rig types.');
