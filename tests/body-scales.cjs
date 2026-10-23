const assert = require('assert');
const {changedBodyScales} = require('../larpbux.js');

assert.deepEqual(changedBodyScales({height:1, width:1}, {bodyHeightScale:1.25, WidthScale:0.8}), {height:1.25, width:0.8});
assert.deepEqual(changedBodyScales({}, {HeadScale:'1.4', BodyTypeScale:0}), {head:1.4, bodyType:0});
assert.throws(() => changedBodyScales({}, {heightScale:6}), /body scale/);
assert.throws(() => changedBodyScales({}, {unrelated:1}), /body scale/);
console.log('PASS: body scale payloads normalize, validate, and preserve existing scales.');
