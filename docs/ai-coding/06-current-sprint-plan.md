# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-13

## 1. Current Phase

```txt
Post-MVP controlled improvement
```

Status:

```txt
Product implementation: COMPLETE at MVP level
Stable baseline: v1.11-final-mvp / v1.11-portfolio-demo-ready
Production Observability & Release Confidence: DONE in v1.22
Production Deployment & Smoke Verification: PARTIAL / DEFERRED in v1.22.1
Seed Data Quality Expansion Round 2: NOT DONE / VALIDATION BLOCKED in v1.24
Product & Ingredient Discovery Confidence Polish: DONE in v1.34, scoped validation only
E2E Failure Triage & Extended Validation Cleanup: DONE in v1.35 with full E2E PASS
Product ↔ Ingredient Learning Path Polish: DONE in v1.37
Latest completed scoped task: MVP v1.37 - Product ↔ Ingredient Learning Path Polish
Current active milestone: None
Current active milestone status: None
Production URL public reachability: PASS for v1.22.1 public check
Production /api/health: PASS for the v1.22 endpoint contract
Authenticated MVP production smoke: NOT CHECKED / DEFERRED
Production signals: NOT CHECKED / DEFERRED
Recommended next task: Manual Browser & Production Smoke Verification
```

v1.37 is complete after full local automated validation. It connects Product Detail, Product Catalogue, Ingredient Detail, and Ingredient Library through educational search links and lightweight cross-links.

v1.35 remains DONE with full E2E PASS. v1.34 remains DONE within its scoped validation boundary. v1.24 remains NOT DONE / VALIDATION BLOCKED because its own build and E2E closeout criteria were not met.

## 2. Objective

Complete `v1.37 - Product ↔ Ingredient Learning Path Polish` by improving navigation between existing product and ingredient education surfaces without adding recommendation, ranking, medical, commerce, CRUD, schema, seed, auth, AI-provider, or broad API scope.

The completed sprint preserves:

```txt
No recommendation engine
No related-products ranking
No Product Match scoring/ranking change
No Routine Safety logic change
No database schema change
No seed baseline change
No auth change
No AI-provider behavior change
No product or ingredient CRUD scope change
No broad API contract change
No /api/health contract-version change
No marketplace, cart, checkout, payment, image upload, or camera behavior
No diagnosis, treatment recommendation, skin score, or risk score
```

## 3. Files Changed

Implementation:

```txt
src/app/(dashboard)/ingredients/page.tsx
src/app/(dashboard)/products/page.tsx
src/modules/ingredients/components/ingredient-detail.tsx
src/modules/ingredients/components/ingredient-library.tsx
src/modules/products/components/product-catalogue.tsx
src/modules/products/components/product-detail.tsx
```

Source-inspection tests:

```txt
tests/unit/ingredient-detail-ui.test.ts
tests/unit/ingredient-library-ui.test.ts
tests/unit/product-catalogue-ui.test.ts
tests/unit/product-detail-ui.test.ts
```

Documentation:

```txt
README.md
docs/00-source-of-truth.md
docs/final-release-checklist.md
docs/post-mvp-backlog.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/06-current-sprint-plan.md
```

Explicitly unchanged:

```txt
package.json
package-lock.json
prisma/
seed data
database schema
Product Match scoring/ranking
Routine Safety logic
auth
AI provider behavior
tests/e2e/
```

## 4. Completed Scope

Product Detail learning path:

- Added the "Tìm hiểu thành phần nổi bật" section.
- Kept helper copy educational and non-medical.
- Linked ingredient highlights to Ingredient Library searches through `routes.INGREDIENTS`.
- Encoded query values with `encodeURIComponent`.

Ingredient Detail product discovery:

- Added the "Khám phá sản phẩm liên quan" section.
- Linked to Product Catalogue through `routes.PRODUCTS`.
- Built the search query from the ingredient INCI/display name.
- Encoded query values with `encodeURIComponent`.
- Explicitly stated that the link is for lookup, not ranking or choosing products for the user.

Catalogue/library query plumbing:

- Added `initialQuery` support to Product Catalogue and Ingredient Library.
- Initialized draft and active filters from the URL query.
- Passed `searchParams.q` from `/products` and `/ingredients`.
- Added lightweight Product Catalogue → Ingredient Library and Ingredient Library → Product Catalogue links.

## 5. Acceptance Criteria

```txt
[x] Product Detail provides educational Ingredient Library search links.
[x] Product Detail uses route constants and safe URL encoding.
[x] Product Detail copy remains educational and non-medical.
[x] Ingredient Detail provides Product Catalogue discovery by INCI/display-name query.
[x] Ingredient Detail uses route constants and safe URL encoding.
[x] Ingredient Detail avoids recommendation and medical wording.
[x] Product Catalogue accepts initialQuery and initializes draft/active filters.
[x] Ingredient Library accepts initialQuery and initializes draft/active filters.
[x] /products and /ingredients pass searchParams.q to their client components.
[x] Product Catalogue and Ingredient Library include lightweight cross-links.
[x] Source-inspection tests cover navigation copy, route helpers, query plumbing, and safety boundaries.
[x] No recommendation, related-products ranking, treatment/diagnosis, skin/risk score, CRUD, marketplace, cart, payment, image-upload, or camera behavior was introduced.
[x] Product Match scoring/ranking, Routine Safety, schema, seed baseline, auth, AI provider, and broad API contracts were preserved.
[x] v1.35 remains DONE with full E2E PASS.
[x] v1.34 remains DONE within scoped validation only.
[x] v1.24 remains NOT DONE / VALIDATION BLOCKED.
```

## 6. Validation Status

```txt
Evidence date: 2026-06-13
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1021 tests
git diff --check: PASS
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm run test:e2e: PASS - 31 passed; sandboxed attempt failed with spawn EPERM
```

v1.37 is DONE with full local automated validation.

## 7. Evidence Boundary

```txt
Manual browser verification: NOT CHECKED
Screen-reader verification: NOT CHECKED
Production verification: NOT CHECKED
Screenshots: NOT CREATED
Demo video: NOT CREATED
```

The production `/api/health` response remains on the v1.22 health endpoint contract version. Automated validation is not manual browser, screen-reader, or production evidence.

## 8. Recommended Next Task

```txt
Manual Browser & Production Smoke Verification
```

Reason:

- v1.37 automated validation is complete.
- The current docs still record authenticated production smoke and production signals as deferred.
- Manual browser and screen-reader checks were not performed for v1.37.
- Portfolio screenshots and demo video remain optional evidence tasks, not product correctness blockers.

No commit was created for v1.37.
