# 01-codebase-map.md

# Codebase Map — SkinWise VN MVP v1.2.6

## 1. Purpose

This file tells AI coding assistants what each folder and major file is responsible for.

It must be updated whenever the implementation structure changes.

## 2. Current repository state

Current package state: **TASK SJ-001 SkinJournal Backend API Foundation**.

The repository now contains the SDD package plus a Next.js App Router foundation copied into the real repo and normalized for SkinWise VN. Week 1 Tasks 1-7 added project foundation, UI tooling, environment validation, MongoDB infrastructure foundation, Auth.js foundation, a protected dashboard route group, and `GET /api/me` with lazy `AppUserProfile` creation. Week 2 delivered the Skin Profile API, onboarding UI, onboarding flow integration, and protected `/skin-profile` view/edit route. Week 3 delivered the Routine API foundation, protected `/routines` UI foundation, deterministic Routine Safety Engine, Routine Analysis API foundation, Routine Analysis UI panel, and MongoDB-backed per-user rate limiting for routine analysis. TASK PI-001 added authenticated read-only Product and Ingredient API foundations with strict query validation, DTO mappers, repositories, use cases, and API contract tests. TASK PP-001 integrated the Product Picker into the existing Routine Builder and added server-side Routine Product Snapshot population for selected visible products. TASK RL-001 implemented the RoutineLog backend foundation, and TASK RL-002 integrated RoutineLog UI controls into the existing `/routines` page. TASK DB-001 replaced the placeholder dashboard with a real authenticated dashboard that renders `DashboardOverview` and fetches `GET /api/dashboard?localDate=YYYY-MM-DD` to summarize Skin Profile setup, Routine counts, today's RoutineLog progress, latest Routine Analysis, and next suggested actions. TASK AI-001 implemented the server-only AI Provider Abstraction with `MockAIProvider`, provider factory, and AI provider error classes. OpenAI and Gemini providers are intentionally not implemented yet.

TASK AI-002 added strict Zod structured output validation for the current `AIProvider` output types from `src/infrastructure/ai/ai-provider.ts`. TASK AI-003 added `ValidatedAIProvider` and updated `getAIProvider()` so every successfully constructed raw provider is wrapped before being returned. Mock mode now returns `ValidatedAIProvider` around `MockAIProvider`. TASK AI-004 added an explicit provider-to-product Routine Analysis mapper so validated `AIProviderRoutineAnalysisResult` can be transformed into the stable product-facing `RoutineAnalysisResult` shape without leaking provider metadata or educational notes. TASK AI-005 wired `getAIProvider().analyzeRoutine()` into the Routine Analysis use case with deterministic safety guarding and fallback persistence. TASK AI-006 added safe internal provider failure classification and optional internal `providerFailureReason` persistence for provider fallback. TASK AI-007 added authenticated, rate-limited `POST /api/ingredients/explain` using `getAIProvider().explainIngredient()` through `ValidatedAIProvider`, provider-to-public mapping, and deterministic fallback. TASK SJ-001 added the authenticated SkinJournal backend API foundation with create/list/update/delete endpoints, strict validation, user-owned repository operations, duplicate `localDate` conflict handling, DTO mapping, and tests. OpenAI and Gemini remain unsupported, so current provider-backed behavior uses the validated mock provider unless configuration selects an unsupported provider.

Current unimplemented areas are Product UI pages, Product submission POST API, admin product management, real OpenAI/Gemini provider integration, external LLM/API calls, SkinJournal UI, SkinJournal AI analysis, skin score, image upload, and medical diagnosis.

## 3. Root structure

```txt
skinwise-vn/
├── .github/
├── docs/
│   └── adr/
├── public/
├── src/
├── tests/
├── AGENTS.md
├── README.md
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── playwright.config.ts
└── vitest.config.ts
```

## 4. Documentation structure

```txt
docs/
├── 00-source-of-truth.md
├── 00-product-vision.md
├── 01-prd.md
├── 02-user-stories.md
├── 03-system-architecture.md
├── 04-data-model.md
├── 05-api-contract.md
├── 06-ai-contract.md
├── 07-security-privacy.md
├── 08-test-plan.md
├── 09-release-plan.md
├── 10-project-structure.md
├── 11-routine-safety-rules.md
├── 12-week-1-implementation-plan.md
├── 13-ui-route-map.md
├── 14-seed-data-spec.md
├── 15-use-case-and-repository-contract.md
├── 16-ai-fallback-policy.md
├── 17-vietnamese-copy-and-ui-guidelines.md
├── 18-deployment-checklist.md
├── 19-engineering-execution-checklist.md
├── 20-week-1-task-1-prompt.md
├── adr/
├── ai-coding/
├── prompts/
└── CHANGELOG-*.md
```

## 5. Source map

### `src/app/`

Purpose:

- Next.js App Router pages;
- layouts;
- route handlers;
- route groups.

Rules:

- pages must stay thin;
- route handlers must stay thin;
- no direct AI provider calls from UI;
- no direct database queries in pages.

Current implemented files:

```txt
src/app/layout.tsx
src/app/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/onboarding/skin-profile/page.tsx
src/app/(dashboard)/routines/page.tsx
src/app/(dashboard)/skin-profile/page.tsx
src/app/api/auth/[...nextauth]/route.ts
src/app/api/me/route.ts
src/app/api/ingredients/route.ts
src/app/api/ingredients/[id]/route.ts
src/app/api/ingredients/explain/route.ts
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
src/app/api/routines/[id]/analyze/route.ts
src/app/api/routines/[id]/analyses/route.ts
src/app/api/routine-logs/route.ts
src/app/api/skin-journal/route.ts
src/app/api/skin-journal/[id]/route.ts
src/app/api/dashboard/route.ts
src/app/api/skin-profile/route.ts
src/app/globals.css
src/app/favicon.ico
```

Auth.js owns `src/app/api/auth/[...nextauth]/route.ts`. It re-exports Auth.js handlers and does not use the SkinWise `{ data, error }` response wrapper.

`src/app/api/me/route.ts` is a SkinWise-owned app API. It uses `getCurrentUser()`, returns `UNAUTHORIZED` for unauthenticated requests, lazily ensures `AppUserProfile` for authenticated users, and returns only the safe current-user DTO.

`src/app/api/skin-profile/route.ts` is a SkinWise-owned protected API. It validates create/update input with Zod, derives user ownership from `getCurrentUser()`, calls Skin Profile use-case functions, and returns only SkinProfile DTOs without `_id` or `userId`. Successful `POST /api/skin-profile` marks AppUserProfile onboarding complete inside the Skin Profile use case; `PATCH /api/skin-profile` updates only SkinProfile fields.

`src/app/api/routines/route.ts` and `src/app/api/routines/[id]/route.ts` are SkinWise-owned protected Routine API routes. They validate input with Zod, derive `userId` from `getCurrentUser()`, call Routine use-case functions, return `{ data, error }`, map MongoDB `_id` to `id`, and never expose `userId` or raw ObjectId values. `/api/routines` lists and creates routines for the authenticated user. `/api/routines/[id]` reads, updates, and deletes only routines owned by the authenticated user. Client input cannot provide `userId`, `id`, `_id`, timestamps, `stepId`, or snapshot fields.

`src/app/api/routines/[id]/analyze/route.ts` and `src/app/api/routines/[id]/analyses/route.ts` are SkinWise-owned protected Routine Analysis API routes. They derive `userId` from `getCurrentUser()`, derive `routineId` from route params, call the Routine Analysis use case, return `{ data, error }`, and never accept client-provided analysis ownership, risk, rule, AI, model, or timestamp fields. `POST /api/routines/[id]/analyze` accepts an empty body only, checks the authenticated user's `routine_analysis:${userId}` rate limit after request validation, runs deterministic analysis when allowed, persists the result, and returns a public DTO. Rate-limited requests return `RATE_LIMITED` with HTTP 429 and `Retry-After` without calling the use case. `GET /api/routines/[id]/analyses` returns the authenticated user's analysis history for that routine.

`src/app/api/products/route.ts` and `src/app/api/products/[id]/route.ts` are SkinWise-owned protected Product API read routes. They require `getCurrentUser()`, validate list query params with Zod, call Product use cases, and return Product DTOs without `_id`, raw ObjectId values, `createdByUserId`, or `source`. This foundation returns only `reviewed` or `verified` products and is consumed by the Routine Builder Product Picker. It does not implement `POST /api/products`, `includeMine`, admin visibility, Product UI pages, Product submission, or Product detail UI routes.

`src/app/api/ingredients/route.ts` and `src/app/api/ingredients/[id]/route.ts` are SkinWise-owned protected Ingredient API read routes. They require `getCurrentUser()`, validate list query params with Zod, call Ingredient use cases, and return Ingredient DTOs without `_id` or raw ObjectId values. `src/app/api/ingredients/explain/route.ts` is a SkinWise-owned protected Ingredient Explanation API route. It requires authentication, validates strict JSON input, checks `ingredient_explanation:${userId}` after validation, calls the Ingredient explanation use case, and returns `{ data: { explanation }, error: null }`. Ingredient APIs do not use Product visibility, `includeMine`, or `createdByUserId` logic.

`src/app/api/routine-logs/route.ts` is a SkinWise-owned protected RoutineLog API route. It derives `userId` from `getCurrentUser()`, validates strict `GET /api/routine-logs?localDate=YYYY-MM-DD` and `PUT /api/routine-logs` inputs, canonicalizes daily logs by `userId + routineId + localDate`, and never accepts client-owned `userId`, `id`, `_id`, or timestamps.

`src/app/api/skin-journal/route.ts` and `src/app/api/skin-journal/[id]/route.ts` are SkinWise-owned protected SkinJournal API routes. They derive `userId` from `getCurrentUser()`, validate strict create/list/update inputs with Zod, call SkinJournal use cases, return public SkinJournal DTOs, and never accept client-owned `userId`, `id`, `_id`, timestamps, `localDate` changes through PATCH, or future image/photo fields. `POST /api/skin-journal` creates one entry per authenticated `userId + localDate` and returns `CONFLICT` on duplicates. `GET /api/skin-journal` lists only the authenticated user's entries with optional local-date range filters. `PATCH` and `DELETE` operate only on `_id + userId` and return `NOT_FOUND` for missing, invalid, or not-owned entries.

`src/app/api/dashboard/route.ts` is a SkinWise-owned protected Dashboard API route. It exports `runtime = "nodejs"`, supports `GET` only, validates the strict `localDate` query through `dashboardQuerySchema`, rejects unknown query fields, derives `userId` from the authenticated session, and returns `{ data: { dashboard }, error: null }` without exposing `userId`, `_id`, raw ObjectId values, or MongoDB internals.

`src/app/(dashboard)/layout.tsx` protects the dashboard route group with `getCurrentUser()` and redirects unauthenticated users to `/api/auth/signin?callbackUrl=/dashboard`. `src/app/(dashboard)/dashboard/page.tsx` creates the real `/dashboard` URL and renders `DashboardOverview`; `/dashboard` is no longer placeholder-only. `src/app/(dashboard)/onboarding/skin-profile/page.tsx` creates the protected `/onboarding/skin-profile` URL and renders the Skin Profile onboarding form. `src/app/(dashboard)/routines/page.tsx` creates the protected `/routines` URL and renders the Routine Builder client component with Product Picker, Routine Analysis, and RoutineLog controls.

### `src/modules/`

Purpose:

- application modules;
- validation schemas;
- DTOs;
- DTO mappers;
- repositories;
- use cases;
- module tests.

Expected modules:

```txt
auth
users
skin-profile
products
ingredients
routines
routine-logs
ai-analysis
journals
```

Reserved future module:

```txt
notifications
```

Current implemented auth files:

```txt
src/auth.ts
src/proxy.ts
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/modules/auth/next-auth.d.ts
src/modules/auth/types.ts
```

`auth.config.ts` is edge-safe and owns pure provider/config helpers. `src/auth.ts` owns the full server-side Auth.js setup with MongoDB Adapter gating. `src/proxy.ts` owns the Next.js 16 proxy wrapper for `/dashboard/:path*`, `/onboarding/:path*`, `/skin-profile/:path*`, and `/routines/:path*`. `get-current-user.ts` maps Auth.js sessions to a minimal `CurrentUser` without querying `AppUserProfile`.

Current implemented users files:

```txt
src/modules/users/app-user-profile.types.ts
src/modules/users/app-user-profile.repository.ts
src/modules/users/app-user-profile.mapper.ts
```

`app-user-profile.repository.ts` owns AppUserProfile lookup, atomic lazy creation, and the server-side onboarding completion marker through `findOneAndUpdate` upserts using `getAppUserProfilesCollection()`. It stores the Auth.js current user id as an opaque string at the repository/API boundary to avoid coercing session ids into MongoDB `ObjectId`. `app-user-profile.mapper.ts` maps Auth.js current-user data plus AppUserProfile fields into the `/api/me` DTO without exposing MongoDB internals, raw session data, tokens, or `image`.

Current implemented skin-profile files:

```txt
src/modules/skin-profile/skin-profile.types.ts
src/modules/skin-profile/skin-profile.schema.ts
src/modules/skin-profile/skin-profile.dto.ts
src/modules/skin-profile/skin-profile.mapper.ts
src/modules/skin-profile/skin-profile.repository.ts
src/modules/skin-profile/skin-profile.use-case.ts
src/modules/skin-profile/components/skin-profile-onboarding-form.tsx
src/modules/skin-profile/components/skin-profile-view-edit.tsx
```

`skin-profile.schema.ts` owns create/update Zod validation. `skin-profile.repository.ts` owns user-scoped SkinProfile persistence through `getSkinProfilesCollection()`. `skin-profile.use-case.ts` provides the thin orchestration layer used by the route handler and marks AppUserProfile onboarding complete only after successful SkinProfile create/replace. `skin-profile.mapper.ts` converts database documents into API DTOs. `components/skin-profile-onboarding-form.tsx` is the client-side first-time onboarding form; it calls `/api/skin-profile` with `fetch`, may use `POST`/`PATCH` according to onboarding behavior, and must not import repository, database, use-case, or `server-only` modules. `components/skin-profile-view-edit.tsx` is the client-side `/skin-profile` view/edit UI; it calls `GET /api/skin-profile` on load, shows an empty state linking to `/onboarding/skin-profile` when missing, updates existing profiles with `PATCH /api/skin-profile`, stays on `/skin-profile` after save, and does not use `POST`.

Current implemented routine files:

```txt
src/modules/routines/routine.types.ts
src/modules/routines/routine.schema.ts
src/modules/routines/routine.dto.ts
src/modules/routines/routine.mapper.ts
src/modules/routines/routine.repository.ts
src/modules/routines/routine.use-case.ts
src/modules/routines/components/routine-analysis-panel.tsx
src/modules/routines/components/routine-builder.tsx
```

`routine.schema.ts` owns strict create/update validation for Routine API input. It rejects unknown fields, client-provided `userId`, `id`, `_id`, timestamps, `stepId`, and Product snapshot fields. `routine.use-case.ts` generates server-side `stepId` values for submitted steps, validates selected visible `productId` values through the Product use-case path, and populates server-owned Product snapshot fields before persistence. `routine.repository.ts` imports `server-only`, uses `getRoutinesCollection()`, never creates a MongoClient, handles invalid routine ids safely, and always filters read/update/delete operations by `_id + userId`. `routine.mapper.ts` converts `_id` to `id`, Date fields to ISO strings, and omits `userId`. `components/routine-builder.tsx` is the client-side `/routines` UI; it calls `GET /api/routines`, `POST /api/routines`, `PATCH /api/routines/[id]`, `DELETE /api/routines/[id]`, `GET /api/products?limit=50`, `POST /api/routines/[id]/analyze`, `GET /api/routines/[id]/analyses`, `GET /api/routine-logs?localDate=YYYY-MM-DD`, and `PUT /api/routine-logs` with `fetch`. It supports Product Picker selection plus manual `customProductName` fallback and must not import repository, use-case, database, MongoDB, auth helper, Routine Safety Engine, or `server-only` modules. `components/routine-analysis-panel.tsx` displays only API-provided RoutineAnalysis DTO fields and may format risk/priority labels for readability; it must not generate risk levels, warnings, suggestions, summaries, diagnosis, treatment claims, or skin scores.

Current implemented product files:

```txt
src/modules/products/product.types.ts
src/modules/products/product.schema.ts
src/modules/products/product.dto.ts
src/modules/products/product.mapper.ts
src/modules/products/product.repository.ts
src/modules/products/product.use-case.ts
src/modules/products/index.ts
```

`product.schema.ts` owns strict list query validation for `GET /api/products`. `product.repository.ts` imports `server-only`, uses `getProductsCollection()`, applies default visibility for `reviewed` and `verified` products only, supports canonical search/filter params, and returns `null` for invalid ObjectId detail lookups without querying. `product.mapper.ts` converts `_id` to `id`, Dates to ISO strings, copies arrays, and omits `createdByUserId`, `source`, and raw ObjectId values. This foundation is read-only and is consumed by the Routine Builder Product Picker and server-side Routine Product Snapshot population. It does not implement Product UI pages, Product submission, `POST /api/products`, `includeMine`, admin product management, external product APIs, seed scripts, or image upload.

Current implemented ingredient files:

```txt
src/modules/ingredients/ingredient.types.ts
src/modules/ingredients/ingredient.schema.ts
src/modules/ingredients/ingredient.dto.ts
src/modules/ingredients/ingredient.mapper.ts
src/modules/ingredients/ingredient.repository.ts
src/modules/ingredients/ingredient.use-case.ts
src/modules/ingredients/ingredient-explanation.constants.ts
src/modules/ingredients/ingredient-explanation.dto.ts
src/modules/ingredients/ingredient-explanation.schema.ts
src/modules/ingredients/ingredient-explanation.mapper.ts
src/modules/ingredients/explain-ingredient.use-case.ts
src/modules/ingredients/index.ts
```

`ingredient.schema.ts` owns strict list query validation for `GET /api/ingredients`. `ingredient.repository.ts` imports `server-only`, uses `getIngredientsCollection()`, searches canonical ingredient fields, filters by `functions`, and returns `null` for invalid ObjectId detail lookups without querying. `ingredient.mapper.ts` converts `_id` to `id`, Dates to ISO strings, and copies arrays. `ingredient-explanation.schema.ts` owns strict request validation for `POST /api/ingredients/explain`. `ingredient-explanation.mapper.ts` maps validated provider ingredient explanation output into the public Ingredient Explanation DTO without exposing `providerMetadata` or `educationalNotes`. `explain-ingredient.use-case.ts` calls `getAIProvider().explainIngredient()`, relies on `ValidatedAIProvider`, and returns deterministic fallback with `source = "fallback"` when provider construction/call/validation/mapping fails. Safety classifier integration and admin ingredient management remain unimplemented.

Current implemented routine analysis files:

```txt
src/modules/ai-analysis/routine-analysis.types.ts
src/modules/ai-analysis/routine-analysis.schema.ts
src/modules/ai-analysis/routine-analysis.dto.ts
src/modules/ai-analysis/routine-analysis.mapper.ts
src/modules/ai-analysis/routine-analysis.repository.ts
src/modules/ai-analysis/routine-analysis.constants.ts
src/modules/ai-analysis/ai-provider-failure-observability.ts
src/modules/ai-analysis/ai-provider-routine-analysis.mapper.ts
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/index.ts
```

`routine-analysis.schema.ts` owns strict empty-body validation for `POST /api/routines/[id]/analyze`. `routine-analysis.repository.ts` imports `server-only`, uses `getRoutineAnalysesCollection()`, creates RoutineAnalysis documents for the authenticated user, and lists analysis history by `userId + routineId` newest first. `routine-analysis.constants.ts` owns shared Routine Analysis constants such as the educational disclaimer. `ai-provider-failure-observability.ts` owns safe internal classification for Routine Analysis provider fallback reasons. `ai-provider-routine-analysis.mapper.ts` owns the pure provider-to-product mapping from validated `AIProviderRoutineAnalysisResult` into `RoutineAnalysisResult`, without exposing `providerMetadata` or `educationalNotes`. `analyze-routine.use-case.ts` verifies routine ownership through the Routine repository, optionally loads Skin Profile context, runs the deterministic Routine Safety Engine first, builds deterministic fallback guidance, attempts `getAIProvider().analyzeRoutine()`, maps provider output through the AI-004 mapper, safety-guards final risk with `max(safety risk, provider risk)`, preserves rule-based warnings/suggestions on provider success, and falls back to deterministic output when provider construction/call/validation/mapping/guard logic fails. Provider fallback persists an optional internal `providerFailureReason`; persistence remains outside the provider fallback catch. `routine-analysis.mapper.ts` converts MongoDB ids and Dates to public strings and omits `userId`, `_id`, internal `ruleResults`, provider metadata, model metadata, provider failure reason, and raw provider errors. This foundation does not import OpenAI, Gemini, external APIs, Product/Ingredient modules, UI components, or dashboard modules.


Current implemented routine-log files:

```txt
src/modules/routine-logs/index.ts
src/modules/routine-logs/routine-log.types.ts
src/modules/routine-logs/routine-log.schema.ts
src/modules/routine-logs/routine-log.dto.ts
src/modules/routine-logs/routine-log.mapper.ts
src/modules/routine-logs/routine-log.repository.ts
src/modules/routine-logs/routine-log.use-case.ts
src/modules/routine-logs/routine-log.client.ts
```

`routine-log.schema.ts` owns strict query/body validation for `GET /api/routine-logs?localDate=YYYY-MM-DD` and `PUT /api/routine-logs`. `routine-log.repository.ts` imports `server-only`, uses `getRoutineLogsCollection()`, and upserts logs by authenticated `userId + routineId + localDate`. `routine-log.use-case.ts` verifies routine ownership and validates completed step IDs against the target routine. `routine-log.mapper.ts` returns public RoutineLog DTOs without `userId`, `_id`, or MongoDB internals. `routine-log.client.ts` is client-safe and owns browser local date/timezone helpers plus RoutineLog API calls for the existing `/routines` page.

Current implemented SkinJournal files:

```txt
src/modules/journals/skin-journal.types.ts
src/modules/journals/skin-journal.schema.ts
src/modules/journals/skin-journal.dto.ts
src/modules/journals/skin-journal.mapper.ts
src/modules/journals/skin-journal.repository.ts
src/modules/journals/create-skin-journal.use-case.ts
src/modules/journals/list-skin-journal.use-case.ts
src/modules/journals/update-skin-journal.use-case.ts
src/modules/journals/delete-skin-journal.use-case.ts
src/modules/journals/index.ts
```

`skin-journal.schema.ts` owns strict create, list, and update validation for the SkinJournal API. It validates `localDate` as `YYYY-MM-DD`, validates IANA timezone strings, defaults create arrays to empty arrays, limits list queries to max 50 records, rejects unknown fields, and rejects future image/photo fields through strict schemas. `skin-journal.repository.ts` imports `server-only`, uses `getSkinJournalsCollection()`, creates entries with a safe duplicate-key conflict error for unique `userId + localDate`, lists entries by `userId` with optional local-date filters newest first, and always filters read/update/delete operations by `_id + userId`. `skin-journal.mapper.ts` converts MongoDB `_id` and Date fields into public strings and omits `userId`, `_id`, raw ObjectId values, future image fields, and photo fields. The SkinJournal use cases return DTO-safe results for the API routes. SJ-001 does not implement UI, image upload, product lookup for `productsUsed`, or AI journal analysis.

Week 1 Task 1 created these additional placeholder module folders only:

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
```

Routine API CRUD, the `/routines` UI foundation, the Routine Safety Engine, the Routine Analysis API foundation, Routine Analysis API rate limiting, the `/routines` Routine Analysis UI panel, read-only Product/Ingredient API foundations, Product Picker, server-side Routine Product Snapshot population, RoutineLog backend/UI integration, Dashboard Data Integration, and SkinJournal backend API foundation are implemented.

Current unimplemented areas are Product UI pages, Product submission POST API, admin product management, real OpenAI/Gemini provider integration, external LLM/API calls, SkinJournal UI, SkinJournal AI analysis, skin score, image upload, and medical diagnosis.

Current implemented dashboard files:

```txt
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
```

`dashboard-shell.config.ts` owns safe dashboard nav and card metadata. It does not import auth, database, `server-only`, or API code. `dashboard.schema.ts` owns strict `localDate` query validation for `GET /api/dashboard?localDate=YYYY-MM-DD`. `dashboard.use-case.ts` builds the authenticated user's dashboard summary from existing Skin Profile, Routine, RoutineLog, and Routine Analysis data. `dashboard.mapper.ts` maps the summary into public Dashboard DTOs without `userId`, `_id`, raw ObjectId values, or MongoDB internals. `DashboardOverview` is the client component rendered by `/dashboard`; it fetches `GET /api/dashboard?localDate=YYYY-MM-DD` using the browser local date and displays Skin Profile summary, routine completion summary, today's routine log status, latest routine analysis summary, and next suggested actions. `/dashboard`, `/skin-profile`, and `/routines` are enabled protected dashboard navigation routes; `/onboarding/skin-profile` remains available for first-time onboarding and empty-state CTA; unrelated feature areas remain disabled metadata with `href: null`.

### `src/domain/`

Purpose:

- deterministic business rules;
- entities;
- value objects;
- domain errors.

Current implemented files:

```txt
src/domain/routine-safety/routine-safety.types.ts
src/domain/routine-safety/active-signal-normalizer.ts
src/domain/routine-safety/routine-safety-engine.ts
src/domain/routine-safety/index.ts
```

Rules:

- routine safety rules must be deterministic;
- no AI provider calls here;
- no UI code here;
- no API, database, repository, use-case, Auth.js, Next.js, environment, or config imports here;
- do not load Product data when `productId` exists but snapshots are missing.

Current status:

```txt
src/domain/routine-safety/ implements the domain-only Routine Safety Engine foundation.
```

### `src/infrastructure/`

Purpose:

- MongoDB client;
- database collection helpers;
- repeatable index creation script;
- AI provider implementation;
- storage provider later;
- logging.

Rules:

- server-only;
- no React components;
- no business workflow orchestration.

Current implemented files:

```txt
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
src/infrastructure/database/mongodb.ts
src/infrastructure/ai/ai-provider.ts
src/infrastructure/ai/ai-provider.errors.ts
src/infrastructure/ai/ai-provider.factory.ts
src/infrastructure/ai/ai-output.schema.ts
src/infrastructure/ai/ai-output.validator.ts
src/infrastructure/ai/mock-ai-provider.ts
src/infrastructure/ai/validated-ai-provider.ts
src/infrastructure/ai/index.ts
src/infrastructure/rate-limiting/rate-limit.ts
```

`mongodb.ts` owns the server-only MongoDB client helper and lazy client promise. `collections.ts` centralizes SkinWise and Auth.js-owned collection name references, including `routine_logs`, `routine_analyses`, and `rate_limits`. `ensure-indexes.ts` owns repeatable index definitions and the `npm run db:indexes` script entrypoint. Routine ownership query indexes are defined for `{ userId, timeOfDay }` and `{ userId, updatedAt }`. RoutineAnalysis indexes already exist for `userId + routineId`, `userId + createdAt`, `userId + riskLevel + createdAt`, `promptVersion`, and `modelName`. Rate limit indexes include unique `{ key: 1 }` and TTL `{ expiresAt: 1 }` with `expireAfterSeconds: 0`. `rate-limit.ts` owns the server-only MongoDB-backed rate limit helper and must not be imported by client components. `src/infrastructure/ai/` owns the server-only AI Provider Abstraction from TASK AI-001, the structured output validation layer from TASK AI-002, and provider-flow validation from TASK AI-003. It exports the exact `AIProvider` interface for routine analysis, ingredient explanation, and safety classification, plus `MockAIProvider`, `ValidatedAIProvider`, `getAIProvider()`, provider error classes, strict Zod schemas for current AIProvider outputs, and validator functions that throw `AIProviderResponseError` for invalid AI output. `getAIProvider()` reads `process.env.AI_PROVIDER`, defaults missing/empty/mock values to a raw `MockAIProvider`, wraps successful providers with `ValidatedAIProvider`, throws configuration errors for OpenAI and Gemini because they are not implemented yet, does not initialize external clients, does not call external AI APIs, and does not require an AI key.

### `src/shared/`

Purpose:

- shared components;
- constants;
- shared types;
- utility functions;
- shared validators.

Rules:

- do not hide feature-specific business logic here;
- move feature-specific logic to modules.

Current implemented files:

```txt
src/shared/constants/routes.ts
src/shared/types/result.ts
```

`routes.DASHBOARD` points to `/dashboard`, `routes.SKIN_PROFILE` points to `/skin-profile`, `routes.ONBOARDING_SKIN_PROFILE` points to `/onboarding/skin-profile`, and `routes.ROUTINES` points to `/routines`.

### `src/config/`

Purpose:

- environment validation;
- app-wide config;
- route constants if needed.

Key future files:

```txt
src/config/env.ts
src/config/app.ts
src/config/features.ts
```

Current implemented files:

```txt
src/config/app.ts
src/config/env.ts
src/config/features.ts
```

`src/config/env.ts` contains server-only Zod environment validation. It does not connect to MongoDB, Auth.js, or AI providers.

### `.github/`

Purpose:

- pull request checklist;
- CI quality checks.

Key files:

```txt
.github/pull_request_template.md
.github/workflows/ci.yml
```

Rules:

- keep CI aligned with package scripts;
- use PR checklist for AI-generated patches.

## 6. Test map

```txt
tests/unit/
tests/integration/
tests/e2e/
tests/evals/
```

Rules:

- domain rules get unit tests;
- API behavior gets integration tests;
- critical user flows get E2E tests;
- AI output behavior gets eval tests.

Current implemented tests:

```txt
tests/unit/database-collections.test.ts
tests/unit/database-indexes.test.ts
tests/unit/env.test.ts
tests/unit/auth-config.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/auth-route.test.ts
tests/unit/app-user-profile.test.ts
tests/unit/dashboard-routes.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/dashboard-api-contract.test.ts
tests/unit/dashboard-ui.test.ts
tests/unit/dashboard-use-case.test.ts
tests/unit/ai-output-validation.test.ts
tests/unit/ai-provider.test.ts
tests/unit/foundation.test.ts
tests/unit/get-current-user.test.ts
tests/unit/ingredient.test.ts
tests/unit/ingredient-api-contract.test.ts
tests/unit/ingredient-explanation.test.ts
tests/unit/ingredient-explanation-api-contract.test.ts
tests/unit/ingredient-use-case.test.ts
tests/unit/me-api-contract.test.ts
tests/unit/mongodb.test.ts
tests/unit/product.test.ts
tests/unit/product-api-contract.test.ts
tests/unit/product-use-case.test.ts
tests/unit/routine-log.test.ts
tests/unit/routine-log-api-contract.test.ts
tests/unit/routine-log-client.test.ts
tests/unit/routine-log-ui.test.ts
tests/unit/routine-log-use-case.test.ts
tests/unit/skin-journal.test.ts
tests/unit/skin-journal-api-contract.test.ts
tests/unit/skin-journal-use-case.test.ts
tests/unit/routine.test.ts
tests/unit/routine-api-contract.test.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/routine-analysis.test.ts
tests/unit/routine-analysis-api-contract.test.ts
tests/unit/ai-provider-routine-analysis-mapper.test.ts
tests/unit/ai-provider-failure-observability.test.ts
tests/unit/routine-analysis-ui.test.ts
tests/unit/routine-analysis-use-case.test.ts
tests/unit/routine-safety-engine.test.ts
tests/unit/routine-use-case.test.ts
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
tests/unit/skin-profile-onboarding.test.ts
tests/unit/skin-profile-use-case.test.ts
tests/unit/skin-profile-view-edit.test.ts
tests/unit/ui-foundation.test.ts
```

Playwright config exists, but E2E tests and browsers are not installed/run yet.

## 7. Update requirement

Whenever code files are added, update this document with:

- new folder purpose;
- new module ownership;
- status of implemented files;
- any deviation from `docs/10-project-structure.md`.
