// Exercises the production extension's static MAIN document_start hook.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const extension = path.resolve(__dirname, '..');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'larpblox-first-title-'));
  const context = await chromium.launchPersistentContext(profile, {
    executablePath: process.env.TEST_CHROME_PATH,
    headless:true,
    args:['--disable-extensions-except='+extension, '--load-extension='+extension],
  });
  try {
    const page = await context.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType:'text/html',
      body:`<!doctype html><html><head><title>Real parser name - Roblox</title><script>
        window.firstGuard = typeof window.__larpbloxTitleGuard; window.firstParsedTitle = document.title;
        document.title = 'Real script name - Roblox';
        window.firstTitle = document.title;
        document.querySelector('title').textContent = 'Real text name - Roblox';
        window.firstTextTitle = document.title;
      </script></head><body></body></html>`,
    }));
    await page.goto('https://www.roblox.com/users/123/profile');
    const cold = await page.evaluate(() => ({parsed:firstParsedTitle, guard:firstGuard, title:firstTitle, text:firstTextTitle}));
    assert.deepEqual(cold, {parsed:'Roblox', guard:'boolean', title:'Roblox', text:'Roblox'}, 'static hook must precede the first inline page script');
    await page.evaluate(() => localStorage.setItem('larpblox-profile-title:123', JSON.stringify({displayName:'Larp First',expires:Date.now()+60000})));
    await page.reload();
    const cached = await page.evaluate(() => ({parsed:firstParsedTitle,guard:firstGuard,title:firstTitle,text:firstTextTitle}));
    assert.deepEqual(cached, {parsed:'Larp First - Roblox',guard:'boolean',title:'Larp First - Roblox',text:'Larp First - Roblox'});
    console.log('PASS: production static MAIN hook intercepts title writes before the first page script for cold and cached profiles.');
  } finally { await context.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
