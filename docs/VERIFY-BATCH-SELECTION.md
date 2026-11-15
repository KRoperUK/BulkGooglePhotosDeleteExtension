# Verifying batch selection against the live Google Photos DOM

The batch-overshoot fix (issue #29, guarded by `trimSelectionTo` in
`content.js`) is unit-tested in jsdom, but jsdom does not model Google
Photos' live React virtualised grid: real `pointerdown`/`mouseup`
sequencing, hover-anchored range selection, and async `aria-checked`
updates under load. This checklist is the real-DOM guard (issue #50).
Run it before any release that touches the selection, batching, or
delete path, and note the pass in the PR.

## Setup

- Use a disposable Google account with expendable photos. Never verify
  against a library you cannot afford to lose.
- Load the extension unpacked, pin the toolbar button, and open
  `https://photos.google.com`.
- Leave **Dry run** checked for every step below. Nothing here deletes.

## The check

For each batch size in `10`, `50`, `100`:

1. Set **Batch size** to the value, **Max this run** to `0`, **Delay** to `5`.
2. Click **Start** and record the `Dry run: selected N item(s)` count
   from the log. Requirement: `N` equals the requested batch size —
   never more, never a runaway full-view selection.
3. If the log shows `Selection overshot: ... Trimming the surplus`,
   record the trimmed count too. The trim (`trimSelectionTo`) is the
   delete-time clamp: it must bring the count back down to the batch
   size before anything approaches the Delete button.
4. Repeat the same batch size with DevTools CPU throttling at 4x
   (Performance → CPU). `aria-checked` lag is worst under load, and
   that lag is what the overshoot fix exists for.

## Fallback path

5. With batch size `50`, scroll the grid mid-run so new tile windows
   render, forcing the per-tile `selectOne` path rather than the
   select-all control. Requirement: the count still matches.
6. Click **Diagnose** on a library with photos and confirm it reports a
   non-zero tile count and the `N selected` toolbar reading. If it
   reports `0` on a non-empty library, the selectors need updating —
   stop and fix them before releasing.

## Sign-off

Paste the observed counts (batch size → selected, plus any overshoot /
trim lines) into the PR. A release touching `content.js` selection,
batching, or counting logic ships only with this checklist run against
the live DOM, or with an automated real-DOM equivalent that asserts
the same ceiling: selected never exceeds the requested batch size.
