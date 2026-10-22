const assert = require('node:assert/strict');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1100,height:900}});
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:`<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-back" style="width:277px;height:352px"><div class="avatar-thumbnail" style="width:277px;height:352px"></div></div><div class="breadcrumb-container">Accessories Head</div><div class="items-list avatar-item-list"></div></main>`}));
    await page.route('https://avatar.roblox.com/v2/avatar/avatar', r => r.fulfill({json:{assets:[],bodyColor3s:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part => [part+'Color3','#ffffff'])),scales:{},playerAvatarType:'R15'}}));
    await page.route('https://tr.rbxcdn.com/avatar.png', r => r.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64')}));
    await page.route('https://thumbnails.roblox.com/**', r => r.fulfill({json:{data:[]}}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({path:path.join(__dirname,'../larpbux-game-bridge.js')});
    await page.evaluate(() => {
      const hat = {id:169444515,itemType:'Asset',assetType:8,name:'Rbadam Smokestack',assetTypeVerified:true,limitedVerified:true};
      const bodyColors = Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part => [part + 'Color', '#ffffff']));
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version:1,mode:true,items:[hat],equipped:['Asset:169444515'],hatStyles:{'169444515':'normal'},gameLook:{version:1,userId:'123',items:[hat],definition:{assets:[{id:169444515}],bodyColors,scales:{},playerAvatarType:{playerAvatarType:'R15'}}}}));
      window.LarpbloxAppearance = {get:() => 'classic'}; window.published = []; window.LarpbloxExtension = {onMessage:{addListener:listener => window.popupListener = listener}}; window.popupMessage = message => new Promise(resolve => window.popupListener(message, {}, resolve));
      const request = LarpbloxGameBridge.request;
      LarpbloxGameBridge.request = async (kind, userId, payload) => { if (kind === 'publish') window.published.push(payload.snapshot); return kind === 'read' ? {connected:true,snapshot:null} : {connected:true}; };
      window.previewStyles = []; window.previewRequests = 0; window.previewTypes = []; window.viewerCreated = 0;
      window.surfaceSignatures = [];
      window.LarpbloxAvatarSurfaces = {update:options => window.surfaceSignatures.push(options.signature)};
      window.LarpbloxCharacters = {update:options => { window.characterOptions = options; }};
      window.LarpbloxAvatar3D = {create:async(host, descriptor, options) => {
        if (window.forceViewerFailure3d) throw new Error('Fixture model failure');
        window.lastViewerDefinition = options.definition; window.viewerCreated++; host.append(document.createElement('canvas'));
        return {getView:() => ({position:[0,0,5],target:[0,0,0]}), dispose() {},
          setHatStyle:async style => { window.previewStyles.push(style); }};
      }};
      window.holdRender=true;
      window.LarpbloxAvatarRequests = {render:(_definition,_user,_signal,type) => { window.previewRequests++; window.previewTypes.push(type); if(window.holdRender)return new Promise(resolve=>window.releaseRender=resolve); return window.forceRenderFailure || (window.forceRenderFailure3d && type === '3d') ? Promise.reject(new Error('Fixture preview failure')) : Promise.resolve('https://tr.rbxcdn.com/avatar.png'); },cached:() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='};
    });
    const root = process.env.EXTENSION_ROOT || path.join(__dirname, '..');
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    await page.waitForFunction(() => typeof window.releaseRender==='function' && document.querySelector('.larpbux-avatar-look img'));
    assert.equal(await page.locator('.larpbux-avatar-look img').evaluate(e=>getComputedStyle(e).visibility),'hidden','cached avatar stays hidden while the first model is loading');
    await page.evaluate(() => {window.holdRender=false;window.releaseRender('https://tr.rbxcdn.com/avatar.png');});
    await page.waitForFunction(() => window.viewerCreated === 1 && window.previewStyles.length > 0);
    const initial = await page.evaluate(() => popupMessage({type:'larpblox-popup-get-state'}));
    assert.equal(initial.hatCustomization.style, 'normal');
    assert.equal(initial.hatCustomization.equipped, true);
    assert.equal(await page.locator('.larpbux-hat-customization').count(), 0);
    for (const style of ['christmas','auto','halloween','stpatricks','normal','aprilfools']) {
      const result = await page.evaluate(style => popupMessage({type:'larpblox-popup-hat-style',style}), style);
      assert.equal(result.ok, true);
      assert.equal(result.hatCustomization.style, style);
      assert.ok((await page.evaluate(() => window.surfaceSignatures.at(-1))).includes(style), 'profile portraits must refresh when the saved season changes');
      await page.waitForFunction(style => window.previewStyles.at(-1) === style, style);
      assert.equal(await page.evaluate(() => window.viewerCreated), 1, 'style changes must update the existing scene');
      assert.equal(await page.evaluate(() => window.previewRequests), 1, 'style changes must not wait for another Roblox render');
      await page.waitForFunction(style => window.published.at(-1)?.definition.assets.find(asset => asset.id === 169444515)?.meta?.smokestackStyle === style, style);
    }
    const savedSeason = await page.evaluate(async () => {
      window.savedCharacter = await window.characterOptions.capture();
      return window.savedCharacter.definition.assets.find(asset => asset.id === 169444515).meta.smokestackStyle;
    });
    assert.equal(savedSeason, 'aprilfools', 'saved character captures its own selected season');
    await page.evaluate(() => popupMessage({type:'larpblox-popup-hat-style',style:'christmas'}));
    await page.evaluate(() => window.characterOptions.apply(window.savedCharacter));
    assert.equal((await page.evaluate(() => popupMessage({type:'larpblox-popup-get-state'}))).hatCustomization.style, 'aprilfools', 'wearing a saved character restores its season');
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')); delete state.gameLook;
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify(state));
      window.dispatchEvent(new StorageEvent('storage',{key:'larpblox-cosmetics-v1:123'}));
    });
    await page.waitForFunction(() => window.viewerCreated === 2);
    assert.equal(await page.evaluate(() => window.lastViewerDefinition.assets.find(asset => asset.id === 169444515).meta.smokestackStyle), 'aprilfools', 'browser-only avatar carries the saved style too');
    await page.evaluate(() => popupMessage({type:'larpblox-popup-hat-style',style:'birthday'}));
    await page.waitForFunction(() => window.previewStyles.at(-1) === 'birthday');
    assert.equal((await page.evaluate(() => popupMessage({type:'larpblox-popup-hat-style',style:'invalid'}))).ok, false);
    await page.evaluate(() => {delete window.releaseRender;window.holdRender=true;return popupMessage({type:'larpblox-popup-avatar-retry'});});
    await page.waitForFunction(() => typeof window.releaseRender==='function');
    assert.equal(await page.locator('.larpbux-avatar-look canvas').evaluate(e=>getComputedStyle(e).visibility),'hidden','hide the previous avatar while the replacement outfit is loading');
    await page.evaluate(() => {window.holdRender=false;window.releaseRender('https://tr.rbxcdn.com/avatar.png');});
    await page.waitForFunction(() => !document.querySelector('.larpbux-avatar-look').hasAttribute('aria-busy'));
    await page.evaluate(() => { window.forceRenderFailure = true; return popupMessage({type:'larpblox-popup-avatar-retry'}); });
    await page.waitForFunction(async () => (await popupMessage({type:'larpblox-popup-get-state'})).previewStatus === 'Fixture preview failure');
    assert.equal(await page.locator('.larpbux-avatar-status').count(),0,'preview errors belong only in extension settings');
    assert.equal(await page.locator('.larpbux-avatar-look canvas').count(),1,'keep the previous good avatar while retrying');
    assert.equal(await page.locator('.larpbux-avatar-look canvas').evaluate(e => getComputedStyle(e).visibility),'visible','keep the previous good avatar visible while retrying');
    await page.evaluate(() => { window.forceRenderFailure = false; return popupMessage({type:'larpblox-popup-avatar-retry'}); });
    await page.waitForFunction(async () => !(await popupMessage({type:'larpblox-popup-get-state'})).previewStatus);
    await page.evaluate(() => { window.forceRenderFailure3d = true; return popupMessage({type:'larpblox-popup-avatar-retry'}); });
    await page.waitForFunction(async () => !(await popupMessage({type:'larpblox-popup-get-state'})).previewStatus);
    assert.equal(await page.evaluate(() => window.previewTypes.at(-1)),'2d','a failed Smokestack 3D render falls back to a 2D editor preview');
    await page.locator('.larpbux-avatar-look:not([aria-busy]) img').waitFor({state:'visible'});
    await page.evaluate(() => { window.forceRenderFailure3d = false; });
    await page.waitForFunction(() => window.previewTypes.at(-1) === '3d');
    assert.equal(await page.evaluate(() => window.previewStyles.at(-1)),'birthday','a temporary 2D fallback retries 3D and restores the selected season');
    await page.evaluate(() => { window.forceViewerFailure3d = true; return popupMessage({type:'larpblox-popup-avatar-retry'}); });
    await page.locator('.larpbux-avatar-look:not([aria-busy]) img').waitFor({state:'visible'});
    assert.equal(await page.evaluate(() => window.previewTypes.at(-1)),'2d','a 3D model failure also keeps a visible 2D fallback');
    await page.evaluate(() => { window.forceViewerFailure3d = false; });
    await page.evaluate(() => popupMessage({type:'larpblox-popup-update',mode:false}));
    assert.equal((await page.evaluate(() => popupMessage({type:'larpblox-popup-hat-style',style:'normal'}))).ok, false);
    console.log('PASS: popup hat state, saved choices, game sync, invalid values and mode guard.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
