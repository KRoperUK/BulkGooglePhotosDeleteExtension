# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. Keep
changes small, verified, and in the house style.

## What this is

A local Chrome extension (Manifest V3) that selects and deletes the user's own
Google Photos in batches by automating the web UI. There is no build step: the
extension ships as unbundled files loaded directly by Chrome.

- `manifest.json` — MV3 manifest. Version is bumped automatically by Release Please; **never edit it by hand**.
- `content.js` — all selection/deletion logic, injected on demand into the Photos tab.
- `background.js` — service worker: opens the side panel and injects `content.js`.
- `sidepanel.html` / `sidepanel.js` — the control panel UI.
- `icons/` — toolbar and store icons.
- `docs/` — privacy policy, store listing copy, CWS setup.
- `test/` — jsdom tests for the selection logic (run with `npm test`).
- `package.json` exists **only** for the test harness. The extension itself has no npm dependencies and is not bundled.

## Conventional Commits — required

Every commit message **must** follow [Conventional Commits](https://www.conventionalcommits.org/).
Release Please parses the history to decide version bumps and generate the
changelog, so non-conforming messages break releases.

Format:

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

Types used in this repo:

| Type | When | Release effect |
|---|---|---|
| `feat` | A new user-facing capability | minor bump |
| `fix` | A bug fix | patch bump |
| `docs` | Documentation only | no bump |
| `ci` | CI/workflow changes | no bump |
| `chore` | Tooling, deps, housekeeping | no bump |
| `refactor` | Code change that neither fixes a bug nor adds a feature | no bump |
| `test` | Adding or correcting tests | no bump |
| `perf` | A performance improvement | patch bump |

Rules:
- Description is imperative mood, lower case, no trailing full stop: `fix: clear carried selection`, not `Fixed the selection.`
- A breaking change is marked with `!` after the type/scope (`feat!:`) **and** a `BREAKING CHANGE:` footer.
- Reference the issue a commit closes in the footer: `Closes #29`. Use `Closes`, not `Refs`, so GitHub auto-closes it on merge.
- One logical change per commit. When a PR addresses several issues, use a separate commit per issue.

## Verifying a change

There is no compiler, so run these before opening a PR — they mirror CI
(`.github/workflows/ci.yml`):

```sh
node --check content.js          # syntax-check each script you touched
node --check background.js
node --check sidepanel.js
npm ci && npm test               # jsdom tests for the selection logic
```

When you change selection, batching, or counting logic in `content.js`, add or
update a test in `test/` — that logic has shipped regressions before (batch
overshoot), and the tests are the guard.

## House style

- Match the surrounding code: 2-space indent, single quotes, `const`/`let`, no semicolon-free lines, early returns over deep nesting.
- No new runtime dependencies. The extension must stay dependency-free, make no network requests, and keep `permissions` minimal (`activeTab`, `scripting`, `sidePanel` — no host permissions).
- Comments explain *why*, not *what*, and only where the logic is non-obvious (e.g. Google's DOM quirks).
- Selector matching is layered with fallbacks and localized across ~20 languages; when adding a selector, add it to the existing word lists rather than hard-coding English.

## Pull requests

- Branch off fresh `origin/main`; never commit to `main` directly.
- Fill in the PR template (`.github/pull_request_template.md`).
- Keep the diff scoped to the issue. Do not reformat untouched code.
- Do not merge your own PR unless asked — the maintainer merges.

## Safety

- The extension refuses to run on `/trash` (the Bin) because deletion there is permanent. Never weaken that guard.
- Deletions are destructive. Any change to the selection or delete path must keep the batch size a hard ceiling on what is deleted, and must leave no stray selection behind on exit.
