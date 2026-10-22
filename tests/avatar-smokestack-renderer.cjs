const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');
const built = esbuild.buildSync({stdin:{contents:`
  export {smokestackSeason, smokestackTextureMatches} from './larpbux-avatar-3d-source.js';
`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',nodePaths:[path.resolve(__dirname,'../../renderer-build/node_modules')],write:false});
const exportsModule = {exports:{}};
new Function('module','exports','require',built.outputFiles[0].text)(exportsModule,exportsModule.exports,require);
const {smokestackSeason, smokestackTextureMatches} = exportsModule.exports;
const date = (month, day) => new Date(2026, month - 1, day);
for (const [month, day, style] of [[2,9,'valentines'],[2,16,'valentines'],[3,12,'stpatricks'],[3,19,'stpatricks'],[4,1,'aprilfools'],[8,27,'birthday'],[10,22,'halloween'],[10,31,'halloween'],[11,20,'thanksgiving'],[11,30,'thanksgiving'],[12,18,'christmas'],[12,27,'christmas'],[1,1,'normal']]) assert.equal(smokestackSeason('auto',date(month,day)),style,`${month}/${day}`);
assert.equal(smokestackSeason('halloween',date(1,1)),'halloween','manual choice overrides date');
assert.equal(smokestackSeason('unknown',date(1,1)),'normal','unknown choice falls back to automatic');
assert.equal(smokestackTextureMatches('https://t2.rbxcdn.com/original-hash?x=1','https://t7.rbxcdn.com/original-hash'),true,'same delivery hash identifies only the target texture');
assert.equal(smokestackTextureMatches('https://t2.rbxcdn.com/other-hash','https://t7.rbxcdn.com/original-hash'),false,'other accessories are left alone');
console.log('PASS: Smokestack dates, manual style, and exact texture-hash matching are stable.');
