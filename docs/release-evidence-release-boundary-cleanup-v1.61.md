# MVP v1.61 - Release Boundary Cleanup Evidence

## Scope

MVP v1.61 is a release hygiene and boundary cleanup task for the dirty worktree containing MVP v1.59 Admin Product Create/Edit Lite and MVP v1.60 Admin Ingredient Create/Edit Lite.

In scope:

- Capture the initial dirty worktree state.
- Classify dirty files by v1.59, v1.60, shared release metadata, unrelated work, or human-review needs.
- Verify v1.59/v1.60 route and API boundaries against actual source.
- Verify v1.59/v1.60 release evidence and selected shared docs for truthful status claims.
- Add this v1.61 evidence file.
- Apply docs-only consistency cleanup where evidence was stale.

Out of scope:

- New product features.
- Product create/edit behavior changes.
- Ingredient create/edit behavior changes.
- Dashboard or saved-products feature cleanup.
- Product Match scoring changes.
- Routine Safety or Routine Coverage behavior changes.
- Ingredient Explanation behavior changes.
- Public Product Catalogue visibility changes.
- Public Ingredient Library behavior changes.
- Git staging or commit.
- Production-ready claim.

## Initial worktree state

Preflight commands run before cleanup:

```txt
git branch --show-current
git status --short
git diff --stat
git diff --name-only
git diff --name-status
git diff --cached --stat
git diff --cached --name-only
git diff --cached --name-status
```

Initial snapshot:

```txt
Branch: feature/v1.52-dashboard-saved-product-tags-summary
git status --short: 97 dirty entries total
git diff --stat: 65 tracked files changed, 5239 insertions(+), 133 deletions(-)
git diff --name-only: 65 tracked modified files
git diff --name-status: 65 tracked modified files, all status M
Untracked files from git status --short -uall: 32
Deleted files: none observed
Renamed files: none observed
Staged changes: none; git diff --cached --stat/name-only/name-status returned empty output
Package/lockfile dirty: no
.env.local tracked: no; git ls-files .env.local returned empty output
```

Initial `git diff --stat`:

```txt
65 files changed, 5239 insertions(+), 133 deletions(-)
```

Initial tracked `git diff --name-status` summary:

```txt
M  AGENTS.md
M  README.md
M  docs/00-source-of-truth.md
M  docs/02-user-stories.md
M  docs/04-data-model.md
M  docs/05-api-contract.md
M  docs/09-release-plan.md
M  docs/13-ui-route-map.md
M  docs/ai-coding/02-implementation-status.md
M  docs/ai-coding/03-feature-status-matrix.md
M  docs/ai-coding/06-current-sprint-plan.md
M  docs/final-release-checklist.md
M  docs/portfolio-evidence-package.md
M  docs/post-mvp-backlog.md
M  scripts/seed-e2e.ts
M  src/app/admin/products/page.tsx
M  src/app/api/admin/products/route.ts
M  src/modules/account-data/account-data-export.mapper.ts
M  src/modules/dashboard/components/dashboard-overview.tsx
M  src/modules/dashboard/dashboard.dto.ts
M  src/modules/dashboard/dashboard.mapper.ts
M  src/modules/dashboard/dashboard.types.ts
M  src/modules/dashboard/dashboard.use-case.ts
M  src/modules/ingredients/ingredient.repository.ts
M  src/modules/ingredients/ingredient.schema.ts
M  src/modules/ingredients/ingredient.use-case.ts
M  src/modules/products/admin-product.client.ts
M  src/modules/products/components/admin-product-review.tsx
M  src/modules/products/product.repository.ts
M  src/modules/products/product.schema.ts
M  src/modules/products/product.use-case.ts
M  src/modules/saved-products/components/saved-product-card.tsx
M  src/modules/saved-products/components/saved-products-page.tsx
M  src/modules/saved-products/saved-product-filters.ts
M  src/modules/saved-products/saved-product.client.ts
M  src/modules/saved-products/saved-product.dto.ts
M  src/modules/saved-products/saved-product.mapper.ts
M  src/modules/saved-products/saved-product.repository.ts
M  src/modules/saved-products/saved-product.schema.ts
M  src/modules/saved-products/saved-product.types.ts
M  src/shared/constants/routes.ts
M  tests/e2e/admin-product-review.smoke.spec.ts
M  tests/e2e/dashboard-summary.authenticated.spec.ts
M  tests/e2e/helpers/test-data.ts
M  tests/e2e/saved-products.authenticated.spec.ts
M  tests/unit/account-data-export-use-case.test.ts
M  tests/unit/admin-product-api-contract.test.ts
M  tests/unit/admin-product-client.test.ts
M  tests/unit/admin-product-review-ui.test.ts
M  tests/unit/dashboard-api-contract.test.ts
M  tests/unit/dashboard-ui.test.ts
M  tests/unit/dashboard-use-case.test.ts
M  tests/unit/ingredient-use-case.test.ts
M  tests/unit/ingredient.test.ts
M  tests/unit/onboarding-progress-card.test.ts
M  tests/unit/product-use-case.test.ts
M  tests/unit/product.test.ts
M  tests/unit/routine-product-options.test.ts
M  tests/unit/saved-product-api-contract.test.ts
M  tests/unit/saved-product-client.test.ts
M  tests/unit/saved-product-filters.test.ts
M  tests/unit/saved-product-repository.test.ts
M  tests/unit/saved-product-schema.test.ts
M  tests/unit/saved-product-use-case.test.ts
M  tests/unit/saved-products-ui.test.ts
```

Initial untracked files from `git status --short -uall` are classified below.

## File classification

### Group A - MVP v1.59 Admin Product Create/Edit Lite

Direct v1.59 implementation and tests:

- `src/app/admin/products/page.tsx`
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/products/[id]/route.ts`
- `src/modules/products/admin-product.client.ts`
- `src/modules/products/components/admin-product-form.tsx`
- `src/modules/products/components/admin-product-review.tsx`
- `src/modules/products/product.repository.ts`
- `src/modules/products/product.schema.ts`
- `src/modules/products/product.use-case.ts`
- `tests/e2e/admin-product-review.smoke.spec.ts`
- `tests/unit/admin-product-api-contract.test.ts`
- `tests/unit/admin-product-client.test.ts`
- `tests/unit/admin-product-review-ui.test.ts`
- `tests/unit/product-use-case.test.ts`
- `tests/unit/product.test.ts`
- `docs/release-evidence-admin-product-create-edit-lite-v1.59.md`

Shared v1.59/v1.60 admin smoke support:

- `scripts/seed-e2e.ts` - deletes repeatable v1.59 product create/edit smoke records and v1.60 ingredient smoke records.
- `tests/e2e/helpers/test-data.ts` - defines both product and ingredient create/edit smoke constants.

Notes:

- The existing status-only route `src/app/api/admin/products/[id]/verification-status/route.ts` was inspected and remains present.
- Product DTO mapping still omits `source` and `createdByUserId`.
- Public product repository visibility still filters to reviewed/verified products.

### Group B - MVP v1.60 Admin Ingredient Create/Edit Lite

Direct v1.60 implementation and tests:

- `src/app/admin/ingredients/page.tsx`
- `src/app/api/admin/ingredients/route.ts`
- `src/app/api/admin/ingredients/[id]/route.ts`
- `src/modules/ingredients/admin-ingredient.client.ts`
- `src/modules/ingredients/components/admin-ingredient-form.tsx`
- `src/modules/ingredients/components/admin-ingredient-management.tsx`
- `src/modules/ingredients/ingredient.repository.ts`
- `src/modules/ingredients/ingredient.schema.ts`
- `src/modules/ingredients/ingredient.use-case.ts`
- `src/shared/constants/routes.ts`
- `tests/e2e/admin-ingredient-management.smoke.spec.ts`
- `tests/unit/admin-ingredient-api-contract.test.ts`
- `tests/unit/admin-ingredient-client.test.ts`
- `tests/unit/admin-ingredient-ui.test.ts`
- `tests/unit/ingredient-use-case.test.ts`
- `tests/unit/ingredient.test.ts`
- `docs/release-evidence-admin-ingredient-create-edit-lite-v1.60.md`

Shared v1.59/v1.60 admin smoke support:

- `scripts/seed-e2e.ts`
- `tests/e2e/helpers/test-data.ts`

Notes:

- No public write API for ingredients was found.
- No ingredient delete route was found.
- Duplicate normalized `inciName` prevention is implemented in the ingredient repository/use-case path and covered by tests.
- User-facing Ingredient Library, Ingredient Detail, and Ingredient Explanation routes remain separate from admin routes.

### Group C - Shared docs / shared release metadata

Shared docs containing v1.59/v1.60 status, API, data model, route, backlog, or release-plan updates:

- `README.md`
- `docs/00-source-of-truth.md`
- `docs/02-user-stories.md`
- `docs/04-data-model.md`
- `docs/05-api-contract.md`
- `docs/09-release-plan.md`
- `docs/13-ui-route-map.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/final-release-checklist.md`
- `docs/portfolio-evidence-package.md`
- `docs/post-mvp-backlog.md`
- `docs/release-evidence-release-boundary-cleanup-v1.61.md`

Shared governance file:

- `AGENTS.md` - dirty diff is a governance/status sync through v1.55, not a v1.59 or v1.60 implementation file. It should not be included in v1.59/v1.60 commits unless the human reviewer chooses a separate governance docs commit.

Shared docs section-level classification:

- v1.59 content: admin product create/edit lite, product create/edit API contract, product data model notes, `/admin/products` route status, v1.59 validation/evidence references.
- v1.60 content: admin ingredient create/edit lite, admin ingredient API contract, ingredient data model notes, `/admin/ingredients` route status, v1.60 validation/evidence references.
- v1.61 content: this evidence file and docs-only status cleanup in `docs/final-release-checklist.md`, `docs/portfolio-evidence-package.md`, and the explicit security section added to the v1.59 release evidence.
- Unrelated content inside shared docs: v1.50-v1.57 dashboard/saved-products/governance status carried forward from the existing dirty worktree.

### Group D - Unrelated dirty changes

Dashboard v1.51-v1.53 workstream:

- `docs/release-evidence-dashboard-routine-coverage-summary-v1.51.md`
- `docs/release-evidence-dashboard-saved-product-tags-summary-v1.52.md`
- `docs/release-evidence-dashboard-saved-product-decision-queue-v1.53.md`
- `src/modules/dashboard/components/dashboard-overview.tsx`
- `src/modules/dashboard/components/routine-coverage-summary-card.tsx`
- `src/modules/dashboard/components/saved-product-tags-summary-card.tsx`
- `src/modules/dashboard/components/saved-product-decision-queue-card.tsx`
- `src/modules/dashboard/dashboard.dto.ts`
- `src/modules/dashboard/dashboard.mapper.ts`
- `src/modules/dashboard/dashboard.types.ts`
- `src/modules/dashboard/dashboard.use-case.ts`
- `tests/e2e/dashboard-summary.authenticated.spec.ts`
- `tests/unit/dashboard-api-contract.test.ts`
- `tests/unit/dashboard-ui.test.ts`
- `tests/unit/dashboard-use-case.test.ts`
- `tests/unit/dashboard-saved-product-decision-queue.test.ts`
- `tests/unit/onboarding-progress-card.test.ts`

Saved Products v1.50/v1.54/v1.55 workstream:

- `docs/release-evidence-saved-product-personal-tags-v1.50.md`
- `docs/release-evidence-saved-products-review-queue-filters-v1.54.md`
- `docs/release-evidence-saved-product-review-reason-indicators-v1.55.md`
- `src/modules/account-data/account-data-export.mapper.ts`
- `src/modules/saved-products/components/saved-product-card.tsx`
- `src/modules/saved-products/components/saved-product-personal-tags.tsx`
- `src/modules/saved-products/components/saved-products-page.tsx`
- `src/modules/saved-products/saved-product-filters.ts`
- `src/modules/saved-products/saved-product.client.ts`
- `src/modules/saved-products/saved-product.dto.ts`
- `src/modules/saved-products/saved-product.mapper.ts`
- `src/modules/saved-products/saved-product.repository.ts`
- `src/modules/saved-products/saved-product.schema.ts`
- `src/modules/saved-products/saved-product.types.ts`
- `src/modules/saved-products/saved-product-review.ts`
- `src/modules/saved-products/saved-product-tags.ts`
- `tests/e2e/saved-products.authenticated.spec.ts`
- `tests/unit/account-data-export-use-case.test.ts`
- `tests/unit/routine-product-options.test.ts`
- `tests/unit/saved-product-api-contract.test.ts`
- `tests/unit/saved-product-client.test.ts`
- `tests/unit/saved-product-filters.test.ts`
- `tests/unit/saved-product-repository.test.ts`
- `tests/unit/saved-product-schema.test.ts`
- `tests/unit/saved-product-use-case.test.ts`
- `tests/unit/saved-products-ui.test.ts`
- `tests/unit/saved-product-review.test.ts`
- `tests/unit/saved-product-tags.test.ts`

Release governance/package workstream unrelated to v1.59/v1.60 implementation:

- `docs/release-evidence-status-worktree-governance-cleanup-v1.56.md`
- `docs/release-evidence-commit-boundary-release-packaging-v1.57.md`
- `docs/release-package-v1.50-v1.56-prepared-by-v1.57.md`

These files should not be staged into v1.59 or v1.60 commits.

### Group E - Unknown / human review

No unknown dirty file remains unclassified after inspection.

Human review is still recommended before staging because unrelated dashboard, saved-products, and governance work remains mixed in the same dirty worktree.

## Cleanup actions performed

- Added this v1.61 release boundary cleanup evidence file.
- Added an explicit `Security and permission behavior` section to `docs/release-evidence-admin-product-create-edit-lite-v1.59.md`.
- Updated `docs/final-release-checklist.md` stale v1.55 latest-validation/latest-task wording to v1.60 and added v1.59/v1.60 release-chain entries.
- Updated `docs/portfolio-evidence-package.md` stale v1.55 validation wording to v1.60/v1.59.
- Did not modify product create/edit behavior.
- Did not modify ingredient create/edit behavior.
- Did not modify dashboard or saved-products feature code.
- Did not modify package or lock files.
- Did not stage or commit changes.

## Route/API boundary check

### v1.59 Product admin routes

Verified source routes:

- `GET /api/admin/products` exists in `src/app/api/admin/products/route.ts`.
- `POST /api/admin/products` exists in `src/app/api/admin/products/route.ts`.
- `PATCH /api/admin/products/[id]` exists in `src/app/api/admin/products/[id]/route.ts`.
- `PATCH /api/admin/products/[id]/verification-status` remains present in `src/app/api/admin/products/[id]/verification-status/route.ts`.

Boundary notes:

- Status-only route remains separate.
- Admin product APIs require authenticated admin access.
- Product DTO mapping omits `source` and `createdByUserId`.
- Public product list/detail routes remain GET-only and use visible-product filtering through reviewed/verified statuses.

### v1.60 Ingredient admin routes

Verified source routes:

- `GET /api/admin/ingredients` exists in `src/app/api/admin/ingredients/route.ts`.
- `POST /api/admin/ingredients` exists in `src/app/api/admin/ingredients/route.ts`.
- `PATCH /api/admin/ingredients/[id]` exists in `src/app/api/admin/ingredients/[id]/route.ts`.

Boundary notes:

- No admin ingredient DELETE route was found.
- No public ingredient write route was found.
- No product-to-ingredient auto-linking or relational mapping was added.
- Duplicate normalized `inciName` checks are implemented and covered.

### Public routes preserved

Verified source routes:

- `GET /api/products`
- `GET /api/products/[id]`
- `GET /api/ingredients`
- `GET /api/ingredients/[id]`
- `POST /api/ingredients/explain`

Public Product Catalogue visibility remains limited to reviewed/verified products. User-facing Ingredient Library, Ingredient Detail, and Ingredient Explanation remain outside admin management routes.

## Docs/release evidence check

v1.59 release evidence:

- Exists: `docs/release-evidence-admin-product-create-edit-lite-v1.59.md`
- Includes scope, files changed, behavior added, API changes, UI changes, tests, validation results, known limitations, out of scope, and production readiness note.
- v1.61 cleanup added an explicit security/permission section.
- Production readiness note is present and does not claim production-ready status.

v1.60 release evidence:

- Exists: `docs/release-evidence-admin-ingredient-create-edit-lite-v1.60.md`
- Includes scope, preflight/worktree state, files changed, behavior added, API changes, UI changes, security and permission behavior, duplicate ingredient behavior, user-facing ingredient behavior, tests, validation results, known limitations, out of scope, and production readiness note.
- Production readiness note is present and does not claim production-ready status.

Shared docs:

- README, source-of-truth, release plan, route map, implementation status, feature matrix, current sprint plan, and backlog contain v1.59/v1.60 local validation/status references and preserve the v1.48 deployed smoke blocker.
- `docs/final-release-checklist.md` and `docs/portfolio-evidence-package.md` were stale to v1.55 and were updated by v1.61 to reflect v1.60/v1.59 evidence.
- `AGENTS.md` dirty diff is shared governance/status through v1.55, not v1.59/v1.60 implementation. It was inspected and not changed.

Production-ready claim check:

- No v1.61 production-ready claim was added.
- `rg` found `The app is fully production-ready.` only inside an `Avoid this style` example in `AGENTS.md`, so no correction was needed there.

v1.48 deployed smoke status:

- Still incomplete.
- Production-ready remains not claimed.

## Validation results

Validation was run after the v1.61 docs/evidence cleanup.

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | PASS | ESLint completed successfully. |
| `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| `npm run test` | PASS | Vitest completed successfully: 120 test files passed, 1343 tests passed. |
| `npm run build` | PASS after elevated rerun | Initial sandbox run compiled successfully but failed at TypeScript with `spawn EPERM`; elevated rerun passed and confirmed admin/public route manifest. |
| `npm run test:e2e` | PASS after elevated rerun | Initial sandbox run failed immediately with `spawn EPERM`; elevated rerun passed: 39 Playwright tests passed. |
| `npm audit --omit=dev --audit-level=moderate` | PASS | `found 0 vulnerabilities`. |
| `git diff --check` | PASS | No whitespace errors. Git printed CRLF normalization warnings for existing dirty files. |

## Commit/staging recommendation

No commit was created.

Recommended commit 1 - v1.59 product create/edit lite:

```bash
git add src/app/admin/products/page.tsx
git add src/app/api/admin/products/route.ts
git add src/app/api/admin/products/[id]/route.ts
git add src/modules/products/admin-product.client.ts
git add src/modules/products/components/admin-product-form.tsx
git add src/modules/products/components/admin-product-review.tsx
git add src/modules/products/product.repository.ts
git add src/modules/products/product.schema.ts
git add src/modules/products/product.use-case.ts
git add tests/e2e/admin-product-review.smoke.spec.ts
git add tests/unit/admin-product-api-contract.test.ts
git add tests/unit/admin-product-client.test.ts
git add tests/unit/admin-product-review-ui.test.ts
git add tests/unit/product-use-case.test.ts
git add tests/unit/product.test.ts
git add docs/release-evidence-admin-product-create-edit-lite-v1.59.md
git diff --cached --stat
```

Recommended commit 2 - v1.60 ingredient create/edit lite:

```bash
git add src/app/admin/ingredients/page.tsx
git add src/app/api/admin/ingredients/route.ts
git add src/app/api/admin/ingredients/[id]/route.ts
git add src/modules/ingredients/admin-ingredient.client.ts
git add src/modules/ingredients/components/admin-ingredient-form.tsx
git add src/modules/ingredients/components/admin-ingredient-management.tsx
git add src/modules/ingredients/ingredient.repository.ts
git add src/modules/ingredients/ingredient.schema.ts
git add src/modules/ingredients/ingredient.use-case.ts
git add src/shared/constants/routes.ts
git add tests/e2e/admin-ingredient-management.smoke.spec.ts
git add tests/unit/admin-ingredient-api-contract.test.ts
git add tests/unit/admin-ingredient-client.test.ts
git add tests/unit/admin-ingredient-ui.test.ts
git add tests/unit/ingredient-use-case.test.ts
git add tests/unit/ingredient.test.ts
git add docs/release-evidence-admin-ingredient-create-edit-lite-v1.60.md
git diff --cached --stat
```

Shared admin smoke support to review before staging:

```bash
git add -p scripts/seed-e2e.ts
git add -p tests/e2e/helpers/test-data.ts
```

Recommended commit 3 - release boundary cleanup/shared docs:

```bash
git add docs/release-evidence-release-boundary-cleanup-v1.61.md
git add docs/final-release-checklist.md
git add docs/portfolio-evidence-package.md
git add README.md docs/00-source-of-truth.md docs/02-user-stories.md docs/04-data-model.md docs/05-api-contract.md docs/09-release-plan.md docs/13-ui-route-map.md docs/post-mvp-backlog.md docs/ai-coding/02-implementation-status.md docs/ai-coding/03-feature-status-matrix.md docs/ai-coding/06-current-sprint-plan.md
git diff --cached --stat
```

Do not include dashboard, saved-products, v1.50-v1.57 governance package files, or unrelated AGENTS changes in v1.59/v1.60 commits.

## Known limitations

- Unrelated dashboard and saved-products dirty changes remain mixed in the worktree.
- The worktree is not clean and no staging separation was performed by v1.61.
- v1.59/v1.60 are locally validated based on their recorded evidence, but v1.61 validation is recorded separately after this cleanup.
- MVP v1.48 deployed admin product review smoke evidence remains incomplete.
- Production-ready is not claimed.

## Production readiness note

This cleanup task does not claim production-ready status because MVP v1.48 deployed admin product review smoke evidence remains incomplete.
