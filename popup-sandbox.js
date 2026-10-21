// This page has an opaque origin and no extension APIs or network access.
(() => {
  let channel, ready = false;
  let nextId = 0;
  const pending = new Map();
  const send = message => parent.postMessage({channel, ...message}, '*');
  function request(method, args) {
    const id = ++nextId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(new Error('The extension did not respond. Reopen the popup.')); }, 30000);
      pending.set(id, {resolve, reject, timer});
      send({type:'rpc', id, method, args});
    });
  }
  window.addEventListener('message', event => {
    if (event.source !== parent) return;
    const message = event.data;
    if (!channel && message?.type === 'init' && typeof message.channel === 'string') {
      channel = message.channel;
      globalThis.chrome = {
        runtime:{sendMessage: value => request('message', value)},
        tabs:{query: value => request('activeTab', value)},
      };
      globalThis.LarpbloxPopupContext = {logo:message.popup.logo, version:message.version, settingsOpen:message.settingsOpen,
        ready() { ready = true; send({type:'ready'}); }};
      const style = document.createElement('style'); style.textContent = message.popup.css; document.head.append(style);
      new ResizeObserver(() => send({type:'resize', height:Math.ceil(document.body.getBoundingClientRect().height)})).observe(document.body);
      const script = document.createElement('script'); script.textContent = message.popup.js; document.head.append(script);
    } else if (message?.channel === channel && message.type === 'reply') {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      clearTimeout(waiter.timer); pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error)); else waiter.resolve(message.value);
    }
  });
  const failed = error => { if (!ready) send({type:'failed', error:String(error?.message || error)}); };
  window.addEventListener('error', event => failed(event.error || event.message));
  window.addEventListener('unhandledrejection', event => failed(event.reason));
})();
