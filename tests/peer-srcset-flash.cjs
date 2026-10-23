const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="999"><div class="friends-carousel-tile"><a href="/users/123/profile"><span class="avatar-card-image"><img src="native.png"></span><span class="friends-carousel-display-name">Native</span></a><div class="avatar-status">Online</div></div>'}));
    await page.goto('https://www.roblox.com/home');
    await page.addStyleTag({content:fs.readFileSync(path.join(__dirname,'../larpbux.css'),'utf8')});
    await page.evaluate(() => {
      window.LarpbloxGameBridge={validateSnapshot(value){return value;}};
      window.LarpbloxExtension={sendMessage:async()=>({ok:true,data:{players:[{userId:'123',name:{enabled:true,username:'larp',displayName:'Larp Display'},snapshot:{definition:{}} }]}})};
      window.LarpbloxAvatarSurfaces={createForPeer(){return {update(){const image=document.querySelector('.avatar-card-image img'); image.src='larp.png'; image.removeAttribute('srcset'); image.dataset.larpbloxPeerAvatar='larp.png';},reset(){}};}};
    });
    await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'../identity-gate.js'),'utf8')});
    let shared=fs.readFileSync(path.join(__dirname,'../larpbux-shared-users.js'),'utf8');
    if(process.env.REPRO_OLD_SRCSET) shared=shared.replace("!image.getAttribute('srcset') && ",'');
    await page.addScriptTag({content:shared});
    await page.evaluate(()=>LarpbloxSharedUsers.update({userId:'999',mode:false}));
    await page.waitForFunction(()=>document.querySelector('.friends-carousel-tile').dataset.larpbloxPeerAvatarReady==='true');
    // React can restore its responsive source without changing the fallback src.
    // Hold the next animation frame so the immediate protection is checked first.
    const visibility=await page.evaluate(async()=>{
      window.requestAnimationFrame=()=>0;
      document.querySelector('.avatar-card-image img').setAttribute('srcset','native-restored.png 2x');
      await new Promise(resolve=>setTimeout(resolve,0));
      return getComputedStyle(document.querySelector('.avatar-card-image img')).visibility;
    });
    assert.equal(visibility,'hidden','a native responsive image must stay hidden before the replacement pass');
    assert.equal(await page.locator('.avatar-status').evaluate(n=>getComputedStyle(n).visibility),'visible');
    console.log('PASS: native responsive source is hidden immediately while presence stays visible');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
