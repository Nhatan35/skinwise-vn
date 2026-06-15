# Release Evidence - Routine Builder Saved Product Decision Context

## Summary

Status: DONE / PASS

Task: MVP v1.42 - Routine Builder Saved Product Decision Context

Vietnamese feature name: Hiển thị thông tin cân nhắc của sản phẩm đã lưu trong
Routine Builder

Scope: Post-MVP controlled improvement

Date: 2026-06-14

Environment: Local development validation

## Objective

Improve the Routine Builder experience by showing saved-product decision
metadata when a user selects a saved product while building a routine.

This is a personal organization and decision-support feature only.

## Scope Implemented

- Extended `RoutineProductOption` with optional saved-product decision metadata:
  `decisionStatus`, `plannedRoutineSlot`, and `personalNote`.
- Mapped existing metadata from `SavedProductDto` only for saved-product
  options.
- Kept catalogue/global product options free of user-specific saved-product
  metadata.
- Added a compact selected-product context section for saved options:
  "Thông tin cân nhắc đã lưu".
- Reused shared saved-product label maps from
  `src/modules/saved-products/saved-product-labels.ts`.
- Added safe empty metadata copy for unset decision status, planned routine
  slot, and personal note.
- Preserved the existing Routine Builder product picker, selected-product
  context, category auto-fill behavior, validation, and save payload.

## Routine Builder Behavior

- Selecting a saved product can show the existing decision status label.
- Selecting a saved product can show the existing planned routine slot label.
- Selecting a saved product can show the user's personal note.
- Missing metadata is shown as neutral empty-state copy.
- Catalogue-only products do not show the saved-product decision context.
- Saved-product metadata is informational only and does not drive routine step
  category, frequency, time of day, warnings, safety results, or save behavior.

## API and Data Behavior

- Existing saved-product metadata is reused.
- No API contract changes.
- No data model changes.
- No routine API contract change.
- Routine save payload remains unchanged.
- Saved Product PATCH behavior from v1.39 is unchanged.
- Saved Product DTO exposure rules remain unchanged.
- No package or environment changes.

## Safety Boundaries

- No medical advice, diagnosis, or treatment claim was added.
- No guaranteed suitability, guaranteed safety, or guaranteed effectiveness
  claim was added.
- No automatic product recommendation, ranking, selection, or routine
  modification was added.
- Product Match scoring, ranking, and explanation behavior remain unchanged.
- Routine Safety and Routine Coverage logic remain unchanged.
- Existing category auto-fill behavior is preserved and was not expanded.

## Explicitly Unchanged

- Product Match scoring/ranking/explanation algorithm.
- Routine Safety logic.
- Routine Coverage logic.
- Routine API contract.
- Routine save payload.
- AI provider behavior.
- Auth provider behavior.
- Mongo ownership model.
- Saved Product PATCH behavior from v1.39.
- Saved Product DTO exposure rules.
- Saved Products filters/search/summary from v1.40.
- Product Detail shortcut from v1.41.
- Product and ingredient seed data.
- Environment variables.
- Package dependencies.
- E2E baseline specs.

## Files Changed

Implementation:

- `src/modules/routines/routine-product-options.ts`
- `src/modules/routines/components/routine-builder.tsx`

Tests:

- `tests/unit/routine-product-options.test.ts`
- `tests/unit/routine-builder-ui.test.ts`

Documentation:

- `docs/release-evidence-routine-builder-saved-product-decision-context.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/00-source-of-truth.md`
- `AGENTS.md`
- `README.md`

## Tests Added / Updated

- Added mapping coverage that saved product options include decision status,
  planned routine slot, and personal note when available.
- Added mapping coverage for missing saved metadata.
- Added coverage that catalogue options do not receive user-specific metadata.
- Added coverage that mapping does not mutate the original saved-product data.
- Added coverage that routine step creation and save payload do not include
  saved-product decision metadata.
- Added Routine Builder UI source coverage for the saved decision context,
  labels, helper copy, safe empty states, saved-only rendering, and forbidden
  medical/guarantee wording absence.
- Preserved existing Routine Builder, Saved Products, Product Detail, Product
  Match, Routine Safety, and Routine Coverage behavior.

## Validation Results

```txt
npm run test -- routine-product-options routine-builder-ui saved-products-ui product-detail-saved-decision-shortcut: PASS - 5 files / 65 tests
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 110 files / 1134 tests
npm run build: PASS after elevated rerun; sandboxed attempt compiled successfully, then failed with spawn EPERM
npm run test:e2e: PASS after elevated rerun - 31 passed; sandboxed attempt failed immediately with spawn EPERM
Focused rendered Routine Builder check: PASS via temporary Playwright spec; temporary spec removed after verification
git diff --check: PASS, with AGENTS.md CRLF normalization warning
git diff -- package.json package-lock.json: PASS - no diff
git diff -- .env .env.local .env.example src/config/env.ts: PASS - no diff
```

## Known Limitations

- The in-app Browser surface was unavailable, so the rendered verification used
  a temporary Playwright check instead of an interactive browser screenshot.
- Manual production verification and screen-reader verification were not rerun
  for v1.42.
