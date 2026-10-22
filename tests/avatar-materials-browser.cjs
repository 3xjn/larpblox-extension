const assert = require('node:assert/strict');
const path = require('node:path');
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (_) { playwright = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1'); }
const { chromium } = playwright;

const root = path.resolve(__dirname, '..');
const obj = [
  'o MaterialFixture',
  'v -1.9 0 0', 'v -0.1 0 0', 'v -0.1 1.8 0', 'v -1.9 1.8 0',
  'v 0.1 0 0', 'v 1.9 0 0', 'v 1.9 1.8 0', 'v 0.1 1.8 0',
  'vt 0 0', 'vt 1 0', 'vt 1 1', 'vt 0 1',
  'usemtl bucket-accessory', 'f 1/1 2/2 3/3 4/4',
  'usemtl ordinary-cutout', 'f 5/1 6/2 7/3 8/4',
].join('\n');
const mtl = `
newmtl bucket-accessory
Kd .64 .64 .64
map_Kd https://a.rbxcdn.com/bucket.png
map_d https://b.rbxcdn.com/bucket.png?alias=1
newmtl ordinary-cutout
Kd 1 1 1
map_Kd https://a.rbxcdn.com/cutout.png
map_d https://a.rbxcdn.com/cutout-mask.png
`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="2" height="1">${body}</svg>`;
const bucket = svg('<rect width="1" height="1" fill="#f00"/><rect x="1" width="1" height="1" fill="#000"/>');
const cutout = svg('<rect width="2" height="1" fill="#0f0"/>');
const mask = svg('<rect width="1" height="1" fill="#fff"/><rect x="1" width="1" height="1" fill="#000"/>');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 600, height: 300 }, deviceScaleFactor: 1 });
    await page.route('https://www.roblox.com/**', route => route.fulfill({ contentType: 'text/html', body: '<div id="preview" style="width:600px;height:300px"></div>' }));
    await page.route('https://a.rbxcdn.com/**', route => {
      const name = new URL(route.request().url()).pathname.split('/').pop();
      const body = { 'bucket.png': bucket, 'cutout.png': cutout, 'cutout-mask.png': mask }[name];
      return route.fulfill({ headers: { 'Access-Control-Allow-Origin': '*' }, contentType: 'image/svg+xml', body });
    });
    await page.route('https://b.rbxcdn.com/**', route => route.fulfill({ headers: { 'Access-Control-Allow-Origin': '*' }, contentType: 'image/svg+xml', body: bucket }));
    await page.route('https://tr.rbxcdn.com/**', route => {
      const name = new URL(route.request().url()).pathname.split('/').pop();
      const body = { descriptor: JSON.stringify({ obj: 'https://tr.rbxcdn.com/model.obj', mtl: 'https://tr.rbxcdn.com/model.mtl', textures: [], camera: { fov: 35, position: { x: 0, y: .9, z: 8 }, direction: { x: 0, y: 0, z: -1 } } }), 'model.obj': obj, 'model.mtl': mtl }[name];
      return route.fulfill({ headers: { 'Access-Control-Allow-Origin': '*' }, contentType: name === 'descriptor' ? 'application/json' : 'text/plain', body });
    });
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({ path: process.env.RENDERER_BUNDLE || path.join(root, 'larpbux-avatar-3d.js') });
    await page.evaluate(async () => { window.viewer = await LarpbloxAvatar3D.create(document.querySelector('#preview'), 'https://tr.rbxcdn.com/descriptor', { static: true }); });
    const pixels = await page.evaluate(() => new Promise((resolve, reject) => {
      viewer.capture(); const canvas = document.querySelector('#preview canvas');
      const image = new Image(); image.src = canvas.toDataURL('image/png');
      image.onload = () => { const copy = document.createElement('canvas'); copy.width = image.width; copy.height = image.height;
        const ctx = copy.getContext('2d'); ctx.drawImage(image, 0, 0); const y = Math.floor(copy.height / 2);
        resolve([225, 275, 400, 475].map(x => Array.from(ctx.getImageData(x, y, 1, 1).data))); };
      image.onerror = reject;
    }));
    assert.ok(pixels[0][0] > 100 && pixels[0][0] < 220 && pixels[0][3] > 200, 'accessory keeps its red Kd tint');
    assert.ok(pixels[1][3] > 200 && pixels[1][0] < 100, 'accessory black pixels stay opaque');
    assert.ok(pixels[2][1] > 100 && pixels[2][3] > 40, 'ordinary cutout keeps masked pixels');
    assert.equal(pixels[3][3], 0, 'ordinary cutout keeps transparent pixels');
    await page.evaluate(() => viewer.dispose());
    console.log('PASS: accessory Kd tint and aliased diffuse alpha preserve red/black pixels while ordinary cutouts remain transparent.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
