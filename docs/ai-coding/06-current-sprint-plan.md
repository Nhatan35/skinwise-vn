# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-15

## 1. Current sprint

```txt
Week 3 - Routine Analysis API Foundation
```

## 2. Sprint goal

Implement the Routine Analysis API foundation so deterministic MVP routine safety rules can be run for owned routines, persisted as RoutineAnalysis records, and exposed through public DTOs with triggered warnings only, without starting real AI provider integration, external API calls, rate limiting, Product lookup, or UI changes.

## 3. Allowed tasks this sprint

```txt
Create src/modules/ai-analysis/routine-analysis.types.ts
Create src/modules/ai-analysis/routine-analysis.schema.ts
Create src/modules/ai-analysis/routine-analysis.dto.ts
Create src/modules/ai-analysis/routine-analysis.mapper.ts
Create src/modules/ai-analysis/routine-analysis.repository.ts
Create src/modules/ai-analysis/analyze-routine.use-case.ts
Create src/modules/ai-analysis/index.ts
Create src/app/api/routines/[id]/analyze/route.ts
Create src/app/api/routines/[id]/analyses/route.ts
Run the deterministic Routine Safety Engine from the use case
Persist RoutineAnalysis documents
Store all rule results internally
Return public DTOs with triggered warnings only
Add focused Vitest checks
Update implementation status docs
```

## 4. Not allowed this sprint

```txt
Create /routines/new
Create /routines/[id]
Create /routines/[id]/analysis
Product module
Ingredient module
Product picker
AI provider
OpenAI or LLM client calls
External API calls
New rate-limiting system
Journal
Routine Logs
Product lookup
Product snapshot population
UI changes
Skincare advice generation
Medical diagnosis
Image upload
AI face analysis
Skin score
Marketplace
Affiliate monetization
Barcode scanner
Community feed
Push notifications
Subscription/payment
Admin review UI
Microservices
RAG/vector database
Queue/background jobs
Dashboard data integration
```

## 5. Sprint task breakdown

### Task 3.1 - Routine API foundation

Expected output:

```txt
src/app/api/routines/route.ts added
src/app/api/routines/[id]/route.ts added
src/modules/routines/routine.types.ts added
src/modules/routines/routine.schema.ts added
src/modules/routines/routine.dto.ts added
src/modules/routines/routine.mapper.ts added
src/modules/routines/routine.repository.ts added
src/modules/routines/routine.use-case.ts added
tests/unit/routine.test.ts added
tests/unit/routine-use-case.test.ts added
tests/unit/routine-api-contract.test.ts added
relevant existing unit tests updated
docs/ai-coding/01-codebase-map.md updated
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/04-file-ownership-map.md updated
docs/ai-coding/05-ai-change-log.md updated
docs/ai-coding/06-current-sprint-plan.md updated
```

### Task 3.2 - Routine Builder UI foundation

Expected output:

```txt
src/app/(dashboard)/routines/page.tsx added
src/modules/routines/components/routine-builder.tsx added
src/modules/dashboard/dashboard-shell.config.ts updated
src/proxy.ts updated
tests/unit/routine-builder-ui.test.ts added
relevant existing unit tests updated
docs/ai-coding/01-codebase-map.md updated
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/04-file-ownership-map.md updated
docs/ai-coding/05-ai-change-log.md updated
docs/ai-coding/06-current-sprint-plan.md updated
```

### Task 3.3 - Routine Safety Engine foundation

Expected output:

```txt
src/domain/routine-safety/routine-safety.types.ts added
src/domain/routine-safety/active-signal-normalizer.ts added
src/domain/routine-safety/routine-safety-engine.ts added
src/domain/routine-safety/index.ts added
tests/unit/routine-safety-engine.test.ts added
docs/ai-coding/01-codebase-map.md updated
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/04-file-ownership-map.md updated
docs/ai-coding/05-ai-change-log.md updated
docs/ai-coding/06-current-sprint-plan.md updated
```

### Task 3.4 - Routine Analysis API foundation

Expected output:

```txt
src/modules/ai-analysis/routine-analysis.types.ts added
src/modules/ai-analysis/routine-analysis.schema.ts added
src/modules/ai-analysis/routine-analysis.dto.ts added
src/modules/ai-analysis/routine-analysis.mapper.ts added
src/modules/ai-analysis/routine-analysis.repository.ts added
src/modules/ai-analysis/analyze-routine.use-case.ts added
src/modules/ai-analysis/index.ts added
src/app/api/routines/[id]/analyze/route.ts added
src/app/api/routines/[id]/analyses/route.ts added
tests/unit/routine-analysis.test.ts added
tests/unit/routine-analysis-api-contract.test.ts added
tests/unit/routine-analysis-use-case.test.ts added
docs/ai-coding/01-codebase-map.md updated
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/04-file-ownership-map.md updated
docs/ai-coding/05-ai-change-log.md updated
docs/ai-coding/06-current-sprint-plan.md updated
```

## 6. Sprint Definition of Done

```txt
[x] `/routines` protected UI route exists.
[x] `/routines` loads routines with `GET /api/routines`.
[x] `/routines` creates routines with `POST /api/routines`.
[x] `/routines` edits routines with `PATCH /api/routines/[id]`.
[x] `/routines` deletes routines with `DELETE /api/routines/[id]`.
[x] UI uses `customProductName` instead of Product picker.
[x] UI does not submit `productId`, `stepId`, `userId`, `id`, `_id`, timestamps, or Product snapshot fields.
[x] Dashboard Routines navigation points to `/routines`.
[x] `/routines/:path*` is protected by `src/proxy.ts`.
[x] Product snapshot lookup was not implemented.
[x] Product picker was not implemented.
[x] Product/Ingredient modules, real AI provider integration, Journal, Routine Logs, dashboard data integration, image upload, skin score, and medical diagnosis were not implemented.
[x] Lightweight unit/API/source tests exist.
[x] Final lint/typecheck/test/build pass after implementation.
[x] Status docs updated.
[x] `src/domain/routine-safety` domain package exists.
[x] Active signal normalization covers AHA, BHA, PHA, RETINOID, BENZOYL_PEROXIDE, VITAMIN_C_STRONG, and FRAGRANCE.
[x] PHA counts for active count, retinoid/exfoliant checks, and moisturizer-support exfoliant behavior.
[x] FRAGRANCE does not count as a strong active.
[x] Routine Safety Engine does not import app, database, repository, use-case, API, UI, AI, env, or config layers.
[x] No AI integration, UI changes, Product lookup, Journal, Routine Logs, skin score, image upload, or medical diagnosis were implemented.
[x] `POST /api/routines/[id]/analyze` route exists.
[x] `GET /api/routines/[id]/analyses` route exists.
[x] Both Routine Analysis routes require authentication.
[x] Routine Analysis use case verifies routine ownership by `routineId + userId`.
[x] Missing and not-owned routines return `NOT_FOUND`.
[x] Routine Safety Engine runs before persistence.
[x] RoutineAnalysis stores all rule results, including non-triggered rules.
[x] Public Routine Analysis DTOs expose triggered warnings only.
[x] Public Routine Analysis DTOs do not expose `_id`, `userId`, or internal `ruleResults`.
[x] RoutineAnalysis metadata uses deterministic fallback constants only.
[x] No OpenAI, LLM client, external API call, Product/Ingredient integration, UI, dashboard, Journal, Routine Logs, skin score, image upload, or medical diagnosis was implemented.
[x] No new rate-limiting system was implemented because no shared rate-limit utility exists.
[x] Rate limiting is documented as a follow-up.
```

## 7. Prompt to continue sprint implementation

Use this prompt shape for the next scoped task:

```txt
Implement the next explicitly scoped Week 3 task only.
Do not start Product, Ingredient, real AI provider integration, rate limiting, Journal, Routine Logs, Product picker, dashboard data integration, or any out-of-scope MVP feature unless explicitly requested.
```
