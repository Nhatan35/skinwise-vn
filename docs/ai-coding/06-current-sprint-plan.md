# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-28

## 1. Current phase

```txt
Post Week 6 MVP closeout, validation, and deployment re-verification follow-up
```

The main Week 1-6 MVP implementation is completed. Feature Roadmap v1.1 added the authenticated Ingredient Library UI. Feature Roadmap v1.2 adds authenticated Saved Products on top of the existing product catalogue/detail flow. MVP-TODAY-LOG-001 completed the daily routine tracking flow with a dedicated `/routine-logs/today` checklist page. MVP-DATA-CONTROL-001 added `/settings`, account deletion request marking, and RoutineLog deletion. MVP-DATA-CONTROL-CLOSEOUT-001 closes the task with direct DELETE API contract coverage and stale documentation cleanup. QUALITY-001 added safe test-only authenticated Playwright coverage, and QUALITY-002A extends that foundation to Skin Profile, Product Catalogue, and Product Detail smoke flows with deterministic local/test product data. RUNTIME-001 updates the project runtime baseline to Node 24.x / npm 11.x. INGREDIENT-UI-001 local validation passed including authenticated Playwright E2E against the safe local test database. SAVED-PRODUCTS-001 local validation passed, including `npm run db:indexes`, `npm run db:seed:e2e`, and authenticated Playwright E2E against `skinwise-e2e-check`. DEPLOY-VERIFY-001 remains partial: historical local validation and public unauthenticated production smoke checks passed, while external platform verification remains pending.

## 2. Current feature task

Current task:

```txt
MVP-E2E-CLOSEOUT-001 - Close out MVP core journey E2E validation and fix Routine Analysis duplicate React key warning
```

Status:

```txt
MVP-CORE-JOURNEY-E2E-001: COMPLETED IN SOURCE/DOCS.
MVP-CORE-JOURNEY-E2E-VALIDATION-001: COMPLETED WITH LATEST LOCAL VALIDATION EVIDENCE RECORDED.
MVP-E2E-CLOSEOUT-001: IMPLEMENTED IN SOURCE/DOCS; FINAL COMPLETION REQUIRES TARGET-RUNTIME VALIDATION AFTER THE DUPLICATE-KEY PATCH.
MVP-DATA-CONTROL-CLOSEOUT-001: COMPLETED IN SOURCE/DOCS; LOCAL VALIDATION RECORDED BY THAT TASK.
MVP-DATA-CONTROL-001: COMPLETED IN SOURCE.
Settings route: /settings.
Settings UI: account overview, data management navigation, and MVP-safe account deletion request.
RoutineLog delete API: DELETE /api/routine-logs/:id, scoped to the authenticated user.
Today Log route: /routine-logs/today.
Today Log UI: authenticated checklist for morning/evening routines using existing RoutineLog controls, including delete support for existing routine logs.
Documentation closeout: RoutineLog API docs, UI route map, feature matrix, implementation status, changelog, sprint plan, and README updated.
Product scope changes: none.
Settings page rewrite: not performed.
Today Routine Checklist rewrite: not performed.
RoutineLog API rewrite: not performed.
Hard-delete Auth.js account flow: not implemented by design.
Bulk data deletion/export/legal compliance claims: not implemented by design.
Real OpenAI/Gemini provider verification: not completed; mock/fallback-safe behavior remains the demo-safe baseline.
Deployment status: Deployed for MVP demo.
Actual Vercel deployment: COMPLETED historically.
Deployment target: Vercel.
Production branch: main.
Production commit: db72e07.
Production URL: https://skinwise-vn.vercel.app
Previously documented DEPLOY-002 production smoke test: PASSED.
Previously documented Google OAuth production login: PASSED.
Previously documented MongoDB production/demo read/write through authenticated flows: PASSED.
Current DEPLOY-VERIFY-001 public URL and unauthenticated redirects: PASSED historically.
Current DEPLOY-VERIFY-001 Vercel env/logs, Google OAuth login, authenticated dashboard, MongoDB read/write, and sign-out: NOT VERIFIED without external access.
QUALITY-001: COMPLETED.
QUALITY-002A: IMPLEMENTED.
MVP-CORE-JOURNEY-E2E-001: added authenticated Playwright specs for Routine Builder, Routine Analysis, Today Checklist, Routine Log delete, Skin Journal, Settings/Data Control, account deletion request, Dashboard reflection, plus `/routine-logs/today` and `/settings` protected route smoke coverage. MVP-E2E-CLOSEOUT-001 fixes the Routine Analysis duplicate React key warning in the UI render layer and adds a targeted warning guard to the Routine Analysis E2E flow.
RUNTIME-001: CONFIG/DOCS UPDATED; project target runtime remains Node 24.x / npm 11.x.
This sandbox validation used Node v22.16.0 / npm 10.9.2 because Node 24/npm 11 was not available in the container.
```

## 3. Current runtime task

```txt
RUNTIME-001 - Standardize project runtime on Node 24 and npm 11
```

Status:

```txt
Config/docs updated. Historical runtime validation under Node v24.14.0 / npm 11.14.1 passed for `npm ci`, lint, typecheck, unit tests, build, and production audit. Current Ingredient Library UI validation also passed `npm run db:seed:e2e` against `skinwise-e2e-check` and `npm run test:e2e` with 12 tests. Current Saved Products validation passed lint, typecheck, unit tests, build, local/test index creation, E2E seeding, and `npm run test:e2e` with 14 tests.
```

## 4. Latest quality task

```txt
MVP-E2E-CLOSEOUT-001 - MVP core journey E2E closeout and Routine Analysis duplicate-key polish
```

## 5. Completed MVP implementation status

```txt
Week 1 Foundation completed
Week 2 Skin Profile, Product, and Ingredient backend foundation completed
Week 3 Routine Builder and RoutineLog completed
Week 4 Routine Safety Engine and Routine Analysis completed
Week 5 AI provider abstraction, mock AI provider, validated AI provider, and Ingredient Explanation API completed
Week 6 Skin Journal, Dashboard enhancement, Product Catalogue UI, and Product Detail UI completed
Feature Roadmap v1.1 Ingredient Library UI completed in source
Feature Roadmap v1.2 Saved Products completed in source
MVP-TODAY-LOG-001 dedicated Today Routine Checklist completed in source
MVP-DATA-CONTROL-001 Settings and Privacy Data Control Center completed in source
MVP-DATA-CONTROL-CLOSEOUT-001 Settings/Data Control closeout completed in source/docs
MVP-CORE-JOURNEY-E2E-001 core journey E2E coverage completed in source/docs
MVP-UIUX-CLOSEOUT-001 dashboard real-data and Vietnamese UI copy closeout completed in source/docs
MVP-CORE-JOURNEY-E2E-VALIDATION-001 latest local validation evidence recorded as completed
MVP-E2E-CLOSEOUT-001 duplicate-key fix and targeted warning guard implemented; final closeout completion depends on target validation commands passing
```

## 6. Deployment preparation goals

```txt
[x] Confirm local env files are ignored and not tracked.
[x] Confirm .env.example uses placeholders only and matches src/config/env.ts.
[x] Add exact Vercel deployment runbook.
[x] Document production environment variables supported by source.
[x] Document MongoDB Atlas and Google OAuth production setup.
[x] Add historical Node 20 marker for previous Vercel/local version alignment.
[x] Update runtime baseline to Node 24.x / npm 11.x.
[x] Create clean deployment package excluding secrets and generated artifacts.
[x] Run local validation commands.
[x] Execute real Vercel deployment.
[x] Configure production environment variables in Vercel.
[x] Configure/test Google OAuth production callback.
[x] Verify MongoDB Atlas production/demo access from Vercel.
[x] Run production smoke test.
[x] Fix LF/CRLF-sensitive clean package validation in Routine Builder unit test.
[x] Add root .gitattributes for line-ending normalization.
[x] Prepare portfolio-ready public/shared product and ingredient demo seed data.
[x] Document safe authenticated manual setup for user-owned demo data.
[x] Document BA and technical demo walkthrough.
[x] Prepare portfolio case study.
[x] Prepare presentation-ready demo script.
[x] Prepare screenshots checklist.
[x] Prepare final release checklist.
[x] Prepare release notes v1.0.
[x] Polish README as portfolio entry point.
[x] Add unauthenticated Playwright smoke tests.
[x] Run `npm run test:e2e` in CI with safe placeholder environment values.
[x] Add test-only Auth.js Credentials provider gated by `APP_ENV="test"` and `E2E_TEST_AUTH="true"`.
[x] Add authenticated Playwright dashboard smoke test.
[x] Add deterministic local/test E2E product data seed command.
[x] Add authenticated Skin Profile create/update Playwright spec.
[x] Add authenticated Product Catalogue and Product Detail Playwright spec.
[x] Add authenticated Ingredient Library browse/search/detail/explanation UI.
[x] Enable authenticated `/ingredients` and `/ingredients/[id]` routes.
[x] Enable Ingredients in dashboard navigation.
[x] Add Ingredient Library unit/source checks and authenticated Playwright spec.
[x] Add authenticated Saved Products save/list/remove UI.
[x] Enable authenticated `/saved-products` route.
[x] Enable Saved Products in dashboard navigation.
[x] Add Saved Products unit/API/client/repository/source checks and authenticated Playwright spec.
[x] Add dedicated `/routine-logs/today` Today Checklist page.
[x] Enable Today Log dashboard navigation.
[x] Link dashboard routine logging CTAs to `/routine-logs/today`.
[x] Add protected `/settings` Settings & Data Control page.
[x] Add MVP-safe account deletion request marker.
[x] Add user-scoped `DELETE /api/routine-logs/:id`.
[x] Add direct RoutineLog DELETE API contract coverage.
[x] Clean stale Settings/Data Control and RoutineLog docs.
[x] Add deterministic E2E-user-owned data reset in the safe local/test seed path.
[x] Add authenticated Routine Builder and Routine Analysis Playwright coverage.
[x] Add authenticated Today Routine Checklist and Routine Log delete Playwright coverage.
[x] Add authenticated Skin Journal create/edit/delete Playwright coverage.
[x] Add authenticated Settings/Data Control and account deletion request Playwright coverage.
[x] Add authenticated Dashboard reflection Playwright coverage.
[x] Add protected route smoke coverage for `/routine-logs/today` and `/settings`.
[x] Run historical DEPLOY-VERIFY-001 local validation with Node 20.
[x] Record latest local MVP core journey E2E validation evidence.
[x] Fix Routine Analysis duplicate React key warning in the UI render layer.
[x] Add targeted Routine Analysis E2E duplicate-key warning guard.
[ ] Rerun full local validation with Node 24.x / npm 11.x including E2E with local MongoDB available after MVP-E2E-CLOSEOUT-001 changes.
[ ] Run CI validation with Node 24.x.
[x] Verify public production URL and unauthenticated protected-route redirects.
[ ] Verify current Vercel build/logs/environment variables with direct platform evidence.
[ ] Verify current Google OAuth production login with direct manual evidence.
[ ] Verify current MongoDB Atlas read/write through authenticated production flow.
[ ] Verify sign-out and post-sign-out protected-route redirect.
[ ] Review Vercel runtime logs after current smoke testing.
```

## 7. Not allowed in this phase

```txt
No unrelated product feature.
No Product CRUD.
No admin review workflow.
No public sharing of saved products.
No cart, checkout, marketplace, payment, likes, ratings, reviews, or recommendation algorithm.
No image upload.
No AI face analysis.
No skin score.
No diagnosis.
No marketplace.
No payment/subscription.
No production deployment claim without evidence.
No real AI provider completion claim without implementation and verification.
```

## 8. Validation scope

Run available scripts from `package.json` where safe. For MVP-CORE-JOURNEY-E2E-001, run:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:seed:e2e, only when the safe local/test MongoDB target is available
npm run test:e2e, only when local MongoDB is available
```

Database commands must only run against a known local/test database. Do not seed production data.

Latest MVP-CORE-JOURNEY-E2E-VALIDATION-001 local validation evidence:

```txt
npm run typecheck: PASS
npm run lint: PASS
npm run test: PASS - 72 files, 717 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured after .env.local was available locally
npm run db:seed:e2e: PASS
npm run test:e2e: PASS - 24 tests passed
```

Validation notes:

```txt
The evidence above is local validation only.
.env.local was available locally for database-backed commands, but no secret values are documented.
Production verification remains separate.
Real Google OAuth E2E validation is not claimed.
Real external AI provider E2E validation is not claimed.
Full production readiness is not claimed.
```

Latest MVP-E2E-CLOSEOUT-001 validation requirement:

```txt
After the duplicate-key fix and targeted warning guard, rerun:
node -v
npm -v
npm run typecheck
npm run lint
npm run test
npm run build
npm run db:indexes
npm run db:seed:e2e
npm run test:e2e

MVP-E2E-CLOSEOUT-001 must not be marked fully completed until those commands pass in the target Node 24/npm 11 local/test environment and E2E output or the targeted guard confirms the duplicate key warning is gone.
```

## 8. Recommended next task

```txt
DEPLOY-VERIFY-001A - Complete manual external platform verification with Vercel, Google Cloud Console, and MongoDB Atlas evidence.
```

Reason: local validation plus public unauthenticated production checks passed, but current Vercel environment/log evidence, Google OAuth login, authenticated dashboard, MongoDB-backed read/write, sign-out, and runtime-log review still require external platform access or user-provided evidence.


## MVP-DATA-CONTROL-001

[x] Add protected `/settings` Settings & Data Control page.
[x] Add MVP-safe account deletion request marker.
[x] Add user-scoped single RoutineLog deletion API and Today Log UI action.
[x] Update tests and documentation without adding out-of-scope export, notifications, admin, or hard-delete flows.

## MVP-DATA-CONTROL-CLOSEOUT-001

[x] Add direct `DELETE /api/routine-logs/[id]` API contract coverage.
[x] Clean stale RoutineLog API docs.
[x] Update route map latest task and `/routine-logs/today` dependencies.
[x] Move Settings/Data Control into the main feature matrix table.
[x] Update implementation status, changelog, sprint plan, and README.
[x] Run local validation commands and report skipped E2E checks honestly.
