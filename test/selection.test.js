'use strict';

// Tests for the extension's selection/batch logic. They load the real,
// shipped content.js into a jsdom window whose origin is photos.google.com
// (the IIFE bails on any other host) with a minimal `chrome` stub, build a
// synthetic Google-Photos-like grid, and drive the script through its own
// message API — the same surface the side panel uses.
//
// No bundler: content.js is injected as a single file in production, so the
// test exercises exactly what ships.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const CONTENT_JS = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');

// A toolbar that renders "<n> selected", mirroring Google's selection header.
function selectionToolbarHTML() {
  return '<div role="toolbar"><span class="count">0 selected</span>' +
    '<button aria-label="Delete">Delete</button></div>';
}

// Build `count` tile checkboxes. Each click toggles aria-checked and updates
// the toolbar counter, like the real grid. `selectLag` simulates aria-checked
// lagging the click under load (the condition that used to trip the pointer
// fallback in selectOne).
function makeGrid(dom, count, { selectLag = 0 } = {}) {
  const { document } = dom.window;
  const grid = document.createElement('div');
  grid.id = 'grid';
  // A scrollable container so scrollContainer() has something to find.
  grid.style.overflowY = 'scroll';
  Object.defineProperty(grid, 'scrollHeight', { value: 10000, configurable: true });
  Object.defineProperty(grid, 'clientHeight', { value: 500, configurable: true });

  const toolbar = document.querySelector('[role="toolbar"] .count');

  const recount = () => {
    const n = [...document.querySelectorAll('[role="checkbox"][aria-checked]')]
      .filter((el) => el.getAttribute('aria-checked') === 'true').length;
    toolbar.textContent = `${n} selected`;
  };

  for (let i = 0; i < count; i++) {
    const tile = document.createElement('div');
    tile.setAttribute('role', 'checkbox');
    tile.setAttribute('aria-checked', 'false');
    const link = document.createElement('a');
    link.setAttribute('href', `/photo/AB${i}`);
    tile.appendChild(link);

    tile.addEventListener('click', () => {
      const flip = () => {
        const now = tile.getAttribute('aria-checked') === 'true';
        tile.setAttribute('aria-checked', now ? 'false' : 'true');
        recount();
      };
      if (selectLag > 0) setTimeout(flip, selectLag);
      else flip();
    });

    grid.appendChild(tile);
  }
  document.body.appendChild(grid);
  recount();
  return grid;
}

// Load content.js into a fresh jsdom window and return a driver around its
// message API. `url` overrides the default library URL (e.g. the Bin page).
function loadExtension({ gridSize = 0, selectLag = 0, url = 'https://photos.google.com/' } = {}) {
  const dom = new JSDOM(
    `<!doctype html><html><body>${selectionToolbarHTML()}</body></html>`,
    { url, pretendToBeVisual: true, runScripts: 'outside-only' }
  );
  const { window } = dom;

  // getBoundingClientRect returns zeroes in jsdom; visible() needs non-zero.
  window.Element.prototype.getBoundingClientRect = function () {
    return { width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100, x: 0, y: 0 };
  };
  // scrollBy is a no-op in jsdom; make scrollStep() report "no movement" so the
  // batch loop does not spin waiting for virtualised tiles that never load.
  window.HTMLElement.prototype.scrollBy = function () {};

  const listeners = [];
  const sent = [];
  window.chrome = {
    runtime: {
      sendMessage: (msg) => { sent.push(msg); return Promise.resolve(); },
      onMessage: { addListener: (fn) => listeners.push(fn) }
    }
  };

  if (gridSize) makeGrid(dom, gridSize, { selectLag });

  // Execute the content script in the jsdom window context.
  window.eval(CONTENT_JS);

  const dispatch = (msg) =>
    new Promise((resolve) => {
      let answered = false;
      const respond = (r) => { if (!answered) { answered = true; resolve(r); } };
      for (const fn of listeners) fn(msg, {}, respond);
      if (!answered) resolve(undefined);
    });

  return { dom, window, sent, dispatch };
}

// Wait until the content script reports it finished a run (emits a "Finished"
// status), or time out.
async function waitForFinish(sent, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const done = sent.some((m) => m.status && /Finished|Dry run complete|Nothing to delete/.test(m.status));
    if (done) return true;
    await new Promise((r) => setTimeout(r, 20));
  }
  return false;
}

test('dry run on a 200-tile grid never selects more than the batch size', async () => {
  const { sent, dispatch } = loadExtension({ gridSize: 200, selectLag: 0 });

  const res = await dispatch({ type: 'bdgp:start', options: { batchSize: 50, delay: 1, dryRun: true } });
  assert.equal(res.ok, true);

  const finished = await waitForFinish(sent);
  assert.equal(finished, true, 'run did not finish');

  // The "Dry run — N selected" phase carries the final selected count.
  const phases = sent
    .filter((m) => m.progress && typeof m.progress.phase === 'string')
    .map((m) => m.progress.phase);
  const dryPhase = phases.reverse().find((p) => /Dry run — \d+ selected/.test(p));
  assert.ok(dryPhase, `expected a dry-run summary phase, got: ${phases.join(' | ')}`);

  const selected = Number(dryPhase.match(/Dry run — (\d+) selected/)[1]);
  assert.ok(selected <= 50, `selected ${selected} exceeds batch size 50`);
  assert.ok(selected >= 45, `selected ${selected} is implausibly low for a 200-tile grid`);
});

test('aria-checked lag does not push the batch over its size (guards #29)', async () => {
  // 40ms lag: the first click selects the tile but aria-checked flips late.
  // The old 25ms selectOne fallback fired a range-extending pointer sequence
  // here; the fix polls long enough that it does not.
  const { sent, dispatch } = loadExtension({ gridSize: 200, selectLag: 40 });

  await dispatch({ type: 'bdgp:start', options: { batchSize: 50, delay: 1, dryRun: true } });
  assert.equal(await waitForFinish(sent), true, 'run did not finish');

  const phases = sent
    .filter((m) => m.progress && typeof m.progress.phase === 'string')
    .map((m) => m.progress.phase);
  const dryPhase = phases.reverse().find((p) => /Dry run — \d+ selected/.test(p));
  assert.ok(dryPhase, 'expected a dry-run summary phase');
  const selected = Number(dryPhase.match(/Dry run — (\d+) selected/)[1]);
  assert.ok(selected <= 50, `selected ${selected} exceeds batch size 50 under aria-checked lag`);
});

test('diagnose reports the toolbar selection count, not a stray page number', async () => {
  const { window, sent, dispatch } = loadExtension({ gridSize: 10 });
  const { document } = window;

  // A decoy elsewhere on the page that reads like a count. selectionCount must
  // prefer the toolbar region and ignore this (guards #33).
  const decoy = document.createElement('div');
  decoy.textContent = '999 selected';
  document.body.appendChild(decoy);

  // Select three tiles directly.
  const tiles = [...document.querySelectorAll('[role="checkbox"]')];
  tiles[0].click(); tiles[1].click(); tiles[2].click();

  const res = await dispatch({ type: 'bdgp:diagnose' });
  assert.equal(res.ok, true);
  const selectedLine = res.report.find((l) => l.startsWith('Selected count:'));
  assert.equal(selectedLine, 'Selected count: 3');
});

test('refuses to run on the Bin page', async () => {
  const { dispatch } = loadExtension({ gridSize: 10, url: 'https://photos.google.com/trash' });

  const res = await dispatch({ type: 'bdgp:start', options: { batchSize: 10, dryRun: false } });
  assert.equal(res.ok, false);
  assert.match(res.error, /Bin/);
});
