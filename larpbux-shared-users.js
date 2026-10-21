/* global chrome, LarpbloxGameBridge, LarpbloxAvatarSurfaces */
(() => {
  'use strict';
  const portraits = new Map(), names = new Map(), wearing = new Map();
  let publication, publicationKey = '', publicationTime = 0, publishing = false, publicationGeneration = 0;
  const validCounts = value => value && typeof value === 'object' && Number.isSafeInteger(value.followers) && value.followers >= 0 && Number.isSafeInteger(value.following) && value.following >= 0 ? {followers:value.followers, following:value.following} : undefined;
  function publishProfile(options) {
    const key = JSON.stringify([options.userId, options.active, options.signature, options.names, options.verified === true, options.socialCounts ?? null]);
    if (key !== publicationKey) { publicationKey = key; publicationGeneration++; publicationTime = 0; }
    publication = options;
    flushProfile();
  }
  async function flushProfile() {
    if (!publication?.userId || publishing || Date.now() - publicationTime < 60000) return;
    const options = publication, mine = publicationGeneration;
    publishing = true; publicationTime = Date.now();
    try {
      let record;
      if (options.active) {
        const snapshot = options.loadSnapshot ? await options.loadSnapshot() : {version:1,userId:String(options.userId),definition:await options.loadDefinition(new AbortController().signal),items:[]};
        const userId = String(options.userId), username = options.names?.username || '';
        record = {version:1, userId, verified:options.verified === true, snapshot:LarpbloxGameBridge.validateSnapshot(snapshot,userId), name:{enabled:!!username,username,displayName:username}};
        const socialCounts = validCounts(options.socialCounts);
        if (socialCounts) record.socialCounts = socialCounts;
      }
      if (mine !== publicationGeneration) return;
      const response = await (globalThis.LarpbloxExtension || chrome.runtime).sendMessage({type:'larpblox-publish-profile',userId:String(options.userId),record});
      if (response?.ok && mine === publicationGeneration) publicationTime = Date.now();
    } catch (_) { /* Retry after transient relay or avatar failures. */ }
    finally { publishing = false; if (mine !== publicationGeneration) flushProfile(); }
  }
  let context = {}, records = new Map(), pending = false, lastPoll = 0, queued = false, generation = 0;
  const counts = new Map();
  const userIdFrom = value => {
    try {
      const url = new URL(value || '', location.origin);
      return url.origin === 'https://www.roblox.com' ? url.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/)?.[1] : undefined;
    } catch { return undefined; }
  };
  const profileId = () => location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/)?.[1];
  const profileSelector = '#profile-header-title-container-name,.stylistic-alts-username,.profile-header-title,.profile-header-username,.profile-header-display-name,[data-testid="profile-header-title"],[data-testid="profile-header-username"],[data-testid="profile-header-display-name"]';
  function collect() {
    const found = new Set();
    const profile = profileId();
    if (profile) found.add(profile);
    for (const anchor of document.querySelectorAll('a[href]')) {
      const id = userIdFrom(anchor.getAttribute('href'));
      if (id) found.add(id);
    }
    found.delete(String(context.userId));
    return [...found].slice(0, 50);
  }
  function restoreNames(wanted) {
    for (const [node, entry] of names) {
      if (!node.isConnected) { names.delete(node); continue; }
      if (node.nodeValue !== entry.shown) { entry.real = node.nodeValue; entry.shown = null; }
      if (!wanted.has(node)) {
        if (node.nodeValue !== entry.real) node.nodeValue = entry.real;
        names.delete(node);
      }
    }
  }
  function applyNames() {
    const wanted = new Map();
    for (const [id, record] of records) {
      if (!record.name?.enabled) continue;
      const roots = [...document.querySelectorAll('a[href]')].filter(anchor => userIdFrom(anchor.getAttribute('href')) === id);
      if (profileId() === id) roots.push(...document.querySelectorAll(profileSelector));
      for (const root of roots) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (node.parentElement.closest('button,input,textarea,[contenteditable="true"]')) continue;
          const value = (names.get(node)?.real ?? node.nodeValue).trim();
          if (!value || value.length > 50 || /^(view profile|profile|\d[\d.,KkMm\s]*)$/i.test(value)) continue;
          const username = value.startsWith('@') || root.matches('.stylistic-alts-username,.profile-header-username,[data-testid="profile-header-username"]');
          wanted.set(node, (username ? '@' + record.name.username : record.name.displayName));
        }
      }
    }
    restoreNames(wanted);
    for (const [node, value] of wanted) {
      if (!names.has(node)) names.set(node, {real: node.nodeValue, shown: null});
      if (node.nodeValue !== value) node.nodeValue = value;
      names.get(node).shown = value;
    }
  }
  function compactCount(value) {
    if (value < 1000) return String(value);
    const units = [[1e9, 'B'], [1e6, 'M'], [1e3, 'K']];
    const [base, suffix] = units.find(([unit]) => value >= unit);
    return `${(value / base).toFixed(1).replace(/\.0$/, '')}${suffix}`;
  }
  function countTarget(anchor) {
    const href = String(anchor.getAttribute('href') || '').toLowerCase();
    const match = href.match(/(?:^|\/)users\/([1-9]\d*)\/friends#!\/(followers|following)(?:$|[/?#])/i);
    if (match) return {id:match[1], kind:match[2].toLowerCase()};
    if (/\/friends#!\/(followers|following)(?:$|[/?#])/i.test(href)) return {id:String(context.userId), kind:href.match(/friends#!\/(followers|following)/i)[1].toLowerCase()};
    if (!href && anchor.closest('.profile-header-overlay,.profile-header')) {
      const match = (anchor.textContent || '').match(/\d[\d,.]*(?:[KMB])?\s+(Followers?|Following)\b/i);
      if (match) return {id:profileId() || String(context.userId), kind:match[1].toLowerCase().startsWith('follower') ? 'followers' : 'following'};
    }
  }
  function restoreCounts(wanted) {
    for (const [node, entry] of counts) {
      if (!node.isConnected) { counts.delete(node); continue; }
      if (node.nodeValue !== entry.shown) { entry.real = node.nodeValue; entry.shown = null; }
      if (!wanted.has(node)) {
        if (node.nodeValue !== entry.real) node.nodeValue = entry.real;
        if (entry.titleTarget?.isConnected && entry.titleTarget.getAttribute('title') === entry.title) {
          if (entry.realTitle == null) entry.titleTarget.removeAttribute('title');
          else entry.titleTarget.setAttribute('title', entry.realTitle);
        }
        counts.delete(node);
      }
    }
  }
  function applyCounts() {
    const wanted = new Map();
    for (const anchor of document.querySelectorAll('a')) {
      const target = countTarget(anchor);
      if (!target) continue;
      const source = context.mode && (target.id === String(context.userId) ? context.socialCounts : records.get(target.id)?.socialCounts);
      const value = validCounts(source)?.[target.kind];
      if (value === undefined) continue;
      const shown = compactCount(value), title = String(value);
      const nodes = [];
      const walker = document.createTreeWalker(anchor, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.nodeValue || '';
        if (/^\s*\d[\d,.]*(?:[KMB])?\s*$/i.test(text) || /\d[\d,.]*(?:[KMB])?\s+(?:Followers?|Following)\b/i.test(text) || /\b(?:Followers?|Following)\s+\d[\d,.]*(?:[KMB])?/i.test(text)) nodes.push(node);
      }
      for (const node of nodes) {
        const current = counts.get(node)?.real ?? node.nodeValue;
        const next = current.replace(/\d[\d,.]*(?:[KMB])?/i, shown);
        const titleTarget = node.parentElement?.closest('a') === anchor && /^\s*\d[\d,.]*(?:[KMB])?\s*$/i.test(current) ? node.parentElement : anchor;
        wanted.set(node, {value:next, titleTarget, title});
      }
    }
    restoreCounts(wanted);
    for (const [node, entry] of wanted) {
      if (!counts.has(node)) counts.set(node, {real:node.nodeValue, shown:null, realTitle:entry.titleTarget?.getAttribute('title')});
      const state = counts.get(node);
      if (node.nodeValue !== entry.value) node.nodeValue = entry.value;
      if (entry.titleTarget) entry.titleTarget.setAttribute('title', entry.title);
      state.shown = entry.value; state.titleTarget = entry.titleTarget; state.title = entry.title;
    }
  }
  function apply() {
    globalThis.LarpbloxVerification?.setRecords(records);
    applyNames();
    applyCounts();
    for (const [id, surface] of portraits) if (!records.has(id)) { surface.update({active:false}); portraits.delete(id); }
    for (const [id, surface] of wearing) if (!records.has(id)) { surface.update({active:false}); wearing.delete(id); }
    for (const [id, record] of records) {
      if (!portraits.has(id)) portraits.set(id, LarpbloxAvatarSurfaces.createForPeer());
      portraits.get(id).update({userId:id, active:true, signature:JSON.stringify(record.snapshot) + (record.imageUrl || ''), imageUrl:record.imageUrl, backgroundId:record.snapshot.definition.backgroundRequestModel?.id, loadDefinition:async () => record.snapshot.definition});
      if (globalThis.LarpbloxProfileWearing?.createForPeer && context.thumbnail) {
        if (!wearing.has(id)) wearing.set(id, LarpbloxProfileWearing.createForPeer());
        wearing.get(id).update({userId:id, active:true, signature:JSON.stringify(record.snapshot), items:record.snapshot.items, loadDefinition:async()=>record.snapshot.definition, thumbnail:context.thumbnail});
      }
    }
  }
  let searchKey = '', searchTime = 0, searchPending = false, searchRecords = new Map(), searchRoot, searchReady = false;
  function searchKeyword() {
    return /^\/search\/users\/?$/i.test(location.pathname) ? (new URLSearchParams(location.search).get('keyword') || '').trim().slice(0, 50) : '';
  }
  function renderSearch() {
    let root = searchRoot;
    if (!context.mode || !searchKeyword() || !searchRecords.size) { root?.remove(); searchRoot = undefined; return; }
    const native = document.querySelector('[data-testid="player-search-results"], .player-search-results-grid, .people-list, .users-list, .people-search-results, #people-search-container .section-content');
    if (!native) return;
    const nativeResults = [...native.children].filter(element => element !== root);
    const loading = native.matches('[aria-busy="true"]') || nativeResults.some(element =>
      element.matches('[aria-busy="true"],[role="progressbar"]') || element.querySelector('[aria-busy="true"],[role="progressbar"]') ||
      [...element.querySelectorAll('img[src]')].some(image => !image.complete));
    // Wait once per search; later thumbnail refreshes must not hide a visible card.
    if (!searchReady && (loading || !nativeResults.some(element => element.textContent.trim()))) return;
    searchReady = true;
    if (!root) {
      root = searchRoot = document.createElement('div'); root.id = 'larpblox-people-results';
      root.className = 'larpblox-people-results'; root.setAttribute('aria-label', 'Larp player results');
    }
    const moved = native.firstElementChild !== root;
    if (moved) native.prepend(root);
    const key = JSON.stringify([...searchRecords].map(([id, record]) => [id, record.name, record.imageUrl]));
    if (root.dataset.results === key) return moved;
    root.dataset.results = key; root.replaceChildren();
    for (const [id, record] of searchRecords) {
      const card = document.createElement('article'); card.className = 'larpblox-person-card';
      const portrait = document.createElement('a'); portrait.href = `/users/${id}/profile`; portrait.className = 'larpblox-person-avatar';
      const image = document.createElement('img'); image.alt = record.name.displayName || record.name.username;
      if (record.imageUrl && /^https:\/\//.test(record.imageUrl)) image.src = record.imageUrl;
      portrait.append(image);
      const info = document.createElement('div');
      const name = document.createElement('a'); name.href = portrait.href; name.className = 'display-name'; name.textContent = record.name.displayName || record.name.username;
      const username = document.createElement('a'); username.href = portrait.href; username.className = 'text-name username'; username.textContent = '@' + record.name.username;
      const profile = document.createElement('a'); profile.href = portrait.href; profile.className = 'larpblox-person-profile'; profile.textContent = 'View profile';
      info.append(name, username); card.append(portrait, info, profile); root.append(card);
    }
    return true;
  }
  async function search() {
    const keyword = context.mode ? searchKeyword() : '';
    if (keyword !== searchKey) { searchKey = keyword; searchTime = 0; searchRecords.clear(); searchReady = false; }
    renderSearch();
    if (!keyword || searchPending || Date.now() - searchTime < 5000) return;
    searchPending = true; searchTime = Date.now(); const mine = generation;
    try {
      const response = await (globalThis.LarpbloxExtension || chrome.runtime).sendMessage({type:'larpblox-search-users',keyword});
      if (mine !== generation || keyword !== searchKeyword() || !context.mode || !response?.ok) return;
      const next = new Map();
      for (const record of (response?.ok && response.data?.players || []).slice(0, 50)) {
        try {
          const id = String(record.userId);
          if (!/^[1-9]\d{0,15}$/.test(id) || !record.name?.enabled || !/^[A-Za-z0-9_]{1,20}$/.test(record.name.username) || typeof record.name.displayName !== 'string' || record.name.displayName.length > 50) continue;
          LarpbloxGameBridge.validateSnapshot(record.snapshot, id);
          next.set(id, record);
        } catch {}
      }
      searchRecords = next; renderSearch();
    } catch { /* Keep ordinary Roblox results available when the relay is offline. */ }
    finally { searchPending = false; }
  }
  async function scan() {
    if (typeof document === 'undefined' || document.hidden) return;
    await search();
    if (!context.mode || !context.userId) {
      searchRecords.clear(); renderSearch(); records.clear(); apply(); return;
    }
    const ids = collect(), visible = new Set([...ids, ...searchRecords.keys()]);
    for (const [id, record] of searchRecords) records.set(id, record);
    for (const id of records.keys()) if (!visible.has(id)) records.delete(id);
    apply();
    if (pending || !ids.length || Date.now() - lastPoll < 5000) return;
    pending = true; lastPoll = Date.now(); const mine = generation;
    try {
      const response = await (globalThis.LarpbloxExtension || chrome.runtime).sendMessage({type:'larpblox-shared-users', userIds:ids});
      if (mine !== generation) return;
      if (!response?.ok) { records = new Map(searchRecords); apply(); return; }
      const next = new Map();
      for (let record of response.data.players || []) {
        try {
          const id = String(record.userId);
          if (!visible.has(id) || id === String(context.userId)) continue;
          LarpbloxGameBridge.validateSnapshot(record.snapshot, id);
          if (record.name && (typeof record.name.enabled !== 'boolean' || !/^[A-Za-z0-9_]{0,20}$/.test(record.name.username) || typeof record.name.displayName !== 'string' || record.name.displayName.length > 50)) continue;
          if (record.socialCounts && !validCounts(record.socialCounts)) record = {...record, socialCounts:undefined};
          next.set(id, record);
        } catch {}
      }
      for (const [id, record] of searchRecords) next.set(id, record);
      records = next; apply();
    } catch {
      if (mine === generation) { records = new Map(searchRecords); apply(); }
    } finally { pending = false; }
  }
  function update(next) {
    if (context.userId !== next.userId || context.mode !== next.mode) { generation++; records.clear(); lastPoll = 0; }
    context = next;
    if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; scan(); }); }
  }
  let searchFrame = false;
  function refreshSearchPlacement() {
    if (searchFrame) return;
    searchFrame = true;
    requestAnimationFrame(() => {
      searchFrame = false;
      // Navigation can happen before the next relay poll.
      if (searchKey !== (context.mode ? searchKeyword() : '')) { scan(); return; }
      if (renderSearch()) apply();
    });
  }
  new MutationObserver(refreshSearchPlacement).observe(document, {childList:true, subtree:true, attributes:true, attributeFilter:['aria-busy']});
  document.addEventListener('load', refreshSearchPlacement, true);
  window.addEventListener('popstate', refreshSearchPlacement);
  setInterval(scan, 5000);
  setInterval(flushProfile, 60000);
  globalThis.LarpbloxSharedUsers = {update, publishProfile};
})();
