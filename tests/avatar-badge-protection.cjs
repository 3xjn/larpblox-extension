const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const script = path.join(__dirname, '..', 'larpbux-avatar-surfaces.js');
const markup = `
  <a href="/users/123/profile">
    <span class="player-search-card-body" role="button"><span class="avatar-headshot"><img id="own-portrait" src="own.svg"></span></span>
    <span class="icon-verified"><img id="own-badge" data-rblx-verified-badge-icon src="badge.svg"></span>
  </a>
  <a href="/users/999/profile">
    <span class="player-search-card-body" role="button"><span class="avatar-headshot"><img id="peer-portrait" src="peer.svg"></span></span>
    <span class="icon-verified"><img id="peer-badge" data-testid="verified-badge" src="badge.svg"></span>
  </a>`;

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    await page.setContent(markup);
    await page.addScriptTag({path: script});
    const selected = await page.evaluate(() => {
      const own = window.LarpbloxAvatarSurfaces;
      const peer = own.createForPeer();
      return {
        own: own.findOwnImages('123').map(image => image.id),
        peer: peer.findOwnImages('999').map(image => image.id)
      };
    });
    assert.deepEqual(selected.own, ['own-portrait'], 'own surface keeps the portrait and excludes its badge');
    assert.deepEqual(selected.peer, ['peer-portrait'], 'peer surface keeps the portrait and excludes its badge');
  } finally {
    await browser.close();
  }
  console.log('Avatar badge protection passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
