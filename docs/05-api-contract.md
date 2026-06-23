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
- `includeMine=true` is not implemented in the current source and is rejected as
  an unsupported query parameter.

Query params:

```txt
q?: string
category?: string
priceRange?: string
skinType?: string
concern?: string
limit?: number
```

Visibility rules:

- Return only products with `verificationStatus` in `["verified", "reviewed"]`.
- `verificationStatus = "unverified"` products are not returned by the public
  catalogue.
- Current source does not implement `includeMine`; unknown query parameters are
  rejected with `VALIDATION_ERROR`.
- Admin-only review/search uses `/api/admin/products` routes.

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
- Admin product management uses `/api/admin/products` routes and requires
  `ADMIN` role.

Errors:

- UNAUTHORIZED
- VALIDATION_ERROR

Server-side trust rules:

- This endpoint is for normal user product submissions.
- Normal users cannot set `source`, `verificationStatus`, or `createdByUserId`.
- Server sets `source = "user_submitted"`.
- Server sets `verificationStatus = "unverified"`.
- Server sets `createdByUserId = currentUser.id`.
- Admin product creation/review uses `/api/admin/products` routes and requires
  `ADMIN` role.

### GET /api/products/:id

Returns product details.

Authentication:

- MVP requires authentication.

Visibility rules:

- Current public implementation returns a product only when
  `verificationStatus` is `verified` or `reviewed`.
- Invalid, missing, or unverified products return `NOT_FOUND` from the public
  detail route.
- Admin all-status review is handled by `/api/admin/products` foundation routes,
  not by broadening the public detail route.

Errors:

- UNAUTHORIZED
- NOT_FOUND

### GET /api/admin/products

Implementation status: MVP v1.44 admin product review API foundation, extended
by MVP v1.59 admin product create/edit lite.

Lists products for admin review across all `verificationStatus` values,
including `unverified`, `reviewed`, and `verified`.

Authentication and authorization:

- Requires authenticated user.
- Requires `AppUserProfile.role = "ADMIN"`.
- Role is read from `AppUserProfile`, not from client input or raw session
  claims.

Query params:

```txt
q?: string
category?: string
priceRange?: string
skinType?: string
concern?: string
verificationStatus?: "unverified" | "reviewed" | "verified"
```

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "product_123",
        "name": "Pending Product",
        "brand": "Example",
        "category": "serum",
        "verificationStatus": "unverified"
      }
    ]
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- INTERNAL_ERROR

Notes:

- Response DTOs omit raw MongoDB `_id`, `ObjectId`, `source`,
  `createdByUserId`, and private internals.
- This is not a full admin CMS. MVP v1.59 adds create/edit lite only; hard
  delete, image management, full ingredient CRUD, marketplace, payment, and
  real AI generation remain out of scope.

### POST /api/admin/products

Implementation status: MVP v1.59 admin product create/edit lite.

Creates a product through the admin-only catalogue workflow.

Authentication and authorization:

- Requires authenticated user.
- Requires `AppUserProfile.role = "ADMIN"`.
- Role is read from `AppUserProfile`, not from client input or raw session
  claims.

Request:

```json
{
  "name": "Product name",
  "brand": "Brand",
  "category": "serum",
  "priceRange": "budget",
  "ingredientsText": "Water, Glycerin, Panthenol",
  "keyActives": ["Panthenol"],
  "tags": ["admin-lite"],
  "warnings": [],
  "skinTypes": ["sensitive"],
  "concerns": ["barrier_support"],
  "suitableFor": ["basic routine"],
  "notRecommendedFor": [],
  "verificationStatus": "unverified"
}
```

Validation and server-side rules:

- `name`, `brand`, `category`, `priceRange`, and `ingredientsText` are required.
- Enum fields must use the existing product enum values.
- Text fields are trimmed.
- Text array fields are trimmed and empty items are removed.
- `verificationStatus` defaults to `unverified` when omitted.
- The server sets `source = "admin"`.
- The server may set `createdByUserId` from the admin profile ObjectId; clients
  cannot submit it directly.
- Client-submitted `_id`, `id`, `source`, `createdByUserId`, `createdAt`, and
  `updatedAt` are rejected.
- Response DTOs do not expose `source` or `createdByUserId`.

Response:

```json
{
  "data": {
    "product": {
      "id": "product_123",
      "name": "Product name",
      "brand": "Brand",
      "category": "serum",
      "priceRange": "budget",
      "verificationStatus": "unverified"
    }
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- INTERNAL_ERROR

### PATCH /api/admin/products/:id

Implementation status: MVP v1.59 admin product create/edit lite.

Updates editable product content fields for an existing product. This route is
separate from the status-only `PATCH /api/admin/products/:id/verification-status`
route.

Authentication and authorization:

- Requires authenticated user.
- Requires `AppUserProfile.role = "ADMIN"`.

Request:

```json
{
  "name": "Updated product name",
  "brand": "Updated brand",
  "verificationStatus": "reviewed"
}
```

Validation and server-side rules:

- Partial updates are supported.
- If `name` or `brand` is provided, it must not be empty after trimming.
- Enum fields must use the existing product enum values.
- Text array fields are trimmed and empty items are removed.
- The server updates `updatedAt`.
- Existing fields are preserved when they are omitted from the request.
- Client-submitted `_id`, `id`, `source`, `createdByUserId`, `createdAt`, and
  `updatedAt` are rejected.
- Response DTOs do not expose `source` or `createdByUserId`.

Errors:

- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- NOT_FOUND
- INTERNAL_ERROR

### PATCH /api/admin/products/:id/verification-status

Implementation status: MVP v1.44 admin product review API foundation.

Updates only `verificationStatus` for an existing product.

Authentication and authorization:

- Requires authenticated user.
- Requires `AppUserProfile.role = "ADMIN"`.

Request:

```json
{
  "verificationStatus": "reviewed"
}
```

Validation:

- `id` must be a MongoDB ObjectId string.
- `verificationStatus` must be one of `unverified`, `reviewed`, or `verified`.
- Client-submitted `source`, `createdByUserId`, `createdAt`, `updatedAt`, or
  other product fields are rejected.

Errors:

- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- NOT_FOUND
- INTERNAL_ERROR

Notes:

- The server updates `updatedAt`.
- The route does not hard-delete products.
- The route does not add `isActive`.

### GET /api/products/:id/match

Returns a deterministic, personalized single-product match explanation for the authenticated user and one visible product.

Authentication and ownership:

- Required.
- The route derives `userId` from the authenticated session.
- The client must not send `userId`; query/body `userId` values are ignored.
- The endpoint loads only the requested visible product by route id.
- The endpoint loads only the current user's Skin Profile.
- Saved state is scoped to the current user and requested product only.
- The endpoint does not load the full product catalogue and does not perform catalogue-wide matching.

Success response when matching is available:

```json
{
  "data": {
    "productId": "665000000000000000000320",
    "matchAvailable": true,
    "skinProfileExists": true,
    "match": {
      "product": {},
      "matchScore": 82,
      "matchLevel": "good",
      "reasons": [],
      "cautions": [],
      "matchedSignals": {
        "skinType": true,
        "concerns": ["acne"],
        "budget": true,
        "sensitivity": false,
        "avoidedIngredients": []
      },
      "isSaved": false,
      "matchExplanation": {
        "summary": "Sản phẩm này có thể phù hợp với hồ sơ da của bạn dựa trên dữ liệu sản phẩm hiện có.",
        "positiveReasons": [],
        "cautionReasons": [],
        "ingredientHighlights": [],
        "usageNote": "Hãy patch test trước và đưa sản phẩm vào routine từ từ.",
        "dataQualityNotes": []
      }
    }
  },
  "error": null
}
```

Fallback response when Skin Profile is missing:

```json
{
  "data": {
    "productId": "665000000000000000000320",
    "matchAvailable": false,
    "skinProfileExists": false,
    "matchUnavailableReason": "NO_SKIN_PROFILE",
    "matchExplanation": {
      "summary": "Hoàn thành hồ sơ da để xem giải thích mức độ phù hợp được cá nhân hóa.",
      "positiveReasons": [],
      "cautionReasons": [],
      "ingredientHighlights": [],
      "usageNote": "Hãy hoàn thành hồ sơ da trước khi sử dụng đánh giá phù hợp được cá nhân hóa.",
      "dataQualityNotes": [
        "Chưa thể cá nhân hóa vì người dùng chưa có hồ sơ da hoàn chỉnh."
      ]
    }
  },
  "error": null
}
```

Fallback response when ingredient metadata is missing:

```json
{
  "data": {
    "productId": "665000000000000000000320",
    "matchAvailable": false,
    "skinProfileExists": true,
    "matchUnavailableReason": "NO_INGREDIENT_DATA",
    "matchExplanation": {
      "summary": "Chưa đủ dữ liệu thành phần để giải thích mức độ phù hợp của sản phẩm này.",
      "positiveReasons": [],
      "cautionReasons": [],
      "ingredientHighlights": [],
      "usageNote": "Hãy kiểm tra nhãn sản phẩm và patch test trước khi sử dụng.",
      "dataQualityNotes": [
        "Dữ liệu thành phần hiện chưa đủ để tạo giải thích chi tiết."
      ]
    }
  },
  "error": null
}
```

DTO notes:

- `matchAvailable: true` returns the existing `ProductMatchDto`.
- `matchAvailable: false` does not return `matchScore`, `matchLevel`, or unsupported match levels.
- `matchUnavailableReason` is one of `NO_SKIN_PROFILE`, `NO_INGREDIENT_DATA`, or `MATCH_UNAVAILABLE`.
- `usageNote` is always a string.
- `matchExplanation` reuses the same `ProductMatchExplanationDto` used by `/api/product-match`.
- `matchScore` and `matchLevel` are not duplicated inside `matchExplanation`.
- Public DTO output must not expose raw MongoDB `_id`, raw `userId`, Auth.js account/session/provider data, OAuth tokens, refresh tokens, or secrets.

Errors:

- UNAUTHORIZED
- NOT_FOUND
- INTERNAL_ERROR

## 4.1 Personalized Product Match

### GET /api/product-match

Returns deterministic, educational product matches for the authenticated user based on their Skin Profile and the visible product catalogue.

Authentication and ownership:

- Required.
- The route derives `userId` from the authenticated session.
- The client must not send `userId`.
- If the user has no Skin Profile, the endpoint returns `skinProfileExists: false` with an empty `items` array.
- Product candidates are limited to the same visible/recommendable product statuses used by the product catalogue.
- Saved state is derived from the authenticated user's `saved_products` records.

Query params:

```txt
limit?: number = 12 // integer, min 1, max 24
```

Validation:

- Unknown query fields are rejected.
- Invalid `limit` values return `VALIDATION_ERROR`.
- The user-facing `limit` is applied after visible products are loaded, scored, sorted, and mapped.

Success response:

```json
{
  "data": {
    "skinProfileExists": true,
    "generatedAt": "2026-05-31T10:00:00.000Z",
    "skinProfileSummary": {
      "skinType": "oily",
      "concerns": ["acne"],
      "sensitivityLevel": "medium",
      "budgetRange": "300k_700k",
      "experienceLevel": "beginner",
      "avoidIngredientsCount": 1
    },
    "items": [
      {
        "product": {
          "id": "665000000000000000000320",
          "name": "Niacinamide 5% Serum",
          "brand": "SkinWise Demo",
          "category": "serum",
          "priceRange": "budget",
          "ingredientsText": "Water, Niacinamide...",
          "keyActives": ["Niacinamide"],
          "tags": ["oiliness-support"],
          "warnings": [],
          "skinTypes": ["oily"],
          "concerns": ["acne", "oiliness"],
          "suitableFor": ["beginner serum step"],
          "notRecommendedFor": [],
          "verificationStatus": "verified",
          "createdAt": "2026-05-31T00:00:00.000Z",
          "updatedAt": "2026-05-31T00:00:00.000Z"
        },
        "matchScore": 85,
        "matchLevel": "strong",
        "reasons": ["Phù hợp với da dầu của bạn."],
        "cautions": [
          "Nên xem kỹ bảng thành phần và thử trên một vùng da nhỏ trước khi sử dụng rộng rãi.",
          "Đây là thông tin tham khảo, không phải tư vấn y tế."
        ],
        "matchedSignals": {
          "skinType": true,
          "concerns": ["acne"],
          "budget": true,
          "sensitivity": false,
          "avoidedIngredients": []
        },
        "isSaved": false,
        "matchExplanation": {
          "summary": "Sản phẩm này có thể phù hợp với hồ sơ da của bạn dựa trên dữ liệu sản phẩm hiện có và điểm phù hợp 85/100.",
          "positiveReasons": [
            {
              "type": "skin_concern_support",
              "message": "Sản phẩm có metadata liên quan đến mụn trong hồ sơ của bạn.",
              "relatedIngredients": ["Niacinamide"],
              "relatedConcerns": ["acne"]
            }
          ],
          "cautionReasons": [
            {
              "type": "match_caution",
              "message": "Nên xem kỹ bảng thành phần và thử trên một vùng da nhỏ trước khi sử dụng rộng rãi."
            }
          ],
          "ingredientHighlights": [
            {
              "ingredientName": "Niacinamide",
              "effect": "positive",
              "reason": "Dữ liệu sản phẩm liệt kê thành phần này trong bảng thành phần hoặc hoạt chất nổi bật; SkinWise dùng metadata hiện có để hỗ trợ giải thích matching."
            }
          ],
          "usageNote": "Hãy patch test trước và đưa sản phẩm vào routine từ từ, đặc biệt nếu da bạn nhạy cảm, đang kích ứng hoặc đang phản ứng.",
          "dataQualityNotes": []
        }
      }
    ]
  },
  "error": null
}
```

No-profile response:

```json
{
  "data": {
    "skinProfileExists": false,
    "generatedAt": "2026-05-31T10:00:00.000Z",
    "items": []
  },
  "error": null
}
```

Error response:

```json
{
  "data": null,
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Expected errors:

| Status | Code | Reason |
|---:|---|---|
| 401 | `UNAUTHORIZED` | User is not authenticated |
| 400 | `VALIDATION_ERROR` | Query params are invalid |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

DTO notes:

- `ProductMatchResponseDto` is returned directly inside `data`; it is not returned raw and is not wrapped as `data.productMatch`.
- `skinProfileSummary` is optional. It is present when the authenticated user has a Skin Profile and omitted in the current no-profile response.
- `product` uses the existing public `ProductDto`.
- `isSaved` is a boolean derived from the current user's saved products.
- `matchScore` is clamped from 0 to 100.
- `matchLevel` is one of `strong`, `good`, `cautious`, or `low`.
- Avoided-ingredient matches and high-sensitivity plus strong-warning matches cannot be labeled `strong`.
- `reasons` and `cautions` are user-facing Vietnamese strings.
- `matchExplanation` is optional for backward compatibility. Current producers include it when product matching is generated through the mapper.
- `matchExplanation` is deterministic and rule-based. It is derived from existing score, level, reasons, cautions, matched signals, and public product metadata already loaded for matching.
- `matchExplanation.ingredientHighlights` only uses existing product ingredient text, key actives, and avoided-ingredient matches. It does not join ingredient-library documents or invent ingredient facts.
- Missing profile returns the existing `skinProfileExists: false` response. Missing ingredient or fit metadata returns limited-data notes instead of speculative claims.
- The client validator accepts older responses without `matchExplanation`, accepts valid extended responses, and drops malformed optional `matchExplanation` data so the UI falls back safely.
- Raw product names, brand names, ingredient names, user-entered avoided ingredients, IDs, and API enum values are not translated in the DTO.

Safety boundary:

- Product Match is deterministic and rule-based.
- It does not call external AI providers.
- It does not diagnose, prescribe, guarantee results, score skin or appearance, or claim a product cures, treats, fixes, heals, removes, or prevents a condition.
- It reuses existing collections and does not create a new recommendation collection.
- User-facing reasons, cautions, explanations, usage notes, and data-quality notes must remain educational and cautious.
- Full personalized explanations are available on Product Match result cards and Product Detail through `GET /api/products/:id/match`.
- Catalogue/list pages do not compute full personalized explanations to avoid extra catalogue-wide matching or ingredient loading work.

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
        "decisionStatus": "testing",
        "plannedRoutineSlot": "evening",
        "personalNote": "Muốn thử sau khi routine hiện tại ổn định hơn.",
        "tags": ["To buy", "Patch test"],
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
- `SavedProductDto` must not expose `_id`, `ObjectId`, owner, ownership fields,
  or Mongo internals.
- Optional personal metadata may include only `decisionStatus`,
  `plannedRoutineSlot`, `personalNote`, and private user-owned `tags`.
- Product data is returned through the existing public `ProductDto`.
- Personal saved-product tags are not exposed through public product catalogue or
  product detail APIs.

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
      "tags": [],
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

### PATCH /api/saved-products/:productId

Update private personal decision-support metadata for the current
authenticated user's saved product.

Request:

```json
{
  "decisionStatus": "testing",
  "plannedRoutineSlot": "evening",
  "personalNote": "Muốn thử sau khi routine hiện tại ổn định hơn.",
  "tags": ["To buy", "Patch test"]
}
```

Validation and behavior:

- Authentication is required.
- `productId` route param must be a valid MongoDB ObjectId string.
- Request body is strict.
- At least one supported metadata field is required.
- Supported `decisionStatus` values:
  `considering`, `testing`, `paused`, `kept`.
- Supported `plannedRoutineSlot` values:
  `morning`, `evening`, `either`, `not_sure`.
- `personalNote` is trimmed.
- `personalNote` maximum length is 1000 characters.
- Empty `personalNote` after trimming is accepted and clears the note.
- `tags` is an optional array of private personal tag labels.
- Tags are trimmed.
- Empty tags are rejected.
- Duplicate tags on the same saved product are rejected case-insensitively.
- Maximum tag length is 30 characters.
- Maximum tags per saved product is 8.
- Tags may contain letters, numbers, spaces, hyphen, and underscore only.
- Missing saved-product tags are returned to clients as an empty array.
- Unknown fields are rejected.
- Client-submitted internal/ownership fields are rejected, including `id`, `_id`,
  `userId`, `productId`, `createdAt`, `updatedAt`, `product`, `owner`, and
  `ownership`.
- Update is scoped by `currentUser.id + productId`.
- Only `decisionStatus`, `plannedRoutineSlot`, `personalNote`, `tags`, and
  server-owned `updatedAt` may be written.
- Updating `tags` must preserve existing `decisionStatus`, `plannedRoutineSlot`,
  and `personalNote` unless those fields are explicitly included in the same
  request.

Response:

```json
{
  "data": {
    "item": {
      "id": "saved_product_123",
      "productId": "665000000000000000000320",
      "product": {
        "id": "665000000000000000000320",
        "name": "Niacinamide 5% Serum"
      },
      "decisionStatus": "testing",
      "plannedRoutineSlot": "evening",
      "personalNote": "Muốn thử sau khi routine hiện tại ổn định hơn.",
      "tags": ["To buy", "Patch test"],
      "createdAt": "2026-05-26T00:00:00.000Z",
      "updatedAt": "2026-06-13T00:00:00.000Z"
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
- Admin ingredient create/edit lite uses `/api/admin/ingredients` routes and
  requires `ADMIN` role.

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

### GET /api/admin/ingredients

Implementation status: MVP v1.60 admin ingredient create/edit lite.

Lists Ingredient Library records for admin management. This is a separate
admin-only route and does not broaden public write behavior.

Authentication and authorization:

- Requires authenticated user.
- Requires `AppUserProfile.role = "ADMIN"`.
- Role is read from `AppUserProfile`, not from client input or raw session
  claims.

Query params:

```txt
q?: string
function?: string
limit?: number
```

Search behavior:

- `q` searches `inciName`, `aliases`, `functions`, and `commonUses`.
- `function` filters by an existing function string.
- Results are sorted by `inciName` and limited to a max of 50.

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "ingredient_123",
        "inciName": "Niacinamide",
        "aliases": ["Vitamin B3"],
        "functions": ["barrier_support"],
        "evidenceLevel": "moderate",
        "sourceRefs": ["manual-curation"]
      }
    ]
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- INTERNAL_ERROR

### POST /api/admin/ingredients

Implementation status: MVP v1.60 admin ingredient create/edit lite.

Creates an Ingredient Library record through the admin-only workflow.

Request:

```json
{
  "inciName": "Niacinamide",
  "aliases": ["Vitamin B3"],
  "functions": ["barrier_support"],
  "commonUses": ["barrier support"],
  "suitableFor": ["oily skin"],
  "cautionFor": ["very sensitive skin"],
  "avoidWith": ["known sensitivity"],
  "evidenceLevel": "moderate",
  "sourceRefs": ["manual-curation"]
}
```

Validation and server-side rules:

- `inciName` is required, trimmed, non-empty, and max 160 chars.
- `evidenceLevel` must be one of `basic`, `moderate`, `strong`, or
  `uncertain`.
- Array fields are trimmed, empty items are removed, and ordering is preserved.
- `sourceRefs` remains `string[]`; each item is trimmed and max 500 chars.
- Client-submitted `_id`, `id`, `createdAt`, and `updatedAt` are rejected.
- Server sets `createdAt` and `updatedAt`.
- Duplicate normalized `inciName` values are rejected case-insensitively with
  `CONFLICT`.

Errors:

- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- CONFLICT
- INTERNAL_ERROR

### PATCH /api/admin/ingredients/:id

Implementation status: MVP v1.60 admin ingredient create/edit lite.

Partially updates editable Ingredient Library fields.

Validation and server-side rules:

- `id` must be a MongoDB ObjectId string; invalid ids return
  `VALIDATION_ERROR` / HTTP 400.
- Valid ids with no matching ingredient return `NOT_FOUND` / HTTP 404.
- Partial updates are supported.
- If `inciName` is provided, it must be trimmed and non-empty.
- Updating `inciName` checks duplicate normalized names against other
  ingredients; keeping the same ingredient's own `inciName` is allowed.
- `evidenceLevel` must use the existing enum when provided.
- Array fields are normalized the same way as create.
- Client-submitted `_id`, `id`, `createdAt`, and `updatedAt` are rejected.
- Server updates `updatedAt` and preserves omitted fields.

Errors:

- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- NOT_FOUND
- CONFLICT
- INTERNAL_ERROR

Notes:

- v1.60 does not add ingredient delete, soft delete, publish/unpublish,
  merge/deduplication, bulk import/export, image upload, AI auto-generation, or
  product-to-ingredient relational mapping.

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

RoutineLog API currently supports authenticated, user-scoped daily routine tracking for both the `/routines` page and the dedicated `/routine-logs/today` checklist page.

Supported endpoints:

1. `GET /api/routine-logs?localDate=YYYY-MM-DD`
2. `PUT /api/routine-logs`
3. `DELETE /api/routine-logs/:id`

`POST /api/routine-logs` is intentionally not used in the MVP because `PUT /api/routine-logs` is the canonical idempotent create/update endpoint for `userId + routineId + localDate`.

### GET /api/routine-logs?localDate=YYYY-MM-DD

Fetch RoutineLog DTOs for the authenticated user on a specific local calendar date.

Authentication and ownership:

- Requires authenticated user.
- Server derives `userId` from the session.
- Client must not submit `userId`.
- Only logs owned by the authenticated user are returned.

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

### PUT /api/routine-logs

Idempotently create or update one RoutineLog for the authenticated user by `userId + routineId + localDate`.

Authentication and ownership:

- Requires authenticated user.
- Server derives `userId` from the session.
- Client must not submit `userId`.
- Target routine must belong to the authenticated user.

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
- `localDate` is required and must use `YYYY-MM-DD`.
- `localDate` is stored as a string, not a JavaScript Date.
- `timezone` is required as a non-empty string.
- `status` must be one of `completed`, `partial`, or `skipped`.
- `completedStepIds` is optional and must contain RoutineStep `stepId` values from the target routine when provided.
- Unknown completed step IDs return `VALIDATION_ERROR`.
- `partial` logs require at least one completed step and fewer than all routine steps.
- `skipped` logs must omit `completedStepIds` or keep it empty.
- `note` is optional, trimmed, and max 500 characters.
- Client-submitted `userId`, `id`, `_id`, `createdAt`, `updatedAt`, and unknown fields are rejected.

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

### DELETE /api/routine-logs/:id

Delete a RoutineLog owned by the authenticated user.

Authentication and ownership:

- Requires authenticated user.
- Server derives `userId` from the session.
- Client must not submit `userId`.
- The API must not delete another user's RoutineLog.
- The API returns `NOT_FOUND` when the log is missing, invalid, or not owned by the current user. This keeps ownership details private.

Response:

```json
{
  "data": {
    "deleted": true
  },
  "error": null
}
```

Errors:

- UNAUTHORIZED
- NOT_FOUND
- INTERNAL_ERROR

Usage notes:

- `/routines` uses RoutineLog GET/PUT controls for daily routine status updates.
- `/routine-logs/today` uses RoutineLog GET/PUT for the dedicated daily checklist and DELETE `/api/routine-logs/:id` to remove an existing routine log.
- DELETE removes only the matching RoutineLog record; it does not delete routines, routine analyses, skin profile records, journal entries, saved products, Auth.js identity records, or other user data.

## 10. Dashboard

### GET /api/dashboard?localDate=YYYY-MM-DD

Returns the authenticated user's MVP dashboard summary for the requested browser/user local date, including additive closeout summary fields for profile completion, saved products, routine coverage, 7-day routine consistency, and 7-day journal trend.

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
    "dashboard": {
      "skinProfile": {},
      "routines": {},
      "routineCoverage": {
        "hasRoutines": false,
        "totalRoutines": 0,
        "hasMorningRoutine": false,
        "hasEveningRoutine": false,
        "hasMorningSunscreen": false,
        "hasMoisturizer": false,
        "summary": "string",
        "coverageItems": [],
        "cautionItems": [],
        "nextAction": {
          "label": "string",
          "description": "string",
          "actionType": "create-routine",
          "href": "/routines"
        }
      },
      "todayRoutineLogs": {},
      "latestRoutineAnalysis": {},
      "latestJournal": {},
      "profileCompletion": {
        "percentage": 0,
        "completedFields": 0,
        "totalFields": 5,
        "missingFields": ["skinType", "concerns", "sensitivityLevel", "budgetRange", "experienceLevel"]
      },
      "savedProducts": {
        "count": 0
      },
      "savedProductTags": {
        "totalSavedProducts": 0,
        "taggedProductCount": 0,
        "untaggedProductCount": 0,
        "topTags": []
      },
      "savedProductDecisionQueue": {
        "totalSavedProducts": 0,
        "consideringCount": 0,
        "testingCount": 0,
        "pausedCount": 0,
        "keptCount": 0,
        "unsetDecisionStatusCount": 0,
        "withoutPlannedRoutineSlotCount": 0,
        "withoutPersonalNoteCount": 0,
        "reviewNeededCount": 0,
        "nextAction": {
          "label": "Xem lại sản phẩm đã lưu",
          "description": "Lưu sản phẩm để bắt đầu xây dựng hàng chờ xem lại.",
          "href": "/saved-products"
        }
      },
      "routineConsistency": {
        "completedDays": 0,
        "totalDays": 7,
        "rate": 0,
        "label": "needs_attention"
      },
      "journalTrend": {
        "recentEntries": 0,
        "status": "not_enough_data"
      },
      "nextActions": []
    }
  },
  "error": null
}
```

`routineCoverage` response shape:

```ts
routineCoverage: {
  hasRoutines: boolean;
  totalRoutines: number;
  hasMorningRoutine: boolean;
  hasEveningRoutine: boolean;
  hasMorningSunscreen: boolean;
  hasMoisturizer: boolean;
  summary: string;
  coverageItems: Array<{
    id:
      | "routine-created"
      | "morning-routine"
      | "evening-routine"
      | "morning-sunscreen"
      | "moisturizer";
    label: string;
    status: "complete" | "note" | "missing";
    description: string;
  }>;
  cautionItems: Array<{
    id:
      | "missing-morning-sunscreen"
      | "missing-moisturizer"
      | "multiple-treatments";
    label: string;
    description: string;
    severity: "info" | "caution";
  }>;
  nextAction: {
    label: string;
    description: string;
    actionType:
      | "create-routine"
      | "review-morning-routine"
      | "review-moisturizer"
      | "review-treatment-pacing"
      | "keep-monitoring";
    href: string;
  };
};
```

`savedProductTags` response shape:

```ts
savedProductTags: {
  totalSavedProducts: number;
  taggedProductCount: number;
  untaggedProductCount: number;
  topTags: Array<{
    label: string;
    count: number;
  }>;
};
```

Saved product tag summary notes:

- `topTags` only reflects user personal tags on saved products.
- `topTags` does not imply recommendation ranking.
- `topTags` does not include global product tags.
- No `userId` or `ObjectId` is returned.
- User-generated tag labels are returned as labels and should not be treated as system-generated recommendations.

`savedProductDecisionQueue` response shape:

```ts
savedProductDecisionQueue: {
  totalSavedProducts: number;
  consideringCount: number;
  testingCount: number;
  pausedCount: number;
  keptCount: number;
  unsetDecisionStatusCount: number;
  withoutPlannedRoutineSlotCount: number;
  withoutPersonalNoteCount: number;
  reviewNeededCount: number;
  nextAction: {
    label: string;
    description: string;
    href: string;
  };
};
```

Saved product decision queue notes:

- `totalSavedProducts` is the number of current user's saved-product records read by the dashboard use case.
- `consideringCount`, `testingCount`, `pausedCount`, and `keptCount` count only supported `decisionStatus` values.
- `unsetDecisionStatusCount` counts missing, null, undefined, empty, or whitespace-only decision status values.
- `withoutPlannedRoutineSlotCount` counts missing, null, undefined, empty, or whitespace-only planned routine slot values.
- `withoutPersonalNoteCount` counts missing, null, undefined, empty, or whitespace-only personal notes.
- `reviewNeededCount` counts each saved product at most once when it has a blank decision status, unknown non-blank decision status, blank planned routine slot, blank personal note, `decisionStatus: "considering"`, or `decisionStatus: "testing"`.
- Unknown non-blank decision status values are not displayed as supported categories and are treated as review-needed.
- `nextAction.href` points to `/saved-products`.
- This field is read-only and does not mutate, normalize, or backfill saved-product records.
- This field does not change Product Match scoring, Routine Safety logic, or AI behavior.
- No `userId`, `_id`, raw `ObjectId`, or public product API saved-product metadata is exposed.

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


## Account data control APIs

### `GET /api/account/export`

- Requires authentication.
- The server derives the current user id from the authenticated session; the endpoint does not accept `userId` from request body, query string, route params, headers, or client input.
- Returns the standard SkinWise API envelope with `data.export`.
- The exported JSON download in Settings must contain only `body.data.export`, not the full `{ data, error }` API wrapper.
- Includes `schemaVersion`, `exportedAt`, safe current-user profile fields, app profile status, skin profile, saved products, routines, routine logs, routine analyses, and skin journal entries owned by the current user.
- Converts MongoDB ObjectId values to string `id` fields and Date values to ISO strings.
- Does not expose raw MongoDB `_id`, `userId`, Auth.js sessions, OAuth accounts, provider tokens, refresh tokens, verification tokens, or secrets.
- Does not export the full shared product or ingredient catalogue. Saved product exports may include minimal linked product metadata such as product id, name, brand, category, and key actives.

Success response:

```json
{
  "data": {
    "export": {
      "schemaVersion": "1.0",
      "exportedAt": "2026-06-01T00:00:00.000Z",
      "user": {
        "id": "auth-user-id",
        "email": "an@example.com",
        "name": "An"
      },
      "appProfile": {
        "role": "USER",
        "onboardingCompleted": true,
        "accountDeletionRequestStatus": "not_requested",
        "createdAt": "2026-05-01T00:00:00.000Z",
        "updatedAt": "2026-05-02T00:00:00.000Z"
      },
      "skinProfile": null,
      "savedProducts": [],
      "routines": [],
      "routineLogs": [],
      "routineAnalyses": [],
      "skinJournals": []
    }
  },
  "error": null
}
```

Expected errors:

- `UNAUTHORIZED`
- `INTERNAL_ERROR`

### `DELETE /api/account/app-data`

- Requires authentication.
- Deletes only the current authenticated user's skincare application data.
- The endpoint is not full account deletion and does not delete Auth.js identity collections.
- The server derives the current user id from the authenticated session; the endpoint does not accept client-submitted `userId`.
- Deletes user-owned records from `skin_profiles`, `saved_products`, `routines`, `routine_logs`, `routine_analyses`, and `skin_journals`.
- Does not delete `products`, `ingredients`, `users`, `accounts`, `sessions`, `verification_tokens`, shared catalogue data, or another user's data.
- Does not delete the `app_user_profiles` document by default. It preserves `role`, `createdAt`, account deletion request metadata, and account-level metadata. It resets `onboardingCompleted` to `false` when needed and updates `updatedAt` only when that reset happens, so the app returns to an onboarding-safe empty state without changing profile metadata on repeated calls.
- Uses narrowly scoped delete operations with `{ userId: currentUser.id }`; broad `deleteMany({})` operations are not allowed.
- Idempotent: if no skincare app data exists, returns success with zero counts.
- If any delete/reset operation fails, returns `INTERNAL_ERROR` and does not return `deleted: true`.

Success response:

```json
{
  "data": {
    "deleted": true,
    "deletedAt": "2026-06-01T00:00:00.000Z",
    "deletedCounts": {
      "skinProfiles": 1,
      "savedProducts": 5,
      "routines": 2,
      "routineLogs": 14,
      "routineAnalyses": 3,
      "skinJournals": 8
    },
    "appUserProfile": {
      "preserved": true,
      "onboardingCompletedReset": true
    }
  },
  "error": null
}
```

Expected errors:

- `UNAUTHORIZED`
- `INTERNAL_ERROR`

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

## 12. Post-MVP v1.3 Insights API

### GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD

Returns routine consistency, journal activity, product usage, calendar summaries, and safe next actions for the authenticated user.

Authentication:

- Required.
- The route derives ownership from the authenticated session.
- Client-submitted `userId` is not accepted.
- Unauthenticated requests return `UNAUTHORIZED`.

Query params:

```txt
from?: YYYY-MM-DD
to?: YYYY-MM-DD
```

Validation:

- `from` and `to` may both be omitted; the use case then defaults to the latest 30 days including today.
- If one date is provided, the other is required.
- Dates must match `YYYY-MM-DD`.
- Dates must be real calendar dates.
- `from` must be before or equal to `to`.
- Range length must not exceed 90 days.
- Unknown query fields are rejected.

Success response:

```json
{
  "data": {
    "insights": "InsightsDto"
  },
  "error": null
}
```

Error response:

```json
{
  "data": null,
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Expected errors:

| Status | Code | Reason |
|---:|---|---|
| 401 | `UNAUTHORIZED` | User is not authenticated |
| 400 | `VALIDATION_ERROR` | Query params are invalid |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

### InsightsDto

The active Insights contract is routine-slot based because users may have multiple routines per day.

```ts
type InsightsDto = {
  dateRange: {
    from: string;
    to: string;
    totalDays: number;
  };
  routineConsistency: {
    totalRoutineSlots: number;
    completedRoutineSlots: number;
    partialRoutineSlots: number;
    skippedRoutineSlots: number;
    notLoggedRoutineSlots: number;
    completionRate: number;
    maintainedDays: number;
    currentStreak: number;
    bestStreak: number;
  };
  journalActivity: {
    totalEntries: number;
    activeJournalDays: number;
    mostCommonSymptoms: {
      symptom: string;
      count: number;
    }[];
  };
  productUsage: {
    mostUsedProducts: {
      productId: string;
      name: string;
      brand?: string;
      count: number;
    }[];
  };
  calendarDays: {
    localDate: string;
    routineSummary: {
      totalRoutines: number;
      completed: number;
      partial: number;
      skipped: number;
      notLogged: number;
      dayStatus: "completed" | "partial" | "skipped" | "not_logged";
    };
    hasJournalEntry: boolean;
    symptoms: string[];
  }[];
  nextActions: {
    label: string;
    description?: string;
    href: string;
    priority: "high" | "medium" | "low";
  }[];
};
```

Routine consistency:

- `totalRoutineSlots = totalDays * totalRoutines`.
- Completion rate is rounded from completed routine slots over total routine slots.
- If `totalRoutineSlots = 0`, `completionRate = 0`.
- `maintainedDays`, `currentStreak`, and `bestStreak` are based on completed calendar days.

Calendar day status priority:

1. `not_logged` when no routine exists or no routine slot was logged.
2. `completed` when all routine slots were completed.
3. `skipped` when all routine slots were skipped.
4. `partial` for any mixed logged state, including skipped plus missing slots.

Product usage:

- Uses product IDs recorded in the authenticated user's SkinJournal entries.
- Resolves product names and brands through visible product lookup.
- Skips invalid, missing, hidden, deleted, or unauthorized products.
- Does not make causal claims about product effects.
