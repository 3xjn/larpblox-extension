const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();page.setDefaultTimeout(5000);
 await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<html class="larpblox-modern"><meta name="user-data" data-userid="123"><div id="robux-menu"></div><button class="shopping-cart-btn">Cart</button><main><div class="item-card"><a href="/catalog/1234/Hair">Hair</a><button id="add">Add</button></div></main></html>'}));
 await page.route('https://economy.roblox.com/**',r=>r.fulfill({json:{Name:'Hair',AssetTypeId:41,PriceInRobux:95,IsForSale:true}}));
 await page.goto('https://www.roblox.com/catalog');
 await page.evaluate(()=>{
  localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({mode:true,balance:1000,items:[],equipped:[],cart:[]}));
  window.nativeAdds=0;window.realBuys=0;
  document.querySelector('#add').addEventListener('click',()=>{
   window.nativeAdds++;
   localStorage.setItem('Roblox.AvatarMarketplace.Cart:123',JSON.stringify({items:[{itemId:1234,itemType:'Asset',itemName:'Hair'},{itemId:5678,itemType:'Asset',itemName:'Unchecked item'}],selectedItems:{asset1234:true,asset5678:false},itemDetails:{1234:{price:95},5678:{price:200}}}));
  });
  document.querySelector('.shopping-cart-btn').addEventListener('click',()=>{
   const modal=document.createElement('section');modal.className='shopping-cart-modal-container';
   modal.innerHTML='<div class="shopping-cart-items-list"><div class="cart-item-container"><a class="item-name" href="/catalog/1234/Hair">Hair</a><div class="rm-item-btn-container"><button>Remove</button></div></div></div><div class="shopping-cart-footer"><button disabled class="disabled">Buy</button></div>';
   modal.querySelector('.shopping-cart-footer button').addEventListener('click',()=>window.realBuys++);
   modal.querySelector('.rm-item-btn-container button').addEventListener('click',()=>modal.querySelector('.cart-item-container').remove());
   document.body.append(modal);
  });
 });
 await page.addStyleTag({path:path.join(__dirname,'../larpbux.css')});await page.addScriptTag({path:path.join(__dirname,'../larpbux.js')});
 await page.locator('#add').click();assert.equal(await page.evaluate(()=>window.nativeAdds),1,'Add must reach Roblox cart handler');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('Roblox.AvatarMarketplace.Cart:123')).items.length),2);
 await page.locator('.shopping-cart-btn').click();
 const nativeBuy=page.locator('.shopping-cart-footer button');await page.waitForFunction(()=>!document.querySelector('.shopping-cart-footer button').disabled);
 await nativeBuy.click();
 const cart=page.getByRole('dialog',{name:'Buy Now',exact:true});await cart.waitFor();
 assert.equal(await cart.locator('img[alt="Hair"]').count(),1);assert.equal(await cart.locator('img[alt="Unchecked item"]').count(),0);
 await cart.getByRole('button',{name:'Buy',exact:true}).click();
 await page.locator('.larpbux-cart-toast').waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123')));
 assert.equal(saved.balance,905);assert.equal(saved.items[0].id,1234);assert.equal(saved.cart.length,0);assert.equal(await page.evaluate(()=>window.realBuys),0);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('Roblox.AvatarMarketplace.Cart:123')).items.map(i=>i.itemId)),[5678]);
 assert.equal(await page.locator('.cart-item-container').count(),0,'purchased native row is removed through its normal handler');
 assert.equal(await cart.count(),0);
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('larpblox-cosmetics-v1:123'));localStorage.setItem('larpblox-cosmetics-v1:123',JSON.stringify({...s,mode:false}));dispatchEvent(new StorageEvent('storage',{key:'larpblox-cosmetics-v1:123'}))});
 assert.equal(await nativeBuy.isDisabled(),true,'restore native balance-disabled button outside Larp mode');
 await page.locator('#add').click();assert.equal(await page.evaluate(()=>window.nativeAdds),2);
 console.log('PASS: Add populates native cart; selected checkout spends only Larp balance; purchased rows clear, unchecked items stay, real-mode controls restore.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
