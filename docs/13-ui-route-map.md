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

## 3. Public routes

| Route | Purpose | MVP | Notes |
|---|---|---:|---|
| `/` | Landing page explaining SkinWise VN | Yes | Must not claim medical diagnosis |
| `/login` | Login page | Yes | Auth.js provider entry |
| `/privacy` | Privacy explanation | Recommended | Can be static initially |
| `/terms` | Terms/disclaimer | Recommended | Can be static initially |

## 4. Protected dashboard routes

| Route | Purpose | MVP | API dependency | Notes |
|---|---|---:|---|---|
| `/dashboard` | Overview of routine, journal, safety status | Yes | multiple later | Week 1 shell only |
| `/onboarding/skin-profile` | Create/update skin profile | Yes | `/api/skin-profile` | Should redirect if already completed later |
| `/skin-profile` | View/edit profile | Yes | `/api/skin-profile` | May reuse onboarding form |
| `/products` | Search/list products | Yes | `/api/products` | Auth required in MVP |
| `/products/new` | Submit product | Yes | `POST /api/products` | User cannot set verification status |
| `/products/[id]` | Product detail | Yes | `/api/products/:id` | Visibility rules apply |
| `/ingredients` | Search ingredients | Yes | `/api/ingredients` | Auth required |
| `/ingredients/[id]` | Ingredient detail | Yes | `/api/ingredients/:id` | Educational content only |
| `/routines` | Routine list | Yes | `/api/routines` | Must show empty state |
| `/routines/new` | Create routine | Yes | `POST /api/routines` | Morning/evening routine builder |
| `/routines/[id]` | Routine detail | Yes | `/api/routines/:id` | Ownership required |
| `/routines/[id]/analysis` | Routine analysis result/history | Yes | `/api/routines/:id/analyze`, `/api/routines/:id/analyses` | Rule engine before AI |
| `/routine-logs/today` | Today's routine checklist | Yes | `/api/routine-logs` | Uses upsert behavior |
| `/journal` | Skin journal timeline | Yes | `/api/skin-journal` | Privacy-first |
| `/journal/new` | Create journal entry | Yes | `POST /api/skin-journal` | One entry per localDate |
| `/journal/[id]` | View/edit journal entry | Yes | `/api/skin-journal/:id` | Ownership required |
| `/settings` | App/account settings | Optional | auth/profile later | Do not overbuild in Week 1 |

## 5. Post-MVP routes not allowed during Week 1

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

## 6. Week 1 UI target

Week 1 should create only:

```txt
/
/login
/dashboard
```

Optional placeholders may be linked from dashboard, but they should clearly say the feature is not implemented yet.

## 7. Navigation groups

Recommended dashboard navigation:

```txt
Dashboard
Skin Profile
Routines
Today Log
Journal
Products
Ingredients
```

Do not include marketplace, community, image analysis, or skin scoring links.

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
