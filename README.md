# Bulk Delete Google Photos

[![CI](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/actions/workflows/ci.yml/badge.svg)](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/actions/workflows/ci.yml)
[![CodeQL](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/actions/workflows/codeql.yml/badge.svg)](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/actions/workflows/codeql.yml)

A local Chrome extension that selects and deletes your own Google Photos in batches. Same job as the paid Chrome Web Store extension, minus the payment gate, the 500/day limit, and the third-party host permission.

- No network requests, no analytics, no storage, no payment provider.
- No host permissions. It declares three warning-free permissions — `activeTab` (acts on the Photos tab only when you click the toolbar icon), `scripting` (injects its own bundled script on demand) and `sidePanel` (opens the control panel beside the page). It cannot read or modify any other site.
- Dry run enabled by default.

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select this folder
4. Open `https://photos.google.com`

Clicking the toolbar icon opens a **side panel**. It sits beside the page rather than over the photo grid, and it drives the tab from there — the actual selection and deletion still run inside the page.

Because the extension uses `activeTab` rather than host permissions, it cannot inject itself automatically: click the toolbar icon once per page load. Pin it via the puzzle-piece menu so it is always visible.

## Use

1. Leave **Dry run** checked and click **Start**. It selects a batch, reports the count, and deselects without deleting.
2. If the count looks right, uncheck **Dry run**, click **Start**, and type `DELETE` to confirm.
3. Keep the tab focused. Chrome throttles timers in background tabs and the run will stall.
4. The side panel shows the live deleted count, current batch, phase and elapsed time.
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

### Release assets

Every release carries:

| Asset | Purpose |
|---|---|
| `bulk-delete-google-photos-<version>.zip` | The exact package submitted to the Chrome Web Store. This is also the file to upload to the Edge Add-ons store: the MV3 package is identical across Chromium browsers, so there is no separate build. |
| `bulk-delete-google-photos-<version>-source.zip` | Tagged source, for reviewers or anyone who wants to read the code before installing. |
| `SHA256SUMS.txt` | Checksums for both archives. |

Assets are attached before the store upload, so a release still carries them when publishing is blocked (for example while a previous version is in review).

No `.crx` is attached. Chrome blocks off-store CRX installs in most configurations, a self-signed CRX produces a different extension ID from the store listing, and Edge cannot use CRX at all — so it would be a confusing artefact rather than a useful one.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and the change workflow, and [AGENTS.md](AGENTS.md) for conventions (Conventional Commits, the no-build verify loop, house style). Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Before opening a PR:

```sh
npm ci
npm run lint
npm test
```

Report bugs and request features with the issue templates. Security issues go through the [security policy](SECURITY.md), not public issues.

## License

Released under the [MIT License](LICENSE).

