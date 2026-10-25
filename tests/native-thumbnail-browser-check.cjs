const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage();
  let requests = [], listCalls = 0;
  await page.route('https://www.roblox.com/my/avatar', r => r.fulfill({contentType:'text/html',body:`<meta data-userid="123"><main id="avatar-web-app"><div class="breadcrumb-container">Avatars Creations</div><div class="items-list avatar-item-list"></div></main>`}));
  await page.route('https://cdn.test/**', r => r.request().url().includes('working') || r.request().url().includes('repaired') ? r.fulfill({contentType:'image/png',body:png}) : r.fulfill({status:404,body:'broken'}));
  await page.route('https://avatar.roblox.com/v1/users/123/outfits*', r => {
   listCalls++;return r.fulfill({json:{data:[{id:201,name:'Duplicate'},{id:202,name:'Duplicate'},{id:203,name:'Unique'}]}});
  });
  await page.route('https://thumbnails.roblox.com/v1/users/outfits*', r => {
   const ids = new URL(r.request().url()).searchParams.get('userOutfitIds').split(',');requests.push(ids);
   if (requests.length === 1) return r.fulfill({status:429,headers:{'Retry-After':'0'},json:{}});
   return r.fulfill({json:{data:ids.map(id=>({targetId:Number(id),state:requests.length===2?'Pending':'Completed',imageUrl:requests.length===2?null:`https://cdn.test/repaired-${id}.png`}))}});
  });
  await page.goto('https://www.roblox.com/my/avatar');
  await page.evaluate(() => {
   const list=document.querySelector('.items-list');
   for (const [id,name,src] of [['101','Broken','broken'],['102','Working','working'],['','Duplicate','duplicate'],['','Unique','unique'],['104','Also broken','also-broken']]) {
    const card=document.createElement('article');card.className='item-card';if(id)card.dataset.outfitId=id;
    card.innerHTML=`<div class="item-card-thumb"><img alt="${name}" src="https://cdn.test/${src}.png"></div><span class="item-card-name-link">${name}</span><button class="native-gear">Manage</button>`;list.append(card);
   }
  });
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  await page.addScriptTag({path:path.join(__dirname,'../larpbux-native-thumbnails.js')});
  await page.waitForFunction(()=>[...document.images].filter(i=>i.naturalWidth>0).length===4);
  assert.equal(requests.length,3,'429 then Pending recover with bounded retries');
  assert.deepEqual([...requests[0]].sort(),['101','104','203'],'broken cards are batched and matched to exact or unique outfits');
  assert.equal(listCalls,1,'name fallback shares one outfit-list request');
  assert.equal(await page.locator('[data-outfit-id="102"] img').getAttribute('src'),'https://cdn.test/working.png','working picture untouched');
  assert.equal(await page.locator('.native-gear').count(),5,'menu controls preserved');
  const duplicate=page.locator('.item-card').filter({has:page.getByText('Duplicate',{exact:true})});
  assert.equal(await duplicate.locator('img').getAttribute('src'),'https://cdn.test/duplicate.png','duplicate names are never guessed');
  await duplicate.getByText('Thumbnail unavailable.',{exact:true}).waitFor();
  // A bad replacement must stop, rather than requesting forever after each image error.
  const before=requests.length;
  await page.unroute('https://thumbnails.roblox.com/v1/users/outfits*');
  await page.route('https://thumbnails.roblox.com/v1/users/outfits*',r=>{requests.push(['105']);return r.fulfill({json:{data:[{targetId:105,state:'Completed',imageUrl:'https://cdn.test/still-broken.png'}]}})});
  await page.evaluate(()=>{
   const card=document.createElement('article');card.className='item-card';card.dataset.outfitId='105';card.innerHTML='<div class="item-card-thumb"><img src="https://cdn.test/broken-105.png"></div><span class="item-card-name-link">Unavailable</span>';document.querySelector('.items-list').append(card);
  });
  await page.locator('[data-outfit-id="105"]').getByText('Thumbnail unavailable.',{exact:true}).waitFor();
  await page.waitForTimeout(400);
  assert.equal(requests.length,before+1,'bad replacement cannot trigger endless retries');
  assert.equal(await page.locator('[data-outfit-id="105"] img').evaluate(i=>getComputedStyle(i).visibility),'hidden','broken image text stays hidden');
  // Reused DOM nodes can recover for the next outfit without applying the old outfit.
  await page.unroute('https://thumbnails.roblox.com/v1/users/outfits*');
  await page.route('https://thumbnails.roblox.com/v1/users/outfits*',r=>r.fulfill({json:{data:[{targetId:106,state:'Completed',imageUrl:'https://cdn.test/repaired-106.png'}]}}));
  await page.evaluate(()=>{const card=document.querySelector('[data-outfit-id="105"]');card.dataset.outfitId='106';card.querySelector('.item-card-name-link').textContent='Reused';card.querySelector('img').src='https://cdn.test/broken-106.png';});
  await page.waitForFunction(()=>document.querySelector('[data-outfit-id="106"] img').naturalWidth>0);
  assert.equal(await page.locator('[data-outfit-id="106"] img').evaluate(i=>getComputedStyle(i).visibility),'visible','reused image is revealed after recovery');
  console.log('Native broken thumbnails recover in batches; rate limits, Pending, duplicate names, bad images, and recycled cards pass.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
