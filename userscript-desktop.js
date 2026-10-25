/* Desktop sockets run at localhost; manager storage keeps RPC out of page scripts. */
const desktopOrigin = 'http://127.0.0.1:38261';
const desktopHost = location.origin === desktopOrigin;
let desktopFrame, desktopReady, desktopChannel, desktopSequence = 0, desktopListener;
let desktopFallbackQueue = Promise.resolve(), desktopMailboxWrite = Promise.resolve();
const desktopDeliveredNonces = new Set(), desktopDeliveredOrder = [];
const desktopPending = new Map();
function desktopRequest(message) {
  if (!gmNativeAddValueChangeListener) {
    const next = desktopFallbackQueue.then(() => desktopRequestInternal(message));
    desktopFallbackQueue = next.catch(() => {});
    return next;
  }
  return desktopRequestInternal(message);
}
function desktopRequestInternal(message) {
  if (!desktopReady) {
    desktopChannel = crypto.randomUUID();
    desktopFrame = document.createElement('iframe'); desktopFrame.hidden = true; desktopFrame.title = 'Larpblox Desktop connection';
    desktopFrame.src = desktopOrigin + '/v1/pair#larpblox-userscript=' + desktopChannel;
    desktopListener = gmAddValueChangeListener(desktopChannel+':reply', (_,old,value)=>{
      const messages = Array.isArray(value) ? value : [value];
      for (const message of messages) {
        if (!message || (message.nonce && desktopDeliveredNonces.has(message.nonce))) continue;
        if (message.nonce) { desktopDeliveredNonces.add(message.nonce); desktopDeliveredOrder.push(message.nonce); if (desktopDeliveredOrder.length > 128) desktopDeliveredNonces.delete(desktopDeliveredOrder.shift()); }
        if(message.push){for(const listener of websiteListeners)listener(message.push);continue;}
        const key=message.ready?'ready':message.id, waiter=desktopPending.get(key);
        if(waiter){desktopPending.delete(key);waiter.resolve(message.value);}
      }
    });
    desktopReady = new Promise((resolve,reject) => {
      const timer = setTimeout(()=>{desktopFrame?.remove();desktopFrame=null;desktopReady=null;gmRemoveValueChangeListener(desktopListener);reject(new Error('Open Larpblox Desktop and allow local network access for Roblox.'));},6000);
      desktopPending.set('ready',{resolve:()=>{clearTimeout(timer);resolve();}});
      (document.body || document.documentElement).append(desktopFrame);
    });
  }
  return desktopReady.then(()=>new Promise((resolve,reject)=>{
    const id = ++desktopSequence;
    const timer=setTimeout(()=>{desktopPending.delete(id);reject(new Error('The Desktop connection timed out. Try again.'));},40000);
    desktopPending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);}});
    gmSetValue(desktopChannel+':request',{id,message}).catch(error=>{clearTimeout(timer);desktopPending.delete(id);reject(error);});
  }));
}
function serveDesktopFrame() {
  const channel = location.hash.match(/^#larpblox-userscript=([a-f0-9-]+)$/)?.[1];
  if (parent === window || !channel) return;
  const post = message => {
    const payload = {...message,nonce:crypto.randomUUID()};
    if (gmNativeAddValueChangeListener) return gmSetValue(channel+':reply',payload);
    desktopMailboxWrite = desktopMailboxWrite.then(async()=>{
      const mailbox = await gmGetValue(channel+':reply');
      const next = Array.isArray(mailbox) ? mailbox : [];
      // ponytail: retain 64 replies per poll; sustained larger bursts need acknowledgements.
      next.push(payload);
      await gmSetValue(channel+':reply',next.slice(-64));
    });
    return desktopMailboxWrite;
  };
  websiteListeners.add(message=>{void post({push:message});});
  gmAddValueChangeListener(channel+':request',async (_,old,value)=>{
    if(value?.message?.type!=='larpblox-game-bridge')return;
    try {await post({id:value.id,value:await sendMessage(value.message)});}
    catch(error){await post({id:value.id,value:{ok:false,error:error.message}});}
  });
  void post({ready:true});
}
window.addEventListener('pagehide',()=>{
  if(!desktopChannel)return;
  if(desktopListener!==undefined)gmRemoveValueChangeListener(desktopListener);
  void gmDeleteValue(desktopChannel+':request');void gmDeleteValue(desktopChannel+':reply');
});
