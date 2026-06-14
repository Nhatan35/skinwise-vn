# Release Evidence - Saved Products Decision Queue & Review Filters

## Summary

Status: DONE / PASS

Task: MVP v1.40 - Saved Products Decision Queue & Review Filters

Scope: Post-MVP controlled improvement

Date: 2026-06-14

Environment: Local development validation

## Objective

Improve the Saved Products page with client-side decision-support filters,
search, summary counts, filtered result count, reset behavior, and filtered
empty states based on the private saved-product metadata added in v1.39.

This is an organization and personal decision-support feature only.

## Scope Implemented

- Added a pure `saved-product-filters.ts` helper for client-side filtering,
  active-filter detection, and decision summary counts.
- Added decision-status, planned-routine-slot, note-status, and search controls
  to the Saved Products page.
- Added summary counts based on all loaded saved products.
- Added filtered result count when filters or search are active.
- Added reset filters action that clears local filter state only.
- Added a distinct filtered empty state when loaded saved products do not match
  the current filters.
- Preserved comparison selections independently from visible filtered cards.
- Added a safe warning when selected comparison products are hidden by filters.

## User-Facing Behavior

- Users can filter saved products by personal decision status.
- Users can filter saved products by planned routine slot.
- Users can filter saved products by whether a personal note exists.
- Users can search by product name, brand, or personal note.
- Search is client-side, trimmed, case-insensitive, and Vietnamese-safe through
  `toLocaleLowerCase("vi-VN")`.
- Resetting filters does not remove saved products, clear notes, update
  metadata, call PATCH, or change database data.
- Summary counts remain based on all loaded saved products, not the filtered
  subset.

## Safety Boundaries

- No medical advice was added.
- No diagnosis or treatment claim was added.
- No guaranteed suitability, safety, or effectiveness claim was added.
- No automatic recommendation, ranking, product selection, or routine
  modification was added.
- Product Match scoring/ranking remains unchanged.
- Routine Safety and Routine Coverage logic remain unchanged.

## Explicitly Unchanged

- No API contract changes.
- No data model changes.
- Filtering is client-side only.
- Saved Product PATCH behavior from v1.39 unchanged.
- Saved Product DTO exposure rules unchanged.
- Auth behavior unchanged.
- Environment variables unchanged.
- Package dependencies unchanged.
- Product Match scoring/ranking unchanged.
- Product Match explanation algorithm unchanged.
- Routine Safety logic unchanged.
- Routine Coverage logic unchanged.
- AI provider behavior unchanged.
- Product and ingredient seed data unchanged.
- E2E specs unchanged.

## Files Changed

Implementation:

- `src/modules/saved-products/saved-product-filters.ts`
- `src/modules/saved-products/components/saved-products-page.tsx`

Tests:

- `tests/unit/saved-product-filters.test.ts`
- `tests/unit/saved-products-ui.test.ts`

Documentation:

- `docs/release-evidence-saved-products-decision-filters.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/00-source-of-truth.md`
- `AGENTS.md`

## Tests Added / Updated

- Filtering tests for every decision status, planned routine slot, note status,
  unset state, default `all` state, search target, Vietnamese text, whitespace
  trimming, missing fields, AND-combined filters, reset-to-default behavior, and
  input immutability.
- Summary tests for total, considering, testing, paused, kept, unset, and
  all-loaded-products behavior.
- UI/source tests for labels, placeholder, filter options, reset copy, filtered
  result count, filtered empty state, safe helper copy, pure local filtering,
  summary-from-all-items behavior, comparison selection preservation, hidden
  selected-product warning, and forbidden medical/guarantee wording.

## Validation Results

```txt
npm run test -- saved-product-filters saved-products-ui: PASS - 3 files / 56 tests
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 109 files / 1120 tests
npm run build: PASS after elevated rerun; sandboxed attempt compiled successfully, then failed with spawn EPERM
npm run test:e2e: PASS after elevated rerun - 31 passed; sandboxed attempt failed immediately with spawn EPERM
git diff --check: PASS, with existing CRLF normalization warning for AGENTS.md
git diff -- package.json package-lock.json: PASS - no diff
git diff -- .env .env.local .env.example src/config/env.ts: PASS - no diff
Targeted rendered UI check: PASS via Playwright fallback after in-app Browser was unavailable
```

## Known Limitations

- Filtering applies only to the currently loaded Saved Products list.
- No server-side search or filtering was added.
- Manual production smoke, screen-reader verification, screenshots, and demo
  video were not rerun or captured for v1.40.
