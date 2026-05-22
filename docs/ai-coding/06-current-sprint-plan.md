# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

## 1. Current sprint

```txt
TASK AI-005 - Wire Validated AI Provider into Routine Analysis Use Case with Safe Fallback
```

## 2. Sprint goal

Use the existing validated AI provider flow and AI-004 mapper inside `analyzeRoutineForCurrentUser()` while preserving deterministic Routine Safety Engine guidance, applying a max-risk safety guard, and falling back to deterministic output when provider construction, calls, validation, mapping, or guard logic fails.

## 3. Completed before this sprint

```txt
TASK AI-001 - AI Provider Abstraction completed
TASK AI-002 - Structured Output Validation completed
TASK AI-003 - Provider Flow Validation completed
TASK AI-004 - Provider-to-product Routine Analysis Contract Mapping completed
```

TASK AI-001 implemented the server-only AI Provider Abstraction with `MockAIProvider`, `getAIProvider()`, and provider error classes. TASK AI-002 added strict Zod structured output schemas and validator functions for current `AIProvider` outputs. TASK AI-003 wrapped successfully constructed providers with `ValidatedAIProvider`. TASK AI-004 added the explicit provider-to-product Routine Analysis mapper. OpenAI and Gemini providers remain intentionally unimplemented.

## 4. Allowed tasks this sprint

```txt
Wire `getAIProvider().analyzeRoutine()` into `analyzeRoutineForCurrentUser()`
Use `ValidatedAIProvider` output validation through the provider factory
Use `mapAIProviderRoutineAnalysisToRoutineAnalysisResult()`
Apply deterministic safety guard with `max(safety risk, provider risk)`
Persist provider success as `aiStatus = "provider_used"`
Persist provider failures as `aiStatus = "fallback_used"`
Preserve deterministic rule warnings and suggestions on provider success
Keep public RoutineAnalysisDto shape unchanged
Add focused unit tests for success, fallback, safety guard, metadata isolation, and persistence error behavior
Update AI coding context docs
Run npm run typecheck, npm run lint, and npm run test
```

## 5. Not allowed this sprint

```txt
External AI API calls
OpenAI calls
Gemini calls
Real OpenAI provider implementation
Real Gemini provider implementation
AI key requirements
New dependencies
Public RoutineAnalysisDto shape changes
Ingredient Explanation API implementation
UI or client component changes
Database schema changes
Migrations
Routine Safety Engine changes
MockAIProvider output shape changes
Validation logic inside MockAIProvider
ValidatedAIProvider removal or weakening
Direct calls to validateRoutineAnalysisOutput() from the use case
Direct MockAIProvider instantiation from the use case
Product UI pages
Product submission
Admin product management
SkinJournal
Image upload
Skin score
Medical diagnosis or medical recommendation features
Advanced dashboard analytics or charts
```

## 6. Sprint Definition of Done

```txt
[x] TASK AI-005 - Wire Validated AI Provider into Routine Analysis Use Case with Safe Fallback is completed.
[x] `analyzeRoutineForCurrentUser()` obtains providers through `getAIProvider()`.
[x] Provider routine analysis output is validated by `ValidatedAIProvider`.
[x] Provider output is mapped through `mapAIProviderRoutineAnalysisToRoutineAnalysisResult()`.
[x] Provider success persists `aiStatus = "provider_used"`.
[x] Provider success persists `promptVersion = "routine-analysis-provider-v1"`.
[x] Fallback persists `aiStatus = "fallback_used"` with existing deterministic metadata.
[x] Final stored `riskLevel` is `max(safetyResult.riskLevel, mappedProviderResult.riskLevel)`.
[x] Persisted `aiResult.riskLevel` uses the same safety-guarded final risk.
[x] Deterministic rule warnings and suggestions remain in provider-backed `aiResult`.
[x] Provider warnings and suggestions are appended as educational guidance without simple exact duplicates.
[x] Provider metadata is not exposed in persisted `aiResult` or returned DTO.
[x] Raw provider errors are not exposed in persisted `aiResult` or returned DTO.
[x] Repository persistence errors are not swallowed as provider fallback.
[x] Public RoutineAnalysisDto shape is unchanged.
[x] No external AI provider was called.
[x] No OpenAI call was added.
[x] No Gemini call was added.
[x] No API key was added.
[x] No new dependency was added.
[x] UI was not changed.
[x] Database schema was not changed.
[x] No migration was created.
[x] OpenAI provider was not implemented.
[x] Gemini provider was not implemented.
[x] Ingredient Explanation API was not implemented.
[x] MockAIProvider output shape was not changed.
[x] npm run typecheck passed.
[x] npm run lint passed.
[x] npm run test passed - 47 files, 465 tests.
```

## 7. Known follow-up

```txt
OpenAI and Gemini providers remain intentionally unsupported and throw configuration errors.
Current provider-backed Routine Analysis uses the validated mock provider unless configuration selects an unsupported provider.
Provider failures fall back to deterministic Routine Safety Engine output, but repository persistence errors still propagate.
Ingredient explanation and safety-classifier use-case integration remain future work.
```

## 8. Recommended next task

```txt
Continue only with the next explicitly scoped task after TASK AI-005 review. Do not start AI-006 without a new task.
```
