# 05-api-contract.md

# API Contract — MVP v1.2.6

## 1. API conventions

### Base path

```txt
/api
```

### API DTO boundary

SkinWise-owned API responses must not expose MongoDB internals.

Rules:

- return `id: string`, not raw `_id` or `ObjectId`;
- return Date values as ISO strings;
- omit future-only/private fields from MVP DTOs;
- keep Auth.js-owned `/api/auth/*` responses unchanged by SkinWise wrappers.

### Response shape

Success:

```json
{
  "data": {},
  "error": null
}
```

Error:

```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Common errors

| Code | Meaning |
|---|---|
| UNAUTHORIZED | User is not signed in |
| FORBIDDEN | User cannot access resource |
| VALIDATION_ERROR | Request body is invalid |
| NOT_FOUND | Resource not found |
| CONFLICT | Resource already exists or unique constraint conflict |
| RATE_LIMITED | Too many requests |
| INTERNAL_ERROR | Unexpected server error |

## 2. Auth

Auth is handled by Auth.js / NextAuth using the MongoDB Adapter for MVP. Auth.js owns identity collections; SkinWise owns app-specific profile and role data.

### Auth.js-owned routes

Auth.js owns all built-in routes under:

```txt
/api/auth/*
```

Do not redefine or wrap Auth.js built-in responses using the SkinWise `{ data, error }` response shape. In particular, do not document or implement `GET /api/auth/session` as a custom SkinWise API response. Auth.js controls the behavior and response format of its built-in auth endpoints.

### GET /api/me

Returns the current authenticated user plus SkinWise app-specific profile fields.

Response:

```json
{
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "An",
      "role": "USER",
      "onboardingCompleted": false
    }
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED

Notes:

- `id`, `email`, and `name` come from the authenticated Auth.js user/session.
- `role` and `onboardingCompleted` come from `AppUserProfile`.
- If the Auth.js user exists but `AppUserProfile` is missing, the implementation must create it lazily.
- Lazy defaults: `role = "USER"` and `onboardingCompleted = false`.
- `GET /api/me` must not return `NOT_FOUND` for first-login AppUserProfile absence in MVP.

## 3. Skin Profile

### POST /api/skin-profile

Create or replace current user's skin profile.

Request:

```json
{
  "skinType": "oily",
  "concerns": ["acne", "oiliness"],
  "sensitivityLevel": "medium",
  "budgetRange": "300k_700k",
  "experienceLevel": "beginner",
  "avoidIngredients": ["fragrance"]
}
```

Validation:

- skinType is required enum.
- concerns must be non-empty array.
- sensitivityLevel is required enum.
- budgetRange is required enum.
- experienceLevel is required enum.
- avoidIngredients max 30 items.

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

### GET /api/skin-profile

Returns current user's profile.

Errors:

- UNAUTHORIZED
- NOT_FOUND

### PATCH /api/skin-profile

Update selected fields.

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR
- NOT_FOUND

### DELETE /api/skin-profile

Delete current user's profile.

Errors:

- UNAUTHORIZED
- NOT_FOUND

## 4. Products

### GET /api/products

Search products visible to the current user.

Authentication:

- MVP requires authentication for `GET /api/products`.
- If unauthenticated, return `UNAUTHORIZED`.
- `includeMine=true` is only valid for authenticated users.

Query params:

```txt
q?: string
category?: string
priceRange?: string
skinType?: string
concern?: string
includeMine?: boolean = false
limit?: number
```

Visibility rules:

- By default, return only products with `verificationStatus` in `["verified", "reviewed"]`.
- If `includeMine=true`, also return unverified products where `createdByUserId = currentUser.id`.
- `includeMine=true` must never return another user's unverified submissions.
- Admin-only product review/search must use future `/api/admin/products` routes.

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "product_123",
        "name": "Gentle Cleanser",
        "brand": "Example",
        "category": "cleanser",
        "keyActives": [],
        "priceRange": "budget",
        "verificationStatus": "verified"
      }
    ]
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

### POST /api/products

Create user-submitted product. Normal users cannot set `source`, `verificationStatus`, or `createdByUserId`. The server must set them automatically.

Request:

```json
{
  "name": "Product name",
  "brand": "Brand",
  "category": "serum",
  "ingredientsText": "Water, Niacinamide...",
  "priceRange": "budget",
  "skinTypes": ["oily"],
  "concerns": ["oiliness"],
  "suitableFor": ["Da dầu"],
  "notRecommendedFor": ["Da đang kích ứng mạnh"]
}
```

Validation:

- name required, max 160 chars.
- brand required, max 100 chars.
- ingredientsText max 5000 chars.
- category enum.
- priceRange enum.
- skinTypes optional enum array.
- concerns optional enum array.
- suitableFor max 20 items.
- notRecommendedFor max 20 items.

Server-side rules:

- If current user role is `USER`, set `source = "user_submitted"`.
- If current user role is `USER`, set `verificationStatus = "unverified"`.
- If current user role is `USER`, set `createdByUserId = currentUser.id`.
- Ignore any client-provided `source`, `verificationStatus`, or `createdByUserId`.
- Public `POST /api/products` is for user-submitted products only.
- Admin product creation/verification is out of MVP UI scope.
- If implemented later, admin product management must use `/api/admin/products` routes and require `ADMIN` role.

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

Server-side trust rules:

- This endpoint is for normal user product submissions.
- Normal users cannot set `source`, `verificationStatus`, or `createdByUserId`.
- Server sets `source = "user_submitted"`.
- Server sets `verificationStatus = "unverified"`.
- Server sets `createdByUserId = currentUser.id`.
- Admin product verification is out of MVP UI scope.
- If implemented later, admin product creation/review must use `/api/admin/products` routes and require `ADMIN` role.

### GET /api/products/:id

Returns product details.

Authentication:

- MVP requires authentication.

Visibility rules:

A product is readable if:

- `verificationStatus` is `verified` or `reviewed`; or
- `createdByUserId = currentUser.id`; or
- `currentUser.role = "ADMIN"`.

Errors:

- UNAUTHORIZED
- FORBIDDEN
- NOT_FOUND

## 5. Ingredients

### GET /api/ingredients

Search ingredient knowledge base records.

Authentication:

- `GET /api/ingredients` requires authentication in MVP.
- Public read access can be considered later for SEO or landing-page education, but is out of MVP scope.

Query params:

```txt
q?: string
function?: string
limit?: number
```

Visibility rules:

- Ingredient knowledge base is readable by authenticated users in MVP.
- Ingredient records do not use product `verificationStatus`.
- Ingredient records do not use `includeMine`.
- User-submitted ingredient creation is out of MVP scope.
- Admin ingredient management is out of MVP UI scope.

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "ingredient_123",
        "inciName": "Niacinamide",
        "aliases": ["Vitamin B3"],
        "functions": ["barrier_support", "oil_balance"]
      }
    ]
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

### GET /api/ingredients/:id

Returns ingredient details.

Authentication:

- `GET /api/ingredients/:id` requires authentication in MVP.

Visibility rules:

- Ingredient records do not use product `verificationStatus`.
- User-submitted ingredient creation is out of MVP scope.

Errors:

- UNAUTHORIZED
- NOT_FOUND

### POST /api/ingredients/explain

Explain an ingredient in beginner-friendly Vietnamese using the IngredientExplanationResult schema.

Request:

```json
{
  "ingredientName": "salicylic acid",
  "skinProfileId": "optional_profile_id"
}
```

Validation:

- ingredientName required, max 160 chars.
- skinProfileId optional.
- If skinProfileId is provided, it must belong to current user.
- User must be rate-limit checked.

Response:

```json
{
  "data": {
    "ingredientName": "Salicylic Acid",
    "simpleExplanation": "Salicylic Acid là một dạng BHA thường dùng trong mỹ phẩm cho da dầu và lỗ chân lông.",
    "commonUses": ["Hỗ trợ làm sạch dầu thừa trên bề mặt da"],
    "suitableFor": ["Da dầu", "Người đã có routine cơ bản ổn định"],
    "cautions": ["Có thể gây khô hoặc châm chích nếu dùng quá thường xuyên"],
    "avoidWith": ["Không nên kết hợp quá dày với nhiều acid hoặc retinoid nếu mới bắt đầu"],
    "beginnerAdvice": "Người mới nên ưu tiên routine cơ bản trước khi thêm hoạt chất mạnh.",
    "disclaimer": "Thông tin này chỉ mang tính giáo dục về mỹ phẩm và không thay thế tư vấn y tế."
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- NOT_FOUND
- RATE_LIMITED
- VALIDATION_ERROR
- INTERNAL_ERROR

## 6. Routines

### POST /api/routines

Create routine.

Request:

```json
{
  "name": "Morning routine",
  "timeOfDay": "morning",
  "steps": [
    {
      "productId": "product_123",
      "category": "cleanser",
      "order": 1,
      "frequency": "daily"
    }
  ]
}
```

Validation:

- name required, max 100 chars.
- timeOfDay enum.
- steps max 15.
- each step must have productId or customProductName.
- order must be positive integer.
- snapshot fields are server-populated when productId is provided.

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

### GET /api/routines

Return current user's routines.

Errors:

- UNAUTHORIZED

### GET /api/routines/:id

Return a routine owned by current user.

Errors:

- UNAUTHORIZED
- NOT_FOUND

### PATCH /api/routines/:id

Update a routine owned by current user.

Errors:

- UNAUTHORIZED
- NOT_FOUND
- VALIDATION_ERROR

### DELETE /api/routines/:id

Delete a routine owned by current user.

Errors:

- UNAUTHORIZED
- NOT_FOUND

## 7. Routine Analysis

### POST /api/routines/:id/analyze

Analyze a routine.

This is the canonical routine analysis endpoint.

Path params:

```txt
id: routine id
```

Request:

```json
{}
```

Validation:

- routine id is required.
- routine must belong to current user.
- user must be rate-limit checked.

Response:

```json
{
  "data": {
    "analysisId": "analysis_123",
    "riskLevel": "medium",
    "summary": "Routine có một số điểm cần chú ý.",
    "warnings": [
      {
        "code": "MISSING_SUNSCREEN_AM",
        "severity": "medium",
        "message": "Routine buổi sáng đang thiếu chống nắng.",
        "reason": "Chống nắng là bước quan trọng vào ban ngày."
      }
    ],
    "suggestions": [
      {
        "title": "Thêm chống nắng",
        "description": "Ưu tiên chống nắng trước khi thêm treatment mới.",
        "priority": "must_fix"
      }
    ],
    "shouldSeeProfessional": false,
    "disclaimer": "Thông tin chỉ mang tính giáo dục, không thay thế tư vấn y tế."
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- NOT_FOUND
- RATE_LIMITED
- VALIDATION_ERROR
- INTERNAL_ERROR

### GET /api/routines/:id/analyses

Returns previous analyses for a routine owned by current user.

Errors:

- UNAUTHORIZED
- NOT_FOUND

## 8. Routine Logs

### POST /api/routine-logs

Create or update a routine log for a date.

Upsert behavior:

- If no RoutineLog exists for `userId + routineId + localDate`, create one.
- If a RoutineLog already exists for `userId + routineId + localDate`, update `completedStepIds`, `skippedStepIds`, `notes`, `timezone`, and `updatedAt`.
- Do not create duplicate RoutineLog records for the same `userId + routineId + localDate`.

Request:

```json
{
  "routineId": "routine_123",
  "localDate": "2026-05-12",
  "timezone": "Asia/Ho_Chi_Minh",
  "completedStepIds": ["step_1", "step_2"],
  "skippedStepIds": ["step_3"],
  "notes": "Bỏ qua treatment hôm nay."
}
```

Validation:

- routineId required.
- routine must belong to current user.
- localDate required in YYYY-MM-DD format and must match `/^\d{4}-\d{2}-\d{2}$/`.
- timezone required as IANA timezone string.
- completedStepIds max 30.
- skippedStepIds max 30.
- notes max 1000 chars.

Errors:

- UNAUTHORIZED
- NOT_FOUND
- VALIDATION_ERROR

### GET /api/routine-logs

Query params:

```txt
routineId?: string
from?: localDate
to?: localDate
limit?: number
```

Validation:

- `from` and `to` must match `/^\d{4}-\d{2}-\d{2}$/` when provided.
- Date range query may compare `localDate` lexicographically because `YYYY-MM-DD` sorts correctly.

Returns current user's routine logs.

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

### DELETE /api/routine-logs/:id

Delete a routine log owned by current user.

Errors:

- UNAUTHORIZED
- NOT_FOUND

## 9. Skin Journal

### POST /api/skin-journal

Create journal entry.

Duplicate behavior:

- MVP allows one SkinJournal entry per `currentUser.id + localDate`.
- If an entry already exists for the same `currentUser.id + localDate`, return `CONFLICT`.
- User must use `PATCH /api/skin-journal/:id` to edit the existing entry for the same day.

Request:

```json
{
  "localDate": "2026-05-12",
  "timezone": "Asia/Ho_Chi_Minh",
  "productsUsed": ["product_123"],
  "observations": ["Da hơi khô vùng má"],
  "symptoms": ["dryness"],
  "sleepHours": 7,
  "stressLevel": "medium",
  "notes": "Không dùng treatment hôm nay."
}
```

Validation:

- localDate required in YYYY-MM-DD format and must match `/^\d{4}-\d{2}-\d{2}$/`.
- timezone required as IANA timezone string.
- observations max 20 items.
- notes max 3000 chars.
- productsUsed max 30.
- symptoms enum array.
- sleepHours between 0 and 24.

Errors:

- UNAUTHORIZED
- CONFLICT
- VALIDATION_ERROR

### GET /api/skin-journal

Query params:

```txt
from?: localDate
to?: localDate
limit?: number
```

Validation:

- `from` and `to` must match `/^\d{4}-\d{2}-\d{2}$/` when provided.
- Date range query may compare `localDate` lexicographically because `YYYY-MM-DD` sorts correctly.

Returns current user's journal entries.

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

### PATCH /api/skin-journal/:id

Update current user's journal entry.

Request:

```json
{
  "timezone": "Asia/Ho_Chi_Minh",
  "productsUsed": ["product_123"],
  "observations": ["Da hơi khô vùng má"],
  "symptoms": ["dryness"],
  "sleepHours": 7,
  "stressLevel": "medium",
  "notes": "Cập nhật ghi chú hôm nay."
}
```

Validation:

- `localDate` cannot be changed through PATCH in MVP.
- If the user needs a journal entry for another date, create a separate entry with `POST /api/skin-journal`.
- `timezone` is optional on PATCH, but when provided it must be an IANA timezone string.
- `productsUsed` max 30.
- `observations` max 20 items.
- `symptoms` must use the SkinJournal symptom enum.
- `sleepHours` must be between 0 and 24 when provided.
- `notes` max 3000 chars.
- Future image fields must not be accepted in MVP request bodies.

Errors:

- UNAUTHORIZED
- NOT_FOUND
- VALIDATION_ERROR

### DELETE /api/skin-journal/:id

Delete current user's journal entry.

Errors:

- UNAUTHORIZED
- NOT_FOUND
