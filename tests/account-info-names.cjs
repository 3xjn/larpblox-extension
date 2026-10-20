const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();
 await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-name="Duncan5783" data-displayname="Spooky Turtle"><main><h2>Account info</h2><div><b>Name:</b> <span>Spooky Turtle</span><button>Edit</button></div><div><b>Username:</b> <span>Duncan5783</span><button>Edit</button></div><input value="Duncan5783"></main>'}));
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
 console.log('PASS: Account Info without legacy IDs shows both aliases, survives rerender, restores real names, and preserves labels and inputs.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
