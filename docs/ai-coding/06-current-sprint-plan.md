# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-11

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
Latest completed scoped task: MVP v1.27 - Product Detail to Saved Products Decision Support Polish
Current active milestone: None
Current active milestone status: None
Production URL public reachability: PASS for v1.22.1 public check
Production /api/health: PASS for v1.22.1 public check
Authenticated MVP production smoke: NOT CHECKED / DEFERRED
Production signals: NOT CHECKED / DEFERRED
Recommended next task: TBD / Backlog grooming
Current phase: Post-MVP controlled improvement
```

v1.22.1 remains partial/deferred because only the public production URL and `/api/health` were checked directly. Authenticated MVP flows and production platform signals were not checked.

v1.24 seed implementation and closeout documentation are mostly complete, but v1.24 is NOT DONE because `npm run build` and `npm run test:e2e` timed out in the current environment.

v1.27 is the latest completed scoped task within the validation boundary of lint, typecheck, and unit tests.

## 2. Objective

Complete `v1.27 - Product Detail to Saved Products Decision Support Polish` by polishing Product Detail summary labels, save/unsave helper copy, after-save next actions, Saved Products empty-state guidance, and safe reference copy without creating duplicate explainability/safety systems or changing Product Match scoring/ranking or Routine logic.

This sprint does not add new product features. It preserves:

```txt
No admin CRUD
No payment, checkout, marketplace, cart, or order workflow
No real AI provider integration
No image upload, skin image analysis, diagnosis, treatment advice, or skin scoring
No database schema change
No seed data change
No Product Match scoring/ranking rewrite
No Routine logic rewrite
No Routine Safety Analysis rewrite
No secret, token, OAuth credential, database URI, raw environment variable, password, cookie, session token, or raw production database document exposure
```

## 3. Files Changed

Active files:

```txt
docs/00-source-of-truth.md
docs/post-mvp-backlog.md
docs/final-release-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/06-current-sprint-plan.md
README.md
src/modules/products/components/product-detail.tsx
src/modules/products/product-detail-decision-support.ts
src/modules/saved-products/components/saved-product-card.tsx
src/modules/saved-products/components/saved-product-toggle-button.tsx
src/modules/saved-products/components/saved-products-comparison-panel.tsx
src/modules/saved-products/components/saved-products-page.tsx
tests/unit/product-detail-decision-support.test.ts
tests/unit/product-detail-ui.test.ts
tests/unit/product-saved-products-ui.test.ts
tests/unit/saved-products-ui.test.ts
```

v1.25 dashboard/onboarding files remain preserved. v1.25.1 seed baseline files remain preserved. v1.26 Product Match polish files remain preserved.

## 4. Acceptance Criteria

Product Detail to Saved Products decision-support polish:

```txt
[x] Reuse the existing Product Detail decision-support helper and Product Match explanation card where already integrated.
[x] Do not add a duplicate Product Match explainability or product safety system.
[x] Clarify Product Detail summary, consideration, and safety section labels.
[x] Clarify what saving a product means.
[x] Add a clear Product Detail next-action section that links to Saved Products and Product Match.
[x] Improve Saved Products empty-state guidance.
[x] Keep save/unsave behavior and saved product comparison behavior intact.
[x] Preserve Product Match scoring/ranking behavior.
[x] Preserve Routine logic.
[x] Preserve seed data, schema, auth, AI provider behavior, API contracts, v1.25 onboarding polish, v1.25.1 seed baseline consistency, and v1.26 Product Match polish.
[x] Keep v1.24 NOT DONE / VALIDATION BLOCKED.
[x] Keep v1.22.1 production smoke verification PARTIAL / DEFERRED.
[x] Do not claim build, E2E, manual browser, production, screenshot, or video verification for v1.27.
```

Validation:

```txt
[x] npm run lint
[x] npm run typecheck
[x] npm run test
[ ] npm run build - not run for v1.27 by task scope
[ ] npm run test:e2e - not run for v1.27 by task scope
```

## 5. Validation Status

Current v1.27 validation status:

```txt
Evidence date: 2026-06-11
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
npm run build: NOT RUN for v1.27
npm run test:e2e: NOT RUN for v1.27
Manual browser verification: NOT CHECKED
Production verification: NOT CHECKED
```

v1.27 is done only within this scoped local validation boundary. Do not use this as full release readiness evidence.

## 6. Known Limitations

```txt
Manual browser verification: NOT CHECKED
Production verification: NOT CHECKED
Build validation: NOT RUN for v1.27 by task scope
E2E validation: NOT RUN for v1.27 by task scope
Screenshots/video: NOT CREATED
v1.24 closeout: DEFERRED / VALIDATION BLOCKED
```

## 7. Suggested Next Action

Recommended next task:

```txt
TBD / Backlog grooming
```

If v1.24 closeout is resumed later, rerun the required v1.24 build and E2E validation in a suitable environment before marking v1.24 DONE.

## 8. Suggested Commit

For the v1.27 Product Detail to Saved Products polish changes, use:

```bash
git commit -m "feat(products): polish detail and saved-product decision support"
```

Stage only reviewed v1.27 files before committing. Do not use `git add .`, and do not claim a commit was created unless it was actually created.
