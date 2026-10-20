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
    const limited = data?.IsLimited || data?.IsLimitedUnique || fallback.isLimited || fallback.isLimitedUnique;
    let resalePrice = data?.LowestResalePrice;
    let resaleKnown = Number.isFinite(resalePrice);
    if (limited && !resaleKnown) {
      try {
        const url = data?.CollectibleItemId
          ? `https://apis.roblox.com/marketplace-sales/v1/item/${data.CollectibleItemId}/resellers?limit=10`
          : `https://economy.roblox.com/v1/assets/${id}/resellers?limit=10`;
        const response = await fetch(url, {signal});
        if (response.ok) {
          const listings = (await response.json()).data;
          if (Array.isArray(listings)) {
            const prices = listings.map(listing => listing.price).filter(price => Number.isFinite(price) && price >= 0);
            resalePrice = prices.length ? Math.min(...prices) : null;
            resaleKnown = true;
          }
        }
      } catch (_) { if (signal.aborted) throw _; }
    }
    return { ...fallback, id, itemType:'Asset', name:data?.Name || fallback.name || `Item ${id}`,
      isLimited:Boolean(data?.IsLimited || fallback.isLimited),
      isLimitedUnique:Boolean(data?.IsLimitedUnique || fallback.isLimitedUnique),
      price:limited ? resalePrice : (data?.IsForSale ? data.PriceInRobux : null),
      priceLabel:limited ? (resaleKnown ? 'Off Sale' : 'See Item') : 'Off Sale',
      saleKnown:Boolean(data) };
  }
  function card(item, width, thumbnail) {
    const root = document.createElement('div'); root.className = 'item-card profile-item-card';
    root.style.cssText = `flex:0 0 ${width}px;width:${width}px`;
    root.dataset.larpAssetId = String(item.id);
    const container = document.createElement('div'); container.className = 'item-card-container';
    const holder = document.createElement('div'); holder.className = 'item-card-thumb-container';
    const link = document.createElement('a'); link.className = 'item-card-link'; link.style.cssText = 'display:block;width:100%;height:100%;position:relative'; link.href = `/catalog/${item.id}`;
    const thumb = document.createElement('span'); thumb.className = 'thumbnail-2d-container'; thumb.style.cssText = 'display:block;width:100%;aspect-ratio:1';
    const image = document.createElement('img'); image.alt = item.name; image.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain'; thumbnail(image, item);
    thumb.append(image); link.append(thumb); holder.append(link);
    if (item.isLimited || item.isLimitedUnique) {
      const badge = document.createElement('span');
      badge.className = item.isLimitedUnique ? 'icon-limited-unique-label' : 'icon-limited-label';
      badge.setAttribute('role','img'); badge.setAttribute('aria-label',item.isLimitedUnique ? 'Limited Unique' : 'Limited');
      badge.style.cssText = 'position:absolute;bottom:0;left:0;z-index:2;display:inline-flex;align-items:center;width:auto;height:14px;background:#00b06f;color:white;font:700 10px/14px Arial,sans-serif;white-space:nowrap;padding:0 3px;border-radius:0';
      badge.textContent = 'LIMITED';
      if (item.isLimitedUnique) {
        const unique = document.createElement('span'); unique.textContent = 'U';
        unique.style.cssText = 'display:inline-block;background:#ffdd00;color:#111;padding:0 5px;margin-left:3px;height:14px;line-height:14px';
        badge.append(unique);
      }
      holder.style.position = 'relative'; link.append(badge);
    }
    const caption = document.createElement('div'); caption.className = 'item-card-caption';
    const title = document.createElement('a'); title.className = 'item-card-name'; title.href = link.href;
    title.textContent = item.name; title.title = item.name; caption.append(title);
    if (item.saleKnown) {
      const price = document.createElement('div'); price.className = 'item-card-price';
      if (Number.isFinite(item.price)) {
        const icon = document.createElement('span'); icon.className = 'icon-robux-16x16'; icon.setAttribute('aria-label','Robux');
        price.append(icon, document.createTextNode(item.price.toLocaleString('en-US')));
      } else price.textContent = item.priceLabel;
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
