# Implementation Status - SkinWise VN MVP

Last updated: 2026-06-13

## 1. Current Phase

```txt
Post-MVP controlled improvement
```

Current completed chain:

```txt
MVP v1.8 - Insights Usability & Progress Story Refinement: DONE
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
MVP v1.22.1 - Production Deployment & Smoke Verification: IN PROGRESS / NOT DONE
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
```

SkinWise VN is ready for portfolio/demo/interview use as an MVP. The core user journey is implemented, completed milestones have local validation evidence, production smoke/monitoring has been recorded as user-reported PASS, and portfolio/demo documentation has been refreshed. v1.35 restored full E2E PASS after v1.34. v1.37 now connects Product Detail to Ingredient Library searches, Ingredient Detail to Product Catalogue searches by INCI/display name, and Product Catalogue / Ingredient Library through lightweight cross-links. The v1.37 copy remains educational and non-medical, and no recommendation engine or related-products ranking was added. v1.24 seed data closeout remains deferred and not done because its own build/E2E validation timed out.

Current status:

```txt
Core MVP: COMPLETE
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Latest completed scoped task: MVP v1.37 - Product ↔ Ingredient Learning Path Polish
v1.24 - Seed Data Quality Expansion Round 2: NOT DONE / VALIDATION BLOCKED
Current active milestone: None
Current phase: Post-MVP controlled improvement
Production status: v1.22.1 production smoke verification: PARTIAL / DEFERRED
v1.24 status: Implementation complete, validation blocked - `npm run build` and `npm run test:e2e` timed out
v1.25 status: DONE within scoped local validation - lint, typecheck, and unit tests passed
v1.25.1 status: DONE within scoped local validation - v1.24 seed baseline and release-evidence consistency restored
v1.26 status: DONE within scoped local validation - Product Match explanation labels, safe caution visibility, no-profile guidance, and next-action copy polished; lint, typecheck, and unit tests passed
v1.27 status: DONE within scoped local validation - Product Detail summary labels, save/unsave guidance, after-save next action, Saved Products empty state, and safe reference copy polished; lint, typecheck, and unit tests passed
v1.28 status: DONE within scoped local validation - Saved Products to Routine context, CTA clarity, routine empty-state guidance, and safe reference copy polished; lint, typecheck, and unit tests passed
v1.29 status: DONE within scoped local validation - Routine to Routine Log / Journal CTA clarity, routine log guidance, journal empty-state/after-save next actions, and safe reference copy polished; lint, typecheck, and unit tests passed
v1.30 status: DONE within scoped local validation - Insights interpretation, insufficient-data guidance, Dashboard next-action reason copy, CTA clarity, and safe reference copy polished; lint, typecheck, and unit tests passed
v1.31 status: DONE within scoped local validation - selected core-flow empty states, recoverable errors, missing-resource fallbacks, retry clarity, and route consistency polished; lint, typecheck, and unit tests passed
v1.32 status: DONE within scoped local validation - selected core form submission and mutation feedback states polished; lint, typecheck, unit tests, and diff check passed
v1.33 status: DONE within scoped local validation - selected accessibility semantics, focus recovery, keyboard action-group, validation relationship, and status feedback states polished; lint, typecheck, unit tests, and diff check passed
v1.34 status: DONE within scoped local validation - Product Catalogue and Ingredient Library result counts, active filter summaries, ingredient function filtering, no-result recovery copy, reset behavior, and contextual ingredient detail action labels polished; lint, typecheck, unit tests, and diff check passed; build passed after elevated rerun; E2E failed after elevated rerun with 25 passed / 6 failed
v1.35 status: DONE - E2E selector/copy drift in dashboard, insights, saved-products, and today routine log flows was fixed; lint, typecheck, unit tests, diff check, build, audit, and full E2E passed
v1.37 status: DONE - Product Detail ingredient-learning links, Ingredient Detail product-discovery links by INCI/display-name query, URL-initialized Product Catalogue / Ingredient Library searches, and lightweight cross-links were added; lint, typecheck, unit tests, diff check, build, audit, and full E2E passed
Recommended next task: Manual Browser & Production Smoke Verification
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video intentionally skipped
```

Evidence boundary:

- Local validation is supported by terminal output.
- Production PASS is based on user-reported manual verification with no blockers reported.
- Screenshots, deployment ids, browser logs, and Vercel logs should be stored separately if strict evidence is required.
- The Portfolio Evidence Package documentation task does not claim new app validation, production smoke, screenshots, demo video, traffic, performance, or user-metric evidence.
- v1.22.1 directly checked only the public production URL and `/api/health`; authenticated MVP flows and production platform signals remain NOT CHECKED.
- v1.23 local implementation and validation passed; manual browser deletion smoke and production deletion verification were not performed.
- v1.24 seed data implementation reached 70 products and 70 ingredients; lint, typecheck, unit tests, and audit passed, but build/E2E validation timed out.
- v1.25 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.25.
- v1.25.1 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.25.1.
- v1.26 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.26.
- v1.27 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.27.
- v1.28 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.28.
- v1.29 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.29.
- v1.30 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.30.
- v1.31 scoped local validation passed: lint, typecheck, and unit tests. Build, E2E, manual browser verification, and production verification were not run for v1.31.
- v1.32 scoped local validation passed: lint, typecheck, unit tests, and diff check. Build, E2E, manual browser verification, and production verification were not run for v1.32.
- v1.33 scoped local validation passed: lint, typecheck, unit tests, and diff check. Build, E2E, browser keyboard verification, screen-reader verification, manual accessibility verification, and production verification were not run for v1.33.
- v1.34 scoped local validation passed: lint, typecheck, unit tests, and diff check. Build passed after an elevated rerun; E2E failed after an elevated rerun with 25 passed / 6 failed in existing dashboard, insights, saved-products, and today routine log flows. Manual browser, screen-reader, and production verification were not run for v1.34.
- v1.35 extended validation cleanup passed: lint, typecheck, unit tests, diff check, build after elevated rerun, audit, and full E2E. Manual browser, screen-reader, production verification, screenshots, and demo video were not run for v1.35.
- v1.37 full local validation passed: lint, typecheck, unit tests, diff check, build after elevated rerun, audit, and full E2E. Manual browser, screen-reader, production verification, screenshots, and demo video were not run or created for v1.37.
- v1.37 did not change Product Match scoring/ranking, Routine Safety logic, schema, seed baseline, auth, AI-provider behavior, CRUD scope, broad API contracts, or the v1.22 `/api/health` contract version.

## 2. Implemented Product Scope

| Area | Status | Notes |
|---|---|---|
| Landing page | DONE | Public product entry. |
| Google OAuth / Auth.js | DONE | Protected app routes use authenticated user context. |
| Dashboard | DONE | User-owned summary with v1.25 first-session guided next-step polish, v1.30 next-action reason copy, and v1.31 recoverable-error fallback actions. |
| Skin Profile | DONE | Onboarding/view/edit/delete flows. |
| Product Catalogue | DONE | Product list and detail flows with v1.34 result confidence polish, v1.37 URL-initialized search queries, and a lightweight link to Ingredient Library. |
| Product Match | DONE | Rule-based educational matching with v1.15 explainability, v1.26 explanation-label/caution/no-profile clarity polish, and v1.31 no-result/error recovery actions. |
| Product Detail personalized match | DONE | Single-product match explanation with v1.15 decision-support, v1.26 Product Match context, v1.27 save-decision support polish, v1.31 missing-product fallback navigation, and v1.37 educational Ingredient Library search links. |
| Saved Products | DONE | Save/unsave user-owned products; v1.16 comparison decision support, v1.27 empty-state/save-context polish, v1.28 routine decision-support guidance, and v1.31 load-error fallback navigation added. |
| Ingredient Library | DONE | Ingredient list/detail/explanation with v1.34 discovery confidence polish, v1.37 URL-initialized search queries, Ingredient Detail Product Catalogue discovery links by INCI/display name, and a lightweight catalogue cross-link. |
| Routine Builder | DONE | Morning/evening routine management with v1.28 saved-product-to-routine empty-state/reference guidance and v1.29 Routine to Log/Journal next-action clarity. |
| Routine Safety Analysis | DONE | Deterministic analysis and safe fallback behavior. |
| Today Routine Checklist | DONE | Daily completion flow with v1.31 load-error retry and Routine fallback navigation. |
| Routine Logs | DONE | Tracking history with v1.17 weekly habit review and v1.29 safer log-to-journal next-action guidance. |
| Skin Journal | DONE | Journal entry management with v1.18 loaded-entry filters/reflection review and v1.29 routine-reflection empty/after-save guidance. |
| Insights | DONE | Routine consistency, journal activity, reflective usage, safe next actions, v1.29 short-term interpretation caution, and v1.30 clearer personal-tracking interpretation/insufficient-data guidance; v1.20 added strict count-only Personal Insight Review cards. |
| Settings/Data Control | DONE | Data export, app data deletion, account deletion request marker; v1.19 account data summary is complete; v1.23 hardened app-data deletion copy, ownership tests, and documentation. |
| Seed data | IN PROGRESS / VALIDATION BLOCKED | v1.24 implementation now contains 70 ingredients and 70 products with v1.24 seed quality tests, but v1.24 is not DONE until build/E2E validation passes. |
| UX state polish | DONE | v1.13 improved loading, empty, error, helper, CTA, and first-time guidance states. |
| Portfolio docs | DONE | README, portfolio evidence package, case study, demo script, checklists, runbooks. |
| Production observability / health check | DONE | v1.22 added safe public `GET /api/health`, release evidence, incident note template, and monitoring/checklist updates. |
| Seed baseline consistency hotfix | DONE, scoped validation only | v1.25.1 restored the v1.24 70/70 seed baseline in code/tests, restored missing v1.24 release evidence, and kept v1.24 validation-blocked. |
| Product Match explanation clarity polish | DONE, scoped validation only | v1.26 polished existing Product Match explanation UI/copy without changing scoring/ranking, seed data, schema, auth, AI provider behavior, or API contracts. |
| Product Detail to Saved Products decision support polish | DONE, scoped validation only | v1.27 polished Product Detail summary, save/unsave helper copy, after-save next actions, Saved Products empty-state guidance, and safe reference copy without changing Product Match scoring/ranking, Routine logic, seed data, schema, auth, AI provider behavior, or API contracts. |
| Saved Products to Routine decision support polish | DONE, scoped validation only | v1.28 polished Saved Products review context, Routine CTA clarity, routine empty-state guidance, and safe gradual-addition copy without changing Product Match, Product Detail, Saved Products persistence, Routine logic, seed data, schema, auth, AI provider behavior, or API contracts. |
| Routine to Routine Log / Journal decision support polish | DONE, scoped validation only | v1.29 polished Routine next-action clarity, Today Routine Log guidance, Journal empty-state/after-save next actions, and safe short-term interpretation copy without changing Product Match, Product Detail, Saved Products, Routine, Journal, or Insights logic, seed data, schema, auth, AI provider behavior, or API contracts. |
| Core flow recovery, empty-state, and navigation consistency polish | DONE, scoped validation only | v1.31 polished selected Product Match, Product Detail, Saved Products, Routine, Today Log, Insights, and Dashboard recovery/fallback states without adding a new global error framework, changing business logic, seed data, schema, auth, AI provider behavior, or API contracts. |
| Core form submission and action feedback consistency polish | DONE, scoped validation only | v1.32 polished selected Saved Product save/unsave, Product Detail save controls, Routine save, Routine Log status, and Journal save interactions with clearer pending labels, duplicate-submission prevention, safe failure copy, input/state preservation, confirmed success feedback, and supported next actions without adding a new form, toast, mutation, or state-management framework. |
| Core accessibility, focus management, and keyboard interaction polish | DONE, scoped validation only | v1.33 polished selected product action accessible names, Routine Log action-group semantics, Routine and Journal invalid-submit focus recovery, Journal helper/error associations, and polite status feedback without adding a new accessibility framework or claiming full WCAG compliance. |
| Product and ingredient discovery confidence polish | DONE, scoped validation only | v1.34 polished Product Catalogue and Ingredient Library result counts, active filter summaries, ingredient function filtering through the existing API query, clearer no-result recovery copy, reset behavior, and contextual ingredient detail action labels without changing Product Match scoring/ranking, Routine Safety logic, seed data, schema, auth, AI provider behavior, CRUD scope, or broad API contracts. |
| E2E failure triage and extended validation cleanup | DONE | v1.35 fixed stale Playwright selectors/copy expectations for Dashboard, Insights, Saved Products, and Today Routine Log. It changed E2E tests only and full validation passed, including `npm run test:e2e`. |
| Product ↔ Ingredient learning path polish | DONE | v1.37 added educational query links and lightweight cross-links across Product Detail, Product Catalogue, Ingredient Detail, and Ingredient Library without recommendation or ranking behavior. |

## 3. Route Coverage

UI routes:

```txt
/
/dashboard
/onboarding/skin-profile
/skin-profile
/routines
/routine-logs/today
/journal
/products
/products/[id]
/product-match
/saved-products
/insights
/ingredients
/ingredients/[id]
/settings
```

API routes:

```txt
/api/me
/api/account/app-data
/api/account/deletion-request
/api/account/export
/api/dashboard
/api/health
/api/skin-profile
/api/products
/api/products/[id]
/api/products/[id]/match
/api/product-match
/api/saved-products
/api/saved-products/[productId]
/api/insights
/api/insights/summary
/api/ingredients
/api/ingredients/[id]
/api/ingredients/explain
/api/routines
/api/routines/[id]
/api/routines/[id]/analyze
/api/routines/[id]/analyses
/api/routine-logs
/api/routine-logs/[id]
/api/skin-journal
/api/skin-journal/[id]
/api/auth/*
```

## 4. Validation Evidence

Local evidence:

```txt
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
Manual browser verification: NOT CHECKED
Screen-reader verification: NOT CHECKED
Production verification: NOT CHECKED
Screenshots/demo video: NOT CREATED

Historical v1.24 closeout evidence:
Evidence date: 2026-06-11
Environment: current archive/container workspace
Required runtime baseline: Node.js 24.x / npm 11.x
Observed node -v: v22.16.0
Observed npm -v: 10.9.2
npm ci: PASS with EBADENGINE warnings
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 997 tests after UI foundation timeout stabilization
npm run build: FAIL / TIMED OUT after compiling successfully and reaching Running TypeScript
npm run test:e2e: FAIL / TIMED OUT while starting Playwright web server
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Validation notes:

```txt
v1.24 validation did not fully pass: lint/typecheck/unit tests/audit passed, but build and E2E timed out in that closeout environment. This is historical v1.24 evidence and does not override the current v1.37 status.
The current environment does not match the package.json engine requirement of Node 24.x / npm 11.x.
No production verification or manual browser verification was performed for v1.24.
E2E global setup was not proven PASS in this v1.24 run because npm run test:e2e timed out.
```

Production evidence:

```txt
Production URL: https://skinwise-vn.vercel.app
Production URL public reachability: PASS - direct unauthenticated HTTP 200 on 2026-06-11
Production /api/health: PASS - direct unauthenticated HTTP 200 and expected v1.22 JSON contract on 2026-06-11
Production smoke/monitoring for v1.22.1: PARTIAL / DEFERRED - public URL and /api/health were checked; authenticated MVP flows and production platform signals were not checked
Historical production smoke test: PASS - user-reported manual verification completed on 2026-06-04
Historical production monitoring: PASS - user-reported checks completed on 2026-06-04
Critical blockers found in direct v1.22.1 public checks: None
```

## 5. Safety Boundary

The implemented MVP remains within these boundaries:

- No clinical assessment.
- No treatment/cure guarantee.
- No prescription guidance.
- No dermatologist replacement.
- No skin/face/appearance score.
- No image upload or face analysis.
- No marketplace/payment/checkout.
- No required real external AI provider for demo.

## 6. Current Recommended Next Work

Do **not** add large features immediately. The post-MVP backlog is now the control point for future work.

Current backlog file:

```txt
docs/post-mvp-backlog.md
```

Completed post-MVP implementation:

```txt
v1.14 - Data Quality Expansion
v1.15 - Product Match Explainability & Safety Guardrails
v1.15.1 - Audit Cleanup & Evidence Sync
v1.16 - Saved Product Comparison & Decision Support
v1.17 - Routine History & Weekly Progress Review
v1.18 - Skin Journal Filters & Reflection Review
v1.19 - Account Data Summary & Privacy Control Review
v1.20 - Personal Insight Review & Safe Trend Cards
v1.21 - Insight Explainability & Tracking Quality Checklist
v1.22 - Production Observability & Release Confidence
v1.22.1 - Production Deployment & Smoke Verification: PARTIAL / DEFERRED
v1.23 - Account Data Deletion Workflow Hardening
v1.24 - Seed Data Quality Expansion Round 2: NOT DONE / VALIDATION BLOCKED
v1.25 - First-Session Guided Experience Polish
v1.25.1 - Seed Baseline Regression & Documentation Consistency Hotfix
v1.26 - Product Match Explanation Clarity & Safe Decision Support Polish
v1.27 - Product Detail to Saved Products Decision Support Polish
v1.28 - Saved Products to Routine Decision Support Polish
v1.29 - Routine to Routine Log / Journal Decision Support Polish
v1.30 - Insights Interpretation & Dashboard Next Action Polish
v1.31 - Core Flow Recovery, Empty State & Navigation Consistency Polish
v1.32 - Core Form Submission & Action Feedback Consistency Polish
v1.33 - Core Accessibility, Focus Management & Keyboard Interaction Polish
v1.34 - Product & Ingredient Discovery Confidence Polish
v1.35 - E2E Failure Triage & Extended Validation Cleanup
v1.37 - Product ↔ Ingredient Learning Path Polish
```

Completed v1.14 scope:

- Product seed data expanded from 38 to 58 curated records.
- Ingredient seed data expanded from 40 to 59 curated records.
- Product Match coverage improved across common skin types and concerns.
- Seed assertions now enforce v1.14 minimum counts, uniqueness, coverage, and strong-active cautions.
- No schema, feature, route, auth, scoring, or AI-provider changes.

Completed v1.15 scope:

- Product Match explanations now name matched skin type and selected concern signals more clearly.
- Product Match caution notes now cover exfoliating acids, retinoid/BPO-style strong actives, fragrance/essential oils, sensitive-skin caution, and dry/barrier-prone caution signals.
- Product Detail decision support now uses clearer good-fit, caution, routine-usage, and uncertainty wording.
- No-profile and unknown-profile states now guide users to complete or update their skin profile.
- No schema, route, auth, persistence, or AI-provider changes.

Completed v1.15.1 scope:

- Verified Node.js 24.x / npm 11.x runtime baseline.
- Verified `npm audit --omit=dev --audit-level=moderate` returns 0 production vulnerabilities.
- Confirmed the `shadcn -> @modelcontextprotocol/sdk -> @hono/node-server -> hono` dependency path exists.
- Kept `shadcn` in dependencies because app CSS imports `shadcn/tailwind.css`.
- Synchronized audit and release evidence documentation without product behavior or package changes.

Completed v1.16 scope:

- Added saved product comparison selection to the Saved Products page.
- Added side-by-side comparison for 2-3 saved products using existing product fields.
- Preserved save, unsave, and product detail behavior.
- Avoided ranking, product conclusions, new API routes, schema changes, marketplace, cart, checkout, payment, review, rating, social, or AI-driven advice.

Completed v1.17 scope:

- Added a weekly routine review card to `/routine-logs/today`.
- Added a 7-day local-date summary using existing routine log data.
- Added logged-day count, routine-log completion percentage, and completed/partial/skipped/not-logged day states.
- Added safe habit-tracking copy and empty state.
- Added bounded date-range support to `GET /api/routine-logs` while preserving the existing `?localDate=` mode.
- Preserved routine builder, routine analysis, today routine checklist, and routine-log delete behavior.
- Avoided new collections, schema redesign, full analytics dashboard, scoring, clinical conclusions, treatment guidance, marketplace, cart, checkout, payment, review, rating, social, notification, image, or real AI provider scope.

Completed v1.18 scope:

- Added a journal filter panel to `/journal`.
- Filtered currently loaded journal entries by symptom, stress level, product usage, and recent local-date range.
- Added loaded-entry result count, clear-filter action, and filter-specific empty state.
- Preserved existing create, edit, delete, loading, error, and authenticated behavior.
- Kept copy focused on self-tracked reflection without product causality conclusions, clinical assessment, scoring, treatment guidance, image analysis, or AI-driven advice.

Completed v1.19 scope:

- Added a count-only account app-data summary to `/settings`.
- Counted user-owned skin profiles, saved products, routines, routine logs, routine analyses, and skin journals.
- Explained that shared product and ingredient catalogue data is preserved.
- Kept the summary endpoint separate from the raw export payload.
- Preserved existing export, app-data deletion, and account deletion request behavior.
- Avoided displaying secret values, token values, session values, provider account identifiers, database identifiers, or raw export snapshots.

Completed v1.20 scope:

- Added authenticated `GET /api/insights/summary`.
- Added strict count-only `InsightSummaryDto` data for routine consistency, symptom frequency, stress reflection, and product mention patterns.
- Added Personal Insight Review on `/insights` without replacing existing Insights overview, calendar, trend, product usage, or next-action cards.
- Added recursive API contract coverage for forbidden fields including `_id`, `id`, `userId`, `routineId`, `journalId`, `productId`, session, token, and provider account fields.
- Added safe loading, error, insufficient-data, and missing-data states.
- Avoided diagnosis, treatment advice, causation claims, product effectiveness claims, product harm claims, stress causation claims, routine causation claims, skin scoring, schema changes, and AI provider changes.

Completed v1.21 scope:

- Extended `GET /api/insights/summary` with `calculationMeta` for each Personal Insight Review card.
- Added `trackingQualityChecklist` for routine logs, journal entries, symptom notes, stress notes, and product mentions.
- Added `/insights` UI explanations for period reviewed, data used, calculation method, and safety text.
- Added safe checklist statuses: available, limited, not_enough_data, and not_configured.
- Added recursive API contract checks for forbidden identifiers, raw documents, auth/session/token fields, and score-like fields.
- Preserved existing v1.20 summary fields and existing `/api/insights` behavior.
- Avoided diagnosis, treatment advice, causation claims, product effectiveness claims, product harm claims, stress causation claims, routine causation claims, skin scores, risk scores, health grades, medical status fields, schema changes, and AI provider changes.

Completed v1.22 scope:

- Added public `GET /api/health`.
- Returned a stable health response with `status`, `app`, `version`, `timestamp`, and `checks.app`.
- Kept the health endpoint dependency-light: no auth, database, AI provider, OAuth, environment config, external service, or current-user lookup.
- Added direct route-module health API contract coverage for method export, unsupported methods, response shape, ISO timestamp, and sensitive-string absence.
- Added `docs/release-evidence-v1.22.md`.
- Added `docs/production-incident-note-template.md`.
- Updated monitoring, release checklist, source-of-truth, backlog, implementation status, feature matrix, current sprint plan, and README status references.
- Avoided new product features, package changes, schema changes, vendor integrations, admin scope, AI-provider changes, image upload, skin scoring, diagnosis logic, and treatment advice.

Completed v1.23 scope:

- Reviewed the existing Settings delete app data UI, `DELETE /api/account/app-data`, deletion use case, repository filters, and related tests.
- Hardened destructive confirmation copy to explain irreversibility and the non-deletion boundary for Google/OAuth, shared catalogue data, and other users' data.
- Confirmed the API requires authentication and uses only the server-resolved current user id.
- Confirmed repository deletion filters target current-user app data only.
- Added tests for malicious client-provided `userId` values, other-user isolation, sensitive-response boundaries, and the client sending no delete body.
- Added `docs/data-control-and-deletion.md` and `docs/release-evidence-v1.23.md`.
- Kept v1.22.1 production smoke verification partial/deferred; manual browser deletion smoke and production deletion verification were not performed.
- Avoided schema changes, shared catalogue deletion, OAuth/Google account deletion, new collections, new dependencies, admin scope, AI-provider changes, image upload, skin scoring, diagnosis logic, and treatment advice.

Recommended next task:

```txt
Manual Browser & Production Smoke Verification
```

Portfolio evidence tasks:

- Portfolio Evidence Package documentation: PREPARED.
- Portfolio screenshots: intentionally skipped; optional and not verified in repository.
- Demo video: intentionally skipped; optional and not recorded in repository.
- CV/portfolio publishing polish: drafted in `docs/portfolio-evidence-package.md`.

Optional later product scope:

- Admin product/ingredient management.
- More complete account deletion workflow.
- Better production observability.
- Optional real provider integration with strict safety controls.
- More curated product/ingredient data coverage.


## v1.24 Closeout Attempt - Seed Data Quality Expansion Round 2

Status: NOT DONE / VALIDATION BLOCKED.

Completed / attempted v1.24 scope:

- Confirmed current seed data contains 70 products and 70 ingredients.
- Confirmed seed validation constants use v1.24 70/70 naming and minimum values.
- Confirmed `tests/unit/seed-data-quality.test.ts` enforces v1.24 minimum count, uniqueness, coverage, Product Match demos, Routine Safety demos, and non-medical claims boundaries.
- Updated `docs/14-seed-data-spec.md` from historical v1.14 baseline to current v1.24 baseline.
- Created `docs/release-evidence-v1.24.md`.
- Updated status/release/checklist docs without marking v1.24 DONE.
- Stabilized `tests/unit/ui-foundation.test.ts` timeout for the slow dynamic import check in the current environment.

Validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 997 tests after timeout stabilization
npm run build: FAIL / TIMED OUT
npm run test:e2e: FAIL / TIMED OUT
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Do not mark v1.24 DONE until required build and E2E validation pass. Keep v1.22.1 production smoke verification as PARTIAL / DEFERRED.

## v1.25 - First-Session Guided Experience Polish

Status: DONE within scoped local validation.

Completed v1.25 scope:

- Improved dashboard first-session guidance without adding new product features.
- Kept the onboarding journey to exactly five steps: skin profile, saved product, first routine, today's routine log, and first journal entry.
- Extended onboarding step data with clearer reason, outcome, CTA label, route, and completion state.
- Added the visible "Bước nên làm tiếp theo" block based on the first incomplete onboarding step.
- Kept onboarding step data sourced from `buildOnboardingSteps()` and avoided a second hard-coded onboarding list.
- Preserved v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.25.

## v1.25.1 - Seed Baseline Regression & Documentation Consistency Hotfix

Status: DONE within scoped local validation.

Completed v1.25.1 scope:

- Confirmed the repository had regressed to v1.14 seed constants and v1.14 seed-quality test naming while docs referenced the v1.24 70/70 baseline.
- Restored `scripts/seed.ts` to v1.24 seed validation constants and 70 products / 70 ingredients.
- Restored `tests/unit/seed-data-quality.test.ts` to v1.24 70/70 baseline expectations and quality checks.
- Restored `docs/release-evidence-v1.24.md`, which was referenced by docs but missing from the repository.
- Preserved v1.25 dashboard/onboarding UX polish, including the "Bước nên làm tiếp theo" next-step block.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.25.1. v1.24 build/E2E blockers remain deferred.

## v1.26 - Product Match Explanation Clarity & Safe Decision Support Polish

Status: DONE within scoped local validation.

Completed v1.26 scope:

- Polished the existing Product Match explanation UI created in earlier explainability work; no duplicate explanation system was added.
- Clarified product-fit score wording as `Mức độ phù hợp` instead of skin-score-like wording.
- Clarified Product Match result-card explanation labels, safe caution label, matched-signal badges, no-profile guidance, and next-action copy.
- Replaced Product Match-only visible `Treatment` copy with safer `Sản phẩm hoạt chất` wording.
- Preserved Product Match scoring/ranking, API contracts, seed data, schema, auth behavior, Routine Safety logic, v1.25 onboarding guidance, and v1.25.1 seed baseline consistency.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.26. v1.24 build/E2E blockers remain deferred.

## v1.27 - Product Detail to Saved Products Decision Support Polish

Status: DONE within scoped local validation.

Completed v1.27 scope:

- Polished Product Detail summary, consideration, caution, and next-step labels.
- Added Product Detail save-decision helper copy explaining what saving a product means and where to review saved products.
- Improved Saved Products empty-state guidance toward Product Match.
- Aligned Saved Products card and comparison labels with safer Vietnamese product-category copy.
- Preserved Product Match scoring/ranking, Routine logic, API contracts, seed data, schema, auth behavior, AI provider behavior, v1.25 onboarding guidance, v1.25.1 seed baseline consistency, and v1.26 Product Match polish.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1001 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.27. v1.24 build/E2E blockers remain deferred.

## v1.28 - Saved Products to Routine Decision Support Polish

Status: DONE within scoped local validation.

Completed v1.28 scope:

- Added Saved Products guidance that explains saved products are for review before routine building.
- Added a Routine CTA on Saved Products using the existing route constant.
- Added concise saved-product card reference copy before adding products to routine.
- Clarified Routine empty-state guidance with a link back to Saved Products.
- Added Routine form guidance that saved products are reference inputs and should be added gradually.
- Reused existing saved-product/product/routine data and avoided a duplicate explainability or safety system.
- Preserved Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, API contracts, seed data, schema, auth behavior, AI provider behavior, v1.25 onboarding guidance, v1.25.1 seed baseline consistency, v1.26 Product Match polish, and v1.27 Product Detail to Saved Products polish.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1003 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.28. v1.24 build/E2E blockers remain deferred.

## v1.29 - Routine to Routine Log / Journal Decision Support Polish

Status: DONE within scoped local validation.

Completed v1.29 scope:

- Improved Routine page and Routine list copy so users understand the next action after creating or reviewing a routine is to record today's routine and use Journal for notable skin-feel notes.
- Clarified Today Routine Log page guidance and RoutineLog controls around completed/partial/skipped status, consistency tracking, and Journal handoff.
- Added after-log next actions to Journal and Insights using existing route constants.
- Improved Journal page, Journal form guidance, empty state, and after-save next actions so users can move back to Routine or forward to Insights using existing supported routes.
- Polished directly relevant Insights limitation copy to emphasize personal tracking, short-term data limits, and professional-advice boundaries.
- Reused existing Routine, RoutineLog, Journal, and Insights components/data; no duplicate explanation, safety, logging, or insight system was added.
- Preserved Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Journal logic, Insights logic, API contracts, seed data, schema, auth behavior, AI provider behavior, v1.25 onboarding guidance, v1.25.1 seed baseline consistency, v1.26 Product Match polish, v1.27 Product Detail to Saved Products polish, and v1.28 Saved Products to Routine polish.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1006 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.29. v1.24 build/E2E blockers remain deferred.

## v1.30 - Insights Interpretation & Dashboard Next Action Polish

Status: DONE within scoped local validation.

Completed v1.30 scope:

- Improved Insights interpretation copy so users understand insights are based on personal tracking data, not medical conclusions.
- Improved insufficient-data guidance with supported Today Log, Journal, and Routine actions.
- Clarified Dashboard next-action reason copy while preserving onboarding de-duplication and the five-step first-session journey.
- Reused existing Dashboard and Insights components/helpers; no duplicate insight or dashboard guidance system was added.
- Preserved Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Routine Log logic, Journal logic, Insights calculations, Dashboard state model, API contracts, seed data, schema, auth behavior, AI provider behavior, and v1.25 through v1.29 polish work.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1006 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.30. v1.24 build/E2E blockers remain deferred.

## v1.31 - Core Flow Recovery, Empty State & Navigation Consistency Polish

Status: DONE within scoped local validation.

Completed v1.31 scope:

- Improved selected core-flow recoverable error states with retry plus safe fallback navigation using existing route constants.
- Added clearer fallback actions for Product Match no-result/error recovery, Product Detail missing-product states, Saved Products load failure, Routine load failure, Today Routine Log load failure, Insights load failure, and Dashboard load failure.
- Added a real retry trigger to Today Routine Log using the existing reload-key pattern already used by nearby client components.
- Reused existing `EmptyState`, `ErrorState`, `LoadingState`, button, link, and route-constant patterns; no duplicate global empty/error/retry system was added.
- Preserved successful Product Match, Product Detail, Saved Products, Routine, Routine Log, Journal, Insights, and Dashboard behavior.
- Preserved Product Match scoring/ranking, API contracts, seed data, schema, auth behavior, AI provider behavior, v1.25 onboarding guidance, v1.25.1 seed baseline consistency, and v1.26 through v1.30 polish work.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1006 tests
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.31. v1.24 build/E2E blockers remain deferred.

## v1.32 - Core Form Submission & Action Feedback Consistency Polish

Status: DONE within scoped local validation.

Completed v1.32 scope:

- Improved selected high-value form and mutation interactions: Saved Product save/unsave, Product Detail save controls, Routine save, Routine Log status actions, and Journal save.
- Added clearer pending labels, disabled states, action-specific busy states, and duplicate-submission prevention using existing local React state and component patterns.
- Kept success feedback tied to confirmed request completion and added supported next actions where useful.
- Improved safe Vietnamese failure feedback and preserved user-entered form data or last confirmed UI state on recoverable failures where supported by the existing architecture.
- Reused existing `Button`, `Alert`, client API helpers, route constants, and local component state; no new form, toast, mutation, or state-management framework was added.
- Preserved business rules, schema, seed data, auth behavior, AI provider behavior, broad API contracts, and v1.25 through v1.31 polish work.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1011 tests
git diff --check: PASS
```

Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.32. v1.24 build/E2E blockers remain deferred.

## v1.33 - Core Accessibility, Focus Management & Keyboard Interaction Polish

Status: DONE within scoped local validation.

Completed v1.33 scope:

- Improved selected high-value accessibility interactions: Saved Product save/unsave, Product Card/Product Match/Saved Product repeated actions, Product Detail save controls, Routine save validation recovery, Routine Log status actions, and Journal save validation recovery.
- Added contextual accessible names for repeated product detail, comparison, and save/unsave actions without exposing internal IDs.
- Added Routine Log action-group labels, current status description, partial-panel expanded semantics, and checkbox grouping while preserving v1.32 overlap prevention.
- Added local invalid-submit focus recovery for Routine and Journal forms, and focused existing error regions after recoverable save failures.
- Associated selected Journal helper/error text with controls and changed selected success messages to polite status semantics where useful.
- Reused existing `Button`, `Label`, `Alert`, local React state, client API helpers, route constants, and native HTML controls.
- Did not add an accessibility framework, component-library replacement, keyboard shortcut system, global focus-management framework, full accessibility audit, WCAG compliance claim, or screen-reader certification claim.
- Preserved business rules, schema, seed data, auth behavior, AI provider behavior, broad API contracts, and v1.25 through v1.32 polish work.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Scoped validation result:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1016 tests
git diff --check: PASS
```

Build, E2E, browser keyboard verification, screen-reader verification, manual accessibility verification, production verification, screenshots, and demo video were not run or created for v1.33. This is not a full WCAG compliance or certification claim. v1.24 build/E2E blockers remain deferred.

## v1.34 - Product & Ingredient Discovery Confidence Polish

Status: DONE within scoped local validation.

Completed v1.34 scope:

- Added Product Catalogue result counts with polite status semantics.
- Added Product Catalogue active filter summaries for search, category, price range, skin type, and concern using existing label maps.
- Improved Product Catalogue no-result recovery copy while preserving the existing clear-filter action.
- Added ingredient client support for the existing ingredient `function` query parameter.
- Refactored Ingredient Library from query-only state to draft/active filter object state.
- Added Ingredient Library function filtering UI, result counts, active filter summaries, no-filter discovery guidance, and clearer no-result recovery copy.
- Updated Ingredient Library reset behavior to clear both search and function filters.
- Updated Ingredient Card detail actions with contextual labels using `ingredient.inciName`.
- Preserved Product API behavior, Product Match scoring/ranking, Routine Safety logic, seed data, database schema, auth behavior, AI provider behavior, product/ingredient CRUD boundaries, and broad API contracts.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Validation result:

```txt
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1020 tests
git diff --check: PASS
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm run test:e2e: FAIL after elevated rerun - 25 passed / 6 failed; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

E2E failed in existing dashboard, insights, saved-products, and today routine log flows. The ingredient authenticated E2E flow passed. Manual browser verification, screen-reader verification, production/authenticated smoke, screenshots, and demo video were not run or created for v1.34. v1.24 build/E2E blockers remain deferred.

## v1.35 - E2E Failure Triage & Extended Validation Cleanup

Status: DONE.

Completed v1.35 scope:

- Reproduced the six remaining E2E failures from v1.34 extended validation before editing.
- Classified all reproduced failures as selector/copy/test expectation drift, not app-code regressions.
- Updated the Dashboard E2E assertion to match the current onboarding-progress card shown in that authenticated core-journey state.
- Updated Insights E2E assertions to use current Vietnamese section labels, exact card-title matching, and current safe professional-guidance copy.
- Updated Saved Products E2E assertions to use exact heading matching and avoid a strict-mode duplicate heading match.
- Updated Today Routine Log E2E assertion to expect the current safer professional-guidance wording.
- Left v1.34 discovery implementation files unchanged because no product or ingredient E2E regression was reproduced.
- Preserved app product behavior, Product Match scoring/ranking, Routine Safety logic, seed data, database schema, auth behavior, AI provider behavior, product/ingredient CRUD boundaries, and broad API contracts.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Validation result:

```txt
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1020 tests
git diff --check: PASS
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm run test:e2e: PASS - 31 passed; sandboxed attempt failed with spawn EPERM
```

Manual browser verification, screen-reader verification, production/authenticated smoke, screenshots, and demo video were not run or created for v1.35. v1.24 build/E2E blockers remain deferred.

## v1.37 - Product ↔ Ingredient Learning Path Polish

Status: DONE.

Completed v1.37 scope:

- Added Product Detail links to Ingredient Library searches using existing ingredient highlights, `routes.INGREDIENTS`, and URL-encoded query values.
- Added Ingredient Detail links to Product Catalogue searches using the ingredient INCI/display name, `routes.PRODUCTS`, and URL-encoded query values.
- Added `initialQuery` support to Product Catalogue and Ingredient Library so `/products?q=...` and `/ingredients?q=...` initialize draft and active search filters.
- Added lightweight Product Catalogue → Ingredient Library and Ingredient Library → Product Catalogue cross-links.
- Kept visible copy educational and non-medical.
- Added no recommendation engine, related-products ranking, Product Match scoring/ranking change, Routine Safety change, schema change, seed baseline change, auth change, AI-provider change, CRUD scope change, or broad API contract change.
- Kept the production `/api/health` response on the v1.22 health endpoint contract version.
- Kept v1.24 as NOT DONE / VALIDATION BLOCKED.

Validation result:

```txt
node -v: v24.14.0
npm -v: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 1021 tests
git diff --check: PASS
npm run build: PASS after elevated rerun; sandboxed attempt failed with spawn EPERM
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
npm run test:e2e: PASS - 31 passed; sandboxed attempt failed with spawn EPERM
```

Manual browser verification, screen-reader verification, production/authenticated smoke, screenshots, and demo video were not run or created for v1.37. v1.24 build/E2E blockers remain deferred.
