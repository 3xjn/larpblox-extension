/* global chrome */
// Packaged background code: downloaded code runs only through userScripts.
(() => {
  'use strict';
  const API = 1;
  const KEY = 'larpblox-website-release';
  const SCRIPT = 'larpblox-website';
  const LATEST = 'https://github.com/3xjn/larpblox-extension/releases/download/main-latest/website-latest.json';
  const MAX = 8 * 1024 * 1024;
  let queue = Promise.resolve();
  let worldReady = false;
  const serial = work => { const next = queue.then(work); queue = next.catch(() => {}); return next; };
  const version = value => {
    if (typeof value !== 'string' || !/^\d+\.\d+\.\d+(?:\.\d+)?$/.test(value)) throw new Error('Invalid website version.');
    const parts = value.split('.').map(Number);
    if (parts.some(n => n > 65535)) throw new Error('Invalid website version.');
    return [...parts, 0].slice(0, 4);
  };
  const newer = (a, b) => { const x = version(a), y = version(b); for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return x[i] > y[i]; return false; };
  function validate(bundle) {
    if (!bundle || bundle.schema !== 1 || bundle.loaderApi !== API) throw new Error('This update needs a newer Larpblox loader.');
    version(bundle.version);
    if (typeof bundle.css !== 'string' || !Array.isArray(bundle.scripts) || !bundle.scripts.length || bundle.scripts.length > 60 ||
        bundle.scripts.some(s => !s || !/^[a-z0-9-]+\.js$/.test(s.name) || typeof s.code !== 'string') ||
        new Set(bundle.scripts.map(s => s.name)).size !== bundle.scripts.length || JSON.stringify(bundle).length > MAX) throw new Error('Invalid website update.');
    if (bundle.popup && (bundle.popup.schema !== 1 || typeof bundle.popup.js !== 'string' || typeof bundle.popup.css !== 'string' ||
        typeof bundle.popup.logo !== 'string' || !bundle.popup.logo.startsWith('data:image/png;base64,'))) throw new Error('Invalid popup update.');
    return bundle;
  }
  async function available() {
    try { await chrome.userScripts.getScripts(); return true; } catch { return false; }
  }
  async function baseline() {
    const response = await fetch(chrome.runtime.getURL('website-bundle.json'));
    if (!response.ok) throw new Error('The bundled website is missing. Run scripts/package-website.py, then reload the extension.');
    return validate(await response.json());
  }
  async function saved() { return (await chrome.storage.local.get(KEY))[KEY] || {}; }
  function code(bundle) {
    const build = JSON.stringify(bundle.version);
    const manifest = JSON.stringify({...chrome.runtime.getManifest(), websiteVersion: bundle.version});
    // The explicit adapter keeps privileged APIs out of downloaded website code.
    const prefix = `(() => { if (!globalThis.chrome?.runtime?.connect || !chrome.runtime.sendMessage || globalThis.__larpbloxWebsite) return; globalThis.__larpbloxWebsite = ${build}; try {
      const listeners = new Set();
      const connect = () => {
        const port = chrome.runtime.connect({name:'larpblox-website'});
        port.onMessage.addListener(message => { for (const listener of listeners) listener(message); });
        port.onDisconnect.addListener(() => { setTimeout(connect, 1000); });
      };
      connect();
      globalThis.LarpbloxExtension = {sendMessage: message => chrome.runtime.sendMessage(message), onMessage: {addListener: listener => listeners.add(listener)}, getManifest: () => (${manifest}),
        dispatchPopup: message => new Promise(resolve => { const timer = setTimeout(() => resolve({ok:false,error:'Reload Roblox and try again.'}), 5000); const respond = value => { clearTimeout(timer); resolve(value); }; for (const listener of listeners) listener(message, {}, respond); })};
      const style = document.createElement('style'); style.id = 'larpblox-website-style'; style.textContent = ${JSON.stringify(bundle.css)};
      const mount = () => (document.head || document.documentElement).append(style);
      if (document.documentElement) mount(); else new MutationObserver(function(_, observer) { if(document.documentElement) { observer.disconnect(); mount(); } }).observe(document, {childList:true});
    `;
    const suffix = `\n} catch (error) { delete globalThis.__larpbloxWebsite; chrome.runtime.sendMessage({type:'larpblox-website-update', action:'failed', version:${build}}).catch(() => {}); console.error('Larpblox website failed', error); } })();`;
    return prefix + bundle.scripts.map(s => `\n;\n${s.code}\n`).join('') + suffix;
  }
  async function register(bundle) {
    validate(bundle);
    if (!worldReady) {
      // Chrome may restore messaging:true in saved configuration without
      // restoring the messaging APIs. Reset once per worker before enabling.
      await chrome.userScripts.resetWorldConfiguration();
      await chrome.userScripts.configureWorld({messaging: true});
      worldReady = true;
    }
    const entry = {id: SCRIPT, matches:['https://www.roblox.com/*'], runAt:'document_start', world:'USER_SCRIPT', js:[{code:code(bundle)}]};
    const registered = await chrome.userScripts.getScripts({ids:[SCRIPT]});
    if (registered.length) await chrome.userScripts.update([entry]); else await chrome.userScripts.register([entry]);
  }
  async function state() {
    const record = await saved();
    const bundled = await baseline();
    // A loader installed from a newer release must not resume an older payload.
    const bundle = record.current && !newer(bundled.version, record.current.version) ? validate(record.current) : bundled;
    const enabled = await available();
    if (enabled) await register(bundle);
    return {record, bundle, enabled};
  }
  async function status() {
    const {bundle, enabled} = await state();
    let pendingReload = false;
    if (enabled) {
      const tabs = await chrome.tabs.query({url:'https://www.roblox.com/*'});
      const versions = await Promise.all(tabs.map(async tab => {
        try {
          const results = await chrome.userScripts.execute({target:{tabId:tab.id}, world:'USER_SCRIPT', js:[{code:'globalThis.__larpbloxWebsite || null'}]});
          return results[0]?.result;
        } catch { return null; } // Closed or navigating tabs do not need a reload.
      }));
      pendingReload = versions.some(loaded => loaded && loaded !== bundle.version);
    }
    return {enabled, version:bundle.version, pendingReload};
  }
  async function read(url, limit) {
    const response = await fetch(url, {cache:'no-store', credentials:'omit', signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error(response.status === 404 ? 'Website updates have not been published yet. Your current version is unchanged.' : 'Could not download the update. Try again later.');
    if (Number(response.headers.get('content-length')) > limit) throw new Error('The update is too large.');
    const reader = response.body.getReader(); const chunks = []; let length = 0;
    try { while (true) { const {done, value} = await reader.read(); if (done) break; length += value.byteLength; if (length > limit) throw new Error('The update is too large.'); chunks.push(value); } }
    finally { await reader.cancel().catch(() => {}); }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes;
  }
  async function check(sender) {
    const {bundle, enabled} = await state();
    if (!enabled) return {enabled, version:bundle.version};
    const meta = JSON.parse(new TextDecoder().decode(await read(LATEST, 16384)));
    if (meta.schema !== 1 || meta.loaderApi !== API) throw new Error('This update needs a newer Larpblox loader.');
    version(meta.version);
    if (!newer(meta.version, bundle.version)) return {enabled:true, version:bundle.version, updated:false};
    if (!Number.isInteger(meta.size) || meta.size <= 0 || meta.size > MAX || !/^[a-f0-9]{64}$/.test(meta.sha256) ||
        meta.url !== `https://github.com/3xjn/larpblox-extension/releases/download/v${meta.version}/website-${meta.version}.json`) throw new Error('Invalid update metadata.');
    const bytes = await read(meta.url, MAX);
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2,'0')).join('');
    if (bytes.length !== meta.size || hash !== meta.sha256) throw new Error('Update verification failed. Your current version is unchanged.');
    const next = validate(JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(bytes)));
    if (next.version !== meta.version) throw new Error('The update version does not match.');
    // Registration does not parse code. Use the intended execution context to
    // parse an unreachable block first; none of the downloaded code runs here.
    const target = /^https:\/\/www\.roblox\.com\//.test(sender.url || '') ? sender.tab :
      (await chrome.tabs.query({url:'https://www.roblox.com/*'}))[0];
    if (!target?.id) throw new Error('Open Roblox, then check for updates again.');
    const results = await chrome.userScripts.execute({target:{tabId:target.id}, js:[{code:`if (false) {\n${code(next)}\n}\n'larpblox-parse-ok';`}], world:'USER_SCRIPT'});
    if (!results.length || results.some(result => result.error || result.result !== 'larpblox-parse-ok')) throw new Error('The update contains invalid JavaScript. Your current version is unchanged.');
    await register(next);
    try { await chrome.storage.local.set({[KEY]:{current:next, previous:bundle}}); }
    catch (error) { await register(bundle); throw new Error('Could not save the update. Your current version is unchanged.', {cause:error}); }
    return {enabled:true, version:next.version, updated:true};
  }
  async function run(message, sender) {
    const ownPage = sender.url?.startsWith(chrome.runtime.getURL(''));
    if (sender.id !== chrome.runtime.id || (!ownPage && !/^https:\/\/www\.roblox\.com\//.test(sender.url || ''))) throw new Error('Updates are only available from Larpblox.');
    if (message.action === 'popup' || message.action === 'popup-fallback') {
      if (!ownPage) throw new Error('The popup is only available inside the extension.');
      const base = await baseline();
      const bundle = message.action === 'popup-fallback' ? base : (await state()).bundle;
      const source = bundle.popup ? bundle : base;
      return {popup:source.popup, version:source.version};
    }
    if (message.action === 'popup-failed') {
      if (!ownPage) throw new Error('Invalid popup failure report.');
      const record = await saved();
      if (record.current?.version === message.version && record.previous) {
        await register(record.previous);
        await chrome.storage.local.set({[KEY]:{current:record.previous}});
      }
      return {};
    }
    if (message.action === 'enable') {
      await chrome.tabs.create({url:`chrome://extensions/?id=${chrome.runtime.id}`}); return {};
    }
    if (message.action === 'reload') {
      const tabs = await chrome.tabs.query({url:'https://www.roblox.com/*'});
      await Promise.all(tabs.map(tab => chrome.tabs.reload(tab.id)));
      const {bundle, enabled} = await state();
      return {enabled, version:bundle.version, pendingReload:false};
    }
    if (message.action === 'failed') {
      if (!sender.tab || ownPage) throw new Error('Invalid website failure report.');
      const record = await saved();
      if (record.current?.version === message.version && record.previous) {
        await register(record.previous);
        await chrome.storage.local.set({[KEY]:{current:record.previous}});
        return {rolledBack:true, version:record.previous.version};
      }
      return {};
    }
    if (message.action === 'check') return check(sender);
    if (message.action === 'start') {
      if (!sender.tab || ownPage) throw new Error('Open Roblox to load the website.');
      const {bundle, enabled} = await state();
      // The worker can wake after document_start on installation/restart. The
      // in-world guard makes this safe when the registered script already ran.
      if (enabled) await chrome.userScripts.execute({target:{tabId:sender.tab.id}, js:[{code:code(bundle)}], world:'USER_SCRIPT'});
      return {enabled, version:bundle.version};
    }
    if (message.action === 'status') return status();
    throw new Error('Unknown update action.');
  }
  const listener = (message, sender, respond) => {
    if (message?.type === 'larpblox-popup-relay') {
      if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL('')) ||
          !Number.isInteger(message.tabId) || typeof message.message?.type !== 'string' || !message.message.type.startsWith('larpblox-popup-')) {
        respond({ok:false,error:'Invalid popup request.'}); return false;
      }
      (async () => {
        if (!(await available())) throw new Error('Enable Allow User Scripts in the extension’s Details, then reload your Roblox tab.');
        const tab = await chrome.tabs.get(message.tabId);
        if (!/^https:\/\/www\.roblox\.com\//.test(tab.url || '')) throw new Error('Open a signed-in Roblox tab first.');
        const results = await chrome.userScripts.execute({target:{tabId:tab.id}, world:'USER_SCRIPT', js:[{code:`globalThis.LarpbloxExtension?.dispatchPopup(${JSON.stringify(message.message)})`}]});
        return results[0]?.result || {ok:false,error:'Reload Roblox, then reopen Larpblox.'};
      })().then(respond,error => respond({ok:false,error:error.message}));
      return true;
    }
    if (message?.type !== 'larpblox-website-update') return false;
    serial(() => run(message, sender)).then(data => respond({ok:true, ...data}), error => respond({ok:false, error:error.message}));
    return true;
  };
  chrome.runtime.onMessage.addListener(listener);
  chrome.runtime.onUserScriptMessage.addListener(listener);
  chrome.runtime.onInstalled.addListener(() => serial(state).catch(console.error));
  chrome.runtime.onStartup.addListener(() => serial(state).catch(console.error));
  // World messaging must be restored whenever Chrome recreates this worker,
  // including wakes that do not dispatch onInstalled or onStartup.
  serial(state).catch(console.error);
})();
