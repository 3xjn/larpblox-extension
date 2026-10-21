const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><body>
        <nav><a id="nav-own" href="/users/123/profile">Real nav name</a></nav>
        <main>
          <div id="profile-header-title-container-name">Real profile name</div>
          <div class="profile-header-title"><span class="profile-header-display-name">Nested profile name</span></div>
          <article><a id="verified-card" href="/users/456/profile">Shared alias</a></article>
          <article><a id="unverified-card" href="/users/789/profile">Unverified alias</a></article>
          <a id="image-only-profile" href="/users/456/profile"><img alt="Avatar" src="avatar.png"></a>
          <a id="arbitrary" href="/users/456/avatar">Avatar link</a>
        </main>
      </body></html>`
    }));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.addStyleTag({path: path.join(__dirname, '../larpbux-verification.css')});
    await page.addScriptTag({path: path.join(__dirname, '../larpbux-verification.js')});

    await page.evaluate(() => {
      LarpbloxVerification.update({userId: '123', mode: true, verified: true});
      LarpbloxVerification.setRecords(new Map([
        ['456', {verified: true}],
        ['789', {verified: false}]
      ]));
    });
    await page.waitForFunction(() => document.querySelectorAll('.larpblox-verified-badge').length === 4);
    assert.equal(await page.locator('#nav-own > .larpblox-verified-badge').count(), 1);
    assert.equal(await page.locator('#profile-header-title-container-name > .larpblox-verified-badge').count(), 1);
    assert.equal(await page.locator('.profile-header-title > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('.profile-header-display-name > .larpblox-verified-badge').count(), 1);
    assert.equal(await page.locator('#verified-card > .larpblox-verified-badge').count(), 1);
    assert.equal(await page.locator('#unverified-card > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('#image-only-profile > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('#arbitrary > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('.larpblox-verified-badge').first().getAttribute('aria-label'), 'Verified Larpblox user');

    await page.evaluate(() => LarpbloxVerification.update({userId: '123', mode: true, verified: true}));
    await page.waitForTimeout(20);
    assert.equal(await page.locator('.larpblox-verified-badge').count(), 4, 'repeated updates do not duplicate marks');

    await page.evaluate(() => LarpbloxVerification.setRecords(new Map([['456', {verified: false}]])));
    await page.waitForFunction(() => document.querySelectorAll('.larpblox-verified-badge').length === 3);
    assert.equal(await page.locator('#verified-card > .larpblox-verified-badge').count(), 0);

    await page.evaluate(() => LarpbloxVerification.update({mode: false, verified: true}));
    await page.waitForFunction(() => document.querySelectorAll('.larpblox-verified-badge').length === 0);

    await page.evaluate(() => LarpbloxVerification.update({mode: true, verified: 'true'}));
    await page.waitForTimeout(20);
    assert.equal(await page.locator('.larpblox-verified-badge').count(), 0, 'serialized string toggle is not treated as enabled');
    console.log('PASS: Larp verification badges cover own/shared identity surfaces, cleanup, and toggle serialization.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
