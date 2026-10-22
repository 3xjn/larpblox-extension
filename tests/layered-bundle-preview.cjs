const assert = require('node:assert/strict');
const {previewDefinition,gamePreviewDefinition} = require('../larpbux.js');
const items = [[138634936434067,65],[72468944066386,66],[131987233005366,67],[86019983967406,79]].map(([id,assetType])=>({id,assetType,itemType:'Asset',name:'Hollow Horseman'}));
const avatar = {assets:[],bodyColor3s:{},scales:{},playerAvatarType:'R6'};
const result = previewDefinition(avatar,{},items);
assert.equal(result.playerAvatarType.playerAvatarType,'R15','layered clothing cannot render on an R6 definition');
for (const [id,order] of [[138634936434067,5],[72468944066386,1],[131987233005366,7]]) {
  assert.deepEqual(result.assets.find(a=>a.id===id).meta,{version:1,order,puffiness:0});
}
const definition = {...result,playerAvatarType:{playerAvatarType:'R6'},assets:result.assets.map(a=>({id:a.id}))};
const repaired = gamePreviewDefinition({items,equipped:items.map(a=>`Asset:${a.id}`),gameLook:{items,definition}});
assert.equal(repaired.playerAvatarType.playerAvatarType,'R15');
assert.equal(repaired.assets.find(a=>a.id===131987233005366).meta.order,7,'older game snapshots also recover their layered metadata');
const custom = previewDefinition(avatar,{},[{...items[0],meta:{version:1,order:11,puffiness:.4}}]);
assert.equal(custom.assets[0].meta.order,11,'preserve saved layer order');
assert.equal(custom.assets[0].meta.puffiness,.4);
assert.equal(previewDefinition(avatar,{},[{id:1,assetType:8,itemType:'Asset'}]).playerAvatarType.playerAvatarType,'R6','rigid accessories retain the chosen rig');
console.log('PASS: Hollow Horseman layered preview metadata, R15, saved order, and old snapshot repair.');
