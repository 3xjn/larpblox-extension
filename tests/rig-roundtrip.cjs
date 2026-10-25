const assert = require('node:assert/strict');
const {transitionRig, equip} = require('../larpbux.js');

const item = (id, assetType, itemType = 'Asset') => ({id, itemType, assetType, name:`Item ${id}`});
const body = item(27, 27);
const layered = item(809, 65);
const animation = item(812, 51);
const animationBundle = {id:901, itemType:'Bundle', bundleType:'AvatarAnimations', name:'Animations', assets:[animation]};
const unworn = item(999, 65);
const base = {
  version:1, items:[body, layered, animation, animationBundle, unworn],
  equipped:['Asset:27','Bundle:901'],
  fullOutfitKey:undefined,
  rigStash:undefined,
};
const look = {version:1, items:[body, layered, animation], definition:{assets:[{id:27},{id:809},{id:812}], scales:{height:1}, playerAvatarType:{playerAvatarType:'R15'}}};

const r6 = transitionRig(base, look, 'R6');
assert.deepEqual(r6.state.rigStash.items.map(value => value.id).sort(), [809, 812, 901]);
assert.deepEqual(r6.state.rigStash.assets.map(value => value.id).sort(), [809, 812]);
assert.equal(r6.state.rigStash.items.some(value => value.id === 999), false, 'unworn inventory must not be stashed');
assert.deepEqual(r6.state.rigStash.scope, 'Asset:27');
assert.deepEqual(r6.look.definition.assets.map(value => value.id), [27]);

const repeated = transitionRig(r6.state, r6.look, 'R6');
assert.deepEqual(repeated.state.rigStash.items.map(value => value.id).sort(), [809, 812, 901], 'repeated R6 keeps the stash');
const reloaded = JSON.parse(JSON.stringify(repeated.state));
const r15 = transitionRig(reloaded, repeated.look, 'R15');
assert.deepEqual(r15.look.definition.assets.map(value => value.id).sort(), [27, 809, 812]);
assert.deepEqual(r15.state.equipped.sort(), ['Asset:27','Bundle:901']);
assert.equal('rigStash' in r15.state, true);
assert.equal(r15.state.rigStash, undefined, 'R15 explicitly clears the stash');

const changed = {...reloaded, items:[...reloaded.items, item(28, 27)], equipped:['Asset:28']};
const changedR15 = transitionRig(changed, repeated.look, 'R15');
assert.deepEqual(changedR15.look.definition.assets.map(value => value.id), [27], 'new body selection must not restore old R15 assets');
assert.equal(changedR15.state.rigStash, undefined);

const sameSlot = equip(r6.state, 'Asset:999');
const sameSlotR15 = transitionRig(sameSlot, r6.look, 'R15');
assert.deepEqual(sameSlotR15.look.definition.assets.map(value => value.id).sort(), [27, 812], 'same-slot R6 edits must replace the stale layered item');
console.log('PASS: R6 stash round-trip, repeated R6, reload, unworn inventory, and changed body scope');
