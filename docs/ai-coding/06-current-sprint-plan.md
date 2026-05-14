# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

## 1. Current sprint

```txt
Week 2 - Skin Profile Onboarding Flow Integration
```

## 2. Sprint goal

Connect the Skin Profile onboarding UI into the authenticated app flow using the existing `/api/skin-profile`, `/api/me`, and protected dashboard shell without starting unrelated product modules.

## 3. Allowed tasks this sprint

```txt
Expose /onboarding/skin-profile from protected dashboard navigation
Mark AppUserProfile.onboardingCompleted = true after successful POST /api/skin-profile
Keep PATCH /api/skin-profile limited to SkinProfile fields
Keep GET /api/me reflecting AppUserProfile onboarding state
Protect /onboarding/:path* through src/proxy.ts
Add lightweight Vitest checks
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

### Task 2.1 - Skin Profile onboarding flow integration

Expected output:

```txt
src/modules/users/app-user-profile.repository.ts updated
src/modules/skin-profile/skin-profile.use-case.ts updated
src/modules/dashboard/dashboard-shell.config.ts updated
src/proxy.ts updated
tests/unit/skin-profile-use-case.test.ts
relevant existing unit tests updated
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/05-ai-change-log.md updated
```

## 6. Sprint Definition of Done

```txt
[x] `/onboarding/skin-profile` is discoverable from protected dashboard navigation.
[x] Successful `POST /api/skin-profile` marks `AppUserProfile.onboardingCompleted = true` server-side.
[x] `GET /api/me` can reflect `onboardingCompleted: true`.
[x] `PATCH /api/skin-profile` does not reset or change onboarding state.
[x] `/onboarding/:path*` is included in the proxy matcher.
[x] Lightweight unit/API/source tests exist.
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
