const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../larpblox-real-avatar.js'), 'utf8');
const context = vm.createContext({console});
vm.runInContext(`
  var larp = false, ticks = [], nativeCalls = 0;
  var location = {pathname:'/my/avatar'};
  var document = {
    documentElement:{classList:{contains:()=>larp}},
    querySelector:()=>({getAttribute:()=>larp?'larp':'real'})
  };
  var setInterval = callback => ticks.push(callback);
  var nativeAdd = function(added, current) {
    nativeCalls++;
    return [added, ...current.filter(a=>a.assetType.id!==added.assetType.id)];
  };
  var Roblox = {AvatarAccoutrementService:{
    addAssetToAvatar:nativeAdd, getAdvancedAccessoryLimit:type=>type===8?3:1
  }};
  var asset = (id,type) => ({id,assetType:{id:type},meta:{order:id,puffiness:0.3}});
`, context);
vm.runInContext(source, context);
function check(code) { return vm.runInContext(code, context); }
assert.equal(check('Roblox.AvatarAccoutrementService.getAdvancedAccessoryLimit(8)'), undefined);
assert.equal(check('Roblox.AvatarAccoutrementService.getAdvancedAccessoryLimit(11)'), 1);
assert.equal(check(`
  var hair = asset(1,41), secondHair = asset(2,41), shirt = asset(3,11);
  var selected = Roblox.AvatarAccoutrementService.addAssetToAvatar(secondHair,[hair,shirt]);
  selected.length === 3 && selected[1] === hair && selected[1].meta.order === 1;
`), true);
assert.equal(check(`
  var hats = Array.from({length:10},(_,i)=>asset(i+10,8));
  Roblox.AvatarAccoutrementService.addAssetToAvatar(asset(30,8),hats) === hats;
`), true, 'a full avatar must not silently lose a worn accessory');
assert.equal(check(`
  Roblox.AvatarAccoutrementService.addAssetToAvatar(asset(40,67),[asset(41,67)]).length;
`), 2, 'layered items stack');
assert.equal(check(`
  var layers = Array.from({length:10},(_,i)=>asset(i+100,67));
  Roblox.AvatarAccoutrementService.addAssetToAvatar(asset(200,41),layers) === layers;
`), true, 'hair also counts against a full layered budget');
assert.equal(check(`Roblox.AvatarAccoutrementService.addAssetToAvatar(asset(50,11),[shirt,hair]).length`), 2, 'classic clothing still replaces its slot');
assert.equal(check(`Roblox.AvatarAccoutrementService.addAssetToAvatar(hair,[hair]).length`), 1, 'deduplicate accessory IDs');
assert.equal(check(`
  larp = true;
  Roblox.AvatarAccoutrementService.addAssetToAvatar(secondHair,[hair]).length;
`), 1, 'Larp selection stays on its original path');
assert.equal(check('Roblox.AvatarAccoutrementService.getAdvancedAccessoryLimit(8)'), 3);
assert.equal(check(`
  larp = false;
  var moduleExport = {__esModule:true};
  var ready = false;
  Object.defineProperty(moduleExport,'addAssetToAvatar',{enumerable:true,get:function(){
    if (!ready || this !== moduleExport) throw new Error('module not ready');
    return nativeAdd;
  }});
  ready = true;
  moduleExport.addAssetToAvatar(secondHair,[hair]).length;
`), 2, 'modern module export');
assert.equal(check(`
  var other = {};
  Object.defineProperty(other,'unrelated',{get:()=>123});
  other.unrelated;
`), 123);
assert.equal(check(`
  var before = Roblox.AvatarAccoutrementService.addAssetToAvatar;
  ticks[0](); ticks[0]();
  before === Roblox.AvatarAccoutrementService.addAssetToAvatar;
`), true, 'repeated service discovery is idempotent');
// Selection is the only interception: actual saves, removals, CSRF, ownership,
// failures and thumbnail refresh continue through Roblox's untouched native code.
assert.ok(!/window\.fetch|XMLHttpRequest|set-wearing-assets|chrome\.storage/.test(source));
console.log('Real avatar stacking: native and module paths, caps, metadata, Larp isolation passed.');
