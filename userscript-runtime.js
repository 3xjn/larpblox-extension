/* Userscript transport: the existing background handlers retain their validation. */
const userscriptVersion = __USERSCRIPT_VERSION__;
const userscriptInstall = 'https://github.com/3xjn/larpblox-extension/releases/download/main-latest/larpblox.user.js';
const gm = globalThis.GM || {};
const gmGetValue = gm.getValue?.bind(gm) || globalThis.GM_getValue;
const gmSetValueApi = gm.setValue?.bind(gm) || globalThis.GM_setValue;
const gmSetValue = (key, value) => Promise.resolve().then(() => gmSetValueApi(key, value));
const gmDeleteValue = gm.deleteValue?.bind(gm) || globalThis.GM_deleteValue;
const gmXmlHttpRequest = gm.xmlHttpRequest?.bind(gm) || globalThis.GM_xmlhttpRequest;
const gmRegisterMenuCommand = gm.registerMenuCommand?.bind(gm) || globalThis.GM_registerMenuCommand;
const gmNativeAddValueChangeListener = gm.addValueChangeListener?.bind(gm) || globalThis.GM_addValueChangeListener;
const gmNativeRemoveValueChangeListener = gm.removeValueChangeListener?.bind(gm) || globalThis.GM_removeValueChangeListener;
function gmAddValueChangeListener(key, listener) {
  if (gmNativeAddValueChangeListener) return {native:true,id:gmNativeAddValueChangeListener(key,listener)};
  const token = {native:false,active:true,timer:undefined};
  let previous, initialized = false;
  const poll = async () => {
    if (!token.active) return;
    let value;
    try { value = await gmGetValue(key); }
    catch { if (token.active) token.timer = setTimeout(poll,350); return; }
    if (!token.active) return;
    if (value !== undefined && (!initialized || JSON.stringify(value) !== JSON.stringify(previous))) listener(key,previous,value,false);
    previous = value; initialized = true;
    if (token.active) token.timer = setTimeout(poll,350);
  };
  void poll();
  return token;
}
function gmRemoveValueChangeListener(token) {
  if (!token) return;
  if (token.native) return void Promise.resolve(token.id).then(id => gmNativeRemoveValueChangeListener?.(id));
  token.active = false;
  clearTimeout(token.timer);
}
const websiteListeners = new Set(), backgroundListeners = new Set();
const sender = {id:'larpblox-userscript',url:location.origin === 'https://www.roblox.com' ? location.href : 'https://www.roblox.com/',tab:{id:1}};
const event = listeners => ({addListener: listener => listeners.add(listener)});
const storage = {
  async get(key) { return {[key]:await gmGetValue(key)}; },
  async set(values) { for (const [key,value] of Object.entries(values)) await gmSetValue(key,value); },
  async remove(key) { await gmDeleteValue(key); }
};
function privilegedFetch(url, options = {}) {
  if (!['https://larp.3xjn.dev','http://127.0.0.1:38261'].includes(new URL(url).origin)) return Promise.reject(new Error('Unsupported Larpblox connection.'));
  return new Promise((resolve,reject) => {
    let request;
    const abort = () => { request?.abort(); reject(new DOMException('Request cancelled','AbortError')); };
    if (options.signal?.aborted) return abort();
    request = gmXmlHttpRequest({url,method:options.method || 'GET',headers:options.headers,data:options.body,anonymous:true,timeout:40000,
      onload: response => { options.signal?.removeEventListener('abort',abort); resolve(new Response(response.responseText,{status:response.status,headers:{'Content-Type':'application/json'}})); },
      onerror: () => {options.signal?.removeEventListener('abort',abort);reject(new TypeError('Connection failed'));},
      ontimeout: () => {options.signal?.removeEventListener('abort',abort);reject(new TypeError('Connection timed out'));}
    });
    options.signal?.addEventListener('abort',abort,{once:true});
  });
}
async function dispatch(message) {
  return new Promise(resolve => {
    let handled = false;
    for (const listener of websiteListeners) handled = listener(message,{},resolve) === true || handled;
    if (!handled) resolve({ok:false,error:'Reload Roblox and try again.'});
  });
}
async function sendMessage(message) {
  if(message?.type === 'larpblox-game-bridge' && !desktopHost) return desktopRequest(message);
  if (message?.type === 'larpblox-popup-relay') return dispatch(message.message);
  if (message?.type === 'larpblox-website-update') {
    if (message.action === 'reload') { location.reload(); return {ok:true}; }
    return new Promise((resolve, reject) => {
      const fail = () => reject(new Error('Could not check for updates. Please try again.'));
      gmXmlHttpRequest({method:'GET',url:userscriptInstall.replace('.user.js','.meta.js')+'?check='+Date.now(),anonymous:true,timeout:15000,
        onload(response) {
          const latest = response.responseText?.match(/^\/\/\s*@version\s+(\d+(?:\.\d+)+)\s*$/m)?.[1];
          if (response.status !== 200 || !latest) return fail();
          const installed = userscriptVersion.split('.').map(Number), available = latest.split('.').map(Number);
          let newer = false;
          for (let i=0;i<Math.max(installed.length,available.length);i++) {
            if ((available[i] || 0) !== (installed[i] || 0)) { newer = (available[i] || 0) > (installed[i] || 0); break; }
          }
          resolve({ok:true,version:userscriptVersion,latestVersion:latest,updateAvailable:newer});
        },onerror:fail,ontimeout:fail});
    });
  }
  return new Promise(resolve => {
    let handled = false;
    for (const listener of backgroundListeners) handled = listener(message,sender,resolve) === true || handled;
    if (!handled) resolve({ok:false,error:'Unsupported Larpblox request.'});
  });
}
const chrome = {
  runtime:{id:sender.id,onMessage:event(backgroundListeners),onUserScriptMessage:{addListener(){}},onUserScriptConnect:{addListener(listener){listener({name:'larpblox-website',sender,postMessage:message=>{for(const listener of websiteListeners) listener(message);},onDisconnect:{addListener(){}}});}},
    sendMessage,getManifest:()=>({version:userscriptVersion,websiteVersion:userscriptVersion})},
  storage:{local:storage}, tabs:{query:async()=>[{id:1,url:location.origin === 'https://www.roblox.com' ? location.href : 'https://www.roblox.com/'}],sendMessage:(_,message)=>dispatch(message)}
};
globalThis.LarpbloxExtension = {sendMessage,onMessage:event(websiteListeners),getManifest:chrome.runtime.getManifest,dispatchPopup:dispatch};
