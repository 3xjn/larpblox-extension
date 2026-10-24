const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    const html = '<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-thumbnail" style="width:200px;height:200px"></div><div class="breadcrumb">Characters</div><ul class="items-list avatar-item-list"><li id="owned-character" class="item-card"><div class="item-card-thumb-container"><button class="item-card-thumb"><img alt="test"></button></div><div class="item-card-caption"><a class="item-card-name-link">test</a></div></li></ul></main>';
    const accountPosts = [];
    const renderInputs = [];
    const outfit = {isEditable:false, bodyColor3s: {headColor3: '#ffffff', torsoColor3: '#ffffff', leftArmColor3: '#ffffff', rightArmColor3: '#ffffff', leftLegColor3: '#ffffff', rightLegColor3: '#ffffff'}, scale: {width:0.85}, playerAvatarType: 'R15', assets: [{id: 9001, assetType: {id: 11}, name: 'Test Shirt'}, {id: 9002, assetType: {id: 12}, name: 'Test Pants'}]};
    await page.context().route('https://catalog.roblox.com/v1/assets/9001/bundles?limit=100', r => r.fulfill({json:{data:[{id:125,items:[{id:778,type:'UserOutfit'}]},{id:126,items:[{id:777,type:'UserOutfit'}]}]}}));
    await page.context().route('https://www.roblox.com/**', r => r.fulfill({contentType: 'text/html', body: html}));
    await page.route('https://avatar.roblox.com/**', r => {
      if (r.request().method() !== 'GET') accountPosts.push(r.request().url());
      if (r.request().url().includes('/users/123/outfits')) return r.fulfill({json:{total:200,data:new URL(r.request().url()).searchParams.get('page') === '2' ? [{id:777,name:'test'}] : []}});
      if (r.request().url().includes('/v1/outfits/777/details')) return r.fulfill({json: outfit});
      return r.fulfill({json: {}});
    });
    await page.route('https://economy.roblox.com/**', r => {
      if (r.request().method() !== 'GET') accountPosts.push(r.request().url());
      return r.fulfill({json: {AssetTypeId: 11, Name: 'Test item'}});
    });
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(() => {
      const bodyColors = Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(p => [p + 'Color', 'ffffff']));
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version: 1, mode: true, balance: 1000, items: [], equipped: [], gameLook: {version: 1, userId: '123', items: [], definition: {assets: [], bodyColors, scales: {}, playerAvatarType: {playerAvatarType: 'R15'}}}}));
      window.LarpbloxAvatarRequests = {render: async definition => { window.renderInputs.push(definition.assets.map(asset => asset.id)); return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII='; }};
      window.renderInputs = [];
    });
    for (const file of ['larpbux-game-bridge.js', 'larpbux-characters.js', 'larpbux.js']) {
      await page.addScriptTag({path: path.join(__dirname, '..', file)});
      if (file === 'larpbux-game-bridge.js') await page.evaluate(() => {window.commands=[]; LarpbloxGameBridge.request=async(action,id,extra)=>{if(action==='publish')commands.push(extra.snapshot); return {connected:false};};});
    }
    await page.waitForFunction(() => document.querySelector('#owned-character .item-card-thumb')?.closest('a')?.getAttribute('href') === 'https://www.roblox.com/bundles/126');
    const before = await page.evaluate(() => localStorage.getItem('larpblox-cosmetics-v1:123'));
    for (const selector of ['.item-card-thumb img','.item-card-name-link']) {
      const popupReady = page.context().waitForEvent('page', {timeout:3000});
      await page.locator('#owned-character ' + selector).click({button:'middle'});
      const popup = await popupReady;
      await popup.waitForURL('https://www.roblox.com/bundles/126');
      await popup.close();
      assert.equal(await page.evaluate(() => localStorage.getItem('larpblox-cosmetics-v1:123')), before, 'middle-click must not equip');
    }
    await page.locator('#owned-character img').click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).gameLook.definition.assets.some(asset => asset.id === 9001), null, {timeout: 5000}).catch(async error => { console.error(await page.evaluate(() => ({state: localStorage.getItem('larpblox-cosmetics-v1:123'), card: document.querySelector('#owned-character')?.outerHTML}))); throw error; });
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.deepEqual(state.gameLook.definition.assets.map(asset => asset.id).sort(), [9001, 9002]);
    assert.equal(state.gameLook.definition.scales.width, 0.85);
    assert.ok((await page.evaluate(() => window.renderInputs.flat())).includes(9001));
    assert.ok((await page.evaluate(() => window.renderInputs.flat())).includes(9002));
    assert.deepEqual(accountPosts, []);
    await page.waitForFunction(() => commands.some(snapshot => snapshot.definition.assets.some(asset=>asset.id===9001)));
    console.log('PASS: Characters owned outfit loads details, updates gameLook, reaches renderer, and makes no account POST.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
