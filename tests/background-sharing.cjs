const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const messages = [];
const context = {Map, Set, JSON, Date, AbortController, setInterval() {},
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
  context.LarpbloxSharedUsers.publishProfile(options);
  await settle(); assert.equal(messages.length,1);
  context.LarpbloxSharedUsers.publishProfile({...options,active:false});
  await settle(); assert.equal(messages.length,2); assert.equal(messages[1].record,undefined);
  console.log('PASS: background profile publication, duplicate suppression, and mode-off removal.');
})().catch(error=>{console.error(error);process.exitCode=1});
