const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {localSocialCounts}=require('../larpbux.js');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:850}});
  let saved={mode:true,sharing:true,balance:100,appearance:'modern',socialCounts:{followers:156000,following:0},username:'Tester'};
  await page.exposeFunction('popupRequest',message=>{
   const payload=message.message;
   if(payload.type==='larpblox-popup-profile-counts')saved={...saved,socialCounts:localSocialCounts(payload.socialCounts)};
   return {ok:true,...saved};
  });
  await page.route('https://www.roblox.com/**',r=>r.fulfill({contentType:'text/html',body:'<div id="root"></div>'}));
  await page.goto('https://www.roblox.com/my/account');
  await page.evaluate(()=>{
   window.chrome={tabs:{query:async()=>[{id:1,url:location.href}]},runtime:{sendMessage:message=>window.popupRequest(message)}};
   window.LarpbloxPopupContext={ready(){},logo:'',version:'test'};
  });
  await page.addStyleTag({path:path.join(__dirname,'../assets/popup/popup.css')});
  await page.addScriptTag({path:path.join(__dirname,'../assets/popup/popup.js')});
  await page.getByRole('button',{name:'More settings'}).click();
  await page.getByLabel('Friends',{exact:true}).waitFor();
  assert.equal(await page.getByLabel('Followers',{exact:true}).inputValue(),'156000');
  assert.equal(await page.getByLabel('Friends',{exact:true}).getAttribute('max'),'1000');
  await page.getByLabel('Friends',{exact:true}).fill('1001');
  await page.getByRole('button',{name:'Save counts',exact:true}).click();
  assert.equal(saved.socialCounts.friends,undefined,'native form validation blocks values over Roblox limit');
  await page.getByLabel('Friends',{exact:true}).fill('1000');
  await page.getByRole('button',{name:'Save counts',exact:true}).click();
  await page.getByText('Profile counts saved.',{exact:true}).waitFor();
  assert.deepEqual(saved.socialCounts,{followers:156000,following:0,friends:1000});
  if(process.env.POPUP_SCREENSHOT)await page.screenshot({path:process.env.POPUP_SCREENSHOT,fullPage:true});
  await page.getByRole('button',{name:'Use Roblox counts',exact:true}).click();
  await page.getByText('Roblox counts restored.',{exact:true}).waitFor();
  assert.equal(saved.socialCounts,null);
  assert.equal(await page.getByLabel('Friends',{exact:true}).inputValue(),'');
  for(const friends of [1001,-1,0.5,true,'abc'])assert.throws(()=>localSocialCounts({followers:'1',following:'0',friends}));
  console.log('PASS: built popup saves all three counts, caps friends at1000, preserves zero, and restores Roblox counts.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
