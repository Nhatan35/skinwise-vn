# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-16

## 1. Current Phase

```txt
Post-MVP controlled product improvement
```

Status:

```txt
Product implementation: COMPLETE at MVP level
Latest product behavior milestone: MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix: DONE / PASS locally
Current portfolio release: MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix: DONE / PASS locally
Current active milestone: None
Current active milestone status: None
Recommended next task: MVP v1.48 - Deployed Admin Product Review Smoke Verification
```

Evidence boundary:

```txt
v1.47 local validation: PASS for targeted unit tests, lint, typecheck, unit tests, build after elevated rerun, targeted admin browser smoke, and full E2E
v1.47 local browser smoke: PASS - unauthenticated redirect, non-admin block, admin list/search/filter/update/revert, public visibility, console/network, and secret-exposure checks passed
v1.47 production smoke on deployed URL: NOT RUN
Historical production smoke/monitoring: PASS, user-reported
Production-ready claim for v1.47: NOT CLAIMED
Screenshots/demo video: NOT VERIFIED / NOT RECORDED
Real external AI provider integration: NOT VERIFIED
```

## 2. Objective

Resolve the v1.46 repeatable local smoke blockers for the v1.45 admin product
review UI, then verify `/admin/products` through local browser automation with
strict evidence.

This milestone adds E2E-only auth/test-data support and smoke evidence. It does
not add full admin dashboard scope, full product CRUD, hard delete, `isActive`,
production auth bypasses, production credentials, or production-ready claims.

## 3. Implementation Scope

```txt
[x] Inspected repository structure, package scripts, routes, API handlers, env schema, product/admin modules, navigation, and tests.
[x] Checked dirty Git state before editing.
[x] Confirmed `/admin/products`, server-side admin guard, admin client, and `"/admin/:path*"` proxy matcher from v1.45.
[x] Added repeatable E2E-only admin and non-admin auth provider configuration gated by `APP_ENV=test` and `E2E_TEST_AUTH=true`.
[x] Added idempotent E2E smoke account/profile seed data using the existing AppUserProfile role convention.
[x] Added a dedicated idempotent `unverified` admin smoke product.
[x] Opened local `/admin/products` with Playwright headless Chrome.
[x] Verified unauthenticated redirect behavior without critical Auth.js 500.
[x] Verified non-admin block and admin access/list/search/filter/update/revert behavior.
[x] Verified public product visibility regression, console, network, and secret-exposure checks.
[x] Created docs/release-evidence-admin-product-review-repeatable-smoke-v1.47.md.
[x] Ran targeted unit tests, lint, typecheck, targeted admin smoke, and full E2E.
```

Explicitly unchanged:

```txt
Database schema
API contracts
Business logic
Product Match scoring/ranking
Routine Safety logic
Routine Coverage logic
Saved Products behavior
Routine Builder payload behavior
Production auth behavior
Package dependencies
Main product seed baseline
Ingredient seed baseline
AI provider behavior
Image upload behavior
Marketplace behavior
Payment behavior
Notification behavior
Medical recommendation behavior
```

## 4. Validation Results

| Check | Command | Status | Notes |
|---|---|---|---|
| Install | `npm ci` | NOT RUN | Existing `node_modules` was present; not rerun for this smoke/evidence task. |
| Browser smoke | Playwright headless Chrome | PASS | Local `/admin/products` verified unauthenticated redirect, non-admin block, admin list/search/filter/update/revert, public visibility regression, console/network, and no browser-visible secret exposure. |
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 114 test files / 1171 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled then failed with `spawn EPERM`; elevated rerun completed successfully and listed `/admin/products`. |
| E2E | `npm run test:e2e` | PASS | 34 Playwright tests passed with local Chrome path. |
| Audit | `npm audit` | NOT RUN | Optional for this smoke/evidence task. |
| Production audit | `npm audit --omit=dev` | NOT RUN | Optional for this smoke/evidence task. |

E2E prerequisites:

```txt
Checked for v1.47 through `npm run test:e2e` with E2E-only auth and seeded smoke data.
```

## 5. Current Task Decision

```txt
MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix: DONE / PASS locally
Ready for portfolio demo: Yes for local admin review demo
Ready for production deployment: No / not claimed as production-ready
Reason: local admin review browser smoke passed with repeatable test data, but no deployed URL smoke was performed
Next recommended milestone: MVP v1.48 - Deployed Admin Product Review Smoke Verification
```

No new clinical, AI, recommendation-engine, dashboard, schema, auth,
environment, dependency, scoring, ranking, routine-safety, routine-coverage,
API-contract, data-model, routine-payload, or automatic product-selection
milestone was introduced.
