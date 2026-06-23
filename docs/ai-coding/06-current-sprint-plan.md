# Current Sprint Plan

Current active milestone:
MVP v1.48 - Deployed Admin Product Review Smoke Verification

Current status:
MVP v1.62 Admin Content Dashboard Lite has been implemented as a controlled
post-MVP admin feature. It adds protected `/admin` with read-only product and
ingredient catalogue summary cards plus links to `/admin/products` and
`/admin/ingredients`. It preserves existing admin product/ingredient behavior,
public product and ingredient behavior, schema, ingredient explanation,
saved-products, user dashboard, Product Match, Routine Safety, and production
readiness boundaries.
MVP v1.60 Admin Ingredient Create/Edit Lite has been implemented as a controlled
post-MVP admin feature. It adds admin-only ingredient list/create/edit lite on
`/admin/ingredients`, keeps user-facing Ingredient Library, Ingredient Detail,
and Ingredient Explanation flows unchanged, prevents duplicate normalized INCI
names, and avoids ingredient delete, merge/deduplication, bulk import, image
upload, Product-to-Ingredient mapping, real AI generation, medical claims, or
production-ready claims. Local validation for v1.60 is recorded in its release
evidence.
MVP v1.59 Admin Product Create/Edit Lite has been implemented as a controlled
post-MVP admin feature. It adds admin-only product create/edit lite on
`/admin/products`, preserves the status-only
`PATCH /api/admin/products/[id]/verification-status` workflow, keeps public
catalogue visibility limited to reviewed/verified products, and avoids hard
delete, image upload, full CMS, marketplace/payment, real AI generation, or
production-ready claims. Local validation for v1.59 is recorded in its release
evidence.
MVP v1.55 Saved Product Review Reason Indicators has been implemented as a
post-MVP feature. It reuses existing saved product metadata and shared
review-needed logic without a schema change, saved-product mutation, AI call,
Product Match scoring change, Routine Safety Engine change, routing refactor,
new sorting behavior, new filters, API contract change, or admin workflow
change. Local validation for v1.55 is recorded in its release evidence.
MVP v1.54 Saved Products Review Queue Filters has been implemented as a
post-MVP feature. It reuses existing saved product metadata and shared
review-needed logic without a schema change, saved-product mutation, AI call,
Product Match scoring change, Routine Safety Engine change, routing refactor,
new sorting behavior, or admin workflow change. Local validation for v1.54 is
recorded in its release evidence.
MVP v1.53 Dashboard Saved Product Decision Queue Summary has been implemented as a
post-MVP feature. It reuses existing saved product decision metadata and does
not add a schema change, saved-product mutation, AI call, Product Match scoring
change, Routine Safety Engine change, recommendation ranking, or admin workflow
change. Local validation for v1.53 is recorded in its release evidence.
MVP v1.52 Dashboard Saved Product Tags Summary has been implemented as a
post-MVP feature. It reuses existing saved product personal tag data and does
not add a schema change, AI call, Product Match scoring change, recommendation
ranking, or admin workflow change. Local validation for v1.52 is recorded in
its release evidence.
MVP v1.51 Dashboard Routine Coverage Summary has been implemented as a post-MVP
feature. It reuses existing routine coverage review logic and does not add a
schema change, AI call, Product Match scoring change, or Routine Safety Engine
change. Local validation for v1.51 is recorded in its release evidence.
MVP v1.50 Saved Product Personal Tags has been implemented as a post-MVP
feature. Local validation for v1.50 is recorded in its release evidence.
MVP v1.48 deployed smoke evidence remains incomplete, so production-ready is
not claimed.

Latest completed scoped task:
MVP v1.62 - Admin Content Dashboard Lite

Current recommended next work:
1. Complete deployed smoke on the real deployed URL for MVP v1.48.
2. Record evidence in docs/release-evidence-admin-product-review-deployed-smoke-v1.48.md.
3. Select the next post-MVP backlog item only after release evidence stays truthful.

Evidence boundary:
- Latest completed local validation: MVP v1.62 local validation PASS.
- MVP v1.51 validation: DONE / PASS locally.
- MVP v1.52 validation: DONE / PASS locally.
- MVP v1.53 validation: DONE / PASS locally.
- MVP v1.54 validation: DONE / PASS locally.
- MVP v1.55 validation: DONE / PASS locally.
- MVP v1.59 validation: DONE / PASS locally.
- MVP v1.60 validation: DONE / PASS locally.
- MVP v1.62 validation: DONE / PASS locally.
- Deployed smoke: NOT RUN / INCOMPLETE.
- Production-ready claimed: No.
- MVP v1.50-v1.62 do not claim production-ready because v1.48 deployed smoke remains open.

## MVP v1.62 - Admin Content Dashboard Lite

Status: DONE / PASS locally

Scope:
- Add protected `/admin` for ADMIN users.
- Show Product summary counts using existing `verificationStatus` values:
  `unverified`, `reviewed`, and `verified`.
- Show total Ingredient count.
- Link to existing `/admin/products` and `/admin/ingredients`.
- Preserve existing admin product and ingredient management behavior.
- Preserve user-facing product and ingredient routes, ingredient explanation,
  saved-products, user dashboard, Product Match, Routine Safety, schema, and
  production-ready boundaries.
- Do not add delete, image upload, bulk import/export, product-to-ingredient
  mapping, marketplace/payment, real AI provider integration, or deployed smoke
  claims.

## MVP v1.60 - Admin Ingredient Create/Edit Lite

Status: DONE / PASS locally

Scope:
- Add protected `/admin/ingredients` for admin ingredient management.
- Add `GET /api/admin/ingredients`, `POST /api/admin/ingredients`, and
  `PATCH /api/admin/ingredients/[id]`.
- Preserve user-facing `/ingredients`, `/ingredients/[id]`,
  `GET /api/ingredients`, `GET /api/ingredients/[id]`, and ingredient
  explanation route behavior.
- Add strict schema validation, duplicate normalized `inciName` prevention,
  repository/use-case support, admin client, UI, unit/API/client/UI/E2E
  coverage, docs, and release evidence.
- Do not add ingredient delete, soft delete, publish/unpublish workflow,
  merge/deduplication, bulk import/export, image upload, Product-to-Ingredient
  relational mapping, AI auto-generation, diagnosis/treatment claims, or
  production-ready claims.

## MVP v1.59 - Admin Product Create/Edit Lite

Status: DONE / PASS locally

Scope:
- Add admin-only product create/edit lite to `/admin/products`.
- Add `POST /api/admin/products` and `PATCH /api/admin/products/[id]`.
- Preserve `PATCH /api/admin/products/[id]/verification-status` as the
  status-only review route.
- Keep public catalogue visibility limited to reviewed/verified products.
- Add schema, repository/use-case, admin client, UI, unit/API/UI/E2E coverage,
  docs, and release evidence.
- Do not add hard delete, image upload, full ingredient CRUD, marketplace,
  payment, real AI generation, diagnosis/treatment claims, or production-ready
  claims.

## MVP v1.55 - Saved Product Review Reason Indicators

Status: DONE / PASS locally

Scope:
- Add display-only review reason indicators to Saved Product cards.
- Reuse existing saved product decision status, planned routine slot, and personal note data.
- Share the review-needed rule with the v1.54 helper.
- Add review reason logic, UI contract, and Saved Products E2E coverage.
- Update docs and release evidence.

## MVP v1.54 - Saved Products Review Queue Filters

Status: DONE / PASS locally

Scope:
- Add review queue filters to Saved Products.
- Reuse existing saved product decision status, planned routine slot, and personal note data.
- Share the review-needed rule with the v1.53 dashboard summary.
- Add filter logic, UI contract, and Saved Products E2E coverage.
- Update docs and release evidence.

## MVP v1.53 - Dashboard Saved Product Decision Queue Summary

Status: DONE / PASS locally

Scope:
- Add saved product decision queue summary to Dashboard.
- Reuse existing saved product decision status, planned routine slot, and personal note data.
- Add dashboard card and tests.
- Update docs and release evidence.

## MVP v1.51 - Dashboard Routine Coverage Summary

Status: DONE / PASS locally

Scope:
- Add routine coverage summary to Dashboard.
- Reuse existing routine coverage review logic.
- Add dashboard card and tests.
- Update docs and release evidence.

## MVP v1.52 - Dashboard Saved Product Tags Summary

Status: DONE / PASS locally

Scope:
- Add saved product personal tags summary to Dashboard.
- Reuse existing saved product personal tag data.
- Add dashboard card and tests.
- Update docs and release evidence.
