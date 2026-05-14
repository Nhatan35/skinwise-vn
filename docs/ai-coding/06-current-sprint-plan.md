# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

## 1. Current sprint

```txt
Week 3 - Routine API Foundation
```

## 2. Sprint goal

Implement the Routine API/domain foundation so authenticated users can create, list, read, update, and delete their own routines through protected API routes without starting Routine Builder UI or unrelated product modules.

## 3. Allowed tasks this sprint

```txt
Add /api/routines authenticated list/create
Add /api/routines/[id] authenticated read/update/delete
Scope every routine operation to authenticated userId
Reject client userId, id, _id, createdAt, updatedAt, stepId, and snapshot fields
Generate stepId server-side
Convert MongoDB _id to id in DTOs
Convert Date fields to ISO strings in DTOs
Return NOT_FOUND for invalid, missing, or not-owned routine ids
Add lightweight Vitest checks
Update implementation status docs
```

## 4. Not allowed this sprint

```txt
Routine Builder
Routine Builder UI routes
Product module
Ingredient module
AI provider
Routine Analysis
Journal
Routine Logs
Product lookup
Product snapshot population
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

## 6. Sprint Definition of Done

```txt
[x] `/api/routines` supports authenticated list/create.
[x] `/api/routines/[id]` supports authenticated read/update/delete.
[x] Routine operations are scoped to authenticated userId.
[x] Client-provided userId, id, _id, timestamps, stepId, and snapshot fields are rejected.
[x] stepId is generated server-side.
[x] DTOs convert MongoDB `_id` to `id` and Dates to ISO strings.
[x] Invalid, missing, or not-owned routine ids return NOT_FOUND.
[x] Product snapshot lookup was not implemented.
[x] Routine Builder UI was not implemented.
[x] Routine Analysis, Product/Ingredient modules, AI, Journal, Routine Logs, dashboard data integration, image upload, skin score, and medical diagnosis were not implemented.
[x] Lightweight unit/API/source tests exist.
[x] Final lint/typecheck/test/build pass after implementation.
[x] Status docs updated.
```

## 7. Prompt to continue sprint implementation

Use this prompt shape for the next scoped task:

```txt
Implement the next explicitly scoped Week 3 task only.
Do not start Routine Builder UI, Routine Analysis, Product, Ingredient, AI, Journal, Routine Logs, dashboard data integration, or any out-of-scope MVP feature unless explicitly requested.
```
