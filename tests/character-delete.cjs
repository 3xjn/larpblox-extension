const assert=require('node:assert/strict');const path=require('node:path');const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:900,height:600}});
await page.goto('https://example.com');
await page.setContent('<html class="larpblox-modern"><body style="background:#111"><main id="avatar-web-app"><div class="breadcrumb">Avatars Creations</div><ul class="items-list avatar-item-list"></ul></main></body></html>');
await page.evaluate(()=>{localStorage.setItem('larpblox-characters-v1:123',JSON.stringify({profiles:[{id:'one',name:'My outfit',snapshot:{old:true},thumbnail:'https://example.com/old.png'}]}));window.captures=0;window.fail=false;window.options={editor:document.querySelector('main'),userId:'123',active:true,capture:async()=>{captures++;if(fail)throw Error('Try again');return {updated:true}},apply:async()=>{}}});
await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});await page.addScriptTag({path:path.join(__dirname,'../larpbux-characters.js')});await page.evaluate(()=>LarpbloxCharacters.update(options));
const open=async()=>{await page.getByRole('button',{name:'Manage My outfit'}).click();await page.locator('.larpbux-character-menu').getByRole('button',{name:'Delete',exact:true}).click()};
await open();const dialog=page.getByRole('dialog',{name:'Delete Character',exact:true});await dialog.waitFor();
assert.equal(await page.evaluate(()=>captures),0);
await dialog.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.evaluate(()=>captures),0);
await open();await dialog.getByRole('button',{name:'Close',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-characters-v1:123')).profiles.length),1);
await open();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-characters-v1:123')).profiles.length),1);
await open();await page.screenshot({path:path.join(__dirname,'../../delete-character-preview.png')});
await dialog.getByRole('button',{name:'Delete',exact:true}).click();await dialog.waitFor({state:'detached'});
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-characters-v1:123')).profiles.length),0);assert.equal(await page.evaluate(()=>captures),0);
console.log('PASS: Delete dialog requires confirmation; Cancel, close, and Escape preserve the avatar; confirmation removes only the saved character.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
