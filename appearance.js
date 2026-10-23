(() => {
  'use strict';

  const key = 'larpblox-browser-appearance';
  // Classic appearance is temporarily unavailable, including saved preferences.
  const read = () => 'modern';
  const apply = root => {
    if (!root) return;
    const modern = read() === 'modern';
    root.classList.toggle('rbx2016', !modern);
    root.classList.toggle('larpblox-modern', modern);
  };
  const get = () => read();
  const set = (value, reload = true) => {
    const next = 'modern';
    try { localStorage.setItem(key, next); }
    catch (error) { throw new Error('Larpblox could not save the browser appearance preference.', {cause: error}); }
    if (reload) location.reload();
  };

  globalThis.LarpbloxAppearance = {get, set};
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (root) apply(root);
  else document.addEventListener('DOMContentLoaded', () => apply(document.documentElement), {once: true});
})();
