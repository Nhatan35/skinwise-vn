# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

## 1. Current sprint

```txt
TASK AI-002 - Structured Output Validation
```

## 2. Sprint goal

Add strict, testable Zod validation for the current `AIProvider` structured output types from `src/infrastructure/ai/ai-provider.ts` without changing provider output shape, calling external AI APIs, adding keys, changing UI, or wiring validation into application flows yet.

## 3. Completed before this sprint

```txt
TASK AI-001 - AI Provider Abstraction completed
```

TASK AI-001 implemented the server-only AI Provider Abstraction with `MockAIProvider`, `getAIProvider()`, and provider error classes. OpenAI and Gemini providers remain intentionally unimplemented.

## 4. Allowed tasks this sprint

```txt
Add strict Zod schemas for current AIProvider output types
Add validators for routine analysis, ingredient explanation, and safety classifier outputs
Throw AIProviderResponseError for invalid AI output
Export schemas and validators from src/infrastructure/ai/index.ts
Add focused unit tests for valid output, invalid output, and MockAIProvider compatibility
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
Routine Safety Engine changes
MockAIProvider output shape changes
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
[x] TASK AI-002 - Structured Output Validation is completed.
[x] src/infrastructure/ai/ai-output.schema.ts exports aiProviderMetadataSchema.
[x] src/infrastructure/ai/ai-output.schema.ts exports aiProviderRoutineAnalysisResultSchema.
[x] src/infrastructure/ai/ai-output.schema.ts exports aiProviderIngredientExplanationResultSchema.
[x] src/infrastructure/ai/ai-output.schema.ts exports aiProviderSafetyClassifierResultSchema.
[x] All AI output object schemas use strict Zod validation and reject unknown fields.
[x] AIProviderMetadata.generatedAt is validated as an ISO datetime string.
[x] src/infrastructure/ai/ai-output.validator.ts exports validateRoutineAnalysisOutput.
[x] src/infrastructure/ai/ai-output.validator.ts exports validateIngredientExplanationOutput.
[x] src/infrastructure/ai/ai-output.validator.ts exports validateSafetyClassifierOutput.
[x] Invalid AI output throws AIProviderResponseError with a short Zod issue summary.
[x] tests/unit/ai-output-validation.test.ts covers valid output, missing required fields, invalid enum values, maxLength violations, maxItems violations, unknown extra fields, invalid providerMetadata, error behavior, and MockAIProvider compatibility.
[x] src/infrastructure/ai/index.ts exports the new schemas and validators.
[x] No external AI provider was called.
[x] No OpenAI call was added.
[x] No Gemini call was added.
[x] No API key was added.
[x] No new dependency was added.
[x] UI was not changed.
[x] Database schema was not changed.
[x] OpenAI provider was not implemented.
[x] Gemini provider was not implemented.
[x] Ingredient Explanation API was not implemented.
[x] AI Provider validation was not wired into Routine Analysis API in this task.
[x] MockAIProvider output shape was not changed.
[x] npm run typecheck passed.
[x] npm run lint passed.
[x] npm run test passed - 45 files, 436 tests.
```

## 7. Known follow-up

```txt
docs/06-ai-contract.md differs from src/infrastructure/ai/ai-provider.ts.
TASK AI-002 intentionally validates the current ai-provider.ts output shape exactly.
It does not reconcile riskLevel vs overallRiskLevel, suggestions vs recommendations, simpleExplanation vs shortExplanation, shouldBlockAIAnswer vs isAllowed, or docs schemas missing providerMetadata.
```

## 8. Recommended next task

```txt
TASK AI-003 - Integrate AI Output Validation into Provider Flow
```
