const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const {webcrypto}=require('node:crypto');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const snapshot={version:1,userId:'123',items:[{id:44,itemType:'Asset',name:'Copied coat',assetType:67}],definition:{assets:[{id:44,meta:{order:3,puffiness:.6}}],bodyColors:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(k=>[k+'Color','ff8000'])),scales:{width:.8},playerAvatarType:{playerAvatarType:'R6'}}};
(async()=>{
 const timers=new Set();const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id};let socket,requests=0,mismatch=false,old=false;
 const noop={addListener(){}};
 const context={console,URL,AbortController,crypto:webcrypto,setTimeout:later,clearTimeout:id=>{timers.delete(id);clearTimeout(id)},setInterval:()=>0,clearInterval(){},chrome:{runtime:{id:'test',onMessage:noop,onUserScriptMessage:noop,onUserScriptConnect:noop},storage:{local:{get:async()=>({}),set:async()=>{},remove:async()=>{}}}},fetch:async()=>({ok:true,json:async()=>({code:'a'.repeat(32)})}),WebSocket:class {
  static CLOSED=3;constructor(){socket=this;this.readyState=1;later(()=>this.onopen(),0)}
  send(text){const v=JSON.parse(text);if(v.type==='auth')later(()=>this.onmessage({data:JSON.stringify({type:'ready',avatarLookup:!old})}),0);
   if(v.type==='avatar-lookup'){requests++;later(()=>this.onmessage({data:JSON.stringify({type:'avatar-lookup-result',id:v.id,ok:true,targetUserId:mismatch?'777':v.targetUserId,snapshot})}),15)}}
  close(){this.readyState=3;this.onclose?.()}
 }};
 vm.createContext(context);context.importScripts=(...files)=>{for(const file of files)if(file==='larpbux-game-bridge.js')vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context)};
 vm.runInContext(fs.readFileSync(path.join(root,'larpbux-game-background.js'),'utf8'),context);
 const sender={url:'https://www.roblox.com/users/999/profile',id:'test',tab:{id:1}};
 const request=()=>context.handle({action:'lookupAvatar',userId:'123',targetUserId:'999'},sender);
 try {
  const both=await Promise.all([request(),request()]);assert.equal(requests,1);assert.equal(both[0].snapshot.definition.playerAvatarType.playerAvatarType,'R6');
  mismatch=true;await assert.rejects(request(),/different avatar/);mismatch=false;
  await assert.rejects(context.handle({action:'lookupAvatar',userId:'123',targetUserId:'../99'},sender),/Invalid Roblox account/);
  await assert.rejects(context.handle({action:'lookupAvatar',userId:'123',targetUserId:'999'},{...sender,url:'https://evil.test'}),/only on Roblox/);
  socket.onmessage({data:JSON.stringify({type:'ready',avatarLookup:false})});
  await assert.rejects(request(),/Update Larpblox Desktop/);
  socket.onmessage({data:JSON.stringify({type:'ready',avatarLookup:true})});
  const interrupted=request();const rejection=assert.rejects(interrupted,/connection closed/);
  await new Promise(resolve=>setTimeout(resolve,1));socket.close();await rejection;
  console.log('PASS: background RPC deduplicates concurrent lookups and rejects mismatched targets, invalid IDs and origins.');
 } finally {for(const id of timers)clearTimeout(id)}
 const browser=await chromium.launch({channel:'chrome',headless:true});try{
  const page=await browser.newPage();let webAvatarCalls=0;
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><button id="user-profile-header-contextual-menu-button" aria-expanded="true" aria-controls="menu">Menu</button><div id="menu"><div role="menu"><button role="menuitem">Report</button></div></div>'}));
  await page.route('https://avatar.roblox.com/**',r=>{webAvatarCalls++;return r.fulfill({status:429,body:'{}'})});
  await page.goto('https://www.roblox.com/users/999/profile');
  await page.evaluate(snapshot=>{localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,balance:777,items:[],equipped:[]}));window.copyCalls=0;window.LarpbloxExtension={sendMessage:async m=>{if(m.action==='lookupAvatar'){copyCalls++;return {ok:true,data:{connected:true,snapshot}}}return {ok:true,data:{connected:false}}}}},snapshot);
  await page.addScriptTag({path:path.join(root,'larpbux-game-bridge.js')});await page.addScriptTag({path:path.join(root,'larpbux.js')});
  await page.getByRole('menuitem',{name:'Steal avatar'}).click();await page.getByRole('button',{name:'Wear avatar',exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).gameLook),undefined,'lookup does not equip before confirmation');
  await page.getByRole('button',{name:'Wear avatar',exact:true}).click();await page.getByRole('heading',{name:'Avatar equipped'}).waitFor();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
  assert.equal(saved.balance,777);assert.equal(saved.gameLook.definition.playerAvatarType.playerAvatarType,'R6');assert.equal(saved.gameLook.definition.assets[0].meta.puffiness,.6);assert.equal(saved.items[0].id,44);assert.equal(webAvatarCalls,0);assert.equal(await page.evaluate(()=>copyCalls),1);
  console.log('PASS: Steal avatar uses client data, preserves metadata and balance, waits for confirmation, and makes no browser avatar API calls.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
