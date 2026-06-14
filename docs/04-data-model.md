# 04-data-model.md

# Data Model — MVP v1.2.6

## 1. General rules

- Every user-owned collection must include `userId`.
- Every mutable collection must include `createdAt` and `updatedAt`.
- Sensitive data must be minimized.
- Image upload, storage, and image analysis are not part of MVP. Reserved future image fields must remain private and must not be exposed in MVP API request/response contracts.
- AI outputs must store model metadata for debugging.
- Historical analysis must not silently change when product data changes later.
- Database documents may use `_id: ObjectId`, but API DTOs must expose `id: string`.
- Required indexes must be created by a repeatable `npm run db:indexes` script; do not create indexes ad hoc inside route handlers.

## 2. Authentication identity and AppUserProfile

### Auth.js identity ownership

MVP uses **Auth.js with MongoDB Adapter**.

Auth.js owns authentication identity collections:

```txt
users
accounts
sessions
verification_tokens
```

SkinWise must not create a second unclear `User` model that duplicates Auth.js identity responsibility. The Auth.js `users` collection is the identity source of truth.

### AppUserProfile

SkinWise owns app-specific user fields in a separate profile collection.

```ts
type AppUserProfile = {
  _id: ObjectId;
  userId: ObjectId; // references Auth.js users._id
  role: "USER" | "ADMIN";
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```


MVP role policy:

- `USER` and `ADMIN` are the only roles implemented in MVP.
- `CONTENT_REVIEWER` is post-MVP and must not be implemented unless the SDD is explicitly revised.

### Indexes

```txt
unique index: userId
index: role
```

### Ownership convention

All SkinWise domain records use `userId` to reference the authenticated Auth.js user id.

Server code must always derive `userId` from the authenticated session. It must never trust `userId` from request body data.

## 3. SkinProfile

```ts
type SkinProfile = {
  _id: ObjectId;
  userId: ObjectId;
  skinType: "oily" | "dry" | "combination" | "normal" | "sensitive" | "unknown";
  concerns: Array<"acne" | "oiliness" | "dryness" | "redness" | "dark_spots" | "texture" | "barrier_support" | "unknown">;
  sensitivityLevel: "low" | "medium" | "high" | "unknown";
  budgetRange: "under_300k" | "300k_700k" | "700k_1500k" | "above_1500k";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  avoidIngredients: string[];
  createdAt: Date;
  updatedAt: Date;
};
```

### Indexes

```txt
unique index: userId
index: skinType
index: concerns
```

## 4. Product

```ts
type Product = {
  _id: ObjectId;
  name: string;
  brand: string;
  category: "cleanser" | "moisturizer" | "sunscreen" | "treatment" | "toner" | "serum" | "mask" | "other";
  priceRange: "budget" | "mid" | "premium" | "unknown";
  ingredientsText: string;
  keyActives: string[];
  tags: string[];
  warnings: string[];

  // Product-fit fields for later Product Fit Checker and Budget Routine Builder.
  skinTypes: Array<"oily" | "dry" | "combination" | "normal" | "sensitive" | "unknown">;
  concerns: Array<"acne" | "oiliness" | "dryness" | "redness" | "dark_spots" | "texture" | "barrier_support" | "unknown">;
  suitableFor: string[];
  notRecommendedFor: string[];

  source: "manual" | "admin" | "user_submitted";
  verificationStatus: "unverified" | "reviewed" | "verified";
  createdByUserId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
```

### Why add product-fit fields?

The MVP may not fully implement Product Fit Checker, but these fields prevent future over-reliance on AI guessing from raw ingredient text. They make product matching more deterministic, auditable, and scalable.

### Indexes

```txt
text index: name, brand, ingredientsText
index: brand
index: category
index: priceRange
index: keyActives
index: skinTypes
index: concerns
index: verificationStatus
```

## 5. SavedProduct

```ts
type SavedProduct = {
  _id: ObjectId;
  userId: string;
  productId: ObjectId;
  decisionStatus?: "considering" | "testing" | "paused" | "kept";
  plannedRoutineSlot?: "morning" | "evening" | "either" | "not_sure";
  personalNote?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

Saved Products are user-owned bookmarks for visible products. v1.39 adds
optional private decision-support metadata to help users remember why they saved
a product, whether they are considering/testing/pausing/keeping it, where they
may use it in a routine, and any personal note before routine changes.

The public DTO includes the saved record id, `productId`, product DTO, optional
decision-support metadata, and timestamps, but never exposes `userId`, `_id`,
`ObjectId`, owner, ownership fields, or Mongo internals.

### Indexes

```txt
compound unique index: userId, productId
compound index: userId, createdAt
```

Duplicate saves for the same user and product are prevented at the database layer. Delete operations remove only the saved-product record and never delete the product.

## 6. Ingredient

```ts
type Ingredient = {
  _id: ObjectId;
  inciName: string;
  aliases: string[];
  functions: string[];
  commonUses: string[];
  suitableFor: string[];
  cautionFor: string[];
  avoidWith: string[];
  evidenceLevel: "basic" | "moderate" | "strong" | "uncertain";
  sourceRefs: string[];
  createdAt: Date;
  updatedAt: Date;
};
```

### Indexes

```txt
unique index: inciName
index: aliases
text index: inciName, aliases, functions
```

## 7. Routine

```ts
type Routine = {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  timeOfDay: "morning" | "evening";
  steps: RoutineStep[];
  createdAt: Date;
  updatedAt: Date;
};
```

## 8. RoutineStep

```ts
type RoutineStep = {
  stepId: string;
  productId?: ObjectId;
  customProductName?: string;
  category: "cleanser" | "moisturizer" | "sunscreen" | "treatment" | "toner" | "serum" | "mask" | "other";
  order: number;
  frequency: "daily" | "weekly_1_2" | "weekly_3_4" | "as_needed";
  instructions?: string;

  // Snapshot fields preserve historical analysis stability.
  productNameSnapshot?: string;
  brandSnapshot?: string;
  keyActivesSnapshot?: string[];
  ingredientTextSnapshot?: string;
};
```

### Why add snapshot fields?

Product data may change after an analysis is created. Snapshots allow the system to preserve what was actually analyzed at that time. This is useful for debugging, trust, and reproducibility.

### Routine indexes

```txt
compound index: userId, timeOfDay
compound index: userId, updatedAt
```

## 9. RoutineLog

```ts
type RoutineLog = {
  _id: ObjectId;
  userId: string;
  routineId: string;
  localDate: string; // YYYY-MM-DD in user's local timezone
  timezone: string; // IANA timezone, e.g. Asia/Ho_Chi_Minh
  status: "completed" | "partial" | "skipped";
  completedStepIds?: string[]; // RoutineStep.stepId values
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### Why separate RoutineLog from SkinJournal?

RoutineLog tracks behavior: whether a user completed, partially completed, or skipped a routine on a local calendar date. SkinJournal tracks observations: what the user noticed about their skin. Keeping them separate improves analytics and avoids mixing objective routine completion with subjective skin notes.

### RoutineLog MVP rules

```txt
localDate is stored as a YYYY-MM-DD string, not as a JavaScript Date.
timezone is stored as a string, for example Asia/Ho_Chi_Minh.
One log is allowed per userId + routineId + localDate.
completedStepIds refer to RoutineStep.stepId values.
status controls the behavior meaning: completed, partial, skipped.
note is optional and short-form only.
```

### Indexes

```txt
compound unique index: userId, routineId, localDate
compound index: userId, localDate
compound index: userId, routineId
```

## 10. RoutineAnalysis

```ts
type RoutineAnalysis = {
  _id: ObjectId;
  userId: ObjectId;
  routineId: ObjectId;
  routineSnapshot: {
    name: string;
    timeOfDay: "morning" | "evening";
    steps: RoutineStep[];
  };
  riskLevel: "low" | "medium" | "high"; // top-level value derived from rule engine, not AI override
  ruleResults: RuleResult[];
  aiResult: RoutineAnalysisResult;
  modelProvider: string;
  modelName: string;
  promptVersion: string;
  createdAt: Date;
};
```

```ts
type RuleResult = {
  code: string;
  severity: "low" | "medium" | "high";
  message: string;
  triggered: boolean;
  metadata?: Record<string, unknown>;
};
```

### RuleResult storage policy

Database should store **all** rule results, including `triggered: false`, for audit/debug and deterministic reproducibility.

API responses shown to users should expose only triggered warnings to avoid confusion and UI noise.

`RoutineAnalysis.riskLevel` is stored top-level for queryability and dashboard filtering. It must be derived from the deterministic rule engine result, while the AI explanation must not override it.

### Indexes

```txt
compound index: userId, routineId
compound index: userId, createdAt
compound index: userId, riskLevel, createdAt
index: promptVersion
index: modelName
```

## 11. SkinJournal

```ts
type SkinJournal = {
  _id: ObjectId;
  userId: ObjectId;
  localDate: string; // YYYY-MM-DD in user's local timezone
  timezone: string; // IANA timezone, e.g. Asia/Ho_Chi_Minh
  productsUsed: ObjectId[];
  observations: string[];
  symptoms: Array<"dryness" | "oiliness" | "redness" | "stinging" | "new_breakouts" | "itchiness" | "other">;
  sleepHours?: number;
  stressLevel?: "low" | "medium" | "high";
  // Reserved future fields only.
  // Do not expose in MVP API request/response.
  // Do not implement upload, storage, or image analysis in Week 1/MVP.
  imageUrl?: string;
  imageStorageKey?: string;
  imageVisibility?: "private";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};
```


### MVP image-field policy

The image fields above are reserved for future private image upload only. They must not be exposed in MVP SkinJournal API request/response contracts and must not trigger implementation of image upload, storage, public image URLs, or AI image analysis during Week 1/MVP.

### Indexes

```txt
compound unique index: userId, localDate
compound index: userId, createdAt
```

MVP product decision:

- SkinWise allows one SkinJournal entry per user per `localDate`.
- If the user edits the same day, use `PATCH /api/skin-journal/:id`.
- Multiple journal entries per day can be considered as a future product change, but is out of MVP scope.


## 12. Daily tracking date strategy

RoutineLog and SkinJournal must use `localDate` plus `timezone` instead of relying only on JavaScript `Date` for daily tracking.

Reason:

- Users think in local calendar days, not UTC timestamps.
- A log created late at night in Vietnam can shift to the previous or next UTC day if stored only as a timestamp.
- Querying by `localDate` makes dashboard, streak, completion rate, and journal timeline more predictable.

Rules:

```txt
localDate format: YYYY-MM-DD
localDate validation regex: /^\d{4}-\d{2}-\d{2}$/
timezone format: IANA timezone string, e.g. Asia/Ho_Chi_Minh
createdAt / updatedAt: still stored as Date timestamps
```

Date range queries should compare `localDate` lexicographically because `YYYY-MM-DD` sorts correctly as a string.

Example:

```ts
{
  userId,
  localDate: {
    $gte: "2026-05-01",
    $lte: "2026-05-31"
  }
}
```

## 13. Ownership and privacy fields

All user-owned objects must include `userId`.

User-owned collections:

- SkinProfile
- Routine
- RoutineLog
- RoutineAnalysis
- SkinJournal
- SavedProduct
- User-submitted Product data

Ownership check rule:

```txt
Never load by objectId alone.
Always load by objectId + currentUser.id.
```

Example:

```ts
findOne({ _id: routineId, userId: currentUser.id })
```

## 14. MongoDB index strategy

MongoDB indexes should support high-frequency reads:

- User profile lookup by userId.
- Routine lookup by userId.
- RoutineLog lookup by userId/localDate.
- Journal timeline by userId and localDate.
- Product search by text.
- Saved products by user and newest saved date.
- Ingredient search by aliases.

Use MongoDB Atlas Performance Advisor after MVP to identify slow queries and refine indexes.


## 15. Daily tracking validation rules

`RoutineLog` and `SkinJournal` use `localDate` and `timezone` instead of a bare `Date` field for daily tracking.

Validation:

```txt
localDate must match /^\d{4}-\d{2}-\d{2}$/
timezone must be an IANA timezone string, for example "Asia/Ho_Chi_Minh"
```

Range queries can compare `localDate` lexicographically because `YYYY-MM-DD` sorts in chronological order:

```ts
{
  userId,
  localDate: {
    $gte: "2026-05-01",
    $lte: "2026-05-31"
  }
}
```


## AppUserProfile account deletion request marker

`AppUserProfile` includes `accountDeletionRequestedAt?: Date | null` as an MVP-safe account deletion request marker. This records that the authenticated user requested account deletion without automatically deleting Auth.js `users`, `accounts`, or `sessions` adapter documents. It allows the app to track the request while avoiding unsafe automatic hard-delete behavior in the portfolio MVP.
