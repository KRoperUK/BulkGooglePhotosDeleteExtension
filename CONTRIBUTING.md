# Contributing

Thanks for helping improve Bulk Delete Google Photos.

## Setup

There is no build step. Load the extension unpacked to test it:

1. Open `chrome://extensions`
2. Turn on **Developer mode**
3. **Load unpacked** → select this folder
4. Open `https://photos.google.com` and click the toolbar icon

For the tests you need Node.js 20+:

```sh
npm ci
npm test
```

## Making a change

1. Branch off fresh `main`: `git switch -c fix/short-description origin/main`.
2. Keep the change scoped to one issue. Don't reformat untouched code.
3. Add or update a test in `test/` when you touch selection, batching, or counting logic.
4. Verify locally (mirrors CI):
   ```sh
   node --check content.js
   npm ci && npm test
   ```
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/) — see [AGENTS.md](AGENTS.md#conventional-commits--required) for the types this repo uses and why they matter (Release Please depends on them).
6. Open a PR against `main` and fill in the template.

## Reporting bugs and requesting features

Use the issue templates (New issue → pick **Bug report** or **Feature request**).
For bugs, the batch count and library size matter — the selection logic is the
part most prone to regressions, so include the batch size you set and how many
items were actually selected/deleted.

## Releases

Versioning is automated with Release Please. Merging to `main` with conventional
commits maintains a release PR; merging that PR cuts the tag, GitHub Release, and
Chrome Web Store upload. You never bump `manifest.json` or `CHANGELOG.md` by hand.
