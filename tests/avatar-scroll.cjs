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
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version:1,mode:true,balance:100,items:Array.from({length:120},(_,i)=>({id:808+i,itemType:'Asset',assetType:8,name:'Test Hat '+i,assetTypeVerified:true,limitedVerified:true})),equipped:[]}));
    });
    const root = process.env.EXTENSION_ROOT || path.join(__dirname,'..');
    await page.addStyleTag({content:'.item-card-thumb {display:block;width:100px;height:100px}.thumbnail-2d-container,img {display:block;width:100%;height:100%}'});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    await page.addStyleTag({content:'.avatar-item-list{display:grid;grid-template-columns:repeat(5,120px);gap:20px}.item-card{height:160px;list-style:none}'});
    const card=page.locator('.larpbux-avatar-item').nth(55);
    await card.scrollIntoViewIfNeeded();
    await page.evaluate(()=>{
      window.movedCards=0;
      new MutationObserver(entries=>{for(const entry of entries) for(const n of entry.removedNodes) if(n.nodeType===1 && n.matches('.larpbux-avatar-item')) window.movedCards++}).observe(document.querySelector('.avatar-item-list'),{childList:true});
    });
    const before=await page.evaluate(()=>scrollY);
    await card.locator('.item-card-thumb').click();
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(()=>window.movedCards),0,'equipping must not detach and reinsert existing item cards');
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<2,'equipping must preserve scroll position');
    assert.equal(await card.locator('.item-card-thumb').getAttribute('aria-pressed'),'true');
    await card.locator('.item-card-thumb').press('Space');
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(()=>window.movedCards),0);
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<2);
    console.log('PASS: mouse and keyboard equip/remove preserve item nodes and page scroll.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
