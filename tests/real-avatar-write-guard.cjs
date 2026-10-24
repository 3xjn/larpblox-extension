const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    let nativeWrites = 0, nativeReads = 0;
    await page.route('https://www.roblox.com/**', r => r.fulfill({contentType:'text/html', body:'<meta name="user-data" data-userid="123"><main id="avatar-web-app"></main>'}));
    await page.route('https://avatar.roblox.com/**', r => {
      if (['POST','PUT','PATCH'].includes(r.request().method())) nativeWrites++;
      else if (r.request().method() === 'GET') nativeReads++;
      return r.fulfill({json:{assets:[], playerAvatarType:'R15'}});
    });
    await page.goto('https://www.roblox.com/my/avatar');
    await page.evaluate(() => localStorage.setItem('larpblox-cosmetics-v1:123', JSON.stringify({mode:true, gameLook:{definition:{playerAvatarType:{playerAvatarType:'R15'}}}})));
    await page.addScriptTag({path:path.join(__dirname, '..', 'larpbux-body-colors.js')});
    await page.evaluate(() => document.addEventListener('larpblox-avatar-scales-request', event => {
      const request = JSON.parse(event.detail);
      document.dispatchEvent(new CustomEvent('larpblox-avatar-scales-response', {detail:JSON.stringify({id:request.id, ok:true})}));
    }));

    const blocked = await page.evaluate(async () => {
      const local = await fetch('https://avatar.roblox.com/v4/avatar', {method:'PATCH', body:JSON.stringify({avatarDefinition:{updateAvatarModel:{scales:{HeightScale:1.1}}}})});
      const json = body => JSON.stringify(body);
      const fetches = [];
      for (const [url, body] of [
        ['/v1/outfits/42/wear', {}],
        ['/v1/avatar/set-wearing-assets', {assetIds:[1]}],
        ['/v2/avatar/set-wearing-assets', {assetIds:[1]}],
        ['/v3/avatar/set-wearing-assets', {assetIds:[1]}],
        ['/v4/avatar', {avatarDefinition:{assets:[]}}],
        ['/v4/avatar', {avatarDefinition:{assets:[], updateAvatarModel:{bodyColors:{headColor:'#123456'}}}}],
        ['/v4/avatar', {}],
        ['/v4/avatar', {unknown:true}],
      ]) {
        const response = await fetch(`https://avatar.roblox.com${url}`, {method:url === '/v4/avatar' ? 'PATCH' : 'POST', body:json(body)});
        fetches.push([response.status, (await response.json()).errors?.[0]?.message]);
      }
      const request = await fetch(new Request('https://avatar.roblox.com/v4/avatar', {method:'PATCH', body:'not-json'}));
      const xhr = await new Promise(resolve => {
        const request = new XMLHttpRequest(); request.open('PATCH', 'https://avatar.roblox.com/v4/avatar');
        request.onload = () => resolve([request.status, request.responseText]);
        request.send(json({avatarDefinition:{assets:[{id:9}]}}));
      });
      const read = await fetch('https://avatar.roblox.com/v1/avatar');
      const wearXhr = await new Promise(resolve => { const request = new XMLHttpRequest(); request.open('POST', 'https://avatar.roblox.com/v2/outfits/42/wear'); request.onload = () => resolve(request.status); request.send('{}'); });
      return {local:local.status, fetches, request:request.status, xhr, wearXhr, read:read.status};
    });
    assert.equal(blocked.local, 200, 'supported local scale PATCH remains synthetic');
    assert.deepEqual(blocked.fetches.map(([status]) => status), [409,409,409,409,409,409,409,409]);
    assert.ok(blocked.fetches.every(([, message]) => /disabled/.test(message)));
    assert.equal(blocked.xhr[0], 409);
    assert.match(blocked.xhr[1], /disabled/);
    assert.equal(blocked.request, 409);
    assert.equal(blocked.wearXhr, 409);
    assert.equal(blocked.read, 200);
    assert.equal(nativeWrites, 0, 'Larp mode must never send real avatar writes');
    assert.equal(nativeReads, 1, 'avatar reads remain available');

    const real = await page.evaluate(async () => {
      document.querySelector('#avatar-web-app').setAttribute('data-larpbux-avatar-view', 'real');
      const response = await fetch('https://avatar.roblox.com/v1/outfits/42/wear', {method:'POST', body:'{}'});
      const xhr = await new Promise(resolve => { const request = new XMLHttpRequest(); request.open('PATCH', 'https://avatar.roblox.com/v4/avatar'); request.onload = () => resolve(request.status); request.send(JSON.stringify({avatarDefinition:{assets:[]}})); });
      return [response.status, xhr];
    });
    assert.deepEqual(real, [200, 200]);
    assert.equal(nativeWrites, 2, 'explicit Real avatar view keeps native writes available');
    console.log('PASS: Larp mode blocks outfit, legacy wearing-assets, and v4 asset writes through Fetch/XHR while reads and explicit Real view remain native.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
