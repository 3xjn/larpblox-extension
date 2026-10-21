const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const messages = [];
const context = {Map, Set, JSON, Date, AbortController, setInterval() {},
  LarpbloxGameBridge:{validateSnapshot:value=>value},
  chrome:{runtime:{sendMessage:async message => {messages.push(message);return {ok:true};}}}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../larpbux-shared-users.js'),'utf8'),context);
const definition = {assets:[],backgroundRequestModel:{id:75789087422384}};
const settle = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  const options = {userId:'123',active:true,signature:'background',names:{username:'LarpUser'},loadDefinition:async()=>definition};
  context.LarpbloxSharedUsers.publishProfile(options);
  await settle();
  assert.equal(messages.length,1);
  assert.equal(messages[0].record.snapshot.definition.backgroundRequestModel.id,75789087422384);
  assert.equal(messages[0].record.name.displayName,'LarpUser');
  context.LarpbloxSharedUsers.publishProfile({...options,socialCounts:{followers:4,following:5}});
  await settle(); assert.equal(messages[1].record.socialCounts.followers,4); assert.equal(messages[1].record.socialCounts.following,5);
  context.LarpbloxSharedUsers.publishProfile({...options,socialCounts:{followers:4,following:5}});
  await settle(); assert.equal(messages.length,2);
  context.LarpbloxSharedUsers.publishProfile({...options,socialCounts:null});
  await settle(); assert.equal(messages[2].record.socialCounts,undefined);
  context.LarpbloxSharedUsers.publishProfile(options);
  await settle(); assert.equal(messages.length,3);
  context.LarpbloxSharedUsers.publishProfile({...options,active:false});
  await settle(); assert.equal(messages.length,4); assert.equal(messages[3].record,undefined);
  const snapshot = {version:1,userId:'123',definition,items:[{id:42,itemType:'Asset',assetType:8,name:'Saved hat'}]};
  context.LarpbloxSharedUsers.publishProfile({...options,signature:'complete',loadSnapshot:async()=>snapshot});
  await settle(); assert.equal(messages[4].record.snapshot.items[0].id,42);
  let finish;
  context.LarpbloxSharedUsers.publishProfile({...options,signature:'slow',loadSnapshot:()=>new Promise(resolve=>{finish=resolve;})});
  context.LarpbloxSharedUsers.publishProfile({...options,active:false});
  finish(snapshot); await settle(); await settle();
  assert.equal(messages.length,6); assert.equal(messages[5].record,undefined,'disabling sharing cancels an in-flight publication');
  console.log('PASS: background profile publication, duplicate suppression, and mode-off removal.');
})().catch(error=>{console.error(error);process.exitCode=1});
