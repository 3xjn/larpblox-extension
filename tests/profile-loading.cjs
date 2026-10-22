const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1');
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html',body:`
      <a id="nav-profile" href="/users/profile"><img id="left" src="native.png"></a>
      <header><a id="navbar-avatar" href="/users/profile"><img id="right" src="native.png"></a></header>
      <a href="/users/456/profile"><img id="other" src="other.png"></a>`}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});
    await page.evaluate(() => {
      document.documentElement.dataset.larpbloxIdentityChecked='true';
      document.documentElement.dataset.larpbloxIdentityAvatar='true';
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 8;
      const ctx = canvas.getContext('2d'); ctx.fillStyle='red';ctx.fillRect(0,0,8,8);
      window.oldHead = canvas.toDataURL();ctx.fillStyle='blue';ctx.fillRect(0,0,8,8);window.oldBody=canvas.toDataURL();
      localStorage.setItem('larpblox-profile-pictures:123',JSON.stringify({version:8,key:'old-outfit',expires:Date.now()+60000,result:{headshot:oldHead,fullBody:oldBody,transparentBody:oldBody}}));
      window.LarpbloxAvatarRequests={definitionKey:JSON.stringify,render:()=>new Promise(()=>{})};
      window.delayedDefinition = () => new Promise(resolve => window.resolveDefinition=resolve);
    });
    await page.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
    await page.evaluate(() => {void LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'new-outfit',loadDefinition:delayedDefinition});});
    await page.waitForFunction(() => document.querySelector('#left').src===oldHead && document.querySelector('#right').src===oldHead,null,{timeout:1500});
    assert.equal(await page.locator('#left').evaluate(el=>getComputedStyle(el).visibility),'visible','cached portrait clears the identity loading gate');
    assert.equal(await page.locator('#other').getAttribute('src'),'other.png','never replace another account portrait');
    await page.evaluate(() => {
      const image=document.createElement('img');image.id='late';image.src='native.png';document.querySelector('#navbar-avatar').append(image);
      void LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'new-outfit',loadDefinition:delayedDefinition});
    });
    await page.waitForFunction(() => document.querySelector('#late').src===oldHead,null,{timeout:1500});
    await page.evaluate(() => LarpbloxAvatarSurfaces.update({userId:'123',active:false}));
    assert.equal(await page.locator('#left').getAttribute('src'),'native.png','turning Larp off restores Roblox portraits');
    await page.evaluate(() => {void LarpbloxAvatarSurfaces.update({userId:'789',active:true,signature:'other-account',loadDefinition:delayedDefinition});});
    assert.equal(await page.locator('#right').getAttribute('src'),'native.png','previous account cache must not leak');
    console.log('PASS: cached own portraits remain visible during delayed outfit loading, including new header nodes, with account isolation and native restoration.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
