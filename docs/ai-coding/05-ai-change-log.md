# 05-ai-change-log.md

# AI Change Log — SkinWise VN MVP v1.2.6

This file records AI-assisted changes so future coding sessions understand what changed and why.

## 2026-05-14 - Week 2 Task 1.1 Foundation Stabilization Patch

### Task

Fix the reproducible production build foundation before starting any new feature.

### Files Updated

```txt
src/app/layout.tsx
src/proxy.ts
tests/unit/auth-middleware.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Next.js production build should not depend on fetching Google font assets, and Next.js 16 expects the proxy convention instead of the deprecated middleware convention.

### Implementation Notes

- Removed `next/font/google` and `Geist` usage from `src/app/layout.tsx`.
- Kept the existing Tailwind/system `font-sans` stack.
- Renamed `src/middleware.ts` to `src/proxy.ts`.
- Exported `proxy` from the Auth.js wrapper instead of default-exporting `auth`.
- Updated the auth proxy test to read `src/proxy.ts`.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 16 files, 120 tests
cmd /c npm run build: Pass
```

### Notes

- No onboarding UI, Routine Builder, Product module, Ingredient module, AI provider, Journal, or dashboard data integration was implemented.

## 2026-05-14 - Week 2 Task 1 Skin Profile API Foundation

### Task

Implement the Skin Profile API foundation without starting other Week 2 modules or adding UI.

### Files Added

```txt
src/app/api/skin-profile/route.ts
src/modules/skin-profile/skin-profile.types.ts
src/modules/skin-profile/skin-profile.schema.ts
src/modules/skin-profile/skin-profile.dto.ts
src/modules/skin-profile/skin-profile.mapper.ts
src/modules/skin-profile/skin-profile.repository.ts
src/modules/skin-profile/skin-profile.use-case.ts
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 1 requires a protected `/api/skin-profile` API foundation for the current authenticated user. The implementation covers schema validation, DTO mapping, user-scoped repository operations, thin use-case functions, and route handlers for `GET`, `POST`, `PATCH`, and `DELETE`.

### Implementation Notes

- `GET /api/skin-profile` returns the current user's profile or `NOT_FOUND`.
- `POST /api/skin-profile` atomically creates or replaces the current user's profile by authenticated `userId`.
- `PATCH /api/skin-profile` partially updates allowed SkinProfile fields and rejects empty update bodies.
- `DELETE /api/skin-profile` deletes only the current user's profile.
- Create/update schemas are strict and reject client-provided `userId`.
- SkinProfile DTOs convert `_id` to `id`, Dates to ISO strings, and omit `userId`.
- The repository uses `getSkinProfilesCollection()` and does not create a MongoClient or query Auth.js-owned collections.
- Successful `POST /api/skin-profile` does not update `AppUserProfile.onboardingCompleted`; this remains a follow-up because the requirement is not explicit in the current SDD.
- The initial `npm run lint` Phase 0 command was blocked by Windows PowerShell execution policy for `npm.ps1`, so checks were run with `npm.cmd`.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass - 16 files, 119 tests
npm.cmd run build: Pass
```

### Notes

- No Routine Builder, Product/Ingredient module, AI provider, Routine Analysis, Journal, skincare advice generation, medical diagnosis, skin score, onboarding UI, or Auth.js route behavior was implemented.

## 2026-05-14 - Week 1 Task 7 GET /api/me Lazy AppUserProfile

### Task

Implement `GET /api/me` with lazy `AppUserProfile` creation and complete the Week 1 foundation gate without starting Week 2 or adding product features.

### Files Added

```txt
src/app/api/me/route.ts
src/modules/users/app-user-profile.types.ts
src/modules/users/app-user-profile.repository.ts
src/modules/users/app-user-profile.mapper.ts
tests/unit/app-user-profile.test.ts
tests/unit/me-api-contract.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/19-engineering-execution-checklist.md
```

### Reason

`GET /api/me` is the canonical SkinWise current-user endpoint. It returns Auth.js current-user identity plus app-specific `role` and `onboardingCompleted` from `AppUserProfile`. Missing AppUserProfile records are created lazily with default `USER` role and `onboardingCompleted = false`.

### Implementation Notes

- `GET /api/me` uses `getCurrentUser()` and returns `UNAUTHORIZED` for expected unauthenticated requests.
- `ensureAppUserProfile(userId)` uses atomic `findOneAndUpdate` upsert with `$setOnInsert`.
- The repository stores the Auth.js current user id as a string for `AppUserProfile.userId`; this avoids coercing opaque Auth.js session ids into MongoDB `ObjectId`.
- The `/api/me` DTO keeps `id` as a string and never exposes MongoDB `_id`.
- Existing profiles do not get `updatedAt` changed on every `GET /api/me`.
- The users repository uses `getAppUserProfilesCollection()` and does not create a MongoClient.
- The `/api/me` DTO omits `_id`, ObjectId, `userId`, `image`, raw session data, tokens, and raw database errors.
- The repository imports the collection helper dynamically inside functions so `next build` does not require real MongoDB/Auth env variables while collecting route data.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass - 14 files, 90 tests
npm.cmd run build: Pass
npm.cmd run test:e2e: Not run - not required for this task; Playwright browsers are not installed yet.
npm.cmd run db:indexes: Not run - requires MONGODB_URI and was not required for this task.
```

### Notes

- No Skin Profile, Routine, Journal, Product, Ingredient, AI, dashboard data integration, fake data, sample data, or medical claim was implemented.
- No `src/modules/users/ensure-app-user-profile.ts` file was created because `app-user-profile.repository.ts` owns the lazy ensure responsibility.
- No commit was created.

## 2026-05-14 — Week 1 Task 6 Protected Dashboard Shell

### Task

Create the protected `/dashboard` shell without implementing product features, business APIs, `/api/me`, AppUserProfile lazy creation, database queries, fake dashboard data, or custom sign-in UI.

### Files Added

```txt
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
tests/unit/dashboard-shell.test.ts
tests/unit/dashboard-routes.test.ts
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Week 1 Task 6 required a protected dashboard foundation route. The implementation uses `getCurrentUser()` in the dashboard route group layout and redirects unauthenticated users to the Auth.js default sign-in endpoint at `/api/auth/signin?callbackUrl=/dashboard`.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 12 files, 76 tests
npm.cmd run build: Pass
```

### Notes

- `src/app/(dashboard)/dashboard/page.tsx` creates the real `/dashboard` URL; it does not create `/dashboard/dashboard`.
- Dashboard nav metadata keeps only `/dashboard` enabled.
- Skin Profile, Routines, Today Log, Journal, Products, and Ingredients nav items use `href: null` and `disabled: true`.
- Dashboard cards cover Skin Profile, Routines, Today Log, Journal, Products, Ingredients, and Safety Analysis.
- Each placeholder card states `Chưa implement trong Task 6` and `Sẽ được kết nối ở task/module sau`.
- No feature routes, marketplace, community, skin score, admin, subscription, notifications, custom login page, or Auth.js `pages.signIn` config were added.

## 2026-05-13 — Week 1 Task 5 Auth.js Foundation

### Task

Create Auth.js foundation without implementing `/api/me`, AppUserProfile lazy creation, dashboard shell, repositories, business features, or sign-in UI.

### Files Added

```txt
src/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/middleware.ts
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/modules/auth/next-auth.d.ts
src/modules/auth/types.ts
tests/unit/auth-config.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/auth-route.test.ts
tests/unit/get-current-user.test.ts
```

### Files Updated

```txt
package.json
package-lock.json
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
next-auth@5.0.0-beta.31
@auth/mongodb-adapter@3.11.2
```

### Dependency Notes

`@auth/mongodb-adapter@3.11.2` requires `mongodb@^6`, so the existing MongoDB driver dependency was aligned from `mongodb@^7.2.0` to `mongodb@^6.21.0` instead of using `--force` or `--legacy-peer-deps`.

### Reason

Week 1 Task 5 required Auth.js / NextAuth v5-style foundation with a MongoDB Adapter that reuses the shared MongoDB client provider. The implementation separates edge-safe config from full server-side runtime so middleware does not import database code.

### Adapter Gating Behavior

```txt
production:
  Requires MONGODB_URI through env validation and uses MongoDB Adapter.

development/test with MONGODB_URI:
  Uses MongoDB Adapter with the shared getMongoClientPromise provider.

development/test without MONGODB_URI:
  Falls back to JWT session strategy so lint/typecheck/test/build do not require a real database.
```

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 10 files, 68 tests
npm.cmd run build: Pass
```

`next build` reports a Next.js 16 warning that the `middleware` file convention is deprecated in favor of `proxy`; Task 5 keeps `src/middleware.ts` because it is the current SDD-requested file.

### Notes

- `auth.config.ts` is edge-safe and does not import `server-only`, `src/config/env.ts`, MongoDB Adapter, MongoDB helper, or `src/auth.ts`.
- Auth.js owns `/api/auth/*`; the route does not use the SkinWise `{ data, error }` response wrapper.
- `get-current-user.ts` maps session data only and does not query `AppUserProfile`.
- No `/api/me`, AppUserProfile lazy creation, dashboard shell, repositories, sign-in UI, or business features were implemented.
- No tokens or secrets are exposed or logged.

## 2026-05-13 — Week 1 Task 4 MongoDB Foundation

### Task

Create MongoDB infrastructure foundation without implementing Auth.js, API routes, repositories, seed data, or business features.

### Files Added

```txt
src/infrastructure/database/mongodb.ts
src/infrastructure/database/collections.ts
tests/unit/mongodb.test.ts
tests/unit/database-collections.test.ts
tests/unit/database-indexes.test.ts
```

### Files Updated

```txt
src/infrastructure/database/ensure-indexes.ts
package.json
package-lock.json
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
mongodb
```

### Reason

Week 1 Task 4 required a server-only MongoDB client helper, centralized collection names, and a repeatable index script aligned with the v1.2.6 data model and ADR-0006. The implementation keeps `MONGODB_URI` access centralized through `src/config/env.ts`, avoids connection at import time, and exposes index definitions for unit tests without a real MongoDB server.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 6 files, 46 tests
npm.cmd run build: Pass
npm.cmd run db:indexes: Not run — requires MONGODB_URI and was not run against a real database.
npm run test:e2e: Not run — Playwright browsers are not installed yet.
```

### Notes

- No Auth.js implementation was added.
- `next-auth` and `@auth/mongodb-adapter` were not installed.
- No API routes, repositories, seed data, fake data, or business features were implemented.
- Unit tests do not call a real MongoDB server.
- `ensure-indexes.ts` does not create indexes on import and does not create Auth.js adapter indexes.
- `DATABASE_INDEX_DEFINITIONS` excludes future/out-of-scope image upload, notifications, marketplace, skin score, face analysis, payment, and subscription fields.
- npm reported 2 moderate audit vulnerabilities; `npm audit fix --force` was not run by task constraint.

## 2026-05-13 — Week 1 Task 3 Environment Validation

### Task

Create server-only Zod environment validation without implementing MongoDB, Auth.js, AI providers, or business features.

### Files Added

```txt
src/config/env.ts
tests/unit/env.test.ts
```

### Files Updated

```txt
package.json
package-lock.json
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
server-only
zod
```

### Reason

Week 1 Task 3 required repeatable validation for environment variables, including production-required secrets, strict feature flag parsing, optional AI and image credentials unless gated features are enabled, URL validation, MongoDB URI format validation, and empty-string normalization for `.env.example` style placeholders.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 3 files, 27 tests
npm.cmd run build: Pass
npm run test:e2e: Not run — Playwright browsers not installed yet.
```

### Notes

- No MongoDB helper was implemented.
- No Auth.js setup, dashboard, AI provider, AI API call, routine, journal, product, ingredient, upload, or business feature was implemented.
- `src/config/env.ts` imports `server-only`, exports `parseEnv(source: NodeJS.ProcessEnv)`, and exports `env = parseEnv(process.env)`.
- `parseEnv` does not read `.env.local`, does not log secrets, and does not generate secrets.
- npm reported 2 moderate audit vulnerabilities; `npm audit fix --force` was not run by task constraint.

## 2026-05-13 — Week 1 Task 2 Tooling and UI Foundation

### Task

Initialize shadcn/ui and add shared UI foundation components without implementing business features.

### Files Added

```txt
components.json
src/shared/components/app-shell.tsx
src/shared/components/empty-state.tsx
src/shared/components/error-state.tsx
src/shared/components/loading-state.tsx
src/shared/components/ui/alert.tsx
src/shared/components/ui/badge.tsx
src/shared/components/ui/button.tsx
src/shared/components/ui/card.tsx
src/shared/components/ui/dropdown-menu.tsx
src/shared/components/ui/input.tsx
src/shared/components/ui/label.tsx
src/shared/components/ui/select.tsx
src/shared/components/ui/skeleton.tsx
src/shared/components/ui/textarea.tsx
src/shared/utils/cn.ts
src/shared/utils/index.ts
tests/unit/ui-foundation.test.ts
```

### Files Updated

```txt
package.json
package-lock.json
src/app/globals.css
src/app/layout.tsx
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Dependencies Added

```txt
class-variance-authority
clsx
lucide-react
radix-ui
shadcn
tailwind-merge
tw-animate-css
```

### Reason

Week 1 Task 2 required shadcn/ui setup, UI primitives, shared layout/state components, and a `cn` utility under the SkinWise project structure.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 2 files, 6 tests
npm.cmd run build: Pass
npm run test:e2e: Not run — Playwright browsers not installed yet.
```

### Notes

- No product feature was implemented.
- No Auth, MongoDB, environment validation, protected dashboard, AI, routine, journal, product, ingredient, notification, marketplace, payment, admin, community, diagnosis, or fake result was implemented.
- `components.json` aliases point to `@/shared/components`, `@/shared/components/ui`, and `@/shared/utils`.
- `src/shared/components/ui/` exists.
- `src/components/ui/` does not exist.
- shadcn CLI initially created default `src/components/ui` and `src/lib` paths; generated files were moved to the approved `src/shared` structure and the empty wrong folders were removed.

## 2026-05-13 — Week 1 Task 1 Project Foundation

### Task

Initialize the real repo's Next.js App Router foundation without rerunning create-next-app or implementing product features.

### Files Added

```txt
vitest.config.ts
playwright.config.ts
src/config/app.ts
src/config/features.ts
src/shared/constants/routes.ts
src/shared/types/result.ts
src/infrastructure/database/ensure-indexes.ts
tests/unit/foundation.test.ts
src/modules/auth/.gitkeep
src/modules/users/.gitkeep
src/modules/skin-profile/.gitkeep
src/modules/products/.gitkeep
src/modules/ingredients/.gitkeep
src/modules/routines/.gitkeep
src/modules/routine-logs/.gitkeep
src/modules/ai-analysis/.gitkeep
src/modules/journals/.gitkeep
src/domain/.gitkeep
tests/integration/.gitkeep
tests/e2e/.gitkeep
tests/evals/.gitkeep
```

### Files Updated

```txt
package.json
package-lock.json
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Week 1 Task 1 required normalizing the copied Next.js foundation inside the real repository, adding package scripts, base folder structure, test configs, safe feature flags, a repeatable `db:indexes` placeholder, and a minimal smoke test.

### Tests

```txt
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd run test: Pass — 1 file, 3 tests
npm.cmd run build: Pass
npm run test:e2e: Not run — Playwright browsers not installed yet.
```

### Notes

- No product feature was implemented.
- No AI provider, AI API call, image upload, marketplace, notifications, skin score, admin, payment, or community feature was implemented.
- `src/modules/notifications/` was not created.
- `npm.cmd install -D vitest @vitest/ui playwright tsx` was run to update test tooling and `package-lock.json`.
- `src/shared/constants/routes.ts` uses the final Week 1 uppercase route constants.
- `src/shared/types/result.ts` uses the simple `Result<T, E = Error>` union.
- npm reported 2 moderate audit vulnerabilities; `npm audit fix --force` was not run by task constraint.

## 2026-05-13 — v1.2.6 final freeze and engineering execution guardrails

### Task

Finalize the SDD before Week 1 implementation by adding engineering execution guardrails.

### Files Added

```txt
docs/19-engineering-execution-checklist.md
docs/20-week-1-task-1-prompt.md
docs/adr/0001-use-modular-monolith.md
docs/adr/0002-use-authjs-with-app-user-profile.md
docs/adr/0003-rule-engine-before-ai.md
docs/adr/0004-use-local-date-for-daily-tracking.md
docs/adr/0005-use-dto-mappers-for-api-boundaries.md
docs/adr/0006-use-repeatable-db-index-script.md
docs/CHANGELOG-v1.2.6.md
.github/pull_request_template.md
.github/workflows/ci.yml
```

### Files Updated

```txt
AGENTS.md
README.md
docs/00-source-of-truth.md
docs/04-data-model.md
docs/05-api-contract.md
docs/08-test-plan.md
docs/12-week-1-implementation-plan.md
docs/18-deployment-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/source-notes.md
```

### Reason

v1.2.5 was ready for implementation, but v1.2.6 adds final execution guardrails so AI-assisted coding can be controlled by ADRs, DTO boundary rules, index strategy, CI, PR checklist, feature flags, structured logging, and a precise Week 1 Task 1 prompt.

### Tests

No implementation tests were run because this package is documentation-only. The test plan now includes v1.2.6 execution guardrail test cases.

### Notes

- No product feature was added.
- MVP scope remains unchanged.
- Architecture remains modular monolith.
- Week 1 remains Foundation Setup.
- v1.2.6 is the final freeze before Week 1 implementation.

## 2026-05-13 — v1.2.5 consistency hotfix

### Task

Apply consistency hotfix before Week 1 implementation.

### Files Added

```txt
docs/CHANGELOG-v1.2.5.md
```

### Files Updated

```txt
AGENTS.md
README.md
docs/00-source-of-truth.md
docs/04-data-model.md
docs/05-api-contract.md
docs/08-test-plan.md
docs/12-week-1-implementation-plan.md
docs/15-use-case-and-repository-contract.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/05-ai-change-log.md
docs/source-notes.md
```

### Reason

The v1.2.4 AI coding addendum was directionally correct but needed consistency fixes before code generation. The hotfix prevents AI coding assistants from misinterpreting Auth.js-owned routes, missing-auth error naming, MVP role scope, future image fields, package install guidance, and SkinJournal PATCH behavior.

### Tests

No implementation tests were run because this package is documentation-only. The test plan now includes v1.2.5 consistency hotfix test cases.

### Notes

- No product feature was added.
- MVP scope remains unchanged.
- Architecture remains modular monolith.
- Week 1 remains Foundation Setup.
- After v1.2.5, the SDD can be frozen for Week 1 implementation.

## 2026-05-13 — v1.2.4 documentation update

### Task

Create AI Coding Source of Truth Addendum for SkinWise VN.

### Files Added

```txt
.env.example
docs/00-source-of-truth.md
docs/12-week-1-implementation-plan.md
docs/13-ui-route-map.md
docs/14-seed-data-spec.md
docs/15-use-case-and-repository-contract.md
docs/16-ai-fallback-policy.md
docs/17-vietnamese-copy-and-ui-guidelines.md
docs/18-deployment-checklist.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/CHANGELOG-v1.2.4.md
```

### Files Updated

```txt
AGENTS.md
README.md
docs/03-system-architecture.md
docs/10-project-structure.md
```

### Reason

The project needed a stronger mechanism for AI coding assistants to understand:

- the source of truth;
- current implementation status;
- project structure;
- file ownership;
- allowed sprint scope;
- forbidden MVP scope;
- post-code documentation updates.

### Scope impact

No new product feature was added.

v1.2.4 improves implementation readiness and AI coding governance only.

### Notes

- Notifications remain excluded from MVP implementation.
- Image upload remains future scope.
- Cloudinary/S3 variables are optional and future-facing.
- Rule engine must still run before AI.
- RoutineLog and SkinJournal remain separate.

## Template for future entries

```md
## YYYY-MM-DD — Task title

### Task

Short description.

### Files Added

- `path/to/file`

### Files Updated

- `path/to/file`

### Reason

Why this change was made.

### Tests

- Unit:
- Integration:
- E2E:

### Notes

Any known limitation or follow-up.
```


## 2026-05-13 — v1.2.6 Final Documentation Cleanup

### Task
Clean up final SDD documentation before Week 1 Task 1.

### Files Changed
- `docs/14-seed-data-spec.md`
- `README.md`
- `docs/09-release-plan.md`
- `docs/12-week-1-implementation-plan.md`
- `docs/source-notes.md`
- `docs/CHANGELOG-v1.2.6.md`

### Reason
Align seed data contracts with the canonical data model, update final-freeze wording, and clarify MongoDB Adapter client-sharing guidance.

### Notes
- No product feature added.
- No MVP scope change.
- No architecture change.
- Week 1 remains ready to start after this cleanup.
