const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),esbuild=require('esbuild');
const nodePaths=[path.resolve(__dirname,'../../renderer-build/node_modules')];
const source=fs.readFileSync(path.resolve(__dirname,'../larpbux-avatar-3d-source.js'),'utf8');
const code=esbuild.buildSync({stdin:{contents:source+'\nexport {THREE,OBJLoader,exportedHead};',resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths,write:false}).outputFiles[0].text;
const m={exports:{}};new Function('module','exports','require',code)(m,m.exports,require);
const {THREE,OBJLoader,restoreGearPose,exportedHead}=m.exports;
const text=zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'fixtures/r15-gear-pose/sword-cane-neutral.obj.gz'))).toString();
function fixture(){return new OBJLoader().parse(text);}
const original=fixture(), posed=fixture(), originalHead=exportedHead(original), targetHead=exportedHead(posed);
assert.equal(originalHead.name,'Player1');
const arm=original.getObjectByName('Player14');
const center=node=>new THREE.Box3().setFromObject(node).getCenter(new THREE.Vector3());
const originalHand=center(arm);
assert.ok(Math.abs(originalHand.x-1.275)<.001);assert.ok(originalHand.y<103,'captured bug has the hand lowered');
// Controlled server pose response: body/gear move; default head has a visibly
// different mesh. This tests composition, not Roblox's remote pose generation.
const move=new THREE.Matrix4().makeTranslation(0,103.8,0).multiply(new THREE.Matrix4().makeRotationX(-80*Math.PI/180)).multiply(new THREE.Matrix4().makeTranslation(0,-103.8,0));
for(const name of ['Player10','Player12','Player14','Handle1'])posed.getObjectByName(name).geometry.applyMatrix4(move);
const pivot=center(targetHead);targetHead.geometry.translate(-pivot.x,-pivot.y,-pivot.z).scale(.7,.8,.7).translate(pivot.x,pivot.y,pivot.z);targetHead.material=new THREE.MeshBasicMaterial({color:'cyan'});
const headGeometry=originalHead.geometry, headMaterial=originalHead.material, headPosition=center(originalHead);
const oldHat=original.getObjectByName('Handle5'),oldHatGeometry=oldHat.geometry;
assert.equal(restoreGearPose(original,posed),true);
assert.equal(exportedHead(posed),originalHead,'chosen dynamic head stays equipped');
assert.equal(originalHead.geometry,headGeometry);assert.equal(originalHead.material,headMaterial);
assert.ok(center(originalHead).distanceTo(headPosition)<1e-5,'head fit remains unchanged');
assert.equal(targetHead.parent,original,'default placeholder is excluded');
assert.equal(oldHat.parent,posed,'original headwear is kept');assert.equal(oldHat.geometry,oldHatGeometry);
assert.ok(center(posed.getObjectByName('Player14')).distanceTo(originalHand)>1,'native posed hand replaces lowered hand');
const raisedSource=fixture(),raisedTarget=fixture(),raisedHead=exportedHead(raisedSource),raisedHeadCenter=center(raisedHead);
raisedTarget.getObjectByName('Player14').geometry.translate(0,4,0);
assert.equal(restoreGearPose(raisedSource,raisedTarget),true);assert.ok(center(raisedHead).distanceTo(raisedHeadCenter)<1e-5,'a raised hand must not be used as the torso anchor');
const same=fixture(),sameTarget=fixture();assert.equal(restoreGearPose(same,sameTarget),false,'working pose is untouched');
const partial=new THREE.Group();partial.add(new THREE.Mesh(new THREE.BoxGeometry()));assert.equal(restoreGearPose(partial,fixture()),false,'unknown export is not modified');
console.log('PASS: captured R15 Sword Cane body adopts pose while retaining exact dynamic head/headwear geometry, material and fit; unchanged and unknown exports stay intact.');
