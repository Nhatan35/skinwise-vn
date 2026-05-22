# 04-file-ownership-map.md

# File Ownership Map — SkinWise VN MVP v1.2.6

## 1. Purpose

This document prevents duplicate logic by assigning ownership of responsibilities to specific folders and files.

Update this file when new implementation files are added.

## 2. Auth ownership

Planned owned files:

```txt
src/auth.ts
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/modules/auth/next-auth.d.ts
src/modules/auth/types.ts
src/proxy.ts
src/app/api/auth/[...nextauth]/route.ts
```

Rules:

- do not duplicate auth logic inside route handlers;
- always use a shared auth helper for protected APIs;
- never trust `userId` from request body;
- admin checks must be centralized;
- `auth.config.ts` must remain edge-safe and must not import the MongoDB adapter, MongoDB helper, `src/auth.ts`, `server-only`, or `src/config/env.ts`;
- `src/auth.ts` owns full server-side Auth.js setup and adapter wiring;
- `src/app/api/auth/[...nextauth]/route.ts` is owned by Auth.js and must not use the SkinWise response wrapper.

Current status:

```txt
src/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/proxy.ts
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/modules/auth/next-auth.d.ts
src/modules/auth/types.ts
```

Task 5 implemented Auth.js foundation only. Task 7 adds the separate SkinWise-owned `/api/me` and AppUserProfile foundation without changing Auth.js built-in route ownership.

## 2.1 Foundation config ownership

Owned files:

```txt
src/config/app.ts
src/config/features.ts
src/config/env.ts
```

Rules:

- `src/config/app.ts` owns static app metadata.
- `src/config/features.ts` owns server-side feature flags.
- incomplete or future features must remain disabled by default.
- `src/config/env.ts` owns server-only environment validation.
- `src/config/env.ts` must not connect to MongoDB, Auth.js, or AI providers.

Current status:

```txt
src/config/app.ts
src/config/env.ts
src/config/features.ts
```

## 2.2 AppUserProfile and `/api/me` ownership

Owned files:

```txt
src/app/api/me/route.ts
src/modules/users/app-user-profile.types.ts
src/modules/users/app-user-profile.repository.ts
src/modules/users/app-user-profile.mapper.ts
tests/unit/app-user-profile.test.ts
tests/unit/me-api-contract.test.ts
tests/unit/skin-profile-use-case.test.ts
```

Rules:

- `GET /api/me` must use `getCurrentUser()` and return `UNAUTHORIZED` for expected unauthenticated requests.
- `GET /api/me` must lazily ensure `AppUserProfile` for authenticated users.
- AppUserProfile lazy creation must use atomic upsert through `findOneAndUpdate`.
- AppUserProfile `userId` stores the Auth.js current user id as a string at the repository/API boundary.
- Do not coerce opaque Auth.js session user ids into MongoDB `ObjectId`.
- AppUserProfile repository must use `getAppUserProfilesCollection()` and must not create a MongoClient.
- `/api/me` must not accept or trust `userId` from body/query data.
- `/api/me` DTO must return only `id`, `email`, `name`, `role`, and `onboardingCompleted`.
- `/api/me` must not expose `_id`, ObjectId, `userId`, `image`, raw session data, tokens, secrets, or raw database errors.
- AppUserProfile onboarding completion must happen server-side through a userId-scoped repository function.
- Successful `POST /api/skin-profile` may mark `onboardingCompleted = true`; `PATCH /api/skin-profile` must not reset or change onboarding state.
- This ownership does not include SkinProfile, Routine, Journal, Product, Ingredient, AI, or dashboard data integration.

Current status:

```txt
src/app/api/me/route.ts
src/modules/users/app-user-profile.types.ts
src/modules/users/app-user-profile.repository.ts
src/modules/users/app-user-profile.mapper.ts
tests/unit/app-user-profile.test.ts
tests/unit/me-api-contract.test.ts
tests/unit/skin-profile-use-case.test.ts
```

## 3. Database ownership

Planned owned files:

```txt
src/infrastructure/database/mongodb.ts
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
src/infrastructure/rate-limiting/rate-limit.ts
src/config/env.ts
```

Rules:

- do not create multiple MongoDB clients;
- all environment variables must be validated through `src/config/env.ts`;
- repositories must use shared database helpers;
- required indexes must be created through `ensure-indexes.ts`, not route handlers;
- route handlers must not query MongoDB directly;
- rate limit code must use `getRateLimitsCollection()` and must not create a MongoDB client;
- Auth.js adapter later must reuse the shared MongoClient or provider from `mongodb.ts`.

Current status:

```txt
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
src/infrastructure/database/mongodb.ts
src/infrastructure/rate-limiting/rate-limit.ts
```

`mongodb.ts` owns the shared MongoDB client helper and lazy client promise. `collections.ts` owns collection names/helpers, including `rate_limits`. `ensure-indexes.ts` owns repeatable index definitions and the `npm run db:indexes` entrypoint, including the rate limit unique key and TTL indexes. `rate-limit.ts` owns the MongoDB-backed server-only rate limit helper. `src/config/env.ts` is implemented and remains the only place that validates `MONGODB_URI`.

## 3.1 AI Provider ownership

Owned files:

```txt
src/infrastructure/ai/ai-provider.ts
src/infrastructure/ai/ai-provider.errors.ts
src/infrastructure/ai/ai-provider.factory.ts
src/infrastructure/ai/ai-output.schema.ts
src/infrastructure/ai/ai-output.validator.ts
src/infrastructure/ai/mock-ai-provider.ts
src/infrastructure/ai/validated-ai-provider.ts
src/infrastructure/ai/index.ts
tests/unit/ai-output-validation.test.ts
tests/unit/ai-provider.test.ts
tests/unit/validated-ai-provider.test.ts
```

Rules:

- `src/infrastructure/ai/ai-provider.ts` owns the server-only `AIProvider` interface and provider DTO types for routine analysis, ingredient explanation, and safety classification.
- `src/infrastructure/ai/ai-output.schema.ts` owns strict Zod schemas for the current `AIProvider` output shape, including `aiProviderMetadataSchema`, `aiProviderRoutineAnalysisResultSchema`, `aiProviderIngredientExplanationResultSchema`, and `aiProviderSafetyClassifierResultSchema`.
- `src/infrastructure/ai/ai-output.validator.ts` owns `validateRoutineAnalysisOutput`, `validateIngredientExplanationOutput`, and `validateSafetyClassifierOutput`; invalid AI output must throw `AIProviderResponseError`.
- `src/infrastructure/ai/validated-ai-provider.ts` owns provider-level output validation by wrapping an inner `AIProvider`, validating each method output, and returning only validated output.
- `MockAIProvider` is the only provider implementation in TASK AI-001.
- `getAIProvider()` reads `process.env.AI_PROVIDER` directly, trims and lowercases it, defaults missing, empty, or `mock` values to a raw `MockAIProvider`, and wraps successful raw providers with `ValidatedAIProvider`.
- OpenAI and Gemini provider names must throw `AIProviderConfigurationError` until their real providers are explicitly implemented in a later task.
- Do not initialize external clients in TASK AI-001.
- Do not call external AI APIs in TASK AI-001.
- Do not require or read `AI_API_KEY` in TASK AI-001.
- Do not import AI provider infrastructure from client components.
- TASK AI-002 validates the current `src/infrastructure/ai/ai-provider.ts` output types exactly and does not rename fields to match `docs/06-ai-contract.md`.
- TASK AI-003 must not add validation logic inside `MockAIProvider`; validation belongs in `ValidatedAIProvider`.
- Do not wire Routine Analysis API, Ingredient Explanation API, or safety-classifier use cases to the provider abstraction until a separately scoped task.

Current status:

```txt
src/infrastructure/ai/ai-provider.ts
src/infrastructure/ai/ai-provider.errors.ts
src/infrastructure/ai/ai-provider.factory.ts
src/infrastructure/ai/ai-output.schema.ts
src/infrastructure/ai/ai-output.validator.ts
src/infrastructure/ai/mock-ai-provider.ts
src/infrastructure/ai/validated-ai-provider.ts
src/infrastructure/ai/index.ts
tests/unit/ai-output-validation.test.ts
tests/unit/ai-provider.test.ts
tests/unit/validated-ai-provider.test.ts
```

TASK AI-001 implemented the AI Provider Abstraction and deterministic `MockAIProvider`. TASK AI-002 added strict Zod structured output validation for the current provider output types and unit tests covering valid output, missing required fields, invalid enum values, maxLength/maxItems violations, unknown extra fields, invalid `providerMetadata`, error behavior, and MockAIProvider compatibility. TASK AI-003 added `ValidatedAIProvider`, updated `getAIProvider()` to return validated providers in mock mode, and added provider-flow validation tests. OpenAI provider is not implemented yet. Gemini provider is not implemented yet. No external AI API is called, and no AI key is required.

## 4. Skin Profile ownership

Planned owned files:

```txt
src/modules/skin-profile/skin-profile.types.ts
src/modules/skin-profile/skin-profile.schema.ts
src/modules/skin-profile/skin-profile.dto.ts
src/modules/skin-profile/skin-profile.mapper.ts
src/modules/skin-profile/skin-profile.repository.ts
src/modules/skin-profile/skin-profile.use-case.ts
src/modules/skin-profile/components/skin-profile-onboarding-form.tsx
src/modules/skin-profile/components/skin-profile-view-edit.tsx
src/app/api/skin-profile/route.ts
src/app/(dashboard)/onboarding/skin-profile/page.tsx
src/app/(dashboard)/skin-profile/page.tsx
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
tests/unit/skin-profile-use-case.test.ts
tests/unit/skin-profile-onboarding.test.ts
tests/unit/skin-profile-view-edit.test.ts
```

Rules:

- one profile per user;
- user identity comes from session;
- request bodies must not accept `userId`;
- repository reads, updates, and deletes must filter by authenticated `userId`;
- API responses must use SkinProfile DTOs and must not expose `_id` or `userId`;
- successful create/replace may mark AppUserProfile onboarding complete server-side, after SkinProfile persistence succeeds;
- PATCH must update only SkinProfile fields and must not change AppUserProfile onboarding state;
- onboarding UI must call `/api/skin-profile` with `fetch` and must not import repository, database, use-case, or `server-only` modules;
- `/skin-profile` view/edit UI must call `GET /api/skin-profile` on load, update existing profiles with `PATCH /api/skin-profile`, stay on `/skin-profile` after save, and must not use `POST`;
- `/skin-profile` view/edit UI must link missing profiles to `/onboarding/skin-profile`;
- no medical diagnosis fields.

Current status:

```txt
src/app/api/skin-profile/route.ts
src/modules/skin-profile/skin-profile.types.ts
src/modules/skin-profile/skin-profile.schema.ts
src/modules/skin-profile/skin-profile.dto.ts
src/modules/skin-profile/skin-profile.mapper.ts
src/modules/skin-profile/skin-profile.repository.ts
src/modules/skin-profile/skin-profile.use-case.ts
src/modules/skin-profile/components/skin-profile-onboarding-form.tsx
src/modules/skin-profile/components/skin-profile-view-edit.tsx
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
tests/unit/skin-profile-use-case.test.ts
tests/unit/skin-profile-onboarding.test.ts
tests/unit/skin-profile-view-edit.test.ts
src/app/(dashboard)/onboarding/skin-profile/page.tsx
src/app/(dashboard)/skin-profile/page.tsx
```

## 5. Product ownership

Owned files:

```txt
src/modules/products/product.types.ts
src/modules/products/product.schema.ts
src/modules/products/product.dto.ts
src/modules/products/product.mapper.ts
src/modules/products/product.repository.ts
src/modules/products/product.use-case.ts
src/modules/products/index.ts
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
tests/unit/product.test.ts
tests/unit/product-use-case.test.ts
tests/unit/product-api-contract.test.ts
tests/unit/database-indexes.test.ts
```

Rules:

- visibility rules live in use case/repository;
- normal users cannot set `source` or `verificationStatus`;
- product APIs require authentication in MVP.
- TASK PI-001 implements read-only list/detail only.
- public Product DTOs must not expose `_id`, raw ObjectId values, `createdByUserId`, or `source`.
- `GET /api/products` and `GET /api/products/[id]` return only `reviewed` or `verified` products in this foundation.
- `POST /api/products`, `includeMine`, Product UI pages, admin product management, seed scripts, external product APIs, image upload, and medical diagnosis are out of scope for this ownership status.

Current status:

```txt
src/modules/products/product.types.ts
src/modules/products/product.schema.ts
src/modules/products/product.dto.ts
src/modules/products/product.mapper.ts
src/modules/products/product.repository.ts
src/modules/products/product.use-case.ts
src/modules/products/index.ts
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
tests/unit/product.test.ts
tests/unit/product-use-case.test.ts
tests/unit/product-api-contract.test.ts
tests/unit/database-indexes.test.ts
```

## 6. Ingredient ownership

Owned files:

```txt
src/modules/ingredients/ingredient.types.ts
src/modules/ingredients/ingredient.schema.ts
src/modules/ingredients/ingredient.dto.ts
src/modules/ingredients/ingredient.mapper.ts
src/modules/ingredients/ingredient.repository.ts
src/modules/ingredients/ingredient.use-case.ts
src/modules/ingredients/index.ts
src/app/api/ingredients/route.ts
src/app/api/ingredients/[id]/route.ts
tests/unit/ingredient.test.ts
tests/unit/ingredient-use-case.test.ts
tests/unit/ingredient-api-contract.test.ts
tests/unit/database-indexes.test.ts
```

Rules:

- ingredient search/detail is separate from product visibility;
- AI explanation orchestration belongs to `ai-analysis`.
- TASK PI-001 implements read-only list/detail only.
- public Ingredient DTOs must not expose `_id` or raw ObjectId values.
- Ingredient APIs must not use Product `verificationStatus`, `includeMine`, or `createdByUserId` logic.
- `POST /api/ingredients/explain`, admin ingredient management, seed scripts, safety-classifier integration, AI provider integration, and medical diagnosis are out of scope for this ownership status.

Current status:

```txt
src/modules/ingredients/ingredient.types.ts
src/modules/ingredients/ingredient.schema.ts
src/modules/ingredients/ingredient.dto.ts
src/modules/ingredients/ingredient.mapper.ts
src/modules/ingredients/ingredient.repository.ts
src/modules/ingredients/ingredient.use-case.ts
src/modules/ingredients/index.ts
src/app/api/ingredients/route.ts
src/app/api/ingredients/[id]/route.ts
tests/unit/ingredient.test.ts
tests/unit/ingredient-use-case.test.ts
tests/unit/ingredient-api-contract.test.ts
tests/unit/database-indexes.test.ts
```

## 7. Routine ownership

Planned owned files:

```txt
src/modules/routines/routine.types.ts
src/modules/routines/routine.schema.ts
src/modules/routines/routine.dto.ts
src/modules/routines/routine.mapper.ts
src/modules/routines/routine.repository.ts
src/modules/routines/routine.use-case.ts
src/modules/routines/components/routine-analysis-panel.tsx
src/modules/routines/components/routine-builder.tsx
src/modules/routines/components/routine-log-controls.tsx
src/modules/routines/components/routine-log-status-badge.tsx
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
src/app/(dashboard)/routines/page.tsx
tests/unit/routine.test.ts
tests/unit/routine-use-case.test.ts
tests/unit/routine-api-contract.test.ts
tests/unit/routine-analysis-ui.test.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/routine-log-ui.test.ts
```

Rules:

- always query by `routineId + userId`;
- derive `userId` from the authenticated server session only;
- never accept client-provided `userId`, `id`, `_id`, timestamps, `stepId`, or snapshot fields;
- generate `stepId` server-side for submitted routine steps;
- convert MongoDB `_id` to `id` and Dates to ISO strings at the DTO boundary;
- handle invalid routine ids safely as not found;
- preserve product snapshots when they already exist in documents, and populate Product snapshots server-side only from the existing Product use-case path when a visible `productId` is submitted;
- `/routines` UI must call the existing Routine API and Product API with `fetch` and must not import repository, use-case, database, MongoDB, auth helper, or `server-only` modules; a type-only Product DTO import is allowed;
- `/routines` UI may call the existing Routine Analysis API with `fetch` and must not import ai-analysis use cases, repositories, mappers, database helpers, auth helpers, Routine Safety Engine, AI/provider modules, or `server-only` modules;
- `/routines` UI must submit only `name`, `timeOfDay`, and steps with either `productId` or `customProductName`, plus `category`, `order`, `frequency`, and optional `instructions`;
- `/routines` UI must not submit `stepId`, `userId`, `id`, `_id`, timestamps, Product snapshot fields, risk fields, analysis fields, or AI fields;
- `/routines` analysis UI must not pass `userId`, `routineId`, `riskLevel`, warnings, suggestions, summary, or analysis content in request bodies;
- `/routines` analysis UI may format API-provided `riskLevel` and suggestion priority labels for readability, but must not generate new risk levels, warnings, suggestions, summaries, diagnosis, treatment claims, or skin score;
- `/routines` RoutineLog UI may call only `GET /api/routine-logs?localDate=YYYY-MM-DD` and `PUT /api/routine-logs` with `fetch`, must use browser localDate and timezone, and must not import RoutineLog repositories, use cases, database helpers, auth helpers, or `server-only` modules;
- Routine use cases may call the Product use-case to validate visible selected products and populate server-owned snapshots, but must not import Product repositories directly. No Product UI page, Product submission, real AI provider integration, Journal, image upload, skin score, medical diagnosis, or dashboard data integration inside the `/routines` UI foundation.

Current status:

```txt
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
src/modules/routines/routine.types.ts
src/modules/routines/routine.schema.ts
src/modules/routines/routine.dto.ts
src/modules/routines/routine.mapper.ts
src/modules/routines/routine.repository.ts
src/modules/routines/routine.use-case.ts
src/modules/routines/components/routine-analysis-panel.tsx
src/modules/routines/components/routine-builder.tsx
src/modules/routines/components/routine-log-controls.tsx
src/modules/routines/components/routine-log-status-badge.tsx
src/app/(dashboard)/routines/page.tsx
tests/unit/routine.test.ts
tests/unit/routine-use-case.test.ts
tests/unit/routine-api-contract.test.ts
tests/unit/routine-analysis-ui.test.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/routine-log-ui.test.ts
```

Week 3 Task 1 implemented Routine API foundation. Week 3 Task 2 implemented the protected `/routines` UI foundation for listing, creating, editing, and deleting routines. Week 3 Task 5 added per-routine analysis controls and a focused analysis panel inside the existing `/routines` UI. Product Picker integration and server-side Product snapshot population are owned by the Routine Builder/use-case boundary for TASK PP-001. TASK RL-002 added RoutineLog status badges and completed/skipped/partial controls inside the existing `/routines` UI. Product UI pages, Product submission, Ingredient explanation modules, real AI provider integration, Journal, image upload, skin score, medical diagnosis, and new analysis UI routes remain outside Routine ownership. Dashboard data integration is owned by the Dashboard module/task.

## 8. Routine Safety Engine ownership

Owned files:

```txt
src/domain/routine-safety/routine-safety.types.ts
src/domain/routine-safety/active-signal-normalizer.ts
src/domain/routine-safety/routine-safety-engine.ts
src/domain/routine-safety/index.ts
tests/unit/routine-safety-engine.test.ts
```

Rules:

- deterministic rule engine only;
- implement exactly the MVP rules from `docs/11-routine-safety-rules.md`;
- normalize active signals before rule checks;
- PHA counts for `TOO_MANY_ACTIVES`, `RETINOID_PLUS_EXFOLIANT`, and `MISSING_MOISTURIZER` exfoliant behavior;
- FRAGRANCE must not count for `TOO_MANY_ACTIVES`;
- return all rule results and a triggered-only subset;
- derive risk level from deterministic rule results;
- do not load Product data when `productId` exists but snapshots are missing;
- do not import Next.js, Auth.js, MongoDB, database modules, repositories, use cases, API routes, UI components, AI/provider modules, environment modules, or config modules.

Current status:

```txt
src/domain/routine-safety/routine-safety.types.ts
src/domain/routine-safety/active-signal-normalizer.ts
src/domain/routine-safety/routine-safety-engine.ts
src/domain/routine-safety/index.ts
tests/unit/routine-safety-engine.test.ts
```

Week 3 Task 3 implemented the Routine Safety Engine foundation only. Routine Analysis API, AI explanation, persistence, Product lookup/backfill, UI, Journal, Routine Logs, dashboard data integration, image upload, skin score, and medical diagnosis remain outside the Routine Safety Engine ownership boundary and are owned by their respective modules/tasks where implemented.

## 9. Routine analysis ownership

Owned files:

```txt
src/modules/ai-analysis/routine-analysis.types.ts
src/modules/ai-analysis/routine-analysis.schema.ts
src/modules/ai-analysis/routine-analysis.dto.ts
src/modules/ai-analysis/routine-analysis.mapper.ts
src/modules/ai-analysis/routine-analysis.repository.ts
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/index.ts
src/app/api/routines/[id]/analyze/route.ts
src/app/api/routines/[id]/analyses/route.ts
src/infrastructure/rate-limiting/rate-limit.ts
tests/unit/routine-analysis.test.ts
tests/unit/routine-analysis-api-contract.test.ts
tests/unit/routine-analysis-use-case.test.ts
tests/unit/rate-limit.test.ts
```

Rules:

- rule engine must run first;
- route handlers derive `userId` from the authenticated session only;
- route handlers derive `routineId` from route params only;
- `POST /api/routines/[id]/analyze` accepts an empty request body only and rejects client-provided analysis fields;
- missing routines and not-owned routines both return `NOT_FOUND`;
- use cases verify routine ownership before analysis or history reads;
- repository writes must use `getRoutineAnalysesCollection()` and must not create a MongoClient;
- repository history reads must filter by `userId + routineId` and return newest first;
- store all deterministic rule results, including `triggered: false`;
- derive top-level `riskLevel` from the Routine Safety Engine;
- public DTOs expose triggered warnings only and must not expose `_id`, `userId`, or internal `ruleResults`;
- fallback content uses deterministic metadata only: `deterministic`, `routine-safety-engine`, and `routine-analysis-fallback-v1`;
- `POST /api/routines/[id]/analyze` must check `routine_analysis:${userId}` after authentication and request validation, before calling `analyzeRoutineForCurrentUser()`;
- unauthenticated requests must return the existing `UNAUTHORIZED` response and must not call the rate limiter;
- rate-limited requests must return `RATE_LIMITED` with HTTP 429, `Retry-After`, and must not call the use case;
- do not import OpenAI, LLM clients, external APIs, Product/Ingredient modules, UI components, dashboard modules, Journal, or RoutineLog features;

Current status:

```txt
src/app/api/routines/[id]/analyze/route.ts
src/app/api/routines/[id]/analyses/route.ts
src/modules/ai-analysis/routine-analysis.types.ts
src/modules/ai-analysis/routine-analysis.schema.ts
src/modules/ai-analysis/routine-analysis.dto.ts
src/modules/ai-analysis/routine-analysis.mapper.ts
src/modules/ai-analysis/routine-analysis.repository.ts
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/index.ts
src/infrastructure/rate-limiting/rate-limit.ts
tests/unit/routine-analysis.test.ts
tests/unit/routine-analysis-api-contract.test.ts
tests/unit/routine-analysis-use-case.test.ts
tests/unit/rate-limit.test.ts
```

Week 3 Task 4 implemented Routine Analysis API Foundation. TASK-RA-001 added MongoDB-backed per-user rate limiting for the analyze route. TASK AI-001 added the server-only AI Provider Abstraction but did not wire it into Routine Analysis API behavior. Real OpenAI/Gemini provider integration, external API calls, Product/Ingredient explanation integration, Product snapshot backfill, dashboard integration, Journal, Routine Logs, image upload, skin score, and medical diagnosis are outside the Routine Analysis ownership boundary; Product snapshots, RoutineLogs, and dashboard integration are owned by their respective modules/tasks where implemented.

## 10. RoutineLog ownership

Owned files implemented by TASK RL-001 and TASK RL-002:

```txt
src/modules/routine-logs/index.ts
src/modules/routine-logs/routine-log.types.ts
src/modules/routine-logs/routine-log.schema.ts
src/modules/routine-logs/routine-log.dto.ts
src/modules/routine-logs/routine-log.mapper.ts
src/modules/routine-logs/routine-log.repository.ts
src/modules/routine-logs/routine-log.use-case.ts
src/modules/routine-logs/routine-log.client.ts
src/app/api/routine-logs/route.ts
tests/unit/routine-log.test.ts
tests/unit/routine-log-use-case.test.ts
tests/unit/routine-log-api-contract.test.ts
tests/unit/routine-log-client.test.ts
tests/unit/routine-log-ui.test.ts
```

Rules:

- same `userId + routineId + localDate` updates existing log through canonical `PUT /api/routine-logs`;
- `GET /api/routine-logs?localDate=YYYY-MM-DD` returns only the authenticated user's logs for that local date;
- `userId`, `id`, `_id`, `createdAt`, and `updatedAt` are server-owned and rejected from client input;
- `localDate` is stored as `YYYY-MM-DD` string and `timezone` is stored as a string;
- `status` is one of `completed`, `partial`, or `skipped`;
- completed step IDs must belong to the target routine;
- RoutineLog UI belongs on the existing `/routines` page only for RL-002; no separate RoutineLog page exists;
- RoutineLog client helpers must not include `userId`, `id`, `_id`, `createdAt`, or `updatedAt` in PUT payloads;
- RoutineLog UI must not add dashboard cards, streak calculation, AI insight, analytics, or note input;
- keep RoutineLog separate from SkinJournal.

## 11. SkinJournal ownership

Planned owned files:

```txt
src/modules/journals/skin-journal.schema.ts
src/modules/journals/skin-journal.dto.ts
src/modules/journals/skin-journal.mapper.ts
src/modules/journals/skin-journal.repository.ts
src/modules/journals/create-skin-journal.use-case.ts
src/modules/journals/update-skin-journal.use-case.ts
src/modules/journals/list-skin-journal.use-case.ts
src/app/api/skin-journal/route.ts
src/app/api/skin-journal/[id]/route.ts
```

Rules:

- same `userId + localDate` returns conflict on create;
- no appearance scoring;
- journal entries are private.

## 12. Dashboard ownership

Owned files:

```txt
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
src/modules/dashboard/dashboard.types.ts
src/modules/dashboard/dashboard.dto.ts
src/modules/dashboard/dashboard.schema.ts
src/modules/dashboard/dashboard.mapper.ts
src/modules/dashboard/dashboard.use-case.ts
src/modules/dashboard/index.ts
src/modules/dashboard/components/dashboard-overview.tsx
src/modules/dashboard/components/dashboard-card.tsx
src/modules/dashboard/components/skin-profile-summary-card.tsx
src/modules/dashboard/components/today-routine-progress-card.tsx
src/modules/dashboard/components/routine-summary-card.tsx
src/modules/dashboard/components/latest-analysis-card.tsx
src/modules/dashboard/components/next-actions-card.tsx
src/app/api/dashboard/route.ts
tests/unit/dashboard-shell.test.ts
tests/unit/dashboard-routes.test.ts
tests/unit/dashboard-use-case.test.ts
tests/unit/dashboard-api-contract.test.ts
tests/unit/dashboard-ui.test.ts
```

Rules:

- `src/app/(dashboard)/dashboard/page.tsx` owns the real `/dashboard` route.
- do not create `src/app/(dashboard)/page.tsx`;
- dashboard config must contain safe metadata only;
- dashboard config must not import auth, database, `server-only`, or API code;
- `/dashboard`, `/skin-profile`, and `/routines` are enabled routes in the dashboard nav;
- `/onboarding/skin-profile` remains available for first-time onboarding and empty-state CTA, but is no longer the main dashboard Skin Profile nav target;
- unimplemented feature nav items must use `href: null` and `disabled: true`;
- dashboard cards must render API-provided dashboard summary data only and must not contain fake skincare, routine, product, journal, ingredient, or AI results.

Current status:

```txt
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
src/modules/dashboard/dashboard.types.ts
src/modules/dashboard/dashboard.dto.ts
src/modules/dashboard/dashboard.schema.ts
src/modules/dashboard/dashboard.mapper.ts
src/modules/dashboard/dashboard.use-case.ts
src/modules/dashboard/index.ts
src/modules/dashboard/components/dashboard-overview.tsx
src/modules/dashboard/components/dashboard-card.tsx
src/modules/dashboard/components/skin-profile-summary-card.tsx
src/modules/dashboard/components/today-routine-progress-card.tsx
src/modules/dashboard/components/routine-summary-card.tsx
src/modules/dashboard/components/latest-analysis-card.tsx
src/modules/dashboard/components/next-actions-card.tsx
src/app/api/dashboard/route.ts
tests/unit/dashboard-shell.test.ts
tests/unit/dashboard-routes.test.ts
tests/unit/dashboard-use-case.test.ts
tests/unit/dashboard-api-contract.test.ts
tests/unit/dashboard-ui.test.ts
```

Task 6 implemented the protected dashboard shell. Week 2 Task 2.2 points the Skin Profile nav link to `/skin-profile`; `/onboarding/skin-profile` remains available outside the main nav for first-time setup. Week 3 Task 2 points the Routines nav link to `/routines`. TASK DB-001 adds the authenticated Dashboard API and `/dashboard` data cards for Skin Profile, Routine counts, today's RoutineLog progress, latest Routine Analysis, and next actions. The dashboard still does not implement weekly/monthly charts, advanced streaks, AI insights, SkinJournal, image upload, skin score, unrelated feature routes, fake data, or medical diagnosis.

## 13. UI shared ownership

Planned owned files:

```txt
components.json
src/shared/components/app-shell.tsx
src/shared/components/empty-state.tsx
src/shared/components/error-state.tsx
src/shared/components/loading-state.tsx
src/shared/components/ui/
src/shared/constants/routes.ts
src/shared/utils/cn.ts
src/shared/utils/index.ts
src/shared/types/result.ts
```

Rules:

- shared UI components should not contain business logic;
- feature-specific UI can live inside module folders or route segments later.

Current status:

```txt
components.json
src/shared/components/app-shell.tsx
src/shared/components/empty-state.tsx
src/shared/components/error-state.tsx
src/shared/components/loading-state.tsx
src/shared/components/ui/
src/shared/constants/routes.ts
src/shared/utils/cn.ts
src/shared/utils/index.ts
src/shared/types/result.ts
```

Shared UI foundation components are implemented. shadcn/ui components must remain under `src/shared/components/ui/`; do not create `src/components/ui/`.

## 14. Reserved future ownership

Do not implement yet:

```txt
src/modules/notifications/
src/infrastructure/storage/
```

These are reserved for future scope.


## 15. Engineering governance ownership

Owned files:

```txt
docs/19-engineering-execution-checklist.md
docs/20-week-1-task-1-prompt.md
docs/adr/
.github/pull_request_template.md
.github/workflows/ci.yml
```

Rules:

- do not delete governance files during implementation;
- update ADRs when a major architecture decision changes;
- keep CI commands aligned with `package.json`;
- keep PR checklist aligned with source-of-truth rules.

## 16. Week 1 Task 1 placeholder ownership

Placeholder folders created:

```txt
src/modules/auth/
src/modules/users/
src/modules/skin-profile/
src/modules/products/
src/modules/ingredients/
src/modules/routines/
src/modules/routine-logs/
src/modules/ai-analysis/
src/modules/journals/
src/domain/
tests/unit/
tests/integration/
tests/e2e/
tests/evals/
```

Rules:

- these folders are structure placeholders only;
- no product feature logic is implemented in these folders yet;
- `src/modules/notifications/` must not be created during MVP Week 1.
