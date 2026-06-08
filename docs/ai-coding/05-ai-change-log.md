# 05-ai-change-log.md

# AI Change Log — SkinWise VN MVP Final Closeout

This file records AI-assisted changes so future coding sessions understand what changed and why.

Current-status note: this file is a chronological change log. Older sections may say "latest" or "current" relative to their original date. For the current project state and validation evidence, use `docs/ai-coding/02-implementation-status.md`, `docs/ai-coding/06-current-sprint-plan.md`, and `docs/final-release-checklist.md`.

## 2026-06-08 - MVP v1.17 Routine History & Weekly Progress Review

### Task

Add a lightweight weekly routine review to `/routine-logs/today` so users can review routine habit consistency over the last 7 local dates using existing routine log data.

### Files Added

- `src/modules/routine-logs/components/routine-weekly-review-card.tsx`
- `src/modules/routine-logs/routine-weekly-review.ts`
- `tests/unit/routine-log-list-api-contract.test.ts`
- `tests/unit/routine-weekly-review.test.ts`

### Files Updated

- `src/app/api/routine-logs/route.ts`
- `src/modules/routine-logs/components/today-routine-checklist.tsx`
- `src/modules/routine-logs/index.ts`
- `src/modules/routine-logs/routine-log.client.ts`
- `src/modules/routine-logs/routine-log.schema.ts`
- `tests/unit/routine-log.test.ts`
- `tests/unit/routine-log-use-case.test.ts`
- `tests/unit/routine-log-client.test.ts`
- `tests/unit/routine-log-ui.test.ts`
- `tests/e2e/today-routine-log.authenticated.spec.ts`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`

### Outcome

- Added weekly routine review data helper.
- Added 7-day routine consistency summary on the Today Routine Log page.
- Added safe habit-tracking disclaimer.
- Added bounded `from`/`to` support to the existing RoutineLog GET API while keeping `localDate` behavior.
- Updated unit and E2E tests where stable.
- Updated docs for the active v1.17 sprint.

### Validation

```txt
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 99 files / 929 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 30/30 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

### Status

```txt
DONE after full local validation passed.
```

## 2026-06-08 - MVP v1.16 Saved Product Comparison & Decision Support

### Task

Add a small educational comparison flow to the existing Saved Products experience so users can select 2-3 saved products and compare existing product fields side by side.

### Files Added

- `src/modules/saved-products/components/saved-products-comparison-panel.tsx`

### Files Updated

- `src/modules/saved-products/components/saved-products-page.tsx`
- `src/modules/saved-products/components/saved-product-card.tsx`
- `tests/unit/saved-products-ui.test.ts`
- `tests/e2e/saved-products.authenticated.spec.ts`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`

### Outcome

- Added saved product comparison selection.
- Added a comparison panel for 2-3 saved products.
- Added safe educational comparison copy and a medical-safety disclaimer.
- Updated source-level guardrail tests.
- Added a stable authenticated E2E comparison flow using seeded products and API setup/cleanup.
- Updated docs so v1.16 is Saved Product Comparison & Decision Support, with the prior release/observability candidate moved out of the v1.16 slot.

### Validation

```txt
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 903 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 30/30 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

## 2026-06-07 - Portfolio Evidence Package Documentation

### Task

Prepare a docs-only Portfolio Evidence Package for README, portfolio, CV/resume, recruiter review, interview explanation, and 3-5 minute demo presentation.

### Files Added

- `docs/portfolio-evidence-package.md`

### Files Updated

- `README.md`
- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/screenshots-checklist.md`
- `docs/final-release-checklist.md`
- `docs/post-mvp-backlog.md`
- `docs/09-release-plan.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/ai-coding/07-demo-data-and-demo-script.md`

### Outcome

- Added a central portfolio package with product positioning, recruiter summary, CV/resume draft, interview narrative, 3-5 minute demo run of show, media capture plan, and evidence boundary.
- Marked screenshots and demo video as optional media evidence that is not claimed unless actual files are captured.
- Corrected the demo-script validation Q&A from an older 894-test count to the current historical v1.15.1 evidence of 97 files / 899 tests.
- Preserved historical local validation and user-reported production smoke/monitoring evidence as dated historical evidence only.
- Did not change product behavior, source logic, schema, routes, auth, authorization, persistence, dependencies, environment files, deployment config, or AI-provider behavior.

### Validation

```txt
Docs-only task.
git diff --check: PASS
Trailing-space scan on edited docs: PASS
Unsafe/stale evidence phrase scan: reviewed; matches were safety-boundary wording or explicit non-claim statements.
Product validation commands: NOT RUN
Production smoke test: NOT RUN
Screenshot capture: NOT RUN
Demo video recording: NOT RUN
```

### Next Evidence Follow-Up

```txt
Optional screenshot capture and short demo video recording, if needed for portfolio publishing.
```

## 2026-06-06 - MVP v1.15.1 Audit Cleanup & Evidence Sync

### Task

Review npm audit evidence, confirm the suspected `hono` dependency path, classify `shadcn` usage, avoid unsafe forced fixes, and synchronize release documentation without changing product behavior.

### Files Updated

- `AGENTS.md`
- `README.md`
- Release/status documentation under `docs/`

### Outcome

- Confirmed Node.js 24.x / npm 11.x runtime baseline.
- Confirmed `npm audit --omit=dev --audit-level=moderate` returns 0 production vulnerabilities.
- Confirmed the dependency path `shadcn -> @modelcontextprotocol/sdk -> @hono/node-server -> hono` exists.
- Kept `shadcn` in dependencies because `src/app/globals.css` imports `shadcn/tailwind.css`.
- Did not run `npm audit fix --force`.
- Did not change Product Match, Product Detail, schema, routes, auth, persistence, or AI-provider behavior.
- Portfolio Evidence Package remains the recommended next presentation/evidence task, not a product correctness blocker.

### Validation

```txt
npm ci: PASS after sandbox EPERM rerun outside sandbox
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 899 tests
npm run build: PASS after sandbox EPERM rerun outside sandbox
npm run test:e2e: PASS after sandbox EPERM rerun outside sandbox - 29/29 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

### Next Recommended Task

```txt
Portfolio Evidence Package
```

## 2026-06-06 - MVP v1.15 Product Match Explainability & Safety Guardrails

### Task

Improve Product Match and Product Detail explainability, caution wording, and missing/unknown-profile guidance without adding clinical advice behavior, changing database schema, or redesigning the recommendation engine.

### Files Updated

- `src/modules/product-match/*`
- `src/modules/products/product-safety-signals.ts`
- `src/modules/products/product-detail-decision-support.ts`
- `src/modules/products/components/product-detail.tsx`
- Product Match and Product Detail unit tests.
- Release/status documentation.

### Outcome

- Product Match explanations now name matched skin type and selected concern signals more clearly.
- Product Match cards show clearer matched-factor labels.
- Product Match caution notes now cover exfoliating acids, multiple exfoliating acids, retinoid/BPO-style strong actives, fragrance/essential oils, sensitive skin, and dry/barrier-prone caution signals.
- Product Detail decision support now uses clearer fit, caution, routine usage, and data-quality/uncertainty wording.
- No-profile and unknown-profile states now guide users to complete or update their skin profile.
- Portfolio Evidence Package remains the recommended next presentation/evidence task, not a product correctness blocker.

### Validation

```txt
npm ci: PASS after sandbox EPERM rerun outside sandbox
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 899 tests
npm run build: PASS after sandbox EPERM rerun outside sandbox
npm run test:e2e: PASS after sandbox EPERM rerun outside sandbox - 29/29 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

### Next Recommended Task

```txt
Portfolio Evidence Package
```

## 2026-06-05 - MVP v1.14 Data Quality Expansion

### Task

Expand curated product and ingredient seed data for better demo quality and Product Match coverage without adding new product features or changing schema, routes, auth, Product Match scoring, or AI-provider behavior.

### Files Updated

- `scripts/seed.ts`
- `tests/unit/seed-data-quality.test.ts`
- `README.md`
- `docs/14-seed-data-spec.md`
- `docs/post-mvp-backlog.md`
- `docs/09-release-plan.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/ai-coding/07-demo-data-and-demo-script.md`

### Outcome

- Product seed data expanded from 38 to 58 curated products.
- Ingredient seed data expanded from 40 to 59 curated ingredients.
- Product Match seed coverage improved for oily/acne-prone, dry/barrier-support, sensitive/redness-prone, dark-spots, texture, sunscreen, and minimal-routine demo journeys.
- Seed assertions now enforce v1.14 minimum counts, product-name uniqueness, brand/name uniqueness, category/skin-type/concern coverage, and strong-active cautions.
- Added focused unit coverage for seed counts, uniqueness, coverage, strong-active safety, and useful Product Match candidates.

### Validation

```txt
npm ci: PASS after sandbox EPERM rerun outside sandbox
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 894 tests
npm run build: PASS after sandbox EPERM rerun outside sandbox
npm run test:e2e: PASS after sandbox EPERM rerun outside sandbox - 29/29 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

### Next Recommended Task

```txt
Portfolio Evidence Package
```

## 2026-06-05 - Documentation Status Synchronization for MVP v1.13

### Task

Synchronize repository documentation at that point so v1.13 was treated as the completed milestone, v1.14 Data Quality Expansion was the next scoped product task, and portfolio evidence tasks remained separate from product correctness.

### Scope

- Documentation-only status synchronization.
- No product features, runtime configuration, database schema, dependency updates, or source refactors.

### Historical Status Wording Captured In That Sync

```txt
Core MVP: COMPLETE
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Completed milestone at that point: MVP v1.13 - UX Polish & Empty State Improvement
Current phase: Post-MVP controlled improvement
Next scoped product task at that point: MVP v1.14 - Data Quality Expansion
Portfolio evidence tasks: screenshots, demo video, CV/portfolio case study
```

## 2026-06-04 - MVP v1.13 UX Polish & Empty State Improvement

### Task

Improve first-time UX states across the existing MVP without adding new product scope, changing persistence behavior, or changing auth/business rules.

### Files Updated

- Shared loading, empty, and error state components.
- Dashboard, product, Product Match, saved products, ingredient, routine, today routine, journal, insights, settings, and skin profile UI components.
- Affected unit UI tests and ingredient E2E text assertions.
- `README.md`
- `docs/post-mvp-backlog.md`
- `docs/09-release-plan.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`

### Outcome

- Added more specific Vietnamese loading messages.
- Improved empty states with clearer titles, descriptions, and existing-route/action CTAs.
- Improved error states and recovery guidance.
- Added first-time dashboard guidance using existing routes.
- Improved Product Match missing-profile guidance.
- Reduced mixed English/Vietnamese copy in touched UX states.
- Kept shared component prop changes backward-compatible.

### Scope Boundaries

- No database schema, collection, index, seed data, DTO, or persistence behavior change.
- No authentication or authorization logic change.
- No Product Match rule change.
- No Routine Safety Engine change.
- No real AI provider integration.
- No admin, marketplace, payment, notification, review, rating, image upload, or skin scoring scope.

### Validation

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 96 files / 889 tests
npm run build: PASS
npm run test:e2e: PASS - 29/29 Playwright tests
```

Validation note:

```txt
The first sandboxed build and E2E attempts failed with spawn EPERM. The same commands passed when rerun outside the sandbox.
Database commands were not required because v1.13 did not change schema, seed data, indexes, or persistence behavior.
Production smoke and monitoring were not rerun for v1.13.
```

## 2026-06-04 - MVP v1.11 Portfolio Demo Readiness Polish

### Task

Finalize portfolio/demo/interview readiness documentation after local validation passed and production smoke/monitoring checks were user-reported as completed with no blockers.

This is a documentation-only update. No source code, route, API, schema, dependency, or business-logic change was made.

### Files Changed

- `README.md`
- `AGENTS.md`
- `docs/00-source-of-truth.md`
- `docs/09-release-plan.md`
- `docs/13-ui-route-map.md`
- `docs/18-deployment-checklist.md`
- `docs/final-release-checklist.md`
- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/screenshots-checklist.md`
- `docs/production-smoke-test-v1.9.md`
- `docs/production-monitoring-runbook.md`
- `docs/deployment/vercel-deployment.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/ai-coding/07-demo-data-and-demo-script.md`

### Evidence Recorded

```txt
MVP v1.9 local validation: PASS
MVP v1.10 production smoke test: PASS - user-reported
MVP v1.10 production monitoring: PASS - user-reported
MVP v1.11 portfolio demo readiness: DONE
Critical blockers reported: None
```

### Evidence Boundary

- Local validation evidence is supported by the terminal output already recorded in the repository docs.
- Production PASS is based on the user's reported manual verification, with no blockers reported.
- Screenshots, deployment ids, browser logs, and sanitized Vercel logs should be preserved separately if stricter audit evidence is required.
- No real secrets, OAuth tokens, database URIs, or private user data were added.

### Recommended Next Task

```txt
Optional portfolio polish: capture screenshots, practice 3-5 minute demo, commit/tag v1.11, and add the project to portfolio/CV.
```

## 2026-06-04 - MVP v1.9 Local Validation Evidence Update

### Task

Record local validation evidence after the completed MVP v1.8.2 documentation consistency hotfix.

This is an evidence/documentation update. No product feature was added.

### Files Changed

- `README.md`
- `docs/09-release-plan.md`
- `docs/18-deployment-checklist.md`
- `docs/final-release-checklist.md`
- `docs/production-smoke-test-v1.9.md`
- `docs/production-monitoring-runbook.md`
- `docs/portfolio-case-study.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/ai-coding/07-demo-data-and-demo-script.md`

### Validation Evidence Recorded

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 96 files / 889 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run db:seed: PASS - 40 ingredients / 38 products
npm run test:e2e: PASS - 29/29 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm ci: NOT CAPTURED in the provided terminal log
```

### Boundaries

- No source code was changed.
- No schema, API, route, UI, business logic, dependency, or package-file change was made.
- Production smoke test evidence remains NOT RUN until manually verified against the deployed Vercel app.
- Production monitoring evidence remains PENDING until Vercel logs, browser console/network, OAuth, and MongoDB checks are manually verified.

### Recommended Next Task

```txt
MVP v1.9 - Production Smoke Test, Monitoring Evidence, and Demo Evidence Stabilization
```

## 2026-06-03 - MVP v1.8.2 Final Documentation Consistency Hotfix

### Task

Apply the final documentation consistency hotfix after MVP v1.8.1.

This is a documentation consistency hotfix. No product feature was added.

### Files Changed

- `README.md`
- `AGENTS.md`
- `docs/09-release-plan.md`
- `docs/13-ui-route-map.md`
- `docs/18-deployment-checklist.md`
- `docs/final-release-checklist.md`
- `docs/production-smoke-test-v1.9.md`
- `docs/production-monitoring-runbook.md`
- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/deployment/vercel-deployment.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/ai-coding/07-demo-data-and-demo-script.md`

### Main Corrections

- Added `MVP v1.8.2 - Final Documentation Consistency Hotfix` as the latest completed documentation hotfix.
- Kept `MVP v1.8 - Insights Usability & Progress Story Refinement` as the completed product release.
- Kept `MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup` as the completed documentation truth sync patch.
- Kept `MVP v1.9 - Production Monitoring & Demo Evidence Stabilization` as the next main task.
- Fixed current release/route-map headings that still used old `MVP v1.2.6` wording.
- Clarified portfolio/demo/interview readiness as READY at MVP level.
- Clarified production smoke test evidence as NOT RUN until manually verified.
- Clarified production monitoring evidence as PENDING until manually verified.

### Validation Status

```txt
Validation not rerun in this v1.8.2 documentation hotfix.
Latest historical validation evidence remains MVP v1.8 validation evidence where documented.
This v1.8.2 task did not rerun npm/build/test validation.
```

### Boundaries

- No schema change was made.
- No dependency was added.
- No business logic was changed.
- No route was changed.
- No UI/UX was changed.
- No source code was changed.
- No production evidence was claimed.

### Remaining Risks

- Full local validation remains pending.
- Production smoke test evidence remains NOT RUN until manually verified.
- Production monitoring evidence remains PENDING until manually verified.
- OAuth, database seed/index, E2E, and demo recovery evidence remain pending live verification.

### Recommended Next Task

```txt
MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
```

## 2026-06-03 - MVP v1.8.1 Documentation Truth Sync & Release Evidence Cleanup

### Task

Synchronize README and project documentation after the completed MVP v1.8 product release.

This is a documentation truth sync task, not feature implementation.

### Reason For Update

Avoid stale release status when using SkinWise VN for portfolio, demo, and interview review.

### Files Changed

- `README.md`
- `AGENTS.md`
- `docs/09-release-plan.md`
- `docs/13-ui-route-map.md`
- `docs/18-deployment-checklist.md`
- `docs/deployment/vercel-deployment.md`
- `docs/final-release-checklist.md`
- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/production-smoke-test-v1.9.md`
- `docs/production-monitoring-runbook.md`
- `docs/release-notes-v1.3.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/ai-coding/07-demo-data-and-demo-script.md`

### Main Documentation Sync Points

- MVP v1.8 is the completed product release.
- MVP core scope is completed.
- SkinWise VN is ready for portfolio/demo/interview use as an MVP.
- MVP v1.8.1 is a documentation cleanup patch/task, not a product feature release.
- Historical note: MVP v1.9 was identified as the next recommended task at that time.
- Historical note: production smoke test evidence was next-step work at that time.
- Historical note: production monitoring/demo recovery evidence was next-step work at that time.
- MVP v2.0 or later remains optional future enhancement scope.

### Validation

```txt
node -v: PASS - v24.14.0
npm -v: PASS - 11.14.1
npm ci: NOT RUN
npm run lint: NOT RUN
npm run typecheck: NOT RUN
npm run test: NOT RUN
npm run build: NOT RUN
npm run db:indexes: NOT RUN
npm run db:seed: NOT RUN
npm run test:e2e: NOT RUN
npm audit --omit=dev --audit-level=moderate: NOT RUN
```

Validation was not rerun in the v1.8.1 documentation cleanup task. Pending local verification on Node.js 24.x and npm 11.x.

### Boundaries

- No source code, business logic, database schema, route, UI/UX, test, package, or dependency change.
- No production evidence is claimed for v1.8.1.
- No real OpenAI/Gemini integration is claimed.
- No clinical assessment, prescription, skin scoring, face analysis, marketplace, checkout, or payment scope was added.

## 2026-05-31 - MVP-v1.3-FIX-002 Final Release Documentation Sync

### Task

Synchronize final release, portfolio, demo, deployment, changelog, release notes, and AI coding status documentation for the v1.3 release.

### Changes

- Created `docs/release-notes-v1.3.md`.
- Updated README release-note discoverability and demo flow.
- Updated final release checklist and deployment checklist with Product Match, Insights, and latest validation evidence.
- Updated portfolio case study, demo script, and demo data guide to cover Product Match and Insights walkthroughs.
- Updated current release/status docs to reflect Product Match completion, Insights completion, and final release documentation sync.
- Preserved historical v1.0 release notes and older dated validation records for traceability.

### Latest known validation evidence

```txt
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 84 files / 777 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run test:e2e: PASS - 28/28 tests
```

### Boundaries

- Documentation and release-readiness sync only.
- No Product Match scoring, API DTO, database schema, authentication, validation, UI behavior, or test behavior was changed.
- No real AI provider, clinical assessment, medical claim, treatment guarantee, skin scoring, image/face analysis, marketplace, checkout, or payment feature was added.

### Final status

```txt
SkinWise VN MVP v1.3 - READY FOR GITHUB RELEASE / PORTFOLIO / SUBMISSION
```

## 2026-05-29 - MVP-FINAL-CLOSEOUT-001 Final repository closeout

### Task

Finalize SkinWise VN MVP documentation and release status after release hygiene, CI/E2E stabilization, production verification, and final documentation alignment.

### Changes

- Marked SkinWise VN MVP as final portfolio/submission ready.
- Recorded release hygiene as completed.
- Recorded GitHub Actions MongoDB service support for Playwright E2E.
- Recorded Playwright E2E selector stabilization for the current Vietnamese UI copy.
- Recorded production verification as completed by the project owner.
- Marked screenshot capture as intentionally skipped because it is not required for this submission.
- Aligned final closeout documentation across README, final release checklist, release notes, portfolio case study, implementation status, feature status matrix, sprint plan, deployment docs, and screenshots checklist.
- Preserved historical changelog entries below for traceability.

### Historical validation evidence recorded on 2026-05-29

```txt
npm ci: PASS
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 72 files / 719 tests
npm run build: PASS
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm run db:indexes: PASS - 32 indexes ensured
npm run test:e2e: PASS - 24/24 tests
```

### Production verification evidence

```txt
Vercel production deployment: PASS
Production URL: https://skinwise-vn.vercel.app
Google OAuth production login: PASS
MongoDB Atlas production/demo read/write through authenticated flows: PASS
Protected route redirect behavior: PASS
Core authenticated MVP flows: PASS
Runtime logs reviewed: PASS
```

### Boundaries

- No new product feature scope was added.
- No UI redesign was performed.
- No database schema expansion was added.
- No real OpenAI/Gemini provider integration was added.
- No image upload, marketplace, payment, notification, skin scoring, or clinical assessment feature was added.
- No secret values, OAuth credentials, MongoDB credentials, API keys, deployment tokens, or private environment values were documented.
- AI provider remains `mock` for the MVP demo baseline.
- Screenshot capture is skipped intentionally, not pending.

### Final status

```txt
SkinWise VN MVP — FINAL DONE FOR PORTFOLIO / SUBMISSION
```



## 2026-05-28 - MVP-E2E-CLOSEOUT-001 MVP core journey E2E closeout and Routine Analysis duplicate-key polish

### Task

Close out the completed MVP core journey E2E validation record and fix the remaining Routine Analysis duplicate React key warning without adding product feature scope.

### Changes

- Updated documentation to record `MVP-CORE-JOURNEY-E2E-001` as completed in source/docs.
- Recorded `MVP-CORE-JOURNEY-E2E-VALIDATION-001` as completed using the latest local validation evidence: typecheck PASS, lint PASS, unit tests PASS with 72 files and 717 tests, build PASS, database indexes PASS with 32 indexes ensured after `.env.local` was available locally, E2E seed PASS, and Playwright E2E PASS with 24 tests.
- Fixed the Routine Analysis suggestion render key in `routine-analysis-panel.tsx` so repeated AI-provider suggestion titles such as `AI-driven suggestion` no longer produce duplicate React keys.
- Added a targeted Routine Analysis Playwright console-warning guard for the specific duplicate key warning.
- Kept the fix in the UI render layer; Routine Analysis API response shape, AI provider mapper output, user-facing suggestion copy, authentication, and E2E coverage were not weakened.

### Validation note

This changelog records the latest local validation evidence provided for the completed MVP core journey E2E suite. This workspace could not rerun full validation because it does not provide the target Node 24/npm 11 runtime, installed dependencies, or local MongoDB. Do not claim this closeout patch is fully completed until the validation commands are rerun in the target local/test environment.

### Boundaries

- No new product feature scope was added.
- No production data was touched.
- No real Google OAuth E2E or external AI provider E2E validation is claimed.
- No `.env.local` values or secret values are documented.

## 2026-05-28 - MVP-CORE-JOURNEY-E2E-001 Core MVP journey E2E coverage

### Task

Add stable authenticated Playwright E2E coverage for the complete SkinWise VN MVP core user journey without adding product features or weakening authentication.

### Changes

- Added authenticated Playwright E2E specs for Routine Builder, Routine Analysis, Today Routine Checklist, Routine Log deletion through UI, Skin Journal create/edit/delete, Settings/Data Control, account deletion request, and dashboard summary reflection.
- Extended protected route smoke coverage for `/routine-logs/today` and `/settings`.
- Added deterministic E2E-user-owned data reset logic to the existing `db:seed:e2e` path with strict local/test database guards.
- Added stable `data-testid` selectors only where role/name/text selectors would be fragile for repeated Playwright interactions.
- Updated implementation status, feature matrix, sprint plan, test plan, and README validation notes.

### Boundaries

- No new product feature scope was added.
- No real OpenAI/Gemini integration was added.
- No production MongoDB or real Google OAuth path is used by E2E.
- No public reset API route, hard-delete account flow, export, bulk delete, or GDPR/legal compliance claim was added.
- Final pass/fail status must be based only on commands actually run in the target runtime and local MongoDB environment.

## 2026-05-27 - MVP-DATA-CONTROL-CLOSEOUT-001 Settings/Data Control closeout

### Task

Close out the Settings and Privacy Data Control MVP task without adding new product scope.

### Changes

- Added direct `DELETE /api/routine-logs/[id]` API contract coverage.
- Covered unauthenticated delete rejection, successful current-user deletion, client `userId` ignoring, missing/not-owned log `NOT_FOUND`, invalid id safety, and generic internal error handling.
- Fixed RoutineLog API documentation so it documents `GET /api/routine-logs?localDate=YYYY-MM-DD`, `PUT /api/routine-logs`, and `DELETE /api/routine-logs/:id`.
- Removed stale RoutineLog notes that said DELETE was not implemented or that there was no dedicated `/routine-logs/today` route.
- Fixed the route map latest task and added `DELETE /api/routine-logs/:id` as a `/routine-logs/today` dependency.
- Moved Settings/Data Control into the main feature status table and updated the Routine Logs row/API notes to include delete support.
- Updated implementation status, sprint plan, README status, and validation notes honestly.

### Notes

- No Settings page rewrite, Today Routine Checklist rewrite, RoutineLog API rewrite, new product feature, export flow, notification flow, admin workflow, marketplace/payment scope, real OpenAI/Gemini integration, hard-delete account flow, or legal compliance claim was added.
- Existing `tests/unit/routine-log-api-contract.test.ts` was left unchanged because it currently contains useful `/api/routines` contract coverage despite the confusing file name.

### Historical validation for the Insights hardening task

```txt
Runtime used by this sandbox: Node v22.16.0 / npm 10.9.2.
Project target runtime remains Node 24.x / npm 11.x per package.json.

npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 72 files, 717 tests
npm run build: Pass with safe local placeholder env values
npm run db:seed:e2e: Not run because no local MongoDB was listening on 127.0.0.1:27017
npm run test:e2e: Not run because no local MongoDB was listening on 127.0.0.1:27017
```

## 2026-05-26 - SAVED-PRODUCTS-001 Saved Products

### Task

Implement Feature Roadmap v1.2: authenticated Saved Products.

### Changes

- Added the user-owned `saved_products` collection helper and indexes for duplicate prevention and user list queries.
- Added the Saved Products module with DTOs, strict schemas, mapper, repository, use cases, client helper, saved list UI, saved card UI, and product save/remove toggle.
- Added authenticated `GET /api/saved-products`, `POST /api/saved-products`, and `DELETE /api/saved-products/[productId]` routes.
- Added the protected `/saved-products` dashboard route and enabled Saved Products navigation.
- Integrated Save/Saved actions into Product Catalogue cards and Product Detail while keeping product browsing usable if saved-state loading fails.
- Added unit/API/client/repository/source tests and an authenticated Playwright Saved Products spec.
- Updated route, API, data model, structure, ownership, demo, and portfolio documentation for v1.2.

### Notes

- Saved products are scoped to the authenticated user and `SavedProductDto` does not expose `userId`.
- Duplicate saves are idempotent and backed by a unique `{ userId, productId }` index.
- Product schema, Product CRUD, cart, marketplace, payment, comparison, ratings, reviews, social sharing, recommendation behavior, deployment state, and production verification were not changed.
### Validation

```txt
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 69 files, 680 tests
npm run build: Pass
npm run db:indexes: Pass - safe local/test database skinwise-e2e-check
npm run db:seed:e2e: Pass - safe local/test database skinwise-e2e-check
npm run test:e2e: Pass - 14 tests
```

Validation used only local/test configuration. No production deployment or production verification was performed.

## 2026-05-26 - INGREDIENT-UI-001 Ingredient Library UI

### Task

Implement Feature Roadmap v1.1: authenticated Ingredient Library UI.

### Files Added

```txt
src/app/(dashboard)/ingredients/page.tsx
src/app/(dashboard)/ingredients/[id]/page.tsx
src/modules/ingredients/ingredient.client.ts
src/modules/ingredients/components/ingredient-library.tsx
src/modules/ingredients/components/ingredient-card.tsx
src/modules/ingredients/components/ingredient-detail.tsx
src/modules/ingredients/components/ingredient-explanation-panel.tsx
tests/unit/ingredient-client.test.ts
tests/unit/ingredient-library-ui.test.ts
tests/unit/ingredient-detail-ui.test.ts
tests/e2e/ingredients.authenticated.spec.ts
```

### Files Updated

```txt
README.md
docs/13-ui-route-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/demo-script.md
docs/portfolio-case-study.md
src/proxy.ts
src/modules/dashboard/dashboard-shell.config.ts
tests/e2e/smoke.spec.ts
tests/unit/dashboard-shell.test.ts
tests/unit/product-catalogue-ui.test.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/skin-journal-ui.test.ts
```

### Notes

- Added protected `/ingredients` and `/ingredients/[id]` dashboard routes.
- Enabled Ingredients navigation and kept Today Log disabled.
- Added a client-only ingredient API layer that reads the SkinWise `{ data, error }` envelope and validates list, detail, and explanation response shapes.
- Added browse/search UI with q-only form search and limit 50.
- Added ingredient detail UI with educational disclaimer, cautious suitability/caution sections, and source references.
- Added an explanation panel that calls `POST /api/ingredients/explain`, handles rate limits, and labels fallback explanations.
- Added authenticated Playwright coverage using deterministic Niacinamide seed data and the existing test-only Auth.js provider.
- No Ingredient CRUD, admin management, database persistence for explanations, real OpenAI/Gemini integration, image analysis, skin scoring, clinical assessment, or treatment claims were added.

### Validation

```txt
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 63 files, 637 tests
npm run build: Pass
npm run db:seed:e2e: Pass - safe local/test database skinwise-e2e-check
npm run test:e2e: Pass - 12 tests
```

## 2026-05-25 - QUALITY-002A Authenticated Playwright Profile and Product E2E Foundation

### Task

Add authenticated Playwright E2E coverage for Skin Profile create/update, Product Catalogue browsing, Product Detail navigation, and deterministic local/test product data setup.

### Files Added

```txt
scripts/seed-e2e.ts
tests/e2e/global-setup.ts
tests/e2e/helpers/test-data.ts
tests/e2e/skin-profile.authenticated.spec.ts
tests/e2e/products.authenticated.spec.ts
```

### Files Updated

```txt
.nvmrc
README.md
package.json
playwright.config.ts
src/modules/skin-profile/components/skin-profile-onboarding-form.tsx
src/modules/skin-profile/components/skin-profile-view-edit.tsx
tests/e2e/helpers/auth.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Notes

- `.nvmrc` now matches the Node 24 runtime baseline declared by `package.json`.
- Added `npm run db:seed:e2e`, which wraps the existing idempotent seed script and refuses non-test/non-local MongoDB settings.
- Playwright global setup seeds deterministic product data into `mongodb://127.0.0.1:27017/skinwise-e2e-check`.
- Authenticated specs reuse `loginAsE2EUser(page)` and the safe `e2e-test` Auth.js provider from QUALITY-001.
- Skin Profile E2E handles both first-profile creation and existing-profile update states.
- Product E2E reads the first seeded product through the authenticated app API, then verifies catalogue and detail navigation.
- No real Google OAuth, production MongoDB, middleware bypass, fake login route, product CRUD, admin feature, Ingredient UI, real AI provider, or production auth weakening was added.
- Local E2E execution requires MongoDB running at the safe E2E URI.

### Validation

```txt
node -v: v24.14.0
npm -v: 11.14.1
npm ci: Pass - 0 vulnerabilities
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 60 files, 613 tests
npm run build: Pass
npx playwright install chromium: Pass
npm run test:e2e: Blocked in this environment - local MongoDB is not running at 127.0.0.1:27017
npm audit --omit=dev --audit-level=moderate: Pass - 0 vulnerabilities
```

## 2026-05-25 - RUNTIME-001 Standardize Project Runtime on Node 24 and npm 11

### Task

Update the project runtime baseline from the historical Node 20 marker to Node.js 24.x and npm 11.x for local development, CI, and deployment documentation alignment.

### Files Updated

```txt
.nvmrc
package.json
.github/workflows/ci.yml
README.md
docs/deployment/vercel-deployment.md
docs/18-deployment-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Notes

- `.nvmrc` now targets Node 24.
- `package.json` now declares `engines.node = "24.x"` and `engines.npm = "11.x"`.
- GitHub Actions now uses Node 24.x.
- README, Vercel deployment docs, deployment checklist, feature matrix, implementation status, and sprint plan now identify Node 24.x / npm 11.x as the current runtime baseline.
- Previous Node 20 validation notes remain historical evidence only and should not be treated as the current runtime baseline.
- No application feature, Auth.js behavior, database behavior, API contract, Playwright test logic, AI provider behavior, or product scope was changed.
- `package-lock.json` was not changed because no dependency version was changed in this task.

### Validation

```txt
node -v: expected v24.14.0
npm -v: expected 11.14.1
npm ci: Pending local/CI rerun
npm run lint: Pending local/CI rerun
npm run typecheck: Pending local/CI rerun
npm run test: Pending local/CI rerun
npm run build: Pending local/CI rerun
npm run test:e2e: Pending local/CI rerun
npm audit --omit=dev --audit-level=moderate: Pending local/CI rerun
```

## 2026-05-25 - QUALITY-001 Safe Authenticated Playwright E2E Foundation

### Task

Add safe test-only authentication for authenticated Playwright E2E tests without using real Google OAuth or weakening production auth.

### Files Added

```txt
tests/e2e/helpers/auth.ts
tests/e2e/authenticated-smoke.spec.ts
```

### Files Updated

```txt
.env.example
README.md
playwright.config.ts
src/config/env.ts
src/modules/auth/auth.config.ts
src/modules/auth/types.ts
tests/unit/auth-config.test.ts
tests/unit/env.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Notes

- Added `E2E_TEST_AUTH`, `E2E_TEST_USER_EMAIL`, and `E2E_TEST_USER_NAME` to environment validation.
- `E2E_TEST_AUTH="true"` is rejected unless `APP_ENV="test"`.
- Added an Auth.js Credentials provider with id `e2e-test` only for `APP_ENV="test"` and `E2E_TEST_AUTH=true`.
- Google OAuth provider behavior remains unchanged and independent from the E2E provider.
- Playwright now runs with `APP_ENV="test"`, `E2E_TEST_AUTH="true"`, safe placeholder secrets, `AI_PROVIDER="mock"`, and base URL `http://127.0.0.1:3000`.
- Added `loginAsE2EUser(page)` using Auth.js CSRF and callback endpoints so session cookies are set by Auth.js, not manually created by tests.
- Added the first authenticated Playwright smoke test for dashboard access.
- Existing unauthenticated redirect smoke tests remain in place and are not globally authenticated.
- No product features, fake login route, fake login UI, middleware bypass, production OAuth change, real AI provider, or production credential was added.

### Validation

```txt
npm run test -- tests/unit/env.test.ts tests/unit/auth-config.test.ts: Pass - 2 files, 39 tests
npm run typecheck: Pass
npm run test:e2e: Pass - 8 tests
```

## 2026-05-25 - DEPLOY-VERIFY-001 Partial Deployment Re-Verification

### Task

Re-verify the current Vercel deployment status without adding feature scope, exposing secrets, or claiming external platform checks that were not directly verified.

### Files Updated

```txt
README.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/18-deployment-checklist.md
docs/deployment/vercel-deployment.md
```

### Notes

- Local validation passed under Node 20: `npm ci`, lint, typecheck, unit tests, production build, production audit, and Playwright E2E smoke tests.
- Public production URL `https://skinwise-vn.vercel.app` returned the expected landing page content.
- Unauthenticated `/dashboard`, `/products`, `/routines`, `/journal`, and `/skin-profile` returned Auth.js sign-in redirects with callback URLs.
- The production Auth.js sign-in page was reachable.
- Vercel dashboard/build logs/environment variables, Google Cloud Console OAuth settings, MongoDB Atlas settings/connectivity, Google OAuth production login, authenticated dashboard, MongoDB-backed read/write flow, sign-out, and Vercel runtime logs were not externally verified in this task.
- No redeploy was run because current Vercel project access and latest-deployment evidence were not available.
- No real secrets, OAuth credentials, MongoDB credentials, AI keys, Cloudinary credentials, screenshots, product features, or authenticated E2E automation were added.

### Validation

```txt
node -v: v20.20.2
npm ci: Pass
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 60 files, 603 tests
npm run build: Pass
npm audit --omit=dev --audit-level=moderate: Pass - 0 vulnerabilities
npm run test:e2e: Pass - 7 tests
Public production URL: Pass for landing page HTTP 200 and expected public content
Unauthenticated protected-route redirects: Pass for /dashboard, /products, /routines, /journal, and /skin-profile
External Vercel/OAuth/MongoDB/log verification: Not verified in this task
```

## 2026-05-25 - E2E-001 Playwright Smoke Tests and Cleanup

### Task

Finalize unauthenticated Playwright smoke coverage for critical user-facing routes and synchronize documentation with the implemented E2E status.

### Files Added

```txt
tests/e2e/smoke.spec.ts
```

### Files Updated

```txt
.github/workflows/ci.yml
playwright.config.ts
README.md
docs/18-deployment-checklist.md
docs/final-release-checklist.md
docs/release-notes-v1.0.md
docs/portfolio-case-study.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Files Removed

```txt
tests/e2e/.gitkeep
```

### Notes

- Added Chromium-only Playwright smoke tests for the public landing page and unauthenticated redirects for `/dashboard`, `/products`, `/routines`, `/journal`, and `/skin-profile`.
- Playwright web server runs `npm run dev` with safe placeholder environment values, `AI_PROVIDER="mock"`, and disabled unsupported feature flags.
- CI installs Chromium dependencies and runs `npm run test:e2e` after lint, typecheck, unit tests, build, and production dependency audit.
- No real Google OAuth login, real MongoDB Atlas credentials, Cloudinary credentials, external AI calls, screenshots, or product feature changes were added.
- Authenticated E2E flows remain future work until a safe test-login mechanism exists.

### Validation

```txt
node -v: v20.20.2
npm ci: Pass
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 60 files, 603 tests
npm run build: Pass
npm run test:e2e: Pass
npm audit --omit=dev --audit-level=moderate: Pass - 0 vulnerabilities
```

## 2026-05-24 - TASK FINAL-RELEASE-001 Final Release Package and Portfolio-Ready Cleanup

### Task

Prepare the final portfolio-ready MVP release package documentation for GitHub, portfolio review, CV/project explanation, mentor review, and BA internship interview preparation.

### Files Added

```txt
docs/final-release-checklist.md
docs/release-notes-v1.0.md
```

### Files Updated

```txt
README.md
docs/portfolio-case-study.md
docs/screenshots-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Notes

- README was rewritten as a concise portfolio entry point with live demo, feature list, tech stack, demo flow, portfolio links, local setup, validation commands, limitations, and roadmap.
- Added final release checklist covering source hygiene, documentation readiness, validation readiness, demo readiness, portfolio readiness, release decision, and optional next tasks.
- Added release notes for SkinWise VN MVP Portfolio Release v1.0.
- Portfolio case study was reviewed and updated with a clear limitations section.
- Screenshots remain optional manual work; no fake screenshots or placeholder image files were added.
- No UI, API, authentication, database, Routine Builder, business logic, package dependency, lockfile, or MVP feature scope was changed.
- Real OpenAI/Gemini providers, image upload, AI face analysis, skin scoring, marketplace, payment, subscription, notifications, admin dashboard, Product CRUD, barcode scanner, and clinical assessment remain out of scope.

## 2026-05-24 - TASK PORTFOLIO-001 Portfolio Case Study and Demo Script

### Task

Prepare professional portfolio documentation for BA internship interviews, personal portfolio review, GitHub README review, and full-stack project explanation.

### Files Added

```txt
docs/portfolio-case-study.md
docs/demo-script.md
docs/screenshots-checklist.md
```

### Files Updated

```txt
README.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Notes

- The portfolio case study covers project overview, problem statement, target users, pain points, business goals, MVP scope, user journey, user stories, acceptance criteria, functional requirements, non-functional requirements, traceability, features, architecture, data model, API overview, testing evidence, deployment summary, challenges, learnings, roadmap, and interview talking points.
- API methods in the case study were verified from `src/app/api/**/route.ts`.
- The demo script supports a 3-5 minute walkthrough from landing page to dashboard summary.
- The screenshots checklist documents the recommended portfolio screenshots and safety checks.
- README now links to the portfolio case study, demo script, screenshots checklist, and demo data guide.
- No UI, API, authentication, database, Routine Builder, business logic, package dependency, or MVP feature scope was changed.
- Real OpenAI/Gemini providers, image upload, AI face analysis, skin scoring, marketplace, payment, subscription, notifications, admin dashboard, Product CRUD, barcode scanner, and clinical assessment remain out of scope.

## 2026-05-24 - TASK DEMO-DATA-001 Professional Demo Data

### Task

Prepare clean, realistic, portfolio-ready demo data and a demo walkthrough without adding product features.

### Files Added

```txt
docs/ai-coding/07-demo-data-and-demo-script.md
```

### Files Updated

```txt
scripts/seed.ts
README.md
docs/14-seed-data-spec.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Notes

- Public/shared seed data now better supports the target demo persona: oily or combination-oily skin, acne-prone concerns, clogged-pore texture, post-acne dark spots, mild sensitivity, and simple routine goals.
- Added public ingredient seed coverage for Glycerin and Green Tea Extract using the existing Ingredient model fields.
- Tuned existing public product seed metadata for the demo story without adding unsupported Product fields.
- User-owned demo data remains created through the authenticated UI with a real demo account; no fake Auth.js user, fake `userId`, static dashboard output, or auth bypass was added.
- The new demo script documents Skin Profile setup, Morning Routine, Evening Routine, optional caution routine, routine logs, SkinJournal entries, dashboard summary, BA presentation angle, and technical presentation angle.
- No Product CRUD, admin UI, real OpenAI/Gemini provider, image upload, AI face analysis, skin scoring, marketplace, payment, subscription, notifications, or clinical assessment was added.

## 2026-05-24 - TASK QA-REGRESSION-001 Clean Package Validation Stabilization

### Task

Fix clean package validation instability caused by LF/CRLF line-ending differences in the Routine Builder unit test.

### Files Added

```txt
.gitattributes
```

### Files Updated

```txt
tests/unit/routine-builder-ui.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Notes

- `getPayloadSource()` now normalizes `routineBuilderSource` line endings before applying the existing source extraction regex.
- The fix makes clean package validation robust across Windows CRLF and Unix LF environments.
- `.gitattributes` was added to prefer LF endings for source, documentation, config, and style files going forward.
- No Routine Builder source/business logic, UI behavior, API logic, database logic, authentication behavior, or product feature scope was changed.
- Real OpenAI/Gemini integration, image upload, skin scoring, marketplace, payment, notifications, admin dashboard, Product CRUD, barcode scanner, and clinical assessment remain out of scope.

## 2026-05-24 - TASK DEPLOY-002 Vercel MVP Demo Deployment

### Task

Execute the Vercel MVP demo deployment and record production smoke test results.

### Files Updated

```txt
README.md
docs/18-deployment-checklist.md
docs/deployment/vercel-deployment.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Deployment Evidence

```txt
Production URL: https://skinwise-vn.vercel.app
Deployment target: Vercel
Production branch: main
Production commit: db72e07
Deployment status: Ready / deployed for MVP demo
Production smoke test: Passed
Google OAuth production login: Passed
MongoDB production/demo read/write through authenticated flows: Passed
```

### Notes

- The previous stale production deployment from commit `a8ddf6d` was replaced by the current Post Week 6 MVP build.
- Protected routes no longer return 404 and redirect unauthenticated users to sign-in.
- Authenticated MVP flows were manually smoke-tested: dashboard, skin profile, products, product detail, routines, routine analysis/history/logging, journal create/edit/delete, and dashboard summaries.
- `AI_PROVIDER` remains `mock`; routine analysis uses mock/deterministic provider behavior for the MVP demo.
- Real OpenAI/Gemini providers, image upload, AI face analysis, skin scoring, marketplace, payment, subscription, notifications, and clinical assessment remain out of scope.
- No secrets, MongoDB credentials, OAuth secrets, `AUTH_SECRET`, API keys, deployment tokens, or private values were documented.

## 2026-05-24 - TASK SECURITY-AUDIT-001 Production Dependency Audit Fix

### Task

Review production dependency audit findings after DEPLOY-001 and apply a safe fix only if it avoids a Next.js downgrade or breaking major dependency change.

### Files Updated

```txt
package.json
package-lock.json
docs/deployment/vercel-deployment.md
docs/18-deployment-checklist.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

`npm audit --omit=dev --audit-level=moderate` reported 3 moderate production dependency advisories after DEPLOY-001: PostCSS through Next.js and `qs` through the CLI dependency chain. The npm automatic force fix path was unsafe because it would have installed a breaking Next.js downgrade.

### Implementation Notes

- `npm audit fix --force` was not run.
- `next` remains pinned at `16.2.6`.
- Added same-major npm overrides for `postcss@8.5.15` and `qs@6.15.2`.
- `npm ls qs postcss next --omit=dev` confirms Next resolves to overridden `postcss@8.5.15` and the `qs` chain resolves to `qs@6.15.2`.
- No application business logic, authentication behavior, route protection, TypeScript strictness, lint configuration, tests, or environment files were changed.
- `skinwise-vn-deployment-ready.zip` was recreated after the package and documentation updates.

### Validation

```txt
npm install: Pass.
npm run lint: Pass.
npm run typecheck: Pass.
npm run test: Pass - 60 files, 603 tests.
npm run build: Pass.
npm audit --omit=dev --audit-level=moderate: Pass - found 0 vulnerabilities.
```

## 2026-05-24 - TASK DEPLOY-001 Vercel Deployment Preparation

### Task

Prepare SkinWise VN MVP for Vercel deployment without executing the actual deployment.

### Files Added

```txt
.nvmrc
docs/deployment/vercel-deployment.md
```

### Files Updated

```txt
.gitignore
README.md
docs/09-release-plan.md
docs/18-deployment-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

The MVP implementation is ready for deployment preparation, but actual Vercel deployment, production environment configuration, MongoDB Atlas production/demo access, Google OAuth production callback setup, and production smoke testing require external setup and have not been executed.

### Notes

- `.env.local` exists locally, remains ignored, and is not tracked.
- `.env.example` remains the placeholder-only environment template.
- `.gitignore` now also excludes Playwright artifacts, zip artifacts, and private key/certificate formats.
- `.nvmrc` recommends Node 20 for local/Vercel alignment.
- `docs/deployment/vercel-deployment.md` documents Vercel settings, supported environment variables, MongoDB Atlas readiness, Google OAuth production setup, deployment steps, and production smoke tests.
- Production environment docs use `AUTH_URL` and `APP_BASE_URL`; `NEXTAUTH_URL` was not introduced.
- MVP demo deployment should use `AI_PROVIDER="mock"`.
- Real OpenAI/Gemini providers, image upload, marketplace, notifications, skin scoring, and clinical assessment remain out of scope.
- Actual Vercel deployment was not executed.
- Production URL was not provided.
- Production smoke test was not performed.
- `skinwise-vn-deployment-ready.zip` was created and verified to exclude `.env.local`, generated build/dependency folders, nested zip files, TypeScript build info, logs, and private key/certificate formats.

### Validation

```txt
npm ci: Pass, with 3 moderate npm audit vulnerabilities reported.
npm run lint: Pass.
npm run typecheck: Pass.
npm run test: Pass - 60 files, 603 tests.
npm run build: Pass.
Clean deployment zip: Pass - 312 files; `.env.example`, `.nvmrc`, README, package files, source, docs, tests, scripts, public assets, and deployment runbook included.
npm run start: Not run because it starts a long-running production server and actual Vercel deployment was not executed.
npm run dev: Not run because development server startup is not required for DEPLOY-001 after build validation.
db:indexes: Not run because the target database was not confirmed as a safe demo database.
db:seed: Not run because the target database was not confirmed as a safe demo database.
Production smoke test: Not tested because no production URL was provided.
Historical DEPLOY-001 note: Playwright config existed, but real E2E specs were added later in E2E-001.
```

## 2026-05-24 - SECURITY-CLEANUP-001 / DOCS-SYNC-001 / LOCAL-VALIDATION-001

### Task

Clean up environment-file sharing risk, synchronize docs and visible copy with the actual post Week 6 implementation, and run local validation before deployment preparation.

### Files Updated

```txt
.gitignore
.env.example
README.md
docs/07-security-privacy.md
docs/13-ui-route-map.md
docs/18-deployment-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
src/app/page.tsx
src/app/(dashboard)/layout.tsx
tests/unit/dashboard-routes.test.ts
```

### Reason

The source code had moved past Week 6, but some docs and visible UI copy still described the project as Week 1/foundation-only or listed implemented Journal/Product Detail routes as not implemented. Environment sharing guidance also needed to be explicit before portfolio sharing and deployment preparation.

### Notes

- `.env.local` exists locally, is ignored, and is not tracked.
- `.env.example` contains placeholders only and follows `src/config/env.ts`.
- The README and route/API map now describe the current implemented routes and current cleanup phase.
- The feature matrix uses `Completed`, `Partially completed`, `Not started`, and `Out of scope`.
- Real OpenAI/Gemini providers remain unimplemented and production AI integration is not verified.
- Deployment is not complete.
- The protected dashboard route group is explicitly marked `dynamic = "force-dynamic"` because its layout calls Auth.js request-time session logic through `getCurrentUser()` and redirects unauthenticated users.
- No new product feature, API behavior, database behavior, or architecture change was added.

### Validation

```txt
npm install: Pass, with 3 moderate npm audit vulnerabilities reported.
env check: Pass for local key presence; database target was not clearly local/development without exposing the URI.
npm run lint: Pass.
npm run typecheck: Pass.
npm run test: Pass - 60 files, 603 tests.
npm run build: Pass.
npm run db:indexes: Not run because the database target was not clearly local/development.
npm run db:seed: Not run because the database target was not clearly local/development.
npm run dev: Existing dev server responded HTTP 200 on localhost:3000; a second dev process was not started.
Unauthenticated smoke test: `/` returned 200 and protected routes returned 307 sign-in redirects.
Manual authenticated smoke test: Not tested; requires interactive Google OAuth session.
Historical LOCAL-VALIDATION note: Playwright config existed, but real E2E specs were added later in E2E-001.
```

## 2026-05-24 - TASK PRODUCT-UI-002 Product Detail UI

### Task

Implement a protected Product Detail UI at `/products/[id]` using the existing authenticated Product detail API.

### Files Added

```txt
src/app/(dashboard)/products/[id]/page.tsx
src/modules/products/components/product-detail.tsx
tests/unit/product-detail-ui.test.ts
```

### Files Updated

```txt
src/modules/products/product.client.ts
src/modules/products/components/product-card.tsx
tests/unit/product-client.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/13-ui-route-map.md
```

### Reason

The product catalogue needed a protected detail flow so authenticated users can open a reviewed product and inspect its public Product DTO information without adding Product CRUD, saved products, images, recommendations, routine integration, or AI behavior.

### Implementation Notes

- Added `getProductApiPath(productId)` and `getProduct(productId)` to the client-safe Product API helper.
- Product detail responses are parsed from `data.product`; `data.item` and `data.products` are not accepted for detail reads.
- Added `ProductDetail` with loading, error, not-found, retry, educational disclaimer, and success states.
- Added the protected `/products/[id]` dashboard route and passed the route param into `ProductDetail`.
- Added a `View details` link from each ProductCard to `/products/${product.id}`.
- The detail UI renders only public Product DTO fields and does not import repositories, use cases, database helpers, MongoDB, auth helpers, or server-only modules.

### Validation

```txt
npm run test -- tests/unit/product-client.test.ts tests/unit/product-detail-ui.test.ts tests/unit/product-catalogue-ui.test.ts
# Pass - 3 files, 30 tests

npm run lint
# Pass

npm run typecheck
# Pass

npm run test
# Pass - 60 files, 602 tests
```

### Manual Verification

```txt
Manual browser/OAuth verification: Pass

Verified:
- Google OAuth login works.
- `/products` opens successfully.
- Product cards show View details navigation.
- Clicking View details opens `/products/[id]`.
- Product detail information is displayed.
- Back to products works.
- Invalid product id shows Product not found state.
- No browser console errors were observed.
- No server/client runtime errors were observed.
```

## 2026-05-23 - TASK DASHBOARD-ENHANCE-001 Dashboard Latest Journal Summary

### Task

Extend the existing dashboard with a latest SkinJournal summary card and deterministic journal-aware next-action priority.

### Files Added

```txt
src/modules/dashboard/components/latest-journal-card.tsx
```

### Files Updated

```txt
src/modules/dashboard/dashboard.types.ts
src/modules/dashboard/dashboard.dto.ts
src/modules/dashboard/dashboard.mapper.ts
src/modules/dashboard/dashboard.use-case.ts
src/modules/dashboard/components/dashboard-overview.tsx
tests/unit/dashboard-use-case.test.ts
tests/unit/dashboard-ui.test.ts
tests/unit/dashboard-api-contract.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/08-test-plan.md
```

### Reason

The dashboard already summarized profile, routines, today's RoutineLog progress, latest Routine Analysis, and next actions. It needed to include real SkinJournal context and make the next action prioritize today's journal after routine logging is handled.

### Implementation Notes

- `dashboard.use-case.ts` reuses `listSkinJournalsForUser()` to fetch the latest entry and to check for an entry on the requested dashboard `localDate`.
- `dashboard.mapper.ts` maps only safe journal fields, counts `productsUsed`, trims/collapses notes, and truncates `notesPreview` to 120 characters before adding an ellipsis.
- `DashboardDto` now includes `latestJournal` without exposing `userId`, `_id`, raw ObjectId values, or full long notes.
- `LatestJournalCard` renders empty and populated states using the existing DashboardCard/Button/Badge patterns.
- `nextActions` remains `DashboardNextAction[]` but now returns one deterministic primary action in the required priority order.
- No dashboard charts, streaks, SkinJournal analytics, AI-generated journal insight, image upload, skin scoring, Product/Ingredient behavior, auth behavior, or clinical assessment was added.

### Validation

```txt
npm run typecheck
# Pass

npm run test
# Pass - 59 files, 587 tests
```

## 2026-05-23 - TASK PRODUCT-UI-001 Review Fix

### Task

Review the completed Product Catalogue UI implementation and fix issues related only to PRODUCT-UI-001.

### Files Added

```txt
src/modules/dashboard/components/dashboard-navigation.tsx
```

### Files Updated

```txt
src/app/(dashboard)/layout.tsx
tests/unit/dashboard-shell.test.ts
tests/unit/product-catalogue-ui.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

The `/products` route, Product API parsing, filters, proxy protection, and Products link were present, but the dashboard sidebar active styling was hard-coded to `/dashboard`, so Products did not become active on `/products`.

### Implementation Notes

- Moved dashboard sidebar nav rendering into a client component that reads the current pathname.
- Products now receives active styling and `aria-current="page"` on `/products`.
- Dashboard active state is limited to the exact `/dashboard` path.
- Disabled Today Log and Ingredients items remain disabled with no links.
- No Product detail UI, Product CRUD, Product submission, saved products, image upload, AI-driven advice, skin scoring, or medical behavior was added.

### Validation

```txt
npm run test -- tests/unit/dashboard-shell.test.ts tests/unit/product-catalogue-ui.test.ts
# Pass - 2 files, 13 tests

npm run typecheck
# Pass

npm run lint
# Pass

npm run test
# Pass - 59 files, 581 tests
```

## 2026-05-23 - TASK LOCAL-AUTH-DB-001 Local MongoDB/Auth Runtime Stabilization

### Task

Stabilize local MongoDB Atlas and Auth.js Google OAuth runtime after database index verification succeeded but Auth.js callback still failed on Node.js SRV DNS lookup and encrypted session cookie mismatch.

### Files Added

```txt
scripts/configure-node-dns.cjs
docs/21-local-auth-db-troubleshooting.md
docs/adr/0007-use-authjs-jwt-sessions-with-mongodb-adapter.md
docs/adr/0008-use-node-dns-preload-for-local-mongodb-srv.md
```

### Files Updated

```txt
package.json
.env.example
src/infrastructure/database/mongodb.ts
src/auth.ts
README.md
docs/00-source-of-truth.md
docs/07-security-privacy.md
docs/10-project-structure.md
docs/18-deployment-checklist.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Local Windows/Node.js resolved MongoDB Atlas SRV records only after explicitly setting DNS servers, while `nslookup` and TCP port checks already succeeded. Auth.js also needed a consistent JWT session strategy to avoid database-session/proxy mismatch and stale encrypted cookie failures during local OAuth testing.

### Implementation Notes

- `npm run db:indexes` uses `node --env-file=.env.local` and was verified with `db:indexes created: 30 indexes ensured`.
- `npm run dev` preloads `scripts/configure-node-dns.cjs` so DNS servers are configured before Next.js/Auth.js starts.
- `src/infrastructure/database/mongodb.ts` sets DNS servers before creating `MongoClient`.
- `src/auth.ts` keeps MongoDB Adapter for identity/account persistence but forces `session.strategy = "jwt"`.
- Local cookie cleanup is documented for `JWTSessionError` / `Invalid Compact JWE` after `AUTH_SECRET` or session strategy changes.
- No product scope, API contract, AI behavior, marketplace behavior, image upload, skin scoring, or medical behavior was added.

### Verification

```txt
npm run db:indexes
# db:indexes created: 30 indexes ensured

npm run dev
# [node-dns] DNS servers: [ '8.8.8.8', '1.1.1.1' ]
```

### Remaining Manual Check

```txt
[ ] Confirm Google OAuth redirects to /dashboard after clearing localhost site data.
```


## 2026-05-23 - TASK PRODUCT-UI-001 Product Catalogue UI

### Task

Implement a protected Product Catalogue UI at `/products` using the existing authenticated Product API.

### Files Added

```txt
src/app/(dashboard)/products/page.tsx
src/modules/products/components/product-catalogue.tsx
src/modules/products/components/product-card.tsx
tests/unit/product-catalogue-ui.test.ts
```

### Files Updated

```txt
src/modules/products/product.client.ts
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/product-client.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/skin-journal-ui.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Authenticated users needed a dashboard-consistent way to browse the existing reviewed Product catalogue without adding Product CRUD, submission, admin review, saved products, images, AI-driven advice, or clinical-assessment behavior.

### Implementation Notes

- Added the protected `/products` page under the existing dashboard route group.
- Enabled Products in the dashboard navigation and protected `/products/:path*` through the auth proxy.
- Added `ProductCatalogue` with search plus category, price range, skin type, and concern filters.
- Added `ProductCard` for public Product DTO display.
- Extended the client-safe Product API helper to support existing list query params while defaulting to `limit=50`.
- Product list responses are still parsed from `data.items`.
- No Product backend contract, SkinJournal `productsUsed` contract, Routine Builder product loading, or SkinJournal product resolution behavior was changed.

### Tests

```txt
tests/unit/product-catalogue-ui.test.ts
tests/unit/product-client.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/skin-journal-ui.test.ts
```

### Validation

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 59 files, 580 tests
```

### Notes

- Product CRUD, product submission, admin review, saved product library, Product detail UI, image upload, AI-driven advice, skin scoring, and clinical assessment remain unimplemented.
- Recommended next task should be selected from product priorities, such as TASK PRODUCT-UI-002 - Implement Product Detail UI or the next explicitly scoped SkinJournal task.

## 2026-05-23 - TASK SJ-003 SkinJournal Product Linking / Product Name Resolution

### Task

Add UI-only product selection and product name resolution to SkinJournal while preserving the SJ-001 backend API contract.

### Files Added

```txt
src/modules/products/product.client.ts
src/modules/journals/skin-journal-product-display.ts
tests/unit/product-client.test.ts
tests/unit/skin-journal-product-display.test.ts
```

### Files Updated

```txt
src/modules/journals/components/skin-journal-timeline.tsx
src/modules/journals/components/skin-journal-entry-card.tsx
src/modules/journals/components/skin-journal-entry-form.tsx
src/modules/journals/skin-journal-form.validation.ts
tests/unit/skin-journal-ui.test.ts
tests/unit/skin-journal-form-validation.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

SkinJournal entries stored product IDs but the UI showed raw IDs and required manual product ID entry. SJ-003 connects the existing visible Product catalogue to the journal UI without changing journal persistence or API responses.

### Implementation Notes

- Added a client-safe Product API helper for `GET /api/products?limit=50`.
- Product list responses are parsed from `data.items`.
- Added pure helpers for product display labels and journal product ID resolution.
- Journal cards now show readable product badges and display `Unknown product` for missing/deleted/unresolved products.
- Journal forms now let users select multiple catalogue products with checkboxes and submit only `productsUsed` product ID strings.
- Product catalogue loading and failure states are handled separately from journal loading so entries still render if product loading fails.
- Edit forms preserve existing product IDs if the product catalogue cannot load.
- SkinJournal backend contract was not changed.
- No product names, brand names, product objects, snapshots, `userId`, `_id`, image fields, or photo URLs are sent to the SkinJournal API.

### Tests

```txt
tests/unit/product-client.test.ts
tests/unit/skin-journal-product-display.test.ts
tests/unit/skin-journal-ui.test.ts
tests/unit/skin-journal-form-validation.test.ts
```

### Validation

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 58 files, 571 tests
```

### Notes

- Product catalogue UI pages, Product CRUD, saved product library, backend product ownership, image upload, SkinJournal calendar/analytics views, and AI journal analysis remain unimplemented.
- Recommended next task should be selected from product priorities, such as TASK SJ-004 - Implement SkinJournal Calendar/Insight View, TASK SJ-004 - Implement Private Journal Image Upload, TASK SJ-004 - Add SkinJournal Trends and Basic Analytics, or TASK PRODUCT-UI-001 - Implement Product Catalogue UI.

## 2026-05-23 - TASK SJ-002 SkinJournal Timeline UI

### Task

Implement the protected SkinJournal Timeline UI on `/journal` using the existing SJ-001 backend API contract.

### Files Added

```txt
src/app/(dashboard)/journal/page.tsx
src/modules/journals/skin-journal.client.ts
src/modules/journals/skin-journal-form.validation.ts
src/modules/journals/components/skin-journal-timeline.tsx
src/modules/journals/components/skin-journal-entry-card.tsx
src/modules/journals/components/skin-journal-entry-form.tsx
tests/unit/skin-journal-client.test.ts
tests/unit/skin-journal-form-validation.test.ts
tests/unit/skin-journal-ui.test.ts
```

### Files Updated

```txt
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/dashboard-shell.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/routine-builder-ui.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

SkinWise VN needed the frontend timeline for authenticated users to work with their private SkinJournal entries after SJ-001 added the backend API.

### Implementation Notes

- Added the protected `/journal` dashboard page and `SkinJournalTimeline` client component.
- Enabled Journal in the dashboard navigation and protected `/journal/:path*` through the auth proxy.
- Added a client helper for `GET`, `POST`, `PATCH`, and `DELETE` against `/api/skin-journal`.
- Added client-side form validation and payload builders that mirror the SJ-001 MVP contract.
- Users can list, create, edit, and delete journal entries with loading, empty, success, and error states.
- The UI consumes existing API envelopes and maps duplicate local-date conflicts to a friendly message.
- Create/update payloads are built from canonical fields only and do not send server-owned, future image/photo, provider, or internal fields.

### Tests

```txt
tests/unit/skin-journal-client.test.ts
tests/unit/skin-journal-form-validation.test.ts
tests/unit/skin-journal-ui.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/routine-builder-ui.test.ts
```

### Validation

```txt
npm run typecheck
npm run lint
npm run test
```

### Notes

- SJ-001 backend behavior and API contract were not changed.
- Image upload, image storage, calendar heatmap, analytics/insight view, product name resolution, AI journal analysis, skin scoring, and clinical assessment remain out of scope.
- Recommended next SkinJournal task should be selected from product priorities, such as product linking/name resolution, calendar/insight view, or private image upload.

## 2026-05-23 - TASK SJ-001 SkinJournal Backend API Foundation

### Task

Add authenticated backend/API foundation for SkinJournal entries.

### Files Added

```txt
src/app/api/skin-journal/route.ts
src/app/api/skin-journal/[id]/route.ts
src/modules/journals/skin-journal.types.ts
src/modules/journals/skin-journal.dto.ts
src/modules/journals/skin-journal.schema.ts
src/modules/journals/skin-journal.mapper.ts
src/modules/journals/skin-journal.repository.ts
src/modules/journals/create-skin-journal.use-case.ts
src/modules/journals/list-skin-journal.use-case.ts
src/modules/journals/update-skin-journal.use-case.ts
src/modules/journals/delete-skin-journal.use-case.ts
src/modules/journals/index.ts
tests/unit/skin-journal.test.ts
tests/unit/skin-journal-use-case.test.ts
tests/unit/skin-journal-api-contract.test.ts
```

### Files Updated

```txt
tests/unit/database-indexes.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

SkinWise VN needed the SkinJournal backend foundation before the timeline UI can be built. The implementation adds the documented CRUD API while preserving the MVP boundaries around privacy, ownership, one entry per local date, and future-only image fields.

### Implementation Notes

- Added `POST /api/skin-journal`, `GET /api/skin-journal`, `PATCH /api/skin-journal/[id]`, and `DELETE /api/skin-journal/[id]`.
- All endpoints require `getCurrentUser()` authentication.
- Route handlers validate strict request bodies and query params with Zod.
- `localDate` is validated as `YYYY-MM-DD`; `timezone` is validated as an IANA timezone string.
- Create/list/update/delete flows are implemented through focused use-case functions.
- The repository imports `server-only`, uses `getSkinJournalsCollection()`, and scopes owned operations by authenticated `userId`.
- Duplicate `userId + localDate` MongoDB key errors are mapped to a safe `SkinJournalConflictError` and HTTP `409 CONFLICT`.
- Public DTOs map `_id` to `id`, serialize Dates to ISO strings, copy arrays, and omit `userId`, `_id`, raw ObjectId values, `imageUrl`, `imageStorageKey`, `imageVisibility`, and `photoUrls`.
- PATCH cannot update `localDate`.
- Invalid, missing, or not-owned journal IDs return `NOT_FOUND`.
- Existing `skin_journals` collection helper and canonical index definitions were reused.
- No UI, image upload, image storage, product lookup for `productsUsed`, AI journal analysis, OpenAI/Gemini change, Routine Analysis change, Ingredient Explanation change, dependency, or migration was added.

### Tests

```txt
tests/unit/skin-journal.test.ts
tests/unit/skin-journal-use-case.test.ts
tests/unit/skin-journal-api-contract.test.ts
tests/unit/database-indexes.test.ts
```

Coverage added for strict schema validation, timezone validation, duplicate conflict mapping, repository user scoping, ObjectId guard behavior, DTO safety, create/list/update/delete API contracts, auth requirements, invalid request behavior, not-found behavior, future image/photo field rejection, raw error isolation, and the `skin_journals_userId_createdAt` index assertion.

### Validation

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 53 files, 525 tests
```

### Notes

- SkinJournal UI is not implemented yet.
- SkinJournal dashboard integration is not implemented yet.
- `productsUsed` remains a string array and is not product-validated in SJ-001.
- Recommended next task is TASK SJ-002 - Implement SkinJournal Timeline UI.

## 2026-05-22 - TASK AI-007 Ingredient Explanation API with Validated AI Provider Fallback

### Task

Add authenticated, rate-limited `POST /api/ingredients/explain` using the existing validated AI provider path and safe deterministic fallback.

### Files Added

```txt
src/app/api/ingredients/explain/route.ts
src/modules/ingredients/ingredient-explanation.constants.ts
src/modules/ingredients/ingredient-explanation.dto.ts
src/modules/ingredients/ingredient-explanation.schema.ts
src/modules/ingredients/ingredient-explanation.mapper.ts
src/modules/ingredients/explain-ingredient.use-case.ts
tests/unit/ingredient-explanation.test.ts
tests/unit/ingredient-explanation-api-contract.test.ts
```

### Files Updated

```txt
src/modules/ingredients/index.ts
docs/05-api-contract.md
docs/06-ai-contract.md
docs/16-ai-fallback-policy.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

SkinWise VN needed the Ingredient Explanation endpoint wired to the already implemented `AIProvider.explainIngredient()` capability without adding real external AI integrations. The implementation keeps the public API stable and safe by validating input, relying on `ValidatedAIProvider` for provider output validation, mapping provider output into a public DTO, and falling back deterministically on provider-path failures.

### Implementation Notes

- Added `POST /api/ingredients/explain`.
- The route requires `getCurrentUser()` authentication.
- The route validates strict JSON request input before rate limiting.
- The route rate-limits authenticated valid requests with `ingredient_explanation:${userId}` at 10 requests per 60 minutes.
- The Ingredient explanation use case calls `getAIProvider().explainIngredient()`.
- Provider output validation remains inside `ValidatedAIProvider`.
- Added a provider-to-public mapper from `AIProviderIngredientExplanationResult` to `IngredientExplanationDto`.
- Provider success returns `source = "ai"`.
- Provider construction, call, validation, or mapping failure returns deterministic fallback with `source = "fallback"`.
- Invalid client input returns `VALIDATION_ERROR` and does not use fallback.
- Public responses do not expose raw provider errors, stack traces, `providerMetadata`, `educationalNotes`, `providerFailureReason`, OpenAI/Gemini metadata, or internal provider details.
- No explanation persistence was added.
- Routine Analysis behavior was not changed.
- No OpenAI provider was implemented.
- No Gemini provider was implemented.
- No external AI API call was added.
- No dependency, UI, database schema, Prisma schema, or migration change was made.

### Tests

```txt
tests/unit/ingredient-explanation.test.ts
tests/unit/ingredient-explanation-api-contract.test.ts
```

Coverage added for strict request parsing, malformed JSON, numeric and empty ingredient names, invalid skin type/concerns, too many concerns, provider-to-public mapping, provider metadata and educational note isolation, provider success, provider throw fallback, validated-provider malformed output fallback, mapper failure fallback, provider construction fallback, authentication, rate limiting, response envelope stability, and generic route error safety.

### Validation

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 50 files, 489 tests
```

### Notes

- Current Ingredient Explanation behavior uses the validated mock provider unless configuration selects an unsupported provider.
- Safety-classifier use-case integration remains future work for broader/free-form high-risk ingredient explanation inputs.

## 2026-05-22 - TASK AI-006 Routine Analysis Provider Failure Observability

### Task

Add safe internal observability for Routine Analysis provider fallback without changing public API responses.

### Files Added

```txt
src/modules/ai-analysis/ai-provider-failure-observability.ts
tests/unit/ai-provider-failure-observability.test.ts
```

### Files Updated

```txt
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/routine-analysis.types.ts
src/modules/ai-analysis/index.ts
tests/unit/routine-analysis-use-case.test.ts
tests/unit/routine-analysis.test.ts
tests/unit/routine-analysis-api-contract.test.ts
docs/06-ai-contract.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Provider-backed Routine Analysis already fell back safely to deterministic output, but provider failures lacked an internal reason code for debugging. TASK AI-006 records only safe failure categories while preserving deterministic fallback, Routine Safety Engine behavior, repository error propagation, and public DTO safety.

### Implementation Notes

- Added `classifyRoutineAnalysisProviderFailure(error: unknown)`.
- Added `RoutineAnalysisProviderFailureReason`.
- Added explicit `RoutineAnalysisProviderMappingError` for typed mapping-error classification.
- `AIProviderConfigurationError` maps to `provider_configuration_error`.
- `AIProviderResponseError`, including `ValidatedAIProvider` validation failures, maps to `provider_response_error`.
- Explicit mapping errors map to `provider_mapping_error`.
- Unknown errors, null, undefined, strings, and plain objects map to `provider_unexpected_error`.
- The classifier never throws and does not parse raw error messages.
- `RoutineAnalysisDocument` now supports optional internal `providerFailureReason`.
- Provider success does not persist `providerFailureReason`.
- Provider fallback persists `providerFailureReason` only after the provider path is attempted and fails.
- The provider fallback catch still covers only provider construction/call/validation/mapping/guard behavior.
- `createRoutineAnalysisForUser()` remains outside the provider fallback catch, so repository/database errors still propagate.
- `RoutineAnalysisDto` and `routine-analysis.mapper.ts` remain unchanged and do not expose `providerFailureReason`.
- Raw provider errors, stack traces, `providerMetadata`, and `educationalNotes` are not exposed publicly.
- No OpenAI provider was implemented.
- No Gemini provider was implemented.
- No external AI API call was added.
- No dependency, UI, database schema, Prisma schema, or migration change was made.

### Tests

```txt
tests/unit/ai-provider-failure-observability.test.ts
tests/unit/routine-analysis-use-case.test.ts
tests/unit/routine-analysis.test.ts
tests/unit/routine-analysis-api-contract.test.ts
```

Coverage added for classifier categories, non-Error thrown values, provider configuration fallback, provider response fallback, provider mapping fallback, unexpected provider fallback, provider success metadata absence, repository persistence error propagation, missing routine behavior, and public DTO safety.

### Validation

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 48 files, 472 tests
npm run build: Not run - command could not start due to a local sandbox spawn setup error.
```

### Notes

- Provider failure reason is internal-only persistence metadata.
- Current provider-backed Routine Analysis still uses the validated mock provider unless configuration selects an unsupported provider.
- Next recommended task is TASK AI-007 - Implement Ingredient Explanation API using Validated AI Provider with Safe Fallback.

## 2026-05-22 - TASK AI-005 Validated AI Provider Routine Analysis Wiring

### Task

Wire the validated AI provider into `analyzeRoutineForCurrentUser()` while preserving deterministic Routine Safety Engine guidance and safe fallback behavior.

### Files Added

```txt
None
```

### Files Updated

```txt
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/routine-analysis.types.ts
tests/unit/routine-analysis-use-case.test.ts
tests/unit/routine-analysis-api-contract.test.ts
docs/06-ai-contract.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK AI-005 required Routine Analysis to use the already validated provider flow and AI-004 mapper before saving routine analysis results, without implementing real OpenAI/Gemini providers, changing route handlers, changing the public DTO, or weakening deterministic fallback behavior.

### Implementation Notes

- `analyzeRoutineForCurrentUser()` still verifies routine ownership and runs the deterministic Routine Safety Engine first.
- The use case now builds `AIProviderRoutineAnalysisInput` from the routine and optional Skin Profile context.
- Provider-backed analysis is obtained only through `getAIProvider().analyzeRoutine(providerInput)`.
- Provider output validation remains inside `ValidatedAIProvider`; the use case does not call `validateRoutineAnalysisOutput()`.
- Provider output is mapped only through `mapAIProviderRoutineAnalysisToRoutineAnalysisResult()`.
- Provider success persists `aiStatus = "provider_used"`.
- Provider success persists provider-backed `modelProvider`, `modelName`, and `promptVersion = "routine-analysis-provider-v1"`.
- Fallback persists `aiStatus = "fallback_used"` and the existing deterministic fallback model metadata.
- The safety guard sets final stored `riskLevel` to `max(safetyResult.riskLevel, mappedProviderResult.riskLevel)` using `low < medium < high`.
- The persisted `aiResult.riskLevel` uses the same safety-guarded final risk.
- Provider lower risk does not trigger fallback; the provider-backed analysis still succeeds with the guarded higher risk.
- Provider higher risk raises the final stored risk.
- Provider success keeps deterministic safety warnings and suggestions and appends provider guidance when it is not an exact duplicate.
- Provider construction, call, validation, mapping, or safety-guard errors fall back to deterministic analysis.
- Repository persistence errors are outside the provider fallback boundary and still propagate.
- `providerMetadata` and `educationalNotes` are not persisted inside `aiResult` and are not returned in `RoutineAnalysisDto`.
- Raw provider errors and stack traces are not returned in the public DTO.
- `RoutineAnalysisAiStatus` is now exactly `"provider_used" | "fallback_used"`.
- `RoutineAnalysisDocument` model metadata fields now accept string provider-backed metadata.
- No OpenAI provider was implemented.
- No Gemini provider was implemented.
- No external AI API call was added.
- No AI key requirement was added.
- No UI, API route handler, database schema, migration, dependency, Routine Safety Engine, `MockAIProvider`, `ValidatedAIProvider`, or Zod schema change was made.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 47 files, 465 tests
```

### Notes

- `tests/unit/routine-analysis-use-case.test.ts` now covers provider success, provider construction/config failure, provider validation failure, unexpected provider failure, missing/inaccessible routines, safety-guarded max risk behavior, deterministic guidance preservation, repository persistence error propagation, provider/fallback metadata persistence, and public DTO metadata/error isolation.
- `tests/unit/routine-analysis-api-contract.test.ts` now keeps route handlers free of AI infrastructure imports while allowing the use case and mapper to own the provider boundary.
- Current provider-backed Routine Analysis uses the validated mock provider unless configuration selects an unsupported provider.
- Continue only with the next explicitly scoped task after review; do not start AI-006 without a new task.

## 2026-05-22 - TASK AI-004 AI Provider Routine Analysis Contract Mapping

### Task

Add an explicit mapper between validated provider-level routine analysis output and the product-facing `RoutineAnalysisResult` contract before any future provider-backed Routine Analysis wiring.

### Files Added

```txt
src/modules/ai-analysis/ai-provider-routine-analysis.mapper.ts
src/modules/ai-analysis/routine-analysis.constants.ts
tests/unit/ai-provider-routine-analysis-mapper.test.ts
```

### Files Updated

```txt
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/index.ts
docs/06-ai-contract.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

The provider-level routine analysis output uses `overallRiskLevel`, string warnings, string recommendations, `educationalNotes`, and `providerMetadata`, while the product-facing Routine Analysis module uses `riskLevel`, structured warnings, structured suggestions, `shouldSeeProfessional`, and `disclaimer`. TASK AI-004 makes that boundary explicit before TASK AI-005 can wire provider-backed routine analysis safely.

### Implementation Notes

- Added `mapAIProviderRoutineAnalysisToRoutineAnalysisResult`.
- The mapper accepts `AIProviderRoutineAnalysisResult` and returns `RoutineAnalysisResult`.
- The mapper is pure and deterministic.
- The mapper does not call `validateRoutineAnalysisOutput()` because validation belongs to `ValidatedAIProvider`.
- Provider `overallRiskLevel` maps to product-facing `riskLevel`.
- Provider `summary` maps to product-facing `summary`.
- Provider warning strings map to structured `RoutineAnalysisWarning` objects with `code = "AI_PROVIDER_WARNING"`.
- Provider recommendations map to structured `RoutineAnalysisSuggestion` objects with deterministic priority from risk level.
- `shouldSeeProfessional` is true only for high risk.
- `providerMetadata` is not exposed in `RoutineAnalysisResult`.
- `educationalNotes` are not exposed in `RoutineAnalysisResult`.
- Moved the existing Routine Analysis disclaimer string into `routine-analysis.constants.ts`.
- `analyze-routine.use-case.ts` now imports the shared disclaimer constant; deterministic fallback behavior is unchanged.
- No OpenAI provider was implemented.
- No Gemini provider was implemented.
- No external AI API call was added.
- No AI key requirement was added.
- No Routine Analysis API provider wiring was added.
- No UI, route behavior, database schema, migration, dependency, or Routine Safety Engine change was made.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 47 files, 456 tests
```

### Notes

- `tests/unit/ai-provider-routine-analysis-mapper.test.ts` covers risk, summary, warning, recommendation, priority, empty arrays, metadata isolation, educational note isolation, disclaimer, professional-help flag, and input immutability.
- The recommended next task is TASK AI-005 - Wire Validated AI Provider into Routine Analysis Use Case with Safe Fallback.

## 2026-05-22 - TASK AI-003 Provider Flow Validation

### Task

Integrate the TASK AI-002 structured output validators into the AI provider flow without changing provider output shape or wiring Routine Analysis API to provider calls.

### Files Added

```txt
src/infrastructure/ai/validated-ai-provider.ts
tests/unit/validated-ai-provider.test.ts
```

### Files Updated

```txt
src/infrastructure/ai/ai-provider.factory.ts
src/infrastructure/ai/index.ts
tests/unit/ai-provider.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK AI-003 required every successfully constructed `AIProvider` to be wrapped in a validation decorator so provider outputs are validated before future application flows use them.

### Implementation Notes

- Added `ValidatedAIProvider`.
- `ValidatedAIProvider` implements `AIProvider`.
- `ValidatedAIProvider` accepts an inner `AIProvider` through its constructor.
- `analyzeRoutine()` calls the inner provider, validates with `validateRoutineAnalysisOutput()`, and returns the validated output.
- `explainIngredient()` calls the inner provider, validates with `validateIngredientExplanationOutput()`, and returns the validated output.
- `classifySafety()` calls the inner provider, validates with `validateSafetyClassifierOutput()`, and returns the validated output.
- Invalid output lets the existing validator throw `AIProviderResponseError`.
- The wrapper does not swallow, replace, or convert `AIProviderResponseError`.
- `MockAIProvider` output shape was not changed.
- Validation logic was not added inside `MockAIProvider`.
- `getAIProvider()` now builds a raw provider first and wraps successful providers with `ValidatedAIProvider`.
- Mock mode now returns `ValidatedAIProvider` around `MockAIProvider`.
- Existing OpenAI and Gemini unsupported-provider behavior remains unchanged.
- No OpenAI provider was implemented.
- No Gemini provider was implemented.
- No external AI API call was added.
- No AI key requirement was added.
- No Routine Analysis API behavior was changed.
- No UI, database schema, or unrelated module was changed.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 46 files, 444 tests
```

### Notes

- `tests/unit/validated-ai-provider.test.ts` covers valid and invalid routine analysis, ingredient explanation, and safety classifier outputs.
- Tests verify inner provider calls, pass-through inputs, returned validated output, invalid-output errors, mock-mode factory wrapping, and MockAIProvider compatibility through the wrapper.
- The Routine Analysis API still uses deterministic fallback only.
- The recommended next task is to align or map AI provider output contracts before wiring provider-backed Routine Analysis behavior.

## 2026-05-22 - TASK AI-002 Structured Output Validation

### Task

Add strict Zod validation for structured AI provider outputs before later tasks use provider responses in application flows.

### Files Added

```txt
src/infrastructure/ai/ai-output.schema.ts
src/infrastructure/ai/ai-output.validator.ts
tests/unit/ai-output-validation.test.ts
```

### Files Updated

```txt
src/infrastructure/ai/index.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK AI-002 required a validation layer for the current `AIProvider` output types from `src/infrastructure/ai/ai-provider.ts` before future provider-flow integration.

### Implementation Notes

- Added `aiProviderMetadataSchema`.
- Added `aiProviderRoutineAnalysisResultSchema`.
- Added `aiProviderIngredientExplanationResultSchema`.
- Added `aiProviderSafetyClassifierResultSchema`.
- All output object schemas use strict Zod validation and reject unknown extra fields.
- Required fields are required, enum values match the current `ai-provider.ts` types, strings have max length limits, arrays have max item limits, and `providerMetadata.generatedAt` must be an ISO datetime string.
- Added `validateRoutineAnalysisOutput`, `validateIngredientExplanationOutput`, and `validateSafetyClassifierOutput`.
- Invalid AI output throws `AIProviderResponseError` with a short Zod issue summary containing issue path and issue message.
- Exported the new schemas and validators from `src/infrastructure/ai/index.ts`.
- Added unit tests for valid output, missing required fields, invalid enum values, maxLength violations, maxItems violations, unknown extra fields, invalid `providerMetadata`, error behavior, and MockAIProvider compatibility.
- No external AI provider was called.
- No OpenAI call was added.
- No Gemini call was added.
- No API key was added.
- No new dependency was added.
- UI was not changed.
- Database schema was not changed.
- OpenAI provider was not implemented.
- Gemini provider was not implemented.
- Ingredient Explanation API was not implemented.
- AI Provider validation was not wired into Routine Analysis API in this task.
- MockAIProvider output shape was not changed.

### Known Contract Mismatch / Follow-up

`docs/06-ai-contract.md` differs from `src/infrastructure/ai/ai-provider.ts`. TASK AI-002 intentionally validates the current `ai-provider.ts` output shape exactly and does not reconcile:

- `riskLevel` vs `overallRiskLevel`;
- `suggestions` vs `recommendations`;
- `simpleExplanation` vs `shortExplanation`;
- `shouldBlockAIAnswer` vs `isAllowed`;
- docs schemas missing `providerMetadata`.

A later TASK AI-003 should integrate output validation into provider flow. A separate explicit contract-alignment task should decide whether to update docs, change provider types, or introduce mapping between provider outputs and product-facing AI DTOs.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 45 files, 436 tests
```

### Notes

- The source of truth for TASK AI-002 was `src/infrastructure/ai/ai-provider.ts`.
- The validation layer is exported but not wired into Routine Analysis API behavior yet.

## 2026-05-20 - TASK AI-001 AI Provider Abstraction

### Task

Implement the server-only AI Provider Abstraction for future provider integration while adding only `MockAIProvider`.

### Files Added

```txt
src/infrastructure/ai/ai-provider.ts
src/infrastructure/ai/ai-provider.errors.ts
src/infrastructure/ai/ai-provider.factory.ts
src/infrastructure/ai/mock-ai-provider.ts
src/infrastructure/ai/index.ts
tests/unit/ai-provider.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK AI-001 required a clean, testable provider boundary before future OpenAI/Gemini implementation.

### Implementation Notes

- Added the exact TASK AI-001 `AIProvider` interface with `analyzeRoutine`, `explainIngredient`, and `classifySafety`.
- Added explicit provider input/output types and metadata types without using `any`.
- Added deterministic `MockAIProvider` with fixed provider metadata.
- Added `AIProviderError`, `AIProviderConfigurationError`, and `AIProviderResponseError`.
- Added `getAIProvider()` that reads `process.env.AI_PROVIDER`, defaults missing/empty/mock values to `MockAIProvider`, and throws configuration errors for OpenAI, Gemini, and unsupported providers.
- OpenAI provider is not implemented yet.
- Gemini provider is not implemented yet.
- No external AI API is called.
- No AI key is required.
- Existing Routine Analysis API/UI behavior and Routine Safety Engine logic were not changed.

### Tests

```txt
npm.cmd test -- tests/unit/ai-provider.test.ts: Pass - 1 file, 12 tests
npm.cmd run typecheck: Pass
npm.cmd run lint: Pass
npm.cmd test: Pass - 44 files, 402 tests
```

### Notes

- Next recommended task is TASK AI-002 - Structured Output Validation.

## 2026-05-18 - TASK DOC-001 Documentation Consistency Cleanup after DB-001

### Task

Synchronize AI coding documentation and public project docs with the current source state after TASK DB-001.

### Files Added

```txt
None
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/05-api-contract.md
docs/13-ui-route-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK DB-001 implemented the authenticated Dashboard API and replaced the placeholder `/dashboard` with `DashboardOverview`, but some documentation still described the current source as if Product Picker, Product Snapshot Population, RoutineLog, and Dashboard Data Integration were not implemented.

### Implementation Notes

- Updated documentation only.
- Documented `GET /api/dashboard?localDate=YYYY-MM-DD` in the API contract.
- Updated `/dashboard` route documentation to describe `DashboardOverview` and its displayed dashboard summary cards.
- Removed stale current-state statements saying Product Picker, Product Snapshot Population, RoutineLog, or Dashboard Data Integration were not implemented.
- Confirmed DB-001 is completed and documented.
- Set the next recommended task to `TASK AI-001 — AI Provider Abstraction`.
- No source feature was added.
- No AI Provider Abstraction, Ingredient Explanation, Product UI, Journal, image upload, skin scoring, clinical assessment, clinical advice, product submission, or admin product feature was implemented.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 43 files, 390 tests
```

### Notes

- This task synchronizes documentation only after DB-001.
- Historical task notes remain unchanged except where current-state guidance would otherwise be misleading.

## 2026-05-17 - TASK DB-001 Dashboard Data Integration

### Task

Replace the placeholder dashboard with a real data-driven dashboard for the authenticated user.

### Files Added

```txt
src/app/api/dashboard/route.ts
src/modules/dashboard/dashboard.types.ts
src/modules/dashboard/dashboard.dto.ts
src/modules/dashboard/dashboard.schema.ts
src/modules/dashboard/dashboard.mapper.ts
src/modules/dashboard/dashboard.use-case.ts
src/modules/dashboard/index.ts
src/modules/dashboard/components/dashboard-overview.tsx
src/modules/dashboard/components/dashboard-card.tsx
src/modules/dashboard/components/skin-profile-summary-card.tsx
src/modules/dashboard/components/today-routine-progress-card.tsx
src/modules/dashboard/components/routine-summary-card.tsx
src/modules/dashboard/components/latest-analysis-card.tsx
src/modules/dashboard/components/next-actions-card.tsx
tests/unit/dashboard-use-case.test.ts
tests/unit/dashboard-api-contract.test.ts
tests/unit/dashboard-ui.test.ts
```

### Files Updated

```txt
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
src/modules/ai-analysis/routine-analysis.repository.ts
src/modules/ai-analysis/index.ts
tests/unit/dashboard-shell.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

The protected dashboard shell needed to stop showing placeholder cards and summarize existing MVP data: Skin Profile, Routines, today's RoutineLogs, latest Routine Analysis, and next actions.

### Implementation Notes

- Added authenticated `GET /api/dashboard?localDate=YYYY-MM-DD` with strict query validation.
- Dashboard API derives `userId` from `getCurrentUser()` and rejects client-submitted `userId` query fields through strict schema parsing.
- Added Dashboard DTO/use-case/mapper boundaries.
- Dashboard DTO omits `userId`, `_id`, raw `ObjectId`, and MongoDB internals.
- Missing Skin Profile maps to `skinProfile.exists = false` and is not treated as an API error.
- Missing latest Routine Analysis maps to `latestRoutineAnalysis.exists = false` and is not treated as an API error.
- Routine counts use existing `morning` and `evening` `timeOfDay` values only; no unsupported `both` field was added.
- Today's RoutineLog progress uses the requested `localDate` and counts only logs matching the authenticated user's routines.
- Completion rate uses the documented MVP rule: completed = 1, partial = 0.5, skipped/notLogged = 0.
- Added latest routine analysis repository helper scoped by `userId`, sorted by `createdAt` descending.
- Replaced `/dashboard` placeholder cards with a client DashboardOverview that calls `GET /api/dashboard?localDate=...` using `getBrowserLocalDate()` from RoutineLog client helpers.
- Added cards for Skin Profile, today's progress, Routine summary, latest analysis, and next actions.
- No Dashboard charts, weekly/monthly analytics, streak calculation, AI insights, SkinJournal, image upload, skin scoring, external API call, or new dependency was added.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 43 files, 390 tests
npm run build: Pending local verification if sandbox build times out
```

### Notes

- Dashboard API response shape is `data.dashboard`.
- Dashboard UI reads from `body.data.dashboard`.
- Next recommended task is TASK AI-001 — AI Provider Abstraction.

## 2026-05-17 - TASK RL-002 RoutineLog UI Integration

### Task

Integrate RoutineLog UI into the existing protected `/routines` page so users can see today's log status and mark routines as completed, skipped, or partially completed with selected steps.

### Files Added

```txt
src/modules/routine-logs/routine-log.client.ts
src/modules/routines/components/routine-log-controls.tsx
src/modules/routines/components/routine-log-status-badge.tsx
tests/unit/routine-log-client.test.ts
tests/unit/routine-log-ui.test.ts
```

### Files Updated

```txt
src/modules/routines/components/routine-builder.tsx
tests/unit/routine-analysis-ui.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

RoutineLog backend foundation exists from RL-001. RL-002 adds the minimal frontend integration needed for users to record daily completion status from the current `/routines` page without creating a new route or dashboard feature.

### Implementation Notes

- `/routines` now loads today's logs through `GET /api/routine-logs?localDate=YYYY-MM-DD` and reads `body.data.routineLogs`.
- Added `getBrowserLocalDate()` using browser local date parts, not UTC `toISOString()` slicing.
- Added `getBrowserTimezone()` using `Intl.DateTimeFormat().resolvedOptions().timeZone` with `UTC` fallback.
- Added status badges for `Chưa ghi nhận`, `Hoàn thành`, `Một phần`, and `Bỏ qua`.
- Added per-routine controls for completed, skipped, and partial logs.
- Completed saves all known routine `stepId` values.
- Skipped saves an empty `completedStepIds` array.
- Partial opens an inline checklist, requires at least one selected step, rejects all selected steps, and is disabled for routines with fewer than 2 steps.
- PUT saves read the finalized response shape from `body.data.routineLog` and update local UI state only after success.
- Friendly Vietnamese loading, success, and error copy was added for load/save states.
- Client components use API routes only and do not import repositories, use cases, MongoDB helpers, auth helpers, or server-only modules.

### Tests

```txt
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 40 files, 377 tests
npm run build: Timed out in this sandbox while collecting page data after successful compilation and TypeScript phase; local verification recommended
```

### Notes

- No Dashboard integration, streak calculation, weekly/monthly analytics, AI insights, RoutineLog note input, SkinJournal, image upload, skin scoring, product submission, admin product management, external API call, or new dependency was added.
- Next recommended task is TASK DB-001 — Dashboard Data Integration.

## 2026-05-17 - TASK PP-001 Product Picker + Routine Product Snapshot Population

### Task

Integrate the existing read-only Product API into the existing Routine Builder form and populate server-owned Routine step Product snapshots when a selected visible `productId` is submitted.

### Files Added

```txt
None
```

### Files Updated

```txt
src/modules/routines/components/routine-builder.tsx
src/modules/routines/routine.schema.ts
src/modules/routines/routine.use-case.ts
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/routine-analysis-ui.test.ts
tests/unit/routine-use-case.test.ts
tests/unit/routine-api-contract.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Routine steps need to support both curated reviewed/verified products and manual products. Selected Product steps must persist `productId` plus server-populated snapshots so analysis and display can use trusted Product data without trusting client-submitted snapshot fields.

### Implementation Notes

- Added client-side Product loading in `routine-builder.tsx` through `GET /api/products?limit=50`.
- The client reads Product list data from the existing `body.data.items` response shape.
- Added a Product Picker select for each Routine step with a manual fallback option: `Nhập sản phẩm thủ công`.
- Selected product mode sets `productId`, clears `customProductName`, and keeps selected product steps intact when editing existing routines.
- Manual mode clears `productId` and submits trimmed `customProductName`.
- `buildRoutinePayload` now sends only allowed Routine input fields: `productId` or `customProductName`, `category`, `order`, `frequency`, and optional `instructions`.
- The client does not submit `stepId`, `userId`, `id`, `_id`, timestamps, risk/analysis/AI fields, or Product snapshot fields.
- The Routine use-case now looks up selected products through the existing Product use-case path.
- If a submitted `productId` is missing, invalid, or not visible, the use-case throws `RoutineValidationError`; Routine routes return `VALIDATION_ERROR` with status 400 instead of `INTERNAL_ERROR`.
- Server-side Routine persistence now populates `productNameSnapshot`, `brandSnapshot`, `keyActivesSnapshot`, and `ingredientTextSnapshot` from the Product document only.
- Manual custom product steps keep `customProductName` and do not require a Product document.
- Routine list display now prefers `brandSnapshot — productNameSnapshot`, then `productNameSnapshot`, then `customProductName`, then `Sản phẩm chưa xác định`.
- Optional key active badges are shown for Product snapshot steps.
- No Product UI page, Product submission workflow, admin Product management, seed script, Product creation form, external product API call, Ingredient explanation AI, RoutineLog, SkinJournal, dashboard data integration, skin scoring, image upload, barcode scanner, or clinical assessment was added.

### Tests

```txt
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 35 files, 324 tests
npm run build: Timed out in this sandbox while collecting page data after successful compilation and TypeScript phase
```

### Notes

- Product API response shape remains unchanged as `data: { items: ProductDto[] }`.
- Client imports `ProductDto` as a type-only import and does not import Product repository, Product use-case, MongoDB helpers, auth helpers, or server-only code.
- No commit was created.

## 2026-05-16 - TASK PI-001 Product + Ingredient API Foundation

### Task

Implement the read-only Product and Ingredient API foundation using the existing Next.js App Router, Zod, repository/use-case/mapper, DTO, and test conventions.

### Files Added

```txt
src/app/api/ingredients/route.ts
src/app/api/ingredients/[id]/route.ts
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
src/modules/ingredients/ingredient.types.ts
src/modules/ingredients/ingredient.schema.ts
src/modules/ingredients/ingredient.dto.ts
src/modules/ingredients/ingredient.mapper.ts
src/modules/ingredients/ingredient.repository.ts
src/modules/ingredients/ingredient.use-case.ts
src/modules/ingredients/index.ts
src/modules/products/product.types.ts
src/modules/products/product.schema.ts
src/modules/products/product.dto.ts
src/modules/products/product.mapper.ts
src/modules/products/product.repository.ts
src/modules/products/product.use-case.ts
src/modules/products/index.ts
tests/unit/ingredient.test.ts
tests/unit/ingredient-use-case.test.ts
tests/unit/ingredient-api-contract.test.ts
tests/unit/product.test.ts
tests/unit/product-use-case.test.ts
tests/unit/product-api-contract.test.ts
```

### Files Updated

```txt
tests/unit/database-indexes.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Product and Ingredient read APIs are needed before Product Picker integration and future Ingredient explanation work, while keeping this task limited to authenticated backend/API foundation.

### Implementation Notes

- Added `GET /api/products` and `GET /api/products/[id]`.
- Added `GET /api/ingredients` and `GET /api/ingredients/[id]`.
- All four routes require `getCurrentUser()` and return `UNAUTHORIZED` when unauthenticated.
- Product list/detail returns only `reviewed` or `verified` products.
- Ingredient list/detail does not use Product visibility, `includeMine`, or created-by-user logic.
- List routes use strict Zod query schemas and reject unknown query params.
- DTO mappers convert `_id` to `id`, Dates to ISO strings, and copy arrays.
- Product DTOs omit `createdByUserId`, `source`, `_id`, and raw ObjectId values.
- Existing canonical Product and Ingredient collection helpers and index definitions were reused; no repository-created indexes were added.
- No Product UI, Product Picker integration, Routine product snapshot population, `POST /api/products`, admin product management, Ingredient explanation AI API, seed script, external product API, image upload, or clinical assessment was added.

### Tests

```txt
npm.cmd test -- tests/unit/ingredient.test.ts tests/unit/ingredient-use-case.test.ts tests/unit/ingredient-api-contract.test.ts tests/unit/product.test.ts tests/unit/product-use-case.test.ts tests/unit/product-api-contract.test.ts tests/unit/database-indexes.test.ts: Pass - 7 files, 56 tests
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd test: Pass - 35 files, 319 tests
npm.cmd run build: Pass
npm.cmd run db:indexes: Not run - MONGODB_URI and APP_ENV were missing from the shell, so the intended database target could not be verified.
```

### Notes

- `npm run db:indexes` should only be run when `MONGODB_URI` is available and clearly points at the intended development database.
- No commit was created.

## 2026-05-15 - TASK-RA-001 Routine Analysis API Rate Limiting

### Task

Add per-user rate limiting to `POST /api/routines/[id]/analyze` before future AI-provider integration.

### Files Added

```txt
src/infrastructure/rate-limiting/rate-limit.ts
tests/unit/rate-limit.test.ts
```

### Files Updated

```txt
src/app/api/routines/[id]/analyze/route.ts
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
tests/unit/routine-analysis-api-contract.test.ts
tests/unit/database-collections.test.ts
tests/unit/database-indexes.test.ts
docs/05-api-contract.md
docs/07-security-privacy.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Routine analysis is an AI-adjacent endpoint. It needs abuse protection before real AI-provider integration while preserving the existing deterministic analysis flow.

### Implementation Notes

- Added a server-only MongoDB-backed `checkRateLimit()` helper.
- Added the `rate_limits` collection constant and helper.
- Added a unique `{ key: 1 }` index and TTL `{ expiresAt: 1 }` index with `expireAfterSeconds: 0`.
- `POST /api/routines/[id]/analyze` authenticates first, validates the request body, then checks `routine_analysis:${userId}`.
- The analyze limit is 10 requests per authenticated user per 60 minutes.
- Unauthenticated requests keep the existing `UNAUTHORIZED` behavior and do not call the rate limiter.
- Rate-limited requests return `RATE_LIMITED` with HTTP 429, `Retry-After`, and `details.retryAfterSeconds`.
- `analyzeRoutineForCurrentUser()` is not called when the user is rate-limited.
- No Redis, in-memory production limiter, new dependency, AI provider, Product/Ingredient integration, Journal, Routine Logs, image upload, skin scoring, clinical assessment, or broad refactor was added.

### Tests

```txt
npm.cmd test -- tests/unit/rate-limit.test.ts tests/unit/routine-analysis-api-contract.test.ts tests/unit/database-collections.test.ts tests/unit/database-indexes.test.ts: Pass - 4 files, 29 tests
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd test: Pass - 29 files, 272 tests
npm.cmd run build: Pass
npm.cmd run test:e2e: Smoke test reported ok, but the command wrapper timed out waiting for process exit.
```

### Notes

- `npm run db:indexes` should be run in real environments so the `rate_limits` unique and TTL indexes are present.
- No commit was created.

## 2026-05-15 - Week 3 Task 5 Routine Analysis UI Foundation

### Task

Implement the Routine Analysis UI foundation inside the existing `/routines` page only.

### Files Added

```txt
src/modules/routines/components/routine-analysis-panel.tsx
tests/unit/routine-analysis-ui.test.ts
```

### Files Updated

```txt
src/modules/routines/components/routine-builder.tsx
tests/unit/routine-builder-ui.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 5 requires users to run and view routine analysis from the existing `/routines` UI without adding new routes or expanding into real AI/provider, product, dashboard, or tracking features.

### Implementation Notes

- Added a focused `RoutineAnalysisPanel` display component.
- Kept routine loading, create, edit, delete, analyze, and history state ownership in `routine-builder.tsx`.
- Added per-routine Analyze actions that call `POST /api/routines/[id]/analyze` through `fetch` with no request body.
- Added per-routine history loading that calls `GET /api/routines/[id]/analyses` and reads the actual `body.data.analyses` response shape.
- The UI displays API-provided `analysisId`, `createdAt`, `riskLevel`, `summary`, `warnings`, `suggestions`, `shouldSeeProfessional`, and `disclaimer`.
- The client formats API-provided risk and priority values as Vietnamese labels only.
- The client does not generate risk levels, warnings, suggestions, summaries, clinical assessment, treatment claims, skin-scoring outputs, or analysis conclusions.
- Client components use type-only `RoutineAnalysisDto` imports and do not import repositories, use cases, MongoDB helpers, auth helpers, Routine Safety Engine, or AI provider modules.
- No `/routines/[id]`, `/routines/[id]/analysis`, `/routines/[id]/analyses`, dashboard analysis card, Product/Ingredient module, Product picker, Product lookup, Routine Logs, Journal, image upload, skin scoring, clinical assessment, real AI provider integration, external API call, new dependency, or broad refactor was added.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-builder-ui.test.ts tests/unit/routine-analysis-ui.test.ts: Pass - 2 files, 19 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 28 files, 266 tests
cmd /c npm run build: Pass
```

### Notes

- The UI shows deterministic fallback analysis returned by the existing API; it does not know or compute safety rules.
- Server-side Routine Analysis rate limiting is handled separately by TASK-RA-001.
- No commit was created.

## 2026-05-15 - Week 3 Task 4 Routine Analysis API Foundation

### Task

Implement the Routine Analysis API foundation only: protected analyze/history routes, a RoutineAnalysis module, deterministic Routine Safety Engine orchestration, persistence, and public DTO mapping.

### Files Added

```txt
src/app/api/routines/[id]/analyze/route.ts
src/app/api/routines/[id]/analyses/route.ts
src/modules/ai-analysis/routine-analysis.types.ts
src/modules/ai-analysis/routine-analysis.schema.ts
src/modules/ai-analysis/routine-analysis.dto.ts
src/modules/ai-analysis/routine-analysis.mapper.ts
src/modules/ai-analysis/routine-analysis.repository.ts
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/index.ts
tests/unit/routine-analysis.test.ts
tests/unit/routine-analysis-api-contract.test.ts
tests/unit/routine-analysis-use-case.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 4 requires the canonical Routine Analysis API foundation from the SDD without starting real AI provider integration or unrelated feature areas.

### Implementation Notes

- Added `POST /api/routines/[id]/analyze` and `GET /api/routines/[id]/analyses`.
- Both routes require authentication and derive `userId` from `getCurrentUser()`.
- Routine ownership is checked through `routineId + userId`; missing and not-owned routines return `NOT_FOUND`.
- `POST /api/routines/[id]/analyze` does not require a client body and rejects non-empty client fields with `VALIDATION_ERROR`.
- The use case runs the deterministic Routine Safety Engine before persistence.
- Skin Profile context is passed to the safety engine when available, and analysis still runs when no Skin Profile exists.
- RoutineAnalysis persistence stores `routineSnapshot`, top-level deterministic `riskLevel`, and all rule results including `triggered: false`.
- Public DTOs return triggered warnings only and do not expose MongoDB `_id`, `userId`, or internal `ruleResults`.
- Deterministic fallback metadata is stored as `modelProvider: "deterministic"`, `modelName: "routine-safety-engine"`, and `promptVersion: "routine-analysis-fallback-v1"`.
- No OpenAI, LLM client, external API call, Product/Ingredient module, Product lookup, Product snapshot backfill, UI, dashboard integration, Journal, Routine Logs, skin scoring, image upload, clinical assessment, new dependency, or broad refactor was added.
- At the time of Task 4, no rate-limit utility existed; TASK-RA-001 later added the scoped MongoDB-backed limiter for the analyze route.
- Review before commit kept `GET /api/routines/[id]/analyses` as `data: { analyses: [...] }` because `docs/05-api-contract.md` does not define a different response body for the history endpoint and the existing `GET /api/routines` list API convention returns a named list wrapper as `data: { routines: [...] }`.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-analysis.test.ts tests/unit/routine-analysis-use-case.test.ts tests/unit/routine-analysis-api-contract.test.ts: Pass - 3 files, 28 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 27 files, 257 tests
cmd /c npm run build: Pass
```

### Notes

- TASK-RA-001 later implemented the scoped MongoDB-backed limiter for the analyze route.
- The deterministic fallback is stored as fallback metadata, not as successful AI provider output.
- No commit was created.

## 2026-05-15 - Week 3 Task 3 Routine Safety Engine Foundation

### Task

Implement the domain-only Routine Safety Engine foundation without adding AI integration, API routes, database queries, repositories, use cases, UI changes, or new dependencies.

### Files Added

```txt
src/domain/routine-safety/routine-safety.types.ts
src/domain/routine-safety/active-signal-normalizer.ts
src/domain/routine-safety/routine-safety-engine.ts
src/domain/routine-safety/index.ts
tests/unit/routine-safety-engine.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 3 requires the deterministic rule engine foundation from `docs/11-routine-safety-rules.md` so future routine analysis can run rules before AI while keeping this task independent from application, persistence, and UI layers.

### Implementation Notes

- Added `src/domain/routine-safety` as the task-scoped domain location.
- Added active-signal normalization for AHA, BHA, PHA, RETINOID, BENZOYL_PEROXIDE, VITAMIN_C_STRONG, and FRAGRANCE.
- The normalizer reads `keyActivesSnapshot`, then `ingredientTextSnapshot`, and only uses `customProductName` text when snapshot ingredient fields are missing.
- The engine implements `MISSING_SUNSCREEN_AM`, `TOO_MANY_ACTIVES`, `RETINOID_PLUS_EXFOLIANT`, `TOO_MANY_STEPS_BEGINNER`, `FRAGRANCE_SENSITIVE_CAUTION`, `MISSING_MOISTURIZER`, and `TOO_MANY_CUSTOM_PRODUCTS`.
- PHA counts for `TOO_MANY_ACTIVES`, `RETINOID_PLUS_EXFOLIANT`, and `MISSING_MOISTURIZER` exfoliant behavior.
- FRAGRANCE is normalized for fragrance-sensitive caution but does not count as a strong active.
- `MISSING_MOISTURIZER` detects exfoliant behavior through normalized AHA/BHA/PHA signals, not through a category.
- The engine returns `allRuleResults`, `triggeredRules`, deterministic `riskLevel`, and normalized signal metadata.
- Product data is not loaded when `productId` exists but snapshots are missing.
- No Routine Analysis API, AI integration, database persistence, Product lookup, Product snapshot population, UI, Journal, Routine Logs, dashboard data integration, skin scoring, image upload, or clinical assessment was implemented.
- Follow-up review tightened custom product snapshot detection so product name, brand, key active, or ingredient snapshots prevent a custom product from being counted as missing snapshot data. `productId` alone still does not count as snapshot data.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-safety-engine.test.ts: Pass - 1 file, 28 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 24 files, 229 tests
cmd /c npm run build: Pass
```

### Notes

- The engine is not yet wired into `POST /api/routines/:id/analyze`.
- The engine does not query products or backfill snapshots; missing product snapshots intentionally produce lower available signal context.
- No commit was created.

## 2026-05-14 - Week 3 Task 2 Routine Builder UI Foundation

### Task

Implement the protected `/routines` UI foundation for listing, creating, editing, and deleting routines through the existing Routine API.

### Files Added

```txt
src/app/(dashboard)/routines/page.tsx
src/modules/routines/components/routine-builder.tsx
tests/unit/routine-builder-ui.test.ts
```

### Files Updated

```txt
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/auth-middleware.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/routine-api-contract.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 2 requires the first Routine Builder UI foundation on `/routines` only, while reusing the completed Routine API and avoiding out-of-scope routine detail routes or product features.

### Implementation Notes

- `/routines` is a protected dashboard route group page that renders a module-owned client component.
- The UI loads routines with `GET /api/routines`.
- The UI creates routines with `POST /api/routines`.
- The UI edits routines inline with `PATCH /api/routines/[id]`.
- The UI deletes routines with `DELETE /api/routines/[id]`.
- The UI shows loading, empty, list, create, edit, validation error, API error, saving, deleting, and success states.
- Submitted payloads include only `name`, `timeOfDay`, and steps with `customProductName`, `category`, `order`, `frequency`, and optional `instructions`.
- The UI does not submit `productId`, `stepId`, `userId`, `id`, `_id`, timestamps, or Product snapshot fields.
- Dashboard Routines navigation now points to `/routines` and is enabled.
- `src/proxy.ts` now protects `/routines/:path*` while preserving `/dashboard/:path*`, `/onboarding/:path*`, and `/skin-profile/:path*`.
- Product picker, Product module, Ingredient module, Routine Analysis, AI, Journal, Routine Logs, dashboard data integration, skin scoring, image upload, and clinical assessment were not implemented.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-builder-ui.test.ts tests/unit/dashboard-shell.test.ts tests/unit/auth-middleware.test.ts tests/unit/routine-api-contract.test.ts: Pass - 4 files, 35 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 23 files, 201 tests
cmd /c npm run build: Pass
```

### Notes

- No `/routines/new`, `/routines/[id]`, or `/routines/[id]/analysis` route was created.
- No new dependencies were added.
- No commit was created.

## 2026-05-14 - Week 3 Task 1 Routine API Foundation

### Task

Implement the Routine API foundation so authenticated users can list, create, read, update, and delete their own routines through API routes.

### Files Added

```txt
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
src/modules/routines/routine.types.ts
src/modules/routines/routine.schema.ts
src/modules/routines/routine.dto.ts
src/modules/routines/routine.mapper.ts
src/modules/routines/routine.repository.ts
src/modules/routines/routine.use-case.ts
tests/unit/routine.test.ts
tests/unit/routine-use-case.test.ts
tests/unit/routine-api-contract.test.ts
```

### Files Updated

```txt
tests/unit/database-indexes.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 1 requires Routine API/domain foundation only, using the Skin Profile module pattern and keeping Routine Builder UI and unrelated product features out of scope.

### Implementation Notes

- `/api/routines` supports authenticated `GET` list and `POST` create.
- `/api/routines/[id]` supports authenticated `GET`, `PATCH`, and `DELETE`.
- All routine operations are scoped to the authenticated user.
- `userId` is derived from `getCurrentUser()` and is never accepted from client input.
- MongoDB `_id` is converted to `id` in Routine DTOs, and Date fields are converted to ISO strings.
- Routine `stepId` is generated server-side before persistence.
- Create/update validation rejects client-provided `userId`, `id`, `_id`, `createdAt`, `updatedAt`, `stepId`, and Product snapshot fields.
- Invalid routine ids, missing routines, and routines owned by another user return `NOT_FOUND`.
- Product snapshot lookup was not implemented and snapshot fields are not accepted from client input.
- Routine Builder UI, Routine Analysis, Product/Ingredient modules, AI, Journal, Routine Logs, dashboard data integration, skin scoring, image upload, and clinical assessment were not implemented.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 22 files, 190 tests
cmd /c npm run build: Pass
```

### Notes

- No new dependencies were added.
- No commit was created.

## 2026-05-14 - Week 2 Task 2.2 Skin Profile View/Edit Route

### Task

Add the protected `/skin-profile` route where authenticated users can view and edit their existing Skin Profile after onboarding.

### Files Added

```txt
src/app/(dashboard)/skin-profile/page.tsx
src/modules/skin-profile/components/skin-profile-view-edit.tsx
tests/unit/skin-profile-view-edit.test.ts
```

### Files Updated

```txt
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/auth-middleware.test.ts
tests/unit/dashboard-shell.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 2.2 requires `/skin-profile` to become the main protected Skin Profile view/edit route while preserving `/onboarding/skin-profile` for first-time setup.

### Implementation Notes

- Added `src/app/(dashboard)/skin-profile/page.tsx` as a thin protected route page in the existing dashboard route group.
- Added `SkinProfileViewEdit` as a client component that uses the existing `/api/skin-profile` endpoint.
- `GET /api/skin-profile` loads the current user's profile on initial page load.
- A missing profile shows an empty state with a CTA to `/onboarding/skin-profile`.
- Existing profiles render in view mode and can switch to editing mode.
- Saves use `PATCH /api/skin-profile` only and stay on `/skin-profile` after success.
- The `/skin-profile` edit payload includes only SkinProfile fields and does not submit `id`, `_id`, `userId`, `onboardingCompleted`, `createdAt`, or `updatedAt`.
- Dashboard Skin Profile navigation now points to `routes.SKIN_PROFILE`.
- `src/proxy.ts` now protects `/dashboard/:path*`, `/onboarding/:path*`, and `/skin-profile/:path*`.
- `/onboarding/skin-profile` remains available and its existing POST/PATCH plus dashboard redirect behavior was not changed.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 19 files, 149 tests
cmd /c npm run build: Pass
```

### Notes

- No `/api/skin-profile` response shape or route handler behavior was changed.
- No POST-based profile creation was added to `/skin-profile`.
- No Routine Builder, Product module, Ingredient module, Journal, AI provider, AI-driven suggestions, dashboard data integration, image upload, skin scoring, clinical assessment, notifications, payment/subscription, analytics, or admin features were implemented.
- No new dependencies were added.

## 2026-05-14 - Week 2 Task 2.1 Skin Profile Onboarding Flow Integration

### Task

Connect the completed Skin Profile onboarding UI into the authenticated app flow without starting unrelated features.

### Files Added

```txt
tests/unit/skin-profile-use-case.test.ts
```

### Files Updated

```txt
src/modules/users/app-user-profile.repository.ts
src/modules/skin-profile/skin-profile.use-case.ts
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/app-user-profile.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/me-api-contract.test.ts
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 2.1 requires `/onboarding/skin-profile` to be discoverable from the protected dashboard area and requires successful `POST /api/skin-profile` to mark `AppUserProfile.onboardingCompleted = true` server-side.

### Implementation Notes

- Added `markAppUserProfileOnboardingCompleted(userId)` with atomic `findOneAndUpdate`, `upsert: true`, and `returnDocument: "after"`.
- The onboarding completion marker uses `$set` for `onboardingCompleted: true` and `updatedAt`, and uses `$setOnInsert` only for `userId`, default `USER` role, and `createdAt`.
- `createOrReplaceSkinProfileForCurrentUser` now marks onboarding complete after SkinProfile create/replace succeeds, then returns the SkinProfile unchanged.
- `PATCH /api/skin-profile` still updates only SkinProfile fields and does not reset or change AppUserProfile onboarding state.
- `GET /api/me` can reflect `onboardingCompleted: true` through the existing AppUserProfile mapper flow.
- Dashboard navigation now links Skin Profile to `routes.ONBOARDING_SKIN_PROFILE`.
- `src/proxy.ts` now protects `/dashboard/:path*` and `/onboarding/:path*`.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 18 files, 137 tests
cmd /c npm run build: Pass
```

### Notes

- No AI, Routine Builder, Product module, Ingredient module, Journal, dashboard data integration, image upload, skin scoring, product recommendations, clinical assessment, `/skin-profile` page, new dependencies, or Auth.js built-in route changes were implemented.

## 2026-05-14 - Week 2 Task 2 Skin Profile Onboarding UI

### Task

Implement the protected Skin Profile onboarding UI only.

### Files Added

```txt
src/app/(dashboard)/onboarding/skin-profile/page.tsx
src/modules/skin-profile/components/skin-profile-onboarding-form.tsx
tests/unit/skin-profile-onboarding.test.ts
```

### Files Updated

```txt
src/shared/constants/routes.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 2 requires an authenticated onboarding page where users can create or update their Skin Profile through the existing `/api/skin-profile` endpoint.

### Implementation Notes

- Added `/onboarding/skin-profile` under the protected `(dashboard)` route group.
- Added `routes.ONBOARDING_SKIN_PROFILE`.
- Added a client form component under `src/modules/skin-profile/components`.
- The form calls `GET /api/skin-profile` on load, prefills when a profile exists, and shows a blank create form for `NOT_FOUND`.
- The form submits with `POST` for create mode and `PATCH` for update mode.
- The form reuses the existing Skin Profile Zod schemas and does not submit `id`, `_id`, `userId`, `createdAt`, or `updatedAt`.
- The client component does not import repository, database, use-case, or `server-only` modules.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 17 files, 126 tests
cmd /c npm run build: Pass
```

### Notes

- No Routine Builder, Product module, Ingredient module, AI provider, AI-driven suggestions, Routine Analysis, Journal, dashboard data integration, clinical assessment, skin scoring, image upload, product recommendations, or Auth.js route behavior was implemented.
- Successful save redirects to `/dashboard`; the `AppUserProfile.onboardingCompleted` follow-up was implemented later in Week 2 Task 2.1.

## 2026-05-14 - Week 2 Task 1.1 Foundation Stabilization Patch

### Task

Fix the reproducible production build foundation before starting any new feature.

### Files Updated

```txt
src/app/layout.tsx
src/proxy.ts
tests/unit/auth-middleware.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Next.js production build should not depend on fetching Google font assets, and Next.js 16 expects the proxy convention instead of the deprecated middleware convention.

### Implementation Notes

- Removed `next/font/google` and `Geist` usage from `src/app/layout.tsx`.
- Kept the existing Tailwind/system `font-sans` stack.
- Renamed `src/middleware.ts` to `src/proxy.ts`.
- Exported `proxy` from the Auth.js wrapper instead of default-exporting `auth`.
- Updated the auth proxy test to read `src/proxy.ts`.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 16 files, 120 tests
cmd /c npm run build: Pass
```

### Notes

- No onboarding UI, Routine Builder, Product module, Ingredient module, AI provider, Journal, or dashboard data integration was implemented.

## 2026-05-14 - Week 2 Task 1 Skin Profile API Foundation

### Task

Implement the Skin Profile API foundation without starting other Week 2 modules or adding UI.

### Files Added

```txt
src/app/api/skin-profile/route.ts
src/modules/skin-profile/skin-profile.types.ts
src/modules/skin-profile/skin-profile.schema.ts
src/modules/skin-profile/skin-profile.dto.ts
src/modules/skin-profile/skin-profile.mapper.ts
src/modules/skin-profile/skin-profile.repository.ts
src/modules/skin-profile/skin-profile.use-case.ts
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 1 requires a protected `/api/skin-profile` API foundation for the current authenticated user. The implementation covers schema validation, DTO mapping, user-scoped repository operations, thin use-case functions, and route handlers for `GET`, `POST`, `PATCH`, and `DELETE`.

### Implementation Notes

- `GET /api/skin-profile` returns the current user's profile or `NOT_FOUND`.
- `POST /api/skin-profile` atomically creates or replaces the current user's profile by authenticated `userId`.
- `PATCH /api/skin-profile` partially updates allowed SkinProfile fields and rejects empty update bodies.
- `DELETE /api/skin-profile` deletes only the current user's profile.
- Create/update schemas are strict and reject client-provided `userId`.
- SkinProfile DTOs convert `_id` to `id`, Dates to ISO strings, and omit `userId`.
- The repository uses `getSkinProfilesCollection()` and does not create a MongoClient or query Auth.js-owned collections.
- At the time of Week 2 Task 1, successful `POST /api/skin-profile` did not update `AppUserProfile.onboardingCompleted`; this follow-up was implemented later in Week 2 Task 2.1.
- The initial `npm run lint` Phase 0 command was blocked by Windows PowerShell execution policy for `npm.ps1`, so checks were run with `npm.cmd`.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass - 16 files, 119 tests
npm.cmd run build: Pass
```

### Notes

- No Routine Builder, Product/Ingredient module, AI provider, Routine Analysis, Journal, skincare advice generation, clinical assessment, skin scoring, onboarding UI, or Auth.js route behavior was implemented.

## 2026-05-14 - Week 1 Task 7 GET /api/me Lazy AppUserProfile

### Task

Implement `GET /api/me` with lazy `AppUserProfile` creation and complete the Week 1 foundation gate without starting Week 2 or adding product features.

### Files Added

```txt
src/app/api/me/route.ts
src/modules/users/app-user-profile.types.ts
src/modules/users/app-user-profile.repository.ts
src/modules/users/app-user-profile.mapper.ts
tests/unit/app-user-profile.test.ts
tests/unit/me-api-contract.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/19-engineering-execution-checklist.md
```

### Reason

`GET /api/me` is the canonical SkinWise current-user endpoint. It returns Auth.js current-user identity plus app-specific `role` and `onboardingCompleted` from `AppUserProfile`. Missing AppUserProfile records are created lazily with default `USER` role and `onboardingCompleted = false`.

### Implementation Notes

- `GET /api/me` uses `getCurrentUser()` and returns `UNAUTHORIZED` for expected unauthenticated requests.
- `ensureAppUserProfile(userId)` uses atomic `findOneAndUpdate` upsert with `$setOnInsert`.
- The repository stores the Auth.js current user id as a string for `AppUserProfile.userId`; this avoids coercing opaque Auth.js session ids into MongoDB `ObjectId`.
- The `/api/me` DTO keeps `id` as a string and never exposes MongoDB `_id`.
- Existing profiles do not get `updatedAt` changed on every `GET /api/me`.
- The users repository uses `getAppUserProfilesCollection()` and does not create a MongoClient.
- The `/api/me` DTO omits `_id`, ObjectId, `userId`, `image`, raw session data, tokens, and raw database errors.
- The repository imports the collection helper dynamically inside functions so `next build` does not require real MongoDB/Auth env variables while collecting route data.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass - 14 files, 90 tests
npm.cmd run build: Pass
npm.cmd run test:e2e: Not run - not required for this task; Playwright browsers are not installed yet.
npm.cmd run db:indexes: Not run - requires MONGODB_URI and was not required for this task.
```

### Notes

- No Skin Profile, Routine, Journal, Product, Ingredient, AI, dashboard data integration, fake data, sample data, or medical claim was implemented.
- No `src/modules/users/ensure-app-user-profile.ts` file was created because `app-user-profile.repository.ts` owns the lazy ensure responsibility.
- No commit was created.

## 2026-05-14 — Week 1 Task 6 Protected Dashboard Shell

### Task

Create the protected `/dashboard` shell without implementing product features, business APIs, `/api/me`, AppUserProfile lazy creation, database queries, fake dashboard data, or custom sign-in UI.

### Files Added

```txt
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
tests/unit/dashboard-shell.test.ts
tests/unit/dashboard-routes.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Week 1 Task 6 required a protected dashboard foundation route. The implementation uses `getCurrentUser()` in the dashboard route group layout and redirects unauthenticated users to the Auth.js default sign-in endpoint at `/api/auth/signin?callbackUrl=/dashboard`.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 12 files, 76 tests
npm.cmd run build: Pass
```

### Notes

- `src/app/(dashboard)/dashboard/page.tsx` creates the real `/dashboard` URL; it does not create `/dashboard/dashboard`.
- Dashboard nav metadata keeps only `/dashboard` enabled.
- Skin Profile, Routines, Today Log, Journal, Products, and Ingredients nav items use `href: null` and `disabled: true`.
- Dashboard cards cover Skin Profile, Routines, Today Log, Journal, Products, Ingredients, and Safety Analysis.
- Each placeholder card states `Chưa implement trong Task 6` and `Sẽ được kết nối ở task/module sau`.
- No feature routes, marketplace, community, skin scoring, admin, subscription, notifications, custom login page, or Auth.js `pages.signIn` config were added.

## 2026-05-13 — Week 1 Task 5 Auth.js Foundation

### Task

Create Auth.js foundation without implementing `/api/me`, AppUserProfile lazy creation, dashboard shell, repositories, business features, or sign-in UI.

### Files Added

```txt
src/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/middleware.ts
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/modules/auth/next-auth.d.ts
src/modules/auth/types.ts
tests/unit/auth-config.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/auth-route.test.ts
tests/unit/get-current-user.test.ts
```

### Files Updated

```txt
package.json
package-lock.json
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
next-auth@5.0.0-beta.31
@auth/mongodb-adapter@3.11.2
```

### Dependency Notes

`@auth/mongodb-adapter@3.11.2` requires `mongodb@^6`, so the existing MongoDB driver dependency was aligned from `mongodb@^7.2.0` to `mongodb@^6.21.0` instead of using `--force` or `--legacy-peer-deps`.

### Reason

Week 1 Task 5 required Auth.js / NextAuth v5-style foundation with a MongoDB Adapter that reuses the shared MongoDB client provider. The implementation separates edge-safe config from full server-side runtime so middleware does not import database code.

### Adapter Gating Behavior

```txt
production:
  Requires MONGODB_URI through env validation and uses MongoDB Adapter.

development/test with MONGODB_URI:
  Uses MongoDB Adapter with the shared getMongoClientPromise provider.

development/test without MONGODB_URI:
  Falls back to JWT session strategy so lint/typecheck/test/build do not require a real database.
```

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 10 files, 68 tests
npm.cmd run build: Pass
```

`next build` reports a Next.js 16 warning that the `middleware` file convention is deprecated in favor of `proxy`; Task 5 keeps `src/middleware.ts` because it is the current SDD-requested file.

### Notes

- `auth.config.ts` is edge-safe and does not import `server-only`, `src/config/env.ts`, MongoDB Adapter, MongoDB helper, or `src/auth.ts`.
- Auth.js owns `/api/auth/*`; the route does not use the SkinWise `{ data, error }` response wrapper.
- `get-current-user.ts` maps session data only and does not query `AppUserProfile`.
- No `/api/me`, AppUserProfile lazy creation, dashboard shell, repositories, sign-in UI, or business features were implemented.
- No tokens or secrets are exposed or logged.

## 2026-05-13 — Week 1 Task 4 MongoDB Foundation

### Task

Create MongoDB infrastructure foundation without implementing Auth.js, API routes, repositories, seed data, or business features.

### Files Added

```txt
src/infrastructure/database/mongodb.ts
src/infrastructure/database/collections.ts
tests/unit/mongodb.test.ts
tests/unit/database-collections.test.ts
tests/unit/database-indexes.test.ts
```

### Files Updated

```txt
src/infrastructure/database/ensure-indexes.ts
package.json
package-lock.json
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
mongodb
```

### Reason

Week 1 Task 4 required a server-only MongoDB client helper, centralized collection names, and a repeatable index script aligned with the v1.2.6 data model and ADR-0006. The implementation keeps `MONGODB_URI` access centralized through `src/config/env.ts`, avoids connection at import time, and exposes index definitions for unit tests without a real MongoDB server.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 6 files, 46 tests
npm.cmd run build: Pass
npm.cmd run db:indexes: Not run — requires MONGODB_URI and was not run against a real database.
npm run test:e2e: Not run — Playwright browsers are not installed yet.
```

### Notes

- No Auth.js implementation was added.
- `next-auth` and `@auth/mongodb-adapter` were not installed.
- No API routes, repositories, seed data, fake data, or business features were implemented.
- Unit tests do not call a real MongoDB server.
- `ensure-indexes.ts` does not create indexes on import and does not create Auth.js adapter indexes.
- `DATABASE_INDEX_DEFINITIONS` excludes future/out-of-scope image upload, notifications, marketplace, skin scoring, face analysis, payment, and subscription fields.
- npm reported 2 moderate audit vulnerabilities; `npm audit fix --force` was not run by task constraint.

## 2026-05-13 — Week 1 Task 3 Environment Validation

### Task

Create server-only Zod environment validation without implementing MongoDB, Auth.js, AI providers, or business features.

### Files Added

```txt
src/config/env.ts
tests/unit/env.test.ts
```

### Files Updated

```txt
package.json
package-lock.json
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
server-only
zod
```

### Reason

Week 1 Task 3 required repeatable validation for environment variables, including production-required secrets, strict feature flag parsing, optional AI and image credentials unless gated features are enabled, URL validation, MongoDB URI format validation, and empty-string normalization for `.env.example` style placeholders.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 3 files, 27 tests
npm.cmd run build: Pass
npm run test:e2e: Not run — Playwright browsers not installed yet.
```

### Notes

- No MongoDB helper was implemented.
- No Auth.js setup, dashboard, AI provider, AI API call, routine, journal, product, ingredient, upload, or business feature was implemented.
- `src/config/env.ts` imports `server-only`, exports `parseEnv(source: NodeJS.ProcessEnv)`, and exports `env = parseEnv(process.env)`.
- `parseEnv` does not read `.env.local`, does not log secrets, and does not generate secrets.
- npm reported 2 moderate audit vulnerabilities; `npm audit fix --force` was not run by task constraint.

## 2026-05-13 — Week 1 Task 2 Tooling and UI Foundation

### Task

Initialize shadcn/ui and add shared UI foundation components without implementing business features.

### Files Added

```txt
components.json
src/shared/components/app-shell.tsx
src/shared/components/empty-state.tsx
src/shared/components/error-state.tsx
src/shared/components/loading-state.tsx
src/shared/components/ui/alert.tsx
src/shared/components/ui/badge.tsx
src/shared/components/ui/button.tsx
src/shared/components/ui/card.tsx
src/shared/components/ui/dropdown-menu.tsx
src/shared/components/ui/input.tsx
src/shared/components/ui/label.tsx
src/shared/components/ui/select.tsx
src/shared/components/ui/skeleton.tsx
src/shared/components/ui/textarea.tsx
src/shared/utils/cn.ts
src/shared/utils/index.ts
tests/unit/ui-foundation.test.ts
```

### Files Updated

```txt
package.json
package-lock.json
src/app/globals.css
src/app/layout.tsx
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
class-variance-authority
clsx
lucide-react
radix-ui
shadcn
tailwind-merge
tw-animate-css
```

### Reason

Week 1 Task 2 required shadcn/ui setup, UI primitives, shared layout/state components, and a `cn` utility under the SkinWise project structure.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 2 files, 6 tests
npm.cmd run build: Pass
npm run test:e2e: Not run — Playwright browsers not installed yet.
```

### Notes

- No product feature was implemented.
- No Auth, MongoDB, environment validation, protected dashboard, AI, routine, journal, product, ingredient, notification, marketplace, payment, admin, community, clinical assessment, or fake result was implemented.
- `components.json` aliases point to `@/shared/components`, `@/shared/components/ui`, and `@/shared/utils`.
- `src/shared/components/ui/` exists.
- `src/components/ui/` does not exist.
- shadcn CLI initially created default `src/components/ui` and `src/lib` paths; generated files were moved to the approved `src/shared` structure and the empty wrong folders were removed.

## 2026-05-13 — Week 1 Task 1 Project Foundation

### Task

Initialize the real repo's Next.js App Router foundation without rerunning create-next-app or implementing product features.

### Files Added

```txt
vitest.config.ts
playwright.config.ts
src/config/app.ts
src/config/features.ts
src/shared/constants/routes.ts
src/shared/types/result.ts
src/infrastructure/database/ensure-indexes.ts
tests/unit/foundation.test.ts
src/modules/auth/.gitkeep
src/modules/users/.gitkeep
src/modules/skin-profile/.gitkeep
src/modules/products/.gitkeep
src/modules/ingredients/.gitkeep
src/modules/routines/.gitkeep
src/modules/routine-logs/.gitkeep
src/modules/ai-analysis/.gitkeep
src/modules/journals/.gitkeep
src/domain/.gitkeep
tests/integration/.gitkeep
tests/e2e/.gitkeep
tests/evals/.gitkeep
```

### Files Updated

```txt
package.json
package-lock.json
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Week 1 Task 1 required normalizing the copied Next.js foundation inside the real repository, adding package scripts, base folder structure, test configs, safe feature flags, a repeatable `db:indexes` placeholder, and a minimal smoke test.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 1 file, 3 tests
npm.cmd run build: Pass
npm run test:e2e: Not run — Playwright browsers not installed yet.
```

### Notes

- No product feature was implemented.
- No AI provider, AI API call, image upload, marketplace, notifications, skin scoring, admin, payment, or community feature was implemented.
- `src/modules/notifications/` was not created.
- `npm.cmd install -D vitest @vitest/ui playwright tsx` was run to update test tooling and `package-lock.json`.
- `src/shared/constants/routes.ts` uses the final Week 1 uppercase route constants.
- `src/shared/types/result.ts` uses the simple `Result<T, E = Error>` union.
- npm reported 2 moderate audit vulnerabilities; `npm audit fix --force` was not run by task constraint.

## 2026-05-13 — v1.2.6 final freeze and engineering execution guardrails

### Task

Finalize the SDD before Week 1 implementation by adding engineering execution guardrails.

### Files Added

```txt
docs/19-engineering-execution-checklist.md
docs/20-week-1-task-1-prompt.md
docs/adr/0001-use-modular-monolith.md
docs/adr/0002-use-authjs-with-app-user-profile.md
docs/adr/0003-rule-engine-before-ai.md
docs/adr/0004-use-local-date-for-daily-tracking.md
docs/adr/0005-use-dto-mappers-for-api-boundaries.md
docs/adr/0006-use-repeatable-db-index-script.md
docs/CHANGELOG-v1.2.6.md
.github/pull_request_template.md
.github/workflows/ci.yml
```

### Files Updated

```txt
AGENTS.md
README.md
docs/00-source-of-truth.md
docs/04-data-model.md
docs/05-api-contract.md
docs/08-test-plan.md
docs/12-week-1-implementation-plan.md
docs/18-deployment-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/source-notes.md
```

### Reason

v1.2.5 was ready for implementation, but v1.2.6 adds final execution guardrails so AI-assisted coding can be controlled by ADRs, DTO boundary rules, index strategy, CI, PR checklist, feature flags, structured logging, and a precise Week 1 Task 1 prompt.

### Tests

No implementation tests were run because this package is documentation-only. The test plan now includes v1.2.6 execution guardrail test cases.

### Notes

- No product feature was added.
- MVP scope remains unchanged.
- Architecture remains modular monolith.
- Week 1 remains Foundation Setup.
- v1.2.6 is the final freeze before Week 1 implementation.

## 2026-05-13 — v1.2.5 consistency hotfix

### Task

Apply consistency hotfix before Week 1 implementation.

### Files Added

```txt
docs/CHANGELOG-v1.2.5.md
```

### Files Updated

```txt
AGENTS.md
README.md
docs/00-source-of-truth.md
docs/04-data-model.md
docs/05-api-contract.md
docs/08-test-plan.md
docs/12-week-1-implementation-plan.md
docs/15-use-case-and-repository-contract.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/05-ai-change-log.md
docs/source-notes.md
```

### Reason

The v1.2.4 AI coding addendum was directionally correct but needed consistency fixes before code generation. The hotfix prevents AI coding assistants from misinterpreting Auth.js-owned routes, missing-auth error naming, MVP role scope, future image fields, package install guidance, and SkinJournal PATCH behavior.

### Tests

No implementation tests were run because this package is documentation-only. The test plan now includes v1.2.5 consistency hotfix test cases.

### Notes

- No product feature was added.
- MVP scope remains unchanged.
- Architecture remains modular monolith.
- Week 1 remains Foundation Setup.
- After v1.2.5, the SDD can be frozen for Week 1 implementation.

## 2026-05-13 — v1.2.4 documentation update

### Task

Create AI Coding Source of Truth Addendum for SkinWise VN.

### Files Added

```txt
.env.example
docs/00-source-of-truth.md
docs/12-week-1-implementation-plan.md
docs/13-ui-route-map.md
docs/14-seed-data-spec.md
docs/15-use-case-and-repository-contract.md
docs/16-ai-fallback-policy.md
docs/17-vietnamese-copy-and-ui-guidelines.md
docs/18-deployment-checklist.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/CHANGELOG-v1.2.4.md
```

### Files Updated

```txt
AGENTS.md
README.md
docs/03-system-architecture.md
docs/10-project-structure.md
```

### Reason

The project needed a stronger mechanism for AI coding assistants to understand:

- the source of truth;
- current implementation status;
- project structure;
- file ownership;
- allowed sprint scope;
- forbidden MVP scope;
- post-code documentation updates.

### Scope impact

No new product feature was added.

v1.2.4 improves implementation readiness and AI coding governance only.

### Notes

- Notifications remain excluded from MVP implementation.
- Image upload remains future scope.
- Cloudinary/S3 variables are optional and future-facing.
- Rule engine must still run before AI.
- RoutineLog and SkinJournal remain separate.

## 2026-05-17 — TASK RL-001 RoutineLog Foundation

### Task

Implemented the RoutineLog backend foundation for recording completed, partially completed, or skipped routines on a specific local calendar date.

### Files Added

```txt
src/modules/routine-logs/index.ts
src/modules/routine-logs/routine-log.types.ts
src/modules/routine-logs/routine-log.schema.ts
src/modules/routine-logs/routine-log.dto.ts
src/modules/routine-logs/routine-log.mapper.ts
src/modules/routine-logs/routine-log.repository.ts
src/modules/routine-logs/routine-log.use-case.ts
src/app/api/routine-logs/route.ts
tests/unit/routine-log.test.ts
tests/unit/routine-log-use-case.test.ts
tests/unit/routine-log-api-contract.test.ts
```

### Files Updated

```txt
docs/04-data-model.md
docs/05-api-contract.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
tests/unit/database-indexes.test.ts
```

### Reason

RoutineLog is needed before daily completion UI, dashboard cards, consistency tracking, streaks, and future AI insights can be built. The implementation keeps local calendar behavior explicit by storing `localDate` as a `YYYY-MM-DD` string and `timezone` as a string.

### Implementation Notes

- Added strict Zod schemas for RoutineLog date query and PUT upsert input.
- Added DTO and mapper that expose `id` but not `userId`, `_id`, or raw MongoDB internals.
- Added repository functions for finding logs by local date, finding one log by routine/date, and upserting by `userId + routineId + localDate`.
- Added use-case validation that checks routine ownership and validates `completedStepIds` against the target routine's `stepId` values.
- Added authenticated `GET /api/routine-logs?localDate=YYYY-MM-DD`.
- Added canonical authenticated `PUT /api/routine-logs` upsert endpoint.
- Reused existing `routine_logs` collection helper and unique/query index definitions.

### Tests

- Unit: RoutineLog schema, mapper, repository, use-case, API contract, and index tests added/updated.
- Commands: `npm run lint`, `npm run typecheck`, and `npm run test` passed during implementation.

### Notes

- No RoutineLog UI was implemented.
- No dashboard integration, streak calculation, analytics, AI insights, SkinJournal, image upload, skin scoring, or clinical assessment was implemented.
- Next recommended task is TASK RL-002 — RoutineLog UI integration.

## Template for future entries

```md
## YYYY-MM-DD — Task title

### Task

Short description.

### Files Added

- `path/to/file`

### Files Updated

- `path/to/file`

### Reason

Why this change was made.

### Tests

- Unit:
- Integration:
- E2E:

### Notes

Any known limitation or follow-up.
```


## 2026-05-13 — v1.2.6 Final Documentation Cleanup

### Task
Clean up final SDD documentation before Week 1 Task 1.

### Files Changed
- `docs/14-seed-data-spec.md`
- `README.md`
- `docs/09-release-plan.md`
- `docs/12-week-1-implementation-plan.md`
- `docs/source-notes.md`
- `docs/CHANGELOG-v1.2.6.md`

### Reason
Align seed data contracts with the canonical data model, update final-freeze wording, and clarify MongoDB Adapter client-sharing guidance.

### Notes
- No product feature added.
- No MVP scope change.
- No architecture change.
- Week 1 remains ready to start after this cleanup.


## MVP-TODAY-LOG-001 - Dedicated Today Routine Checklist Page - 2026-05-27

### What changed

- Added `routes.TODAY_LOG` for `/routine-logs/today`.
- Enabled the dashboard Today Log navigation item and protected `/routine-logs/:path*` through the existing auth proxy matcher.
- Added the authenticated `/routine-logs/today` page and `TodayRoutineChecklist` client component.
- Reused `GET /api/routines`, `GET /api/routine-logs?localDate=YYYY-MM-DD`, `PUT /api/routine-logs`, `RoutineLogControls`, `RoutineLogStatusBadge`, browser local date, timezone, and RoutineLog grouping helpers.
- Updated dashboard routine logging CTAs to point to `/routine-logs/today`.
- Updated source-level tests and documentation for the new Today Checklist route.

### Scope boundaries

- No new database collection was added.
- No RoutineLog API rewrite, Routine Builder rewrite, streak logic, analytics dashboard, notification system, image upload, skin scoring, marketplace, payment, admin CRUD, or real OpenAI/Gemini integration was added.

### Validation

```txt
npm ci: Pass, with EBADENGINE warning because sandbox uses Node v22.16.0/npm 10.9.2 while project targets Node 24.x/npm 11.x
npm run lint: Pass
npm run typecheck: Pass after keeping dashboardNavItems typed as DashboardNavItem[]
npm run test: Pass - 69 files, 683 tests
npm run build: Timed out in this sandbox while collecting page data after successful compilation and TypeScript phase
npm run db:seed:e2e: Not run because local MongoDB was not available on 127.0.0.1:27017
npm run test:e2e: Not run because local MongoDB was not available on 127.0.0.1:27017
```


## 2026-05-27 - MVP-DATA-CONTROL-001 Settings and Privacy Data Control Center

- Added `routes.SETTINGS`, active Settings dashboard navigation, and protected `/settings/:path*`.
- Added the authenticated `/settings` page and `SettingsDataControlCenter` client component.
- Added safe account/app profile display using `GET /api/me`.
- Added MVP-safe account deletion request via `POST /api/account/deletion-request`, storing `accountDeletionRequestedAt` on AppUserProfile without hard-deleting Auth.js identity or adapter documents.
- Added user-scoped `DELETE /api/routine-logs/:id` and a Today Log `Xóa ghi nhận` action for existing daily routine logs.
- Updated tests and docs for Settings, account deletion request, and routine log deletion.
- Did not add export, notifications, admin CRUD, marketplace/payment, skin scoring, clinical assessment, real AI provider integration, or bulk data deletion.

## 2026-05-31 - POST-MVP-v1.3-INSIGHTS Skin Progress Insights & Calendar

### Task

Finish the existing Skin Progress Insights & Calendar feature to production-ready standard by preserving the implementation, adding focused coverage, updating documentation, and validating quality commands.

### Files Added

- `tests/unit/insights-schema.test.ts`
- `tests/unit/insights-mapper.test.ts`
- `tests/unit/insights-use-case.test.ts`
- `tests/unit/insights-client.test.ts`
- `tests/unit/insights-api-contract.test.ts`
- `tests/unit/insights-ui.test.ts`
- `tests/e2e/insights.authenticated.spec.ts`
- `docs/22-post-mvp-insights-plan.md`
- `docs/CHANGELOG-v1.3.md`

### Files Updated

- `tests/unit/dashboard-shell.test.ts`
- `tests/unit/auth-middleware.test.ts`
- `docs/02-user-stories.md`
- `docs/05-api-contract.md`
- `docs/10-project-structure.md`
- `docs/13-ui-route-map.md`
- `docs/ai-coding/01-codebase-map.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/04-file-ownership-map.md`
- `docs/ai-coding/06-current-sprint-plan.md`

### Reason

The feature already existed in source as `/insights`, `/api/insights`, and `src/modules/insights`. The hardening task documents the active routine-slot based DTO, covers validation and aggregation behavior, confirms dashboard navigation and proxy protection, and records the safety boundaries for self-tracked skincare insights.

### Notes

- No rewrite of the Insights module was performed.
- No Mongoose dependency, database schema migration, skin scoring, clinical assessment, treatment recommendation, medication advice, face analysis, image analysis, product-causality claim, marketplace, or payment feature was added.
- Product usage remains constrained by existing visible product lookup and skips invalid, missing, hidden, or unauthorized products.
### Validation

```txt
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 78 files / 745 tests
npm run build: PASS
npm run test:e2e: PASS - 25/25 tests
```

## 2026-06-04 - MVP-v1.12 Post-MVP Backlog Planning

### Task

Create a controlled post-MVP backlog after the stable MVP release so future work can continue without changing the completed MVP baseline.

### Files Added

- `docs/post-mvp-backlog.md`

### Files Updated

- `docs/00-source-of-truth.md`
- `docs/09-release-plan.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`

### Reason

The MVP is already complete and validated at local level, with production smoke/monitoring recorded as user-reported PASS. The next safe step is not to add a large feature immediately, but to create a prioritised post-MVP backlog and identify a low-risk first task.

### Outcome

- Marked `MVP v1.12 - Post-MVP Backlog Planning` as complete.
- Added prioritised backlog categories: UX polish, data quality, release observability, admin/content management, optional real AI integration, and portfolio assets.
- Marked portfolio screenshots/demo polish as optional portfolio evidence work, not a product blocker.
- Historical note: `v1.13 - UX Polish & Empty State Improvement` was selected as the next implementation task at this point and is now complete.

### Scope Boundaries

- No source-code change.
- No database/schema change.
- No dependency update.
- No new product feature.
- No auth/business-rule change.
- No real AI provider integration.
- No marketplace/payment/image upload/skin scoring/admin implementation.

### Validation

```txt
Documentation-only update.
Automated validation was not rerun in this sandbox.
Existing stable baseline evidence remains:
- npm run lint: PASS
- npm run typecheck: PASS
- npm run test: PASS - 96 files / 889 tests
- npm run build: PASS
- npm run test:e2e: PASS - 29/29 tests
- npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```
