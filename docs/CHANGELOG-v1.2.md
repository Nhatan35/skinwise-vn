# CHANGELOG-v1.2.md

# SDD v1.2 Changes

## 1. Reason for update

SDD v1.1 was strong enough to serve as the main project spec, but review identified several implementation risks before starting Week 1 coding. v1.2 fixes those risks so AI coding assistants have clearer instructions.

## 2. Changes applied

### 2.1 Ingredient API contract added

Added to `docs/05-api-contract.md`:

```txt
GET /api/ingredients
GET /api/ingredients/:id
POST /api/ingredients/explain
```

`POST /api/ingredients/explain` returns `IngredientExplanationResult` and requires rate limiting plus optional ownership check when `skinProfileId` is provided.

### 2.2 Daily tracking date strategy added

Updated `RoutineLog` and `SkinJournal` in `docs/04-data-model.md`:

```txt
localDate: string
timezone: string
```

Indexes now use `userId + localDate` instead of `userId + date` for daily tracking.

### 2.3 Auth strategy clarified

MVP uses Auth.js with MongoDB Adapter.

Auth.js owns identity collections:

```txt
users
accounts
sessions
verification_tokens
```

SkinWise owns app-specific profile and role data in `AppUserProfile`.

### 2.4 Product creation trust rules added

Normal users cannot set:

```txt
source
verificationStatus
createdByUserId
```

Server sets:

```txt
source = user_submitted
verificationStatus = unverified
createdByUserId = currentUser.id
```

Only admin users can mark products as `reviewed` or `verified`.

### 2.5 Active ingredient normalization added

Added `ActiveSignal` and alias normalization to `docs/11-routine-safety-rules.md`.

Rule engine now normalizes aliases such as:

```txt
salicylic acid -> BHA
beta hydroxy acid -> BHA
retinol -> RETINOID
parfum -> FRAGRANCE
```

before running deterministic rules.

### 2.6 Rate limits made concrete

Updated `docs/07-security-privacy.md`:

```txt
Routine analysis: 10 requests / user / hour
Ingredient explanation: 20 requests / user / hour
Product creation: 30 requests / user / day
Journal creation: 100 requests / user / day
Routine log create/update: 100 requests / user / day
```

### 2.7 Project structure updated

Updated `docs/10-project-structure.md` with:

```txt
app/api/ingredients/
modules/ingredients/
modules/ai-analysis/explain-ingredient.use-case.ts
modules/ai-analysis/classify-safety.use-case.ts
```

### 2.8 AI contract clarified

Safety classifier is internal-only in MVP and runs before ingredient explanation or routine AI explanation when user input may contain unsafe claims or prompt injection.

## 3. Implementation impact

After v1.2, the project is ready for Week 1 implementation planning.

Next recommended prompt:

```txt
Create Week 1 Implementation Plan for SkinWise VN based on SDD v1.2.
Do not code yet.
```
