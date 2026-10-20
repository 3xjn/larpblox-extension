const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const context = await browser.newContext();
    await context.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:`<meta name="user-data" data-userid="123"><div id="robux-menu"></div><main id="avatar-web-app"><div class="breadcrumb-container">Accessories Head</div><div class="items-list avatar-item-list"></div></main>`}));
    await context.route('https://avatar.roblox.com/**',r=>r.fulfill({json:{assets:[],bodyColor3s:{headColor3:'ffffff'},scales:{},playerAvatarType:'R15'}}));
    await context.route('https://thumbnails.roblox.com/**',r=>r.fulfill({json:{data:[]}}));
    const page = await context.newPage();
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(() => {
      document.documentElement.classList.add('larpblox-modern');
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version:1,mode:true,balance:100,items:[{id:808,itemType:'Asset',assetType:8,name:'Test Hat',assetTypeVerified:true}],equipped:[]}));
    });
    const root = process.env.EXTENSION_ROOT || path.join(__dirname,'..');
    await page.addStyleTag({content:'.item-card-thumb {display:block;width:100px;height:100px}.thumbnail-2d-container,img {display:block;width:100%;height:100%}'});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    const card = page.locator('.larpbux-avatar-item');
    await card.waitFor();
    const before = await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).equipped);
    for (const selector of ['.item-card-thumb img','.item-card-name-link']) {
      const popupReady = context.waitForEvent('page');
      await card.locator(selector).click({button:'middle'});
      const popup = await popupReady;
      await popup.waitForURL('https://www.roblox.com/catalog/808');
      await popup.close();
      assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).equipped),before,'middle-click must not equip or remove the item');
    }
    await card.locator('.item-card-thumb').click();
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).equipped.includes('Asset:808'));
    await card.locator('.item-card-thumb[aria-pressed="true"]').waitFor();
    await card.locator('.item-card-thumb').press('Space');
    await page.waitForFunction(()=>!JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).equipped.includes('Asset:808'));
    assert.equal(page.url(),'https://www.roblox.com/my/avatar');
    console.log('PASS: middle-click picture/name opens item without equipping; left-click and keyboard still toggle wear/remove.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
