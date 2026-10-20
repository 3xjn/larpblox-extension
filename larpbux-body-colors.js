(() => {
  'use strict';
  if (globalThis.__larpbloxBodyColorsHooked) return;
  globalThis.__larpbloxBodyColorsHooked = true;

  const PATHS = new Set(['/v1/avatar/set-body-colors', '/v2/avatar/set-body-colors']);
  const WAIT_MS = 15000;
  let sequence = 0;

  const active = () => /^\/my\/avatar\/?$/i.test(location.pathname) && document.documentElement.classList.contains('larpblox-pretend-mode');
  const target = value => {
    try {
      const url = new URL(value, location.href);
      return url.origin === 'https://avatar.roblox.com' && PATHS.has(url.pathname) ? url.href : null;
    } catch (_) { return null; }
  };
  const userId = () => {
    const current = globalThis.Roblox?.CurrentUser;
    const value = document.querySelector('meta[name="user-data"]')?.getAttribute('data-userid') ?? current?.userId ?? current?.id ?? document.body?.dataset?.userId
      ?? document.querySelector('[data-user-id],[data-userid]')?.dataset?.userId
      ?? document.querySelector('[data-userid]')?.dataset?.userid;
    return value == null ? '' : String(value);
  };
  const parseBody = body => {
    if (typeof body !== 'string') {
      if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) return body;
      throw new Error('Invalid body color request.');
    }
    let parsed;
    try { parsed = JSON.parse(body); } catch (_) { throw new Error('Invalid body color request.'); }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body color request.');
    return parsed;
  };
  const validColors = colors => {
    const value = colors?.bodyColor3s || colors?.bodyColors || colors;
    const parts = ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    let supplied = 0;
    if (!value || !parts.every(part => {
      const color = value[`${part}ColorId`] ?? value[`${part}Color3`] ?? value[`${part}Color`];
      if (color === undefined) return true;
      supplied++;
      return Number.isInteger(color) || (typeof color === 'string' && /^#?[0-9a-f]{6}$/i.test(color));
    }) || !supplied) throw new Error('Invalid body color request.');
    return colors;
  };
  const responseJson = (ok, error) => ok ? {success: true} : {errors: [{message: error || 'The body color change was rejected.'}]};
  const waitForPage = (colors, signal) => new Promise(resolve => {
    const id = `${Date.now()}-${++sequence}`;
    let timer;
    const finish = (ok, error, aborted = false) => {
      clearTimeout(timer); document.removeEventListener('larpblox-body-colors-response', onResponse);
      signal?.removeEventListener('abort', onAbort); resolve({ok, error, aborted});
    };
    const onResponse = event => {
      let detail;
      try { detail = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch (_) { return; }
      if (detail?.id === id) finish(detail.ok === true, detail.error);
    };
    const onAbort = () => finish(false, 'The body color change was cancelled.', true);
    document.addEventListener('larpblox-body-colors-response', onResponse);
    if (signal?.aborted) { onAbort(); return; }
    signal?.addEventListener('abort', onAbort, {once: true});
    timer = setTimeout(() => finish(false, 'The body color change timed out.'), WAIT_MS);
    document.dispatchEvent(new CustomEvent('larpblox-body-colors-request', {
      detail: JSON.stringify({id, userId: userId(), colors}),
    }));
  });
  const synthetic = async (body, signal) => {
    let colors;
    try { colors = validColors(parseBody(body)); }
    catch (error) { return {ok: false, error: error.message}; }
    return waitForPage(colors, signal);
  };
  const jsonResponse = result => new Response(JSON.stringify(responseJson(result.ok, result.error)), {
    status: result.ok ? 200 : 400,
    headers: {'Content-Type': 'application/json'},
  });

  const nativeFetch = globalThis.fetch;
  globalThis.fetch = async function(input, init) {
    if (!active()) return nativeFetch.apply(this, arguments);
    let url = input instanceof Request ? input.url : input;
    url = target(url);
    if (!url) return nativeFetch.apply(this, arguments);
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    if (method !== 'POST') return nativeFetch.apply(this, arguments);
    let body = init?.body;
    if (body === undefined && input instanceof Request) body = await input.clone().text();
    const result = await synthetic(body, init?.signal || (input instanceof Request ? input.signal : undefined));
    if (result.aborted) throw new DOMException('The operation was aborted.', 'AbortError');
    return jsonResponse(result);
  };

  const xhrOpen = XMLHttpRequest.prototype.open;
  const xhrSend = XMLHttpRequest.prototype.send;
  const xhrAbort = XMLHttpRequest.prototype.abort;
  XMLHttpRequest.prototype.open = function(method, url) {
    this.__larpbloxBodyColorAbort?.();
    this.__larpbloxBodyColorAbort = null;
    this.__larpbloxBodyColorController = null;
    for (const name of ['status', 'statusText', 'readyState', 'responseText', 'response']) {
      try { delete this[name]; } catch (_) {}
    }
    this.__larpbloxBodyColorRequest = {method: String(method).toUpperCase(), url: target(url)};
    return xhrOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(body) {
    const request = this.__larpbloxBodyColorRequest;
    if (!active() || !request?.url || request.method !== 'POST') return xhrSend.apply(this, arguments);
    const xhr = this;
    const controller = new AbortController();
    let done = false;
    const finish = async () => {
      const result = await synthetic(body, controller.signal);
      if (done || result.aborted) return;
      done = true; xhr.__larpbloxBodyColorController = null; xhr.__larpbloxBodyColorAbort = null;
      const text = JSON.stringify(responseJson(result.ok, result.error));
      const value = result.ok ? responseJson(true) : responseJson(false, result.error);
      for (const [name, valueToSet] of [['status', result.ok ? 200 : 400], ['statusText', result.ok ? 'OK' : 'Bad Request'], ['readyState', 4], ['responseText', text], ['response', xhr.responseType === 'json' ? value : text]]) {
        try { Object.defineProperty(xhr, name, {configurable: true, value: valueToSet}); } catch (_) {}
      }
      xhr.dispatchEvent(new Event('readystatechange'));
      xhr.dispatchEvent(new ProgressEvent('load'));
      xhr.dispatchEvent(new ProgressEvent('loadend'));
    };
    xhr.dispatchEvent(new ProgressEvent('loadstart'));
    finish();
    xhr.__larpbloxBodyColorController = controller;
    xhr.__larpbloxBodyColorAbort = () => {
      if (done) return;
      done = true; controller.abort(); xhr.__larpbloxBodyColorController = null; xhr.__larpbloxBodyColorAbort = null;
      try { Object.defineProperty(xhr, 'readyState', {configurable: true, value: 0}); } catch (_) {}
      xhr.dispatchEvent(new Event('readystatechange'));
      xhr.dispatchEvent(new ProgressEvent('abort'));
      xhr.dispatchEvent(new ProgressEvent('loadend'));
    };
  };
  XMLHttpRequest.prototype.abort = function() {
    if (this.__larpbloxBodyColorAbort) { this.__larpbloxBodyColorAbort(); return; }
    return xhrAbort.apply(this, arguments);
  };
})();
