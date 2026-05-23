# 13-ui-route-map.md

# UI Route Map — MVP v1.2.6

## 1. Purpose

This document maps user-facing routes to MVP features, API dependencies, and implementation status.

AI coding assistants must use this file before creating new pages or route groups.

## 2. Route principles

- Keep pages thin.
- Put reusable UI in `src/shared/components` or module-specific component folders.
- Put business logic in use cases, not `page.tsx`.
- Protected app routes belong under `src/app/(dashboard)/`.
- Auth-related pages belong under `src/app/(auth)/`.
- API route handlers must follow `docs/05-api-contract.md`.
- Do not mark routes as implemented unless matching source files exist.

## 3. Public routes

| Route | Purpose | Current source status | Notes |
|---|---|---|---|
| `/` | Landing page explaining SkinWise VN | Implemented basic route | Must not claim medical diagnosis |
| `/login` | Login page | Not implemented as a dedicated page | Auth.js provider entry exists through `/api/auth/*` |
| `/privacy` | Privacy explanation | Not implemented | Static page may be added only when scheduled |
| `/terms` | Terms/disclaimer | Not implemented | Static page may be added only when scheduled |

## 4. Protected dashboard routes

| Route | Purpose | Current source status | API dependency | Notes |
|---|---|---|---|---|
| `/dashboard` | Authenticated dashboard overview for Skin Profile, routines, today's routine log status, latest routine analysis, and next actions | Implemented | `GET /api/dashboard?localDate=YYYY-MM-DD` | Renders `DashboardOverview`; data-driven dashboard route |
| `/onboarding/skin-profile` | First-time Skin Profile onboarding | Implemented | `/api/skin-profile` | Protected route; remains available for onboarding empty-state CTA |
| `/skin-profile` | View/edit Skin Profile | Implemented | `/api/skin-profile` | Loads profile through GET and updates through PATCH |
| `/routines` | Routine list/create/edit/delete, Product Picker, Routine Analysis panel, and today's RoutineLog controls | Implemented | `/api/routines`, `/api/products`, `/api/routines/:id/analyze`, `/api/routines/:id/analyses`, `/api/routine-logs` | Existing single protected routines page only |
| `/products` | Product catalogue search/list page | Implemented | `GET /api/products` | Protected dashboard route; renders the Product Catalogue UI |
| `/products/new` | Product submission page | Not implemented | `POST /api/products` not implemented | Do not mark as implemented |
| `/products/[id]` | Product detail information page | Implemented | `GET /api/products/[id]` | Protected dashboard route; displays public Product DTO detail information |
| `/ingredients` | Ingredient UI search/list page | Not implemented | `GET /api/ingredients` exists | Do not create unless Ingredient UI task is scheduled |
| `/ingredients/[id]` | Ingredient detail UI page | Not implemented | `GET /api/ingredients/:id` exists | Educational content only when implemented |
| `/routines/new` | Separate routine creation page | Not implemented | `POST /api/routines` exists | Existing `/routines` page owns create/edit UI |
| `/routines/[id]` | Separate routine detail page | Not implemented | `/api/routines/:id` exists | Existing `/routines` page owns routine UI |
| `/routines/[id]/analysis` | Separate routine analysis page | Not implemented | `/api/routines/:id/analyze`, `/api/routines/:id/analyses` exist | Existing `/routines` page owns analysis panel |
| `/routine-logs/today` | Separate routine log checklist page | Not implemented | `/api/routine-logs` exists | Existing `/routines` page owns RoutineLog UI controls |
| `/journal` | Skin journal timeline | Not implemented | `/api/skin-journal` not implemented | Do not create until SkinJournal task is scheduled |
| `/journal/new` | Create journal entry | Not implemented | `POST /api/skin-journal` not implemented | Do not create until SkinJournal task is scheduled |
| `/journal/[id]` | View/edit journal entry | Not implemented | `/api/skin-journal/:id` not implemented | Do not create until SkinJournal task is scheduled |
| `/settings` | App/account settings | Not implemented | Auth/profile later | Optional; do not overbuild |

### `/dashboard` implementation note

`/dashboard` renders `DashboardOverview` from `src/modules/dashboard/components/dashboard-overview.tsx`.

`DashboardOverview` fetches:

```txt
GET /api/dashboard?localDate=YYYY-MM-DD
```

The page displays:

- skin profile summary;
- routine completion summary;
- today's routine log status;
- latest routine analysis summary;
- next suggested actions.

It must not display fake Product UI, Journal, skin score, image upload, diagnosis, marketplace, or medical recommendation features.

## 5. Post-MVP routes not allowed during current implementation

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

Admin routes may be added later only when the admin review workflow is explicitly scheduled.

## 6. Current implemented UI target

Current implemented user-facing routes are:

```txt
/
/dashboard
/onboarding/skin-profile
/skin-profile
/routines
/products
/products/[id]
```

The `/dashboard` page is now data-driven through `DashboardOverview`. Product catalogue and Product detail UI routes are implemented. Ingredient UI pages, skin score, image upload, diagnosis, marketplace, and admin routes are not implemented.

## 7. Navigation groups

Current dashboard navigation enables:

```txt
Dashboard
Skin Profile
Routines
Products
```

Disabled or future navigation metadata may exist for unimplemented feature areas, but unimplemented items must use `href: null` and `disabled: true`.

Do not include marketplace, community, image analysis, skin scoring, medical diagnosis, or Product submission links.

## 8. UX copy requirements

Every page must avoid medical claims and appearance pressure.

Preferred wording:

```txt
Routine của bạn có một vài điểm cần chú ý.
Thông tin này chỉ mang tính giáo dục.
Bạn có thể cân nhắc đơn giản hóa routine.
```

Avoid:

```txt
Da bạn bị...
Sản phẩm này sẽ trị khỏi...
Da bạn xấu vì...
Bạn bắt buộc phải dùng...
```
