'use strict';

// Clicking the toolbar button opens the side panel rather than injecting a
// floating panel into the page.
function configurePanel() {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err) => console.warn('[bulk-delete-google-photos]', err));
}

chrome.runtime.onInstalled.addListener(configurePanel);
chrome.runtime.onStartup.addListener(configurePanel);
configurePanel();
