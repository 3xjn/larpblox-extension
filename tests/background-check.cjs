const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const USER = '1585368861';
const CODE = '0123456789abcdef0123456789abcdef';
let pairCode = CODE;
let rejectNextNames = false;
const storage = {'larpblox-game-pair:9': 'legacy-secret-code'};
const requests = [];
let listener;
const extensionId = 'test-extension';

const chrome = {
  runtime: {
    id: extensionId,
    onMessage: { addListener(callback) { listener = callback; } },
  },
  storage: {
    local: {
      async get(keys) {
        if (keys === null) return {...storage};
        if (Array.isArray(keys)) return Object.fromEntries(keys.filter(key => key in storage).map(key => [key, storage[key]]));
        return keys in storage ? { [keys]: storage[keys] } : {};
      },
      async set(values) { Object.assign(storage, values); },
      async remove(key) { for (const item of Array.isArray(key) ? key : [key]) delete storage[item]; },
    },
  },
};

async function fetch(url, options = {}) {
  requests.push({url: String(url), options});
  if (String(url).endsWith('/v1/pair')) return {status: 200, ok: true, async json() { return {code: pairCode}; }};
  if (String(url).includes('/v1/names/') && options.method === 'POST' && rejectNextNames) { rejectNextNames = false; return {status: 401, ok: false, async json() { return {}; }}; }
  if (String(url).endsWith('/v1/status')) return {status: 200, ok: true, async json() { return {version: 1, connected: true, websocket: true, instanceId: 'fixture'}; }};
  if (String(url).includes('/v1/players?')) return {status: 200, ok: true, async json() { return {version: 1, players: []}; }};
  return {status: 200, ok: true, async json() { return {version: 1}; }};
}

const context = {chrome, fetch, AbortController, setTimeout, clearTimeout, Map, Date, Promise, JSON, Number, String, Math, URL, console, LarpbloxGameBridge: require('../larpbux-game-bridge.js'), importScripts() {}};
vm.runInNewContext(fs.readFileSync(require.resolve('../larpbux-game-background.js'), 'utf8'), context, {filename: 'larpbux-game-background.js'});

function send(message, sender = {id: extensionId, url: 'https://www.roblox.com/my/avatar', tab: {id: 1}}) {
  return new Promise(resolve => listener(message, sender, resolve));
}

(async () => {
  let response = await send({type: 'larpblox-game-bridge', action: 'publishNames', userId: USER, names: {version: 1, userId: USER, enabled: false, name: ''}});
  assert.equal(response.ok, true);
  assert.equal('larpblox-game-pair:9' in storage, false, 'legacy persisted bearer codes are removed');
  assert.equal(requests.filter(request => request.url.endsWith('/v1/pair')).length, 1);
  assert.deepEqual(Object.keys(storage), [`larpblox-game-paused:${USER}`]);
  assert.equal(JSON.stringify(storage).includes(CODE), false, 'pairing bearer code must not be persisted');

  response = await send({type: 'larpblox-game-bridge', action: 'disconnect', userId: USER});
  assert.equal(response.ok, true);
  assert.equal(storage[`larpblox-game-paused:${USER}`], true);
  const pairsBeforePausedCall = requests.filter(request => request.url.endsWith('/v1/pair')).length;
  response = await send({type: 'larpblox-game-bridge', action: 'publishNames', userId: USER, names: {version: 1, userId: USER, enabled: false, name: ''}});
  assert.equal(response.data.connected, false);
  assert.equal(requests.filter(request => request.url.endsWith('/v1/pair')).length, pairsBeforePausedCall, 'intentional disconnect must suppress auto-pairing');

  response = await send({type: 'larpblox-game-bridge', action: 'connect', userId: USER});
  assert.equal(response.data.connected, true);
  assert.equal(storage[`larpblox-game-paused:${USER}`], false);
  assert.equal(requests.some(request => request.url.endsWith('/v1/status')), true);

  pairCode = 'fedcba9876543210fedcba9876543210';
  rejectNextNames = true;
  response = await send({type: 'larpblox-game-bridge', action: 'publishNames', userId: USER, names: {version: 1, userId: USER, enabled: false, name: ''}});
  assert.equal(response.ok, true, 'a rejected old helper code should be renewed and retried');
  assert.equal(requests.filter(request => request.url.endsWith('/v1/pair')).length, 3, '401 recovery obtains a fresh local pair code');
  assert.equal(JSON.stringify(storage).includes(pairCode), false, 'rotated pair code remains memory-only');

  const beforeRejected = requests.length;
  response = await send({type: 'larpblox-game-bridge', action: 'publishNames', userId: USER, names: {version: 1, userId: USER, enabled: false, name: ''}}, {id: extensionId, url: 'https://www.roblox.com.evil.example/'});
  assert.equal(response.ok, false);
  assert.equal(requests.length, beforeRejected, 'non-Roblox sender must not reach local helper');

  response = await send({type: 'larpblox-shared-users', userIds: ['2', '2']});
  assert.equal(response.ok, true);
  const playersRequest = requests.find(request => request.url.includes('/v1/players?'));
  assert.match(playersRequest.url, /userIds=2$/);
  assert.equal(playersRequest.options.credentials, 'omit');
  console.log('Background pairing, disconnect, origin, and relay-query checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });


