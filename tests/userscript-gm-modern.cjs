const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '../userscript-runtime.js'), 'utf8')
  .replace('__USERSCRIPT_VERSION__', JSON.stringify('1.20.193')) + '\nglobalThis.__storage = storage; globalThis.__gm = {add: gmAddValueChangeListener, remove: gmRemoveValueChangeListener, menu: gmRegisterMenuCommand};';
const values = new Map();
const calls = [];
const context = {
  console, URL, Response, DOMException,
  location: {origin: 'https://www.roblox.com', href: 'https://www.roblox.com/home'},
  GM: {
    async getValue(key) { return values.get(key); },
    async setValue(key, value) { values.set(key, value); },
    async deleteValue(key) { values.delete(key); },
    xmlHttpRequest(options) { calls.push(options); options.onload({status: 200, responseText: '{"ok":true}'}); return {abort(){}}; },
  },
  Set, Map, Promise, URLSearchParams, setTimeout, clearTimeout,
};
vm.createContext(context);
vm.runInContext(source, context);

(async () => {
  await context.__storage.set({answer: 42});
  assert.equal(JSON.stringify(await context.__storage.get('answer')), JSON.stringify({answer: 42}));
  const response = await context.privilegedFetch('https://larp.3xjn.dev/v1/test');
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1, 'modern GM.xmlHttpRequest should be used');
  let changed;
  const listener = context.__gm.add('watch', (_, oldValue, newValue) => { changed = [oldValue, newValue]; });
  await context.GM.setValue('watch', 'next');
  await new Promise(resolve => setTimeout(resolve, 450));
  assert.deepEqual(changed, [undefined, 'next']);
  context.__gm.remove(listener);
  let nativeAdded, nativeRemoved;
  const nativeContext = {...context, GM: {...context.GM,
    addValueChangeListener(key, callback) { nativeAdded = [key, callback]; return Promise.resolve(17); },
    removeValueChangeListener(id) { nativeRemoved = id; },
  }};
  vm.createContext(nativeContext);
  vm.runInContext(`${source}\nglobalThis.__nativeGm = {add: gmAddValueChangeListener, remove: gmRemoveValueChangeListener};`, nativeContext);
  const nativeToken = nativeContext.__nativeGm.add('native-watch', () => {});
  assert.equal(nativeAdded[0], 'native-watch');
  nativeContext.__nativeGm.remove(nativeToken);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(nativeRemoved, 17);
  console.log('PASS: modern GM.* storage and request APIs work without legacy GM_* globals.');
})().catch(error => { console.error(error); process.exitCode = 1; });
