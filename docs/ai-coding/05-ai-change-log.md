# 05-ai-change-log.md

# AI Change Log — SkinWise VN MVP v1.2.6

This file records AI-assisted changes so future coding sessions understand what changed and why.


## 2026-05-22 - TASK AI-004 AI Provider Routine Analysis Contract Mapping

### Task

Add an explicit mapper between validated provider-level routine analysis output and the product-facing `RoutineAnalysisResult` contract before any future provider-backed Routine Analysis wiring.

### Files Added

```txt
src/modules/ai-analysis/ai-provider-routine-analysis.mapper.ts
src/modules/ai-analysis/routine-analysis.constants.ts
tests/unit/ai-provider-routine-analysis-mapper.test.ts
```

### Files Updated

```txt
src/modules/ai-analysis/analyze-routine.use-case.ts
src/modules/ai-analysis/index.ts
docs/06-ai-contract.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

The provider-level routine analysis output uses `overallRiskLevel`, string warnings, string recommendations, `educationalNotes`, and `providerMetadata`, while the product-facing Routine Analysis module uses `riskLevel`, structured warnings, structured suggestions, `shouldSeeProfessional`, and `disclaimer`. TASK AI-004 makes that boundary explicit before TASK AI-005 can wire provider-backed routine analysis safely.

### Implementation Notes

- Added `mapAIProviderRoutineAnalysisToRoutineAnalysisResult`.
- The mapper accepts `AIProviderRoutineAnalysisResult` and returns `RoutineAnalysisResult`.
- The mapper is pure and deterministic.
- The mapper does not call `validateRoutineAnalysisOutput()` because validation belongs to `ValidatedAIProvider`.
- Provider `overallRiskLevel` maps to product-facing `riskLevel`.
- Provider `summary` maps to product-facing `summary`.
- Provider warning strings map to structured `RoutineAnalysisWarning` objects with `code = "AI_PROVIDER_WARNING"`.
- Provider recommendations map to structured `RoutineAnalysisSuggestion` objects with deterministic priority from risk level.
- `shouldSeeProfessional` is true only for high risk.
- `providerMetadata` is not exposed in `RoutineAnalysisResult`.
- `educationalNotes` are not exposed in `RoutineAnalysisResult`.
- Moved the existing Routine Analysis disclaimer string into `routine-analysis.constants.ts`.
- `analyze-routine.use-case.ts` now imports the shared disclaimer constant; deterministic fallback behavior is unchanged.
- No OpenAI provider was implemented.
- No Gemini provider was implemented.
- No external AI API call was added.
- No AI key requirement was added.
- No Routine Analysis API provider wiring was added.
- No UI, route behavior, database schema, migration, dependency, or Routine Safety Engine change was made.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 47 files, 456 tests
```

### Notes

- `tests/unit/ai-provider-routine-analysis-mapper.test.ts` covers risk, summary, warning, recommendation, priority, empty arrays, metadata isolation, educational note isolation, disclaimer, professional-help flag, and input immutability.
- The recommended next task is TASK AI-005 - Wire Validated AI Provider into Routine Analysis Use Case with Safe Fallback.

## 2026-05-22 - TASK AI-003 Provider Flow Validation

### Task

Integrate the TASK AI-002 structured output validators into the AI provider flow without changing provider output shape or wiring Routine Analysis API to provider calls.

### Files Added

```txt
src/infrastructure/ai/validated-ai-provider.ts
tests/unit/validated-ai-provider.test.ts
```

### Files Updated

```txt
src/infrastructure/ai/ai-provider.factory.ts
src/infrastructure/ai/index.ts
tests/unit/ai-provider.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK AI-003 required every successfully constructed `AIProvider` to be wrapped in a validation decorator so provider outputs are validated before future application flows use them.

### Implementation Notes

- Added `ValidatedAIProvider`.
- `ValidatedAIProvider` implements `AIProvider`.
- `ValidatedAIProvider` accepts an inner `AIProvider` through its constructor.
- `analyzeRoutine()` calls the inner provider, validates with `validateRoutineAnalysisOutput()`, and returns the validated output.
- `explainIngredient()` calls the inner provider, validates with `validateIngredientExplanationOutput()`, and returns the validated output.
- `classifySafety()` calls the inner provider, validates with `validateSafetyClassifierOutput()`, and returns the validated output.
- Invalid output lets the existing validator throw `AIProviderResponseError`.
- The wrapper does not swallow, replace, or convert `AIProviderResponseError`.
- `MockAIProvider` output shape was not changed.
- Validation logic was not added inside `MockAIProvider`.
- `getAIProvider()` now builds a raw provider first and wraps successful providers with `ValidatedAIProvider`.
- Mock mode now returns `ValidatedAIProvider` around `MockAIProvider`.
- Existing OpenAI and Gemini unsupported-provider behavior remains unchanged.
- No OpenAI provider was implemented.
- No Gemini provider was implemented.
- No external AI API call was added.
- No AI key requirement was added.
- No Routine Analysis API behavior was changed.
- No UI, database schema, or unrelated module was changed.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 46 files, 444 tests
```

### Notes

- `tests/unit/validated-ai-provider.test.ts` covers valid and invalid routine analysis, ingredient explanation, and safety classifier outputs.
- Tests verify inner provider calls, pass-through inputs, returned validated output, invalid-output errors, mock-mode factory wrapping, and MockAIProvider compatibility through the wrapper.
- The Routine Analysis API still uses deterministic fallback only.
- The recommended next task is to align or map AI provider output contracts before wiring provider-backed Routine Analysis behavior.

## 2026-05-22 - TASK AI-002 Structured Output Validation

### Task

Add strict Zod validation for structured AI provider outputs before later tasks use provider responses in application flows.

### Files Added

```txt
src/infrastructure/ai/ai-output.schema.ts
src/infrastructure/ai/ai-output.validator.ts
tests/unit/ai-output-validation.test.ts
```

### Files Updated

```txt
src/infrastructure/ai/index.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK AI-002 required a validation layer for the current `AIProvider` output types from `src/infrastructure/ai/ai-provider.ts` before future provider-flow integration.

### Implementation Notes

- Added `aiProviderMetadataSchema`.
- Added `aiProviderRoutineAnalysisResultSchema`.
- Added `aiProviderIngredientExplanationResultSchema`.
- Added `aiProviderSafetyClassifierResultSchema`.
- All output object schemas use strict Zod validation and reject unknown extra fields.
- Required fields are required, enum values match the current `ai-provider.ts` types, strings have max length limits, arrays have max item limits, and `providerMetadata.generatedAt` must be an ISO datetime string.
- Added `validateRoutineAnalysisOutput`, `validateIngredientExplanationOutput`, and `validateSafetyClassifierOutput`.
- Invalid AI output throws `AIProviderResponseError` with a short Zod issue summary containing issue path and issue message.
- Exported the new schemas and validators from `src/infrastructure/ai/index.ts`.
- Added unit tests for valid output, missing required fields, invalid enum values, maxLength violations, maxItems violations, unknown extra fields, invalid `providerMetadata`, error behavior, and MockAIProvider compatibility.
- No external AI provider was called.
- No OpenAI call was added.
- No Gemini call was added.
- No API key was added.
- No new dependency was added.
- UI was not changed.
- Database schema was not changed.
- OpenAI provider was not implemented.
- Gemini provider was not implemented.
- Ingredient Explanation API was not implemented.
- AI Provider validation was not wired into Routine Analysis API in this task.
- MockAIProvider output shape was not changed.

### Known Contract Mismatch / Follow-up

`docs/06-ai-contract.md` differs from `src/infrastructure/ai/ai-provider.ts`. TASK AI-002 intentionally validates the current `ai-provider.ts` output shape exactly and does not reconcile:

- `riskLevel` vs `overallRiskLevel`;
- `suggestions` vs `recommendations`;
- `simpleExplanation` vs `shortExplanation`;
- `shouldBlockAIAnswer` vs `isAllowed`;
- docs schemas missing `providerMetadata`.

A later TASK AI-003 should integrate output validation into provider flow. A separate explicit contract-alignment task should decide whether to update docs, change provider types, or introduce mapping between provider outputs and product-facing AI DTOs.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 45 files, 436 tests
```

### Notes

- The source of truth for TASK AI-002 was `src/infrastructure/ai/ai-provider.ts`.
- The validation layer is exported but not wired into Routine Analysis API behavior yet.

## 2026-05-20 - TASK AI-001 AI Provider Abstraction

### Task

Implement the server-only AI Provider Abstraction for future provider integration while adding only `MockAIProvider`.

### Files Added

```txt
src/infrastructure/ai/ai-provider.ts
src/infrastructure/ai/ai-provider.errors.ts
src/infrastructure/ai/ai-provider.factory.ts
src/infrastructure/ai/mock-ai-provider.ts
src/infrastructure/ai/index.ts
tests/unit/ai-provider.test.ts
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

TASK AI-001 required a clean, testable provider boundary before future OpenAI/Gemini implementation.

### Implementation Notes

- Added the exact TASK AI-001 `AIProvider` interface with `analyzeRoutine`, `explainIngredient`, and `classifySafety`.
- Added explicit provider input/output types and metadata types without using `any`.
- Added deterministic `MockAIProvider` with fixed provider metadata.
- Added `AIProviderError`, `AIProviderConfigurationError`, and `AIProviderResponseError`.
- Added `getAIProvider()` that reads `process.env.AI_PROVIDER`, defaults missing/empty/mock values to `MockAIProvider`, and throws configuration errors for OpenAI, Gemini, and unsupported providers.
- OpenAI provider is not implemented yet.
- Gemini provider is not implemented yet.
- No external AI API is called.
- No AI key is required.
- Existing Routine Analysis API/UI behavior and Routine Safety Engine logic were not changed.

### Tests

```txt
npm.cmd test -- tests/unit/ai-provider.test.ts: Pass - 1 file, 12 tests
npm.cmd run typecheck: Pass
npm.cmd run lint: Pass
npm.cmd test: Pass - 44 files, 402 tests
```

### Notes

- Next recommended task is TASK AI-002 - Structured Output Validation.

## 2026-05-18 - TASK DOC-001 Documentation Consistency Cleanup after DB-001

### Task

Synchronize AI coding documentation and public project docs with the current source state after TASK DB-001.

### Files Added

```txt
None
```

### Files Updated

```txt
docs/ai-coding/01-codebase-map.md
docs/05-api-contract.md
docs/13-ui-route-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

TASK DB-001 implemented the authenticated Dashboard API and replaced the placeholder `/dashboard` with `DashboardOverview`, but some documentation still described the current source as if Product Picker, Product Snapshot Population, RoutineLog, and Dashboard Data Integration were not implemented.

### Implementation Notes

- Updated documentation only.
- Documented `GET /api/dashboard?localDate=YYYY-MM-DD` in the API contract.
- Updated `/dashboard` route documentation to describe `DashboardOverview` and its displayed dashboard summary cards.
- Removed stale current-state statements saying Product Picker, Product Snapshot Population, RoutineLog, or Dashboard Data Integration were not implemented.
- Confirmed DB-001 is completed and documented.
- Set the next recommended task to `TASK AI-001 — AI Provider Abstraction`.
- No source feature was added.
- No AI Provider Abstraction, Ingredient Explanation, Product UI, Journal, image upload, skin score, diagnosis, medical recommendation, product submission, or admin product feature was implemented.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 43 files, 390 tests
```

### Notes

- This task synchronizes documentation only after DB-001.
- Historical task notes remain unchanged except where current-state guidance would otherwise be misleading.

## 2026-05-17 - TASK DB-001 Dashboard Data Integration

### Task

Replace the placeholder dashboard with a real data-driven dashboard for the authenticated user.

### Files Added

```txt
src/app/api/dashboard/route.ts
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
tests/unit/dashboard-use-case.test.ts
tests/unit/dashboard-api-contract.test.ts
tests/unit/dashboard-ui.test.ts
```

### Files Updated

```txt
src/app/(dashboard)/dashboard/page.tsx
src/modules/dashboard/dashboard-shell.config.ts
src/modules/ai-analysis/routine-analysis.repository.ts
src/modules/ai-analysis/index.ts
tests/unit/dashboard-shell.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

The protected dashboard shell needed to stop showing placeholder cards and summarize existing MVP data: Skin Profile, Routines, today's RoutineLogs, latest Routine Analysis, and next actions.

### Implementation Notes

- Added authenticated `GET /api/dashboard?localDate=YYYY-MM-DD` with strict query validation.
- Dashboard API derives `userId` from `getCurrentUser()` and rejects client-submitted `userId` query fields through strict schema parsing.
- Added Dashboard DTO/use-case/mapper boundaries.
- Dashboard DTO omits `userId`, `_id`, raw `ObjectId`, and MongoDB internals.
- Missing Skin Profile maps to `skinProfile.exists = false` and is not treated as an API error.
- Missing latest Routine Analysis maps to `latestRoutineAnalysis.exists = false` and is not treated as an API error.
- Routine counts use existing `morning` and `evening` `timeOfDay` values only; no unsupported `both` field was added.
- Today's RoutineLog progress uses the requested `localDate` and counts only logs matching the authenticated user's routines.
- Completion rate uses the documented MVP rule: completed = 1, partial = 0.5, skipped/notLogged = 0.
- Added latest routine analysis repository helper scoped by `userId`, sorted by `createdAt` descending.
- Replaced `/dashboard` placeholder cards with a client DashboardOverview that calls `GET /api/dashboard?localDate=...` using `getBrowserLocalDate()` from RoutineLog client helpers.
- Added cards for Skin Profile, today's progress, Routine summary, latest analysis, and next actions.
- No Dashboard charts, weekly/monthly analytics, streak calculation, AI insights, SkinJournal, image upload, skin score, external API call, or new dependency was added.

### Tests

```txt
npm run typecheck: Pass
npm run lint: Pass
npm run test: Pass - 43 files, 390 tests
npm run build: Pending local verification if sandbox build times out
```

### Notes

- Dashboard API response shape is `data.dashboard`.
- Dashboard UI reads from `body.data.dashboard`.
- Next recommended task is TASK AI-001 — AI Provider Abstraction.

## 2026-05-17 - TASK RL-002 RoutineLog UI Integration

### Task

Integrate RoutineLog UI into the existing protected `/routines` page so users can see today's log status and mark routines as completed, skipped, or partially completed with selected steps.

### Files Added

```txt
src/modules/routine-logs/routine-log.client.ts
src/modules/routines/components/routine-log-controls.tsx
src/modules/routines/components/routine-log-status-badge.tsx
tests/unit/routine-log-client.test.ts
tests/unit/routine-log-ui.test.ts
```

### Files Updated

```txt
src/modules/routines/components/routine-builder.tsx
tests/unit/routine-analysis-ui.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

RoutineLog backend foundation exists from RL-001. RL-002 adds the minimal frontend integration needed for users to record daily completion status from the current `/routines` page without creating a new route or dashboard feature.

### Implementation Notes

- `/routines` now loads today's logs through `GET /api/routine-logs?localDate=YYYY-MM-DD` and reads `body.data.routineLogs`.
- Added `getBrowserLocalDate()` using browser local date parts, not UTC `toISOString()` slicing.
- Added `getBrowserTimezone()` using `Intl.DateTimeFormat().resolvedOptions().timeZone` with `UTC` fallback.
- Added status badges for `Chưa ghi nhận`, `Hoàn thành`, `Một phần`, and `Bỏ qua`.
- Added per-routine controls for completed, skipped, and partial logs.
- Completed saves all known routine `stepId` values.
- Skipped saves an empty `completedStepIds` array.
- Partial opens an inline checklist, requires at least one selected step, rejects all selected steps, and is disabled for routines with fewer than 2 steps.
- PUT saves read the finalized response shape from `body.data.routineLog` and update local UI state only after success.
- Friendly Vietnamese loading, success, and error copy was added for load/save states.
- Client components use API routes only and do not import repositories, use cases, MongoDB helpers, auth helpers, or server-only modules.

### Tests

```txt
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 40 files, 377 tests
npm run build: Timed out in this sandbox while collecting page data after successful compilation and TypeScript phase; local verification recommended
```

### Notes

- No Dashboard integration, streak calculation, weekly/monthly analytics, AI insights, RoutineLog note input, SkinJournal, image upload, skin score, product submission, admin product management, external API call, or new dependency was added.
- Next recommended task is TASK DB-001 — Dashboard Data Integration.

## 2026-05-17 - TASK PP-001 Product Picker + Routine Product Snapshot Population

### Task

Integrate the existing read-only Product API into the existing Routine Builder form and populate server-owned Routine step Product snapshots when a selected visible `productId` is submitted.

### Files Added

```txt
None
```

### Files Updated

```txt
src/modules/routines/components/routine-builder.tsx
src/modules/routines/routine.schema.ts
src/modules/routines/routine.use-case.ts
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
tests/unit/routine-builder-ui.test.ts
tests/unit/routine-analysis-ui.test.ts
tests/unit/routine-use-case.test.ts
tests/unit/routine-api-contract.test.ts
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
```

### Reason

Routine steps need to support both curated reviewed/verified products and manual products. Selected Product steps must persist `productId` plus server-populated snapshots so analysis and display can use trusted Product data without trusting client-submitted snapshot fields.

### Implementation Notes

- Added client-side Product loading in `routine-builder.tsx` through `GET /api/products?limit=50`.
- The client reads Product list data from the existing `body.data.items` response shape.
- Added a Product Picker select for each Routine step with a manual fallback option: `Nhập sản phẩm thủ công`.
- Selected product mode sets `productId`, clears `customProductName`, and keeps selected product steps intact when editing existing routines.
- Manual mode clears `productId` and submits trimmed `customProductName`.
- `buildRoutinePayload` now sends only allowed Routine input fields: `productId` or `customProductName`, `category`, `order`, `frequency`, and optional `instructions`.
- The client does not submit `stepId`, `userId`, `id`, `_id`, timestamps, risk/analysis/AI fields, or Product snapshot fields.
- The Routine use-case now looks up selected products through the existing Product use-case path.
- If a submitted `productId` is missing, invalid, or not visible, the use-case throws `RoutineValidationError`; Routine routes return `VALIDATION_ERROR` with status 400 instead of `INTERNAL_ERROR`.
- Server-side Routine persistence now populates `productNameSnapshot`, `brandSnapshot`, `keyActivesSnapshot`, and `ingredientTextSnapshot` from the Product document only.
- Manual custom product steps keep `customProductName` and do not require a Product document.
- Routine list display now prefers `brandSnapshot — productNameSnapshot`, then `productNameSnapshot`, then `customProductName`, then `Sản phẩm chưa xác định`.
- Optional key active badges are shown for Product snapshot steps.
- No Product UI page, Product submission workflow, admin Product management, seed script, Product creation form, external product API call, Ingredient explanation AI, RoutineLog, SkinJournal, dashboard data integration, skin score, image upload, barcode scanner, or medical diagnosis was added.

### Tests

```txt
npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 35 files, 324 tests
npm run build: Timed out in this sandbox while collecting page data after successful compilation and TypeScript phase
```

### Notes

- Product API response shape remains unchanged as `data: { items: ProductDto[] }`.
- Client imports `ProductDto` as a type-only import and does not import Product repository, Product use-case, MongoDB helpers, auth helpers, or server-only code.
- No commit was created.

## 2026-05-16 - TASK PI-001 Product + Ingredient API Foundation

### Task

Implement the read-only Product and Ingredient API foundation using the existing Next.js App Router, Zod, repository/use-case/mapper, DTO, and test conventions.

### Files Added

```txt
src/app/api/ingredients/route.ts
src/app/api/ingredients/[id]/route.ts
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
src/modules/ingredients/ingredient.types.ts
src/modules/ingredients/ingredient.schema.ts
src/modules/ingredients/ingredient.dto.ts
src/modules/ingredients/ingredient.mapper.ts
src/modules/ingredients/ingredient.repository.ts
src/modules/ingredients/ingredient.use-case.ts
src/modules/ingredients/index.ts
src/modules/products/product.types.ts
src/modules/products/product.schema.ts
src/modules/products/product.dto.ts
src/modules/products/product.mapper.ts
src/modules/products/product.repository.ts
src/modules/products/product.use-case.ts
src/modules/products/index.ts
tests/unit/ingredient.test.ts
tests/unit/ingredient-use-case.test.ts
tests/unit/ingredient-api-contract.test.ts
tests/unit/product.test.ts
tests/unit/product-use-case.test.ts
tests/unit/product-api-contract.test.ts
```

### Files Updated

```txt
tests/unit/database-indexes.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Product and Ingredient read APIs are needed before Product Picker integration and future Ingredient explanation work, while keeping this task limited to authenticated backend/API foundation.

### Implementation Notes

- Added `GET /api/products` and `GET /api/products/[id]`.
- Added `GET /api/ingredients` and `GET /api/ingredients/[id]`.
- All four routes require `getCurrentUser()` and return `UNAUTHORIZED` when unauthenticated.
- Product list/detail returns only `reviewed` or `verified` products.
- Ingredient list/detail does not use Product visibility, `includeMine`, or created-by-user logic.
- List routes use strict Zod query schemas and reject unknown query params.
- DTO mappers convert `_id` to `id`, Dates to ISO strings, and copy arrays.
- Product DTOs omit `createdByUserId`, `source`, `_id`, and raw ObjectId values.
- Existing canonical Product and Ingredient collection helpers and index definitions were reused; no repository-created indexes were added.
- No Product UI, Product Picker integration, Routine product snapshot population, `POST /api/products`, admin product management, Ingredient explanation AI API, seed script, external product API, image upload, or medical diagnosis was added.

### Tests

```txt
npm.cmd test -- tests/unit/ingredient.test.ts tests/unit/ingredient-use-case.test.ts tests/unit/ingredient-api-contract.test.ts tests/unit/product.test.ts tests/unit/product-use-case.test.ts tests/unit/product-api-contract.test.ts tests/unit/database-indexes.test.ts: Pass - 7 files, 56 tests
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd test: Pass - 35 files, 319 tests
npm.cmd run build: Pass
npm.cmd run db:indexes: Not run - MONGODB_URI and APP_ENV were missing from the shell, so the intended database target could not be verified.
```

### Notes

- `npm run db:indexes` should only be run when `MONGODB_URI` is available and clearly points at the intended development database.
- No commit was created.

## 2026-05-15 - TASK-RA-001 Routine Analysis API Rate Limiting

### Task

Add per-user rate limiting to `POST /api/routines/[id]/analyze` before future AI-provider integration.

### Files Added

```txt
src/infrastructure/rate-limiting/rate-limit.ts
tests/unit/rate-limit.test.ts
```

### Files Updated

```txt
src/app/api/routines/[id]/analyze/route.ts
src/infrastructure/database/collections.ts
src/infrastructure/database/ensure-indexes.ts
tests/unit/routine-analysis-api-contract.test.ts
tests/unit/database-collections.test.ts
tests/unit/database-indexes.test.ts
docs/05-api-contract.md
docs/07-security-privacy.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Routine analysis is an AI-adjacent endpoint. It needs abuse protection before real AI-provider integration while preserving the existing deterministic analysis flow.

### Implementation Notes

- Added a server-only MongoDB-backed `checkRateLimit()` helper.
- Added the `rate_limits` collection constant and helper.
- Added a unique `{ key: 1 }` index and TTL `{ expiresAt: 1 }` index with `expireAfterSeconds: 0`.
- `POST /api/routines/[id]/analyze` authenticates first, validates the request body, then checks `routine_analysis:${userId}`.
- The analyze limit is 10 requests per authenticated user per 60 minutes.
- Unauthenticated requests keep the existing `UNAUTHORIZED` behavior and do not call the rate limiter.
- Rate-limited requests return `RATE_LIMITED` with HTTP 429, `Retry-After`, and `details.retryAfterSeconds`.
- `analyzeRoutineForCurrentUser()` is not called when the user is rate-limited.
- No Redis, in-memory production limiter, new dependency, AI provider, Product/Ingredient integration, Journal, Routine Logs, image upload, skin score, medical diagnosis, or broad refactor was added.

### Tests

```txt
npm.cmd test -- tests/unit/rate-limit.test.ts tests/unit/routine-analysis-api-contract.test.ts tests/unit/database-collections.test.ts tests/unit/database-indexes.test.ts: Pass - 4 files, 29 tests
npm.cmd run lint: Pass
npm.cmd run typecheck: Pass
npm.cmd test: Pass - 29 files, 272 tests
npm.cmd run build: Pass
npm.cmd run test:e2e: Smoke test reported ok, but the command wrapper timed out waiting for process exit.
```

### Notes

- `npm run db:indexes` should be run in real environments so the `rate_limits` unique and TTL indexes are present.
- No commit was created.

## 2026-05-15 - Week 3 Task 5 Routine Analysis UI Foundation

### Task

Implement the Routine Analysis UI foundation inside the existing `/routines` page only.

### Files Added

```txt
src/modules/routines/components/routine-analysis-panel.tsx
tests/unit/routine-analysis-ui.test.ts
```

### Files Updated

```txt
src/modules/routines/components/routine-builder.tsx
tests/unit/routine-builder-ui.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 5 requires users to run and view routine analysis from the existing `/routines` UI without adding new routes or expanding into real AI/provider, product, dashboard, or tracking features.

### Implementation Notes

- Added a focused `RoutineAnalysisPanel` display component.
- Kept routine loading, create, edit, delete, analyze, and history state ownership in `routine-builder.tsx`.
- Added per-routine Analyze actions that call `POST /api/routines/[id]/analyze` through `fetch` with no request body.
- Added per-routine history loading that calls `GET /api/routines/[id]/analyses` and reads the actual `body.data.analyses` response shape.
- The UI displays API-provided `analysisId`, `createdAt`, `riskLevel`, `summary`, `warnings`, `suggestions`, `shouldSeeProfessional`, and `disclaimer`.
- The client formats API-provided risk and priority values as Vietnamese labels only.
- The client does not generate risk levels, warnings, suggestions, summaries, diagnosis, treatment claims, skin scores, or analysis conclusions.
- Client components use type-only `RoutineAnalysisDto` imports and do not import repositories, use cases, MongoDB helpers, auth helpers, Routine Safety Engine, or AI provider modules.
- No `/routines/[id]`, `/routines/[id]/analysis`, `/routines/[id]/analyses`, dashboard analysis card, Product/Ingredient module, Product picker, Product lookup, Routine Logs, Journal, image upload, skin score, medical diagnosis, real AI provider integration, external API call, new dependency, or broad refactor was added.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-builder-ui.test.ts tests/unit/routine-analysis-ui.test.ts: Pass - 2 files, 19 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 28 files, 266 tests
cmd /c npm run build: Pass
```

### Notes

- The UI shows deterministic fallback analysis returned by the existing API; it does not know or compute safety rules.
- Server-side Routine Analysis rate limiting is handled separately by TASK-RA-001.
- No commit was created.

## 2026-05-15 - Week 3 Task 4 Routine Analysis API Foundation

### Task

Implement the Routine Analysis API foundation only: protected analyze/history routes, a RoutineAnalysis module, deterministic Routine Safety Engine orchestration, persistence, and public DTO mapping.

### Files Added

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
tests/unit/routine-analysis.test.ts
tests/unit/routine-analysis-api-contract.test.ts
tests/unit/routine-analysis-use-case.test.ts
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

Week 3 Task 4 requires the canonical Routine Analysis API foundation from the SDD without starting real AI provider integration or unrelated feature areas.

### Implementation Notes

- Added `POST /api/routines/[id]/analyze` and `GET /api/routines/[id]/analyses`.
- Both routes require authentication and derive `userId` from `getCurrentUser()`.
- Routine ownership is checked through `routineId + userId`; missing and not-owned routines return `NOT_FOUND`.
- `POST /api/routines/[id]/analyze` does not require a client body and rejects non-empty client fields with `VALIDATION_ERROR`.
- The use case runs the deterministic Routine Safety Engine before persistence.
- Skin Profile context is passed to the safety engine when available, and analysis still runs when no Skin Profile exists.
- RoutineAnalysis persistence stores `routineSnapshot`, top-level deterministic `riskLevel`, and all rule results including `triggered: false`.
- Public DTOs return triggered warnings only and do not expose MongoDB `_id`, `userId`, or internal `ruleResults`.
- Deterministic fallback metadata is stored as `modelProvider: "deterministic"`, `modelName: "routine-safety-engine"`, and `promptVersion: "routine-analysis-fallback-v1"`.
- No OpenAI, LLM client, external API call, Product/Ingredient module, Product lookup, Product snapshot backfill, UI, dashboard integration, Journal, Routine Logs, skin score, image upload, medical diagnosis, new dependency, or broad refactor was added.
- At the time of Task 4, no rate-limit utility existed; TASK-RA-001 later added the scoped MongoDB-backed limiter for the analyze route.
- Review before commit kept `GET /api/routines/[id]/analyses` as `data: { analyses: [...] }` because `docs/05-api-contract.md` does not define a different response body for the history endpoint and the existing `GET /api/routines` list API convention returns a named list wrapper as `data: { routines: [...] }`.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-analysis.test.ts tests/unit/routine-analysis-use-case.test.ts tests/unit/routine-analysis-api-contract.test.ts: Pass - 3 files, 28 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 27 files, 257 tests
cmd /c npm run build: Pass
```

### Notes

- TASK-RA-001 later implemented the scoped MongoDB-backed limiter for the analyze route.
- The deterministic fallback is stored as fallback metadata, not as successful AI provider output.
- No commit was created.

## 2026-05-15 - Week 3 Task 3 Routine Safety Engine Foundation

### Task

Implement the domain-only Routine Safety Engine foundation without adding AI integration, API routes, database queries, repositories, use cases, UI changes, or new dependencies.

### Files Added

```txt
src/domain/routine-safety/routine-safety.types.ts
src/domain/routine-safety/active-signal-normalizer.ts
src/domain/routine-safety/routine-safety-engine.ts
src/domain/routine-safety/index.ts
tests/unit/routine-safety-engine.test.ts
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

Week 3 Task 3 requires the deterministic rule engine foundation from `docs/11-routine-safety-rules.md` so future routine analysis can run rules before AI while keeping this task independent from application, persistence, and UI layers.

### Implementation Notes

- Added `src/domain/routine-safety` as the task-scoped domain location.
- Added active-signal normalization for AHA, BHA, PHA, RETINOID, BENZOYL_PEROXIDE, VITAMIN_C_STRONG, and FRAGRANCE.
- The normalizer reads `keyActivesSnapshot`, then `ingredientTextSnapshot`, and only uses `customProductName` text when snapshot ingredient fields are missing.
- The engine implements `MISSING_SUNSCREEN_AM`, `TOO_MANY_ACTIVES`, `RETINOID_PLUS_EXFOLIANT`, `TOO_MANY_STEPS_BEGINNER`, `FRAGRANCE_SENSITIVE_CAUTION`, `MISSING_MOISTURIZER`, and `TOO_MANY_CUSTOM_PRODUCTS`.
- PHA counts for `TOO_MANY_ACTIVES`, `RETINOID_PLUS_EXFOLIANT`, and `MISSING_MOISTURIZER` exfoliant behavior.
- FRAGRANCE is normalized for fragrance-sensitive caution but does not count as a strong active.
- `MISSING_MOISTURIZER` detects exfoliant behavior through normalized AHA/BHA/PHA signals, not through a category.
- The engine returns `allRuleResults`, `triggeredRules`, deterministic `riskLevel`, and normalized signal metadata.
- Product data is not loaded when `productId` exists but snapshots are missing.
- No Routine Analysis API, AI integration, database persistence, Product lookup, Product snapshot population, UI, Journal, Routine Logs, dashboard data integration, skin score, image upload, or medical diagnosis was implemented.
- Follow-up review tightened custom product snapshot detection so product name, brand, key active, or ingredient snapshots prevent a custom product from being counted as missing snapshot data. `productId` alone still does not count as snapshot data.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-safety-engine.test.ts: Pass - 1 file, 28 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 24 files, 229 tests
cmd /c npm run build: Pass
```

### Notes

- The engine is not yet wired into `POST /api/routines/:id/analyze`.
- The engine does not query products or backfill snapshots; missing product snapshots intentionally produce lower available signal context.
- No commit was created.

## 2026-05-14 - Week 3 Task 2 Routine Builder UI Foundation

### Task

Implement the protected `/routines` UI foundation for listing, creating, editing, and deleting routines through the existing Routine API.

### Files Added

```txt
src/app/(dashboard)/routines/page.tsx
src/modules/routines/components/routine-builder.tsx
tests/unit/routine-builder-ui.test.ts
```

### Files Updated

```txt
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/auth-middleware.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/routine-api-contract.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 2 requires the first Routine Builder UI foundation on `/routines` only, while reusing the completed Routine API and avoiding out-of-scope routine detail routes or product features.

### Implementation Notes

- `/routines` is a protected dashboard route group page that renders a module-owned client component.
- The UI loads routines with `GET /api/routines`.
- The UI creates routines with `POST /api/routines`.
- The UI edits routines inline with `PATCH /api/routines/[id]`.
- The UI deletes routines with `DELETE /api/routines/[id]`.
- The UI shows loading, empty, list, create, edit, validation error, API error, saving, deleting, and success states.
- Submitted payloads include only `name`, `timeOfDay`, and steps with `customProductName`, `category`, `order`, `frequency`, and optional `instructions`.
- The UI does not submit `productId`, `stepId`, `userId`, `id`, `_id`, timestamps, or Product snapshot fields.
- Dashboard Routines navigation now points to `/routines` and is enabled.
- `src/proxy.ts` now protects `/routines/:path*` while preserving `/dashboard/:path*`, `/onboarding/:path*`, and `/skin-profile/:path*`.
- Product picker, Product module, Ingredient module, Routine Analysis, AI, Journal, Routine Logs, dashboard data integration, skin score, image upload, and medical diagnosis were not implemented.

### Tests

```txt
cmd /c npm test -- tests/unit/routine-builder-ui.test.ts tests/unit/dashboard-shell.test.ts tests/unit/auth-middleware.test.ts tests/unit/routine-api-contract.test.ts: Pass - 4 files, 35 tests
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 23 files, 201 tests
cmd /c npm run build: Pass
```

### Notes

- No `/routines/new`, `/routines/[id]`, or `/routines/[id]/analysis` route was created.
- No new dependencies were added.
- No commit was created.

## 2026-05-14 - Week 3 Task 1 Routine API Foundation

### Task

Implement the Routine API foundation so authenticated users can list, create, read, update, and delete their own routines through API routes.

### Files Added

```txt
src/app/api/routines/route.ts
src/app/api/routines/[id]/route.ts
src/modules/routines/routine.types.ts
src/modules/routines/routine.schema.ts
src/modules/routines/routine.dto.ts
src/modules/routines/routine.mapper.ts
src/modules/routines/routine.repository.ts
src/modules/routines/routine.use-case.ts
tests/unit/routine.test.ts
tests/unit/routine-use-case.test.ts
tests/unit/routine-api-contract.test.ts
```

### Files Updated

```txt
tests/unit/database-indexes.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 3 Task 1 requires Routine API/domain foundation only, using the Skin Profile module pattern and keeping Routine Builder UI and unrelated product features out of scope.

### Implementation Notes

- `/api/routines` supports authenticated `GET` list and `POST` create.
- `/api/routines/[id]` supports authenticated `GET`, `PATCH`, and `DELETE`.
- All routine operations are scoped to the authenticated user.
- `userId` is derived from `getCurrentUser()` and is never accepted from client input.
- MongoDB `_id` is converted to `id` in Routine DTOs, and Date fields are converted to ISO strings.
- Routine `stepId` is generated server-side before persistence.
- Create/update validation rejects client-provided `userId`, `id`, `_id`, `createdAt`, `updatedAt`, `stepId`, and Product snapshot fields.
- Invalid routine ids, missing routines, and routines owned by another user return `NOT_FOUND`.
- Product snapshot lookup was not implemented and snapshot fields are not accepted from client input.
- Routine Builder UI, Routine Analysis, Product/Ingredient modules, AI, Journal, Routine Logs, dashboard data integration, skin score, image upload, and medical diagnosis were not implemented.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 22 files, 190 tests
cmd /c npm run build: Pass
```

### Notes

- No new dependencies were added.
- No commit was created.

## 2026-05-14 - Week 2 Task 2.2 Skin Profile View/Edit Route

### Task

Add the protected `/skin-profile` route where authenticated users can view and edit their existing Skin Profile after onboarding.

### Files Added

```txt
src/app/(dashboard)/skin-profile/page.tsx
src/modules/skin-profile/components/skin-profile-view-edit.tsx
tests/unit/skin-profile-view-edit.test.ts
```

### Files Updated

```txt
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/auth-middleware.test.ts
tests/unit/dashboard-shell.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 2.2 requires `/skin-profile` to become the main protected Skin Profile view/edit route while preserving `/onboarding/skin-profile` for first-time setup.

### Implementation Notes

- Added `src/app/(dashboard)/skin-profile/page.tsx` as a thin protected route page in the existing dashboard route group.
- Added `SkinProfileViewEdit` as a client component that uses the existing `/api/skin-profile` endpoint.
- `GET /api/skin-profile` loads the current user's profile on initial page load.
- A missing profile shows an empty state with a CTA to `/onboarding/skin-profile`.
- Existing profiles render in view mode and can switch to editing mode.
- Saves use `PATCH /api/skin-profile` only and stay on `/skin-profile` after success.
- The `/skin-profile` edit payload includes only SkinProfile fields and does not submit `id`, `_id`, `userId`, `onboardingCompleted`, `createdAt`, or `updatedAt`.
- Dashboard Skin Profile navigation now points to `routes.SKIN_PROFILE`.
- `src/proxy.ts` now protects `/dashboard/:path*`, `/onboarding/:path*`, and `/skin-profile/:path*`.
- `/onboarding/skin-profile` remains available and its existing POST/PATCH plus dashboard redirect behavior was not changed.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 19 files, 149 tests
cmd /c npm run build: Pass
```

### Notes

- No `/api/skin-profile` response shape or route handler behavior was changed.
- No POST-based profile creation was added to `/skin-profile`.
- No Routine Builder, Product module, Ingredient module, Journal, AI provider, AI recommendations, dashboard data integration, image upload, skin score, medical diagnosis, notifications, payment/subscription, analytics, or admin features were implemented.
- No new dependencies were added.

## 2026-05-14 - Week 2 Task 2.1 Skin Profile Onboarding Flow Integration

### Task

Connect the completed Skin Profile onboarding UI into the authenticated app flow without starting unrelated features.

### Files Added

```txt
tests/unit/skin-profile-use-case.test.ts
```

### Files Updated

```txt
src/modules/users/app-user-profile.repository.ts
src/modules/skin-profile/skin-profile.use-case.ts
src/modules/dashboard/dashboard-shell.config.ts
src/proxy.ts
tests/unit/app-user-profile.test.ts
tests/unit/auth-middleware.test.ts
tests/unit/dashboard-shell.test.ts
tests/unit/me-api-contract.test.ts
tests/unit/skin-profile.test.ts
tests/unit/skin-profile-api-contract.test.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 2.1 requires `/onboarding/skin-profile` to be discoverable from the protected dashboard area and requires successful `POST /api/skin-profile` to mark `AppUserProfile.onboardingCompleted = true` server-side.

### Implementation Notes

- Added `markAppUserProfileOnboardingCompleted(userId)` with atomic `findOneAndUpdate`, `upsert: true`, and `returnDocument: "after"`.
- The onboarding completion marker uses `$set` for `onboardingCompleted: true` and `updatedAt`, and uses `$setOnInsert` only for `userId`, default `USER` role, and `createdAt`.
- `createOrReplaceSkinProfileForCurrentUser` now marks onboarding complete after SkinProfile create/replace succeeds, then returns the SkinProfile unchanged.
- `PATCH /api/skin-profile` still updates only SkinProfile fields and does not reset or change AppUserProfile onboarding state.
- `GET /api/me` can reflect `onboardingCompleted: true` through the existing AppUserProfile mapper flow.
- Dashboard navigation now links Skin Profile to `routes.ONBOARDING_SKIN_PROFILE`.
- `src/proxy.ts` now protects `/dashboard/:path*` and `/onboarding/:path*`.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 18 files, 137 tests
cmd /c npm run build: Pass
```

### Notes

- No AI, Routine Builder, Product module, Ingredient module, Journal, dashboard data integration, image upload, skin score, product recommendations, medical diagnosis, `/skin-profile` page, new dependencies, or Auth.js built-in route changes were implemented.

## 2026-05-14 - Week 2 Task 2 Skin Profile Onboarding UI

### Task

Implement the protected Skin Profile onboarding UI only.

### Files Added

```txt
src/app/(dashboard)/onboarding/skin-profile/page.tsx
src/modules/skin-profile/components/skin-profile-onboarding-form.tsx
tests/unit/skin-profile-onboarding.test.ts
```

### Files Updated

```txt
src/shared/constants/routes.ts
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Reason

Week 2 Task 2 requires an authenticated onboarding page where users can create or update their Skin Profile through the existing `/api/skin-profile` endpoint.

### Implementation Notes

- Added `/onboarding/skin-profile` under the protected `(dashboard)` route group.
- Added `routes.ONBOARDING_SKIN_PROFILE`.
- Added a client form component under `src/modules/skin-profile/components`.
- The form calls `GET /api/skin-profile` on load, prefills when a profile exists, and shows a blank create form for `NOT_FOUND`.
- The form submits with `POST` for create mode and `PATCH` for update mode.
- The form reuses the existing Skin Profile Zod schemas and does not submit `id`, `_id`, `userId`, `createdAt`, or `updatedAt`.
- The client component does not import repository, database, use-case, or `server-only` modules.

### Tests

```txt
cmd /c npm run lint: Pass
cmd /c npm run typecheck: Pass
cmd /c npm test: Pass - 17 files, 126 tests
cmd /c npm run build: Pass
```

### Notes

- No Routine Builder, Product module, Ingredient module, AI provider, AI recommendations, Routine Analysis, Journal, dashboard data integration, medical diagnosis, skin score, image upload, product recommendations, or Auth.js route behavior was implemented.
- Successful save redirects to `/dashboard`; the `AppUserProfile.onboardingCompleted` follow-up was implemented later in Week 2 Task 2.1.

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
- At the time of Week 2 Task 1, successful `POST /api/skin-profile` did not update `AppUserProfile.onboardingCompleted`; this follow-up was implemented later in Week 2 Task 2.1.
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

## 2026-05-17 — TASK RL-001 RoutineLog Foundation

### Task

Implemented the RoutineLog backend foundation for recording completed, partially completed, or skipped routines on a specific local calendar date.

### Files Added

```txt
src/modules/routine-logs/index.ts
src/modules/routine-logs/routine-log.types.ts
src/modules/routine-logs/routine-log.schema.ts
src/modules/routine-logs/routine-log.dto.ts
src/modules/routine-logs/routine-log.mapper.ts
src/modules/routine-logs/routine-log.repository.ts
src/modules/routine-logs/routine-log.use-case.ts
src/app/api/routine-logs/route.ts
tests/unit/routine-log.test.ts
tests/unit/routine-log-use-case.test.ts
tests/unit/routine-log-api-contract.test.ts
```

### Files Updated

```txt
docs/04-data-model.md
docs/05-api-contract.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
tests/unit/database-indexes.test.ts
```

### Reason

RoutineLog is needed before daily completion UI, dashboard cards, consistency tracking, streaks, and future AI insights can be built. The implementation keeps local calendar behavior explicit by storing `localDate` as a `YYYY-MM-DD` string and `timezone` as a string.

### Implementation Notes

- Added strict Zod schemas for RoutineLog date query and PUT upsert input.
- Added DTO and mapper that expose `id` but not `userId`, `_id`, or raw MongoDB internals.
- Added repository functions for finding logs by local date, finding one log by routine/date, and upserting by `userId + routineId + localDate`.
- Added use-case validation that checks routine ownership and validates `completedStepIds` against the target routine's `stepId` values.
- Added authenticated `GET /api/routine-logs?localDate=YYYY-MM-DD`.
- Added canonical authenticated `PUT /api/routine-logs` upsert endpoint.
- Reused existing `routine_logs` collection helper and unique/query index definitions.

### Tests

- Unit: RoutineLog schema, mapper, repository, use-case, API contract, and index tests added/updated.
- Commands: `npm run lint`, `npm run typecheck`, and `npm run test` passed during implementation.

### Notes

- No RoutineLog UI was implemented.
- No dashboard integration, streak calculation, analytics, AI insights, SkinJournal, image upload, skin score, or medical diagnosis was implemented.
- Next recommended task is TASK RL-002 — RoutineLog UI integration.

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
