# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

## 1. Current sprint

```txt
TASK AI-004 - Align AI provider output contract/mapping before any provider-backed Routine Analysis wiring
```

## 2. Sprint goal

Add an explicit mapping boundary between validated provider-level routine analysis output and product-facing `RoutineAnalysisResult`, while keeping Routine Analysis API behavior deterministic fallback only and avoiding provider wiring, external AI calls, UI changes, and database changes.

## 3. Completed before this sprint

```txt
TASK AI-001 - AI Provider Abstraction completed
TASK AI-002 - Structured Output Validation completed
TASK AI-003 - Provider Flow Validation completed
```

TASK AI-001 implemented the server-only AI Provider Abstraction with `MockAIProvider`, `getAIProvider()`, and provider error classes. TASK AI-002 added strict Zod structured output schemas and validator functions for current `AIProvider` outputs. TASK AI-003 wrapped successfully constructed providers with `ValidatedAIProvider`. OpenAI and Gemini providers remain intentionally unimplemented.

## 4. Allowed tasks this sprint

```txt
Add provider-to-product Routine Analysis mapper
Map AIProviderRoutineAnalysisResult into RoutineAnalysisResult
Move the existing Routine Analysis disclaimer to a shared constants file
Keep deterministic fallback behavior unchanged
Do not wire AIProvider into analyze-routine.use-case.ts
Document the provider validation and mapping boundary
Add focused unit tests for mapping behavior and metadata isolation
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
Routine Analysis API wiring or behavior changes
Ingredient Explanation API implementation
UI or client component changes
Database schema changes
Migrations
Routine Safety Engine changes
MockAIProvider output shape changes
Validation logic inside MockAIProvider
ValidatedAIProvider removal or weakening
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
[x] TASK AI-004 - Align AI provider output contract/mapping before provider-backed Routine Analysis wiring is completed.
[x] src/modules/ai-analysis/ai-provider-routine-analysis.mapper.ts exists.
[x] src/modules/ai-analysis/routine-analysis.constants.ts exists.
[x] mapAIProviderRoutineAnalysisToRoutineAnalysisResult maps AIProviderRoutineAnalysisResult to RoutineAnalysisResult.
[x] provider.overallRiskLevel maps to result.riskLevel.
[x] provider.summary maps to result.summary.
[x] provider.warnings map to structured RoutineAnalysisWarning objects.
[x] provider.recommendations map to structured RoutineAnalysisSuggestion objects.
[x] suggestion priority is deterministic from risk level.
[x] shouldSeeProfessional is true only for high risk.
[x] providerMetadata is not exposed.
[x] educationalNotes are not exposed.
[x] The existing disclaimer text is shared through routine-analysis.constants.ts.
[x] analyze-routine.use-case.ts imports the shared disclaimer only.
[x] Deterministic fallback behavior is unchanged.
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
[x] Routine Analysis API behavior was not changed.
[x] MockAIProvider output shape was not changed.
[x] npm run typecheck passed.
[x] npm run lint passed.
[x] npm run test passed - 47 files, 456 tests.
```

## 7. Known follow-up

```txt
docs/06-ai-contract.md differs from src/infrastructure/ai/ai-provider.ts.
TASK AI-002 and TASK AI-003 intentionally validate the current ai-provider.ts output shape exactly.
TASK AI-004 adds explicit routine analysis mapping for riskLevel vs overallRiskLevel and suggestions vs recommendations before provider-backed Routine Analysis wiring.
Ingredient explanation and safety-classifier contract alignment remain future work.
```

## 8. Recommended next task

```txt
TASK AI-005 - Wire Validated AI Provider into Routine Analysis Use Case with Safe Fallback
```
