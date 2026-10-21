const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const context = await browser.newContext();
    await context.route('https://www.roblox.com/**', route => route.fulfill({
      contentType:'text/html',
      body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="left-wrapper"><div class="avatar-thumbnail">Avatar preview</div></div></main>'
    }));
    await context.route('https://avatar.roblox.com/**', route => route.fulfill({json:{assets:[],bodyColor3s:{headColor3:'ffffff'},scales:{},playerAvatarType:'R15'}}));
    await context.route('https://thumbnails.roblox.com/**', route => route.fulfill({json:{data:[]}}));
    const page = await context.newPage();
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(() => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({version:1,mode:true,balance:100,items:[],equipped:[]})));
    await page.addStyleTag({path:path.join(__dirname,'..','larpbux.css')});
    await page.addScriptTag({path:path.join(__dirname,'..','larpbux.js')});
    const accordion = page.locator('.left-wrapper > details.larpbux-avatar-settings');
    await accordion.waitFor();
    assert.equal(await accordion.locator(':scope > summary').textContent(), 'Larpblox');
    assert.equal(await accordion.locator('[aria-label="Larp mode"]').isVisible(), false);
    await accordion.locator(':scope > summary').click();
    assert.equal(await accordion.locator('[aria-label="Larp mode"]').isVisible(), true);
    console.log('PASS: Larpblox controls appear as a collapsed, keyboard-native accordion below the avatar preview.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
