// One render queue for editor, profile pictures, and saved avatar cards.
(() => {
  'use strict';
  const jobs = new Map();
  const cooldownKey = 'larpblox.avatar-render-cooldown';
  let queue = Promise.resolve(), nextRequest = 0, rateLimits = 0;
  const cancelled = () => Object.assign(new Error('Avatar request cancelled.'), {name: 'AbortError'});
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
    return Math.max(stored, globalThis.LarpbloxRenderBlockedUntil || 0);
  }
  async function waitForRender(signal) {
    while (Date.now() < Math.max(nextRequest, blockedUntil())) {
      await sleep(Math.max(nextRequest, blockedUntil()) - Date.now(), signal);
    }
    if (signal?.aborted) throw cancelled();
  }
  function request(body, token, signal) {
    const pending = queue.then(async () => {
      await waitForRender(signal);
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal.addEventListener('abort', abort, {once: true});
      const timeout = setTimeout(abort, 20000);
      try {
        const headers = {'Content-Type': 'application/json'};
        if (token) headers['X-CSRF-TOKEN'] = token;
        nextRequest = Date.now() + 1000;
        const response = await fetch('https://avatar.roblox.com/v1/avatar/render', {method: 'POST', credentials: 'include', headers, body, signal: controller.signal});
        // Keep the timeout active while the response body is downloading too.
        const result = response.ok ? await response.json() : undefined;
        return {response, result};
      } finally { clearTimeout(timeout); signal.removeEventListener('abort', abort); }
    });
    // Serialize network requests, not entire outfits waiting for Roblox to render.
    queue = pending.catch(() => {});
    return pending;
  }
  async function run(definition, userId, thumbnailType, signal) {
    const avatarDefinition = {...definition};
    // The interactive viewer loads the backdrop separately. Request only avatar
    // geometry here; the native background request belongs to flat thumbnails.
    if (thumbnailType === '3d') {
      delete avatarDefinition.backgroundRequestModel;
      delete avatarDefinition.backgroundId;
    }
    const body = JSON.stringify({avatarDefinition, thumbnailConfig: {thumbnailId: Number(userId), thumbnailType, size: '420x420'}});
    let token = globalThis.LarpbloxRenderToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('data-token');
    for (let attempt = 0; attempt < 32; attempt++) {
      const {response, result} = await request(body, token, signal);
      const refreshed = response.headers.get('x-csrf-token');
      if (response.status === 403 && refreshed && refreshed !== token) {
        token = refreshed; globalThis.LarpbloxRenderToken = token; continue;
      }
      if (!response.ok) {
        const error = Object.assign(new Error(`Avatar render failed (${response.status}).`), {status: response.status});
        if (response.status === 429) {
          error.retryAfter = Math.max(1, retryAfter(response, Math.min(120, 20 * 2 ** rateLimits++)));
          const until = Math.max(blockedUntil(), Date.now() + error.retryAfter * 1000);
          globalThis.LarpbloxRenderBlockedUntil = until;
          try { localStorage.setItem(cooldownKey, String(until)); } catch (_) {}
        }
        throw error;
      }
      if (result.state === 'Completed' && result.imageUrl) { rateLimits = 0; return result.imageUrl; }
      if (result.state !== 'Pending') throw new Error('Roblox could not preview this outfit.');
      await sleep(attempt < 5 ? 1000 : 2000, signal);
    }
    throw new Error('The avatar preview is still processing. Try again shortly.');
  }
  function render(definition, userId, signal, thumbnailType = '3d') {
    if (signal?.aborted) return Promise.reject(cancelled());
    const key = JSON.stringify([String(userId), thumbnailType, definition]);
    let job = jobs.get(key);
    if (!job || job.controller.signal.aborted) {
      job = {controller: new AbortController(), users: 0, complete: false};
      jobs.set(key, job);
      job.promise = run(definition, userId, thumbnailType, job.controller.signal);
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
  globalThis.LarpbloxAvatarRequests = {render, waitForRender, retryAfter};
})();
