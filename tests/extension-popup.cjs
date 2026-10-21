const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:500,height:700}});
    await page.addInitScript(() => {
      window.mockLarpState = {mode:false,balance:1200,appearance:'classic'};
      window.chrome = {tabs:{
        query:async () => [{id:7,url:'https://www.roblox.com/my/account'}],
        sendMessage:async (_tabId,message) => {
          if (message.type === 'larpblox-popup-get-state') return {ok:true,...window.mockLarpState};
          Object.assign(window.mockLarpState,Object.fromEntries(Object.entries(message).filter(([key])=>key !== 'type')));
          return {ok:true,...window.mockLarpState};
        }
      }};
    });
    await page.goto(pathToFileURL(path.join(__dirname,'..','popup.html')).href);
    const controls = page.locator('#controls');
    await controls.waitFor({state:'visible'});
    assert.equal(await page.locator('#balance').inputValue(),'1200');
    assert.equal(await page.locator('#balance').isDisabled(),true);

    await page.getByRole('checkbox',{name:/Larp mode/}).check();
    await page.waitForFunction(() => window.mockLarpState.mode === true);
    assert.equal(await page.locator('#balance').isDisabled(),false);
    await page.locator('#balance').fill('2750');
    await page.getByRole('button',{name:'Save'}).click();
    await page.waitForFunction(() => window.mockLarpState.balance === 2750);
    await page.getByRole('combobox',{name:'Website appearance'}).selectOption('modern');
    await page.waitForFunction(() => window.mockLarpState.appearance === 'modern');
    assert.deepEqual(await page.evaluate(() => window.mockLarpState),{mode:true,balance:2750,appearance:'modern'});
    console.log('PASS: extension popup updates Larp mode, pretend balance, and website appearance.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
