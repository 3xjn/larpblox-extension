/* Userscript popup host. The packaged popup exposes renderUserscriptPopup. */
(() => {
  'use strict';
  const data = globalThis.LarpbloxUserscriptPopupData;
  if (!data || typeof globalThis.renderUserscriptPopup !== 'function') return;
  let overlay, popupRoot;
  const syncTheme = () => {
    if (!popupRoot) return;
    const html = document.documentElement, body = document.body;
    const dark = html.classList.contains('dark-theme') || body?.classList.contains('dark-theme') ||
      !html.classList.contains('light-theme') && !body?.classList.contains('light-theme') && matchMedia('(prefers-color-scheme: dark)').matches;
    popupRoot.classList.toggle('dark', Boolean(dark)); popupRoot.style.colorScheme = dark ? 'dark' : 'light';
  };
  const open = () => {
    if (overlay) { syncTheme(); overlay.style.display = 'grid'; return; }
    const ext = globalThis.LarpbloxExtension;
    if (!ext?.sendMessage && !ext?.dispatchPopup) return;
    overlay = document.createElement('div');
    overlay.id = 'larpblox-userscript-popup';
    Object.assign(overlay.style, {position:'fixed', inset:'0', zIndex:'2147483646', display:'grid', placeItems:'start end', padding:'64px 18px 18px', background:'rgba(0,0,0,.12)'});
    const shadow = overlay.attachShadow({mode:'open'});
    const style = document.createElement('style'); style.textContent = String(data.css || '').replaceAll(':root', ':host').replace(/body\s*\{/g, '[data-popup-surface] {'); shadow.append(style);
    const root = document.createElement('div'); root.setAttribute('data-popup-surface',''); root.setAttribute('role','dialog'); root.setAttribute('aria-label','Larpblox settings');
    Object.assign(root.style, {width:'380px', maxWidth:'calc(100vw - 36px)', maxHeight:'calc(100vh - 82px)', overflow:'auto', borderRadius:'12px', boxShadow:'0 8px 32px #0005', background:'var(--background)', color:'var(--foreground)', fontFamily:'system-ui, sans-serif', fontSize:'14px', lineHeight:'1.45'});
    shadow.append(root);
    const dark = document.documentElement.classList.contains('dark-theme') || document.body?.classList.contains('dark-theme');
    popupRoot = root;
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
    const context = {ready() {},
      logo: data.logo || '', version: data.version || '', settingsOpen: false, theme: dark ? 'dark' : 'light', userscript: true,
      runtime: {sendMessage(message) {
        if (message?.type === 'larpblox-popup-relay') return ext.dispatchPopup ? Promise.resolve(ext.dispatchPopup(message.message)) : Promise.resolve(ext.sendMessage(message.message));
        return Promise.resolve(ext.sendMessage(message));
      }},
      tabs: {query() { return Promise.resolve([{id: 1, url: location.href}]); }},
      openUpdate() { if (data.userscriptInstall) window.open(data.userscriptInstall, '_blank', 'noopener'); },
      root, container: root,
    };
    globalThis.renderUserscriptPopup(root, context);
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = 'Close'; close.setAttribute('aria-label', 'Close Larpblox settings');
    Object.assign(close.style, {position:'fixed', top:'18px', right:'18px', zIndex:'1', padding:'6px 10px', border:'1px solid #888', borderRadius:'6px', background:'Canvas', color:'CanvasText', cursor:'pointer'});
    close.onclick = () => { overlay.style.display = 'none'; };
    document.addEventListener('keydown', event => {if(event.key === 'Escape') overlay.style.display = 'none';});
    shadow.append(close); overlay.onclick = event => { if (event.composedPath()[0] === overlay) overlay.style.display = 'none'; };
    document.documentElement.append(overlay); syncTheme();
    const observer = new MutationObserver(syncTheme); observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    if(document.body) observer.observe(document.body,{attributes:true,attributeFilter:['class']});
  };
  globalThis.LarpbloxUserscriptPopup = {open};
})();
