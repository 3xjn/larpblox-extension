const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.join(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');
const websiteSources = JSON.parse(fs.readFileSync(path.join(root, 'website-sources.json'), 'utf8'));
const bundle = websiteSources.js.map(source).join('\n');

async function relay(pathname) {
  const response = await fetch(`https://larp.3xjn.dev${pathname}?userIds=2290829441`);
  assert.ok(response.ok, `relay ${pathname} must respond successfully`);
  return response.json();
}

(async () => {
  const record = process.env.LARPBLOX_LIVE_PEER ? (await relay('/v1/profiles')).players.find(player => String(player.userId) === '2290829441') : {userId:'2290829441',name:{enabled:true,username:'LarpUsername',displayName:'Larp Display Name'},snapshot:{version:1,userId:'2290829441',items:[],definition:{assets:[],bodyColors:Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(part=>[part+'Color','ffffff'])),playerAvatarType:{playerAvatarType:'R15'},scales:{}}}};
  assert.ok(record?.name?.enabled, 'peer must share a display name');

  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const exceptions = [];
  const messages = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => exceptions.push(error.stack || error.message));
    await page.addInitScript(({bundle, record}) => {
      window.__larpbloxMessages = []; window.__startedBeforeRoot = !document.documentElement;
      window.LarpbloxExtension = {
        sendMessage: async message => {
          window.__larpbloxMessages.push(message);
          if (message.type === 'larpblox-shared-users') {
            return {ok: true, data: {players: message.userIds.includes('2290829441') ? [record] : []}};
          }
          if (message.type === 'larpblox-search-users') return {ok: true, data: {players: []}};
          if (message.type === 'larpblox-publish-profile') return {ok: true};
          if (message.type === 'larpblox-game-bridge') return {ok: false};
          return {ok: true};
        }
      };
      // This is the extension's document_start payload: every website source runs
      // before Roblox's response body is parsed.
      const run = new Function(bundle);
      run();
    }, {bundle, record});
    await page.on('console', message => messages.push(`${message.type()}: ${message.text()}`));
    await page.route('https://www.roblox.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><head><meta name="user-data" data-userid="999"></head><body>
        <div id="header"><a href="/users/profile">LmaoImTheBest1</a></div>
        <main id="rbx-private-home">
          <div class="friends-carousel-tile">
            <a class="avatar-card-link" href="/users/2290829441/profile">
              <div class="avatar-card-image"><img src="native.png"></div>
            </a>
            <div class="friends-carousel-tile-labels"><span class="friends-carousel-display-name">LmaoImTheBest1</span></div>
            <div class="avatar-status"><img src="status.png"></div>
          </div>
        </main>
      </body></html>`
    }));
    await page.goto('https://www.roblox.com/home', {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(name => document.querySelector('.friends-carousel-display-name')?.textContent === name, record.name.displayName, {timeout: 5000});
    assert.equal(await page.locator('.friends-carousel-display-name').textContent(), record.name.displayName);
    assert.equal(await page.evaluate(()=>window.__startedBeforeRoot),true,'must exercise startup before the document element exists');
    assert.equal(await page.locator('.avatar-status img').getAttribute('src'), 'status.png');
    const requestTypes = await page.evaluate(() => window.__larpbloxMessages.map(message => message.type));
    assert.ok(requestTypes.includes('larpblox-shared-users'), `shared-user request missing: ${requestTypes.join(', ')}`);
    assert.deepEqual(exceptions, [], `full document_start bundle threw: ${exceptions.join('\n')}`);
    console.log('PASS: full document_start website bundle resolves live peer 2290829441 from native Home markup.');
  } catch (error) {
    console.error('FULL-BUNDLE DIAGNOSTIC FAILURE');
    console.error(error.message);
    if (exceptions?.length) console.error(`PAGE EXCEPTIONS:\n${exceptions.join('\n')}`);
    if (messages?.length) console.error(`CONSOLE:\n${messages.join('\n')}`);
    throw error;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
