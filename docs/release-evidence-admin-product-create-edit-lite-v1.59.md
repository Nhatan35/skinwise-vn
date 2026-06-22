# MVP v1.59 — Admin Product Create/Edit Lite Release Evidence

## Scope

MVP v1.59 adds admin-only product create/edit lite to the existing `/admin/products` workflow.

Implemented scope:

- Admin can create a product from `/admin/products`.
- Admin can edit existing product content from the admin product list.
- Product create/edit supports name, brand, category, price range, ingredients text, key actives, tags, warnings, skin types, concerns, suitable-for, not-recommended-for, and verification status.
- New admin-created products use `source = "admin"`.
- New admin-created products default to `verificationStatus = "unverified"` when no status is provided.
- Existing `PATCH /api/admin/products/[id]/verification-status` remains the status-only review route.
- Public product visibility remains limited to `reviewed` and `verified` products.

## Files changed

Product/admin implementation:

- `src/modules/products/product.schema.ts`
- `src/modules/products/product.repository.ts`
- `src/modules/products/product.use-case.ts`
- `src/modules/products/admin-product.client.ts`
- `src/modules/products/components/admin-product-form.tsx`
- `src/modules/products/components/admin-product-review.tsx`
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/products/[id]/route.ts`
- `src/app/admin/products/page.tsx`

Tests and E2E:

- `tests/unit/product.test.ts`
- `tests/unit/product-use-case.test.ts`
- `tests/unit/admin-product-api-contract.test.ts`
- `tests/unit/admin-product-client.test.ts`
- `tests/unit/admin-product-review-ui.test.ts`
- `tests/e2e/admin-product-review.smoke.spec.ts`
- `tests/e2e/helpers/test-data.ts`
- `scripts/seed-e2e.ts`

Documentation:

- `README.md`
- `docs/02-user-stories.md`
- `docs/04-data-model.md`
- `docs/05-api-contract.md`
- `docs/09-release-plan.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/release-evidence-admin-product-create-edit-lite-v1.59.md`

## Behavior added

- Admin product create flow:
  - `Create Product` action opens an inline form.
  - Required client-side feedback is shown for missing name, brand, category, price range, and ingredients text.
  - Successful create inserts the new product into the admin list and closes the form.
  - Server-side create validation is authoritative.

- Admin product edit flow:
  - Each admin product row has an `Edit` action.
  - Edit mode pre-fills the current product data.
  - Successful save updates the admin list without removing current search/filter state.
  - Existing verification status selector still works separately.

## API changes

- Added `POST /api/admin/products`.
- Added `PATCH /api/admin/products/[id]`.
- Preserved `GET /api/admin/products`.
- Preserved `PATCH /api/admin/products/[id]/verification-status` as the dedicated status-only route.

API security and validation:

- Requires authentication.
- Requires `AppUserProfile.role = "ADMIN"`.
- Rejects unauthenticated users with `UNAUTHORIZED`.
- Rejects non-admin users with `FORBIDDEN`.
- Rejects invalid request bodies and route params with `VALIDATION_ERROR`.
- Rejects missing edited product with `NOT_FOUND`.
- Rejects direct writes to `_id`, `id`, `source`, `createdByUserId`, `createdAt`, and `updatedAt`.
- Product DTO responses continue to omit `source` and `createdByUserId`.

## Security and permission behavior

- Admin product create/edit APIs require an authenticated admin profile.
- Non-admin and unauthenticated users are blocked before product mutations.
- Server-side validation rejects internal field writes such as `_id`, `id`, `source`, `createdByUserId`, `createdAt`, and `updatedAt`.
- The create use case owns `source = "admin"` and derives `createdByUserId` from the authenticated admin profile when available.
- Product DTO responses continue to omit `source`, `createdByUserId`, raw `ObjectId` values, and MongoDB internals.
- Public product list/detail flows continue to use the reviewed/verified visibility filter.

## UI changes

- `/admin/products` now includes:
  - `Create Product` button.
  - Inline create/edit product form.
  - `Edit` action per product row.
  - Saving state.
  - Success feedback.
  - Error feedback.
  - Field validation feedback.

Vietnamese product-form copy was added for:

- `Tạo sản phẩm`
- `Chỉnh sửa sản phẩm`
- `Lưu sản phẩm`
- `Hủy`
- `Tên sản phẩm`
- `Thương hiệu`
- `Danh mục`
- `Khoảng giá`
- `Thành phần`
- `Hoạt chất chính`
- `Thẻ`
- `Cảnh báo`
- `Loại da phù hợp`
- `Mối quan tâm da`
- `Phù hợp với`
- `Không khuyến nghị cho`
- `Trạng thái kiểm duyệt`
- `Tạo sản phẩm thành công`
- `Cập nhật sản phẩm thành công`
- `Không thể lưu sản phẩm`

## Tests added/updated

Unit/API/client/UI:

- `adminCreateProductBodySchema` accepts valid payloads.
- `adminCreateProductBodySchema` rejects empty name and brand.
- `adminCreateProductBodySchema` rejects invalid enum values.
- `adminCreateProductBodySchema` defaults `verificationStatus` to `unverified`.
- `adminCreateProductBodySchema` rejects internal fields.
- `adminUpdateProductBodySchema` accepts valid partial updates.
- `adminUpdateProductBodySchema` rejects invalid enum values.
- `adminUpdateProductBodySchema` rejects internal fields.
- Admin product create use case sets `source = "admin"` and uses the server-provided admin profile ObjectId when supplied.
- Admin product update use case preserves omitted fields through partial repository update.
- Admin API create/update success paths are covered.
- Admin API unauthenticated and non-admin access are covered.
- Existing status-only verification route remains covered.
- Admin client create/update helpers are covered.
- Admin UI source contract covers create form, edit form, success state, error/validation state, and out-of-scope exclusions.

E2E:

- Extended admin product smoke coverage:
  - admin creates an unverified product;
  - product appears in the admin list;
  - unverified product does not appear in public catalogue;
  - admin edits product content;
  - admin changes status to reviewed;
  - reviewed product appears in public catalogue;
  - final status is reset to unverified to keep E2E data repeatable.

## Validation results

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 117 test files / 1298 tests
npm run build: PASS after elevated rerun
npm run test:e2e: PASS after elevated rerun - 36/36 tests
npm audit --omit=dev --audit-level=moderate: PASS - found 0 vulnerabilities
```

Validation notes:

- `npm run build` first compiled successfully in the sandbox and then failed with `spawn EPERM`; the elevated rerun passed.
- `npm run test:e2e` failed immediately in the sandbox with `spawn EPERM`; the elevated rerun passed with 36/36 Playwright tests.

## Known limitations

- This is create/edit lite, not a full admin CMS.
- Admin product delete is not implemented.
- Product image upload and image management are not implemented.
- Full ingredient CRUD is not implemented.
- User-submitted product approval expansion is not implemented.
- Deployed v1.48 admin product review smoke evidence remains incomplete.

## Out of scope

- Product hard delete.
- Soft delete.
- Image upload.
- Image management.
- Full ingredient CRUD.
- Ingredient merge/deduplication.
- Marketplace.
- Seller portal.
- Cart.
- Checkout.
- Payment.
- User-submitted product approval flow expansion.
- AI-generated product content.
- AI ingredient analysis.
- Medical diagnosis.
- Treatment recommendation.
- Doctor or clinic workflow.
- Production-ready claim.

## Production readiness note

This feature does not claim production-ready status because MVP v1.48 deployed admin product review smoke evidence remains incomplete.
