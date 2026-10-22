# Chrome Web Store listing copy

Item ID: `laeijompklaebgbmhoehbefjmfcaohnf`

Paste-ready values for each field in the Developer Dashboard.

## Product details

**Title** (from package — change in `manifest.json` and re-upload to alter)

```
Bulk Delete Google Photos
```

**Summary** (from package)

```
Select and delete your own Google Photos in batches. Dry run, stop control, no limits, no network requests.
```

**Description**

```
Bulk Delete Google Photos is a small, local tool for clearing out a Google Photos library in bulk, because Google's own interface makes selecting tens of thousands of photos impractical.

Google Photos has no "delete everything" button. This extension adds a panel to photos.google.com that automates the exact clicks you would otherwise make by hand: select a batch, press Delete, confirm, wait for the grid to refresh, and repeat.

FEATURES

• Dry run mode - selects and counts without deleting, so you can verify it works before committing
• Select everything in view, or a fixed batch size (it scrolls the grid to keep loading more)
• Live progress panel showing deleted count, batch number and elapsed time
• Stop button that halts immediately
• Optional hard cap on how many items a single run may delete
• Typed confirmation required before deleting, on by default
• Roughly 20 interface languages supported
• Works with the Archive view

PRIVACY

• No network requests. The extension never contacts any server, including ours - there isn't one.
• No analytics, no telemetry, no local storage, no accounts.
• No permissions requested in the manifest. It runs only on photos.google.com.
• Nothing is collected, sold or transmitted.

SAFETY

• Deletions go to the Bin, not oblivion - recoverable for 30 days
• The extension refuses to run on the Bin page, because deleting there is permanent
• It only ever acts on the account already signed in to the tab you are using

NOTE

This is an unofficial tool. It is not affiliated with, endorsed by, or sponsored by Google. "Google Photos" is a trademark of Google LLC, used only to describe what the extension works with.
```

**Category:** `Productivity` (choose `Tools` as the subcategory if the dashboard offers one)

**Language:** `English (United Kingdom)`

## Graphic assets

| Field | File | Spec |
|---|---|---|
| Store icon | `icons/icon128.png` | 128×128 PNG, transparent padding |
| Screenshot | `store/screenshot-1.png` | 1280×800, 24-bit PNG, no alpha |
| Small promo tile | `store/promo-440x280.jpg` | 440×280 JPEG, no alpha |
| Marquee promo tile | `store/marquee-1400x560.jpg` | 1400×560 JPEG, no alpha |

## Additional fields

**Official URL:** none

**Homepage URL**

```
https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension
```

**Support URL**

```
https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/issues
```

**Mature content:** No

**Item support:** On

## Privacy tab

**Single purpose**

```
Bulk-select and delete photos and videos from the signed-in user's own Google Photos library.
```

**Justification for host access (`https://photos.google.com/*`)**

```
The extension has exactly one function: automating the Google Photos web interface. Its content script must run on photos.google.com to render its control panel and perform the selection and deletion the user initiates. It requests no other host and no API permissions.
```

**Are you using remote code?** No — all logic ships inside the package. Nothing is fetched or evaluated at runtime.

**Data usage:** the extension collects nothing. Select every "does not collect" option; do not declare any data types. No sale, transfer or use of user data for unrelated purposes.

## Test instructions

Reviewers must be able to exercise this without destroying a real photo library. Use this text:

```
This extension automates the Google Photos web UI. Please test with Dry run enabled so nothing is deleted.

1. Install the extension.
2. Open https://photos.google.com and sign in.
3. A dark control panel appears in the bottom-right corner of the page.
4. Leave "Dry run (select only)" ticked. It is ticked by default.
5. Click Start.
6. Watch the panel: it selects photos, reports how many it selected, then deselects them. Nothing is deleted in this mode.
7. Click Diagnose to print the selector discovery details into the panel's log.

Optional read-only verification: the manifest requests no permissions and the source contains no network calls (fetch, XMLHttpRequest, WebSocket, sendBeacon). Search content.js to confirm.

Warning: unticking Dry run and typing DELETE starts real deletions. Those go to the Bin and are recoverable for 30 days, but reviewers should not run this against a personal library.
```

## After the first upload

The item ID is recorded above. The **publisher ID** appears in the dashboard URL:

```
https://chrome.google.com/webstore/devconsole/<publisher-id>/laeijompklaebgbmhoehbefjmfcaohnf/edit
```

Or under **Settings**. Add both to the repository secrets — see [CWS-SETUP.md](CWS-SETUP.md).
