const assert = require('node:assert/strict');
const {equip, gamePreviewDefinition, previewDefinition, supportsOutfit} = require('../larpbux.js');

const hat = {id:101, itemType:'Asset', name:'Try On Hat', assetType:8};
const shirt = {id:102, itemType:'Asset', name:'Try On Shirt', assetType:11};
const shirt2 = {id:104, itemType:'Asset', name:'Second Try On Shirt', assetType:11};
const pants = {id:103, itemType:'Asset', name:'Try On Pants', assetType:12};
const bundle = {id:201, itemType:'Bundle', name:'Try On Bundle', bundleType:'BodyParts', assets:[
  {id:301, itemType:'Asset', name:'Bundle Head', assetType:17},
  {id:302, itemType:'Asset', name:'Bundle Shirt', assetType:11},
  {id:303, itemType:'Asset', name:'Bundle Hat', assetType:8},
]};
const dynamicHead = {id:202, itemType:'Bundle', name:'Try On Dynamic Head', bundleType:'DynamicHead', assets:[
  {id:304, itemType:'Asset', name:'Dynamic Head', assetType:79},
]};

const base = {
  mode:true, balance:999, items:[hat, shirt, shirt2, pants, bundle, ...bundle.assets, dynamicHead, ...dynamicHead.assets],
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
const packageTryOn = equip({...base, equipped:['Asset:101','Asset:102','Asset:103']}, 'Bundle:201');
assert.deepEqual(packageTryOn.equipped, ['Asset:301','Asset:302','Asset:303'], 'full body packages replace the old outfit');
const packagePreview = gamePreviewDefinition(packageTryOn);
assert.ok(packagePreview.assets.some(asset => asset.id === 303), 'full package preview includes its hat');
assert.ok(!packagePreview.assets.some(asset => asset.id === 900 || asset.id === 101), 'full package preview removes old hats');
const browserPackagePreview = previewDefinition({assets:[{id:900, assetType:{id:8}},{id:901, assetType:{id:44}}], bodyColors:{}, scales:{}}, {}, bundle.assets, undefined, true);
assert.ok(browserPackagePreview.assets.some(asset => asset.id === 303), 'browser package preview includes its hat');
assert.ok(!browserPackagePreview.assets.some(asset => asset.id === 900 || asset.id === 901), 'browser package preview removes native accessories');
const packageRemoved = equip(packageTryOn, 'Bundle:201');
assert.deepEqual(packageRemoved.equipped, [], 'wearing a full body package again removes its included parts');
const dynamicHeadTryOn = equip({...base, equipped:['Asset:101','Asset:102','Asset:103']}, 'Bundle:202');
assert.ok(dynamicHeadTryOn.equipped.includes('Asset:101'), 'dynamic heads remain additive to existing accessories');

// The derived preview replaces matching slots while preserving the Larp base.
const preview = gamePreviewDefinition({...base, items:[...base.items, hat], equipped:['Asset:101']});
assert.ok(preview.assets.some(asset => asset.id === 101));
assert.ok(!preview.assets.some(asset => asset.id === 900));
assert.deepEqual(base.equipped, ['Asset:101','Asset:102','Asset:103'], 'Try On must not mutate the saved outfit');
assert.equal(base.balance, 999, 'Try On must not charge pretend currency');
assert.equal(base.mode, true);
console.log('PASS: catalog Try On slot replacement, bundle assets, and no-persistence invariants');
