'use strict';

const el = (id) => document.getElementById(id);

const ui = {
  dot: el('dot'),
  conn: el('conn'),
  phase: el('phase'),
  count: el('count'),
  bar: el('bar'),
  batch: el('batch'),
  elapsed: el('elapsed'),
  batchSize: el('batchSize'),
  maxTotal: el('maxTotal'),
  delay: el('delay'),
  dryRun: el('dryRun'),
  confirm: el('confirm'),
  start: el('start'),
  stop: el('stop'),
  diagnose: el('diagnose'),
  confirmStrip: el('confirmStrip'),
  confirmText: el('confirmText'),
  confirmGo: el('confirmGo'),
  confirmCancel: el('confirmCancel'),
  log: el('log')
};

let tabId = null;
let running = false;
let startedAt = 0;
let timer = null;

function addLog(line) {
  const div = document.createElement('div');
  div.textContent = line;
  ui.log.prepend(div);
  while (ui.log.childElementCount > 300) ui.log.lastElementChild.remove();
}

function setConnection(text, state) {
  ui.conn.textContent = text;
  ui.dot.className = 'dot' + (state === 'ok' ? ' on' : state === 'warn' ? ' warn' : '');
}

function setRunning(value) {
  running = value;
  ui.start.disabled = value;
  ui.stop.disabled = !value;
  if (value) {
    startedAt = Date.now();
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      const s = Math.round((Date.now() - startedAt) / 1000);
      ui.elapsed.textContent = s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
    }, 500);
  } else if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function renderProgress(p) {
  if (p.phase !== undefined && p.phase !== null) ui.phase.textContent = p.phase;
  if (p.deleted !== undefined && p.deleted !== null) ui.count.textContent = Number(p.deleted).toLocaleString();
  if (p.batch !== undefined && p.batch !== null) ui.batch.textContent = `Batch ${p.batch}`;
  if (p.paused === true) {
    setConnection('Paused — bring the Photos tab to the foreground', 'warn');
  } else if (p.paused === false && running) {
    setConnection('Connected to Google Photos', 'ok');
  }
  if (p.percent === null || p.percent === undefined) {
    ui.bar.classList.add('indet');
    ui.bar.style.width = '';
  } else {
    ui.bar.classList.remove('indet');
    ui.bar.style.width = `${Math.max(0, Math.min(100, p.percent))}%`;
  }
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function ping(id) {
  try {
    const res = await chrome.tabs.sendMessage(id, { type: 'bdgp:ping' });
    return res && res.ok ? res : null;
  } catch (e) {
    return null;
  }
}

const looksLikePhotos = (url) =>
  typeof url === 'string' && /^https:\/\/photos\.google\.com\//.test(url);

function markConnected(res) {
  setConnection(res.onTrash ? 'Connected — this is the Bin page' : 'Connected to Google Photos', 'ok');
  if (res.running) setRunning(true);
}

// The queried active tab and the tab the toolbar button was used on can differ,
// so try both rather than trusting one.
async function candidates() {
  const list = [];
  const tab = await activeTab();
  if (tab && tab.id !== undefined) list.push({ id: tab.id, url: tab.url });

  try {
    const r = await chrome.runtime.sendMessage({ type: 'bdgp:tab' });
    if (r && r.tabId !== undefined && !list.some((c) => c.id === r.tabId)) {
      list.push({ id: r.tabId, url: undefined });
    }
  } catch (e) {
    // background may be asleep; the queried tab is enough
  }

  return list;
}

async function connect() {
  const list = await candidates();
  if (!list.length) {
    tabId = null;
    setConnection('No active tab', 'warn');
    return;
  }

  for (const c of list) {
    const res = await ping(c.id);
    if (res) {
      tabId = c.id;
      markConnected(res);
      return;
    }
  }

  for (const c of list) {
    if (c.url && !looksLikePhotos(c.url)) continue;
    try {
      await chrome.scripting.executeScript({ target: { tabId: c.id }, files: ['content.js'] });
    } catch (e) {
      continue;
    }
    const res = await ping(c.id);
    if (res) {
      tabId = c.id;
      markConnected(res);
      return;
    }
  }

  setConnection('Click the extension icon on the Photos tab', 'warn');
}

function options() {
  return {
    batchSize: Math.max(0, parseInt(ui.batchSize.value, 10) || 0),
    maxTotal: Math.max(0, parseInt(ui.maxTotal.value, 10) || 0),
    delay: Math.max(1, parseInt(ui.delay.value, 10) || 5),
    dryRun: ui.dryRun.checked
  };
}

async function start() {
  if (!tabId) await connect();

  if (!tabId || !(await ping(tabId))) {
    addLog('Not connected — click the extension icon on the Photos tab, then try again.');
    setConnection('Click the extension icon on the Photos tab', 'warn');
    return;
  }

  const opts = options();
  try {
    const res = await chrome.tabs.sendMessage(tabId, { type: 'bdgp:start', options: opts });
    if (!res || !res.ok) {
      addLog(`Could not start: ${(res && res.error) || 'no response'}`);
      return;
    }
    setRunning(true);
  } catch (e) {
    addLog(`Could not start: ${e.message}`);
    setConnection('Disconnected — reload the Photos tab', 'warn');
  }
}

async function stop() {
  if (!tabId) return;
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'bdgp:stop' });
  } catch (e) {
    addLog(`Could not stop: ${e.message}`);
  }
}

async function diagnose() {
  if (!tabId) {
    addLog('No Google Photos tab connected.');
    return;
  }
  try {
    const res = await chrome.tabs.sendMessage(tabId, { type: 'bdgp:diagnose' });
    if (res && res.ok) res.report.forEach(addLog);
    else addLog('Diagnose failed.');
  } catch (e) {
    addLog(`Diagnose failed: ${e.message}`);
  }
}

ui.start.addEventListener('click', () => {
  if (!ui.dryRun.checked && ui.confirm.checked) {
    ui.confirmStrip.classList.add('show');
    ui.confirmText.value = '';
    ui.confirmText.focus();
    return;
  }
  start();
});

ui.confirmGo.addEventListener('click', () => {
  if (ui.confirmText.value !== 'DELETE') {
    addLog('Confirmation not given. Aborted.');
    return;
  }
  ui.confirmStrip.classList.remove('show');
  start();
});

ui.confirmCancel.addEventListener('click', () => {
  ui.confirmStrip.classList.remove('show');
  ui.confirmText.value = '';
});

ui.confirmText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') ui.confirmGo.click();
});

ui.stop.addEventListener('click', stop);
ui.diagnose.addEventListener('click', diagnose);

chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.type !== 'bdgp:event') return;
  if (msg.log) addLog(msg.log);
  if (msg.progress) renderProgress(msg.progress);
  if (msg.modal === true) setRunning(true);
  if (msg.modal === false) setRunning(false);
});

connect();

// Re-check the active tab, but only re-inject when the ping fails, so the
// content script is not re-injected every few seconds.
setInterval(async () => {
  const tab = await activeTab();
  if (tabId && tab && tab.id === tabId && (await ping(tabId))) return;
  connect();
}, 5000);
