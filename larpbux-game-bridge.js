// Cosmetic data only. No script source or executor commands cross this connection.
(() => {
  'use strict';
  const id = value => Number.isSafeInteger(value) && value > 0;
  function validateSnapshot(value, userId) {
    if (!value || value.version !== 1 || String(value.userId) !== String(userId)) throw new Error('The game outfit belongs to a different account.');
    const definition = value.definition;
    if (!definition || !Array.isArray(definition.assets) || definition.assets.length > 100 || !Array.isArray(value.items) || value.items.length > 100) throw new Error('Invalid game outfit.');
    for (const asset of definition.assets) if (!id(asset.id)) throw new Error('Invalid game asset.');
    const seen = new Set();
    for (const item of value.items) {
      if (!id(item.id) || seen.has(item.id) || item.itemType !== 'Asset' || !Number.isInteger(item.assetType) || item.assetType < 1 || item.assetType > 1000 || typeof item.name !== 'string' || item.name.length > 128) throw new Error('Invalid game item.');
      seen.add(item.id);
    }
    for (const part of ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg']) {
      if (!/^#?[0-9a-f]{6}$/i.test(definition.bodyColors?.[`${part}Color`] || '')) throw new Error('Invalid game body colors.');
    }
    if (!['R6', 'R15'].includes(definition.playerAvatarType?.playerAvatarType)) throw new Error('Invalid game body type.');
    for (const [name, scale] of Object.entries(definition.scales || {})) if (!['height', 'width', 'depth', 'head', 'proportion', 'bodyType'].includes(name) || !Number.isFinite(scale) || scale < 0 || scale > 5) throw new Error('Invalid game body scale.');
    const background = value.backgroundId ?? definition.backgroundId ?? definition.backgroundRequestModel?.id;
    if (background !== undefined && background !== 0 && !id(background)) throw new Error('Invalid game background.');
    if (value.backgrounds !== undefined) {
      if (!Array.isArray(value.backgrounds) || value.backgrounds.length > 100) throw new Error('Invalid background collection.');
      const seen = new Set();
      for (const item of value.backgrounds) {
        if (!id(item?.id) || seen.has(item.id) || typeof item.name !== 'string' || item.name.length > 128) throw new Error('Invalid collected background.');
        seen.add(item.id);
      }
      if (background > 0 && !seen.has(background)) throw new Error('Collect this background first.');
    }
    if (JSON.stringify(value).length > 262144) throw new Error('Game outfit is too large.');
    return value;
  }
  function validateNames(value, userId) {
    if (!value || value.version !== 1 || String(value.userId) !== String(userId) || typeof value.enabled !== 'boolean' || typeof value.name !== 'string') throw new Error('Invalid game name.');
    if (value.name && (!/^[A-Za-z0-9_]{3,20}$/.test(value.name))) throw new Error('Invalid game name.');
    if (value.displayName !== undefined && (typeof value.displayName !== 'string' || !value.displayName.trim() || [...value.displayName].length > 50 || /[\u0000-\u001f\u007f]/.test(value.displayName))) throw new Error('Invalid game display name.');
    if (value.sharing !== undefined && typeof value.sharing !== 'boolean') throw new Error('Invalid sharing preference.');
    if (value.verified !== undefined && typeof value.verified !== 'boolean') throw new Error('Invalid verification preference.');
    return {version: 1, userId: String(userId), enabled: value.enabled, name: value.name, ...(value.displayName !== undefined ? {displayName:value.displayName} : {}), ...(value.verified !== undefined ? {verified:value.verified} : {}), ...(value.sharing !== undefined ? {sharing:value.sharing} : {})};
  }
  function validateImage(value, userId) {
    if (!value || value.version !== 1 || String(value.userId) !== String(userId) || typeof value.imageUrl !== 'string' || !value.definition) throw new Error('Invalid avatar image.');
    validateSnapshot({version: 1, userId: String(userId), definition: value.definition, items: value.items || []}, userId);
    let parsed;
    try { parsed = new URL(value.imageUrl); } catch (_) { throw new Error('Invalid avatar image.'); }
    if (parsed.protocol !== 'https:' || !/^(tr|t[0-7])\.rbxcdn\.com$/i.test(parsed.hostname) || parsed.username || parsed.password || parsed.port || parsed.search || parsed.hash || !(/\.png$/i.test(parsed.pathname) || /\/Png\/[^/]*$/i.test(parsed.pathname))) throw new Error('Invalid avatar image.');
    return {version: 1, userId: String(userId), definition: value.definition, imageUrl: value.imageUrl};
  }
  async function request(action, userId, extra = {}) {
    const runtime = globalThis.LarpbloxExtension || globalThis.chrome?.runtime;
    if (!runtime?.sendMessage) throw new Error('Reload the extension to enable the game connection.');
    const result = await runtime.sendMessage({type: 'larpblox-game-bridge', action, userId: String(userId), ...extra});
    if (!result?.ok) throw new Error(result?.error || 'The game connection is unavailable.');
    return result.data;
  }
  const api = {validateSnapshot, validateNames, validateImage, request};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else globalThis.LarpbloxGameBridge = api;
})();
