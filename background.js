chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (err) {
    // Chrome refuses to script some pages (chrome://, the Web Store, PDFs).
    // Say so on the badge rather than failing silently.
    await chrome.action.setBadgeBackgroundColor({ color: "#ef5350" });
    await chrome.action.setBadgeText({ text: "!", tabId: tab.id });
    setTimeout(() => chrome.action.setBadgeText({ text: "", tabId: tab.id }), 3000);
    console.warn("[bulk-delete-google-photos]", err);
  }
});
