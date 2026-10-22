// Always-on real-avatar accessory stacking. Roblox still owns saving and errors.
(() => {
  'use strict';
  if (!/^\/my\/avatar\/?$/i.test(location.pathname) || globalThis.__larpbloxRealAvatar) return;
  globalThis.__larpbloxRealAvatar = true;

  const rigid = new Set([8, 41, 42, 43, 44, 45, 46, 47, 57, 58]);
  const layered = new Set([41, 64, 65, 66, 67, 68, 69, 70, 71, 72]);
  const accessory = type => rigid.has(type) || layered.has(type);
  const realEditor = () => !(document.documentElement?.classList.contains('larpblox-pretend-mode') &&
    document.querySelector('#avatar-web-app')?.getAttribute('data-larpbux-avatar-view') !== 'real');
  const wrapped = new WeakMap();

  function wrap(original, limit = false) {
    if (wrapped.has(original)) return wrapped.get(original);
    const replacement = new Proxy(original, {apply(target, receiver, args) {
      if (!realEditor()) return Reflect.apply(target, receiver, args);
      if (limit) return accessory(Number(args[0])) ? undefined : Reflect.apply(target, receiver, args);
      const result = Reflect.apply(target, receiver, args);
      const [added, current] = args;
      if (!Array.isArray(result) || !Array.isArray(current) || !accessory(Number(added?.assetType?.id))) return result;
      // Keep the native item records, including layered order and refinement metadata.
      const seen = new Set();
      const normalized = new Map(result.map(asset => [asset?.id, asset]));
      const assets = [added, ...current].map(asset => normalized.get(asset?.id) || asset).filter(asset => {
        if (!asset || seen.has(asset.id)) return false;
        seen.add(asset.id);
        return accessory(Number(asset.assetType?.id)) || result.includes(asset);
      });
      // BTRoblox's conservative advanced-editor ceilings. The rules endpoint only
      // lists basic per-category limits; Roblox's real save remains authoritative.
      // Do not silently remove something already worn when the total is full.
      const count = types => assets.filter(asset => types.has(Number(asset.assetType?.id))).length;
      return count(rigid) > 10 || count(layered) > 10 ? current : assets;
    }});
    wrapped.set(original, replacement);
    wrapped.set(replacement, replacement);
    return replacement;
  }

  // Modern Roblox bundles export the same native service through module getters.
  // Restrict this hook to that specific export; leave every other descriptor alone.
  const defineProperty = Object.defineProperty;
  Object.defineProperty = function(object, key, descriptor) {
    if ((key === 'addAssetToAvatar' || key === 'getAdvancedAccessoryLimit') && object?.__esModule && typeof descriptor?.get === 'function') {
      const getter = descriptor.get;
      descriptor = {...descriptor, get() {
        const value = Reflect.apply(getter, this, []);
        return typeof value === 'function' ? wrap(value, key === 'getAdvancedAccessoryLimit') : value;
      }};
    }
    return Reflect.apply(defineProperty, this, [object, key, descriptor]);
  };
  // The legacy editor exposes its service on Roblox instead. It can arrive later
  // than document_start; polling avoids changing Roblox's global property setters.
  function patchService() {
    const service = globalThis.Roblox?.AvatarAccoutrementService;
    if (!service) return;
    for (const name of ['addAssetToAvatar', 'getAdvancedAccessoryLimit']) {
      if (typeof service[name] !== 'function') continue;
      const value = wrap(service[name], name === 'getAdvancedAccessoryLimit');
      if (value !== service[name]) {
        try { service[name] = value; } catch (_) { /* Immutable module exports are handled above. */ }
      }
    }
  }
  patchService();
  setInterval(patchService, 250);
})();
