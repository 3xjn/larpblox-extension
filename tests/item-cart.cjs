const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const {addToCart, checkoutCart} = require('../larpbux.js');

const limited = {
  id: 1234,
  itemType: 'Asset',
  name: 'Frosting Flyers',
  price: 197,
  assetType: 46,
  isLimited: true,
};
const ordinary = {
  id: 22,
  itemType: 'Asset',
  name: 'Everyday Scarf',
  price: 101,
  assetType: 43,
  isLimited: false,
};
const catalog = new Map([[limited.id, limited], [ordinary.id, ordinary]]);

const pureStart = {version: 1, mode: true, balance: 500, items: [], equipped: [], cart: []};
const limitedCart = addToCart(addToCart(pureStart, limited), limited);
assert.equal(limitedCart.cart.length, 1);
assert.equal(limitedCart.cart[0].quantity, 2);
assert.equal(checkoutCart(limitedCart).balance, 106);
const ordinaryCart = addToCart(addToCart(pureStart, ordinary), ordinary);
assert.equal(ordinaryCart.cart.length, 1, 'ordinary duplicate cart additions must deduplicate');
const insufficient = addToCart(pureStart, {...ordinary, price: 501});
assert.throws(() => checkoutCart(insufficient), /Add more Larpbux/);
assert.deepEqual(insufficient, {...pureStart, cart: [{...ordinary, price: 501, quantity: 1}]}, 'failed checkout must not mutate its input state');

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const context = await browser.newContext();
    await context.route('https://www.roblox.com/**', route => {
      const match = new URL(route.request().url()).pathname.match(/^\/(?:catalog|bundles)\/(\d+)/);
      const item = match && catalog.get(Number(match[1]));
      if (!item) return route.fulfill({contentType: 'text/html', body: '<meta name="user-data" data-userid="123">'});
      const limitedLabel = item.isLimited ? '<span class="icon-limited-label">LIMITED</span>' : '';
      return route.fulfill({contentType: 'text/html', body: `
        <meta name="user-data" data-userid="123">
        <div id="robux-menu"></div>
        <div id="item-thumbnail-container-frontend">${limitedLabel}</div>
        <div id="item-details-container"><div class="item-details-name-row"><h1>${item.name}</h1><button aria-label="Shopping cart">0</button></div><div id="item-details">
          <div class="item-details-creator-container">By Roblox</div>
          <div id="type-content">${item.assetType === 46 ? 'Back Accessories' : 'Neck Accessories'}</div>
          <div class="price-row-container"><span class="item-price-value">${item.price}</span><div class="item-purchase-btns-container"><button>Native Buy</button></div></div>
        </div></div>`});
    });
    await context.route('https://economy.roblox.com/**', route => {
      const id = Number(new URL(route.request().url()).pathname.match(/assets\/(\d+)/)?.[1]);
      const item = catalog.get(id) || limited;
      return route.fulfill({json: {AssetTypeId: item.assetType, IsLimited: item.isLimited, IsLimitedUnique: false, Name: item.name, PriceInRobux: item.price}});
    });
    await context.route('https://thumbnails.roblox.com/**', route => route.fulfill({json: {data: []}}));

    const page = await context.newPage();
    await page.goto(`https://www.roblox.com/catalog/${limited.id}/${limited.name.replaceAll(' ', '-')}`);
    await page.evaluate(() => {
      document.documentElement.classList.add('larpblox-modern');
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version: 1, balance: 1000, mode: true, items: [], equipped: [], cart: []}));
      window.LarpbloxAppearance = {get: () => 'modern'};
    });
    const root = process.env.EXTENSION_ROOT || path.join(__dirname, '..');
    await page.addStyleTag({path: path.join(root, 'larpbux.css')});
    await page.addScriptTag({path: path.join(root, 'larpbux.js')});

    await page.addStyleTag({content:'body {background:#111216;color:#f7f7f8;font-family:Arial,sans-serif} #robux-menu {display:none} #item-details {width:514px;margin:30px auto} #item-details h1 {font-size:32px} .item-details-creator-container {padding-bottom:12px;border-bottom:1px solid #494b5a} .price-row-container {margin-top:16px} .item-price-value {display:block;margin-left:150px;font-size:20px;font-weight:bold}'});
    assert.equal(await page.locator('.larpbux-cart-toggle').count(),0);
    assert.equal(await page.locator('#item-details .larpbux-cart-toggle').count(),0);
    const buyBox = await page.locator('.larpbux-classic-buy').boundingBox();
    const addBox = await page.locator('.larpbux-add-cart').boundingBox();
    assert.equal(buyBox.x, addBox.x);
    assert.equal(buyBox.width, addBox.width);
    assert.equal(buyBox.height, 52);
    assert.equal(addBox.height, 52);
    assert.equal(addBox.y - buyBox.y - buyBox.height, 10);
    await page.locator('#item-details').screenshot({path:path.join(root, '..', 'item-cart-preview.png')});
    await page.locator('.larpbux-add-cart').click();
    await page.locator('.larpbux-add-cart').click();
    await page.goto(`https://www.roblox.com/catalog/${ordinary.id}/${ordinary.name.replaceAll(' ', '-')}`);
    await page.evaluate(() => {
      window.LarpbloxAppearance = {get: () => 'modern'};
      document.documentElement.classList.add('larpblox-modern');
    });
    await page.addStyleTag({path: path.join(root, 'larpbux.css')});
    await page.addScriptTag({path: path.join(root, 'larpbux.js')});
    await page.locator('.larpbux-add-cart').click();

    let saved = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.equal(saved.balance, 1000, 'adding to cart must not charge the account');
    assert.equal(saved.cart.length, 2);
    assert.equal(saved.cart.find(item => item.id === limited.id).quantity, 2);
    assert.equal(saved.cart.find(item => item.id === ordinary.id).quantity, 1);

    await page.reload();
    await page.evaluate(() => {
      window.LarpbloxAppearance = {get: () => 'modern'};
      document.documentElement.classList.add('larpblox-modern');
    });
    await page.addScriptTag({path: path.join(root, 'larpbux.js')});
    const toggle = page.getByRole('button', {name: 'Shopping cart'});
    await toggle.waitFor();
    await toggle.click();
    const cart = page.getByRole('dialog', {name: 'Shopping cart'});
    await cart.waitFor();
    assert.equal(await cart.locator('.larpbux-cart-row').count(), 2);
    assert.equal(await cart.locator('.larpbux-cart-row').nth(0).getByRole('button', {name: /Remove/}).count(), 1);
    await cart.locator('.larpbux-cart-row').filter({hasText: ordinary.name}).getByRole('button', {name: /Remove/}).click();
    assert.equal(await cart.locator('.larpbux-cart-row').count(), 1, 'remove must delete one cart entry');
    assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).cart)).length, 1);
    await cart.getByRole('button', {name: 'Close cart'}).click();
    await page.goto(`https://www.roblox.com/catalog/${ordinary.id}/${ordinary.name.replaceAll(' ', '-')}`);
    await page.evaluate(() => {
      window.LarpbloxAppearance = {get: () => 'modern'};
      document.documentElement.classList.add('larpblox-modern');
    });
    await page.addStyleTag({path: path.join(root, 'larpbux.css')});
    await page.addScriptTag({path: path.join(root, 'larpbux.js')});
    await page.locator('.larpbux-add-cart').click();
    await page.reload();
    await page.evaluate(() => {
      window.LarpbloxAppearance = {get: () => 'modern'};
      document.documentElement.classList.add('larpblox-modern');
    });
    await page.addStyleTag({path: path.join(root, 'larpbux.css')});
    await page.addScriptTag({path: path.join(root, 'larpbux.js')});
    await page.getByRole('button', {name: 'Shopping cart'}).click();
    const restoredCart = page.getByRole('dialog', {name: 'Shopping cart'});
    await restoredCart.waitFor();
    await restoredCart.getByRole('button', {name: 'Checkout'}).click();
    await restoredCart.getByRole('button', {name: 'Buy', exact: true}).click();
    await page.getByRole('heading', {name: 'Purchase Complete'}).waitFor();

    saved = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
    assert.equal(saved.balance, 505);
    assert.equal(saved.items.length, 2);
    assert.equal(saved.items.find(item => item.id === limited.id).quantity, 2);
    assert.equal(saved.items.find(item => item.id === ordinary.id).quantity, 1);
    assert.deepEqual(saved.cart, []);
    console.log('PASS: cart additions persist without charging, limited quantities accumulate, ordinary duplicates deduplicate, and checkout atomically purchases and clears the cart.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
