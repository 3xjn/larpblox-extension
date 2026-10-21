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
      <style>
      .avatar-back{width:277px;height:352px;position:relative;overflow:hidden;border-radius:8px;background:#895d36}
      .avatar-thumbnail{width:352px;height:352px;position:relative;left:50%;transform:translate(-50%)}
      .avatar-thumbnail.slots-visible{transform:translate(calc(33px - 50%))}
      .avatar-thumbnail .thumbnail-holder{width:100%;height:100%}
      .avatar-thumbnail .toggle-three-dee{position:absolute;bottom:12px;right:54px;padding:10px}
      .avatar-thumbnail.slots-visible .toggle-three-dee{right:87px}
      </style>
      <main id="avatar-web-app"><div class="avatar-back"><div class="avatar-thumbnail"><div id="UserAvatar" class="thumbnail-holder">
      <canvas id="native-avatar"></canvas><button class="toggle-three-dee"><span>3D</span></button>
      </div></div></div></main>`}));
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
      window.nativeToggle = document.querySelector('.toggle-three-dee');
      const canvas = document.createElement('canvas');canvas.width=canvas.height=420;
      canvas.getContext('2d').fillStyle='#00cc88';canvas.getContext('2d').fillRect(0,0,420,420);
      const imageUrl=canvas.toDataURL();
      window.kinds = [];
      window.LarpbloxAvatarRequests = {render:async(definition,userId,signal,kind) => {
        kinds.push(kind);
        return imageUrl;
      }};
      window.LarpbloxAvatar3D = {create:async host => {
        host.append(document.createElement('canvas'));
        return {dispose(){},getView(){return {}}};
      }};
    });
    const geometry=()=>page.evaluate(()=>Object.fromEntries(['.avatar-back','.avatar-thumbnail','.toggle-three-dee'].map(selector=>{
      const r=document.querySelector(selector).getBoundingClientRect();return [selector,{x:r.x,y:r.y,width:r.width,height:r.height}];
    })));
    const nativeGeometry=await geometry();
    await page.addScriptTag({path:path.join(root,'larpbux-game-bridge.js')});
    await page.addScriptTag({path:path.join(root,'identity-gate.js')});
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.addScriptTag({path:path.join(root,'larpbux.js')});
    await page.locator('.larpbux-avatar-look:not([hidden]) img').waitFor();
    assert.deepEqual(await geometry(),nativeGeometry,'local rendering must preserve Roblox canvas and toggle placement');
    assert.equal(await page.evaluate(()=>document.querySelector('.toggle-three-dee')===nativeToggle),true,'keep the original control and native handler');
    const imageBox=await page.locator('.larpbux-avatar-look img').boundingBox();
    assert.equal(imageBox.width,352);assert.equal(imageBox.height,352,'the square PNG fills the full frame height without background bands');
    const button = page.getByRole('button',{name:'3D',exact:true});
    assert.equal(await button.evaluate(el=>getComputedStyle(el).visibility),'visible');
    assert.equal(await button.locator('span').evaluate(el=>getComputedStyle(el).visibility),'visible');
    assert.equal(await page.locator('#native-avatar').evaluate(el=>getComputedStyle(el).visibility),'hidden');
    await button.click({timeout:3000}); // Must be above the full-frame local preview.
    await page.locator('.larpbux-avatar-look canvas').waitFor();
    assert.deepEqual(await geometry(),nativeGeometry,'3D uses the same native canvas');
    await page.getByRole('button',{name:'2D',exact:true}).click({timeout:3000});
    await page.locator('.larpbux-avatar-look img').waitFor();
    assert.deepEqual(await page.evaluate(()=>kinds),['2d','3d','2d']);
    await page.evaluate(()=>document.querySelector('.avatar-thumbnail').classList.add('slots-visible'));
    const slotsGeometry=await geometry();
    assert.equal(slotsGeometry['.avatar-thumbnail'].x,nativeGeometry['.avatar-thumbnail'].x+33,'native accessory slot inset remains active');
    assert.equal(slotsGeometry['.toggle-three-dee'].x,nativeGeometry['.toggle-three-dee'].x,'native toggle compensates for accessory slots');
    await page.screenshot({path:path.join(root,'.test-artifacts/avatar-view-toggle.png')});
    console.log('PASS: native canvas dimensions, button placement, accessory inset, and original toggle handler survive both view modes; 2D fills the frame without bands.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
