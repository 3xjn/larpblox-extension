import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const CDN = /^https:\/\/[a-z0-9-]+\.rbxcdn\.com\/[A-Za-z0-9._~%/-]+(?:\?[^#]*)?$/;
const HASH = /^[A-Za-z0-9._~-]+$/;
const backgroundUrls = new Map();
const SMOKESTACK_TEXTURES = Object.freeze({normal:6991140417, halloween:6991166143, thanksgiving:6991393806, birthday:2399316028, stpatricks:2399447918, valentines:2399448372});
const SMOKESTACK_STYLES = new Set(['auto', ...Object.keys(SMOKESTACK_TEXTURES), 'christmas', 'aprilfools']);
const smokestackTextures = new Map();
let smokestackMesh;

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
  // Numbered Player meshes are body parts in export order, not anatomy order.
  // Accessories use Handle names; the highest body-part center is the head.
  let namedHead, exportedHead, highest = -Infinity;
  root.traverse(part => {
    if (!part.isMesh) return;
    if (/^Head$/i.test(part.name)) namedHead = part;
    else if (/^Player\d+$/i.test(part.name)) {
      const y = new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3()).y;
      if (y > highest) { highest = y; exportedHead = part; }
    }
  });
  const size = avatarBox.getSize(new THREE.Vector3());
  const head = namedHead || exportedHead;
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
    // Roblox atlases already contain clothing and skin colors. Applying the
    // exported part's Kd tint again recolors the entire atlas (e.g. white sleeves tan).
    if (overlay) {
      // Dynamic heads use texture alpha to blend a face over the Kd skin color,
      // not to cut holes in the head. Keep material opacity independent of it.
      material.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
          THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;',
            'diffuseColor.rgb = mix( diffuseColor.rgb, sampledDiffuseColor.rgb, sampledDiffuseColor.a );'));
      };
    } else if (material.map) material.color.setHex(0xffffff);
    // RGBA diffuse maps already supply alpha. Reusing them as map_d instead
    // multiplies opacity by the green color channel and erases dark clothing.
    if (material.alphaMap && (overlay || info.map_kd && info.map_kd === info.map_d)) {
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
  let smokestackEffect;
  let styleGeneration = 0;
  let smokestackPartsReady;
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
  const cleanupObject = object => object?.traverse?.(node => {
    node.geometry?.dispose();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (!material) continue;
      for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap']) material[key]?.dispose?.();
      material.dispose?.();
    }
  });

  try {
    const descriptorResponse = await fetch(checkedUrl(descriptorUrl), { signal });
    if (!descriptorResponse.ok) throw new Error(`Avatar descriptor failed (${descriptorResponse.status})`);
    const descriptor = await descriptorResponse.json();
    ensureAlive();
    const objUrl = assetUrl(descriptor.obj);
    const mtlUrl = assetUrl(descriptor.mtl);
    const textureUrls = new Map((descriptor.textures || []).map(hash => [String(hash), assetUrl(hash)]));
    const [objText, mtlText] = await Promise.all([
      fetch(objUrl, { signal }).then(response => { if (!response.ok) throw new Error('Avatar OBJ failed'); return response.text(); }),
      fetch(mtlUrl, { signal }).then(response => { if (!response.ok) throw new Error('Avatar MTL failed'); return response.text(); }),
    ]);
    ensureAlive();

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
    root = new OBJLoader(manager).setMaterials(materials).parse(objText);
    if (!started) resolveReady();
    await raceAbort(ready, signal);
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
      getDiagnostics: () => ({version: 1, descriptorUrl, descriptor, objText, mtlText, avatarDefinition: options.definition, view: viewState(camera, controls), smokestack:{season:appliedHatSeason, matchedParts:smokestackParts.length, visible:smokestackParts.map(part => part.node.visible), textures:smokestackParts.map(part => part.material.map?.image?.currentSrc || part.material.map?.image?.src || '')}}),
      dispose() {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(animationFrame);
        internal.abort();
        external?.removeEventListener('abort', abort);
        resizeObserver?.disconnect();
        controls?.dispose();
        canvas?.removeEventListener('keydown', keydown);
        cleanupObject(root);
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
