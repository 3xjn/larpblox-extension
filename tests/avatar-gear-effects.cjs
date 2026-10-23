const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const nodePaths = [path.resolve(__dirname, '../../renderer-build/node_modules')];
const source = fs.readFileSync(path.join(__dirname, '../larpbux-avatar-effects-source.js'), 'utf8');
const built = esbuild.buildSync({stdin:{contents:`${source}\nexport {THREE};`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths,write:false});
const exportsModule = {exports:{}};
new Function('module','exports','require',built.outputFiles[0].text)(exportsModule,exportsModule.exports,require);
const {THREE, parseGearEffects, addAvatarEffects} = exportsModule.exports;
(async () => {
const xml = fs.readFileSync(path.join(__dirname, 'fixtures/gear-effects/crimson-periastron-mu.xml'), 'utf8');
const parsed = parseGearEffects(xml);
assert.equal(parsed.mesh.id, '80557857');
assert.deepEqual(parsed.staticEffects.map(effect => effect.kind), ['sparkles', 'pointLight']);
assert.equal(parsed.disabledEmitters, 2);
assert.deepEqual(parsed.staticEffects.find(effect => effect.kind === 'sparkles').color, {r:0.666666687,g:0,b:0});
assert.deepEqual(parsed.staticEffects.find(effect => effect.kind === 'pointLight').color, {r:0.666666687,g:0,b:0});
assert.ok(Math.abs(parsed.attachments.get('TopTrail').z - 2.60000181) < 1e-6);
assert.ok(Math.abs(parsed.attachments.get('BottomTrail').z + 0.69999814) < 1e-6);
const emitterXml = '<roblox><Item class="Part"><Properties><string name="Name">Handle</string></Properties><Item class="Attachment"><Properties><string name="Name">EmitterAttachment</string><CoordinateFrame name="CFrame"><X>1</X><Y>2</Y><Z>3</Z></CoordinateFrame></Properties><Item class="ParticleEmitter"><Properties><bool name="Enabled">true</bool><string name="Name">NativeEmitter</string><Content name="Texture"><url>rbxassetid://12345</url></Content><float name="Rate">20</float><NumberRange name="Lifetime">1 2</NumberRange><NumberRange name="Speed">3 5</NumberRange><NumberSequence name="Size">0 0.1 0 1 0.2 0</NumberSequence></Properties></Item></Item><Item class="ParticleEmitter"><Properties><bool name="Enabled">false</bool><string name="Name">DisabledEmitter</string></Properties></Item></Item></roblox>';
const parsedEmitter = parseGearEffects(emitterXml);
assert.equal(parsedEmitter.staticEffects.filter(effect => effect.kind === 'particleEmitter').length, 1);
assert.equal(parsedEmitter.staticEffects.find(effect => effect.kind === 'particleEmitter').textureId, '12345');
const fieryHornsXml = fs.readFileSync(path.join(__dirname, 'fixtures/gear-effects/fiery-horns.xml'), 'utf8');
const fieryHorns = parseGearEffects(fieryHornsXml);
assert.equal(fieryHorns.mesh.id, '215680403');
const fire = fieryHorns.staticEffects.find(effect => effect.kind === 'fire');
assert.deepEqual(fire.color, {r:236 / 255, g:139 / 255, b:70 / 255});
assert.deepEqual(fire.secondaryColor, {r:139 / 255, g:80 / 255, b:55 / 255});
assert.equal(fire.size, 3);
assert.equal(fire.heat, 8);
const fieryRoot = new THREE.Group();
const fieryHandle = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)); fieryHandle.name = 'GearHandle'; fieryRoot.add(fieryHandle); fieryRoot.updateMatrixWorld(true);
const fieryResult = await addAvatarEffects(fieryRoot, [{id:215718515, assetType:8}], {
  deliveryUrl: async () => `data:text/xml,${encodeURIComponent(fieryHornsXml)}`,
  readMesh: async id => ({id, positions:[0,0,0], uvs:[]}),
  matchMesh: () => ({node:fieryHandle, mapPosition: position => position.add(new THREE.Vector3(0, 2, 0))}),
});
assert.equal(fieryResult.diagnostics[0].attached, true);
assert.equal(fieryResult.diagnostics[0].effects[0], 'fire');
assert.equal(fieryHandle.children.filter(child => child.name === 'LarpbloxGearFire').length, 1);
fieryResult.update(2);
fieryResult.dispose();
const fixtureUrl = `data:text/xml,${encodeURIComponent(xml)}`;
const root = new THREE.Group();
const exported = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 5)); exported.name = 'GearHandle'; root.add(exported); root.updateMatrixWorld(true);
const result = await addAvatarEffects(root, [{id:99119240, assetType:19}], {
  deliveryUrl: async () => fixtureUrl,
  readMesh: async (id) => ({id, positions:[0,0,0, 1,0,0, 0,1,0], uvs:[]}),
  matchMesh: () => ({node:exported, mapPosition: position => position.add(new THREE.Vector3(4, 2, -3))}),
});
assert.equal(result.diagnostics[0].attached, true);
assert.equal(exported.children.filter(child => child.name.includes('Gear')).length, 2);
const light = exported.children.find(child => child.name === 'LarpbloxGearPointLight');
assert.deepEqual(light.position.toArray(), [4,2,-3]);
const sparkle=exported.children.find(child=>child.name==='LarpbloxGearSparkles');
const initialPositions=Array.from(sparkle.geometry.getAttribute('position').array);
result.update(2);
assert.notDeepEqual(Array.from(sparkle.geometry.getAttribute('position').array),initialPositions,'Sparkles must emit/move, not only change overall opacity');
assert.ok(sparkle.material.size>=.45,'native sparkle texture must remain visible at profile-image size');
const beforeBounds = new THREE.Box3().setFromBufferAttribute(exported.geometry.getAttribute('position'));
const before = exported.children.find(child => child.name === 'LarpbloxGearSparkles').rotation.y;
result.update(1); assert.notEqual(exported.children.find(child => child.name === 'LarpbloxGearSparkles').material.opacity, .9);
assert.deepEqual(new THREE.Box3().setFromBufferAttribute(exported.geometry.getAttribute('position')).min.toArray(), beforeBounds.min.toArray());
result.dispose(); assert.equal(exported.children.length, 0);
const unmatched = await addAvatarEffects(new THREE.Group(), [{id:99119240, assetType:19}], {deliveryUrl: async () => fixtureUrl, readMesh: async () => ({}), matchMesh: () => null});
assert.equal(unmatched.diagnostics[0].attached, false);
let meshReads = 0;
const noEffects = await addAvatarEffects(new THREE.Group(), [{id:99119240, assetType:8}], {deliveryUrl: async () => `data:text/xml,${encodeURIComponent('<roblox><Item class="Part"><Properties><string name="Name">Handle</string></Properties></Item></roblox>')}`, readMesh: async () => { meshReads++; return {}; }});
assert.equal(meshReads, 0);
assert.equal(noEffects.diagnostics[0].reason, 'no-supported-effects');
const controller = new AbortController(); controller.abort(); await assert.rejects(() => addAvatarEffects(root, [{id:99119240, assetType:19}], {signal:controller.signal, deliveryUrl:async () => fixtureUrl}), /Abort|aborted/i);
console.log('PASS: gear XML parsing, enabled static effects, transformed light placement, unmatched meshes, disposal, and abort handling.');
})().catch(error => { console.error(error); process.exitCode = 1; });
