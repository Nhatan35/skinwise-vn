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
- This ownership does not include SkinProfile, Routine, Journal, Product, Ingredient, AI, or dashboard data integration.

Current status:

```txt
src/app/api/me/route.ts
src/modules/users/app-user-profile.types.ts
src/modules/users/app-user-profile.repository.ts
src/modules/users/app-user-profile.mapper.ts
tests/unit/app-user-profile.test.ts
tests/unit/me-api-contract.test.ts
```

## 3. Database ownership

Planned owned files:

```txt
src/infrastructure/database/mongodb.ts
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
src/config/env.ts
```

Rules:

- do not create multiple MongoDB clients;
- all environment variables must be validated through `src/config/env.ts`;
- repositories must use shared database helpers;
- required indexes must be created through `ensure-indexes.ts`, not route handlers;
- route handlers must not query MongoDB directly;
- Auth.js adapter later must reuse the shared MongoClient or provider from `mongodb.ts`.

Current status:

```txt
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
src/infrastructure/database/mongodb.ts
```

`mongodb.ts` owns the shared MongoDB client helper and lazy client promise. `collections.ts` owns collection names/helpers. `ensure-indexes.ts` owns repeatable index definitions and the `npm run db:indexes` entrypoint. `src/config/env.ts` is implemented and remains the only place that validates `MONGODB_URI`. No repositories or business logic were implemented in Task 4.

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
src/app/api/skin-profile/route.ts
src/app/(dashboard)/onboarding/skin-profile/page.tsx
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
tests/unit/skin-profile-onboarding.test.ts
```

Rules:

- one profile per user;
- user identity comes from session;
- request bodies must not accept `userId`;
- repository reads, updates, and deletes must filter by authenticated `userId`;
- API responses must use SkinProfile DTOs and must not expose `_id` or `userId`;
- onboarding UI must call `/api/skin-profile` with `fetch` and must not import repository, database, use-case, or `server-only` modules;
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
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
tests/unit/skin-profile-onboarding.test.ts
src/app/(dashboard)/onboarding/skin-profile/page.tsx
```

## 5. Product ownership

Planned owned files:

```txt
src/modules/products/product.schema.ts
src/modules/products/product.dto.ts
src/modules/products/product.mapper.ts
src/modules/products/product.repository.ts
src/modules/products/list-products.use-case.ts
src/modules/products/create-product.use-case.ts
src/modules/products/get-product.use-case.ts
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
```

Rules:

- visibility rules live in use case/repository;
- normal users cannot set `source` or `verificationStatus`;
- product APIs require authentication in MVP.

## 6. Ingredient ownership

Planned owned files:

```txt
src/modules/ingredients/ingredient.schema.ts
src/modules/ingredients/ingredient.dto.ts
src/modules/ingredients/ingredient.mapper.ts
src/modules/ingredients/ingredient.repository.ts
src/modules/ingredients/search-ingredients.use-case.ts
src/modules/ingredients/get-ingredient.use-case.ts
src/app/api/ingredients/route.ts
src/app/api/ingredients/[id]/route.ts
src/app/api/ingredients/explain/route.ts
```

Rules:

- ingredient search/detail is separate from product visibility;
- AI explanation orchestration belongs to `ai-analysis`.

## 7. Routine ownership

Planned owned files:

```txt
src/modules/routines/routine.schema.ts
src/modules/routines/routine.dto.ts
src/modules/routines/routine.mapper.ts
src/modules/routines/routine.repository.ts
src/modules/routines/create-routine.use-case.ts
src/modules/routines/update-routine.use-case.ts
src/modules/routines/get-routine.use-case.ts
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
```

Rules:

- always query by `routineId + userId`;
- preserve product snapshots when possible;
- no AI logic inside basic CRUD use cases.

## 8. Routine analysis ownership

Planned owned files:

```txt
src/domain/rules/routine-safety-engine.ts
src/domain/rules/routine-safety-rules.ts
src/modules/ai-analysis/ai-analysis.schema.ts
src/modules/ai-analysis/ai-analysis.dto.ts
src/modules/ai-analysis/ai-analysis.mapper.ts
src/modules/ai-analysis/analyze-routine.use-case.ts
src/infrastructure/ai/ai-provider.ts
src/infrastructure/ai/openai-provider.ts
src/app/api/routines/[id]/analyze/route.ts
src/app/api/routines/[id]/analyses/route.ts
```

Rules:

- rule engine must run first;
- AI provider must be server-only;
- AI response must pass schema validation;
- fallback behavior must follow `docs/16-ai-fallback-policy.md`.

## 9. RoutineLog ownership

Planned owned files:

```txt
src/modules/routine-logs/routine-log.schema.ts
src/modules/routine-logs/routine-log.dto.ts
src/modules/routine-logs/routine-log.mapper.ts
src/modules/routine-logs/routine-log.repository.ts
src/modules/routine-logs/upsert-routine-log.use-case.ts
src/modules/routine-logs/list-routine-logs.use-case.ts
src/app/api/routine-logs/route.ts
```

Rules:

- same `userId + routineId + localDate` updates existing log;
- do not create duplicates;
- keep separate from SkinJournal.

## 10. SkinJournal ownership

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

## 11. Dashboard shell ownership

Owned files:

```txt
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
tests/unit/dashboard-shell.test.ts
tests/unit/dashboard-routes.test.ts
```

Rules:

- `src/app/(dashboard)/dashboard/page.tsx` owns the real `/dashboard` route.
- do not create `src/app/(dashboard)/page.tsx`;
- dashboard config must contain safe metadata only;
- dashboard config must not import auth, database, `server-only`, or API code;
- only `/dashboard` is an enabled route in the dashboard nav;
- unimplemented feature nav items must use `href: null` and `disabled: true`;
- placeholder cards must not contain fake skincare, routine, product, journal, ingredient, or AI results.

Current status:

```txt
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
tests/unit/dashboard-shell.test.ts
tests/unit/dashboard-routes.test.ts
```

Task 6 implements the protected dashboard shell only. It does not implement dashboard data integration, database queries, business APIs, feature routes, fake data, or medical diagnosis.

## 12. UI shared ownership

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

## 13. Reserved future ownership

Do not implement yet:

```txt
src/modules/notifications/
src/infrastructure/storage/
```

These are reserved for future scope.


## 14. Engineering governance ownership

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

## 15. Week 1 Task 1 placeholder ownership

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
