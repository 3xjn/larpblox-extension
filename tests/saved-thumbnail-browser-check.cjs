const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();
 await page.route('https://t1.rbxcdn.com/expired.png',r=>r.fulfill({status:404,body:'expired'}));
 await page.route('https://www.roblox.com/my/avatar',r=>r.fulfill({contentType:'text/html',body:'<main id="avatar-web-app"><div class="breadcrumb-container">Avatars Creations</div><div class="items-list avatar-item-list"></div></main>'}));
 await page.goto('https://www.roblox.com/my/avatar');
 await page.evaluate(()=>localStorage.setItem('larpblox-characters-v1:123',JSON.stringify({profiles:[1,2,3].map(id=>({id:String(id),name:'Fit '+id,snapshot:{id}}))})));
 await page.addScriptTag({path:path.join(__dirname,'../larpbux-characters.js')});
 await page.evaluate(()=>{
 window.calls=0;window.active=0;window.maxActive=0;window.picks=[];
 window.options={editor:document.querySelector('main'),userId:123,active:true,apply:snapshot=>window.picks.push(snapshot.id),thumbnail:async snapshot=>{
 window.calls++;window.active++;window.maxActive=Math.max(window.maxActive,window.active);
 await new Promise(resolve=>setTimeout(resolve,40));window.active--;
 if(window.calls===1){const error=new Error('429');error.retryAfter=.01;throw error;}
 return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
 }};LarpbloxCharacters.update(window.options);
 });
 await page.getByRole('button',{name:'Wear Fit 2',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>window.picks),[2],'equipping works while thumbnails are rate limited');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('larpblox-characters-v1:123')).profiles.every(p=>p.thumbnail));
 assert.equal(await page.evaluate(()=>window.maxActive),1,'saved thumbnails render sequentially');
 assert.equal(await page.evaluate(()=>window.calls),4,'rate-limited thumbnail retries successfully');
 await page.evaluate(()=>{LarpbloxCharacters.update({});LarpbloxCharacters.update(window.options)});
 assert.equal(await page.evaluate(()=>window.calls),4,'cached saved images do not render again on reopening Creations');
 await page.evaluate(()=>{
   LarpbloxCharacters.update({});
   localStorage.setItem('larpblox-characters-v1:123',JSON.stringify({profiles:[{id:'expired',name:'Expired picture',snapshot:{id:4},thumbnail:'https://t1.rbxcdn.com/expired.png'}]}));
   LarpbloxCharacters.update(window.options);
 });
 await page.waitForFunction(()=>{
   const image=document.querySelector('.larpbux-character-card img');
   return image?.complete && image.naturalWidth>0;
 });
 assert.equal(await page.evaluate(()=>window.calls),5,'a broken saved URL regenerates once through the serial queue');
 assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-characters-v1:123')).profiles[0].thumbnail.startsWith('data:')),'broken saved URL is replaced in storage');
 await page.evaluate(()=>{
   LarpbloxCharacters.update({});window.failedRenders=0;
   localStorage.setItem('larpblox-characters-v1:123',JSON.stringify({profiles:[{id:'unavailable',name:'Unavailable picture',snapshot:{id:5},thumbnail:'https://t1.rbxcdn.com/expired.png'}]}));
   LarpbloxCharacters.update({...window.options,thumbnail:async()=>{window.failedRenders++;return 'https://t1.rbxcdn.com/expired.png';}});
 });
 await page.getByText('Picture unavailable. You can still wear this outfit.',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.failedRenders),1,'recovery of an invalid image cannot loop');
 assert.equal(await page.locator('.larpbux-character-card img').evaluate(image=>getComputedStyle(image).visibility),'hidden','broken alternate text is not displayed as an avatar');
 await page.getByRole('button',{name:'Wear Unavailable picture',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>window.picks),[2,5],'missing pictures do not block wearing saved outfits');
 console.log('Saved thumbnails recover broken URLs, bound retries, serialize renders, and keep outfits wearable.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
