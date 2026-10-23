const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../larpblox-avatar-requests.js'), 'utf8');
const storage = new Map();
const sent = [];
const context = {
  ...require('./helpers/render-locks.cjs')(), AbortController, Date, setTimeout, clearTimeout,
  TextEncoder, crypto: require('node:crypto').webcrypto,
  document: {querySelector: () => null},
  localStorage: {getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value)},
  fetch: async (url, options) => {
    sent.push(JSON.parse(options.body));
    return {ok: true, status: 200, headers: {get: () => null}, json: async () => ({
      state: 'Completed', imageUrl: 'https://tr.rbxcdn.com/pose-descriptor',
    })};
  },
};
vm.createContext(context);
vm.runInContext(source, context);

(async () => {
  const requests = context.LarpbloxAvatarRequests;
  const definition = {
    assets: [{id: 25740034}, {id: 15058381150}, {id: 999, meta: {order: 1}}],
    bodyColors: {headColor: '#eab892'}, scales: {height: 1, width: .85},
    playerAvatarType: {playerAvatarType: 'R15'},
  };
  const items = [
    {id: 25740034, assetType: 19, name: 'Sword Cane'},
    {id: 15058381150, assetType: 79, name: 'Thousand Yard Stare'},
  ];
  assert.equal(await requests.gearPose(definition, 7446730, new AbortController().signal, items), 'https://tr.rbxcdn.com/pose-descriptor');
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].avatarDefinition.assets, [{id: 999, meta: {order: 1}}, {id: 25740034}], 'only the equipped dynamic head is removed');
  assert.equal(sent[0].avatarDefinition.playerAvatarType.playerAvatarType, 'R15');
  assert.deepEqual(sent[0].avatarDefinition.scales, definition.scales);
  assert.deepEqual(sent[0].avatarDefinition.bodyColors, definition.bodyColors);
  assert.equal(definition.assets.length, 3, 'the original definition is not mutated');
  assert.equal(await requests.gearPose(definition, 7446730, new AbortController().signal, items), 'https://tr.rbxcdn.com/pose-descriptor');
  assert.equal(sent.length, 1, 'the fallback descriptor is cached');

  assert.equal(await requests.gearPose({...definition, playerAvatarType: {playerAvatarType: 'R6'}}, 1, new AbortController().signal, items), undefined);
  assert.equal(await requests.gearPose(definition, 1, new AbortController().signal, [items[1]]), undefined);
  assert.equal(await requests.gearPose(definition, 1, new AbortController().signal, [items[0]]), undefined);
  assert.equal(await requests.gearPose(definition, 1, new AbortController().signal, [
    ...items,
    {id: 444, assetType: 19, name: 'Unequipped Gear'},
    {id: 555, assetType: 79, name: 'Unequipped Head'},
  ]), 'https://tr.rbxcdn.com/pose-descriptor');
  assert.deepEqual(sent.at(-1).avatarDefinition.assets, [{id: 999, meta: {order: 1}}, {id: 25740034}], 'wardrobe gear and heads absent from the definition must not enter the fallback request');

  const wardrobeOnly = {...definition, assets: [{id: 999, meta: {order: 1}}]};
  assert.equal(await requests.gearPose(wardrobeOnly, 1, new AbortController().signal, [
    {id: 444, assetType: 19}, {id: 555, assetType: 79},
  ]), undefined, 'unequipped wardrobe items must be a no-op');

  const controller = new AbortController(); controller.abort();
  await assert.rejects(requests.gearPose(definition, 9999, controller.signal, items), {name: 'AbortError'});
  console.log('PASS: R15 gear pose fallback strips only the equipped dynamic head, preserves the pose inputs, caches the descriptor, and no-ops for unsupported outfits.');
})().catch(error => { console.error(error); process.exitCode = 1; });
