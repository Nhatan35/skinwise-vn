# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-09

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
Account Data Summary & Privacy Control Review: DONE in v1.19
Personal Insight Review & Safe Trend Cards: DONE in v1.20
Latest completed milestone: MVP v1.20 - Personal Insight Review & Safe Trend Cards
Current active sprint: None
Current active sprint status: None
Recommended next sprint: Portfolio Evidence Package media capture
Current phase: Post-MVP controlled improvement
```

v1.20 completed controlled product improvement. The change is limited to strict count-only personal reflection summaries on the existing `/insights` page.

## 2. Objective

Help users understand their own tracking patterns through safe routine-log and journal-count summaries.

The feature must preserve:

```txt
No diagnosis
No treatment advice
No clinical conclusion
No product causation claim
No product effectiveness claim
No product harm claim
No stress causation claim
No routine causation claim
No skin score
No raw document response
No database identifier, user ID, routine ID, journal ID, or product ID response
No session, token, or provider account field response
No new database collection
No schema redesign
No external AI provider change
Existing /api/insights behavior
Existing /insights overview, calendar, trend, product usage, and next-action cards
```

## 3. Files Changed

Active files:

```txt
src/app/api/insights/summary/route.ts
src/modules/insights/insight-summary.dto.ts
src/modules/insights/insight-summary.schema.ts
src/modules/insights/insight-summary.mapper.ts
src/modules/insights/insight-summary.use-case.ts
src/modules/insights/components/insight-summary-section.tsx
src/modules/insights/components/insights-page.tsx
src/modules/insights/insights.client.ts
src/modules/insights/index.ts
tests/unit/insight-summary-use-case.test.ts
tests/unit/insight-summary-api-contract.test.ts
tests/unit/insights-client.test.ts
tests/unit/insights-ui.test.ts
tests/e2e/insights.authenticated.spec.ts
docs/post-mvp-backlog.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

## 4. Acceptance Criteria

Functional:

```txt
[x] User can open /insights successfully.
[x] Existing /insights behavior remains unchanged.
[x] Existing GET /api/insights behavior remains unchanged.
[x] Personal Insight Review section appears on /insights.
[x] Routine Consistency card summarizes the last 7 local dates.
[x] Journal Symptom Frequency card summarizes recent symptoms without diagnosis.
[x] Stress Reflection card summarizes recorded stress labels without causation claims.
[x] Product Mention Pattern card summarizes product-name mentions without product IDs.
[x] Insufficient-data empty state appears when no recent routine logs or journal entries exist.
[x] Partial data still shows available cards with section-level fallbacks.
```

Privacy and security:

```txt
[x] GET /api/insights/summary requires authentication.
[x] Summary data is scoped to the authenticated user.
[x] Summary response is count-only.
[x] Summary response does not include `_id`.
[x] Summary response does not include `id`.
[x] Summary response does not include `userId`.
[x] Summary response does not include `routineId`.
[x] Summary response does not include `journalId`.
[x] Summary response does not include `productId`.
[x] Summary response does not include session, token, accessToken, refreshToken, providerAccountId, emailVerified, password, rawDocument, createdBy, or updatedBy fields.
[x] Product IDs are used only internally to resolve names/brands.
```

Technical:

```txt
[x] GET /api/insights/summary returns only safe summary data.
[x] Existing GET /api/insights behavior remains intact.
[x] Client components use API/client helpers only.
[x] No new database collection.
[x] No schema redesign.
[x] No duplicate insights module or page.
[x] No AI provider change.
[x] Existing tests are not weakened.
[x] Full validation passes before marking DONE.
```

Documentation:

```txt
[x] Backlog records v1.20 as Personal Insight Review & Safe Trend Cards.
[x] Change log updated with v1.20 implementation notes.
[x] Feature status matrix updated.
[x] Historical v1.19 evidence preserved without overclaiming.
[x] Implementation status updated with v1.20 evidence.
[x] v1.20 marked DONE only after validation passes.
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

Current v1.20 validation status:

```txt
Evidence date: 2026-06-09
Environment: Local Windows / PowerShell
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 102 files / 977 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 31/31 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

## 6. Non-Goals

```txt
No diagnosis.
No treatment guidance.
No clinical conclusion.
No skin or health scoring.
No product causation, product effectiveness, or product harm claim.
No stress causation claim.
No routine causation claim.
No image upload or image analysis.
No marketplace, cart, checkout, or payment.
No reviews, ratings, likes, or sharing.
No notification/reminder system.
No admin dashboard.
No new database collection.
No external AI provider change.
No broad redesign of Insights.
No unrelated refactor.
```

## 7. Suggested Commit

```bash
git add .
git commit -m "feat: add personal insight review"
```
