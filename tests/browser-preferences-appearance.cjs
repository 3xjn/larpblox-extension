const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

const html = `<html class="larpblox-modern"><head><meta name="user-data" data-userid="123"><style>
body{font:16px Arial;margin:40px}#settings-container{max-width:980px;margin:auto}.settings-layout{display:flex;gap:24px}.menu-vertical{list-style:none;padding:0;margin:0;width:180px;flex-shrink:0}.menu-vertical li a{display:block;padding:12px 10px}.tab-content{flex:1;min-width:0}
</style></head><body><main id="settings-container"><h1>Settings</h1><div class="settings-layout"><ul class="menu-vertical"><li class="active"><a href="#!/info">Account info</a></li><li><a href="#!/security">Security</a></li><li><a href="#!/browser-preferences">Browser preferences</a></li></ul><div class="tab-content"><section id="native-settings"><h2>Account info</h2><p>Native account settings</p></section></div></div></main></body></html>`;

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1200,height:1000}});
    page.setDefaultTimeout(4000);
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:html}));
    await page.goto('https://www.roblox.com/my/account#!/info');
    await page.evaluate(() => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:true,balance:100,items:[],equipped:[]})));
    await page.evaluate(() => { window.LarpbloxAppearance={get:()=> 'modern',set:value=>{window.chosenAppearance=value}}; });
    await page.addStyleTag({path:path.join(__dirname,'..','larpbux.css')});
    await page.addScriptTag({path:path.join(__dirname,'..','larpbux.js')});

    assert.equal(await page.locator('.larpbux-browser-preferences-appearance').count(),0);
    assert.equal(await page.getByRole('link',{name:'Customize',exact:true}).count(),0);
    await page.getByRole('link',{name:'Browser preferences',exact:true}).click();
    const appearance = page.locator('.larpbux-browser-preferences-appearance');
    await appearance.waitFor();
    assert.equal(await appearance.evaluate(element => element.parentElement.matches('.tab-content')),true);
    assert.deepEqual(await page.getByRole('combobox',{name:'Website appearance'}).locator('option').allTextContents(),['Classic Roblox (2016)','Current Roblox']);
    await page.getByRole('combobox',{name:'Website appearance'}).selectOption('classic');
    assert.equal(await page.evaluate(() => window.chosenAppearance),'classic');

    await page.getByRole('link',{name:'Account info',exact:true}).click();
    await page.waitForFunction(() => location.hash === '#!/info' && !document.querySelector('.larpbux-browser-preferences-appearance'));
    assert.deepEqual((await page.locator('.menu-vertical li').allTextContents()).map(text=>text.trim()),['Account info','Security','Browser preferences']);
    console.log('PASS: appearance choices live in native Browser preferences; no injected Customize page.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
