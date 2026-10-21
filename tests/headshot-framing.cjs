const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');
const nodePaths = [path.resolve(__dirname,'../.test-artifacts/renderer-build/node_modules')];
const built = esbuild.buildSync({stdin:{contents: `
  import * as THREE from 'three';
  import {headshotFrame} from './larpbux-avatar-3d-source.js';
  export {THREE, headshotFrame};
`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths,write:false});
const exportsModule = {exports:{}};
new Function('module','exports','require',built.outputFiles[0].text)(exportsModule,exportsModule.exports,require);
const {THREE,headshotFrame}=exportsModule.exports;
function mesh(root,name,x,y,z,w,h,d){
  const object=new THREE.Mesh(new THREE.BoxGeometry(w,h,d));object.name=name;object.position.set(x,y,z);root.add(object);return object;
}
const root=new THREE.Group();
mesh(root,'Player1',1.2,5,0.7,1.2,1.2,1.2); // Exported head, offset by the pose.
mesh(root,'Player2',1.2,6.4,0.7,0.8,1.4,0.2); // Taller ears, never the head.
mesh(root,'Player3',-1,2.5,0,3,4,1); // Off-center body must not move the portrait.
root.updateMatrixWorld(true);
const box=new THREE.Box3().setFromObject(root);
const frame=headshotFrame(root,box);
assert.equal(frame.target.x,1.2);
assert.equal(frame.target.z,0.7);
assert.ok(frame.target.y<5.1 && frame.target.y>4.5,'frame stays centered on the face, not the ears');
assert.ok(frame.radius>=box.max.y-frame.target.y,'headwear remains in the round frame');
mesh(root,'Head',-0.6,5.3,0.3,1.1,1.1,1.1);root.updateMatrixWorld(true);
const named=headshotFrame(root,new THREE.Box3().setFromObject(root));
assert.ok(Math.abs(named.target.x+0.6)<1e-9,'an explicitly named head takes precedence over generic export names');
assert.ok(Math.abs(named.target.z-0.3)<1e-9);
const headless=new THREE.Group();mesh(headless,'Torso',0,2,0,2,3,1);headless.updateMatrixWorld(true);
const fallback=headshotFrame(headless,new THREE.Box3().setFromObject(headless));
assert.ok(Number.isFinite(fallback.radius) && fallback.radius>0);
assert.ok(fallback.target.y>2,'unrecognized/headless rigs get an upper-body portrait');
console.log('PASS: headshots center on the actual offset head, ignore taller accessory meshes as head candidates, retain headwear, and handle headless exports.');
