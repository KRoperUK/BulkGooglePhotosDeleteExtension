'use strict';

// Tests for the persisted side-panel settings (settings.js). The module has
// no DOM or chrome references at load, so it runs in plain node with a stub
// storage area — no jsdom harness needed.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadSettingsModule() {
  // settings.js assigns to globalThis and touches no other free variable,
  // so it can run unmodified in this realm; assertions then see plain objects.
  const code = fs.readFileSync(path.join(__dirname, '..', 'settings.js'), 'utf8');
  vm.runInThisContext(`${code}\n//# sourceURL=settings.js`);
  return globalThis.BDGPSettings;
}

// Minimal chrome.storage.local stand-in.
function fakeStorage(initial) {
  const data = { ...(initial || {}) };
  return {
    data,
    async get(key) {
      return typeof key === 'string' ? { [key]: data[key] } : {};
    },
    async set(items) {
      Object.assign(data, items);
    }
  };
}

test('loads defaults when nothing is stored', async () => {
  const S = loadSettingsModule();
  assert.deepEqual(await S.load(fakeStorage()), { batchSize: 50, maxTotal: 0, delay: 5, confirm: true });
});

test('loads defaults when storage is unavailable', async () => {
  const S = loadSettingsModule();
  assert.deepEqual(await S.load(null), S.DEFAULTS);
  assert.deepEqual(await S.load({}), S.DEFAULTS);
});

test('round-trips saved settings', async () => {
  const S = loadSettingsModule();
  const storage = fakeStorage();
  await S.save(storage, { batchSize: 100, maxTotal: 500, delay: 400, confirm: false });
  assert.deepEqual(await S.load(storage), { batchSize: 100, maxTotal: 500, delay: 400, confirm: false });
});

test('partial saves merge with previously stored values', async () => {
  const S = loadSettingsModule();
  const storage = fakeStorage();
  await S.save(storage, { batchSize: 100 });
  await S.save(storage, { delay: 400 });
  assert.deepEqual(await S.load(storage), { batchSize: 100, maxTotal: 0, delay: 400, confirm: true });
});

test('never persists dryRun and always restores it as checked-by-default', async () => {
  const S = loadSettingsModule();
  const storage = fakeStorage();
  // Even if a caller passes dryRun: false, it is dropped, not stored.
  await S.save(storage, { batchSize: 100, dryRun: false });
  const loaded = await S.load(storage);
  assert.equal('dryRun' in loaded, false);
  assert.deepEqual(loaded, { batchSize: 100, maxTotal: 0, delay: 5, confirm: true });
});

test('invalid stored values fall back to safe defaults', async () => {
  const S = loadSettingsModule();
  const storage = fakeStorage({ 'bdgp:settings:v1': { batchSize: -5, maxTotal: 'lots', delay: 0, confirm: 'yes' } });
  assert.deepEqual(await S.load(storage), { batchSize: 0, maxTotal: 0, delay: 1, confirm: true });
});

test('a failing storage read still yields defaults', async () => {
  const S = loadSettingsModule();
  const broken = { get() { throw new Error('denied'); }, set() {} };
  assert.deepEqual(await S.load(broken), S.DEFAULTS);
});

test('a failing storage write resolves instead of throwing', async () => {
  const S = loadSettingsModule();
  const broken = { get() { return {}; }, set() { throw new Error('denied'); } };
  const next = await S.save(broken, { batchSize: 10 });
  assert.equal(next.batchSize, 10);
});
