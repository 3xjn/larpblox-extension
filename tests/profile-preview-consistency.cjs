const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const root = path.resolve(__dirname,'..');

(async()=>{
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1100,height:760}});
    await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:`
      <meta name="user-data" data-userid="123"><style>
      .profile-avatar-left{position:relative;width:720px;height:280px;background:#ccc}
      .profile-avatar-left .avatar-card-image{display:block;width:280px;height:280px;margin:auto}
      .profile-avatar-left img{width:100%;height:100%} .user-profile-header-details-avatar-container{width:80px;height:80px}
      .user-profile-header-details-avatar-container img{width:100%;height:100%}
      .avatar-toggle-button{position:absolute;right:10px;top:10px;z-index:10}
      </style><div class="profile-platform-container"><div>
      <div class="currently-wearing-avatar-with-background" style="position:relative;width:720px">
        <div class="profile-avatar-left"><span class="avatar-card-image" id="native-preview"><img src="native.png"></span></div>
        <div class="avatar-toggle-button"><button>3D</button></div>
      </div><div class="user-profile-header-details-avatar-container"><div class="avatar"><span class="avatar-card-image"><img id="portrait" src="native.png"></span></div></div>
      <div class="profile-content"><h2>Friends</h2></div></div></div>`}));
    await page.route('https://economy.roblox.com/**',r=>r.fulfill({json:{Name:'Shared Hat',AssetTypeId:8,IsForSale:false}}));
    await page.route('https://thumbnails.roblox.com/**',r=>r.fulfill({json:{data:[]}}));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.evaluate(()=>{
      document.documentElement.classList.add('larpblox-modern');
      const item={id:808,itemType:'Asset',assetType:8,name:'Shared Hat',assetTypeVerified:true,limitedVerified:true};
      const bodyColors=Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part=>[`${part}Color`,'#ffffff']));
      const definition={assets:[{id:808}],bodyColors,scales:{},playerAvatarType:{playerAvatarType:'R15'}};
      window.definition=definition; window.fail=true; window.renderCount=0;
      const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#18b45d';ctx.fillRect(8,3,16,26);
      window.photo=canvas.toDataURL('image/png');
      localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,items:[item],equipped:['Asset:808'],gameLook:{version:1,userId:'123',items:[item],definition}}));
      window.LarpbloxAvatarRequests={cached:()=>photo,render:async()=>{renderCount++;if(fail)throw Object.assign(new Error('Avatar render failed (429).'),{status:429,retryAfter:0});return 'descriptor';}};
      window.LarpbloxAvatar3D={create:async host=>{const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','3D avatar preview');host.append(canvas);return {capture:()=>photo,dispose(){canvas.remove();}};}};
      document.querySelector('.avatar-toggle-button button').onclick=event=>{
        const button=event.currentTarget, host=document.querySelector('#native-preview');
        host.replaceChildren(document.createElement(button.textContent==='3D'?'canvas':'img'));
        button.textContent=button.textContent==='3D'?'2D':'3D';
      };
    });
    for(const file of ['larpbux-game-bridge.js','identity-gate.js','larpbux-avatar-surfaces.js','larpbux-profile-wearing.js','larpbux.js']) await page.addScriptTag({path:path.join(root,file)});
    await page.addStyleTag({path:path.join(root,'larpbux.css')});
    await page.waitForFunction(()=>document.querySelector('#portrait').src.startsWith('data:image/png'));
    assert.equal(await page.locator('#portrait').evaluate(el=>getComputedStyle(el).visibility),'visible');
    await page.locator('.larpbux-currently-wearing [data-larp-asset-id="808"]').waitFor();
    await page.getByRole('button',{name:'3D',exact:true}).click();
    await page.locator('.larpblox-own-profile-preview img').waitFor();
    assert.equal(await page.locator('.larpblox-own-profile-preview img').evaluate(el=>getComputedStyle(el).visibility),'visible');
    await page.evaluate(()=>window.fail=false);
    await page.locator('.larpblox-own-profile-preview canvas').waitFor({timeout:12000});
    assert.equal(await page.locator('.larpblox-profile-preview-status').count(),0);
    await page.getByRole('button',{name:'2D',exact:true}).click();
    await page.waitForFunction(()=>!document.querySelector('.larpblox-own-profile-preview'));
    await page.waitForFunction(()=>document.querySelector('#native-preview img')?.src.startsWith('data:image/png'));
    const ownerItems=await page.locator('.larpbux-currently-wearing [data-larp-asset-id]').evaluateAll(items=>items.map(i=>i.dataset.larpAssetId));
    assert.deepEqual(ownerItems,['808']);
    assert.ok(await page.evaluate(()=>localStorage.getItem('larpblox-profile-pictures:123')));
    // The same implementation renders the shared snapshot for another viewer.
    const peer = await browser.newPage();
    await peer.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<section class="profile-currently-wearing"><div class="profile-carousel"><div class="item-card">Native outfit</div></div></section>'}));
    await peer.route('https://economy.roblox.com/**',r=>r.fulfill({json:{Name:'Shared Hat',AssetTypeId:8,IsForSale:false}}));
    await peer.goto('https://www.roblox.com/users/123/profile');
    for(const file of ['larpbux-game-bridge.js','larpbux-profile-wearing.js']) await peer.addScriptTag({path:path.join(root,file)});
    await peer.evaluate(definition=>{
      window.LarpbloxAvatarSurfaces={createForPeer:()=>({update(){}})};
      window.LarpbloxExtension={sendMessage:async()=>({ok:true,data:{players:[{userId:'123',snapshot:{version:1,userId:'123',items:[],definition}}]}})};
    },await page.evaluate(()=>definition));
    await peer.addScriptTag({path:path.join(root,'larpbux-shared-users.js')});
    await peer.evaluate(()=>LarpbloxSharedUsers.update({userId:'456',mode:true,thumbnail:()=>{}}));
    await peer.locator('.larpbux-currently-wearing [data-larp-asset-id="808"]').waitFor();
    assert.deepEqual(await peer.locator('.larpbux-currently-wearing [data-larp-asset-id]').evaluateAll(items=>items.map(i=>i.dataset.larpAssetId)),ownerItems);
    await peer.evaluate(()=>LarpbloxSharedUsers.update({userId:'456',mode:false}));
    await peer.waitForFunction(()=>!document.querySelector('.larpbux-currently-wearing'));
    assert.equal(await peer.getByText('Native outfit').isVisible(),true);
    console.log('PASS: cached profile remains visible during a 429, 3D recovers, both toggle directions work, and owner/peer show identical equipped assets.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
