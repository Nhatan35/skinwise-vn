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
Latest completed milestone: MVP v1.17 - Routine History & Weekly Progress Review
Current active sprint: None
Current active sprint status: None
Recommended next sprint: To be decided after v1.17 review
Current phase: Post-MVP controlled improvement
```

v1.17 continued controlled product improvement. The change is limited to routine habit review on the existing `/routine-logs/today` page.

## 2. Objective

Help users review routine consistency over the last 7 local dates, including today, using existing routine log data.

The feature must preserve:

```txt
No clinical assessment
No treatment guidance
No skin or health scoring
No AI-driven product advice
No image analysis
No full analytics dashboard
No marketplace/cart/checkout/payment/review/rating/social scope
No notification/reminder system
No new database collection
Existing routine builder, routine analysis, and today routine log behavior
```

## 3. Files Expected To Change

Active files:

```txt
src/app/api/routine-logs/route.ts
src/modules/routine-logs/components/today-routine-checklist.tsx
src/modules/routine-logs/components/routine-weekly-review-card.tsx
src/modules/routine-logs/routine-log.client.ts
src/modules/routine-logs/routine-log.repository.ts
src/modules/routine-logs/routine-log.schema.ts
src/modules/routine-logs/routine-log.use-case.ts
src/modules/routine-logs/routine-weekly-review.ts
src/modules/routine-logs/index.ts
tests/unit/routine-log.test.ts
tests/unit/routine-log-use-case.test.ts
tests/unit/routine-log-client.test.ts
tests/unit/routine-log-ui.test.ts
tests/unit/routine-log-list-api-contract.test.ts
tests/unit/routine-weekly-review.test.ts
tests/e2e/today-routine-log.authenticated.spec.ts
docs/post-mvp-backlog.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

## 4. Acceptance Criteria

Functional:

```txt
[x] User can open /routine-logs/today successfully.
[x] Existing today routine log behavior still works.
[x] Weekly review card appears on the page.
[x] Weekly review shows a 7-day routine summary.
[x] Weekly review shows logged-day count.
[x] Weekly review shows routine-log completion percentage when data exists.
[x] Weekly review shows completed, partial, skipped, and not-logged statuses.
[x] Weekly review has a safe empty state when no logs exist.
[x] Weekly review updates after today's routine log is changed.
[x] Weekly review does not block the today routine flow.
```

Content and safety:

```txt
[x] UI frames the feature as habit tracking.
[x] Required safe disclaimer is visible.
[x] UI does not claim skin improvement or worsening.
[x] UI does not provide clinical conclusions.
[x] UI does not recommend treatment.
[x] UI does not show skin or health scoring.
[x] UI does not use guaranteed-outcome language.
[x] UI uses calm, non-judgmental copy.
```

Technical:

```txt
[x] Existing ?localDate routine log GET behavior remains backward-compatible.
[x] Optional ?from=YYYY-MM-DD&to=YYYY-MM-DD mode is bounded and controlled.
[x] Client components use API/client helpers only.
[x] No new database collection.
[x] No schema redesign.
[x] No unrelated API redesign.
[x] Existing tests are not weakened.
[x] Full validation passes before marking DONE.
```

Documentation:

```txt
[x] Backlog records v1.17 as Routine History & Weekly Progress Review.
[x] Prior release/observability candidate remains documented as a future optional evidence task.
[x] Change log updated with real v1.17 validation evidence.
[x] Feature status matrix updated.
[x] Implementation status updated after validation.
[x] v1.17 marked DONE only after validation passes.
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

Current v1.17 validation status:

```txt
Evidence date: 2026-06-08
Environment: Local Windows / PowerShell
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 99 files / 929 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 30/30 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

## 6. Non-Goals

```txt
No treatment guidance.
No clinical conclusion.
No skin or health scoring.
No image upload or image analysis.
No marketplace, cart, checkout, or payment.
No reviews, ratings, likes, or sharing.
No notification/reminder system.
No admin CRUD.
No new database collection.
No real AI provider change.
No broad redesign of Routine Logs.
No unrelated refactor.
```

## 7. Suggested Commit

```bash
git add .
git commit -m "feat: add routine weekly review"
```
