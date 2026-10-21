const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const {collect} = require('../larpbux.js');
const html = `<html class="larpblox-modern"><head><meta name="user-data" data-userid="123"><style>
body{background:#111216;color:white;font:16px Arial}.item-cards{display:flex;flex-wrap:wrap;gap:8px;width:800px}.item-card{width:126px}.item-card-thumb-container{background:#393b46;border-radius:8px;overflow:hidden}.item-card-name{display:block;font-weight:bold}.item-card img{width:100%}
</style></head><body><div id="robux-menu"></div><main id="inventory-container"><h1>My Inventory</h1><div class="item-cards"><div class="item-card" id="native-card">Roblox item</div></div></main></body></html>`;
const item = (id, assetType, extra = {}) => ({id, assetType, itemType:'Asset', name:`Item ${id}`, assetTypeVerified:true, limitedVerified:true, price:5, ...extra});
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1100,height:850}});
    page.setDefaultTimeout(5000);
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:html}));
    await page.route('https://thumbnails.roblox.com/**',r=>r.fulfill({json:{data:[]}}));
    await page.route('https://economy.roblox.com/**',r=>r.fulfill({json:{AssetTypeId:8,IsLimitedUnique:true}}));
    await page.goto('https://www.roblox.com/users/inventory#!/accessories');
    let saved = {mode:true,balance:100,items:[item(1,8,{isLimited:true,quantity:3}),item(2,8,{isLimitedUnique:true,quantity:2}),item(3,11),item(4,8)],equipped:[]};
    await page.evaluate(s=>{localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify(s));window.LarpbloxAppearance={get:()=> 'modern'}},saved);
    await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});
    await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});
    const cards=page.locator('.larpbux-native-inventory-card');
    await page.waitForFunction(()=>document.querySelectorAll('.larpbux-native-inventory-card').length===6);
    assert.equal(await page.locator('#native-card').count(),1);
    assert.equal(await page.locator('.larpbux-native-inventory-card [aria-label="Limited"]').count(),3);
    assert.equal(await page.locator('.larpbux-native-inventory-card [aria-label="Limited Unique"]').count(),2);
    assert.equal(await cards.first().locator('.item-card-link').getAttribute('href'),'/catalog/1');
    assert.equal(await cards.first().locator('.larpbux-limited-badge').evaluate(e=>getComputedStyle(e).backgroundPosition),'0px -54px');
    const update=async s=>page.evaluate(s=>{localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify(s));dispatchEvent(new StorageEvent('storage',{key:'larpblox-cosmetics-v1:123'}))},s);
    saved=collect(saved,item(1,8,{isLimited:true}));
    await update(saved);
    await page.waitForFunction(()=>document.querySelectorAll('.larpbux-native-inventory-card').length===7);
    await page.evaluate(()=>{location.hash='!/accessories?assetTypeId=11'});
    await page.waitForFunction(()=>document.querySelectorAll('.larpbux-native-inventory-card').length===1 && document.querySelector('.larpbux-native-inventory-card').dataset.larpAssetId==='3');
    saved={...saved,items:[item(5,8,{isLimitedUnique:true,quantity:1000000})]};
    await update(saved);
    await page.evaluate(()=>{location.hash='!/accessories'});
    await page.waitForFunction(()=>document.querySelectorAll('.larpbux-native-inventory-card').length===48);
    await page.getByRole('button',{name:'Next',exact:true}).click();
    assert.equal(await cards.first().locator('.item-card-link').getAttribute('aria-label'),'Item 5, quantity 49');
    // Metadata missing on older purchases is repaired without changing quantities.
    saved={...saved,items:[{id:6,itemType:'Asset',name:'Old limited',quantity:2}]};
    await update(saved);
    await page.waitForFunction(()=>document.querySelectorAll('.larpbux-native-inventory-card [aria-label="Limited Unique"]').length===2);
    await update({...saved,mode:false});
    await page.waitForFunction(()=>!document.querySelector('.larpbux-native-inventory'));
    assert.equal(await page.locator('#native-card').count(),1);
    await update({...saved,mode:true});
    await page.waitForFunction(()=>document.querySelector('.larpbux-native-inventory'));
    await page.evaluate(()=>{history.pushState({},'', '/users/999/inventory#!/accessories');dispatchEvent(new PopStateEvent('popstate'));document.body.append(document.createElement('div'))});
    await page.waitForFunction(()=>!document.querySelector('.larpbux-native-inventory'));
    assert.deepEqual(errors,[]);
    console.log('PASS: past and new purchases, individual Limited copies and badges, categories, bounded pagination, metadata repair, native items, and mode/account cleanup.');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
