# SkinWise VN

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users understand their skin profile, track routines, compare products, browse skincare ingredients, save products, write skin journal entries, and review personal skincare patterns safely without making medical claims.

The project was built for portfolio presentation, GitHub review, CV/resume support, recruiter review, interview explanation, BA internship preparation, and full-stack practice. It demonstrates MVP scoping, requirements thinking, safe product boundaries, modular full-stack implementation, validation discipline, CI/E2E coverage, production smoke-check discipline, and release closeout.

SkinWise VN is **not** a medical diagnosis app. It does not diagnose diseases, prescribe medication, guarantee treatment outcomes, replace dermatologists or healthcare professionals, score attractiveness, or create appearance pressure.

## Live Demo

Production demo:

- https://skinwise-vn.vercel.app

## Current Status

- Current Portfolio Release: **MVP v1.62 - Admin Content Dashboard Lite**
- Core MVP: **Complete**
- Current Phase: **Post-MVP controlled product improvement**
- Portfolio demo readiness: **Yes for local admin review demo** based on v1.47 repeatable local browser smoke; deployed admin review smoke remains open
- Production readiness: **Not claimed** because deployed admin product review smoke evidence for v1.48 is missing or incomplete
- Latest completed local validation: **MVP v1.62 local validation PASS**
- Latest completed scoped task: **MVP v1.62 - Admin Content Dashboard Lite**
- Current active milestone: **MVP v1.48 deployed smoke remains open**
- Release evidence: `docs/release-evidence-admin-content-dashboard-lite-v1.62.md`; deployed smoke blocker evidence remains `docs/release-evidence-admin-product-review-deployed-smoke-v1.48.md`
- Historical production smoke/monitoring evidence: **PASS, user-reported** from the earlier production verification baseline; screenshots, deployment id, browser/version, device/OS, and exact verification metadata are not stored in this repository
- Portfolio media evidence: screenshots and demo video remain optional artifacts and are not claimed unless captured separately
- Real production AI provider integration: **not verified**; local/demo AI behavior remains mock/provider-abstraction based

MVP v1.48 local pre-deploy validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Install | `npm ci` | PASS | Local pre-deploy validation completed. |
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 114 test files / 1171 tests passed. |
| Build | `npm run build` | PASS | Local pre-deploy validation completed. |
| Isolated admin smoke | Admin product review smoke | PASS | 3/3 tests passed. |
| E2E | `npm run test:e2e` | PASS | 34 Playwright tests passed. |

MVP v1.50 local feature validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Diff check | `git diff --check` | PASS | Command passed with an `AGENTS.md` CRLF normalization warning. |
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 115 test files / 1193 tests passed. |
| Build | `npm run build` | PASS | Passed after elevated rerun; sandboxed run failed with `spawn EPERM`. |
| E2E | `npm run test:e2e` | PASS | 35 Playwright tests passed after elevated rerun; sandboxed run failed with `spawn EPERM`. |

MVP v1.53 local feature validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | Initial pre-final fixture issue was fixed; final rerun passed. |
| Unit tests | `npm run test` | PASS | 116 test files / 1224 tests passed. |
| Build | `npm run build` | PASS | Passed after elevated rerun; sandboxed run failed with `spawn EPERM`. |
| E2E | `npm run test:e2e` | PASS | 35 Playwright tests passed after elevated rerun; sandboxed run failed with `spawn EPERM`. |
| Audit | `npm audit --omit=dev --audit-level=moderate` | PASS | Found 0 vulnerabilities. |

MVP v1.54 local feature validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 117 test files / 1260 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled then failed with `spawn EPERM`; elevated rerun passed. |
| E2E | `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; elevated rerun passed with 35/35 tests. |
| Audit | `npm audit --omit=dev --audit-level=moderate` | PASS | Found 0 vulnerabilities. |
| Diff check | `git diff --check` | PASS | Command passed with existing CRLF normalization warnings. |

MVP v1.55 local feature validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 117 test files / 1281 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled then failed with `spawn EPERM`; elevated rerun passed. |
| E2E | `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; elevated rerun passed after fixing a test assertion, 35/35 tests passed. |
| Audit | `npm audit --omit=dev --audit-level=moderate` | PASS | Found 0 vulnerabilities. |
| Diff check | `git diff --check` | PASS | Command passed with existing CRLF normalization warnings. |

MVP v1.59 local feature validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 117 test files / 1298 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled then failed with `spawn EPERM`; elevated rerun passed. |
| E2E | `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; elevated rerun passed with 36/36 tests. |
| Audit | `npm audit --omit=dev --audit-level=moderate` | PASS | Found 0 vulnerabilities. |

MVP v1.60 local feature validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 120 test files / 1343 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled then failed with `spawn EPERM`; elevated rerun passed. |
| E2E | `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; elevated rerun passed with 39/39 tests. |
| Audit | `npm audit --omit=dev --audit-level=moderate` | PASS | Found 0 vulnerabilities. |

MVP v1.62 local feature validation:

| Check | Command | Status | Notes |
|---|---|---|---|
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 122 test files / 1353 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled then failed with `spawn EPERM`; elevated rerun passed. |
| E2E | `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; elevated rerun passed with 42/42 tests. |

Deferred / not in MVP:

- Deployed admin product review smoke for v1.48: **NOT RUN / INCOMPLETE**
- Full admin CMS dashboard: **Deferred / not implemented**; v1.62 adds only a lightweight admin content overview at `/admin`
- Full admin product/ingredient CMS, hard delete, delete/merge workflows, image management, marketplace/payment: **Deferred / not implemented**; v1.59 adds only Admin Product Create/Edit Lite and v1.60 adds only Admin Ingredient Create/Edit Lite
- Real OpenAI/Gemini provider integration: **Deferred / not verified**
- v1.24 seed-data closeout: **historically NOT DONE / VALIDATION BLOCKED**; v1.43 does not retroactively close that milestone
- Marketplace/payment, skin score, medical diagnosis, image upload, subscriptions, and community features: **Out of MVP scope**

Evidence boundary:

- v1.48 local pre-deploy validation is recorded as PASS for `npm ci`, lint, typecheck, unit tests, build, isolated admin product review smoke, and full E2E.
- v1.50 local validation passed for lint, typecheck, full unit tests, build, and full E2E. Build and E2E required elevated reruns after sandbox `spawn EPERM`.
- v1.53 local validation passed for lint, typecheck, full unit tests, build, full E2E, and production dependency audit. Build and E2E required elevated reruns after sandbox `spawn EPERM`.
- v1.54 adds Saved Products review queue filters using existing saved-product records only. Final validation is recorded in `docs/release-evidence-saved-products-review-queue-filters-v1.54.md`.
- v1.55 adds Saved Product review reason indicators using existing saved-product records only. Final validation is recorded in `docs/release-evidence-saved-product-review-reason-indicators-v1.55.md`.
- v1.59 adds admin-only product create/edit lite while preserving the status-only verification route and public visibility rules. Final validation is recorded in `docs/release-evidence-admin-product-create-edit-lite-v1.59.md`.
- v1.60 adds admin-only ingredient create/edit lite while preserving user-facing Ingredient Library, Ingredient Detail, and Ingredient Explanation flows. Final validation is recorded in `docs/release-evidence-admin-ingredient-create-edit-lite-v1.60.md`.
- v1.62 adds admin-only `/admin` content dashboard lite with product/ingredient summary counts and links to existing admin tools. Final validation is recorded in `docs/release-evidence-admin-content-dashboard-lite-v1.62.md`.
- v1.47 browser smoke fixed the repeatable local admin review prerequisites using E2E-only admin/non-admin accounts and a dedicated `unverified` smoke product. Production smoke was not performed.
- v1.48 deployed admin product review smoke evidence is missing or incomplete, so production-ready is not claimed.
- Historical production PASS status remains user-reported and should be supplemented with screenshots, deployment ids, browser/network notes, or sanitized logs if strict audit traceability is required.
- No real secrets, OAuth tokens, database URIs, or private user data should be committed, uploaded, documented, or screenshotted.

## Release History

Last core MVP product release:

```txt
MVP v1.8 - Insights Usability & Progress Story Refinement
```

Completed closeout milestones:

```txt
MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup: DONE
MVP v1.8.2 - Final Documentation Consistency Hotfix: DONE
MVP v1.9 - Local Validation Evidence: PASS
MVP v1.10 - Production Smoke Test & Monitoring Evidence: PASS, user-reported
MVP v1.11 - Portfolio Demo Readiness Polish: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
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
MVP v1.38 - Routine Coverage Review & Safe Next-Step Guidance: DONE / PASS
MVP v1.39 - Saved Product Personal Notes & Trial Decision Support: DONE / PASS
MVP v1.40 - Saved Products Decision Queue & Review Filters: DONE / PASS
MVP v1.41 - Product Detail Saved Decision Shortcut: DONE / PASS
MVP v1.42 - Routine Builder Saved Product Decision Context: DONE / PASS
MVP v1.43 - Release Evidence & Validation Cleanup: DONE / PASS, local validation; production smoke not freshly verified
MVP v1.44 - Admin Product Review API Foundation: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.45 - Admin Product Review UI & Workflow Polish: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.46 - Admin Product Review Browser Smoke & Evidence: DONE / MIXED, local browser smoke found Auth.js MissingSecret blocker; authenticated admin workflow blocked by missing demo account/data; production smoke not performed
MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix: DONE / PASS locally, repeatable admin/non-admin E2E auth, unverified smoke product, admin browser smoke, and full E2E passed; production smoke not performed
MVP v1.48 - Deployed Admin Product Review Smoke Verification: BLOCKED / DEPLOYED SMOKE INCOMPLETE, local pre-deploy validation PASS; deployed smoke evidence missing or incomplete; production-ready not claimed
MVP v1.50 - Saved Product Personal Tags: DONE / PASS locally; production-ready not claimed because v1.48 deployed smoke remains open
MVP v1.51 - Dashboard Routine Coverage Summary: DONE / PASS locally
MVP v1.52 - Dashboard Saved Product Tags Summary: DONE / PASS locally
MVP v1.53 - Dashboard Saved Product Decision Queue Summary: DONE / PASS locally
MVP v1.54 - Saved Products Review Queue Filters: DONE / PASS locally
MVP v1.55 - Saved Product Review Reason Indicators: DONE / PASS locally
MVP Form Validation & Inline Feedback Polish: DONE / PASS
MVP Product Match Explainability Polish: DONE / PASS
```

MVP v1.8 is the last core MVP product release. It refines the existing Insights experience, progress-story copy, calendar readability, journal/product usage safety wording, next actions, and empty/error/loading states without changing the Insights API response shape, adding unsafe AI claims, or introducing medical/product-causality logic.

MVP v1.11 is a documentation and presentation-readiness milestone. It does not add product features or change source logic. It prepares the repository for portfolio review, demo walkthrough, and interview discussion.

MVP v1.12 is a completed post-MVP backlog planning milestone.

MVP v1.13 is a post-MVP UX polish milestone. It improves loading, empty, error, helper, CTA, and first-time guidance states without changing database behavior, authentication, authorization, Product Match rules, Routine Safety rules, or AI provider behavior.

MVP v1.14 is a post-MVP data quality milestone. It expands curated product and ingredient seed data, strengthens seed quality assertions, and improves Product Match demo coverage without changing schema, routes, authentication, authorization, or scoring logic.

MVP v1.15 is a controlled post-MVP product improvement milestone. It improves Product Match reasoning, matched-factor labels, caution notes for strong actives/fragrance signals, missing/unknown-profile guidance, and Product Detail decision support without changing database schema, routes, authentication, authorization, persistence behavior, or AI-provider behavior.

MVP v1.15.1 is an audit, dependency-risk, validation, and documentation evidence cleanup patch after v1.15. It does not add product features or change Product Match/Product Detail behavior.

MVP v1.21 extends the existing Personal Insight Review with calculation metadata and a tracking data-availability checklist without adding diagnosis, treatment advice, causation claims, skin scoring, risk scoring, health grading, schema changes, or AI provider changes.

MVP v1.22 is a completed controlled post-MVP release-confidence milestone. It improves production confidence by adding a safe public health check endpoint, health API contract test, release evidence documentation, production incident note template, and monitoring/release checklist updates. It does not add product features, database schema changes, real AI provider integration, external observability vendors, diagnosis logic, treatment advice, skin scoring, image upload, admin CRUD, marketplace, payment, checkout, or order workflow.

MVP v1.23 is a completed controlled post-MVP privacy and data-control hardening milestone. It hardens the existing account app-data deletion workflow with clearer destructive confirmation copy, user-isolation tests, sensitive-response checks, and data-control documentation. It does not delete Google/OAuth accounts, shared product catalogue data, shared ingredient library data, other users' data, production configuration, or release documentation.

MVP v1.24 remains deferred and validation-blocked. The implementation appears to have reached 70 products and 70 ingredients with v1.24 seed quality tests, but v1.24 is NOT DONE because required build and E2E validation did not pass in the current environment.

MVP v1.25 is a focused first-session guided experience polish milestone. It improves dashboard onboarding copy, highlights the next incomplete onboarding step with "Bước nên làm tiếp theo", and keeps the existing five-step first-session journey without changing database schema, authentication, Product Match scoring, Routine Safety logic, or seed data. Scoped v1.25 local validation passed with `npm run lint`, `npm run typecheck`, and `npm run test`; build, E2E, manual browser verification, and production verification were not run for v1.25.

MVP v1.25.1 is a repository consistency hotfix. It restores the v1.24 70-product / 70-ingredient seed baseline in code/tests, restores `docs/release-evidence-v1.24.md`, and keeps v1.24 validation-blocked rather than marking it DONE. It does not add product features or resolve the deferred v1.24 build/E2E blockers.

MVP v1.26 is a focused Product Match follow-up polish milestone. It improves explanation labels, product-fit score wording, safety-note visibility, no-profile guidance, and next-action copy using the existing v1.15 Product Match explainability system. It does not add AI, image analysis, medical diagnosis, treatment advice, skin scoring, payment, checkout, cart, marketplace, admin features, seed data changes, schema changes, API contract changes, or Product Match score/ranking rewrites. Scoped v1.26 local validation passed with `npm run lint`, `npm run typecheck`, and `npm run test`; build, E2E, manual browser verification, and production verification were not run for v1.26.

MVP v1.27 is a focused Product Detail to Saved Products follow-up polish milestone after v1.26. It improves Product Detail summary labels, save/unsave clarity, after-save next-action guidance, Saved Products empty-state clarity, and safe reference copy without changing Product Match scoring/ranking, Routine logic, schema, seed data, AI, image analysis, payment, checkout, cart, marketplace, or admin scope. Scoped v1.27 local validation passed with `npm run lint`, `npm run typecheck`, and `npm run test`; build, E2E, manual browser verification, and production verification were not run for v1.27.

MVP v1.28 is a focused Saved Products to Routine follow-up polish milestone after v1.26 and v1.27. It improves Saved Products context, Routine CTA clarity, Routine empty-state guidance, and safe reference copy around adding saved products gradually without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, schema, seed data, AI, image analysis, payment, checkout, cart, marketplace, or admin scope. Scoped v1.28 local validation passed with `npm run lint`, `npm run typecheck`, and `npm run test`; build, E2E, manual browser verification, and production verification were not run for v1.28.

MVP v1.29 is a focused Routine to Routine Log / Journal follow-up polish milestone after v1.26, v1.27, and v1.28. It improves Routine next-action clarity, Today Routine Log guidance, Journal empty-state and after-save next actions, and safe reference copy for interpreting routine logs/journal notes without changing Product Match, Product Detail, Saved Products, Routine, Journal, or Insights logic; schema; seed data; AI; image analysis; diagnosis; medical treatment; skin scoring; payment; checkout; cart; marketplace; or admin scope. Scoped v1.29 local validation passed with `npm run lint`, `npm run typecheck`, and `npm run test`; build, E2E, manual browser verification, and production verification were not run for v1.29.

MVP v1.30 is a focused Insights Interpretation & Dashboard Next Action polish milestone after v1.29. It improves Insights interpretation copy, insufficient-data guidance, Dashboard next-action reason copy, CTA clarity, and safe reference copy without changing Product Match, Product Detail, Saved Products, Routine, Routine Log, Journal, Insights, or Dashboard logic broadly; schema; seed data; AI; image analysis; diagnosis; medical treatment; skin scoring; payment; checkout; cart; marketplace; or admin scope. Scoped v1.30 local validation passed with `npm run lint`, `npm run typecheck`, and `npm run test`; build, E2E, manual browser verification, and production verification were not run for v1.30.

MVP v1.31 is a focused core-flow recovery and navigation polish milestone after v1.30. It improves selected empty states, recoverable error states, missing-resource fallbacks, retry clarity, and route consistency across the existing Skin Profile -> Product Match -> Product Detail -> Saved Products -> Routine -> Routine Log / Journal -> Insights -> Dashboard flow. It does not add a new global error framework, rewrite business logic, change schema or seed data, add monitoring/analytics, AI, image analysis, medical features, payment, checkout, cart, marketplace, or admin scope. Scoped v1.31 local validation passed with `npm run lint`, `npm run typecheck`, and `npm run test`; build, E2E, manual browser verification, and production verification were not run for v1.31.

MVP v1.34 is a focused Product and Ingredient Discovery Confidence polish milestone after v1.33. It adds result counts, active filter summaries, clearer no-result recovery copy, ingredient function filtering through the existing ingredient API query, ingredient reset behavior for both search and function filters, and contextual ingredient detail action labels. It does not change Product Match scoring/ranking, Routine Safety logic, seed data, schema, auth, AI provider behavior, product/ingredient CRUD scope, or API contracts beyond exposing the existing ingredient `function` query in the client.

MVP v1.35 is an E2E failure triage and extended validation cleanup milestone after v1.34. It fixes stale Playwright assertions for Dashboard onboarding/next-action rendering, Insights Vietnamese section/copy labels, Saved Products exact heading matching, and Today Routine Log safety copy. It does not change product behavior, Product Match scoring/ranking, Routine Safety logic, seed data, schema, auth, AI behavior, product/ingredient CRUD scope, or broad API contracts. Full local validation passed, including `npm run test:e2e`.

MVP v1.37 is a Product ↔ Ingredient Learning Path polish milestone after v1.35. It adds educational navigation from Product Detail to Ingredient Library searches, from Ingredient Detail to Product Catalogue searches by INCI query, and light cross-links between Product Catalogue and Ingredient Library. It does not add a recommendation engine, related-products ranking, medical advice, Product Match scoring/ranking changes, Routine Safety changes, schema changes, seed baseline changes, auth changes, AI provider changes, CRUD scope, or broad API contract changes. Full local validation passed, including `npm run test:e2e`.

MVP Form Validation & Inline Feedback Polish is a completed MVP quality improvement. It adds concise required-field guidance, Skin Profile invalid-field focus recovery, Routine Builder manual-entry guidance, valid partial-routine selection guidance, safer Journal/Settings errors, and accessible success/error feedback without changing business logic, scoring, matching, AI behavior, auth, schema, environment configuration, dependencies, or API contracts. Full local validation passed, including `npm run test:e2e`.

MVP Product Match Explainability Polish is a completed MVP quality improvement. It clarifies Product Match score meaning, match/caution reasons, ingredient-highlight labels, Product Detail personalized-match interpretation, limited-data copy, and Saved Products comparison tradeoff guidance without changing Product Match scoring/ranking, ingredient/product matching, AI behavior, business logic, schema, environment configuration, dependencies, auth, or API contracts. Full local validation passed, including `npm run test:e2e`.

MVP v1.43 is a release evidence and validation cleanup milestone. It refreshes README status, records fresh local validation, verifies audit results, documents E2E prerequisites/results, and clarifies deferred items. It does not add product features, change business logic, change API contracts, add dependencies, or claim fresh production readiness.

MVP v1.45 is a lightweight Admin Product Review UI and workflow polish milestone. It adds the protected `/admin/products` route, server-side admin guard, admin product client, all-status review list, verificationStatus update workflow, and loading/empty/error/unauthorized states on top of the v1.44 API foundation. It does not add a full admin dashboard, product create/edit CRUD, hard delete, `isActive`, marketplace/payment, image upload, real AI provider work, or production-ready claims.

MVP v1.46 is an admin product review browser smoke and evidence milestone. It
opened local `/admin/products` in headless Chrome and recorded real browser,
console, network, and validation evidence. Local browser smoke found that the
unauthenticated admin redirect reaches Auth.js sign-in but the sign-in page
returns 500 because local auth configuration is missing `AUTH_SECRET`.
Authenticated admin/non-admin product review workflows were blocked by missing
repeatable demo accounts and all-status product data. Production readiness is
not claimed.

MVP v1.47 is an admin product review repeatable smoke-data and local auth
configuration fix milestone. It keeps E2E-only credentials-provider auth gated
to `APP_ENV=test` plus `E2E_TEST_AUTH=true`, adds a repeatable E2E admin user,
keeps the repeatable E2E non-admin user, seeds a dedicated `unverified` admin
smoke product idempotently, and verifies `/admin/products` with Playwright
headless Chrome. Local admin review smoke passes, including unauthenticated
redirect without Auth.js 500, non-admin block, admin list/search/filter,
`verificationStatus` update/revert, public visibility regression, console and
network checks, and browser-visible secret checks. Production smoke was not
performed, so production-ready status is not claimed.

MVP v1.50 is a saved-product organization milestone. It adds private user-owned
personal tags to saved products, validation, card display/edit/remove controls,
and client-side tag filtering. Tags are stored on saved-product records, not
global Product records, and are not exposed through public product catalogue or
product detail APIs. It does not add AI tag suggestions, shared/public tags,
admin tag management, tag analytics, or production-ready claims.

The current phase is Post-MVP controlled product improvement. The Portfolio Evidence Package documentation has been prepared; optional screenshot and demo-video capture remain separate media evidence tasks and are not claimed unless actual files are captured separately.

## Key Features

- Google OAuth authentication with protected app routes.
- Skin profile onboarding, viewing, editing, and deletion.
- Product catalogue with product detail pages, personalized match explanation on Product Detail, v1.27 save-decision support, v1.34 result-count/filter-summary confidence polish, and v1.37 ingredient-learning cross-links.
- Curated demo-safe catalogue with 70 fictional/demo-safe products and 70 educational ingredient records in the current v1.24 seed implementation.
- Saved products with clearer save-state guidance, empty-state next action, saved product comparison, private notes/decision metadata, personal tags, and client-side filters.
- Personalized Product Match: rule-based educational product matching with product-fit level, matched-factor labels, Vietnamese explanations, ingredient highlights, caution notes, fallback guidance, clearer v1.26 next-action copy, Product Detail single-product matching based on existing product/profile metadata, and MVP Product Match Explainability Polish copy that explains score meaning, cautions, limited data, and comparison tradeoffs without changing scoring/ranking.
- Ingredient library with ingredient detail pages, v1.34 function filtering, result-count/filter-summary confidence polish, contextual detail actions, and v1.37 product-discovery cross-links.
- Ingredient explanation API using the validated provider flow and safe fallback behavior.
- Routine builder with v1.28 saved-product-to-routine guidance plus v1.29 Routine to Log/Journal next-action clarity, empty state, morning/evening guidance, selected-product context, and Today Checklist navigation.
- Routine safety analysis with deterministic rule checks, scannable result sections, and safe AI-provider fallback behavior.
- Today routine checklist, routine logs, v1.29 after-log Journal/Insights next actions, and weekly routine review.
- Skin journal with loaded-entry filters, v1.29 routine-reflection guidance, and clearer empty/after-save next actions.
- Skin Progress Insights with routine consistency, journal activity, reflective product usage, safe next actions, calendar readability improvements, Personal Insight Review cards, calculation explanations, tracking quality checklist, v1.29 short-term interpretation caution, v1.30 clearer personal-tracking interpretation/insufficient-data guidance, and v1.31 recovery fallback actions.
- Dashboard summary based on user-owned data, including clearer first-session guidance for the next onboarding step, v1.30 next-action reason copy, and v1.31 recoverable-error fallback actions.
- Settings and data control center.
- Data export, hardened app-data deletion, and MVP-safe account deletion request marker.
- Demo seed data, demo walkthrough documentation, and portfolio case study.

## Implemented Routes

Implemented UI routes:

- `/`
- `/admin/products`
- `/dashboard`
- `/onboarding/skin-profile`
- `/skin-profile`
- `/routines`
- `/routine-logs/today`
- `/journal`
- `/products`
- `/products/[id]`
- `/product-match`
- `/saved-products`
- `/insights`
- `/ingredients`
- `/ingredients/[id]`
- `/settings`

Implemented SkinWise API routes:

- `/api/me`
- `/api/account/app-data`
- `/api/account/deletion-request`
- `/api/account/export`
- `/api/dashboard`
- `/api/health`
- `/api/skin-profile`
- `/api/products`
- `/api/products/[id]`
- `/api/products/[id]/match`
- `/api/product-match`
- `/api/saved-products`
- `/api/saved-products/[productId]`
- `/api/insights`
- `/api/insights/summary`
- `/api/ingredients`
- `/api/ingredients/[id]`
- `/api/ingredients/explain`
- `/api/routines`
- `/api/routines/[id]`
- `/api/routines/[id]/analyze`
- `/api/routines/[id]/analyses`
- `/api/routine-logs`
- `/api/routine-logs/[id]`
- `/api/skin-journal`
- `/api/skin-journal/[id]`
- `/api/auth/*`

Auth.js owns `/api/auth/*` and its response format.

## Tech Stack

- Next.js App Router.
- TypeScript.
- React.
- Tailwind CSS.
- shadcn/ui-style component foundation.
- MongoDB.
- Auth.js / NextAuth.
- Zod.
- Vitest.
- Playwright.
- GitHub Actions with MongoDB service for E2E.
- Vercel.

## Validation Evidence

Latest local validation evidence:

```txt
MVP v1.55 - Saved Product Review Reason Indicators:
Evidence date: 2026-06-17
OS: Microsoft Windows NT 10.0.26200.0
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 117 files / 1281 tests
npm run build: PASS after elevated rerun; sandboxed attempt compiled then failed with spawn EPERM
npm run test:e2e: PASS after elevated rerun - 35/35 tests; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
git diff --check: PASS, with existing CRLF normalization warnings
Production-ready claimed: No
Production smoke test on deployed URL: NOT RUN for v1.55

MVP v1.43 - Release Evidence & Validation Cleanup:
Evidence date: 2026-06-15
OS: Microsoft Windows 10.0.26200
node -v: v24.14.0
npm -v: 11.14.1
npm ci: PASS after unsandboxed rerun; sandboxed attempt failed with spawn EPERM
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 110 files / 1134 tests
npm run build: PASS after unsandboxed rerun; sandboxed attempt failed with spawn EPERM
npm run test:e2e: PASS after unsandboxed rerun - 31 passed; sandboxed attempt failed with spawn EPERM
npm audit: PASS - found 0 vulnerabilities
npm audit --omit=dev: PASS - found 0 vulnerabilities
Production smoke test on deployed URL: NOT RUN for v1.43

MVP Product Match Explainability Polish:
Evidence date: 2026-06-13
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 105 files / 1032 tests
git diff --check: PASS, with a CRLF normalization warning for src/modules/product-match/components/product-match-explanation-card.tsx
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm run test:e2e: PASS - 31 passed; sandboxed attempt failed with spawn EPERM
Manual browser verification: NOT CHECKED for this local polish task; local dev server spot-check attempt exited before serving
Production verification: NOT RERUN for this local polish task

MVP v1.37 Product ↔ Ingredient Learning Path Polish:
Evidence date: 2026-06-13
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1021 tests
git diff --check: PASS
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm run test:e2e: PASS - 31 passed; sandboxed attempt failed with spawn EPERM
Manual browser verification: NOT CHECKED for v1.37
Screen-reader verification: NOT CHECKED as part of v1.37; later standalone verification: PASS
Production verification: PASS through later Manual Browser & Production Smoke Verification
Screenshots/demo video: NOT CREATED for v1.37

MVP v1.31 scoped local validation:
Evidence date: 2026-06-12
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1006 tests
npm run build: NOT RUN for v1.31
npm run test:e2e: NOT RUN for v1.31
Manual browser verification: NOT CHECKED for v1.31
Production verification: NOT CHECKED for v1.31

MVP v1.30 scoped local validation:
Evidence date: 2026-06-12
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1006 tests
npm run build: NOT RUN for v1.30
npm run test:e2e: NOT RUN for v1.30
Manual browser verification: NOT CHECKED for v1.30
Production verification: NOT CHECKED for v1.30

MVP v1.29 scoped local validation:
Evidence date: 2026-06-12
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1006 tests
npm run build: NOT RUN for v1.29
npm run test:e2e: NOT RUN for v1.29
Manual browser verification: NOT CHECKED for v1.29
Production verification: NOT CHECKED for v1.29

MVP v1.28 scoped local validation:
Evidence date: 2026-06-12
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1003 tests
npm run build: NOT RUN for v1.28
npm run test:e2e: NOT RUN for v1.28
Manual browser verification: NOT CHECKED for v1.28
Production verification: NOT CHECKED for v1.28

MVP v1.27 scoped local validation:
Evidence date: 2026-06-11
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
npm run build: NOT RUN for v1.27
npm run test:e2e: NOT RUN for v1.27
Manual browser verification: NOT CHECKED for v1.27
Production verification: NOT CHECKED for v1.27

MVP v1.26 scoped local validation:
Evidence date: 2026-06-11
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
npm run build: NOT RUN for v1.26
npm run test:e2e: NOT RUN for v1.26
Manual browser verification: NOT CHECKED for v1.26
Production verification: NOT CHECKED for v1.26

MVP v1.25.1 scoped local validation:
Evidence date: 2026-06-11
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
npm run build: NOT RUN for v1.25.1
npm run test:e2e: NOT RUN for v1.25.1
Manual browser verification: NOT CHECKED for v1.25.1
Production verification: NOT CHECKED for v1.25.1

MVP v1.25 scoped local validation:
Evidence date: 2026-06-11
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
npm run build: NOT RUN for v1.25
npm run test:e2e: NOT RUN for v1.25
Manual browser verification: NOT CHECKED for v1.25
Production verification: NOT CHECKED for v1.25

MVP v1.24 closeout validation:
Evidence date: 2026-06-11
Environment: current archive/container workspace
Required runtime baseline: Node.js 24.x / npm 11.x
Observed validation runtime: Node v22.16.0 / npm 10.9.2
npm ci: PASS with EBADENGINE warnings
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 997 tests after UI foundation timeout stabilization
npm run build: FAIL / TIMED OUT after compiling successfully and reaching Running TypeScript
npm run test:e2e: FAIL / TIMED OUT while starting Playwright web server
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Validation note:

```txt
v1.24 synchronized seed documentation, release evidence, and status docs with the current 70-product / 70-ingredient seed implementation.
v1.26 polished Product Match explanation labels, product-fit score wording, safety-note visibility, no-profile guidance, and next-action copy without changing matching score/ranking, database schema, auth architecture, authorization model, persistence scope, AI-provider behavior, Routine Safety Analysis logic, seed data, or shared catalogue behavior.
v1.27 polished Product Detail and Saved Products decision-support copy without changing Product Match scoring/ranking, Routine logic, database schema, auth architecture, persistence scope, AI-provider behavior, seed data, or shared catalogue behavior.
v1.28 polished Saved Products to Routine decision-support copy without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, database schema, auth architecture, persistence scope, AI-provider behavior, seed data, or shared catalogue behavior.
v1.29 polished Routine to Routine Log / Journal decision-support copy without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Journal logic, Insights logic, database schema, auth architecture, persistence scope, AI-provider behavior, seed data, or shared catalogue behavior.
v1.30 polished Insights interpretation and Dashboard next-action copy without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Routine Log logic, Journal logic, Insights calculations, Dashboard state model, database schema, auth architecture, persistence scope, AI-provider behavior, seed data, or shared catalogue behavior.
v1.37 polished Product ↔ Ingredient learning paths without adding recommendations, related-products ranking, Product Match scoring/ranking changes, Routine Safety changes, schema changes, seed baseline changes, auth changes, AI-provider changes, CRUD scope, or broad API contract changes.
MVP Product Match Explainability Polish clarified Product Match score meaning, match/caution reasons, ingredient-highlight labels, limited-data copy, Product Detail interpretation, and Saved Products comparison guidance without changing scoring/ranking, ingredient/product matching, business logic, AI behavior, schema, auth, environment configuration, dependencies, or API contracts.
v1.24 is NOT DONE because required build and E2E validation did not pass in the current environment.
Manual Browser & Production Smoke Verification is DONE / PASS based on user-reported production verification.
The production `/api/health` response remains the v1.22 contract; its version was not changed for v1.37.
Screen-reader verification was not part of the production smoke task itself; the later standalone Screen-Reader Assistive Technology Verification passed.
Do not claim screenshots or demo video for the production smoke task.
```

Production evidence:

```txt
Production URL: https://skinwise-vn.vercel.app
Production URL public reachability: PASS - direct unauthenticated HTTP 200 on 2026-06-11
Production /api/health: PASS - direct unauthenticated HTTP 200 and expected v1.22 JSON contract on 2026-06-11
Manual Browser & Production Smoke Verification: DONE / PASS
Evidence date: Not provided
Tester: Not provided
Environment: Production
Production URL: https://skinwise-vn.vercel.app
Deployment ID: Not provided
Browser: Not provided
Device/OS: Not provided
Critical blockers: None
Production runtime blockers: None observed
Console critical errors: None observed
Unexpected Network 4xx/5xx errors: None observed
Vercel critical runtime errors: None observed
MongoDB read/write issue: None observed
OAuth callback flow: PASS
Evidence note: user-reported manual production verification; preserve screenshots/log snippets separately if strict audit traceability is required
```

## Demo Flow

Recommended 3-5 minute walkthrough:

```txt
Landing page
-> Login
-> Dashboard
-> Skin Profile
-> Product Match
-> Save recommended product
-> Product Detail
-> Saved Products
-> Ingredient Library
-> Ingredient Detail and Explanation
-> Routine Builder
-> Routine Safety Analysis
-> Today Routine Checklist
-> Routine Logs
-> Skin Journal
-> Insights
-> Settings / Data Export
-> Delete Request
-> Sign out
```

## Portfolio Documents

- Portfolio evidence package: `docs/portfolio-evidence-package.md`
- Portfolio case study: `docs/portfolio-case-study.md`
- Demo script: `docs/demo-script.md`
- Final release checklist: `docs/final-release-checklist.md`
- v1.22 release evidence: `docs/release-evidence-v1.22.md`
- Screen-reader verification evidence: `docs/release-evidence-screen-reader-verification.md`
- Empty/loading/error state polish evidence: `docs/release-evidence-empty-loading-error-state-polish.md`
- Product Match explainability polish evidence: `docs/release-evidence-product-match-explainability-polish.md`
- v1.23 release evidence: `docs/release-evidence-v1.23.md`
- v1.24 release evidence: `docs/release-evidence-v1.24.md`
- Data control and deletion boundary: `docs/data-control-and-deletion.md`
- Production incident note template: `docs/production-incident-note-template.md`
- Deployment checklist: `docs/18-deployment-checklist.md`
- Vercel deployment runbook: `docs/deployment/vercel-deployment.md`
- Production smoke test checklist: `docs/production-smoke-test-v1.9.md`
- Production monitoring/demo recovery runbook: `docs/production-monitoring-runbook.md`
- Demo data and setup guide: `docs/ai-coding/07-demo-data-and-demo-script.md`
- Screenshot checklist: `docs/screenshots-checklist.md`
- Historical release notes v1.3: `docs/release-notes-v1.3.md`
- Historical release notes v1.0: `docs/release-notes-v1.0.md`

## Local Setup

### Runtime baseline

Use the project runtime baseline below for local development, CI, and deployment alignment:

```txt
Node.js: 24.x
npm: 11.x
```

Expected validated baseline:

```txt
node: v24.x
npm: 11.x
```

### Setup commands

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Fill real values in `.env.local` only. Do not commit, upload, share, screenshot, or package `.env.local`.

Database commands use `.env.local` and must only be run against a known local/development or explicitly safe demo database.

## Validation Commands

Run these after meaningful changes:

```bash
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

## Product Safety Boundaries

SkinWise VN intentionally avoids unsafe or unsupported claims:

- No diagnosis.
- No treatment or cure claims.
- No prescription or medication guidance.
- No dermatologist replacement.
- No skin score, face score, attractiveness score, or before/after pressure.
- No image upload or face/skin image analysis in the MVP.
- No marketplace, payment, cart, checkout, subscription, rating, or review flow.
- No admin CRUD in the current MVP.
- No real external AI provider is required for the MVP demo.

## Known MVP Limitations

These are intentional MVP boundaries, not release blockers:

- AI provider remains mock/fallback-based for MVP safety.
- Product and ingredient data is curated/demo-oriented.
- Full Auth.js hard-delete account automation is not implemented.
- Full commercial monitoring/error tracking is outside the MVP.
- Screenshots and demo video are optional media evidence; capture them only if needed for CV, portfolio page, LinkedIn, or slide deck, and do not claim they exist until actual files are produced.
- v1.22 `/api/health` only verifies that the app route is reachable. It does not verify database connectivity, OAuth connectivity, AI provider connectivity, or external service health by design.
- `npm ci` completed for v1.24 with EBADENGINE warnings because the current environment used Node v22.16.0 / npm 10.9.2 while the project requires Node 24.x / npm 11.x.
- v1.24 lint, typecheck, unit tests, and production audit passed after stabilizing a slow UI foundation import test timeout.
- v1.24 build and E2E validation timed out in the current environment, so v1.24 is NOT DONE.
- v1.25 scoped local validation passed with lint, typecheck, and unit tests.
- Build and E2E were not run for v1.25 by task scope.
- v1.25.1 restored v1.24 seed baseline/documentation consistency and passed scoped lint/typecheck/unit test validation.
- Build and E2E were not run for v1.25.1 by task scope.
- v1.26 Product Match clarity polish passed scoped lint/typecheck/unit test validation.
- Build and E2E were not run for v1.26 by task scope.
- v1.27 Product Detail to Saved Products decision-support polish passed scoped lint/typecheck/unit test validation.
- Build and E2E were not run for v1.27 by task scope.
- v1.28 Saved Products to Routine decision-support polish passed scoped lint/typecheck/unit test validation.
- Build and E2E were not run for v1.28 by task scope.
- v1.29 Routine to Routine Log / Journal decision-support polish passed scoped lint/typecheck/unit test validation.
- Build and E2E were not run for v1.29 by task scope.
- v1.30 Insights Interpretation & Dashboard Next Action polish passed scoped lint/typecheck/unit test validation.
- Build and E2E were not run for v1.30 by task scope.
- v1.31 Core Flow Recovery, Empty State & Navigation Consistency polish passed scoped lint/typecheck/unit test validation.
- Build and E2E were not run for v1.31 by task scope.
- v1.32 Core Form Submission & Action Feedback Consistency polish passed scoped lint/typecheck/unit test and diff-check validation.
- Build and E2E were not run for v1.32 by task scope.
- v1.33 Core Accessibility, Focus Management & Keyboard Interaction polish passed scoped lint/typecheck/unit test and diff-check validation.
- Build and E2E were not run for v1.33 by task scope.
- v1.34 Product & Ingredient Discovery Confidence polish passed scoped lint/typecheck/unit test and diff-check validation.
- v1.34 build passed after an elevated rerun; the sandboxed build attempt failed with `spawn EPERM`.
- v1.34 E2E was attempted after an elevated rerun and failed: 25 passed, 6 failed in existing dashboard, insights, saved-products, and today routine log flows.
- v1.34 production audit passed with 0 vulnerabilities.
- v1.35 E2E Failure Triage & Extended Validation Cleanup passed lint, typecheck, unit tests, diff check, build after elevated rerun, production audit, and full E2E.
- v1.35 fixed E2E selector/copy drift in dashboard, insights, saved-products, and today routine log flows; no app behavior or product scope was changed.
- v1.37 Product ↔ Ingredient Learning Path Polish passed lint, typecheck, unit tests, diff check, build after elevated rerun, production audit, and full E2E.
- v1.37 added educational Product Detail ↔ Ingredient Library, Ingredient Detail ↔ Product Catalogue, Product Catalogue → Ingredient Library, and Ingredient Library → Product Catalogue learning-path links without adding recommendations or product-scope changes.
- Manual Browser & Production Smoke Verification passed in production based on user-reported manual verification. No critical production blockers were observed.
- Screen-Reader Assistive Technology Verification passed through later manual production/browser verification. Keyboard-only and screen-reader verification passed with no critical accessibility blockers observed.
- MVP Product Match Explainability Polish passed lint, typecheck, unit tests, diff check, build after elevated rerun, and full E2E. Manual browser and production verification were not rerun for this local polish task.
- Manual browser deletion smoke and production deletion verification were not performed for v1.23.
- Manual browser and production verification were not performed for v1.24.
- Manual browser and production verification were not performed for v1.25.
- Manual browser and production verification were not performed for v1.26.
- Manual browser and production verification were not performed for v1.27.
- Manual browser and production verification were not performed for v1.28.
- Manual browser and production verification were not performed for v1.29.
- Manual browser and production verification were not performed for v1.30.
- Manual browser and production verification were not performed for v1.31.
- Manual browser and production verification were not performed for v1.32.
- Browser keyboard, screen-reader, manual accessibility, and production verification were not performed for v1.33.
- Manual browser, screen-reader, and production verification were not performed for v1.34.
- Manual browser, screen-reader, and production verification were not performed for v1.35.
- Screen-reader verification was not performed as part of v1.37 or the manual production smoke task; the later standalone Screen-Reader Assistive Technology Verification passed.

## Final Portfolio Decision

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
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
MVP Product Match Explainability Polish: DONE / PASS
MVP v1.43 - Release Evidence & Validation Cleanup: DONE / PASS, local validation; production smoke not freshly verified
MVP v1.44 - Admin Product Review API Foundation: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.45 - Admin Product Review UI & Workflow Polish: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.46 - Admin Product Review Browser Smoke & Evidence: DONE / MIXED, local browser smoke found Auth.js MissingSecret blocker; authenticated admin workflow blocked by missing demo account/data; production smoke not performed
MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix: DONE / PASS locally, repeatable admin/non-admin E2E auth, unverified smoke product, admin browser smoke, and full E2E passed; production smoke not performed
MVP v1.48 - Deployed Admin Product Review Smoke Verification: BLOCKED / DEPLOYED SMOKE INCOMPLETE, local pre-deploy validation PASS; deployed smoke evidence missing or incomplete; production-ready not claimed
MVP v1.50 - Saved Product Personal Tags: DONE / PASS locally; production-ready not claimed because v1.48 deployed smoke remains open
MVP v1.51 - Dashboard Routine Coverage Summary: DONE / PASS locally
MVP v1.52 - Dashboard Saved Product Tags Summary: DONE / PASS locally
MVP v1.53 - Dashboard Saved Product Decision Queue Summary: DONE / PASS locally
MVP v1.54 - Saved Products Review Queue Filters: DONE / PASS locally
MVP v1.55 - Saved Product Review Reason Indicators: DONE / PASS locally
Decision: READY for core MVP portfolio/demo/interview; READY for local admin review portfolio demo based on v1.47 local browser smoke
Production-ready decision: NOT CLAIMED because v1.48 deployed admin review smoke evidence is missing or incomplete
Current phase: Post-MVP controlled product improvement
Portfolio Evidence Package: Documentation prepared; optional media capture remains separate and is intentionally skipped
```


## Post-MVP Backlog

`v1.45 - Admin Product Review UI & Workflow Polish` adds a lightweight
protected `/admin/products` page for admin product catalogue review using the
v1.44 admin API foundation. It supports direct URL access, search/status
filtering, all-status product review, `verificationStatus` updates, and
loading/empty/error/unauthorized states without full admin CRUD, hard delete,
`isActive`, or public visibility changes.

`v1.46 - Admin Product Review Browser Smoke & Evidence` records local
Playwright/Chrome browser evidence for `/admin/products`. It found a local
Auth.js `MissingSecret` sign-in blocker and could not verify authenticated
admin/non-admin product review workflows without repeatable demo account/data.
Production/deployed URL smoke was not performed and production-ready status is
not claimed.

`v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix` resolves
the repeatable local smoke blockers by adding E2E-only admin/non-admin auth
configuration, idempotent smoke product seed data with one `unverified` product,
and Playwright coverage for unauthenticated, non-admin, admin, update/revert,
public visibility, console/network, and secret-exposure checks. This is local
browser smoke only; deployed URL smoke remains not performed and production-ready
status is not claimed.

`v1.48 - Deployed Admin Product Review Smoke Verification` records the expected
deployed smoke evidence structure and the known local pre-deploy validation PASS.
The deployed admin review smoke evidence is missing or incomplete, so the
milestone remains open and production-ready status is not claimed.

`v1.50 - Saved Product Personal Tags` adds private user-owned saved-product
tags, tag validation, card display/edit/remove controls, and client-side tag
filtering. Tags remain saved-product metadata only and are not exposed through
public product catalogue or product detail APIs.

Post-MVP work is tracked in `docs/post-mvp-backlog.md`. `v1.42 - Routine Builder Saved Product Decision Context` shows existing saved-product decision metadata for selected saved products in Routine Builder without changing routine payloads, API contracts, category auto-fill behavior, Routine Safety, or Routine Coverage. `v1.41 - Product Detail Saved Decision Shortcut` adds compact Product Detail access to existing saved-product decision metadata through the existing v1.39 PATCH client without API or data-model changes. `v1.40 - Saved Products Decision Queue & Review Filters` adds client-side Saved Products filters/search/summary. `v1.37 - Product ↔ Ingredient Learning Path Polish` improves educational navigation between Product Detail, Product Catalogue, Ingredient Detail, and Ingredient Library without adding recommendations or new product scope. `v1.35 - E2E Failure Triage & Extended Validation Cleanup` resolves the dashboard, insights, saved-products, and today routine log E2E failures left by v1.34 extended validation by updating stale Playwright selectors/copy expectations to current intentional UI. `v1.34 - Product & Ingredient Discovery Confidence Polish`, `v1.33 - Core Accessibility, Focus Management & Keyboard Interaction Polish`, `v1.32 - Core Form Submission & Action Feedback Consistency Polish`, `v1.31 - Core Flow Recovery, Empty State & Navigation Consistency Polish`, `v1.30 - Insights Interpretation & Dashboard Next Action Polish`, `v1.29 - Routine to Routine Log / Journal Decision Support Polish`, `v1.28 - Saved Products to Routine Decision Support Polish`, `v1.27 - Product Detail to Saved Products Decision Support Polish`, `v1.26 - Product Match Explanation Clarity & Safe Decision Support Polish`, `v1.25.1 - Seed Baseline Regression & Documentation Consistency Hotfix`, and `v1.25 - First-Session Guided Experience Polish` remain preserved. `v1.24 - Seed Data Quality Expansion Round 2` remains deferred and NOT DONE until required build and E2E validation pass. The Portfolio Evidence Package is presentation/evidence work, not a product correctness blocker; screenshot and demo-video capture remain optional media tasks and are intentionally skipped.
