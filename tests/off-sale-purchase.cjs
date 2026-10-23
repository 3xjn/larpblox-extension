const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

const items = new Map([
  [92719239, {id:92719239, name:'Contest Hat', assetType:8, isForSale:false, price:null}],
  [92719240, {id:92719240, name:'Off Sale Back Accessory', assetType:46, isForSale:false, price:null}],
  [92719241, {id:92719241, name:'Unpriced On Sale Hat', assetType:8, isForSale:true, price:null}],
  [92719242, {id:92719242, name:'Unpriced Limited Hat', assetType:8, isForSale:false, price:null, isLimited:true}],
  [99999999, {id:99999999, name:'Unavailable', assetType:8, isForSale:false, price:null}],
]);
const accountKey = 'larpblox-cosmetics-v1:123';
const startingBalance = 500;

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const context = await browser.newContext();
    await context.route('https://www.roblox.com/**', route => {
      const match = new URL(route.request().url()).pathname.match(/^\/catalog\/(\d+)/);
      const item = match && items.get(Number(match[1]));
      if (!item) return route.fulfill({contentType:'text/html', body:'<meta name="user-data" data-userid="123">'});
      const limited = item.isLimited ? '<span class="icon-limited-label">LIMITED</span>' : '';
      return route.fulfill({contentType:'text/html', body:`
        <meta name="user-data" data-userid="123">
        <div id="robux-menu"></div>
        <div id="item-thumbnail-container-frontend">${limited}</div>
        <div id="item-details-container"><div class="item-details-name-row"><h1>${item.name}</h1><button aria-label="Shopping cart">0</button></div><div id="item-details">
          <div class="item-details-creator-container">By Roblox</div>
          <div id="type-content">${item.assetType === 46 ? 'Back Accessories' : 'Hats'}</div>
          <div class="price-row-container"><span class="item-price-value">Off Sale</span><div class="item-purchase-btns-container"></div></div>
        </div></div>`});
    });
    await context.route('https://economy.roblox.com/**', route => {
      const id = Number(new URL(route.request().url()).pathname.match(/assets\/(\d+)/)?.[1]);
      if (id === 99999999) return route.fulfill({status:503, json:{message:'Unavailable'}});
      const item = items.get(id);
      if (!item) return route.fulfill({status:404, json:{message:'Missing'}});
      return route.fulfill({json:{AssetTypeId:item.assetType, IsForSale:item.isForSale, IsLimited:item.isLimited === true, IsLimitedUnique:false, Name:item.name, PriceInRobux:item.price}});
    });
    await context.route('https://thumbnails.roblox.com/**', route => route.fulfill({json:{data:[]}}));

    const root = process.env.EXTENSION_ROOT || path.join(__dirname, '..');
    const page = await context.newPage();
    await page.goto('https://www.roblox.com/catalog/92719239/Contest-Hat');
    await page.evaluate(({accountKey, startingBalance}) => {
      document.documentElement.classList.add('larpblox-modern');
      localStorage.setItem(accountKey, JSON.stringify({version:1, balance:startingBalance, mode:true, items:[], equipped:[], cart:[]}));
      window.LarpbloxAppearance = {get:()=>'modern'};
    }, {accountKey, startingBalance});
    await page.addStyleTag({path:path.join(root, 'larpbux.css')});
    await page.addScriptTag({path:path.join(root, 'larpbux.js')});

    const buy = page.locator('.larpbux-classic-buy');
    await buy.waitFor();
    await buy.click();
    const purchase = page.getByRole('dialog', {name:'Buy Item'});
    await purchase.waitFor();
    assert.match(await purchase.locator('.larpbux-purchase-price').innerText(), /0/);
    const purchaseIcons = purchase.locator('.icon-robux-16x16[role="img"][aria-label="Robux"]');
    assert.equal(await purchaseIcons.count(), 2, 'item purchase prompt has native Robux icons for price and balance');
    assert.equal(await purchaseIcons.locator('svg').count(), 0, 'item purchase prompt does not nest a custom SVG in native Robux icons');
    await purchase.getByRole('button', {name:'Buy', exact:true}).click();
    const complete = page.getByRole('dialog', {name:'Purchase Complete'});
    await complete.getByRole('heading', {name:'Purchase Complete'}).waitFor();
    const completeIcons = complete.locator('.icon-robux-16x16[role="img"][aria-label="Robux"]');
    assert.equal(await completeIcons.count(), 1, 'purchase completion has one native Robux balance icon');
    assert.equal(await completeIcons.locator('svg').count(), 0, 'purchase completion does not nest a custom SVG in the native Robux icon');
    let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), accountKey);
    assert.equal(saved.balance, startingBalance, 'off-sale purchase does not change the local balance');
    assert.equal(saved.items.length, 1);
    assert.equal(saved.items[0].id, 92719239);
    assert.equal(saved.items[0].assetType, 8, 'off-sale item retains its verified asset type');
    assert.equal(saved.items[0].price, 0, 'off-sale item is saved with a zero local price');

    await page.reload();
    await page.evaluate(() => { document.documentElement.classList.add('larpblox-modern'); window.LarpbloxAppearance = {get:()=>'modern'}; });
    await page.addScriptTag({path:path.join(root, 'larpbux.js')});
    await page.locator('.larpbux-owned-notice').waitFor();
    assert.equal(await page.locator('.larpbux-classic-buy').innerText(), 'Item Owned', 'purchase remains owned after reload');

    await page.goto('https://www.roblox.com/catalog/92719240/Off-Sale-Back-Accessory');
    await page.evaluate(() => { document.documentElement.classList.add('larpblox-modern'); window.LarpbloxAppearance = {get:()=>'modern'}; });
    await page.addStyleTag({path:path.join(root, 'larpbux.css')});
    await page.addScriptTag({path:path.join(root, 'larpbux.js')});
    await page.locator('.larpbux-add-cart').click();
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), accountKey);
    assert.equal(saved.cart.length, 1);
    assert.equal(saved.cart[0].id, 92719240);
    assert.equal(saved.cart[0].price, 0, 'off-sale wearable is added to cart at zero local price');
    assert.equal(saved.balance, startingBalance, 'adding off-sale item to cart does not charge');
    await page.reload();
    await page.evaluate(() => { document.documentElement.classList.add('larpblox-modern'); window.LarpbloxAppearance = {get:()=>'modern'}; });
    await page.addScriptTag({path:path.join(root, 'larpbux.js')});
    await page.getByRole('button', {name:'Shopping cart'}).click();
    const cart = page.getByRole('dialog', {name:'Shopping cart'});
    await cart.waitFor();
    await cart.getByRole('button', {name:'Checkout'}).click();
    await cart.getByRole('button', {name:'Buy', exact:true}).click();
    await page.locator('.larpbux-cart-toast').waitFor();
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), accountKey);
    assert.equal(saved.balance, startingBalance, 'zero-price checkout leaves balance unchanged');
    assert.deepEqual(saved.cart, []);
    assert.equal(saved.items.find(item => item.id === 92719240)?.assetType, 46);
    assert.equal(saved.items.find(item => item.id === 92719240)?.price, 0);

    for (const id of [92719241, 92719242]) {
      await page.goto(`https://www.roblox.com/catalog/${id}/${items.get(id).name.replaceAll(' ', '-')}`);
      await page.evaluate(() => { document.documentElement.classList.add('larpblox-modern'); window.LarpbloxAppearance = {get:()=>'modern'}; });
      await page.addStyleTag({path:path.join(root, 'larpbux.css')});
      await page.addScriptTag({path:path.join(root, 'larpbux.js')});
      await page.locator('.larpbux-classic-buy').click();
      await page.waitForFunction(() => /price is not available/i.test(document.querySelector('.larpbux-item-actions [role="status"]')?.textContent || ''));
      assert.equal(await page.getByRole('dialog', {name:'Buy Item'}).count(), 0);
    }

    await page.goto('https://www.roblox.com/catalog/99999999/Unavailable');
    await page.evaluate(() => { document.documentElement.classList.add('larpblox-modern'); window.LarpbloxAppearance = {get:()=>'modern'}; });
    await page.addStyleTag({path:path.join(root, 'larpbux.css')});
    await page.addScriptTag({path:path.join(root, 'larpbux.js')});
    await page.locator('.larpbux-classic-buy').click();
    await page.waitForFunction(() => /could not be loaded/i.test(document.querySelector('.larpbux-item-actions [role="status"]')?.textContent || ''));
    assert.equal(await page.getByRole('dialog', {name:'Buy Item'}).count(), 0, 'failed item API must not fall back to a free purchase');
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), accountKey);
    assert.equal(saved.balance, startingBalance);
    assert.equal(saved.items.length, 2, 'invalid or unknown prices are not granted as free items');
    console.log('PASS: off-sale no-price wearables can be bought for zero local Robux, while unknown prices never grant free items.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
