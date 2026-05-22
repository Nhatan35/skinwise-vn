# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

## 1. Current sprint

```txt
TASK AI-003 - Integrate AI Output Validation into Provider Flow
```

## 2. Sprint goal

Integrate existing AI output validators into the provider flow by wrapping successfully constructed providers with `ValidatedAIProvider`, while keeping provider output shape unchanged and avoiding external AI calls, UI changes, database changes, and Routine Analysis API wiring.

## 3. Completed before this sprint

```txt
TASK AI-001 - AI Provider Abstraction completed
TASK AI-002 - Structured Output Validation completed
```

TASK AI-001 implemented the server-only AI Provider Abstraction with `MockAIProvider`, `getAIProvider()`, and provider error classes. TASK AI-002 added strict Zod structured output schemas and validator functions for current `AIProvider` outputs. OpenAI and Gemini providers remain intentionally unimplemented.

## 4. Allowed tasks this sprint

```txt
Add ValidatedAIProvider as an AIProvider wrapper/decorator
Call the inner provider once per method and validate returned output
Let AIProviderResponseError propagate from existing validators
Wrap successful getAIProvider() raw providers with ValidatedAIProvider
Export ValidatedAIProvider from src/infrastructure/ai/index.ts
Add focused unit tests for valid output, invalid output, factory wrapping, and MockAIProvider compatibility
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
Validation logic inside MockAIProvider
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
[x] TASK AI-003 - Integrate AI Output Validation into Provider Flow is completed.
[x] src/infrastructure/ai/validated-ai-provider.ts exists.
[x] ValidatedAIProvider implements AIProvider.
[x] ValidatedAIProvider accepts an inner AIProvider through its constructor.
[x] analyzeRoutine() validates output with validateRoutineAnalysisOutput().
[x] explainIngredient() validates output with validateIngredientExplanationOutput().
[x] classifySafety() validates output with validateSafetyClassifierOutput().
[x] Invalid provider output throws AIProviderResponseError from the existing validators.
[x] AIProviderResponseError is not swallowed or converted to a generic Error.
[x] getAIProvider() builds a raw provider first and wraps successful providers with ValidatedAIProvider.
[x] Missing, empty, or mock AI_PROVIDER returns ValidatedAIProvider around MockAIProvider.
[x] OpenAI and Gemini unsupported-provider behavior remains unchanged.
[x] src/infrastructure/ai/index.ts exports ValidatedAIProvider.
[x] tests/unit/validated-ai-provider.test.ts covers valid and invalid outputs for all provider methods.
[x] tests/unit/ai-provider.test.ts expects getAIProvider() to return ValidatedAIProvider in mock mode.
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
[x] Routine Analysis API behavior was not changed.
[x] MockAIProvider output shape was not changed.
[x] npm run typecheck passed.
[x] npm run lint passed.
[x] npm run test passed - 46 files, 444 tests.
```

## 7. Known follow-up

```txt
docs/06-ai-contract.md differs from src/infrastructure/ai/ai-provider.ts.
TASK AI-002 and TASK AI-003 intentionally validate the current ai-provider.ts output shape exactly.
It does not reconcile riskLevel vs overallRiskLevel, suggestions vs recommendations, simpleExplanation vs shortExplanation, shouldBlockAIAnswer vs isAllowed, or docs schemas missing providerMetadata.
```

## 8. Recommended next task

```txt
TASK AI-004 - Align AI provider output contract/mapping before any provider-backed Routine Analysis wiring
```
