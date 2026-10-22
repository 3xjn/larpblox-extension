const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:/Users/noahk/.bun/install/cache/playwright-core@1.64.1@@@1';
const {chromium} = require(playwrightPath);

(async () => {
  const server = http.createServer((request, response) => { response.writeHead(200, {'content-type': 'text/html'}); response.end('<!doctype html><main></main>'); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try {
  const page = await browser.newPage();
  const surfaces = fs.readFileSync(path.join(__dirname, '..', 'larpbux-avatar-surfaces.js'), 'utf8');
  const characters = fs.readFileSync(path.join(__dirname, '..', 'larpbux-characters.js'), 'utf8');
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(() => { document.querySelector('main').innerHTML = '<div id="avatar-web-app"><div class="breadcrumb">Creations</div><ul class="items-list avatar-item-list"><li class="item-card"><div>Native</div></li></ul></div><div class="avatar-headshot" data-user-id="42"><img></div>'; });
  await page.evaluate(() => {
    window.__renderCalls = [];
    window.LarpbloxAvatarRequests = {
      definitionKey: definition => JSON.stringify(definition),
      cached: (definition, userId, type) => type === '2d' ? 'https://tr.rbxcdn.com/plain-hat.png' : undefined,
      render: async (definition, userId, signal, type) => {
        window.__renderCalls.push({type, style: definition.assets.find(asset => Number(asset.id) === 169444515)?.meta?.smokestackStyle});
        return `descriptor-${type}`;
      },
    };
    window.LarpbloxAvatar3D = {
      create: async (host, descriptor, options) => ({
        capture: kind => 'data:image/png;base64,' + btoa((options.definition.assets[0].id === 1055299 ? 'teapot' : options.definition.assets[0].meta.smokestackStyle) + ':' + kind),
        getBackgroundUrl: () => undefined,
        getBackgroundAspect: () => 1,
        dispose: () => {},
      }),
    };
  });
  await page.addScriptTag({content: surfaces});
  const result = await page.evaluate(async () => {
    const definition = {assets: [{id: 169444515, meta: {smokestackStyle: 'christmas'}}], bodyColors: {}, playerAvatarType: {playerAvatarType: 'R15'}};
    const thumbnail = await LarpbloxAvatarSurfaces.characterThumbnail(definition, '42', new AbortController().signal);
    await LarpbloxAvatarSurfaces.update({userId: '42', active: true, signature: 'christmas', loadDefinition: async () => definition});
    for (let i = 0; i < 40 && !document.querySelector('.avatar-headshot img').src.startsWith('data:image/png'); i++) await new Promise(resolve => setTimeout(resolve, 25));
    return {thumbnail, image: document.querySelector('.avatar-headshot img').src, calls: window.__renderCalls};
  });
  assert.match(result.thumbnail, /^data:image\/png/);
  assert.match(result.image, /^data:image\/png/);
  assert.ok(result.calls.length >= 2);
  assert.ok(result.calls.every(call => call.type === '3d'), result.calls);
  assert.ok(result.calls.every(call => call.style === 'christmas'), result.calls);
  const changedImage = await page.evaluate(async () => {
    const definition = {assets:[{id:169444515,meta:{smokestackStyle:'halloween'}}]};
    await LarpbloxAvatarSurfaces.update({userId:'42',active:true,signature:'halloween',loadDefinition:async()=>definition});
    return document.querySelector('.avatar-headshot img').src;
  });
  assert.notEqual(changedImage, result.image, 'season changes replace the profile portrait');
  assert.equal(Buffer.from(changedImage.split(',')[1], 'base64').toString(), 'halloween:headshot');

  const teapot = await page.evaluate(async () => {
    window.__renderCalls = [];
    const definition = {assets:[{id:1055299}]};
    localStorage.setItem('larpblox-profile-pictures:42', JSON.stringify({version:8,key:JSON.stringify(definition),expires:Date.now()+60000,result:{headshot:'data:image/png;base64,old-head',fullBody:'data:image/png;base64,old-body',transparentBody:'data:image/png;base64,old-body'}}));
    const thumbnail = await LarpbloxAvatarSurfaces.characterThumbnail(definition,'42',new AbortController().signal);
    await LarpbloxAvatarSurfaces.update({userId:'42',active:true,signature:'teapot',loadDefinition:async()=>definition});
    return {thumbnail, image:document.querySelector('.avatar-headshot img').src, calls:window.__renderCalls};
  });
  assert.equal(Buffer.from(teapot.thumbnail.split(',')[1],'base64').toString(),'teapot:fullBody');
  assert.equal(Buffer.from(teapot.image.split(',')[1],'base64').toString(),'teapot:headshot','old captures without the teapot must be regenerated');
  assert.ok(teapot.calls.every(call=>call.type === '3d'),'Teapot thumbnails and portraits need the repaired 3D model');

  await page.evaluate(() => {
    const snapshot = {version: 1, userId: '42', definition: {assets: [{id: 169444515, meta: {smokestackStyle: 'christmas'}}]}, items: []};
    localStorage.setItem('larpblox-characters-v1:42', JSON.stringify({profiles: [{id: 'season', name: 'Christmas', snapshot, thumbnail: 'data:image/png;base64,old'}, {id:'teapot',name:'Teapot',snapshot:{...snapshot,definition:{assets:[{id:1055299}]}},thumbnail:'data:image/png;base64,old-teapot',thumbnailVersion:2}]}));
    window.__characterOptions = {editor: document.querySelector('#avatar-web-app'), userId: '42', active: true, thumbnail: async () => 'data:image/png;base64,new'};
  });
  await page.addScriptTag({content: characters});
  await page.evaluate(() => LarpbloxCharacters.update(window.__characterOptions));
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('larpblox-characters-v1:42')).profiles.every(profile=>profile.thumbnail === 'data:image/png;base64,new'));
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('larpblox-characters-v1:42')));
  assert.equal(saved.profiles[0].thumbnail, 'data:image/png;base64,new');
  assert.equal(saved.profiles[0].thumbnailVersion, 2);
  assert.equal(saved.profiles[1].thumbnailVersion, 3, 'old Teapot cards get repaired captures');
  assert.equal(saved.profiles[0].snapshot.definition.assets[0].meta.smokestackStyle, 'christmas');
  console.log('PASS: seasonal character thumbnails use 3D captures, update own portraits, and migrate stale cards while retaining season metadata.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
