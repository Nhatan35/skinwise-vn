# 01-codebase-map.md

# Codebase Map — SkinWise VN MVP v1.2.6

## 1. Purpose

This file tells AI coding assistants what each folder and major file is responsible for.

It must be updated whenever the implementation structure changes.

## 2. Current repository state

Current package state: **Week 3 Task 1 Routine API Foundation implemented**.

The repository now contains the SDD package plus a Next.js App Router foundation copied into the real repo and normalized for SkinWise VN. Week 1 Tasks 1-7 added project foundation, UI tooling, environment validation, MongoDB infrastructure foundation, Auth.js foundation, a protected dashboard shell, and `GET /api/me` with lazy `AppUserProfile` creation. Week 2 delivered the Skin Profile API, onboarding UI, onboarding flow integration, and protected `/skin-profile` view/edit route. Week 3 Task 1 added the Routine API foundation: `/api/routines` supports authenticated list/create, `/api/routines/[id]` supports authenticated read/update/delete, all operations are scoped to the authenticated user, `userId` is never accepted from the client, MongoDB `_id` is converted to `id` at the DTO boundary, and routine step IDs are generated server-side. Product snapshot lookup, Routine Builder UI, Routine Analysis, Product/Ingredient modules, AI, and dashboard data integration are not implemented.

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
src/app/(dashboard)/skin-profile/page.tsx
src/app/api/auth/[...nextauth]/route.ts
src/app/api/me/route.ts
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
src/app/api/skin-profile/route.ts
src/app/globals.css
src/app/favicon.ico
```

Auth.js owns `src/app/api/auth/[...nextauth]/route.ts`. It re-exports Auth.js handlers and does not use the SkinWise `{ data, error }` response wrapper.

`src/app/api/me/route.ts` is a SkinWise-owned app API. It uses `getCurrentUser()`, returns `UNAUTHORIZED` for unauthenticated requests, lazily ensures `AppUserProfile` for authenticated users, and returns only the safe current-user DTO.

`src/app/api/skin-profile/route.ts` is a SkinWise-owned protected API. It validates create/update input with Zod, derives user ownership from `getCurrentUser()`, calls Skin Profile use-case functions, and returns only SkinProfile DTOs without `_id` or `userId`. Successful `POST /api/skin-profile` marks AppUserProfile onboarding complete inside the Skin Profile use case; `PATCH /api/skin-profile` updates only SkinProfile fields.

`src/app/api/routines/route.ts` and `src/app/api/routines/[id]/route.ts` are SkinWise-owned protected Routine API routes. They validate input with Zod, derive `userId` from `getCurrentUser()`, call Routine use-case functions, return `{ data, error }`, map MongoDB `_id` to `id`, and never expose `userId` or raw ObjectId values. `/api/routines` lists and creates routines for the authenticated user. `/api/routines/[id]` reads, updates, and deletes only routines owned by the authenticated user. Client input cannot provide `userId`, `id`, `_id`, timestamps, `stepId`, or snapshot fields.

`src/app/(dashboard)/layout.tsx` protects the dashboard route group with `getCurrentUser()` and redirects unauthenticated users to `/api/auth/signin?callbackUrl=/dashboard`. `src/app/(dashboard)/dashboard/page.tsx` creates the real `/dashboard` URL and renders placeholder cards only. `src/app/(dashboard)/onboarding/skin-profile/page.tsx` creates the protected `/onboarding/skin-profile` URL and renders the Skin Profile onboarding form.

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

`auth.config.ts` is edge-safe and owns pure provider/config helpers. `src/auth.ts` owns the full server-side Auth.js setup with MongoDB Adapter gating. `src/proxy.ts` owns the Next.js 16 proxy wrapper for protected dashboard routes. `get-current-user.ts` maps Auth.js sessions to a minimal `CurrentUser` without querying `AppUserProfile`.

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
```

`routine.schema.ts` owns strict create/update validation for Routine API input. It rejects unknown fields, client-provided `userId`, `id`, `_id`, timestamps, `stepId`, and Product snapshot fields. `routine.use-case.ts` generates server-side `stepId` values for submitted steps before persistence. `routine.repository.ts` imports `server-only`, uses `getRoutinesCollection()`, never creates a MongoClient, handles invalid routine ids safely, and always filters read/update/delete operations by `_id + userId`. `routine.mapper.ts` converts `_id` to `id`, Date fields to ISO strings, and omits `userId`.

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

No product module business logic has been implemented yet. Routine API CRUD is implemented, but Routine Builder UI, Product snapshot lookup, Routine Analysis, Routine Logs, AI, and dashboard data integration are not implemented.

Current implemented dashboard files:

```txt
src/modules/dashboard/dashboard-shell.config.ts
```

`dashboard-shell.config.ts` owns safe dashboard nav and card metadata. It does not import auth, database, `server-only`, or API code. `/dashboard` and `/skin-profile` are enabled protected dashboard navigation routes; `/onboarding/skin-profile` remains available for first-time onboarding and empty-state CTA; unrelated feature areas remain disabled metadata with `href: null`.

### `src/domain/`

Purpose:

- deterministic business rules;
- entities;
- value objects;
- domain errors.

Key future files:

```txt
src/domain/rules/routine-safety-engine.ts
src/domain/rules/routine-safety-rules.ts
```

Rules:

- routine safety rules must be deterministic;
- no AI provider calls here;
- no UI code here.

Current status:

```txt
src/domain/ exists as a tracked placeholder.
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
```

`mongodb.ts` owns the server-only MongoDB client helper and lazy client promise. `collections.ts` centralizes SkinWise and Auth.js-owned collection name references. `ensure-indexes.ts` owns repeatable index definitions and the `npm run db:indexes` script entrypoint. Routine ownership query indexes are defined for `{ userId, timeOfDay }` and `{ userId, updatedAt }`.

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

`routes.SKIN_PROFILE` points to `/skin-profile`, and `routes.ONBOARDING_SKIN_PROFILE` points to `/onboarding/skin-profile`.

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
tests/unit/foundation.test.ts
tests/unit/get-current-user.test.ts
tests/unit/me-api-contract.test.ts
tests/unit/mongodb.test.ts
tests/unit/routine.test.ts
tests/unit/routine-api-contract.test.ts
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
