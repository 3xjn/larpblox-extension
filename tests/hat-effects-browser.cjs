const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),esbuild=require('esbuild');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const built=esbuild.buildSync({stdin:{contents:`import * as THREE from 'three';import {OBJExporter} from 'three/addons/exporters/OBJExporter.js';import {readSmokestackMesh} from './larpbux-avatar-3d-source.js';export {THREE,OBJExporter,readSmokestackMesh};`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths:[path.resolve(__dirname,'../../renderer-build/node_modules')],write:false});
const m={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(m,m.exports,require);
const {THREE,OBJExporter,readSmokestackMesh}=m.exports;
const bytes=zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'fixtures/gear-effects/fiery-horns.mesh.gz')));
const native=readSmokestackMesh(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const root=new THREE.Group();
for(const [name,y,w,h,d] of [['Player1',4.5,1.2,1.2,1.2],['Player2',2.5,2,2.8,1]]){const mat=new THREE.MeshBasicMaterial();mat.name='body';const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.name=name;mesh.position.y=y;root.add(mesh);}
const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(native.positions,3));geometry.translate(0,5,0);
const mat=new THREE.MeshBasicMaterial();mat.name='hat';const horns=new THREE.Mesh(geometry,mat);horns.name='Handle1';root.add(horns);root.updateMatrixWorld(true);
const obj=new OBJExporter().parse(root),xml=fs.readFileSync(path.join(__dirname,'fixtures/gear-effects/fiery-horns.xml'),'utf8');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:850,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>{const u=r.request().url(),headers={'access-control-allow-origin':'*'};
 if(u.includes('/v2/assetId/'))return r.fulfill({json:{locations:[{location:'https://t0.rbxcdn.com/asset-'+u.split('/').pop()}]},headers:{'access-control-allow-origin':'null','access-control-allow-credentials':'true'}});
 if(u.endsWith('/asset-215718515'))return r.fulfill({headers,body:xml});
 if(u.endsWith('/asset-215680403'))return r.fulfill({headers,body:bytes});
 if(u.endsWith('/descriptor'))return r.fulfill({headers,json:{obj:'avatar',mtl:'materials',textures:[],camera:{fov:35,position:{x:0,y:4,z:-15},direction:{x:0,y:0,z:1}}}});
 if(u.endsWith('/avatar'))return r.fulfill({headers,body:obj});
 if(u.endsWith('/materials'))return r.fulfill({headers,body:'newmtl body\nKd .35 .35 .35\nnewmtl hat\nKd .2 .05 .05\n'});
 return r.abort();});
 await page.setContent('<style>body{margin:0;background:#25262b;color:white}#host{width:420px;height:420px;position:absolute;left:-1000px}img{width:420px;height:420px}</style><div id="host"></div><div id="images"></div>');
 await page.addScriptTag({path:process.env.TEST_AVATAR_RENDERER || path.resolve(__dirname,'../larpbux-avatar-3d.js')});
 const result=await page.evaluate(async()=>{
 const host=document.querySelector('#host'),definition={assets:[{id:215718515}]},kinds=['headshot','fullBody'];
 const plain=await LarpbloxAvatar3D.create(host,'https://t0.rbxcdn.com/descriptor',{static:true,definition});
 const before=kinds.map(k=>plain.capture(k));plain.dispose();
 for(const staticView of [false,true]) {
 const noEffects=await LarpbloxAvatar3D.create(host,'https://t0.rbxcdn.com/descriptor',{static:staticView,definition,items:[{id:215718515,assetType:8}],effects:false});
 if(JSON.stringify(noEffects.getDiagnostics().gearEffects)!=='[]')throw new Error('Effects must be absent when disabled');
 if(noEffects.capture('headshot')!==before[0])throw new Error('Disabled effects must leave native headshot unchanged');
 noEffects.dispose();
 }
 const viewer=await LarpbloxAvatar3D.create(host,'https://t0.rbxcdn.com/descriptor',{static:true,definition,items:[{id:215718515,assetType:8}]});
 const after=kinds.map(k=>viewer.capture(k)),diagnostics=viewer.getDiagnostics().gearEffects;
 for(const src of [...before,...after]){const img=new Image();img.src=src;document.querySelector('#images').append(img);}
 viewer.dispose();
 return {before,after,diagnostics};
 });
 assert.equal(result.diagnostics[0]?.attached,true,JSON.stringify(result.diagnostics));
 assert.deepEqual(result.diagnostics[0].effects,['fire']);
 assert.ok(result.after.every((v,i)=>v!==result.before[i]),'flames must render before both initial portrait and full-avatar capture');
 // Verify motion with a fixed saved view, so camera rotation cannot satisfy it.
 const motion=await page.evaluate(async()=>{
 const viewer=await LarpbloxAvatar3D.create(document.querySelector('#host'),'https://t0.rbxcdn.com/descriptor',{definition:{assets:[{id:215718515}]},items:[{id:215718515,assetType:8}]});
 const before=viewer.capture('headshot');await new Promise(r=>setTimeout(r,180));const changed=viewer.capture('headshot')!==before;viewer.dispose();return changed;
 });
 assert.equal(motion,true);assert.deepEqual(errors,[]);
 await page.screenshot({path:path.resolve(__dirname,'../.test-artifacts/hat-effects.png')});
 console.log('PASS: real Fiery Horns mesh receives native-texture fire before initial headshot/full-avatar captures; flames animate.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
