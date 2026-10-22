const assert = require('node:assert/strict');
const {
  SMOKESTACK_HAT_ID, SMOKESTACK_STYLES, smokestackStyle, hatStyleFor, hatStyleState,
  gamePreviewDefinition, gameOutfitMatches,
} = require('../larpbux.js');

assert.deepEqual(SMOKESTACK_STYLES, ['auto','normal','halloween','thanksgiving','christmas','birthday','stpatricks','valentines','aprilfools']);
assert.equal(smokestackStyle('halloween'), 'halloween');
assert.equal(smokestackStyle('made-up'), 'auto');
let state = {items:[{id:SMOKESTACK_HAT_ID,itemType:'Asset',assetType:8,name:'Rbadam Smokestack'}], equipped:[`Asset:${SMOKESTACK_HAT_ID}`], hatStyles:{}};
state = hatStyleState(state, 'christmas');
assert.equal(hatStyleFor(state), 'christmas');
const look = {userId:'1', definition:{assets:[{id:SMOKESTACK_HAT_ID}],bodyColors:{}}, items:state.items};
const definition = gamePreviewDefinition({...state, gameLook:look});
assert.equal(definition.assets.find(asset => asset.id === SMOKESTACK_HAT_ID).meta.smokestackStyle, 'christmas');
assert.equal(gameOutfitMatches({userId:'1', definition, items:look.items}, {userId:'1', definition, items:look.items}), true);
assert.equal(gameOutfitMatches({userId:'1', definition:{...definition,assets:[{id:SMOKESTACK_HAT_ID,meta:{smokestackStyle:'halloween'}}]},items:look.items}, {userId:'1',definition,items:look.items}), false);
console.log('PASS: Smokestack style choices persist and participate in pending outfit matching.');
