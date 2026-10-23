const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:`
      <meta name="user-data" data-userid="123">
      <div class="profile-header" data-user-id="123">
        <div class="currently-wearing-avatar-with-background">
          <div class="profile-avatar-left" style="position:relative;width:240px;height:240px">
            <img id="native-photo" src="native.png" style="position:absolute;inset:0;width:100%;height:100%">
            <img id="verified-icon" class="icon-verified" src="verified.png">
            <canvas id="native-canvas" width="32" height="32" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
            <div class="avatar-toggle-button"><button><img id="toggle-icon" src="toggle.png"><span id="toggle-label">2D</span></button></div>
          </div>
        </div>
      </div>`}));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.evaluate(() => {
      const image = document.createElement('canvas'); image.width = image.height = 32;
      const ctx = image.getContext('2d'); ctx.fillStyle = '#2588cc'; ctx.fillRect(0, 0, 32, 32);
      window.avatarPng = image.toDataURL('image/png');
      window.definition = {assets:[], bodyColors:{}, scales:{}, playerAvatarType:{playerAvatarType:'R15'}};
      window.allow3d = false;
      window.LarpbloxAvatarRequests = {
        cached:(_definition, _userId, kind) => kind === '2d' ? avatarPng : null,
        render:async(_definition, _userId, _signal, kind='3d') => {
          if (kind === '2d') return avatarPng;
          if (!allow3d) throw new Error('3D unavailable');
          return 'avatar-descriptor';
        },
        definitionKey:definition => JSON.stringify(definition),
      };
      window.LarpbloxAvatar3D = {create:async(host, _descriptor, {static:staticViewer}={}) => {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 32;
        canvas.setAttribute('aria-label', staticViewer ? 'capture viewer' : '3D avatar preview');
        host.append(canvas);
        return {
          capture:() => avatarPng,
          getBackgroundUrl:() => undefined,
          dispose:() => canvas.remove(),
        };
      }};
      window.loadDefinition = async () => definition;
    });
    await page.addScriptTag({path:path.join(root, 'larpbux-avatar-surfaces.js')});
    const update = signature => page.evaluate(signature => LarpbloxAvatarSurfaces.update({
      userId:'123', active:true, signature, loadDefinition:loadDefinition,
    }), signature);

    await update('flat-preview');
    await page.locator('.larpblox-own-profile-preview img').waitFor();
    check(await page.locator('#native-canvas').evaluate(el => getComputedStyle(el).visibility) === 'hidden',
      '2D fallback should hide the native canvas underneath the replacement portrait');
    check(await page.locator('#native-photo').evaluate(el => getComputedStyle(el).visibility) === 'hidden',
      '2D fallback should hide the native portrait image underneath the replacement');
    check(await page.locator('#toggle-icon').evaluate(el => getComputedStyle(el).visibility) === 'visible',
      'the avatar toggle button image must remain visible');
    check(await page.locator('#verified-icon').evaluate(el => getComputedStyle(el).visibility) === 'visible',
      'verified badge images must remain visible');

    await page.evaluate(() => { window.allow3d = true; });
    await update('3d-preview');
    await page.locator('.larpblox-own-profile-preview canvas.larpblox-own-avatar-canvas').waitFor();
    check(await page.locator('#native-canvas').evaluate(el => getComputedStyle(el).visibility) === 'hidden',
      'switching to 3D should keep the native canvas hidden');

    await page.evaluate(() => {
      const late = document.createElement('canvas'); late.id = 'late-native-canvas';
      document.querySelector('.profile-avatar-left').append(late);
    });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#late-native-canvas')).visibility === 'hidden');
    check(await page.locator('#late-native-canvas').evaluate(el => getComputedStyle(el).visibility) === 'hidden',
      'a native canvas mounted after the 3D overlay should also be hidden');

    await page.locator('#toggle-label').evaluate(el => { el.textContent = '3D'; });
    await update('3d-preview');
    await page.waitForFunction(() => !document.querySelector('.larpblox-own-profile-preview'));
    check(await page.locator('#native-photo').evaluate(el => getComputedStyle(el).visibility) === 'visible',
      'switching Roblox to its 2D view should remove the overlay and restore the portrait image');

    await page.locator('#toggle-label').evaluate(el => { el.textContent = '2D'; });
    await update('reset-preview');
    await page.locator('.larpblox-own-profile-preview canvas.larpblox-own-avatar-canvas').waitFor();

    await page.evaluate(() => LarpbloxAvatarSurfaces.update({userId:'123', active:false}));
    await page.waitForFunction(() => !document.querySelector('.larpblox-own-profile-preview'));
    check(await page.locator('#native-canvas').evaluate(el => getComputedStyle(el).visibility) === 'visible',
      'reset should restore the original native canvas');
    check(await page.locator('#late-native-canvas').evaluate(el => getComputedStyle(el).visibility) === 'visible',
      'reset should leave the late native canvas visible');
    check(await page.locator('#native-photo').getAttribute('src') === 'native.png',
      'reset should restore the original native portrait source');
    check(await page.locator('#toggle-icon').evaluate(el => getComputedStyle(el).visibility) === 'visible',
      'reset should leave the avatar toggle button image visible');
    check(await page.locator('#verified-icon').evaluate(el => getComputedStyle(el).visibility) === 'visible',
      'reset should leave the verified badge image visible');

    assert.deepEqual(failures, [], failures.join('\n'));
    console.log('PASS: 2D/3D profile previews suppress duplicate native canvases, including late mounts, and reset restores them.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
