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
Latest completed milestone: MVP v1.23 - Account Data Deletion Workflow Hardening
Current active milestone: None
Current active milestone status: NONE
Production URL public reachability: PASS for v1.22.1 public check
Production /api/health: PASS for v1.22.1 public check
Authenticated MVP production smoke: NOT CHECKED / DEFERRED
Production signals: NOT CHECKED / DEFERRED
Recommended next task: v1.24 - Seed Data Quality Expansion Round 2
Current phase: Post-MVP controlled improvement
```

v1.22.1 remains partial/deferred because only the public production URL and `/api/health` were checked directly. Authenticated MVP flows and production platform signals were not checked.

v1.23 hardened the existing account app-data deletion workflow by improving destructive confirmation copy, proving server-side ownership boundaries, extending sensitive-response checks, and documenting the data deletion boundary.

## 2. Objective

Harden the existing user app-data deletion workflow so it is safer, clearer, better tested, and better documented without expanding MVP scope.

The milestone preserves:

```txt
No Google account deletion
No OAuth provider account deletion
No shared product catalogue deletion
No shared ingredient library deletion
No other-user data deletion
No database schema change
No new collection
No new dependency
No admin CRUD
No payment, checkout, marketplace, or order workflow
No real AI provider integration
No image upload, skin image analysis, diagnosis, treatment advice, or skin scoring
No secret, token, OAuth credential, database URI, raw environment variable, password, cookie, session token, or raw production database document exposure
```

## 3. Files Changed

Active files:

```txt
src/modules/settings/components/settings-data-control-center.tsx
tests/unit/delete-account-app-data-api-contract.test.ts
tests/unit/account-data-repository.test.ts
tests/unit/settings-ui.test.ts
tests/unit/settings-client.test.ts
docs/data-control-and-deletion.md
docs/release-evidence-v1.23.md
docs/post-mvp-backlog.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/06-current-sprint-plan.md
docs/final-release-checklist.md
docs/00-source-of-truth.md
README.md
```

## 4. Acceptance Criteria

Functional and privacy:

```txt
[x] Existing delete app data UI reviewed.
[x] Existing DELETE /api/account/app-data route reviewed.
[x] Delete API requires authentication.
[x] Delete API resolves the current user server-side.
[x] Delete API uses only the server-resolved current user id.
[x] Delete API ignores malicious client-provided userId values.
[x] Repository deletion filters target only current-user records.
[x] Other users' records are not targeted by deletion filters.
[x] Shared product catalogue data is not deleted.
[x] Shared ingredient library data is not deleted.
[x] Google/OAuth account deletion remains out of scope.
[x] Delete response does not expose sensitive data.
[x] Error response does not expose stack traces or database internals.
[x] Confirmation copy explains irreversibility and non-deletion boundaries.
```

Documentation:

```txt
[x] Data control/deletion documentation added.
[x] v1.23 release evidence added.
[x] Status docs keep v1.22.1 production smoke as PARTIAL / DEFERRED.
[x] Status docs mark v1.23 as latest completed only after validation passed.
```

Manual/browser:

```txt
[ ] Manual browser deletion confirmation check.
[ ] Manual browser cancel deletion check.
[ ] Manual browser confirm deletion check.
[ ] Manual browser post-deletion empty-state check.
[ ] Production deletion smoke check.
```

Manual/browser and production checks remain NOT CHECKED for v1.23. Local tests and validation do not count as production verification.

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

Current v1.23 validation status:

```txt
Evidence date: 2026-06-11
Environment: Local Windows / PowerShell
Branch: main
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 992 tests
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
No image upload or image analysis.
No marketplace, cart, checkout, order workflow, or payment.
No reviews, ratings, likes, or sharing.
No notification/reminder system.
No admin dashboard.
No database schema change.
No external AI provider change.
No broad redesign.
No unrelated refactor.
```

## 7. Suggested Commit

```bash
git add .
git commit -m "chore: harden account data deletion workflow"
```
