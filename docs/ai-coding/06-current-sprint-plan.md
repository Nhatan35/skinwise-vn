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
UX polish implementation: DONE in v1.13
Data quality expansion: DONE in v1.14
Product Match explainability and safety guardrails: DONE in v1.15
Audit cleanup and evidence sync: DONE in v1.15.1
Saved Product Comparison & Decision Support: DONE in v1.16
Routine History & Weekly Progress Review: DONE in v1.17
Skin Journal Filters & Reflection Review: DONE in v1.18
Account Data Summary & Privacy Control Review: DONE in v1.19
Personal Insight Review & Safe Trend Cards: DONE in v1.20
Insight Explainability & Tracking Quality Checklist: DONE in v1.21
Production Observability & Release Confidence: DONE in v1.22
Latest completed milestone: MVP v1.22 - Production Observability & Release Confidence
Current active milestone: MVP v1.22.1 - Production Deployment & Smoke Verification
Current active milestone status: NOT DONE
Production URL public reachability: PASS
Production /api/health: PASS
Authenticated MVP production smoke: NOT CHECKED
Production signals: NOT CHECKED
Recommended next task: Complete manual authenticated production smoke and production signal checks
Current phase: Post-MVP controlled improvement
```

v1.22 improves production confidence by adding a safe public health check endpoint, health API contract test, release evidence documentation, production incident note template, and monitoring/release checklist updates.

v1.22.1 is a production verification task. It has completed local validation and direct public checks for the production URL and `/api/health`, but it is not done because authenticated MVP flows and production platform signals were not checked.

## 2. Objective

Make the app easier to verify in production, easier to monitor, and easier to debug if an incident happens without adding product features or expanding MVP scope.

For v1.22.1, verify the deployed production environment and update evidence truthfully without treating local validation or historical/user-reported production evidence as current production smoke proof.

The milestone preserves:

```txt
No diagnosis
No treatment advice
No clinical conclusion
No skin score
No image upload or image analysis
No marketplace, payment, cart, checkout, or order workflow
No admin CRUD
No real AI provider integration
No database schema change
No new dependency
No external observability vendor or SDK
No health-check dependency on auth, database, AI, OAuth, env vars, or external services
No secret, token, database URI, OAuth credential, private user data, userId, email, password, or raw document exposure
```

## 3. Files Changed

Active files:

```txt
src/app/api/health/route.ts
tests/unit/health-api-contract.test.ts
docs/release-evidence-v1.22.md
docs/production-incident-note-template.md
docs/post-mvp-backlog.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/06-current-sprint-plan.md
docs/final-release-checklist.md
docs/production-monitoring-runbook.md
docs/00-source-of-truth.md
README.md
```

## 4. Acceptance Criteria

Functional:

```txt
[x] Public GET /api/health exists.
[x] GET /api/health returns HTTP 200.
[x] Health response includes status, app, version, timestamp, and checks.app.
[x] Health response version is v1.22.
[x] Health timestamp is generated with new Date().toISOString().
[x] Health endpoint is request-time dynamic.
[x] Health endpoint does not use SkinWise { data, error } wrapper.
[x] Production URL public reachability was checked directly.
[x] Production `/api/health` was checked directly.
[ ] Google OAuth login was checked in production.
[ ] Dashboard after login was checked in production.
[ ] Main authenticated MVP flows were checked in production.
[ ] Production browser/platform signals were checked.
```

Privacy and security:

```txt
[x] Health endpoint does not require authentication.
[x] Health endpoint does not import auth, database, AI provider, user, env config, or secret helper modules.
[x] Health endpoint does not query the database.
[x] Health endpoint does not call external services.
[x] Health response does not expose secrets, tokens, OAuth credentials, database URI, userId, email, password, raw documents, or process.env.
[x] Production evidence documentation keeps production smoke as NOT CHECKED.
[x] Historical/user-reported production evidence remains separate from v1.22.1 direct verification.
```

Technical:

```txt
[x] Health API contract test imports the route module directly.
[x] Health API contract test verifies GET export, unsupported method absence, response shape, ISO timestamp, and sensitive-string absence.
[x] No new test framework, dependency, package script, or package lock change.
[x] No product feature, schema, route-auth, persistence, AI-provider, or business-rule expansion.
[x] Required validation passes before marking DONE.
[x] v1.22.1 remains NOT DONE because full production smoke and production signal checks are incomplete.
```

Documentation:

```txt
[x] Release evidence file added for v1.22.
[x] Production incident note template added.
[x] Production monitoring runbook documents /api/health check and its intentional limits.
[x] Final release checklist includes v1.22 and required validation commands.
[x] Status docs identify v1.22 as the latest completed milestone after validation passed.
[x] README release/status and health endpoint references are synchronized.
```

## 5. Validation Checklist

Required before marking DONE:

```txt
[x] npm run lint
[x] npm run typecheck
[x] npm run test
[x] npm run build
[x] npm run test:e2e
[x] npm audit --omit=dev --audit-level=moderate
```

Current v1.22.1 validation status:

```txt
Evidence date: 2026-06-11
Environment: Local Windows / PowerShell
Branch: main
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 991 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 31/31 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Production smoke status:

```txt
Production URL public reachability: PASS - direct unauthenticated HTTP 200
Production /api/health on deployed URL: PASS - direct unauthenticated HTTP 200 with expected v1.22 JSON contract
Authenticated MVP production smoke: NOT CHECKED
Production signals: NOT CHECKED
v1.22.1 final status: NOT DONE
```

## 6. Non-Goals

```txt
No diagnosis.
No treatment guidance.
No clinical conclusion.
No skin or health scoring.
No risk scoring.
No health grading.
No image upload or image analysis.
No marketplace, cart, checkout, order workflow, or payment.
No reviews, ratings, likes, or sharing.
No notification/reminder system.
No admin dashboard.
No database schema change.
No external AI provider change.
No external monitoring SDK.
No broad redesign.
No unrelated refactor.
```

## 7. Suggested Commit

```bash
git add .
git commit -m "chore: add production observability release confidence"
```
