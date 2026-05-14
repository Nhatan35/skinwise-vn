# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

## 1. Current sprint

```txt
Week 2 - Skin Profile Onboarding UI
```

## 2. Sprint goal

Implement the Skin Profile onboarding UI for authenticated users using the existing `/api/skin-profile` endpoint without starting unrelated product modules.

## 3. Allowed tasks this sprint

```txt
Create protected /onboarding/skin-profile page
Create Skin Profile onboarding client form
Call existing /api/skin-profile with fetch
Prefill form from existing profile
Submit POST for create mode and PATCH for update mode
Add lightweight node-only Vitest checks
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
Dashboard data integration
```

## 5. Sprint task breakdown

### Task 2 - Skin Profile onboarding UI

Expected output:

```txt
src/app/(dashboard)/onboarding/skin-profile/page.tsx
src/modules/skin-profile/components/skin-profile-onboarding-form.tsx
tests/unit/skin-profile-onboarding.test.ts
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/05-ai-change-log.md updated
```

## 6. Sprint Definition of Done

```txt
[x] Protected Skin Profile onboarding page exists.
[x] Form uses the existing Skin Profile API.
[x] Form uses existing Skin Profile schema/types.
[x] Form supports loading, blank create state, prefilled update state, validation errors, API errors, saving, and success.
[x] Form does not import repository, database, use-case, or server-only modules.
[x] Lightweight UI source tests exist.
[x] Final lint/typecheck/test/build pass after implementation.
[x] No out-of-scope features implemented.
[x] Status docs updated.
```

## 7. Prompt to continue sprint implementation

Use this prompt shape for the next scoped task:

```txt
Implement the next explicitly scoped Week 2 task only.
Do not start Routine, Journal, Product, Ingredient, AI, dashboard data integration, or any out-of-scope MVP feature unless explicitly requested.
```
