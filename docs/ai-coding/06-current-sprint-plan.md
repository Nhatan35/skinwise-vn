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
E2E Failure Triage & Extended Validation Cleanup: DONE in v1.35
Latest completed scoped task: MVP v1.35 - E2E Failure Triage & Extended Validation Cleanup
Current active milestone: None
Current active milestone status: None
Production URL public reachability: PASS for v1.22.1 public check
Production /api/health: PASS for v1.22.1 public check
Authenticated MVP production smoke: NOT CHECKED / DEFERRED
Production signals: NOT CHECKED / DEFERRED
Recommended next task: Manual Browser & Production Smoke Verification
Current phase: Post-MVP controlled improvement
```

v1.35 is complete. It resolved the six extended-validation E2E failures left after v1.34 by updating stale Playwright assertions for current intentional UI copy and accessible structure. No app product behavior, seed data, schema, auth model, Product Match scoring/ranking, Routine Safety logic, AI provider behavior, or CRUD scope changed.

v1.34 remains DONE within its scoped validation boundary. v1.24 seed implementation and closeout documentation are mostly complete, but v1.24 remains NOT DONE / VALIDATION BLOCKED because its own required build and E2E closeout criteria were not met during the v1.24 attempt.

## 2. Objective

Complete `v1.35 - E2E Failure Triage & Extended Validation Cleanup` by reproducing, classifying, and fixing the remaining extended-validation E2E failures from dashboard, insights, saved-products, and today routine log flows using the smallest safe test changes.

This sprint is validation/debt cleanup, not product feature scope. It preserves:

```txt
No admin CRUD
No payment, checkout, marketplace, cart, or order workflow
No real AI provider integration
No image upload, skin image analysis, diagnosis, treatment advice, or skin scoring
No database schema change
No seed data change
No Product Match scoring/ranking rewrite
No Product Detail route rewrite
No Saved Products behavior rewrite
No Routine logic rewrite
No Routine Log logic rewrite
No Journal logic rewrite
No Insights calculation rewrite
No Dashboard state-model rewrite
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
tests/e2e/dashboard-summary.authenticated.spec.ts
tests/e2e/insights.authenticated.spec.ts
tests/e2e/saved-products.authenticated.spec.ts
tests/e2e/today-routine-log.authenticated.spec.ts
```

v1.34 discovery implementation files remain unchanged in v1.35. v1.25 dashboard/onboarding files, v1.25.1 seed baseline files, and v1.26 through v1.34 product polish work remain preserved.

## 4. Failure Triage

Reproduced E2E failures before fixes:

```txt
tests/e2e/dashboard-summary.authenticated.spec.ts
- dashboard reflects user-owned activity from the core journey
- Classification: selector/test expectation drift
- Cause: test expected a secondary next-actions card, while current intentional UI shows the onboarding progress card for this state.

tests/e2e/insights.authenticated.spec.ts
- authenticated user can review Skin Progress Insights
- Personal Insight Review shows the insufficient-data empty state safely
- Classification: selector/copy drift
- Cause: tests used older English section and label names while current Insights UI uses Vietnamese copy and exact card titles.

tests/e2e/saved-products.authenticated.spec.ts
- authenticated user can save, view, and remove a product
- authenticated user can compare and clear two saved products
- Classification: accessibility query drift
- Cause: heading query matched both the exact page heading and a longer heading; the test needed exact matching.

tests/e2e/today-routine-log.authenticated.spec.ts
- authenticated user can mark a routine as completed for today
- Classification: copy drift
- Cause: test expected older medical-advice wording while current safer copy uses professional-guidance wording.
```

No reproduced failure required an app-code fix. No reproduced failure was caused by the v1.34 Product Catalogue or Ingredient Library changes.

## 5. Acceptance Criteria

E2E cleanup:

```txt
[x] Reproduce the remaining dashboard, insights, saved-products, and today routine log E2E failures.
[x] Classify each failure before editing.
[x] Fix selector/copy drift without weakening coverage or skipping tests.
[x] Avoid app-code changes where the app behavior is already correct.
[x] Keep v1.34 discovery files unchanged unless a direct regression is proven.
[x] Preserve Product Match scoring/ranking behavior.
[x] Preserve Routine Safety logic.
[x] Preserve seed data, schema, auth, AI provider behavior, broad API contracts, and CRUD boundaries.
[x] Keep v1.24 NOT DONE / VALIDATION BLOCKED.
[x] Keep v1.22.1 production smoke verification PARTIAL / DEFERRED.
[x] Do not claim manual browser, screen-reader, production, screenshot, or video verification for v1.35.
```

Validation:

```txt
[x] npm run lint
[x] npm run typecheck
[x] npm run test
[x] git diff --check
[x] npm run build - PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
[x] npm audit --omit=dev --audit-level=moderate
[x] npm run test:e2e - PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
```

## 6. Validation Status

Current v1.35 validation status:

```txt
Evidence date: 2026-06-12
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1020 tests
git diff --check: PASS
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm run test:e2e: PASS - 31 passed; sandboxed attempt failed with spawn EPERM
Manual browser verification: NOT CHECKED
Screen-reader verification: NOT CHECKED
Production verification: NOT CHECKED
Screenshots/demo video: NOT CREATED
```

v1.35 is DONE with full local validation, including complete E2E PASS. Do not use this as manual browser, screen-reader, production, screenshot, or demo-video evidence.

## 7. Known Limitations

```txt
Manual browser verification: NOT CHECKED
Screen-reader verification: NOT CHECKED
Production verification: NOT CHECKED
Screenshots/video: NOT CREATED
v1.24 closeout: DEFERRED / VALIDATION BLOCKED
```

## 8. Suggested Next Action

Recommended next task:

```txt
Manual Browser & Production Smoke Verification
```

Run a controlled manual browser smoke pass and production smoke verification now that automated local validation, build, audit, and the full E2E suite pass for v1.35. If v1.24 closeout is resumed later, rerun the required v1.24 build and E2E validation against that milestone's closeout criteria before marking v1.24 DONE.

## 9. Suggested Commit

For the v1.35 E2E cleanup and documentation sync, use:

```bash
git commit -m "test(e2e): align extended validation selectors"
```

Stage only reviewed v1.35 files before committing. Do not use `git add .`, and do not claim a commit was created unless it was actually created.
