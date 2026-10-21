const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');

(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();page.setDefaultTimeout(5000);
 await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<html class="larpblox-modern"><meta name="user-data" data-userid="123"><div id="robux-menu"></div><button class="shopping-cart-btn">Cart</button></html>'}));
 await page.route('https://economy.roblox.com/**',async r=>{
  const id=Number(new URL(r.request().url()).pathname.match(/\d+/)?.[0]);
  const items={1:{Name:'Owned Basic',AssetTypeId:41,PriceInRobux:95,IsForSale:true},2:{Name:'Unowned Free',AssetTypeId:41,PriceInRobux:0,IsForSale:true},3:{Name:'Owned Limited',AssetTypeId:41,PriceInRobux:125,IsForSale:true,IsLimited:true}};
  await r.fulfill({json:items[id]||items[2]});
 });
 await page.goto('https://www.roblox.com/catalog');
 await page.evaluate(()=>{
  localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,balance:500,items:[{id:1,itemType:'Asset',name:'Owned Basic',price:95},{id:3,itemType:'Asset',name:'Owned Limited',price:125,isLimited:true}],equipped:[],cart:[]}));
  localStorage.setItem('Roblox.AvatarMarketplace.Cart:123',JSON.stringify({items:[
   {itemId:1,itemType:'Asset',itemName:'Owned Basic'},
   {itemId:2,itemType:'Asset',itemName:'Unowned Free'},
   {itemId:3,itemType:'Asset',itemName:'Owned Limited'}
  ],selectedItems:{asset1:true,asset2:true,asset3:true},itemDetails:{1:{price:95},2:{price:0},3:{price:125}}}));
  window.realBuys=0;
  document.querySelector('.shopping-cart-btn').addEventListener('click',()=>{
   const modal=document.createElement('section');modal.className='shopping-cart-modal-container';
   modal.innerHTML='<div class="shopping-cart-items-list">'+
    '<div class="cart-item-container"><a class="item-name" href="/catalog/1/Owned-Basic">Owned Basic</a><div class="item-details-container"><span class="item-price">95</span></div><input class="input-checkbox" id="checkbox-1" type="checkbox" checked><div class="rm-item-btn-container"><button>Remove</button></div></div>'+ 
    '<div class="cart-item-container"><a class="item-name" href="/catalog/2/Unowned-Free">Unowned Free</a><div class="item-details-container"><span class="item-price">Free</span></div><input class="input-checkbox" id="checkbox-2" type="checkbox" checked><div class="rm-item-btn-container"><button>Remove</button></div></div>'+ 
    '<div class="cart-item-container"><a class="item-name" href="/catalog/3/Owned-Limited">Owned Limited</a><div class="item-details-container"><span class="item-price">125</span></div><input class="input-checkbox" id="checkbox-3" type="checkbox" checked><div class="rm-item-btn-container"><button>Remove</button></div></div>'+ 
    '</div><div class="shopping-cart-footer"><div class="cart-total-section-container"><span class="total-label">Total</span><span class="total-price-container"><span class="price-text">R$ 220</span></span></div><div class="balance-disclaimer-container"><span class="balance-disclaimer-text">Your balance: R$ 500</span></div><button disabled class="disabled">Buy</button></div>';
   modal.querySelector('.shopping-cart-footer button').addEventListener('click',()=>window.realBuys++);
   document.body.append(modal);
  });
 });
 await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});
 await page.locator('.shopping-cart-btn').click();
 const rows=page.locator('.shopping-cart-items-list .cart-item-container');await page.waitForFunction(()=>document.querySelectorAll('.shopping-cart-items-list .cart-item-container .item-owned').length>=1);
 assert.equal(await rows.count(),3);
 const owned=rows.nth(0);assert.match(await owned.locator('.item-owned').innerText(),/owned/i);assert.equal(await owned.locator('#checkbox-1').isDisabled(),true);assert.equal(await owned.locator('#checkbox-1').isChecked(),false);
 assert.equal(await owned.locator('.item-owned .item-owned-icon').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 176, 111)','owned marker uses the green check icon');
 assert.equal(await rows.nth(2).locator('.item-owned').count(),0,'limited duplicate remains a normal purchasable row');assert.equal(await rows.nth(2).locator('#checkbox-3').isDisabled(),false,'limited duplicate remains purchasable');assert.equal(await rows.nth(2).locator('#checkbox-3').isChecked(),true);
 const nativeBuy=page.locator('.shopping-cart-footer button');assert.equal(await nativeBuy.isDisabled(),false,'mixed cart can be bought');
 await rows.nth(1).locator('#checkbox-2').uncheck();await rows.nth(2).locator('#checkbox-3').uncheck();await page.waitForFunction(()=>document.querySelector('.shopping-cart-footer button').disabled);assert.equal(await nativeBuy.isDisabled(),true,'owned-only selection cannot be bought');
 await rows.nth(2).locator('#checkbox-3').check();await page.waitForFunction(()=>!document.querySelector('.shopping-cart-footer button').disabled);
 await nativeBuy.click();const limitedCart=page.getByRole('dialog',{name:'Buy Now',exact:true});await limitedCart.waitFor();assert.equal(await limitedCart.locator('.larpbux-cart-previews img').count(),1,'limited duplicate appears in confirmation');await limitedCart.getByRole('button',{name:'Cancel',exact:true}).click();
 await rows.nth(1).locator('#checkbox-2').check();await rows.nth(2).locator('#checkbox-3').uncheck();await page.waitForFunction(()=>!document.querySelector('.shopping-cart-footer button').disabled);
 await nativeBuy.click();
 const cart=page.getByRole('dialog',{name:'Buy Now',exact:true});await cart.waitFor();
 assert.equal(await cart.locator('img[alt="Unowned Free"]').count(),1);assert.equal(await cart.locator('img[alt="Owned Basic"]').count(),0);assert.equal(await cart.locator('img[alt="Owned Limited"]').count(),0);
 assert.match(await cart.innerText(),/Free|0/);assert.doesNotMatch(await cart.innerText(),/220/);
 await cart.getByRole('button',{name:/Get Now|Buy/,exact:true}).click();await page.locator('.larpbux-cart-toast').waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
 assert.equal(saved.balance,500);assert.equal(saved.items.some(i=>i.id===2),true);assert.equal(saved.cart.length,0);assert.equal(await page.evaluate(()=>window.realBuys),0);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('Roblox.AvatarMarketplace.Cart:123')).items.map(i=>i.itemId)),[1,3]);
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({...s,mode:false}));dispatchEvent(new StorageEvent('storage',{key:'larpblox-cosmetics-v1:123'}))});
 assert.equal(await owned.locator('#checkbox-1').isDisabled(),false,'native mode restores owned checkbox');assert.equal(await owned.locator('#checkbox-1').isChecked(),true);assert.equal(await owned.locator('.item-owned').count(),0);assert.equal(await owned.locator('.item-price').innerText(),'95');
 console.log('PASS: owned cart rows are free and unselectable, mixed checkout charges only unowned items, limited ownership remains valid, and native mode restores.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
