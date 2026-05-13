# 12-week-1-implementation-plan.md

# Week 1 Implementation Plan — MVP v1.2.6

## 1. Goal

Create a clean, deployable, testable Next.js foundation for SkinWise VN.

Week 1 is not about implementing the full skincare product. It is about preparing the project so later feature work can be added safely.

## 2. Week 1 allowed scope

Allowed:

- initialize Next.js App Router project;
- configure TypeScript;
- configure Tailwind CSS;
- initialize shadcn/ui;
- create base folder structure;
- create environment validation;
- create MongoDB client helper;
- configure Auth.js foundation;
- create protected dashboard shell;
- create layout, navigation, loading state, empty state, and error state patterns;
- create basic testing setup;
- add baseline CI template if implementation repo supports GitHub Actions;
- add basic feature flag config;
- prepare repeatable database index script placeholder;
- update implementation status docs.

Not allowed in Week 1:

- routine analysis;
- AI explanation implementation;
- ingredient AI explanation;
- product recommendation engine;
- image upload;
- AI face analysis;
- marketplace;
- barcode scanner;
- notifications;
- subscriptions or payment;
- community features.

## 3. Recommended setup commands

```bash
npx create-next-app@latest skinwise-vn \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd skinwise-vn
npm install zod mongodb @auth/mongodb-adapter
npm install next-auth@beta
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @playwright/test
```


Auth.js / NextAuth note:

- Use the current Auth.js / NextAuth v5-compatible installation command from the official Auth.js docs at implementation time.
- `next-auth@beta` is listed here because the SDD targets the Auth.js / NextAuth v5-style setup.
- If NextAuth v5 is stable at implementation time, use the current official stable command and record the exact package version in `docs/ai-coding/05-ai-change-log.md`.
- Do not use NextAuth v4 conventions unless the SDD is explicitly changed.
- Use `AUTH_*` variables consistently, including `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.
- The MongoDB Adapter must receive a shared MongoClient or client provider from the app's database helper, following the official Auth.js MongoDB Adapter guidance. Do not create a new MongoClient per request.

shadcn/ui initialization:

```bash
npx shadcn@latest init
```

Initial useful components:

```bash
npx shadcn@latest add button card input label textarea select alert badge skeleton dropdown-menu
```

## 4. Week 1 folder creation checklist

Create or verify:

```txt
src/app/
src/modules/
src/domain/
src/infrastructure/
src/shared/
src/config/
tests/unit/
tests/integration/
tests/e2e/
tests/evals/
```

Create placeholder module folders only where needed:

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

Do not create `notifications` implementation in Week 1. It is reserved for future scope.

## 5. Required Week 1 files

Minimum files:

```txt
.env.example
src/config/env.ts
src/config/app.ts
src/config/features.ts
src/infrastructure/database/mongodb.ts
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/app/layout.tsx
src/app/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/layout.tsx
src/middleware.ts
vitest.config.ts
playwright.config.ts
.github/pull_request_template.md
.github/workflows/ci.yml
```

Optional but recommended:

```txt
src/shared/components/app-shell.tsx
src/shared/components/empty-state.tsx
src/shared/components/error-state.tsx
src/shared/components/loading-state.tsx
src/shared/constants/routes.ts
src/shared/types/result.ts
```

## 6. Environment validation requirements

`src/config/env.ts` must:

- use Zod;
- validate required server-only variables;
- avoid exposing server secrets to client code;
- fail fast when required values are missing;
- keep optional future image upload variables optional.

Required in production:

```txt
APP_ENV
APP_BASE_URL
MONGODB_URI
AUTH_SECRET
AUTH_URL
```

OAuth credentials are required only when Google login is enabled:

```txt
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
```

AI credentials are required only when AI endpoints are implemented:

```txt
AI_PROVIDER
AI_API_KEY
AI_MODEL
```

## 7. MongoDB helper requirements

`src/infrastructure/database/mongodb.ts` must:

- create a single reusable MongoDB client;
- avoid creating a new client on every request during development;
- export a client or database helper used by repositories;
- never run in client components.

## 8. Auth foundation requirements

Auth setup must:

- use Auth.js / NextAuth style configuration;
- use MongoDB adapter when enabled;
- keep authentication logic centralized;
- expose a helper such as `getCurrentUser()`;
- avoid checking ownership directly inside UI components.

Week 1 may create the auth foundation without fully polishing all UI states.

## 9. Dashboard shell requirements

The dashboard shell should include:

- app navigation;
- protected route behavior;
- placeholder cards for routine, journal, product, ingredient, and safety analysis areas;
- clear “not implemented yet” empty states;
- no fake AI result;
- no fake diagnosis.

## 10. Week 1 test requirements

Minimum tests:

```txt
env validation works
MongoDB helper exports expected API
GET /api/me lazy AppUserProfile behavior is covered when auth test harness is available
API DTO helpers do not return raw ObjectId values
dashboard protected behavior is covered where possible
basic page render smoke test
```

Do not wait until later to add testing infrastructure.

## 11. Definition of Done for Week 1

Week 1 is done when:

- app runs locally;
- build passes;
- lint passes;
- environment validation exists;
- MongoDB helper exists;
- Auth foundation exists;
- dashboard shell exists;
- basic feature flag config exists;
- repeatable database index script placeholder exists;
- CI template exists or is copied into the implementation repo;
- project folders match `docs/10-project-structure.md`;
- no out-of-scope feature is implemented;
- `docs/ai-coding/02-implementation-status.md` is updated;
- `docs/ai-coding/05-ai-change-log.md` is updated;
- `docs/19-engineering-execution-checklist.md` remains satisfied.
