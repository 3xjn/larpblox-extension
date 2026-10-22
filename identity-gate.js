(() => {
  'use strict';
  const selector = 'a[href="/users/profile"], #navigation a[href*="/profile"], #header a[href*="/profile"], header a[href*="/profile"], .rbx-header a[href*="/profile"]';
  const profileNames = '#profile-header-title-container-name,.stylistic-alts-username,.profile-header-title,.profile-header-username,.profile-header-display-name,[data-testid="profile-header-title"],[data-testid="profile-header-username"],[data-testid="profile-header-display-name"]';
  let earlyTitle;
  function updateProfileTitle() {
    const id = location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1];
    if (earlyTitle?.id !== id) earlyTitle = undefined;
    if (!id || !document.head) return;
    let state, cached, disabled;
    try {
      state = JSON.parse(localStorage.getItem(`larpblox-cosmetics-v1:${id}`) || 'null');
      cached = JSON.parse(localStorage.getItem(`larpblox-profile-title:${id}`) || 'null');
      disabled = localStorage.getItem('larpblox-profile-titles-enabled') === 'false';
    } catch { return; }
    const display = !disabled && (state ? state.mode && (state.names?.displayName || state.names?.username)
      : cached?.expires > Date.now() && cached.displayName);
    if (typeof display !== 'string' || !display) return;
    const shown = `${display} - Roblox`;
    if (!earlyTitle) earlyTitle = {id, real:document.title, shown};
    else if (document.title !== earlyTitle.shown) earlyTitle.real = document.title;
    earlyTitle.shown = shown;
    if (document.title !== shown) document.title = shown;
  }
  function editProfileImage(doc = document) {
    const back = [...doc.querySelectorAll('a,button')].find(element => /^back to profile$/i.test(element.textContent.trim()));
    for (let root = back?.parentElement; root && root !== doc.body; root = root.parentElement) {
      const image = [...root.querySelectorAll('img')].find(image => !image.closest('header,nav,#header,#navigation'));
      if (image) return image;
    }
    return [...doc.querySelectorAll('.avatar-card-image img,main img,#content img,.content img')].find(image => !image.closest('header,nav,#header,#navigation'));
  }
  function update() {
    updateProfileTitle();
    const root = document.documentElement;
    if (!root) return;
    const meta = document.querySelector('meta[name="user-data"]');
    const id = meta?.getAttribute('data-userid') || meta?.getAttribute('data-user-id');
    if (!id && document.readyState === 'loading') return;
    let state;
    try { state = JSON.parse(localStorage.getItem(`larpblox-cosmetics-v1:${id}`) || 'null'); } catch {}
    const name = state?.mode ? state.names?.username || meta?.getAttribute('data-name') || '' : '';
    const display = state?.mode ? state.names?.displayName || state.names?.username || meta?.getAttribute('data-displayname') || name : '';
    const aliases = [name, display, name ? '@'+name : ''].filter(Boolean);
    const avatar = Boolean(state?.mode && (state.gameLook || state.equipped?.length));
    const profile = location.pathname.match(/^\/users\/(\d+)\/profile\/?$/i)?.[1];
    const ownProfile = /^\/users\/profile\/?$/i.test(location.pathname) || Boolean(profile && profile === String(id));
    const editProfile = /^\/users\/profile\/edit\/?$/i.test(location.pathname);
    if (root.dataset.larpbloxIdentityEditProfile !== String(editProfile)) root.dataset.larpbloxIdentityEditProfile = String(editProfile);
    if (editProfile) {
      const image = editProfileImage();
      if (image) image.dataset.larpbloxEditAvatar = 'true';
      const realNames = [meta?.getAttribute('data-name'), meta?.getAttribute('data-displayname')].filter(Boolean);
      for (const element of document.querySelectorAll('main span, #content span, .content span')) {
        if (element.children.length) continue;
        const value = element.textContent.trim();
        if (![...realNames, ...realNames.map(value => '@'+value), ...aliases].includes(value)) continue;
        element.dataset.larpbloxEditName = 'true';
        element.dataset.larpbloxAliasReady = String(!name && !display || aliases.includes(value));
      }
    }
    for (const [key,value] of [['larpbloxIdentityChecked','true'],['larpbloxIdentityName',name || display ?'true':'false'],['larpbloxIdentityAvatar',String(avatar)],['larpbloxIdentityOwnProfile',String(ownProfile)]]) {
      if (root.dataset[key] !== value) root.dataset[key] = value;
    }
    for (const element of document.querySelectorAll(profileNames)) {
      const ready = !ownProfile || !name && !display || aliases.includes(element.textContent.trim());
      if (element.dataset.larpbloxAliasReady !== String(ready)) element.dataset.larpbloxAliasReady = String(ready);
    }
    for (const link of document.querySelectorAll(selector)) {
      const label = link.textContent.trim();
      const ready = !name && !display || aliases.includes(label) || /^(profile|view profile|my profile)$/i.test(label);
      if (link.dataset.larpbloxAliasReady !== String(ready)) link.dataset.larpbloxAliasReady = String(ready);
    }
  }
  globalThis.LarpbloxIdentityGate = {update, editProfileImage, profileTitleSource: id => earlyTitle?.id === id ? earlyTitle.real : undefined,
    clearProfileTitle: id => {
      if (earlyTitle?.id === id) {
        if (document.title === earlyTitle.shown) document.title = earlyTitle.real;
        earlyTitle = undefined;
      }
    }};
  update();
  new MutationObserver(update).observe(document, {childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['href','src','srcset','data-userid','data-user-id']});
  document.addEventListener('DOMContentLoaded',update,{once:true});
  window.addEventListener('storage',update);
})();
