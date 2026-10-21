const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'larpblox-avatar-requests.js'), 'utf8');
const image = 'https://tr.rbxcdn.com/saved-avatar.png';
const definition = {assets:[{id:808}], bodyColors:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part=>[`${part}Color`,'#ffffff'])), scales:{}, playerAvatarType:{playerAvatarType:'R15'}};

(async () => {
  const storage = new Map();
  const context = {AbortController, Date, setTimeout, clearTimeout,
    document:{querySelector:() => null},
    localStorage:{getItem:key => storage.get(key), setItem:(key,value) => storage.set(key,value)},
    fetch:async () => ({ok:true, status:200, headers:{get:() => null}, json:async () => ({state:'Completed',imageUrl:image})})};
  vm.createContext(context); vm.runInContext(source, context);
  await context.LarpbloxAvatarRequests.render(definition,123,new AbortController().signal,'2d');
  vm.runInContext(source, context); // New page retains only localStorage.
  context.fetch = () => { throw new Error('A cached preview must not make a render request'); };
  assert.equal(await context.LarpbloxAvatarRequests.render(definition,123,new AbortController().signal,'2d'),image);
  assert.equal(context.LarpbloxAvatarRequests.cached({...definition,assets:[{id:809}]},123),undefined);
  assert.equal(context.LarpbloxAvatarRequests.cached(definition,456),undefined);
  assert.equal(context.LarpbloxAvatarRequests.cached(definition,123,'3d'),undefined);
  storage.clear();
  storage.set('larpblox-characters-v1:123',JSON.stringify({profiles:[{snapshot:{userId:'123',definition},thumbnail:image}]}));
  assert.equal(context.LarpbloxAvatarRequests.cached(definition,123),image);
  assert.equal(context.LarpbloxAvatarRequests.cached({...definition,backgroundId:92},123),undefined);
  console.log('PASS: render cache survives reload, matches the exact outfit and account, and reuses saved character thumbnails.');

  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    let renders = 0;
    await page.route('https://www.roblox.com/**',r => r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-thumbnail" style="position:relative;width:277px;height:352px"><canvas id="native"></canvas></div><button class="toggle-three-dee">2D</button></main>'}));
    await page.route('https://avatar.roblox.com/v1/avatar/render',r => { renders++; return r.fulfill({status:429,headers:{'retry-after':'120'},body:'{}'}); });
    await page.route(image,r => r.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=','base64')}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(({definition,image}) => {
      document.documentElement.classList.add('larpblox-modern');
      const item = {id:808,itemType:'Asset',assetType:8,name:'Hat',assetTypeVerified:true,limitedVerified:true};
      localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,items:[item],equipped:['Asset:808'],gameLook:{version:1,userId:'123',items:[item],definition}}));
      localStorage.setItem('larpblox-characters-v1:123',JSON.stringify({profiles:[{snapshot:{userId:'123',definition},thumbnail:image}]}));
    },{definition,image});
    await page.addScriptTag({path:path.join(root,'larpbux-game-bridge.js')});
    await page.addScriptTag({path:path.join(root,'larpblox-avatar-requests.js')});
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    await page.locator('.larpbux-avatar-look:not([hidden]) img').waitFor();
    assert.equal(await page.locator('.larpbux-avatar-look img').first().getAttribute('src'),image);
    assert.equal(await page.locator('#native').evaluate(el=>getComputedStyle(el).visibility),'hidden');
    await page.waitForFunction(()=>!document.querySelector('.larpbux-avatar-loading'));
    assert.equal(renders,1,'the cached 2D fallback must not make another rate-limited request');
    await page.reload();
    await page.evaluate(()=>document.documentElement.classList.add('larpblox-modern'));
    await page.addScriptTag({path:path.join(root,'larpbux-game-bridge.js')});
    await page.addScriptTag({path:path.join(root,'larpblox-avatar-requests.js')});
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    await page.locator('.larpbux-avatar-look:not([hidden]) img').waitFor();
    assert.equal(renders,1,'reloading during the server cooldown must reuse the saved image immediately');
    await page.screenshot({path:path.join(root,'.test-artifacts/avatar-cache.png')});
    console.log('PASS: saved avatar remains visible when the live 3D renderer returns 429.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
