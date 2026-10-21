const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

const html = `<html class="larpblox-modern dark-theme"><head><meta name="user-data" data-userid="123"><style>
body{font:16px Arial;background:#111216;color:#f7f7f8;margin:40px}h1{font-size:32px}#settings-container{max-width:980px;margin:auto}.settings-layout{display:flex;gap:24px}.menu-vertical{list-style:none;padding:0;margin:0;width:180px;background:#272930;flex-shrink:0}.menu-vertical li a{display:block;padding:12px 10px;color:inherit;text-decoration:none;font-size:13px}.menu-vertical li.active{border-left:4px solid white}.tab-content{flex:1;min-width:0}button,input,select{font:inherit}button{cursor:pointer}.dropdown-menu{display:none}
</style></head><body><div id="robux-menu"><div class="dropdown-menu"></div></div><main id="settings-container"><h1>Settings</h1><div class="settings-layout"><ul class="menu-vertical"><li class="active"><a href="#!/info">Account info</a></li><li><a href="#!/security">Security</a></li><li><a href="#!/browser-preferences">Browser preferences</a></li></ul><div class="tab-content"><section id="native-settings"><h2>Account info</h2><p>Native account settings</p></section></div></div></main></body></html>`;

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1200,height:1000}});
    page.setDefaultTimeout(4000);
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html',body:html}));
    await page.goto('https://www.roblox.com/my/account#!/info');
    await page.evaluate(() => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:true,balance:100,items:[],equipped:[]})));
    const load = async () => {
      await page.evaluate(() => {window.LarpbloxAppearance={get:()=> 'modern',set:value=>{window.chosenAppearance=value}}});
      await page.addStyleTag({path:path.join(__dirname,'..','larpbux.css')});
      await page.addScriptTag({path:path.join(__dirname,'..','larpbux.js')});
    };
    await load();
    const customize = page.getByRole('link',{name:'Customize',exact:true});
    await customize.waitFor();
    assert.equal(await page.locator('#robux-menu .larpbux-dropdown').count(),0);
    assert.deepEqual(await page.locator('.menu-vertical li').allTextContents(),['Account info','Security','Browser preferences','Customize']);
    await customize.click();
    await page.getByRole('heading',{name:'Customize',exact:true}).waitFor();
    assert.equal(await page.locator('#native-settings').isVisible(),false);
    const mode = page.getByRole('checkbox',{name:'Larp mode',exact:true});
    assert.equal(await mode.count(),1);
    await mode.uncheck();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).mode),false);
    await mode.check();
    const balance = page.getByRole('spinbutton',{name:'Pretend Larpbux balance'});
    await balance.fill('2750');
    await balance.locator('..').getByRole('button',{name:'Save',exact:true}).click();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).balance),2750);
    await page.locator('.larpbux-social-counts summary').click();
    await page.getByRole('spinbutton',{name:'Custom followers'}).fill('12345');
    await page.getByRole('spinbutton',{name:'Custom following'}).fill('0');
    await page.getByRole('button',{name:'Save profile counts',exact:true}).click();
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).socialCounts),{followers:12345,following:0});
    await page.getByRole('spinbutton',{name:'Custom followers'}).fill('-1');
    await page.getByRole('button',{name:'Save profile counts',exact:true}).click();
    assert.match(await page.locator('.larpbux-social-counts [role="status"]').textContent(),/whole numbers/);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).socialCounts.followers),12345);
    await page.getByRole('combobox',{name:'Website appearance'}).selectOption('classic');
    assert.equal(await page.evaluate(()=>chosenAppearance),'classic');
    await page.getByRole('link',{name:'Account info',exact:true}).click();
    await page.waitForFunction(()=>!document.querySelector('#native-settings').hidden && getComputedStyle(document.querySelector('#native-settings')).display!=='none');
    assert.equal(await page.locator('#native-settings').isVisible(),true);
    assert.equal(await page.locator('#robux-menu .larpbux-dropdown').count(),0);
    await customize.click();
    await page.reload();
    await load();
    await page.getByRole('heading',{name:'Customize',exact:true}).waitFor();
    assert.equal(await balance.inputValue(),'2750');
    await page.locator('.larpbux-social-counts summary').click();
    assert.equal(await page.getByRole('spinbutton',{name:'Custom followers'}).inputValue(),'12345');
    assert.equal(await page.getByRole('spinbutton',{name:'Custom following'}).inputValue(),'0');
    await page.getByRole('button',{name:'Use Roblox counts',exact:true}).click();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')).socialCounts),null);
    assert.equal(await page.getByRole('spinbutton',{name:'Custom followers'}).inputValue(),'');

    assert.equal(await mode.count(),1);
    await page.evaluate(() => {
      const content = document.querySelector('.tab-content');
      const replacement = document.createElement('div');
      replacement.className = 'tab-content';
      replacement.textContent = 'Updated native settings';
      content.replaceWith(replacement);
    });
    await page.waitForFunction(() => document.querySelector('.tab-content').hidden);
    assert.equal(await page.locator('.larpbux-settings-section').count(),1);
    assert.equal(await mode.count(),1);
    await page.screenshot({path:path.join(__dirname,'..','..','customize-settings-preview.png'),fullPage:true});
    console.log('PASS: native-style Customize navigation, controls, persistence, reload, and return to native settings.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
