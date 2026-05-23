# 08-test-plan.md

# Test Plan — MVP v1.2.6

## 1. Testing strategy

SkinWise VN uses layered tests:

```txt
Unit tests
Integration tests
E2E tests
AI eval tests
Security tests
```

## 2. Unit tests

### Domain rules

Test `RoutineSafetyEngine`.

Cases:

| Case | Expected |
|---|---|
| Morning routine without sunscreen | MISSING_SUNSCREEN_AM |
| Evening routine with AHA + BHA + retinoid | TOO_MANY_ACTIVES |
| Retinoid and exfoliant same night | RETINOID_PLUS_EXFOLIANT |
| Beginner routine with more than 7 steps | TOO_MANY_STEPS_BEGINNER |
| Sensitive profile with multiple fragrance products | FRAGRANCE_SENSITIVE_CAUTION |
| Basic routine with cleanser, moisturizer, sunscreen | low risk |

The canonical rule list is in:

```txt
docs/11-routine-safety-rules.md
```

### Validation schemas

Test Zod schemas for:

- SkinProfile.
- Product.
- Ingredient.
- Routine.
- RoutineStep.
- RoutineLog.
- SkinJournal.
- AI output.

### Snapshot behavior

Test that:

- RoutineStep stores product snapshot fields when productId is used.
- RoutineAnalysis stores routineSnapshot.
- Updating Product after analysis does not mutate older analysis snapshots.

## 3. Integration tests

### API tests

- Create skin profile.
- Update skin profile.
- Create product.
- Search products by skinType and concern.
- Create routine.
- Analyze owned routine via `POST /api/routines/:id/analyze`.
- Reject analysis of routine owned by another user.
- Return analysis history via `GET /api/routines/:id/analyses`.
- Create RoutineLog.
- Reject RoutineLog for another user's routine.
- Create journal entry using localDate/timezone.
- Reject invalid journal data.
- `GET /api/dashboard` returns latestJournal without `userId`, `_id`, ObjectId, or long notes.
- Dashboard next action prioritizes skin profile, routine, today's RoutineLog, today's SkinJournal, routine analysis, then up-to-date state.

### Database tests

- Product text search.
- Product filtering by skinTypes and concerns.
- RoutineLog date range query.
- Journal date range query.
- Routine lookup by userId.
- RoutineAnalysis history lookup.

### v1.2.6 execution guardrail tests

- `GET /api/me` lazily creates `AppUserProfile` when missing.
- API DTO mappers convert `_id/ObjectId` to `id: string`.
- SkinWise-owned API responses never expose raw MongoDB `ObjectId`.
- SkinJournal MVP API does not expose future-only image fields.
- Required database indexes can be created idempotently by `npm run db:indexes`.
- Feature flags default future/out-of-scope features to disabled.
- CI commands are present in `package.json` once implementation begins.
- PR checklist exists in `.github/pull_request_template.md`.

## 4. E2E tests

Use Playwright.

### Flow 1: Onboarding

1. User signs in.
2. User creates skin profile.
3. User sees dashboard.

### Flow 2: Routine analysis

1. User creates morning routine without sunscreen.
2. User clicks analyze.
3. Client calls `POST /api/routines/:id/analyze`.
4. User sees missing sunscreen warning.
5. User sees disclaimer.

### Flow 3: RoutineLog

1. User opens today's routine checklist.
2. User marks steps as completed/skipped.
3. User saves log.
4. Dashboard updates completion rate.
5. Dashboard recommends today's SkinJournal only after routine logging is handled.

### Flow 4: Journal

1. User creates journal entry.
2. User views timeline.
3. User edits entry.
4. User deletes entry.

## 5. AI eval tests

Create file:

```txt
tests/evals/routine-analysis-cases.json
```

Example cases:

```json
[
  {
    "caseId": "missing-sunscreen",
    "input": {
      "timeOfDay": "morning",
      "steps": ["cleanser", "moisturizer"]
    },
    "expectedWarnings": ["MISSING_SUNSCREEN_AM"],
    "expectedRiskLevel": "medium"
  },
  {
    "caseId": "too-many-actives",
    "input": {
      "timeOfDay": "evening",
      "steps": ["AHA toner", "BHA serum", "retinol cream"]
    },
    "expectedWarnings": ["TOO_MANY_ACTIVES"],
    "expectedRiskLevel": "high"
  }
]
```

AI eval checks:

- JSON schema compliance.
- Disclaimer exists.
- No diagnosis.
- No guarantee.
- Vietnamese explanation clarity.
- Must include expected warning codes.

## 6. Ingredient explainer tests

Test cases:

| Ingredient | Expected behavior |
|---|---|
| Niacinamide | Explain common cosmetic use without treatment guarantee |
| Salicylic Acid | Mention caution for beginners and overuse |
| Retinol | Mention beginner caution and avoid overclaiming |
| Fragrance | Mention sensitivity caution |
| Unknown ingredient | Return uncertainty instead of hallucinating |

## 7. Product fit tests

MVP does not need full recommendation ranking, but product-fit fields should be tested.

Cases:

- Product with `skinTypes: ["oily"]` appears in oily skin filter.
- Product with `concerns: ["dryness"]` appears in dryness filter.
- Product with `notRecommendedFor` is displayed as caution, not as hard diagnosis.

## 8. Security test checklist

```txt
[ ] User A cannot access User B skin profile.
[ ] User A cannot access User B routine.
[ ] User A cannot analyze User B routine.
[ ] User A cannot access User B RoutineLog.
[ ] User A cannot access User B journal.
[ ] Invalid ObjectId returns safe error.
[ ] API rejects missing auth.
[ ] API rejects invalid enum values.
[ ] Rate limit blocks excessive AI calls.
[ ] Prompt injection attempt does not override AI safety.
[ ] Future private image fields are not exposed by MVP APIs.
```


## 9. Ingredient, date/timezone, and product visibility tests

### Ingredient API tests

```txt
[ ] GET /api/ingredients returns matching ingredients.
[ ] GET /api/ingredients/:id returns one ingredient.
[ ] POST /api/ingredients/explain returns IngredientExplanationResult.
[ ] Ingredient explanation is rate-limited.
[ ] Safety classifier blocks prompt injection in ingredient input.
```

### Date/timezone tests

```txt
[ ] RoutineLog stores localDate and timezone.
[ ] SkinJournal stores localDate and timezone.
[ ] Query by localDate returns same local calendar day for Asia/Ho_Chi_Minh.
[ ] UTC timestamp does not shift local daily dashboard calculations.
```

### Product trust and visibility tests

```txt
[ ] Normal user cannot set verificationStatus = verified.
[ ] Normal user-created product becomes source = user_submitted.
[ ] Normal user-created product becomes verificationStatus = unverified.
[ ] GET /api/products hides unverified products submitted by other users.
[ ] GET /api/products?includeMine=true returns the current user's own unverified submissions.
[ ] GET /api/products/:id blocks access to another user's unverified product.
[ ] Future admin route can set verificationStatus = reviewed or verified only with ADMIN role.
```

### Active normalization tests

```txt
[ ] salicylic acid maps to BHA.
[ ] beta hydroxy acid maps to BHA.
[ ] retinol and retinal map to RETINOID.
[ ] fragrance and parfum map to FRAGRANCE.
[ ] Duplicate aliases are deduplicated before rules run.
```


## 10. RoutineAnalysis and SafetyClassifier consistency tests

### RoutineAnalysis riskLevel tests

```txt
[ ] RoutineAnalysis stores top-level riskLevel.
[ ] top-level riskLevel is derived from rule engine output.
[ ] AI explanation cannot override top-level riskLevel.
[ ] RoutineAnalysis can be queried by userId + riskLevel + createdAt.
```

### RuleResult exposure tests

```txt
[ ] Database stores all rule results, including triggered=false.
[ ] API response exposes only triggered warnings to users.
[ ] Debug/admin-only inspection can access full ruleResults when authorized.
```

### Safety classifier block-flow tests

```txt
[ ] If shouldBlockAIAnswer=true, ingredient explanation AI is not called.
[ ] If shouldBlockAIAnswer=true, routine explanation AI is not called.
[ ] Safe response is returned based on safeResponseType.
[ ] Logs store detectedCategories and riskLevel only, not raw sensitive text.
```

### localDate validation tests

```txt
[ ] localDate must match /^\d{4}-\d{2}-\d{2}$/.
[ ] timezone must be an IANA timezone string.
[ ] from/to localDate query validates YYYY-MM-DD.
[ ] localDate range query uses lexicographic comparison safely.
```


## 11. v1.2.2/v1.2.3 hotfix tests

### Ingredient API auth tests

```txt
[ ] Unauthenticated user cannot access GET /api/ingredients.
[ ] Authenticated user can search ingredients.
[ ] Unauthenticated user cannot access GET /api/ingredients/:id.
[ ] POST /api/ingredients/explain requires authentication.
[ ] POST /api/ingredients/explain is rate-limited.
[ ] Ingredient API does not use product verificationStatus or includeMine logic.
```

### Product API auth and visibility tests

```txt
[ ] Unauthenticated user cannot access GET /api/products in MVP.
[ ] GET /api/products returns only verified/reviewed products by default.
[ ] includeMine=true returns current user's own unverified submissions.
[ ] includeMine=true never returns other users' unverified products.
[ ] GET /api/products/:id blocks access to another user's unverified product.
```

### SkinJournal one-entry-per-day tests

```txt
[ ] User cannot create duplicate SkinJournal entry for the same localDate.
[ ] User can update existing journal entry using PATCH /api/skin-journal/:id.
[ ] localDate must match YYYY-MM-DD.
[ ] timezone must be an IANA timezone string.
```


## 12. v1.2.3 documentation polish tests

```txt
[ ] POST /api/skin-journal returns CONFLICT for duplicate localDate.
[ ] PUT /api/routine-logs upserts existing log instead of duplicating.
[ ] README version matches current SDD version.
[ ] source-notes version matches current SDD version.
```


## 13. v1.2.5 consistency hotfix tests

### Auth and current-user API tests

```txt
[ ] Auth.js-owned `/api/auth/*` routes are not wrapped in SkinWise `{ data, error }` response format.
[ ] GET /api/me returns current user id, email, name, role, and onboardingCompleted.
[ ] GET /api/me uses SkinWise `{ data, error }` response format.
[ ] GET /api/me returns UNAUTHORIZED when no authenticated session exists.
```

### Error-code consistency tests

```txt
[ ] Missing-auth errors use UNAUTHORIZED consistently.
[ ] No MVP API contract uses UNAUTHENTICATED as the canonical error code.
[ ] AI_PROVIDER_FAILED and AI_OUTPUT_INVALID are treated as service-level AI errors or safe AI endpoint errors only.
```

### Data model consistency tests

```txt
[ ] Product schema contains exactly one brand field.
[ ] AppUserProfile role enum contains only USER and ADMIN in MVP.
[ ] CONTENT_REVIEWER is not implemented in MVP code.
[ ] SkinJournal imageUrl, imageStorageKey, and imageVisibility are treated as reserved future fields only.
[ ] MVP SkinJournal API request/response does not expose image fields.
```

### SkinJournal PATCH tests

```txt
[ ] PATCH /api/skin-journal/:id accepts timezone, productsUsed, observations, symptoms, sleepHours, stressLevel, and notes.
[ ] PATCH /api/skin-journal/:id rejects localDate changes.
[ ] PATCH /api/skin-journal/:id rejects future image fields in MVP request bodies.
[ ] User must create a separate SkinJournal entry for another localDate.
```
