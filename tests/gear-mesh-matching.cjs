const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), zlib=require('node:zlib'), esbuild=require('esbuild');
const built=esbuild.buildSync({stdin:{contents:`import * as THREE from 'three'; import {readSmokestackMesh,matchEffectMesh} from './larpbux-avatar-3d-source.js'; export {THREE,readSmokestackMesh,matchEffectMesh};`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths:[path.resolve(__dirname,'../../renderer-build/node_modules')],write:false});
const moduleValue={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(moduleValue,moduleValue.exports,require);
const {THREE,readSmokestackMesh,matchEffectMesh}=moduleValue.exports;
const bytes=zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'fixtures/gear-portrait/crimson-periastron.mesh.gz')));
const reference=readSmokestackMesh(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const root=new THREE.Group(), transform=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(.7,-.4,.9)).setPosition(1.5,103.5,-.7);
const geometry=new THREE.BufferGeometry();
geometry.setAttribute('position',new THREE.Float32BufferAttribute(reference.positions,3));
geometry.applyMatrix4(transform);
const sword=new THREE.Mesh(geometry);sword.name='Handle1';root.add(sword);root.updateMatrixWorld(true);
const match=matchEffectMesh(root,reference,{scale:{x:1,y:1,z:1},offset:{x:0,y:0,z:0}});
assert.equal(match?.node,sword,'actual Crimson mesh must match after export pose transforms');
for(const point of [new THREE.Vector3(),new THREE.Vector3(0,0,2.6),new THREE.Vector3(.2,.3,-.7)]) {
  assert.ok(match.mapPosition(point).distanceTo(point.clone().applyMatrix4(transform))<.0001,'native effects stay at the posed Handle coordinates');
}
assert.equal(matchEffectMesh(new THREE.Group(),reference,{scale:{x:1,y:1,z:1},offset:{x:0,y:0,z:0}}),undefined,'missing gear must not attach effects to a body part');
console.log('PASS: native Crimson Periastron geometry identifies the posed gear and maps its effect attachment coordinates.');
