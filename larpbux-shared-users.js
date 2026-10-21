/* global chrome, LarpbloxGameBridge, LarpbloxAvatarSurfaces */
(() => {
  'use strict';
  const portraits = new Map(), names = new Map();
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
        const definition = await options.loadDefinition(new AbortController().signal);
        const userId = String(options.userId), username = options.names?.username || '';
        record = {version:1, userId, verified:options.verified === true, snapshot:{version:1,userId,definition,items:[]}, name:{enabled:!!username,username,displayName:username}};
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
          if (!value || value.length > 50 || /^(view profile|profile|\d[\d.,KkMm\s]*)$/.test(value)) continue;
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
    for (const [id, record] of records) {
      if (!portraits.has(id)) portraits.set(id, LarpbloxAvatarSurfaces.createForPeer());
      portraits.get(id).update({userId:id, active:true, signature:JSON.stringify(record.snapshot) + (record.imageUrl || ''), imageUrl:record.imageUrl, backgroundId:record.snapshot.definition.backgroundRequestModel?.id, loadDefinition:async () => record.snapshot.definition});
    }
  }
  async function scan() {
    if (typeof document === 'undefined' || document.hidden) return;
    if (!context.mode || !context.userId) {
      records.clear(); apply(); return;
    }
    const ids = collect(), visible = new Set(ids);
    for (const id of records.keys()) if (!visible.has(id)) records.delete(id);
    apply();
    if (pending || !ids.length || Date.now() - lastPoll < 5000) return;
    pending = true; lastPoll = Date.now(); const mine = generation;
    try {
      const response = await (globalThis.LarpbloxExtension || chrome.runtime).sendMessage({type:'larpblox-shared-users', userIds:ids});
      if (mine !== generation) return;
      if (!response?.ok) { records.clear(); apply(); return; }
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
      records = next; apply();
    } catch {
      if (mine === generation) { records.clear(); apply(); }
    } finally { pending = false; }
  }
  function update(next) {
    if (context.userId !== next.userId || context.mode !== next.mode) { generation++; records.clear(); lastPoll = 0; }
    context = next;
    if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; scan(); }); }
  }
  setInterval(scan, 5000);
  setInterval(flushProfile, 60000);
  globalThis.LarpbloxSharedUsers = {update, publishProfile};
})();
