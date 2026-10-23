// Runs in the page realm so native title assignments cannot briefly expose names.
(() => {
  'use strict';
  if (globalThis.__larpbloxTitleGuard) return;
  globalThis.__larpbloxTitleGuard = true;
  const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
  if (!descriptor?.set || !descriptor.get) return;
  const expected = () => {
    const id = location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1];
    if (!id) return null;
    const root = document.documentElement;
    if (root?.dataset.larpbloxTitleId === id) {
      return root.dataset.larpbloxTitleNative === 'true' ? null : root.dataset.larpbloxTitleLock || 'Roblox';
    }
    try {
      if (localStorage.getItem('larpblox-profile-titles-enabled') === 'false') return null;
      const own = JSON.parse(localStorage.getItem(`larpblox-cosmetics-v1:${id}`) || 'null');
      if (own && !own.mode) return null;
      const cached = JSON.parse(localStorage.getItem(`larpblox-profile-title:${id}`) || 'null');
      const name = own?.mode ? own.names?.displayName || own.names?.username : cached?.expires > Date.now() && cached.displayName;
      return name ? `${name} - Roblox` : 'Roblox';
    } catch { return 'Roblox'; }
  };
  const filter = value => {
    const locked = expected();
    if (locked !== null && String(value) !== locked) {
      if (document.documentElement) {
        document.documentElement.dataset.larpbloxTitleSource = String(value);
        document.documentElement.dataset.larpbloxTitleSourceId = location.pathname.match(/^\/users\/(\d+)\/profile/i)?.[1] || '';
      }
      return locked;
    }
    return value;
  };
  Object.defineProperty(Document.prototype, 'title', {...descriptor, set(value) {
    descriptor.set.call(this, this === document ? filter(value) : value);
  }});
  for (const [prototype, key] of [[Node.prototype, 'textContent'], [HTMLTitleElement.prototype, 'text']]) {
    const original = Object.getOwnPropertyDescriptor(prototype, key);
    if (!original?.set) continue;
    Object.defineProperty(prototype, key, {...original, set(value) {
      original.set.call(this, this instanceof HTMLTitleElement && this.ownerDocument === document ? filter(value) : value);
    }});
  }
  // Keep our title first: the HTML parser can create native titles without
  // calling any JavaScript setter.
  const title = document.createElement('title');
  title.dataset.larpbloxProtectedTitle = 'true';
  const mount = () => {
    const locked = expected();
    if (locked === null) { title.remove(); return; }
    const root = document.documentElement;
    if (!root) return;
    let head = document.head;
    if (!head) { head = document.createElement('head'); root.prepend(head); }
    const id = location.pathname.match(/^\/users\/(\d+)\/profile/i)?.[1];
    const originalTitle = [...head.querySelectorAll('title')].find(element => element !== title);
    if (originalTitle?.textContent && root.dataset.larpbloxTitleSourceId !== id) {
      root.dataset.larpbloxTitleSource = originalTitle.textContent;
      root.dataset.larpbloxTitleSourceId = id;
    }
    if (title.textContent !== locked) title.textContent = locked;
    if (head.firstChild !== title) head.prepend(title);
  };
  mount();
  new MutationObserver(mount).observe(document, {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-larpblox-title-native','data-larpblox-title-lock','data-larpblox-title-id']});
})();
