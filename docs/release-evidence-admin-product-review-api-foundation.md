# Admin Product Review API Foundation

## Purpose

MVP v1.44 adds a small admin-only foundation for reviewing product catalogue
visibility through `verificationStatus`.

This milestone is intended to improve product operational readiness without
adding a full admin dashboard, marketplace/payment, image upload, real AI
provider integration, product hard delete, `isActive`, skin scoring, medical
diagnosis, or medical claims.

## Scope

- Admin authorization helper.
- Admin product list foundation.
- Admin `verificationStatus` update foundation.
- Product visibility validation.
- Public product catalogue compatibility.
- Product match compatibility.
- Saved products compatibility.
- Routine builder compatibility.
- Unit/API test evidence.

## Validation Environment

- Date: 2026-06-15T13:41:00.3370379+07:00
- OS: Microsoft Windows NT 10.0.26200.0
- Node: v24.14.0
- npm: 11.14.1
- Shell: PowerShell
- Workspace: `C:\projects\skinwise-vn`

## Current State Found

- Existing product model: `ProductDocument` includes `name`, `brand`,
  `category`, `priceRange`, `ingredientsText`, `keyActives`, `tags`,
  `warnings`, `skinTypes`, `concerns`, `suitableFor`, `notRecommendedFor`,
  `source`, `verificationStatus`, optional `createdByUserId`, `createdAt`, and
  `updatedAt`.
- Existing product visibility rule: public visibility is based on
  `verificationStatus` in `["reviewed", "verified"]`; `unverified` is hidden.
- Existing public product APIs: `GET /api/products` uses
  `searchVisibleProducts`; `GET /api/products/[id]` uses
  `findVisibleProductById`.
- Existing admin routes: none under `src/app/api/admin` before v1.44.
- Existing role model: `AppUserProfile.role` supports `USER` and `ADMIN`.
- Existing auth/current user behavior: `getCurrentUser()` returns session user
  id/email/name/image only and does not expose role.
- Existing product match behavior: catalogue match uses
  `listVisibleProductsForMatching`; single-product match uses
  `findVisibleProductById`.
- Existing saved products behavior: saved product listing skips missing or
  hidden products through public `getProductById`; metadata update returns null
  if the linked product is no longer visible.
- Existing routine builder behavior: routine builder loads `/api/products?limit=50`
  and `/api/saved-products`, then merges DTOs with `buildRoutineProductOptions`.
- Existing tests: product visibility, product API contract, product match,
  saved product missing-product handling, routine product options, AppUserProfile
  roles, and `/api/me` role mapping already existed before v1.44.

## Changes Made

- `src/modules/auth/require-admin-user.ts`: added an admin authorization helper
  that uses `getCurrentUser()` plus `AppUserProfile.role`.
- `src/modules/products/product.schema.ts`: added admin list query, product id
  route param, and verificationStatus update body validation.
- `src/modules/products/product.repository.ts`: added admin all-status search,
  admin find-by-id, and verificationStatus update functions while preserving
  public visible filters.
- `src/modules/products/product.use-case.ts`: added admin product list/find/update
  use-case wrappers.
- `src/app/api/admin/products/route.ts`: added `GET /api/admin/products`.
- `src/app/api/admin/products/[id]/verification-status/route.ts`: added
  `PATCH /api/admin/products/[id]/verification-status`.
- `tests/unit/admin-authorization.test.ts`: added admin helper tests.
- `tests/unit/admin-product-api-contract.test.ts`: added admin API contract
  tests.
- `tests/unit/product.test.ts`: added admin schema/repository tests and kept
  public visibility tests.
- `tests/unit/product-use-case.test.ts`: added admin use-case tests.
- README and docs: updated status/API/data/security/test/release docs for v1.44
  without claiming production readiness.

## Acceptance Criteria

| Criteria | Status | Notes |
|---|---|---|
| Admin can list all products including unverified | PASS | Covered by admin API contract and admin repository tests. |
| Non-admin is blocked from admin product list | PASS | `GET /api/admin/products` returns `FORBIDDEN` for `USER`. |
| Unauthenticated user is blocked from admin product list | PASS | `GET /api/admin/products` returns `UNAUTHORIZED`. |
| Admin can update verificationStatus | PASS | `PATCH /api/admin/products/[id]/verification-status` updates only status. |
| Non-admin is blocked from verificationStatus update | PASS | PATCH route returns `FORBIDDEN` for `USER`. |
| Invalid verificationStatus is rejected | PASS | Strict Zod body validation rejects invalid and internal fields. |
| Missing product returns 404 | PASS | PATCH route returns `NOT_FOUND` when update use case returns null. |
| Public list still excludes unverified products | PASS | Existing public repository/use-case/API tests remain passing. |
| Public detail still excludes unverified products | PASS | Existing product API contract covers invalid/missing/not-visible as `NOT_FOUND`. |
| Product match still excludes unverified products | PASS | Product Match use case/repository tests verify visible product helpers. |
| Saved products handles hidden/missing products safely | PASS | Saved product use-case tests verify missing products are skipped/null. |
| Routine builder remains stable | PASS | Routine product options tests remain passing. |

## Validation Results

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 112 test files / 1157 tests passed. |
| Build | `npm run build` | PASS | Sandboxed build compiled then failed with `spawn EPERM`; unsandboxed rerun completed successfully. |

## Important Test Output

Focused related tests:

```txt
npm run test -- tests/unit/admin-authorization.test.ts tests/unit/admin-product-api-contract.test.ts tests/unit/product.test.ts tests/unit/product-use-case.test.ts tests/unit/product-match-use-case.test.ts tests/unit/saved-product-use-case.test.ts tests/unit/routine-product-options.test.ts
Test Files  7 passed (7)
Tests       66 passed (66)
```

Full unit tests:

```txt
npm run test
Test Files  112 passed (112)
Tests       1157 passed (1157)
Duration    5.27s
```

Build:

```txt
npm run build: sandboxed run compiled successfully, then failed with spawn EPERM
npm run build: unsandboxed rerun PASS
Generated static pages using 15 workers (21/21)
New admin routes included:
/api/admin/products
/api/admin/products/[id]/verification-status
```

## Known Limitations

- No full admin UI in this task.
- No product create/edit full CRUD in this task.
- No product hard delete action.
- No `isActive`; visibility remains based on `verificationStatus`.
- No image upload.
- No marketplace/payment.
- No real AI provider.
- No production smoke test in this task.
- No E2E rerun in this task; v1.43 E2E evidence remains historical local PASS.
- Production-ready status is not claimed.

## Final Decision

- Ready for portfolio demo: Yes, for an admin API foundation demo with local
  validation evidence and documented limitations.
- Ready for production deployment: Conditional; local build passed, but no fresh
  deployed-URL smoke test was performed for v1.44.
- Production-ready claimed: No.
- Follow-up recommended: MVP v1.45 - Admin Product Review UI & Workflow Polish.
