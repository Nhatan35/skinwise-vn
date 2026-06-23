# UI Route Map - SkinWise VN

Last updated: 2026-06-22

Current status:

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
Latest completed local validation: MVP v1.62 local validation PASS
Latest completed scoped task: MVP v1.62 - Admin Content Dashboard Lite
Current phase: Post-MVP controlled product improvement
Current active milestone: MVP v1.48 deployed smoke remains open
Production URL: https://skinwise-vn.vercel.app
MVP v1.48 deployed admin product review smoke: NOT RUN / INCOMPLETE
Production-ready claimed: No
Admin product review browser smoke for v1.47: DONE / PASS locally with repeatable E2E admin/non-admin auth, an idempotent `unverified` smoke product, update/revert coverage, public visibility regression, and console/network/security checks
```

## Implemented UI Routes

| Route | Status | Purpose |
|---|---|---|
| `/` | DONE | Landing page. |
| `/admin` | DONE / PASS | Protected Admin Content Dashboard Lite for product and ingredient catalogue maintenance summaries and navigation. |
| `/admin/products` | DONE / PASS | Protected direct admin product review page for all-status product catalogue review and verificationStatus updates. |
| `/admin/ingredients` | DONE / PASS | Protected direct admin ingredient management page for Ingredient Library list/search/create/edit lite. |
| `/dashboard` | DONE | Authenticated dashboard summary. |
| `/onboarding/skin-profile` | DONE | Skin profile onboarding. |
| `/skin-profile` | DONE | Skin profile view/edit/delete. |
| `/products` | DONE | Product catalogue. |
| `/products/[id]` | DONE | Product detail and personalized match explanation. |
| `/product-match` | DONE | Rule-based product match results. |
| `/saved-products` | DONE | Saved products list with private notes, decision metadata, personal tags, comparison, client-side review filters, and review reason indicators. |
| `/ingredients` | DONE | Ingredient library. |
| `/ingredients/[id]` | DONE | Ingredient detail and explanation. |
| `/routines` | DONE | Routine builder. |
| `/routine-logs/today` | DONE | Today routine checklist. |
| `/journal` | DONE | Skin journal. |
| `/insights` | DONE | Progress insights. |
| `/settings` | DONE | Settings/Data Control. |

## Demo Route Order

```txt
/ -> /dashboard -> /skin-profile -> /product-match -> /products/[id] -> /saved-products -> /ingredients -> /routines -> /routine-logs/today -> /journal -> /insights -> /settings
```

Admin demo route, direct URL only:

```txt
/admin
/admin/products
/admin/ingredients
```

## Final Route Decision

```txt
All MVP UI routes required for portfolio/demo are implemented.
Admin content dashboard, product review, and ingredient management UIs are implemented as direct protected routes, not global navigation items.
Recommended next task: Complete MVP v1.48 deployed smoke evidence before any production-ready claim.
```
