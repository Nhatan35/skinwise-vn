# 02-implementation-status.md

# Implementation Status — SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

## 1. Current phase

```txt
TASK AI-003 Provider Flow Validation implemented
```

The SDD v1.2.6 final freeze is complete. Week 1 Tasks 1-7 initialized the Next.js App Router foundation, shadcn/ui tooling, shared UI foundation, package scripts, base folder structure, feature flag config, Zod environment validation, MongoDB infrastructure, Auth.js foundation, protected dashboard shell, and `GET /api/me` with lazy AppUserProfile creation. Week 2 delivered the Skin Profile API, onboarding UI, onboarding flow integration, and protected `/skin-profile` view/edit route. Week 3 delivered the Routine API, Routine Builder UI, Routine Safety Engine, Routine Analysis API/UI, and Routine Analysis rate limiting foundations. TASK PI-001, TASK PP-001, TASK RL-001, TASK RL-002, and TASK DB-001 delivered the read-only Product/Ingredient APIs, Product Picker, RoutineLog backend/UI, and data-driven dashboard. TASK AI-001 implemented the server-only AI Provider Abstraction with `MockAIProvider`, `getAIProvider()`, and AI provider error classes. TASK AI-002 implemented strict Zod structured output validation for the current `AIProvider` output types from `src/infrastructure/ai/ai-provider.ts`. TASK AI-003 integrated that validation into the provider flow with `ValidatedAIProvider`; every successfully constructed raw provider is now wrapped before being returned from `getAIProvider()`, and invalid provider output throws `AIProviderResponseError`. OpenAI and Gemini providers are not implemented yet. Routine Analysis API remains deterministic fallback only. Product UI pages, Product submission POST API, Ingredient explanation AI API, real OpenAI/Gemini provider integration, external LLM/API calls, Journal, skin score, image upload, and medical diagnosis were not implemented.

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
```

## 4. In progress

```txt
None
```

## 5. Not started

```txt
SkinJournal module
Ingredient explanation API
Deployment setup
```

## 6. Known gaps

```txt
MongoDB helper and index definitions exist, but `npm run db:indexes` was not run against a real database in TASK PI-001 because `MONGODB_URI` and `APP_ENV` were missing from the shell, so the intended database target could not be verified. Product and Ingredient index definitions remain covered by unit tests, and real environments must run `npm run db:indexes` to ensure canonical indexes exist.
Protected `/dashboard` now renders real user-scoped dashboard data through `GET /api/dashboard?localDate=YYYY-MM-DD`, summarizing Skin Profile, Routine counts, today's RoutineLog progress, latest Routine Analysis, and next actions. It still does not implement weekly/monthly charts, advanced streak logic, AI insights, SkinJournal, image upload, or skin score.
Skin Profile onboarding UI remains available at `/onboarding/skin-profile` for first-time onboarding, while `/skin-profile` is the main protected view/edit route.
Routine API CRUD exists for authenticated users, and `/routines` provides the UI foundation for listing, creating, editing, deleting, analyzing, viewing analysis history, and logging today's routine completion. TASK PP-001 adds Product Picker selection and server-owned Product snapshot population for selected visible products while preserving manual custom product fallback. RoutineLog backend foundation exists through authenticated `GET /api/routine-logs?localDate=YYYY-MM-DD` and `PUT /api/routine-logs`; TASK RL-002 adds `/routines` UI controls for completed, partial, and skipped daily logs using browser localDate and timezone. Dashboard data integration is implemented by TASK DB-001 using existing RoutineLog data for today only; advanced analytics remain intentionally not implemented.
Routine Safety Engine exists as a deterministic foundation under `src/domain/routine-safety`; Week 3 Task 4 wires it into Routine Analysis API persistence and public DTO mapping only.
Routine Analysis API exists with deterministic fallback metadata only and now rate-limits authenticated analyze requests per user. It is not wired to call the AI Provider Abstraction yet and does not call OpenAI, Gemini, LLM clients, external APIs, Product/Ingredient explanation modules, dashboard, Journal, or RoutineLog UI features.
AI Provider Abstraction exists under `src/infrastructure/ai` with `MockAIProvider`, `ValidatedAIProvider`, `getAIProvider()`, provider error classes, strict Zod output schemas, and validator functions for the current `AIProvider` output types. `ai-output.schema.ts` exports `aiProviderMetadataSchema`, `aiProviderRoutineAnalysisResultSchema`, `aiProviderIngredientExplanationResultSchema`, and `aiProviderSafetyClassifierResultSchema`. `ai-output.validator.ts` exports `validateRoutineAnalysisOutput`, `validateIngredientExplanationOutput`, and `validateSafetyClassifierOutput`; invalid output throws `AIProviderResponseError`. `validated-ai-provider.ts` wraps an inner `AIProvider`, validates each provider method output, returns validated output, and lets `AIProviderResponseError` propagate. `getAIProvider()` returns `ValidatedAIProvider` wrapping `MockAIProvider` when `AI_PROVIDER` is missing, empty, or `mock`; it still throws configuration errors for `openai` and `gemini`, does not initialize external clients, does not call external AI APIs, and does not require `AI_API_KEY`. TASK AI-003 did not wire Routine Analysis API behavior to provider calls.
Product API foundation exists for authenticated read-only `GET /api/products` and `GET /api/products/:id`. It returns only `reviewed` or `verified` products and is now consumed by the Routine Builder Product Picker. It intentionally does not include Product UI pages, `POST /api/products`, `includeMine`, admin product management, seed scripts, external product APIs, image upload, or medical diagnosis.
Ingredient API foundation exists for authenticated read-only `GET /api/ingredients` and `GET /api/ingredients/:id`. It intentionally does not include Ingredient explanation AI API, safety-classifier integration, admin ingredient management, seed scripts, or medical diagnosis.
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
TASK AI-004 - Align AI provider output contract/mapping before any provider-backed Routine Analysis wiring. Do not begin Ingredient Explanation, Product submission, admin product management, Journal, skin score, image upload, or medical diagnosis without a new task.
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
