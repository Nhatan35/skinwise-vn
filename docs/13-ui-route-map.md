# UI and API Route Map - MVP v1.2.6

Last updated: 2026-05-27

## Purpose

This document maps the routes that exist in the current source tree. Use `src/app` and `src/app/api` as the source of truth when this document and implementation drift.

Current phase: post Week 6 MVP cleanup, validation, deployment preparation, and portfolio readiness.

Latest completed source task: `MVP-DATA-CONTROL-001 - Settings and Privacy Data Control Center`.

## Route Principles

- Keep pages thin.
- Put reusable UI in module-specific component folders or shared components.
- Keep business logic in use cases and domain modules, not `page.tsx`.
- Protected app routes belong under `src/app/(dashboard)/`.
- Auth.js owns `/api/auth/*`; do not wrap those responses in the SkinWise API envelope.
- Do not mark a route implemented unless the matching source file exists.

## UI Routes

| Route | Purpose | Status | Access | Important dependencies |
|---|---|---|---|---|
| `/` | Public product/project entry page | Implemented | Public | Static app config and route constants |
| `/dashboard` | User dashboard summary for profile, profile completion, saved product count, 7-day routine consistency, journal trend, today logs, latest journal, latest analysis, and next action | Implemented | Authenticated | `GET /api/dashboard?localDate=YYYY-MM-DD` |
| `/onboarding/skin-profile` | First-time skin profile onboarding | Implemented | Authenticated onboarding | `/api/skin-profile` |
| `/skin-profile` | View and edit the user's skin profile | Implemented | Authenticated | `/api/skin-profile` |
| `/routines` | Routine list/create/edit/delete, product picker, routine analysis panel, and routine log controls | Implemented | Authenticated | `/api/routines`, `/api/products`, `/api/routines/[id]/analyze`, `/api/routines/[id]/analyses`, `/api/routine-logs` |
| `/journal` | Private skin journal timeline with create/edit/delete and product selection | Implemented | Authenticated | `/api/skin-journal`, `/api/skin-journal/[id]`, `/api/products?limit=50` |
| `/products` | Product catalogue search/filter/list UI | Implemented | Authenticated | `GET /api/products` |
| `/products/[id]` | Product detail UI for public Product DTO fields | Implemented | Authenticated | `GET /api/products/[id]` |
| `/saved-products` | Current user's saved product list with remove action | Implemented | Authenticated | `GET /api/saved-products`, `DELETE /api/saved-products/[productId]` |
| `/ingredients` | Ingredient library list/search UI | Implemented | Authenticated | `GET /api/ingredients` |
| `/ingredients/[id]` | Ingredient detail UI with explanation panel | Implemented | Authenticated | `GET /api/ingredients/[id]`, `POST /api/ingredients/explain` |
| `/login` | Dedicated login page | Not started | Public if added later | Auth.js default sign-in route currently handles login |
| `/privacy` | Static privacy page | Not started | Public if added later | N/A |
| `/terms` | Static terms/disclaimer page | Not started | Public if added later | N/A |
| `/products/new` | Product submission UI | Not started | Authenticated if added later | `POST /api/products` is not implemented |
| `/routines/[id]` | Dedicated routine detail page | Not started | Authenticated if added later | Existing `/routines` page owns routine UI |
| `/routines/[id]/analysis` | Dedicated routine analysis page | Not started | Authenticated if added later | Existing `/routines` page owns analysis UI |
| `/routine-logs/today` | Dedicated daily routine checklist page for today's routine logs | Implemented | Authenticated | `GET /api/routines`, `GET /api/routine-logs?localDate=YYYY-MM-DD`, `PUT /api/routine-logs`, `DELETE /api/routine-logs/:id` |
| `/journal/new` | Dedicated create journal page | Not started | Authenticated if added later | Existing `/journal` page owns create UI |
| `/journal/[id]` | Dedicated journal detail/edit page | Not started | Authenticated if added later | Existing `/journal` page owns edit UI |
| `/settings` | Settings & Data Control page for account overview, data management navigation, and MVP-safe account deletion request | Implemented | Authenticated | `GET /api/me`, `POST /api/account/deletion-request`, links to user-owned data areas including `/routine-logs/today` |

## API Routes

| Route | Methods | Purpose | Auth | Status |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | Auth.js-managed | Built-in Auth.js auth routes | Auth.js-managed | Implemented |
| `/api/me` | `GET` | Current user plus SkinWise app profile fields | Required | Implemented |
| `/api/dashboard` | `GET` | Authenticated dashboard summary for a local date | Required | Implemented |
| `/api/skin-profile` | `GET`, `POST`, `PATCH`, `DELETE` | Current user's skin profile | Required | Implemented |
| `/api/products` | `GET` | Visible product catalogue list/search/filter | Required | Implemented |
| `/api/products/[id]` | `GET` | Visible product detail | Required | Implemented |
| `/api/saved-products` | `GET`, `POST` | Current user's saved products list and save endpoint | Required | Implemented |
| `/api/saved-products/[productId]` | `DELETE` | Remove current user's saved-product record for one product | Required | Implemented |
| `/api/ingredients` | `GET` | Ingredient list/search | Required | Implemented |
| `/api/ingredients/[id]` | `GET` | Ingredient detail | Required | Implemented |
| `/api/ingredients/explain` | `POST` | Rate-limited ingredient explanation through AI provider abstraction with fallback | Required | Implemented |
| `/api/routines` | `GET`, `POST` | Current user's routines | Required | Implemented |
| `/api/routines/[id]` | `GET`, `PATCH`, `DELETE` | Current user's routine detail/update/delete | Required | Implemented |
| `/api/routines/[id]/analyze` | `POST` | Routine safety analysis with deterministic rules before provider explanation | Required | Implemented |
| `/api/routines/[id]/analyses` | `GET` | Routine analysis history | Required | Implemented |
| `/api/routine-logs` | `GET`, `PUT` | Routine log list for a local date and upsert for one routine/date | Required | Implemented |
| `/api/routine-logs/[id]` | `DELETE` | Delete one RoutineLog owned by the current user | Required | Implemented |
| `/api/skin-journal` | `GET`, `POST` | Current user's journal list and create endpoint | Required | Implemented |
| `/api/skin-journal/[id]` | `PATCH`, `DELETE` | Current user's journal update/delete endpoint | Required | Implemented |

## Protected Route Matcher

`src/proxy.ts` protects:

```txt
/dashboard/:path*
/onboarding/:path*
/skin-profile/:path*
/routines/:path*
/routine-logs/:path*
/journal/:path*
/products/:path*
/saved-products/:path*
/ingredients/:path*
/settings/:path*
```

## Current Dashboard Navigation

Enabled:

```txt
Dashboard
Skin Profile
Routines
Today Log
Journal
Products
Saved Products
Ingredients
Settings
```

Disabled/future:

```txt
None currently listed in dashboard navigation.
```

Today routine log controls still exist inside `/routines`, and `/routine-logs/today` now provides the dedicated daily checklist route for the same RoutineLog API flow, including deletion through `DELETE /api/routine-logs/:id`.

## Post-MVP Routes Not Allowed Without Explicit Approval

Do not create:

```txt
/marketplace
/checkout
/community
/scan
/face-analysis
/skin-score
/subscription
/admin/products
/admin/users
```

## Copy and Safety Requirements

Every route must avoid medical diagnosis claims, treatment guarantees, appearance scoring, skin scoring, and appearance pressure.

Use factual educational wording. For severe, painful, spreading, infected-looking, infected, or persistent symptoms, guide users to a qualified professional.


Protected route matcher now includes `"/settings/:path*"` for the authenticated Settings & Data Control page. Routine logs remain managed through `/routine-logs/today`.
