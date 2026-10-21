const assert = require('node:assert/strict');
const {
  collect, equip, matchesAvatarCategory, previewDefinition, supportsCosmetic, gamePreviewDefinition, gameOutfitMatches, gameCommand, mergeGameSnapshot,
} = require('../larpbux.js');

const background = {id: 75789087422384, itemType: 'Asset', assetType: 92, name: 'Staring Cat Explosion', price: 200};
let state = {balance: 200, items: [], equipped: []};
state = collect(state, background);
assert.equal(state.balance, 0);
assert.equal(supportsCosmetic(background), true);
assert.equal(matchesAvatarCategory(background, 'Backgrounds'), true);
assert.equal(matchesAvatarCategory(background, 'Recent'), true);
assert.equal(matchesAvatarCategory(background, 'Recent Wearing', false), false);

state = equip(state, 'Asset:75789087422384');
assert.equal(state.backgroundId, background.id);
assert.deepEqual(state.equipped, []);
assert.equal(equip(state, 'Asset:75789087422384').backgroundId, undefined);

const definition = previewDefinition({
  assets: [], bodyColor3s: {headColor3: 'ffffff'}, scales: {}, playerAvatarType: 'R15',
}, {}, [], background.id);
assert.equal(definition.backgroundId, background.id);
assert.deepEqual(definition.backgroundRequestModel, {id: background.id});

const look = {definition: {...definition}, items: []};
const withoutBackground = gamePreviewDefinition({gameLook: look, items: [], equipped: []});
assert.equal('backgroundId' in withoutBackground, false);
assert.equal('backgroundRequestModel' in withoutBackground, false);
assert.equal(gameOutfitMatches({userId: '1', definition: {...definition, backgroundId: 1}, items: []}, {userId: '1', definition: {...definition, backgroundId: 2}, items: []}), false);
const command = gameCommand({...state, gameLook:look}, '1');
assert.equal(command.backgroundId, background.id);
assert.deepEqual(command.backgrounds, [{id:background.id,name:background.name}]);
const cleared = gameCommand({...state, gameLook:look, backgroundId:undefined}, '1');
assert.equal(cleared.backgroundId, 0, 'removal must be explicit across the relay');
assert.equal(gameOutfitMatches({...command, backgroundId:0}, command), false);
assert.equal(mergeGameSnapshot(state, {...command, backgroundId:0}).backgroundId, undefined);
const imported = mergeGameSnapshot({items:[],equipped:[]}, command);
assert.equal(imported.backgroundId, background.id);
assert.equal(imported.items.find(item=>item.id===background.id).assetType,92);
console.log('PASS: type 92 backgrounds purchase, equip, toggle, categorize, and propagate to preview definitions.');
