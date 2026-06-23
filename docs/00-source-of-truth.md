# Source of Truth - SkinWise VN

Last updated: 2026-06-16

This file is the current source-of-truth pointer for release/status documentation.

Current status:

```txt
MVP v1.8 - Product release: DONE
MVP v1.8.1 - Documentation truth sync: DONE
MVP v1.8.2 - Final documentation consistency hotfix: DONE
MVP v1.9 - Local validation evidence: PASS
MVP v1.10 - Production smoke/monitoring evidence: PASS, user-reported
MVP v1.11 - Portfolio demo readiness: DONE
MVP v1.12 - Post-MVP backlog planning: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
MVP v1.14 - Data Quality Expansion: DONE
MVP v1.15 - Product Match Explainability & Safety Guardrails: DONE
MVP v1.15.1 - Audit Cleanup & Evidence Sync: DONE
MVP v1.16 - Saved Product Comparison & Decision Support: DONE
MVP v1.17 - Routine History & Weekly Progress Review: DONE
MVP v1.18 - Skin Journal Filters & Reflection Review: DONE
MVP v1.19 - Account Data Summary & Privacy Control Review: DONE
MVP v1.20 - Personal Insight Review & Safe Trend Cards: DONE
MVP v1.21 - Insight Explainability & Tracking Quality Checklist: DONE
MVP v1.22 - Production Observability & Release Confidence: DONE
MVP v1.22.1 - Production Deployment & Smoke Verification: DONE / PASS, user-reported manual verification
MVP v1.23 - Account Data Deletion Workflow Hardening: DONE
MVP v1.24 - Seed Data Quality Expansion Round 2: NOT DONE / VALIDATION BLOCKED
MVP v1.25 - First-Session Guided Experience Polish: DONE, scoped validation only
MVP v1.25.1 - Seed Baseline Regression & Documentation Consistency Hotfix: DONE, scoped validation only
MVP v1.26 - Product Match Explanation Clarity & Safe Decision Support Polish: DONE, scoped validation only
MVP v1.27 - Product Detail to Saved Products Decision Support Polish: DONE, scoped validation only
MVP v1.28 - Saved Products to Routine Decision Support Polish: DONE, scoped validation only
MVP v1.29 - Routine to Routine Log / Journal Decision Support Polish: DONE, scoped validation only
MVP v1.30 - Insights Interpretation & Dashboard Next Action Polish: DONE, scoped validation only
MVP v1.31 - Core Flow Recovery, Empty State & Navigation Consistency Polish: DONE, scoped validation only
MVP v1.32 - Core Form Submission & Action Feedback Consistency Polish: DONE, scoped validation only
MVP v1.33 - Core Accessibility, Focus Management & Keyboard Interaction Polish: DONE, scoped validation only
MVP v1.34 - Product & Ingredient Discovery Confidence Polish: DONE, scoped validation only
MVP v1.35 - E2E Failure Triage & Extended Validation Cleanup: DONE
MVP v1.37 - Product ↔ Ingredient Learning Path Polish: DONE
MVP Form Validation & Inline Feedback Polish: DONE / PASS
MVP Product Match Explainability Polish: DONE / PASS
MVP v1.38 - Routine Coverage Review & Safe Next-Step Guidance: DONE / PASS
MVP v1.39 - Saved Product Personal Notes & Trial Decision Support: DONE / PASS
MVP v1.40 - Saved Products Decision Queue & Review Filters: DONE / PASS
MVP v1.41 - Product Detail Saved Decision Shortcut: DONE / PASS
MVP v1.42 - Routine Builder Saved Product Decision Context: DONE / PASS
MVP v1.43 - Release Evidence & Validation Cleanup: DONE / PASS, local validation; production smoke not freshly verified
MVP v1.44 - Admin Product Review API Foundation: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.45 - Admin Product Review UI & Workflow Polish: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.46 - Admin Product Review Browser Smoke & Evidence: DONE / MIXED, local browser smoke found Auth.js MissingSecret blocker; authenticated admin workflow blocked by missing demo account/data; production smoke not performed
MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix: DONE / PASS locally, repeatable E2E admin/non-admin auth, unverified smoke product, admin browser smoke, and full E2E passed; production smoke not performed
MVP v1.48 - Deployed Admin Product Review Smoke Verification: BLOCKED / DEPLOYED SMOKE INCOMPLETE, local pre-deploy validation PASS; deployed smoke evidence missing or incomplete; production-ready not claimed
Core MVP: COMPLETE
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Latest completed local validation: MVP v1.48 local pre-deploy validation PASS
Current phase: Post-MVP controlled product improvement
Current active milestone: MVP v1.48 deployed smoke remains open
Production smoke: NOT RUN / INCOMPLETE for v1.48 deployed admin product review smoke
Production-ready claimed: No
Production status: Manual Browser & Production Smoke Verification: DONE / PASS
Accessibility verification status: Screen-Reader Assistive Technology Verification: DONE / PASS
v1.24 status: Implementation complete, validation blocked - `npm run build` and `npm run test:e2e` did not pass in the current environment
v1.25 status: DONE within scoped local validation - `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.25.1 status: DONE within scoped local validation - restored v1.24 70/70 seed baseline consistency and missing v1.24 release evidence; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.26 status: DONE within scoped local validation - Product Match explanation clarity, safe caution visibility, no-profile guidance, and next-action copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.27 status: DONE within scoped local validation - Product Detail save-decision guidance, Saved Products empty-state clarity, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.28 status: DONE within scoped local validation - Saved Products to Routine context, CTA clarity, routine empty-state guidance, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.29 status: DONE within scoped local validation - Routine to Routine Log / Journal CTA clarity, routine log guidance, journal empty-state/after-save next actions, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.30 status: DONE within scoped local validation - Insights interpretation, insufficient-data guidance, Dashboard next-action reason copy, CTA clarity, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.31 status: DONE within scoped local validation - selected core-flow empty states, recoverable errors, missing-resource fallbacks, retry clarity, and route consistency polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.32 status: DONE within scoped local validation - selected core form submission and mutation feedback states polished; `npm run lint`, `npm run typecheck`, `npm run test`, and `git diff --check` passed; build/E2E/manual/production verification were not run
v1.33 status: DONE within scoped local validation - selected accessibility semantics, focus recovery, keyboard action-group, validation relationship, and status feedback states polished; `npm run lint`, `npm run typecheck`, `npm run test`, and `git diff --check` passed; build/E2E/browser keyboard/screen-reader/manual accessibility/production verification were not run
v1.34 status: DONE within scoped local validation - product and ingredient discovery result counts, active filter summaries, ingredient function filtering, clearer no-result recovery copy, and contextual ingredient detail action labels polished; `npm run lint`, `npm run typecheck`, `npm run test`, and `git diff --check` passed; `npm run build` passed after an elevated rerun; `npm run test:e2e` failed after an elevated rerun with 25 passed / 6 failed in existing dashboard, insights, saved-products, and today routine log flows; audit passed
v1.35 status: DONE - E2E selector/copy drift in dashboard, insights, saved-products, and today routine log flows was triaged and fixed; `npm run lint`, `npm run typecheck`, `npm run test`, `git diff --check`, `npm run build`, `npm audit --omit=dev --audit-level=moderate`, and `npm run test:e2e` passed
v1.37 status: DONE - Product Detail now guides users to Ingredient Library searches, Ingredient Detail guides users to Product Catalogue searches by INCI/display-name query, and Product Catalogue / Ingredient Library include lightweight cross-links; `npm run lint`, `npm run typecheck`, `npm run test`, `git diff --check`, `npm run build`, `npm audit --omit=dev --audit-level=moderate`, and `npm run test:e2e` passed
v1.38 status: DONE / PASS - Routine Coverage Review added to the Routines page using existing routine data only; dashboard update intentionally skipped; full validation passed
v1.39 status: DONE / PASS - Saved Product Personal Notes & Trial Decision Support added optional private saved-product metadata, PATCH update support, Saved Products card controls, and comparison display; full validation passed
v1.40 status: DONE / PASS - Saved Products Decision Queue & Review Filters added client-side filters, search, summary counts, result count, reset behavior, filtered empty state, and hidden selected-comparison warning without API or data-model changes; full validation passed
v1.41 status: DONE / PASS - Product Detail Saved Decision Shortcut added safe saved-state handling and compact editing of existing private metadata through the v1.39 PATCH client without API or data-model changes; full validation passed
v1.42 status: DONE / PASS - Routine Builder Saved Product Decision Context shows existing saved-product decision metadata for selected saved products without routine payload, API, data-model, scoring, safety, coverage, package, or environment changes; full validation passed
v1.43 status: DONE / PASS - Release evidence and validation cleanup refreshed README/status docs, captured fresh local validation, verified npm audit, documented E2E prerequisites/results, and clarified deferred production smoke/real AI/media evidence without product or business-logic changes
v1.44 status: DONE / PASS - admin-only Product Review API foundation added AppUserProfile ADMIN authorization, all-status admin product list, verificationStatus update route, validation, tests, and docs without full admin UI, product hard delete, isActive, marketplace/payment, image upload, or production-ready claims
v1.45 status: DONE / PASS - lightweight Admin Product Review UI added protected `/admin/products`, server-side admin guard, admin product client, all-status product review list, verificationStatus update workflow, loading/empty/error/unauthorized states, tests, and release evidence without full admin dashboard, full CRUD, product hard delete, isActive, marketplace/payment, image upload, or production-ready claims
v1.46 status: DONE / MIXED - local Playwright/Chrome browser smoke for `/admin/products` found Auth.js sign-in 500 caused by local `MissingSecret`; admin/non-admin browser workflow was blocked by missing repeatable demo accounts and all-status product data; lint/typecheck/unit/build passed; production smoke not performed
v1.47 status: DONE / PASS locally - repeatable E2E-only admin/non-admin auth and idempotent unverified smoke product seed data were added; local Playwright/Chrome verified unauthenticated redirect without Auth.js 500, non-admin block, admin list/search/filter/update/revert, public visibility, console/network, and no browser-visible secret exposure; production smoke not performed
v1.48 status: BLOCKED / DEPLOYED SMOKE INCOMPLETE - local pre-deploy validation passed, but deployed admin product review smoke evidence is missing or incomplete; production-ready is not claimed
Manual Browser & Production Smoke Verification: DONE / PASS
Latest completed verification task: Screen-Reader Assistive Technology Verification: DONE / PASS
Latest completed MVP quality task: MVP Product Match Explainability Polish: DONE / PASS
Recommended next task: Complete deployed smoke evidence for MVP v1.48
```

Primary current documents:

- `README.md`
- `AGENTS.md`
- `docs/final-release-checklist.md`
- `docs/release-evidence-v1.22.md`
- `docs/release-evidence-screen-reader-verification.md`
- `docs/release-evidence-empty-loading-error-state-polish.md`
- `docs/release-evidence-form-validation-inline-feedback-polish.md`
- `docs/release-evidence-product-match-explainability-polish.md`
- `docs/release-evidence-routine-coverage-review.md`
- `docs/release-evidence-saved-product-personal-notes.md`
- `docs/release-evidence-saved-products-decision-filters.md`
- `docs/release-evidence-product-detail-saved-decision-shortcut.md`
- `docs/release-evidence-routine-builder-saved-product-decision-context.md`
- `docs/release-evidence-v1.43.md`
- `docs/release-evidence-admin-product-review-api-foundation.md`
- `docs/release-evidence-admin-product-review-ui-workflow-polish.md`
- `docs/release-evidence-admin-product-review-browser-smoke.md`
- `docs/release-evidence-admin-product-review-repeatable-smoke-v1.47.md`
- `docs/release-evidence-admin-product-review-deployed-smoke-v1.48.md`
- `docs/release-evidence-v1.23.md`
- `docs/release-evidence-v1.24.md`
- `docs/data-control-and-deletion.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/production-smoke-test-v1.9.md`
- `docs/production-monitoring-runbook.md`
- `docs/production-incident-note-template.md`
- `docs/18-deployment-checklist.md`

Historical planning documents remain useful for context, but they should not override the implemented codebase, current release evidence, or the post-MVP backlog.

Evidence boundary:

- Local validation is supported by terminal output.
- v1.47 local browser smoke passed on 2026-06-16 using Playwright headless Chrome with the system Chrome executable. It verified unauthenticated `/admin/products` redirects without Auth.js 500, non-admin blocking, admin access, list/search/filter behavior, `verificationStatus` update and revert, public product visibility regression, console/network checks, and no browser-visible secret exposure.
- v1.47 seed/auth prerequisites are repeatable and local/E2E scoped: E2E-only admin/non-admin credential providers remain gated by `APP_ENV=test` plus `E2E_TEST_AUTH=true`, and the admin smoke product is seeded idempotently with `verificationStatus="unverified"`.
- v1.47 production readiness is not claimed because no fresh deployed-URL production smoke test was performed for this milestone.
- v1.48 local pre-deploy validation passed for `npm ci`, lint, typecheck, unit tests, build, isolated admin product review smoke, and full E2E.
- v1.48 deployed admin product review smoke evidence is missing or incomplete. All deployed smoke checks remain NOT RUN in `docs/release-evidence-admin-product-review-deployed-smoke-v1.48.md`, so production-ready is not claimed.
- Production PASS is based on user-reported manual verification with no critical blockers reported.
- Manual Browser & Production Smoke Verification is DONE / PASS. Authenticated MVP flows, `/api/health`, browser console/network, Vercel runtime logs, MongoDB read/write behavior, and OAuth callback behavior were reported as checked with no critical blockers observed.
- Unknown production smoke evidence fields are recorded as `Not provided`: exact verification date, tester name, Vercel deployment id, browser/version, and device/OS.
- Screen-Reader Assistive Technology Verification is DONE / PASS based on manual production/browser verification.
- Keyboard-only verification and screen-reader verification passed with no critical accessibility blockers observed.
- Accessibility evidence metadata recorded as `Not provided`: date, tester, browser, device/OS, and screen reader used.
- No automated accessibility test suite or WCAG certification claim was added.
- MVP Empty / Loading / Error State Polish is DONE / PASS. It added route-level loading/error/not-found boundaries, Settings recovery guidance, Today Routine Log weekly-review state polish, Saved Products comparison-limit guidance, and clearer fallback copy without changing product scope or business behavior.
- MVP Form Validation & Inline Feedback Polish is DONE / PASS. It added required guidance, Skin Profile invalid-field focus recovery, Routine Builder manual-entry guidance, Today Routine Log partial-selection guidance, and safe Journal/Settings feedback without changing business logic, scoring, matching, AI behavior, auth, schema, environment, packages, dependencies, or API contracts.
- MVP Product Match Explainability Polish is DONE / PASS. It clarified Product Match score meaning, match/caution reasons, ingredient-highlight labels, limited-data copy, Product Detail interpretation guidance, and Saved Products comparison guidance without changing scoring, matching, AI behavior, business logic, auth, schema, environment, packages, dependencies, or API contracts.
- v1.38 Routine Coverage Review & Safe Next-Step Guidance is DONE / PASS. It adds a Routines page habit-support review using existing routine data only and does not change Routine Safety, Product Match scoring, AI behavior, schema, auth, env, packages, dashboard, or API contracts.
- v1.39 Saved Product Personal Notes & Trial Decision Support is DONE / PASS. It adds optional private saved-product decision metadata, strict PATCH validation, owner-scoped updates, Saved Products card controls, and comparison display without changing Product Match scoring/ranking, Routine Safety, Routine Coverage, AI provider behavior, auth provider behavior, env, package dependencies, seed baselines, or routine behavior.
- v1.40 Saved Products Decision Queue & Review Filters is DONE / PASS. It adds client-side saved-product decision filters, search, all-loaded-products summary counts, filtered result count, reset filters, filtered empty state, and a hidden selected-comparison warning without API contract changes, data model changes, Product Match scoring/ranking changes, Routine Safety changes, Routine Coverage changes, AI-provider changes, auth changes, env changes, package changes, seed changes, or routine behavior changes.
- v1.41 Product Detail Saved Decision Shortcut is DONE / PASS. It adds safe Product Detail saved-state handling and compact editing of the existing private saved-product metadata through the existing v1.39 PATCH client without API contract, data model, Product Match scoring/ranking, Routine Safety, Routine Coverage, auth, env, package, seed, or AI-provider changes.
- v1.42 Routine Builder Saved Product Decision Context is DONE / PASS. It shows existing saved-product decision metadata for selected saved products in Routine Builder without API contract changes, data model changes, routine save payload changes, Product Match scoring/ranking changes, Routine Safety changes, Routine Coverage changes, auth, env, package, seed, AI-provider, or automatic routine modification changes.
- v1.12 is completed documentation/planning only and did not include source-code changes.
- Portfolio evidence tasks are optional presentation artifacts, not product correctness blockers.
- v1.14 expanded seed data to 58 products and 59 ingredients without schema or feature-scope changes.
- v1.24 seed data implementation currently contains 70 products and 70 ingredients with v1.24 seed quality tests, but v1.24 is NOT DONE because build/E2E validation did not pass.
- v1.25 improved dashboard first-session onboarding guidance and next-step copy without seed data, schema, auth, Product Match scoring, or Routine Safety logic changes. Scoped validation passed with lint, typecheck, and unit tests only.
- v1.25.1 restored repository consistency after a seed baseline regression: `scripts/seed.ts` and `tests/unit/seed-data-quality.test.ts` again use the v1.24 70/70 baseline, `docs/release-evidence-v1.24.md` exists again, and docs keep v1.24 validation-blocked.
- v1.26 polished the existing Product Match explainability UI as a follow-up to v1.15, improving product-fit labels, safe caution wording, no-profile guidance, and next-action copy without changing scoring/ranking, seed data, schema, auth, AI-provider behavior, or Product Detail/Product Match API contracts.
- v1.27 polished Product Detail to Saved Products decision support as a follow-up to v1.26, improving product-detail summary labels, save/unsave helper copy, after-save next actions, Saved Products empty-state guidance, and safe reference copy without changing Product Match scoring/ranking, Routine logic, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.28 polished Saved Products to Routine decision support as a follow-up to v1.26 and v1.27, improving saved-product review context, Routine CTA clarity, routine empty-state guidance, and safe gradual-addition reference copy without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.29 polished Routine to Routine Log / Journal decision support as a follow-up to v1.26, v1.27, and v1.28, improving Routine next-action clarity, Today Routine Log guidance, Journal empty-state/after-save next actions, and safe short-term interpretation copy without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Journal logic, Insights logic, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.30 polished Insights interpretation and Dashboard next-action clarity as a follow-up to v1.29, improving personal-tracking interpretation copy, insufficient-data guidance, Dashboard next-action reason copy, and CTA clarity without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Routine Log logic, Journal logic, Insights calculations, Dashboard state model, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.31 polished core-flow recovery, empty-state, retry, missing-resource, and navigation consistency states after v1.30 without adding a new global error framework, changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Routine Log logic, Journal logic, Insights calculations, Dashboard state model, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.32 polished selected core form submission and mutation feedback states after v1.31, improving pending labels, disabled states, duplicate-submission prevention, safe failure copy, input/state preservation, confirmed success feedback, and supported next actions without adding a new form, toast, mutation, or state-management framework and without changing business rules, schema, seed data, auth, AI-provider behavior, or broad API contracts.
- v1.33 polished selected core accessibility semantics after v1.32, improving contextual accessible names, Routine Log action-group state, invalid-submit focus recovery, helper/error associations, and polite status semantics without adding an accessibility framework, component-library replacement, global keyboard system, full accessibility audit, or WCAG certification claim.
- v1.34 polished Product Catalogue and Ingredient Library discovery confidence after v1.33, adding result counts, active filter summaries, ingredient function filtering through the existing API query, clearer no-result recovery copy, search/function reset behavior, and contextual ingredient detail action labels without changing Product Match scoring/ranking, Routine Safety logic, seed data, schema, auth, AI-provider behavior, CRUD scope, or broad API contracts.
- v1.35 fixed stale E2E assertions after v1.34 by updating Dashboard onboarding/next-action expectations, Insights Vietnamese section/copy expectations, Saved Products exact heading matching, and Today Routine Log safety-copy expectations without changing product behavior, Product Match scoring/ranking, Routine Safety logic, seed data, schema, auth, AI-provider behavior, CRUD scope, or broad API contracts.
- v1.37 polished Product ↔ Ingredient learning paths after v1.35 by adding Product Detail ingredient education links, Ingredient Detail Product Catalogue search links by INCI/display-name query, and lightweight Product Catalogue / Ingredient Library cross-links without adding a recommendation engine, related-products ranking, Product Match scoring/ranking changes, Routine Safety changes, seed baseline changes, schema changes, auth changes, AI-provider changes, CRUD scope, or broad API contract changes.
- v1.15 improved Product Match/Product Detail explainability, matched-factor labels, caution wording, and profile guidance without schema, route, auth, persistence, or AI-provider changes.
- v1.15.1 synchronized audit/dependency-risk and validation documentation without product behavior, package, schema, route, auth, persistence, or AI-provider changes.
- v1.21 added Personal Insight Review calculation metadata and a tracking data-availability checklist without diagnosis, treatment advice, causation claims, skin scoring, risk scoring, health grading, schema changes, or AI-provider changes.
- v1.22 added a safe public health endpoint, health API contract test, release evidence documentation, production incident note template, and monitoring/release checklist updates without database, auth, AI-provider, or product-feature changes.
- v1.22.1 production smoke verification is complete based on user-reported manual production verification. No critical production blockers, runtime blockers, console critical errors, unexpected network 4xx/5xx errors, Vercel critical runtime errors, MongoDB read/write issues, or OAuth callback blockers were reported.
- v1.23 hardened the existing account app-data deletion workflow with clearer destructive confirmation copy, explicit user-isolation tests, sensitive-response checks, and data-control documentation without schema, auth architecture, product-scope, or shared-catalogue deletion changes.
- v1.24 closeout created/updated seed data documentation and release evidence, but required validation is blocked in the current environment; do not mark v1.24 DONE until all required commands pass.
- Build, E2E, manual browser verification, and production verification were not run for v1.25.
- Build, E2E, manual browser verification, and production verification were not run for v1.25.1.
- Build, E2E, manual browser verification, and production verification were not run for v1.26.
- Build, E2E, manual browser verification, and production verification were not run for v1.27.
- Build, E2E, manual browser verification, and production verification were not run for v1.28.
- Build, E2E, manual browser verification, and production verification were not run for v1.29.
- Build, E2E, manual browser verification, and production verification were not run for v1.30.
- Build, E2E, manual browser verification, and production verification were not run for v1.31.
- Build, E2E, manual browser verification, and production verification were not run for v1.32.
- Build, E2E, browser keyboard verification, screen-reader verification, manual accessibility verification, and production verification were not run for v1.33.
- v1.34 build passed after an elevated rerun; the sandboxed build attempt failed with `spawn EPERM`.
- v1.34 E2E did not pass: sandboxed E2E failed with `spawn EPERM`, and the elevated E2E run completed with 25 passed / 6 failed in existing dashboard, insights, saved-products, and today routine log flows.
- Manual browser, screen-reader, and production verification were not run for v1.34.
- v1.35 full local validation passed: Node v24.14.0, npm 11.14.1, lint, typecheck, unit tests, diff check, build after elevated rerun, audit, and full E2E.
- v1.35 sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed.
- Manual browser, screen-reader, production verification, screenshots, and demo video were not run or created for v1.35.
- v1.37 full local validation passed: Node v24.14.0, npm 11.14.1, lint, typecheck, unit tests, diff check, build after elevated rerun, audit, and full E2E.
- v1.37 sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed.
- Manual browser, screen-reader, production verification, screenshots, and demo video were not run or created for v1.37.
- v1.38 full local validation passed: lint, typecheck, 107 unit-test files / 1046 tests, diff check, package/env/prisma no-diff checks, build after elevated rerun, and full E2E with 31 passed.
- v1.38 sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed.
- Manual browser, screen-reader, production verification, screenshots, and demo video were not run or created for v1.38.
- v1.39 full local validation passed: lint, typecheck, 108 unit-test files / 1088 tests, diff check, package/env/prisma/tests-e2e no-diff checks, build after elevated rerun, and full E2E with 31 passed.
- v1.39 sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed.
- Manual browser, screen-reader, production verification, screenshots, and demo video were not run or created for v1.39.
- v1.40 full local validation passed: lint, typecheck, 109 unit-test files / 1120 tests, diff check, package/env no-diff checks, build after elevated rerun, and full E2E with 31 passed.
- v1.40 sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed.
- v1.40 targeted rendered UI check passed via Playwright fallback after the in-app Browser surface was unavailable.
- Manual production verification, screen-reader verification, screenshots, and demo video were not run or created for v1.40.
- v1.41 full local validation passed: lint, typecheck, 110 unit-test files / 1129 tests, diff check, package/env no-diff checks, build after elevated rerun, and full E2E with 31 passed.
- v1.41 sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed.
- The in-app Browser surface was unavailable for v1.41; no separate interactive panel smoke or screenshot was captured.
- Manual production verification and screen-reader verification were not rerun for v1.41.
- v1.42 full local validation passed: lint, typecheck, 110 unit-test files / 1134 tests, diff check, package/env no-diff checks, build after elevated rerun, full E2E with 31 passed, and a focused rendered Routine Builder check through a temporary Playwright spec.
- v1.42 sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed.
- The in-app Browser surface was unavailable for v1.42; the Playwright fallback rendered check passed. Manual production verification and screen-reader verification were not rerun for v1.42.
- v1.43 full local validation passed: Node v24.14.0, npm 11.14.1, `npm ci` after unsandboxed rerun, lint, typecheck, 110 unit-test files / 1134 tests, build after unsandboxed rerun, E2E after unsandboxed rerun with 31 passed, `npm audit`, and `npm audit --omit=dev`.
- v1.43 sandboxed `npm ci`, build, and E2E attempts hit `spawn EPERM`; unsandboxed reruns passed. No fresh production smoke, screenshots, demo video, or real external AI verification was performed for v1.43.
- MVP Form Validation & Inline Feedback Polish full local validation passed: Node v24.14.0, npm 11.14.1, lint, typecheck, 105 unit-test files / 1032 tests, diff check, build after elevated rerun, and full E2E with 31 passed.
- MVP Form Validation & Inline Feedback Polish sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed. Production verification was not rerun for this local polish task.
- MVP Product Match Explainability Polish full local validation passed: Node v24.14.0, npm 11.14.1, lint, typecheck, 105 unit-test files / 1032 tests, diff check, build after elevated rerun, and full E2E with 31 passed.
- MVP Product Match Explainability Polish sandboxed build/E2E attempts hit `spawn EPERM`; elevated reruns passed. Manual browser and production verification were not rerun for this local polish task.
- Manual Browser & Production Smoke Verification later passed in production. The later standalone Screen-Reader Assistive Technology Verification also passed; screenshots and demo video remain not provided.
- Production `/api/health` continues to expose the v1.22 health endpoint contract version; v1.37 did not change that API contract.
- Do not commit real secrets, OAuth tokens, database URIs, or private user data.
