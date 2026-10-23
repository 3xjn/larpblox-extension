const assert = require('node:assert/strict');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;

const HEAD_ID = 15058381150;
const GEAR_ID = 25740034;
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=';

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage({acceptDownloads:true});
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:
      '<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-back"><div class="avatar-thumbnail"></div></div><div class="breadcrumb-container">Avatar</div></main>'}));
    await page.route('https://avatar.roblox.com/v2/avatar/avatar', r => r.fulfill({json:{
      assets:[], bodyColor3s:{head:'#ffffff',torso:'#ffffff',leftArm:'#ffffff',rightArm:'#ffffff',leftLeg:'#ffffff',rightLeg:'#ffffff'},
      scales:{}, playerAvatarType:'R15'
    }}));
    await page.route('https://avatar.roblox.com/v2/avatar/avatar-rules', r => r.fulfill({json:{}}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(({head, gear, png}) => {
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version:1, mode:true,
        items:[head, gear], equipped:[`Asset:${head.id}`, `Asset:${gear.id}`]}));
      const listeners = [];
      window.LarpbloxExtension = {
        getManifest: () => ({version:'test', websiteVersion:'test'}),
        onMessage: {addListener: listener => { listeners.push(listener); window.__popupListener = listener; }}
      };
      window.LarpbloxAppearance = {get: () => 'modern', set() {}};
      window.LarpbloxAvatarRequests = {cached: () => null, render: async () => png};
      window.__allow3d = false;
      window.LarpbloxAvatar3D = {create: async (host, descriptor, options) => {
        await new Promise(resolve => { window.__release3d = resolve; if (window.__allow3d) resolve(); });
        host.append(document.createElement('canvas'));
        return {getDiagnostics: () => ({
          definition: {playerAvatarType:{playerAvatarType:'R15'}, assets:[{id:head.id, assetType:79}, {id:gear.id, assetType:19}]},
          objText: 'v 0 0 0\\nf 1 1 1'
        }), getView: () => ({}), dispose() {}};
      }};
    }, {head:{id:HEAD_ID,itemType:'Asset',assetType:79,name:'Dynamic Head'}, gear:{id:GEAR_ID,itemType:'Asset',assetType:19,name:'Held Gear'}, png:PNG});
    await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});
    await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});
    await page.waitForFunction(() => typeof window.__popupListener === 'function');

    const cold = await page.evaluate(() => new Promise(resolve => window.__popupListener({type:'larpblox-popup-avatar-details'}, {}, resolve)));
    assert.equal(cold.ok, false, 'action must explain that details are unavailable before the 3D viewer loads');
    assert.match(cold.error, /wait for your 3D Larp avatar/i);

    await page.evaluate(() => { window.__allow3d = true; window.__release3d?.(); });
    await page.waitForFunction(() => document.querySelector('.larpbux-avatar-look canvas'));
    const downloadPromise = page.waitForEvent('download');
    const result = await page.evaluate(() => new Promise(resolve => window.__popupListener({type:'larpblox-popup-avatar-details'}, {}, resolve)));
    assert.equal(result.ok, true);
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'larpblox-preview-details.json');
    const contents = require('node:fs').readFileSync(await download.path(), 'utf8');
    const details = JSON.parse(contents);
    assert.equal(details.objText, 'v 0 0 0\\nf 1 1 1');
    assert.equal(details.definition.playerAvatarType.playerAvatarType, 'R15');
    assert.deepEqual(details.definition.assets.map(asset => asset.id), [HEAD_ID, GEAR_ID]);
    console.log('PASS: avatar preview details action reports a cold viewer, then downloads the R15 mesh with dynamic head and gear IDs.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
