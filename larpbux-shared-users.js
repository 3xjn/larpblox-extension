/* global chrome, LarpbloxGameBridge, LarpbloxAvatarSurfaces */
(() => {
  'use strict';
  const portraits = new Map(), names = new Map();
  let publication, publicationKey = '', publicationTime = 0, publishing = false, publicationGeneration = 0;
  function publishProfile(options) {
    const key = JSON.stringify([options.userId, options.active, options.signature, options.names]);
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
        record = {version:1, userId, snapshot:{version:1,userId,definition,items:[]}, name:{enabled:!!username,username,displayName:username}};
      }
      if (mine !== publicationGeneration) return;
      const response = await chrome.runtime.sendMessage({type:'larpblox-publish-profile',userId:String(options.userId),record});
      if (response?.ok && mine === publicationGeneration) publicationTime = Date.now();
    } catch (_) { /* Retry after transient relay or avatar failures. */ }
    finally { publishing = false; if (mine !== publicationGeneration) flushProfile(); }
  }
  let context = {}, records = new Map(), pending = false, lastPoll = 0, queued = false, generation = 0;
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
  function apply() {
    applyNames();
    for (const [id, surface] of portraits) if (!records.has(id)) { surface.update({active:false}); portraits.delete(id); }
    for (const [id, record] of records) {
      if (!portraits.has(id)) portraits.set(id, LarpbloxAvatarSurfaces.createForPeer());
      portraits.get(id).update({userId:id, active:true, signature:JSON.stringify(record.snapshot) + (record.imageUrl || ''), imageUrl:record.imageUrl, backgroundId:record.snapshot.definition.backgroundRequestModel?.id, loadDefinition:async () => record.snapshot.definition});
    }
  }
  async function scan() {
    if (document.hidden) return;
    if (!context.mode || !context.userId) {
      records.clear(); apply(); return;
    }
    const ids = collect(), visible = new Set(ids);
    for (const id of records.keys()) if (!visible.has(id)) records.delete(id);
    apply();
    if (pending || !ids.length || Date.now() - lastPoll < 5000) return;
    pending = true; lastPoll = Date.now(); const mine = generation;
    try {
      const response = await chrome.runtime.sendMessage({type:'larpblox-shared-users', userIds:ids});
      if (mine !== generation) return;
      if (!response?.ok) { records.clear(); apply(); return; }
      const next = new Map();
      for (const record of response.data.players || []) {
        try {
          const id = String(record.userId);
          if (!visible.has(id) || id === String(context.userId)) continue;
          LarpbloxGameBridge.validateSnapshot(record.snapshot, id);
          if (record.name && (typeof record.name.enabled !== 'boolean' || !/^[A-Za-z0-9_]{0,20}$/.test(record.name.username) || typeof record.name.displayName !== 'string' || record.name.displayName.length > 50)) continue;
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
