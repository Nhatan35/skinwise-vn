# Feature Status Matrix - SkinWise VN MVP

Last updated: 2026-06-11

## Current Status

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
Latest completed milestone: MVP v1.22 - Production Observability & Release Confidence
Current active milestone: MVP v1.22.1 - Production Deployment & Smoke Verification
Product core: COMPLETE
Local validation: PASS
Production URL public reachability: PASS
Production health endpoint: PASS
Full production smoke/monitoring for v1.22.1: NOT CHECKED
Historical production smoke/monitoring: PASS, user-reported
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Current phase: Post-MVP controlled improvement
Recommended next task: Complete manual authenticated production smoke and production signal checks
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video intentionally skipped for v1.22
```

## Feature Matrix

| Feature / Area | Status | Notes |
|---|---|---|
| Landing page | DONE | Public app entry. |
| Google OAuth / Auth.js | DONE | Protected app routes. |
| Dashboard | DONE | User-owned summary. |
| Skin Profile onboarding | DONE | Create/update/view profile. |
| Skin Profile management | DONE | View/edit/delete supported. |
| Product Catalogue | DONE | Seeded demo products. |
| Product Detail | DONE | Product detail, personalized match section, and v1.15 decision-support safety wording. |
| Product Match | DONE | Rule-based educational matching with v1.15 explainability and caution guardrails. |
| Product and ingredient seed data | DONE | v1.14 expanded coverage to 58 products and 59 ingredients. |
| Saved Products | DONE | Save/unsave flow. |
| Saved Product Comparison | DONE | Post-MVP v1.16 comparison panel for 2-3 saved products using existing educational product fields only. |
| Ingredient Library | DONE | Ingredient list/detail. |
| Ingredient Explanation | DONE | Provider/fallback-safe explanation flow. |
| Routine Builder | DONE | Morning/evening routine support. |
| Routine Safety Analysis | DONE | Deterministic rules and safe fallback. |
| Today Routine Checklist | DONE | Daily completion flow. |
| Routine Logs | DONE | Tracking history with v1.17 weekly habit review. |
| Skin Journal | DONE | Create/edit/delete journal entries; v1.18 added loaded-entry filters and reflection review. |
| Insights | DONE | Progress story, safe next actions, v1.20 Personal Insight Review, and v1.21 calculation explanations plus tracking quality checklist. |
| Settings / Data Control | DONE | Export, app data deletion, account deletion request marker; v1.19 account data summary is complete. |
| Data Export | DONE | User-owned app data export. |
| Production observability / health check | DONE | v1.22 added safe public `GET /api/health`, health API contract test, release evidence, incident note template, and monitoring/checklist updates. |
| Production deployment smoke verification | Partially completed | v1.22.1 direct public URL and `/api/health` checks passed; authenticated MVP flows and production signals remain NOT CHECKED. |
| Local validation evidence | PASS | v1.22.1 validation rerun passed with 103 files / 991 unit tests, 31/31 E2E tests, build, and production audit PASS. |
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
Latest completed milestone: MVP v1.22 - Production Observability & Release Confidence
Current active milestone: MVP v1.22.1 - Production Deployment & Smoke Verification
Production status: v1.22 production smoke verification NOT CHECKED - partial public checks only
Portfolio Evidence Package documentation: PREPARED
Portfolio media evidence tasks are optional, intentionally skipped for v1.22, and not product correctness blockers
```
