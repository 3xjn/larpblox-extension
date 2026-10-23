const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
for(const saved of [null,'classic','modern']) {
  const classes=new Set(['rbx2016','dark-theme']);
  const storage=new Map(saved?[['larpblox-browser-appearance',saved]]:[]);
  const context={
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
    location:{reload(){}},
    document:{documentElement:{classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k)}},addEventListener(){}},
  };
  vm.runInNewContext(fs.readFileSync(path.join(root,'appearance.js'),'utf8'),context);
  assert.equal(context.LarpbloxAppearance.get(),'modern');
  assert(classes.has('larpblox-modern')&&!classes.has('rbx2016'));
  assert(classes.has('dark-theme'),'Preserve Roblox light/dark preference');
  context.LarpbloxAppearance.set('classic',false);
  assert.equal(context.LarpbloxAppearance.get(),'modern');
  assert.equal(storage.get('larpblox-browser-appearance'),'modern');
}
const scripts=JSON.parse(fs.readFileSync(path.join(root,'website-sources.json'),'utf8')).js;
for(const file of scripts.filter(name=>name.startsWith('classic'))) {
  const forbidden=new Proxy({}, {get(){throw Error(file+' changed the modern page');}});
  vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),{LarpbloxAppearance:{get:()=> 'modern'},document:forbidden,location:forbidden});
}
assert(!fs.readFileSync(path.join(root,'src/popup/main.tsx'),'utf8').includes('id="appearance"'));
console.log('PASS: new installs and saved classic preferences use current Roblox; classic scripts stay inactive and the theme selector is removed.');
