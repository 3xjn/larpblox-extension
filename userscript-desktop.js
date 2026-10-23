/* Desktop sockets run at localhost; manager storage keeps RPC out of page scripts. */
const desktopOrigin = 'http://127.0.0.1:38261';
const desktopHost = location.origin === desktopOrigin;
let desktopFrame, desktopReady, desktopChannel, desktopSequence = 0, desktopListener;
const desktopPending = new Map();
function desktopRequest(message) {
  if (!desktopReady) {
    desktopChannel = crypto.randomUUID();
    desktopFrame = document.createElement('iframe'); desktopFrame.hidden = true; desktopFrame.title = 'Larpblox Desktop connection';
    desktopFrame.src = desktopOrigin + '/v1/pair#larpblox-userscript=' + desktopChannel;
    desktopListener = GM_addValueChangeListener(desktopChannel+':reply', (_,old,value)=>{
      if (!value) return;
      if(value.push){for(const listener of websiteListeners)listener(value.push);return;}
      const key=value.ready?'ready':value.id, waiter=desktopPending.get(key);
      if(waiter){desktopPending.delete(key);waiter.resolve(value.value);}
    });
    desktopReady = new Promise((resolve,reject) => {
      const timer = setTimeout(()=>{desktopFrame?.remove();desktopFrame=null;desktopReady=null;GM_removeValueChangeListener(desktopListener);reject(new Error('Open Larpblox Desktop and allow local network access for Roblox.'));},6000);
      desktopPending.set('ready',{resolve:()=>{clearTimeout(timer);resolve();}});
      (document.body || document.documentElement).append(desktopFrame);
    });
  }
  return desktopReady.then(()=>new Promise((resolve,reject)=>{
    const id = ++desktopSequence;
    const timer=setTimeout(()=>{desktopPending.delete(id);reject(new Error('The Desktop connection timed out. Try again.'));},40000);
    desktopPending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);}});
    GM.setValue(desktopChannel+':request',{id,message}).catch(error=>{clearTimeout(timer);desktopPending.delete(id);reject(error);});
  }));
}
function serveDesktopFrame() {
  const channel = location.hash.match(/^#larpblox-userscript=([a-f0-9-]+)$/)?.[1];
  if (parent === window || !channel) return;
  const post = message => GM.setValue(channel+':reply',{...message,nonce:crypto.randomUUID()});
  websiteListeners.add(message=>{void post({push:message});});
  GM_addValueChangeListener(channel+':request',async (_,old,value)=>{
    if(value?.message?.type!=='larpblox-game-bridge')return;
    try {await post({id:value.id,value:await sendMessage(value.message)});}
    catch(error){await post({id:value.id,value:{ok:false,error:error.message}});}
  });
  void post({ready:true});
}
window.addEventListener('pagehide',()=>{
  if(!desktopChannel)return;
  if(desktopListener!==undefined)GM_removeValueChangeListener(desktopListener);
  void GM.deleteValue(desktopChannel+':request');void GM.deleteValue(desktopChannel+':reply');
});
