const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const baselineVersion = require('../manifest.json').version;
const parts = baselineVersion.split('.').map(Number);
const nextVersion = [parts[0],parts[1],parts[2]+1].join('.');
const badVersion = [parts[0],parts[1],parts[2]+2].join('.');
const executablePath = process.env.LARPBLOX_TEST_CHROME || path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1248/chrome-win64/chrome.exe');
(async () => {
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'larpblox-remote-test-'));
  const launch = () => chromium.launchPersistentContext(profile, {executablePath, headless:true,
    args:[`--disable-extensions-except=${root}`, `--load-extension=${root}`]});
  let context = await launch();
  context.setDefaultTimeout(15000);
  try {
    const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const errors = [];
    worker.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const id = new URL(worker.url()).host;
    const disabled = await context.newPage();
    await disabled.goto(`chrome-extension://${id}/popup.html`);
    await disabled.frameLocator('#popup').getByRole('button',{name:'Settings',exact:true}).click();
    await disabled.frameLocator('#popup').getByRole('button',{name:'Open extension settings'}).waitFor();
    assert.match(await disabled.frameLocator('#popup').getByRole('region',{name:'Extension settings'}).getByRole('status').textContent(), /Allow User Scripts/);
    const missingPermission = await disabled.evaluate(() => chrome.runtime.sendMessage({type:'larpblox-popup-relay',tabId:1,message:{type:'larpblox-popup-get-state'}}));
    assert.equal(missingPermission.ok,false);
    assert.match(missingPermission.error,/Enable Allow User Scripts/);
    await disabled.close();
    const extensions = await context.newPage();
    await extensions.goto(`chrome://extensions/?id=${id}`);
    const toggle = extensions.locator('extensions-detail-view #allow-user-scripts cr-toggle');
    await toggle.waitFor();
    await toggle.click();
    await extensions.close();

    const ui = await context.newPage();
    await ui.goto(`chrome-extension://${id}/popup.html`);
    await ui.frameLocator('#popup').getByRole('button',{name:'Settings',exact:true}).click();
    const settings = ui.frameLocator('#popup').getByRole('region',{name:'Extension settings'});
    await settings.getByLabel(`Version ${baselineVersion}`,{exact:true}).waitFor();
    const sandbox = ui.frames().find(frame => frame.url().includes('popup-sandbox.html?'));
    assert.equal(await sandbox.evaluate(() => typeof chrome.storage),'undefined');
    assert.match(await sandbox.evaluate(async () => {
      try { await chrome.runtime.sendMessage({type:'unapproved-command'}); return 'unexpectedly allowed'; }
      catch (error) { return error.message; }
    }), /Unsupported popup request/);
    const send = (action) => ui.evaluate(action => chrome.runtime.sendMessage({type:'larpblox-website-update', action}), action);

    const fixture = '<!doctype html><html><head></head><body><header id="header"><ul id="settings-popover-menu"><li><a href="/my/account">Settings</a></li></ul></header><main><h1>Avatar fixture</h1></main></body></html>';
    await context.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:fixture}));
    const page = await context.newPage();
    const pageErrors = []; page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto('https://www.roblox.com/avatar');
    await page.waitForFunction(() => document.documentElement.classList.contains('rbx2016'));
    assert.equal(await page.locator('#larpblox-website-style').count(), 1);
    assert.equal(await page.getByText('Check for updates',{exact:true}).count(), 0);
    // The real registered website code initialized its message adapter and model.
    const scripts = await worker.evaluate(() => chrome.userScripts.getScripts());
    assert.equal(scripts.length, 1);
    assert.deepEqual(pageErrors, []);
    console.log('PASS: website loads through userScripts; update UI exists only inside the extension cog.');

    const bundle = JSON.parse(await fs.readFile(path.join(root,'website-bundle.json'),'utf8'));
    bundle.version = nextVersion;
    bundle.popup.js += `;document.documentElement.dataset.popupRelease=${JSON.stringify(nextVersion)};`;
    bundle.scripts.push({name:'remote-test.js', code:`document.documentElement.dataset.remoteWebsite = ${JSON.stringify(nextVersion)};`});
    let body = Buffer.from(JSON.stringify(bundle));
    let metadata = {schema:1, loaderApi:1, version:bundle.version, size:body.length,
      sha256:crypto.createHash('sha256').update(body).digest('hex'),
      url:`https://github.com/3xjn/larpblox-extension/releases/download/v${nextVersion}/website-${nextVersion}.json`};
    let mode = 'good', requests = [];
    // Intercept the worker's network at CDP Fetch (page routing does not cover it).
    const browserSession = await context.browser().newBrowserCDPSession();
    const {targetInfos} = await browserSession.send('Target.getTargets');
    const target = targetInfos.find(t => t.type === 'service_worker' && t.url === worker.url());
    const {sessionId} = await browserSession.send('Target.attachToTarget',{targetId:target.targetId, flatten:false});
    const pending = new Map(); let serial = 0;
    function cdp(method, params={}) {
      const id = ++serial;
      return new Promise((resolve,reject) => { pending.set(id,{resolve,reject}); browserSession.send('Target.sendMessageToTarget',{sessionId,message:JSON.stringify({id,method,params})}).catch(reject); });
    }
    browserSession.on('Target.receivedMessageFromTarget', async event => {
      if (event.sessionId !== sessionId) return;
      const data = JSON.parse(event.message);
      if (data.id) { const p = pending.get(data.id); pending.delete(data.id); if (data.error) p?.reject(new Error(data.error.message)); else p?.resolve(data.result); }
      if (data.method === 'Fetch.requestPaused') {
        const {requestId, request} = data.params;
        requests.push(request.url);
        if (mode === 'offline') { await cdp('Fetch.failRequest',{requestId,errorReason:'InternetDisconnected'}); return; }
        let bytes;
        if (request.url.startsWith('http://127.0.0.1:38261/')) {
          const reply = request.url.endsWith('/v1/pair') ? {code:'a'.repeat(32)} : {version:1,userId:'123',definition:{assets:[],bodyColors:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(n => [n+'Color','ffffff'])),playerAvatarType:{playerAvatarType:'R15'}},items:[]};
          bytes = Buffer.from(JSON.stringify(reply));
        } else bytes = request.url.endsWith('website-latest.json') ? Buffer.from(JSON.stringify(metadata)) : body;
        await cdp('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:bytes.toString('base64')});
      }
    });
    await cdp('Fetch.enable',{patterns:[{urlPattern:'https://github.com/3xjn/larpblox-extension/*'},{urlPattern:'http://127.0.0.1:38261/*'}]});
    // Exercise real user-script messaging without contacting an existing desktop.
    await worker.evaluate(() => { globalThis.WebSocket = undefined; });
    const [{id:tabId}] = await worker.evaluate(() => chrome.tabs.query({url:'https://www.roblox.com/avatar'}));
    const [bridge] = await worker.evaluate(async tabId => chrome.userScripts.execute({target:{tabId},js:[{code:'LarpbloxGameBridge.request("read", "123")'}]}), tabId);
    assert.equal(bridge.result.connected, true);
    assert.equal(bridge.result.snapshot.userId,'123');
    await worker.evaluate(tabId => chrome.userScripts.execute({target:{tabId},js:[{code:'LarpbloxExtension.onMessage.addListener(message => { if(message.type === "larpblox-game-state") document.documentElement.dataset.gamePush = message.userId; });'}]}),tabId);
    await worker.evaluate(() => notify('123', null));
    await page.waitForFunction(() => document.documentElement.dataset.gamePush === '123');
    console.log('PASS: real user-script request/response and game-state push retain the local bridge.');
    await page.evaluate(() => {
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:false,balance:1200}));
      const meta = document.createElement('meta'); meta.name = 'user-data'; meta.dataset.userid = '123'; meta.dataset.name = 'FixtureUser'; document.body.append(meta);
    });
    await ui.waitForFunction(async tabId => (await chrome.runtime.sendMessage({type:'larpblox-popup-relay',tabId,message:{type:'larpblox-popup-get-state'}})).ok,tabId);
    const popupState = await ui.evaluate(async tabId => chrome.runtime.sendMessage({type:'larpblox-popup-relay',tabId,message:{type:'larpblox-popup-get-state'}}),tabId);
    assert.equal(popupState.ok,true);
    assert.equal(popupState.balance,1200);
    const changed = await ui.evaluate(async tabId => chrome.runtime.sendMessage({type:'larpblox-popup-relay',tabId,message:{type:'larpblox-popup-update',balance:1300}}),tabId);
    assert.equal(changed.ok,true);
    assert.equal(changed.balance,1300);
    console.log('PASS: existing extension popup reads and updates website state through the loader.');
    await ui.addInitScript(tabId => { const query = chrome.tabs.query; chrome.tabs.query = filter => filter.active ? Promise.resolve([{id:tabId,url:'https://www.roblox.com/avatar'}]) : query(filter); },tabId);
    await ui.reload();
    await ui.frameLocator('#popup').getByRole('switch',{name:'Larp mode',exact:true}).waitFor();
    await fs.mkdir(path.join(root,'.test-artifacts'),{recursive:true});
    await ui.setViewportSize({width:380,height:600});
    await ui.screenshot({path:path.join(root,'.test-artifacts/extension-cog.png')});
    await ui.frameLocator('#popup').getByRole('button',{name:'Settings',exact:true}).click();
    // Return to the signed-out fixture before update/restart checks.
    await page.evaluate(() => document.querySelector('meta[name="user-data"]').remove());
    await ui.frameLocator('#popup').getByRole('button',{name:'Check for updates',exact:true}).click();
    await settings.getByRole('button',{name:'Apply update'}).waitFor();
    assert.equal(await settings.getByRole('button',{name:'Check for updates',exact:true}).count(),0);
    await ui.frameLocator('#popup').getByRole('button',{name:'Back to Larpblox'}).click();
    await ui.frameLocator('#popup').getByRole('button',{name:'Settings',exact:true}).click();
    await settings.getByRole('button',{name:'Apply update'}).waitFor();
    assert.equal(await settings.getByRole('button',{name:'Check for updates',exact:true}).count(),0);
    await ui.setViewportSize({width:380,height:300});
    await ui.frameLocator('#popup').locator('main').screenshot({path:path.join(root,'.test-artifacts/update-ready.png')});
    await ui.frameLocator('#popup').locator('html').waitFor();
    assert.equal(await ui.frameLocator('#popup').locator('html').getAttribute('data-popup-release'),nextVersion);
    console.log('PASS: downloaded popup code replaces the UI without changing extension files.');
    console.log('PASS: ready state has one reload action and survives reopening settings.');
    assert.equal(await page.locator('html').getAttribute('data-remote-website'),null);
    await page.reload();
    await page.waitForFunction(expected => document.documentElement.dataset.remoteWebsite === expected, nextVersion);
    console.log('PASS: manual update verifies, registers, and runs downloaded website code on reload.');
    await ui.frameLocator('#popup').getByRole('button',{name:'Back to Larpblox'}).click();
    await ui.frameLocator('#popup').getByRole('button',{name:'Settings',exact:true}).click();
    await settings.getByRole('button',{name:'Check for updates',exact:true}).waitFor();
    assert.equal(await settings.getByRole('button',{name:'Apply update'}).count(),0);
    console.log('PASS: refreshing the website clears the pending reload state.');
    const beforeOffline = requests.length;
    mode = 'offline';
    await page.reload();
    await page.waitForFunction(expected => document.documentElement.dataset.remoteWebsite === expected, nextVersion);
    assert.equal(requests.length, beforeOffline);
    assert.equal((await send('check')).ok, false);
    assert.equal((await send('status')).version,nextVersion);
    console.log('PASS: cached website works offline; offline check preserves installed version.');
    mode = 'good'; metadata.version = badVersion; metadata.url = metadata.url.replaceAll(nextVersion,badVersion);
    assert.match((await send('check')).error, /version does not match/);
    metadata.sha256 = '0'.repeat(64);
    assert.match((await send('check')).error, /verification failed/);
    assert.equal((await send('status')).version,nextVersion);
    console.log('PASS: mismatched versions and corrupted downloads leave the previous website active.');
    // A malformed bundle must never replace the working registration.
    bundle.version = badVersion; bundle.scripts.push({name:'parse-error.js', code:'const broken = ;'});
    body = Buffer.from(JSON.stringify(bundle)); metadata.size = body.length;
    metadata.sha256 = crypto.createHash('sha256').update(body).digest('hex');
    const parseResult = await send('check');
    assert.equal(parseResult.ok,false);
    assert.match(parseResult.error,/invalid JavaScript/);
    assert.equal((await send('status')).version,nextVersion);
    console.log('PASS: syntax errors are rejected before replacing the active release.');
    bundle.scripts.pop();
    mode = 'good'; bundle.version = badVersion; bundle.scripts.push({name:'broken-test.js',code:'throw new Error("intentional startup test");'});
    body = Buffer.from(JSON.stringify(bundle)); metadata.size = body.length;
    metadata.sha256 = crypto.createHash('sha256').update(body).digest('hex');
    assert.equal((await send('check')).updated,true);
    await page.reload();
    await ui.waitForFunction(async expected => (await chrome.runtime.sendMessage({type:'larpblox-website-update',action:'status'})).version === expected, nextVersion);
    await page.reload();
    await page.waitForFunction(expected => document.documentElement.dataset.remoteWebsite === expected, nextVersion);
    console.log('PASS: synchronous startup failure restores the previous cached release.');

    await ui.frameLocator('#popup').getByRole('button',{name:'Back to Larpblox'}).click();
    await ui.frameLocator('#popup').getByRole('button',{name:'Settings',exact:true}).click();
    await settings.getByLabel(`Version ${nextVersion}`,{exact:true}).waitFor();
    await fs.mkdir(path.join(root,'.test-artifacts'),{recursive:true});
    await ui.setViewportSize({width:380,height:400});
    await ui.frameLocator('#popup').locator('main').screenshot({path:path.join(root,'.test-artifacts/remote-updates.png')});
    assert.deepEqual(errors, []);
    const brokenPopup = JSON.parse(JSON.stringify(bundle));
    brokenPopup.scripts = brokenPopup.scripts.filter(script => script.name !== 'broken-test.js');
    brokenPopup.popup.js = 'const broken = ;';
    body = Buffer.from(JSON.stringify(brokenPopup)); metadata.size = body.length;
    metadata.sha256 = crypto.createHash('sha256').update(body).digest('hex');
    assert.equal((await send('check')).updated,true);
    await ui.reload();
    await settings.getByRole('button',{name:'Check for updates',exact:true}).waitFor();
    assert.equal((await send('status')).version,nextVersion);
    console.log('PASS: broken popup code restores the previous release and opens the bundled Coss UI.');
    await cdp('Fetch.disable');
    await browserSession.send('Target.detachFromTarget',{sessionId});
    await browserSession.detach();
    console.log('Restarting Chrome.');
    await context.close();
    context = await launch();
    context.setDefaultTimeout(15000);
    // --load-extension is asynchronous in a fresh test Chrome process.
    const resumedWorker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    await resumedWorker.evaluate(async () => {
      for (let attempt = 0; attempt < 100; attempt++) {
        if ((await chrome.userScripts.getWorldConfigurations()).some(world => world.messaging)) return;
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      throw new Error('User-script world was not restored after restart.');
    });
    console.log('Chrome restarted.');
    // Network is unavailable after a full browser restart, not just a page reload.
    await context.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:fixture}));
    await context.route('https://github.com/**', route => route.abort('internetdisconnected'));
    const restored = await context.newPage();
    restored.on('console', message => { if(message.type() === 'error') console.log('Restored console:',message.text()); });
    await restored.goto('https://www.roblox.com/avatar');
    try { await restored.waitForFunction(expected => document.documentElement.dataset.remoteWebsite === expected, nextVersion, {timeout:15000}); }
    catch (error) {
      console.log('Restart DOM:', await restored.evaluate(() => ({html:document.documentElement.className, remote:document.documentElement.dataset.remoteWebsite, style:!!document.querySelector('#larpblox-website-style')})));
      const w = context.serviceWorkers()[0];
      console.log('Restart worker:', w && await w.evaluate(async () => ({api:!!chrome.userScripts, versions:Object.values(await chrome.storage.local.get('larpblox-website-release')).map(x => ({current:x.current?.version,previous:x.previous?.version})), scripts:await chrome.userScripts?.getScripts().then(x=>x.map(s=>({id:s.id, bytes:s.js[0]?.code?.length}))).catch(e=>e.message)})));
      console.log('Restart worlds:',JSON.stringify(w && await w.evaluate(async () => {const tabs=await chrome.tabs.query({url:'https://www.roblox.com/avatar'}); return Promise.all(tabs.map(t=>chrome.userScripts.execute({target:{tabId:t.id},js:[{code:'({marker:globalThis.__larpbloxWebsite, adapter:!!globalThis.LarpbloxExtension, runtime:!!chrome.runtime})'}]})));})));
      throw error;
    }
    console.log('PASS: cached remote website survives a complete browser restart.');
    const restoredPopup = await context.newPage();
    await restoredPopup.goto(`chrome-extension://${id}/popup.html`);
    await restoredPopup.frameLocator('#popup').getByRole('button',{name:'Settings',exact:true}).click();
    assert.equal(await restoredPopup.frameLocator('#popup').locator('html').getAttribute('data-popup-release'),nextVersion);
    console.log('PASS: cached remote Coss popup survives browser restart without a download.');
  } finally { await context.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
