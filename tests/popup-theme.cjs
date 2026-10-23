const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    async function openPopup({siteTheme, osTheme}) {
      const page = await browser.newPage();
      await page.emulateMedia({colorScheme:osTheme});
      await page.addInitScript(theme => {
        window.chrome = {
          tabs: {query: async () => [{id: 7, url: 'https://www.roblox.com/home'}], sendMessage: async () => ({theme})},
          runtime: {sendMessage: async message => {
            if (message.action === 'popup') return {ok:true, version:'test', popup:{logo:'', css:'', js:'globalThis.LarpbloxPopupContext.ready();'}};
            return {ok:true};
          }},
        };
      }, siteTheme);
      await page.goto(pathToFileURL(path.join(__dirname, '..', 'popup.html')).href);
      const frame = page.frameLocator('#popup');
      const expectedDark = siteTheme === 'dark' || (siteTheme == null && osTheme === 'dark');
      await frame.locator(expectedDark ? 'html.dark' : 'html:not(.dark)').waitFor({state:'attached'});
      return {page, frame, dark: await frame.locator('html').evaluate(element => element.classList.contains('dark'))};
    }
    const darkSite = await openPopup({siteTheme:'dark', osTheme:'light'});
    assert.equal(darkSite.dark, true, 'Roblox dark theme wins over OS preference');
    await darkSite.page.close();
    const osDark = await openPopup({siteTheme:null, osTheme:'dark'});
    assert.equal(osDark.dark, true, 'OS dark preference is used without a site theme');
    await osDark.page.emulateMedia({colorScheme:'light'});
    await osDark.frame.locator('html:not(.dark)').waitFor();
    await osDark.page.emulateMedia({colorScheme:'dark'});
    await osDark.frame.locator('html.dark').waitFor();
    await osDark.page.close();
    const lightSite = await openPopup({siteTheme:'light', osTheme:'dark'});
    assert.equal(lightSite.dark, false, 'Roblox light theme wins over OS preference');
    await lightSite.page.close();
    console.log('PASS: popup follows Roblox theme and falls back to OS preference.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
