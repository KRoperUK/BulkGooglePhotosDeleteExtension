'use strict';

// Track the tab the toolbar button was last used on, so the side panel can
// target it even if tabs.query disagrees about the active tab.
let lastTabId = null;

// The panel is opened explicitly from onClicked rather than via
// setPanelBehavior({ openPanelOnActionClick: true }). That flag makes Chrome
// open the panel as a browser behaviour, which does not count as the user
// invoking the extension, so activeTab is never granted and injection fails.
function clearPanelBehavior() {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch(() => {});
}

chrome.runtime.onInstalled.addListener(clearPanelBehavior);
chrome.runtime.onStartup.addListener(clearPanelBehavior);
clearPanelBehavior();

chrome.action.onClicked.addListener((tab) => {
  if (!tab || tab.id === undefined) return;

  lastTabId = tab.id;

  // open() must be called from a user gesture; onClicked provides one.
  chrome.sidePanel.open({ tabId: tab.id }).catch((err) => {
    console.warn('[bulk-delete-google-photos] sidePanel.open failed', err);
  });

  chrome.scripting
    .executeScript({ target: { tabId: tab.id }, files: ['content.js'] })
    .catch(() => {
      // Not a scriptable page — the panel will show a hint.
    });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'bdgp:tab') {
    sendResponse({ tabId: lastTabId });
  }
});
