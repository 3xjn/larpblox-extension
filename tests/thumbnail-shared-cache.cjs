const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const context=await browser.newContext();let calls=0;const limited=[],pending=[];
  await context.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"><div class="breadcrumb">Accessories Head</div><ul class="items-list avatar-item-list"></ul></main>'}));
  await context.route('https://tr.rbxcdn.com/**',r=>r.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=','base64')}));
  await context.route('https://thumbnails.roblox.com/**',async r=>{
   calls++;const ids=new URL(r.request().url()).searchParams.get('assetIds').split(',').map(Number);
   const headers={'Access-Control-Allow-Origin':'https://www.roblox.com','Access-Control-Allow-Credentials':'true','Access-Control-Expose-Headers':'Retry-After'};
   if(ids.includes(99)){limited.push(Date.now());if(limited.length===1)return r.fulfill({status:429,headers:{...headers,'retry-after':'1'},body:'{}'});}
   if(ids.includes(77)){pending.push(Date.now());if(pending.length===1)return r.fulfill({headers,json:{data:[{targetId:77,state:'Pending'}]}});}
   await new Promise(resolve=>setTimeout(resolve,100));
   return r.fulfill({headers,json:{data:ids.map(targetId=>({targetId,state:'Completed',imageUrl:'https://tr.rbxcdn.com/'+targetId+'.png'}))}});
  });
  const load=async(page,ids)=>{
   await page.goto('https://www.roblox.com/my/avatar');
   await page.evaluate(ids=>{
    localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,items:ids.map(id=>({id,itemType:'Asset',assetType:8,name:'Hat '+id,assetTypeVerified:true,limitedVerified:true})),equipped:[]}));
    const fetchNative=fetch;window.credentials=[];window.fetch=(url,options)=>{if(String(url).includes('thumbnails.roblox.com'))credentials.push(options.credentials);return fetchNative(url,options)};
    window.LarpbloxAvatarRequests={retryAfter:r=>Number(r.headers.get('retry-after'))};
   },ids);
   await page.addScriptTag({path:path.join(root,'larpbux.js')});
  };
  const pages=await Promise.all([context.newPage(),context.newPage()]);
  await Promise.all(pages.map(p=>load(p,[11,12,13])));
  for(const p of pages)await p.waitForFunction(()=>[...document.querySelectorAll('.larpbux-avatar-item img')].length===3 && [...document.querySelectorAll('.larpbux-avatar-item img')].every(i=>i.naturalWidth));
  assert.equal(calls,1,'two tabs must reuse one thumbnail batch');
  assert.deepEqual((await Promise.all(pages.map(p=>p.evaluate(()=>credentials)))).flat(),['include']);
  const warm=await context.newPage();await load(warm,[11,12,13]);
  await warm.waitForFunction(()=>document.querySelectorAll('.larpbux-avatar-item img').length===3 && [...document.querySelectorAll('.larpbux-avatar-item img')].every(i=>i.naturalWidth));
  assert.equal(calls,1,'reopening the editor must use saved thumbnail URLs');
  await Promise.all(pages.map(p=>load(p,[77])));
  for(const p of pages)await p.waitForFunction(()=>document.querySelector('.larpbux-avatar-item img')?.naturalWidth>0);
  assert.equal(pending.length,2,'pending thumbnails must share a delayed retry');
  assert.ok(pending[1]-pending[0]>=950,'another tab must not immediately retry a pending thumbnail');
  await Promise.all(pages.map(p=>load(p,[99])));
  for(const p of pages)await p.waitForFunction(()=>document.querySelector('.larpbux-avatar-item img')?.naturalWidth>0);
  assert.equal(limited.length,2,'one limited request and one shared retry');
  assert.ok(limited[1]-limited[0]>=950,'another tab must observe the same cooldown');
  console.log('PASS: signed-in thumbnail requests, cross-tab batch reuse, persistent cache, and shared pending/429 recovery.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
