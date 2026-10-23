(() => {
  'use strict';

  // Injected on demand via the toolbar button, so confirm we are on the right
  // site before touching anything.
  if (location.hostname !== 'photos.google.com') return;

  if (window.__bdgpLoaded) {
    if (window.__bdgpOpen) window.__bdgpOpen();
    return;
  }
  window.__bdgpLoaded = true;

  // ---------- helpers ----------

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const DELETE_WORDS = [
    'delete', 'delete all', 'delete permanently', 'move to bin', 'move to trash', 'remove',
    'löschen', 'papierkorb',
    'supprimer', 'corbeille',
    'eliminar', 'papelera', 'cestino',
    'verwijderen', 'prullenbak',
    'radera', 'papperskorgen', 'slett',
    'poista', 'roskakori',
    'usuń', 'kosz',
    'удалить', 'корзина',
    '删除', '垃圾桶', '回收站',
    '刪除', '垃圾桶',
    '削除', 'ゴミ箱',
    '삭제', '휴지통',
    'حذف', 'سلة المهملات',
    'מחק', 'אשפה',
    'διαγραφή', 'κάδος',
    'sil', 'çöp kutusu',
    'üle'
  ];

  const SELECTED_RE = /([\d][\d\s.,]*)\s*(selected|ausgewählt|sélectionné|sélectionnés|seleccionado|seleccionados|selezionat|geselecteerd|valda|valgt|valittu|wybrano|выбрано|已选择|已選取|選択済み|선택됨|seçildi|محدد|נבחר|επιλεγμένα)/i;

  const SELECT_ALL_WORDS = [
    'select all', 'select all photos', 'select all items', 'all photos',
    'alle auswählen', 'alles auswählen',
    'tout sélectionner', 'sélectionner tout',
    'seleccionar todo', 'seleccionar todos',
    'seleziona tutto', 'seleziona tutti',
    'alles selecteren', 'selecteer alles',
    'markera alla', 'velg alle', 'vel alle',
    'valitse kaikki',
    'zaznacz wszystko',
    'выбрать все', 'выделить все',
    '全选', '全部選取', '选择全部',
    'すべて選択', '全て選択',
    '전체 선택',
    'تحديد الكل', 'בחר הכל', 'επιλογή όλων',
    'tümünü seç', 'hepsini seç'
  ];

  const MENU_WORDS = [
    'more options', 'more actions', 'more', 'options',
    'weitere optionen', 'mehr',
    'plus d\'options', 'autres options',
    'más opciones',
    'altre opzioni', 'altri',
    'meer opties',
    'fler', 'mer',
    'lisää', 'więcej',
    'ещё', 'еще',
    '更多', '更多選項', 'その他', '더보기',
    'المزيد', 'עוד', 'περισσότερα', 'diğer'
  ];

  function visible(el) {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    return s.visibility !== 'hidden' && s.display !== 'none';
  }

  function label(el) {
    return [
      el.getAttribute('aria-label'),
      el.getAttribute('title'),
      el.getAttribute('data-tooltip'),
      el.textContent
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function looksLikeDelete(text) {
    return DELETE_WORDS.some((w) => text.includes(w));
  }

  function dedupe(list) {
    return [...new Set(list)];
  }

  function inChrome(element) {
    return !!element.closest('[role="dialog"], [role="toolbar"], header, [role="banner"]');
  }

  // ---------- DOM discovery ----------

  function findTileCheckboxes() {
    const strategies = [
      () => [...document.querySelectorAll('[role="checkbox"][aria-checked]')],
      () => [...document.querySelectorAll('a[href*="/photo/"]')]
        .map((a) => a.closest('[role="checkbox"]') || a.querySelector('[role="checkbox"]')),
      () => [...document.querySelectorAll('[data-latest-bg]')]
        .map((el) => el.closest('[role="checkbox"]') || el.querySelector('[role="checkbox"]'))
    ];

    for (const strategy of strategies) {
      let found = [];
      try {
        found = strategy().filter((el) => el && el.isConnected && visible(el) && !inChrome(el));
      } catch (e) {
        continue;
      }
      if (found.length) return dedupe(found);
    }
    return [];
  }

  function photoHrefs() {
    return new Set(
      [...document.querySelectorAll('a[href*="/photo/"]')]
        .map((a) => a.getAttribute('href'))
        .filter(Boolean)
    );
  }

  function selectionCount() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    let seen = 0;
    while ((node = walker.nextNode()) && seen < 6000) {
      seen++;
      const text = node.nodeValue;
      if (!text || text.length > 80) continue;
      const m = text.match(SELECTED_RE);
      if (m) {
        const n = parseInt(m[1].replace(/[^\d]/g, ''), 10);
        if (Number.isFinite(n)) return n;
      }
    }
    return findTileCheckboxes().filter((el) => el.getAttribute('aria-checked') === 'true').length;
  }

  function findDeleteButton() {
    // The Delete control lives in the selection toolbar, so only dialogs are excluded here.
    const candidates = [
      ...document.querySelectorAll('button, [role="button"]')
    ].filter((el) => {
      if (!visible(el) || el.getAttribute('role') === 'checkbox') return false;
      if (el.closest('[role="dialog"]')) return false;
      return true;
    });

    const matches = candidates.filter((el) => {
      const text = label(el);
      return text && looksLikeDelete(text) && !text.includes('undo');
    });

    if (matches.length) return matches[0];

    // Icon-only buttons often carry the label on a child or the tooltip on a parent.
    const withChildLabel = candidates.filter((el) => looksLikeDelete(label(el)));
    return withChildLabel[0] || null;
  }

  function dialogConfirmButton(dialog) {
    const buttons = [...dialog.querySelectorAll('button, [role="button"]')].filter(visible);
    const match = buttons.find((b) => looksLikeDelete(label(b)));
    return { button: match || null, all: buttons };
  }

  const DESELECT_RE = /deselect|unselect|abwählen|auswahl aufheben|désélectionner|desseleccionar|deseleziona|deselecteren|avmarkera|fjordel|odznacz|снять выделение|取消选择|取消選取|選択を解除|선택 해제|إلغاء تحديد|בטל בחירה/i;

  function selectOne(el) {
    if (!el || !el.isConnected) return Promise.resolve(false);

    el.click();
    return sleep(25).then(() => {
      if (el.getAttribute('aria-checked') === 'true') return true;
      if (!el.isConnected) return false;

      // The click did not register; try the pointer sequence instead of clicking twice.
      for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup']) {
        el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
      }
      return sleep(25).then(() => el.getAttribute('aria-checked') === 'true');
    });
  }

  function pressSelectAll() {
    const meta = navigator.platform.toLowerCase().includes('mac');
    const init = {
      key: 'a', code: 'KeyA', keyCode: 65, which: 65,
      ctrlKey: !meta, metaKey: meta, bubbles: true, cancelable: true, composed: true
    };
    const target = document.activeElement && document.activeElement !== document.body
      ? document.activeElement
      : document.body;
    for (const t of [target, document.body, document]) {
      t.dispatchEvent(new KeyboardEvent('keydown', init));
      t.dispatchEvent(new KeyboardEvent('keyup', init));
    }
  }

  async function waitFor(predicate, timeout = 8000, interval = 150) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (state.stop) return null;
      const value = predicate();
      if (value) return value;
      await sleep(interval);
    }
    return null;
  }

  // ---------- core actions ----------

  const state = {
    running: false,
    stop: false,
    deleted: 0,
    batches: 0
  };

  function findSelectAllControl() {
    const els = [...document.querySelectorAll('[role="checkbox"], button, [role="button"]')];
    return els.find((el) => {
      if (!visible(el) || el.closest('[role="dialog"]')) return false;
      const t = label(el);
      if (DESELECT_RE.test(t)) return false;
      return SELECT_ALL_WORDS.some((w) => t.includes(w));
    }) || null;
  }

  async function selectAllViaMenu() {
    const opener = [...document.querySelectorAll('button, [role="button"]')].find((el) => {
      if (!visible(el) || el.closest('[role="dialog"]')) return false;
      const t = label(el);
      return t && MENU_WORDS.some((w) => t.includes(w));
    });
    if (!opener) return false;

    opener.click();
    const item = await waitFor(() => {
      const menu = [...document.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"]')];
      return menu.find((m) => {
        if (!visible(m)) return false;
        const t = label(m);
        if (DESELECT_RE.test(t)) return false;
        return SELECT_ALL_WORDS.some((w) => t.includes(w));
      }) || null;
    }, 3000);

    if (item) {
      item.click();
      await sleep(700);
      return true;
    }
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return false;
  }

  async function selectAllInView() {
    // Path 1 — an explicit "Select all" checkbox/button in the selection toolbar.
    let control = findSelectAllControl();
    if (!control) {
      const tiles = findTileCheckboxes();
      if (tiles.length) {
        await selectOne(tiles[0]);
        await sleep(450);
      }
      control = findSelectAllControl();
    }
    if (control) {
      control.click();
      await sleep(700);
      const n = selectionCount();
      log(`Select-all control clicked → ${n} selected`);
      if (n > 1) return n;
    }

    // Path 2 — the overflow menu item.
    if (await selectAllViaMenu()) {
      const n = selectionCount();
      log(`Menu select-all → ${n} selected`);
      if (n > 1) return n;
    }

    // Path 3 — shift-click the last rendered tile to extend the range.
    const tiles = findTileCheckboxes();
    if (tiles.length > 1) {
      const first = tiles.find((el) => el.getAttribute('aria-checked') !== 'true') || tiles[0];
      await selectOne(first);
      await sleep(200);
      tiles[tiles.length - 1].dispatchEvent(new MouseEvent('click', {
        bubbles: true, cancelable: true, view: window, shiftKey: true
      }));
      await sleep(500);
      const n = selectionCount();
      log(`Shift-range → ${n} selected`);
      if (n > 1) return n;
    }

    // Path 4 — keyboard shortcut.
    pressSelectAll();
    await sleep(500);
    const n = selectionCount();
    log(`Keyboard select-all → ${n} selected`);
    return n;
  }

  function scrollContainer(el) {
    let p = el && el.parentElement;
    while (p && p !== document.body) {
      const s = getComputedStyle(p);
      if (/(auto|scroll|overlay)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 50) return p;
      p = p.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function scrollStep(container) {
    if (!container) return false;
    const before = container.scrollTop;
    container.scrollBy({ top: Math.max(300, Math.round(container.clientHeight * 0.8)), behavior: 'auto' });
    return container.scrollTop !== before;
  }

  async function settleGrid(timeout = 15000) {
    const start = Date.now();
    let lastCount = -1;
    let stable = 0;

    while (Date.now() - start < timeout) {
      if (state.stop) return false;
      const count = findTileCheckboxes().length;
      if (count > 0 && count === lastCount) {
        stable++;
        if (stable >= 2) return true;
      } else {
        stable = 0;
      }
      lastCount = count;
      await sleep(400);
    }
    return findTileCheckboxes().length > 0;
  }

  async function waitForGridChange(before, timeout = 30000) {
    if (!before.size) {
      await settleGrid(10000);
      return true;
    }

    const start = Date.now();
    let announced = false;
    let nudged = false;

    while (Date.now() - start < timeout) {
      if (state.stop) return false;

      const now = photoHrefs();
      const changed = now.size === 0 || [...before].some((href) => !now.has(href));

      if (changed) {
        // Let the replacement tiles settle before clicking anything.
        await settleGrid(10000);
        return true;
      }

      if (!announced) {
        log('Waiting for the grid to refresh after the delete…');
        announced = true;
      }

      // A virtualised grid can hold stale nodes indefinitely until it scrolls.
      if (!nudged && Date.now() - start > 10000) {
        const tile = findTileCheckboxes()[0];
        const container = tile ? scrollContainer(tile) : null;
        if (container) {
          log('Grid has not refreshed yet — nudging it to re-render.');
          scrollStep(container);
        }
        nudged = true;
      }

      await sleep(400);
    }
    return false;
  }

  async function selectBatch(batchSize, delay) {
    if (batchSize === 0) return selectAllInView();

    let selected = 0;
    let attempted = 0;
    let container = null;
    let idleRounds = 0;

    // Cap on clicks performed, not on clicks that verified. The snapshot can
    // hold 70-100 tiles, so trusting a lagging verified count overshoots badly.
    while (!state.stop && attempted < batchSize) {
      const tiles = findTileCheckboxes();
      if (!container && tiles.length) container = scrollContainer(tiles[0]);

      // Nothing rendered: the grid is almost certainly still refreshing after
      // a delete. Give it real time before deciding the library is empty.
      if (!tiles.length) {
        const refreshed = await waitFor(() => {
          const t = findTileCheckboxes();
          return t.length ? t : null;
        }, 25000);

        if (!refreshed) {
          idleRounds++;
          if (idleRounds > 2 || !scrollStep(container)) break;
          await sleep(1000);
        }
        continue;
      }

      const unselected = tiles.filter((el) => el.getAttribute('aria-checked') !== 'true');

      // Everything on screen is already selected: load the next window.
      if (!unselected.length) {
        if (scrollStep(container)) {
          await sleep(900);
          continue;
        }
        const more = await waitFor(() => {
          const t = findTileCheckboxes().filter((el) => el.getAttribute('aria-checked') !== 'true');
          return t.length ? t : null;
        }, 8000);
        if (!more) break;
        continue;
      }
      idleRounds = 0;

      let failed = 0;
      let aborted = false;

      for (const tile of unselected) {
        if (state.stop || attempted >= batchSize) break;
        if (!tile.isConnected) continue;
        // Re-check at click time: the grid recycles nodes as it loads more.
        if (tile.getAttribute('aria-checked') === 'true') continue;

        attempted++;
        const ok = await selectOne(tile);
        if (ok) {
          selected++;
        } else {
          failed++;
          if (failed > 20) {
            log('Too many tiles refused selection — stopping this batch.');
            aborted = true;
            break;
          }
        }

        if (attempted % 5 === 0) {
          setStatus(`Selecting… ${attempted}`);
          updateModal({ phase: `Selecting ${attempted} / ${batchSize}`, percent: (attempted / batchSize) * 100 });
        }
        await sleep(delay);
      }

      if (aborted) break;

      if (attempted >= batchSize) break;

      // Keep feeding the virtualized grid so the next window of tiles renders.
      if (!scrollStep(container)) {
        idleRounds++;
        if (idleRounds > 1) break;
      } else {
        await sleep(900);
      }
    }

    const counted = selectionCount();
    log(`Clicked ${attempted}, confirmed ${selected} of ${batchSize} requested (toolbar says ${counted})`);
    return counted || selected;
  }

  async function deselectAll() {
    const meta = navigator.platform.toLowerCase().includes('mac');
    document.body.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true, metaKey: meta
    }));
    await sleep(300);
  }

  async function deleteSelection() {
    const button = await waitFor(findDeleteButton, 6000);
    if (!button) {
      log('Could not find the Delete button. Stopping.');
      return false;
    }
    button.click();

    const dialog = await waitFor(() => {
      const d = [...document.querySelectorAll('[role="dialog"]')].find(visible);
      return d || null;
    }, 8000);

    if (dialog) {
      const { button: confirm, all } = dialogConfirmButton(dialog);
      if (!confirm) {
        log(`Confirm dialog found but no button matched. Buttons: ${all.map((b) => label(b) || '(unlabelled)').join(' | ')}`);
        return false;
      }
      confirm.click();
    }
    return true;
  }

  async function run(opts) {
    opts = {
      batchSize: Math.max(0, Number(opts && opts.batchSize) || 0),
      maxTotal: Math.max(0, Number(opts && opts.maxTotal) || 0),
      delay: Math.max(1, Number(opts && opts.delay) || 5),
      dryRun: !!(opts && opts.dryRun)
    };

    state.running = true;
    state.stop = false;
    state.deleted = 0;
    state.batches = 0;

    showModal();
    updateModal({ phase: 'Starting…', deleted: 0, batch: 0, percent: null });
    log(`Started. batch=${opts.batchSize || 'all'} max=${opts.maxTotal || 'unlimited'} dryRun=${opts.dryRun}`);

    if (document.hidden) log('Warning: tab is not visible. Chrome throttles timers in background tabs — keep this tab focused.');

    try {
      while (!state.stop) {
        const remaining = opts.maxTotal ? opts.maxTotal - state.deleted : Infinity;
        if (remaining <= 0) {
          log(`Reached limit of ${opts.maxTotal}.`);
          break;
        }

        const batch = opts.batchSize ? Math.min(opts.batchSize, remaining) : 0;
        setStatus('Selecting…');
        updateModal({
          phase: batch ? `Selecting up to ${batch}…` : 'Selecting everything in view…',
          deleted: state.deleted,
          batch: state.batches + 1,
          percent: opts.maxTotal ? (state.deleted / opts.maxTotal) * 100 : null
        });
        let selected = await selectBatch(batch, opts.delay);

        // A single empty pass after a delete is usually a refreshing grid, not
        // the end of the library. Retry before declaring it empty.
        for (let attempt = 1; !selected && !state.stop && attempt <= 2; attempt++) {
          log(`Nothing selectable (attempt ${attempt}) — waiting for the grid to come back.`);
          await sleep(3000);
          const ready = await waitFor(() => (findTileCheckboxes().length ? true : null), 15000);
          if (!ready) break;
          selected = await selectBatch(batch, opts.delay);
        }

        if (!selected) {
          log('No photos could be selected — library appears empty or selectors failed.');
          break;
        }

        if (opts.dryRun) {
          log(`Dry run: selected ${selected} item(s). Checking the delete path without deleting.`);

          const deleteBtn = findDeleteButton();
          if (deleteBtn) {
            log(`Dry run: Delete control found — "${label(deleteBtn).slice(0, 50) || '(unlabelled)'}"`);
            log('Dry run: the confirm dialog is only reachable by clicking Delete, so it cannot be checked without deleting.');
          } else {
            log('Dry run: WARNING — no Delete control found while items are selected. A real run would stop at this point.');
          }

          await deselectAll();
          updateModal({
            phase: `Dry run — ${selected} selected, delete control ${deleteBtn ? 'found' : 'MISSING'}`,
            percent: 100
          });
          setStatus(`Dry run complete — delete control ${deleteBtn ? 'found' : 'MISSING'}`);
          break;
        }

        setStatus(`Deleting ${selected}…`);
        updateModal({ phase: `Deleting ${selected}…`, percent: null });
        const before = photoHrefs();
        const ok = await deleteSelection();
        if (!ok) break;

        state.deleted += selected;
        state.batches++;
        updateModal({
          phase: 'Waiting for the grid to refresh…',
          deleted: state.deleted,
          batch: state.batches,
          percent: opts.maxTotal ? (state.deleted / opts.maxTotal) * 100 : null
        });
        log(`Batch ${state.batches}: deleted ${selected}. Total: ${state.deleted}`);

        await sleep(800);

        // Wait on the photos themselves, not on a tile count: a stale grid still
        // has tiles, and that is what let the next pass run too early.
        const changed = await waitForGridChange(before, 30000);
        if (!changed) {
          log('Warning: the visible photos did not change after deleting. The delete may not have applied, or the grid is stuck. Stopping.');
          break;
        }

        if (document.hidden) log('Tab hidden — pausing 5s so throttling does not stall the run.');
        if (document.hidden) await sleep(5000);
      }
    } catch (err) {
      log(`Error: ${err.message}`);
      updateModal({ phase: `Error: ${err.message}`, percent: null });
    } finally {
      state.running = false;

      // An aborted run (Stop, missing Delete button, failed confirmation) can
      // leave a selection behind, and the next run would stack on top of it.
      const leftover = selectionCount();
      if (leftover > 0) {
        log(`Clearing ${leftover} still-selected item(s) so the next run starts clean.`);
        await deselectAll();
      }

      setStatus(`Finished — ${state.deleted} deleted in ${state.batches} batch(es)`);
      log('Run stopped.');
      updateModal({
        phase: `Finished — ${state.deleted} deleted in ${state.batches} batch(es)`,
        deleted: state.deleted,
        percent: 100
      });
      setTimeout(hideModal, 3500);
    }
  }

  // ---------- reporting ----------

  function emit(payload) {
    try {
      const p = chrome.runtime.sendMessage({ type: 'bdgp:event', ...payload });
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (e) {
      // Extension context was reloaded; nothing to report to.
    }
  }

  function log(message) {
    const line = `[${new Date().toLocaleTimeString()}] ${message}`;
    console.log('[bdgp]', message);
    emit({ log: line });
  }

  function setStatus(text) {
    emit({ status: text });
  }

  function updateModal({ phase, deleted, batch, percent }) {
    emit({ progress: { phase, deleted, batch, percent } });
  }

  function showModal() {
    emit({ modal: true });
  }

  function hideModal() {
    emit({ modal: false });
  }

  // ---------- diagnostics ----------

  function diagnose() {
    const tiles = findTileCheckboxes();
    const control = findSelectAllControl();
    const deleteBtn = findDeleteButton();
    const buttons = [...document.querySelectorAll('button, [role="button"]')].filter(visible).slice(0, 30);
    const container = tiles.length ? scrollContainer(tiles[0]) : null;

    return [
      `Tiles in DOM: ${tiles.length}`,
      `Checked: ${tiles.filter((t) => t.getAttribute('aria-checked') === 'true').length}`,
      `Tile label sample: ${dedupe(tiles.slice(0, 4).map((t) => label(t).slice(0, 30))).join(' | ') || '(none)'}`,
      `Select-all control: ${control ? label(control).slice(0, 50) : 'not found'}`,
      `Delete control: ${deleteBtn ? label(deleteBtn).slice(0, 40) : 'not found'}`,
      `Visible buttons: ${dedupe(buttons.map((b) => label(b).slice(0, 28) || '(unlabelled)')).slice(0, 18).join(' | ')}`,
      `Scroll container: ${container ? `${container.tagName} h=${container.clientHeight} sh=${container.scrollHeight}` : 'none'}`,
      `Selected count: ${selectionCount()}`
    ];
  }

  // ---------- commands from the side panel ----------

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || typeof msg.type !== 'string') return;

    switch (msg.type) {
      case 'bdgp:ping':
        sendResponse({
          ok: true,
          running: state.running,
          onTrash: window.location.pathname.startsWith('/trash')
        });
        break;

      case 'bdgp:start':
        if (state.running) {
          sendResponse({ ok: false, error: 'A run is already in progress.' });
          break;
        }
        if (window.location.pathname.startsWith('/trash')) {
          sendResponse({ ok: false, error: 'Refusing to run on the Bin page — deletions there are permanent.' });
          break;
        }
        run(msg.options).catch((err) => log(`Error: ${err.message}`));
        sendResponse({ ok: true });
        break;

      case 'bdgp:stop':
        state.stop = true;
        updateModal({ phase: 'Stopping…' });
        log('Stop requested.');
        sendResponse({ ok: true });
        break;

      case 'bdgp:diagnose':
        sendResponse({ ok: true, report: diagnose() });
        break;

      default:
        return;
    }

    return true;
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => emit({ ready: true }), { once: true });
  } else {
    emit({ ready: true });
  }
})();
