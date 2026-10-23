// One origin-wide render queue for every Roblox tab, editor, and profile.
(() => {
  'use strict';
  const jobs = new Map();
  const cooldownKey = 'larpblox.avatar-render-cooldown';
  const timingKey = 'larpblox.avatar-render-timing';
  let queue = Promise.resolve();
  const cancelled = () => Object.assign(new Error('Avatar request cancelled.'), {name: 'AbortError'});
  const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
  function definitionKey(definition) {
    return JSON.stringify(canonical({...definition, assets:[...(definition.assets || [])].sort((a,b) => a.id - b.id)}));
  }
  function renderDefinition(definition, thumbnailType) {
    const result = {...definition};
    // Local hat styles belong to the game connection, not Roblox's render API.
    result.assets = (definition.assets || []).map(asset => {
      if (!asset.meta || !Object.hasOwn(asset.meta, 'smokestackStyle')) return asset;
      const meta = {...asset.meta}; delete meta.smokestackStyle;
      return Object.keys(meta).length ? {...asset, meta} : {id:asset.id};
    });
    // Backgrounds are loaded by the 3D viewer, not the geometry endpoint.
    if (thumbnailType === '3d') { delete result.backgroundRequestModel; delete result.backgroundId; }
    return JSON.parse(definitionKey(result));
  }
  function timing() {
    let raw;
    try { raw = localStorage.getItem(timingKey); }
    catch (_) { throw new Error('Browser storage is unavailable; the shared avatar queue cannot start.'); }
    let value; try { value = JSON.parse(raw || '{}'); } catch (_) { value = {}; }
    const number = key => Number.isFinite(value?.[key]) && value[key] >= 0 ? value[key] : 0;
    return {nextRequest:number('nextRequest'), blockedUntil:number('blockedUntil'), rateLimits:number('rateLimits')};
  }
  function saveTiming(value) {
    try { localStorage.setItem(timingKey, JSON.stringify(value)); }
    catch (_) { throw new Error('Browser storage is unavailable; the shared avatar queue cannot start.'); }
  }
  function lock(name, signal, work) {
    if (!globalThis.navigator?.locks?.request) return Promise.reject(new Error('This browser cannot coordinate avatar requests across tabs.'));
    return navigator.locks.request(name, signal ? {signal} : {}, work);
  }
  const imageUrl = value => typeof value === 'string' && /^https:\/\/(?:[a-z0-9-]+\.)*rbxcdn\.com\//i.test(value);
  function cached(definition, userId, thumbnailType = '2d') {
    try {
      const key = definitionKey(renderDefinition(definition, thumbnailType));
      const entries = JSON.parse(localStorage.getItem(`larpblox-render-cache:${userId}`) || '[]');
      const match = entries.find(entry => entry.key === key && entry.type === thumbnailType && entry.expires > Date.now() && imageUrl(entry.url));
      if (match) return match.url;
      if (thumbnailType !== '2d') return;
      // Saved character thumbnails already describe this exact outfit. They are
      // useful on first load too, before the render cache has been populated.
      const profiles = JSON.parse(localStorage.getItem(`larpblox-characters-v1:${userId}`) || '{}').profiles || [];
      return profiles.find(profile => String(profile.snapshot?.userId) === String(userId) &&
        profile.snapshot?.definition && definitionKey(renderDefinition(profile.snapshot.definition, thumbnailType)) === key && imageUrl(profile.thumbnail))?.thumbnail;
    } catch (_) { return undefined; }
  }
  function remember(definition, userId, thumbnailType, url) {
    if (!imageUrl(url)) return;
    try {
      const storageKey = `larpblox-render-cache:${userId}`, key = definitionKey(renderDefinition(definition, thumbnailType));
      const entries = JSON.parse(localStorage.getItem(storageKey) || '[]').filter(entry =>
        entry.expires > Date.now() && !(entry.key === key && entry.type === thumbnailType));
      entries.push({key, type:thumbnailType, url, expires:Date.now() + 86400000});
      localStorage.setItem(storageKey, JSON.stringify(entries.slice(-16)));
    } catch (_) {}
  }
  function retryAfter(response, fallback = 20) {
    const value = response.headers.get('retry-after');
    if (value === null) return fallback;
    const seconds = Number(value);
    if (Number.isFinite(seconds) && seconds >= 0) return seconds;
    const date = Date.parse(value);
    return Number.isFinite(date) ? Math.max(0, (date - Date.now()) / 1000) : fallback;
  }
  function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) return reject(cancelled());
      const abort = () => { clearTimeout(timer); reject(cancelled()); };
      const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, Math.min(2147483647, Math.max(0, ms)));
      signal?.addEventListener('abort', abort, {once: true});
    });
  }
  function blockedUntil() {
    let stored = 0;
    try { stored = Number(localStorage.getItem(cooldownKey)) || 0; } catch (_) {}
    return Math.max(stored, timing().blockedUntil, globalThis.LarpbloxRenderBlockedUntil || 0);
  }
  async function waitForRender(signal) {
    while (Date.now() < Math.max(timing().nextRequest, blockedUntil())) {
      await sleep(Math.max(timing().nextRequest, blockedUntil()) - Date.now(), signal);
    }
    if (signal?.aborted) throw cancelled();
  }
  function request(body, token, signal) {
    const pending = queue.then(() => lock('larpblox-avatar-request', signal, async () => {
      await waitForRender(signal);
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal.addEventListener('abort', abort, {once: true});
      const timeout = setTimeout(abort, 20000);
      try {
        const headers = {'Content-Type': 'application/json'};
        if (token) headers['X-CSRF-TOKEN'] = token;
        const shared = timing(); shared.nextRequest = Date.now() + 1000; saveTiming(shared);
        const response = await fetch('https://avatar.roblox.com/v1/avatar/render', {method: 'POST', credentials: 'include', headers, body, signal: controller.signal});
        // Keep the timeout active while the response body is downloading too.
        const result = response.ok ? await response.json() : undefined;
        // Publish backoff BEFORE releasing the request lock. A different tab
        // must never start its queued request between a 429 and this update.
        if (response.status === 429) {
          const shared = timing();
          const seconds = Math.max(retryAfter(response), Math.min(120, 20 * 2 ** Math.min(shared.rateLimits, 3)));
          shared.rateLimits++; shared.blockedUntil = Math.max(blockedUntil(), Date.now() + seconds * 1000);
          saveTiming(shared);
          globalThis.LarpbloxRenderBlockedUntil = shared.blockedUntil;
          try { localStorage.setItem(cooldownKey, String(shared.blockedUntil)); } catch (_) {}
          throw Object.assign(new Error('Avatar render failed (429).'), {status:429, retryAfter:seconds});
        }
        if (result?.state === 'Completed') { const shared = timing(); shared.rateLimits = 0; saveTiming(shared); }
        return {response, result};
      } finally { clearTimeout(timeout); signal.removeEventListener('abort', abort); }
    }));
    // Serialize network requests, not entire outfits waiting for Roblox to render.
    queue = pending.catch(() => {});
    return pending;
  }
  async function run(definition, userId, thumbnailType, signal) {
    const avatarDefinition = renderDefinition(definition, thumbnailType);
    const body = JSON.stringify({avatarDefinition, thumbnailConfig: {thumbnailId: Number(userId), thumbnailType, size: '420x420'}});
    let token = globalThis.LarpbloxRenderToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('data-token');
    const deadline = Date.now() + 300000;
    for (let attempt = 0; Date.now() < deadline; attempt++) {
      const {response, result} = await request(body, token, signal);
      const refreshed = response.headers.get('x-csrf-token');
      if (response.status === 403 && refreshed && refreshed !== token) {
        token = refreshed; globalThis.LarpbloxRenderToken = token; continue;
      }
      if (!response.ok) {
        throw Object.assign(new Error(`Avatar render failed (${response.status}).`), {status: response.status});
      }
      if (result.state === 'Completed' && result.imageUrl) return result.imageUrl;
      if (result.state !== 'Pending') throw new Error('Roblox could not preview this outfit.');
      // A pending render is normal processing, not a rate-limit response.
      // Check promptly; request() still enforces cross-tab pacing and 429 backoff.
      await sleep(attempt === 0 ? 1000 : 2000, signal);
    }
    throw new Error('The avatar preview is still processing. Try again shortly.');
  }
  async function sharedRender(definition, userId, thumbnailType, signal, key) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
    const name = [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
    // Hold an outfit lock across pending polls, but the global network lock
    // only during each request. Other outfits can still progress between polls.
    return lock(`larpblox-avatar-job:${name}`, signal, async () => {
      const previous = cached(definition, userId, thumbnailType);
      if (previous) return previous;
      const remaining = blockedUntil() - Date.now();
      if (remaining > 0) throw Object.assign(new Error('Avatar render failed (429).'), {status:429, retryAfter:Math.ceil(remaining / 1000)});
      const url = await run(definition, userId, thumbnailType, signal);
      // Commit the result before releasing the outfit lock, so waiting tabs
      // consume it without sending the same render again.
      await lock('larpblox-avatar-cache', undefined, () => remember(definition, userId, thumbnailType, url));
      return url;
    });
  }
  function render(definition, userId, signal, thumbnailType = '3d') {
    if (signal?.aborted) return Promise.reject(cancelled());
    const previous = cached(definition, userId, thumbnailType);
    if (previous) return Promise.resolve(previous);
    const key = JSON.stringify([String(userId), thumbnailType, renderDefinition(definition, thumbnailType)]);
    let job = jobs.get(key);
    if (!job || job.controller.signal.aborted) {
      job = {controller: new AbortController(), users: 0, complete: false};
      jobs.set(key, job);
      job.promise = sharedRender(definition, userId, thumbnailType, job.controller.signal, key);
      job.promise.then(() => {
        job.complete = true;
        for (const [oldKey, old] of jobs) if (jobs.size > 16 && old.complete) jobs.delete(oldKey);
      }, () => { if (jobs.get(key) === job) jobs.delete(key); });
    }
    job.users++;
    return new Promise((resolve, reject) => {
      let done = false;
      const finish = (fn, value) => {
        if (done) return;
        done = true; signal?.removeEventListener('abort', abort); job.users--;
        if (!job.users && !job.complete) job.controller.abort();
        fn(value);
      };
      const abort = () => finish(reject, cancelled());
      signal?.addEventListener('abort', abort, {once: true});
      job.promise.then(value => finish(resolve, value), error => finish(reject, error));
    });
  }
  async function gearPose(definition, userId, signal, items = []) {
    if (definition?.playerAvatarType?.playerAvatarType !== 'R15') return undefined;
    const typeOf = item => Number(item?.assetType?.id ?? item?.assetType);
    const equipped = new Set((definition.assets || []).map(asset => Number(asset.id)));
    const gear = items.filter(item => typeOf(item) === 19 && equipped.has(Number(item.id)));
    const heads = new Set(items.filter(item => typeOf(item) === 79 && equipped.has(Number(item.id))).map(item => Number(item.id)));
    if (!gear.length || !heads.size) return undefined;
    const alternate = {
      ...definition,
      assets: (definition.assets || []).filter(asset => !heads.has(Number(asset.id))),
    };
    const child = new AbortController();
    const abort = () => child.abort();
    signal?.addEventListener('abort', abort, {once: true});
    if (signal?.aborted) child.abort();
    const timeout = setTimeout(abort, 20000);
    try { return await render(alternate, userId, child.signal, '3d'); }
    catch (error) {
      if (signal?.aborted) throw error;
      return undefined;
    } finally { clearTimeout(timeout); signal?.removeEventListener('abort', abort); }
  }
  globalThis.LarpbloxAvatarRequests = {render, gearPose, cached, definitionKey, waitForRender, retryAfter};
})();
