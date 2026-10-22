const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:`<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-back" style="width:277px;height:352px"><div class="avatar-thumbnail" style="width:277px;height:352px"></div></div><button class="toggle-three-dee">2D</button><div class="breadcrumb-container">Accessories Head</div><div class="items-list avatar-item-list"></div></main>`}));
    await page.route('https://thumbnails.roblox.com/**', r => r.fulfill({json:{data:[]}}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({path:path.join(__dirname,'../larpbux-game-bridge.js')});
    await page.evaluate(() => {
      document.documentElement.classList.add('larpblox-modern');
      const bodyColors = Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part => [part + 'Color', '#ffffff']));
      const first = {id:808,itemType:'Asset',assetType:8,name:'First Hat',assetTypeVerified:true,limitedVerified:true};
      const second = {id:809,itemType:'Asset',assetType:8,name:'Second Hat',assetTypeVerified:true,limitedVerified:true};
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({
        version:1, mode:true, balance:1000, items:[first, second], equipped:['Asset:808'],
        gameLook:{version:1,userId:'123',items:[first],definition:{assets:[{id:808}],bodyColors,scales:{},playerAvatarType:{playerAvatarType:'R15'}}}
      }));
      window.renderCalls = [];
      window.viewers = [];
      window.resolveRenders = [];
      window.LarpbloxAvatarRequests = {render: (definition, userId, signal, kind) => {
        const ids = definition.assets.map(asset => asset.id).sort((a,b) => a-b);
        window.renderCalls.push({ids, kind});
        return new Promise(resolve => window.resolveRenders.push(() => resolve(`image-${ids.join('-')}`)));
      }};
      window.LarpbloxAvatar3D = {create: async (host, imageUrl, options) => {
        window.viewers.push({imageUrl, ids:options.definition.assets.map(asset => asset.id).sort((a,b) => a-b)});
        host.append(document.createElement('canvas'));
        return {dispose(){}, getView(){return {}}};
      }};
    });
    const root = process.env.EXTENSION_ROOT || path.join(__dirname, '..');
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addStyleTag({content:'.item-card-thumb{display:block;width:100px;height:100px}'});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});

    await page.waitForFunction(() => window.renderCalls.some(call => call.ids.length === 1));
    assert.equal(await page.locator('.larpbux-preview-loader').count(), 1);
    assert.equal(await page.locator('.larpbux-preview-loader span').count(), 3);
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), 'true');

    await page.evaluate(() => window.resolveRenders.shift()());
    await page.locator('.larpbux-avatar-look canvas').waitFor();
    assert.equal(await page.locator('.larpbux-preview-loader').count(), 0);
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), null);

    await page.locator('.larpbux-avatar-item').filter({hasText:'Second Hat'}).locator('.item-card-thumb').click();
    await page.waitForFunction(() => window.renderCalls.some(call => call.ids.length === 2));
    assert.equal(await page.locator('.larpbux-preview-loader').count(), 1);
    assert.equal(await page.locator('.larpbux-preview-loader span').count(), 3);
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), 'true');
    assert.deepEqual(await page.locator('.larpbux-avatar-scene').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).visibility)), ['hidden', 'hidden']);

    await page.evaluate(() => window.resolveRenders.shift()());
    await page.locator('.larpbux-avatar-scene:not(.larpbux-avatar-loading) canvas').waitFor();
    assert.equal(await page.locator('.larpbux-preview-loader').count(), 0);
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), null);
    assert.equal(await page.locator('.larpbux-avatar-scene').count(), 1);
    assert.deepEqual(await page.evaluate(() => window.viewers.map(viewer => viewer.ids)), [[808], [808, 809]]);
    console.log('PASS: initial and second avatar equips show the loader, hide old scenes, and clear it after the new preview is ready.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
