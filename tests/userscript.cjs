const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const source = fs.readFileSync(path.join(__dirname,'../website-release/larpblox.user.js'),'utf8');
(async()=>{
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.context().grantPermissions(['local-network-access'],{origin:'https://www.roblox.com'});
  const values={};
  await page.exposeBinding('__getValue',(_,key)=>values[key]);
  await page.exposeBinding('__setValue',async(_,key,value)=>{const old=values[key];values[key]=value;await Promise.all(page.frames().map(frame=>frame.evaluate(({key,old,value})=>{for(const entry of Object.values(window.__valueListeners||{}))if(entry.key===key)entry.fn(key,old,value,true);},{key,old,value}).catch(()=>{})));});
  await page.exposeBinding('__deleteValue',(_,key)=>{delete values[key];});
  await page.route('http://127.0.0.1:38261/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html></html>'}));
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',headers:{'Content-Security-Policy':"script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https: ws://127.0.0.1:38261; img-src * data:;"},body:'<!doctype html><html class="dark-theme"><head><meta name="user-data" data-userid="999" data-name="NativeUser" data-displayname="Native Name"></head><body><div id="container-main"></div></body></html>'}));
  await page.addInitScript(()=>{
    window.__menu=[];window.__requests=[];window.__gm={};
    window.GM={getValue:key=>window.__getValue(key),setValue:(key,value)=>window.__setValue(key,value),deleteValue:key=>window.__deleteValue(key)};
    window.__valueListeners={};let listenerId=0;window.GM_addValueChangeListener=(key,fn)=>{const id=++listenerId;window.__valueListeners[id]={key,fn};return id;};window.GM_removeValueChangeListener=id=>delete window.__valueListeners[id];
    window.GM_addElement=(parent,tag,attrs)=>{const el=document.createElement(tag);Object.assign(el,attrs);parent.append(el);return el;};
    window.GM_registerMenuCommand=(name,fn)=>window.__menu.push({name,fn});
    window.GM_xmlhttpRequest=options=>{
      window.__requests.push(options.url);
      if(options.url.includes('/larpblox.meta.js')) {
       setTimeout(()=>window.__updateFailure ? options.onerror() : options.onload({status:200,responseText:'// @version '+(window.__latestVersion || '0.0.1')}),0);
       return {abort(){}};
      }
      let response={players:[]};
      if(options.url.endsWith('/v1/pair')) response={code:'a'.repeat(32)};
      if(options.url.includes('/v1/game/')) response=null;
      setTimeout(()=>options.onload({status:200,responseText:JSON.stringify(response)}),0);
      return {abort(){}};
    };
  });
  await page.addInitScript({content:source});
  await page.goto('https://www.roblox.com/home');
  await page.waitForFunction(()=>window.__menu.length>0);
  assert.equal(await page.evaluate(()=>window.__menu.length),1);
  const state=await page.evaluate(()=>LarpbloxExtension.dispatchPopup({type:'larpblox-popup-get-state'}));
  assert.equal(state.ok,true);assert.equal(state.mode,false);
  await page.evaluate(()=>window.__menu[0].fn());
  await page.getByRole('switch',{name:'Larp mode',exact:true}).waitFor();
  assert.equal(await page.getByRole('dialog',{name:'Larpblox settings'}).isVisible(),true);
  assert.equal(await page.getByRole('dialog').evaluate(n=>n.classList.contains('dark')),true);
  const modeSwitch=page.getByRole('switch',{name:'Larp mode',exact:true});
  const thumbLeft=()=>modeSwitch.evaluate(n=>n.querySelector('[data-slot="switch-thumb"]').getBoundingClientRect().left-n.getBoundingClientRect().left);
  const offLeft=await thumbLeft();
  await page.getByRole('switch',{name:'Larp mode',exact:true}).click();
  await page.getByRole('button',{name:'Save preview details',exact:true}).waitFor();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:999')).mode===true);
  await page.waitForTimeout(220);
  assert.ok(await thumbLeft()>offLeft+5,'the checked switch thumb must slide right inside the userscript shadow root');
  assert.ok(await modeSwitch.evaluate(n=>getComputedStyle(n.querySelector('[data-slot="switch-thumb"]')).transitionDuration.split(',').some(value=>parseFloat(value)>0)),'the thumb must animate between positions');
  const checkSwitches=async()=>{
   for(const name of ['Larp mode','Share appearance','Larp verification']) {
    const control=page.getByRole('switch',{name,exact:true});
    const position=()=>control.evaluate(n=>n.querySelector('[data-slot="switch-thumb"]').getBoundingClientRect().left-n.getBoundingClientRect().left);
    const checked=await control.getAttribute('aria-checked');
    const before=await position();
    await control.click();await page.waitForTimeout(220);
    assert.notEqual(await control.getAttribute('aria-checked'),checked,`${name} changes state`);
    const after=await position();
    assert.ok(checked==='true'?after<before-5:after>before+5,`${name} thumb follows its state`);
    await control.click();await page.waitForTimeout(220);
    assert.equal(await control.getAttribute('aria-checked'),checked);
    assert.ok(Math.abs(await position()-before)<1,`${name} thumb returns to its original position`);
   }
  };
  await checkSwitches();
  const relay=await page.evaluate(()=>LarpbloxExtension.sendMessage({type:'larpblox-shared-users',userIds:['1585368861']}));
  assert.equal(relay.ok,true);
  assert.ok(await page.evaluate(()=>window.__requests.some(url=>url.includes('/v1/profiles?userIds=1585368861'))));
  const bridge=await page.evaluate(()=>LarpbloxExtension.sendMessage({type:'larpblox-game-bridge',action:'read',userId:'999'}));
  assert.equal(bridge.ok,true); assert.equal(bridge.data.connected,true);
  assert.equal(await page.evaluate(()=>GM.getValue('larpblox-game-pair:999')), 'a'.repeat(32));
  await page.getByRole('dialog').screenshot({path:path.join(__dirname,'../.test-artifacts/userscript-dark.png')});
  assert.ok(await page.getByRole('dialog').evaluate(n=>Number(getComputedStyle(n).backgroundColor.match(/[\d.]+/)[0]) < .2));
  await page.evaluate(()=>document.documentElement.className='light-theme');
  await page.waitForFunction(()=>!document.querySelector('#larpblox-userscript-popup').shadowRoot.querySelector('[role=dialog]').classList.contains('dark'));
  await checkSwitches();
  await page.getByRole('dialog').screenshot({path:path.join(__dirname,'../.test-artifacts/userscript-light.png')});
  await page.getByRole('button',{name:'Close Larpblox settings'}).click();
  assert.equal(await page.getByRole('dialog').isVisible(),false);
  await page.evaluate(()=>window.__menu[0].fn());
  assert.equal(await page.getByRole('dialog').isVisible(),true);
  await page.evaluate(version=>window.__latestVersion=version,source.match(/@version\s+(\S+)/)[1]);
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  await page.getByText('You’re up to date.',{exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Update userscript',exact:true}).count(),0);
  await page.evaluate(()=>window.__latestVersion='999.0.0');
  await page.getByRole('button',{name:'Check for updates',exact:true}).click();
  await page.getByText('Version 999.0.0 is available.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Update userscript',exact:true}).waitFor();
  await page.evaluate(()=>window.__updateFailure=true);
  await page.getByRole('button',{name:'Check for updates',exact:true}).click();
  await page.getByText('Could not check for updates. Please try again.',{exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Update userscript',exact:true}).count(),0);
  assert.equal(await page.getByText('This update needs a newer Larpblox loader.').count(),0);
  await page.reload();
  await page.waitForFunction(()=>window.__menu.length===1);
  const restored=await page.evaluate(()=>LarpbloxExtension.dispatchPopup({type:'larpblox-popup-get-state'}));
  assert.equal(restored.mode,true,'saved extension settings survive reload');
  assert.deepEqual(errors,[]);
  console.log('PASS: standalone userscript starts under CSP, opens settings, saves/restores mode, looks up peers, and pairs/reads Desktop through manager transport.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
