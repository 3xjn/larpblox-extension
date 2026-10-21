const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const bridge = require('../larpbux-game-bridge.js');
const {gameCommand} = require('../larpbux.js');
const colors = Object.fromEntries(['head','torso','leftArm','rightArm','leftLeg','rightLeg'].map(p=>[p+'Color','ffffff']));
const state = {items:[{id:42,name:'Backdrop',itemType:'Asset',assetType:92}],equipped:[],backgroundId:42,
  gameLook:{items:[],definition:{assets:[],bodyColors:colors,scales:{},playerAvatarType:{playerAvatarType:'R15'}}}};
const sent=[];
const listener={addListener(){}};
const context={Map,Set,JSON,AbortController,setTimeout,clearTimeout,importScripts(){},LarpbloxGameBridge:bridge,
  chrome:{runtime:{id:'test',onMessage:listener,onUserScriptMessage:listener,onUserScriptConnect:listener},storage:{local:{get:async()=>({'larpblox-game-pair:7':'a'.repeat(32)})}}},
  fetch:async(url,options)=>{sent.push(JSON.parse(options.body));return {ok:true,status:200,json:async()=>({})};}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../larpbux-game-background.js'),'utf8'),context);
(async()=>{
  for (const backgroundId of [42,undefined]) {
    const snapshot = gameCommand({...state,backgroundId},'7');
    context.message={action:'publish',userId:'7',snapshot};
    await vm.runInContext("handle(message,{id:'test',url:'https://www.roblox.com/my/avatar',tab:{id:1}})",context);
    assert.equal(sent.at(-1).backgroundId, backgroundId || 0);
    assert.deepEqual(sent.at(-1).backgrounds,[{id:42,name:'Backdrop'}]);
  }
  assert.throws(()=>bridge.validateSnapshot({...gameCommand(state,'7'),backgroundId:-1},'7'),/background/);
  assert.throws(()=>bridge.validateSnapshot({...gameCommand(state,'7'),backgrounds:[]},'7'),/Collect/);
  assert.throws(()=>bridge.validateSnapshot({...gameCommand(state,'7'),backgrounds:[{id:42,name:'A'},{id:42,name:'B'}]},'7'),/background/);
  console.log('PASS: background selection, explicit removal, and collection survive the extension worker; malformed selections fail validation.');
})().catch(error=>{console.error(error);process.exitCode=1});
