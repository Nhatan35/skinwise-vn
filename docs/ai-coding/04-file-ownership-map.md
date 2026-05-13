# 04-file-ownership-map.md

# File Ownership Map — SkinWise VN MVP v1.2.6

## 1. Purpose

This document prevents duplicate logic by assigning ownership of responsibilities to specific folders and files.

Update this file when new implementation files are added.

## 2. Auth ownership

Planned owned files:

```txt
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/middleware.ts
src/app/api/auth/[...nextauth]/route.ts
```

Rules:

- do not duplicate auth logic inside route handlers;
- always use a shared auth helper for protected APIs;
- never trust `userId` from request body;
- admin checks must be centralized.

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
- required indexes must be created through `ensure-indexes.ts`, not route handlers.

Current status:

```txt
src/infrastructure/database/ensure-indexes.ts
```

`ensure-indexes.ts` exists as a safe Week 1 Task 1 placeholder. `src/config/env.ts` is implemented. `mongodb.ts` and `collections.ts` are not implemented yet.

## 4. Skin Profile ownership

Planned owned files:

```txt
src/modules/skin-profile/skin-profile.schema.ts
src/modules/skin-profile/skin-profile.dto.ts
src/modules/skin-profile/skin-profile.mapper.ts
src/modules/skin-profile/skin-profile.repository.ts
src/modules/skin-profile/create-skin-profile.use-case.ts
src/modules/skin-profile/update-skin-profile.use-case.ts
src/app/api/skin-profile/route.ts
```

Rules:

- one profile per user;
- user identity comes from session;
- no medical diagnosis fields.

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

## 11. UI shared ownership

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

## 12. Reserved future ownership

Do not implement yet:

```txt
src/modules/notifications/
src/infrastructure/storage/
```

These are reserved for future scope.


## 12. Engineering governance ownership

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

## 13. Week 1 Task 1 placeholder ownership

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
