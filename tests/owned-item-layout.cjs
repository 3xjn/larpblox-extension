const assert=require('node:assert/strict');const path=require('node:path');const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{const page=await browser.newPage();await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<meta name="user-data" data-userid="123"><div id="item-details-container" class="item-name-container item-details-info-header"><h1>ROBLOX Jacket</h1><div id="item-details-creator-container" class="item-details-creator-container" style="border-bottom:1px solid #494b5a;padding-bottom:12px"><span>By Roblox</span></div><div id="item-details"><div class="price-row-container"><span class="item-price-value">7</span><div class="item-purchase-btns-container"><button>Buy</button></div></div><p>Tradable　No</p><p>Type　Classic Shirts</p></div></div>'}));await page.route('https://thumbnails.roblox.com/**',r=>r.fulfill({json:{data:[]}}));await page.goto('https://www.roblox.com/catalog/22/Jacket');await page.evaluate(()=>{document.documentElement.classList.add('larpblox-modern');window.LarpbloxAppearance={get:()=> 'modern'};localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,balance:1000,items:[{id:22,itemType:'Asset',assetType:11,name:'ROBLOX Jacket'}],equipped:[]}))});await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});await page.addStyleTag({content:'body{background:#111216;color:white;font:16px Arial}#item-details-container{width:514px;margin:40px}h1{font-size:32px;margin:0 0 12px}.item-details-creator-container{padding-bottom:12px}'});await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});await page.locator('.larpbux-single-owned').waitFor();
// Native rules captured from Roblox ItemDetails.css, ItemDetailsInfo.css and StyleGuide.css.
await page.addStyleTag({content:`
.item-details-info-header .item-details-creator-container{align-items:center;column-gap:5px;display:flex}
.icon-checkmark-white-bold{vertical-align:middle;background-image:url(https://images.rbxcdn.com/3ebc87949bc669c2.svg);background-repeat:no-repeat;display:inline-block}
.item-name-container .label-checkmark{vertical-align:text-bottom;color:#fff;background-color:#02b757;border-radius:50%;margin-left:12px;margin-right:6px;padding:3px;font-size:10px;font-weight:400;line-height:1em;display:inline-block}
.item-name-container .label-checkmark .icon-checkmark-white-bold{background-position:0 -516px;background-size:24px;width:12px;height:12px}
@media(max-width:767px){.item-name-container .label-checkmark{margin-left:3px}}
`});
for (const width of [1280,390]) {
 await page.setViewportSize({width,height:900});
 const metrics=await page.evaluate(()=>{
  const creator=document.querySelector('#item-details-creator-container');
  const reference=creator.cloneNode(true);reference.id='native-reference';
  reference.querySelector('.larpbux-owned-count').classList.remove('larpbux-owned-count');
  creator.after(reference);
  const measure=row=>{const rect=row.getBoundingClientRect();const owned=row.querySelector('.item-owned');const icon=row.querySelector('.icon-checkmark-white-bold');const badge=icon.parentElement;const r=owned.getBoundingClientRect();const i=icon.getBoundingClientRect();const css=getComputedStyle(icon);return {x:r.x-rect.x,y:r.y-rect.y,width:r.width,height:r.height,iconWidth:i.width,iconHeight:i.height,sprite:css.backgroundImage,position:css.backgroundPosition,margin:getComputedStyle(badge).marginLeft,color:getComputedStyle(badge).backgroundColor}};
  const result={actual:measure(creator),native:measure(reference)};reference.remove();return result;
 });
 assert.deepEqual(metrics.actual,metrics.native,'ownership must match native badge geometry at '+width+'px');
 assert.equal(metrics.actual.margin,width>767?'12px':'3px');
 assert.equal(metrics.actual.color,'rgb(2, 183, 87)');
 assert.equal(metrics.actual.position,'0px -516px');
}
await page.setViewportSize({width:1280,height:900});
assert.equal(await page.locator('.larpbux-owned-count').textContent(),'Item Owned');
assert.equal(await page.locator('#item-details-creator-container .larpbux-owned-count').count(),1);
assert.equal(await page.locator('.larpbux-owned-count.item-owned > .label-checkmark > .icon-checkmark-white-bold').count(),1,'use the exact native item-details icon markup');
assert.equal(await page.locator('.larpbux-owned-count').evaluate(e=>getComputedStyle(e,'::before').content),'none','do not draw a font checkmark');
const creatorText=await page.locator('#item-details-creator-container > span').first().boundingBox();const ownedText=await page.locator('.larpbux-owned-count').boundingBox();assert.ok(Math.abs(creatorText.y-ownedText.y)<3,'Item Owned must share the creator line');
assert.equal(await page.locator('.price-row-container').evaluate(e=>getComputedStyle(e).borderTopWidth),'0px','do not add a second divider');assert.equal(await page.locator('.larpbux-classic-buy').isVisible(),false);assert.equal(await page.locator('.larpbux-add-cart').isVisible(),false);assert.equal(await page.locator('.item-price-value').isVisible(),false);assert.equal(await page.locator('.larpbux-owned-notice').textContent(),'This item is available in your inventory.');
assert.equal((await page.locator('.larpbux-owned-notice').boundingBox()).x,(await page.locator('.price-row-container').boundingBox()).x,'inventory message must align with the left edge instead of the price column');
const link=page.getByRole('link',{name:'Customize Character'});assert.match(await link.getAttribute('href'),/my\/avatar/);const box=await link.boundingBox();assert.equal(box.width,48);assert.equal(box.height,48);assert.equal(await link.locator('svg').count(),1);
await page.locator('#item-details-container').screenshot({path:path.join(__dirname,'../../owned-item-preview.png')});
await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));s.items[0].isLimited=true;s.items[0].quantity=2;localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify(s));window.dispatchEvent(new StorageEvent('storage',{key:'larpblox-cosmetics-v1:123'}));});
await page.waitForFunction(()=>document.querySelector('.larpbux-owned-count')?.textContent==='Owned Items (2)');assert.equal(await page.locator('.larpbux-classic-buy').isVisible(),true);assert.equal(await page.locator('.larpbux-add-cart').isVisible(),true);assert.equal(await page.locator('.larpbux-owned-notice').isVisible(),false);
console.log('PASS: ordinary owned items show the ownership label and inventory action; limiteds retain repeat purchases.');}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
