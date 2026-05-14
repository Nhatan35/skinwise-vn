# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

## 1. Current sprint

```txt
Week 3 - Routine Builder UI Foundation
```

## 2. Sprint goal

Implement the protected `/routines` UI foundation so authenticated users can list, create, edit, and delete routines through the existing Routine API without starting Product picker, Routine Analysis, or unrelated product modules.

## 3. Allowed tasks this sprint

```txt
Add protected /routines page
Load routines with GET /api/routines
Create routines with POST /api/routines
Edit routines with PATCH /api/routines/[id]
Delete routines with DELETE /api/routines/[id]
Use customProductName instead of Product picker
Submit only allowed Routine API fields
Enable dashboard Routines navigation to routes.ROUTINES
Protect /routines/:path* in src/proxy.ts
Add lightweight Vitest checks
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
[x] Routine Analysis, Product/Ingredient modules, AI, Journal, Routine Logs, dashboard data integration, image upload, skin score, and medical diagnosis were not implemented.
[x] Lightweight unit/API/source tests exist.
[x] Final lint/typecheck/test/build pass after implementation.
[x] Status docs updated.
```

## 7. Prompt to continue sprint implementation

Use this prompt shape for the next scoped task:

```txt
Implement the next explicitly scoped Week 3 task only.
Do not start Routine Analysis, Product, Ingredient, AI, Journal, Routine Logs, Product picker, dashboard data integration, or any out-of-scope MVP feature unless explicitly requested.
```
