(() => {
  'use strict';
  const selector = 'a[href="/users/profile"], #navigation a[href*="/profile"], #header a[href*="/profile"], header a[href*="/profile"], .rbx-header a[href*="/profile"]';
  const profileNames = '#profile-header-title-container-name,.stylistic-alts-username,.profile-header-title,.profile-header-username,.profile-header-display-name,[data-testid="profile-header-title"],[data-testid="profile-header-username"],[data-testid="profile-header-display-name"]';
  let earlyTitle;
  const resolvedTitles = new Map();
  let peerGate = {id:'', timer:0, record:undefined};
  const peerProfile = () => location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1];
  function clearPeerPending(id) {
    if (id && peerGate.id && peerGate.id !== String(id)) return;
    clearTimeout(peerGate.timer);
    peerGate = {id:'', timer:0, record:undefined};
    document.documentElement?.removeAttribute('data-larpblox-identity-peer-name-pending');
    document.documentElement?.removeAttribute('data-larpblox-identity-peer-avatar-pending');
  }
  function setPeerPending(id) {
    const root = document.documentElement;
    if (!root || !id) return;
    if (peerGate.id !== String(id)) {
      clearTimeout(peerGate.timer);
      peerGate = {id:String(id), timer:0, record:undefined};
      root.dataset.larpbloxIdentityPeerNamePending = 'true';
      root.dataset.larpbloxIdentityPeerAvatarPending = 'true';
      peerGate.timer = setTimeout(() => {
        if (peerGate.id === String(id) && peerGate.record === undefined) { peerGate.record = null; checkPeerReady(id); }
      }, 5500);
    }
  }
  function checkPeerReady(id) {
    if (peerGate.id !== String(id)) return false;
    const record = peerGate.record;
    if (record === undefined) return false;
    const aliases = record?.name?.enabled ? [record.name.displayName, record.name.username, '@' + record.name.username].filter(Boolean) : [];
    const nameReady = !aliases.length || [...document.querySelectorAll(profileNames)].every(element => aliases.includes(element.textContent.trim()));
    const images = [...document.querySelectorAll('.profile-avatar-thumb img,.profile-avatar-left img,.profile-avatar img,.profile-avatar-image img,.profile-avatar-headshot img,.user-profile-header-details-avatar-container img')]
      .filter(image => !image.closest('button,.avatar-status,.presence-icon,[data-presence]'));
    const avatarReady = !record?.snapshot || images.every(image => !image.getAttribute('srcset') && image.dataset.larpbloxPeerAvatar === image.getAttribute('src'));
    const root = document.documentElement;
    if (nameReady) root.removeAttribute('data-larpblox-identity-peer-name-pending');
    else root.dataset.larpbloxIdentityPeerNamePending = 'true';
    if (avatarReady) root.removeAttribute('data-larpblox-identity-peer-avatar-pending');
    else root.dataset.larpbloxIdentityPeerAvatarPending = 'true';
    return nameReady && avatarReady;
  }
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
    const resolved = resolvedTitles.get(id);
    const titleName = resolved || display;
    const root = document.documentElement;
    root.dataset.larpbloxTitleId = id;
    // An uncached profile must not expose its account name while the lookup runs.
    if (!titleName && (disabled || state && !state.mode || resolvedTitles.has(id))) {
      root.dataset.larpbloxTitleNative = 'true';
      return;
    }
    const shown = typeof titleName === 'string' && titleName ? `${titleName} - Roblox` : 'Roblox';
    root.dataset.larpbloxTitleNative = 'false';
    root.dataset.larpbloxTitleLock = shown;
    if (!earlyTitle) earlyTitle = {id, real:document.title, shown};
    else if (document.title !== earlyTitle.shown) earlyTitle.real = document.title;
    earlyTitle.shown = shown;
    if (document.title !== shown) document.title = shown;
  }
  function editProfileImage(doc = document) {
    const eligible = image => !image.closest('nav,#header,#navigation,.rbx-header,[data-testid="user-menu"],[data-testid="account-menu"],.avatar-status,.presence-icon,[data-presence],[data-rblx-verified-badge-icon],[data-testid="verified-badge"]');
    const choose = images => images.find(image => image.dataset.larpbloxEditAvatar === 'true' || /AvatarHeadshot/i.test(image.getAttribute('src') || '')) || images[0];
    // The standalone editor does not always have Roblox's legacy content
    // wrappers. Identify its portrait directly, including after we replace src.
    const portrait = choose([...doc.querySelectorAll('img')].filter(image => eligible(image) &&
      (image.dataset.larpbloxEditAvatar === 'true' || /AvatarHeadshot/i.test((image.getAttribute('src') || '') + (image.getAttribute('srcset') || '')))));
    if (portrait) return portrait;
    const back = [...doc.querySelectorAll('a,button')].find(element => /^back to profile$/i.test(element.textContent.trim()));
    for (let root = back?.parentElement; root && root !== doc.body; root = root.parentElement) {
      const image = choose([...root.querySelectorAll('img')].filter(eligible));
      if (image) return image;
    }
    return choose([...doc.querySelectorAll('[data-larpblox-edit-avatar="true"],.avatar-card-image img,main img,#content img,.content img,.container-main img')].filter(eligible));
  }
  function update() {
    updateProfileTitle();
    const root = document.documentElement;
    if (!root) return;
    const meta = document.querySelector('meta[name="user-data"]');
    const id = meta?.getAttribute('data-userid') || meta?.getAttribute('data-user-id');
    if (!id && document.readyState === 'loading') return;
    const peerCardsEnabled = Boolean(id);
    if (root.dataset.larpbloxPeerCardsEnabled !== String(peerCardsEnabled)) root.dataset.larpbloxPeerCardsEnabled = String(peerCardsEnabled);
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
    if (!profile || ownProfile || !id) clearPeerPending();
    else { setPeerPending(profile); checkPeerReady(profile); }
  }
  globalThis.LarpbloxIdentityGate = {update, editProfileImage, resolvePeerProfile: (id, record) => {
    if (peerProfile() !== String(id)) return;
    if (document.documentElement?.dataset.larpbloxIdentityOwnProfile === 'true') return;
    setPeerPending(String(id));
    clearTimeout(peerGate.timer);
    peerGate.record = record || null;
    checkPeerReady(String(id));
  }, resolveProfileTitle: (id, display) => {
      if (!id) return;
      resolvedTitles.set(String(id), display || null);
      updateProfileTitle();
    }, profileTitleSource: id => document.documentElement?.dataset.larpbloxTitleSourceId === String(id) && document.documentElement.dataset.larpbloxTitleSource || (earlyTitle?.id === id ? earlyTitle.real : undefined),
    clearProfileTitle: id => {
      if (earlyTitle && earlyTitle.id === id) {
        if (document.title === earlyTitle.shown) document.title = document.documentElement.dataset.larpbloxTitleSourceId === String(id) && document.documentElement.dataset.larpbloxTitleSource || earlyTitle.real;
        earlyTitle = undefined;
      }
    }};
  update();
  new MutationObserver(update).observe(document, {childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['href','src','srcset','data-userid','data-user-id']});
  document.addEventListener('DOMContentLoaded',update,{once:true});
  window.addEventListener('storage',update);
})();
