/* global chrome, LarpbloxGameBridge, importScripts */
importScripts('larpbux-game-bridge.js');
const ROOT = 'http://127.0.0.1:38261';
const SOCKET = 'ws://127.0.0.1:38261/v1/socket';
const pausedKey = userId => `larpblox-game-paused:${userId}`;
const sockets = new Map();
const tabs = new Map();
const tokens = new Map();
const pairRetryAt = new Map();
const socketTimeout = 2500;
const legacyPairCleanup = chrome.storage.local.get(null).then(saved => {
  const legacy = Object.keys(saved || {}).filter(key => key.startsWith('larpblox-game-pair:'));
  return legacy.length ? chrome.storage.local.remove(legacy) : undefined;
}).catch(() => {});
function notify(userId, snapshot) {
  const tabId = tabs.get(String(userId));
  if (tabId == null || !chrome.tabs?.sendMessage) return;
  try { chrome.tabs.sendMessage(tabId, {type: 'larpblox-game-state', userId: String(userId), snapshot}).catch?.(() => {}); } catch (_) {}
}
function socketFor(userId, token) {
  userId = String(userId);
  const existing = sockets.get(userId);
  // A socket that is temporarily closed may already have a bounded reconnect
  // timer. Reuse it instead of creating a second socket for the same account.
  if (existing && existing.token === token && !existing.closed) return existing;
  if (existing) {
    existing.closed = true;
    if (existing.timer) clearTimeout(existing.timer);
    if (existing.keepalive) clearInterval(existing.keepalive);
    for (const waiter of existing.pending.values()) { clearTimeout(waiter.timer); waiter.reject(new Error('socket replaced')); }
    existing.pending.clear(); existing.queues.clear();
    if (existing.ws) try { existing.ws.close(); } catch (_) {}
  }
  if (typeof WebSocket === 'undefined') return null;
  const entry = {userId, token, ws: null, ready: false, snapshot: undefined, pending: new Map(), queues: new Map(), lastValues: new Map(), reconnects: 0, timer: null, keepalive: null, closed: false};
  sockets.set(userId, entry);
  const connect = () => {
    if (entry.closed) return;
    let ws;
    try { ws = new WebSocket(SOCKET); } catch (_) { schedule(); return; }
    entry.ws = ws;
    ws.onopen = () => { ws.send(JSON.stringify({version: 1, type: 'auth', token, userId, role: 'browser'})); };
    ws.onmessage = event => {
      let message; try { message = JSON.parse(event.data); } catch (_) { return; }
      if (message?.type === 'ready') {
        entry.ready = true;
        entry.reconnects = 0;
        if (!entry.keepalive) entry.keepalive = setInterval(() => { try { ws.send(JSON.stringify({type: 'ping'})); } catch (_) {} }, 20000);
        // Replay the latest desired value for each channel after a helper restart.
        for (const [channel, value] of entry.lastValues) {
          const queue = entry.queues.get(channel) || [];
          if (!queue.some(waiter => JSON.stringify(waiter.value) === JSON.stringify(value))) queue.push({resolve() {}, reject() {}, value, timer:null, replay:true});
          entry.queues.set(channel, queue);
        }
        for (const channel of entry.queues.keys()) entry.pump?.(channel);
      } else if (message?.type === 'state' && message.channel === 'game') {
        try { entry.snapshot = message.value == null ? null : LarpbloxGameBridge.validateSnapshot(message.value, userId); } catch (_) { return; }
        notify(userId, entry.snapshot);
      } else if (message?.type === 'ack') {
        const waiter = entry.pending.get(message.channel);
        if (waiter) { entry.pending.delete(message.channel); clearTimeout(waiter.timer); waiter.resolve(message.value); pump(message.channel); }
      }
    };
    ws.onerror = () => { try { ws.close(); } catch (_) {} };
    ws.onclose = () => { entry.ready = false; if (entry.keepalive) { clearInterval(entry.keepalive); entry.keepalive = null; } for (const waiter of entry.pending.values()) { clearTimeout(waiter.timer); waiter.reject(new Error('socket closed')); } entry.pending.clear(); schedule(); };
  };
  const schedule = () => { if (entry.closed || entry.timer) return; entry.timer = setTimeout(() => { entry.timer = null; entry.reconnects++; connect(); }, Math.min(1000 * 2 ** Math.min(entry.reconnects, 4), 15000)); };
  const pump = channel => {
    if (!entry.ready || entry.pending.has(channel)) return;
    const queue = entry.queues.get(channel); const waiter = queue?.[0];
    if (!waiter) return;
    queue.shift(); entry.pending.set(channel, waiter);
    waiter.timer = setTimeout(() => {
      entry.pending.delete(channel);
      try { entry.ws.close(); } catch (_) {}
      waiter.reject(new Error('socket timeout'));
    }, socketTimeout);
    try { entry.ws.send(JSON.stringify({type: 'publish', channel, value: waiter.value})); } catch (error) { clearTimeout(waiter.timer); entry.pending.delete(channel); waiter.reject(error); pump(channel); }
  };
  entry.pump = pump; entry.connect = connect; entry.schedule = schedule; connect();
  return entry;
}
async function socketRequest(userId, token, channel, value, read = false) {
  const entry = socketFor(userId, token);
  if (entry && !read) entry.lastValues.set(channel, value);
  if (!entry || !entry.ready || !entry.ws || entry.ws.readyState !== 1) throw new Error('socket unavailable');
  if (read) return entry.snapshot;
  return await new Promise((resolve, reject) => {
    if (!entry.queues.has(channel)) entry.queues.set(channel, []);
    entry.queues.get(channel).push({resolve, reject, value, timer: null});
    entry.pump(channel);
  });
}
async function call(path, token, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(ROOT + path, {method: body ? 'POST' : 'GET', credentials: 'omit', cache: 'no-store', signal: controller.signal,
      headers: {...(token ? {Authorization: `Bearer ${token}`} : {}), ...(body ? {'Content-Type': 'application/json'} : {})}, ...(body ? {body: JSON.stringify(body)} : {})});
    if (response.status === 404) return null;
    if (response.status === 401) { const error = new Error('Connection code rejected.'); error.codeRejected = true; throw error; }
    if (!response.ok) throw new Error('The local helper rejected the connection request.');
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError || error.name === 'AbortError') throw new Error('Waiting for the local helper. The extension will retry automatically.');
    throw error;
  } finally { clearTimeout(timer); }
}
async function localCall(userId, path, body, forcePair = false) {
  let token = await localToken(userId, forcePair);
  try { return await call(path, token, body); }
  catch (error) {
    if (!error.codeRejected) throw error;
    tokens.delete(userId);
    pairRetryAt.delete(userId);
    token = await localToken(userId, true);
    return await call(path, token, body);
  }
}
async function localToken(userId, retry = false) {
  await legacyPairCleanup;
  const paused = pausedKey(userId);
  const saved = await chrome.storage.local.get(paused);
  if (saved[paused] && !retry) return null;
  if (tokens.has(userId) && !retry) return tokens.get(userId);
  if (!retry && Date.now() < (pairRetryAt.get(userId) || 0)) throw new Error('Waiting for the local helper. The extension will retry automatically.');
  let pair;
  try { pair = await call('/v1/pair', ''); }
  catch (error) { pairRetryAt.set(userId, Date.now() + 5000); throw error; }
  if (!/^[0-9a-f]{32}$/.test(pair?.code || '')) {
    pairRetryAt.set(userId, Date.now() + 5000);
    throw new Error('Open the Larpblox app to connect. The extension will retry automatically.');
  }
  tokens.set(userId, pair.code);
  pairRetryAt.delete(userId);
  await chrome.storage.local.set({[paused]: false});
  return pair.code;
}
async function handle(message, sender) {
  if (!/^https:\/\/www\.roblox\.com\//.test(sender.url || '') || sender.id !== chrome.runtime.id) throw new Error('Connection is available only on Roblox.');
  const userId = String(message.userId || '');
  if (!/^[1-9]\d{0,15}$/.test(userId) || !Number.isSafeInteger(Number(userId))) throw new Error('Invalid Roblox account.');
  if (sender.tab?.id != null) tabs.set(userId, sender.tab.id);
  if (message.action === 'disconnect') {
    const token = tokens.get(userId);
    await chrome.storage.local.set({[pausedKey(userId)]: true});
    if (token) try { await call(`/v1/names/${userId}`, token, {version: 1, userId, enabled: false, name: ''}); } catch (_) {}
    tokens.delete(userId); pairRetryAt.delete(userId);
    const entry = sockets.get(userId); if (entry) { entry.closed = true; if (entry.timer) clearTimeout(entry.timer); if (entry.keepalive) clearInterval(entry.keepalive); try { entry.ws?.close(); } catch (_) {} sockets.delete(userId); }
    return {connected: false};
  }
  if (message.action === 'connect') {
    const status = await localCall(userId, '/v1/status', undefined, true);
    if (!status?.connected || status.version !== 1 || status.websocket !== true || typeof status.instanceId !== 'string' || !status.instanceId) throw new Error('Unsupported local helper.');
    await chrome.storage.local.set({[pausedKey(userId)]: false});
    return {connected: true};
  }
  const token = await localToken(userId);
  if (!token) return {connected: false};
  const socketValue = message.action === 'publish' ? LarpbloxGameBridge.validateSnapshot(message.snapshot, userId) : message.action === 'publishNames' ? LarpbloxGameBridge.validateNames(message.names, userId) : message.action === 'publishImage' ? LarpbloxGameBridge.validateImage(message.image, userId) : undefined;
  if (message.action === 'read') {
    let snapshot;
    try { snapshot = await socketRequest(userId, token, 'game', undefined, true); } catch (_) { snapshot = await localCall(userId, `/v1/game/${userId}`); }
    return {connected: true, snapshot: snapshot && LarpbloxGameBridge.validateSnapshot(snapshot, userId)};
  }
  if (message.action === 'publish') {
    try { await socketRequest(userId, token, 'browser', {version: 1, userId, definition: socketValue.definition, items: socketValue.items}); } catch (_) { await localCall(userId, `/v1/browser/${userId}`, {version: 1, userId, definition: socketValue.definition, items: socketValue.items}); }
    return {connected: true};
  }
  if (message.action === 'publishNames') {
    try { await socketRequest(userId, token, 'names', socketValue); } catch (_) { await localCall(userId, `/v1/names/${userId}`, socketValue); }
    return {connected: true};
  }
  if (message.action === 'publishImage') {
    try { await socketRequest(userId, token, 'image', socketValue); } catch (_) { await localCall(userId, `/v1/image/${userId}`, socketValue); }
    return {connected: true};
  }
  throw new Error('Unsupported connection action.');
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.type === 'larpblox-shared-users') {
    if (!/^https:\/\/www\.roblox\.com\//.test(sender.url || '') || sender.id !== chrome.runtime.id || !Array.isArray(message.userIds) || message.userIds.length > 50 || !message.userIds.length || message.userIds.some(id => !/^[1-9]\d{0,15}$/.test(String(id)) || !Number.isSafeInteger(Number(id)))) {
      respond({ok:false}); return false;
    }
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 5000);
    const userIds = [...new Set(message.userIds.map(String))];
    if (userIds.length > 50) { respond({ok:false}); return false; }
    fetch('https://larp.3xjn.dev/v1/players?userIds=' + userIds.join(','), {credentials:'omit',cache:'no-store',signal:controller.signal})
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(data => respond({ok:true,data}), () => respond({ok:false}))
      .finally(() => clearTimeout(timer));
    return true;
  }
  if (message?.type !== 'larpblox-game-bridge') return false;
  handle(message, sender).then(data => respond({ok: true, data}), error => respond({ok: false, error: error.message}));
  return true;
});
