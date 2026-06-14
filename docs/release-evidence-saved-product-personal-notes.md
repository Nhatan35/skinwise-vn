# Release Evidence - Saved Product Personal Notes & Trial Decision Support

## Summary

Status: DONE / PASS

Task: MVP v1.39 - Saved Product Personal Notes & Trial Decision Support

Scope: Post-MVP controlled improvement

Date: 2026-06-13

Environment: Local development validation

## Scope Implemented

- Added optional private saved-product metadata fields:
  `decisionStatus`, `plannedRoutineSlot`, and `personalNote`.
- Added strict validation for saved-product metadata updates.
- Added authenticated `PATCH /api/saved-products/[productId]`.
- Added owner-scoped repository and use-case update flow using
  `currentUser.id + productId`.
- Added client helper support for PATCH updates.
- Added Saved Products UI controls for personal decision-support notes.
- Added Saved Products comparison rows for decision status, planned routine
  slot, and personal note.
- Added focused schema, API contract, repository, use-case, client, and UI
  tests.

## User-Facing Behavior

- Saved Products cards now show a private decision-support section.
- Users can set `Trạng thái cân nhắc`.
- Users can set `Dự định dùng trong routine`.
- Users can add, edit, or clear `Ghi chú cá nhân`.
- The UI shows pending, success, and error feedback for metadata updates.
- Comparison view can display the new personal metadata when users compare
  saved products.
- Empty metadata is displayed as `Chưa chọn` or `Chưa ghi chú`.

## Safety Boundaries

- This feature is personal product decision support only.
- It does not diagnose skin conditions.
- It does not prescribe medication.
- It does not claim guaranteed product suitability or guaranteed safety.
- It does not choose a best product automatically.
- It does not alter Product Match scoring, ranking, or explanations.
- It does not modify routines automatically.
- It does not add medical, clinical, AI, or recommendation-engine behavior.

## Explicitly Unchanged

- Database schema unchanged.
- Product Match scoring/ranking unchanged.
- Product Match explanation algorithm unchanged.
- Routine Safety logic unchanged.
- Routine Coverage logic unchanged.
- AI provider behavior unchanged.
- Auth provider behavior unchanged.
- Environment variable requirements unchanged.
- Package dependencies unchanged.
- Product seed baseline unchanged.
- Ingredient seed baseline unchanged.
- Image upload behavior unchanged.
- Marketplace behavior unchanged.
- Notification behavior unchanged.
- Medical recommendation behavior unchanged.
- API contracts unchanged except for the additive authenticated
  `PATCH /api/saved-products/[productId]` metadata update.

## Files Changed

Implementation:

- `src/app/api/saved-products/[productId]/route.ts`
- `src/modules/saved-products/saved-product.types.ts`
- `src/modules/saved-products/saved-product.dto.ts`
- `src/modules/saved-products/saved-product.schema.ts`
- `src/modules/saved-products/saved-product.mapper.ts`
- `src/modules/saved-products/saved-product.repository.ts`
- `src/modules/saved-products/saved-product.use-case.ts`
- `src/modules/saved-products/saved-product.client.ts`
- `src/modules/saved-products/components/saved-product-decision-support.tsx`
- `src/modules/saved-products/components/saved-product-card.tsx`
- `src/modules/saved-products/components/saved-products-page.tsx`
- `src/modules/saved-products/components/saved-products-comparison-panel.tsx`

Tests:

- `tests/unit/saved-product-schema.test.ts`
- `tests/unit/saved-product-api-contract.test.ts`
- `tests/unit/saved-product-repository.test.ts`
- `tests/unit/saved-product-use-case.test.ts`
- `tests/unit/saved-product-client.test.ts`
- `tests/unit/saved-products-ui.test.ts`

Documentation:

- `docs/release-evidence-saved-product-personal-notes.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/00-source-of-truth.md`
- `docs/04-data-model.md`
- `docs/05-api-contract.md`
- `AGENTS.md`

## Tests Added / Updated

- Schema validation for allowed metadata values, note trimming, 1000-character
  note limit, empty-note clearing, strict unknown-field rejection, internal-field
  rejection, and empty-body rejection.
- API contract tests for PATCH export, auth, validation errors, owner update,
  not-found behavior, safe envelope shape, and internal-error sanitization.
- Repository tests for user/product scoped update, metadata-only writes,
  `updatedAt`, note clearing, invalid product ids, and no-match behavior.
- Use-case tests for DTO-safe metadata mapping and old saved-product records
  without metadata.
- Client tests for PATCH request shape, supported-field filtering, successful
  response parsing, API errors, and malformed response rejection.
- UI/source tests for decision-support labels, helper copy, safe feedback,
  confirmed-success update ordering, comparison metadata rows, and forbidden
  medical/guarantee copy.

## Validation Commands

Required:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
git diff --check
git diff -- package.json package-lock.json
git diff -- .env .env.local .env.example src/config/env.ts
```

Focused pre-check:

```txt
npm run test -- saved-product
```

Additional safety checks:

```txt
git diff -- prisma
git diff -- tests/e2e
```

## Validation Results

```txt
npm run test -- saved-product: PASS - 7 files / 94 tests
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 108 files / 1088 tests
npm run build: PASS after elevated rerun; sandboxed attempt compiled successfully, then failed with spawn EPERM
npm run test:e2e: PASS after elevated rerun - 31 passed; sandboxed attempt failed immediately with spawn EPERM
git diff --check: PASS
git diff -- package.json package-lock.json: PASS - no diff
git diff -- .env .env.local .env.example src/config/env.ts: PASS - no diff
git diff -- prisma: PASS - no diff
git diff -- tests/e2e: PASS - no diff
```

## Git/Diff Safety

- No package or lockfile changes.
- No env/config changes.
- No Prisma/schema changes.
- No E2E spec changes.
- No seed baseline changes.
- No Product Match scoring/ranking changes.
- No Routine Safety or Routine Coverage logic changes.
- No auth provider or AI provider behavior changes.
- No secrets, tokens, database connection strings, OAuth credentials, or private
  user data were added.

## Notes / Follow-up

- Manual browser verification was not rerun for v1.39.
- Production smoke was not rerun for v1.39.
- Full screen-reader verification was not rerun for v1.39.
- Screenshots/demo video were not captured.
- The feature is intentionally scoped to Saved Products and Saved Products
  comparison.
