(() => {
  'use strict';
  if (globalThis.__larpbloxBodyColorsHooked) return;
  globalThis.__larpbloxBodyColorsHooked = true;

  const PATHS = new Set(['/v1/avatar/set-body-colors', '/v2/avatar/set-body-colors', '/v1/avatar/set-scales', '/v2/avatar/set-scales', '/v1/avatar/set-player-avatar-type', '/v2/avatar/set-player-avatar-type', '/v4/avatar']);
  const READ_PATHS = new Set(['/v1/avatar', '/v2/avatar/avatar']);
  const WAIT_MS = 15000;
  let sequence = 0;

  const savedMode = () => {
    try { return JSON.parse(localStorage.getItem(`larpblox-cosmetics-v1:${userId()}`))?.mode === true; } catch (_) { return false; }
  };
  const active = () => {
    if (!/^\/my\/avatar\/?$/i.test(location.pathname)) return false;
    const view = document.querySelector('#avatar-web-app')?.getAttribute('data-larpbux-avatar-view');
    if (view === 'real') return false;
    const modeActive = document.documentElement.classList.contains('larpblox-pretend-mode') || savedMode();
    return modeActive && (view === 'larp' || view == null);
  };
  const writePath = path => /^\/v[123]\/outfits\/[^/]+\/wear$/i.test(path) || /^\/v[123]\/avatar\/set-wearing-assets$/i.test(path);
  const target = value => {
    try {
      const url = new URL(value, location.href);
      return url.origin === 'https://avatar.roblox.com' && (PATHS.has(url.pathname) || READ_PATHS.has(url.pathname) || writePath(url.pathname)) ? url.href : null;
    } catch (_) { return null; }
  };
  const userId = () => {
    const current = globalThis.Roblox?.CurrentUser;
    const value = document.querySelector('meta[name="user-data"]')?.getAttribute('data-userid') ?? current?.userId ?? current?.id ?? document.body?.dataset?.userId
      ?? document.querySelector('[data-user-id],[data-userid]')?.dataset?.userId
      ?? document.querySelector('[data-userid]')?.dataset?.userid;
    return value == null ? '' : String(value);
  };
  // The native editor reads its rig before our preview/view attributes mount.
  // Restore the saved Larp rig in that read, rather than painting over its toggle.
  const savedRig = () => {
    if (!/^\/my\/avatar\/?$/i.test(location.pathname) || document.querySelector('#avatar-web-app')?.getAttribute('data-larpbux-avatar-view') === 'real') return;
    try {
      const saved = JSON.parse(localStorage.getItem(`larpblox-cosmetics-v1:${userId()}`));
      const rig = saved?.gameLook?.definition?.playerAvatarType?.playerAvatarType;
      if (saved?.mode === true && (rig === 'R6' || rig === 'R15')) return rig;
    } catch (_) {}
  };
  const rigRead = (method, url) => method === 'GET' && url && READ_PATHS.has(new URL(url).pathname);
  const restoreRig = (value, rig) => value && typeof value === 'object' && (value.playerAvatarType === 'R6' || value.playerAvatarType === 'R15') ? {...value, playerAvatarType:rig} : value;
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
  // Current Roblox editor nests colors in its v4 avatar update model.
  const colorPayload = value => value?.avatarDefinition?.updateAvatarModel?.bodyColors ?? value?.bodyColor3s ?? value?.bodyColors;
  const scalePayload = value => value?.avatarDefinition?.updateAvatarModel?.scales ?? value?.avatarDefinition?.updateAvatarModel?.bodyScales ?? value?.scales ?? value?.bodyScales ?? value?.bodyScale;
  const rigPayload = value => value?.avatarDefinition?.updateAvatarModel?.playerAvatarType ?? value?.playerAvatarType;
  const modernRig = body => { try { return rigPayload(parseBody(body)) !== undefined; } catch (_) { return false; } };
  const validRig = value => {
    const rig = value?.playerAvatarType ?? value;
    if (rig === 'R6' || rig === 1) return 'R6';
    if (rig === 'R15' || rig === 3) return 'R15';
    throw new Error('Choose R6 or R15.');
  };
  const modernColors = body => {
    try {
      const value = parseBody(body);
      const colors = colorPayload(value);
      return colors !== undefined;
    } catch (_) { return false; }
  };
  const modernScales = body => { try { return scalePayload(parseBody(body)) !== undefined; } catch (_) { return false; } };
  const hasAvatarAssets = body => {
    try {
      const value = parseBody(body), definition = value?.avatarDefinition, model = definition?.updateAvatarModel;
      return value?.assets !== undefined || definition?.assets !== undefined || model?.assets !== undefined || value?.assetIds !== undefined || definition?.assetIds !== undefined || model?.assetIds !== undefined;
    } catch (_) { return false; }
  };
  const blockedWrite = (method, path, body) => {
    if (!['POST', 'PUT', 'PATCH'].includes(method)) return false;
    if (writePath(path)) return true;
    if (path !== '/v4/avatar') return false;
    if (method === 'PATCH' && !hasAvatarAssets(body) && (modernColors(body) || modernScales(body) || modernRig(body))) return false;
    return true;
  };
  const validScales = scales => {
    const value = scales?.scales || scales?.bodyScales || scales?.bodyScale || scales;
    const aliases = new Set(['height','width','depth','head','bodyType','proportion'].flatMap(key => [key, `${key}Scale`, key === 'height' ? 'bodyHeightScale' : key === 'width' ? 'bodyWidthScale' : key === 'depth' ? 'bodyDepthScale' : key === 'proportion' ? 'bodyProportionScale' : key, key === 'height' ? 'BodyHeightScale' : key === 'width' ? 'BodyWidthScale' : key === 'depth' ? 'BodyDepthScale' : key === 'proportion' ? 'BodyProportionScale' : key[0].toUpperCase() + key.slice(1) + 'Scale', key[0].toUpperCase() + key.slice(1) + 'Scale']));
    if (!value || !Object.keys(value).some(key => aliases.has(key)) || Object.entries(value).some(([key, entry]) => aliases.has(key) && (!Number.isFinite(Number(entry)) || Number(entry) < 0 || Number(entry) > 5))) throw new Error('Invalid body scale request.');
    return value;
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
  const waitForPage = (type, payload, signal) => new Promise(resolve => {
    const id = `${Date.now()}-${++sequence}`;
    let timer;
    const finish = (ok, error, aborted = false) => {
      clearTimeout(timer); document.removeEventListener(type === 'scales' ? 'larpblox-avatar-scales-response' : 'larpblox-body-colors-response', onResponse);
      signal?.removeEventListener('abort', onAbort); resolve({ok, error, aborted});
    };
    const onResponse = event => {
      let detail;
      try { detail = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch (_) { return; }
      if (detail?.id === id) finish(detail.ok === true, detail.error);
    };
    const onAbort = () => finish(false, `The body ${type === 'scales' ? 'scale' : 'color'} change was cancelled.`, true);
    const eventName = type === 'scales' ? 'larpblox-avatar-scales-response' : 'larpblox-body-colors-response';
    document.addEventListener(eventName, onResponse);
    if (signal?.aborted) { onAbort(); return; }
    signal?.addEventListener('abort', onAbort, {once: true});
    timer = setTimeout(() => finish(false, 'The body color change timed out.'), WAIT_MS);
    document.dispatchEvent(new CustomEvent(type === 'scales' ? 'larpblox-avatar-scales-request' : 'larpblox-body-colors-request', {
      detail: JSON.stringify({id, userId: userId(), ...(type === 'scales' ? payload : {colors:payload})}),
    }));
  });
  const synthetic = async (body, signal) => {
    let colors;
    try {
      const parsed = parseBody(body);
      colors = validColors(colorPayload(parsed) ?? parsed);
    }
    catch (error) { return {ok: false, error: error.message}; }
    return waitForPage('colors', colors, signal);
  };
  const syntheticScales = async (body, signal) => {
    try {
      const parsed = parseBody(body), rig = rigPayload(parsed), colors = colorPayload(parsed);
      const source = scalePayload(parsed) ?? (rig === undefined ? parsed : undefined);
      const payload = {...(source !== undefined ? {scales:validScales(source)} : {}), ...(rig !== undefined ? {playerAvatarType:validRig(rig)} : {}), ...(colors ? {colors:validColors(colors)} : {})};
      return waitForPage('scales', payload, signal);
    }
    catch (error) { return {ok:false, error:error.message}; }
  };
  const jsonResponse = result => new Response(JSON.stringify(responseJson(result.ok, result.error)), {
    status: result.ok ? 200 : 400,
    headers: {'Content-Type': 'application/json'},
  });
  const blockedResponse = () => new Response(JSON.stringify({errors:[{message:'Real avatar changes are disabled while Larp mode is active.'}]}), {
    status: 409, headers: {'Content-Type': 'application/json'},
  });

  const nativeFetch = globalThis.fetch;
  globalThis.fetch = async function(input, init) {
    let url = input instanceof Request ? input.url : input;
    url = target(url);
    if (!url) return nativeFetch.apply(this, arguments);
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    if (rigRead(method, url)) {
      const response = await nativeFetch.apply(this, arguments), rig = savedRig();
      if (!rig || !response.ok) return response;
      try {
        const value = await response.clone().json();
        const restored = restoreRig(value, rig);
        if (restored === value) return response;
        const headers = new Headers(response.headers);
        headers.delete('content-length'); headers.delete('content-encoding');
        return new Response(JSON.stringify(restored), {status:response.status, statusText:response.statusText, headers});
      } catch (_) { return response; }
    }
    if (!active()) return nativeFetch.apply(this, arguments);
    let body = init?.body;
    if (body === undefined && input instanceof Request) body = await input.clone().text();
    const path = new URL(url).pathname, modern = path === '/v4/avatar', legacyScales = /\/avatar\/set-scales$/.test(path), legacyColors = /\/avatar\/set-body-colors$/.test(path), legacyRig = /\/avatar\/set-player-avatar-type$/.test(path);
    if (blockedWrite(method, path, body)) return blockedResponse();
    const scales = (modern && method === 'PATCH' && (modernScales(body) || modernRig(body))) || ((legacyScales || legacyRig) && method === 'POST');
    if (modern ? method !== 'PATCH' || !modernColors(body) && !scales : method !== 'POST' || !legacyScales && !legacyColors && !legacyRig) return nativeFetch.apply(this, arguments);
    const result = scales ? await syntheticScales(body, init?.signal || (input instanceof Request ? input.signal : undefined)) : await synthetic(body, init?.signal || (input instanceof Request ? input.signal : undefined));
    if (result.aborted) throw new DOMException('The operation was aborted.', 'AbortError');
    return jsonResponse(result);
  };

  const xhrOpen = XMLHttpRequest.prototype.open;
  const xhrSend = XMLHttpRequest.prototype.send;
  const xhrAbort = XMLHttpRequest.prototype.abort;
  for (const name of ['responseText', 'response']) {
    const descriptor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, name);
    if (!descriptor?.get || !descriptor.configurable) continue;
    Object.defineProperty(XMLHttpRequest.prototype, name, {...descriptor, get() {
      const value = descriptor.get.call(this), request = this.__larpbloxBodyColorRequest;
      if (!request || !rigRead(request.method, request.url) || this.readyState !== 4 || this.status < 200 || this.status >= 300) return value;
      const rig = savedRig();
      if (!rig) return value;
      try {
        if (name === 'response' && this.responseType === 'json') return restoreRig(value, rig);
        if (typeof value === 'string' && (!this.responseType || this.responseType === 'text')) {
          const parsed = JSON.parse(value), restored = restoreRig(parsed, rig);
          return restored === parsed ? value : JSON.stringify(restored);
        }
      } catch (_) {}
      return value;
    }});
  }
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
    const path = request?.url && new URL(request.url).pathname, modern = path === '/v4/avatar', legacyScales = /\/avatar\/set-scales$/.test(path || ''), legacyColors = /\/avatar\/set-body-colors$/.test(path || ''), legacyRig = /\/avatar\/set-player-avatar-type$/.test(path || '');
    if (active() && request?.url && blockedWrite(request.method, path, body)) {
      const text = JSON.stringify({errors:[{message:'Real avatar changes are disabled while Larp mode is active.'}]});
      this.dispatchEvent(new ProgressEvent('loadstart'));
      for (const [name, value] of [['status',409],['statusText','Conflict'],['readyState',4],['responseText',text],['response',this.responseType === 'json' ? {errors:[{message:'Real avatar changes are disabled while Larp mode is active.'}]} : text]]) {
        try { Object.defineProperty(this, name, {configurable:true, value}); } catch (_) {}
      }
      this.dispatchEvent(new Event('readystatechange')); this.dispatchEvent(new ProgressEvent('load')); this.dispatchEvent(new ProgressEvent('loadend')); return;
    }
    const scales = (modern && request.method === 'PATCH' && (modernScales(body) || modernRig(body))) || ((legacyScales || legacyRig) && request.method === 'POST');
    if (!active() || !request?.url || (modern ? request.method !== 'PATCH' || !modernColors(body) && !scales : request.method !== 'POST' || !legacyScales && !legacyColors && !legacyRig)) return xhrSend.apply(this, arguments);
    const xhr = this;
    const controller = new AbortController();
    let done = false;
    const finish = async () => {
      const result = scales ? await syntheticScales(body, controller.signal) : await synthetic(body, controller.signal);
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
