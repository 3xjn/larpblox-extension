const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const {chromium}=require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:1100,height:500}});
await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<style>body{margin:0}.profile-avatar-left{width:970px;height:300px;background-color:#333}img{display:none}</style><div class="currently-wearing-avatar-with-background"><div class="profile-avatar-left"><img class="avatar-card-image" src="native.png"></div></div>'}));
await page.goto('https://www.roblox.com/users/123/profile');
await page.evaluate(()=>{const definition={assets:[]};const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';localStorage.setItem('larpblox-profile-pictures:123',JSON.stringify({version:5,key:JSON.stringify(definition),expires:Date.now()+60000,result:{headshot:png+'#head',fullBody:png,transparentBody:png,backgroundUrl:'https://t0.rbxcdn.com/test-background',backgroundAspect:2560/1440}}));window.LarpbloxAvatarRequests={definitionKey:JSON.stringify,render:async()=>{throw new Error('offline')}};});
await page.route('https://t0.rbxcdn.com/test-background',r=>r.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(__dirname,'fixtures/portrait/reference-background.png'))}));
await page.addScriptTag({path:path.join(__dirname,'../larpbux-avatar-surfaces.js')});
await page.evaluate(()=>LarpbloxAvatarSurfaces.update({userId:'123',active:true,signature:'banner',loadDefinition:async()=>({assets:[]})}));
const banner=page.locator('.profile-avatar-left');
for(const width of [970,600,320]){
 await banner.evaluate((el,w)=>el.style.width=w+'px',width);
 const actual=await banner.screenshot();
 const style=await banner.evaluate(el=>({size:getComputedStyle(el).backgroundSize,position:getComputedStyle(el).backgroundPosition}));
 assert.equal(style.size,'auto 250%', 'banner must use the exact Roblox sizing without minimum-width stretching');
 assert.equal(style.position,'50% 64%');
 await banner.evaluate(el=>el.style.setProperty('background-size','auto 250%','important'));
 const native=await banner.screenshot();
 assert.deepEqual(actual,native,'rendered banner must match Roblox CSS at width '+width);
 fs.mkdirSync(path.join(__dirname,'../.test-artifacts/banner'),{recursive:true});
 fs.writeFileSync(path.join(__dirname,'../.test-artifacts/banner/banner-'+width+'.png'),actual);
}
console.log('PASS: rendered banners match Roblox auto 250% sizing at 970, 600, and 320 pixels.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
