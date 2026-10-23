// Resolve Roblox peer IDs from the small React portrait components Larpblox owns.
(() => {
  'use strict';
  if (globalThis.__larpbloxPeerIdentities) return;
  globalThis.__larpbloxPeerIdentities = true;

  const roots = '.game-card-friend-info .info-avatar .avatar-card, [data-testid^="game-tile-stats-"] .info-avatar .avatar-card, [data-testid="game-players-player-interaction-modal"] .interaction-item';
  const fiberKeys = node => Object.keys(node).filter(key => key.startsWith('__reactFiber$') || key.startsWith('__reactProps$'));
  const id = value => {
    if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) return String(value);
    if (typeof value === 'string' && /^\d+$/.test(value) && Number(value) > 0) return value;
    return undefined;
  };
  const typeName = type => {
    if (typeof type === 'function') return type.displayName || type.name || '';
    if (typeof type === 'string') return type;
    if (type && typeof type === 'object') return type.displayName || type.name || type.type?.displayName || type.type?.name || '';
    return '';
  };
  function peerId(node) {
    for (const key of fiberKeys(node)) {
      let value = node[key];
      if (key.startsWith('__reactProps$')) value = {memoizedProps: value, type: value?.type};
      for (let depth = 0; value && depth < 14; depth++, value = value.return) {
        const props = value.memoizedProps || value.pendingProps;
        if (!props) continue;
        const name = typeName(value.type).replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (name === 'avatarheadshot' || props.type === 'AvatarHeadshot') {
          const target = id(props.targetId);
          if (target) return target;
        }
        if (typeof value.type === 'function') {
          const user = id(props.user?.id);
          const player = id(props.playerId);
          if (user || player) return user || player;
        }
      }
    }
  }
  function scan() {
    if (!document.documentElement) return;
    let changed = false;
    for (const root of document.querySelectorAll(roots)) {
      let found;
      for (const node of root.querySelectorAll('img,span')) {
        found = peerId(node);
        if (found) break;
      }
      const old = root.getAttribute('data-larpblox-peer-user-id');
      if (found ? old !== found : old !== null) {
        changed = true;
        root.removeAttribute('data-larpblox-peer-avatar-ready');
        root.removeAttribute('data-larpblox-peer-name-ready');
        if (found) root.setAttribute('data-larpblox-peer-user-id', found);
        else root.removeAttribute('data-larpblox-peer-user-id');
      }
    }
    if (changed) document.dispatchEvent(new CustomEvent('larpblox-peer-identities-changed', {bubbles: true}));
  }
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; scan(); });
  };
  const start = () => {
    if (!document.documentElement) return;
    document.documentElement.dataset.larpbloxPeerIdentitiesReady = 'true';
    new MutationObserver(schedule).observe(document, {subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset']});
    schedule();
  };
  if (document.documentElement) start();
  else document.addEventListener('DOMContentLoaded', start, {once: true});
})();
