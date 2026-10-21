/* global chrome, LarpbloxGameBridge, importScripts */
importScripts('larpbux-game-bridge.js', 'remote-loader.js');
const ROOT = 'http://127.0.0.1:38261';
const SOCKET = 'ws://127.0.0.1:38261/v1/socket';
const storageKey = userId => `larpblox-game-pair:${userId}`;
const pairing = new Map();
const sockets = new Map();
const tabs = new Map();
const websitePorts = new Map();
chrome.runtime.onUserScriptConnect.addListener(port => {
  if (port.name !== 'larpblox-website' || port.sender?.id !== chrome.runtime.id || !/^https:\/\/www\.roblox\.com\//.test(port.sender?.url || '')) return;
  const id = port.sender.tab?.id;
  if (id == null) return;
  websitePorts.set(id, port);
  port.onDisconnect.addListener(() => { if (websitePorts.get(id) === port) websitePorts.delete(id); });
});
const socketTimeout = 2500;
function notify(userId, snapshot) {
  const tabId = tabs.get(String(userId));
  if (tabId == null || !chrome.tabs?.sendMessage) return;
  const message = {type: 'larpblox-game-state', userId: String(userId), snapshot};
  try { websitePorts.get(tabId)?.postMessage(message); } catch (_) {}
}
function socketFor(userId, token) {
  userId = String(userId);
  const existing = sockets.get(userId);
  // A socket that is temporarily closed may already have a bounded reconnect
  // timer. Reuse it instead of creating a second socket for the same account.
  if (existing && !existing.closed) {
    if (existing.token !== token) {
      existing.token = token; existing.ready = false;
      try { existing.ws?.close(); } catch (_) {}
      existing.schedule?.();
    }
    if (!existing.ready && !existing.timer && !existing.connecting && (!existing.ws || existing.ws.readyState === WebSocket.CLOSED)) existing.schedule?.();
    return existing;
  }
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
  const connect = async () => {
    if (entry.closed || entry.connecting || (entry.ws && entry.ws.readyState !== WebSocket.CLOSED)) return;
    entry.connecting = true;
    try { entry.token = await localToken(userId, true); }
    catch (_) { entry.connecting = false; schedule(); return; }
    entry.connecting = false;
    if (entry.closed) return;
    let ws;
    try { ws = new WebSocket(SOCKET); } catch (_) { schedule(); return; }
    entry.ws = ws;
    ws.onopen = () => { ws.send(JSON.stringify({version: 1, type: 'auth', token: entry.token, userId, role: 'browser'})); };
    const authenticationTimeout = setTimeout(() => { if (!entry.ready) ws.close(); }, 5000);
    ws.onmessage = event => {
      let message; try { message = JSON.parse(event.data); } catch (_) { return; }
      if (message?.type === 'ready') {
        clearTimeout(authenticationTimeout);
        entry.reconnects = 0; entry.ready = true;
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
    ws.onclose = () => { clearTimeout(authenticationTimeout); entry.ready = false; if (entry.keepalive) { clearInterval(entry.keepalive); entry.keepalive = null; } for (const waiter of entry.pending.values()) { clearTimeout(waiter.timer); waiter.reject(new Error('socket closed')); } entry.pending.clear(); schedule(); };
  };
  const schedule = () => { if (entry.closed || entry.timer) return; entry.timer = setTimeout(() => { entry.timer = null; entry.reconnects = Math.min(entry.reconnects + 1, 5); connect(); }, Math.min(1000 * 2 ** entry.reconnects, 30000)); };
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
      headers: {Authorization: `Bearer ${token}`, ...(body ? {'Content-Type': 'application/json'} : {})}, ...(body ? {body: JSON.stringify(body)} : {})});
    if (response.status === 404) return null;
    if (response.status === 401) { const error = new Error('Renewing the desktop connection…'); error.status = 401; throw error; }
    if (!response.ok) throw new Error('The local helper rejected the outfit data.');
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError || error.name === 'AbortError') throw new Error('Waiting for the local helper. Your pairing is saved and will reconnect automatically.');
    throw error;
  } finally { clearTimeout(timer); }
}
async function localToken(userId, renew = false) {
  const key = storageKey(userId);
  if (pairing.has(userId)) return pairing.get(userId);
  if (!renew) {
    const saved = await chrome.storage.local.get(key);
    if (/^[0-9a-f]{32}$/.test(saved[key] || '')) return saved[key];
  }
  const pending = (async () => {
    const pair = await call('/v1/pair', '');
    if (!/^[0-9a-f]{32}$/.test(pair?.code || '')) throw new Error('Waiting for Larpblox Desktop.');
    await chrome.storage.local.set({[key]: pair.code});
    // Older versions persisted a manual-disconnect flag. Connection is automatic now.
    await chrome.storage.local.remove(`larpblox-game-paused:${userId}`);
    return pair.code;
  })();
  pairing.set(userId, pending);
  try { return await pending; } finally { if (pairing.get(userId) === pending) pairing.delete(userId); }
}
async function accountCall(userId, path, body) {
  try { return await call(path, await localToken(userId), body); }
  catch (error) {
    if (error.status !== 401) throw error;
    const token = await localToken(userId, true);
    socketFor(userId, token);
    return await call(path, token, body);
  }
}
async function handle(message, sender) {
  if (!/^https:\/\/www\.roblox\.com\//.test(sender.url || '') || sender.id !== chrome.runtime.id) throw new Error('Connection is available only on Roblox.');
  const userId = String(message.userId || '');
  if (!/^[1-9]\d{0,15}$/.test(userId) || !Number.isSafeInteger(Number(userId))) throw new Error('Invalid Roblox account.');
  if (sender.tab?.id != null) tabs.set(userId, sender.tab.id);
  const token = await localToken(userId);
  const socketValue = message.action === 'publish' ? LarpbloxGameBridge.validateSnapshot(message.snapshot, userId) : message.action === 'publishNames' ? LarpbloxGameBridge.validateNames(message.names, userId) : message.action === 'publishImage' ? LarpbloxGameBridge.validateImage(message.image, userId) : undefined;
  if (message.action === 'read') {
    let snapshot;
    try { snapshot = await socketRequest(userId, token, 'game', undefined, true); } catch (_) { snapshot = await accountCall(userId, `/v1/game/${userId}`); }
    return {connected: true, snapshot: snapshot && LarpbloxGameBridge.validateSnapshot(snapshot, userId)};
  }
  if (message.action === 'publish') {
    try { await socketRequest(userId, token, 'browser', {version: 1, userId, definition: socketValue.definition, items: socketValue.items}); } catch (_) { await accountCall(userId, `/v1/browser/${userId}`, {version: 1, userId, definition: socketValue.definition, items: socketValue.items}); }
    return {connected: true};
  }
  if (message.action === 'publishNames') {
    try { await socketRequest(userId, token, 'names', socketValue); } catch (_) { await accountCall(userId, `/v1/names/${userId}`, socketValue); }
    return {connected: true};
  }
  if (message.action === 'publishImage') {
    try { await socketRequest(userId, token, 'image', socketValue); } catch (_) { await accountCall(userId, `/v1/image/${userId}`, socketValue); }
    return {connected: true};
  }
  throw new Error('Unsupported connection action.');
}
function onBridgeMessage(message, sender, respond) {
  if (message?.type === 'larpblox-publish-profile') {
    if (!/^https:\/\/www\.roblox\.com\//.test(sender.url || '') || sender.id !== chrome.runtime.id || !/^[1-9]\d{0,15}$/.test(String(message.userId))) {
      respond({ok:false}); return false;
    }
    try {
      if (message.record) LarpbloxGameBridge.validateSnapshot(message.record.snapshot, message.userId);
    } catch (_) { respond({ok:false}); return false; }
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 5000);
    fetch('https://larp.3xjn.dev/v1/profiles/' + message.userId, {method:message.record ? 'PUT' : 'DELETE',credentials:'omit',signal:controller.signal,
      ...(message.record ? {headers:{'Content-Type':'application/json'},body:JSON.stringify(message.record)} : {})})
      .then(response => respond({ok:response.ok}), () => respond({ok:false}))
      .finally(() => clearTimeout(timer));
    return true;
  }
  if (message?.type === 'larpblox-search-users') {
    if (!/^https:\/\/www\.roblox\.com\//.test(sender.url || '') || sender.id !== chrome.runtime.id || typeof message.keyword !== 'string' || !message.keyword.trim() || message.keyword.length > 50) {
      respond({ok:false}); return false;
    }
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 5000);
    fetch('https://larp.3xjn.dev/v1/profiles?keyword=' + encodeURIComponent(message.keyword.trim()), {credentials:'omit',cache:'no-store',signal:controller.signal})
      .then(async response => respond(response.ok ? {ok:true,data:await response.json()} : {ok:false}), () => respond({ok:false}))
      .catch(() => respond({ok:false})).finally(() => clearTimeout(timer));
    return true;
  }
  if (message?.type === 'larpblox-shared-users') {
    if (!/^https:\/\/www\.roblox\.com\//.test(sender.url || '') || sender.id !== chrome.runtime.id || !Array.isArray(message.userIds) || message.userIds.length > 50 || !message.userIds.length || message.userIds.some(id => !/^[1-9]\d{0,15}$/.test(String(id)))) {
      respond({ok:false}); return false;
    }
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 5000);
    Promise.all(['/v1/players', '/v1/profiles'].map(path => fetch('https://larp.3xjn.dev' + path + '?userIds=' + message.userIds.join(','), {credentials:'omit',cache:'no-store',signal:controller.signal})
      .then(response => response.ok ? response.json() : {players:[]})))
      .then(([presence, profiles]) => ({version:1,players:[...new Map([...(presence.players || []), ...(profiles.players || [])].map(record => [String(record.userId),record])).values()]}))
      .then(data => respond({ok:true,data}), () => respond({ok:false}))
      .finally(() => clearTimeout(timer));
    return true;
  }
  if (message?.type !== 'larpblox-game-bridge') return false;
  handle(message, sender).then(data => respond({ok: true, data}), error => respond({ok: false, error: error.message}));
  return true;
}
chrome.runtime.onMessage.addListener(onBridgeMessage);
chrome.runtime.onUserScriptMessage.addListener(onBridgeMessage);
