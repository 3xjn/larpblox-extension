// Optional installed-manager check. Supply TEST_CHROME_PATH and USERSCRIPT_MANAGER_DIR;
// set USERSCRIPT_MANAGER=violentmonkey (default) or tampermonkey.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const manager=process.env.USERSCRIPT_MANAGER || 'violentmonkey';
const extension=process.env.USERSCRIPT_MANAGER_DIR,chromePath=process.env.TEST_CHROME_PATH;
assert.ok(extension && chromePath,'Set USERSCRIPT_MANAGER_DIR and TEST_CHROME_PATH to unpacked manager and test Chrome.');
(async()=>{
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'larpblox-manager-check-'));
 let source,context;const sockets=new Set(),messages=[];
 const server=http.createServer((req,res)=>{
  if(req.url==='/larpblox.user.js'){res.setHeader('Content-Type','text/javascript');res.end(source);return;}
  res.setHeader('Content-Type','application/json');
  if(req.url==='/v1/pair')res.end(JSON.stringify({code:'a'.repeat(32)}));
  else{res.statusCode=404;res.end('{}');}
 });
 server.on('upgrade',(req,socket)=>{
  assert.equal(req.headers.origin,`http://127.0.0.1:${server.address().port}`,'Desktop sees trusted localhost origin');
  sockets.add(socket);socket.on('close',()=>sockets.delete(socket));
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+crypto.createHash('sha1').update(req.headers['sec-websocket-key']+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')+'\r\n\r\n');
  const send=value=>{const data=Buffer.from(JSON.stringify(value));const header=data.length<126?Buffer.from([129,data.length]):Buffer.from([129,126,data.length>>8,data.length&255]);socket.write(Buffer.concat([header,data]));};
  let buffer=Buffer.alloc(0);
  socket.on('data',chunk=>{
   buffer=Buffer.concat([buffer,chunk]);
   while(buffer.length>=2){const opcode=buffer[0]&15;let length=buffer[1]&127,offset=2;if(length===126){if(buffer.length<4)return;length=buffer.readUInt16BE(2);offset=4;}if(length===127){socket.destroy();return;}if(buffer.length<offset+4+length)return;const mask=buffer.subarray(offset,offset+4),data=Buffer.from(buffer.subarray(offset+4,offset+4+length));buffer=buffer.subarray(offset+4+length);if(opcode===8){socket.end();return;}for(let i=0;i<data.length;i++)data[i]^=mask[i%4];if(opcode!==1)continue;const m=JSON.parse(data.toString());messages.push(m);if(m.type==='auth')send({type:'ready',avatarLookup:true,clientRequests:true});if(m.type==='publish')send({type:'ack',channel:m.channel,value:m.value});}
  });
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const port=server.address().port;
  source=fs.readFileSync(path.join(__dirname,'../website-release/larpblox.user.js'),'utf8').replaceAll('38261',String(port));
  const file=path.join(folder,'larpblox.user.js');fs.writeFileSync(file,source);
  context=await chromium.launchPersistentContext(path.join(folder,'profile'),{executablePath:chromePath,headless:true,args:['--disable-extensions-except='+extension,'--load-extension='+extension]});
  const worker=context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const id=worker.url().split('/')[2],install=await context.newPage();
  await install.goto('chrome://extensions/?id='+id);
  const permission=install.getByRole('switch',{name:/Allow User Scripts/});if(!await permission.isChecked())await permission.click();
  if(manager==='violentmonkey'){
   await install.goto(`chrome-extension://${id}/options/index.html`);
   const chooser=install.waitForEvent('filechooser');await install.getByText('New from file',{exact:true}).click();await(await chooser).setFiles(file);
   await install.getByText('Save & Close',{exact:true}).click();
  }else{
   await install.waitForTimeout(2200);await install.goto(`http://127.0.0.1:${port}/larpblox.user.js`);
   if(!context.pages().some(p=>p.url().includes('/ask.html'))) await context.waitForEvent('page',{predicate:p=>p.url().includes('/ask.html')});
   const ask=context.pages().find(p=>p.url().includes('/ask.html'));assert.ok(ask,'Tampermonkey installation prompt');await ask.getByRole('button',{name:'Install',exact:true}).click();
  }
  await context.grantPermissions(['local-network-access'],{origin:'https://www.roblox.com'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',headers:{'Content-Security-Policy':"script-src 'self' 'unsafe-inline'; connect-src 'self'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests;"},body:'<!doctype html><html class="dark-theme"><head><meta name="user-data" data-userid="999" data-name="NativeUser" data-displayname="Native Name"></head><body><main id="avatar-web-app"></main></body></html>'}));
  await page.goto('https://www.roblox.com/home');
  await page.waitForFunction(()=>document.documentElement.dataset.larpbloxPeerIdentitiesReady==='true');
  await page.bringToFront();const popupPromise=context.waitForEvent('page');
  await worker.evaluate(file=>chrome.tabs.create({url:chrome.runtime.getURL(file),active:false}),manager==='violentmonkey'?'popup/index.html':'action.html');
  const popup=await popupPromise;await popup.getByText('Open Larpblox',{exact:true}).click();
  await page.getByRole('dialog',{name:'Larpblox settings'}).waitFor();
  const deadline=Date.now()+5000;while(!messages.some(m=>m.type==='publish') && Date.now()<deadline)await page.waitForTimeout(50);
  assert.ok(messages.some(m=>m.type==='auth' && m.role==='browser'));
  assert.ok(messages.some(m=>m.type==='publish'),'Desktop request travels through manager-private storage');
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>{
   const colors=Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part=>[part+'Color','#ffffff']));
   const look={version:1,userId:'999',items:[{id:15093053680,itemType:'Asset',assetType:79,name:'Headless Head'}],definition:{assets:[{id:15093053680}],bodyColors:colors,scales:{height:1,width:1,depth:1,head:1,bodyType:0,proportion:0},playerAvatarType:{playerAvatarType:'R6'}}};
   localStorage.setItem('larpblox-cosmetics-v1:999',JSON.stringify({mode:true,balance:9999,items:look.items,equipped:['Asset:15093053680'],gameLook:look}));
  });
  let realRigWrites=0;
  await page.route('https://avatar.roblox.com/**',r=>{
   if(['POST','PATCH'].includes(r.request().method()))realRigWrites++;
   return r.fulfill({json:{success:true}});
  });
  await page.goto('https://www.roblox.com/my/avatar');
  await page.waitForFunction(()=>document.querySelector('#avatar-web-app')?.getAttribute('data-larpbux-avatar-view')==='larp');
  const rigStatus=await page.evaluate(async()=>{
   const response=await fetch('https://avatar.roblox.com/v4/avatar',{method:'PATCH',body:JSON.stringify({updateTypes:['UpdateAvatarType'],avatarDefinition:{updateAvatarModel:{playerAvatarType:'R15'}}})});
   return response.status;
  });
  assert.equal(rigStatus,200);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:999')).gameLook.definition.playerAvatarType.playerAvatarType==='R15',null,{timeout:3000});
  // Exercise the other native transport and repeat the return to R15.
  assert.equal(await page.evaluate(()=>new Promise(resolve=>{
   const xhr=new XMLHttpRequest();xhr.open('POST','https://avatar.roblox.com/v1/avatar/set-player-avatar-type');
   xhr.onload=()=>resolve(xhr.status);xhr.send(JSON.stringify({playerAvatarType:'R6'}));
  })),200);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:999')).gameLook.definition.playerAvatarType.playerAvatarType==='R6');
  assert.equal(await page.evaluate(async()=>{
   const response=await fetch('https://avatar.roblox.com/v4/avatar',{method:'PATCH',body:JSON.stringify({updateTypes:['UpdateAvatarType'],avatarDefinition:{updateAvatarModel:{playerAvatarType:'R15'}}})});
   return response.status;
  }),200);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:999')).gameLook.definition.playerAvatarType.playerAvatarType==='R15');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:999')));
  assert.deepEqual(saved.gameLook.definition.assets,[{id:15093053680}],'round trips retain Headless');
  assert.deepEqual(saved.equipped,['Asset:15093053680']);
  assert.equal(realRigWrites,0,'native page rig edits must stay local through the installed userscript');
  await page.reload();
  await page.waitForFunction(()=>document.querySelector('#avatar-web-app')?.getAttribute('data-larpbux-avatar-view')==='larp');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:999')).gameLook.definition.playerAvatarType.playerAvatarType),'R15');
  assert.deepEqual(errors,[]);
  console.log(`PASS: installed ${manager} initializes native hooks, opens settings, connects to Desktop, and switches R6/R15 through page Fetch/XHR while retaining Headless, persisting R15 after reload, and avoiding real avatar writes.`);
 }finally{await context?.close();for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
