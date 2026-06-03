# Feature Status Matrix - SkinWise VN MVP

Last updated: 2026-06-04

## Current Status

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
Product core: COMPLETE
Local validation: PASS
Production smoke/monitoring: PASS, user-reported
Portfolio/demo/interview readiness: READY at MVP level
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
| Product Detail | DONE | Product detail and personalized match section. |
| Product Match | DONE | Rule-based educational matching. |
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
| Local validation evidence | PASS | 96 files / 889 tests, build, E2E, audit PASS. |
| Production smoke evidence | PASS | User-reported production verification completed. |
| Production monitoring evidence | PASS | User-reported checks completed. |
| Portfolio demo docs | DONE | README, case study, demo script, checklists updated. |

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
Do not add new features before portfolio/demo submission
Next work: screenshots, release tag, spoken demo practice, portfolio/CV presentation
```
