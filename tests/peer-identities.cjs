const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../larpblox-peer-identities.js'), 'utf8');

const context = vm.createContext({console, CustomEvent: function(type, init) { this.type = type; this.bubbles = init.bubbles; }});
vm.runInContext(`
  var raf = [], observer, events = 0;
  var document = {
    documentElement: {dataset: {}, contains:()=>true},
    roots: [],
    querySelectorAll: selector => document.roots,
    addEventListener: (type, callback) => { document.ready = callback; },
    dispatchEvent: event => { if (event.type === 'larpblox-peer-identities-changed') events++; }
  };
  var requestAnimationFrame = callback => raf.push(callback);
  var MutationObserver = function(callback) { observer = callback; this.observe = () => {}; };
  function root(nodes) {
    var attrs = {};
    return {nodes, attrs, querySelectorAll: selector => nodes,
      getAttribute: key => Object.prototype.hasOwnProperty.call(attrs, key) ? attrs[key] : null,
      setAttribute(key, value) { attrs[key] = value; }, removeAttribute(key) { delete attrs[key]; }};
  }
`, context);
vm.runInContext(source, context);
function runFrame() { vm.runInContext('raf.shift()()', context); }
function check(code) { return vm.runInContext(code, context); }

assert.equal(check('document.documentElement.dataset.larpbloxPeerIdentitiesReady'), 'true');
assert.equal(check('document.roots.length'), 0);
check(`
  var cardFiber = {type:function pI(){}, memoizedProps:{user:{id:12345}}, return:null};
  var cardImage = {}; cardImage.__reactFiber$card = cardFiber;
  document.roots.push(root([cardImage])); observer();
`);
runFrame();
assert.equal(check('document.roots[0].getAttribute("data-larpblox-peer-user-id")'), '12345');

check(`
  var headshotFiber = {type:function AvatarHeadshot(){}, memoizedProps:{targetId:13579}, return:null};
  var headshotImage = {}; headshotImage.__reactFiber$headshot = headshotFiber;
  document.roots.push(root([headshotImage])); observer();
`);
runFrame();
assert.equal(check('document.roots[1].getAttribute("data-larpblox-peer-user-id")'), '13579', 'AvatarHeadshot target IDs are resolved');

check(`cardFiber.memoizedProps = {user:{id:67890}}; observer();`);
runFrame();
assert.equal(check('document.roots[0].getAttribute("data-larpblox-peer-user-id")'), '67890', 'retarget updates the annotation');

check(`
  var modalFiber = {type:function f8(){}, memoizedProps:{playerId:'24680'}, return:null};
  var modalImage = {}; modalImage.__reactFiber$modal = modalFiber;
  document.roots.push(root([modalImage])); observer();
`);
runFrame();
assert.equal(check('document.roots[2].getAttribute("data-larpblox-peer-user-id")'), '24680');

check(`
  var unrelated = {type:function GameThumbnail(){}, memoizedProps:{targetId:99999}, return:null};
  var unrelatedImage = {}; unrelatedImage.__reactFiber$unrelated = unrelated;
  document.roots.push(root([unrelatedImage])); observer();
`);
runFrame();
assert.equal(check('document.roots[3].getAttribute("data-larpblox-peer-user-id")'), null, 'unrelated thumbnail IDs stay untouched');

check(`cardFiber.memoizedProps = {}; observer();`);
runFrame();
assert.equal(check('document.roots[0].getAttribute("data-larpblox-peer-user-id")'), null, 'unresolved roots clear stale IDs');
assert.ok(check('events') >= 4, 'changes notify the user script');
console.log('Peer identity bridge: delayed roots, AvatarHeadshot/components, retarget, unresolved, and unrelated thumbnails passed.');
