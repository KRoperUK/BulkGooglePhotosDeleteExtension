<!--
Thanks for the PR! Keep the change scoped to one issue, and use Conventional
Commits (see AGENTS.md). Delete any section that does not apply.
-->

## Summary

<!-- What does this change and why? One or two sentences. -->

Closes #

## Type of change

<!-- Tick all that apply. This should match your commit type(s). -->

- [ ] `fix` — bug fix
- [ ] `feat` — new feature
- [ ] `docs` — documentation only
- [ ] `ci` / `chore` — tooling, workflows, housekeeping
- [ ] `refactor` / `perf` / `test`
- [ ] Breaking change (commit marked `!` with a `BREAKING CHANGE:` footer)

## How it was tested

<!-- Describe how you verified this. For selection/delete changes, state the
batch size used and how many items were actually selected/deleted. -->

- [ ] `node --check` on each script I touched
- [ ] `npm test` passes
- [ ] Loaded unpacked and exercised the change on `photos.google.com`

## Checklist

- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] I did not edit `manifest.json`'s version or `CHANGELOG.md` by hand (Release Please owns these)
- [ ] I added/updated a test in `test/` if I changed selection, batching, or counting logic
- [ ] No new runtime dependencies; no new permissions; no network requests
- [ ] The `/trash` (Bin) guard is intact and the change leaves no stray selection behind
