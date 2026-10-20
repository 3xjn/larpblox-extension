// Keep the profile's existing heading and native cards available for real mode.
(() => {
  'use strict';
  let cache, record, retryTimer;
  const details = new Map();
  function restore() {
    if (!record) return;
    record.host.remove();
    if (record.display) record.source.style.setProperty('display', record.display, record.priority);
    else record.source.style.removeProperty('display');
    record = undefined;
  }
  async function itemDetails(id, known, signal) {
    const fallback = known.get(id) || {};
    let data = details.get(id);
    if (!data) {
      try {
        const response = await fetch(`https://economy.roblox.com/v2/assets/${id}/details`, {signal});
        if (response.ok) { data = await response.json(); details.set(id, data); }
      } catch (_) { if (signal.aborted) throw _; }
    }
    return { ...fallback, id, itemType:'Asset', name:data?.Name || fallback.name || `Item ${id}`,
      isLimited:data?.IsLimited ?? fallback.isLimited,
      isLimitedUnique:data?.IsLimitedUnique ?? fallback.isLimitedUnique,
      price:data ? (data.LowestResalePrice ?? (data.IsForSale ? data.PriceInRobux : null)) : undefined,
      saleKnown:Boolean(data) };
  }
  function card(item, width, thumbnail) {
    const root = document.createElement('div'); root.className = 'item-card profile-item-card';
    root.style.cssText = `flex:0 0 ${width}px;width:${width}px`;
    root.dataset.larpAssetId = String(item.id);
    const container = document.createElement('div'); container.className = 'item-card-container';
    const holder = document.createElement('div'); holder.className = 'item-card-thumb-container';
    const link = document.createElement('a'); link.className = 'item-card-link'; link.href = `/catalog/${item.id}`;
    const thumb = document.createElement('span'); thumb.className = 'thumbnail-2d-container';
    const image = document.createElement('img'); image.alt = item.name; thumbnail(image, item);
    thumb.append(image); link.append(thumb); holder.append(link);
    if (item.isLimited || item.isLimitedUnique) {
      const badge = document.createElement('span');
      badge.className = item.isLimitedUnique ? 'icon-limited-unique-label' : 'icon-limited-label';
      badge.setAttribute('role','img'); badge.setAttribute('aria-label',item.isLimitedUnique ? 'Limited Unique' : 'Limited');
      badge.style.cssText = 'position:absolute;bottom:0;left:0;z-index:2';
      holder.style.position = 'relative'; holder.append(badge);
    }
    const caption = document.createElement('div'); caption.className = 'item-card-caption';
    const title = document.createElement('a'); title.className = 'item-card-name'; title.href = link.href;
    title.textContent = item.name; title.title = item.name; caption.append(title);
    if (item.saleKnown) {
      const price = document.createElement('div'); price.className = 'item-card-price';
      if (Number.isFinite(item.price)) {
        const icon = document.createElement('span'); icon.className = 'icon-robux-16x16'; icon.setAttribute('aria-label','Robux');
        price.append(icon, document.createTextNode(item.price.toLocaleString('en-US')));
      } else price.textContent = 'Off Sale';
      caption.append(price);
    }
    container.append(holder, caption); root.append(container); return root;
  }
  async function update(options = {}) {
    const {userId, active, signature, items = [], loadDefinition, thumbnail} = options;
    const owner = location.pathname.match(/^\/users\/(\d+)\/profile\/?$/i)?.[1];
    const ownProfile = owner === String(userId) || /^\/users\/profile\/?$/.test(location.pathname);
    const source = ownProfile && active && document.querySelector('.profile-currently-wearing .profile-carousel:not(.larpbux-currently-wearing)');
    if (!source) { restore(); clearTimeout(retryTimer); cache?.controller.abort(); cache = undefined; return; }
    const key = `${userId}:${signature}`;
    if (record && (record.source !== source || record.key !== key || !record.host.isConnected)) restore();
    if (record) return;
    if (cache?.key === key && cache.retryAt > Date.now()) return;
    if (!cache || cache.key !== key || cache.retryAt) {
      clearTimeout(retryTimer);
      cache?.controller.abort();
      const controller = new AbortController(), known = new Map(items.map(item => [Number(item.id), item]));
      for (const native of source.querySelectorAll('.item-card')) {
        const id = native.querySelector('a[href*="/catalog/"]')?.getAttribute('href')?.match(/\/catalog\/(\d+)/)?.[1];
        const name = native.querySelector('.item-card-name')?.textContent?.trim();
        if (id && name && !known.has(Number(id))) known.set(Number(id), {name});
      }
      const entry = {key, controller}; cache = entry;
      entry.promise = Promise.resolve().then(() => loadDefinition(controller.signal)).then(definition => Promise.all(
        [...new Set(definition.assets.map(asset => Number(asset.id)).filter(id => Number.isSafeInteger(id) && id > 0))]
          .map(id => itemDetails(id, known, controller.signal))));
    }
    const entry = cache;
    try {
      const wearing = await entry.promise;
      if (cache !== entry || entry.controller.signal.aborted || !source.isConnected || record) return;
      const host = source.cloneNode(false); host.removeAttribute('id'); host.classList.add('larpbux-currently-wearing');
      host.style.cssText = 'display:flex;gap:16px;overflow-x:auto;align-items:flex-start;padding-bottom:8px';
      const width = source.querySelector('.item-card')?.getBoundingClientRect().width || 150;
      for (const item of wearing) host.append(card(item, width, thumbnail));
      if (!wearing.length) host.textContent = 'No avatar items equipped.';
      record = {key, source, host, display: source.style.getPropertyValue('display'), priority: source.style.getPropertyPriority('display')};
      source.after(host); source.style.setProperty('display', 'none', 'important');
    } catch (_) {
      if (cache !== entry) return;
      entry.retryAt = Date.now() + 5000;
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => { if (cache === entry) update(options); }, 5001);
    }
  }
  globalThis.LarpbloxProfileWearing = {update};
})();
