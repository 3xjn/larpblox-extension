const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class XHR extends EventTarget {
  open(method, url) { this.method = method; this.url = url; this.readyState = 1; }
  send() { XHR.native++; }
  abort() {}
}
XHR.native = 0;
const document = new EventTarget();
document.documentElement = {classList:{contains: value => value === 'larpblox-pretend-mode'}};
document.body = {dataset:{userId:'123'}};
document.querySelector = selector => selector === '#avatar-web-app' ? {getAttribute: () => 'larp'} : null;
let nativeFetches = 0;
const nativeFetch = async () => { nativeFetches++; return new Response('{}', {status: 200}); };
const context = {document, location:{origin:'https://www.roblox.com', href:'https://www.roblox.com/my/avatar', pathname:'/my/avatar'}, XMLHttpRequest:XHR, fetch:nativeFetch, navigator:{}, console, setTimeout, clearTimeout, URL, Request, Response, Blob, FormData, DOMException, CustomEvent, Event, ProgressEvent:Event, AbortController};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'larpbux-body-colors.js'), 'utf8'), context);

const request = (type, payload) => new Promise((resolve, reject) => {
  const onRequest = event => {
    const value = JSON.parse(event.detail);
    assert.equal(value.userId, '123');
    if (type === 'scales') {
      assert.deepEqual(value.scales, payload.scales);
      assert.deepEqual(value.colors, payload.colors);
    }
    document.removeEventListener(event.type, onRequest);
    document.dispatchEvent(new CustomEvent(type === 'scales' ? 'larpblox-avatar-scales-response' : 'larpblox-body-colors-response', {detail:JSON.stringify({id:value.id, ok:true})}));
  };
  document.addEventListener(type === 'scales' ? 'larpblox-avatar-scales-request' : 'larpblox-body-colors-request', onRequest);
  context.fetch('https://avatar.roblox.com/v4/avatar', {method:'PATCH', body:JSON.stringify({avatarDefinition:{updateAvatarModel:{scales:payload.scales, bodyColors:payload.colors}}})}).then(response => resolve(response.status), reject);
});

(async () => {
  assert.equal(await request('scales', {scales:{HeightScale:1.2, ProportionScale:0.4}, colors:{headColor:'#abcdef'}}), 200);
  const legacyListener = event => {
    const value = JSON.parse(event.detail);
    assert.deepEqual(value.scales, {BodyWidthScale:0.8});
    document.dispatchEvent(new CustomEvent('larpblox-avatar-scales-response', {detail:JSON.stringify({id:value.id, ok:true})}));
  };
  document.addEventListener('larpblox-avatar-scales-request', legacyListener, {once:true});
  const legacy = await context.fetch('https://avatar.roblox.com/v1/avatar/set-scales', {method:'POST', body:JSON.stringify({BodyWidthScale:0.8})});
  assert.equal(legacy.status, 200);
  document.documentElement.classList.contains = () => false;
  const passthrough = await context.fetch('https://avatar.roblox.com/v4/avatar', {method:'PATCH', body:'{}'});
  assert.equal(passthrough.status, 200);
  assert.equal(nativeFetches, 1);
  console.log('PASS: scale hook publishes mixed payloads, handles legacy scales, and passes through when Larp mode is off.');
})().catch(error => { console.error(error); process.exitCode = 1; });
