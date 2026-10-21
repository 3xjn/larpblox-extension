/* Cosmetic Larpblox verification marks for identity surfaces. */
(() => {
  'use strict';
  const verifiedImage = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%3E%20%3Cg%20clip-path%3D%22url%28%23clip0_8_46%29%22%3E%20%3Crect%20x%3D%225.88818%22%20width%3D%2222.89%22%20height%3D%2222.89%22%20transform%3D%22rotate%2815%205.88818%200%29%22%20fill%3D%22%230066FF%22%2F%3E%20%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M20.543%208.7508L20.549%208.7568C21.15%209.3578%2021.15%2010.3318%2020.549%2010.9328L11.817%2019.6648L7.45%2015.2968C6.85%2014.6958%206.85%2013.7218%207.45%2013.1218L7.457%2013.1148C8.058%2012.5138%209.031%2012.5138%209.633%2013.1148L11.817%2015.2998L18.367%208.7508C18.968%208.1498%2019.942%208.1498%2020.543%208.7508Z%22%20fill%3D%22white%22%2F%3E%20%3C%2Fg%3E%20%3Cdefs%3E%20%3CclipPath%20id%3D%22clip0_8_46%22%3E%20%3Crect%20width%3D%2228%22%20height%3D%2228%22%20fill%3D%22white%22%2F%3E%20%3C%2FclipPath%3E%20%3C%2Fdefs%3E%20%3C%2Fsvg%3E";
  const markerClass = 'larpblox-verified-badge';
  // Roblox display-name surfaces only. Username/alias fields are excluded.
  const profileSelector = '#profile-header-title-container-name,.profile-header-title,.profile-header-display-name,[data-testid="profile-header-title"],[data-testid="profile-header-display-name"],.profile-header-names > .profile-header-title-container > h1,.profile-header-names > span.profile-header-title-container > h1';
  let context = {mode:false, userId:'', verified:false, verifiedUserIds:[]};
  let queued = false;
  const userIdFrom = value => {
    try {
      const url = new URL(value || '', location.origin);
      return url.origin === 'https://www.roblox.com' ? url.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1] : undefined;
    } catch { return undefined; }
  };
  const ownProfileId = () => location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1];
  const nameChildSelector = '.display-name,[data-testid="profile-header-display-name"],[data-testid="profile-header-title"],[class*="display-name" i]';
  const usernameSelector = '.stylistic-alts-username,.profile-header-username,[data-testid="profile-header-username"],[class*="username" i]';
  const nativeBadgeSelector = '[data-rblx-verified-badge-icon],[data-testid="verified-badge"],.icon-verified:not(.larpblox-verified-badge)';
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
    element.className = `icon-verified ${markerClass}`;
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', 'Verified Larpblox user');
    element.title = 'Verified Larpblox user';
    const image = document.createElement('img');
    image.src = verifiedImage; image.alt = ''; image.setAttribute('aria-hidden', 'true');
    element.append(image);
    return element;
  }
  function removeAll() { document.querySelectorAll(`.${markerClass}`).forEach(node => node.remove()); }
  function placement(root) {
    return root.matches('.profile-header-names > .profile-header-title-container > h1,.profile-header-names > span.profile-header-title-container > h1') ? root.parentElement : root;
  }
  function targets() {
    const found = new Map();
    for (const anchor of document.querySelectorAll('a[href]')) {
      const id = userIdFrom(anchor.getAttribute('href'));
      if (!id || !hasVisibleText(anchor) || anchor.matches(usernameSelector) || anchor.querySelector(usernameSelector) || /^@/.test(anchor.textContent.trim())) continue;
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
        found.set(placement(name || root), profile);
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
      if (root.querySelector(`:scope > ${nativeBadgeSelector}`)) {
        root.querySelector(`:scope > .${markerClass}`)?.remove();
        continue;
      }
      if (!root.querySelector(`:scope > .${markerClass}`) && !root.querySelector(`:scope > ${nativeBadgeSelector}`)) {
        const mark = badge();
        const title = root.matches('.profile-header-title-container') ? root.querySelector(':scope > h1') : null;
        if (title || root.matches(profileSelector)) {
          mark.classList.add('larpblox-profile-verified');
          mark.querySelector('img').classList.add('profile-verified-badge-icon');
        }
        if (title) {
          root.insertBefore(mark, title.nextSibling);
        } else root.append(mark);
      }
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
