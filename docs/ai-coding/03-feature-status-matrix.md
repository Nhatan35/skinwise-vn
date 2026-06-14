# Feature Status Matrix - SkinWise VN MVP

Last updated: 2026-06-14

## Current Status

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
Latest completed scoped task: MVP v1.41 - Product Detail Saved Decision Shortcut
Current active milestone: None
Product core: COMPLETE
Local validation: PASS for v1.41 lint/typecheck/unit tests/build/full E2E/diff checks. v1.40, v1.39, v1.38, MVP Product Match Explainability Polish, and v1.37 remain PASS; v1.24 closeout remains validation-blocked
Production URL public reachability: PASS
Production health endpoint: PASS
Full production smoke/monitoring: PASS, user-reported
Manual Browser & Production Smoke Verification: DONE / PASS
Screen-Reader Assistive Technology Verification: DONE / PASS
Keyboard-only verification: PASS
Screen-reader verification: PASS
MVP Empty / Loading / Error State Polish: DONE / PASS
MVP Form Validation & Inline Feedback Polish: DONE / PASS
MVP Product Match Explainability Polish: DONE / PASS
MVP v1.38 - Routine Coverage Review & Safe Next-Step Guidance: DONE / PASS
MVP v1.39 - Saved Product Personal Notes & Trial Decision Support: DONE / PASS
MVP v1.40 - Saved Products Decision Queue & Review Filters: DONE / PASS
MVP v1.41 - Product Detail Saved Decision Shortcut: DONE / PASS
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Current phase: Post-MVP controlled improvement
Recommended next task: None
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video intentionally skipped
```

## Feature Matrix

| Feature / Area | Status | Notes |
|---|---|---|
| Landing page | DONE | Public app entry. |
| Google OAuth / Auth.js | DONE | Protected app routes. |
| Dashboard | DONE | User-owned summary with v1.25 first-session guided next-step polish, v1.30 next-action reason copy, and v1.31 recoverable-error fallback actions. |
| Skin Profile onboarding | DONE | Create/update/view profile. |
| Skin Profile management | DONE | View/edit/delete supported. |
| Product Catalogue | DONE | Seeded demo products with v1.34 result count, active filter summary, clearer no-result recovery copy, and v1.37 cross-link to Ingredient Library. |
| Product Detail | DONE | Product detail, personalized match section, v1.15 decision-support safety wording, v1.27 save-decision polish, v1.31 missing-resource fallback navigation, v1.37 ingredient-learning search links, and v1.41 saved decision metadata shortcut. |
| Product Match | DONE | Rule-based educational matching with v1.15 explainability/caution guardrails, v1.26 clarity polish for product-fit labels, safety notes, no-profile guidance, and v1.31 no-result/error recovery actions. |
| Product and ingredient seed data | IN PROGRESS / VALIDATION BLOCKED | v1.24 implementation contains 70 products and 70 ingredients with v1.24 seed quality tests, but the milestone is not DONE until build/E2E validation passes. |
| Saved Products | DONE | Save/unsave flow with v1.27 save-context and empty-state clarity polish, v1.28 routine decision-support guidance, v1.31 load-error fallback navigation, v1.39 private personal notes/trial decision metadata, v1.40 client-side decision filters/search/summary, and v1.41 Product Detail shortcut reuse. |
| Saved Product Comparison | DONE | Post-MVP v1.16 comparison panel for 2-3 saved products using existing educational product fields only. |
| Saved Product Personal Notes & Trial Decision Support | DONE / PASS | v1.39 adds optional private saved-product decision status, planned routine slot, and personal note metadata with strict owner-scoped PATCH updates and comparison display. |
| Saved Products Decision Queue & Review Filters | DONE / PASS | v1.40 adds client-side filters, search, all-loaded-products summary counts, filtered result count, reset behavior, filtered empty state, and hidden selected-comparison warning without API or data-model changes. |
| Product Detail Saved Decision Shortcut | DONE / PASS | v1.41 adds Product Detail saved-state loading/not-saved/saved handling and compact editing of existing private metadata through the existing v1.39 PATCH client, without API or data-model changes. |
| Ingredient Library | DONE | Ingredient list/detail with v1.34 function filtering, result count, active filter summary, search/function reset, contextual detail action labels, and v1.37 Product Catalogue discovery links by INCI query. |
| Ingredient Explanation | DONE | Provider/fallback-safe explanation flow. |
| Routine Builder | DONE | Morning/evening routine support with v1.28 saved-product-to-routine guidance and v1.29 Routine to Log/Journal next-action clarity. |
| Routine Coverage Review | DONE / PASS | v1.38 adds an educational Routines page structure review using existing routine data only: routine presence, morning/evening coverage, morning sunscreen, moisturizer, multiple treatment steps, and safe next-step guidance. Dashboard update intentionally skipped. |
| Routine Safety Analysis | DONE | Deterministic rules and safe fallback. |
| Today Routine Checklist | DONE | Daily completion flow with v1.31 load-error retry and Routine fallback navigation. |
| Routine Logs | DONE | Tracking history with v1.17 weekly habit review and v1.29 safer log-to-journal guidance. |
| Skin Journal | DONE | Create/edit/delete journal entries; v1.18 added loaded-entry filters/reflection review and v1.29 routine-reflection empty/after-save guidance. |
| Insights | DONE | Progress story, safe next actions, v1.20 Personal Insight Review, v1.21 calculation explanations plus tracking quality checklist, v1.29 short-term interpretation caution, and v1.30 personal-tracking/insufficient-data guidance. |
| Settings / Data Control | DONE | Export, app data deletion, account deletion request marker; v1.19 account data summary is complete; v1.23 hardened app-data deletion confirmation, ownership tests, and documentation. |
| Data Export | DONE | User-owned app data export. |
| Production observability / health check | DONE | v1.22 added safe public `GET /api/health`, health API contract test, release evidence, incident note template, and monitoring/checklist updates. |
| Manual Browser & Production Smoke Verification | DONE | User-reported production checks passed for public/protected routes, Google OAuth, authenticated MVP flows, Product ↔ Ingredient learning links, `/api/health`, browser console/network, Vercel logs, MongoDB read/write behavior, and OAuth callback flow. No critical production blockers observed. |
| Screen-Reader Assistive Technology Verification | DONE | Manual production/browser verification passed for keyboard navigation, focus visibility, accessible names, forms, feedback, headings, landmarks, and core MVP flows. No critical accessibility blockers observed. |
| MVP Empty / Loading / Error State Polish | DONE | Adds route-level loading/error/not-found boundaries, Settings recovery, Today Routine Log weekly-review state polish, Saved Products disabled guidance, and clearer fallback copy without feature expansion. |
| MVP Form Validation & Inline Feedback Polish | DONE | Adds required guidance, Skin Profile invalid-field focus, Routine Builder manual-entry guidance, valid partial-routine disabled states, safe Journal/Settings errors, and accessible status feedback without feature expansion. |
| MVP Product Match Explainability Polish | DONE | Clarifies Product Match score meaning, match/caution reasons, ingredient-highlight labels, Product Detail interpretation, limited-data copy, and Saved Products comparison guidance without scoring, matching, AI, business-logic, schema, dependency, auth, or API-contract changes. |
| Routine Coverage Review & Safe Next-Step Guidance | DONE / PASS | Adds a Routines page habit-support review without changing Routine Safety, Product Match scoring/ranking, AI, auth, schema, env, package dependencies, dashboard, or API contracts. |
| Core Form Submission & Action Feedback Consistency Polish | DONE, scoped validation only | v1.32 improves selected pending, disabled, success, failure, retry, duplicate-submission, and next-action states using existing form, Button, Alert, client API, and route patterns without adding a new framework or changing business rules, schema, seed data, or broad API contracts. |
| Core Accessibility, Focus Management & Keyboard Interaction Polish | DONE, scoped validation only | v1.33 improves selected accessible names, native semantics, invalid-submit focus, validation relationships, keyboard-operable action groups, and status feedback without claiming full WCAG compliance or adding a new accessibility/component framework. |
| Product & Ingredient Discovery Confidence Polish | DONE, scoped validation only | v1.34 improves Product Catalogue and Ingredient Library result counts, active filter summaries, ingredient function filtering through the existing API query, no-result recovery copy, reset behavior, and contextual ingredient detail action labels without changing Product Match scoring/ranking, Routine Safety logic, seed data, schema, auth, AI, CRUD scope, or broad API contracts. |
| E2E Failure Triage & Extended Validation Cleanup | DONE | v1.35 fixes stale E2E selectors/copy expectations in dashboard, insights, saved-products, and today routine log flows. Full local validation passed, including build, audit, and `npm run test:e2e`. |
| Product ↔ Ingredient Learning Path Polish | DONE | v1.37 adds educational Product Detail ingredient-search links, Ingredient Detail product-search links by INCI/display-name query, URL-initialized catalogue searches, and lightweight Product Catalogue / Ingredient Library cross-links without recommendation or ranking behavior. |
| Local validation evidence | MIXED BY MILESTONE | v1.41 passed lint, typecheck, 110 unit-test files / 1129 tests, diff check, package/env no-diff checks, build after elevated rerun, and full E2E with 31 passed. v1.40, v1.39, v1.38, MVP Product Match Explainability Polish, and v1.37 remain PASS. v1.35 remains DONE with full E2E PASS. v1.24 closeout remains NOT DONE because build and E2E timed out in the prior closeout environment. |
| Audit/evidence cleanup | DONE | v1.15.1 reviewed npm audit/dependency-risk evidence and synchronized docs without product behavior changes. |
| Production smoke evidence | DONE | Manual Browser & Production Smoke Verification is DONE / PASS based on user-reported manual production verification. Exact date, tester, deployment id, browser/version, and device/OS were not provided. |
| Production monitoring evidence | DONE | User-reported production signal checks observed no critical console errors, unexpected network 4xx/5xx errors, Vercel critical runtime errors, MongoDB read/write issues, production runtime blockers, or OAuth callback blockers. |
| Portfolio demo docs | DONE | README, portfolio evidence package, case study, demo script, and checklists updated. |
| Portfolio media evidence | Partially completed | Screenshot checklist and demo-video plan are prepared; actual screenshot and video files are not claimed. |

## Post-MVP Feature Milestones

| Feature | Category | Version | Status |
|---|---|---|---|
| Saved Product Comparison | Post-MVP | v1.16 | DONE |
| Routine Weekly Review | Post-MVP | v1.17 | DONE |
| Skin Journal Filters | Post-MVP | v1.18 | DONE |
| Account Data Summary | Privacy/Data Control | v1.19 | DONE |
| Personal Insight Review | Post-MVP Insights | v1.20 | DONE |
| Insight Explainability & Tracking Quality Checklist | Post-MVP Insights | v1.21 | DONE |
| Production Observability & Release Confidence | Release/Ops | v1.22 | DONE |
| Production Deployment & Smoke Verification | Release/Ops | v1.22.1 | DONE / PASS, user-reported manual verification |
| Account Data Deletion Workflow Hardening | Privacy/Data Control | v1.23 | DONE |
| Seed Data Quality Expansion Round 2 | Data Quality | v1.24 | NOT DONE / VALIDATION BLOCKED |
| First-Session Guided Experience Polish | UX Polish | v1.25 | DONE, scoped validation only |
| Seed Baseline Regression & Documentation Consistency Hotfix | Repository Consistency | v1.25.1 | DONE, scoped validation only |
| Product Match Explanation Clarity & Safe Decision Support Polish | UX / Explainability Polish | v1.26 | DONE, scoped validation only |
| Product Detail to Saved Products Decision Support Polish | UX / Decision-Support Polish | v1.27 | DONE, scoped validation only |
| Saved Products to Routine Decision Support Polish | UX / Decision-Support Polish | v1.28 | DONE, scoped validation only |
| Routine to Routine Log / Journal Decision Support Polish | UX / Decision-Support Polish | v1.29 | DONE, scoped validation only |
| Insights Interpretation & Dashboard Next Action Polish | UX / Decision-Support Polish | v1.30 | DONE, scoped validation only |
| Core Flow Recovery, Empty State & Navigation Consistency Polish | UX Resilience / Recovery Polish | v1.31 | DONE, scoped validation only |
| Core Form Submission & Action Feedback Consistency Polish | UX Interaction / Form-State Polish | v1.32 | DONE, scoped validation only |
| Core Accessibility, Focus Management & Keyboard Interaction Polish | Accessibility / Keyboard / Focus Polish | v1.33 | DONE, scoped validation only |
| Product & Ingredient Discovery Confidence Polish | Discovery UX Polish | v1.34 | DONE, scoped validation only |
| E2E Failure Triage & Extended Validation Cleanup | Validation / E2E Cleanup | v1.35 | DONE |
| Product ↔ Ingredient Learning Path Polish | Educational Discovery UX Polish | v1.37 | DONE |
| Routine Coverage Review & Safe Next-Step Guidance | Routine UX / Habit Support | v1.38 | DONE / PASS |
| Saved Product Personal Notes & Trial Decision Support | Saved Products UX / Decision Support | v1.39 | DONE / PASS |
| Saved Products Decision Queue & Review Filters | Saved Products UX / Decision Support | v1.40 | DONE / PASS |
| Product Detail Saved Decision Shortcut | Product Detail / Saved Products Decision Support | v1.41 | DONE / PASS |

## Out-of-Scope Matrix

| Area | Status | Reason |
|---|---|---|
| Clinical assessment | OUT OF SCOPE | Unsafe and outside educational MVP boundary. |
| Prescription/treatment guidance | OUT OF SCOPE | Requires clinical governance. |
| Skin/face score | OUT OF SCOPE | Avoids appearance pressure and unsupported scoring. |
| Image upload/skin analysis | OUT OF SCOPE | Requires privacy, safety, and ML governance. |
| Marketplace/cart/checkout/payment | OUT OF SCOPE | Commercial scope not required for MVP. |
| Admin CRUD | POST-MVP | Useful later, not needed for demo-ready MVP. |
| Real external AI provider | POST-MVP | Optional only with strict validation and safety controls. |
| Reviews/ratings | POST-MVP | Not needed for core tracking/education journey. |
| Notifications | POST-MVP | Optional engagement feature. |

## Final Feature Decision

```txt
Core MVP features: COMPLETE
Latest completed scoped task: MVP v1.41 - Product Detail Saved Decision Shortcut
Current active milestone: None
Production status: Manual Browser & Production Smoke Verification DONE / PASS
Accessibility status: Screen-Reader Assistive Technology Verification DONE / PASS
Portfolio Evidence Package documentation: PREPARED
Portfolio media evidence tasks are optional, intentionally skipped, and not product correctness blockers
v1.24 status: NOT DONE / VALIDATION BLOCKED until build and E2E validation pass
v1.25 status: DONE within scoped local validation - lint, typecheck, and unit tests passed
v1.25.1 status: DONE within scoped local validation - v1.24 seed baseline and release-evidence consistency restored
v1.26 status: DONE within scoped local validation - Product Match explanation clarity and safe decision-support copy polished; lint, typecheck, and unit tests passed
v1.27 status: DONE within scoped local validation - Product Detail to Saved Products decision-support copy polished; lint, typecheck, and unit tests passed
v1.28 status: DONE within scoped local validation - Saved Products to Routine decision-support copy polished; lint, typecheck, and unit tests passed
v1.29 status: DONE within scoped local validation - Routine to Routine Log / Journal decision-support copy polished; lint, typecheck, and unit tests passed
v1.30 status: DONE within scoped local validation - Insights interpretation and Dashboard next-action copy polished; lint, typecheck, and unit tests passed
v1.31 status: DONE within scoped local validation - selected core-flow empty states, recoverable errors, missing-resource fallbacks, retry clarity, and route consistency polished; lint, typecheck, and unit tests passed
v1.32 status: DONE within scoped local validation - selected form submission and action feedback states polished; lint, typecheck, unit tests, and diff check passed
v1.33 status: DONE within scoped local validation - selected accessibility semantics, focus recovery, keyboard action-group, validation relationship, and status feedback states polished; lint, typecheck, unit tests, and diff check passed
v1.34 status: DONE within scoped local validation - Product and Ingredient discovery confidence polish passed lint, typecheck, unit tests, and diff check; build passed after elevated rerun; E2E failed after elevated rerun with 25 passed / 6 failed
v1.35 status: DONE - E2E failure triage fixed dashboard, insights, saved-products, and today routine log Playwright selector/copy drift; lint, typecheck, unit tests, diff check, build, audit, and full E2E passed
v1.37 status: DONE - Product Detail, Product Catalogue, Ingredient Detail, and Ingredient Library learning paths were connected with educational query links; lint, typecheck, unit tests, diff check, build, audit, and full E2E passed
v1.37 exclusions: no recommendation engine, related-products ranking, Product Match scoring/ranking change, Routine Safety change, schema change, seed baseline change, auth change, AI-provider change, CRUD scope change, or broad API contract change
Manual Browser & Production Smoke Verification: DONE / PASS, user-reported manual production verification
Screen-Reader Assistive Technology Verification: DONE / PASS; keyboard-only and screen-reader verification passed with no critical accessibility blockers observed
MVP Empty / Loading / Error State Polish: DONE / PASS
MVP Form Validation & Inline Feedback Polish: DONE / PASS
MVP Product Match Explainability Polish: DONE / PASS
MVP v1.38 - Routine Coverage Review & Safe Next-Step Guidance: DONE / PASS
MVP v1.39 - Saved Product Personal Notes & Trial Decision Support: DONE / PASS
MVP v1.40 - Saved Products Decision Queue & Review Filters: DONE / PASS
Accessibility evidence metadata: date, tester, browser, device/OS, and screen reader used were not provided
Recommended next task: None
Screenshots and demo video were not provided
Production /api/health version: remains the v1.22 health endpoint contract version
```
