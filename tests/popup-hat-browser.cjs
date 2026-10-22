const assert = require('node:assert/strict');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 390, height: 850}});
    const saved = {
      mode: true,
      sharing: true,
      verified: false,
      balance: 100,
      appearance: 'modern',
      socialCounts: {followers: 12, following: 3},
      username: 'Tester',
      avatarPage: false,
      avatarView: 'larp',
      previewStatus: '',
      gameStatus: '',
      hatCustomization: {style: 'auto', name: 'Rbadam Smokestack', equipped: true},
    };
    const messages = [];
    await page.exposeFunction('popupRequest', message => {
      const payload = message.message;
      messages.push(payload);
      if (payload.type === 'larpblox-popup-hat-style') saved.hatCustomization.style = payload.style;
      return {ok: true, ...saved};
    });
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType: 'text/html', body: '<div id="root"></div>'}));
    await page.goto('https://www.roblox.com/my/account');
    await page.evaluate(() => {
      window.chrome = {
        tabs: {query: async () => [{id: 1, url: location.href}]},
        runtime: {sendMessage: message => window.popupRequest(message)},
      };
      window.LarpbloxPopupContext = {ready() {}, logo: '', version: 'test'};
    });
    await page.addStyleTag({path: path.join(__dirname, '../assets/popup/popup.css')});
    await page.addScriptTag({path: path.join(__dirname, '../assets/popup/popup.js')});

    await page.getByRole('button', {name: 'More settings'}).click();
    await page.getByRole('heading', {name: 'Hat customization'}).waitFor();
    const style = page.getByRole('combobox', {name: 'Hat style'});
    await style.click();
    assert.deepEqual(await page.getByRole('option').allTextContents(), [
      'Automatic (seasonal)', 'Normal', 'Halloween', 'Thanksgiving', 'Christmas',
      'Roblox Birthday', 'St. Patrick’s Day', 'Valentine’s Day', 'April Fools’',
    ]);
    await page.getByRole('option', {name: 'Halloween', exact: true}).click();
    await page.getByRole('combobox', {name: 'Hat style'}).getByText('Halloween', {exact: true}).waitFor();
    assert.deepEqual(messages.at(-1), {type: 'larpblox-popup-hat-style', style: 'halloween'});
    assert.equal(saved.hatCustomization.style, 'halloween');
    await page.screenshot({path: path.join(__dirname, 'popup-hat.png'), fullPage: true});
    console.log('PASS: compiled popup shows hat settings, all nine styles, and persists Halloween selection.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
