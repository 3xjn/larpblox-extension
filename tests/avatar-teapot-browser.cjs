const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try { playwright=require('playwright'); } catch (_) { playwright=require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const {chromium} = playwright;

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true, args:['--enable-unsafe-swiftshader']});
  try {
    const page = await browser.newPage({viewport:{width:600,height:600}, deviceScaleFactor:1});
    const root = path.join(__dirname, 'fixtures', 'portrait');
    const mesh = fs.readFileSync(path.join(root, 'teapot-1045320.mesh'));
    const texture = fs.readFileSync(path.join(root, 'teapot-1055256.gif'));
    const calls = {mesh:0, texture:0};
    const cors = {'Access-Control-Allow-Origin':'https://www.roblox.com', 'Access-Control-Allow-Credentials':'true'};
    const descriptor = {obj:'https://tr.rbxcdn.com/teapot-test.obj', mtl:'https://tr.rbxcdn.com/teapot-test.mtl', textures:[], camera:{fov:35,position:{x:0,y:1,z:8},direction:{x:0,y:0,z:-1}}};
    const obj = 'o Head\nv -0.5 0 0\nv 0.5 0 0\nv 0 2 0\nusemtl avatar\nf 1 2 3\n';
    const mtl = 'newmtl avatar\nKd 1 1 1\n';
    await page.route('https://www.roblox.com/**', route => route.fulfill({contentType:'text/html', body:'<div id="preview" style="width:420px;height:420px"></div>'}));
    await page.route('https://assetdelivery.roblox.com/v2/assetId/**', route => {
      const id = route.request().url().split('/').pop();
      const location = id === '1045320' ? 'https://tr.rbxcdn.com/teapot-1045320.mesh' : 'https://tr.rbxcdn.com/teapot-1055256.gif';
      route.fulfill({headers: cors, json:{locations:[{location}]}});
    });
    await page.route('https://tr.rbxcdn.com/**', route => {
      const url = route.request().url();
      if (url.endsWith('/teapot-1045320.mesh')) { calls.mesh++; return route.fulfill({headers: cors, contentType:'application/octet-stream', body:mesh}); }
      if (url.endsWith('/teapot-1055256.gif')) { calls.texture++; return route.fulfill({headers: cors, contentType:'image/gif', body:texture}); }
      if (url.endsWith('/teapot-test.obj')) return route.fulfill({headers: cors, contentType:'text/plain', body:obj});
      if (url.endsWith('/teapot-test.mtl')) return route.fulfill({headers: cors, contentType:'text/plain', body:mtl});
      return route.continue();
    });
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({path:path.join(process.env.EXTENSION_ROOT || path.join(__dirname,'..'), 'larpbux-avatar-3d.js')});
    const create = async definition => page.evaluate(async definition => {
      window.viewer?.dispose();
      window.viewer = await LarpbloxAvatar3D.create(document.querySelector('#preview'), 'https://tr.rbxcdn.com/teapot-test-descriptor', {definition, static:true});
      return window.viewer.getDiagnostics();
    }, definition);
    await page.route('https://tr.rbxcdn.com/teapot-test-descriptor', route => route.fulfill({headers: cors, json:descriptor}));
    const without = await create({assets:[]});
    assert.equal(Boolean(without.teapot?.present), false, 'avatars without the Teapot do not receive fallback geometry');
    assert.deepEqual(calls, {mesh:0, texture:0}, 'avatars without the Teapot do not request its assets');
    const baselinePixels = await page.evaluate(async () => {
      const image = new Image(); image.src = window.viewer.capture('headshot', {background:false}); await image.decode();
      const c = document.createElement('canvas'); c.width = c.height = 420; const g = c.getContext('2d'); g.drawImage(image,0,0);
      return [...g.getImageData(0,0,420,420).data].reduce((count, value, index) => count + (index % 4 === 3 && value ? 1 : 0), 0);
    });
    const withTeapot = await create({assets:[{id:1055299}], scales:{head:1}});
    assert.equal(Boolean(withTeapot.teapot?.present), true, 'Teapot fallback is attached to the scene');
    assert.equal(calls.mesh, 1); assert.equal(calls.texture, 1);
    assert.ok(Math.abs(withTeapot.teapot.position[1] - 1.75) < .05, 'attachment uses head top minus Y offset');
    assert.ok(Math.abs(withTeapot.teapot.position[2] + .1) < .05, 'attachment uses negative Z offset');
    const alpha = await page.evaluate(async () => {
      const image = new Image(); image.src = window.viewer.capture('headshot', {background:false}); await image.decode();
      const c = document.createElement('canvas'); c.width = c.height = 420; const g = c.getContext('2d'); g.drawImage(image,0,0);
      const data = g.getImageData(0,0,420,420).data;
      let count = 0; for (let i = 3; i < data.length; i += 4) if (data[i]) count++;
      return count;
    });
    assert.ok(alpha > baselinePixels * 1.05, 'captured Teapot preview adds visible pixels beyond the base avatar');
    await page.evaluate(() => window.viewer.dispose());
    console.log('PASS: browser renderer loads the real Teapot mesh and texture, places it at the head attachment, and skips requests when absent.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
