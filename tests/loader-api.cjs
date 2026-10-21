const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const crypto=require('node:crypto');
const source=fs.readFileSync('remote-loader.js','utf8');
async function fixture(api){
 let listener;let saved={};let downloaded=0;let required=3;
 const baseline={schema:1,version:'1.0.0',loaderApi:api,css:'',scripts:[{name:'fixture.js',code:'void 0;'}]};
 const next={...baseline,version:'1.0.1',loaderApi:3};const data=Buffer.from(JSON.stringify(next));
 const noop={addListener(){}};
 const context={console,TextEncoder,TextDecoder,Uint8Array,AbortSignal,crypto:crypto.webcrypto,
 chrome:{runtime:{id:'test',getURL:p=>'chrome-extension://test/'+p,getManifest:()=>({version:'1.0.0'}),onMessage:{addListener:f=>listener=f},onUserScriptMessage:noop,onInstalled:noop,onStartup:noop},
 storage:{local:{get:async()=>saved,set:async value=>{saved=value}}},userScripts:{getScripts:async()=>[],resetWorldConfiguration:async()=>{},configureWorld:async()=>{},register:async()=>{},execute:async()=>[{result:'larpblox-parse-ok'}]},tabs:{query:async()=>[{id:1,url:'https://www.roblox.com/'}]}},
 fetch:async url=>{
  if(url.startsWith('chrome-extension:'))return {ok:true,json:async()=>baseline};
  if(url.includes('website-latest.json'))return new Response(JSON.stringify({schema:1,version:'1.0.1',loaderApi:required,size:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),url:'https://github.com/3xjn/larpblox-extension/releases/download/v1.0.1/website-1.0.1.json'}));
  downloaded++;return new Response(data);
 }};
 vm.createContext(context);vm.runInContext(source.replace('const API = 3;',`const API = ${api};`),context);
 const check=()=>new Promise(resolve=>listener({type:'larpblox-website-update',action:'check'},{id:'test',url:'chrome-extension://test/popup.html'},resolve));
 return {check,get saved(){return saved},get downloaded(){return downloaded},set required(value){required=value}};
}
(async()=>{
 const old=await fixture(1);const rejected=await old.check();assert.equal(rejected.ok,false);assert.match(rejected.error,/newer Larpblox loader/);assert.equal(old.downloaded,0);assert.deepEqual(old.saved,{});
 const current=await fixture(3);assert.equal((await current.check()).updated,true);assert.equal(current.saved['larpblox-website-release'].current.loaderApi,3);
 current.required=4;assert.equal((await current.check()).ok,false);assert.equal(current.downloaded,1);
 console.log('PASS: older loaders reject API 3 before downloading or activating it; current loaders accept API 3 and reject future requirements.');
})().catch(e=>{console.error(e);process.exitCode=1});
