const assert = require('node:assert/strict');
const {equip} = require('../larpbux.js');

const item = (id, assetType) => ({id, itemType:'Asset', assetType, name:`Item ${id}`});
const key = item => `${item.itemType}:${item.id}`;
const accessoryTypes = [8, 41, 42, 43, 44, 45, 46, 47, 64, 65, 66, 67, 68, 69, 70, 71, 72, 76, 77];
const accessoryGroups = accessoryTypes.map((assetType, group) => Array.from({length:21}, (_, index) => item(group * 100 + index + 1, assetType)));
const body = item(2001, 17);
const bodyBundle = {id:3000, itemType:'Bundle', bundleType:'BodyParts', name:'Body bundle', assets:[item(3001, 27)]};
const items = [...accessoryGroups.flat(), body, bodyBundle, ...bodyBundle.assets];
const empty = {items, equipped:[]};

let state = empty;
for (const group of accessoryGroups) for (const owned of group.slice(0, 20)) state = equip(state, key(owned));
assert.equal(state.equipped.length, 380, 'the limit is 20 for every accessory type');
state = equip(state, key(body));
assert.equal(state.equipped.length, 381, 'body-part edits remain possible in a large outfit');
state = equip(state, key(bodyBundle));
assert.equal(state.equipped.length, 382, 'body bundles can add their body parts beside full accessory categories');
for (const group of accessoryGroups) assert.throws(() => equip(state, key(group[20])), /Equip at most 20/);

const overLimit = {...empty, equipped:accessoryGroups[0].map(key)};
assert.doesNotThrow(() => equip(overLimit, key(body)), 'unrelated body edits preserve an existing over-limit outfit');
console.log('PASS: accessory limits apply per type and preserve unrelated body edits.');

const {validateSnapshot}=require('../larpbux-game-bridge.js');
const worn=state.items.filter(i=>i.itemType==='Asset'&&state.equipped.includes(key(i)));
const snapshot={version:1,userId:'123',definition:{assets:worn.map(({id})=>({id})),bodyColors:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(name=>[name+'Color','ffffff'])),playerAvatarType:{playerAvatarType:'R15'},scales:{}},items:worn};
assert.doesNotThrow(()=>validateSnapshot(snapshot,'123'),'large outfits cross the game bridge');
const oversized=Array.from({length:513},(_,i)=>item(i+1,8));
assert.throws(()=>validateSnapshot({...snapshot,items:oversized,definition:{...snapshot.definition,assets:oversized.map(({id})=>({id}))}},'123'),/Invalid game outfit/);
