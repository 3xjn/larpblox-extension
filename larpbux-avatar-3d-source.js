import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {addAvatarEffects} from './larpbux-avatar-effects-source.js';

const CDN = /^https:\/\/[a-z0-9-]+\.rbxcdn\.com\/[A-Za-z0-9._~%/-]+(?:\?[^#]*)?$/;
const HASH = /^[A-Za-z0-9._~-]+$/;
const backgroundUrls = new Map();
const SMOKESTACK_TEXTURES = Object.freeze({normal:6991140417, halloween:6991166143, thanksgiving:6991393806, birthday:2399316028, stpatricks:2399447918, valentines:2399448372});
const SMOKESTACK_STYLES = new Set(['auto', ...Object.keys(SMOKESTACK_TEXTURES), 'christmas', 'aprilfools']);
const smokestackTextures = new Map();
let smokestackMesh;
const TEAPOT_TURRET_ID = 1055299;
const TEAPOT_MESH_ID = 1045320;
const TEAPOT_TEXTURE_ID = 1055256;
let teapotMesh;

// Read the public SpecialMesh used by this exact catalog hat, not an arbitrary
// Handle or the highest accessory. OBJ exports can repack its texture into an atlas.
export function readSmokestackMesh(buffer) {
  const bytes = new Uint8Array(buffer), view = new DataView(buffer);
  const prefix = new TextDecoder().decode(bytes.subarray(0, 32));
  const version = prefix.match(/^version (\d+\.\d+)/)?.[1];
  const start = bytes.indexOf(10) + 1;
  if (!start || !version) throw new Error('Invalid hat mesh');
  if (version === '1.00' || version === '1.01') {
    const lines = new TextDecoder().decode(bytes).trim().split(/\r?\n/);
    const vectors = [...lines.slice(2).join('').matchAll(/\[([^\]]+)\]/g)].map(match => match[1].split(',').map(Number));
    if (vectors.length !== Number(lines[1]) * 9) throw new Error('Invalid hat mesh');
    const positions = [], uvs = [];
    for (let i = 0; i < vectors.length; i += 3) {
      positions.push(...vectors[i].map(n => n * (version === '1.00' ? .5 : 1)));
      uvs.push(vectors[i + 2][0], 1 - vectors[i + 2][1]);
    }
    return {positions, uvs};
  }
  const major = Number(version[0]);
  if (![2,3,4].includes(major) || buffer.byteLength < start + 12) throw new Error('Unsupported hat mesh');
  const headerSize = view.getUint16(start, true);
  const vertexSize = major === 4 ? 40 : view.getUint8(start + 2);
  const faceSize = major === 4 ? 12 : view.getUint8(start + 3);
  const countOffset = start + (major === 3 ? 8 : 4);
  const vertexCount = view.getUint32(countOffset, true), faceCount = view.getUint32(countOffset + 4, true);
  const vertices = start + headerSize;
  const boneCount = major === 4 ? view.getUint16(start + 14, true) : 0;
  const faces = vertices + vertexCount * (vertexSize + (boneCount ? 8 : 0));
  if (vertexSize < 32 || faceSize < 12 || !faceCount || faceCount > 100000 || faces + faceCount * faceSize > buffer.byteLength) throw new Error('Invalid hat mesh');
  const positions = [], uvs = [];
  for (let face = 0; face < faceCount; face++) {
    for (let corner = 0; corner < 3; corner++) {
      const index = view.getUint32(faces + face * faceSize + corner * 4, true);
      if (index >= vertexCount) throw new Error('Invalid hat mesh index');
      const offset = vertices + index * vertexSize;
      for (let axis = 0; axis < 3; axis++) positions.push(view.getFloat32(offset + axis * 4, true));
      uvs.push(view.getFloat32(offset + 24, true), 1 - view.getFloat32(offset + 28, true));
    }
  }
  if (![...positions, ...uvs].every(Number.isFinite)) throw new Error('Invalid hat mesh coordinates');
  return {positions, uvs};
}

function canonicalSmokestackMesh() {
  if (!smokestackMesh) {
    smokestackMesh = deliveryUrl(2399307491).then(url => fetch(url)).then(response => {
      if (!response.ok) throw new Error('Hat mesh unavailable');
      return response.arrayBuffer();
    }).then(readSmokestackMesh);
    smokestackMesh.catch(() => { smokestackMesh = undefined; });
  }
  return smokestackMesh;
}

function canonicalTeapotMesh() {
  if (!teapotMesh) {
    teapotMesh = deliveryUrl(TEAPOT_MESH_ID).then(url => fetch(url)).then(response => {
      if (!response.ok) throw new Error('Teapot mesh unavailable');
      return response.arrayBuffer();
    }).then(readSmokestackMesh);
    teapotMesh.catch(() => { teapotMesh = undefined; });
  }
  return teapotMesh;
}

async function teapotTexture() {
  const url = await deliveryUrl(TEAPOT_TEXTURE_ID);
  const texture = await new THREE.TextureLoader().loadAsync(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function exportedHead(root) {
  let namedHead;
  const parts = [], body = new THREE.Box3();
  root.traverse(part => {
    if (!part.isMesh) return;
    if (/^Head$/i.test(part.name)) namedHead = part;
    else if (/^Player\d+$/i.test(part.name)) {
      const bounds = new THREE.Box3().setFromObject(part);
      if (!bounds.isEmpty()) { parts.push({part, center:bounds.getCenter(new THREE.Vector3()), size:bounds.getSize(new THREE.Vector3())}); body.union(bounds); }
    }
  });
  const center = body.getCenter(new THREE.Vector3());
  const bodyHeight=body.getSize(new THREE.Vector3()).y;
  const headless=parts.find(({center:position,size})=>position.y>center.y && Math.max(size.x,size.y,size.z)<bodyHeight*.03);
  // A gear pose can raise a hand above the face. Favor the upper body axis,
  // rather than letting that small, off-center hand become the portrait's head.
  const score = position => position.y - Math.hypot(position.x - center.x, position.z - center.z);
  if (parts.length >= 10) {
    const median = axis => parts.map(part=>part.center[axis]).sort((a,b)=>a-b)[Math.floor(parts.length/2)];
    const x=median('x'),z=median('z');
    const central=parts.filter(({center:p,size})=>Math.hypot(p.x-x,p.z-z)<=bodyHeight*.12 && size.y>=Math.max(size.x,size.z)*.5);
    if (central.length) return namedHead || headless?.part || central.sort((a,b)=>b.center.y-a.center.y)[0].part;
  }
  parts.sort((a,b) => score(b.center) - score(a.center));
  return namedHead || headless?.part || parts[0]?.part;
}

async function addTeapot(root, definition, signal) {
  if (!(definition?.assets || []).some(asset => Number(asset?.id) === TEAPOT_TURRET_ID)) return null;
  const reference = await raceAbort(canonicalTeapotMesh(), signal);
  let present = false;
  root.traverse(node => {
    if (!present && node.isMesh && smokestackMeshUVs(node.geometry, reference)) present = true;
  });
  if (present) return null;
  const head = exportedHead(root);
  if (!head) throw new Error('Teapot preview has no exported head.');
  const loading = teapotTexture();
  loading.then(texture => { if (signal.aborted) texture.dispose(); }, () => {});
  const texture = await raceAbort(loading, signal);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(reference.positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(reference.uvs, 2));
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({map:texture, color:0xffffff, side:THREE.DoubleSide});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'LarpbloxTeapotTurret';
  const headScale = Number(definition?.scales?.head) > 0 ? Number(definition.scales.head) : 1;
  mesh.scale.setScalar(2.4 * headScale);
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(head);
  const center = bounds.getCenter(new THREE.Vector3());
  const worldPosition = new THREE.Vector3(center.x, bounds.max.y - 0.25 * headScale, center.z - 0.1 * headScale);
  root.worldToLocal(worldPosition);
  mesh.position.copy(worldPosition);
  root.add(mesh);
  return mesh;
}

export function smokestackMeshUVs(geometry, reference) {
  const position = geometry.getAttribute('position');
  const indices = geometry.index;
  const count = indices?.count || position?.count;
  if (!position || count * 3 !== reference.positions.length) return null;
  const point = index => [position.getX(index), position.getY(index), position.getZ(index)];
  const distance = (a,b) => Math.hypot(...a.map((v,i)=>v-b[i]));
  const points = Array.from({length:count},(_,i)=>point(indices ? indices.getX(i) : i));
  const original = Array.from({length:count},(_,i)=>reference.positions.slice(i*3,i*3+3));
  const edges = values => values.flatMap((_,i) => i % 3 ? [] : [distance(values[i],values[i+1]),distance(values[i+1],values[i+2]),distance(values[i+2],values[i])]);
  const actualEdges = edges(points), actualScale = actualEdges.reduce((a,b)=>Math.max(a,b),0);
  if (!actualScale) return null;
  for (const order of [[0,1,2],[2,1,0],[1,2,0],[0,2,1],[2,0,1],[1,0,2]]) {
    const permuted = original.map((_,i)=>original[i-i%3+order[i%3]]);
    const expected = edges(permuted), scale = expected.reduce((a,b)=>Math.max(a,b),0);
    if (!scale || expected.some((value,i)=>Math.abs(value/scale-actualEdges[i]/actualScale) > .015)) continue;
    // OBJLoader expands faces; restoring the original UVs undoes atlas packing.
    if (indices) return null;
    return new THREE.Float32BufferAttribute(points.flatMap((_,i) => {
      const offset = (i-i%3+order[i%3])*2;
      return reference.uvs.slice(offset,offset+2);
    }), 2);
  }
  return null;
}

export function matchEffectMesh(root, reference, mesh) {
  const scale = new THREE.Vector3(mesh.scale.x, mesh.scale.y, mesh.scale.z);
  const offset = new THREE.Vector3(mesh.offset.x, mesh.offset.y, mesh.offset.z);
  const points = Array.from({length:reference.positions.length / 3}, (_,i) => new THREE.Vector3().fromArray(reference.positions,i*3).multiply(scale).add(offset));
  const shaped = {...reference, positions:points.flatMap(p=>p.toArray())};
  let result;
  root.traverse(node => {
    if (result || !node.isMesh || !smokestackMeshUVs(node.geometry, shaped)) return;
    const position = node.geometry.getAttribute('position'), index = node.geometry.index;
    const actual = points.map((_,i)=>new THREE.Vector3().fromBufferAttribute(position,index ? index.getX(i) : i));
    const basis = (a,b,c) => {
      const x=b.clone().sub(a), y=c.clone().sub(a), z=x.clone().cross(y);
      if (z.lengthSq()<1e-12) return;
      z.normalize().multiplyScalar(Math.sqrt(x.length()*y.length()));
      return new THREE.Matrix4().makeBasis(x,y,z).setPosition(a);
    };
    for (const order of [[0,1,2],[2,1,0],[1,2,0],[0,2,1],[2,0,1],[1,0,2]]) {
      const source = points.map((_,i)=>points[i-i%3+order[i%3]]);
      const triangle = source.findIndex((_,i)=>i%3===0 && basis(source[i],source[i+1],source[i+2]));
      if (triangle<0) continue;
      const nativeBasis=basis(source[triangle],source[triangle+1],source[triangle+2]);
      const exportedBasis=basis(actual[triangle],actual[triangle+1],actual[triangle+2]);
      if (!exportedBasis) continue;
      const transform=exportedBasis.multiply(nativeBasis.invert());
      const tolerance=Math.max(new THREE.Box3().setFromBufferAttribute(position).getSize(new THREE.Vector3()).length()*.015,.0001);
      if (source.some((point,i)=>point.clone().applyMatrix4(transform).distanceTo(actual[i])>tolerance)) continue;
      result={node,mapPosition:value=>value.clone().applyMatrix4(transform)};
      break;
    }
  });
  return result;
}

export function smokestackSeason(style = 'auto', date = new Date()) {
  style = SMOKESTACK_STYLES.has(style) ? style : 'auto';
  if (style !== 'auto') return style;
  const month = date.getMonth() + 1, day = date.getDate();
  if (month === 2 && day >= 9 && day <= 16) return 'valentines';
  if (month === 3 && day >= 12 && day <= 19) return 'stpatricks';
  if (month === 4 && day === 1) return 'aprilfools';
  if (month === 8 && day === 27) return 'birthday';
  if (month === 10 && day >= 22 && day <= 31) return 'halloween';
  if (month === 11 && day >= 20 && day <= 30) return 'thanksgiving';
  if (month === 12 && day >= 18 && day <= 27) return 'christmas';
  return 'normal';
}

function urlKey(value) {
  try { const url = new URL(value); return url.pathname.replace(/^\//, ''); } catch { return ''; }
}

export function smokestackTextureMatches(textureUrl, normalTextureUrl) {
  return Boolean(urlKey(textureUrl) && urlKey(textureUrl) === urlKey(normalTextureUrl));
}

async function deliveryUrl(id, signal) {
  const response = await fetch(`https://assetdelivery.roblox.com/v2/assetId/${id}`, {signal, credentials:'include'});
  if (!response.ok) throw new Error('Smokestack texture unavailable');
  return checkedUrl((await response.json()).locations?.[0]?.location);
}

function seasonalTexture(id) {
  if (!smokestackTextures.has(id)) {
    const request = deliveryUrl(id).then(url => new THREE.TextureLoader().loadAsync(url)).then(texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });
    smokestackTextures.set(id, request);
    request.catch(() => smokestackTextures.delete(id));
  }
  return smokestackTextures.get(id);
}

function imageSignature(image) {
  const width = image?.naturalWidth || image?.videoWidth || image?.width, height = image?.naturalHeight || image?.videoHeight || image?.height;
  if (!width || !height || typeof document === 'undefined') return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const context = canvas.getContext('2d', {willReadFrequently:true});
    context.drawImage(image, 0, 0, 16, 16);
    return `${width}x${height}:${Array.from(context.getImageData(0, 0, 16, 16).data).join(',')}`;
  } catch { return null; } // A CDN without readable CORS stays hash-only.
}

async function backgroundUrl(id, signal) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Invalid avatar background');
  if (backgroundUrls.has(id)) return backgroundUrls.get(id);
  let url;
  try {
    // Match ProfilePlatform: resolve the background's ImageId instead of using
    // the square catalog thumbnail, which loses the original image proportions.
    const delivery = await fetch(`https://assetdelivery.roblox.com/v2/assetId/${id}`, {signal, credentials:'include'});
    if (!delivery.ok) throw new Error('Background definition unavailable');
    const location = (await delivery.json()).locations?.[0]?.location;
    const response = await fetch(checkedUrl(location), {signal, credentials:'omit'});
    if (!response.ok) throw new Error('Background definition unavailable');
    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
    const image = [...xml.querySelectorAll('Item[class="IntValue"]')].find(item => item.querySelector('Properties > string[name="Name"]')?.textContent.trim() === 'ImageId');
    const imageId = Number(image?.querySelector('Properties > int64[name="Value"], Properties > int[name="Value"]')?.textContent.trim());
    if (!Number.isSafeInteger(imageId) || imageId <= 0) throw new Error('Invalid background image');
    // Resolve the original image to its CDN location so WebGL can load it
    // without sending account cookies with the texture request.
    const imageDelivery = await fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${imageId}`, {signal, credentials:'include'});
    if (!imageDelivery.ok) throw new Error('Background image unavailable');
    // Native ProfilePlatform uses the original ImageId, never the square catalog
    // thumbnail. Keep the original image bytes and aspect ratio for WebGL/CSS.
    if (CDN.test(imageDelivery.url)) url = imageDelivery.url;
    else {
      const blob = await imageDelivery.blob();
      url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    if (signal.aborted) throw error;
  }
  if (!url) {
    const response = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${id}&size=768x432&format=Png&isCircular=false`, {signal, credentials:'omit'});
    if (!response.ok) throw new Error('Background preview unavailable');
    const item = (await response.json()).data?.find(item => Number(item.targetId) === id);
    if (item?.state !== 'Completed' || !item.imageUrl) throw new Error('Background preview unavailable');
    url = checkedUrl(item.imageUrl);
  }
  if (backgroundUrls.size >= 16) {
    const oldest = backgroundUrls.keys().next().value;
    backgroundUrls.delete(oldest);
  }
  backgroundUrls.set(id, url);
  return url;
}

function shard(hash) {
  let value = 31;
  for (const char of String(hash)) value = (value ^ char.charCodeAt(0)) % 8;
  return value;
}

function assetUrl(hash) {
  if (String(hash).startsWith('https://')) return checkedUrl(hash);
  if (!HASH.test(String(hash))) throw new Error('Invalid Roblox asset hash');
  return `https://t${shard(hash)}.rbxcdn.com/${hash}`;
}

function checkedUrl(value) {
  const url = new URL(value, location.href).href;
  if (!CDN.test(url)) throw new Error('Refused non-CDN avatar asset URL');
  return url;
}

function abortError() { return new DOMException('Avatar load aborted', 'AbortError'); }

function raceAbort(promise, signal) {
  if (signal.aborted) return Promise.reject(abortError());
  let abort;
  return Promise.race([promise, new Promise((_, reject) => {
    abort = () => reject(abortError()); signal.addEventListener('abort', abort, { once: true });
  })]).finally(() => signal.removeEventListener('abort', abort));
}

function viewState(camera, controls) {
  return {
    position: camera.position.toArray(),
    target: controls.target.toArray(),
    zoom: camera.zoom,
  };
}

function applyView(camera, controls, view) {
  if (!view) return false;
  const position = view.position || view.camera?.position;
  const target = view.target || view.controls?.target;
  if (Array.isArray(position) && position.length === 3) camera.position.fromArray(position);
  if (Array.isArray(target) && target.length === 3) controls.target.fromArray(target);
  if (Number.isFinite(view.zoom)) camera.zoom = view.zoom;
  return Array.isArray(position) || Array.isArray(target) || Number.isFinite(view.zoom);
}

function descriptorView(camera) {
  const position = camera?.position;
  const direction = camera?.direction;
  if (!position || !direction) return null;
  const p = new THREE.Vector3(position.x, position.y, position.z);
  const d = new THREE.Vector3(direction.x, direction.y, direction.z);
  return { position: p.toArray(), direction: d.toArray() };
}

export function headshotFrame(root, avatarBox) {
  const size = avatarBox.getSize(new THREE.Vector3());
  const head = exportedHead(root);
  let bounds = head && new THREE.Box3().setFromObject(head);
  if (!bounds || bounds.isEmpty()) {
    bounds = avatarBox.clone();
    bounds.min.y = avatarBox.min.y + size.y * 0.65;
  }
  const headSize = bounds.getSize(new THREE.Vector3());
  const target = bounds.getCenter(new THREE.Vector3());
  const bottom = bounds.min.y - headSize.y * 0.25;
  const top = Math.max(bounds.max.y, avatarBox.max.y);
  // Center the head-and-headwear region; centering only the face leaves
  // an equally tall empty region below it and pulls the torso into the portrait.
  target.y = (bottom + top) / 2;
  const radius = Math.max(Math.hypot(headSize.x / 2, Math.max(top - target.y, target.y - bottom)), headSize.z / 2, 0.25) * 1.1;
  return {target, radius};
}

export function avatarMaterials(mtlText, manager) {
  const materials = new MTLLoader(manager).parse(mtlText, '');
  materials.preload();
  for (const [name, material] of Object.entries(materials.materials)) {
    const info = materials.materialsInfo[name];
    const overlay = material.map && info.rbx_alphamode?.trim().toLowerCase() === 'overlay';
    // Only the exported Player# atlas has baked skin/clothing colors. Accessories
    // (including red/black hats) still rely on their material Kd tint.
    const bakedBody = /^Player\d+Mtl$/i.test(name);
    if (overlay) {
      // Dynamic heads use texture alpha to blend a face over the Kd skin color,
      // not to cut holes in the head. Keep material opacity independent of it.
      material.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
          THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;',
            'diffuseColor.rgb = mix( diffuseColor.rgb, sampledDiffuseColor.rgb, sampledDiffuseColor.a );'));
      };
    } else if (material.map && bakedBody) material.color.setHex(0xffffff);
    // RGBA diffuse maps already supply alpha. Reusing them as map_d instead
    // multiplies opacity by the green color channel and erases dark clothing.
    const textureKey = texture => {
      const image = texture?.image;
      const source = image?.currentSrc || image?.src || texture?.userData?.url || '';
      try { const parsed = new URL(source); const host = parsed.hostname.toLowerCase().split('.').slice(-2).join('.'); return `${host}${parsed.pathname.replace(/^\/+/, '')}`; }
      catch { return String(source).replace(/[?#].*$/, '').replace(/^\/+/, ''); }
    };
    const sameTexture = material.alphaMap && material.map && (
      material.alphaMap === material.map ||
      (material.alphaMap.image && material.map.image && material.alphaMap.image === material.map.image) ||
      (textureKey(material.alphaMap) && textureKey(material.alphaMap) === textureKey(material.map))
    );
    if (material.alphaMap && (overlay || sameTexture || (info.map_kd && info.map_d &&
      textureKey({userData: {url: info.map_kd}}) === textureKey({userData: {url: info.map_d}})))) {
      if (material.alphaMap !== material.map) material.alphaMap.dispose();
      material.alphaMap = null;
      material.transparent = material.opacity < 1;
    }
    // Cut out fully transparent texels without making solid avatar parts translucent.
    if (material.map || material.alphaMap) material.alphaTest = 0.01;
    // Keep thumbnail texture highlights from receiving an additional Phong sheen.
    material.specular.setHex(0x000000);
    material.side = THREE.DoubleSide;
  }
  return materials;
}

export function repairCoincidentFaces(root) {
  let repaired = 0;
  root.traverse(node => {
    if (!node.isMesh) return;
    const positions = node.geometry.getAttribute('position'), indices = node.geometry.index;
    if (!positions) return;
    const count = indices?.count || positions.count, seen = new Set();
    for (let face = 0; face + 2 < count; face += 3) {
      const vertices = [0,1,2].map(corner => {
        const index = indices ? indices.getX(face + corner) : face + corner;
        return [positions.getX(index),positions.getY(index),positions.getZ(index)].map(value => Math.round(value * 100000)).join(',');
      });
      if (new Set(vertices).size !== 3) continue;
      const first = vertices.indexOf([...vertices].sort()[0]);
      const a=vertices[first], b=vertices[(first+1)%3], c=vertices[(first+2)%3];
      if (seen.has(`${a}|${c}|${b}`)) {
        // Old accessories model their inside explicitly with reversed faces.
        // Drawing both sides makes those coincident faces fight for depth.
        const front = material => {
          const copy=material.clone(); copy.side=THREE.FrontSide;
          copy.onBeforeCompile=material.onBeforeCompile;
          copy.customProgramCacheKey=material.customProgramCacheKey;
          return copy;
        };
        node.material=Array.isArray(node.material) ? node.material.map(front) : front(node.material);
        repaired++; break;
      }
      seen.add(`${a}|${b}|${c}`);
    }
  });
  return repaired;
}

async function findSmokestack(root, signal) {
  // The exported OBJ does not retain the asset id. Its normal texture does,
  // so only touch meshes whose loaded diffuse map is Smokestack's known file.
  const parts = [];
  try {
    const normalTexture = await raceAbort(seasonalTexture(SMOKESTACK_TEXTURES.normal), signal);
    const normal = urlKey(normalTexture.image?.currentSrc || normalTexture.image?.src || '');
    const normalPixels = imageSignature(normalTexture.image);
    root.traverse(node => {
      if (!node.isMesh) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((material, index) => {
        const image = material?.map?.image;
        const source = image?.currentSrc || image?.src || '';
        if (urlKey(source) !== normal && (!normalPixels || imageSignature(image) !== normalPixels)) return;
        const isolated = material.clone();
        if (Array.isArray(node.material)) { node.material = [...node.material]; node.material[index] = isolated; }
        else node.material = isolated;
        parts.push({node, material:isolated, index, original:material.map, visible:node.visible, current:null});
      });
    });
  } catch (error) { if (signal.aborted) throw error; }
  if (!parts.length) {
    const reference = await raceAbort(canonicalSmokestackMesh(), signal);
    const matches = [];
    root.traverse(node => {
      if (!node.isMesh || Array.isArray(node.material)) return;
      const nativeUV = smokestackMeshUVs(node.geometry, reference);
      if (nativeUV) matches.push({node, nativeUV});
    });
    if (matches.length === 1) {
      const {node, nativeUV} = matches[0];
      // An exported atlas material can be shared with other items. Isolate it.
      node.material = node.material.clone();
      parts.push({node, material:node.material, original:node.material.map, visible:node.visible, current:null, nativeUV, exportedUV:node.geometry.getAttribute('uv')});
    }
  }
  return parts;
}

function seasonalHatEffect(scene, parts, style) {
  if (!parts.length || !['halloween', 'thanksgiving', 'christmas', 'birthday', 'stpatricks', 'valentines'].includes(style)) return null;
  const box = new THREE.Box3();
  parts.forEach(part => box.expandByObject(part.node));
  if (box.isEmpty()) return null;
  const center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
  const color = {halloween:0xff742e, thanksgiving:0xe7a738, christmas:0xf6fbff, birthday:0xf24c79, stpatricks:0x41b764, valentines:0xf06292}[style];
  const positions = [];
  for (let i = 0; i < 16; i++) {
    const angle = i * 2.399963229728653;
    positions.push(center.x + Math.cos(angle) * (size.x * .6 + (i % 3) * .025), center.y + size.y * .25 + (i % 5) * size.y * .16, center.z + Math.sin(angle) * (size.z * .6 + (i % 3) * .025));
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({color, size:Math.max(size.length() * .07, .035), sizeAttenuation:true, transparent:true, opacity:.9}));
  points.name = 'LarpbloxSmokestackEffect';
  scene.add(points);
  return points;
}

const cleanupObject = object => object?.traverse?.(node => {
    node.geometry?.dispose();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (!material) continue;
      for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap']) material[key]?.dispose?.();
      material.dispose?.();
    }
  });

async function loadAvatarModel(descriptorUrl, signal) {
    const descriptorResponse = await fetch(checkedUrl(descriptorUrl), { signal });
    if (!descriptorResponse.ok) throw new Error(`Avatar descriptor failed (${descriptorResponse.status})`);
    const descriptor = await descriptorResponse.json();
    if (signal.aborted) throw abortError();
    const objUrl = assetUrl(descriptor.obj);
    const mtlUrl = assetUrl(descriptor.mtl);
    const textureUrls = new Map((descriptor.textures || []).map(hash => [String(hash), assetUrl(hash)]));
    const [objText, mtlText] = await Promise.all([
      fetch(objUrl, { signal }).then(response => { if (!response.ok) throw new Error('Avatar OBJ failed'); return response.text(); }),
      fetch(mtlUrl, { signal }).then(response => { if (!response.ok) throw new Error('Avatar MTL failed'); return response.text(); }),
    ]);
    if (signal.aborted) throw abortError();

    const manager = new THREE.LoadingManager();
    manager.setURLModifier(raw => {
      if (String(raw).startsWith('https://')) return checkedUrl(raw);
      const name = decodeURIComponent(String(raw)).split(/[\\/]/).pop();
      const hash = name.replace(/\.[^/.]+$/, '');
      const url = textureUrls.get(name) || textureUrls.get(hash) || (HASH.test(name) ? assetUrl(name) : null);
      return checkedUrl(url || raw);
    });
    let started = false;
    let resolveReady;
    const ready = new Promise((resolve, reject) => {
      resolveReady = resolve;
      manager.onStart = () => { started = true; };
      manager.onLoad = resolve;
      manager.onError = () => reject(new Error('Roblox could not load an avatar texture.'));
    });
    const materials = avatarMaterials(mtlText, manager);
    const root = new OBJLoader(manager).setMaterials(materials).parse(objText);
    repairCoincidentFaces(root);
    if (!started) resolveReady();
    try {
      await raceAbort(ready, signal);
      if (signal.aborted) throw abortError();
      return {root, descriptor, objText, mtlText};
    } catch(error) { cleanupObject(root);throw error; }
}

export function restoreGearPose(original, posed) {
  const head = exportedHead(original), placeholder = exportedHead(posed);
  const body = root => { const parts=[];root.traverse(node=>{if(node.isMesh && /^Player\d+$/i.test(node.name))parts.push(node);});return parts; };
  const sourceParts=body(original).filter(node=>node!==head), posedParts=body(posed).filter(node=>node!==placeholder);
  if (!head || !placeholder || sourceParts.length!==14 || posedParts.length!==14) return false;
  const center=node=>new THREE.Box3().setFromObject(node).getCenter(new THREE.Vector3());
  // Keep a working native export untouched. Only replace a body whose pose differs.
  if (!sourceParts.some(node=>posedParts.every(target=>center(node).distanceTo(center(target))>.02))) return false;
  const torso=(parts,head)=>{
    const h=center(head), candidates=parts.map(node=>({node,p:center(node)}));
    const distance=p=>Math.hypot(p.x-h.x,p.z-h.z);
    const axis=Math.min(...candidates.map(({p})=>distance(p)));
    return candidates.filter(({p})=>distance(p)<=axis+.05).sort((a,b)=>b.p.y-a.p.y)[0].node;
  };
  const offset=center(torso(posedParts,placeholder)).sub(center(torso(sourceParts,head)));
  // Gear thumbnail poses articulate the body; keep the chosen head's mesh,
  // scale, texture and fit at the neck instead of using the default placeholder.
  const headBounds=new THREE.Box3().setFromObject(head), headHeight=headBounds.getSize(new THREE.Vector3()).y;
  const headwear=[];
  original.traverse(node=>{
    if (!node.isMesh || /^Player\d+$/i.test(node.name)) return;
    const bounds=new THREE.Box3().setFromObject(node);
    if (bounds.min.y<headBounds.min.y-headHeight*.5 || bounds.getCenter(new THREE.Vector3()).y<headBounds.min.y) return;
    const positions=node.geometry.getAttribute('position'),index=node.geometry.index;
    const reference={uvs:[],positions:Array.from({length:index?.count || positions.count},(_,i)=>new THREE.Vector3().fromBufferAttribute(positions,index?index.getX(i):i).toArray()).flat()};
    const match=matchEffectMesh(posed,reference,{scale:{x:1,y:1,z:1},offset:{x:0,y:0,z:0}});
    if (match && !/^Player\d+$/i.test(match.node.name))headwear.push({node,placeholder:match.node});
  });
  for(const item of headwear){item.node.position.add(offset);original.attach(item.placeholder);posed.attach(item.node);}
  head.position.add(offset);
  original.attach(placeholder);
  posed.attach(head);
  return true;
}

export async function create(host, descriptorUrl, options = {}) {
  if (!host || typeof host.append !== 'function') throw new TypeError('A host element is required');
  const internal = new AbortController();
  const signal = internal.signal;
  const external = options.signal;
  const abort = () => internal.abort();
  external?.addEventListener('abort', abort, { once: true });
  if (external?.aborted) internal.abort();
  let disposed = false;
  let renderer;
  let controls;
  let scene;
  let camera;
  let canvas;
  let resizeObserver;
  let root;
  let animationFrame;
  let backgroundTexture;
  let smokestackParts = [];
  let teapotPart;
  let smokestackEffect;
  let styleGeneration = 0;
  let smokestackPartsReady;
  let gearEffects;
  let poseResources;
  let gearPose={applied:false};
  let appliedHatSeason;

  const fitBackground = aspect => {
    if (!backgroundTexture) return;
    const image = backgroundTexture.image;
    const imageAspect = image.width / image.height;
    const width = Math.min(1, aspect / imageAspect), height = Math.min(1, imageAspect / aspect);
    backgroundTexture.repeat.set(width, height);
    backgroundTexture.offset.set((1 - width) / 2, (1 - height) / 2);
    backgroundTexture.updateMatrix();
  };

  const ensureAlive = () => { if (disposed || signal.aborted) throw abortError(); };


  try {
    const model = await loadAvatarModel(descriptorUrl, signal);
    const {descriptor, objText, mtlText} = model;
    root = model.root;
    ensureAlive();
    if (options.poseDescriptorUrl && options.poseDescriptorUrl!==descriptorUrl) {
      let posed;
      try {
        posed=await loadAvatarModel(options.poseDescriptorUrl,signal);
        ensureAlive();
        if (restoreGearPose(root,posed.root)) {
          poseResources=root;root=posed.root;gearPose={applied:true,descriptorUrl:options.poseDescriptorUrl};posed=undefined;
        }
      } catch(error) { if(signal.aborted) throw error; }
      finally { if(posed)cleanupObject(posed.root); }
    }
    teapotPart = await addTeapot(root, options.definition, signal);
    ensureAlive();
    // Do not request the hat's assets for avatars that do not wear it.
    smokestackPartsReady = (options.definition?.assets || []).some(asset => Number(asset?.id) === 169444515) ? findSmokestack(root, signal) : Promise.resolve([]);

    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', '3D avatar preview');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.background = 'transparent';
    host.append(canvas);
    scene = new THREE.Scene();
    const backgroundId = options.definition?.backgroundRequestModel?.id;
    if (backgroundId) {
     try {
      const url = await backgroundUrl(backgroundId, signal);
      const loading = new THREE.TextureLoader().loadAsync(url);
      loading.then(texture => { if (signal.aborted || disposed) texture.dispose(); }, () => {});
      backgroundTexture = await raceAbort(loading, signal);
      ensureAlive();
      backgroundTexture.colorSpace = THREE.SRGBColorSpace;
      if (options.background !== false) scene.background = backgroundTexture;
     } catch (error) {
      if (signal.aborted) throw error;
      // A background outage must never prevent avatar geometry or portraits.
     }
    }
    camera = new THREE.PerspectiveCamera(descriptor.camera?.fov || 35, 1, 0.01, 10000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xffffff, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    // Neutral fill keeps dark clothing readable; opposing lights give the
    // model shape without a glossy hotspot. PI compensates modern Phong units.
    scene.add(new THREE.AmbientLight(0xffffff, Math.PI * 0.65));
    const keyLight = new THREE.DirectionalLight(0xffffff, Math.PI * 0.45);
    keyLight.position.set(-3, 5, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, Math.PI * 0.2);
    fillLight.position.set(3, 2, -5);
    scene.add(fillLight);
    controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.autoRotate = !options.static;
    controls.autoRotateSpeed = 4;
    controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    scene.add(root);
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.length() / 2, 0.5);
    const effectItems = (options.items || []).filter(item => options.definition?.assets?.some(asset=>Number(asset.id)===Number(item.id)));
    if (effectItems.length) {
      const effectsController = new AbortController(), abortEffects = () => effectsController.abort();
      signal.addEventListener('abort',abortEffects,{once:true});
      const timer=setTimeout(abortEffects,3000);
      try {
        gearEffects=await addAvatarEffects(root,effectItems,{signal:effectsController.signal,deliveryUrl,
          readMesh:async id=>{const response=await fetch(await deliveryUrl(id,effectsController.signal),{signal:effectsController.signal}); if(!response.ok) throw new Error('Effect mesh unavailable'); return readSmokestackMesh(await response.arrayBuffer());},
          matchMesh:matchEffectMesh});
        gearEffects.update(1);
      } catch (error) { if(signal.aborted) throw error; }
      finally {clearTimeout(timer);signal.removeEventListener('abort',abortEffects);}
    }
    const saved = typeof options.view === 'function' ? options.view() : options.view;
    const hadView = applyView(camera, controls, saved);
    let autoFrame = !hadView;
    if (!hadView) {
      const descriptorCamera = descriptorView(descriptor.camera);
      if (descriptorCamera) {
        camera.position.fromArray(descriptorCamera.position);
        controls.target.copy(center);
      } else camera.position.set(center.x, center.y + radius * 0.15, center.z + radius * 2.4);
      controls.target.copy(center);
    }
    camera.near = Math.max(radius / 100, 0.01);
    camera.far = Math.max(radius * 100, 100);
    controls.minDistance = Math.max(radius * 0.35, 0.05);
    controls.maxDistance = Math.max(radius * 8, 2);
    camera.updateProjectionMatrix();
    controls.update();
    const render = () => { if (!disposed) renderer.render(scene, camera); };
    const setHatStyle = async style => {
      const generation = ++styleGeneration;
      const season = smokestackSeason(style);
      const wearingSmokestack = (options.definition?.assets || []).some(asset => Number(asset?.id) === 169444515);
      try {
        const parts = await raceAbort(smokestackPartsReady, signal);
        if (generation !== styleGeneration || disposed) return false;
        smokestackParts = parts;
        if (!parts.length) {
          if (wearingSmokestack) throw new Error('Smokestack hat texture was not found in this avatar export.');
          return false;
        }
        if (season === appliedHatSeason) return true;
        const textureId = SMOKESTACK_TEXTURES[season];
        const texture = textureId ? await raceAbort(seasonalTexture(textureId), signal) : null;
        if (generation !== styleGeneration || disposed) return false;
        smokestackEffect?.removeFromParent();
        smokestackEffect?.geometry.dispose();
        smokestackEffect?.material.dispose();
        smokestackEffect = undefined;
        for (const part of parts) {
          if (part.nativeUV) part.node.geometry.setAttribute('uv', texture ? part.nativeUV : part.exportedUV);
          part.node.visible = season === 'aprilfools' ? false : part.visible;
          part.current?.dispose();
          part.current = null;
          part.material.map = part.original;
          part.material.needsUpdate = true;
        }
        if (texture) {
          for (const part of parts) {
            part.current = texture.clone();
            part.material.map = part.current;
            part.material.needsUpdate = true;
          }
        }
        if (generation !== styleGeneration || disposed) return false;
        smokestackEffect = seasonalHatEffect(scene, parts, season);
        appliedHatSeason = season;
        render();
        return true;
      } catch (error) {
        if (signal.aborted || error?.name === 'AbortError') throw error;
        throw new Error(`Smokestack style could not load: ${error?.message || 'texture unavailable'}`);
      }
    };
    controls.addEventListener('change', render);
    controls.addEventListener('start', () => { autoFrame = false; });
    const keydown = event => {
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (event.key === 'ArrowLeft') spherical.theta += 0.15;
      else if (event.key === 'ArrowRight') spherical.theta -= 0.15;
      else if (event.key === 'ArrowUp') spherical.phi = Math.max(0.05, spherical.phi - 0.15);
      else if (event.key === 'ArrowDown') spherical.phi = Math.min(Math.PI - 0.05, spherical.phi + 0.15);
      else if (event.key === '+' || event.key === '=') spherical.radius /= 1.1;
      else if (event.key === '-') spherical.radius *= 1.1;
      else return;
      spherical.radius = THREE.MathUtils.clamp(spherical.radius, controls.minDistance, controls.maxDistance);
      camera.position.setFromSpherical(spherical).add(controls.target);
      controls.update();
      event.preventDefault();
    };
    canvas.tabIndex = 0;
    canvas.addEventListener('keydown', keydown);
    const resize = () => {
      const width = host.clientWidth || 280;
      const height = host.clientHeight || 340;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      fitBackground(camera.aspect);
      if (autoFrame) {
        const fitDistance = radius / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(camera.aspect, 1));
        const offset = camera.position.clone().sub(controls.target);
        const distance = Math.max(offset.length(), fitDistance * 1.08);
        camera.position.copy(controls.target).add(offset.normalize().multiplyScalar(distance));
      }
      camera.updateProjectionMatrix();
      render();
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    let previousTime;
    const animate = time => {
      if (disposed) return;
      const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 0.25);
      previousTime = time;
      gearEffects?.update(time / 1000);
      if (!document.hidden && host.isConnected && host.getClientRects().length) controls.update(delta);
      animationFrame = requestAnimationFrame(animate);
    };
    if (!options.static) animationFrame = requestAnimationFrame(animate);
    const savedHat = options.definition?.assets?.find(asset => Number(asset?.id) === 169444515);
    if (savedHat) await setHatStyle(savedHat.meta?.smokestackStyle || 'auto');
    external?.removeEventListener('abort', abort);
    return {
      capture(kind = 'fullBody', options = {}) {
        ensureAlive();
        const photoCamera = camera.clone();
        photoCamera.aspect = 1;
        if (kind === 'headshot') {
          const {target, radius: photoRadius} = headshotFrame(root, box);
          photoCamera.fov = 35;
          const direction = new THREE.Vector3(0, 0, -1);
          photoCamera.position.copy(target).addScaledVector(direction, photoRadius / Math.sin(THREE.MathUtils.degToRad(photoCamera.fov / 2)));
          photoCamera.lookAt(target);
        }
        photoCamera.updateProjectionMatrix();
        const previousSize = renderer.getSize(new THREE.Vector2());
        const previousBackground = scene.background;
        try {
          if (options.background === false) scene.background = null;
          renderer.setSize(420, 420, false);
          fitBackground(1);
          renderer.render(scene, photoCamera);
          return canvas.toDataURL('image/png');
        } finally {
          scene.background = previousBackground;
          renderer.setSize(previousSize.x, previousSize.y, false);
          fitBackground(camera.aspect);
          render();
        }
      },
      getBackgroundUrl: () => backgroundTexture?.image?.currentSrc || backgroundTexture?.image?.src || '',
      getBackgroundAspect: () => {
        const image = backgroundTexture?.image;
        return image?.width > 0 && image?.height > 0 ? image.width / image.height : 1;
      },
      getView: () => viewState(camera, controls),
      setHatStyle,
      getDiagnostics: () => ({version: 1, descriptorUrl, descriptor, objText, mtlText, avatarDefinition: options.definition, view: viewState(camera, controls), gearEffects:gearEffects?.diagnostics || [], gearPose, teapot:{present:Boolean(teapotPart), position:teapotPart?.getWorldPosition(new THREE.Vector3()).toArray(), scale:teapotPart?.scale.toArray()}, smokestack:{season:appliedHatSeason, matchedParts:smokestackParts.length, visible:smokestackParts.map(part => part.node.visible), textures:smokestackParts.map(part => part.material.map?.image?.currentSrc || part.material.map?.image?.src || '')}}),
      dispose() {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(animationFrame);
        internal.abort();
        external?.removeEventListener('abort', abort);
        resizeObserver?.disconnect();
        controls?.dispose();
        canvas?.removeEventListener('keydown', keydown);
        gearEffects?.dispose();
        cleanupObject(root);
        cleanupObject(poseResources);
        for (const texture of new Set(smokestackParts.map(part => part.original))) texture.dispose();
        smokestackEffect?.geometry.dispose();
        smokestackEffect?.material.dispose();
        backgroundTexture?.dispose();
        renderer?.dispose();
        renderer?.forceContextLoss();
        canvas?.remove();
      },
    };
  } catch (error) {
    const wasAborted = signal.aborted || error?.name === 'AbortError';
    disposed = true;
    cancelAnimationFrame(animationFrame);
    internal.abort();
    external?.removeEventListener('abort', abort);
    resizeObserver?.disconnect();
    controls?.dispose();
    cleanupObject(root);
    cleanupObject(poseResources);
    smokestackEffect?.geometry.dispose();
    smokestackEffect?.material.dispose();
    backgroundTexture?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    canvas?.remove();
    if (wasAborted) throw abortError();
    throw error;
  }
}
