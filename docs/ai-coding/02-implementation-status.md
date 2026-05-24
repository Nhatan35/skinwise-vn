# 02-implementation-status.md

# Implementation Status — SkinWise VN MVP v1.2.6

Last updated: 2026-05-24

## 1. Current phase

```txt
Post Week 6 MVP cleanup, validation, deployment preparation, and portfolio readiness
```

Latest completed task: `TASK DEPLOY-001 - Prepare Vercel deployment for SkinWise VN MVP`.

The SDD v1.2.6 final freeze is now historical planning context. Week 1 Tasks 1-7 initialized the Next.js App Router foundation, shadcn/ui tooling, shared UI foundation, package scripts, base folder structure, feature flag config, Zod environment validation, MongoDB infrastructure, Auth.js foundation, protected dashboard shell, and `GET /api/me` with lazy AppUserProfile creation. Week 2 delivered the Skin Profile API, onboarding UI, onboarding flow integration, and protected `/skin-profile` view/edit route. Week 3 delivered the Routine API, Routine Builder UI, Routine Safety Engine, Routine Analysis API/UI, and Routine Analysis rate limiting foundations. TASK PI-001, TASK PP-001, TASK RL-001, TASK RL-002, and TASK DB-001 delivered the read-only Product/Ingredient APIs, Product Picker, RoutineLog backend/UI, and data-driven dashboard. TASK AI-001 through TASK AI-007 delivered the server-only validated AI provider foundation, provider-backed Routine Analysis fallback behavior, and Ingredient Explanation API. TASK SJ-001 added the authenticated SkinJournal backend API foundation with `POST /api/skin-journal`, `GET /api/skin-journal`, `PATCH /api/skin-journal/[id]`, and `DELETE /api/skin-journal/[id]`. TASK SJ-002 added the protected `/journal` SkinJournal Timeline UI for listing, creating, editing, and deleting entries through the existing SJ-001 API contract. TASK SJ-003 added UI-only product selection and product name resolution for SkinJournal by fetching visible products from `GET /api/products?limit=50` and parsing `data.items`; SkinJournal `productsUsed` still stores product ID strings and the backend contract remains unchanged. TASK PRODUCT-UI-001 added the protected `/products` Product Catalogue UI, enabled Products dashboard navigation, protected `/products/:path*`, and supports Product API search/filter params while parsing list responses from `data.items`. TASK PRODUCT-UI-002 added the protected `/products/[id]` Product Detail UI, ProductCard detail navigation, and a client-safe `getProduct()` helper that parses detail responses from `data.product`.

TASK DEPLOY-001 added deployment preparation only: a Vercel runbook, exact environment variable checklist, Node 20 marker, clean package ignore rules, deployment readiness documentation, and a clean deployment-ready zip. Actual Vercel deployment was not executed, no production URL was provided, and production smoke testing was not performed.

OpenAI and Gemini providers are not implemented yet, no external LLM/API calls were added, and the current usable provider remains the validated mock provider. Product submission POST API, Product CRUD, admin product management, real OpenAI/Gemini provider integration, external LLM/API calls, SkinJournal saved product library, SkinJournal calendar/analytics views, SkinJournal AI analysis, skin score, image upload, and medical diagnosis were not implemented.

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
[x] Vercel deployment preparation documented
[x] Node 20 marker added
[x] Clean deployment package created
```

## 4. In progress

```txt
DEPLOY-001 prepared; actual Vercel deployment is not executed.
```

## 5. Not started

```txt
Actual Vercel deployment execution
Production smoke test
Real OpenAI/Gemini provider integration
Product submission/Product CRUD
Dedicated Ingredient UI
Production monitoring
```

## 6. Known gaps

```txt
MongoDB helper and index definitions exist, but `npm run db:indexes` was not run against a real database in TASK PI-001 because `MONGODB_URI` and `APP_ENV` were missing from the shell, so the intended database target could not be verified. Product and Ingredient index definitions remain covered by unit tests, and real environments must run `npm run db:indexes` to ensure canonical indexes exist.
Protected `/dashboard` now renders real user-scoped dashboard data through `GET /api/dashboard?localDate=YYYY-MM-DD`, summarizing Skin Profile, Routine counts, today's RoutineLog progress, latest SkinJournal summary, latest Routine Analysis, and deterministic next actions. It still does not implement weekly/monthly charts, advanced streak logic, AI-generated dashboard insights, image upload, calendar analytics, streaks, or skin score.
Skin Profile onboarding UI remains available at `/onboarding/skin-profile` for first-time onboarding, while `/skin-profile` is the main protected view/edit route.
Routine API CRUD exists for authenticated users, and `/routines` provides the UI foundation for listing, creating, editing, deleting, analyzing, viewing analysis history, and logging today's routine completion. TASK PP-001 adds Product Picker selection and server-owned Product snapshot population for selected visible products while preserving manual custom product fallback. RoutineLog backend foundation exists through authenticated `GET /api/routine-logs?localDate=YYYY-MM-DD` and `PUT /api/routine-logs`; TASK RL-002 adds `/routines` UI controls for completed, partial, and skipped daily logs using browser localDate and timezone. Dashboard data integration is implemented by TASK DB-001 using existing RoutineLog data for today only; advanced analytics remain intentionally not implemented.
Routine Safety Engine exists as a deterministic foundation under `src/domain/routine-safety`; Week 3 Task 4 wires it into Routine Analysis API persistence and public DTO mapping only.
Routine Analysis API exists, rate-limits authenticated analyze requests per user, runs the deterministic Routine Safety Engine first, then attempts provider-backed routine analysis through `getAIProvider().analyzeRoutine()`. Provider output is validated by `ValidatedAIProvider`, mapped through the provider-to-product mapper, merged with deterministic rule guidance, and safety-guarded so final risk is `max(safetyResult.riskLevel, mappedProviderResult.riskLevel)`. Provider success persists `aiStatus = "provider_used"` and `promptVersion = "routine-analysis-provider-v1"`; provider construction/call/validation/mapping/guard errors fall back to deterministic analysis with `aiStatus = "fallback_used"` and now persist an optional internal `providerFailureReason` safe reason code. Public RoutineAnalysis DTOs do not expose `providerFailureReason`, raw provider errors, stack traces, `providerMetadata`, or `educationalNotes`. Repository persistence errors are not swallowed as provider fallback. The use case does not call OpenAI, Gemini, external APIs, Product/Ingredient explanation modules, dashboard, Journal, or RoutineLog UI features.
AI Provider Abstraction exists under `src/infrastructure/ai` with `MockAIProvider`, `ValidatedAIProvider`, `getAIProvider()`, provider error classes, strict Zod output schemas, and validator functions for the current `AIProvider` output types. `ai-output.schema.ts` exports `aiProviderMetadataSchema`, `aiProviderRoutineAnalysisResultSchema`, `aiProviderIngredientExplanationResultSchema`, and `aiProviderSafetyClassifierResultSchema`. `ai-output.validator.ts` exports `validateRoutineAnalysisOutput`, `validateIngredientExplanationOutput`, and `validateSafetyClassifierOutput`; invalid output throws `AIProviderResponseError`. `validated-ai-provider.ts` wraps an inner `AIProvider`, validates each provider method output, returns validated output, and lets `AIProviderResponseError` propagate. `getAIProvider()` returns `ValidatedAIProvider` wrapping `MockAIProvider` when `AI_PROVIDER` is missing, empty, or `mock`; it still throws configuration errors for `openai` and `gemini`, does not initialize external clients, does not call external AI APIs, and does not require `AI_API_KEY`.
Product API foundation exists for authenticated read-only `GET /api/products` and `GET /api/products/:id`. It returns only `reviewed` or `verified` products and is now consumed by the Routine Builder Product Picker, SkinJournal product selection/name resolution, the protected `/products` Product Catalogue UI, and the protected `/products/[id]` Product Detail UI. PRODUCT-UI-001 uses existing Product API filters (`q`, `category`, `priceRange`, `skinType`, `concern`, `limit`) and parses list responses from `data.items`. PRODUCT-UI-002 parses detail responses from `data.product`, preserves 404 status in `ProductClientError`, and displays public Product DTO fields only. It intentionally does not include `POST /api/products`, includeMine UI, admin product management, Product CRUD, Product submission, saved product library, seed scripts, external product APIs, image upload, AI recommendations, skin score, routine integration, or medical diagnosis.
Ingredient API foundation exists for authenticated read-only `GET /api/ingredients` and `GET /api/ingredients/:id`. TASK AI-007 adds authenticated, rate-limited `POST /api/ingredients/explain` with strict request validation, `getAIProvider().explainIngredient()` through `ValidatedAIProvider`, provider-to-public DTO mapping, and deterministic fallback. The public response does not expose raw provider errors, stack traces, `providerMetadata`, `educationalNotes`, `providerFailureReason`, OpenAI/Gemini metadata, or internal diagnostics. It intentionally does not include safety-classifier integration, admin ingredient management, seed scripts, persistence, real external AI calls, or medical diagnosis.
SkinJournal backend API foundation exists through authenticated `POST /api/skin-journal`, `GET /api/skin-journal`, `PATCH /api/skin-journal/[id]`, and `DELETE /api/skin-journal/[id]`. It validates local dates and IANA timezones, stores `localDate` as a `YYYY-MM-DD` string, scopes repository operations by authenticated `userId`, returns `CONFLICT` for duplicate `userId + localDate` creates, maps MongoDB documents to public DTOs, and rejects/omits future image and photo fields. The protected `/journal` route now renders the SkinJournal Timeline UI, enables Journal in dashboard navigation, protects `/journal/:path*`, and lets users view, create, edit, delete, select catalogue products, and see readable product labels through the existing SJ-001 API contract plus the existing Product API. Product resolution is UI-only: `productsUsed` remains product ID strings, Product API responses are parsed from `data.items`, and missing/deleted products display as `Unknown product`. It intentionally does not include image upload, image storage, saved product library, Product CRUD UI, product snapshots in journal entries, calendar/analytics views, AI journal analysis, or medical diagnosis.
Routine Analysis UI exists only inside `/routines`; no `/routines/[id]`, `/routines/[id]/analysis`, or `/routines/[id]/analyses` UI routes were created.
Routine Analysis rate limiting uses the MongoDB `rate_limits` collection and requires `npm run db:indexes` to ensure the unique key and TTL indexes in real environments.
Optional `npm run test:e2e` reported the smoke test as `ok` during TASK-RA-001, but the command wrapper timed out waiting for the process to exit.
npm install reported 2 moderate audit vulnerabilities; npm audit fix --force was not run by task constraint.
`DELETE /api/skin-profile` does not reset `AppUserProfile.onboardingCompleted`; no reset behavior is specified for the current task.
TASK DEPLOY-001 did not execute Vercel deployment. Production URL is not provided, production smoke test is not completed, Google OAuth production callback is not configured/tested, MongoDB Atlas production/demo access is not tested, and E2E tests remain config-only because no real specs exist in tests/e2e.
Real AI provider integration, image upload, marketplace, notifications, skin score, and medical diagnosis remain out of scope.
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
TASK DEPLOY-002 - Execute Vercel deployment and run production smoke test
```

Recommended next coding task:

```txt
TASK DEPLOY-002 - Execute Vercel deployment and run production smoke test
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
- Today Log and Ingredients remain disabled with `href: null`.

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
