// Mirrors only the signed-in user's local outfit; never changes Roblox ownership.
(() => {
  'use strict';
  function createSurfaces(peer = false) {
  const imageSelector = '.avatar img, .avatar-card-image img, .avatar-headshot img, .profile-avatar-thumb img, .profile-avatar-image img, .profile-avatar-headshot img, .profile-avatar-left img, a[href*="/users/"] img, .rbx2016-welcome-avatar, #nav-profile img, #navbar-avatar img';
  const records = new Map(), previews = new Map(), hiddenCanvases = new Map(), banners = new Map();
  let cache, retryTimer, activeKey = '', activeAccount = '', lastFailure = '';
  let status = {stage: 'not-started'};
  const numericId = value => /^[1-9]\d*$/.test(String(value || ''));
  const idFromHref = href => String(href || '').match(/\/users\/(\d+)(?:\/|$)/i)?.[1] || '';
  function selfProfileLink(image) {
    for (let node = image, depth = 0; node && depth < 10; node = node.parentElement, depth++) {
      const href = node.getAttribute?.('href');
      if (!href) continue;
      try {
        const url = new URL(href, 'https://www.roblox.com');
        if (url.origin === 'https://www.roblox.com' && /^\/users\/profile\/?$/.test(url.pathname)) return true;
      } catch (_) {}
    }
    return false;
  }
  function ownImage(image, userId, doc = document, win = window) {
    if (!image || !numericId(userId)) return false;
    const action = image.closest?.('a[href]');
    if (action && /^(view profile|my profile|profile)$/i.test(action.textContent.trim())) return false;
    if (!peer && /^\/users\/profile\/edit\/?$/i.test(win.location?.pathname || '') && image === globalThis.LarpbloxIdentityGate?.editProfileImage(doc)) return true;
    if (image.classList?.contains('rbx2016-welcome-avatar')) return !peer;
    for (let node = image, depth = 0; node && depth < 10; node = node.parentElement, depth++) {
      for (const key of ['data-user-id', 'data-userid', 'data-target-user-id', 'data-target-userid']) {
        const owner = node.getAttribute?.(key);
        if (owner) return String(owner) === String(userId);
      }
      const owner = idFromHref(node.getAttribute?.('href'));
      if (owner) return owner === String(userId);
    }
    if (selfProfileLink(image)) return !peer;
    if (image.closest?.('#nav-profile, #navbar-avatar, #header .navbar-avatar, .age-bracket-label')) return !peer;
    const owner = String(win.location?.pathname || '').match(/^\/users\/(\d+)\/profile\/?$/i)?.[1];
    return owner === String(userId) && !!image.closest?.('.user-profile-header-details-avatar-container, .profile-avatar-thumb, .profile-avatar-image, .profile-avatar-headshot, .profile-avatar-left, .profile-header .avatar-card-image, .profile-header-top .avatar-card-image, .profile-header .avatar-headshot, .profile-header-top .avatar-headshot');
  }
  function findOwnImages(userId, doc = document, win = window) {
    const images = new Set(doc.querySelectorAll(imageSelector));
    if (!peer && /^\/users\/profile\/edit\/?$/i.test(win.location?.pathname || '')) {
      const image = globalThis.LarpbloxIdentityGate?.editProfileImage(doc);
      if (image) images.add(image);
    }
    return [...images].filter(image => !image.closest?.('#avatar-web-app') && ownImage(image, userId, doc, win));
  }
  function remember(image) {
    const src = image.getAttribute('src'), srcset = image.getAttribute('srcset'), sizes = image.getAttribute('sizes');
    let record = records.get(image);
    if (!record) { record = {src, srcset, sizes, visibility: image.style.visibility || '', applied: null}; records.set(image, record); }
    else {
      if (src !== record.applied) { record.src = src; record.srcset = srcset; }
      // We remove srcset while overriding. Any new value was supplied by Roblox.
      if (srcset !== null) record.srcset = srcset;
      record.sizes = sizes;
    }
    return record;
  }
  function restore(image) {
    const record = remember(image);
    for (const key of ['src', 'srcset', 'sizes']) {
      if (record[key] === null) image.removeAttribute(key);
      else image.setAttribute(key, record[key]);
    }
    image.style.visibility = record.visibility;
    records.delete(image);
  }
  function removePreview(container, record) {
    record.controller.abort(); record.viewer?.dispose(); record.host.remove();
    if (previews.get(container) !== record) return;
    for (const [node, visibility] of record.hidden) node.style.visibility = visibility;
    container.style.position = record.position;
    previews.delete(container);
  }
  function reset() {
    clearTimeout(retryTimer); retryTimer = undefined;
    cache?.controller.abort(); cache = undefined;
    for (const image of records.keys()) restore(image);
    for (const [container, record] of previews) removePreview(container, record);
    for (const [canvas, visibility] of hiddenCanvases) canvas.style.visibility = visibility;
    hiddenCanvases.clear();
    updateBanners('', null);
  }
  function updateBanners(userId, result) {
    const wanted = result?.backgroundUrl ? [...document.querySelectorAll('.currently-wearing-avatar-with-background .profile-avatar-left')].filter(element => ownImage(element, userId)) : [];
    for (const [element, styles] of banners) if (!wanted.includes(element)) {
      for (const [key, original] of Object.entries(styles)) {
        if (original.value) element.style.setProperty(key, original.value, original.priority);
        else element.style.removeProperty(key);
      }
      banners.delete(element);
    }
    for (const element of wanted) {
      const nativeWidth = element.clientHeight * 2.5 * (result.backgroundAspect || 1);
      const styles = {'background-image':`url("${result.backgroundUrl}")`, 'background-position':'50% 64%', 'background-size':`max(100%, ${nativeWidth}px) auto`, 'background-repeat':'no-repeat'};
      if (!banners.has(element)) banners.set(element, Object.fromEntries(Object.keys(styles).map(key => [key, {value:element.style.getPropertyValue(key),priority:element.style.getPropertyPriority(key)}])));
      for (const [key, value] of Object.entries(styles)) if (element.style.getPropertyValue(key) !== value || element.style.getPropertyPriority(key) !== 'important') element.style.setProperty(key, value, 'important');
    }
  }
  async function waitForRender(signal) {
    return LarpbloxAvatarRequests.waitForRender(signal);
  }
  async function render(definition, userId, signal, thumbnailType = '3d') {
    return LarpbloxAvatarRequests.render(definition, userId, signal, thumbnailType);
  }
  async function pictures(descriptor, signal, definition) {
    status = {stage: 'capturing', descriptor};
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:420px;height:420px;pointer-events:none';
    document.body.append(host);
    let viewer;
    try {
      viewer = await LarpbloxAvatar3D.create(host, descriptor, {signal, static: true, definition});
      const headshot = viewer.capture('headshot'), fullBody = viewer.capture('fullBody');
      if (!headshot?.startsWith('data:image/png') || !fullBody?.startsWith('data:image/png')) throw new Error('Avatar capture failed.');
      const backgroundUrl = viewer.getBackgroundUrl?.();
      const transparentBody = backgroundUrl ? viewer.capture('fullBody', {background:false}) : fullBody;
      const backgroundAspect = viewer.getBackgroundAspect?.() || 1;
      return {descriptor, headshot, fullBody, transparentBody, backgroundUrl, backgroundAspect, definition};
    } finally { viewer?.dispose(); host.remove(); }
  }
  async function updateProfilePreviews(userId, key, descriptor, definition) {
    const containers = [...document.querySelectorAll('.profile-avatar-thumb, .profile-avatar-left, .profile-avatar')]
      .filter(container => !container.closest('#avatar-web-app') && ownImage(container, userId) && container.querySelector('canvas:not(.larpblox-own-avatar-canvas)'));
    const wide = definition?.backgroundRequestModel?.id ? containers.filter(container => container.matches('.currently-wearing-avatar-with-background .profile-avatar-left')) : [];
    const candidates = containers.filter(container => !wide.some(banner => banner !== container && banner.contains(container)));
    // Background previews use the whole banner; other previews keep the native canvas wrapper.
    const wanted = candidates.filter(container => !candidates.some(other => other !== container && container.contains(other)));
    for (const [container, record] of previews) if (!wanted.includes(container) || record.key !== key) removePreview(container, record);
    for (const container of wanted) {
      if (previews.has(container)) continue;
      const controller = new AbortController(), host = document.createElement('div');
      host.className = 'larpblox-own-profile-preview';
      host.style.cssText = 'position:absolute;inset:0;z-index:6;pointer-events:auto';
      const record = {key, host, controller, position: container.style.position, hidden: new Map()};
      previews.set(container, record);
      container.style.position = 'relative'; container.append(host);
      try {
        const viewer = await LarpbloxAvatar3D.create(host, descriptor, {signal: controller.signal, definition, background: !wide.includes(container)});
        if (activeKey !== key || controller.signal.aborted || !container.isConnected) { viewer.dispose(); removePreview(container, record); continue; }
        record.viewer = viewer;
        host.querySelector('canvas')?.classList.add('larpblox-own-avatar-canvas');
        for (const node of container.querySelectorAll('canvas:not(.larpblox-own-avatar-canvas)')) {
          record.hidden.set(node, node.style.visibility); node.style.visibility = 'hidden';
        }
      } catch (_) { if (previews.get(container) === record) removePreview(container, record); }
    }
  }
  async function update(options = {}) {
    const {userId, active, signature, loadDefinition} = options;
    const key = active && numericId(userId) ? `${userId}:${signature}` : '';
    const account = key ? String(userId) : '';
    if (activeAccount !== account) { reset(); activeAccount = account; }
    else if (activeKey !== key) { clearTimeout(retryTimer); retryTimer = undefined; cache?.controller.abort(); cache = undefined; }
    activeKey = key;
    if (!key) status = {stage: 'inactive', active: Boolean(active), userId};
    if (!key) return;
    for (const [container, record] of previews) if (!container.isConnected) removePreview(container, record);
    const images = findOwnImages(userId);
    if (!images.length) status = {stage: 'no-matching-images', userId};
    for (const image of records.keys()) if (!images.includes(image)) restore(image);
    if (peer && options.imageUrl && !options.backgroundId && !document.querySelector('.profile-avatar-thumb canvas, .profile-avatar-left canvas, .profile-avatar canvas')) {
      for (const image of images) {
        const record = remember(image);
        record.applied = options.imageUrl;
        if (image.getAttribute('src') !== options.imageUrl) image.setAttribute('src', options.imageUrl);
        image.removeAttribute('srcset');
        image.style.visibility = record.visibility;
      }
      return;
    }
    // Keep native/previous portraits visible until their replacements are ready.
    if (!images.length && !document.querySelector('.profile-avatar-thumb canvas, .profile-avatar-left canvas, .profile-avatar canvas')) return;
    if (cache?.retryAt && Date.now() < cache.retryAt) return;
    if (!cache || cache.retryAt) {
      const controller = new AbortController();
      const entry = {controller}; cache = entry;
      status = {stage: 'loading-outfit', userId};
      entry.promise = (async () => {
        const definition = await loadDefinition(controller.signal);
        return pictures(await render(definition, userId, controller.signal), controller.signal, definition);
      })();
      entry.promise.catch(error => {
        if (cache !== entry) return;
        entry.retryAt = Date.now() + Math.max(5000, (error.retryAfter || 0) * 1000);
        status = {stage: 'failed', error: String(error.message), retryAt: entry.retryAt};
        const failure = `${key}:${error.message}`;
        if (lastFailure !== failure) console.warn('Larp avatar pictures could not render; retrying.', error.message);
        lastFailure = failure;
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => {
          retryTimer = undefined;
          if (cache === entry && activeKey === key) update(options);
        }, Math.max(5001, entry.retryAt - Date.now() + 1));
      });
    }
    try {
      const result = await cache.promise;
      if (activeKey !== key) return;
      clearTimeout(retryTimer); retryTimer = undefined; lastFailure = '';
      updateBanners(userId, result);
      for (const image of images) {
        if (!image.isConnected || !ownImage(image, userId)) continue;
        const record = remember(image);
        const headshot = /^\/users\/profile\/edit\/?$/i.test(location.pathname) || image.classList.contains('rbx2016-welcome-avatar') || selfProfileLink(image) || image.closest('.avatar-headshot, .avatar-headshot-xs, .avatar-headshot-sm, .avatar-headshot-md, .avatar-headshot-lg, .avatar-headshot-xl, .avatar-card-headshot, .profile-avatar-image, .profile-avatar-headshot, #nav-profile, #navbar-avatar');
        const banner = image.closest('.currently-wearing-avatar-with-background .profile-avatar-left');
        const value = headshot ? result.headshot : (banners.has(banner) ? result.transparentBody : result.fullBody);
        record.applied = value;
        if (image.getAttribute('src') !== value) image.setAttribute('src', value);
        if (image.getAttribute('srcset') !== null) image.removeAttribute('srcset');
        image.style.visibility = record.visibility;
      }
      await updateProfilePreviews(userId, key, result.descriptor, result.definition);
      if (activeKey === key) status = {stage: 'applied', images: images.length};
    } catch (error) {
      if (activeKey === key && !cache?.retryAt) status = {stage: 'failed-applying', error: String(error.message)};
    }
  }
  function getDiagnostics() {
    return {...status, account: activeAccount, trackedImages: records.size,
      candidates: [...document.querySelectorAll(imageSelector)].map(image => {
        const ancestors = [];
        for (let node = image, depth = 0; node && depth < 7; node = node.parentElement, depth++) {
          ancestors.push({tag: node.tagName, id: node.id || '', classes: typeof node.className === 'string' ? node.className : '',
            href: node.getAttribute?.('href'), userId: node.getAttribute?.('data-user-id') || node.getAttribute?.('data-userid')});
        }
        return {own: ownImage(image, activeAccount), editor: Boolean(image.closest?.('#avatar-web-app')),
          larpSource: image.getAttribute('src')?.startsWith('data:image/png') || false, ancestors};
      })};
  }
  async function characterThumbnail(definition, userId, signal) {
    // Saved cards need a still image, not a full 3D model and WebGL capture.
    return render(definition, userId, signal, '2d');
  }
  const api = {update, ownImage, findOwnImages, idFromHref, getDiagnostics, characterThumbnail, waitForRender};
  return api;
  }
  const api = createSurfaces();
  api.createForPeer = () => createSurfaces(true);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else globalThis.LarpbloxAvatarSurfaces = api;
})();
