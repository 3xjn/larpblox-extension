const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const esbuild = require('esbuild');

const repoRoot = path.resolve(__dirname, '..');
const built = esbuild.buildSync({stdin:{contents:`
  export {repairCoincidentFaces, readSmokestackMesh} from './larpbux-avatar-3d-source.js';
  export {BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, FrontSide, DoubleSide} from 'three';
`, resolveDir:repoRoot}, bundle:true, platform:'node', format:'cjs', nodePaths:[path.resolve(__dirname, '../../renderer-build/node_modules')], write:false});
const loaded = {exports:{}};
new Function('module', 'exports', 'require', built.outputFiles[0].text)(loaded, loaded.exports, require);
const {repairCoincidentFaces, readSmokestackMesh, BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, FrontSide, DoubleSide} = loaded.exports;

const compressed = fs.readFileSync(path.join(__dirname, 'fixtures/portrait/doombringer-1286103.mesh.gz'));
const bytes = zlib.gunzipSync(compressed);
const meshData = readSmokestackMesh(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const positions = new Float32Array(meshData.positions);
assert.equal(positions.length / 9, 1932, 'fixture is the original Doombringer mesh');

const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
const ordinaryGeometry = new BufferGeometry();
ordinaryGeometry.setAttribute('position', new Float32BufferAttribute([-1,0,0, 1,0,0, 0,1,0], 3));
const scene = new Group();
const sharedMaterial = new MeshBasicMaterial({side:DoubleSide});
const target = new Mesh(geometry, sharedMaterial); target.name = 'DoombringerHandle'; scene.add(target);
const sharedUnchanged = new Mesh(ordinaryGeometry, sharedMaterial); sharedUnchanged.name = 'UnrelatedSharedMaterial'; scene.add(sharedUnchanged);
const unrelatedMaterial = new MeshBasicMaterial({side:DoubleSide});
const unrelated = new Mesh(ordinaryGeometry.clone(), unrelatedMaterial); unrelated.name = 'UnrelatedMesh'; scene.add(unrelated);

assert.equal(repairCoincidentFaces(scene), 1, 'only the Doombringer mesh has opposite-winding coincident faces');
assert.notEqual(target.material, sharedMaterial, 'the affected mesh receives a private material');
assert.equal(target.material.side, FrontSide, 'the affected mesh uses front-side material rendering');
assert.equal(sharedMaterial.side, DoubleSide, 'the shared original material remains double-sided');
assert.equal(sharedUnchanged.material, sharedMaterial, 'an unrelated mesh keeps the original shared material');
assert.equal(unrelated.material, unrelatedMaterial, 'an unrelated material is not cloned or replaced');
assert.equal(unrelated.material.side, DoubleSide, 'unrelated geometry remains double-sided');
assert.equal(sharedUnchanged.material.side, DoubleSide, 'ordinary geometry remains double-sided');
console.log('PASS: original Doombringer coincident faces are repaired without changing shared or unrelated materials.');
