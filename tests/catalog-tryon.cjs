const assert = require('node:assert/strict');
const {equip, gamePreviewDefinition, supportsOutfit} = require('../larpbux.js');

const hat = {id:101, itemType:'Asset', name:'Try On Hat', assetType:8};
const shirt = {id:102, itemType:'Asset', name:'Try On Shirt', assetType:11};
const shirt2 = {id:104, itemType:'Asset', name:'Second Try On Shirt', assetType:11};
const pants = {id:103, itemType:'Asset', name:'Try On Pants', assetType:12};
const bundle = {id:201, itemType:'Bundle', name:'Try On Bundle', bundleType:'BodyParts', assets:[
  {id:301, itemType:'Asset', name:'Bundle Head', assetType:17},
  {id:302, itemType:'Asset', name:'Bundle Shirt', assetType:11},
]};

const base = {
  mode:true, balance:999, items:[hat, shirt, shirt2, pants, bundle, ...bundle.assets],
  equipped:['Asset:101','Asset:102','Asset:103'],
  gameLook:{definition:{assets:[{id:900},{id:901},{id:902}], bodyColors:{}, scales:{}}, items:[
    {id:900,itemType:'Asset',assetType:8,name:'Old Hat'},
    {id:901,itemType:'Asset',assetType:11,name:'Old Shirt'},
    {id:902,itemType:'Asset',assetType:12,name:'Old Pants'},
  ]},
};

assert.equal(supportsOutfit(bundle), true);
const hatTryOn = equip({...base, equipped:base.equipped.slice(1)}, 'Asset:101');
assert.ok(hatTryOn.equipped.includes('Asset:101'));
const shirtTryOn = equip({...base, equipped:base.equipped}, 'Asset:104');
assert.ok(shirtTryOn.equipped.includes('Asset:104'));
assert.ok(!shirtTryOn.equipped.includes('Asset:102'), 'trying on clothing replaces its slot');
const bundleTryOn = equip({...base, equipped:[]}, 'Asset:301');
assert.ok(bundleTryOn.equipped.includes('Asset:301'));

// The derived preview replaces matching slots while preserving the Larp base.
const preview = gamePreviewDefinition({...base, items:[...base.items, hat], equipped:['Asset:101']});
assert.ok(preview.assets.some(asset => asset.id === 101));
assert.ok(!preview.assets.some(asset => asset.id === 900));
assert.deepEqual(base.equipped, ['Asset:101','Asset:102','Asset:103'], 'Try On must not mutate the saved outfit');
assert.equal(base.balance, 999, 'Try On must not charge pretend currency');
assert.equal(base.mode, true);
console.log('PASS: catalog Try On slot replacement, bundle assets, and no-persistence invariants');
