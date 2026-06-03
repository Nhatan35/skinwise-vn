# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-04

## 1. Current Sprint

```txt
MVP v1.12 - Post-MVP Backlog Planning
```

Status:

```txt
Product implementation: COMPLETE at MVP level
Stable baseline: v1.11-final-mvp / v1.11-portfolio-demo-ready
Post-MVP backlog: CREATED
Source code changes in this sprint: NONE
Database/schema changes in this sprint: NONE
Portfolio screenshots/demo polish: SKIPPED for now by user decision
```

MVP v1.12 is a planning and documentation sprint. It creates a controlled post-MVP backlog so future work can continue without disturbing the completed MVP baseline.

## 2. Objective

Create a clear boundary between:

```txt
Completed MVP scope
```

and:

```txt
Optional post-MVP improvements
```

The sprint should make the next development direction explicit, prioritised, and safe.

## 3. Completed v1.12 Scope

```txt
[x] Create docs/post-mvp-backlog.md.
[x] Define current stable baseline.
[x] Separate MVP-complete scope from future work.
[x] Prioritise post-MVP candidates.
[x] Mark screenshots/demo polish as skipped for now, not pending.
[x] Recommend the next implementation task: v1.13 UX Polish & Empty State Improvement.
[x] Preserve safety boundaries.
[x] Avoid source-code, API, database, dependency, or business-logic changes.
```

## 4. Non-Goals

```txt
No new feature implementation.
No source-code changes.
No route/API/schema/business-logic change.
No dependency update.
No database migration.
No real AI provider integration.
No admin CRUD implementation.
No marketplace, cart, checkout, payment, reviews, notifications, image upload, or skin score.
No medical diagnosis, treatment claim, or guaranteed skincare outcome.
No secrets or private user data in documentation.
```

## 5. Current Evidence Summary

Local validation from the stable baseline:

```txt
Evidence date: 2026-06-04
Environment: Local Windows / Git Bash
Branch: main
Runtime baseline: Node.js 24.x / npm 11.x
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 96 files / 889 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run db:seed: PASS - 40 ingredients / 38 products
npm run test:e2e: PASS - 29/29 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm ci: NOT CAPTURED in the provided terminal log
```

Production verification from the stable baseline:

```txt
Production URL: https://skinwise-vn.vercel.app
Production smoke test: PASS - user-reported manual verification completed
Production monitoring: PASS - user-reported checks completed
Critical blockers reported: None
Evidence date: 2026-06-04
```

## 6. Post-MVP Priority Direction

Recommended order:

```txt
P1 - UX polish and empty states
P1 - Error/loading/helper copy
P2 - Product and ingredient data quality
P2 - Production observability/release confidence
P3 - Admin/content management
P3 - Optional real AI provider integration
P4 - Portfolio assets, skipped for now
```

## 7. Next Recommended Task

```txt
v1.13 - UX Polish & Empty State Improvement
```

Reason:

```txt
It improves the existing app without risky feature expansion, database changes, auth changes, or architecture rewrites.
```

Target areas:

```txt
Loading states
Empty states
Error messages
Helper text
CTA consistency
Mobile spacing
Dashboard hierarchy
First-time user guidance
```

## 8. Suggested Commit

```bash
git add .
git commit -m "docs: add post-MVP backlog"
git push
```

After that, start v1.13 on a separate commit/branch.
