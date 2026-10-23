/* global chrome */
// No page UI: wake the loader if Chrome has not registered the cached script yet.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'larpblox-popup-theme') return;
  const body = document.body, root = document.documentElement;
  const bodyClasses = new Set(body?.classList || []), rootClasses = new Set(root?.classList || []);
  const bodyTheme = bodyClasses.has('dark-theme') || bodyClasses.has('color-mode-dark') || body?.dataset.theme === 'dark' ? 'dark' :
    bodyClasses.has('light-theme') || bodyClasses.has('color-mode-light') || body?.dataset.theme === 'light' ? 'light' : null;
  const rootTheme = rootClasses.has('dark-theme') || rootClasses.has('color-mode-dark') || root?.dataset.theme === 'dark' ? 'dark' :
    rootClasses.has('light-theme') || rootClasses.has('color-mode-light') || root?.dataset.theme === 'light' ? 'light' : null;
  sendResponse({theme:bodyTheme || rootTheme});
  return true;
});
chrome.runtime.sendMessage({type:'larpblox-website-update', action:'start'}).catch(() => {});
