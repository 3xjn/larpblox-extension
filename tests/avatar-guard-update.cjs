const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {chromium} = require('playwright');
(async () => {
  const root = path.join(__dirname, '..');
  execFileSync('python', ['scripts/package-website.py'], {cwd:root});
  const payload = JSON.parse(fs.readFileSync(path.join(root, 'website-bundle.json')));
  const hook = payload.scripts.find(script => script.name === 'larpblox-avatar-page-hook.js');
  assert.ok(hook, 'downloaded updates must include the page protection');
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage(); let writes = 0;
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"></main>'}));
    await page.route('https://avatar.roblox.com/**', r => { writes++; return r.fulfill({json:{success:true}}); });
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({content:execFileSync('git',['show','b0b4767:larpbux-body-colors.js'],{cwd:root,encoding:'utf8'})});
    await page.evaluate(() => { localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:true})); });
    const cdp = await page.context().newCDPSession(page);
    const {frameTree} = await cdp.send('Page.getFrameTree');
    const {executionContextId} = await cdp.send('Page.createIsolatedWorld', {frameId:frameTree.frame.id,worldName:'old-extension-update'});
    await cdp.send('Runtime.evaluate', {expression:hook.code,contextId:executionContextId});
    const result = await page.evaluate(async () => ({hook:globalThis.__larpbloxBodyColorsHooked,status:(await fetch('https://avatar.roblox.com/v1/outfits/777/wear',{method:'POST',body:'{}'})).status}));
    assert.deepEqual(result, {hook:2,status:409}); assert.equal(writes, 0);
    console.log('PASS: downloaded update upgrades an old page hook from an isolated extension world and blocks real avatar wear.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
