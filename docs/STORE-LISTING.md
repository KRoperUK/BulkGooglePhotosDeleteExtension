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

Google Photos has no "delete everything" button. This extension adds a side panel to photos.google.com that automates the exact clicks you would otherwise make by hand: select a batch, press Delete, confirm, wait for the grid to refresh, and repeat.

FEATURES

• Dry run mode - selects and counts without deleting, so you can verify it works before committing
• Select everything in view, or a fixed batch size (it scrolls the grid to keep loading more)
• Live progress showing deleted count, batch number and elapsed time
• Stop button that halts immediately
• Optional hard cap on how many items a single run may delete
• Typed confirmation required before deleting, on by default
• Roughly 20 interface languages supported
• Works with the Archive view

PRIVACY

• No network requests. The extension never contacts any server, including ours - there isn't one.
• No analytics, no telemetry, no local storage, no accounts.
• No host permissions. It can only run on photos.google.com, and only after you click the toolbar button.
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

**Privacy policy URL**

```
https://www.kroper.uk/BulkGooglePhotosDeleteExtension/privacy.html
```

If the dashboard rejects it, the `github.io` equivalent also resolves (it 301-redirects to the custom domain):

```
https://kroperuk.github.io/BulkGooglePhotosDeleteExtension/privacy.html
```

**Single purpose**

```
Bulk-select and delete photos and videos from the signed-in user's own Google Photos library.
```

**Permission justifications** — the dashboard asks for one per permission.

`activeTab`:

```
The extension's only function is to automate the user's own Google Photos library. activeTab grants access to the current tab only at the moment the user clicks the extension's toolbar button - Chrome grants it as a direct result of that user action. It is used so the extension can read the photo grid it is about to operate on and perform the selection and deletion the user explicitly requested. No access is retained: the grant ends when the user navigates away, and no host permissions are requested, so the extension cannot reach any site the user has not invoked it on. Nothing is read from any other tab, and no data leaves the page.
```

`scripting`:

```
Needed to inject the extension's own bundled content.js into the tab the user has just activated. Google Photos offers no public API for bulk deletion, so the only way to fulfil the single purpose is to drive the web interface the user is already looking at. The injected script ships inside the installed package - nothing is downloaded or evaluated at runtime. It is injected only after the user clicks the toolbar button, and it returns immediately unless the hostname is exactly photos.google.com, so it cannot run on any other site.
```

`sidePanel`:

```
Used to display the extension's own control panel - batch size, dry-run toggle, start/stop and progress - in Chrome's side panel. The panel is an extension page shipped in the package. Keeping the controls in the side panel means they do not cover the photo grid the user is working in, and progress stays visible while a run continues. It opens only when the user clicks the toolbar button. No page content is rendered in the panel, and nothing is stored or transmitted.
```

**Are you using remote code?** No — all logic ships inside the package. Nothing is fetched or evaluated at runtime.

**Data usage:** the extension collects nothing. Select every "does not collect" option; do not declare any data types. No sale, transfer or use of user data for unrelated purposes.

## Test instructions

Reviewers must be able to exercise this without destroying a real photo library. This field is capped at 500 characters; the text below is 425.

```
Automates the Google Photos web UI. Test without deleting:
1. Install, pin the extension, open photos.google.com signed in.
2. Click the toolbar icon. The side panel opens on the right.
3. Leave "Dry run (select only)" ticked.
4. Click Start: it selects photos, reports the count, then deselects. Nothing is deleted.
5. Click Diagnose for selector details.
Unticking Dry run + typing DELETE deletes to Bin. No network calls.
```

## After the first upload

The item ID is recorded above. The **publisher ID** appears in the dashboard URL:

```
https://chrome.google.com/webstore/devconsole/<publisher-id>/laeijompklaebgbmhoehbefjmfcaohnf/edit
```

Or under **Settings**. Add both to the repository secrets — see [CWS-SETUP.md](CWS-SETUP.md).
