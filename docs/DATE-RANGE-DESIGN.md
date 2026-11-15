# Date-range targeting — design note (issue #48)

Intent: let a run delete "everything before YYYY-MM-DD" or "between A and
B" instead of selecting purely positionally within the scrolled view.
This is a design note only — no code changes. Nothing here is approved
to build until the open questions at the bottom are signed off, because
date bounding changes what "a batch" means and touches the
deletion-ceiling invariant.

## Where dates live in the Photos DOM

- Tile `aria-label`s carry a date/time in the page locale
  (e.g. "Photo — 12 March 2021"), alongside the existing `label()` text.
- Sticky section headers and the scrollbar date tooltip expose coarser
  month/year dividers while scrolling.

Both sources are locale-dependent and neither is a stable selector, so
all date reads must go through parsed text, never DOM structure.

## Anchoring strategy (proposed)

1. The user sets a cut-off ("older than") or a range in the side panel.
2. The run scrolls the grid in one direction until the first tile whose
   parsed date falls inside the range, then selects forward from there —
   the same scroll-until-visible loop `selectBatch` already uses, with a
   date predicate added to the stop condition.
3. Scrolling must approach the boundary from inside the range (oldest
   first), never overshoot past it: stop at the first out-of-range tile
   and treat it as the window edge, the way an empty pass ends a batch
   today.

## Locale date parsing

- Reuse the word-list pattern already used for `DELETE_WORDS` /
  `SELECT_ALL_WORDS`: per-locale month names and date orders, with a
  strict parser that returns "unknown" rather than guessing.
- Tiles whose date cannot be parsed are never selected by a date-bounded
  run. Fail-closed is the only safe default: an unparsed tile counts
  against neither the batch nor the deletion.

## Edge behaviour

- Inclusive start, exclusive end (`start <= date < end`); the panel
  states this explicitly so partial sections are unambiguous.
- A range covering a partial month section selects only the in-range
  tiles; out-of-range tiles in the same rendered window are skipped,
  exactly like excluded favourites (#49).
- Dry run visualises the bounded batch ("Dry run: N selected in range")
  before anything real runs.

## Composition with the batch-size ceiling

The date filter is a second, independent ceiling: a batch selects at
most `min(batchSize, inRangeTiles)`. Exclusions and range bounds only
ever narrow selection, never widen it, and `trimSelectionTo` stays the
final clamp before Delete. The `/trash` guard and the no-stray-selection
invariant are unchanged.

## Open questions (need sign-off before build)

1. Can tile dates be read reliably across all ~20 supported locales, or
   do we ship with an explicit supported-locale subset and fail closed
   elsewhere?
2. Does the virtualised grid anchor to a date without over-scrolling past
   the boundary under load (needs the live-DOM check in
   `docs/VERIFY-BATCH-SELECTION.md`)?
3. How does dry-run render a range spanning unloaded (not yet scrolled)
   months — estimated count, or scroll-the-whole-range first?
