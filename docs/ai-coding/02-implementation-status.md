# 02-implementation-status.md

# Implementation Status — SkinWise VN MVP v1.2.6

Last updated: 2026-05-28

## 1. Current phase

```txt
Post Week 6 quality hardening and deployment re-verification follow-up
```

Latest runtime/config task: `RUNTIME-001 - Standardize project runtime on Node 24 and npm 11` locally validated for the current feature scope, including authenticated Playwright E2E against the safe local test database.

Latest quality task: `MVP-E2E-CLOSEOUT-001 - Close out MVP core journey E2E validation and fix Routine Analysis duplicate React key warning`.

Latest MVP source task: `MVP-DATA-CONTROL-001 - Settings and Privacy Data Control Center`.

Latest closeout task: `MVP-E2E-CLOSEOUT-001 - MVP core journey E2E closeout and Routine Analysis duplicate-key polish`.

Latest E2E task: `MVP-CORE-JOURNEY-E2E-001 - Authenticated Playwright E2E coverage for the complete MVP core user journey` is completed in source/docs and recorded as locally validated by `MVP-CORE-JOURNEY-E2E-VALIDATION-001`. The latest recorded local evidence is: `npm run typecheck` PASS, `npm run lint` PASS, `npm run test` PASS with 72 files and 717 tests, `npm run build` PASS, `npm run db:indexes` PASS with 32 indexes ensured after `.env.local` was available locally, `npm run db:seed:e2e` PASS, and `npm run test:e2e` PASS with 24 tests. This evidence is local-only, contains no secret values, does not claim production verification, and does not claim real Google OAuth or external AI provider E2E validation.

The SDD v1.2.6 final freeze is now historical planning context. Week 1 Tasks 1-7 initialized the Next.js App Router foundation, shadcn/ui tooling, shared UI foundation, package scripts, base folder structure, feature flag config, Zod environment validation, MongoDB infrastructure, Auth.js foundation, protected dashboard shell, and `GET /api/me` with lazy AppUserProfile creation. Week 2 delivered the Skin Profile API, onboarding UI, onboarding flow integration, and protected `/skin-profile` view/edit route. Week 3 delivered the Routine API, Routine Builder UI, Routine Safety Engine, Routine Analysis API/UI, and Routine Analysis rate limiting foundations. TASK PI-001, TASK PP-001, TASK RL-001, TASK RL-002, and TASK DB-001 delivered the read-only Product/Ingredient APIs, Product Picker, RoutineLog backend/UI, and data-driven dashboard. TASK AI-001 through TASK AI-007 delivered the server-only validated AI provider foundation, provider-backed Routine Analysis fallback behavior, and Ingredient Explanation API. TASK SJ-001 added the authenticated SkinJournal backend API foundation with `POST /api/skin-journal`, `GET /api/skin-journal`, `PATCH /api/skin-journal/[id]`, and `DELETE /api/skin-journal/[id]`. TASK SJ-002 added the protected `/journal` SkinJournal Timeline UI for listing, creating, editing, and deleting entries through the existing SJ-001 API contract. TASK SJ-003 added UI-only product selection and product name resolution for SkinJournal by fetching visible products from `GET /api/products?limit=50` and parsing `data.items`; SkinJournal `productsUsed` still stores product ID strings and the backend contract remains unchanged. TASK PRODUCT-UI-001 added the protected `/products` Product Catalogue UI, enabled Products dashboard navigation, protected `/products/:path*`, and supports Product API search/filter params while parsing list responses from `data.items`. TASK PRODUCT-UI-002 added the protected `/products/[id]` Product Detail UI, ProductCard detail navigation, and a client-safe `getProduct()` helper that parses detail responses from `data.product`. TASK INGREDIENT-UI-001 added the protected `/ingredients` Ingredient Library UI, protected `/ingredients/[id]` Ingredient Detail UI, enabled Ingredients dashboard navigation, added a client-safe Ingredient API helper, and added an ingredient explanation panel that calls the existing `POST /api/ingredients/explain` API without persistence or real external provider integration. TASK SAVED-PRODUCTS-001 added the user-owned `saved_products` collection/indexes, authenticated saved-products APIs, protected `/saved-products` UI, Saved Products dashboard navigation, and Save/Saved actions in Product Catalogue and Product Detail flows. MVP-TODAY-LOG-001 added the protected `/routine-logs/today` Today Routine Checklist page, enabled Today Log dashboard navigation, reused the existing RoutineLog API/UI controls, and linked dashboard routine logging CTAs to the dedicated checklist route. MVP-DATA-CONTROL-001 added the protected `/settings` Settings & Data Control page, account overview, data management navigation, MVP-safe account deletion request marker, user-scoped RoutineLog delete API, and Today Log delete action. MVP-DATA-CONTROL-CLOSEOUT-001 added direct RoutineLog DELETE API contract coverage and cleaned stale closeout documentation. MVP-CORE-JOURNEY-E2E-001 added authenticated Playwright E2E coverage for Routine Builder, Routine Analysis, Today Routine Checklist, Routine Log deletion through UI, Skin Journal create/edit/delete, Settings/Data Control, account deletion request, dashboard summary reflection after user activity, and protected route smoke coverage for `/routine-logs/today` and `/settings`. It also added safe deterministic E2E-user reset logic under the existing local/test seed path and stable selectors only where needed for reliable Playwright assertions. MVP-CORE-JOURNEY-E2E-VALIDATION-001 recorded the completed local validation evidence for that suite. MVP-E2E-CLOSEOUT-001 fixes the Routine Analysis duplicate React key warning in the UI render layer by using a unique suggestion render key, and adds a targeted Routine Analysis E2E console-warning guard without changing product scope, API response shape, AI provider output, authentication, or user-facing suggestion copy.

TASK DEPLOY-001 added deployment preparation: a Vercel runbook, exact environment variable checklist, the historical Node 20 marker, clean package ignore rules, deployment readiness documentation, and a clean deployment-ready zip. RUNTIME-001 updates the current runtime baseline to Node 24.x / npm 11.x.

TASK DEPLOY-002 completed the MVP demo deployment to Vercel. Production URL is https://skinwise-vn.vercel.app. Production branch is `main`, production commit is `db72e07`, production smoke test passed, Google OAuth production login passed, authenticated MVP flows passed, and MongoDB production/demo read/write through authenticated flows passed.

TASK QA-REGRESSION-001 stabilized clean package validation across operating systems by making the Routine Builder unit test source extraction robust to both LF and CRLF line endings and adding root `.gitattributes` line-ending normalization rules. No Routine Builder business logic or product feature scope changed.

TASK DEMO-DATA-001 prepared professional demo data and demo documentation for the post-Week 6 MVP portfolio walkthrough. Public/shared seed data now better supports an oily or combination-oily demo user with acne, oiliness, post-acne dark spots, texture/clogged-pore concerns, mild sensitivity, simple morning/evening routines, and active-combination caution examples. User-owned demo data remains created through the authenticated UI instead of hardcoded fake users or fake dashboard output.

TASK PORTFOLIO-001 prepared professional portfolio documentation for BA internship and full-stack review. The portfolio case study, demo script, screenshots checklist, and README links now explain the problem, target users, MVP scope, requirements, user journey, acceptance criteria, functional/non-functional requirements, traceability, features, architecture, data model, API overview, testing evidence, deployment summary, limitations, and roadmap. No new product feature scope was added.

TASK FINAL-RELEASE-001 prepared the final portfolio-ready release documentation package. README was rewritten as a portfolio entry point, `docs/final-release-checklist.md` and `docs/release-notes-v1.0.md` were added, portfolio docs were checked for consistency, and optional next tasks were separated from MVP completion. No new product feature scope was added.

E2E-001 added unauthenticated Playwright smoke tests for the public landing page and protected-route redirects. The suite runs against a local/CI dev server with safe placeholder environment values, `AI_PROVIDER="mock"`, and Chromium-only Playwright coverage. It does not use real Google OAuth, real MongoDB Atlas credentials, Cloudinary, or external AI providers.

DEPLOY-VERIFY-001 is partial as of 2026-05-25. Local Node 20 validation previously passed (`npm ci`, lint, typecheck, unit tests, build, production audit, and E2E smoke tests) and remains historical evidence only. RUNTIME-001 updates the current runtime baseline to Node 24.x / npm 11.x; local validation for INGREDIENT-UI-001 has passed for lint, typecheck, unit tests, production build, safe E2E seed data, and authenticated Playwright E2E. The public production URL `https://skinwise-vn.vercel.app` returned the expected landing page content, and unauthenticated `/dashboard`, `/products`, `/routines`, `/journal`, and `/skin-profile` returned Auth.js sign-in redirects with callback URLs. Current Vercel dashboard/build logs/environment variables, Google Cloud Console OAuth settings, MongoDB Atlas settings/connectivity, Google OAuth production login, authenticated dashboard, MongoDB-backed read/write flow, sign-out, and Vercel runtime logs were not externally verified in this task.

QUALITY-001 added safe test-only authentication for authenticated Playwright E2E tests. `E2E_TEST_AUTH` is valid only when `APP_ENV="test"`, and Playwright enables an Auth.js Credentials provider with id `e2e-test` for the stable `e2e-user` account. The provider is not available in production or normal development, Google OAuth behavior is unchanged, and authenticated E2E tests now include a dashboard access smoke test.

QUALITY-002A added deterministic local/test product data seeding for Playwright through `npm run db:seed:e2e`, using only `mongodb://127.0.0.1:27017/skinwise-e2e-check`. Authenticated Playwright coverage now includes Skin Profile create/update, Product Catalogue browsing, and Product Detail navigation through the safe `e2e-test` Auth.js provider. No real Google OAuth, production MongoDB, auth bypass, product CRUD, admin workflow, Ingredient UI, or real AI provider was added. Local execution requires a MongoDB instance at the safe E2E URI.

RUNTIME-001 standardizes the project runtime on Node.js 24.x and npm 11.x. `.nvmrc`, `package.json` engines, CI, README, deployment docs, and AI coding status docs now point to Node 24. Current feature validation has passed for lint, typecheck, unit tests, production build, safe E2E seed data, and authenticated Playwright E2E against the safe local test database.

OpenAI and Gemini providers are not implemented yet, no external LLM/API calls were added, and the current deployed provider remains `AI_PROVIDER="mock"`. Product submission POST API, Product CRUD, admin product management, real OpenAI/Gemini provider integration, external LLM/API calls, SkinJournal saved product embedding, SkinJournal calendar/analytics views, SkinJournal AI analysis, skin score, image upload, marketplace, cart, payment, subscription, notifications, public sharing, likes, ratings, reviews, and medical diagnosis were not implemented.

## 2. Completed documentation

```txt
[x] Product vision
[x] PRD
[x] User stories
[x] System architecture
[x] Data model
[x] API contract
[x] AI contract
[x] Security and privacy rules
[x] Test plan
[x] Release plan
[x] Project structure
[x] Routine safety rules
[x] Prompt files
[x] Source-of-truth index
[x] Week 1 implementation plan
[x] UI route map
[x] Seed data spec
[x] Use case and repository contract
[x] AI fallback policy
[x] Vietnamese copy guidelines
[x] Deployment checklist
[x] AI coding context pack
[x] v1.2.5 consistency hotfix before Week 1 implementation
[x] v1.2.6 final freeze and engineering execution guardrails
[x] Engineering Execution Checklist
[x] ADR records
[x] PR checklist template
[x] CI template
[x] Week 1 Task 1 prompt
[x] Vercel deployment runbook
[x] Deployment-ready package checklist
[x] DEPLOY-002 production deployment and smoke test status
[x] Demo data and demo script
[x] Portfolio case study
[x] Presentation-ready demo script
[x] Screenshots checklist
[x] Final release checklist
[x] Release notes v1.0
[x] E2E smoke test status
```

## 3. Completed code

```txt
[x] Next.js project initialized
[x] TypeScript configured
[x] Tailwind configured
[x] shadcn/ui initialized
[x] Base folder structure created
[x] Environment validation implemented
[x] MongoDB helper implemented
[x] Auth.js foundation implemented
[x] Protected dashboard shell implemented
[x] GET /api/me lazy AppUserProfile foundation implemented
[x] Test setup implemented
[x] Feature flag config implemented
[x] Database index script implemented
[x] CI exists in implementation repo
[x] Basic package scripts configured
[x] Runtime engines configured for Node 24.x / npm 11.x
[x] Shared UI foundation components implemented
[x] Skin Profile API foundation implemented
[x] Foundation stabilization patch implemented
[x] Skin Profile onboarding UI implemented
[x] Skin Profile onboarding flow integration implemented
[x] Skin Profile view/edit route implemented
[x] Routine API foundation implemented
[x] Routine Builder UI foundation implemented
[x] Routine Safety Engine foundation implemented
[x] Routine Analysis API foundation implemented
[x] Routine Analysis UI foundation implemented
[x] Routine Analysis API per-user rate limiting implemented
[x] Product API foundation implemented
[x] Ingredient API foundation implemented
[x] Product Picker integration into Routine Builder implemented
[x] Routine Product Snapshot population implemented
[x] RoutineLog backend foundation implemented
[x] RoutineLog UI integration implemented
[x] Dashboard data integration implemented
[x] Dashboard latest journal summary and journal-aware next action implemented
[x] AI Provider Abstraction implemented
[x] AI Structured Output Validation implemented
[x] AI Provider Flow Validation implemented
[x] AI Provider Routine Analysis Contract Mapping implemented
[x] AI Provider-backed Routine Analysis with safe fallback implemented
[x] Routine Analysis provider failure observability implemented
[x] Ingredient Explanation API implemented
[x] SkinJournal backend API foundation implemented
[x] SkinJournal Timeline UI implemented
[x] SkinJournal product selection and name resolution implemented
[x] Product Catalogue UI implemented
[x] Product Detail UI implemented
[x] Ingredient Library UI implemented
[x] Ingredient Detail UI implemented
[x] Ingredient Explanation UI panel implemented
[x] Saved Products implemented
[x] Saved Products Product Catalogue and Product Detail integration implemented
[x] Vercel deployment preparation documented
[x] Historical Node 20 marker added
[x] Runtime baseline updated to Node 24.x / npm 11.x
[x] Current feature local validation under Node 24.x / npm 11.x, including E2E with local MongoDB available
[x] Clean deployment package created
[x] Vercel MVP demo deployment completed
[x] Production smoke test passed
[x] Clean package validation line-ending stability fixed
[x] Professional demo data and manual demo setup documented
[x] Portfolio documentation package prepared
[x] Final release documentation package prepared
[x] Unauthenticated Playwright smoke tests implemented
[x] Test-only authenticated Playwright smoke foundation implemented
[x] Deterministic local/test E2E product data seed command implemented
[x] Authenticated Skin Profile/Product Catalogue/Product Detail/Saved Products Playwright specs implemented
[x] CI runs E2E smoke tests
```

## 4. In progress

```txt
DEPLOY-VERIFY-001A external platform verification, optional screenshot capture, authenticated E2E coverage planning, and optional portfolio website publishing.
```

## 5. Not started

```txt
Real OpenAI/Gemini provider integration
Product submission/Product CRUD
Production monitoring
Full commercial production hardening
```

## 6. Known gaps

```txt
MongoDB helper and index definitions exist, but `npm run db:indexes` was not run against a real database in TASK PI-001 because `MONGODB_URI` and `APP_ENV` were missing from the shell, so the intended database target could not be verified. Product and Ingredient index definitions remain covered by unit tests, and real environments must run `npm run db:indexes` to ensure canonical indexes exist.
Protected `/dashboard` now renders real user-scoped dashboard data through `GET /api/dashboard?localDate=YYYY-MM-DD`, summarizing Skin Profile, Routine counts, today's RoutineLog progress, latest SkinJournal summary, latest Routine Analysis, and deterministic next actions. It still does not implement weekly/monthly charts, advanced streak logic, AI-generated dashboard insights, image upload, calendar analytics, streaks, or skin score.
Skin Profile onboarding UI remains available at `/onboarding/skin-profile` for first-time onboarding, while `/skin-profile` is the main protected view/edit route.
Routine API CRUD exists for authenticated users, and `/routines` provides the UI foundation for listing, creating, editing, deleting, analyzing, viewing analysis history, and logging today's routine completion. TASK PP-001 adds Product Picker selection and server-owned Product snapshot population for selected visible products while preserving manual custom product fallback. RoutineLog backend foundation exists through authenticated `GET /api/routine-logs?localDate=YYYY-MM-DD` and `PUT /api/routine-logs`; TASK RL-002 adds `/routines` UI controls for completed, partial, and skipped daily logs using browser localDate and timezone. MVP-TODAY-LOG-001 adds `/routine-logs/today` as a dedicated authenticated checklist page that reuses those same controls and keeps dashboard progress based on existing RoutineLog data for today only; advanced analytics remain intentionally not implemented.
Routine Safety Engine exists as a deterministic foundation under `src/domain/routine-safety`; Week 3 Task 4 wires it into Routine Analysis API persistence and public DTO mapping only.
Routine Analysis API exists, rate-limits authenticated analyze requests per user, runs the deterministic Routine Safety Engine first, then attempts provider-backed routine analysis through `getAIProvider().analyzeRoutine()`. Provider output is validated by `ValidatedAIProvider`, mapped through the provider-to-product mapper, merged with deterministic rule guidance, and safety-guarded so final risk is `max(safetyResult.riskLevel, mappedProviderResult.riskLevel)`. Provider success persists `aiStatus = "provider_used"` and `promptVersion = "routine-analysis-provider-v1"`; provider construction/call/validation/mapping/guard errors fall back to deterministic analysis with `aiStatus = "fallback_used"` and now persist an optional internal `providerFailureReason` safe reason code. Public RoutineAnalysis DTOs do not expose `providerFailureReason`, raw provider errors, stack traces, `providerMetadata`, or `educationalNotes`. Repository persistence errors are not swallowed as provider fallback. The use case does not call OpenAI, Gemini, external APIs, Product/Ingredient explanation modules, dashboard, Journal, or RoutineLog UI features.
AI Provider Abstraction exists under `src/infrastructure/ai` with `MockAIProvider`, `ValidatedAIProvider`, `getAIProvider()`, provider error classes, strict Zod output schemas, and validator functions for the current `AIProvider` output types. `ai-output.schema.ts` exports `aiProviderMetadataSchema`, `aiProviderRoutineAnalysisResultSchema`, `aiProviderIngredientExplanationResultSchema`, and `aiProviderSafetyClassifierResultSchema`. `ai-output.validator.ts` exports `validateRoutineAnalysisOutput`, `validateIngredientExplanationOutput`, and `validateSafetyClassifierOutput`; invalid output throws `AIProviderResponseError`. `validated-ai-provider.ts` wraps an inner `AIProvider`, validates each provider method output, returns validated output, and lets `AIProviderResponseError` propagate. `getAIProvider()` returns `ValidatedAIProvider` wrapping `MockAIProvider` when `AI_PROVIDER` is missing, empty, or `mock`; it still throws configuration errors for `openai` and `gemini`, does not initialize external clients, does not call external AI APIs, and does not require `AI_API_KEY`.
Product API foundation exists for authenticated read-only `GET /api/products` and `GET /api/products/:id`. It returns only `reviewed` or `verified` products and is now consumed by the Routine Builder Product Picker, SkinJournal product selection/name resolution, the protected `/products` Product Catalogue UI, the protected `/products/[id]` Product Detail UI, and Saved Products save-state display. PRODUCT-UI-001 uses existing Product API filters (`q`, `category`, `priceRange`, `skinType`, `concern`, `limit`) and parses list responses from `data.items`. PRODUCT-UI-002 parses detail responses from `data.product`, preserves 404 status in `ProductClientError`, and displays public Product DTO fields only. SAVED-PRODUCTS-001 does not change the Product schema or implement Product CRUD. It intentionally does not include `POST /api/products`, includeMine UI, admin product management, Product CRUD, Product submission, seed scripts, external product APIs, image upload, AI recommendations, skin score, marketplace/cart/payment, comparison, public sharing, or medical diagnosis.

Saved Products exists for authenticated user-owned product bookmarks through `GET /api/saved-products`, `POST /api/saved-products`, and `DELETE /api/saved-products/[productId]`. The module validates `productId`, confirms visible product existence before saving, scopes all repository operations by authenticated `userId`, prevents duplicate saves through a unique `userId + productId` index, maps saved records plus public Product DTOs to `SavedProductDto`, and never exposes `userId` to the client. The protected `/saved-products` route lists the current user's saved products and supports remove. Product Catalogue and Product Detail render Save/Saved actions through a client-safe saved-product helper.
Ingredient API foundation exists for authenticated read-only `GET /api/ingredients` and `GET /api/ingredients/:id`. TASK AI-007 adds authenticated, rate-limited `POST /api/ingredients/explain` with strict request validation, `getAIProvider().explainIngredient()` through `ValidatedAIProvider`, provider-to-public DTO mapping, and deterministic fallback. TASK INGREDIENT-UI-001 adds a protected Ingredient Library UI at `/ingredients`, a protected Ingredient Detail UI at `/ingredients/[id]`, and an explanation panel that calls the existing explanation API. The public response does not expose raw provider errors, stack traces, `providerMetadata`, `educationalNotes`, `providerFailureReason`, OpenAI/Gemini metadata, or internal diagnostics. It intentionally does not include safety-classifier integration, admin ingredient management, persistence of explanations, real external AI calls, ingredient CRUD, or medical diagnosis.
SkinJournal backend API foundation exists through authenticated `POST /api/skin-journal`, `GET /api/skin-journal`, `PATCH /api/skin-journal/[id]`, and `DELETE /api/skin-journal/[id]`. It validates local dates and IANA timezones, stores `localDate` as a `YYYY-MM-DD` string, scopes repository operations by authenticated `userId`, returns `CONFLICT` for duplicate `userId + localDate` creates, maps MongoDB documents to public DTOs, and rejects/omits future image and photo fields. The protected `/journal` route now renders the SkinJournal Timeline UI, enables Journal in dashboard navigation, protects `/journal/:path*`, and lets users view, create, edit, delete, select catalogue products, and see readable product labels through the existing SJ-001 API contract plus the existing Product API. Product resolution is UI-only: `productsUsed` remains product ID strings, Product API responses are parsed from `data.items`, and missing/deleted products display as `Unknown product`. It intentionally does not include image upload, image storage, saved product library, Product CRUD UI, product snapshots in journal entries, calendar/analytics views, AI journal analysis, or medical diagnosis.
Routine Analysis UI exists only inside `/routines`; no `/routines/[id]`, `/routines/[id]/analysis`, or `/routines/[id]/analyses` UI routes were created.
Routine Analysis rate limiting uses the MongoDB `rate_limits` collection and requires `npm run db:indexes` to ensure the unique key and TTL indexes in real environments.
Playwright tests now exist under `tests/e2e/` and cover the public landing page, unauthenticated redirects for protected routes, authenticated dashboard access, Skin Profile create/update, Product Catalogue browsing, Product Detail navigation, Saved Products save/list/remove, Ingredient Library search/detail/explanation, Routine Builder, Routine Analysis, Today Routine Checklist, Routine Log deletion, Skin Journal create/edit/delete, Settings/Data Control, account deletion request, and Dashboard summary reflection. Authenticated tests use the safe test-only Auth.js Credentials provider from QUALITY-001 and deterministic local/test product, ingredient, and E2E-user-owned data from `npm run db:seed:e2e`. The Routine Analysis E2E flow includes a targeted guard for the duplicate React key warning involving repeated `AI recommendation` suggestions. Real Google OAuth login, production OAuth behavior, production MongoDB, and external AI providers are not tested by this local E2E suite.
npm install reported 2 moderate audit vulnerabilities; npm audit fix --force was not run by task constraint.
`DELETE /api/skin-profile` does not reset `AppUserProfile.onboardingCompleted`; no reset behavior is specified for the current task.
TASK DEPLOY-002 deployed the MVP demo to Vercel at https://skinwise-vn.vercel.app and passed manual production smoke testing for public pages, protected route redirects, Google OAuth login, authenticated MVP flows, MongoDB production/demo read/write through authenticated flows, and product safety boundaries. This is an MVP demo deployment, not a full commercial production release.
Real AI provider integration, image upload, AI face analysis, marketplace, payment, subscription, notifications, skin score, and medical diagnosis remain out of scope.
Product catalogue data is demo/seed-style catalogue data.
TASK DEMO-DATA-001 improved public/shared seed data for the portfolio walkthrough and documents the manual setup for user-owned Skin Profile, Morning Routine, Evening Routine, caution routine, routine logs, SkinJournal entries, and dashboard summary. User-owned demo data is not seeded by default because it depends on the authenticated Auth.js user id; no fake user id, fake Auth.js user, static dashboard output, or auth bypass was added.
TASK PORTFOLIO-001 created `docs/portfolio-case-study.md`, `docs/demo-script.md`, and `docs/screenshots-checklist.md`. The API method table in the portfolio case study was verified against `src/app/api/**/route.ts`. Validation evidence is clearly labeled as current-task or previously documented evidence.
TASK FINAL-RELEASE-001 added `docs/final-release-checklist.md` and `docs/release-notes-v1.0.md`, polished README as the portfolio entry point, and kept screenshots as manual optional work. Final validation evidence is recorded in the release checklist and release notes.
Clean package validation is more robust across Windows CRLF and Unix LF environments after TASK QA-REGRESSION-001. The fix only changed test/source-package normalization behavior and did not alter Routine Builder UI or business logic.
```

## 7. Do not work on yet

```txt
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
Large-scale product crawling
```

## 8. Next recommended task

```txt
DEPLOY-VERIFY-001A - Complete manual external platform verification with Vercel, Google Cloud Console, and MongoDB Atlas evidence
```

Recommended next coding task:

```txt
DEPLOY-VERIFY-001A - Complete manual external platform verification with Vercel, Google Cloud Console, and MongoDB Atlas evidence
```

## 9. Update rule

After each coding task, update:

```txt
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
```


## Final Freeze Cleanup

Final documentation cleanup completed for v1.2.6. Seed data spec now aligns with the canonical data model, README/release-plan version wording is corrected, and MongoDB Adapter client-sharing wording is clarified. Current implementation phase is tracked in section 1 above.


## Local MongoDB/Auth runtime stabilization — 2026-05-23

```txt
TASK LOCAL-AUTH-DB-001 completed
```

### What changed

- `npm run db:indexes` now loads `.env.local` so the MongoDB index script can read `MONGODB_URI` during local execution.
- `scripts/configure-node-dns.cjs` is preloaded by `npm run dev` so Node.js resolves MongoDB Atlas `mongodb+srv://` SRV records through `8.8.8.8` and `1.1.1.1` before Next.js/Auth.js starts.
- `src/infrastructure/database/mongodb.ts` configures the same DNS servers before creating `MongoClient`.
- `src/auth.ts` configures DNS before loading the shared MongoDB client and uses `session.strategy = "jwt"` while keeping the MongoDB Adapter.
- Browser cookie cleanup is documented for `JWTSessionError` / `Invalid Compact JWE` after auth secret or session-strategy changes.

### Verified evidence

```txt
npm run db:indexes
=> db:indexes created: 30 indexes ensured

npm run dev
=> [node-dns] DNS servers: [ '8.8.8.8', '1.1.1.1' ]
```

### Follow-up verification

```txt
[ ] Google OAuth sign-in redirects successfully to /dashboard.
[ ] No Auth.js AdapterError with `querySrv ECONNREFUSED` appears during Google callback.
[ ] No JWTSessionError remains after clearing localhost site data.
```


## PRODUCT-UI-001 review fix — 2026-05-23

```txt
TASK PRODUCT-UI-001 review fix completed
```

### What changed

- Dashboard sidebar navigation now derives active state from the current pathname instead of hard-coding `/dashboard` as active.
- The Products nav item is active on `/products` and remains linked to `routes.PRODUCTS`.
- Ingredients is enabled and linked to `routes.INGREDIENTS`; Today Log is now enabled by MVP-TODAY-LOG-001 and linked to `routes.TODAY_LOG`.

### Verified evidence

```txt
npm run test -- tests/unit/dashboard-shell.test.ts tests/unit/product-catalogue-ui.test.ts
=> 2 files passed, 13 tests passed

npm run typecheck
=> passed

npm run lint
=> passed

npm run test
=> 59 files passed, 581 tests passed
```


## DASHBOARD-ENHANCE-001 dashboard journal summary - 2026-05-23

```txt
TASK DASHBOARD-ENHANCE-001 completed
```

### What changed

- `GET /api/dashboard?localDate=YYYY-MM-DD` now includes a DTO-safe `latestJournal` summary.
- The dashboard use case reuses the existing SkinJournal list use case to fetch the latest entry and check whether an entry exists for the requested dashboard localDate.
- `/dashboard` renders a Latest Journal Entry card with localDate, observations, symptoms, optional stress level, notes preview, product count, and Journal CTA.
- Recommended next action is now a deterministic single primary action ordered by skin profile, routine, today's routine log, today's journal, routine analysis, then up-to-date state.

### Verified evidence

```txt
npm run typecheck
=> passed

npm run test
=> 59 files passed, 587 tests passed
```

### Out of scope

```txt
No dashboard charts, streaks, SkinJournal analytics, image upload, AI-generated journal insight, skin score, Product/Ingredient changes, or medical diagnosis were added.
```


## PRODUCT-UI-002 product detail UI - 2026-05-24

```txt
TASK PRODUCT-UI-002 - Implement Product Detail UI completed
```

### Summary

- Added protected product detail route at `/products/[id]`.
- Added ProductDetail client component with loading, error, not-found, and success states.
- Added getProduct client fetch helper for `GET /api/products/[id]`.
- Added View details navigation from ProductCard.
- Added unit tests for route, client helper, UI state handling, and scope boundaries.

### Manual verification

```txt
Manual browser/OAuth verification: Passed

[x] Login with Google.
[x] Go to `/products`.
[x] Click View details on a product card.
[x] Confirm `/products/[id]` opens successfully.
[x] Confirm product detail information is displayed.
[x] Confirm Back to products works.
[x] Open `/products/not-a-real-id`.
[x] Confirm Product not found state is displayed.
[x] Confirm there are no client/server runtime errors.
```

### Validation commands

```txt
npm run lint
=> passed

npm run typecheck
=> passed

npm run test
=> passed - 60 files, 602 tests

Manual browser/OAuth verification
=> passed
```


MVP-DATA-CONTROL-001 added the protected `/settings` Settings & Data Control page, enabled Settings dashboard navigation, added an MVP-safe `accountDeletionRequestedAt` request marker via `POST /api/account/deletion-request`, and added user-scoped `DELETE /api/routine-logs/:id` with a Today Log delete action. The task does not add automatic Auth.js hard-delete, bulk data deletion, export, notifications, admin workflows, or legal compliance claims.

MVP-DATA-CONTROL-CLOSEOUT-001 is completed in source/docs. It added direct `DELETE /api/routine-logs/[id]` API contract coverage, confirmed user-scoped deletion behavior, removed stale RoutineLog API documentation, updated `/routine-logs/today` and `/settings` route documentation, moved Settings/Data Control into the main feature status table, and refreshed closeout validation notes.

Latest MVP-DATA-CONTROL-CLOSEOUT-001 local validation in this sandbox:

```txt
Runtime used by this sandbox: Node v22.16.0 / npm 10.9.2.
Project target runtime remains Node 24.x / npm 11.x per package.json.

npm run lint: Pass
npm run typecheck: Pass
npm run test: Pass - 72 files, 717 tests
npm run build: Pass with safe local placeholder env values
npm run db:seed:e2e: Not run because no local MongoDB was listening on 127.0.0.1:27017
npm run test:e2e: Not run because no local MongoDB was listening on 127.0.0.1:27017
```
