const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { buildSync } = require('esbuild');

// Load the real utility without requiring Obsidian's runtime DOM globals.
const code = buildSync({
  entryPoints: [path.join(__dirname, '../src/utils.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
}).outputFiles[0].text;
const context = { module: { exports: {} }, exports: {} };
vm.runInNewContext(code, context);
const { isMarkerMatchAt } = context.module.exports;

test('matches the whole typed prefix and rejects unmatched marker sequences', () => {
  const markers = ['ab', 'ac', 'ad'].map(text => ({ text }));
  assert.equal(isMarkerMatchAt('a', markers), true);
  assert.equal(isMarkerMatchAt('ab', markers), true);
  assert.equal(isMarkerMatchAt('ae', markers), false);
  assert.equal(isMarkerMatchAt('b', markers), false);
  assert.equal(isMarkerMatchAt('x', []), false);
});
