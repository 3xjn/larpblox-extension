const assert = require('node:assert/strict');
const path = require('node:path');
process.env.NODE_PATH = [path.resolve(__dirname, '..', 'node_modules'), process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
require('node:module').Module._initPaths();
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2Nk+M/wHwAF/gL+H2Or0wAAAABJRU5ErkJggg==', 'base64');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    const page = await browser.newPage();
    const obj = ['o Handle','v -1 0 0','v 1 0 0','v 0 2 0','vt 0 0','vt 1 0','vt .5 1','usemtl smokestack','f 1/1 2/2 3/3'].join('\n');
    const mtl = 'newmtl smokestack\nmap_Kd atlas-hash\n';
    const mesh = Buffer.alloc(13 + 12 + 3 * 40 + 12);
    mesh.write('version 2.00\n'); mesh.writeUInt16LE(12,13); mesh[15]=40; mesh[16]=12;
    mesh.writeUInt32LE(3,17); mesh.writeUInt32LE(1,21);
    [[-1,0,0,0,0],[1,0,0,1,0],[0,2,0,.5,1]].forEach((v,i) => {
      v.slice(0,3).forEach((n,j) => mesh.writeFloatLE(n,25+i*40+j*4));
      v.slice(3).forEach((n,j) => mesh.writeFloatLE(n,25+i*40+24+j*4));
    });
    [0,1,2].forEach((n,i)=>mesh.writeUInt32LE(n,145+i*4));
    await page.route('**/*', async route => {
      const url = route.request().url();
      const id = url.match(/assetdelivery\.roblox\.com\/v2\/assetId\/(\d+)/)?.[1];
      if (id) return route.fulfill({json:{locations:[{location:`https://t0.rbxcdn.com/${id === '6991140417' ? 'normal-hash' : id}`}]},headers:{'access-control-allow-origin':'null','access-control-allow-credentials':'true'}});
      if (url.endsWith('/descriptor')) return route.fulfill({contentType:'application/json', body:JSON.stringify({obj:'obj',mtl:'mtl',textures:['normal-hash']})});
      if (url.endsWith('/2399307491')) return route.fulfill({body:mesh,headers:{'access-control-allow-origin':'*'}});
      if (url.endsWith('/atlas-hash')) return route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64'),headers:{'access-control-allow-origin':'*'}});
      if (url.endsWith('/obj')) return route.fulfill({body:obj});
      if (url.endsWith('/mtl')) return route.fulfill({body:mtl});
      const name = url.split('/').pop().split('?')[0];
      if (name === 'normal-hash' || /^\d+$/.test(name)) {
        if (name === '2399448372') await new Promise(resolve => setTimeout(resolve, 100));
        return route.fulfill({contentType:'image/png', body:image, headers:{'access-control-allow-origin':'*'}});
      }
      return route.continue();
    });
    await page.setContent('<div id="host" style="width:300px;height:300px"></div>');
    await page.addScriptTag({path:path.resolve(__dirname,'../larpbux-avatar-3d.js')});
    await page.evaluate(async () => {
      window.viewer = await window.LarpbloxAvatar3D.create(document.querySelector('#host'), 'https://t0.rbxcdn.com/descriptor', {static:true, definition:{assets:[{id:169444515,meta:{smokestackStyle:'christmas'}}]}});
    });
    assert.equal(await page.evaluate(() => viewer.getDiagnostics().smokestack.season), 'christmas', 'saved season applies before any thumbnail capture or profile display');
    let state = await page.evaluate(async () => { await viewer.setHatStyle('halloween'); return viewer.getDiagnostics().smokestack; });
    assert.equal(state.season, 'halloween'); assert.match(state.textures[0], /6991166143/);
    state = await page.evaluate(async () => { const older = viewer.setHatStyle('valentines'); await new Promise(resolve => setTimeout(resolve, 20)); await Promise.all([older, viewer.setHatStyle('halloween')]); return viewer.getDiagnostics().smokestack; });
    assert.equal(state.season, 'halloween', 'latest rapid selection wins');
    state = await page.evaluate(async () => { await viewer.setHatStyle('aprilfools'); return viewer.getDiagnostics().smokestack; });
    assert.equal(state.visible[0], false, 'April hides the matched hat only');
    state = await page.evaluate(async () => { await viewer.setHatStyle('normal'); return viewer.getDiagnostics().smokestack; });
    assert.equal(state.visible[0], true); assert.match(state.textures[0], /6991140417|normal-hash/);
    const unchanged = await page.evaluate(async () => { const before = viewer.getDiagnostics().smokestack.textures[0]; await viewer.setHatStyle('normal'); return before === viewer.getDiagnostics().smokestack.textures[0]; });
    assert.equal(unchanged, true, 'same selected style is a no-op');
    console.log('PASS: browser renderer changes Smokestack textures, latest selection wins, April restores, and repeat styles do not rebuild.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
