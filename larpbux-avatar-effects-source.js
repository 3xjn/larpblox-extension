import * as THREE from 'three';
import sparkleAsset from './assets/roblox-sparkles.json';

let sparkleTexture;
async function nativeSparkleTexture() {
  if (typeof document === 'undefined') return null;
  if (!sparkleTexture) sparkleTexture = new THREE.TextureLoader().loadAsync(sparkleAsset.dataUrl).catch(error => { sparkleTexture = undefined; throw error; });
  return (await sparkleTexture).clone();
}

// Public, read-only gear metadata.  Tool scripts are deliberately never loaded or run.
const cache = new Map();
const DEFAULT_DELIVERY = async id => {
  const response = await fetch(`https://assetdelivery.roblox.com/v2/assetId/${id}`);
  if (!response.ok) throw new Error(`Gear metadata failed (${response.status})`);
  const location = (await response.json())?.locations?.[0]?.location;
  if (!location) throw new Error('Gear metadata has no public location.');
  return location;
};
const number = (text, fallback = 0) => text != null && String(text).trim() !== '' && Number.isFinite(Number(text)) ? Number(text) : fallback;
const property = (body, tag, name) => {
  const match = body.match(new RegExp(`<${tag} name=["']${name}["'][^>]*>([\\s\\S]*?)</${tag}>`));
  return match?.[1]?.trim() || '';
};
const vector = body => ({x:number(body.match(/<X>([^<]*)<\/X>/)?.[1]), y:number(body.match(/<Y>([^<]*)<\/Y>/)?.[1]), z:number(body.match(/<Z>([^<]*)<\/Z>/)?.[1])});
const color = body => ({r:number(body.match(/<R>([^<]*)<\/R>/)?.[1]), g:number(body.match(/<G>([^<]*)<\/G>/)?.[1]), b:number(body.match(/<B>([^<]*)<\/B>/)?.[1])});
const enabled = body => property(body, 'bool', 'Enabled').toLowerCase() === 'true';
const sequence = body => (body.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
const assetId = body => property(body, 'Content', 'Texture').match(/(?:id=|rbxassetid:\/\/)(\d+)/i)?.[1];
function itemTree(xml) {
  const nodes = [], stack = [];
  for (const token of xml.matchAll(/<Item class="([^"]+)"[^>]*>|<\/Item>/g)) {
    if (token[1]) { const node = {className:token[1], start:token.index + token[0].length, end:0, parent:stack.at(-1)}; nodes.push(node); stack.push(nodes.length - 1); }
    else { const index = stack.pop(); if (index !== undefined) nodes[index].end = token.index; }
  }
  return nodes;
}
const objectBlocks = (xml, classes, parentClass) => {
  const nodes = itemTree(xml), wanted = new Set(classes);
  return nodes.filter(node => wanted.has(node.className) && (!parentClass || nodes[node.parent]?.className === parentClass))
    .map(node => ({...node, body:xml.slice(node.start, node.end)}));
};
const direct = body => body.split('<Item', 1)[0];

function parse(xml) {
  xml = xml.replace(/<!--[\s\S]*?-->/g, '').replace(/<ProtectedString[\s\S]*?<\/ProtectedString>/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
  const nodes = itemTree(xml), blocks = (classes, parentClass) => {
    const wanted = new Set(classes);
    return nodes.filter(node => wanted.has(node.className) && (!parentClass || nodes[node.parent]?.className === parentClass)).map((node, index) => ({...node, index:nodes.indexOf(node), body:xml.slice(node.start, node.end)}));
  };
  const handle = blocks(['Part']).find(item => property(direct(item.body), 'string', 'Name') === 'Handle');
  const handleIndex = handle ? handle.index : -1;
  const special = handle && blocks(['SpecialMesh'], 'Part').find(item => item.parent === handleIndex && property(direct(item.body), 'string', 'Name') === 'Mesh');
  const mesh = special ? {
    id: property(special.body, 'Content', 'MeshId').match(/id[=\/](\d+)/i)?.[1],
    scale: vector(property(special.body, 'Vector3', 'Scale')),
    offset: vector(property(special.body, 'Vector3', 'Offset')),
  } : null;
  const attachments = new Map(blocks(['Attachment'], 'Part').filter(item => item.parent === handleIndex).map(item => [property(direct(item.body), 'string', 'Name'), vector(property(direct(item.body), 'CoordinateFrame', 'CFrame'))]));
  const staticEffects = [];
  for (const item of blocks(['Sparkles', 'PointLight'], 'Part').filter(item => item.parent === handleIndex)) {
    if (!enabled(item.body)) continue;
    const name = property(direct(item.body), 'string', 'Name');
    if (item.className === 'Sparkles') staticEffects.push({kind:'sparkles', name, color:color(property(item.body, 'Color3', 'SparkleColor'))});
    if (item.className === 'PointLight') staticEffects.push({kind:'pointLight', name, color:color(property(item.body, 'Color3', 'Color')), brightness:number(property(item.body, 'float', 'Brightness')), range:number(property(item.body, 'float', 'Range'))});
  }
  const emitters = blocks(['ParticleEmitter']).filter(item => item.parent === handleIndex || nodes[item.parent]?.className === 'Attachment' && nodes[item.parent]?.parent === handleIndex)
    .filter(item => enabled(item.body)).map(item => ({kind:'particleEmitter', textureId:assetId(item.body), parentIndex:item.parent,
      rate:number(property(item.body, 'float', 'Rate')), lifetime:sequence(property(item.body, 'NumberRange', 'Lifetime')),
      speed:sequence(property(item.body, 'NumberRange', 'Speed')), size:sequence(property(item.body, 'NumberSequence', 'Size')),
      transparency:sequence(property(item.body, 'NumberSequence', 'Transparency')), color:sequence(property(item.body, 'ColorSequence', 'Color')),
      acceleration:vector(property(item.body, 'Vector3', 'Acceleration')), rotation:sequence(property(item.body, 'NumberRange', 'Rotation')),
      rotSpeed:sequence(property(item.body, 'NumberRange', 'RotSpeed')), spread:sequence(property(item.body, 'Vector2', 'SpreadAngle')),
      direction:number(property(item.body,'token','EmissionDirection'),1), drag:number(property(item.body,'float','Drag')),
      lightEmission:number(property(item.body,'float','LightEmission')),
      parentPosition:nodes[item.parent]?.className === 'Attachment' ? vector(property(direct(xml.slice(nodes[item.parent].start, nodes[item.parent].end)), 'CoordinateFrame', 'CFrame')) : {x:0,y:0,z:0}}));
  const trails = blocks(['Trail'], 'Part').filter(item => item.parent === handleIndex && enabled(item.body)).map(item => ({
    kind:'trail', name:property(direct(item.body), 'string', 'Name'),
    attachment0:property(item.body, 'Ref', 'Attachment0'), attachment1:property(item.body, 'Ref', 'Attachment1'),
  }));
  return {mesh, attachments, staticEffects:[...staticEffects,...emitters], trails,
    disabledEmitters:objectBlocks(xml, ['ParticleEmitter', 'Fire', 'Smoke']).filter(item => !enabled(item.body)).length};
}

const disposeObject = object => object?.traverse(part => { part.geometry?.dispose?.(); part.material?.map?.dispose?.(); part.material?.dispose?.(); });

async function emitterPoints(node, effect, mapPosition, deliveryUrl, signal) {
  if (!effect.textureId || typeof document === 'undefined') return null;
  const lifetime=Math.max(...effect.lifetime,.01), count=Math.min(32,Math.ceil(effect.rate*lifetime));
  if (!count) return null;
  const location=await deliveryUrl(effect.textureId,signal);
  const texture=await new Promise((resolve,reject)=>{
    const abort=()=>reject(new DOMException('Aborted','AbortError'));
    if(signal.aborted) return abort();
    signal.addEventListener('abort',abort,{once:true});
    new THREE.TextureLoader().load(location,value=>{signal.removeEventListener('abort',abort);if(signal.aborted){value.dispose();abort();}else resolve(value);},undefined,error=>{signal.removeEventListener('abort',abort);reject(error);});
  });
  texture.colorSpace=THREE.SRGBColorSpace;
  const group=new THREE.Group(), origin=new THREE.Vector3(effect.parentPosition.x,effect.parentPosition.y,effect.parentPosition.z);
  const random=i=>{const n=Math.sin(i*127.1+311.7)*43758.5453;return n-Math.floor(n);};
  const range=(values,t,fallback=0)=>values.length?values[0]+((values[1]??values[0])-values[0])*t:fallback;
  const sample=(values,t,stride,channel=1,fallback=1)=>{
    if(values.length<stride) return fallback;
    for(let i=stride;i<values.length;i+=stride) if(t<=values[i]) {
      const mix=(t-values[i-stride])/Math.max(values[i]-values[i-stride],.000001);
      return THREE.MathUtils.lerp(values[i-stride+channel],values[i+channel],mix);
    }
    return values[values.length-stride+channel];
  };
  const axis=[new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0),new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,-1)][effect.direction] || new THREE.Vector3(0,1,0);
  const orientation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis);
  const acceleration=new THREE.Vector3(effect.acceleration.x,effect.acceleration.y,effect.acceleration.z).transformDirection(node.matrixWorld.clone().invert()).multiplyScalar(Math.hypot(effect.acceleration.x,effect.acceleration.y,effect.acceleration.z));
  for(let i=0;i<count;i++) {
    const material=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,blending:effect.lightEmission>=.5?THREE.AdditiveBlending:THREE.NormalBlending});
    const sprite=new THREE.Sprite(material);group.add(sprite);
    const theta=THREE.MathUtils.degToRad((random(i*5+1)-.5)*(effect.spread[0]||0));
    const phi=THREE.MathUtils.degToRad((random(i*5+2)-.5)*(effect.spread[1]||0));
    const velocity=new THREE.Vector3(Math.tan(theta),1,Math.tan(phi)).normalize().applyQuaternion(orientation).multiplyScalar(range(effect.speed,random(i*5+3)));
    sprite.userData.tick=time=>{
      const life=Math.max(range(effect.lifetime,random(i*5+4),1),.01), age=((Math.max(0,time)+i/count*life)%life), t=age/life;
      const travel=effect.drag>0?(1-Math.exp(-effect.drag*age))/effect.drag:age;
      sprite.position.copy(mapPosition(origin.clone().addScaledVector(velocity,travel))).addScaledVector(acceleration,.5*age*age);
      sprite.scale.setScalar(Math.max(0,sample(effect.size,t,3)));
      material.opacity=THREE.MathUtils.clamp(1-sample(effect.transparency,t,3,1,0),0,1);
      material.color.setRGB(sample(effect.color,t,5,1),sample(effect.color,t,5,2),sample(effect.color,t,5,3)).convertSRGBToLinear();
      material.rotation=THREE.MathUtils.degToRad(range(effect.rotation,random(i+1))+range(effect.rotSpeed,random(i+2))*age);
    };
  }
  group.userData.tick=time=>group.children.forEach(sprite=>sprite.userData.tick(time));
  group.userData.tick(1);
  return group;
}

async function load(id, deliveryUrl, signal) {
  const key = `${id}:${deliveryUrl}`;
  if (!cache.has(key)) cache.set(key, (async () => {
    const location = await deliveryUrl(id, signal);
    const response = await fetch(location, {signal});
    if (!response.ok) throw new Error(`Gear model failed (${response.status})`);
    return parse(await response.text());
  })().catch(error => { cache.delete(key); throw error; }));
  return cache.get(key);
}

async function pointSet(node, colorValue) {
  const box = new THREE.Box3().setFromObject(node), center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
  const positions = [];
  for (let i = 0; i < 12; i++) {
    const a = i * 2.399963229728653;
    const point = new THREE.Vector3(center.x + Math.cos(a) * size.x * .48, center.y + ((i % 4) - 1.5) * size.y * .22, center.z + Math.sin(a) * size.z * .48);
    node.worldToLocal(point); positions.push(point.x, point.y, point.z);
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const color = new THREE.Color(colorValue.r, colorValue.g, colorValue.b).convertSRGBToLinear();
  const map=await nativeSparkleTexture();
  if (map) map.needsUpdate=true;
  const material = new THREE.PointsMaterial({color, map, size:Math.max(size.length() * .055, .012), transparent:true, opacity:.9, depthWrite:false, blending:THREE.AdditiveBlending});
  return new THREE.Points(geometry, material);
}

export async function addAvatarEffects(root, items, options = {}) {
  const signal = options.signal || new AbortController().signal;
  const deliveryUrl = options.deliveryUrl || DEFAULT_DELIVERY;
  const readMesh = options.readMesh;
  const matchMesh = options.matchMesh;
  const owned = [...new Map((items || []).filter(item => [19, 8].includes(Number(item?.assetType)) && Number.isSafeInteger(Number(item?.id))).map(item => [Number(item.id), item])).values()]
    .sort((a,b) => Number(b.assetType) - Number(a.assetType)).slice(0, 20);
  const records = [], objects = [], sparkles = [], emitters = [];
  async function process(item) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    try {
      const timeout = new AbortController(), abort = () => timeout.abort();
      const timer = setTimeout(() => timeout.abort(), 2500); signal.addEventListener('abort', abort, {once:true});
      let data;
      try { data = await load(Number(item.id), deliveryUrl, timeout.signal); }
      finally { clearTimeout(timer); signal.removeEventListener('abort', abort); }
      const canonical = data.staticEffects.length && data.mesh && readMesh ? await readMesh(data.mesh.id, data.mesh) : null;
      const match = canonical && matchMesh ? matchMesh(root, canonical, data.mesh) : null;
      const node = match?.node || (match?.isObject3D ? match : null);
      if (!node) { records.push({id:Number(item.id), attached:false, reason:data.staticEffects.length ? 'mesh-not-matched' : 'no-supported-effects', effects:data.staticEffects.map(e=>e.kind)}); return; }
      const mapPosition = match.mapPosition || (value => value.clone());
      for (const effect of data.staticEffects) {
        let object;
        if (effect.kind === 'sparkles') object = await pointSet(node, effect.color);
        else if (effect.kind === 'particleEmitter') { try { object = await emitterPoints(node, effect, value => mapPosition(value), deliveryUrl, signal); } catch (_) { object = null; } if (!object) continue; }
        else { object = new THREE.PointLight(new THREE.Color(effect.color.r, effect.color.g, effect.color.b).convertSRGBToLinear(), effect.brightness, effect.range); object.position.copy(mapPosition(new THREE.Vector3())); }
        if (signal.aborted) {disposeObject(object);throw new DOMException('Aborted','AbortError');}
        object.name = `LarpbloxGear${effect.kind[0].toUpperCase()}${effect.kind.slice(1)}`;
        node.add(object); objects.push(object); if (effect.kind === 'sparkles') sparkles.push(object);if(effect.kind==='particleEmitter')emitters.push(object);
      }
      const attachmentPositions = [...data.attachments].map(([name, position]) => ({name, position:mapPosition(new THREE.Vector3(position.x, position.y, position.z)).toArray()}));
      records.push({id:Number(item.id), attached:true, meshId:data.mesh?.id, effects:data.staticEffects.map(e=>e.kind), trails:data.trails.length, attachmentPositions, disabledEmitters:data.disabledEmitters});
    } catch (error) {
      if (signal.aborted) throw error;
      records.push({id:Number(item.id), attached:false, reason:String(error.message || error)});
    }
  }
  let cursor = 0;
  async function worker() { while (cursor < owned.length) { const item = owned[cursor++]; await process(item); } }
  const dispose = () => { for (const object of objects) { object.removeFromParent();disposeObject(object); } };
  await Promise.allSettled(Array.from({length:Math.min(3, owned.length)}, worker));
  if (signal.aborted) { dispose(); throw new DOMException('Aborted', 'AbortError'); }
  return {update(timeSeconds = 0) { for (const points of sparkles) points.material.opacity = .72 + .18 * (0.5 + 0.5 * Math.sin(Number(timeSeconds) * 2.1));for(const emitter of emitters)emitter.userData.tick(Number(timeSeconds)); }, dispose, diagnostics:records};
}

export {parse as parseGearEffects};
