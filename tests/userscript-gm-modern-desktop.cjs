const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const runtime = fs.readFileSync(path.join(__dirname, '../userscript-runtime.js'), 'utf8').replace('__USERSCRIPT_VERSION__', JSON.stringify('1.20.193'));
const desktop = fs.readFileSync(path.join(__dirname, '../userscript-desktop.js'), 'utf8');
const values = new Map(), menu = [];
values.set('channel:reply', {ready: true});
const context = {
  console, URL, Response, DOMException, Set, Map, Promise, URLSearchParams, setTimeout, clearTimeout,
  location: {origin: 'https://www.roblox.com', href: 'https://www.roblox.com/home'},
  parent: {}, crypto: {randomUUID: () => 'channel'},
  window: {addEventListener(name, callback) { if (name === "pagehide") this.cleanup = callback; }},
  document: {body: {append() { setTimeout(() => values.set('channel:reply', {ready: true}), 20); }}, documentElement: {append() {}}, createElement() { return {remove() {}}; }},
  GM: {
    async getValue(key) { return values.get(key); },
    async setValue(key, value) {
      values.set(key, value);
      if (key.endsWith(':request')) setTimeout(() => values.set(key.replace(':request', ':reply'), value.id ? [{id: value.id, value: {ok: true}, nonce: 'reply'}, {push: {type: 'push'}, nonce: 'push'}] : {ready: true}), 20);
    },
    async deleteValue(key) { values.delete(key); },
    xmlHttpRequest() { return {abort() {}}; },
    registerMenuCommand(name, callback) { menu.push({name, callback}); },
  },
};
vm.createContext(context);
vm.runInContext(`${runtime}\n${desktop}\nglobalThis.__desktopRequest = desktopRequest; globalThis.__pushes = []; websiteListeners.add(value => __pushes.push(value));`, context);

(async () => {
  context.GM.registerMenuCommand('Open Larpblox', () => {});
  assert.equal(menu[0].name, 'Open Larpblox');
  const result = await context.__desktopRequest({type: 'larpblox-game-bridge', action: 'read'});
  assert.deepEqual(JSON.parse(JSON.stringify(result)), {ok: true});
  await new Promise(resolve => setTimeout(resolve, 450));
  assert.deepEqual(JSON.parse(JSON.stringify(context.__pushes)), [{type: 'push'}]);
  context.window.cleanup();
  console.log('PASS: modern Greasemonkey-shaped APIs register the menu and complete Desktop RPC via polling.');
})().catch(error => { console.error(error); process.exitCode = 1; });
