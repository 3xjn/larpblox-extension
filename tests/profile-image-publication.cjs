const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1');

const {previewDefinition} = require('../larpbux.js');
const inheritedDefinition = previewDefinition({assets:[{id:75789087422384,assetType:{id:92}},{id:808,assetType:{id:19}}],bodyColor3s:{headColor3:'ffffff'},scales:{height:1.1},playerAvatarType:'R15'}, {}, [], 456);

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'larpbux.js'), 'utf8').replace(
  /\n\}\)\(\);\s*$/,
  '\n  globalThis.__publishPreviewImage = publishPreviewImage;\n})();',
);

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => console.error('pageerror:', error.message));
    await page.goto('https://www.roblox.com/users/123/profile');
    await page.setContent('<meta name="user-data" data-userid="123"><body></body>');
    await page.addScriptTag({content: `
      globalThis.publications = [];
      globalThis.renderedDefinitions = [];
      globalThis.LarpbloxGameBridge = {
        validateSnapshot: value => value,
        request: async (action, account, value) => {
          if (action === 'publishImage') publications.push(value.image);
          return {connected: true};
        },
      };
      globalThis.LarpbloxAvatarSurfaces = {
        update: () => {},
        characterThumbnail: async definition => {
          renderedDefinitions.push(structuredClone(definition));
          return 'https://tr.rbxcdn.com/rendered.png';
        },
      };
    `});
    await page.addScriptTag({content: source});

    const result = await page.evaluate(async inheritedDefinition => {
      const withBackground = {
        ...inheritedDefinition, bodyColors: {headColor: '#fff'}, scales: {height: 1.1},
        playerAvatarType: {playerAvatarType: 'R15'}, animation: {run: 123},
        backgroundRequestModel: {id: 456}, backgroundId: 456,
      };
      const original = structuredClone(withBackground);
      await __publishPreviewImage(withBackground, 'https://tr.rbxcdn.com/already.png', '123', undefined, undefined);
      const withoutBackground = {
        assets: [{id: 909}], bodyColors: {headColor: '#fff'}, scales: {width: 0.9},
        playerAvatarType: {playerAvatarType: 'R15'}, animation: {walk: 321},
      };
      await __publishPreviewImage(withoutBackground, 'https://tr.rbxcdn.com/existing.png', '123', undefined, undefined);
      return {
        original,
        withBackground,
        renderedDefinitions,
        publications,
      };
    }, inheritedDefinition);

    assert.deepEqual(result.withBackground, result.original, 'background publication must not mutate the browser definition');
    assert.equal(result.renderedDefinitions.length, 1, 'background publication must render a fresh thumbnail');
    assert.deepEqual(result.renderedDefinitions[0].assets, [{id: 808}], 'gear must survive background removal');
    assert.equal(result.renderedDefinitions[0].backgroundId, undefined);
    assert.equal(result.renderedDefinitions[0].backgroundRequestModel, undefined);
    assert.equal(result.publications.length, 2);
    assert.deepEqual(result.publications[0].definition.assets, [{id: 808}]);
    assert.equal(result.publications[0].definition.backgroundId, undefined);
    assert.equal(result.publications[0].definition.backgroundRequestModel, undefined);
    assert.equal(result.publications[1].imageUrl, 'https://tr.rbxcdn.com/existing.png');
    console.log('PASS: image publication strips backgrounds for rendered portraits, preserves gear and metadata, and keeps existing no-background URLs fast.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
