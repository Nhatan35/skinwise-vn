# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-12

## 1. Current Phase

```txt
Post-MVP controlled improvement
```

Status:

```txt
Product implementation: COMPLETE at MVP level
Stable baseline: v1.11-final-mvp / v1.11-portfolio-demo-ready
Post-MVP backlog: CREATED in v1.12
Production Observability & Release Confidence: DONE in v1.22
Production Deployment & Smoke Verification: PARTIAL / DEFERRED in v1.22.1
Account Data Deletion Workflow Hardening: DONE in v1.23
Seed Data Quality Expansion Round 2: NOT DONE / VALIDATION BLOCKED in v1.24
First-Session Guided Experience Polish: DONE in v1.25, scoped validation only
Seed Baseline Regression & Documentation Consistency Hotfix: DONE in v1.25.1, scoped validation only
Product Match Explanation Clarity & Safe Decision Support Polish: DONE in v1.26, scoped validation only
Product Detail to Saved Products Decision Support Polish: DONE in v1.27, scoped validation only
Saved Products to Routine Decision Support Polish: DONE in v1.28, scoped validation only
Routine to Routine Log / Journal Decision Support Polish: DONE in v1.29, scoped validation only
Insights Interpretation & Dashboard Next Action Polish: DONE in v1.30, scoped validation only
Core Flow Recovery, Empty State & Navigation Consistency Polish: DONE in v1.31, scoped validation only
Core Form Submission & Action Feedback Consistency Polish: DONE in v1.32, scoped validation only
Core Accessibility, Focus Management & Keyboard Interaction Polish: DONE in v1.33, scoped validation only
Product & Ingredient Discovery Confidence Polish: DONE in v1.34, scoped validation only
Latest completed scoped task: MVP v1.34 - Product & Ingredient Discovery Confidence Polish
Current active milestone: None
Current active milestone status: None
Production URL public reachability: PASS for v1.22.1 public check
Production /api/health: PASS for v1.22.1 public check
Authenticated MVP production smoke: NOT CHECKED / DEFERRED
Production signals: NOT CHECKED / DEFERRED
Recommended next task: E2E Failure Triage & Extended Validation Cleanup
Current phase: Post-MVP controlled improvement
```

v1.22.1 remains partial/deferred because only the public production URL and `/api/health` were checked directly. Authenticated MVP flows and production platform signals were not checked.

v1.24 seed implementation and closeout documentation are mostly complete, but v1.24 is NOT DONE because `npm run build` and `npm run test:e2e` timed out in the current environment.

v1.34 is the latest completed scoped task within the validation boundary of lint, typecheck, unit tests, and diff check. Build passed after an elevated rerun; E2E was attempted and failed in existing dashboard, insights, saved-products, and today routine log flows.

## 2. Objective

Complete `v1.34 - Product & Ingredient Discovery Confidence Polish` by improving the existing `/products` and `/ingredients` discovery experience so users can understand result counts, active filters, recovery paths when no results are found, and the educational non-medical boundary.

This sprint does not add new product features. It preserves:

```txt
No admin CRUD
No payment, checkout, marketplace, cart, or order workflow
No real AI provider integration
No image upload, skin image analysis, diagnosis, treatment advice, or skin scoring
No database schema change
No seed data change
No Product Match scoring/ranking rewrite
No Product Detail route rewrite
No Saved Products rewrite
No Routine logic rewrite
No Routine Log logic rewrite
No Journal logic rewrite
No Insights calculation rewrite
No Dashboard next-action engine rewrite
No new global error framework
No monitoring or analytics integration
No Routine Safety Analysis rewrite
No new global form or toast framework
No optimistic-update infrastructure
No new global search framework
No new state management library
No new UI component library
No admin/product/ingredient CRUD
No skin score, risk score, ingredient danger grade, diagnosis, treatment advice, or personalized medical recommendation
No secret, token, OAuth credential, database URI, raw environment variable, password, cookie, session token, or raw production database document exposure
```

## 3. Files Changed

Active files:

```txt
README.md
docs/00-source-of-truth.md
docs/post-mvp-backlog.md
docs/final-release-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/06-current-sprint-plan.md
src/modules/products/components/product-catalogue.tsx
src/modules/ingredients/components/ingredient-library.tsx
src/modules/ingredients/components/ingredient-card.tsx
src/modules/ingredients/ingredient.client.ts
tests/unit/product-catalogue-ui.test.ts
tests/unit/ingredient-client.test.ts
tests/unit/ingredient-library-ui.test.ts
```

v1.25 dashboard/onboarding files remain preserved. v1.25.1 seed baseline files remain preserved. v1.26 Product Match polish files remain preserved. v1.27 Product Detail to Saved Products polish files remain preserved. v1.28 Saved Products to Routine polish files remain preserved. v1.29 Routine to Routine Log / Journal polish files remain preserved. v1.30 Insights/Dashboard polish remains preserved. v1.31 recovery and navigation polish remains preserved. v1.32 form/action feedback polish remains preserved. v1.33 accessibility polish remains preserved.

## 4. Acceptance Criteria

Product and ingredient discovery confidence polish:

```txt
[x] Reuse existing Button, Card, Alert, Input, Label, Select, EmptyState, ErrorState, LoadingState, local React state, and client API helper patterns.
[x] Product Catalogue shows result count after successful load.
[x] Product Catalogue shows active filter summary for q, category, priceRange, skinType, and concern.
[x] Product Catalogue has clearer active-filter no-result recovery copy and keeps the clear-filter action.
[x] Ingredient client supports the existing ingredient function query parameter.
[x] Ingredient Library uses draft/active object filter state.
[x] Ingredient Library exposes a single-select function filter.
[x] Ingredient Library shows result count after successful load.
[x] Ingredient Library shows active search/function filter summary and no-filter discovery guidance.
[x] Ingredient Library no-result recovery copy is clearer.
[x] Ingredient reset clears both search and function filters.
[x] IngredientCard detail action label is contextual.
[x] Preserve Product Match scoring/ranking behavior.
[x] Preserve Product Detail route behavior.
[x] Preserve Saved Products persistence behavior.
[x] Preserve Routine, Routine Log, Journal, Insights, and Dashboard behavior.
[x] Preserve seed data, schema, auth, AI provider behavior, broad API contracts, v1.25 onboarding polish, v1.25.1 seed baseline consistency, and v1.26 through v1.33 polish work.
[x] Keep v1.24 NOT DONE / VALIDATION BLOCKED.
[x] Keep v1.22.1 production smoke verification PARTIAL / DEFERRED.
[x] Do not claim E2E, manual browser, screen-reader, production, screenshot, or video verification for v1.34.
```

Validation:

```txt
[x] npm run lint
[x] npm run typecheck
[x] npm run test
[x] git diff --check
[x] npm run build - PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
[ ] npm run test:e2e - FAIL after elevated rerun; sandboxed attempt failed with spawn EPERM
[x] npm audit --omit=dev --audit-level=moderate
```

## 5. Validation Status

Current v1.34 validation status:

```txt
Evidence date: 2026-06-12
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1020 tests
git diff --check: PASS
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm run test:e2e: FAIL after elevated rerun - 25 passed / 6 failed; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
Manual browser verification: NOT CHECKED
Screen-reader verification: NOT CHECKED
Production verification: NOT CHECKED
```

v1.34 is done only within this scoped local validation boundary. Do not use this as full E2E, manual browser, screen-reader, production, screenshot, or video evidence.

## 6. Known Limitations

```txt
Manual browser verification: NOT CHECKED
Screen-reader verification: NOT CHECKED
Production verification: NOT CHECKED
Build validation: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
E2E validation: FAIL after elevated rerun with 25 passed / 6 failed in existing dashboard, insights, saved-products, and today routine log flows
Screenshots/video: NOT CREATED
v1.24 closeout: DEFERRED / VALIDATION BLOCKED
```

## 7. Suggested Next Action

Recommended next task:

```txt
E2E Failure Triage & Extended Validation Cleanup
```

Treat the existing dashboard, insights, saved-products, and today routine log E2E failures as extended-validation debt outside v1.34 scope. If v1.24 closeout is resumed later, rerun the required v1.24 build and E2E validation in a suitable environment before marking v1.24 DONE.

## 8. Suggested Commit

For the v1.34 Product & Ingredient Discovery Confidence polish changes, use:

```bash
git commit -m "feat(discovery): polish product and ingredient filtering"
```

Stage only reviewed v1.34 files before committing. Do not use `git add .`, and do not claim a commit was created unless it was actually created.
