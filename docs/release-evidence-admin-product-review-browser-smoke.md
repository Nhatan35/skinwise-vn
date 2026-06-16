# Admin Product Review Browser Smoke & Evidence

## Purpose

Validate that the admin product review UI introduced in v1.45 works in a real
browser/local or deployed environment and that the admin product review workflow
is ready for portfolio demo.

## Scope

- `/admin/products` browser smoke.
- Admin access check.
- Non-admin access check.
- Unauthenticated access check.
- Product list display.
- Search/filter smoke.
- `verificationStatus` update smoke.
- Public product visibility compatibility.
- Browser console/network check.
- Validation command evidence.

## Evidence Boundary

- Browser was opened through Playwright headless Google Chrome using the local
  Chrome executable. The in-app browser surface was unavailable and bundled
  Playwright browser binaries were not installed.
- Smoke was local only against `http://localhost:3000`.
- Production/deployed URL smoke was not verified.
- Admin and non-admin demo accounts were not available for this task.
- Existing E2E test auth seeds a regular `e2e-user` only; no repeatable seeded
  admin account was found.
- Seed product data contains `reviewed` and `verified` products; no seeded
  `unverified` product was found in `scripts/seed.ts`.
- Browser smoke found a local Auth.js configuration blocker: the
  unauthenticated `/admin/products` redirect reached the sign-in route, but the
  sign-in page returned 500 with an Auth.js `MissingSecret` error in local logs.
- No product `verificationStatus` was changed in this task.

This task verified local browser smoke only. Production/deployed URL smoke was
not performed, so production-ready status is not claimed.

## Environment

- Date: 2026-06-15 20:54-21:01 +07:00
- Tester: Codex local automation
- App URL: `http://localhost:3000`
- Environment: Local
- OS: Microsoft Windows NT 10.0.26200.0
- Browser: Google Chrome via Playwright headless automation
- Browser version: 149.0.7827.104
- Node: v24.14.0
- npm: 11.14.1
- Database: Local `.env.local` target; exact URI was not inspected or printed
- Admin account used: NOT AVAILABLE
- Non-admin account used: NOT AVAILABLE
- Notes: `.env.local` exists and is not tracked by Git. Values were not read or
  printed. Local Auth.js sign-in failed with `MissingSecret`; no secret value was
  exposed.

## Current State Found

- Existing admin API: `GET /api/admin/products` and
  `PATCH /api/admin/products/[id]/verification-status` exist, require
  `AppUserProfile.role = "ADMIN"`, return `{ data, error }`, and support only
  `unverified`, `reviewed`, and `verified` as `verificationStatus` values.
- Existing admin UI: `/admin/products` exists and renders the v1.45
  `AdminProductReview` UI.
- Existing route protection: `/admin/products` uses server-side
  `requireAdminUser()`; unauthenticated users are redirected to Auth.js sign-in;
  non-admin users receive an unauthorized state.
- Existing proxy matcher: `src/proxy.ts` includes `"/admin/:path*"`.
- Existing admin account: NOT AVAILABLE in inspected seed/E2E setup.
- Existing product test data: seed data includes `reviewed` and `verified`
  products, but no seeded `unverified` product was found.
- Existing tests: unit/source-level tests cover admin authorization, admin API
  contracts, admin product client behavior, UI source/state coverage, and the
  `/admin/:path*` proxy matcher. No admin product review E2E spec was found.

## Browser Smoke Results

| Area | Scenario | Status | Evidence / Notes |
|---|---|---|---|
| Auth | Unauthenticated user blocked or redirected | FAIL | Chrome opened `http://localhost:3000/admin/products`; network showed `GET /admin/products` 307 to `/api/auth/signin?...`, then sign-in returned 500 with visible "Server error". Admin product data was not visible. |
| Auth | Non-admin cannot view admin product data | BLOCKED | No non-admin demo account was available for this local browser smoke. |
| Admin | Admin can access `/admin/products` | BLOCKED | No admin demo account was available for this local browser smoke. |
| Admin | Admin can view products across statuses | BLOCKED | Admin account was not available, and no seeded `unverified` product was found. |
| UI | Search works without crash | BLOCKED | Requires admin page access; admin account was not available. |
| UI | Status filter works without crash | BLOCKED | Requires admin page access; admin account was not available. |
| Workflow | Admin can update `verificationStatus` | BLOCKED | Requires admin account and safe demo product data. No product status was changed. |
| UI State | Loading state acceptable | NOT VERIFIED | Admin product review UI did not load because authenticated admin access was unavailable. |
| UI State | Empty state acceptable | NOT VERIFIED | Empty state was not observed in browser. |
| UI State | Error state acceptable | NOT VERIFIED | Admin UI error state was not observed; observed failure was Auth.js sign-in 500. |
| Public | Public product list still excludes unverified | NOT VERIFIED | Public side was not browser/API verified after an admin update because no admin update was performed. Unit tests still passed separately. |
| Browser | No serious console errors | FAIL | Browser console recorded a serious 500 resource error for `/api/auth/signin?...`. |
| Network | No critical 500 errors in admin flow | FAIL | Network recorded `GET /api/auth/signin?...` 500. Direct unauthenticated `GET /api/admin/products` returned expected 401. |
| Security | No secret/env exposure in browser | PASS | Visible page text and captured API/body excerpts did not contain checked secret/env patterns such as `MONGODB_URI`, `AUTH_SECRET`, `mongodb://`, or provider secret names with values. |

## Product Status Update Evidence

- Product used: NOT TESTED
- Initial `verificationStatus`: NOT APPLICABLE
- Test update: NOT PERFORMED
- Revert performed: NOT APPLICABLE
- Final `verificationStatus`: NOT APPLICABLE
- Notes: No product status was changed because no admin account and safe
  all-status demo data were available.

## Screenshot / Log Evidence

- Screenshot captured: No
- Screenshot file/name: NOT APPLICABLE
- Sensitive data reviewed: Yes. Browser-visible text and captured response
  excerpts were checked for obvious secret/env exposure; `.env.local` values were
  not read or printed.
- Notes: No screenshot was captured; browser behavior was recorded through
  Playwright output and local dev-server logs. Dev-server logs showed Auth.js
  `MissingSecret` by error type only, without exposing any secret value.

## Validation Results

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 114 test files / 1170 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled then failed with `spawn EPERM`; unsandboxed rerun completed successfully and listed `/admin/products` plus admin API routes. |
| Audit | `npm audit` | NOT RUN | Optional for this smoke evidence task; not run to avoid adding network-dependent validation. |
| Production audit | `npm audit --omit=dev` | NOT RUN | Optional for this smoke evidence task; not run to avoid adding network-dependent validation. |
| E2E | `npm run test:e2e` | NOT RUN | Task scope was targeted browser/manual smoke evidence. No admin E2E spec or admin demo account was available. |

## Issues Found

| Issue | Severity | Area | Reproduction Steps | Expected | Actual | Status | Notes |
|---|---|---|---|---|---|---|---|
| Local unauthenticated admin redirect lands on Auth.js 500 | High | Auth / Local smoke | Start local dev server with current local environment, open `http://localhost:3000/admin/products` in Chrome while unauthenticated. | User is redirected to a usable sign-in page or blocked without exposing admin data and without a 500. | `/admin/products` returned 307 to `/api/auth/signin?...`; sign-in returned 500 and showed "Server error". Logs reported Auth.js `MissingSecret`. | OPEN / DOCUMENTED | Likely local environment configuration issue. Do not commit real secrets; configure `AUTH_SECRET` locally/deployment-side and rerun smoke. |
| Repeatable admin browser smoke data is missing | Medium | QA data / Browser smoke | Inspect E2E seed/auth helpers and product seed data. Try to run admin/non-admin smoke without private credentials. | Repeatable local smoke has seeded admin and non-admin demo accounts plus products in `unverified`, `reviewed`, and `verified` states. | E2E setup provides a regular `e2e-user`; no seeded admin account found. Seed products are `reviewed`/`verified`; no seeded `unverified` product found. | FOLLOW-UP REQUIRED | Add safe repeatable admin/non-admin smoke data before claiming admin workflow PASS in browser. |

## Changes Made

- Added this v1.46 browser smoke evidence file.
- Updated scoped status docs to record the v1.46 local browser smoke result,
  validation commands, production smoke boundary, and follow-up needs.

## Known Limitations

- Production/deployed URL smoke was not performed.
- The authenticated admin workflow was not browser-verified because no admin
  demo account was available.
- Non-admin browser access was not verified because no repeatable non-admin demo
  account was available in the local smoke setup.
- Product list/search/filter/update workflow was not browser-verified because
  admin access was blocked by missing test account/data.
- No `verificationStatus` update was performed.
- No global admin navigation link by design.
- No full product CRUD.
- No image upload.
- No marketplace/payment.
- No real AI provider.
- No production-ready claim.

## Final Decision

- Ready for portfolio demo: Conditional. Code validation passes, but the admin
  product review browser demo is blocked until local Auth.js secret
  configuration and repeatable admin/non-admin smoke data are available.
- Ready for production deployment: Not claimed.
- Production-ready claimed: No.
- Reason: Local browser smoke found an unauthenticated sign-in 500 caused by
  Auth.js `MissingSecret`, authenticated admin workflow was not verified, and no
  deployed URL smoke was performed.

## Recommended Next Task

MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix:
configure safe local/demo auth prerequisites, add repeatable admin/non-admin
smoke accounts and one `unverified` demo product in a test-safe seed path, then
rerun local and deployed browser smoke without adding full admin CRUD.
