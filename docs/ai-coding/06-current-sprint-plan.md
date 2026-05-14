# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

## 1. Current sprint

```txt
Week 2 - Skin Profile API Foundation
```

## 2. Sprint goal

Implement the Skin Profile API foundation for authenticated users without adding UI or starting unrelated product modules.

## 3. Allowed tasks this sprint

```txt
Create SkinProfile types and enums
Create SkinProfile create/update Zod schemas
Create SkinProfile DTO and mapper
Create SkinProfile repository
Create SkinProfile use-case functions
Create /api/skin-profile route handlers
Add schema, mapper, repository, and API contract tests
Update implementation status docs
```

## 4. Not allowed this sprint

```txt
Routine Builder
Product module
Ingredient module
AI provider
Routine Analysis
Journal
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
```

## 5. Sprint task breakdown

### Task 1 - Skin Profile API foundation

Expected output:

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
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/05-ai-change-log.md updated
```

## 6. Sprint Definition of Done

```txt
[x] Authenticated Skin Profile API exists.
[x] Input validation exists.
[x] User ownership comes only from the server session.
[x] DTO mapper hides MongoDB internals and userId.
[x] Repository operations filter by authenticated userId.
[x] Unit/API contract tests exist.
[x] Final lint/typecheck/test/build pass after implementation.
[x] No out-of-scope features implemented.
[x] Status docs updated.
```

## 7. Prompt to continue sprint implementation

Use this prompt shape for the next scoped task:

```txt
Implement the next explicitly scoped Week 2 task only.
Do not start Routine, Journal, Product, Ingredient, AI, dashboard data integration, onboarding UI, or any out-of-scope MVP feature unless explicitly requested.
```
