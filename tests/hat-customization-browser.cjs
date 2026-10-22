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
      window.previewStyles = []; window.previewRequests = 0; window.viewerCreated = 0;
      window.LarpbloxAvatar3D = {create:async(host, descriptor, options) => {
        window.lastViewerDefinition = options.definition; window.viewerCreated++; host.append(document.createElement('canvas'));
        return {getView:() => ({position:[0,0,5],target:[0,0,0]}), dispose() {},
          setHatStyle:async style => { window.previewStyles.push(style); }};
      }};
      window.LarpbloxAvatarRequests = {render:() => { window.previewRequests++; return Promise.resolve('https://tr.rbxcdn.com/avatar.png'); },cached:() => null};
    });
    const root = process.env.EXTENSION_ROOT || path.join(__dirname, '..');
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    await page.waitForFunction(() => window.viewerCreated === 1 && window.previewStyles.length > 0);
    const initial = await page.evaluate(() => popupMessage({type:'larpblox-popup-get-state'}));
    assert.equal(initial.hatCustomization.style, 'normal');
    assert.equal(initial.hatCustomization.equipped, true);
    assert.equal(await page.locator('.larpbux-hat-customization').count(), 0);
    for (const style of ['christmas','auto','halloween','stpatricks','normal','aprilfools']) {
      const result = await page.evaluate(style => popupMessage({type:'larpblox-popup-hat-style',style}), style);
      assert.equal(result.ok, true);
      assert.equal(result.hatCustomization.style, style);
      await page.waitForFunction(style => window.previewStyles.at(-1) === style, style);
      assert.equal(await page.evaluate(() => window.viewerCreated), 1, 'style changes must update the existing scene');
      assert.equal(await page.evaluate(() => window.previewRequests), 1, 'style changes must not wait for another Roblox render');
      await page.waitForFunction(style => window.published.at(-1)?.definition.assets.find(asset => asset.id === 169444515)?.meta?.smokestackStyle === style, style);
    }
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
    await page.evaluate(() => popupMessage({type:'larpblox-popup-update',mode:false}));
    assert.equal((await page.evaluate(() => popupMessage({type:'larpblox-popup-hat-style',style:'normal'}))).ok, false);
    console.log('PASS: popup hat state, saved choices, game sync, invalid values and mode guard.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
