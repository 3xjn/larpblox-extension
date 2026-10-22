const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();
 await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123" data-name="Duncan5783" data-displayname="Spooky Turtle"><main><h2>Account info</h2><div><b>Name:</b> <span>Spooky Turtle</span><button>Edit</button></div><div><b>Username:</b> <span>Duncan5783</span><button>Edit</button></div><input value="Duncan5783"></main>'}));
 await page.goto('https://www.roblox.com/my/account#!/info');
 await page.addScriptTag({path:path.join(__dirname,'..','larpbux-names.js')});
 const update=mode=>page.evaluate(mode=>LarpbloxNames.update({userId:'123',mode,username:'CurrentAlias'}),mode);
 await update(true);
 assert.deepEqual(await page.locator('main span').allTextContents(),['CurrentAlias','CurrentAlias']);
 assert.equal(await page.locator('input').inputValue(),'Duncan5783');
 assert.deepEqual(await page.locator('b').allTextContents(),['Name:','Username:']);
 await page.locator('main span').first().evaluate(el=>el.textContent='Spooky Turtle');await update(true);
 assert.equal(await page.locator('main span').first().textContent(),'CurrentAlias');
 await update(false);assert.deepEqual(await page.locator('main span').allTextContents(),['Spooky Turtle','Duncan5783']);
 await page.evaluate(()=>LarpbloxNames.update({userId:'123',mode:true,username:'CurrentAlias',displayName:'Separate Display'}));
 assert.deepEqual(await page.locator('main span').allTextContents(),['Separate Display','CurrentAlias']);
 await page.evaluate(()=>{
  history.pushState({},'', '/users/123/profile');
  document.querySelector('main').innerHTML='<h1 class="profile-header-title">Spooky Turtle</h1><span class="profile-header-username">@Duncan5783</span>';
  localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,names:{username:'CurrentAlias',displayName:'Separate Display'}}));
  LarpbloxNames.update({userId:'123',mode:true,username:'CurrentAlias',displayName:'Separate Display'});
 });
 await page.addScriptTag({path:path.join(__dirname,'..','identity-gate.js')});
 assert.equal(await page.locator('h1').textContent(),'Separate Display');
 assert.equal(await page.locator('.profile-header-username').textContent(),'@CurrentAlias');
 assert.equal(await page.locator('h1').getAttribute('data-larpblox-alias-ready'),'true');
 await update(false);
 assert.equal(await page.locator('h1').textContent(),'Spooky Turtle');
 assert.equal(await page.locator('.profile-header-username').textContent(),'@Duncan5783');
 for (const names of [{username:'',displayName:'Display Only'},{username:''}]) {
  await page.evaluate(names=>{
   localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,names}));
   LarpbloxNames.update({userId:'123',mode:true,...names});LarpbloxIdentityGate.update();
  },names);
  assert.equal(await page.locator('h1').textContent(),names.displayName || 'Spooky Turtle');
  assert.equal(await page.locator('.profile-header-username').textContent(),'@Duncan5783');
  assert.equal(await page.locator('.profile-header-username').getAttribute('data-larpblox-alias-ready'),'true');
  assert.equal(await page.locator('h1').getAttribute('data-larpblox-alias-ready'),'true');
 }
 console.log('PASS: Account Info without legacy IDs shows both aliases, survives rerender, restores real names, and preserves labels and inputs.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
