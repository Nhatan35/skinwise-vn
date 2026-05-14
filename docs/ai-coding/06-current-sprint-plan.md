# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

## 1. Current sprint

```txt
Week 2 - Skin Profile View/Edit Route
```

## 2. Sprint goal

Add the protected `/skin-profile` view/edit route using the existing `/api/skin-profile` endpoint and protected dashboard shell without starting unrelated product modules.

## 3. Allowed tasks this sprint

```txt
Keep /onboarding/skin-profile available for first-time onboarding
Mark AppUserProfile.onboardingCompleted = true after successful POST /api/skin-profile
Keep PATCH /api/skin-profile limited to SkinProfile fields
Keep GET /api/me reflecting AppUserProfile onboarding state
Protect /onboarding/:path* through src/proxy.ts
Expose /skin-profile as the main protected Skin Profile view/edit route
Use GET /api/skin-profile to load the current profile on /skin-profile
Use PATCH /api/skin-profile to update an existing profile on /skin-profile
Keep /skin-profile from using POST-based profile creation
Link missing profiles from /skin-profile to /onboarding/skin-profile
Protect /skin-profile/:path* through src/proxy.ts
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

### Task 2.2 - Skin Profile view/edit route

Expected output:

```txt
src/app/(dashboard)/skin-profile/page.tsx added
src/modules/skin-profile/components/skin-profile-view-edit.tsx added
src/modules/dashboard/dashboard-shell.config.ts updated
src/proxy.ts updated
tests/unit/skin-profile-view-edit.test.ts added
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
[x] `/onboarding/skin-profile` is discoverable from protected dashboard navigation.
[x] Successful `POST /api/skin-profile` marks `AppUserProfile.onboardingCompleted = true` server-side.
[x] `GET /api/me` can reflect `onboardingCompleted: true`.
[x] `PATCH /api/skin-profile` does not reset or change onboarding state.
[x] `/onboarding/:path*` is included in the proxy matcher.
[x] `/skin-profile` is the main protected Skin Profile view/edit route.
[x] `/skin-profile` loads the current profile with `GET /api/skin-profile`.
[x] `/skin-profile` updates existing profiles with `PATCH /api/skin-profile`.
[x] `/skin-profile` does not add POST-based profile creation.
[x] `/onboarding/skin-profile` remains available for first-time onboarding.
[x] Dashboard Skin Profile navigation points to `/skin-profile`.
[x] `/skin-profile/:path*` is included in the proxy matcher.
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
