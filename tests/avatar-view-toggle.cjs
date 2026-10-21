const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:800,height:600}});
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:`
      <meta name="user-data" data-userid="123">
      <style>.avatar-thumbnail{position:relative;width:277px;height:352px;background:#eee}
      .toggle-three-dee{position:absolute;bottom:12px;right:12px;padding:10px}</style>
      <main id="avatar-web-app"><div class="avatar-thumbnail"><div id="UserAvatar" class="thumbnail-holder">
      <canvas id="native-avatar"></canvas><button class="toggle-three-dee"><span>3D</span></button>
      </div></div></main>`}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(() => {
      document.documentElement.classList.add('larpblox-modern');
      const item = {id:808,itemType:'Asset',assetType:8,name:'Hat',assetTypeVerified:true,limitedVerified:true};
      const bodyColors = Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part=>[`${part}Color`,'#ffffff']));
      localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,items:[item],equipped:['Asset:808'],gameLook:{version:1,userId:'123',items:[item],definition:{assets:[{id:808}],bodyColors,scales:{},playerAvatarType:{playerAvatarType:'R15'}}}}));
      document.querySelector('.toggle-three-dee').onclick = event => {
        const label = event.currentTarget.querySelector('span');
        label.textContent = label.textContent === '3D' ? '2D' : '3D';
      };
      window.kinds = [];
      window.LarpbloxAvatarRequests = {render:async(definition,userId,signal,kind) => {
        kinds.push(kind);
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=';
      }};
      window.LarpbloxAvatar3D = {create:async host => {
        host.append(document.createElement('canvas'));
        return {dispose(){},getView(){return {}}};
      }};
    });
    await page.addScriptTag({path:path.join(root,'larpbux-game-bridge.js')});
    await page.addScriptTag({path:path.join(root,'identity-gate.js')});
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    await page.locator('.larpbux-avatar-look:not([hidden]) img').waitFor();
    const button = page.getByRole('button',{name:'3D',exact:true});
    assert.equal(await button.evaluate(el=>getComputedStyle(el).visibility),'visible');
    assert.equal(await button.locator('span').evaluate(el=>getComputedStyle(el).visibility),'visible');
    assert.equal(await page.locator('#native-avatar').evaluate(el=>getComputedStyle(el).visibility),'hidden');
    await button.click({timeout:3000}); // Must be above the full-frame local preview.
    await page.locator('.larpbux-avatar-look canvas').waitFor();
    await page.getByRole('button',{name:'2D',exact:true}).click({timeout:3000});
    await page.locator('.larpbux-avatar-look img').waitFor();
    assert.deepEqual(await page.evaluate(()=>kinds),['2d','3d','2d']);
    await page.screenshot({path:path.join(root,'.test-artifacts/avatar-view-toggle.png')});
    console.log('PASS: native 2D/3D control is visible and clickable above the local preview, switches both ways, and leaves the native avatar hidden.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
