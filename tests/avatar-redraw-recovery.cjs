const assert=require('node:assert/strict');const path=require('node:path');const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="avatar-thumbnail"><canvas></canvas><button class="toggle-three-dee">2D</button></div><button class="redraw-link">Redraw</button></main>'}));
 await page.goto('https://www.roblox.com/my/avatar');
 await page.evaluate(()=>{
  const definition={assets:[],bodyColors:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(p=>[p+'Color','ffffff'])),scales:{},playerAvatarType:{playerAvatarType:'R15'}};
  localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,items:[],equipped:[],gameLook:{version:1,userId:'123',definition,items:[]}}));
  window.renders=0;window.nativeRedraws=0;window.fail=true;
  const c=document.createElement('canvas');c.width=c.height=10;window.photo=c.toDataURL();
  document.querySelector('.redraw-link').onclick=()=>nativeRedraws++;
  window.LarpbloxAvatarRequests={render:async()=>{renders++;if(fail)throw Object.assign(new Error('Avatar render failed (429).'),{status:429,retryAfter:120});return photo}};
  window.LarpbloxAvatar3D={create:async host=>{host.append(document.createElement('canvas'));return {dispose(){}}}};
 });
 await page.addScriptTag({path:path.join(__dirname,'../larpbux-game-bridge.js')});
 await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});
 await page.getByRole('status').waitFor();assert.match(await page.getByRole('status').innerText(),/limiting avatar requests/);
 assert.equal(await page.locator('.larpbux-avatar-look').isVisible(),true,'rate limits must not leave an unexplained empty frame');
 await page.evaluate(()=>fail=false);await page.getByRole('button',{name:'Redraw',exact:true}).click();
 await page.locator('.larpbux-avatar-look canvas').waitFor();
 assert.equal(await page.evaluate(()=>nativeRedraws),0,'Larp Redraw must not submit a real-account redraw');
 assert.equal(await page.getByRole('status').count(),0);
 await page.evaluate(()=>{const key='larpblox-cosmetics-v1:123',s=JSON.parse(localStorage.getItem(key));s.mode=false;localStorage.setItem(key,JSON.stringify(s));dispatchEvent(new StorageEvent('storage',{key}));});
 await page.getByRole('button',{name:'Redraw',exact:true}).click();assert.equal(await page.evaluate(()=>nativeRedraws),1,'real mode preserves the native callback');
 console.log('PASS: visible rate-limit state, Larp redraw recovery, and untouched native redraw in real mode.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
