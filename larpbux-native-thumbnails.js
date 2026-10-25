// Repair only failed Roblox thumbnails in Avatar > Creations.
(() => {
  'use strict';
  const editorSelector = '#avatar-web-app';
  const cardSelector = '.items-list.avatar-item-list .item-card:not(.larpbux-character-card)';
  const maxAttempts = 3, batchSize = 50;
  const records = new WeakMap();
  const listState = new Map();
  let queued = [], busy = false, batchTimer;
  let observer, scanTimer;

  const text = value => String(value || '').trim();
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const editor = () => document.querySelector(editorSelector);
  const isCreations = root => {
    if (!root) return false;
    const label = [...root.querySelectorAll('.breadcrumb-container,.breadcrumb,.avatar-category-title,[aria-label="Breadcrumb"],[aria-label="breadcrumb"]')]
      .find(node => node.getClientRects?.().length !== 0 && text(node.textContent));
    return /creation/i.test(text(label?.textContent) || text(root.querySelector('[aria-selected="true"]')?.textContent));
  };
  const accountId = root => {
    const value = root?.dataset.userid || root?.dataset.userId || document.querySelector('[data-userid],[data-user-id]')?.getAttribute('data-userid') || document.querySelector('[data-user-id]')?.getAttribute('data-user-id');
    if (/^\d+$/.test(String(value || ''))) return String(value);
    return String(location.pathname.match(/^\/users\/(\d+)\//i)?.[1] || '');
  };
  const outfitId = card => {
    const direct = card.dataset.outfitId || card.dataset.userOutfitId || card.getAttribute('data-outfit-id') || card.getAttribute('data-user-outfit-id');
    if (/^\d+$/.test(String(direct || ''))) return String(direct);
    const source = card.querySelector('img')?.getAttribute('src') || '';
    if (/type=Outfit/i.test(source)) return source.match(/[?&](?:id|outfitId|userOutfitId)=(\d+)/i)?.[1] || '';
    return '';
  };
  const outfitName = card => text(card.querySelector('.item-card-name-link,.item-card-name,.item-card-caption')?.textContent);
  const status = (card, message) => {
    let node = card.querySelector('.larpbux-native-thumbnail-status');
    if (!node) { node = document.createElement('span'); node.className = 'larpbux-native-thumbnail-status'; node.setAttribute('role', 'status'); card.append(node); }
    node.textContent = message;
  };
  async function outfitMap(root, account, signal) {
    const key = `${account}:${location.pathname}`;
    if (listState.has(key)) return listState.get(key);
    const promise = (async () => {
      const map = new Map(), duplicate = new Set();
      for (let page = 1; page <= 20; page++) {
        const response = await fetch(`https://avatar.roblox.com/v1/users/${account}/outfits?outfitType=Avatar&page=${page}&itemsPerPage=100`, {credentials: 'include', signal});
        if (!response.ok) throw new Error('outfits unavailable');
        const data = (await response.json()).data || [];
        for (const outfit of data) {
          const name = text(outfit.name), id = String(outfit.id || '');
          if (!name || !/^\d+$/.test(id)) continue;
          if (map.has(name)) { duplicate.add(name); map.delete(name); } else if (!duplicate.has(name)) map.set(name, id);
        }
        if (data.length < 100) break;
      }
      return map;
    })();
    listState.set(key, promise);
    try { return await promise; } catch (error) { listState.delete(key); throw error; }
  }
  async function request(ids) {
    const ready = new Map();
    for (let attempt = 0; attempt < maxAttempts && ids.length; attempt++) {
      const response = await fetch(`https://thumbnails.roblox.com/v1/users/outfits?userOutfitIds=${encodeURIComponent(ids.join(','))}&size=150x150&format=Png&isCircular=false`, {credentials: 'include', signal: AbortSignal.timeout(10000)});
      if (response.status === 429) {
        if (attempt + 1 < maxAttempts) await wait(Math.min(5000, Math.max(500, Number(response.headers.get('Retry-After')) * 1000 || 1000)));
        continue;
      }
      if (!response.ok) throw new Error('thumbnail request failed');
      const pending = [];
      for (const item of (await response.json()).data || []) {
        const id = String(item.targetId);
        if (!ids.includes(id)) continue;
        if (item.state === 'Pending' || item.state === 'InReview') pending.push(id);
        else if (item.state === 'Completed' && item.imageUrl) ready.set(id, item.imageUrl);
      }
      ids = pending;
      if (ids.length && attempt + 1 < maxAttempts) await wait(1000);
    }
    return ready;
  }
  async function drain() {
    if (busy) return;
    busy = true;
    try {
      while (queued.length) {
        const batch = queued.splice(0, batchSize);
        let result;
        try { result = await request([...new Set(batch.map(job => job.id))]); }
        catch (_) { result = new Map(); }
        for (const job of batch) job.resolve(result.get(job.id) || '');
      }
    } finally { busy = false; }
  }
  function thumbnail(id) {
    return new Promise(resolve => {
      queued.push({id, resolve});
      if (!busy) { clearTimeout(batchTimer); batchTimer = setTimeout(drain, 50); }
    });
  }
  const identity = (card, image, root) => `${accountId(root)}|${image.getAttribute('src') || ''}|${outfitId(card)}|${outfitName(card)}`;
  async function repair(card, image, root) {
    if (records.has(image)) return;
    const record = {identity: identity(card, image, root), visibility: image.style.visibility}; records.set(image, record);
    const current = () => card.isConnected && image.isConnected && editor() === root && isCreations(root) && records.get(image) === record && identity(card, image, root) === record.identity;
    image.style.visibility = 'hidden'; status(card, 'Loading thumbnail…');
    const signal = AbortSignal.timeout(10000);
    try {
      let id = outfitId(card);
      if (!id) {
        const account = accountId(root);
        if (!account) throw new Error('unknown account');
        id = (await outfitMap(root, account, signal)).get(outfitName(card)) || '';
      }
      if (!id) throw new Error('unknown outfit');
      if (!current()) return;
      const url = await thumbnail(id);
      if (!current()) return;
      if (!url) throw new Error('thumbnail unavailable');
      await new Promise((resolve, reject) => {
        let timer;
        const done = () => {
          clearTimeout(timer);
          image.removeEventListener('load', done);
          image.removeEventListener('error', done);
          if (image.complete && image.naturalWidth > 0) resolve();
          else reject(new Error('thumbnail unavailable'));
        };
        image.addEventListener('load', done);
        image.addEventListener('error', done);
        timer = setTimeout(done, 10000);
        image.src = url;
        // Remember our own replacement so its error cannot restart recovery forever.
        record.identity = identity(card, image, root);
      });
      if (current()) { image.style.visibility = record.visibility; status(card, ''); }
    } catch (_) {
      if (current()) status(card, 'Thumbnail unavailable.');
    }
  }

  function scan() {
    const root = editor();
    if (!isCreations(root)) return;
    for (const card of root.querySelectorAll(cardSelector)) for (const image of card.querySelectorAll('.item-card-thumb img')) {
      const key = identity(card, image, root);
      const previous = records.get(image);
      if (previous && previous.identity !== key) {
        image.style.visibility = previous.visibility; records.delete(image);
        status(card, '');
      }
      if (!image.getAttribute('src') || !image.complete || image.naturalWidth > 0 || records.get(image)?.identity === key) continue;
      repair(card, image, root);
    }
  }
  function start() {
    scan();
    observer = new MutationObserver(() => { clearTimeout(scanTimer); scanTimer = setTimeout(scan, 120); });
    observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'data-outfit-id', 'data-user-outfit-id']});
    document.addEventListener('error', event => { const image = event.target; if (image?.tagName === 'IMG' && image.closest?.(`${editorSelector} ${cardSelector}`)) { clearTimeout(scanTimer); scanTimer = setTimeout(scan, 0); } }, true);
  }
  globalThis.LarpbloxNativeThumbnails = {scan};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true}); else start();
})();
