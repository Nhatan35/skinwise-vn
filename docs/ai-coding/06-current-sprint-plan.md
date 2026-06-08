# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-08

## 1. Current Phase

```txt
Post-MVP controlled improvement
```

Status:

```txt
Product implementation: COMPLETE at MVP level
Stable baseline: v1.11-final-mvp / v1.11-portfolio-demo-ready
Post-MVP backlog: CREATED in v1.12
UX polish implementation: DONE in v1.13
Data quality expansion: DONE in v1.14
Product Match explainability and safety guardrails: DONE in v1.15
Audit cleanup and evidence sync: DONE in v1.15.1
Saved Product Comparison & Decision Support: DONE in v1.16
Routine History & Weekly Progress Review: DONE in v1.17
Skin Journal Filters & Reflection Review: DONE in v1.18
Latest completed milestone: MVP v1.18 - Skin Journal Filters & Reflection Review
Current active sprint: None
Current active sprint status: None
Recommended next sprint: To be decided after v1.18 review
Current phase: Post-MVP controlled improvement
```

v1.18 completed controlled product improvement. The change is limited to loaded-entry filtering and reflection support on the existing `/journal` page.

## 2. Objective

Help users review self-tracked skin journal entries by symptom, stress level, product usage, and recent time range using existing loaded journal data.

The feature must preserve:

```txt
No clinical assessment
No product causality conclusion
No treatment guidance
No skin or health scoring
No AI-driven advice
No image analysis
No full analytics dashboard
No marketplace/cart/checkout/payment/review/rating/social scope
No notification/reminder system
No new database collection
Existing journal create, edit, delete, loading, error, and authenticated behavior
```

## 3. Files Expected To Change

Active files:

```txt
src/modules/journals/components/skin-journal-timeline.tsx
src/modules/journals/components/skin-journal-filter-panel.tsx
src/modules/journals/skin-journal-filters.ts
tests/unit/skin-journal-filters.test.ts
tests/unit/skin-journal-ui.test.ts
tests/e2e/skin-journal.authenticated.spec.ts
docs/post-mvp-backlog.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

## 4. Acceptance Criteria

Functional:

```txt
[x] User can open /journal successfully.
[x] Existing journal create, edit, and delete behavior remains unchanged.
[x] Filter panel appears on /journal.
[x] User can filter loaded entries by symptom.
[x] User can filter loaded entries by stress level.
[x] User can filter loaded entries by product usage when product ids exist.
[x] User can filter loaded entries by all, last 7, last 14, and last 30 local dates.
[x] Multiple filters use AND logic.
[x] User can clear all filters.
[x] UI shows matching loaded-entry count.
[x] Filter-specific empty state appears when no loaded entries match.
[x] Original no-journal empty state remains intact.
[x] Active filters remain stable after create, update, and delete actions.
```

Content and safety:

```txt
[x] UI frames filters as reflection over self-tracked notes.
[x] Required safe reflection disclaimer is visible.
[x] UI does not claim product causality.
[x] UI does not claim skin improvement or worsening.
[x] UI does not provide clinical conclusions.
[x] UI does not recommend treatment.
[x] UI does not show skin or health scoring.
[x] UI does not use guaranteed-outcome language.
[x] UI uses calm, neutral copy.
```

Technical:

```txt
[x] Filters use existing SkinJournalDto fields only.
[x] Filters apply to currently loaded entries only.
[x] Client components use API/client helpers only.
[x] No new database collection.
[x] No schema redesign.
[x] No API redesign.
[x] No duplicate skin-journal module.
[x] Existing tests are not weakened.
[x] Full validation passes before marking DONE.
```

Documentation:

```txt
[x] Backlog records v1.18 as Skin Journal Filters & Reflection Review.
[x] Prior admin/content candidate is moved out of the v1.18 slot as future optional scope.
[x] Change log updated with v1.18 implementation notes.
[x] Feature status matrix updated.
[x] Implementation status updated only with v1.18 evidence.
[x] v1.18 marked DONE only after validation passes.
```

## 5. Validation Checklist

Required before marking DONE:

```txt
[x] node -v
[x] npm -v
[x] npm run lint
[x] npm run typecheck
[x] npm run test
[x] npm run build
[x] npm run test:e2e
[x] npm audit --omit=dev --audit-level=moderate
```

Current v1.18 validation status:

```txt
Evidence date: 2026-06-08
Environment: Local Windows / PowerShell
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 100 files / 942 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 30/30 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

## 6. Non-Goals

```txt
No treatment guidance.
No clinical conclusion.
No product causality conclusion.
No skin or health scoring.
No image upload or image analysis.
No marketplace, cart, checkout, or payment.
No reviews, ratings, likes, or sharing.
No notification/reminder system.
No admin CRUD.
No new database collection.
No real AI provider change.
No broad redesign of Skin Journal.
No unrelated refactor.
```

## 7. Suggested Commit

```bash
git add .
git commit -m "feat: add skin journal filters"
```
