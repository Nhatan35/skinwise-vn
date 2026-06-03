# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-03

## 1. Current Sprint

```txt
MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup
```

Status:

```txt
Product implementation: NOT APPLICABLE - documentation-only cleanup
Documentation sync: DONE
Validation rerun: NOT RUN
Production smoke evidence: NEXT
Production monitoring/demo recovery evidence: NEXT
```

MVP v1.8.1 is a documentation cleanup patch/task after the completed MVP v1.8 product release. It synchronizes release status, demo readiness, validation wording, production evidence status, and next-task documentation without adding features, changing source code, or changing product behavior.

## 2. Objective

Make the repository documentation truthful and consistent for portfolio/demo/interview use after MVP v1.8 completion.

The synchronized docs should help a reviewer see:

```txt
MVP v1.8 completed product release -> MVP v1.8.1 documentation cleanup -> MVP v1.9 production evidence hardening
```

## 3. Scope

Completed v1.8.1 documentation scope:

```txt
[x] Mark MVP v1.8 as the completed product release.
[x] Mark MVP core scope as completed.
[x] Mark the product ready for portfolio/demo/interview as an MVP.
[x] Document MVP v1.8.1 as a documentation cleanup patch/task, not a feature release.
[x] Document MVP v1.9 as the next recommended task.
[x] Clarify production smoke test evidence as pending v1.9 work.
[x] Clarify production monitoring/demo recovery evidence as pending v1.9 work.
[x] Preserve historical v1.6/v1.7/v1.8 references where they are release history.
[x] Add/update production smoke test and monitoring/demo recovery docs.
```

## 4. Non-Goals

```txt
No source code, route, API, schema, business logic, UI/UX, dependency, test, or package-file change.
No new product feature release.
No production evidence claim without a real verification run.
No real AI provider integration.
No image upload, skin scoring, marketplace, cart, checkout, payment, admin CRUD, reviews, or notifications.
No medical diagnosis, treatment claim, or guaranteed skincare outcome.
```

## 5. Validation Commands

For v1.8.1, record whether these were run:

```txt
node -v
npm -v
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:indexes
npm run db:seed
npm run test:e2e
npm audit --omit=dev --audit-level=moderate
```

Database commands should run only against the configured safe local/development or explicit demo database.

## 6. Validation Evidence

Validation not rerun in this task. Pending local verification on Node.js 24.x and npm 11.x.

Latest historical MVP v1.8 environment:

```txt
Node.js: v24.14.0
npm: 11.14.1
Target baseline: Node.js 24.x / npm 11.x
Baseline match: YES
```

Latest historical MVP v1.8 results:

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
