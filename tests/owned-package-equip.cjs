const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    const html = `
      <meta name="user-data" data-userid="123">
      <main id="avatar-web-app">
        <div class="avatar-back" style="width:277px;height:352px"><div class="avatar-thumbnail"></div></div>
        <div class="breadcrumb-container">Body</div>
        <div class="items-list avatar-item-list">
          <ul>
            <li id="owned-package-card" class="item-card" data-item-type="Bundle">
              <div class="item-card-container">
                <div class="item-card-thumb-container">
                  <a class="item-card-thumb" href="/bundles/201/Body-Package"><img src="bundle.png"></a>
                </div>
                <div class="item-card-caption"><a class="item-card-name-link" href="/bundles/201/Body-Package">Owned Body Package</a></div>
              </div>
            </li>
            <li id="dynamic-head-card" class="item-card" data-item-type="Bundle">
              <div class="item-card-container"><div class="item-card-thumb-container">
                <a class="item-card-thumb" href="/bundles/202/Dynamic-Head"><img src="dynamic.png"></a>
              </div><div class="item-card-caption"><a class="item-card-name-link" href="/bundles/202/Dynamic-Head">Owned Dynamic Head</a></div></div>
            </li>
            <li id="animation-card" class="item-card" data-item-type="Bundle">
              <div class="item-card-container"><div class="item-card-thumb-container">
                <a class="item-card-thumb" href="/bundles/203/Movement-Pack"><img src="animation.png"></a>
              </div><div class="item-card-caption"><a class="item-card-name-link" href="/bundles/203/Movement-Pack">Owned Movement Pack</a></div></div>
            </li>
            <li id="john-card" class="item-card" data-item-type="Bundle">
              <div class="item-card-container"><a class="item-card-link" href="/bundles/126/John">
                <div class="item-card-thumb-container"><img src="john.png"></div>
                <div class="item-card-caption"><div class="item-card-name">John</div></div>
              </a></div>
            </li>
          </ul>
        </div>
      </main>`;
    const accountPosts = [];
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType: 'text/html', body: html}));
    await page.route('https://thumbnails.roblox.com/**', r => r.fulfill({json: {data: []}}));
    const johnItems = [
      {id: 301809996, type: 'Asset', name: 'John Shirt', assetType: 11},
      {id: 301811279, type: 'Asset', name: 'John Pants', assetType: 12},
      {id: 301819845, type: 'Asset', name: 'John Hair', assetType: 41},
      {id: 301820684, type: 'Asset', name: 'John Scarf', assetType: 43},
      {id: 301824684, type: 'Asset', name: 'John Left Arm', assetType: 29},
      {id: 301825492, type: 'Asset', name: 'John Right Arm', assetType: 28},
      {id: 301825699, type: 'Asset', name: 'John Left Leg', assetType: 30},
      {id: 301825891, type: 'Asset', name: 'John Right Leg', assetType: 31},
      {id: 301826032, type: 'Asset', name: 'John Torso', assetType: 27},
      {id: 14532846222, type: 'Asset', name: 'John Dynamic Head', assetType: 79},
      {id: 14532855772, type: 'Asset', name: 'John Mood', assetType: 78}
    ];
    const johnStoredBundle = {
      id: 126, itemType: 'Bundle', name: 'John', bundleType: 'BodyParts',
      assets: johnItems.map(({id, name, assetType}) => ({id, name, itemType: 'Asset', assetType}))
    };
    await page.route('https://catalog.roblox.com/v1/bundles/**', r => {
      const id = Number(r.request().url().match(/bundles\/(\d+)/)?.[1]);
      const details = {
        201: {id: 201, name: 'Owned Body Package', bundleType: 'BodyParts', items: [
          {id: 301, type: 'Asset', name: 'Package Head', assetType: {id: 17}},
          {id: 302, type: 'Asset', name: 'Package Torso', assetType: {id: 27}}
        ]},
        202: {id: 202, name: 'Owned Dynamic Head', bundleType: 'DynamicHead', items: [
          {id: 401, type: 'Asset', name: 'Dynamic Head', assetType: {id: 79}}
        ]},
        203: {id: 203, name: 'Owned Movement Pack', bundleType: 'AvatarAnimations', items: [
          {id: 501, type: 'Asset', name: 'Movement Idle'}
        ]},
        126: {id: 126, name: 'John', bundleType: 'BodyParts', items: johnItems}
      };
      return r.fulfill({json: details[id]});
    });
    await page.route('https://economy.roblox.com/v2/assets/**', r => {
      if (r.request().method() !== 'GET') accountPosts.push(r.request().url());
      const id = Number(r.request().url().match(/assets\/(\d+)/)?.[1]);
      const assetTypes = {301: 17, 302: 27, 401: 79, 501: 51,
        301809996: 11, 301811279: 12, 301819845: 41, 301820684: 43,
        301824684: 29, 301825492: 28, 301825699: 30, 301825891: 31,
        301826032: 27, 14532846222: 79, 14532855772: 78};
      return r.fulfill({json: {AssetTypeId: assetTypes[id], Name: `Asset ${id}`}});
    });
    await page.route('https://avatar.roblox.com/**', r => {
      if (r.request().method() !== 'GET') accountPosts.push(r.request().url());
      return r.fulfill({json: {}});
    });
    await page.goto('https://www.roblox.com/my/avatar', {waitUntil: 'domcontentloaded', timeout: 5000});
    await page.addScriptTag({path: path.join(__dirname, '../larpbux-game-bridge.js')});
    await page.evaluate(storedBundle => {
      const bodyColors = Object.fromEntries(['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'].map(part => [part + 'Color', '#ffffff']));
      const state = {
        version: 1, mode: true, balance: 1000, items: [storedBundle], equipped: [],
        gameLook: {version: 1, userId: '123', items: [], definition: {assets: [], bodyColors, scales: {}, playerAvatarType: {playerAvatarType: 'R15'}}}
      };
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify(state));
      window.renderCalls = [];
      window.LarpbloxAvatarRequests = {render: async definition => {
        window.renderCalls.push(definition.assets.map(asset => asset.id));
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=';
      }};
      window.LarpbloxAvatar3D = {create: async host => {
        host.append(document.createElement('canvas'));
        return {dispose() {}, getView() {return {};}};
      }};
    }, johnStoredBundle);
    await page.addStyleTag({path: path.join(__dirname, '../larpbux.css')});
    await page.addScriptTag({path: path.join(__dirname, '../larpbux.js')});

    const card = page.locator('#owned-package-card');
    const dynamicCard = page.locator('#dynamic-head-card');
    const animationCard = page.locator('#animation-card');
    const johnCard = page.locator('#john-card');
    await card.waitFor({state: 'attached', timeout: 2000});
    await page.waitForFunction(() => document.querySelector('#owned-package-card')?.classList.contains('larpbux-native-item'), null, {timeout: 2000});
    await page.evaluate(() => {
      window.__openedUrls = [];
      window.open = url => { window.__openedUrls.push(url); return {closed: false}; };
    });
    await johnCard.locator('.item-card-name').evaluate(element => {
      element.dispatchEvent(new MouseEvent('auxclick', {button: 1, bubbles: true, cancelable: true}));
    });
    assert.ok((await page.evaluate(() => window.__openedUrls[0])).includes('/bundles/126'), 'middle-clicking John card text opens its bundle');
    await johnCard.locator('.item-card-link img').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).equipped.includes('Asset:301826032'), null, {timeout: 2000});
    let johnState = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.equal(johnState.balance, 1000, 'owned John is free in pretend mode');
    assert.deepEqual(johnState.equipped.sort(), [
      'Asset:14532846222', 'Asset:301809996', 'Asset:301811279', 'Asset:301819845',
      'Asset:301820684', 'Asset:301824684', 'Asset:301825492', 'Asset:301825699',
      'Asset:301825891', 'Asset:301826032'
    ], 'John imports and equips its ten supported assets');
    await page.evaluate(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({...value, items: [], equipped: []}));
    });
    await johnCard.locator('.item-card-link img').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).equipped.includes('Asset:301826032'), null, {timeout: 2000});
    johnState = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.deepEqual(johnState.equipped.sort(), [
      'Asset:14532846222', 'Asset:301809996', 'Asset:301811279', 'Asset:301819845',
      'Asset:301820684', 'Asset:301824684', 'Asset:301825492', 'Asset:301825699',
      'Asset:301825891', 'Asset:301826032'
    ], 'fresh John imports and equips its ten supported assets');
    const johnRenderCalls = await page.evaluate(() => window.renderCalls.flat());
    assert.ok(johnRenderCalls.includes(14532846222) && johnRenderCalls.includes(301826032), 'John render includes its dynamic head and torso');
    assert.deepEqual(accountPosts, [], 'owned John must not submit an account avatar change');
    await page.evaluate(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({...value, items: [], equipped: []}));
    });
    await card.locator('.item-card-thumb').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      return value.items.some(item => item.itemType === 'Bundle' && item.id === 201);
    }, null, {timeout: 2000});
    let state = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.equal(state.balance, 1000, 'native package Wear must not change pretend balance');
    assert.ok(state.items.some(item => item.itemType === 'Bundle' && item.id === 201), 'native package is imported locally');
    assert.deepEqual(state.equipped.sort(), ['Asset:301', 'Asset:302'], 'resolved package assets are equipped');
    assert.equal(await card.getAttribute('data-larpbux-equipped'), 'true');
    assert.equal(await card.locator('.larpbux-native-equipped').count(), 1, 'native card shows the local equipped indicator');
    assert.deepEqual(accountPosts, [], 'native package Wear must not submit an account avatar change');

    await dynamicCard.locator('.item-card-thumb').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      return value.equipped.includes('Asset:401');
    }, null, {timeout: 2000});
    state = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.ok(state.equipped.includes('Asset:302'), 'dynamic head preserves the worn torso');
    assert.ok(!state.equipped.includes('Asset:301'), 'dynamic head replaces the body package head');
    assert.equal(await dynamicCard.locator('.larpbux-native-equipped').count(), 1);

    await animationCard.locator('.item-card-thumb').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      return value.equipped.includes('Bundle:203');
    }, null, {timeout: 2000});
    state = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.ok(state.equipped.includes('Asset:401'), 'animation bundle preserves the dynamic head');
    assert.ok(state.equipped.includes('Asset:302'), 'animation bundle preserves body parts');
    assert.equal(state.balance, 1000);
    assert.equal(await animationCard.locator('.larpbux-native-equipped').count(), 1);
    assert.deepEqual(accountPosts, [], 'dynamic head and animation Wear must not submit account changes');

    await animationCard.locator('.item-card-thumb').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => !JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).equipped.includes('Bundle:203'), null, {timeout: 2000});
    await dynamicCard.locator('.item-card-thumb').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      return value.equipped.length === 1 && value.equipped.includes('Asset:302');
    }, null, {timeout: 2000});
    await card.locator('.item-card-thumb').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      return value.equipped.includes('Asset:301') && value.equipped.includes('Asset:302');
    }, null, {timeout: 2000});
    await card.locator('.item-card-thumb').click({noWaitAfter: true, timeout: 2000});
    await page.waitForFunction(() => {
      const value = JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));
      return value.equipped.length === 0;
    }, null, {timeout: 2000});
    state = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.deepEqual(state.equipped, [], 'second click removes the package components locally');
    assert.equal(await card.getAttribute('data-larpbux-equipped'), 'false');
    assert.equal(await card.locator('.larpbux-native-equipped').count(), 0, 'native card clears the local equipped indicator');
    assert.deepEqual(accountPosts, [], 'native package Remove must not submit an account avatar change');
    console.log('PASS: owned native BodyParts, DynamicHead, and AvatarAnimations packages resolve assets, preserve compatible parts, wear/remove locally, preserve balance, and avoid account POSTs.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
