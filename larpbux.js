(() => {
  'use strict';
  const MAX = Number.MAX_SAFE_INTEGER;
  const keyFor = item => `${item.itemType}:${item.id}`;
  const itemPathFor = item => `/${item.itemType === 'Bundle' ? 'bundles' : 'catalog'}/${item.id}`;
  function openItemOnMiddleClick(event, item) {
    if (event.button !== 1) return;
    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
    window.open(new URL(itemPathFor(item), location.origin).href, '_blank', 'noopener');
  }
  if (typeof window !== 'undefined') window.addEventListener('mousedown', event => {
    if (event.target.closest?.('a[href]')) return;
    if (event.button !== 1 || !event.target.closest?.('#avatar-web-app .larpbux-avatar-item, #avatar-web-app .larpbux-native-item')) return;
    event.preventDefault();
  }, true);
  function localNames(value = {}) {
    const username = typeof value?.username === 'string' ? value.username.trim() : '';
    if (username && !/^[A-Za-z0-9_]{3,20}$/.test(username)) throw new Error('Use 3–20 letters, numbers, or underscores for the Larp username.');
    return {username};
  }
  function localSocialCounts(value) {
    if (value == null || (value.followers === '' && value.following === '')) return null;
    const result = {};
    for (const kind of ['followers', 'following']) {
      const raw = value[kind];
      if (!['number', 'string'].includes(typeof raw) || String(raw).trim() === '' || !/^\d+$/.test(String(raw))) throw new Error('Enter whole numbers for both Followers and Following, or use Roblox counts.');
      result[kind] = amount(raw);
    }
    return result;
  }
  function changeUsername(current, value) {
    const names = localNames({username:value});
    if (!names.username) throw new Error('Enter your new username.');
    if (names.username.toLowerCase() === (current.names?.username || '').toLowerCase()) throw new Error('Choose a different username.');
    if (current.balance < 1000) throw new Error('You need R$ 1,000 to change your username.');
    return {...current, names, balance:current.balance - 1000};
  }
  function amount(value) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 0) throw new Error('Enter a whole number from 0 to 9,007,199,254,740,991.');
    return number;
  }
  function formatBalance(value) {
    const number = amount(value);
    // Classic Roblox NumberFormatting: whole units, always a plus suffix.
    if (number < 10000) return number.toLocaleString('en-US');
    if (number < 1000000) return `${Math.floor(number / 1000)}K+`;
    if (number < 1000000000) return `${Math.floor(number / 1000000)}M+`;
    return `${Math.floor(number / 1000000000)}B+`;
  }
  function collect(state, item) {
    const key = keyFor(item);
    const existing = state.items.find(existing => keyFor(existing) === key);
    const limited = item.isLimited || item.isLimitedUnique || existing?.isLimited || existing?.isLimitedUnique;
    if (existing && !limited) return state;
    const price = amount(item.price || 0);
    if (price > state.balance) throw new Error('Add more Larpbux first.');
    if (!existing && state.items.length >= 2000) throw new Error('Your cosmetic inventory is full.');
    const quantity = existing && Number.isSafeInteger(existing.quantity) && existing.quantity > 0 ? existing.quantity : 1;
    if (existing && quantity >= MAX) throw new Error('Your item quantity is full.');
    const items = existing ? state.items.map(owned => owned === existing ? {...owned, quantity:quantity + 1} : owned) : [...state.items, {...item, price, quantity:1}];
    if (isBodyBundle(item)) for (const part of item.assets.filter(isWearableAsset)) if (!items.some(owned => keyFor(owned) === keyFor(part))) items.push({...part, price:0, source:'bundle', assetTypeVerified:true});
    return {...state, balance: state.balance - price, items};
  }
  function addToCart(current, item) {
    const cart = current.cart || [];
    const existing = cart.find(entry => keyFor(entry) === keyFor(item));
    if (existing && !item.isLimited && !item.isLimitedUnique) return current;
    if (!existing && cart.length >= 2000) throw new Error('Your cart is full.');
    const quantity = existing ? amount(existing.quantity + 1) : 1;
    return {...current, cart:existing ? cart.map(entry => entry === existing ? {...item, quantity} : entry) : [...cart, {...item, quantity}]};
  }
  function checkoutCart(current) {
    let next = current;
    for (const entry of current.cart || []) {
      const previous = next.items.find(item => keyFor(item) === keyFor(entry));
      const limited = entry.isLimited || entry.isLimitedUnique || previous?.isLimited || previous?.isLimitedUnique;
      const quantity = limited ? amount(entry.quantity || 1) : 1;
      if (previous && !limited) continue;
      const count = amount((Number.isSafeInteger(previous?.quantity) && previous.quantity > 0 ? previous.quantity : previous ? 1 : 0) + quantity);
      next = collect(next, {...entry, price:amount(entry.price * quantity)});
      next = {...next, items:next.items.map(item => keyFor(item) === keyFor(entry) ? {...item, price:entry.price, quantity:count} : item)};
    }
    return {...next, cart:[]};
  }
  const bodyAssetTypes = [17, 18, 27, 28, 29, 30, 31, 79];
  const backgroundAssetTypes = [92];
  const wearableAssetTypes = [17, 18, 27, 28, 29, 30, 31, 79, 2, 8, 11, 12, 19, 41, 42, 43, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 64, 65, 66, 67, 68, 69, 70, 71, 72, 76, 77];
  const animationAssetTypes = [48, 50, 51, 52, 53, 54, 55, 56];
  const isWearableAsset = item => item?.itemType === 'Asset' && wearableAssetTypes.includes(Number(item.assetType));
  const isBackground = item => item?.itemType === 'Asset' && backgroundAssetTypes.includes(Number(item.assetType));
  const isAnimationBundle = item => item?.itemType === 'Bundle' && item.bundleType === 'AvatarAnimations' && Array.isArray(item.assets) && item.assets.some(asset => animationAssetTypes.includes(Number(asset.assetType)));
  const isBodyBundle = item => item?.itemType === 'Bundle' && ['BodyParts', 'DynamicHead'].includes(item.bundleType) && Array.isArray(item.assets) && item.assets.some(asset => bodyAssetTypes.includes(Number(asset.assetType)));
  const expandOutfitItem = item => (isAnimationBundle(item) || isBodyBundle(item)) ? item.assets.filter(isWearableAsset) : (isWearableAsset(item) ? [item] : []);
  const supportsOutfit = item => isWearableAsset(item) || isAnimationBundle(item) || isBodyBundle(item);
  const supportsCosmetic = item => supportsOutfit(item) || isBackground(item);
  const outfitAssets = items => items.flatMap(expandOutfitItem);
  function matchesAvatarCategory(item, category, equipped = false) {
    if (!supportsCosmetic(item)) return false;
    let name = String(category).toLowerCase().replace(/[^a-z]/g, '');
    if (isBodyBundle(item)) return /purchased/.test(name) || (/recent/.test(name) && (!/wearing|equipped/.test(name) || equipped));
    if (isAnimationBundle(item)) return /animation/.test(name) || (/recent/.test(name) && (!/wearing|equipped/.test(name) || equipped));
    if (/gear/.test(name)) return Number(item.assetType) === 19;
    if (/eyebrow/.test(name)) return item.assetType === 76;
    if (/eyelash/.test(name)) return item.assetType === 77;
    if (/background/.test(name)) return isBackground(item) && (!/wearing|equipped/.test(name) || equipped);
    if (isBackground(item) && /recent/.test(name)) return /wearing|equipped/.test(name) ? equipped : true;
    if (/avatar|creation|character|makeup/.test(name)) return false;
    if (/animation/.test(name)) return animationAssetTypes.includes(Number(item.assetType));
    if (/recent/.test(name)) {
      if (/wearing|equipped/.test(name)) return equipped;
      if (/^(recent|recentall|recentallitems|recentrecentlyadded|recentlyadded)$/.test(name)) return true;
      name = name.replace(/^recent/, '');
    }
    if (/hair/.test(name)) return item.assetType === 41;
    if (/body/.test(name) || /^(head|heads|face|faces|torso|leftarm|rightarm|leftleg|rightleg)$/.test(name)) {
      for (const [label, types] of [['leftarm',[29]],['rightarm',[28]],['leftleg',[30]],['rightleg',[31]],['torso',[27]],['head',[17,79]],['face',[18]]]) if (name.includes(label)) return types.includes(Number(item.assetType));
      return false;
    }
    if (/tshirts?/.test(name)) return item.assetType === 2 || !/classic/.test(name) && item.assetType === 64;
    if (/shirts?$/.test(name)) return item.assetType === 11 || !/classic/.test(name) && [65, 67, 68].includes(item.assetType);
    if (/pants$/.test(name)) return item.assetType === 12 || !/classic/.test(name) && [66, 69, 72].includes(item.assetType);
    if (/hats?$/.test(name)) return item.assetType === 8;
    if (name === 'clothing') return [2, 11, 12, 64, 65, 66, 67, 68, 69, 70, 71, 72].includes(item.assetType);
    if (/layered/.test(name)) return [64, 65, 66, 67, 68, 69, 70, 71, 72].includes(item.assetType);
    if (/^(head|face|neck|shoulder|front|back|waist)$/.test(name)) return {head: 8, face: 42, neck: 43, shoulder: 44, front: 45, back: 46, waist: 47}[name] === item.assetType;
    if (/accessor/.test(name)) {
      for (const [label, type] of [['head', 8], ['face', 42], ['neck', 43], ['shoulder', 44], ['front', 45], ['back', 46], ['waist', 47]]) {
        if (name.includes(label)) return item.assetType === type;
      }
      return ![2, 11, 12, 64, 65, 66, 67, 68, 69, 70, 71, 72].includes(item.assetType);
    }
    return false;
  }
  function equip(state, key) {
    const item = state.items.find(item => keyFor(item) === key);
    if (!item) throw new Error('Collect this cosmetic item first.');
    if (isBackground(item)) {
      const nextId = state.backgroundId === item.id ? undefined : item.id;
      return {...state, backgroundId:nextId, equipped:(state.equipped || []).filter(value => !isBackground(state.items.find(candidate => keyFor(candidate) === value)))};
    }
    if (!supportsOutfit(item)) throw new Error('This item can be collected, but the game outfit importer does not support it yet.');
    if (isBodyBundle(item)) {
      const parts = item.assets.filter(isWearableAsset);
      const removing = parts.every(part => state.equipped.includes(keyFor(part)));
      let next = state;
      for (const part of parts) if (removing || !next.equipped.includes(keyFor(part))) next = equip(next, keyFor(part));
      return next;
    }
    if (state.equipped.includes(key)) return {...state, equipped: state.equipped.filter(value => value !== key)};
    let equipped = state.equipped;
    if (item.itemType === 'Bundle' && item.bundleType === 'AvatarAnimations' || animationAssetTypes.includes(Number(item.assetType))) equipped = equipped.filter(value => {
      const other = state.items.find(candidate => keyFor(candidate) === value);
      return !expandOutfitItem(other).some(asset => animationAssetTypes.includes(Number(asset.assetType)));
    });
    if ([17, 18, 27, 28, 29, 30, 31, 79, 2, 11, 12, 19, 64, 65, 66, 67, 68, 69, 70, 71, 72].includes(item.assetType)) equipped = equipped.filter(value => {
      const other = state.items.find(candidate => keyFor(candidate) === value);
      return !expandOutfitItem(other).some(asset => asset.assetType === item.assetType || [17,79].includes(asset.assetType) && [17,79].includes(item.assetType));
    });
    if (equipped.length >= 20) throw new Error('Equip at most 20 cosmetic items.');
    return {...state, equipped: [...equipped, key]};
  }
  function outfit(state, userId) {
    return JSON.stringify({version: 1, kind: 'larpblox-cosmetic-outfit', userId, items: outfitAssets(state.items.filter(item => supportsOutfit(item) && state.equipped.includes(keyFor(item)))).map(({id, name, itemType, assetType}) => ({id, name, itemType, assetType}))});
  }
  function previewDefinition(avatar, rules, items, backgroundId) {
    items = outfitAssets(items);
    const slots = new Set(items.filter(item => [17, 18, 27, 28, 29, 30, 31, 79, 2, 11, 12, 19, 48, 50, 51, 52, 53, 54, 55, 56, 64, 65, 66, 67, 68, 69, 70, 71, 72].includes(item.assetType)).map(item => item.assetType));
    if (slots.has(17) || slots.has(79)) { slots.add(17); slots.add(79); }
    const renderAsset = asset => asset.meta === undefined ? {id: asset.id} : {id: asset.id, meta: asset.meta};
    const assets = (avatar.assets || []).filter(asset => !slots.has(asset.assetType?.id)).map(renderAsset);
    for (const item of items) if (!assets.some(asset => asset.id === item.id)) assets.push(renderAsset(item));
    const bodyColors = {};
    for (const [part, color] of Object.entries(avatar.bodyColor3s || avatar.bodyColors || {})) {
      if (avatar.bodyColor3s) {
        if (typeof color !== 'string' || !/^#?[0-9a-f]{6}$/i.test(color)) throw new Error('Roblox could not load the avatar colors for the preview.');
        bodyColors[part.replace(/Color3$/, 'Color')] = color;
        continue;
      }
      const hex = typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) ? color : rules.bodyColorsPalette?.find(entry => entry.brickColorId === color)?.hexColor;
      if (!hex) throw new Error('Roblox could not load the avatar colors for the preview.');
        bodyColors[part.replace(/ColorId$/, 'Color')] = hex.startsWith('#') ? hex : `#${hex}`;
    }
    const definition = {assets, bodyColors, scales: avatar.scales, playerAvatarType: {playerAvatarType: avatar.playerAvatarType}};
    if (Number.isSafeInteger(Number(backgroundId)) && Number(backgroundId) > 0) {
      definition.backgroundId = Number(backgroundId);
      definition.backgroundRequestModel = {id: Number(backgroundId)};
    }
    return definition;
  }
  function mergeGameSnapshot(state, snapshot, preserveBodyRemovals = false) {
    const bodySlot = type => Number(type) === 79 ? 17 : Number(type);
    const selectedBodySlots = new Set(outfitAssets(state.items.filter(item => state.equipped.includes(keyFor(item)))).map(item => bodySlot(item.assetType)));
    const removedBodySlots = new Set(preserveBodyRemovals ? (state.gameLook?.items || []).filter(item => bodyAssetTypes.includes(Number(item.assetType)) && !selectedBodySlots.has(bodySlot(item.assetType))).map(item => bodySlot(item.assetType)) : []);
    const items = [...state.items];
    const snapshotItems = snapshot.items.filter(supportsOutfit);
    const bundled = new Set();
    for (const bundle of state.items.filter(isAnimationBundle)) {
      if (bundle.assets.length && bundle.assets.every(asset => snapshotItems.some(item => item.id === asset.id))) {
        bundled.add(keyFor(bundle));
        bundle.assets.forEach(asset => bundled.add(keyFor(asset)));
      }
    }
    for (const item of snapshotItems) {
      if (bundled.has(keyFor(item))) continue;
      const index = items.findIndex(existing => keyFor(existing) === keyFor(item));
      if (index < 0) items.push({...item, price: 0, source: 'game'});
      else items[index] = {...items[index], name: item.name, assetType: items[index].assetTypeVerified ? items[index].assetType : item.assetType};
    }
    const equipped = snapshotItems.filter(item => !bundled.has(keyFor(item)) && !removedBodySlots.has(bodySlot(item.assetType))).map(keyFor);
    for (const key of bundled) if (state.items.some(item => keyFor(item) === key)) equipped.push(key);
    const backgroundId = Number.isSafeInteger(Number(snapshot.backgroundId)) && Number(snapshot.backgroundId) > 0 ? Number(snapshot.backgroundId) : state.backgroundId;
    return {...state, items, equipped, ...(backgroundId ? {backgroundId} : {backgroundId:undefined}), gameLook: snapshot};
  }
  function gamePreviewDefinition(state) {
    const look = state.gameLook;
    const selected = outfitAssets(state.items.filter(item => state.equipped.includes(keyFor(item)) && supportsOutfit(item)));
    const selectedIds = new Set(selected.map(item => item.id));
    const managed = new Set(look.items.filter(supportsOutfit).map(item => item.id));
    const replaceSlots = new Set(selected.filter(item => [17, 18, 27, 28, 29, 30, 31, 79, 2, 11, 12, 19, 48, 50, 51, 52, 53, 54, 55, 56, 64, 65, 66, 67, 68, 69, 70, 71, 72].includes(item.assetType)).map(item => item.assetType));
    if (replaceSlots.has(17) || replaceSlots.has(79)) { replaceSlots.add(17); replaceSlots.add(79); }
    const types = new Map(look.items.map(item => [item.id, item.assetType]));
    const assets = look.definition.assets.filter(asset =>
      (!managed.has(asset.id) || selectedIds.has(asset.id)) && (!replaceSlots.has(types.get(asset.id)) || selectedIds.has(asset.id)));
    for (const item of selected) if (!assets.some(asset => asset.id === item.id)) assets.push({id: item.id});
    const definition = {...look.definition, assets};
    if (Number.isSafeInteger(Number(state.backgroundId)) && Number(state.backgroundId) > 0) {
      definition.backgroundId = Number(state.backgroundId);
      definition.backgroundRequestModel = {id: Number(state.backgroundId)};
    } else { delete definition.backgroundId; delete definition.backgroundRequestModel; }
    return definition;
  }
  function changedBodyColors(original, value, rules = {}) {
    const source = value?.bodyColor3s || value?.bodyColors || value;
    const colors = {...original};
    let changed = false;
    for (const part of ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg']) {
      const key = `${part}Color`;
      const value = source?.[`${key}3`] ?? source?.[`${key}Id`] ?? source?.[key];
      if (value === undefined) continue;
      const hex = typeof value === 'string' && /^#?[0-9a-f]{6}$/i.test(value) ? value : rules.bodyColorsPalette?.find(entry => entry.brickColorId === value)?.hexColor;
      if (typeof hex !== 'string' || !/^#?[0-9a-f]{6}$/i.test(hex)) throw new Error('This body color could not be loaded. Try another color.');
      colors[key] = `#${hex.replace(/^#/, '').toLowerCase()}`; changed = true;
    }
    if (!changed) throw new Error('Choose a body color first.');
    return colors;
  }
  function gameOutfitMatches(snapshot, command) {
    const defaultSlots = [...animationAssetTypes, ...bodyAssetTypes];
    const requested = new Set(outfitAssets(command.items).map(item => item.assetType === 79 ? 17 : item.assetType));
    const keys = value => value.items.flatMap(expandOutfitItem).filter(item => !defaultSlots.includes(item.assetType) || requested.has(item.assetType === 79 ? 17 : item.assetType)).map(keyFor).sort().join(',');
    const normalizeColor = value => typeof value === 'string' ? value.replace(/^#/, '').toLowerCase() : value;
    const colors = ['headColor', 'torsoColor', 'leftArmColor', 'rightArmColor', 'leftLegColor', 'rightLegColor'];
    const bodyColorsMatch = colors.every(color => normalizeColor(snapshot.definition?.bodyColors?.[color]) === normalizeColor(command.definition?.bodyColors?.[color]));
    return String(snapshot.userId) === String(command.userId) && keys(snapshot) === keys(command) && bodyColorsMatch;
  }
  function gameCommand(state, userId) {
    const definition = gamePreviewDefinition(state);
    const items = new Map(state.gameLook.items.map(item => [item.id, item]));
    for (const item of outfitAssets(state.items.filter(item => state.equipped.includes(keyFor(item))))) items.set(item.id, item);
    return {version: 1, userId: String(userId), definition, ...(definition.backgroundId ? {backgroundId: definition.backgroundId} : {}), items: definition.assets.map(asset => items.get(asset.id)).filter(Boolean).map(({id, name, assetType}) => ({id, name, assetType, itemType: 'Asset'}))};
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = {changedBodyColors, addToCart, checkoutCart, changeUsername, localNames, localSocialCounts, amount, formatBalance, collect, equip, outfit, supportsOutfit, supportsCosmetic, isBackground, previewDefinition, matchesAvatarCategory, mergeGameSnapshot, gamePreviewDefinition, gameCommand, gameOutfitMatches}; return; }
  let state, userId, panel, list, message, exportBox, purchaseDialog, previewElement, previewViewer, previewSignature, previewController;
  // Catalog Try On is deliberately separate from the saved Larp outfit.  It is
  // a disposable render only: no save(), bridge message, purchase, or equip is
  // performed for the item being previewed.
  let catalogTryOn = {generation:0};
  const thumbnails = new Map();
  const thumbnailPending = new Map();
  let thumbnailTimer, thumbnailBusy = false, thumbnailBlockedUntil = 0;
  const counts = new Map();
  const details = new Map();
  let namesPending=false;
  let bridgeStatus, bridgePending = false, bridgeSending = false, queuedGameCommand, awaitingGameOutfit;
  const node = (tag, text, className) => { const element = document.createElement(tag); if (text) element.textContent = text; if (className) element.className = className; return element; };
  const key = () => `larpblox-cosmetics-v1:${userId}`;
  function popupState() {
    return {mode:state?.mode === true, sharing:state?.sharing === true, verified:state?.verified === true, balance:state?.balance || 0, appearance:LarpbloxAppearance.get(), socialCounts:state?.socialCounts || null, username:state?.names?.username || '', avatarPage:/^\/my\/avatar\/?$/i.test(location.pathname), avatarView:avatarEditorView, previewStatus:previewFailure?.message || '', gameStatus:bridgeStatus?.textContent || 'Checking connection…'};
  }
  function save(next, syncOutfit = false) {
    next = {...next, pendingOutfit: Boolean(next.mode && (syncOutfit || next.pendingOutfit))};
    if (!next?.mode) { queuedGameCommand = undefined; awaitingGameOutfit = undefined; }
    try { localStorage.setItem(key(), JSON.stringify(next)); } catch (_) { throw new Error('Your browser could not save this change.'); }
    state = read(userId);
    if (syncOutfit) sendGameOutfit();
    render(); syncNames();
  }
  function action(fn) { try { fn(); } catch (error) { message.textContent = error.message; } }
  function read(id) {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(`larpblox-cosmetics-v1:${id}`) || 'null'); } catch (_) {}
    let items = Array.isArray(saved?.items) ? saved.items.filter(item => Number.isSafeInteger(item.id) && item.id > 0 && ['Asset', 'Bundle'].includes(item.itemType) && typeof item.name === 'string').slice(0, 2000) : [];
    for (const bundle of items.filter(isBodyBundle)) for (const part of bundle.assets.filter(isWearableAsset)) if (!items.some(item => keyFor(item) === keyFor(part))) items.push({...part, price:0, source:'bundle', assetTypeVerified:true});
    let names;
    try { names = localNames(saved?.names); } catch (_) { names = localNames(); }
    let gameLook;
    if (saved?.gameLook && typeof LarpbloxGameBridge !== 'undefined') {
      try { gameLook = LarpbloxGameBridge.validateSnapshot(saved.gameLook, id); } catch (_) {}
    }
    const cart = Array.isArray(saved?.cart) ? saved.cart.filter(item => Number.isSafeInteger(item.id) && item.id > 0 && ['Asset', 'Bundle'].includes(item.itemType) && typeof item.name === 'string' && Number.isSafeInteger(item.price) && item.price >= 0 && Number.isSafeInteger(item.quantity) && item.quantity > 0).slice(0, 2000) : [];
    let socialCounts; try { socialCounts = localSocialCounts(saved?.socialCounts); } catch (_) { socialCounts = null; }
    const backgroundId = Number.isSafeInteger(saved?.backgroundId) && saved.backgroundId > 0 && items.some(item => isBackground(item) && item.id === saved.backgroundId) ? saved.backgroundId : undefined;
    return {version: 1, cart, names, socialCounts, mode: saved?.mode === true, verified: saved?.verified === true, sharing: typeof saved?.sharing === 'boolean' ? saved.sharing : gameLook?.sharing?.enabled === true, pendingOutfit: saved?.mode === true && saved?.pendingOutfit === true, balance: Number.isSafeInteger(saved?.balance) && saved.balance >= 0 ? saved.balance : 0, items, backgroundId, equipped: Array.isArray(saved?.equipped) ? saved.equipped.filter(value => items.some(item => keyFor(item) === value) && !isBackground(items.find(item => keyFor(item) === value))).slice(0, 100) : [], ...(gameLook ? {gameLook} : {})};
  }
  const avatarUrl = () => '/my/avatar';
  async function syncNames() {
    if (typeof LarpbloxGameBridge === 'undefined' || !userId || !state || namesPending) return;
    const account=userId;
    const name=state.names?.username || '';
    namesPending=true;
    try {
      await LarpbloxGameBridge.request('publishNames',account,{names:{version:1,userId:account,enabled:Boolean(state.mode),name,verified:Boolean(state.mode && state.verified),sharing:Boolean(state.mode && state.sharing)}});
    } catch (error) {
      if (account===userId && bridgeStatus) bridgeStatus.textContent=error.message;
    } finally { namesPending=false; }
  }
  async function syncGame() {
    if (typeof LarpbloxGameBridge === 'undefined' || !userId || !state?.mode || bridgePending || bridgeSending) return;
    const account = userId;
    bridgePending = true;
    try {
      const result = await LarpbloxGameBridge.request('read', account);
      if (account !== userId || !state?.mode || bridgeSending || queuedGameCommand) return;
      if (!result.connected) { if (bridgeStatus) bridgeStatus.textContent = 'Not connected.'; return; }
      if (!result.snapshot) { if (bridgeStatus) bridgeStatus.textContent = 'Desktop connected. Run Larpblox in your game.'; return; }
      const snapshot = LarpbloxGameBridge.validateSnapshot(result.snapshot, account);
      if (state.pendingOutfit && !state.gameLook) {
        // Keep edits made before the first game snapshot; merge previously unseen originals.
        const known = new Set(state.items.map(keyFor));
        const desired = state.equipped;
        const merged = mergeGameSnapshot(state, snapshot);
        save({...merged, equipped: [...new Set([...merged.equipped.filter(item => !known.has(item)), ...desired])]});
        queuedGameCommand = gameCommand(state, account);
        return;
      }
      if (state.pendingOutfit && !awaitingGameOutfit && state.gameLook) awaitingGameOutfit = {command: gameCommand(state, account)};
      if (awaitingGameOutfit) {
        if (!gameOutfitMatches(snapshot, awaitingGameOutfit.command)) {
          if (!queuedGameCommand && account === userId && state?.mode) queuedGameCommand = awaitingGameOutfit.command;
          if (bridgeStatus) bridgeStatus.textContent = 'Waiting for the game to apply your outfit...';
          return;
        }
        awaitingGameOutfit = undefined;
      }
      if (state.pendingOutfit || JSON.stringify(snapshot) !== JSON.stringify(state.gameLook)) save({...mergeGameSnapshot(state, snapshot, true), pendingOutfit: false});
      if (bridgeStatus) bridgeStatus.textContent = 'Connected. Game outfit synced to this account.';
    } catch (error) { if (account === userId && bridgeStatus) bridgeStatus.textContent = error.message; }
    finally { bridgePending = false; if (account === userId && queuedGameCommand && !bridgeSending) sendGameOutfit(); }
  }
  const extensionRuntime = globalThis.LarpbloxExtension || globalThis.chrome?.runtime;
  if (extensionRuntime?.onMessage?.addListener) extensionRuntime.onMessage.addListener((message, sender, respond) => {
    if (message?.type === 'larpblox-game-state' && String(message.userId) === String(userId)) {
      // A socket push is authoritative and wakes the existing sync path immediately.
      syncGame();
      return;
    }
    if (typeof message?.type !== 'string' || !message.type.startsWith('larpblox-popup-')) return;
    if (!userId || !state) { respond({ok:false, error:'Open a signed-in Roblox page first.'}); return; }
    if (message.type === 'larpblox-popup-get-state') {
      respond({ok:true, ...popupState()});
      return;
    }
    if (message.type === 'larpblox-popup-update') {
      try {
        const next = {...state};
        if (typeof message.mode === 'boolean') next.mode = message.mode;
        if (message.sharing !== undefined) {
          if (typeof message.sharing !== 'boolean') throw new Error('Choose a valid sharing setting.');
          if (message.sharing && !next.mode) throw new Error('Turn Larp mode on before sharing your appearance.');
          next.sharing = message.sharing;
        }
        if (message.verified !== undefined) {
          if (typeof message.verified !== 'boolean') throw new Error('Choose a valid verification setting.');
          next.verified = message.verified;
        }
        if (message.balance !== undefined) next.balance = amount(message.balance);
        if (message.appearance !== undefined && !['classic','modern'].includes(message.appearance)) throw new Error('Choose a valid website appearance.');
        if (next.mode !== state.mode) closePurchase();
        if (typeof message.mode === 'boolean' || message.sharing !== undefined || message.verified !== undefined || message.balance !== undefined) save(next);
        if (message.appearance !== undefined) {
          LarpbloxAppearance.set(message.appearance, false);
          respond({ok:true, ...popupState()});
          setTimeout(() => location.reload(), 100);
          return;
        }
        respond({ok:true, ...popupState()});
      } catch (error) { respond({ok:false, error:error.message}); }
      return;
    }
    if (message.type === 'larpblox-popup-avatar-view') {
      if (!/^\/my\/avatar\/?$/i.test(location.pathname)) { respond({ok:false, error:'Open the Avatar page to choose which look to edit.'}); return; }
      if (!['real','larp'].includes(message.view)) { respond({ok:false, error:'Choose Real avatar or Larp avatar.'}); return; }
      if (message.view === 'larp' && !state.mode) { respond({ok:false, error:'Turn Larp mode on first.'}); return; }
      if (message.view === 'real') browserAvatarBase = undefined;
      avatarEditorView = message.view;
      updateAvatar();
      respond({ok:true, ...popupState()});
      return;
    }
    if (message.type === 'larpblox-popup-avatar-retry') {
      if (!/^\/my\/avatar\/?$/i.test(location.pathname)) { respond({ok:false, error:'Open the Avatar page to retry the preview.'}); return; }
      previewRetryKey = undefined; previewSignature = undefined; updateAvatar();
      respond({ok:true, ...popupState()});
      return;
    }
    if (message.type === 'larpblox-popup-profile-counts') {
      try {
        const socialCounts = localSocialCounts(message.socialCounts);
        save({...state, socialCounts});
        respond({ok:true, ...popupState()});
      } catch (error) { respond({ok:false, error:error.message}); }
      return;
    }
    if (message.type === 'larpblox-popup-username') {
      try {
        if (!state.mode) throw new Error('Turn Larp mode on first.');
        const next = changeUsername(read(userId), message.username);
        const realName = document.querySelector('meta[name="user-data"]')?.getAttribute('data-name') || '';
        if (next.names.username.toLowerCase() === realName.toLowerCase()) throw new Error('Choose a different username.');
        save(next);
        respond({ok:true, message:`Username and display name are now ${state.names.username}.`, ...popupState()});
      } catch (error) { respond({ok:false, error:error.message}); }
      return;
    }

  });
  async function sendGameOutfit() {
    if (!state?.mode || !state.gameLook || typeof LarpbloxGameBridge === 'undefined') return;
    queuedGameCommand = gameCommand(state, userId);
    if (bridgeSending) return;
    bridgeSending = true;
    try {
      while (queuedGameCommand) {
        const command = queuedGameCommand; queuedGameCommand = undefined;
        if (command.userId !== userId || !state?.mode) continue;
        awaitingGameOutfit = {command};
        let result;
        try {
          result = await LarpbloxGameBridge.request('publish', userId, {snapshot: command});
        } catch (error) {
          if (!queuedGameCommand && command.userId === userId && state?.mode) queuedGameCommand = command;
          if (bridgeStatus) bridgeStatus.textContent = error.message;
          break;
        }
        if (!result.connected) {
          if (!queuedGameCommand && command.userId === userId && state?.mode) queuedGameCommand = command;
          if (bridgeStatus) bridgeStatus.textContent = 'Not connected. Retrying when the game connection returns.';
          break;
        }
        if (command.userId !== userId) continue;
        if (bridgeStatus) bridgeStatus.textContent = 'Waiting for the game to confirm your outfit. If this stays here, check Accessories → Browser Connection in the game.';
      }
    } catch (error) { if (bridgeStatus) bridgeStatus.textContent = error.message; }
    finally { bridgeSending = false; }
  }
  let imageCache;
  function validAvatarImage(url) {
    try { const parsed = new URL(url); return parsed.protocol === 'https:' && /^(tr|t[0-7])\.rbxcdn\.com$/i.test(parsed.hostname) && !parsed.username && !parsed.password && !parsed.port && !parsed.search && !parsed.hash && (/\.png$/i.test(parsed.pathname) || /\/Png\/[^/]*$/i.test(parsed.pathname)); } catch (_) { return false; }
  }
  async function publishPreviewImage(definition, renderedUrl, account, signal, signature, forceThumbnail = false) {
    let imageUrl = !forceThumbnail && validAvatarImage(renderedUrl) ? renderedUrl : null;
    if (!imageUrl && typeof LarpbloxAvatarSurfaces !== 'undefined' && typeof LarpbloxAvatarSurfaces.characterThumbnail === 'function') {
      try { imageUrl = await LarpbloxAvatarSurfaces.characterThumbnail(definition, account, signal); } catch (_) { return; }
    }
    if (!validAvatarImage(imageUrl) || account !== userId || signal?.aborted || signature !== previewSignature) return;
    const cacheKey = `${account}:${JSON.stringify(definition)}`;
    if (imageCache?.key === cacheKey && imageCache.imageUrl === imageUrl) return;
    try {
      const result = await LarpbloxGameBridge.request('publishImage', account, {image: {version: 1, userId: String(account), definition, imageUrl}});
      if (!result?.connected) return;
      imageCache = {key: cacheKey, imageUrl};
    } catch (_) {}
  }
  function scheduleThumbnails() {
    if (thumbnailBusy || !thumbnailPending.size) return;
    clearTimeout(thumbnailTimer);
    const due = Math.min(...[...thumbnailPending.values()].map(entry => entry.due));
    thumbnailTimer = setTimeout(flushThumbnails, Math.max(0, Math.max(due, thumbnailBlockedUntil) - Date.now()));
  }
  async function flushThumbnails() {
    if (thumbnailBusy) return;
    const ready = [...thumbnailPending.values()].filter(entry => entry.due <= Date.now());
    if (!ready.length || Date.now() < thumbnailBlockedUntil) { scheduleThumbnails(); return; }
    thumbnailBusy = true;
    const type = ready[0].item.itemType;
    const batch = ready.filter(entry => entry.item.itemType === type).slice(0, 100);
    const ids = batch.map(entry => entry.item.id).join(',');
    const endpoint = type === 'Bundle' ? `bundles/thumbnails?bundleIds=${ids}` : `assets?assetIds=${ids}`;
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`https://thumbnails.roblox.com/v1/${endpoint}&size=150x150&format=Png&isCircular=false`, {signal:controller.signal});
      if (response.status === 429) {
        thumbnailBlockedUntil = Date.now() + Math.max(1, LarpbloxAvatarRequests.retryAfter(response, 20)) * 1000;
        return;
      }
      if (!response.ok) throw new Error('Item thumbnails are temporarily unavailable.');
      const results = new Map(((await response.json()).data || []).map(entry => [String(entry.targetId), entry]));
      for (const entry of batch) {
        const result = results.get(String(entry.item.id));
        if (result?.imageUrl || result?.state === 'Blocked' || result?.state === 'InReview') {
          thumbnailPending.delete(entry.key); entry.resolve(result.imageUrl || null);
        } else if (++entry.attempts >= 6) {
          thumbnailPending.delete(entry.key); entry.resolve(null);
        } else entry.due = Date.now() + Math.min(10000, 1000 * entry.attempts);
      }
    } catch (_) {
      for (const entry of batch) {
        if (++entry.attempts >= 6) { thumbnailPending.delete(entry.key); entry.resolve(null); }
        else entry.due = Date.now() + Math.min(30000, 2000 * entry.attempts);
      }
    } finally {
      clearTimeout(timeout); thumbnailBusy = false;
      thumbnailBlockedUntil = Math.max(thumbnailBlockedUntil, Date.now() + 250);
      scheduleThumbnails();
    }
  }
  function thumbnail(image, item) {
    image.alt = item.name;
    image.classList.add('larpbux-thumbnail');
    const ready = () => image.classList.toggle('larpbux-thumbnail-ready', image.complete && image.naturalWidth > 0);
    image.addEventListener('load', ready);
    image.addEventListener('error', ready);
    ready();
    if (item.thumbnail) { image.src = item.thumbnail; return; }
    const key = keyFor(item);
    if (!thumbnails.has(key)) {
      const promise = new Promise(resolve => thumbnailPending.set(key, {key,item,resolve,due:Date.now(),attempts:0}));
      thumbnails.set(key,promise); scheduleThumbnails();
    }
    thumbnails.get(key).then(url => { if (url) image.src = url; });
  }
  function inventoryCards(target) {
    target.replaceChildren();
    if (!state.items.length) { target.append(node('p', 'You have no purchased items yet.')); return; }
    for (const item of [...state.items].reverse()) {
      const row = node('article', '', 'larpbux-inventory-item');
      const link = node('a'); link.href = `/${item.itemType === 'Bundle' ? 'bundles' : 'catalog'}/${item.id}`;
      const image = node('img'); thumbnail(image, item);
      link.append(image, node('span', item.name));
      const equipped = isBackground(item) ? state.backgroundId === item.id : state.equipped.includes(keyFor(item));
      const button = node('button', equipped ? 'Remove' : 'Wear'); button.type = 'button';
      button.disabled = !supportsCosmetic(item);
      if (button.disabled) button.textContent = 'Collection only';
      button.addEventListener('click', () => action(() => { save(equip(state, keyFor(item)), true); message.textContent = 'Outfit saved.'; }));
      row.append(link, button); target.append(row);
    }
  }
  let nativeInventoryHost;
  function nativeInventoryCategory() {
    const params = new URLSearchParams(`${location.search}${location.hash.includes('?') ? `&${location.hash.split('?')[1]}` : ''}`);
    const type = params.get('assetTypeId');
    if (type && /^\d+$/.test(type)) return Number(type);
    const category = location.hash.match(/^#!?\/([^?]+)/)?.[1]?.toLowerCase() || 'accessories';
    return ({accessories:8, hair:41, heads:[17,79], faces:18, backgrounds:92, animations:24, emotes:61, audio:3, decals:13, meshes:4, video:62, shirts:11, pants:12, tshirts:2})[category] ?? category;
  }
  function nativeInventoryRoot() {
    if (!/^\/users\/(?:\d+\/)?inventory\/?$/i.test(location.pathname)) return null;
    const visible = element => element && element.getClientRects().length;
    const root = [...document.querySelectorAll('#inventory-container, #inventory-page-container, #inventory-web-app, .inventory-container, [data-testid="inventory-container"]')].find(visible);
    if (root) return root;
    // Inventory has shipped with several different outer wrappers. Locate the
    // actual card list on this route instead of depending on a wrapper name.
    const list = [...document.querySelectorAll('.item-cards, .inventory-items, .items-container')]
      .find(element => visible(element) && !element.closest('.larpbux-native-inventory, .larpbux-panel, .larpbux-avatar-controls') && element.querySelector('a[href*="/catalog/"], a[href*="/bundles/"]'));
    if (list) return list.parentElement;
    return [...document.querySelectorAll('.item-card')].find(element => visible(element) && !element.closest('.larpbux-native-inventory, .larpbux-panel, .larpbux-avatar-controls'))?.parentElement;
  }
  function clearNativeInventory() {
    nativeInventoryHost?.remove(); nativeInventoryHost = undefined;
  }
  function updateNativeInventory() {
    const root = nativeInventoryRoot();
    const routeAccount = location.pathname.match(/^\/users\/(\d+)\//i)?.[1] || new URLSearchParams(location.search).get('userId') || userId;
    if (!state?.mode || !userId || !root || routeAccount !== String(userId)) { clearNativeInventory(); return; }
    const category = nativeInventoryCategory();
    repairPurchasedTypes();
    const types = Array.isArray(category) ? category : typeof category === 'number' ? [category] : null;
    const items = state.items.filter(item => types ? item.itemType === 'Asset' && types.includes(Number(item.assetType)) :
      category === 'bundles' ? item.itemType === 'Bundle' : category === 'avatar-animations' ? isAnimationBundle(item) || animationAssetTypes.includes(Number(item.assetType)) :
      category === 'all' || category === 'purchased');
    const entries = items.map(item => ({item, count: item.isLimited || item.isLimitedUnique ? (Number.isSafeInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1) : 1}));
    const total = entries.reduce((sum, entry) => sum + entry.count, 0);
    const signature = JSON.stringify([userId, category, entries.map(({item, count}) => [keyFor(item), count, item.name, item.thumbnail, item.isLimited, item.isLimitedUnique])]);
    const nativeGrid = root.querySelector('.item-cards, .inventory-items, .items-container') || root.querySelector('.item-card:not(.larpbux-native-inventory-card)')?.parentElement || root;
    if (nativeInventoryHost && (!nativeInventoryHost.isConnected || nativeInventoryHost.parentElement !== nativeGrid)) clearNativeInventory();
    if (!nativeInventoryHost) { nativeInventoryHost = node('div', '', 'larpbux-native-inventory'); nativeGrid.prepend(nativeInventoryHost); }
    nativeInventoryHost.dataset.integrated = String(nativeGrid !== root);
    if (nativeInventoryHost.dataset.signature === signature) return;
    nativeInventoryHost.dataset.signature = signature;
    nativeInventoryHost.replaceChildren();
    const pageSize = 48, page = Number(nativeInventoryHost.dataset.page) || 0, pages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, pages - 1); nativeInventoryHost.dataset.page = String(currentPage);
    const grid = node('div', '', 'larpbux-native-inventory-grid');
    let skip = currentPage * pageSize, take = pageSize;
    for (const {item, count} of entries) {
      if (skip >= count) { skip -= count; continue; }
      const start = skip; skip = 0;
      for (let index = start; index < count && take > 0; index++, take--) {
        const card = node('div', '', 'item-card larpbux-native-inventory-card');
        card.dataset.larpAssetId = String(item.id);
        const container = node('div', '', 'item-card-container');
        const holder = node('div', '', 'item-card-thumb-container');
        const link = node('a', '', 'item-card-link'); link.href = `/${item.itemType === 'Bundle' ? 'bundles' : 'catalog'}/${item.id}`; link.title = item.name;
        const thumb = node('span', '', 'thumbnail-2d-container');
        const image = node('img'); thumbnail(image, item); thumb.append(image); link.append(thumb); updateLimitedBadge(thumb, item); holder.append(link);
        const caption = node('div', '', 'item-card-caption');
        const name = node('a', item.name, 'item-card-name'); name.href = link.href; name.title = item.name; caption.append(name);
        if (item.isLimited || item.isLimitedUnique) link.setAttribute('aria-label', `${item.name}, quantity ${index + 1}`);
        container.append(holder, caption); card.append(container); grid.append(card);
      }
      if (!take) break;
    }
    nativeInventoryHost.append(grid);
    if (pages > 1) {
      const nav = node('nav', '', 'larpbux-native-inventory-pages'); nav.setAttribute('aria-label', 'Larp inventory pages');
      const previous = node('button', 'Previous'); previous.type = 'button'; previous.disabled = currentPage === 0;
      const next = node('button', 'Next'); next.type = 'button'; next.disabled = currentPage === pages - 1;
      const status = node('span', `Page ${currentPage + 1} of ${pages}`); previous.addEventListener('click', () => { nativeInventoryHost.dataset.page = String(currentPage - 1); nativeInventoryHost.dataset.signature = ''; updateNativeInventory(); });
      next.addEventListener('click', () => { nativeInventoryHost.dataset.page = String(currentPage + 1); nativeInventoryHost.dataset.signature = ''; updateNativeInventory(); });
      nav.append(previous, status, next); nativeInventoryHost.append(nav);
    }
  }
  let browserAvatarBase;
  async function loadBrowserPreview(selected, signal, backgroundId = state?.backgroundId) {
    const account = userId;
    if (!browserAvatarBase || browserAvatarBase.account !== account || Date.now() > browserAvatarBase.expires) {
      const entry = {account, expires: Date.now() + 15000};
      browserAvatarBase = entry;
      entry.promise = (async () => {
        const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch('https://avatar.roblox.com/v2/avatar/avatar', {credentials: 'include', signal: controller.signal});
          if (!response.ok) throw new Error('Could not load your avatar.');
          const avatar = await response.json();
          let rules = {};
          if (!avatar.bodyColor3s && Object.values(avatar.bodyColors || {}).some(color => typeof color === 'number')) {
            const palette = await fetch('https://avatar.roblox.com/v1/avatar-rules', {credentials: 'include', signal: controller.signal});
            if (!palette.ok) throw new Error('Could not load your avatar colors.');
            rules = await palette.json();
          }
          return {avatar, rules};
        } catch (error) { if (browserAvatarBase === entry) browserAvatarBase = undefined; throw error; }
        finally { clearTimeout(timeout); }
      })();
    }
    const {avatar, rules} = await browserAvatarBase.promise;
    if (signal.aborted || account !== userId) throw new Error('Avatar update cancelled.');
    return previewDefinition(avatar, rules, selected, backgroundId);
  }
  async function applyBodyColorChange(request) {
    const account = userId;
    if (!editingLarp() || String(request.userId) !== String(account) || !/^\/my\/avatar\/?$/i.test(location.pathname)) throw new Error('Reopen the avatar editor with Larp mode on.');
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const source = request.colors?.bodyColor3s || request.colors?.bodyColors || request.colors;
      let rules = {};
      if (Object.values(source || {}).some(value => typeof value === 'number')) {
        const response = await fetch('https://avatar.roblox.com/v1/avatar-rules', {credentials:'include', signal:controller.signal});
        if (!response.ok) throw new Error('Could not load the body color palette. Try again.');
        rules = await response.json();
      }
      // Validate the requested colors before changing or loading the current outfit.
      const patch = changedBodyColors({}, request.colors, rules);
      let current = read(account);
      if (!current.gameLook) {
        const selected = outfitAssets(current.items.filter(item => current.equipped.includes(keyFor(item)) && supportsOutfit(item)));
        await loadBrowserPreview(selected, controller.signal);
      }
      if (controller.signal.aborted || account !== userId || !editingLarp() || !/^\/my\/avatar\/?$/i.test(location.pathname)) throw new Error('Your avatar changed. Try the color again.');
      current = read(account);
      if (!current.mode) throw new Error('Turn Larp mode on before changing colors.');
      let look = current.gameLook;
      if (!look) {
        const {avatar, rules:baseRules} = await browserAvatarBase.promise;
        const selected = outfitAssets(current.items.filter(item => current.equipped.includes(keyFor(item)) && supportsOutfit(item)));
      const definition = previewDefinition(avatar, baseRules, selected, current.backgroundId);
        const known = new Map((avatar.assets || []).map(item => [item.id, {id:item.id, name:item.name || 'Roblox item', assetType:item.assetType?.id, itemType:'Asset'}]));
        for (const item of selected) known.set(item.id, item);
        look = {version:1, userId:String(account), definition, items:definition.assets.map(asset => known.get(asset.id)).filter(item => item && Number.isInteger(item.assetType))};
        current = mergeGameSnapshot(current, look);
      }
      save({...current, gameLook:{...look, definition:{...look.definition, bodyColors:{...look.definition.bodyColors, ...patch}}}}, true);
    } finally {clearTimeout(timeout);}
  }
  async function captureCharacter() {
    const account = userId, current = state;
    if (!current?.mode) throw new Error('Turn Larp mode on first.');
    const selected = outfitAssets(current.items.filter(item => current.equipped.includes(keyFor(item)) && supportsOutfit(item)));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const definition = current.gameLook ? gamePreviewDefinition(current) : await loadBrowserPreview(selected, controller.signal);
      const known = new Map([...(current.gameLook?.items || []), ...selected].map(item => [item.id, item]));
      const items = [];
      for (let start = 0; start < definition.assets.length; start += 4) {
        const batch = await Promise.all(definition.assets.slice(start, start + 4).map(async asset => {
          let item = known.get(asset.id);
          if (!item?.assetType) {
            const response = await fetch(`https://economy.roblox.com/v2/assets/${asset.id}/details`, {signal: controller.signal});
            if (!response.ok) throw new Error('Could not read all worn items. Try saving again.');
            const data = await response.json();
            item = {assetType: data.AssetTypeId, name: data.Name};
          }
          return {id: asset.id, itemType: 'Asset', assetType: Number(item.assetType), name: String(item.name || `Item ${asset.id}`).slice(0, 128)};
        }));
        items.push(...batch);
      }
      if (account !== userId || !state.mode || JSON.stringify(current.equipped) !== JSON.stringify(state.equipped) || JSON.stringify(current.gameLook) !== JSON.stringify(state.gameLook)) throw new Error('Your outfit changed while saving. Try again.');
      const snapshot = {version: 1, userId: String(account), definition, ...(current.backgroundId ? {backgroundId: current.backgroundId} : {}), items};
      return JSON.parse(JSON.stringify(LarpbloxGameBridge.validateSnapshot(snapshot, account)));
    } finally { clearTimeout(timer); }
  }
  function applyCharacter(snapshot) {
    if (!state?.mode) throw new Error('Turn Larp mode on first.');
    LarpbloxGameBridge.validateSnapshot(snapshot, userId);
    // Native saved outfits are complete replacements; local backgrounds are
    // not part of that payload and should not survive selecting one.
    save(mergeGameSnapshot({...state, backgroundId: undefined}, JSON.parse(JSON.stringify(snapshot))), true);
  }
  async function applyNativeCharacter(card) {
    const account = userId;
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 20000);
    const readJson = async url => {
      const response = await fetch(url, {credentials:'include', signal:controller.signal});
      if (!response.ok) throw new Error('Could not load this Roblox character. Try again.');
      return response.json();
    };
    try {
      let id = Number(card.dataset.outfitId || card.dataset.userOutfitId);
      const source = card.querySelector('img')?.getAttribute('src') || '';
      if (!id && /type=Outfit/i.test(source)) id = Number(source.match(/[?&]id=(\d+)/i)?.[1]);
      if (!id) {
        const name = (card.querySelector('.item-card-name-link, .item-card-name')?.textContent || '').trim();
        const matches = [];
        for (let page = 1; page <= 20; page++) {
          const result = await readJson(`https://avatar.roblox.com/v1/users/${account}/outfits?outfitType=Avatar&page=${page}&itemsPerPage=100`);
          matches.push(...(result.data || []).filter(outfit => outfit.name === name));
          if (!(result.data || []).length || result.data.length < 100) break;
        }
        if (matches.length !== 1) throw new Error('Could not identify this saved outfit. Give it a unique name and try again.');
        id = matches[0].id;
      }
      const avatar = await readJson(`https://avatar.roblox.com/v1/outfits/${id}/details`);
      const rules = avatar.bodyColor3s ? {} : await readJson('https://avatar.roblox.com/v1/avatar-rules');
      const definition = previewDefinition(avatar, rules, []);
      const items = (avatar.assets || []).map(asset => ({id:asset.id,name:String(asset.name || `Item ${asset.id}`).slice(0,128),itemType:'Asset',assetType:Number(asset.assetType?.id)}));
      if (account !== userId || !editingLarp()) throw new Error('The selected avatar changed while loading. Switch to Larp avatar and try again.');
      applyCharacter({version:1,userId:String(account),definition,items});
    } finally { clearTimeout(timer); }
  }
  async function characterThumbnail(snapshot) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try { return await LarpbloxAvatarSurfaces.characterThumbnail(snapshot.definition, snapshot.userId, controller.signal); }
    finally { clearTimeout(timer); }
  }
  let avatarEditorView = 'larp';
  let previewRetryTimer, previewRetryKey, previewFailure, previewRetries = 0;
  const editingLarp = () => Boolean(state?.mode && avatarEditorView === 'larp');
  function syncAvatarEditorView(editor) {
    if (!editor) return;
    editor.querySelector('.larpbux-avatar-view-controls')?.remove();
    if (!state?.mode) { editor.removeAttribute('data-larpbux-avatar-view'); return; }
    editor.setAttribute('data-larpbux-avatar-view', avatarEditorView);
  }
  const nativeHatTiles = new Map();
  const nativeHatFrames = new WeakSet();
  function syncNativeHatTiles(editor, holder) {
    for (const [tile, saved] of nativeHatTiles) {
      if (editingLarp() && tile.isConnected && editor?.contains(tile)) continue;
      for (const [property, [value, priority]] of Object.entries(saved)) {
        if (value) tile.style.setProperty(property, value, priority); else tile.style.removeProperty(property);
      }
      nativeHatTiles.delete(tile);
    }
    if (!editingLarp() || !holder || typeof getComputedStyle !== 'function') return;
    const left = editor.querySelector('.left-wrapper') || holder.parentElement;
    if (!left) return;
    const frameBounds = holder.getBoundingClientRect();
    const candidates = new Set(left.querySelectorAll('img,.icon-hat,[class*="icon-hat"],[class*="hat-slot"],[class*="accessory-slot"],[class*="icon-head"],[aria-label*="hat" i]'));
    // Roblox also renders empty slots as unlabelled square sprite containers.
    for (const element of left.querySelectorAll('button,a,div,span')) {
      if (element.closest('.larpbux-avatar-hats,.larpbux-avatar-look,.larpbux-avatar-view-controls')) continue;
      const bounds = element.getBoundingClientRect();
      if (bounds.width < 40 || bounds.width > 56 || Math.abs(bounds.width - bounds.height) > 2 || element.textContent.trim()) continue;
      if (bounds.top < frameBounds.top || bounds.bottom > frameBounds.bottom || bounds.left > frameBounds.left + 70 || bounds.right < frameBounds.left - 60) continue;
      const background = getComputedStyle(element).backgroundColor;
      if (background && !['transparent','rgba(0, 0, 0, 0)'].includes(background)) candidates.add(element);
    }
    for (const image of candidates) {
      if (image.closest('.larpbux-avatar-hats,.larpbux-avatar-look,.larpbux-avatar-view-controls')) continue;
      const tile = image.closest('button,a,[role="button"]') || (candidates.has(image) && ['DIV','BUTTON','A'].includes(image.tagName) ? image : image.parentElement);
      if (!tile || tile === holder || tile.contains(holder) || tile.closest('.toggle-three-dee') || tile.textContent.trim()) continue;
      const rect = tile.getBoundingClientRect();
      if (rect.width < 24 || rect.width > 90 || rect.height < 24 || rect.height > 90) continue;
      if (!nativeHatTiles.has(tile)) {
        const style = getComputedStyle(tile);
        const frame = holder.getBoundingClientRect();
        // Keep the initial anchor: Real view can temporarily shift the native viewer.
        if (!nativeHatFrames.has(holder)) {
          holder.style.setProperty('--larpbux-hat-left', `${rect.left - frame.left}px`);
          holder.style.setProperty('--larpbux-hat-top', '15px');
          holder.style.setProperty('--larpbux-hat-size', `${rect.width}px`);
          nativeHatFrames.add(holder);
        }
        if (style.backgroundColor && !['transparent','rgba(0, 0, 0, 0)'].includes(style.backgroundColor)) {
          holder.style.setProperty('--larpbux-hat-background', style.backgroundColor);
          holder.style.setProperty('--larpbux-hat-radius', style.borderRadius);
        }
        const saved = {};
        for (const property of ['visibility','pointer-events','display']) saved[property] = [tile.style.getPropertyValue(property), tile.style.getPropertyPriority(property)];
        nativeHatTiles.set(tile, saved);
      }
      tile.style.setProperty('visibility', 'hidden', 'important'); tile.style.setProperty('pointer-events', 'none', 'important'); tile.style.setProperty('display', 'none', 'important');
    }
  }
  function updateLarpHatRail(editor) {
    const holder = editor?.querySelector('.avatar-thumbnail');
    syncNativeHatTiles(editor, holder);
    if (!holder) return;
    let rail = holder.querySelector('.larpbux-avatar-hats');
    const breadcrumb = [...editor.querySelectorAll('.breadcrumb-container,.breadcrumb,.avatar-category-title,[aria-label="Breadcrumb"],[aria-label="breadcrumb"]')]
      .find(element => element.getClientRects().length && element.textContent?.trim());
    const labels = [];
    const readLabels = element => {
      if (element.childNodes?.length) for (const child of element.childNodes) readLabels(child);
      else labels.push(element.textContent?.trim() || '');
    };
    if (breadcrumb) readLabels(breadcrumb);
    const category = labels.filter(Boolean).join(' ');
    const hatTab = /(?:^|[>\s])hats?(?:$|[>\s])/i.test(category) || (/accessor/i.test(category) && /(?:^|[>\s])head(?:$|[>\s])/i.test(category));
    holder.classList.toggle('larpbux-hat-tab', Boolean(editingLarp() && hatTab));
    if (!editingLarp() || !hatTab) { rail?.remove(); return; }
    if (!rail) { rail = node('div', '', 'larpbux-avatar-hats'); rail.setAttribute('aria-label', 'Equipped Larp hats'); holder.append(rail); }
    const hats = state.items.filter(item => state.equipped.includes(keyFor(item)) && Number(item.assetType) === 8);
    const signature = JSON.stringify(hats);
    if (rail.dataset.signature === signature) return;
    rail.dataset.signature = signature; rail.replaceChildren();
    for (const item of hats) {
      const button = node('button'); button.type = 'button'; button.title = `Remove ${item.name}`; button.setAttribute('aria-label', `Remove ${item.name}`);
      const image = node('img'); image.alt = item.name; thumbnail(image, item); button.append(image);
      button.addEventListener('click', () => { if (editingLarp()) action(() => save(equip(state, keyFor(item)), true)); });
      rail.append(button);
    }
    for (let index = hats.length; index < 3; index++) {
      const empty = node('button'); empty.type = 'button'; empty.disabled = true;
      empty.className = 'larpbux-empty-hat'; empty.setAttribute('aria-label', 'Empty hat slot');
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 28 24'); icon.setAttribute('width', '28'); icon.setAttribute('height', '24');
      icon.setAttribute('aria-hidden', 'true'); icon.classList.add('larpbux-empty-hat-icon');
      const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      outline.setAttribute('d', 'M6 19 7 8Q8 5 11 7Q14 4 18 7L20 19M7 16Q13 18 20 16M3 20Q14 22 25 20');
      outline.setAttribute('fill', 'none'); outline.setAttribute('stroke', '#bfc0c4');
      outline.setAttribute('stroke-width', '1.6'); outline.setAttribute('stroke-linecap', 'round'); outline.setAttribute('stroke-linejoin', 'round');
      icon.append(outline); empty.append(icon);
      rail.append(empty);
    }
  }
  async function updateAvatarPreview(editor) {
    const selected = editingLarp() ? state.items.filter(item => state.equipped.includes(keyFor(item)) && supportsOutfit(item)) : [];
    const backgroundId = editingLarp() ? state.backgroundId : undefined;
    const holder = editor?.querySelector('.avatar-thumbnail');
    const gameLook = editingLarp() && state.gameLook;
    holder?.classList.toggle('larpbux-local-preview', Boolean(editingLarp() && (selected.length || backgroundId || gameLook)));
    if (!holder || (!selected.length && !backgroundId && !gameLook)) {
      clearTimeout(previewRetryTimer); previewRetryKey = undefined;
      previewFailure = undefined;
      previewController?.abort(); previewViewer?.dispose(); previewElement?.remove();
      previewViewer = undefined; previewElement = undefined; previewSignature = undefined; return;
    }
    if (!editingLarp()) {
      previewController?.abort(); previewViewer?.dispose(); previewElement?.remove();
      previewViewer = undefined; previewElement = undefined; previewSignature = undefined; return;
    }
    // Roblox's existing toggle names the mode it will switch to, not the current mode.
    const toggle = editor.querySelector('.toggle-three-dee');
    const threeDimensional = !/^3d$/i.test(toggle?.textContent?.trim() || '');
    const signature = JSON.stringify([userId, selected.map(item => item.id), backgroundId, threeDimensional, gameLook?.definition, Boolean(state?.mode)]);
    if (previewSignature === signature && (previewElement?.isConnected || (!selected.length && !gameLook))) return;
    clearTimeout(previewRetryTimer);
    if (previewRetryKey !== signature) { previewRetryKey = signature; previewRetries = 0; }
    previewController?.abort(); previewController = new AbortController();
    const controller = previewController, signal = controller.signal, account = userId;
    previewFailure = undefined;
    previewSignature = signature;
    if (previewElement?.parentElement !== holder) {
      previewViewer?.dispose(); previewViewer = undefined; previewElement?.remove();
      previewElement = node('div', '', 'larpbux-avatar-look'); previewElement.hidden = true; holder.append(previewElement);
    }
    const surface = previewElement;
    // Use the native viewer's backdrop rather than a separate white panel.
    if (typeof getComputedStyle === 'function') {
      const candidates = [...holder.querySelectorAll('canvas'), holder, editor.querySelector('.avatar-back')].filter(element => element && !surface.contains(element));
      const styles = candidates.map(element => getComputedStyle(element));
      const backdrop = styles.find(style => style.backgroundImage && style.backgroundImage !== 'none')
        || styles.find(style => style.backgroundColor && !['transparent', 'rgba(0, 0, 0, 0)'].includes(style.backgroundColor));
      holder.style.setProperty('--larpbux-preview-background', backdrop?.backgroundColor || 'transparent');
      holder.style.setProperty('--larpbux-preview-image', backdrop?.backgroundImage || 'none');
    }
    const view = previewViewer?.getView();
    const pending = node('div', '', 'larpbux-avatar-scene');
    pending.classList.add('larpbux-avatar-loading');
    surface.append(pending);
    let nextViewer, committed = false;
    try {
      let definition;
      if (gameLook) definition = gamePreviewDefinition(state);
      else {
        definition = await loadBrowserPreview(selected, signal);
      }
      if (account !== userId || signature !== previewSignature || signal.aborted) return;
      const cachedImage = LarpbloxAvatarRequests.cached?.(definition, account, '2d');
      if (cachedImage && surface.hidden) {
        const fallback = node('div', '', 'larpbux-avatar-scene');
        const image = node('img'); image.alt = 'Your avatar with selected items';
        image.onload = () => {
          if (committed || account !== userId || signature !== previewSignature || signal.aborted) return;
          fallback.append(image); surface.prepend(fallback); surface.hidden = false;
        };
        image.src = cachedImage;
      }
      if (!selected.length && !backgroundId && !gameLook) {
        previewViewer?.dispose(); previewElement?.remove();
        previewViewer = undefined; previewElement = undefined; previewController = undefined;
        return;
      }
      let renderKind = threeDimensional && previewRetries < 2 ? '3d' : '2d';
      for (let attempt = 0; attempt < 2; attempt++) {
        let imageUrl;
        try { imageUrl = await LarpbloxAvatarRequests.render(definition, account, signal, renderKind); }
        catch (error) {
          const cachedImage = renderKind === '3d' && error.status === 429 && !signal.aborted
            ? LarpbloxAvatarRequests.cached?.(definition, account, '2d') : undefined;
          if (cachedImage) { imageUrl = cachedImage; renderKind = '2d'; }
          else {
            if (renderKind === '3d' && error.status !== 429 && !signal.aborted) { renderKind = '2d'; continue; }
            throw error;
          }
        }
        if (account !== userId || signature !== previewSignature || signal.aborted) return;
          if (renderKind === '3d') {
            try {
              if (typeof LarpbloxAvatar3D === 'undefined') throw new Error('3D preview is unavailable.');
              const modelController = new AbortController();
              const cancelModel = () => modelController.abort();
              signal.addEventListener('abort', cancelModel, {once: true});
              const modelTimeout = setTimeout(cancelModel, 8000);
              try { nextViewer = await LarpbloxAvatar3D.create(pending, imageUrl, {signal: modelController.signal, view, definition}); }
              finally { clearTimeout(modelTimeout); signal.removeEventListener('abort', cancelModel); }
            } catch (error) {
              if (signal.aborted) throw error;
              pending.replaceChildren(); renderKind = '2d';
              continue;
            }
          } else {
            const image = node('img'); image.alt = 'Your avatar with selected items';
            await new Promise((resolve, reject) => {
              const finish = error => {
                clearTimeout(timer); signal.removeEventListener('abort', abort);
                image.onload = image.onerror = null; error ? reject(error) : resolve();
              };
              const abort = () => finish(new Error('Avatar update cancelled.'));
              const timer = setTimeout(() => finish(new Error('Avatar image took too long to load.')), 15000);
              image.onload = () => finish(); image.onerror = () => finish(new Error('Avatar image could not load.'));
              signal.addEventListener('abort', abort, {once: true}); image.src = imageUrl;
            });
            pending.append(image);
          }
          if (account !== userId || signature !== previewSignature || signal.aborted) return;
          previewViewer?.dispose(); previewViewer = nextViewer;
          pending.classList.remove('larpbux-avatar-loading');
          surface.replaceChildren(pending); surface.hidden = false;
          holder.classList.add('larpbux-local-preview');
          committed = true; previewRetries = 0;
          previewFailure = undefined;
          for (const button of editor.querySelectorAll('.larpbux-avatar-item button')) button.title = '';
          // Image publication is deliberately detached from preview rendering.
          publishPreviewImage(definition, imageUrl, account, signal, signature, renderKind !== '2d');
          return;
      }
      throw new Error('The avatar preview is still processing. Try Wear again.');
    } catch (error) {
      if (account !== userId || signature !== previewSignature || signal.aborted) return;
      const reason = error.message;
      previewFailure = {status:error.status, message:reason};
      surface.title = reason;
      if (error.status === 429 || previewRetries < 2) {
        if (error.status !== 429) previewRetries++;
        previewRetryTimer = setTimeout(() => {
          if (signature !== previewSignature || account !== userId || !editingLarp()) return;
          previewSignature = undefined; updateAvatarPreview(editor);
        }, Math.max(1000, 800 * previewRetries, (error.retryAfter || 0) * 1000));
      }
      for (const button of editor.querySelectorAll('.larpbux-avatar-item button')) button.title = error.message;
    } finally {
      if (!committed) { nextViewer?.dispose(); pending.remove(); }
    }
  }
  function updateOwnAvatarSurfaces() {
    const current = state, account = userId;
    const selected = current?.items.filter(item => current.equipped.includes(keyFor(item)) && supportsOutfit(item)) || [];
    const signature = JSON.stringify([account, selected.map(item => item.id), current?.backgroundId, current?.gameLook?.definition, current?.names]);
    const loadDefinition = signal => current?.gameLook ? Promise.resolve(gamePreviewDefinition(current)) : loadBrowserPreview(selected, signal);
    if (typeof LarpbloxProfileWearing !== 'undefined') LarpbloxProfileWearing.update({
      userId: account, active: Boolean(current?.mode), signature,
      items: [...(current?.gameLook?.items || []), ...(current?.items || [])], backgroundId: current?.backgroundId, loadDefinition, thumbnail,
    });
    if (typeof LarpbloxAvatarSurfaces !== 'undefined') LarpbloxAvatarSurfaces.update({
      userId: account,
      active: Boolean(current?.mode && (current.gameLook || selected.length || current.backgroundId)),
      backgroundId: current?.backgroundId, signature, loadDefinition,
    });
    if (typeof LarpbloxSharedUsers !== 'undefined' && typeof LarpbloxSharedUsers.publishProfile === 'function') LarpbloxSharedUsers.publishProfile({
      userId: account, active: Boolean(current?.mode), signature, loadDefinition, names: current?.names, verified: current?.verified === true, socialCounts: current?.socialCounts,
    });
  }
  async function bundleAssets(data, signal) {
    let entries = (data.items || []).filter(entry => entry.type === 'Asset');
    if (entries.some(entry => !Number.isSafeInteger(Number(entry.assetType)) || Number(entry.assetType) <= 0)) {
      const outfit = (data.items || []).find(entry => entry.type === 'UserOutfit');
      if (outfit) {
        const response = await fetch(`https://avatar.roblox.com/v1/outfits/${outfit.id}/details`, {credentials:'include', signal});
        if (!response.ok) throw new Error('Character parts could not load.');
        const owned = new Set(entries.map(entry => Number(entry.id)));
        entries = ((await response.json()).assets || []).filter(entry => owned.has(Number(entry.id)));
      } else entries = await Promise.all(entries.map(async entry => {
        const response = await fetch(`https://economy.roblox.com/v2/assets/${entry.id}/details`, {signal});
        if (!response.ok) throw new Error('Character part could not load.');
        const details = await response.json(); return {...entry, assetType:details.AssetTypeId};
      }));
    }
    return entries.map(entry => ({id:Number(entry.id), assetType:Number(entry.assetType?.id || entry.assetType), name:String(entry.name || '').slice(0,128), itemType:'Asset'})).filter(isWearableAsset);
  }
  // Recover older purchases whose category had not loaded when they were bought.
  const typeRepairs = new Map();
  function repairPurchasedTypes() {
    if (!state?.mode || !userId) return;
    const account = userId;
    for (const item of state.items.filter(item => (item.itemType === 'Asset' && (!item.assetTypeVerified || !item.limitedVerified)) || (item.itemType === 'Bundle' && (!item.bundleType || !Array.isArray(item.assets))))) {
      const repairKey = `${account}:${item.id}`;
      if ((typeRepairs.get(repairKey) || 0) > Date.now()) continue;
      if ([...typeRepairs.values()].filter(value => value === Infinity).length >= 4) break;
      typeRepairs.set(repairKey, Infinity);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const endpoint = item.itemType === 'Bundle' ? `https://catalog.roblox.com/v1/bundles/${item.id}/details` : `https://economy.roblox.com/v2/assets/${item.id}/details`;
      fetch(endpoint, {signal: controller.signal})
        .then(response => { if (!response.ok) throw new Error('Item type unavailable'); return response.json(); })
        .then(async data => {
          const assets = item.itemType === 'Bundle' ? await bundleAssets(data, controller.signal) : undefined;
          if (item.itemType === 'Asset' && (!Number.isSafeInteger(data.AssetTypeId) || data.AssetTypeId <= 0)) throw new Error('Item type unavailable');
          if (item.itemType === 'Bundle' && !['AvatarAnimations','BodyParts','DynamicHead'].includes(data.bundleType)) throw new Error('Item type unavailable');
          if (userId !== account) return;
          const latest = read(account);
          if (!latest.items.some(owned => keyFor(owned) === keyFor(item) && (item.itemType === 'Bundle' || (!owned.assetTypeVerified || !owned.limitedVerified)))) return;
          save({...latest, items: latest.items.map(owned => keyFor(owned) === keyFor(item) ? {...owned, ...(item.itemType === 'Bundle' ? {bundleType: data.bundleType, assets} : {assetType: owned.assetTypeVerified ? owned.assetType : data.AssetTypeId, assetTypeVerified:true, limitedVerified:true, isLimited:data.IsLimited === true, isLimitedUnique:data.IsLimitedUnique === true})} : owned)});
        })
        .catch(() => {})
        .finally(() => { clearTimeout(timer); typeRepairs.set(repairKey, Date.now() + 60000); });
    }
  }
  function updateLimitedBadge(holder, item) {
    holder.querySelector('.larpbux-limited-badge')?.remove();
    if (!item.isLimited && !item.isLimitedUnique) return;
    const badge = node('span', '', `larpbux-limited-badge${item.isLimitedUnique ? ' larpbux-limited-unique' : ''}`);
    badge.setAttribute('role', 'img'); badge.setAttribute('aria-label', item.isLimitedUnique ? 'Limited Unique' : 'Limited');
    badge.append(node('span', '', item.isLimitedUnique ? 'icon-limited-unique-label' : 'icon-limited-label')); 
    holder.append(badge);
  }
  const nativeEquipControls = new Map();
  function restoreNativeEquipControls() {
    for (const [control, saved] of nativeEquipControls) {
      if (saved.disabled) control.setAttribute('disabled', '');
      if (saved.aria === null) control.removeAttribute('aria-disabled'); else control.setAttribute('aria-disabled', saved.aria);
    }
    nativeEquipControls.clear();
  }
  function updateAvatar() {
    updateOwnAvatarSurfaces();
    // Purchased cosmetics use the same grid and card markup as the real editor.
    const editor = document.querySelector('#avatar-web-app');
    syncAvatarEditorView(editor);
    updateLarpHatRail(editor);
    if (typeof LarpbloxCharacters !== 'undefined') LarpbloxCharacters.update({editor, userId, active: editingLarp(), capture: captureCharacter, apply: applyCharacter, applyNative: applyNativeCharacter, thumbnail: characterThumbnail});
    if (!editor) {
      restoreNativeEquipControls();
      for (const card of document.querySelectorAll('.larpbux-avatar-item')) card.remove();
      updateAvatarPreview(null); return;
    }
    if (!editingLarp()) {
      restoreNativeEquipControls();
      for (const card of document.querySelectorAll('.larpbux-avatar-item')) card.remove();
      for (const card of document.querySelectorAll('.larpbux-native-item')) {
        card.classList.remove('larpbux-native-item');
        card.removeAttribute('data-larpbux-equipped');
        card.querySelector('.larpbux-native-equipped')?.remove();
        const holder = card.querySelector('.item-card-thumb-container, .thumbnail-2d-container');
        if (holder) delete holder.dataset.larpbuxNativeIndicator;
      }
      updateAvatarPreview(editor); return;
    }
    repairPurchasedTypes();
    updateAvatarPreview(editor);
    const list = [...editor.querySelectorAll('.items-list.avatar-item-list')].find(element => element.getClientRects().length);
    if (!list) return;
    const first = [...list.querySelectorAll('.item-card:not(.larpbux-avatar-item)')].find(card => !card.classList.contains('larpbux-character-card'));
    const grid = first?.parentElement || list.querySelector('ul, .rbx2016-avatar-grid') || list;
    const nativeCards = [...list.querySelectorAll('.item-card')].filter(card => !card.classList.contains('larpbux-avatar-item') && !card.classList.contains('larpbux-character-card'));
    const account = userId;
    const cardClasses = (first?.className || 'item-card').split(/\s+/).filter(name => name !== 'larpbux-native-item').join(' ');
    const nativeEquipped = nativeCards
      .map(card => [...card.querySelectorAll('.item-card-equipped')].find(indicator => !indicator.classList.contains('larpbux-native-equipped'))).find(Boolean);
    const updateEquipped = (holder, equipped) => {
      if (holder.dataset.larpbuxNativeIndicator === String(equipped)) return;
      holder.querySelector('.larpbux-native-equipped')?.remove();
      holder.dataset.larpbuxNativeIndicator = String(equipped);
      if (!equipped) return;
      const indicator = nativeEquipped ? nativeEquipped.cloneNode(true) : node('span', '', 'item-card-equipped');
      if (!nativeEquipped) indicator.append(node('span', '', 'icon-check-selection'));
      indicator.classList.add('larpbux-native-equipped');
      indicator.removeAttribute('id');
      indicator.setAttribute('aria-hidden', 'true');
      holder.append(indicator);
    };
    const label = [...editor.querySelectorAll('.breadcrumb-container, .breadcrumb, .avatar-category-title, [aria-label="Breadcrumb"], [aria-label="breadcrumb"]')]
      .find(element => element.getClientRects().length && element.textContent?.trim())?.textContent?.toLowerCase() || '';
    const category = label || editor.querySelector('[aria-selected="true"]')?.textContent?.toLowerCase() || '';
    const isEquippedItem = item => isBackground(item) ? state.backgroundId === item.id : state.equipped.includes(keyFor(item));
    const items = state.items.filter(item => item.source !== 'native' && matchesAvatarCategory(item, category, isEquippedItem(item)));
    const signature = JSON.stringify([userId, items, state.equipped, state.backgroundId, category, cardClasses, nativeEquipped?.outerHTML]);
    const cards = [...grid.querySelectorAll('.larpbux-avatar-item')];
    if (grid._larpbuxSignature !== signature || cards.length !== items.length) {
      const existing = new Map(cards.map(card => [card.dataset.larpbuxKey, card]));
      const wanted = new Set(items.map(keyFor));
      for (const card of cards) if (!wanted.has(card.dataset.larpbuxKey)) card.remove();
      for (const item of items) {
        const itemKey = keyFor(item), equipped = isBackground(item) ? state.backgroundId === item.id : isBodyBundle(item) ? item.assets.filter(isWearableAsset).every(part => state.equipped.includes(keyFor(part))) : state.equipped.includes(itemKey);
        const label = equipped ? 'Remove' : 'Wear';
        const previous = existing.get(itemKey);
        if (previous) {
          previous.className = `${cardClasses} larpbux-avatar-item`;
          previous.dataset.larpbuxEquipped = String(equipped);
          const button = previous.querySelector('.item-card-thumb');
          button.setAttribute('aria-label', `${label} ${item.name}`);
          button.setAttribute('aria-pressed', String(equipped));
          button.querySelector('.larpbux-avatar-action').textContent = label;
          previous.querySelector('.item-card-name-link').textContent = item.name;
          updateEquipped(previous.querySelector('.item-card-thumb-container'), equipped);
          updateLimitedBadge(previous.querySelector('.item-card-thumb'), item);
          continue;
        }
        const card = node('li', '', `${cardClasses} larpbux-avatar-item`);
        card.dataset.larpbuxKey = itemKey;
        card.dataset.larpbuxEquipped = String(equipped);
        const container = node('div', '', 'item-card-container');
        const holder = node('div', '', 'item-card-thumb-container');
        const button = node('a', '', 'item-card-thumb');
        button.href = `/${item.itemType === 'Bundle' ? 'bundles' : 'catalog'}/${item.id}`;
        button.setAttribute('role', 'button');
        button.append(node('span', label, 'larpbux-avatar-action'));
        button.setAttribute('aria-label', `${equipped ? 'Remove' : 'Wear'} ${item.name}`);
        button.setAttribute('aria-pressed', String(equipped));
        const thumb = node('span', '', 'thumbnail-2d-container'); const image = node('img'); thumbnail(image, item); thumb.append(image); button.append(thumb);
        button.addEventListener('click', event => {
          if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault(); event.stopPropagation(); action(() => save(equip(state, keyFor(item)), true));
        });
        button.addEventListener('keydown', event => {
          if (event.key === ' ') { event.preventDefault(); button.click(); }
        });
        holder.append(button);
        updateLimitedBadge(button, item);
        updateEquipped(holder, equipped);
        const caption = node('div', '', 'item-card-caption');
        const link = node('a', item.name, 'item-card-name-link'); link.href = `/${item.itemType === 'Bundle' ? 'bundles' : 'catalog'}/${item.id}`; caption.append(link);
        container.append(holder, caption); card.append(container); grid.append(card);
        existing.set(itemKey, card);
      }
      // Keep unchanged cards attached so focus and browser scroll anchoring stay put.
      let cursor = grid.firstChild;
      for (const item of [...items].reverse()) {
        const card = existing.get(keyFor(item));
        if (card !== cursor) grid.insertBefore(card, cursor);
        cursor = card.nextSibling;
      }
      grid._larpbuxSignature = signature;
    }
    // Roblox's cards normally submit an account avatar change. In Larp mode
    // they are local controls instead: import the card at zero cost, then use
    // the same equip() state and bridge/preview path as purchased cosmetics.
    const categoryAssetType = name => {
      name = String(name).toLowerCase().replace(/[^a-z]/g, '');
      if (/hair/.test(name)) return 41;
      if (/tshirts?/.test(name)) return 2;
      if (/shirts?$/.test(name)) return 11;
      if (/pants$/.test(name)) return 12;
      if (/hats?/.test(name)) return 8;
      if (/gear/.test(name)) return 19;
      if (/eyebrow/.test(name)) return 76;
      if (/eyelash/.test(name)) return 77;
      if (/face/.test(name)) return 42;
      if (/neck/.test(name)) return 43;
      if (/shoulder/.test(name)) return 44;
      if (/front/.test(name)) return 45;
      if (/back/.test(name)) return 46;
      if (/waist/.test(name)) return 47;
      if (/background/.test(name)) return 92;
      return undefined;
    };
    const nativeCardItem = card => {
      const link = [...card.querySelectorAll('a')].find(anchor => /\/(?:catalog|bundles)\//.test(anchor.getAttribute('href') || anchor.href || ''));
      const href = link?.getAttribute('href') || link?.href || card.getAttribute('data-item-id') || '';
      const match = String(href).match(/\/(?:catalog|bundles)\/(\d+)/) || String(href).match(/(?:^|[^\d])(\d{2,})/);
      const id = Number(match?.[1] || card.dataset?.itemId || 0);
      if (!Number.isSafeInteger(id) || id <= 0) return null;
      const itemType = /\/bundles\//.test(String(href)) || card.dataset?.itemType === 'Bundle' ? 'Bundle' : 'Asset';
      const rawType = card.dataset?.assetType || card.getAttribute('data-asset-type') || card.getAttribute('data-assettype');
      const assetType = Number(rawType) || categoryAssetType(category);
      const name = (card.querySelector('.item-card-name-link, [data-testid="item-name"]')?.textContent || link?.textContent || card.getAttribute('aria-label') || 'Roblox item').trim();
      return {id, name, itemType, assetType, price: 0, source: 'native', assetTypeVerified: Boolean(rawType)};
    };
    for (const card of nativeCards) {
      const native = nativeCardItem(card);
      if (!native) continue;
      const nativeKey = keyFor(native);
      const equipped = isBackground(native) ? state.backgroundId === native.id : state.equipped.includes(nativeKey);
      card.classList.add('larpbux-native-item');
      card.dataset.larpbuxEquipped = String(equipped);
      for (const control of card.querySelectorAll('.item-card-thumb, .item-card-thumb-container button')) {
        if (!nativeEquipControls.has(control)) nativeEquipControls.set(control, {disabled: control.hasAttribute('disabled'), aria: control.getAttribute('aria-disabled')});
        control.removeAttribute('disabled'); control.removeAttribute('aria-disabled');
      }
      const holder = card.querySelector('.item-card-thumb-container, .thumbnail-2d-container');
      if (holder) updateEquipped(holder, equipped);
      if (!card._larpbuxNativeAuxclick) {
        card.addEventListener('auxclick', event => {
          if (event.button !== 1 || !event.target.closest?.('.item-card-thumb, .item-card-thumb-container, button')) return;
          openItemOnMiddleClick(event, native);
        }, true);
        card._larpbuxNativeAuxclick = true;
      }
      if (card._larpbuxNativeClick) continue;
      const click = event => {
        if (!editingLarp() || account !== userId) return;
        const target = event.target;
        const anchor = target?.closest?.('a');
        if (anchor && !anchor.closest?.('.item-card-thumb, .item-card-thumb-container, button')) return;
        event.preventDefault?.(); event.stopPropagation?.(); event.stopImmediatePropagation?.();
        const finish = item => action(() => {
          if (!supportsCosmetic(item) || !editingLarp() || account !== userId) return;
          const current = read(userId), existing = current.items.find(value => keyFor(value) === nativeKey);
          const next = existing ? current : {...current, items: [...current.items, item]};
          save(equip(next, nativeKey), true);
        });
        const known = state.items.find(item => keyFor(item) === nativeKey);
        if (supportsCosmetic(known)) { finish(known); return; }
        if (native.assetTypeVerified && supportsCosmetic(native)) { finish(native); return; }
        const endpoint = native.itemType === 'Bundle' ? `https://catalog.roblox.com/v1/bundles/${native.id}/details` : `https://economy.roblox.com/v2/assets/${native.id}/details`;
        fetch(endpoint).then(response => response.ok ? response.json() : null).then(data => {
          if (!data) return;
          if (native.itemType === 'Asset') finish({...native, assetType: Number(data.AssetTypeId) || 0, assetTypeVerified: true});
          else if (data.bundleType === 'AvatarAnimations') finish({...native, bundleType: data.bundleType, assets: (data.items || []).filter(entry => entry.type === 'Asset').map(entry => ({id: Number(entry.id), assetType: Number(entry.assetType), name: String(entry.name || ''), itemType: 'Asset'}))});
        }).catch(() => {});
      };
      card.addEventListener('click', click, true);
      card._larpbuxNativeClick = click;
    }
  }
  function updateNames() {
    globalThis.LarpbloxVerification?.update({userId, mode:state?.mode === true, verified:state?.verified === true});
    if (typeof LarpbloxNames !== 'undefined') LarpbloxNames.update({userId, mode: state?.mode === true, ...state?.names});
    globalThis.LarpbloxSharedUsers?.update({userId, mode: state?.mode === true, socialCounts: state?.socialCounts});
  }
  function render() {
    if (typeof LarpbloxIdentityGate !== 'undefined') LarpbloxIdentityGate.update();
    document.documentElement.classList.toggle('larpblox-pretend-mode', state.mode);
    updateHeaderBalance();
    updateNames();
    inventoryCards(list);
    updateNativeInventory();
    updateMarketplaceCart();
    exportBox.value = outfit(state, userId);
    updateItem(); updateAvatar();
  }
  function mount() {
    panel = node('section', '', 'larpbux-panel'); panel.hidden = true;
    const close = node('button', 'Close'); close.type = 'button'; close.addEventListener('click', () => { panel.hidden = true; });
    panel.append(node('h2', 'Larpbux · cosmetic inventory'), close);
    panel.append(node('p', 'Pretend currency and local cosmetics. Your real inventory stays available in Roblox. Added accessories keep your current accessories; clothing replaces its slot and gear replaces your held Larp gear. Real Robux and account ownership do not change.'));
    message = node('p'); message.setAttribute('role', 'status');
    bridgeStatus = node('p', 'Not connected.'); bridgeStatus.setAttribute('role', 'status');
    list = node('div', '', 'larpbux-inventory larpbux-inventory-grid');
    exportBox = node('textarea'); exportBox.readOnly = true; exportBox.setAttribute('aria-label', 'Larpblox outfit export');
    const select = node('button', 'Select outfit export'); select.type = 'button'; select.addEventListener('click', () => { exportBox.focus(); exportBox.select(); });
    const diagnostics = node('button', 'Save preview details'); diagnostics.type = 'button';
    diagnostics.addEventListener('click', () => action(() => {
      const data = {...(previewViewer?.getDiagnostics?.() || {}),
        extensionVersion: extensionRuntime?.getManifest?.().version,
        websiteVersion: extensionRuntime?.getManifest?.().websiteVersion,
        route: location.pathname, userId, mode: state?.mode, equipped: state?.equipped,
        hasGameLook: Boolean(state?.gameLook), previewFailure,
        outfitSelectionLog: JSON.parse(localStorage.getItem('larpblox-outfit-debug-v1') || '[]'),
        savedOutfits: JSON.parse(localStorage.getItem(`larpblox-characters-v1:${userId}`) || '{"profiles":[]}'),
        avatarEditorView,
        avatarPictures: typeof LarpbloxAvatarSurfaces === 'undefined' ? {stage: 'module-not-loaded'} : LarpbloxAvatarSurfaces.getDiagnostics()};
      const url = URL.createObjectURL(new Blob([JSON.stringify(data)], {type: 'application/json'}));
      const download = node('a'); download.href = url; download.download = 'larpblox-preview-details.json';
      document.body.append(download); download.click(); download.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      message.textContent = 'Preview details saved. Attach larpblox-preview-details.json in our chat.';
    }));
    panel.append(node('h3', 'Your Larpbux collection'), list,
      node('p', 'Game import supports accessories, classic clothes, movement animations, and held gear visuals. Gear actions are not included. Other items are collection only. The updated game script must be installed first. For games: copy this export, then paste it into Accessories → Browser cosmetic outfit in Larpblox. Supported cosmetics are added to your current look.'), exportBox, select, diagnostics);
    document.body.append(panel);
  }
  function nativePrice() {
    const element = document.querySelector('#item-details .item-price-value .text-robux-lg, #item-details .item-price-value, #item-details .price-row-container .text-robux-lg, #item-details-container .item-price-value .text-robux-lg, #item-details-container .item-price-value, #item-details-container .price-row-container .text-robux-lg, .price-row-container .item-price-value');
    const raw = element?.textContent?.trim().replace(/^(?:R\$|Robux|\uE002)\s*/i, '').replace(/\s*(?:R\$|Robux)$/i, '');
    if (/^free$/i.test(raw || '')) return 0;
    if (raw && /^[\d,\s]+$/.test(raw)) return amount(raw.replace(/[,\s]/g, ''));
    return null;
  }
  function visibleItem() {
    const match = location.pathname.match(/^\/(catalog|bundles)\/(\d+)/);
    const name = document.querySelector('#item-details-container h1, .item-details-name-row h1, #item-details h1')?.textContent?.trim();
    const price = nativePrice();
    if (!match || !name || price === null) return null;
    const typeName = document.querySelector('#type-content')?.textContent?.trim();
    const normalizedType = (typeName || '').toLowerCase().replace(/[^a-z]/g, '');
    const assetType = {
      hat: 8, hats: 8, headaccessories: 8, headaccessory: 8,
      hair: 41, hairaccessory: 41, hairaccessories: 41,
      faceaccessory: 42, faceaccessories: 42, neckaccessory: 43, neckaccessories: 43,
      shoulderaccessory: 44, shoulderaccessories: 44, frontaccessory: 45, frontaccessories: 45,
      backaccessory: 46, backaccessories: 46, waistaccessory: 47, waistaccessories: 47,
      face: 42, neck: 43, shoulder: 44, front: 45, back: 46, waist: 47,
      shirt: 11, shirts: 11, classicshirt: 11, classicshirts: 11,
      pants: 12, classicpants: 12, tshirt: 2, tshirts: 2, classictshirt: 2, classictshirts: 2,
      tshirtaccessory:64, tshirtaccessories:64, shirtaccessory:65, shirtaccessories:65,
      pantsaccessory:66, pantsaccessories:66, jacketaccessory:67, jacketaccessories:67,
      sweateraccessory:68, sweateraccessories:68, shortsaccessory:69, shortsaccessories:69,
      leftshoeaccessory:70, leftshoeaccessories:70, rightshoeaccessory:71, rightshoeaccessories:71,
      dressskirtaccessory:72, dressskirtaccessories:72, eyebrowaccessory:76, eyebrowaccessories:76,
      eyelashaccessory:77, eyelashaccessories:77,
      climbanimation:48, fallanimation:50, idleanimation:51, jumpanimation:52,
      runanimation:53, swimanimation:54, walkanimation:55, poseanimation:56,
      background:92, backgrounds:92,
      gear:19, gears:19,
      gear:19, gears:19,
    }[normalizedType] || {head:8,hair:41,face:42,neck:43,shoulder:44,front:45,back:46,waist:47,eyebrow:76,eyelash:77}[normalizedType.replace(/accessor(?:y|ies)/g, '')] || 0;
    const image = document.querySelector('#item-thumbnail-container-frontend img');
    const isLimitedUnique = Boolean(document.querySelector('#item-thumbnail-container-frontend .icon-limited-unique-label, #item-details .icon-limited-unique-label'));
    const isLimited = isLimitedUnique || Boolean(document.querySelector('#item-thumbnail-container-frontend .icon-limited-label, #item-details .icon-limited-label'));
    return {id: Number(match[2]), itemType: match[1] === 'bundles' ? 'Bundle' : 'Asset', assetType, isLimited, isLimitedUnique, name: name.slice(0, 128), price, thumbnail: image?.currentSrc || image?.src || undefined};
  }
  async function itemData(requestedPath, quotedPrice) {
    // A local quote must not wait on a remote service when the page has the details.
    const visible = !requestedPath && visibleItem();
    if (visible && visible.itemType === 'Asset') return visible;
    const match = (requestedPath || location.pathname).match(/^\/(catalog|bundles)\/(\d+)/);
    if (!match) return null;
    const path = location.pathname, id = Number(match[2]), type = match[1] === 'bundles' ? 'Bundle' : 'Asset';
    const key = `${type}:${id}`;
    if (!details.has(key)) {
      let timer;
      const controller = new AbortController();
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error('Item details took too long. Click Buy to try again.')); }, 8000);
      });
      const request = (async () => {
      const response = await fetch(type === 'Asset' ? `https://economy.roblox.com/v2/assets/${id}/details` : `https://catalog.roblox.com/v1/bundles/${id}/details`, {signal: controller.signal});
      if (!response.ok) throw new Error('Item details could not be loaded. Click Buy to try again.');
      const data = await response.json();
      const price = type === 'Asset' ? data.PriceInRobux : data.product?.priceInRobux;
      const assets = type === 'Bundle' ? await bundleAssets(data, controller.signal) : undefined;
      return {id, itemType: type, assetType: type === 'Asset' ? data.AssetTypeId : 0, ...(type === 'Asset' ? {assetTypeVerified:true, limitedVerified:true, isLimited:data.IsLimited === true, isLimitedUnique:data.IsLimitedUnique === true} : {}), bundleType: type === 'Bundle' ? data.bundleType : undefined, assets, name: String(type === 'Asset' ? data.Name : data.name).slice(0, 128), price: price == null ? null : amount(price)};
      })();
      details.set(key, Promise.race([request, timeout]).finally(() => clearTimeout(timer)).catch(error => { details.delete(key); throw error; }));
    }
    let item;
    try { item = await details.get(key); }
    catch (error) {
      if (path !== location.pathname) return null;
      const loaded = !requestedPath && visibleItem();
      if (!loaded) throw error;
      return loaded;
    }
    if (path !== location.pathname) return null;
    const price = requestedPath ? quotedPrice ?? item.price : nativePrice() ?? item.price;
    if (price === null) throw new Error('A price is not available for this item. Try again once its price loads.');
    const image = !requestedPath && document.querySelector('#item-thumbnail-container-frontend img');
    return {...item, price, thumbnail: image?.currentSrc || image?.src || undefined};
  }
  function catalogControls() {
    const root = document.querySelector('#item-thumbnail-container-frontend');
    const buttons = [...(root?.querySelectorAll('.thumbnail-button-container button, .thumbnail-button-container [role="button"]') || [])];
    return {root, holder:root?.querySelector('.thumbnail-holder'),
      tryButton:buttons.find(button => /^(try\s*on|take\s*off)$/i.test(button.textContent.trim())),
      dimension:buttons.find(button => /^(2d|3d)$/i.test(button.textContent.trim()))};
  }
  function clearCatalogTryOn() {
    const record = catalogTryOn;
    catalogTryOn = {generation:record.generation + 1};
    record.controller?.abort(); record.viewer?.dispose(); record.element?.remove();
    record.holder?.classList.remove('larpbux-catalog-preview');
    if (record.tryButton?.isConnected) record.tryButton.textContent = record.tryLabel;
    if (record.dimension?.isConnected) record.dimension.textContent = record.dimensionLabel;
  }
  async function catalogTryOnItem(suppliedItem, requestedKind) {
    if (!state?.mode || !userId) return;
    const previous = catalogTryOn, controls = catalogControls();
    const kind = requestedKind || (/^3d$/i.test(controls.dimension?.textContent.trim() || '') ? '2d' : '3d');
    const tryLabel = previous.tryLabel || controls.tryButton?.textContent || 'Try On';
    const dimensionLabel = previous.dimensionLabel || controls.dimension?.textContent;
    clearCatalogTryOn();
    const {root, holder, tryButton, dimension} = controls;
    if (!root || !holder) return;
    const account = userId, path = location.pathname, controller = new AbortController();
    const surface = node('div', '', 'larpbux-catalog-try-on');
    surface.setAttribute('role', 'status');
    const record = {account,path,controller,holder,element:surface,tryButton,tryLabel,dimension,dimensionLabel,generation:catalogTryOn.generation};
    catalogTryOn = record;
    holder.classList.add('larpbux-catalog-preview'); holder.append(surface);
    if (tryButton) tryButton.textContent = 'Take Off';
    if (dimension) dimension.textContent = kind === '3d' ? '2D' : '3D';
    const active = () => catalogTryOn === record && !controller.signal.aborted && account === userId && path === location.pathname && state?.mode && surface.isConnected;
    try {
      const match = path.match(/^\/(catalog|bundles)\/(\d+)/);
      if (!match) return;
      let item = suppliedItem;
      if (!item) {
        const id = Number(match[2]), itemType = match[1] === 'bundles' ? 'Bundle' : 'Asset';
        const response = await fetch(itemType === 'Asset' ? `https://economy.roblox.com/v2/assets/${id}/details` : `https://catalog.roblox.com/v1/bundles/${id}/details`, {signal:controller.signal});
        if (!response.ok) throw new Error('Item details could not load. Take off and try again.');
        const data = await response.json();
        item = {id,itemType,name:String((itemType === 'Asset' ? data.Name : data.name) || 'Item').slice(0,128),assetType:itemType === 'Asset' ? Number(data.AssetTypeId) : 0,bundleType:data.bundleType,assets:itemType === 'Bundle' ? await bundleAssets(data, controller.signal) : undefined};
      }
      if (!active()) return;
      if (!supportsCosmetic(item)) throw new Error('This item does not support avatar Try On.');
      record.item = item;
      const current = read(account);
      let temporary = {...current,items:[...current.items],equipped:[...current.equipped]};
      if (isBackground(item)) temporary.backgroundId = item.id;
      for (const part of expandOutfitItem(item)) {
        const index = temporary.items.findIndex(owned => keyFor(owned) === keyFor(part));
        if (index < 0) temporary.items.push(part);
        else temporary.items[index] = {...temporary.items[index], ...part};
        if (!temporary.equipped.includes(keyFor(part))) temporary = equip(temporary, keyFor(part));
      }
      const definition = temporary.gameLook ? gamePreviewDefinition(temporary) : await loadBrowserPreview(outfitAssets(temporary.items.filter(owned => temporary.equipped.includes(keyFor(owned)) && supportsOutfit(owned))), controller.signal, temporary.backgroundId);
      if (!active()) return;
      let renderKind = kind;
      let imageUrl = await LarpbloxAvatarRequests.render(definition, account, controller.signal, renderKind);
      if (!active()) return;
      surface.textContent = '';
      if (renderKind === '3d') {
        try {
          if (typeof LarpbloxAvatar3D === 'undefined') throw new Error('3D unavailable');
          record.viewer = await LarpbloxAvatar3D.create(surface,imageUrl,{signal:controller.signal,definition});
        } catch (error) {
          if (!active()) return;
          surface.replaceChildren(); renderKind = '2d';
          imageUrl = await LarpbloxAvatarRequests.render(definition,account,controller.signal,renderKind);
        }
      }
      if (!active()) { record.viewer?.dispose(); return; }
      if (renderKind === '2d') {
        const image = node('img'); image.alt = `Your Larp avatar trying on ${item.name}`;
        image.src = imageUrl; surface.append(image);
      }
    } catch (error) {
      if (active()) surface.textContent = error.message || 'Preview could not load. Take off and try again.';
    }
  }
  function updateCatalogTryOn() {
    const record = catalogTryOn;
    if (record.controller && (!state?.mode || record.path !== location.pathname || record.account !== userId || !record.element?.isConnected)) clearCatalogTryOn();
  }
  function closePurchase() {
    if (!purchaseDialog) return;
    const dialog = purchaseDialog; purchaseDialog = undefined;
    dialog.dataset.closing = 'true';
    if (arguments[0] instanceof Event && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.classList.add('larpbux-purchase-closing');
      setTimeout(() => { dialog.close(); dialog.remove(); }, 300);
    } else { dialog.close(); dialog.remove(); }
  }
  async function avatarCopyQuote(target, account, signal) {
    const readJson = async (url, label) => {
      const cooldownKey = 'larpblox.avatar-copy-cooldown-until';
      let blockedUntil = 0;
      try { blockedUntil = Number(localStorage.getItem(cooldownKey)) || 0; } catch (_) {}
      if (blockedUntil > Date.now()) throw Object.assign(new Error(`Roblox asked us to wait before loading ${label}.`), {retryAfter:(blockedUntil - Date.now()) / 1000});
      const response = await fetch(url, {credentials:'include', signal});
      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = Math.max(1, LarpbloxAvatarRequests.retryAfter(response, 30));
          try { localStorage.setItem(cooldownKey, String(Math.max(blockedUntil, Date.now() + retryAfter * 1000))); } catch (_) {}
          throw Object.assign(new Error(`Roblox is limiting ${label}.`), {retryAfter});
        }
        throw new Error(`Could not load ${label}. Retry in a moment.`);
      }
      return response.json();
    };
    const cacheKey = `larpblox.avatar-copy-cache:v1:${target}`;
    let cached;
    try {
      const entry = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if (entry?.expires > Date.now() && entry.avatar) cached = entry;
      else if (entry) localStorage.removeItem(cacheKey);
    } catch (_) {}
    const avatar = cached?.avatar || await readJson(`https://avatar.roblox.com/v1/users/${target}/avatar`, 'this avatar');
    if (!cached) {
      cached = {expires:Date.now() + 300000, avatar};
      try { localStorage.setItem(cacheKey, JSON.stringify(cached)); } catch (_) {}
    }
    if (!Array.isArray(avatar.assets) || avatar.assets.length > 100) throw new Error('This avatar could not be loaded.');
    const rules = avatar.bodyColor3s ? {} : cached?.rules || await readJson('https://avatar.roblox.com/v1/avatar-rules', 'avatar colors');
    if (!cached.rules) { cached.rules = rules; try { localStorage.setItem(cacheKey, JSON.stringify(cached)); } catch (_) {} }
    const assets = avatar.assets.map(asset => ({id:asset.id, itemType:'Asset', name:String(asset.name || `Item ${asset.id}`).slice(0,128), assetType:Number(asset.assetType?.id), ...(asset.meta ? {meta:asset.meta} : {})}));
    const supported = assets.filter(isWearableAsset);
    const definition = previewDefinition({...avatar, assets:avatar.assets.filter(asset => supported.some(item => item.id === asset.id))}, rules, []);
    const items = supported.map(item => ({...item, price:0, assetTypeVerified:true, limitedVerified:false}));
    return {snapshot:LarpbloxGameBridge.validateSnapshot({version:1,userId:String(account),definition,items},account), items, skipped:assets.length - supported.length};
  }
  function stealAvatar(target) {
    if (!userId || !/^[1-9]\d*$/.test(target)) return;
    closePurchase();
    const account = userId, path = location.pathname;
    const dialog = node('dialog','','larpbux-buy-dialog larpbux-avatar-copy-dialog'); purchaseDialog = dialog;
    dialog.setAttribute('aria-label','Steal avatar');
    const title = node('h2','Steal avatar');
    const close = node('button','×','larpbux-modal-close'); close.type = 'button'; close.setAttribute('aria-label','Close'); close.addEventListener('click',closePurchase);
    const body = node('div','','larpbux-avatar-copy-body');
    const status = node('p','Loading avatar…','larpbux-purchase-status'); status.setAttribute('role','status');
    const rows = node('div','','larpbux-cart-items');
    const summary = node('p');
    const footer = node('div','','larpbux-purchase-footer');
    const confirm = node('button','Wear avatar','larpbux-buy-confirm'); confirm.type = 'button'; confirm.disabled = true;
    const cancel = node('button','Cancel','larpbux-buy-cancel'); cancel.type = 'button'; cancel.addEventListener('click',closePurchase);
    const avatarLink = node('a','Open Avatar'); avatarLink.href = avatarUrl(); avatarLink.hidden = true;
    body.append(status,rows,summary,avatarLink); footer.append(confirm,cancel); dialog.append(title,close,body,footer);
    const controller = new AbortController();
    let retryTimer;
    dialog.addEventListener('close',() => { controller.abort(); clearTimeout(retryTimer); },{once:true});
    document.body.append(dialog); dialog.showModal();
    const active = () => dialog.isConnected && dialog.open && account === userId && path === location.pathname;
    const missingItems = (quote,current) => {
      const owned = new Set(outfitAssets(current.items).map(keyFor));
      return quote.items.filter(item => !owned.has(keyFor(item)));
    };
    let quote;
    function present(next) {
      quote = next;
      const current = read(account), missing = missingItems(quote,current);
      rows.replaceChildren();
      for (const item of quote.items) {
        const row = node('div','','larpbux-cart-row');
        row.append(node('span',item.name),node('span',!missing.includes(item) ? 'Collected' : 'Add · Free'));
        rows.append(row);
      }
      summary.textContent = `${missing.length} new items · no Larpbux charged. Balance: ${current.balance.toLocaleString('en-US')}.`;
      status.textContent = 'Copy this appearance into your local collection and wear it. No item prices are requested.';
      if (quote.skipped) status.textContent += ` ${quote.skipped} unsupported items will be skipped.`;
      confirm.textContent = 'Wear avatar';
      confirm.disabled = !current.mode || !quote.items.length;
      if (!quote.items.length) status.textContent = 'This avatar has no supported items to copy.';
    }
    async function load() {
      const actionKey = 'larpblox.avatar-action-until', until = String(Date.now() + 180000);
      try { localStorage.setItem(actionKey,until); } catch (_) {}
      const timeout = setTimeout(() => controller.abort(),180000);
      try { return await avatarCopyQuote(target,account,controller.signal); }
      finally {
        clearTimeout(timeout);
        try { if (localStorage.getItem(actionKey) === until) localStorage.removeItem(actionKey); } catch (_) {}
      }
    }
    function failed(error) {
      if (!active()) return;
      status.textContent = error.name === 'AbortError' ? 'Loading took too long. Close this dialog and try again.' : error.message;
      confirm.textContent = 'Retry'; confirm.disabled = controller.signal.aborted;
      const retryAt = Date.now() + Math.max(0, Number(error.retryAfter) || 0) * 1000;
      if (retryAt > Date.now()) {
        const updateRetry = () => {
          if (!active()) return;
          const remaining = Math.ceil((retryAt - Date.now()) / 1000);
          if (remaining <= 0) { confirm.textContent = 'Retry'; confirm.disabled = false; return; }
          confirm.textContent = `Retry in ${remaining}s`; confirm.disabled = true;
          retryTimer = setTimeout(updateRetry, 1000);
        };
        updateRetry();
      }
    }
    confirm.addEventListener('click',async () => {
      if (!active()) return;
      if (!quote) {
        confirm.disabled = true; status.textContent = 'Loading avatar…';
        try { const result = await load(); if (active()) present(result); }
        catch (error) { failed(error); }
        return;
      }
      confirm.disabled = true;
      try {
        if (!read(account).mode) throw new Error('Turn Larp mode on in the Larpblox extension popup, then try again.');
        status.textContent = 'Copying avatar…';
        let next = read(account);
        for (const item of missingItems(quote,next)) next = collect(next,item);
        next = mergeGameSnapshot(next,quote.snapshot);
        if (next.items.length > 2000) throw new Error('Your cosmetic inventory is full.');
        save(next,true);
        title.textContent = 'Avatar equipped'; rows.replaceChildren(); summary.textContent = '';
        status.textContent = 'Your Larp avatar is saved. It will sync when your game connects.';
        avatarLink.hidden = false; confirm.remove(); cancel.textContent = 'Done';
      } catch (error) { failed(error); }
    });
    if (!state.mode) {
      status.textContent = 'Turn Larp mode on in the Larpblox extension popup, then return to this profile.'; avatarLink.hidden = false; confirm.remove();
    } else load().then(result => { if (active()) present(result); }).catch(failed);
  }
  function updateProfileMenu() {
    const target = location.pathname.match(/^\/users\/([1-9]\d*)\/profile\/?$/i)?.[1];
    if (!userId || !target || target === String(userId)) {
      document.querySelectorAll('.larpbux-steal-avatar').forEach(button => button.remove()); return;
    }
    for (const trigger of document.querySelectorAll('#user-profile-header-contextual-menu-button[aria-expanded="true"]')) {
      const popover = document.getElementById(trigger.getAttribute('aria-controls'));
      const menu = popover?.querySelector('[role="menu"]'), template = menu?.querySelector('button[role="menuitem"]');
      if (!template) continue;
      const existing = menu.querySelector('.larpbux-steal-avatar');
      if (existing?.dataset.userId === target) continue;
      existing?.remove();
      const button = node('button','','larpbux-steal-avatar'); button.type = 'button'; button.setAttribute('role','menuitem'); button.tabIndex = 0;
      button.dataset.userId = target;
      button.className += ` ${template.className}`;
      button.append(node('span','Steal avatar',template.querySelector('.foundation-web-menu-item-title')?.className));
      button.addEventListener('click',event => {
        event.preventDefault(); event.stopPropagation();
        trigger.click(); requestAnimationFrame(() => stealAvatar(target));
      });
      const inventory = menu.querySelector('a[href$="/inventory"]');
      if (inventory) inventory.before(button); else template.parentElement.append(button);
      if (menu._larpbuxKeys) continue;
      menu._larpbuxKeys = true;
      menu.addEventListener('keydown',event => {
        if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
        const items = [...menu.querySelectorAll('[role="menuitem"]')].filter(item => !item.disabled && item.getAttribute('aria-disabled') !== 'true');
        const index = items.indexOf(document.activeElement);
        if (index < 0) return;
        event.preventDefault(); event.stopImmediatePropagation();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next].focus();
      },true);
    }
  }
  function purchaseUsername() {
    if (!state?.mode || !userId) return;
    closePurchase();
    const account=userId, path=location.pathname;
    const dialog=node('dialog','','larpbux-buy-dialog larpbux-username-dialog'); purchaseDialog=dialog;
    dialog.setAttribute('aria-label','Change Username');
    const title=node('h2','Change Username');
    const close=node('button','×','larpbux-modal-close'); close.type='button'; close.setAttribute('aria-label','Close purchase'); close.addEventListener('click',closePurchase);
    const body=node('div','','larpbux-purchase-body');
    const copy=node('div');
    const label=node('label','New username');
    const input=node('input'); input.type='text'; input.maxLength=20; input.autocomplete='off'; input.required=true;
    input.setAttribute('aria-label','New username'); input.value=state.names?.username || '';
    label.append(input);
    copy.append(label,node('p','R$ 1,000','larpbux-purchase-price'),node('p','Your display name will match your username.'));
    const summary=node('div','','larpbux-balance-summary');
    summary.append(node('p',`Your balance: R$ ${state.balance.toLocaleString('en-US')}`),node('p',state.balance>=1000 ? `Your balance after this purchase will be R$ ${(state.balance-1000).toLocaleString('en-US')}.` : `You need R$ ${(1000-state.balance).toLocaleString('en-US')} more to change your username.`));
    copy.append(summary);body.append(copy);
    const status=node('p','','larpbux-purchase-status');status.setAttribute('role','status');
    const footer=node('div','','larpbux-purchase-footer');
    const confirm=node('button','Buy','larpbux-buy-confirm');confirm.type='button';confirm.disabled=state.balance<1000;
    const cancel=node('button','Cancel','larpbux-buy-cancel');cancel.type='button';cancel.addEventListener('click',closePurchase);
    footer.append(confirm,cancel);dialog.append(title,node('div',`R$ ${state.balance.toLocaleString('en-US')}`,'larpbux-purchase-balance'),close,body,status,footer);
    dialog.addEventListener('cancel',event=>{event.preventDefault();closePurchase();});
    document.body.append(dialog);dialog.showModal();input.focus();
    confirm.addEventListener('click',async ()=>{
      if (confirm.disabled) return;
      confirm.disabled=true;
      try {
        if (!dialog.open || dialog.dataset.closing || userId!==account || path!==location.pathname || !state?.mode) throw new Error('Your account or purchase state changed. Please reopen the purchase.');
        const current=read(account);
        if (!current.mode) throw new Error('Turn Larp mode on before changing your username.');
        const requestedName=input.value;
        changeUsername(current,requestedName);
        const finishLoading=purchaseLoading(dialog,confirm);
        await finishLoading();
        if (!dialog.open || dialog.dataset.closing || userId!==account || path!==location.pathname || !state?.mode) return;
        const latest=read(account);
        if (!latest.mode) throw new Error('Turn Larp mode on before changing your username.');
        const next=changeUsername(latest,requestedName);
        const realName=document.querySelector('meta[name="user-data"]')?.getAttribute('data-name') || '';
        if (next.names.username.toLowerCase()===realName.toLowerCase()) throw new Error('Choose a different username.');
        save(next);
        purchaseComplete(dialog, `Your username and display name are now ${state.names.username}.`);
      } catch(error) {dialog.removeAttribute('aria-busy');status.textContent=error.message;confirm.disabled=false;confirm.classList.remove('is-loading');confirm.removeAttribute('aria-busy');confirm.textContent='Buy';}
    });
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();confirm.click();}});
  }
  function settingsNameRow(target, displayName = false) {
    if (!/^\/my\/account\/?$/i.test(location.pathname)) return false;
    const button=target.closest?.('button, a, [role="button"], .icon-edit, [class*="btn-generic-edit"], [tabindex="0"]');
    if (!button || button.closest('.larpbux-buy-dialog')) return false;
    if (button.matches(displayName ? '#account-name-edit, [data-testid="display-name-edit"], [aria-label="Edit Name"], [aria-label="Edit name"], [aria-label="Edit Display Name"], [aria-label="Edit display name"]' : '#account-username-edit, [data-testid="username-edit"], [aria-label="Edit Username"], [aria-label="Edit username"]')) return true;
    const labelPattern = displayName ? /^(?:display\s*)?name\s*:?$/i : /^username\s*:?$/i;
    const rowPattern = displayName ? /^(?:display\s*)?name\s*:/i : /^username\s*:/i;
    let row=button.parentElement;
    for(let depth=0;row && depth<4;depth++,row=row.parentElement) {
      if (row.querySelectorAll('button, [role="button"]').length>1) break;
      if ([...row.querySelectorAll('label, span, div, .text-label, .font-header-2, b, strong')].some(label=>labelPattern.test(label.textContent.trim()))) return true;
      if ([...row.querySelectorAll('label, span, .text-label, b, strong')].some(label=>/^(?:username|(?:display\s*)?name)\s*:?$/i.test(label.textContent.trim()))) return false;
      if (rowPattern.test(row.textContent.trim())) return true;
      if (row.matches(displayName ? '#account-name, .account-name, [data-testid="account-name"]' : '#account-username, .account-username, [data-testid="account-username"]')) return true;
    }
    return false;
  }
  function purchaseLoading(dialog, button) {
    button.disabled = true; button.classList.add('is-loading');
    button.setAttribute('aria-busy', 'true');
    dialog.setAttribute('aria-busy', 'true');
    // Local purchases finish instantly; keep processing visible without stacking a delay on slow requests.
    const started = performance.now();
    return async () => {
      await new Promise(resolve => setTimeout(resolve, Math.max(0, 900 - (performance.now() - started))));
      dialog.removeAttribute('aria-busy');
    };
  }
  let purchaseToastTimer;
  function purchaseToast() {
    clearTimeout(purchaseToastTimer); document.querySelector('.larpbux-cart-toast')?.remove();
    const toast = node('div', 'Purchase Complete', 'larpbux-cart-toast'); toast.setAttribute('role', 'status');
    document.body.append(toast);
    purchaseToastTimer = setTimeout(() => { toast.classList.add('is-leaving'); setTimeout(() => toast.remove(), 250); }, 3000);
  }
  function purchaseComplete(dialog, message) {
    dialog.classList.add('larpbux-purchase-complete');
    dialog.setAttribute('aria-label', 'Purchase Complete');
    const title = node('h2', 'Purchase Complete');
    const balance = node('div', '', 'larpbux-purchase-balance');
    const icon = node('span', '', 'larpbux-robux-symbol'); icon.setAttribute('aria-label', 'Robux');
    icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 14 4.5v7L8 15l-6-3.5v-7Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="m8 4 3.5 2v4L8 12l-3.5-2V6Z" fill="none" stroke="currentColor"/></svg>';
    balance.append(icon, document.createTextNode(state.balance.toLocaleString('en-US')));
    const close = node('button', '×', 'larpbux-modal-close'); close.type = 'button'; close.setAttribute('aria-label', 'Close purchase'); close.addEventListener('click', closePurchase);
    const body = node('div', '', 'larpbux-complete-body');
    const check = node('div', '', 'larpbux-complete-check'); check.setAttribute('aria-hidden', 'true');
    check.innerHTML = '<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="19.5" stroke="currentColor" stroke-width="3"/><path d="m14 22 5 5 11-11" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    body.append(check, node('p', message));
    const footer = node('div', '', 'larpbux-purchase-footer');
    const done = node('button', 'OK', 'larpbux-buy-confirm'); done.type = 'button'; done.addEventListener('click', closePurchase); footer.append(done);
    dialog.replaceChildren(title, balance, close, body, footer); done.focus();
  }
  function purchase(item) {
    closePurchase();
    const account = userId, path = location.pathname;
    const dialog = node('dialog', '', 'larpbux-buy-dialog larpbux-item-buy-dialog'); purchaseDialog = dialog;
    dialog.setAttribute('aria-label', 'Buy Item');
    const title = node('h2', 'Buy Item');
    const balance = node('div', `R$ ${state.balance.toLocaleString('en-US')}`, 'larpbux-purchase-balance');
    const close = node('button', '×', 'larpbux-modal-close'); close.type = 'button'; close.setAttribute('aria-label', 'Close purchase'); close.addEventListener('click', closePurchase);
    const body = node('div', '', 'larpbux-purchase-body');
    const image = node('img'); thumbnail(image, item);
    const copy = node('div');
    copy.append(node('p', item.name, 'larpbux-purchase-name'));
    copy.append(node('p', `R$ ${item.price.toLocaleString('en-US')}`, 'larpbux-purchase-price'));
    for (const element of [balance, copy.lastElementChild]) {
      const value = element.textContent.replace(/^R\$\s*/, '');
      const icon = node('span', '', 'larpbux-robux-symbol'); icon.setAttribute('aria-label', 'Robux');
      icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 14 4.5v7L8 15l-6-3.5v-7Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="m8 4 3.5 2v4L8 12l-3.5-2V6Z" fill="none" stroke="currentColor"/><path d="M6.5 6.5h3v3h-3Z" fill="currentColor"/></svg>';
      element.replaceChildren(icon, document.createTextNode(value));
    }
    body.append(image, copy);
    const status = node('p', '', 'larpbux-purchase-status'); status.setAttribute('role', 'status');
    if (item.price > state.balance) status.textContent = `You need R$ ${(item.price - state.balance).toLocaleString('en-US')} more to buy this item.`;
    const footer = node('div', '', 'larpbux-purchase-footer');
    const confirm = node('button', 'Buy', 'larpbux-buy-confirm'); confirm.type = 'button'; confirm.disabled = item.price > state.balance;
    footer.append(confirm);
    dialog.append(title, balance, close, body, status, footer);
    dialog.addEventListener('cancel', event => { event.preventDefault(); closePurchase(); });
    document.body.append(dialog); dialog.showModal();
    confirm.addEventListener('click', async () => {
      if (confirm.disabled) return;
      const finishLoading = purchaseLoading(dialog, confirm);
      try {
        if (account !== userId || path !== location.pathname || !state?.mode) throw new Error('Your account or purchase state changed. Please reopen the purchase.');
        const latest = await itemData();
        await finishLoading();
        if (!dialog.open || dialog.dataset.closing || !latest) return;
        if (account !== userId || path !== location.pathname || !state?.mode) throw new Error('Your account or purchase state changed. Please reopen the purchase.');
        if (latest.price !== item.price) { purchase(latest); return; }
        const existing = state.items.some(owned => keyFor(owned) === keyFor(item));
        const current = read(account);
        if (!current.mode) throw new Error('Turn Larp mode on before buying this item.');
        const repeatable = latest.isLimited || latest.isLimitedUnique || current.items.some(owned => keyFor(owned) === keyFor(latest) && (owned.isLimited || owned.isLimitedUnique));
        save(collect(current, latest));
        purchaseComplete(dialog, existing && !repeatable ? 'You already own this item. Your account has not been charged.' : `You have successfully bought ${item.name}`);
      } catch (error) {
        dialog.removeAttribute('aria-busy');
        status.textContent = error.message;
        confirm.disabled = false;
        confirm.textContent = 'Buy';
        confirm.classList.remove('is-loading');
        confirm.removeAttribute('aria-busy');
      }
    });
  }
  function cartOwned(entry, native, current = state) {
    const owned = current?.items.find(item => keyFor(item) === `${entry.itemType}:${entry.itemId}`);
    const detail = native?.itemDetails?.[entry.itemId];
    return Boolean(owned && !owned.isLimited && !owned.isLimitedUnique && !detail?.isLimited && !detail?.isLimitedUnique && !detail?.itemRestrictions?.some(value => /^(Limited|LimitedUnique|Collectible)$/i.test(value)));
  }
  function nativeCartRow(entry) {
    return [...document.querySelectorAll('.shopping-cart-items-list .cart-item-container')].find(row => {
      const path = row.querySelector('a.item-name')?.getAttribute('href') || '';
      return path.match(/\/(catalog|bundles)\/(\d+)/)?.slice(1).join(':') === `${entry.itemType === 'Bundle' ? 'bundles' : 'catalog'}:${entry.itemId}`;
    });
  }
  function cartSelected(entry, native) {
    const checkbox = nativeCartRow(entry)?.querySelector('input[type="checkbox"]');
    return !cartOwned(entry, native) && (checkbox ? checkbox.checked && !checkbox.disabled : native.selectedItems?.[`${entry.itemType.toLowerCase()}${entry.itemId}`] === true);
  }
  async function openMarketplaceCart(selectedOnly = false) {
    const account = userId;
    try {
      if (account !== userId || !state?.mode) return;
      const native = JSON.parse(localStorage.getItem(`Roblox.AvatarMarketplace.Cart:${account}`) || 'null');
      if (Array.isArray(native?.items)) {
        const selected = native.items.filter(entry => !cartOwned(entry, native) && (!selectedOnly || cartSelected(entry, native)));
        const imported = await Promise.all(selected.map(async entry => {
          const id = Number(entry.itemId), type = entry.itemType;
          if (!Number.isSafeInteger(id) || id <= 0 || !['Asset','Bundle'].includes(type)) throw new Error('A cart item could not be loaded.');
          const detail = native.itemDetails?.[id];
          const quote = [detail?.lowestPrice, detail?.price].find(value => Number.isSafeInteger(value) && value >= 0);
          return itemData(`/${type === 'Bundle' ? 'bundles' : 'catalog'}/${id}`, quote);
        }));
        if (account !== userId || !state?.mode) return;
        let current = read(account); if (!current.mode) return;
        if (selectedOnly) current = {...current, cart:[]};
        for (const item of imported) if (item && !cartOwned({itemId:item.id, itemType:item.itemType}, {itemDetails:{[item.id]:item}}, current) && !current.cart.some(entry => keyFor(entry) === keyFor(item))) current = addToCart(current, item);
        save(current);
      }
      if (account === userId && state?.mode) confirmCartPurchase();
    } catch (error) { if (account !== userId || !state?.mode) return; confirmCartPurchase(); const status = purchaseDialog?.querySelector('.larpbux-purchase-status'); if (status) status.textContent = error.message; }
  }
  function clearPurchasedNativeCart(items) {
    try {
      const storageKey = `Roblox.AvatarMarketplace.Cart:${userId}`, native = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (!Array.isArray(native?.items)) return;
      const bought = new Set(items.map(keyFor));
      native.items = native.items.filter(item => !bought.has(`${item.itemType}:${item.itemId}`));
      for (const item of items) { if (native.selectedItems) delete native.selectedItems[`${item.itemType.toLowerCase()}${item.id}`]; }
      native.totalPrice = null;
      localStorage.setItem(storageKey, JSON.stringify(native));
      for (const row of document.querySelectorAll('.shopping-cart-items-list .cart-item-container')) {
        const path = row.querySelector('a.item-name')?.getAttribute('href') || '';
        const match = path.match(/\/(catalog|bundles)\/(\d+)/);
        if (match && bought.has(`${match[1] === 'bundles' ? 'Bundle' : 'Asset'}:${match[2]}`)) row.querySelector('.rm-item-btn-container button')?.click();
      }
    } catch (_) {}
  }
  const nativeCartBuyControls = new Map();
  const nativeCartOwnedRows = new Map(), nativeCartTexts = new Map();
  document.addEventListener('change', event => {
    if (event.target.closest?.('.shopping-cart-items-list')) updateMarketplaceCart();
  });
  function updateMarketplaceCart() {
    let native;
    try { native = JSON.parse(localStorage.getItem(`Roblox.AvatarMarketplace.Cart:${userId}`) || 'null'); } catch (_) {}
    for (const [row, saved] of nativeCartOwnedRows) {
      if (!row.isConnected) { nativeCartOwnedRows.delete(row); continue; }
      if (!state?.mode || !native?.items?.some(entry => nativeCartRow(entry) === row && cartOwned(entry, native))) {
        if (saved.checkbox) { saved.checkbox.disabled = saved.disabled; saved.checkbox.checked = saved.checked; }
        row.removeAttribute('data-larp-owned'); row.querySelector('.larpbux-cart-owned')?.remove(); nativeCartOwnedRows.delete(row);
      }
    }
    for (const [element, saved] of nativeCartTexts) {
      if (!element.isConnected) nativeCartTexts.delete(element);
      else if (!state?.mode) { element.innerHTML = saved.html; nativeCartTexts.delete(element); }
    }
    for (const [button, saved] of nativeCartBuyControls) {
      if (!button.isConnected) { nativeCartBuyControls.delete(button); continue; }
      if (!state?.mode) {
        button.removeAttribute('data-larp-cart-disabled');
        button.disabled = saved.disabled;
        if (saved.aria == null) button.removeAttribute('aria-disabled'); else button.setAttribute('aria-disabled', saved.aria);
        button.classList.toggle('disabled', saved.disabledClass); button.style.pointerEvents = saved.pointerEvents;
        nativeCartBuyControls.delete(button);
      }
    }
    if (!state?.mode || !/^\/catalog\/?$/i.test(location.pathname)) return;
    for (const entry of native?.items || []) {
      const row = nativeCartRow(entry);
      if (!row || !cartOwned(entry, native)) continue;
      const checkbox = row.querySelector('input[type="checkbox"]');
      if (!nativeCartOwnedRows.has(row)) nativeCartOwnedRows.set(row, {checkbox, disabled:checkbox?.disabled, checked:checkbox?.checked});
      if (row.dataset.larpOwned !== 'true') row.dataset.larpOwned = 'true';
      if (checkbox) { checkbox.disabled = true; checkbox.checked = false; }
      if (!row.querySelector('.item-owned')) {
        const label = node('div', '', 'item-owned larpbux-cart-owned');
        label.append(node('span', '', 'item-owned-icon'), node('span', 'Item Owned', 'item-owned-text'));
        row.querySelector('.item-details-container')?.append(label);
      }
    }
    const selected = (native?.items || []).filter(entry => cartSelected(entry, native));
    let cost = 0, valid = true;
    for (const entry of selected) {
      const detail = native.itemDetails?.[entry.itemId];
      const price = [detail?.lowestPrice, detail?.price].find(value => Number.isSafeInteger(value) && value >= 0);
      if (price == null) valid = false; else cost += price;
    }
    const replaceText = (selector, text) => {
      for (const element of document.querySelectorAll(selector)) {
        if (!nativeCartTexts.has(element)) nativeCartTexts.set(element, {html:element.innerHTML});
        if (element.textContent !== text) element.textContent = text;
      }
    };
    replaceText('.shopping-cart-footer .total-label', `Total: ${selected.length} items`);
    replaceText('.shopping-cart-footer .total-price-container .price-text', cost.toLocaleString('en-US'));
    replaceText('.shopping-cart-footer .balance-disclaimer-text .text-robux', Math.max(0, state.balance - cost).toLocaleString('en-US'));
    const disabled = !selected.length || !valid || cost > state.balance;
    for (const button of document.querySelectorAll('.shopping-cart-footer button, .shopping-cart-footer [role="button"]')) {
      if (!/^buy(?:\s|$)/i.test(button.textContent.trim())) continue;
      if (!nativeCartBuyControls.has(button)) nativeCartBuyControls.set(button, {disabled:button.disabled, aria:button.getAttribute('aria-disabled'), disabledClass:button.classList.contains('disabled'), pointerEvents:button.style.pointerEvents});
      if (button.disabled !== disabled) button.disabled = disabled;
      if (button.dataset.larpCartDisabled !== String(disabled)) button.dataset.larpCartDisabled = String(disabled);
      if (button.getAttribute('aria-disabled') !== String(disabled)) button.setAttribute('aria-disabled', String(disabled));
      button.classList.toggle('disabled', disabled); if (button.style.pointerEvents !== 'auto') button.style.pointerEvents = 'auto';
    }
  }
  function marketplaceCartClick(event) {
    if (!state?.mode || !/^\/catalog\/?$/i.test(location.pathname)) return false;
    if (event.target.closest?.('[data-larp-owned="true"]') && event.target.closest?.('.thumbnail-container, .purchase-checkbox-container, input[type="checkbox"], label')) {
      event.preventDefault(); event.stopImmediatePropagation(); return true;
    }
    const control = event.target.closest?.('button, a, [role="button"]');
    if (!control || control.closest('.larpbux-buy-dialog, .larpbux-panel')) return false;
    if (!control.closest('.shopping-cart-footer') || !/^buy(?:\s|$)/i.test(control.textContent.trim())) return false;
    event.preventDefault(); event.stopImmediatePropagation(); event.stopPropagation();
    if (control.disabled || control.getAttribute('aria-disabled') === 'true') return true;
    void openMarketplaceCart(true);
    return true;
  }
  function confirmCartPurchase() {
    if (!state?.mode || !userId) return;
    closePurchase();
    const account = userId, quotedCart = JSON.stringify(state.cart || []), quotedBalance = state.balance;
    const items = state.cart || [], count = items.reduce((sum, item) => sum + item.quantity, 0);
    let cost, error;
    try { cost = state.balance - checkoutCart(state).balance; } catch (failure) { error = failure.message; }
    const dialog = node('dialog', '', 'larpbux-buy-dialog larpbux-cart-dialog'); purchaseDialog = dialog;
    dialog.setAttribute('aria-label', 'Buy Now');
    const title = node('h2', 'Buy Now');
    const close = node('button', '×', 'larpbux-modal-close'); close.type = 'button'; close.setAttribute('aria-label', 'Close purchase'); close.addEventListener('click', closePurchase);
    const question = node('p', `Would you like to buy ${count === 1 ? 'this item' : `these ${count} items`} for `, 'larpbux-cart-question');
    close.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    const robux = () => { const icon = node('span', '', 'larpbux-robux-symbol'); icon.setAttribute('aria-label', 'Robux'); icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 14 4.5v7L8 15l-6-3.5v-7Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="m8 4 3.5 2v4L8 12l-3.5-2V6Z" fill="none" stroke="currentColor"/></svg>'; return icon; };
    if (cost === 0) question.append(document.createTextNode('Free?'));
    else if (cost !== undefined) question.append(robux(), document.createTextNode(` ${cost.toLocaleString('en-US')}?`));
    else question.textContent = 'Review the items in your cart.';
    const previews = node('div', '', 'larpbux-cart-previews');
    let shown = 0;
    for (const item of items) {
      for (let copy = 0; copy < item.quantity && shown < 2; copy++, shown++) { const image = node('img'); thumbnail(image, item); previews.append(image); }
      if (shown === 2) break;
    }
    if (count > shown) { const more = node('span', `+${count - shown}`, 'larpbux-cart-overflow'); more.setAttribute('aria-label', `${count - shown} more items`); previews.append(more); }
    const footer = node('div', '', 'larpbux-purchase-footer');
    const label = cost === 0 ? 'Get Now' : 'Buy';
    const buy = node('button', label, 'larpbux-buy-confirm'); buy.type = 'button'; buy.disabled = !count || Boolean(error);
    const cancel = node('button', 'Cancel', 'larpbux-buy-cancel'); cancel.type = 'button'; cancel.addEventListener('click', closePurchase); footer.append(buy, cancel);
    const balance = node('p', 'Your balance after this transaction will be ', 'larpbux-cart-balance');
    if (cost !== undefined) balance.append(robux(), document.createTextNode(` ${(state.balance - cost).toLocaleString('en-US')}.`)); else balance.textContent = '';
    const status = node('p', error || (!count ? 'Select at least one item to buy.' : ''), 'larpbux-purchase-status'); status.setAttribute('role', 'status');
    buy.addEventListener('click', async () => {
      if (buy.disabled) return;
      const finishLoading = purchaseLoading(dialog, buy);
      try {
        await finishLoading();
        if (!dialog.open || dialog.dataset.closing || userId !== account || !state?.mode) return;
        const current = read(account);
        if (!current.mode || JSON.stringify(current.cart || []) !== quotedCart || current.balance !== quotedBalance) throw new Error('Your cart or balance changed. Close this window and review your purchase again.');
        save(checkoutCart(current)); clearPurchasedNativeCart(current.cart); closePurchase(); purchaseToast();
      } catch (failure) { dialog.removeAttribute('aria-busy'); status.textContent = failure.message; buy.disabled = false; buy.classList.remove('is-loading'); buy.removeAttribute('aria-busy'); buy.textContent = label; }
    });
    dialog.append(title, close, question, previews, footer, balance, status);
    dialog.addEventListener('cancel', event => { event.preventDefault(); closePurchase(); }); document.body.append(dialog); dialog.showModal();
  }
  function showCart() {
    if (!state?.mode || !userId) return;
    closePurchase();
    const account = userId;
    const dialog = node('dialog', '', 'larpbux-buy-dialog larpbux-cart-dialog'); purchaseDialog = dialog;
    dialog.setAttribute('aria-label', 'Shopping cart');
    const title = node('h2', 'Shopping cart');
    const close = node('button', '×', 'larpbux-modal-close'); close.type = 'button'; close.setAttribute('aria-label', 'Close cart'); close.addEventListener('click', closePurchase);
    const rows = node('div', '', 'larpbux-cart-items');
    const status = node('p', '', 'larpbux-purchase-status'); status.setAttribute('role', 'status');
    const footer = node('div', '', 'larpbux-purchase-footer');
    let confirming = false;
    const draw = () => {
      rows.replaceChildren(); footer.replaceChildren();
      for (const item of state.cart || []) {
        const row = node('div', '', 'larpbux-cart-row');
        row.append(node('span', `${item.name} × ${item.quantity}`), node('span', `R$ ${(item.price * item.quantity).toLocaleString('en-US')}`));
        const remove = node('button', 'Remove', 'larpbux-buy-cancel'); remove.type = 'button'; remove.setAttribute('aria-label', `Remove ${item.name}`);
        remove.addEventListener('click', () => {
          if (userId !== account || !state?.mode) return;
          const current = read(account); save({...current, cart:current.cart.filter(entry => keyFor(entry) !== keyFor(item))}); confirming = false; draw();
        });
        row.append(remove); rows.append(row);
      }
      let next, error;
      try { next = checkoutCart(state); } catch (failure) { error = failure.message; }
      const cost = next ? state.balance - next.balance : (state.cart || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
      rows.append(node('p', `Total: R$ ${cost.toLocaleString('en-US')}`), node('p', `Your balance: R$ ${state.balance.toLocaleString('en-US')}`));
      const buy = node('button', confirming ? 'Buy' : 'Checkout', 'larpbux-buy-confirm'); buy.type = 'button'; buy.disabled = !state.cart?.length || Boolean(error);
      status.textContent = error || (confirming ? 'Confirm your purchase with Larp Robux.' : '');
      buy.addEventListener('click', async () => {
        if (!confirming) { confirming = true; draw(); return; }
        const finishLoading = purchaseLoading(dialog, buy);
        try {
          await finishLoading();
          if (!dialog.open || dialog.dataset.closing || userId !== account || !state?.mode) throw new Error('Your account changed. Reopen your cart.');
          const current = read(account);
          if (!current.mode) throw new Error('Turn Larp mode on before buying.');
          if (JSON.stringify(current.cart) !== JSON.stringify(state.cart)) throw new Error('Your cart changed. Reopen it to review your purchase.');
          save(checkoutCart(current)); clearPurchasedNativeCart(current.cart); closePurchase(); purchaseToast();
        } catch (failure) { dialog.removeAttribute('aria-busy'); status.textContent = failure.message; buy.disabled = false; buy.classList.remove('is-loading'); buy.removeAttribute('aria-busy'); buy.textContent = 'Buy'; }
      });
      footer.append(buy);
    };
    draw(); dialog.append(title, close, rows, status, footer);
    dialog.addEventListener('cancel', event => {event.preventDefault(); closePurchase();}); document.body.append(dialog); dialog.showModal();
  }
  function updateItem() {
    updateCatalogTryOn();
    const box = document.querySelector('#item-details .price-row-container, #item-details-container .price-row-container');
    if (!box) return;
    let own = box.querySelector('.larpbux-item-actions');
    if (!own) {
      own = node('div', '', 'larpbux-item-actions');
      const buy = node('button', 'Buy with R$', 'larpbux-classic-buy'); buy.type = 'button';
      const add = node('button', 'Add to cart', 'larpbux-add-cart'); add.type = 'button';
      const view = node('a', 'Customize Character', 'larpbux-owned-link'); view.hidden = true;
      const status = node('p'); status.setAttribute('role', 'status');
      const notice = node('span', 'This item is available in your inventory.', 'larpbux-owned-notice');
      own.append(buy, add, notice, view, status); own._notice = notice; own._buy = buy; own._add = add; own._view = view; own._status = status; own._pending = false; box.append(own);
      add.addEventListener('click', async () => {
        if (own._pending || !state?.mode) return;
        own._pending = true; add.disabled = true;
        try {
          const account = userId, path = location.pathname, item = await itemData();
          if (!item || account !== userId || path !== location.pathname || !state?.mode) return;
          const current = read(account); if (!current.mode) return;
          save(addToCart(current, item)); status.textContent = 'Added to cart';
        } catch (error) {status.textContent = error.message;}
        finally {own._pending = false; updateItem();}
      });
      buy.addEventListener('click', async () => {
        if (own._pending) return;
        own._pending = true; buy.disabled = true; status.textContent = 'Loading item…';
        try {
          const account = userId, path = location.pathname, item = await itemData();
          if (!item || account !== userId || path !== location.pathname || !state?.mode) return;
          purchase(item); status.textContent = '';
        } catch (error) { status.textContent = error.message; }
        finally { if (status.textContent === 'Loading item…') status.textContent = ''; own._pending = false; updateItem(); }
      });
    }
    const route = location.pathname.match(/^\/(catalog|bundles)\/(\d+)/);
    const itemKey = route && `${route[1] === 'bundles' ? 'Bundle' : 'Asset'}:${Number(route[2])}`;
    const owned = state?.items.find(item => keyFor(item) === itemKey);
    if (owned && !owned.assetType) {
      const visible = visibleItem();
      if (visible?.assetType) {
        action(() => save({...state, items: state.items.map(item => item === owned ? {...item, assetType: visible.assetType} : item)}));
      }
    }
    const modern = globalThis.LarpbloxAppearance?.get?.() === 'modern';
    const limited = owned?.isLimited || owned?.isLimitedUnique || Boolean(document.querySelector('#item-thumbnail-container-frontend .icon-limited-label, #item-thumbnail-container-frontend .icon-limited-unique-label'));
    const text = owned && !limited ? 'Item Owned' : modern ? 'Buy' : 'Buy with R$';
    if (own._buy.textContent !== text) own._buy.textContent = text;
    own._buy.disabled = Boolean((owned && !limited) || own._pending); own._view.hidden = !owned || limited; own._view.href = avatarUrl();
    const singleOwned = Boolean(state?.mode && modern && owned && !limited);
    box.classList.toggle('larpbux-single-owned', singleOwned);
    own._notice.hidden = !singleOwned;
    if (singleOwned && !own._view.querySelector('svg')) {
      own._view.textContent = '';
      own._view.setAttribute('aria-label', 'Customize Character');
      own._view.title = 'Customize Character';
      own._view.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="9" y="2" width="6" height="7" rx="3"/><path d="M8 9H6a2 2 0 0 0-2 2v6l4 2V12m8-3h2a2 2 0 0 1 2 2v6l-4 2v-7M8 10v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V10M12 15v7"/></svg>';
    } else if (!singleOwned && own._view.querySelector('svg')) own._view.textContent = 'Customize Character';
    own._add.disabled = own._buy.disabled;
    const inCart = state?.cart?.some(item => keyFor(item) === itemKey);
    own._add.disabled ||= Boolean(inCart && !limited);
    const addLabel = inCart && !limited ? 'Added to cart' : 'Add to cart';
    if (own._add.textContent !== addLabel) own._add.textContent = addLabel;
    const info = box.closest('#item-details, #item-details-container');
    const page = box.closest('#item-details-container') || info;
    page?.querySelectorAll('.larpbux-cart-toggle').forEach(element => element.remove());
    page?.querySelectorAll('.larpbux-native-cart').forEach(element => element.classList.remove('larpbux-native-cart'));
    for (const control of page?.querySelectorAll('button, a, [role="button"]') || []) {
      if (control.closest('.larpbux-item-actions')) continue;
      const label = control.getAttribute('aria-label') || control.textContent.trim();
      if (!/^(?:shopping )?cart(?:\s*\(\d+\))?$/i.test(label)) continue;
      if (!control._larpbuxCart) {
        control._larpbuxCart = true;
        control.addEventListener('click', event => {
          if (!state?.mode) return;
          event.preventDefault(); event.stopImmediatePropagation(); event.stopPropagation(); showCart();
        }, true);
      }
    }
    let count = page?.querySelector('.larpbux-owned-count');
    if (owned && (limited || singleOwned) && info) {
      for (const label of info.querySelectorAll('span, a')) {
        if (label.closest('.larpbux-owned-count') || !/^(?:Owned Items\s*\(\d+\)|Item Owned)$/i.test(label.textContent.trim())) continue;
        label.classList.add('larpbux-native-owned-count');
      }
      if (!count) count = node('span', '', 'larpbux-owned-count');
      const creatorLink = page?.querySelector('a[href*="/communities/"], a[href*="/groups/"], a[href*="/users/"]');
      const creator = page?.querySelector('#item-details-creator-container, .item-details-creator-container, .item-details-creator, .creator-name, .item-creator') || creatorLink?.parentElement;
      if (creator) {
        creator.classList.add('larpbux-owned-creator');
        if (count.parentElement !== creator) creator.append(count);
      } else if (!count.isConnected) box.before(count);
      const label = singleOwned ? 'Item Owned' : `Owned Items (${Number.isSafeInteger(owned.quantity) && owned.quantity > 0 ? owned.quantity : 1})`;
      if (count.textContent !== label) count.textContent = label;
    } else {
      count?.remove();
      page?.querySelectorAll('.larpbux-owned-creator').forEach(element => element.classList.remove('larpbux-owned-creator'));
      for (const label of info?.querySelectorAll('.larpbux-native-owned-count') || []) label.classList.remove('larpbux-native-owned-count');
    }
  }
  function updateHeaderBalance() {
    for (const element of document.querySelectorAll('#nav-robux-amount, #nav-robux-balance')) {
      if (!counts.has(element)) counts.set(element, {real: element.textContent, shown: null});
    }
    for (const [element, record] of counts) {
      if (!element.isConnected) { counts.delete(element); continue; }
      // Remember genuine updates from Roblox even while the local amount is displayed.
      if (element.textContent !== record.shown) record.real = element.textContent;
      const pretend = state?.mode === true;
      const text = pretend ? formatBalance(state.balance) : record.real;
      if (element.textContent !== text) element.textContent = text;
      record.shown = pretend ? text : null;
    }
  }
  function update() {
    const id = document.querySelector('meta[name="user-data"]')?.getAttribute('data-userid');
    globalThis.LarpbloxVerification?.update({userId:id, mode:state?.mode === true, verified:state?.verified === true});
    globalThis.LarpbloxSharedUsers?.update({userId:id, mode:state?.mode === true, socialCounts:state?.socialCounts});
    if (!/^[1-9]\d*$/.test(id || '')) {
      userId = undefined; state = undefined;
      document.documentElement.classList.remove('larpblox-pretend-mode');
      clearNativeInventory();
      clearCatalogTryOn();
      if (panel) panel.hidden = true;
      closePurchase(); updateAvatar();
      updateHeaderBalance(); updateNames();
      return;
    }
    if (!panel) mount();
    if (userId !== id) { closePurchase(); clearCatalogTryOn(); queuedGameCommand = undefined; awaitingGameOutfit = undefined; userId = id; state = read(id); if (bridgeStatus) bridgeStatus.textContent = 'Checking connection…'; render(); }
    updateProfileMenu();
    updateNames();
    updateHeaderBalance();
    updateItem(); updateAvatar(); updateNativeInventory(); updateMarketplaceCart();
  }
  function start() {
    let colorQueue = Promise.resolve();
    document.addEventListener('larpblox-body-colors-request', event => {
      let request;
      try {request = JSON.parse(event.detail);} catch (_) {return;}
      colorQueue = colorQueue.catch(() => {}).then(async () => {
        let error;
        try {await applyBodyColorChange(request);} catch (failure) {error = failure.message; if (message) message.textContent = error;}
        document.dispatchEvent(new CustomEvent('larpblox-body-colors-response', {detail:JSON.stringify({id:request.id, ok:!error, error})}));
      });
    });
    window.addEventListener('click',event=>{
      if (marketplaceCartClick(event)) return;
      if (state?.mode && /^\/(?:catalog|bundles)\/\d+/.test(location.pathname)) {
        const control = event.target?.closest?.('button, [role="button"]');
        if (control?.closest('#item-thumbnail-container-frontend .thumbnail-button-container')) {
          const label = control.textContent.trim();
          if (/^(try\s*on|take\s*off)$/i.test(label)) {
            event.preventDefault(); event.stopImmediatePropagation(); event.stopPropagation();
            if (catalogTryOn.controller) clearCatalogTryOn(); else catalogTryOnItem();
            return;
          }
          if (catalogTryOn.controller && /^(2d|3d)$/i.test(label)) {
            event.preventDefault(); event.stopImmediatePropagation(); event.stopPropagation();
            if (catalogTryOn.item) catalogTryOnItem(catalogTryOn.item,label.toLowerCase());
            return;
          }
        }
      }
      if (state?.mode && settingsNameRow(event.target, true)) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); return; }
      if (!state?.mode || !settingsNameRow(event.target)) return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();purchaseUsername();
    },true);
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    window.addEventListener('popstate', updateCatalogTryOn);
    update(); let queued = false;
    new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; update(); }); }).observe(document.body, {childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset', 'sizes', 'data-user-id', 'data-userid']});
    window.addEventListener('storage', event => { if (userId && (event.key === key() || event.key === null)) { closePurchase(); state = read(userId); render(); } });
    if (typeof LarpbloxGameBridge !== 'undefined') {
      const poll = async () => {
        if (!document.hidden) syncNames();
        if (!document.hidden || state?.pendingOutfit || queuedGameCommand) await syncGame();
        setTimeout(poll, state?.pendingOutfit || queuedGameCommand ? 250 : 1000);
      };
      document.addEventListener('visibilitychange', () => { if (!document.hidden) { update(); syncNames(); syncGame(); } });
      poll();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true}); else start();
})();
