# Release Evidence - Product Detail Saved Decision Shortcut

## Summary

Status: DONE / PASS

Task: MVP v1.41 - Product Detail Saved Decision Shortcut

Vietnamese feature name: Chỉnh nhanh trạng thái cân nhắc sản phẩm ngay trong
trang Product Detail

Scope: Post-MVP controlled improvement

Date: 2026-06-14

Environment: Local development validation

## Objective

Reduce friction between Product Detail, saving a product, adding private
decision metadata, and viewing that information later in Saved Products.

This is a personal organization and decision-support feature only.

## Scope Implemented

- Product Detail now retains the matching `SavedProductDto` instead of reducing
  the loaded saved-product state to a boolean.
- Added a compact Product Detail panel for loading, signed-out, load-error,
  not-saved, and saved-product states.
- Reused the existing saved-product metadata editor in a compact layout.
- Reused `updateSavedProductMetadata(productId, input)` and the existing
  `PATCH /api/saved-products/[productId]` behavior from v1.39.
- Extended `SavedProductToggleButton` with a backward-compatible optional DTO
  callback so a successful save shows the editor immediately and removal hides
  it without a page reload.
- Moved decision-status and planned-routine-slot labels/options to a shared
  client-safe saved-products module.
- Reused those labels in the Saved Products editor and comparison panel.

## Product Detail Behavior

- Loading saved-product state shows a small non-blocking status.
- A signed-out saved-product request does not expose editable metadata fields.
- A saved-product load error does not block product information or Product
  Match content.
- A product that is not saved shows a prompt to save it before adding private
  decision metadata.
- A saved product shows controls for `decisionStatus`,
  `plannedRoutineSlot`, and `personalNote`.
- Successful metadata updates replace the local saved-product DTO.
- Failed updates preserve the current form input and show safe feedback.
- Successful save/remove actions update the panel from the confirmed API result.

## Safety Boundaries

- No medical advice, diagnosis, or treatment claim was added.
- No guaranteed suitability, safety, or effectiveness claim was added.
- No automatic recommendation, ranking, product selection, or routine
  modification was added.
- Product Match scoring, ranking, and explanation behavior remain unchanged.
- Routine Safety and Routine Coverage logic remain unchanged.

## Explicitly Unchanged

- No API contract changes.
- No data model changes.
- Existing v1.39 PATCH API reused.
- Saved Product PATCH behavior unchanged.
- Saved Product DTO exposure rules unchanged.
- Saved Products v1.39 metadata editing remains available.
- Saved Products v1.40 filters, search, summary, and comparison behavior remain
  unchanged.
- Auth provider behavior unchanged.
- Environment variables unchanged.
- Package dependencies unchanged.
- Product and ingredient seed data unchanged.
- E2E specs unchanged.

## Files Changed

Implementation:

- `src/modules/products/components/product-detail.tsx`
- `src/modules/products/components/product-detail-saved-decision-shortcut.tsx`
- `src/modules/saved-products/components/saved-product-decision-support.tsx`
- `src/modules/saved-products/components/saved-product-toggle-button.tsx`
- `src/modules/saved-products/components/saved-products-comparison-panel.tsx`
- `src/modules/saved-products/saved-product-labels.ts`

Tests:

- `tests/unit/product-detail-saved-decision-shortcut.test.ts`
- `tests/unit/product-detail-ui.test.ts`
- `tests/unit/product-saved-products-ui.test.ts`
- `tests/unit/saved-products-ui.test.ts`

Documentation:

- `docs/release-evidence-product-detail-saved-decision-shortcut.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/00-source-of-truth.md`
- `AGENTS.md`
- `README.md`

## Tests Added / Updated

- Added source coverage for loading, signed-out, load-error, not-saved, and
  saved editor states.
- Added coverage for full DTO retention and authenticated saved-state
  detection.
- Added coverage for immediate DTO synchronization after confirmed save/remove.
- Added coverage for compact pending, success, and failure feedback.
- Added coverage that Product Detail submits only the supported metadata fields
  through the existing client helper.
- Added shared-label value and option coverage.
- Preserved existing Product Detail, Product Match, Saved Products, saved-product
  client, API-contract, schema, repository, and use-case tests.

## Validation Results

```txt
npm run test -- product-detail-saved-decision-shortcut product-detail-ui product-saved-products-ui saved-products-ui saved-product-client: PASS - 5 files / 59 tests
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 110 files / 1129 tests
npm run build: PASS after elevated rerun; sandboxed attempt compiled successfully, then failed with spawn EPERM
npm run test:e2e: PASS after elevated rerun - 31 passed; sandboxed attempt failed immediately with spawn EPERM
git diff --check: PASS, with AGENTS.md CRLF normalization warning
git diff -- package.json package-lock.json: PASS - no diff
git diff -- .env .env.local .env.example src/config/env.ts: PASS - no diff
```

## Known Limitations

- Product Detail detects saved state through the existing saved-products list
  request; no product-specific saved-state endpoint was added.
- If saved-product state cannot be loaded, the panel remains non-editable until
  a later successful save or page reload.
- The in-app Browser surface was unavailable. The full Playwright E2E suite
  passed, but no separate interactive panel smoke or screenshot was captured.
- Manual production and screen-reader verification were not rerun for v1.41.
