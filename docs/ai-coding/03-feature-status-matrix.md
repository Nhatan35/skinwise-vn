# Feature Status Matrix - SkinWise VN MVP

Last updated: 2026-06-12

## Current Status

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
Latest completed scoped task: MVP v1.32 - Core Form Submission & Action Feedback Consistency Polish
Current active milestone: None
Product core: COMPLETE
Local validation: PASS for v1.32 scoped lint/typecheck/unit tests and diff check; v1.24 closeout remains validation-blocked
Production URL public reachability: PASS
Production health endpoint: PASS
Full production smoke/monitoring for v1.22.1: PARTIAL / DEFERRED
Historical production smoke/monitoring: PASS, user-reported
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Current phase: Post-MVP controlled improvement
Recommended next task: TBD / Backlog grooming
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
| Product Catalogue | DONE | Seeded demo products. |
| Product Detail | DONE | Product detail, personalized match section, v1.15 decision-support safety wording, v1.27 save-decision polish, and v1.31 missing-resource fallback navigation. |
| Product Match | DONE | Rule-based educational matching with v1.15 explainability/caution guardrails, v1.26 clarity polish for product-fit labels, safety notes, no-profile guidance, and v1.31 no-result/error recovery actions. |
| Product and ingredient seed data | IN PROGRESS / VALIDATION BLOCKED | v1.24 implementation contains 70 products and 70 ingredients with v1.24 seed quality tests, but the milestone is not DONE until build/E2E validation passes. |
| Saved Products | DONE | Save/unsave flow with v1.27 save-context and empty-state clarity polish, v1.28 routine decision-support guidance, and v1.31 load-error fallback navigation. |
| Saved Product Comparison | DONE | Post-MVP v1.16 comparison panel for 2-3 saved products using existing educational product fields only. |
| Ingredient Library | DONE | Ingredient list/detail. |
| Ingredient Explanation | DONE | Provider/fallback-safe explanation flow. |
| Routine Builder | DONE | Morning/evening routine support with v1.28 saved-product-to-routine guidance and v1.29 Routine to Log/Journal next-action clarity. |
| Routine Safety Analysis | DONE | Deterministic rules and safe fallback. |
| Today Routine Checklist | DONE | Daily completion flow with v1.31 load-error retry and Routine fallback navigation. |
| Routine Logs | DONE | Tracking history with v1.17 weekly habit review and v1.29 safer log-to-journal guidance. |
| Skin Journal | DONE | Create/edit/delete journal entries; v1.18 added loaded-entry filters/reflection review and v1.29 routine-reflection empty/after-save guidance. |
| Insights | DONE | Progress story, safe next actions, v1.20 Personal Insight Review, v1.21 calculation explanations plus tracking quality checklist, v1.29 short-term interpretation caution, and v1.30 personal-tracking/insufficient-data guidance. |
| Settings / Data Control | DONE | Export, app data deletion, account deletion request marker; v1.19 account data summary is complete; v1.23 hardened app-data deletion confirmation, ownership tests, and documentation. |
| Data Export | DONE | User-owned app data export. |
| Production observability / health check | DONE | v1.22 added safe public `GET /api/health`, health API contract test, release evidence, incident note template, and monitoring/checklist updates. |
| Production deployment smoke verification | Partially completed | v1.22.1 direct public URL and `/api/health` checks passed; authenticated MVP flows and production signals remain NOT CHECKED. |
| Core Form Submission & Action Feedback Consistency Polish | DONE, scoped validation only | v1.32 improves selected pending, disabled, success, failure, retry, duplicate-submission, and next-action states using existing form, Button, Alert, client API, and route patterns without adding a new framework or changing business rules, schema, seed data, or broad API contracts. |
| Local validation evidence | MIXED BY MILESTONE | v1.32 scoped validation passed with lint, typecheck, unit tests, and diff check. v1.31, v1.30, v1.29, v1.28, v1.27, v1.26, v1.25.1, and v1.25 scoped validation passed previously. v1.24 closeout remains NOT DONE because build and E2E timed out in the current environment. |
| Audit/evidence cleanup | DONE | v1.15.1 reviewed npm audit/dependency-risk evidence and synchronized docs without product behavior changes. |
| Production smoke evidence | Partially completed | Public URL and `/api/health` checked directly on 2026-06-11; authenticated flows not checked. Historical user-reported production verification remains historical only. |
| Production monitoring evidence | Partially completed | Public health endpoint checked directly; browser console/network, Vercel logs, MongoDB Atlas, and OAuth callback behavior remain NOT CHECKED for v1.22.1. |
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
| Production Deployment & Smoke Verification | Release/Ops | v1.22.1 | IN PROGRESS / NOT DONE |
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
Latest completed scoped task: MVP v1.32 - Core Form Submission & Action Feedback Consistency Polish
Current active milestone: None
Production status: v1.22.1 production smoke verification PARTIAL / DEFERRED
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
```
