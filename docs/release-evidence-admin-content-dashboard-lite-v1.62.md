# MVP v1.62 - Admin Content Dashboard Lite Release Evidence

## Feature summary

MVP v1.62 adds a protected `/admin` Admin Content Dashboard Lite for catalogue maintenance overview and navigation.

The feature gives ADMIN users a lightweight summary of product and ingredient catalogue maintenance status while preserving the existing `/admin/products` and `/admin/ingredients` workflows.

Production-ready is not claimed because MVP v1.48 deployed admin product review smoke evidence remains incomplete.

## Scope

Implemented scope:

- Added protected `/admin` route.
- Reused the existing `requireAdminUser` admin guard pattern.
- Redirected unauthenticated users to `/api/auth/signin?callbackUrl=/admin`.
- Reused the existing safe non-admin unauthorized state pattern.
- Added Product summary card with total, pending review, reviewed, and verified counts based on existing `verificationStatus`.
- Added Ingredient summary card with total ingredient count.
- Added links to `/admin/products` and `/admin/ingredients`.
- Added boundary note for catalogue maintenance and release readiness.
- Added unit/source-contract and E2E smoke coverage.

## Out of scope

- Product delete.
- Ingredient delete.
- Image upload.
- Bulk import.
- Bulk export.
- Product-to-ingredient mapping.
- Marketplace or payment.
- Real AI provider integration.
- Public catalogue visibility changes.
- Schema changes.
- Product review status behavior changes.
- Ingredient explanation behavior changes.
- Saved-products behavior changes.
- User-facing dashboard behavior changes.
- Deployed smoke verification.
- Production-ready claim.

## Files changed

Implementation:

- `src/app/admin/page.tsx`
- `src/modules/admin/admin-content-summary.dto.ts`
- `src/modules/admin/admin-content-summary.use-case.ts`
- `src/modules/admin/components/admin-content-dashboard.tsx`
- `src/modules/ingredients/ingredient.repository.ts`
- `src/modules/ingredients/ingredient.use-case.ts`
- `src/shared/constants/routes.ts`

Tests:

- `tests/unit/admin-content-summary.test.ts`
- `tests/unit/admin-content-dashboard.test.ts`
- `tests/unit/ingredient-use-case.test.ts`
- `tests/e2e/admin-content-dashboard.smoke.spec.ts`

Documentation:

- `docs/release-evidence-admin-content-dashboard-lite-v1.62.md`
- `docs/portfolio-evidence-package.md`

Mixed status documentation inspected during boundary cleanup but intentionally
left outside the clean v1.62 commit boundary because the current diffs also
contain v1.50-v1.60 or governance synchronization:

- `README.md`
- `docs/00-source-of-truth.md`
- `docs/post-mvp-backlog.md`
- `docs/09-release-plan.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/final-release-checklist.md`

## Tests added/updated

Unit/use-case:

- Zero-count product and ingredient summary.
- Total product count.
- `unverified`, `reviewed`, and `verified` product status buckets.
- Total ingredient count.
- `/admin/products` and `/admin/ingredients` management links.
- Boundary note.
- No mutation of product inputs.
- Unknown or missing product status values handled safely.
- Ingredient admin count use-case delegates to repository count.

UI/source contract:

- `/admin` route exists.
- Existing admin guard imports and redirect behavior are present.
- Non-admin unauthorized state is present.
- Admin dashboard component renders title, description, product card, ingredient card, metrics, links, and boundary note.
- Business logic stays out of React component.
- Out-of-scope delete, bulk, image, marketplace, payment, AI, and schema-migration behavior is absent.

E2E:

- Unauthenticated users visiting `/admin` are redirected to sign-in with callbackUrl `/admin`.
- Non-admin users cannot see the Admin Content Dashboard.
- Admin users can open `/admin`.
- Admin users can see Product and Ingredient summary cards.
- Admin users can navigate to `/admin/products`.
- Admin users can navigate to `/admin/ingredients`.

## Validation command results

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 122 test files / 1353 tests
npm run build: PASS after elevated rerun
npm run test:e2e: PASS after elevated rerun - 42/42 tests
```

Validation notes:

- `npm run build` compiled successfully in the sandbox and then failed with Windows `spawn EPERM`; the elevated rerun passed.
- `npm run test:e2e` failed immediately in the sandbox with Windows `spawn EPERM`; the elevated rerun passed with 42/42 Playwright tests.

## Risk and boundary notes

- This is a read-only admin overview plus navigation entry point.
- Product summary counts use the existing `verificationStatus` domain field and existing statuses: `unverified`, `reviewed`, and `verified`.
- Product review status logic remains unchanged; the dashboard reads existing status values only.
- Ingredient summary intentionally counts total ingredients only; no ingredient status workflow was added.
- `/admin/products` behavior remains unchanged.
- `/admin/ingredients` behavior remains unchanged.
- Public `/products` and `/products/[id]` behavior remains unchanged.
- Public `/ingredients`, `/ingredients/[id]`, and ingredient explanation behavior remains unchanged.
- No schema change was made.
- No public user-facing catalogue behavior was changed.
- No delete, image upload, bulk import/export, product-to-ingredient mapping, marketplace/payment, or real AI provider integration was added.
- Package and lockfiles remain clean: no changes to `package.json`, `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.

## Production readiness note

Production-ready is not claimed because MVP v1.48 deployed admin product review smoke evidence remains incomplete.
