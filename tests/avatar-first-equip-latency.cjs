const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

(async () => {
  let now = 1000000, sequence = 0;
  const start = now, timers = new Map(), storage = new Map(), sent = [];
  const readyAt = Number(process.argv[2] || 8500);
  class Clock extends Date { static now() { return now; } }
  const context = {
    ...require('./helpers/render-locks.cjs')(), AbortController, Date:Clock,
    setTimeout(fn, ms) { const id = ++sequence; timers.set(id, {at:now + ms, fn}); return id; },
    clearTimeout(id) { timers.delete(id); },
    localStorage:{getItem:key => storage.get(key), setItem:(key,value) => storage.set(key,value)},
    document:{querySelector:() => null},
    fetch:async () => {
      sent.push(now - start);
      return {ok:true, status:200, headers:{get:() => null}, json:async () =>
        now - start < readyAt ? {state:'Pending'} : {state:'Completed',imageUrl:'https://tr.rbxcdn.com/cold-outfit.png'}};
    },
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../larpblox-avatar-requests.js'),'utf8'), context);
  let complete = false, failure;
  const definition = {assets:[{id:808}]};
  const first = context.LarpbloxAvatarRequests.render(definition,123,new AbortController().signal);
  first.then(() => complete = true, error => { failure = error; complete = true; });
  for (let step = 0; !complete && step < 1000; step++) {
    await new Promise(setImmediate);
    const next = [...timers].sort((a,b) => a[1].at - b[1].at)[0];
    if (next) { timers.delete(next[0]); now = next[1].at; next[1].fn(); }
  }
  if (failure) throw failure;
  assert.ok(complete, 'render must finish');
  assert.equal(await first, 'https://tr.rbxcdn.com/cold-outfit.png');
  const count = sent.length;
  await context.LarpbloxAvatarRequests.render(definition,123,new AbortController().signal);
  assert.equal(sent.length, count, 'repeat equip must retain its cached fast path');
  console.log(`Cold outfit ready at ${readyAt}ms, displayed at ${now-start}ms; ${sent.length} checks. Cached re-equip uses no extra request.`);
  for (let i = 1; i < sent.length; i++) {
    assert.ok(sent[i]-sent[i-1] >= 1000, 'preserve the shared request limit');
    assert.ok(sent[i]-sent[i-1] <= 2000, 'pending outfits must not sit unchecked for up to ten seconds');
  }
  assert.ok(now-start <= readyAt + 2000, 'display a completed first equip within two seconds of readiness');
})().catch(error => { console.error(error); process.exitCode = 1; });
