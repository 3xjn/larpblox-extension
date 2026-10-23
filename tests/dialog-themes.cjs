const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1200,height:900}});
    await page.setContent('<html><head><style>body{font:16px Arial}p{color:#494b5a}dialog{position:relative;inset:auto;margin:12px;display:inline-block;vertical-align:top}</style></head><body></body></html>');
    await page.addStyleTag({path:path.join(__dirname,'../era-layout.css')});
    await page.addStyleTag({path:path.join(__dirname,'../classic.css')});
    await page.addStyleTag({path:process.argv[2] || path.join(__dirname,'../larpbux.css')});
    await page.evaluate(() => {
      const types = ['larpbux-buy-dialog larpbux-item-buy-dialog','larpbux-buy-dialog larpbux-purchase-complete','larpbux-buy-dialog larpbux-cart-dialog','larpbux-buy-dialog larpbux-avatar-copy-dialog','larpbux-buy-dialog larpbux-username-dialog','larpbux-character-dialog','larpbux-character-dialog larpbux-character-update','larpbux-character-dialog larpbux-character-update larpbux-character-delete'];
      document.body.innerHTML = types.map(classes => `<dialog open class="${classes}"><h2>Confirmation</h2><button class="larpbux-modal-close">×</button><div class="larpbux-complete-body"><p>Changes saved successfully.</p></div><label>Name<input value="Example"></label><p class="larpbux-cart-balance">Your balance: 1,000</p><p class="larpbux-purchase-status">Example error</p><div class="larpbux-purchase-footer"><button class="larpbux-buy-confirm">OK</button><button class="larpbux-buy-cancel">Cancel</button></div></dialog>`).join('');
      document.body.insertAdjacentHTML('beforeend','<div class="larpbux-character-menu" style="position:relative;inset:auto;width:200px;height:80px;background:rgb(1,2,3)"><button>Rename</button></div>');
    });
    let checks=0;
    for (const osTheme of ['light','dark']) {
    await page.emulateMedia({colorScheme:osTheme});
    for (const appearance of ['larpblox-modern','rbx2016']) {
      for (const placement of ['html','body']) {
        for (const theme of ['light','dark','light']) {
          await page.evaluate(({appearance,placement,theme}) => {
            document.documentElement.className=appearance;
            document.body.className='';
            document.querySelector(placement).classList.add(theme+'-theme');
          }, {appearance,placement,theme});
          const styles = await page.locator('dialog').evaluateAll(dialogs => dialogs.map(dialog => {
            const style=getComputedStyle(dialog);
            return {type:dialog.className,background:style.backgroundColor,text:style.color,scheme:style.colorScheme,description:getComputedStyle(dialog.querySelector('p')).color,confirm:getComputedStyle(dialog.querySelector('.larpbux-buy-confirm')).color};
          }));
          for (const style of styles) {
            const label=`${appearance}/${placement}/${theme}: ${style.type}`;
            assert.equal(style.background,theme==='dark'?'rgb(25, 26, 31)':'rgb(255, 255, 255)',label+' background');
            assert.equal(style.text,theme==='dark'?'rgb(247, 247, 248)':'rgb(32, 34, 39)',label+' text');
            assert.equal(style.description,style.text,label+' readable description');
            assert.equal(style.scheme,theme,label+' native form controls');
            if(style.type.includes('larpbux-buy-dialog')) assert.equal(style.confirm,'rgb(255, 255, 255)',label+' primary button');
            checks++;
          }
          assert.equal(await page.locator('.larpbux-character-menu').evaluate(e=>getComputedStyle(e).backgroundColor),theme==='dark'?'rgb(25, 26, 31)':'rgb(255, 255, 255)','Character menu follows live theme instead of a copied background');
        }
      }
    }
    }
    await page.evaluate(()=>{document.documentElement.className='larpblox-modern';document.body.className='';});
    assert.equal(await page.locator('dialog').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(25, 26, 31)','Dark OS fallback applies when Roblox has no explicit theme');
    for (const theme of ['light','dark']) {
      await page.evaluate(theme=>{document.documentElement.className='larpblox-modern '+theme+'-theme';document.body.className='';document.body.style.background=theme==='dark'?'#111216':'#f2f4f7';},theme);
      await page.screenshot({path:path.join(__dirname,`dialog-themes-${theme}.png`),fullPage:true});
    }
    console.log(`PASS: ${checks} dialog theme checks, including live theme switches in both website appearances.`);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
