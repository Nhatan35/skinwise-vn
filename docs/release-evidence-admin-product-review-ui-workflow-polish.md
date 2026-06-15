# Admin Product Review UI & Workflow Polish

## Purpose

MVP v1.45 adds a lightweight admin UI workflow for reviewing product catalogue
visibility through `verificationStatus`.

This milestone builds on the v1.44 admin API foundation. It does not add a full
admin dashboard, product create/edit CRUD, hard delete, `isActive`,
marketplace/payment, image upload, real AI provider integration, or production
readiness claims.

## Scope

- Admin product review UI at `/admin/products`.
- Admin route protection and access-boundary UX.
- Product list display for admin review.
- `verificationStatus` update workflow.
- Loading, empty, error, and unauthorized states.
- Admin product client for the v1.44 admin API routes.
- Public product catalogue compatibility.
- Unit/source-level UI test evidence.

## Current State Found

- Existing admin API: `GET /api/admin/products` and
  `PATCH /api/admin/products/[id]/verification-status`.
- Existing admin UI: no admin product review route or client UI existed before
  v1.45.
- Existing app route convention: protected user app routes are handled through
  route groups and `src/proxy.ts`; dashboard navigation is static.
- Existing proxy/matcher: protected app routes were listed, but
  `"/admin/:path*"` was not present before v1.45.
- Existing auth/current user behavior: `getCurrentUser()` maps Auth.js session
  data without role; `/api/me` exposes `MeUserDto.role`; `requireAdminUser()`
  checks `AppUserProfile.role === "ADMIN"` server-side.
- Existing navigation behavior: dashboard nav was not role-aware, so v1.45 does
  not add a global admin navigation link.
- Existing UI components: shared `LoadingState`, `EmptyState`, `ErrorState`,
  cards, buttons, inputs, badges, and selects existed.
- Existing tests: admin authorization/API contract tests, public product API and
  product client/UI tests, dashboard route/proxy tests, and source-level UI tests
  existed. React Testing Library was not present in dependencies.

## Changes Made

- `src/app/admin/products/page.tsx`: added protected direct admin product review
  page with server-side `requireAdminUser()` guard, Auth.js sign-in redirect for
  unauthenticated users, and unauthorized state for non-admin users.
- `src/proxy.ts`: added `"/admin/:path*"` to protected matcher coverage.
- `src/shared/constants/routes.ts`: added `routes.ADMIN_PRODUCTS`.
- `src/modules/products/admin-product.client.ts`: added client-safe admin API
  helper for listing admin products and updating `verificationStatus`.
- `src/modules/products/components/admin-product-review.tsx`: added client UI
  for search/status filtering, all-status product display, status update,
  pending feedback, success/error feedback, loading, empty, error, and
  unauthorized states.
- `tests/unit/admin-product-client.test.ts`: added fetch-client tests for admin
  list/update paths, error handling, invalid status rejection, and server-only
  import boundaries.
- `tests/unit/admin-product-review-ui.test.ts`: added source-level route/UI
  tests for guard behavior, admin client usage, states, labels, no global admin
  nav link, and scope exclusions.
- `tests/unit/auth-middleware.test.ts`: updated protected route matcher evidence
  for `"/admin/:path*"`.
- README and scoped docs: synchronized v1.45 status, route map, test plan,
  backlog, feature matrix, and release plan.

## Acceptance Criteria

| Criteria | Status | Notes |
|---|---|---|
| Admin can access product review UI through protected route | PASS | `/admin/products` exists, is dynamic, protected by proxy matcher, and guarded by `requireAdminUser()`. |
| Non-admin cannot view admin product data and sees unauthorized state | PASS | Server page catches `AdminPermissionRequiredError`; client UI also handles API 403. |
| Unauthenticated user is redirected or blocked by existing convention | PASS | Server page redirects to `/api/auth/signin?callbackUrl=/admin/products`; proxy also protects `/admin/:path*`. |
| /admin route protection or equivalent guard is documented | PASS | `src/proxy.ts`, tests, route map, and this evidence file document it. |
| Admin can view products across verification statuses | PASS | Admin client calls `GET /api/admin/products`; UI default list has no status filter. |
| Admin can update verificationStatus from UI | PASS | UI select calls `updateAdminProductVerificationStatus()` and updates local row state from returned product. |
| Loading state is handled | PASS | `LoadingState` renders while admin list fetch is pending. |
| Empty state is handled | PASS | `EmptyState` renders for empty all-status and filtered results. |
| API error state is handled | PASS | `ErrorState` renders for non-auth API/load errors with retry. |
| Unauthorized state is handled | PASS | Dedicated admin access required state exists in page and client UI. |
| Public product visibility remains unchanged | PASS | Public product client/routes were not changed; public visibility tests still pass in full unit suite. |
| No global admin nav link is exposed to non-admin users | PASS | Dashboard navigation remains static and does not include `routes.ADMIN_PRODUCTS`. |
| No full CRUD added outside scope | PASS | No product create/edit/delete UI or API behavior added. |
| No production-ready claim added | PASS | Production readiness remains not claimed for v1.45. |

## Validation Results

| Check | Command | Status | Notes |
|---|---|---|---|
| Targeted unit tests | `npm run test -- tests/unit/admin-product-client.test.ts tests/unit/admin-product-review-ui.test.ts tests/unit/auth-middleware.test.ts` | PASS | 3 test files / 18 tests passed after fixing a source-string assertion. |
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | Initial test type assertion failed, then passed after narrowing the test comparison to a string route. |
| Unit tests | `npm run test` | PASS | 114 test files / 1170 tests passed. |
| Build | `npm run build` | PASS | Sandboxed build compiled then failed with `spawn EPERM`; unsandboxed rerun passed and listed `/admin/products`. |

## Important Test Output

- Targeted tests: 3 test files passed, 18 tests passed.
- Full unit tests: 114 test files passed, 1170 tests passed.
- Build output included dynamic route `/admin/products`.
- Sandboxed build failure summary: `Error: spawn EPERM` after successful compile.
- Unsandboxed build rerun: completed successfully.

## Known Limitations

- No full product create/edit CRUD.
- No product hard delete.
- No `isActive`.
- No image upload.
- No marketplace/payment.
- No real AI provider.
- No production smoke test in this task.
- No bulk moderation workflow.
- No global admin nav link; v1.45 uses direct URL `/admin/products` because the
  existing dashboard navigation is not role-aware.
- UI interaction is covered by source-level and client tests, not React Testing
  Library click tests, because React Testing Library is not part of the current
  dependency setup.

## Final Decision

- Ready for portfolio demo: YES for local/demo use with an admin account and
  direct URL `/admin/products`.
- Ready for production deployment: NOT CLAIMED.
- Production-ready claimed: NO.
- Follow-up recommended: MVP v1.46 - Admin Product Review Browser Smoke &
  Deployment Evidence.
