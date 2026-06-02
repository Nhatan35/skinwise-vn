# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-02

## 1. Current Sprint

```txt
MVP v1.8 - Insights Usability & Progress Story Refinement
```

Status:

```txt
Implementation: DONE
Documentation sync: DONE
Validation evidence recording: DONE
```

MVP v1.8 is a focused usability and portfolio demo-flow refinement for the existing Insights experience. It is not a medical insight engine, product effectiveness engine, analytics platform, schema rewrite, API redesign, or AI provider integration.

## 2. Objective

Make the existing Insights page easier to understand within a short product demo by connecting routine logs, skin journal entries, recent tracking activity, reflective product usage, and safe next actions.

The improved flow should help a reviewer see:

```txt
Routine logs -> skin journal entries -> Insights progress story -> route-connected next actions
```

## 3. Scope

Completed v1.8 scope:

```txt
[x] Improve Insights page intro and progress-story framing.
[x] Improve overview card labels, helper text, and no-data context.
[x] Improve routine consistency calendar date range, legend, no-log explanation, and accessible day summaries.
[x] Improve journal/symptom trend copy for self-reported, low-data interpretation.
[x] Improve product usage safety copy without causality or effectiveness claims.
[x] Improve next actions using existing route constants and current data states.
[x] Preserve the Insights API response shape, DTO fields, database collections, and external-provider behavior.
[x] Update focused unit/source/E2E tests for the improved flow.
[x] Run full validation and record current results.
```

## 4. Non-Goals

```txt
No new UI route or Insights subroute.
No new API route.
No Insights API response shape change.
No new database collection or persistent field.
No product effectiveness scoring or causality logic.
No product matching or recommendation logic change.
No real AI provider integration.
No image upload, skin scoring, marketplace, cart, checkout, payment, admin CRUD, reviews, or notifications.
No medical diagnosis, treatment claim, or guaranteed skincare outcome.
No new dependency.
```

## 5. Validation Commands

Run and record:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run db:indexes
npm run db:seed
```

Database commands should run only against the configured safe local/development or explicit demo database.

## 6. Validation Evidence

Environment:

```txt
Node.js: v24.14.0
npm: 11.14.1
Target baseline: Node.js 24.x / npm 11.x
Baseline match: YES
```

Results:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 96 files / 889 tests
npm run build: PASS
npm run test:e2e: PASS - 29/29 tests
npm run db:indexes: PASS - 32 indexes ensured
npm run db:seed: PASS - 40 ingredients / 38 products
```

Environment-specific note:

```txt
Initial sandbox runs of npm run build and npm run test:e2e hit Windows spawn EPERM. Both commands passed after scoped reruns outside the sandbox process-spawn restriction.
```

## 7. Recommended Next Task

```txt
MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
```

This is a recommendation only and is not part of MVP v1.8.
