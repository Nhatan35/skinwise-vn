# UI Route Map - SkinWise VN

Last updated: 2026-06-16

Current status:

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
Latest completed milestone: MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix
Current phase: Post-MVP controlled product improvement
Production URL: https://skinwise-vn.vercel.app
Production smoke for v1.47: NOT RUN; historical production PASS remains user-reported
Admin product review browser smoke for v1.47: DONE / PASS locally with repeatable E2E admin/non-admin auth, an idempotent `unverified` smoke product, update/revert coverage, public visibility regression, and console/network/security checks
```

## Implemented UI Routes

| Route | Status | Purpose |
|---|---|---|
| `/` | DONE | Landing page. |
| `/admin/products` | DONE / PASS | Protected direct admin product review page for all-status product catalogue review and verificationStatus updates. |
| `/dashboard` | DONE | Authenticated dashboard summary. |
| `/onboarding/skin-profile` | DONE | Skin profile onboarding. |
| `/skin-profile` | DONE | Skin profile view/edit/delete. |
| `/products` | DONE | Product catalogue. |
| `/products/[id]` | DONE | Product detail and personalized match explanation. |
| `/product-match` | DONE | Rule-based product match results. |
| `/saved-products` | DONE | Saved products list. |
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
/admin/products
```

## Final Route Decision

```txt
All MVP UI routes required for portfolio/demo are implemented.
Admin product review UI is implemented as a direct protected route, not a global navigation item.
Recommended next task: MVP v1.48 - Deployed Admin Product Review Smoke Verification.
```
