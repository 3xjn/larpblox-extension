const assert = require('node:assert/strict');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-back"><div class="avatar-thumbnail"></div></div><div class="breadcrumb-container">Avatar</div><div class="items-list avatar-item-list"></div></main>'}));
    await page.route('https://avatar.roblox.com/v2/avatar/avatar', r => r.fulfill({json:{assets:[{id:900,assetType:{id:8},name:'Native Hat'},{id:901,assetType:{id:44},name:'Native Shoulder'}],bodyColor3s:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part => [part+'Color3','#ffffff'])),scales:{},playerAvatarType:'R15'}}));
    await page.route('https://thumbnails.roblox.com/**', r => r.fulfill({json:{data:[]}}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({path:path.join(__dirname,'../larpbux-game-bridge.js')});
    await page.evaluate(() => {
      const head = {id:301,itemType:'Asset',assetType:17,name:'Package Head'};
      const shirt = {id:302,itemType:'Asset',assetType:11,name:'Package Shirt'};
      const hat = {id:303,itemType:'Asset',assetType:8,name:'Package Hat'};
      const bundle = {id:201,itemType:'Bundle',bundleType:'BodyParts',name:'Full Package',assets:[head,shirt,hat]};
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version:1,mode:true,items:[bundle,head,shirt,hat],equipped:['Asset:301','Asset:302','Asset:303'],fullOutfitKey:'Bundle:201'}));
      window.viewerDefinitions = [];
      window.LarpbloxAvatarRequests = {render:async () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=',cached:() => null};
      window.LarpbloxAvatar3D = {create:async (host, descriptor, options) => { viewerDefinitions.push(options.definition); host.append(document.createElement('canvas')); return {getView:() => ({}), dispose() {}}; }};
    });
    await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});
    await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});
    await page.waitForFunction(() => window.viewerDefinitions.length > 0);
    const ids = await page.evaluate(() => viewerDefinitions.at(-1).assets.map(asset => asset.id));
    assert.ok(ids.includes(303), 'package hat remains in the rendered definition');
    assert.ok(!ids.includes(900) && !ids.includes(901), 'native accessories are removed after state reload');
    console.log('PASS: full package replacement survives reload and removes native accessories in browser preview.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
