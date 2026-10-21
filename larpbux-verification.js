/* Cosmetic Larpblox verification marks for identity surfaces. */
(() => {
  'use strict';
  const markerClass = 'larpblox-verified-badge';
  const profileSelector = '#profile-header-title-container-name,.stylistic-alts-username,.profile-header-title,.profile-header-username,.profile-header-display-name,[data-testid="profile-header-title"],[data-testid="profile-header-username"],[data-testid="profile-header-display-name"]';
  let context = {mode:false, userId:'', verified:false, verifiedUserIds:[]};
  let queued = false;
  const userIdFrom = value => {
    try {
      const url = new URL(value || '', location.origin);
      return url.origin === 'https://www.roblox.com' ? url.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1] : undefined;
    } catch { return undefined; }
  };
  const ownProfileId = () => location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1];
  const nameChildSelector = '.username,.display-name,[data-testid*="name" i],[class*="username" i],[class*="display-name" i]';
  const hasVisibleText = node => Boolean((node?.textContent || '').replace(/\s+/g, ' ').trim());
  function ids() {
    const shared = context.records instanceof Map ? [...context.records] : [];
    return new Set([
      ...(Array.isArray(context.verifiedUserIds) ? context.verifiedUserIds : []),
      ...shared.filter(([, record]) => record?.verified === true).map(([id]) => id),
      ...(context.verified === true ? [context.userId] : [])
    ].map(String).filter(Boolean));
  }
  function badge() {
    const element = document.createElement('span');
    element.className = markerClass;
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', 'Verified Larpblox user');
    element.title = 'Verified Larpblox user';
    element.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 1.5 12.1 3l2.55-.1.95 2.4 2.05 1.55-.75 2.45.75 2.45-2.05 1.55-.95 2.4-2.55-.1L10 17.5l-2.1-1.4-2.55.1-.95-2.4-2.05-1.55.75-2.45-.75-2.45L4.4 5.3l.95-2.4L7.9 3 10 1.5Z"/><path class="larpblox-verified-check" d="m6.4 10.2 2.2 2.2 5-5"/></svg>';
    return element;
  }
  function removeAll() { document.querySelectorAll(`.${markerClass}`).forEach(node => node.remove()); }
  function targets() {
    const found = new Map();
    for (const anchor of document.querySelectorAll('a[href]')) {
      const id = userIdFrom(anchor.getAttribute('href'));
      if (!id || !hasVisibleText(anchor)) continue;
      const name = [...anchor.querySelectorAll(nameChildSelector)].find(hasVisibleText);
      found.set(name || anchor, id);
    }
    const profile = ownProfileId();
    if (profile) {
      const roots = [...document.querySelectorAll(profileSelector)].filter(hasVisibleText);
      for (const root of roots) {
        // Roblox often nests several historical profile selectors around one
        // displayed name. Keep only the deepest visible name surface.
        if (roots.some(other => other !== root && root.contains(other) && hasVisibleText(other))) continue;
        const name = [...root.querySelectorAll(nameChildSelector)].find(hasVisibleText);
        found.set(name || root, profile);
      }
    }
    return found;
  }
  function apply() {
    if (context.mode !== true) { removeAll(); return; }
    const wanted = ids();
    const active = new Set();
    for (const [root, id] of targets()) {
      if (!wanted.has(String(id))) continue;
      active.add(root);
      if (!root.querySelector(`:scope > .${markerClass}`)) root.append(badge());
    }
    document.querySelectorAll(`.${markerClass}`).forEach(node => { if (!active.has(node.parentElement)) node.remove(); });
  }
  function schedule() {
    if (queued) return;
    queued = true;
    const run = () => { queued = false; apply(); };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run); else setTimeout(run, 0);
  }
  function update(next = {}) {
    context = {...context, ...next};
    schedule();
  }
  function setRecords(records) {
    context.records = records instanceof Map ? records : new Map();
    schedule();
  }
  if (typeof MutationObserver !== 'undefined') new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
  globalThis.LarpbloxVerification = {update, setRecords};
  schedule();
})();
