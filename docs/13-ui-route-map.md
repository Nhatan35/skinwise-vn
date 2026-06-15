# UI Route Map - SkinWise VN

Last updated: 2026-06-15

Current status:

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
Latest completed milestone: MVP v1.43 - Release Evidence & Validation Cleanup
Current phase: Post-MVP validation cleanup
Production URL: https://skinwise-vn.vercel.app
Production smoke for v1.43: NOT RUN; historical production PASS remains user-reported
```

## Implemented UI Routes

| Route | Status | Purpose |
|---|---|---|
| `/` | DONE | Landing page. |
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

## Final Route Decision

```txt
All MVP UI routes required for portfolio/demo are implemented.
Recommended next task: MVP v1.44 - Production Smoke Test & Deployment Evidence.
```
