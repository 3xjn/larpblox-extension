const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 900, height: 600}});
    await page.goto('https://example.com');
    const script = path.join(__dirname, '../larpbux-characters.js');
    for (const category of ['Characters', 'Creations']) {
      await page.setContent(`<main id="avatar-web-app" style="display:block"><div class="breadcrumb">${category} &gt; Owned</div><ul class="items-list avatar-item-list" style="display:block"><li id="character-card" class="item-card" style="display:block"><div class="item-card-container"><div class="item-card-thumb-container"><button class="item-card-thumb" type="button"><span class="thumbnail-2d-container"><img alt="test"></span></button></div><div class="item-card-caption"><a class="item-card-name-link" href="/my/avatar">test</a></div></div></li></ul></main>`);
      await page.evaluate(() => {
        window.nativeWore = 0;
        window.applied = 0;
        const card = document.querySelector('#character-card');
        card.addEventListener('click', () => { window.nativeWore++; });
        window.options = {
          editor: document.querySelector('#avatar-web-app'), userId: '123', active: true,
          capture: async () => ({}), apply: async () => {},
          linkNative: async () => '/bundles/777/Test',
          applyNative: async selected => { if (selected.id !== 'character-card') throw Error('wrong card'); window.applied++; }
        };
      });
      await page.addScriptTag({path: script});
      await page.evaluate(() => LarpbloxCharacters.update(options));
      await page.locator('#character-card .item-card-name-link[href="/bundles/777/Test"]').waitFor();
      await page.locator('#character-card a[href="/bundles/777/Test"] .item-card-thumb').waitFor();
      const popupReady = page.context().waitForEvent('page', {timeout: 2000});
      await page.locator('#character-card .item-card-thumb img').click({button: 'middle'});
      const popup = await popupReady;
      assert.equal(new URL(popup.url()).pathname, '/bundles/777/Test');
      await popup.close();
      await page.locator('#character-card img').click();
      await page.waitForFunction(() => window.applied === 1);
      assert.equal(await page.evaluate(() => window.nativeWore), 0, `${category}: native wear handler ran`);
    }
    await page.setContent('<main id="avatar-web-app" style="display:block"><div class="breadcrumb">Accessories</div><div class="tabs"><button aria-selected="true">Accessories</button><button>Characters</button></div><ul class="items-list avatar-item-list" style="display:block"><li id="accessory-card" class="item-card" style="display:block"><div class="item-card-thumb-container"><button class="item-card-thumb"><img alt="hat"></button></div><div class="item-card-name-link">Hat</div></li></ul></main>');
    await page.evaluate(() => { window.applied = 0; window.options.editor = document.querySelector('#avatar-web-app'); });
    await page.evaluate(() => LarpbloxCharacters.update(options));
    await page.locator('#accessory-card img').click();
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => window.applied), 0, 'Accessories must not route through native character wear');
    console.log('PASS: owned character cards in Characters and Creations views route thumbnail clicks to Larpblox and suppress native wear.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
