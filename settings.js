'use strict';

// Persistent side-panel settings, stored locally via chrome.storage.
// Loaded before sidepanel.js; has no DOM or chrome references at load so it
// can be unit-tested outside the extension.
//
// Safety rule (issue #45): dryRun is never persisted and always restores to
// checked, so a saved state can never silently arm a destructive run.

(function () {
  const KEY = 'bdgp:settings:v1';

  const DEFAULTS = {
    batchSize: 50,
    maxTotal: 0,
    delay: 5,
    confirm: true,
    skipFavourites: false,
    archiveOnly: false
  };

  const toInt = (value, fallback) => {
    const n = typeof value === 'number' ? value : parseInt(value, 10);
    return Number.isInteger(n) ? n : fallback;
  };

  // Coerce an unknown stored value back into a safe settings object.
  // Unknown keys (including any persisted dryRun) are dropped.
  const sanitize = (raw) => {
    const source = raw && typeof raw === 'object' ? raw : {};
    const batchSize = toInt(source.batchSize, DEFAULTS.batchSize);
    const maxTotal = toInt(source.maxTotal, DEFAULTS.maxTotal);
    const delay = toInt(source.delay, DEFAULTS.delay);
    return {
      batchSize: Math.max(0, batchSize),
      maxTotal: Math.max(0, maxTotal),
      delay: Math.max(1, delay),
      confirm: typeof source.confirm === 'boolean' ? source.confirm : DEFAULTS.confirm,
      skipFavourites: typeof source.skipFavourites === 'boolean' ? source.skipFavourites : DEFAULTS.skipFavourites,
      archiveOnly: typeof source.archiveOnly === 'boolean' ? source.archiveOnly : DEFAULTS.archiveOnly
    };
  };

  // storage is chrome.storage.local; callers pass it in so tests can stub it.
  const load = async (storage) => {
    try {
      if (!storage || typeof storage.get !== 'function') return { ...DEFAULTS };
      const found = await storage.get(KEY);
      return sanitize(found ? found[KEY] : undefined);
    } catch (e) {
      return { ...DEFAULTS };
    }
  };

  const save = async (storage, partial) => {
    const next = sanitize({ ...(await load(storage)), ...partial });
    try {
      if (storage && typeof storage.set === 'function') await storage.set({ [KEY]: next });
    } catch (e) {
      // Best effort: a failed write must never break the panel.
    }
    return next;
  };

  globalThis.BDGPSettings = { KEY, DEFAULTS, sanitize, load, save };
})();
