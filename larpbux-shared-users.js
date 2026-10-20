/* global chrome, LarpbloxGameBridge, LarpbloxAvatarSurfaces */
(() => {
  'use strict';
  const portraits = new Map(), names = new Map();
  let context = {}, records = new Map(), pending = false, lastPoll = 0, queued = false, generation = 0;
  const userIdFrom = value => {
    try {
      const url = new URL(value || '', location.origin);
      return url.origin === 'https://www.roblox.com' ? url.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/)?.[1] : undefined;
    } catch { return undefined; }
  };
  const visible = element => !!element.getClientRects?.().length;
  const profileId = () => location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/)?.[1];
  const profileSelector = '#profile-header-title-container-name,.stylistic-alts-username,.profile-header-title,.profile-header-username,.profile-header-display-name,[data-testid="profile-header-title"],[data-testid="profile-header-username"],[data-testid="profile-header-display-name"]';
  function collect() {
    const found = new Set();
    const profile = profileId();
    if (profile) found.add(profile);
    for (const anchor of document.querySelectorAll('a[href]')) {
      if (!visible(anchor)) continue;
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
          const label = node.parentElement.closest('[class*="username" i],[class*="display-name" i],[class*="user-name" i],[data-testid*="name" i]');
          const simpleLink = root.matches('a') && [...root.childNodes].every(child => child.nodeType === Node.TEXT_NODE || (child.nodeType === Node.ELEMENT_NODE && child.children.length === 0));
          if (!label && !simpleLink) continue;
          const value = (names.get(node)?.real ?? node.nodeValue).trim();
          if (!value || value.length > 50 || /^(view profile|profile|\d[\d.,KkMm\s]*)$/.test(value)) continue;
          const username = value.startsWith('@') || root.matches('.stylistic-alts-username,.profile-header-username,[data-testid="profile-header-username"]') || label?.matches('[class*="username" i],[class*="user-name" i],[data-testid*="username" i]');
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
      portraits.get(id).update({userId:id, active:true, signature:JSON.stringify(record.snapshot) + (record.imageUrl || ''), imageUrl:record.imageUrl, loadDefinition:async () => record.snapshot.definition});
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
      if (!response?.ok || response.data?.version !== 1 || !Array.isArray(response.data.players)) { records.clear(); apply(); return; }
      const next = new Map();
      for (const record of response.data.players || []) {
        try {
          const peer = LarpbloxGameBridge.validateSharedRecord(record, visible, context.userId);
          if (peer) next.set(peer.userId, peer);
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
  globalThis.LarpbloxSharedUsers = {update};
})();
