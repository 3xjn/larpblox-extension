/* global chrome */
// The only privileged popup code. Remote UI runs in the sandbox, not here.
(() => {
  const frame = document.querySelector('#popup');
  const recovery = document.querySelector('#recovery');
  let channel, timer, generation = 0, activeTab, version, usingFallback = false, themeMedia, themeMediaHandler;
  const allowedActions = new Set(['status','check','reload','enable']);
  const post = message => frame.contentWindow.postMessage({channel, ...message}, '*');
  const osTheme = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  async function pageTheme() {
    const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
    activeTab = tab?.id;
    if (!activeTab || !/^https:\/\/www\.roblox\.com\//i.test(tab?.url || '') || !chrome.tabs?.sendMessage) return null;
    try {
      const result = await chrome.tabs.sendMessage(activeTab, {type:'larpblox-popup-theme'});
      return result?.theme === 'dark' || result?.theme === 'light' ? result.theme : null;
    } catch { return null; }
  }
  async function popupData(fallback) {
    const result = await chrome.runtime.sendMessage({type:'larpblox-website-update',action:fallback ? 'popup-fallback' : 'popup'});
    if (!result?.ok) throw new Error(result?.error || 'The popup could not be loaded.');
    return result;
  }
  async function show(settingsOpen = false, fallback = false) {
    const current = ++generation;
    clearTimeout(timer);
    try {
      const data = await popupData(fallback);
      if (current !== generation) return;
      version = data.version; usingFallback = fallback;
      channel = crypto.randomUUID();
      const siteTheme = await pageTheme();
      if (current !== generation) return;
      const theme = siteTheme || osTheme();
      if (themeMedia && themeMediaHandler) themeMedia.removeEventListener('change', themeMediaHandler);
      themeMedia = siteTheme ? undefined : matchMedia('(prefers-color-scheme: dark)');
      if (themeMedia) {
        themeMediaHandler = () => post({type:'theme', theme:osTheme()});
        themeMedia.addEventListener('change', themeMediaHandler);
      } else themeMediaHandler = undefined;
      recovery.hidden = true;
      frame.hidden = false;
      frame.onload = () => {
        post({type:'init', popup:data.popup, version:data.version, settingsOpen, theme});
        timer = setTimeout(() => failed('The popup took too long to load.'), 10000);
      };
      frame.src = 'popup-sandbox.html?instance=' + channel;
    } catch (error) { failed(error.message); }
  }
  async function failed(message) {
    clearTimeout(timer);
    if (!usingFallback) {
      usingFallback = true;
      await chrome.runtime.sendMessage({type:'larpblox-website-update',action:'popup-failed',version}).catch(() => {});
      return show(true, true);
    }
    frame.hidden = true; recovery.hidden = false;
    document.querySelector('#recovery-message').textContent = message || 'The popup could not be loaded.';
  }
  async function rpc(method, args) {
    if (method === 'activeTab') {
      if (args?.active !== true || args.currentWindow !== true) throw new Error('Unsupported tab request.');
      const tabs = await chrome.tabs.query({active:true,currentWindow:true});
      activeTab = tabs[0]?.id;
      return tabs.map(({id,url}) => ({id,url}));
    }
    if (method !== 'message' || !args || typeof args !== 'object') throw new Error('Unsupported popup request.');
    if (args.type === 'larpblox-website-update' && allowedActions.has(args.action)) return chrome.runtime.sendMessage(args);
    if (args.type === 'larpblox-popup-relay' && args.tabId === activeTab && typeof args.message?.type === 'string' && args.message.type.startsWith('larpblox-popup-')) return chrome.runtime.sendMessage(args);
    throw new Error('Unsupported popup request.');
  }
  window.addEventListener('message', async event => {
    if (event.source !== frame.contentWindow || event.data?.channel !== channel) return;
    const message = event.data;
    if (message.type === 'ready') { clearTimeout(timer); return; }
    if (message.type === 'resize') {
      if (Number.isFinite(message.height)) frame.style.height = Math.max(120,Math.min(600,message.height)) + 'px';
      return;
    }
    if (message.type === 'failed') { void failed(message.error); return; }
    if (message.type !== 'rpc' || !Number.isInteger(message.id)) return;
    const requestChannel = channel;
    try {
      const value = await rpc(message.method,message.args);
      if (channel !== requestChannel) return;
      post({type:'reply', id:message.id, value});
      // Refresh the popup from the same verified update, preserving settings.
      if (message.args?.type === 'larpblox-website-update' && value?.updated) setTimeout(() => show(true), 0);
    } catch (error) { if (channel === requestChannel) post({type:'reply',id:message.id,error:error.message}); }
  });
  document.querySelector('#retry').onclick = () => show(true);
  void show();
})();
