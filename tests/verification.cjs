const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
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
          <div class="profile-header-names"><span class="profile-header-title-container"><h1>Native display name</h1><span data-testid="verified-badge"><img alt="Verified"></span></span></div>
          <div class="profile-header-username">@realusername</div>
          <a id="username-link" href="/users/123/profile">@realusername</a>
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
    const fallbackBadge=page.locator('#profile-header-title-container-name > .larpblox-verified-badge');
    assert.equal(await fallbackBadge.evaluate(el=>getComputedStyle(el).width),'28px','alternate profile layout uses full profile size');
    assert.equal(await fallbackBadge.evaluate(el=>getComputedStyle(el).marginLeft),'8px','alternate profile layout matches native name gap');
    assert.equal(await page.locator('.profile-header-username .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('.profile-header-title > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('.profile-header-display-name > .larpblox-verified-badge').count(), 1);
    assert.equal(await page.locator('.profile-header-title-container > h1 > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('.profile-header-title-container > [data-testid="verified-badge"] + .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('#verified-card > .larpblox-verified-badge').count(), 1);
    assert.equal(await page.locator('#unverified-card > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('#image-only-profile > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('#username-link > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('.larpblox-verified-badge.icon-verified svg').count(), 0);
    assert.match(await page.locator('.larpblox-verified-badge img').first().getAttribute('src'), /^data:image\/svg\+xml/);
    assert.equal(await page.locator('#arbitrary > .larpblox-verified-badge').count(), 0);
    assert.equal(await page.locator('.larpblox-verified-badge').first().getAttribute('aria-label'), 'Verified Larpblox user');

    await page.evaluate(() => {
      const title=document.querySelector('.profile-header-title-container');
      title.querySelector('[data-testid="verified-badge"]').remove();
      const plus=document.createElement('span');plus.id='native-plus';title.append(plus);
    });
    await page.waitForFunction(() => document.querySelector('.profile-header-title-container > .larpblox-profile-verified'));
    assert.equal(await page.locator('.profile-header-title-container > h1 + .larpblox-profile-verified + #native-plus').count(),1,'profile badge follows display name before other badges');
    const nativeBadge=page.locator('.profile-header-title-container > .larpblox-profile-verified');
    assert.equal(await nativeBadge.evaluate(el=>getComputedStyle(el).width),'28px');
    assert.equal(await nativeBadge.evaluate(el=>getComputedStyle(el).marginLeft),'0px');
    const exactSvg=fs.readFileSync(path.join(__dirname,'../assets/roblox-verified-badge.svg'),'utf8');
    const imageUrl=await nativeBadge.locator('img').getAttribute('src');
    assert.equal(decodeURIComponent(imageUrl.slice(imageUrl.indexOf(',')+1)),exactSvg,'uses the original Roblox badge asset unchanged');
    await page.setViewportSize({width:500,height:700});
    assert.equal(await nativeBadge.evaluate(el=>getComputedStyle(el).width),'16px','matches native mobile badge size');
    await page.setViewportSize({width:1280,height:720});
    await page.evaluate(() => {const existing=document.createElement('span');existing.dataset.testid='verified-badge';document.querySelector('.profile-header-title-container').append(existing);});
    await page.waitForFunction(() => !document.querySelector('.profile-header-title-container > .larpblox-profile-verified'));

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
