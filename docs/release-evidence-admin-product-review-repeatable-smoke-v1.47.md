# MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix

Date: 2026-06-16

Author/tool: Codex local automation

## Scope

- Fix the repeatable local browser smoke prerequisites for `/admin/products`.
- Keep admin auth based on existing `AppUserProfile.role`.
- Add local/E2E-only admin and non-admin smoke accounts.
- Add safe repeatable `unverified` product data for admin review smoke.
- Verify unauthenticated, non-admin, and admin browser behavior.
- Verify search, status filter, `verificationStatus` update, revert, public
  visibility, console/network, and no browser-visible secret exposure.
- Do not add full admin CRUD, production backdoors, marketplace/payment,
  image upload, real AI provider integration, medical diagnosis, skin score, or
  production-ready claims.

## Baseline

v1.46 status summary:

- Local `/admin/products` browser smoke was FAIL / BLOCKED / NOT VERIFIED.
- Unauthenticated access redirected to Auth.js sign-in, but local sign-in
  returned 500 because Auth.js reported `MissingSecret`.
- Admin workflow was BLOCKED because no repeatable admin smoke account existed.
- Non-admin protection was BLOCKED because no repeatable non-admin smoke account
  was available for admin-route smoke.
- Product review workflow was BLOCKED because no seeded `unverified` product was
  available.
- Public product visibility regression was NOT browser-verified.
- Deployed URL smoke was NOT RUN.

Why v1.47 was needed:

- The admin product review UI/API existed from v1.44-v1.45, but the browser
  workflow could not be honestly claimed PASS until local auth, test accounts,
  and product status seed data were repeatable.

Known blockers addressed:

- E2E/browser smoke now runs with a safe test `AUTH_SECRET` through existing
  Playwright config.
- E2E-only credentials providers now support regular and admin smoke users only
  when `APP_ENV="test"` and `E2E_TEST_AUTH="true"`.
- E2E seed now idempotently upserts `e2e-user` as `USER`, `e2e-admin` as
  `ADMIN`, and a dedicated `unverified` smoke product.
- Browser smoke now verifies unauthenticated, non-admin, and admin paths.

## Files Changed

- `.env.example`: documents how to generate a local `AUTH_SECRET` and adds
  safe E2E admin account placeholder variables.
- `playwright.config.ts`: passes safe E2E admin env values and optionally uses
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for environments without bundled
  Playwright browsers.
- `src/config/env.ts`: adds default E2E admin env parsing.
- `src/modules/auth/auth.config.ts`: adds an E2E-only admin credentials provider
  gated by `APP_ENV="test"` and `E2E_TEST_AUTH=true`.
- `src/modules/auth/types.ts`: extends auth environment typing for E2E admin
  env values.
- `scripts/seed-e2e.ts`: idempotently seeds smoke user/admin profiles and a
  dedicated `unverified` admin smoke product in the safe E2E database.
- `src/modules/products/components/admin-product-review.tsx`: adds stable
  `data-testid` hooks for admin review selects used by browser smoke.
- `tests/e2e/helpers/test-data.ts`: adds stable E2E admin and admin-smoke
  product identifiers.
- `tests/e2e/helpers/auth.ts`: adds `loginAsE2EAdmin()` using the E2E-only
  admin provider.
- `tests/e2e/global-setup.ts`: passes E2E admin env values during Playwright
  seeding.
- `tests/e2e/admin-product-review.smoke.spec.ts`: adds repeatable browser smoke
  coverage for `/admin/products`.
- `tests/unit/auth-config.test.ts`: covers E2E-only admin provider behavior and
  confirms it is not enabled outside test mode.
- `tests/unit/env.test.ts`: covers default E2E admin env values.
- `docs/release-evidence-admin-product-review-repeatable-smoke-v1.47.md`:
  records this evidence.
- Status docs: updated to reference v1.47 local smoke PASS and deployed smoke
  NOT RUN.

## Auth Fix Summary

- Auth.js / NextAuth version/config style found: `next-auth` v5 beta style using
  `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.
- Required local env variables for normal local auth: `AUTH_SECRET`, `AUTH_URL`,
  and OAuth/database values as needed by the chosen local setup.
- What changed: E2E/browser smoke now uses the existing Playwright safe test env
  with `AUTH_SECRET` set, so `/api/auth/signin` no longer returns the v1.46
  `MissingSecret` 500 during automated local smoke. `.env.example` now documents
  a local command for developers to generate their own `AUTH_SECRET`.
- Whether MissingSecret is resolved locally: PASS for the automated local
  Playwright smoke environment. Manual `npm run dev` still requires the
  developer to set their own local `AUTH_SECRET` in `.env.local`.
- Confirmation that no real secret was committed: PASS. Only placeholder or
  test-only values are documented/used.

## Smoke Account Summary

- Admin smoke account exists: Yes.
- Non-admin smoke account exists: Yes.
- Where seeded/documented: `tests/e2e/helpers/test-data.ts`,
  `src/modules/auth/auth.config.ts`, and `scripts/seed-e2e.ts`.
- Admin account identifier: `e2e-admin` / `e2e-admin@skinwise.test`.
- Non-admin account identifier: `e2e-user` / `e2e-user@skinwise.test`.
- Passwords/secrets: None. E2E test credentials provider is passwordless and
  exists only in `APP_ENV="test"` with `E2E_TEST_AUTH="true"`.

## Seed Data Summary

- Unverified product exists: Yes.
- Reviewed product exists: Yes, from the existing seed catalogue.
- Verified product exists: Yes, from the existing seed catalogue.
- Seed idempotency confirmed: Yes. The E2E seed ran repeatedly during targeted
  and full Playwright runs without duplicate product/user creation.
- Product identifiers used for smoke testing:
  - Brand: `SkinWise Smoke`
  - Name: `Admin Smoke Pending Review Gel`
  - Initial `verificationStatus`: `unverified`
  - Source: `user_submitted`

## Browser Smoke Results

| Area | Scenario | Status | Evidence / Notes |
|---|---|---|---|
| Auth | Unauthenticated user blocked or redirected cleanly | PASS | Playwright opened `/admin/products`; user was redirected to `/api/auth/signin` with callback URL and did not see admin product data. |
| Auth | No Auth.js / NextAuth 500 in unauthenticated flow | PASS | Targeted admin smoke and full E2E passed; no critical sign-in 500 occurred. |
| Auth | Non-admin cannot view admin product data | PASS | `e2e-user` saw `Admin access required`; `GET /api/admin/products` returned 403; smoke product was not visible. |
| Admin | Admin can access `/admin/products` | PASS | `e2e-admin` loaded the page and saw `Admin Product Review`. |
| Admin | Admin can view product review list | PASS | `admin-product-review-list` was visible for admin. |
| Admin | Admin can see unverified product | PASS | Admin saw `Admin Smoke Pending Review Gel` with `Pending review`. |
| UI | Search works without crash | PASS | Search for the smoke product returned the product; no-match search rendered the empty state. |
| UI | Status filter works without crash | PASS | Status filter to `Pending review` returned the smoke product after Search. |
| Workflow | Admin can update `verificationStatus` | PASS | Admin changed the smoke product from `unverified` to `reviewed` through the UI; PATCH returned OK. |
| Workflow | Update reverted or isolated safely | PASS | Test reverted the product to `unverified` and confirmed final state by admin API. |
| Public | Public product list excludes unverified product | PASS | Authenticated public `GET /api/products?limit=50` did not include the smoke product and returned no `unverified` products. |
| Browser | No serious console errors | PASS | Admin browser smoke collected no console errors or page errors in the tested admin flow. |
| Network | No critical network 500 errors | PASS | Tested admin/public API routes had no critical 500 responses in the admin flow. |
| Security | No secret/env exposure in browser | PASS | Admin page body did not include checked secret/env patterns such as `AUTH_SECRET`, `MONGODB_URI`, `mongodb://`, or provider secret names. |

## Product Status Update Evidence

- Product used: `SkinWise Smoke / Admin Smoke Pending Review Gel`
- Initial `verificationStatus`: `unverified`
- Test update `verificationStatus`: `reviewed`
- Revert performed: Yes
- Final `verificationStatus`: `unverified`
- Notes: The test also includes a final API safety check that reverts to
  `unverified` if an assertion fails after the update.

## Local Validation Results

| Check | Command | Status | Notes |
|---|---|---|---|
| Targeted unit tests | `npm run test -- tests/unit/auth-config.test.ts tests/unit/env.test.ts tests/unit/admin-product-review-ui.test.ts` | PASS | 3 files / 46 tests passed. |
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Targeted browser smoke | `npm run test:e2e -- tests/e2e/admin-product-review.smoke.spec.ts` with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` set to local Chrome | PASS | 3 admin smoke tests passed. |
| Full E2E | `npm run test:e2e` with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` set to local Chrome | PASS | 34 Playwright tests passed. |
| Unit tests | `npm run test` | PASS | 114 test files / 1171 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled but failed with `spawn EPERM`; elevated rerun completed successfully and listed `/admin/products` plus the admin API routes. |

## Deployed Smoke Result

- Deployed URL tested: No
- URL or environment name: NOT RUN
- Result: NOT RUN
- Notes: This task verified local browser smoke only. Production/deployed URL
  smoke was not performed, so production-ready status is not claimed.

## Issues Found

| Issue | Severity | Area | Reproduction Steps | Expected | Actual | Status | Notes |
|---|---|---|---|---|---|---|---|
| E2E smoke seed initially ran after `seedDemoData()` closed the shared Mongo client | Medium | E2E seed | Run targeted admin Playwright smoke after adding smoke seed after `seedDemoData()`. | E2E seed should upsert smoke profiles/product and then run tests. | Seed failed with `Client must be connected before running operations`. | FIXED | Seed order changed to upsert smoke profiles/product before `seedDemoData()` closes the client. |
| Admin smoke assertion initially used broad `Pending review` text | Low | E2E selector | Run targeted admin Playwright smoke. | Assertion should target the smoke product row. | Strict mode found multiple `Pending review` matches. | FIXED | Assertion now scopes to the smoke product row. |
| Status filter test initially expected filter API request on dropdown change | Low | E2E workflow | Select status filter in admin UI. | Test should follow UI behavior: select filter then click Search. | Test timed out waiting for API response. | FIXED | Test now clicks Search after selecting status filter. |

## Remaining Risks

- Deployed/production smoke was not run.
- Manual `npm run dev` still depends on the developer setting a local
  `AUTH_SECRET` in `.env.local`; `.env.example` documents how to generate one.
- The admin smoke account is intentionally E2E/local-only and must not be used
  as a production access pattern.

## Final Decision

- MVP v1.47 status: DONE
- Ready for portfolio demo: Yes, based on local browser smoke.
- Ready for production deployment: No
- Production-ready claimed: No
- Reason: Local repeatable admin product review browser smoke passed, but no
  deployed URL smoke was performed.

## Recommended Next Task

MVP v1.48 - Deployed Admin Product Review Smoke Verification.

Run the v1.47 admin product review smoke checklist against a deployed URL with
safe demo credentials, record browser/network/console evidence, and keep
production-ready status unclaimed until deployed smoke passes.
