const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1');

const root = path.resolve(__dirname, '../../..');
const fixture = name => path.join(__dirname, 'fixtures', 'portrait', name);
const output = path.join(root, 'artifacts', 'portrait-validation');
const descriptor = JSON.parse(fs.readFileSync(fixture('current-head-descriptor.json'), 'utf8'));
const objText = require('node:zlib').gunzipSync(fs.readFileSync(fixture('current-head.obj.gz'))).toString('utf8');
const mtlText = fs.readFileSync(fixture('current-head.mtl'), 'utf8');

function boundsForGroups(text) {
  const groups = {};
  let group = '(ungrouped)';
  const all = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity], vertices: 0 };
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith('g ')) group = line.slice(2).trim() || '(unnamed)';
    if (!line.startsWith('v ')) continue;
    const values = line.trim().split(/\s+/).slice(1, 4).map(Number);
    if (values.length !== 3 || values.some(value => !Number.isFinite(value))) continue;
    const target = groups[group] ||= { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity], vertices: 0 };
    for (let axis = 0; axis < 3; axis++) {
      target.min[axis] = Math.min(target.min[axis], values[axis]);
      target.max[axis] = Math.max(target.max[axis], values[axis]);
      all.min[axis] = Math.min(all.min[axis], values[axis]);
      all.max[axis] = Math.max(all.max[axis], values[axis]);
    }
    target.vertices++;
    all.vertices++;
  }
  return { groups, all };
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const parsed = boundsForGroups(objText);
  assert.ok(parsed.groups.Player1, 'real Roblox fixture must contain Player1');
  assert.ok(parsed.groups.Player2, 'real Roblox fixture must contain Player2');
  assert.ok(parsed.all.vertices > 10000, 'fixture must be a real avatar mesh, not a toy box');
  assert.ok(parsed.groups.Player1.max[1] > parsed.groups.Player1.min[1], 'Player1 must have a vertical extent');
  assert.ok(parsed.groups.Player2.min[1] > parsed.groups.Player1.max[1], 'Player2 must be above Player1 in the real fixture');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 420, height: 420 }, deviceScaleFactor: 1 });
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: '<body style="margin:0;background:#737373"><div id="host" style="width:420px;height:420px"></div>',
    }));
    const descriptorUrl = 'https://t2.rbxcdn.com/1DAY-Avatar-A1CC8CD9FAC673957AA029C2EBFD4759-Obj';
    await page.route(descriptorUrl, route => route.fulfill({ headers: { 'access-control-allow-origin': '*' }, json: descriptor }));
    const assetUrl = hash => {
      let shard = 31;
      for (const char of hash) shard = (shard ^ char.charCodeAt(0)) % 8;
      return `https://t${shard}.rbxcdn.com/${hash}`;
    };
    await page.route('https://t*.rbxcdn.com/**', route => {
      const url = route.request().url();
      if (url === descriptorUrl) return route.fulfill({ headers: { 'access-control-allow-origin': '*' }, json: descriptor });
      if (url === assetUrl(descriptor.obj)) return route.fulfill({ headers: { 'access-control-allow-origin': '*' }, body: objText });
      if (url === assetUrl(descriptor.mtl)) return route.fulfill({ headers: { 'access-control-allow-origin': '*' }, body: mtlText });
      return route.continue();
    });
    const bannerUrl = 'https://fts.rbxcdn.com/larpblox-background-model?encoding=gzip&__token__=signed~value';
    await page.route('https://assetdelivery.roblox.com/v2/assetId/123', route => route.fulfill({ json: { locations: [{ location: bannerUrl }] } }));
    await page.route(bannerUrl, route => route.fulfill({ headers: {'access-control-allow-origin':'*'}, contentType:'text/xml', body:fs.readFileSync(fixture('reference-background.rbxmx')) }));
    await page.route('https://assetdelivery.roblox.com/v2/assetId/131116106888557', route => route.fulfill({status:401,json:{errors:[]}}));
    await page.route('https://assetdelivery.roblox.com/v1/asset/?id=131116106888557', route => route.fulfill({contentType:'image/png',body:fs.readFileSync(fixture('reference-background.png'))}));
    await page.route('https://thumbnails.roblox.com/v1/assets**', route => route.fulfill({json:{data:[{targetId:123,state:'Completed',imageUrl:'https://tr.rbxcdn.com/square-fallback'}]}}));
    await page.route('https://tr.rbxcdn.com/square-fallback', route => route.fulfill({contentType:'image/png',body:fs.readFileSync(fixture('captured-avatar-background.png'))}));
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({ path: path.join(root, 'artifacts', 'extension-repo', 'larpbux-avatar-3d.js') });
    const captures = await page.evaluate(async url => {
      const viewer = await LarpbloxAvatar3D.create(document.querySelector('#host'), url, { static: true, definition: { backgroundRequestModel: { id: 123 } } });
      const backgroundHeadshot = viewer.capture('headshot');
      const headshot = viewer.capture('headshot', {background:false});
      const fullBody = viewer.capture('fullBody');
      const pixels = async dataUrl => {
        const image = new Image();
        image.src = dataUrl;
        await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 420;
        const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, 420, 420).data;
        let opaque = 0, red = 0, topOpaque = 420, bottomOpaque = -1;
        for (let y = 0; y < 420; y++) for (let x = 0; x < 420; x++) {
          const i = (y * 420 + x) * 4;
          if (data[i + 3] > 8) { opaque++; topOpaque = Math.min(topOpaque, y); bottomOpaque = Math.max(bottomOpaque, y); }
          if (data[i] > data[i + 1] * 1.25 && data[i] > data[i + 2] * 1.25) red++;
        }
        return { cornerAlpha: data[3], opaque, red, topOpaque, bottomOpaque };
      };
      const result = { backgroundAspect: viewer.getBackgroundAspect(), headshot, backgroundHeadshot, backgroundPixels: await pixels(backgroundHeadshot), fullBody, headshotPixels: await pixels(headshot), fullBodyPixels: await pixels(fullBody), diagnostics: viewer.getDiagnostics() };
      viewer.dispose();
      return result;
    }, descriptorUrl);
    for (const [kind, dataUrl] of Object.entries({ headshot: captures.headshot, backgroundHeadshot: captures.backgroundHeadshot, fullBody: captures.fullBody })) {
      assert.match(dataUrl, /^data:image\/png;base64,/i, `${kind} capture must be PNG`);
      fs.writeFileSync(path.join(output, `${kind}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
    }
    assert.ok(Math.abs(captures.backgroundAspect - 2560/1440)<0.0001, 'must retain original wide background rather than square catalog thumbnail');
    assert.equal(captures.headshotPixels.cornerAlpha, 0, 'explicit transparent headshot must omit the profile background');
    assert.ok(captures.backgroundPixels.opaque > captures.headshotPixels.opaque, 'default headshot must retain visible pixels from the selected background');
    assert.notEqual(captures.backgroundHeadshot, captures.headshot, 'selected background must change the rendered image');
    assert.ok(captures.headshotPixels.opaque > 1000, 'headshot must contain rendered avatar pixels');
    assert.ok(captures.headshotPixels.topOpaque < 80, 'close-up headwear must reach the upper fifth; the old distant portrait started below pixel 150');
    await page.route('https://assetdelivery.roblox.com/v2/assetId/999', route => route.fulfill({status:401,json:{errors:[]}}));
    await page.route('https://thumbnails.roblox.com/v1/assets**', route => route.fulfill({status:503,json:{errors:[]}}));
    const outage = await page.evaluate(async url => {
      const viewer = await LarpbloxAvatar3D.create(document.querySelector('#host'), url, {static:true,definition:{backgroundRequestModel:{id:999}}});
      const result=viewer.capture('headshot');viewer.dispose();return result;
    }, descriptorUrl);
    assert.ok(outage.startsWith('data:image/png'), 'background permission/network failure must never prevent avatar portraits');
    const report = {
      fixture: 'artifacts/current-head.obj',
      descriptor,
      overallBounds: parsed.all,
      groups: parsed.groups,
      rendererDiagnostics: { descriptorUrl: captures.diagnostics.descriptorUrl, camera: captures.diagnostics.descriptor.camera },
      pixelChecks: { headshot: captures.headshotPixels, fullBody: captures.fullBodyPixels },
      conclusion: 'In this real fixture Player1 is a low torso/body mesh (y=100.01..100.295); Player2 is the upper head-sized mesh (y=103.71..104.86). Selecting Player1 as the head frames the torso and leaves the profile background visible.',
    };
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`PASS: rendered real Roblox fixture; wrote ${output}\\headshot.png, fullBody.png, and report.json`);
    console.log(`Player1 y=${parsed.groups.Player1.min[1]}..${parsed.groups.Player1.max[1]}, avatar y=${parsed.all.min[1]}..${parsed.all.max[1]}`);
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
