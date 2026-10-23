const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), zlib=require('node:zlib'), esbuild=require('esbuild');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const built=esbuild.buildSync({stdin:{contents:`import * as THREE from 'three'; import {OBJExporter} from 'three/addons/exporters/OBJExporter.js'; import {readSmokestackMesh} from './larpbux-avatar-3d-source.js'; export {THREE,OBJExporter,readSmokestackMesh};`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths:[path.resolve(__dirname,'../../renderer-build/node_modules')],write:false});
const m={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(m,m.exports,require);
const {THREE,OBJExporter,readSmokestackMesh}=m.exports;
const meshBytes=zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'fixtures/gear-portrait/crimson-periastron.mesh.gz')));
const reference=readSmokestackMesh(meshBytes.buffer.slice(meshBytes.byteOffset,meshBytes.byteOffset+meshBytes.byteLength));
const root=new THREE.Group();
function box(name,x,y,z,w,h,d,materialName){const material=new THREE.MeshBasicMaterial();material.name=materialName;const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.name=name;mesh.position.set(x,y,z);root.add(mesh);}
box('Player1',0,4,0,1.2,1.2,1.2,'head');box('Player2',0,2.4,0,2,2,1,'body');
box('Player3',1.5,4.3,-.3,.8,.3,.9,'head');box('Player4',-.6,.8,0,.8,1.4,1,'body');box('Player5',.6,.8,0,.8,1.4,1,'body');
const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(reference.positions,3));
geometry.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(1.1,0,.5)).setPosition(1.5,3,-.5));
const material=new THREE.MeshBasicMaterial();material.name='blade';const gear=new THREE.Mesh(geometry,material);gear.name='Handle1';root.add(gear);
root.updateMatrixWorld(true);const obj=new OBJExporter().parse(root);
let xml=fs.readFileSync(path.join(__dirname,'fixtures/gear-effects/crimson-periastron-mu.xml'),'utf8');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:900,height:480}});
 await page.route('**/*',r=>{const url=r.request().url();const headers={'access-control-allow-origin':'*'};
  if(url.includes('/v2/assetId/')){const id=url.split('/').pop();return r.fulfill({json:{locations:[{location:`https://t0.rbxcdn.com/gear-${id}`}]},headers:{"access-control-allow-origin":"null","access-control-allow-credentials":"true"}});}
  if(url.endsWith('/gear-99119240'))return r.fulfill({body:xml,headers});
  if(url.endsWith('/gear-12345'))return r.fulfill({body:Buffer.from(require('../assets/roblox-sparkles.json').dataUrl.split(',')[1],'base64'),contentType:'image/png',headers});
  if(url.endsWith('/gear-80557857'))return r.fulfill({body:meshBytes,headers});
  if(url.endsWith('/descriptor'))return r.fulfill({json:{obj:'posed-avatar',mtl:'posed-materials',textures:[],camera:{fov:35,position:{x:0,y:3,z:-15},direction:{x:0,y:0,z:1}}},headers});
  if(url.endsWith('/posed-avatar'))return r.fulfill({body:obj,headers});
  if(url.endsWith('/posed-materials'))return r.fulfill({body:'newmtl head\nKd .75 .6 .4\nnewmtl body\nKd .1 .2 .6\nnewmtl blade\nKd .4 .02 .02\n',headers});
  return r.abort();
 });
 await page.setContent('<style>body{background:#25262b;color:white;font:16px Arial}#host{width:420px;height:420px;position:absolute;left:-1000px}img{width:420px;height:420px;object-fit:contain}</style><div id="host"></div><span>Headshot and full avatar — native Crimson geometry/effects</span><div id="captures"></div>');
 await page.addScriptTag({path:path.resolve(__dirname,'../larpbux-avatar-3d.js')});
 const result=await page.evaluate(async()=>{
  const host=document.querySelector('#host'),definition={assets:[{id:99119240}]};
  const plain=await LarpbloxAvatar3D.create(host,'https://t0.rbxcdn.com/descriptor',{static:true,definition});
  const before=[plain.capture('headshot'),plain.capture('fullBody')];plain.dispose();
  const viewer=await LarpbloxAvatar3D.create(host,'https://t0.rbxcdn.com/descriptor',{static:true,definition,items:[{id:99119240,assetType:19}]});
  const after=[viewer.capture('headshot'),viewer.capture('fullBody')],effects=viewer.getDiagnostics().gearEffects;
  for(const url of after){const img=document.createElement('img');img.src=url;document.querySelector('#captures').append(img);}
  viewer.dispose();return {changed:after.map((url,i)=>url!==before[i]),effects};
 });
 assert.equal(result.effects[0]?.attached,true,'actual posed Crimson export must receive its effects: '+JSON.stringify(result.effects));
 assert.deepEqual(result.effects[0].effects,['sparkles','pointLight']);
 assert.deepEqual(result.changed,[true,true],'effects must be rendered before both headshot and full-body captures');
 xml=xml.replace(/<bool name="Enabled">true<\/bool>/g,'<bool name="Enabled">false</bool>').replace('<Item class="Sparkles"','<Item class="ParticleEmitter"><Properties><bool name="Enabled">true</bool><Content name="Texture"><url>rbxassetid://12345</url></Content><float name="Rate">20</float><NumberRange name="Lifetime">1 2</NumberRange><NumberRange name="Speed">1 2</NumberRange><NumberSequence name="Size">0 0.8 0 1 0.2 0</NumberSequence><ColorSequence name="Color">0 1 0 0 0 1 1 0 0 0</ColorSequence></Properties></Item><Item class="Sparkles"');
 await page.reload();await page.setContent('<div id="host" style="width:420px;height:420px"></div>');
 await page.addScriptTag({path:path.resolve(__dirname,'../larpbux-avatar-3d.js')});
 const particles=await page.evaluate(async()=>{
  const host=document.querySelector('#host'),definition={assets:[{id:99119240}]};
  const plain=await LarpbloxAvatar3D.create(host,'https://t0.rbxcdn.com/descriptor',{static:true,definition});
  const before=plain.capture('fullBody');plain.dispose();
  const viewer=await LarpbloxAvatar3D.create(host,'https://t0.rbxcdn.com/descriptor',{definition,items:[{id:99119240,assetType:19}]});
  const after=viewer.capture('fullBody'),effects=viewer.getDiagnostics().gearEffects;
  await new Promise(resolve=>setTimeout(resolve,150));const moved=viewer.capture('fullBody')!==after;
  viewer.dispose();return {changed:before!==after,moved,effects};
 });
 assert.equal(particles.changed,true,'textured emitter must render');assert.equal(particles.moved,true,'emitter must animate');
 assert.deepEqual(particles.effects[0].effects,['particleEmitter']);
 const output=path.resolve(__dirname,'../.test-artifacts/gear-profile-preview.png');await page.screenshot({path:output});
 console.log('PASS: browser captures include native Crimson sparkles/light in both portrait and full-avatar images.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
