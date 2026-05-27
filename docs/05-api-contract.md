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

Implementation status: not implemented in the current source tree. Keep this contract as future scope until a product submission task is explicitly scheduled.

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

## 5. Saved Products

Saved Products lets authenticated users bookmark visible products for later routine planning.

### GET /api/saved-products

Returns saved products for the current authenticated user.

Authentication:

- Required.
- The server derives `userId` from the authenticated session.
- The client must not send `userId`.

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "saved_product_123",
        "productId": "product_123",
        "product": {
          "id": "product_123",
          "name": "Niacinamide 5% Serum",
          "brand": "SkinWise Demo"
        },
        "createdAt": "2026-05-26T00:00:00.000Z",
        "updatedAt": "2026-05-26T00:00:00.000Z"
      }
    ]
  },
  "error": null
}
```

DTO safety:

- `SavedProductDto` must not expose `userId`.
- Product data is returned through the existing public `ProductDto`.

Errors:

- UNAUTHORIZED
- INTERNAL_ERROR

### POST /api/saved-products

Save a visible product for the current authenticated user.

Request:

```json
{
  "productId": "665000000000000000000320"
}
```

Validation and behavior:

- `productId` must be a valid MongoDB ObjectId string.
- Unknown request fields are rejected.
- The server confirms the product exists and is visible before saving.
- Duplicate saves are idempotent and return the existing saved product DTO.
- Duplicate records are also prevented by the unique `userId + productId` index.

Response:

```json
{
  "data": {
    "item": {
      "id": "saved_product_123",
      "productId": "product_123",
      "product": {
        "id": "product_123",
        "name": "Niacinamide 5% Serum"
      },
      "createdAt": "2026-05-26T00:00:00.000Z",
      "updatedAt": "2026-05-26T00:00:00.000Z"
    }
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR
- NOT_FOUND
- INTERNAL_ERROR

### DELETE /api/saved-products/:productId

Remove the saved-product record for the current authenticated user.

Behavior:

- Authentication is required.
- `productId` route param must be a valid MongoDB ObjectId string.
- Delete is scoped by `currentUser.id + productId`.
- Missing saved records are handled idempotently.
- The actual product record is never deleted.

Response:

```json
{
  "data": {
    "removed": true
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR
- INTERNAL_ERROR

## 6. Ingredients

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
  "ingredientName": "niacinamide",
  "skinType": "oily",
  "concerns": ["acne", "redness", "oiliness"]
}
```

Validation:

- `ingredientName` is required, trimmed, non-empty, and max 160 chars.
- `skinType` is optional and must use the Skin Profile skin type enum when provided.
- `concerns` is optional and must use the Skin Profile concern enum when provided.
- Unknown fields are rejected.
- Malformed JSON returns `VALIDATION_ERROR`.
- User must be rate-limit checked after authentication and request validation.

Rate limit:

- Applies only to authenticated valid `POST /api/ingredients/explain` requests.
- Key format: `ingredient_explanation:${userId}`.
- Limit: 10 requests per authenticated user per 60 minutes.
- Unauthenticated requests return `UNAUTHORIZED` and do not consume quota.
- Invalid requests return `VALIDATION_ERROR` and do not consume quota.
- When exceeded, return HTTP `429`, include `Retry-After`, and do not call the use case.

Response:

```json
{
  "data": {
    "explanation": {
      "ingredientName": "niacinamide",
      "simpleExplanation": "Niacinamide is explained in simple skincare terms.",
      "commonUses": ["Supports cosmetic ingredient education."],
      "suitableFor": ["oily skin"],
      "cautions": ["Tolerance can vary."],
      "avoidWith": ["known sensitivity"],
      "beginnerAdvice": "Introduce gradually and follow product instructions.",
      "disclaimer": "Thông tin này chỉ mang tính giáo dục về mỹ phẩm và không thay thế tư vấn y tế.",
      "source": "ai"
    }
  },
  "error": null
}
```

If the provider fails, returns malformed output, or provider-to-public mapping fails, the endpoint returns a deterministic fallback explanation with `source = "fallback"` and does not expose raw provider errors, stack traces, `providerMetadata`, `educationalNotes`, `providerFailureReason`, or internal provider details.

Errors:

- UNAUTHORIZED
- RATE_LIMITED
- VALIDATION_ERROR
- INTERNAL_ERROR

## 7. Routines

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

## 8. Routine Analysis

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
- user must be rate-limit checked after authentication and request validation.

Rate limit:

- Applies only to authenticated `POST /api/routines/:id/analyze` requests.
- Key format: `routine_analysis:${userId}`.
- Limit: 10 requests per authenticated user per 60 minutes.
- Unauthenticated requests return the existing `UNAUTHORIZED` response and do not consume quota.
- When exceeded, return HTTP `429`, include `Retry-After`, and do not run routine analysis.

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

Rate-limited response:

```json
{
  "data": null,
  "error": {
    "code": "RATE_LIMITED",
    "message": "You have reached the routine analysis limit. Please try again later.",
    "details": {
      "retryAfterSeconds": 120
    }
  }
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

## 9. Routine Logs

RoutineLog API is used by both the `/routines` page and the dedicated `/routine-logs/today` checklist page.

### PUT /api/routine-logs

Canonical upsert endpoint for one routine log.

Authentication:

- Requires authenticated user.
- Server derives `userId` from the session.
- Client must not submit `userId`.

Upsert behavior:

- If no RoutineLog exists for `userId + routineId + localDate`, create one.
- If a RoutineLog already exists for `userId + routineId + localDate`, update it.
- Do not create duplicate RoutineLog records for the same `userId + routineId + localDate`.

Request:

```json
{
  "routineId": "665000000000000000000460",
  "localDate": "2026-05-17",
  "timezone": "Asia/Ho_Chi_Minh",
  "status": "partial",
  "completedStepIds": ["step_1"],
  "note": "Bỏ qua kem chống nắng hôm nay."
}
```

Validation:

- `routineId` is required.
- target routine must belong to the authenticated user.
- `localDate` is required and must use `YYYY-MM-DD`.
- `localDate` is stored as a string, not a JavaScript Date.
- `timezone` is required as a non-empty string.
- `status` must be one of `completed`, `partial`, or `skipped`.
- `completedStepIds` is optional and must contain RoutineStep `stepId` values from the target routine when provided.
- unknown completed step IDs return `VALIDATION_ERROR`.
- `partial` logs require at least one completed step and fewer than all routine steps.
- `skipped` logs must omit `completedStepIds` or keep it empty.
- `note` is optional, trimmed, and max 500 characters.
- client-submitted `userId`, `id`, `_id`, `createdAt`, `updatedAt`, and unknown fields are rejected.

Response:

```json
{
  "data": {
    "routineLog": {
      "id": "665000000000000000000471",
      "routineId": "665000000000000000000460",
      "localDate": "2026-05-17",
      "timezone": "Asia/Ho_Chi_Minh",
      "status": "partial",
      "completedStepIds": ["step_1"],
      "note": "Bỏ qua kem chống nắng hôm nay.",
      "createdAt": "2026-05-17T00:00:00.000Z",
      "updatedAt": "2026-05-17T00:00:00.000Z"
    }
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- NOT_FOUND
- VALIDATION_ERROR
- INTERNAL_ERROR

### GET /api/routine-logs?localDate=YYYY-MM-DD

Returns RoutineLog DTOs for the authenticated user on a required local calendar date.

Query params:

```txt
localDate: string // required, YYYY-MM-DD
```

Response:

```json
{
  "data": {
    "routineLogs": [
      {
        "id": "665000000000000000000471",
        "routineId": "665000000000000000000460",
        "localDate": "2026-05-17",
        "timezone": "Asia/Ho_Chi_Minh",
        "status": "completed",
        "completedStepIds": ["step_1", "step_2"],
        "createdAt": "2026-05-17T00:00:00.000Z",
        "updatedAt": "2026-05-17T00:00:00.000Z"
      }
    ]
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR
- INTERNAL_ERROR

Notes:

- `POST /api/routine-logs` is not implemented for RL-001.
- `DELETE /api/routine-logs/:id` is not implemented for RL-001.
- RoutineLog UI is implemented on the existing /routines page by TASK RL-002.


## 10. Dashboard

### GET /api/dashboard?localDate=YYYY-MM-DD

Returns the authenticated user's MVP dashboard summary for the requested browser/user local date.

Authentication and ownership:

- Authentication is required.
- `userId` is derived from the authenticated session through `getCurrentUser()`.
- The client must not send `userId` in the query string or request body.
- The route supports `GET` only.

Query parameters:

| Field | Required | Format | Notes |
|---|---:|---|---|
| `localDate` | Yes | `YYYY-MM-DD` | Browser/user local date used for today's RoutineLog summary |

Validation:

- `localDate` is required.
- `localDate` must use `YYYY-MM-DD` format.
- Unknown query fields must be rejected.
- Client-owned `userId` input must be rejected if passed as an unknown query field.

Successful response:

```json
{
  "data": {
    "dashboard": {}
  },
  "error": null
}
```

Response safety:

- Must not expose `userId`.
- Must not expose `_id`.
- Must not expose raw `ObjectId` values.
- Must not expose MongoDB internals.

Expected errors:

| Status | Code | Reason |
|---:|---|---|
| 401 | `UNAUTHORIZED` | User is not authenticated |
| 400 | `VALIDATION_ERROR` | `localDate` is missing, invalid, or unknown query fields are passed |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

## 11. Skin Journal

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


## Account deletion request API

### `POST /api/account/deletion-request`

- Requires authentication.
- The server derives the current user id from the authenticated session; the endpoint does not accept a client-submitted `userId`.
- Stores `accountDeletionRequestedAt` on the existing `AppUserProfile` document as an MVP-safe, non-destructive request marker.
- Does not hard-delete the Auth.js identity and does not delete Auth.js adapter documents.
- Returns the standard SkinWise API envelope with `data.requested` and `data.accountDeletionRequestedAt`.
- Repeated requests are idempotent and return the existing request timestamp.

### `DELETE /api/routine-logs/:id`

- Requires authentication.
- Deletes only the routine log matching both the route id and the current authenticated `userId`.
- Returns `NOT_FOUND` for invalid ids, missing logs, or logs owned by another user.
- Does not accept client-submitted `userId`.
- Does not delete routines, routine analyses, skin profile records, journal entries, saved products, or other user data.
