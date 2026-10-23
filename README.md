# Bulk Delete Google Photos

A local Chrome extension that selects and deletes your own Google Photos in batches. Same job as the paid Chrome Web Store extension, minus the payment gate, the 500/day limit, and the third-party host permission.

- No network requests, no analytics, no storage, no payment provider.
- `permissions: []` — it only runs as a content script on `photos.google.com`.
- Dry run enabled by default.

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select this folder
4. Open `https://photos.google.com`

A round button appears bottom-right. Click it to open the control panel; the `−` in the panel header collapses it back to the button.

Because the extension uses `activeTab` rather than host permissions, it cannot inject itself automatically. Open Photos, then click the toolbar icon once per page load — clicking it again reopens the panel. Pin it via the puzzle-piece menu so it is always visible.

## Use

1. Leave **Dry run** checked and click **Start**. It selects a batch, reports the count, and deselects without deleting.
2. If the count looks right, uncheck **Dry run**, click **Start**, and type `DELETE` to confirm.
3. Keep the tab focused. Chrome throttles timers in background tabs and the run will stall.
4. A centred progress panel shows the live deleted count, current batch, phase and elapsed time, with its own Stop button. It dismisses itself a few seconds after a run ends.
5. Deletions go to **Bin**, not permanently. To actually free storage, empty the Bin:
   `https://photos.google.com/trash` → **Empty bin**. Photos in the Bin still count against your quota until then.

### Options

| Option | Meaning |
|---|---|
| Batch size | Defaults to `50`. `0` = select everything in view per pass (fastest). A number = click up to that many tiles, scrolling the grid as it goes to keep loading the next window. |
| Max this run | Hard stop after N deletions. `0` = unlimited. |
| Delay | Milliseconds between individual tile clicks when batch size > 0. Defaults to `5`, which is comfortably fast enough for Google's UI. |
| Dry run | Select and report without deleting. |
| Confirm before deleting | On by default: requires typing `DELETE` before a run starts. Turn it off to start immediately. |
| Diagnose | Dumps tiles found, checked count, select-all control, visible button labels and the scroll container to the log. Use this when a run reports `0`. |

## How it works

Google shut down broad access to the Photos Library API in March 2025, so the only remaining route is automating the web UI. The extension:

1. Selects everything via, in order: an explicit "Select all" control → the overflow menu's select-all item → shift-click range → `Ctrl/Cmd+A`.
2. For a fixed batch size, clicks tile checkboxes and scrolls the virtualized grid so each new window of tiles renders.
3. Reads the "N selected" counter to confirm the selection is real.
4. Clicks Delete, then confirms the dialog.
5. Repeats until nothing is left or a limit is hit.

Selectors are layered with fallbacks and matched across ~20 languages, since Google's class names are obfuscated and localized labels differ.

## Limitations

- Google changes its DOM regularly. If the count comes back `0` on a library that clearly has photos, the selectors need updating — the log pane will say which step failed.
- Archived photos are not included unless you delete from the Archive view directly.
- The Bin is deliberately never touched automatically; emptying it is permanent and stays your call.

## Safety

The extension refuses to run on `/trash`, because deleting there is permanent rather than reversible. It only ever acts on the account already signed into the current tab.

## Releasing

Versioning is automated with [Release Please](https://github.com/googleapis/release-please-action). Commits to `main` follow [Conventional Commits](https://www.conventionalcommits.org/); Release Please maintains a release PR that bumps `manifest.json` and `CHANGELOG.md`. Merging it cuts a tag and GitHub Release, which triggers `.github/workflows/publish.yml` to build and publish the zip to the Chrome Web Store.

`ci.yml` validates the manifest version, checks `content.js` syntax and confirms the icon assets exist on every push and PR.

The one-time credential setup and required repository secrets are documented in [docs/CWS-SETUP.md](docs/CWS-SETUP.md).
