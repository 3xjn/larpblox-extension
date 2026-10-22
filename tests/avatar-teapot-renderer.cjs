const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');
const built = esbuild.buildSync({stdin:{contents:`
  export {readSmokestackMesh, smokestackMeshUVs} from './larpbux-avatar-3d-source.js';
  export {BufferGeometry, Float32BufferAttribute} from 'three';
`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths:[path.resolve(__dirname,'../../renderer-build/node_modules')],write:false});
const moduleRef = {exports:{}};
new Function('module','exports','require',built.outputFiles[0].text)(moduleRef,moduleRef.exports,require);
const {readSmokestackMesh, smokestackMeshUVs, BufferGeometry, Float32BufferAttribute} = moduleRef.exports;

const fixture = fs.readFileSync(path.join(__dirname,'fixtures/portrait/teapot-1045320.mesh'));
const reference = readSmokestackMesh(fixture.buffer.slice(fixture.byteOffset,fixture.byteOffset+fixture.byteLength));
assert.ok(reference.positions.length > 1000, 'use the real catalog mesh');
const teapot = new BufferGeometry();
teapot.setAttribute('position',new Float32BufferAttribute(reference.positions,3));
teapot.scale(2.4,2.4,2.4);teapot.rotateY(.7);teapot.translate(1,4,2);
const base = new BufferGeometry();
base.setAttribute('position',new Float32BufferAttribute([-1,0,0,1,0,0,0,3,0],3));
assert.ok(smokestackMeshUVs(teapot, reference), 'matching Teapot geometry is recognized');
assert.equal(smokestackMeshUVs(base, reference),null, 'unrelated avatar geometry is not treated as the Teapot');
console.log('PASS: Teapot geometry matcher accepts the fixture and rejects base avatar geometry.');
