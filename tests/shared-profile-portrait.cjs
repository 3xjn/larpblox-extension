const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const full = fs.readFileSync(path.join(__dirname, '..', 'larpbux-shared-users.js'), 'utf8');
// Execute the production publication unit; DOM observation is unrelated here.
const source = full.slice(0, full.indexOf('  let context =')) + '\n globalThis.publisher={publishProfile,flushProfile};\n})();';
function setup(render) {
  const sent = [], renders = [];
  const context = {
    AbortController, setTimeout, clearTimeout, document:{querySelector:()=>null},
    LarpbloxExtension:{sendMessage:async message=>{sent.push(structuredClone(message));return {ok:true};}},
    LarpbloxGameBridge:{validateSnapshot:value=>value, validateImage:value=>{
      assert.match(value.imageUrl, /^https:\/\/tr\.rbxcdn\.com\//);return value;
    }},
    LarpbloxAvatarSurfaces:{characterThumbnail:async (definition,id,signal)=>{
      renders.push(structuredClone(definition));return render(definition,id,signal);
    }},
  };
  vm.runInNewContext(source,context);
  return {sent,renders,publisher:context.publisher};
}
const tick = () => new Promise(resolve=>setImmediate(resolve));
const options = (id, signature) => ({userId:id,active:true,signature,names:{username:'Alias',displayName:'Display'},
  loadSnapshot:async()=>({version:1,userId:id,definition:{assets:[{id:Number(signature)}],backgroundId:99,backgroundRequestModel:{id:99}},items:[]})});
(async()=>{
  let finish;
  const state=setup(()=>new Promise(resolve=>finish=resolve));
  state.publisher.publishProfile(options('123','1'));await tick();
  assert.equal(state.sent.length,1,'identity is published while rendering is pending');
  assert.equal(state.sent[0].record.imageUrl,undefined);
  finish('https://tr.rbxcdn.com/native.png');await tick();
  assert.equal(state.sent[1].record.imageUrl,'https://tr.rbxcdn.com/native.png','saved profile receives the native PNG');
  assert.equal(state.renders[0].backgroundId,undefined);
  assert.equal(state.renders[0].backgroundRequestModel,undefined);
  assert.equal(state.sent[1].record.snapshot.definition.backgroundId,99,'rendering does not mutate saved background data');
  state.publisher.publishProfile({...options('123','1'),names:{username:'NewAlias',displayName:'New Display'}});await tick();
  assert.equal(state.sent.at(-1).record.imageUrl,'https://tr.rbxcdn.com/native.png','identity refresh preserves the matching cached image');
  assert.equal(state.renders.length,1,'matching cached portrait is not rerendered');
  const completions=[];
  const changing=setup(()=>new Promise(resolve=>completions.push(resolve)));
  changing.publisher.publishProfile(options('123','1'));await tick();
  changing.publisher.publishProfile(options('123','2'));
  completions[0]('https://tr.rbxcdn.com/stale.png');await tick();await tick();
  assert(!changing.sent.some(message=>message.record?.imageUrl?.includes('stale')),'obsolete render cannot overwrite a new profile');
  completions[1]('https://tr.rbxcdn.com/current.png');await tick();
  assert.equal(changing.sent.at(-1).record.imageUrl,'https://tr.rbxcdn.com/current.png');
  assert.equal(changing.sent.at(-1).record.snapshot.definition.assets[0].id,2);
  console.log('PASS: saved native portrait, prompt identity, background isolation and stale-render cancellation');
})().catch(error=>{console.error(error);process.exitCode=1;});
