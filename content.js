(() => {
  'use strict';

  if (window.__bdgpLoaded) return;
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

  function log(message) {
    const line = `[${new Date().toLocaleTimeString()}] ${message}`;
    if (ui.logEl) {
      const div = document.createElement('div');
      div.textContent = line;
      ui.logEl.prepend(div);
      while (ui.logEl.childElementCount > 200) ui.logEl.lastElementChild.remove();
    }
    console.log('[bdgp]', message);
  }

  function setStatus(text) {
    if (ui.statusEl) ui.statusEl.textContent = text;
  }

  function showModal() {
    ui.startedAt = Date.now();
    ui.modalCount.textContent = '0';
    ui.modalBatch.textContent = 'Batch 0';
    ui.modalElapsed.textContent = '0s';
    ui.modalBar.classList.add('indeterminate');
    ui.modalBar.style.width = '';
    ui.overlay.classList.add('show');
    if (ui.timer) clearInterval(ui.timer);
    ui.timer = setInterval(() => {
      const s = Math.round((Date.now() - ui.startedAt) / 1000);
      ui.modalElapsed.textContent = s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
    }, 500);
  }

  function hideModal() {
    ui.overlay.classList.remove('show');
    if (ui.timer) {
      clearInterval(ui.timer);
      ui.timer = null;
    }
  }

  function updateModal({ phase, deleted, batch, percent }) {
    if (!ui.overlay) return;
    if (phase !== undefined) ui.modalPhase.textContent = phase;
    if (deleted !== undefined) ui.modalCount.textContent = Number(deleted).toLocaleString();
    if (batch !== undefined) ui.modalBatch.textContent = `Batch ${batch}`;
    if (percent === null) {
      ui.modalBar.classList.add('indeterminate');
      ui.modalBar.style.width = '';
    } else if (percent !== undefined) {
      ui.modalBar.classList.remove('indeterminate');
      ui.modalBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    }
  }

  function readOptions() {
    return {
      batchSize: Math.max(0, parseInt(ui.batchSize.value, 10) || 0),
      maxTotal: Math.max(0, parseInt(ui.maxTotal.value, 10) || 0),
      delay: Math.max(1, parseInt(ui.delay.value, 10) || 5),
      dryRun: ui.dryRun.checked
    };
  }

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

  async function selectBatch(batchSize, delay) {
    if (batchSize === 0) return selectAllInView();

    let selected = 0;
    let container = null;
    let idleRounds = 0;

    while (!state.stop && selected < batchSize) {
      const tiles = findTileCheckboxes();
      if (!container && tiles.length) container = scrollContainer(tiles[0]);

      const unselected = tiles.filter((el) => el.getAttribute('aria-checked') !== 'true');

      if (!unselected.length) {
        idleRounds++;
        if (idleRounds > 2 || !scrollStep(container)) break;
        await sleep(900);
        continue;
      }
      idleRounds = 0;

      let failed = 0;
      let aborted = false;

      for (const tile of unselected) {
        if (state.stop || selected >= batchSize) break;
        if (!tile.isConnected) continue;
        // Re-check at click time: the grid recycles nodes as it loads more.
        if (tile.getAttribute('aria-checked') === 'true') continue;

        const ok = await selectOne(tile);
        if (!ok) {
          failed++;
          if (failed > 20) {
            log('Too many tiles refused selection — stopping this batch.');
            aborted = true;
            break;
          }
        } else {
          selected++;
        }

        if (selected % 5 === 0) {
          setStatus(`Selecting… ${selected}`);
          updateModal({ phase: `Selecting ${selected} / ${batchSize}`, percent: (selected / batchSize) * 100 });
        }
        await sleep(delay);
      }

      if (aborted) break;

      if (selected >= batchSize) break;

      // Keep feeding the virtualized grid so the next window of tiles renders.
      if (!scrollStep(container)) {
        idleRounds++;
        if (idleRounds > 1) break;
      } else {
        await sleep(900);
      }
    }

    log(`Selected ${selected} of ${batchSize} requested`);
    return selectionCount();
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

  async function run() {
    const opts = readOptions();
    state.running = true;
    state.stop = false;
    state.deleted = 0;
    state.batches = 0;

    ui.startBtn.disabled = true;
    ui.stopBtn.disabled = false;
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
        const selected = await selectBatch(batch, opts.delay);

        if (!selected) {
          log('No photos could be selected — library appears empty or selectors failed.');
          break;
        }

        if (opts.dryRun) {
          log(`Dry run: selected ${selected} item(s). Deselecting without deleting.`);
          updateModal({ phase: `Dry run — selected ${selected}, not deleting`, percent: 100 });
          await deselectAll();
          setStatus('Dry run complete');
          break;
        }

        setStatus(`Deleting ${selected}…`);
        updateModal({ phase: `Deleting ${selected}…`, percent: null });
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

        await sleep(2500);

        const after = await waitFor(() => findTileCheckboxes().length || selectionCount() === 0, 10000);
        if (!after) log('Grid did not refresh as expected; continuing anyway.');

        if (document.hidden) log('Tab hidden — pausing 5s so throttling does not stall the run.');
        if (document.hidden) await sleep(5000);
      }
    } catch (err) {
      log(`Error: ${err.message}`);
      updateModal({ phase: `Error: ${err.message}`, percent: null });
    } finally {
      state.running = false;
      ui.startBtn.disabled = false;
      ui.stopBtn.disabled = true;
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

  // ---------- UI ----------

  const ui = {};

  function buildUI() {
    const host = document.createElement('div');
    host.id = 'bdgp-host';
    host.style.cssText = 'position:fixed;z-index:2147483647;right:16px;bottom:16px;';
    const root = host.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        .panel {
          font: 13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          width: 300px; background: #1f2023; color: #e8eaed; border-radius: 12px;
          box-shadow: 0 8px 28px rgba(0,0,0,.45); border: 1px solid #3c4043; overflow: hidden;
        }
        .head { display:flex; align-items:center; justify-content:space-between;
                padding:10px 12px; background:#2a2b2f; cursor:default; }
        .head b { font-size:13px; letter-spacing:.2px; }
        .body { padding:12px; display:grid; gap:9px; }
        label.row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
        input[type=number] { width:74px; background:#121316; color:#e8eaed; border:1px solid #3c4043;
                             border-radius:6px; padding:4px 6px; font:inherit; }
        .hint { color:#9aa0a6; font-size:11px; }
        .buttons { display:flex; gap:8px; margin-top:2px; }
        button { flex:1; border:0; border-radius:7px; padding:8px 10px; font:inherit; font-weight:600;
                 cursor:pointer; }
        #start { background:#8ab4f8; color:#202124; }
        #start:disabled { background:#3c4043; color:#80868b; cursor:not-allowed; }
        #stop { background:#5f6368; color:#e8eaed; }
        #stop:disabled { opacity:.45; cursor:not-allowed; }
        #status { color:#8ab4f8; font-size:12px; min-height:16px; }
        .log { max-height:130px; overflow:auto; background:#121316; border-radius:6px; padding:6px 8px;
               font:11px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; color:#bdc1c6; }
        .log div { white-space:pre-wrap; word-break:break-word; }
        .warn { color:#f28b82; font-size:11px; }

        .overlay { position:fixed; inset:0; display:none; align-items:center; justify-content:center;
                   background:rgba(0,0,0,.55); backdrop-filter:blur(2px); }
        .overlay.show { display:flex; }
        .card { font:13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                width:380px; background:#1f2023; color:#e8eaed; border:1px solid #3c4043;
                border-radius:14px; padding:20px; box-shadow:0 16px 48px rgba(0,0,0,.6); }
        .card h3 { margin:0 0 2px; font-size:15px; font-weight:600; }
        .phase { color:#9aa0a6; font-size:12px; min-height:16px; margin-bottom:14px; }
        .big { font-size:34px; font-weight:700; color:#8ab4f8; line-height:1.1; }
        .big small { font-size:13px; font-weight:500; color:#9aa0a6; margin-left:6px; }
        .bar-wrap { height:8px; background:#2a2b2f; border-radius:999px; overflow:hidden; margin:14px 0 8px; }
        .bar { height:100%; width:0; background:#8ab4f8; border-radius:999px; transition:width .2s linear; }
        .bar.indeterminate { width:35%; animation:slide 1.1s ease-in-out infinite; }
        @keyframes slide { 0% { transform:translateX(-110%); } 100% { transform:translateX(310%); } }
        .meta { display:flex; justify-content:space-between; color:#9aa0a6; font-size:11px; }
        .card .buttons { margin-top:16px; }
        #modalStop { background:#5f6368; color:#e8eaed; }
      </style>
      <div class="panel">
        <div class="head"><b>Bulk Delete Google Photos</b></div>
        <div class="body">
          <label class="row">Batch size <input type="number" id="batchSize" value="50" min="0" step="10"></label>
          <span class="hint">0 = select everything in view, else this many per pass</span>
          <label class="row">Max this run <input type="number" id="maxTotal" value="0" min="0" step="100"></label>
          <span class="hint">0 = unlimited</span>
          <label class="row">Delay (ms) <input type="number" id="delay" value="5" min="1" step="5"></label>
          <label class="row"><span>Dry run (select only)</span><input type="checkbox" id="dryRun" checked></label>
          <label class="row"><span>Confirm before deleting</span><input type="checkbox" id="confirm" checked></label>
          <div class="buttons">
            <button id="start">Start</button>
            <button id="stop" disabled>Stop</button>
          </div>
          <div class="buttons">
            <button id="diagnose" style="background:#3c4043;color:#e8eaed">Diagnose</button>
          </div>
          <div id="status">Idle</div>
          <div class="log"></div>
          <div class="warn">Deletes go to Bin, not permanently. Empty the Bin to free storage.</div>
        </div>
      </div>

      <div class="overlay" id="overlay">
        <div class="card">
          <h3>Deleting Google Photos</h3>
          <div class="phase" id="modalPhase">Starting…</div>
          <div class="big"><span id="modalCount">0</span><small id="modalUnit">deleted</small></div>
          <div class="bar-wrap"><div class="bar indeterminate" id="modalBar"></div></div>
          <div class="meta">
            <span id="modalBatch">Batch 0</span>
            <span id="modalElapsed">0s</span>
          </div>
          <div class="buttons">
            <button id="modalStop">Stop</button>
          </div>
        </div>
      </div>
    `;

    ui.batchSize = root.querySelector('#batchSize');
    ui.maxTotal = root.querySelector('#maxTotal');
    ui.delay = root.querySelector('#delay');
    ui.dryRun = root.querySelector('#dryRun');
    ui.confirm = root.querySelector('#confirm');
    ui.startBtn = root.querySelector('#start');
    ui.stopBtn = root.querySelector('#stop');
    ui.statusEl = root.querySelector('#status');
    ui.logEl = root.querySelector('.log');
    ui.overlay = root.querySelector('#overlay');
    ui.modalPhase = root.querySelector('#modalPhase');
    ui.modalCount = root.querySelector('#modalCount');
    ui.modalBar = root.querySelector('#modalBar');
    ui.modalBatch = root.querySelector('#modalBatch');
    ui.modalElapsed = root.querySelector('#modalElapsed');
    ui.modalStop = root.querySelector('#modalStop');

    ui.startBtn.addEventListener('click', () => {
      if (window.location.pathname.startsWith('/trash')) {
        alert('Refusing to run on the Bin page — deletions there are permanent.');
        return;
      }
      if (!ui.dryRun.checked && ui.confirm.checked) {
        const typed = prompt('This deletes photos from your library. Type DELETE to confirm:');
        if (typed !== 'DELETE') {
          log('Confirmation not given. Aborted.');
          return;
        }
      }
      if (!ui.dryRun.checked && !ui.confirm.checked) {
        log('Confirmation disabled — starting immediately.');
      }
      run();
    });

    const requestStop = () => {
      state.stop = true;
      setStatus('Stopping…');
      updateModal({ phase: 'Stopping…' });
      log('Stop requested.');
    };

    ui.stopBtn.addEventListener('click', requestStop);
    ui.modalStop.addEventListener('click', requestStop);

    ui.diagnoseBtn = root.querySelector('#diagnose');
    ui.diagnoseBtn.addEventListener('click', () => {
      const tiles = findTileCheckboxes();
      const control = findSelectAllControl();
      const buttons = [...document.querySelectorAll('button, [role="button"]')].filter(visible).slice(0, 30);
      log(`Tiles in DOM: ${tiles.length}`);
      log(`Checked: ${tiles.filter((t) => t.getAttribute('aria-checked') === 'true').length}`);
      log(`Tile label sample: ${dedupe(tiles.slice(0, 4).map((t) => label(t).slice(0, 30))).join(' | ') || '(none)'}`);
      log(`Select-all control: ${control ? label(control).slice(0, 50) : 'not found'}`);
      log(`Visible buttons: ${dedupe(buttons.map((b) => label(b).slice(0, 28) || '(unlabelled)')).slice(0, 18).join(' | ')}`);
      log(`Scroll container: ${(() => {
        const c = tiles.length ? scrollContainer(tiles[0]) : null;
        return c ? `${c.tagName}.${(c.className || '').toString().slice(0, 40)} h=${c.clientHeight} sh=${c.scrollHeight}` : 'none';
      })()}`);
      log(`Selected count: ${selectionCount()}`);
    });

    document.documentElement.appendChild(host);
    ui.host = host;
  }

  function init() {
    if (!document.body) {
      setTimeout(init, 300);
      return;
    }
    buildUI();

    if (window.location.pathname.startsWith('/trash')) {
      log('You are on the Bin. Switch to Photos to delete normally.');
    }
    log('Ready. Start with Dry run enabled to verify selection works.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
