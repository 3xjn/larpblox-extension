const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:`<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-back" style="width:277px;height:352px"><div class="avatar-thumbnail" style="width:277px;height:352px"></div></div><button class="toggle-three-dee">2D</button><div class="breadcrumb-container">Accessories Head</div><div class="items-list avatar-item-list"></div></main>`}));
    await page.route('https://thumbnails.roblox.com/**', r => r.fulfill({json:{data:[]}}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({path:path.join(__dirname,'../larpbux-game-bridge.js')});
    await page.evaluate(() => {
      document.documentElement.classList.add('larpblox-modern');
      const bodyColors = Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part => [part + 'Color', '#ffffff']));
      const first = {id:808,itemType:'Asset',assetType:8,name:'First Hat',assetTypeVerified:true,limitedVerified:true};
      const second = {id:809,itemType:'Asset',assetType:8,name:'Second Hat',assetTypeVerified:true,limitedVerified:true};
      localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({
        version:1, mode:true, balance:1000, items:[first, second], equipped:['Asset:808'],
        gameLook:{version:1,userId:'123',items:[first],definition:{assets:[{id:808}],bodyColors,scales:{},playerAvatarType:{playerAvatarType:'R15'}}}
      }));
      window.renderCalls = [];
      window.viewers = [];
      window.resolveRenders = [];
      window.LarpbloxAvatarRequests = {render: (definition, userId, signal, kind) => {
        const ids = definition.assets.map(asset => asset.id).sort((a,b) => a-b);
        window.renderCalls.push({ids, kind});
        return new Promise(resolve => window.resolveRenders.push(() => resolve(`image-${ids.join('-')}`)));
      }};
      window.LarpbloxAvatar3D = {create: async (host, imageUrl, options) => {
        window.viewers.push({imageUrl, ids:options.definition.assets.map(asset => asset.id).sort((a,b) => a-b)});
        host.append(document.createElement('canvas'));
        return {dispose(){}, getView(){return {}}};
      }};
    });
    const root = process.env.EXTENSION_ROOT || path.join(__dirname, '..');
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addStyleTag({content:'.item-card-thumb{display:block;width:100px;height:100px}'});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});

    const assertNativeLoader = async () => {
      const loader = page.locator('.larpbux-preview-loader');
      const native = loader.locator('> .loading-animated.larpbux-native-loading');
      const squares = native.locator('> div > div');
      assert.equal(await native.count(), 1);
      assert.equal(await squares.count(), 3);
      await native.evaluate(element => {
        for (const animation of element.getAnimations({subtree:true})) {
          animation.pause(); animation.currentTime = 0;
        }
      });
      const metrics = await native.evaluate(element => {
        const rect = element.getBoundingClientRect();
        const children = [...element.querySelectorAll(':scope > div > div')];
        const styles = children.map(child => getComputedStyle(child));
        const boxes = children.map(child => child.getBoundingClientRect());
        return {
          width: Math.round(rect.width), height: Math.round(rect.height),
          squareWidth: Math.round(boxes[0].width), squareHeight: Math.round(boxes[0].height),
          gaps: boxes.slice(1).map((box, index) => box.left - boxes[index].right),
          durations: styles.map(style => style.animationDuration),
          delays: styles.map(style => style.animationDelay),
          backgrounds: styles.map(style => style.backgroundColor)
        };
      });
      assert.deepEqual([metrics.width, metrics.height], [75, 24]);
      assert.deepEqual([metrics.squareWidth, metrics.squareHeight], [12, 12]);
      assert.deepEqual(metrics.gaps, [19.5, 19.5]);
      assert.deepEqual(metrics.durations, ['1.8s', '1.8s', '1.8s']);
      assert.deepEqual(metrics.delays, ['0s', '0.6s', '1.2s']);
      assert.deepEqual(metrics.backgrounds, ['rgb(101, 102, 104)', 'rgb(101, 102, 104)', 'rgb(101, 102, 104)']);
      const pulse = await squares.first().evaluate(element => {
        element.getAnimations()[0].currentTime = 297;
        return {height:element.getBoundingClientRect().height, color:getComputedStyle(element).backgroundColor};
      });
      assert.deepEqual(pulse, {height:18, color:'rgb(255, 255, 255)'});
      const colors = await native.evaluate(element => {
        const animations = element.getAnimations({subtree:true});
        const colors = new Set();
        for (let time = 0; time <= 3600; time += 20) {
          for (const animation of animations) animation.currentTime = time;
          for (const square of element.querySelectorAll(':scope > div > div')) colors.add(getComputedStyle(square).backgroundColor);
        }
        for (const animation of animations) animation.currentTime = 0;
        return [...colors];
      });
      for (const color of colors) {
        const [red, green, blue] = color.match(/\d+/g).map(Number);
        assert.ok(red >= 101 && blue - red <= 3 && green >= red && blue >= green, 'two full cycles must contain only the sampled gray-to-white colors');
      }
      for (let index = 0; index < 3; index++) {
        const peak = await squares.nth(index).evaluate((square, time) => {
          square.getAnimations()[0].currentTime = time;
          return getComputedStyle(square).backgroundColor;
        }, index * 600 + 297);
        assert.equal(peak, 'rgb(255, 255, 255)', 'each enlarged square must reach the sampled pure white');
      }
    };

    await page.waitForFunction(() => window.renderCalls.some(call => call.ids.length === 1));
    await assertNativeLoader();
    if (process.env.LOADER_SCREENSHOT) {
      await page.locator('.avatar-back').evaluate(element => element.style.backgroundColor = '#b9926b');
      await page.locator('.larpbux-native-loading').evaluate(element => {
        for (const animation of element.getAnimations({subtree:true})) animation.currentTime = 897;
      });
      await page.locator('.avatar-thumbnail').screenshot({path:process.env.LOADER_SCREENSHOT});
    }
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), 'true');

    await page.evaluate(() => window.resolveRenders.shift()());
    await page.locator('.larpbux-avatar-look canvas').waitFor();
    assert.equal(await page.locator('.larpbux-preview-loader').count(), 0);
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), null);

    await page.locator('.larpbux-avatar-item').filter({hasText:'Second Hat'}).locator('.item-card-thumb').click();
    await page.waitForFunction(() => window.renderCalls.some(call => call.ids.length === 2));
    await assertNativeLoader();
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), 'true');
    assert.deepEqual(await page.locator('.larpbux-avatar-scene').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).visibility)), ['hidden', 'hidden']);

    await page.evaluate(() => window.resolveRenders.shift()());
    await page.locator('.larpbux-avatar-scene:not(.larpbux-avatar-loading) canvas').waitFor();
    assert.equal(await page.locator('.larpbux-preview-loader').count(), 0);
    assert.equal(await page.locator('.larpbux-avatar-look').getAttribute('aria-busy'), null);
    assert.equal(await page.locator('.larpbux-avatar-scene').count(), 1);
    assert.deepEqual(await page.evaluate(() => window.viewers.map(viewer => viewer.ids)), [[808], [808, 809]]);
    console.log('PASS: initial and second avatar equips show the loader, hide old scenes, and clear it after the new preview is ready.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
