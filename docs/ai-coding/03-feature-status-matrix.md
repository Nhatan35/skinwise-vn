# Feature Status Matrix - SkinWise VN MVP

Last updated: 2026-06-07

## Current Status

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
Latest completed milestone: MVP v1.15.1 - Audit Cleanup & Evidence Sync
Product core: COMPLETE
Local validation: PASS
Production smoke/monitoring: PASS, user-reported
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Current phase: Post-MVP controlled improvement
Recommended next task: Portfolio Evidence Package
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video
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
| Ingredient Library | DONE | Ingredient list/detail. |
| Ingredient Explanation | DONE | Provider/fallback-safe explanation flow. |
| Routine Builder | DONE | Morning/evening routine support. |
| Routine Safety Analysis | DONE | Deterministic rules and safe fallback. |
| Today Routine Checklist | DONE | Daily completion flow. |
| Routine Logs | DONE | Tracking history. |
| Skin Journal | DONE | Create/edit/delete journal entries. |
| Insights | DONE | Progress story and safe next actions. |
| Settings / Data Control | DONE | Export, app data deletion, account deletion request marker. |
| Data Export | DONE | User-owned app data export. |
| Local validation evidence | PASS | 97 files / 899 tests, build, E2E, production audit PASS. |
| Audit/evidence cleanup | DONE | v1.15.1 reviewed npm audit/dependency-risk evidence and synchronized docs without product behavior changes. |
| Production smoke evidence | PASS | User-reported production verification completed. |
| Production monitoring evidence | PASS | User-reported checks completed. |
| Portfolio demo docs | DONE | README, portfolio evidence package, case study, demo script, and checklists updated. |
| Portfolio media evidence | Partially completed | Screenshot checklist and demo-video plan are prepared; actual screenshot and video files are not claimed. |

## Out-of-Scope Matrix

| Area | Status | Reason |
|---|---|---|
| Medical diagnosis | OUT OF SCOPE | Unsafe and outside educational MVP boundary. |
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
Latest completed milestone: MVP v1.15.1 - Audit Cleanup & Evidence Sync
Portfolio Evidence Package documentation: PREPARED
Portfolio media evidence tasks are optional and not product correctness blockers
```
