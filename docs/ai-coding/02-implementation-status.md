# 02-implementation-status.md

# Implementation Status — SkinWise VN MVP v1.2.6

Last updated: 2026-05-23

## 1. Current phase

```txt
TASK SJ-002 SkinJournal Timeline UI completed
```

The SDD v1.2.6 final freeze is complete. Week 1 Tasks 1-7 initialized the Next.js App Router foundation, shadcn/ui tooling, shared UI foundation, package scripts, base folder structure, feature flag config, Zod environment validation, MongoDB infrastructure, Auth.js foundation, protected dashboard shell, and `GET /api/me` with lazy AppUserProfile creation. Week 2 delivered the Skin Profile API, onboarding UI, onboarding flow integration, and protected `/skin-profile` view/edit route. Week 3 delivered the Routine API, Routine Builder UI, Routine Safety Engine, Routine Analysis API/UI, and Routine Analysis rate limiting foundations. TASK PI-001, TASK PP-001, TASK RL-001, TASK RL-002, and TASK DB-001 delivered the read-only Product/Ingredient APIs, Product Picker, RoutineLog backend/UI, and data-driven dashboard. TASK AI-001 through TASK AI-007 delivered the server-only validated AI provider foundation, provider-backed Routine Analysis fallback behavior, and Ingredient Explanation API. TASK SJ-001 added the authenticated SkinJournal backend API foundation with `POST /api/skin-journal`, `GET /api/skin-journal`, `PATCH /api/skin-journal/[id]`, and `DELETE /api/skin-journal/[id]`. TASK SJ-002 added the protected `/journal` SkinJournal Timeline UI for listing, creating, editing, and deleting entries through the existing SJ-001 API contract. OpenAI and Gemini providers are not implemented yet, no external LLM/API calls were added, and the current usable provider remains the validated mock provider. Product UI pages, Product submission POST API, real OpenAI/Gemini provider integration, external LLM/API calls, SkinJournal product name resolution, SkinJournal calendar/analytics views, SkinJournal AI analysis, skin score, image upload, and medical diagnosis were not implemented.

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
[x] AI Provider Abstraction implemented
[x] AI Structured Output Validation implemented
[x] AI Provider Flow Validation implemented
[x] AI Provider Routine Analysis Contract Mapping implemented
[x] AI Provider-backed Routine Analysis with safe fallback implemented
[x] Routine Analysis provider failure observability implemented
[x] Ingredient Explanation API implemented
[x] SkinJournal backend API foundation implemented
[x] SkinJournal Timeline UI implemented
```

## 4. In progress

```txt
None
```

## 5. Not started

```txt
Deployment setup
```

## 6. Known gaps

```txt
MongoDB helper and index definitions exist, but `npm run db:indexes` was not run against a real database in TASK PI-001 because `MONGODB_URI` and `APP_ENV` were missing from the shell, so the intended database target could not be verified. Product and Ingredient index definitions remain covered by unit tests, and real environments must run `npm run db:indexes` to ensure canonical indexes exist.
Protected `/dashboard` now renders real user-scoped dashboard data through `GET /api/dashboard?localDate=YYYY-MM-DD`, summarizing Skin Profile, Routine counts, today's RoutineLog progress, latest Routine Analysis, and next actions. It still does not implement weekly/monthly charts, advanced streak logic, AI insights, SkinJournal dashboard integration, image upload, or skin score.
Skin Profile onboarding UI remains available at `/onboarding/skin-profile` for first-time onboarding, while `/skin-profile` is the main protected view/edit route.
Routine API CRUD exists for authenticated users, and `/routines` provides the UI foundation for listing, creating, editing, deleting, analyzing, viewing analysis history, and logging today's routine completion. TASK PP-001 adds Product Picker selection and server-owned Product snapshot population for selected visible products while preserving manual custom product fallback. RoutineLog backend foundation exists through authenticated `GET /api/routine-logs?localDate=YYYY-MM-DD` and `PUT /api/routine-logs`; TASK RL-002 adds `/routines` UI controls for completed, partial, and skipped daily logs using browser localDate and timezone. Dashboard data integration is implemented by TASK DB-001 using existing RoutineLog data for today only; advanced analytics remain intentionally not implemented.
Routine Safety Engine exists as a deterministic foundation under `src/domain/routine-safety`; Week 3 Task 4 wires it into Routine Analysis API persistence and public DTO mapping only.
Routine Analysis API exists, rate-limits authenticated analyze requests per user, runs the deterministic Routine Safety Engine first, then attempts provider-backed routine analysis through `getAIProvider().analyzeRoutine()`. Provider output is validated by `ValidatedAIProvider`, mapped through the provider-to-product mapper, merged with deterministic rule guidance, and safety-guarded so final risk is `max(safetyResult.riskLevel, mappedProviderResult.riskLevel)`. Provider success persists `aiStatus = "provider_used"` and `promptVersion = "routine-analysis-provider-v1"`; provider construction/call/validation/mapping/guard errors fall back to deterministic analysis with `aiStatus = "fallback_used"` and now persist an optional internal `providerFailureReason` safe reason code. Public RoutineAnalysis DTOs do not expose `providerFailureReason`, raw provider errors, stack traces, `providerMetadata`, or `educationalNotes`. Repository persistence errors are not swallowed as provider fallback. The use case does not call OpenAI, Gemini, external APIs, Product/Ingredient explanation modules, dashboard, Journal, or RoutineLog UI features.
AI Provider Abstraction exists under `src/infrastructure/ai` with `MockAIProvider`, `ValidatedAIProvider`, `getAIProvider()`, provider error classes, strict Zod output schemas, and validator functions for the current `AIProvider` output types. `ai-output.schema.ts` exports `aiProviderMetadataSchema`, `aiProviderRoutineAnalysisResultSchema`, `aiProviderIngredientExplanationResultSchema`, and `aiProviderSafetyClassifierResultSchema`. `ai-output.validator.ts` exports `validateRoutineAnalysisOutput`, `validateIngredientExplanationOutput`, and `validateSafetyClassifierOutput`; invalid output throws `AIProviderResponseError`. `validated-ai-provider.ts` wraps an inner `AIProvider`, validates each provider method output, returns validated output, and lets `AIProviderResponseError` propagate. `getAIProvider()` returns `ValidatedAIProvider` wrapping `MockAIProvider` when `AI_PROVIDER` is missing, empty, or `mock`; it still throws configuration errors for `openai` and `gemini`, does not initialize external clients, does not call external AI APIs, and does not require `AI_API_KEY`.
Product API foundation exists for authenticated read-only `GET /api/products` and `GET /api/products/:id`. It returns only `reviewed` or `verified` products and is now consumed by the Routine Builder Product Picker. It intentionally does not include Product UI pages, `POST /api/products`, `includeMine`, admin product management, seed scripts, external product APIs, image upload, or medical diagnosis.
Ingredient API foundation exists for authenticated read-only `GET /api/ingredients` and `GET /api/ingredients/:id`. TASK AI-007 adds authenticated, rate-limited `POST /api/ingredients/explain` with strict request validation, `getAIProvider().explainIngredient()` through `ValidatedAIProvider`, provider-to-public DTO mapping, and deterministic fallback. The public response does not expose raw provider errors, stack traces, `providerMetadata`, `educationalNotes`, `providerFailureReason`, OpenAI/Gemini metadata, or internal diagnostics. It intentionally does not include safety-classifier integration, admin ingredient management, seed scripts, persistence, real external AI calls, or medical diagnosis.
SkinJournal backend API foundation exists through authenticated `POST /api/skin-journal`, `GET /api/skin-journal`, `PATCH /api/skin-journal/[id]`, and `DELETE /api/skin-journal/[id]`. It validates local dates and IANA timezones, stores `localDate` as a `YYYY-MM-DD` string, scopes repository operations by authenticated `userId`, returns `CONFLICT` for duplicate `userId + localDate` creates, maps MongoDB documents to public DTOs, and rejects/omits future image and photo fields. The protected `/journal` route now renders the SkinJournal Timeline UI, enables Journal in dashboard navigation, protects `/journal/:path*`, and lets users view, create, edit, and delete entries through the existing SJ-001 API contract. It intentionally does not include image upload, image storage, product lookup/name resolution for `productsUsed`, calendar/analytics views, AI journal analysis, or medical diagnosis.
Routine Analysis UI exists only inside `/routines`; no `/routines/[id]`, `/routines/[id]/analysis`, or `/routines/[id]/analyses` UI routes were created.
Routine Analysis rate limiting uses the MongoDB `rate_limits` collection and requires `npm run db:indexes` to ensure the unique key and TTL indexes in real environments.
Optional `npm run test:e2e` reported the smoke test as `ok` during TASK-RA-001, but the command wrapper timed out waiting for the process to exit.
npm install reported 2 moderate audit vulnerabilities; npm audit fix --force was not run by task constraint.
`DELETE /api/skin-profile` does not reset `AppUserProfile.onboardingCompleted`; no reset behavior is specified for the current task.
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
Continue only with the next explicitly scoped task after review.
```

Recommended next coding task:

```txt
Choose the next SkinJournal task from product priorities, such as TASK SJ-003 - Add SkinJournal Product Linking / Product Name Resolution, TASK SJ-003 - Implement SkinJournal Calendar/Insight View, or TASK SJ-003 - Implement Private Journal Image Upload.
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
