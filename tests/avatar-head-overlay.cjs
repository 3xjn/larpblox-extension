const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const panelNames = ['blank-overlay', 'face-overlay', 'partial-overlay', 'blank-cutout', 'hidden-overlay'];
const obj = [
  'o DynamicHead',
  ...panelNames.flatMap((_, index) => {
    const left = index - 2.5;
    return [`v ${left} 0 0`, `v ${left + 0.9} 0 0`, `v ${left + 0.9} 1 0`, `v ${left} 1 0`];
  }),
  ...panelNames.flatMap(() => ['vt 0 0', 'vt 1 0', 'vt 1 1', 'vt 0 1']),
  ...panelNames.flatMap((name, index) => [
    `usemtl ${name}`,
    `f ${index * 4 + 1}/${index * 4 + 1} ${index * 4 + 2}/${index * 4 + 2} ${index * 4 + 3}/${index * 4 + 3} ${index * 4 + 4}/${index * 4 + 4}`,
  ]),
].join('\n');

const mtl = `
newmtl blank-overlay
Kd 0 1 0
map_Kd https://tr.rbxcdn.com/blank.svg
rbx_alphamode overlay
newmtl face-overlay
Kd 0 1 0
map_Kd https://tr.rbxcdn.com/face.svg
rbx_alphamode overlay
newmtl partial-overlay
Kd 0 1 0
map_Kd https://tr.rbxcdn.com/partial.svg
rbx_alphamode overlay
newmtl blank-cutout
Kd 0 1 0
map_Kd https://tr.rbxcdn.com/blank.svg
newmtl hidden-overlay
Kd 0 1 0
d 0
map_Kd https://tr.rbxcdn.com/face.svg
rbx_alphamode overlay
`;

const svg = (color, opacity = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2" fill="${color}" fill-opacity="${opacity}"/></svg>`;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 300 }, deviceScaleFactor: 1 });
    await page.route('https://www.roblox.com/**', route => route.fulfill({ contentType: 'text/html', body: '<div id="preview" style="width:900px;height:300px"></div>' }));
    await page.route('https://tr.rbxcdn.com/**', route => {
      const name = new URL(route.request().url()).pathname.split('/').pop();
      if (name === 'descriptor') return route.fulfill({
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json',
        json: { obj: 'https://tr.rbxcdn.com/model.obj', mtl: 'https://tr.rbxcdn.com/model.mtl', textures: [], camera: { fov: 35, position: { x: 0, y: 0.5, z: 8 }, direction: { x: 0, y: 0, z: -1 } } },
      });
      const bodies = { 'model.obj': obj, 'model.mtl': mtl, 'blank.svg': svg('#ff0000', 0), 'face.svg': svg('#ff0000'), 'partial.svg': svg('#ff0000', 0.5) };
      const body = bodies[name];
      if (body === undefined) return route.abort();
      return route.fulfill({ headers: { 'Access-Control-Allow-Origin': '*' }, contentType: name.endsWith('.svg') ? 'image/svg+xml' : 'text/plain', body });
    });
    await page.goto('https://www.roblox.com/my/avatar');
    await page.addScriptTag({ path: process.env.RENDERER_BUNDLE || path.join(root, 'larpbux-avatar-3d.js') });
    await page.evaluate(async () => {
      window.viewer = await LarpbloxAvatar3D.create(document.querySelector('#preview'), 'https://tr.rbxcdn.com/descriptor', { static: true });
    });
    const pixels = await page.evaluate(() => {
      window.viewer.capture();
      const canvas = document.querySelector('#preview canvas');
      const image = new Image();
      image.src = canvas.toDataURL('image/png');
      return new Promise((resolve, reject) => {
        image.onload = () => {
          const copy = document.createElement('canvas');
          copy.width = image.width; copy.height = image.height;
          const context = copy.getContext('2d'); context.drawImage(image, 0, 0);
          const y = Math.floor(copy.height / 2);
          const scale = 300 / (16 * Math.tan(35 * Math.PI / 360));
          const centers = [0, 1, 2, 3, 4].map(index => Math.round(450 + (index - 2.05) * scale));
          resolve(centers.map(x => Array.from(context.getImageData(x, y, 1, 1).data)));
        };
        image.onerror = reject;
      });
    });
    assert.ok(pixels[0][1] > 150 && pixels[0][3] > 200, 'blank dynamic-head overlay keeps the green Kd skin visible');
    assert.ok(pixels[1][0] > 150 && pixels[1][1] < 100 && pixels[1][3] > 200, 'opaque dynamic-head face overlay keeps its own color');
    assert.ok(pixels[2][0] > 50 && pixels[2][1] > 50 && pixels[2][3] > 200, 'partial dynamic-head face overlay blends with Kd skin');
    assert.equal(pixels[3][3], 0, 'transparent non-overlay materials remain cut out');
    assert.equal(pixels[4][3], 0, 'intentional opacity zero remains invisible');
    await page.evaluate(() => viewer.dispose());
    console.log('PASS: dynamic-head overlay alpha preserves blank skin, blends face pixels, and keeps ordinary cutouts/opacity zero invisible.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
