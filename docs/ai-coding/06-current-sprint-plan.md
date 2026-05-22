# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

## 1. Current sprint

```txt
TASK AI-006 - Add Provider Failure Observability for Routine Analysis
```

## 2. Sprint goal

Classify Routine Analysis provider-path failures into safe internal reason codes, persist the optional internal failure reason when provider fallback is used, and keep the public RoutineAnalysisDto response unchanged.

## 3. Completed before this sprint

```txt
TASK AI-001 - AI Provider Abstraction completed
TASK AI-002 - Structured Output Validation completed
TASK AI-003 - Provider Flow Validation completed
TASK AI-004 - Provider-to-product Routine Analysis Contract Mapping completed
TASK AI-005 - Provider-backed Routine Analysis with safe deterministic fallback completed
```

TASK AI-005 already routes Routine Analysis through `getAIProvider().analyzeRoutine()`, relies on `ValidatedAIProvider`, maps provider output through the provider-to-product mapper, applies the deterministic max-risk safety guard, and falls back to deterministic output when provider construction, call, validation, mapping, or guard logic fails.

## 4. Completed this sprint

```txt
[x] TASK AI-006 - Add Provider Failure Observability for Routine Analysis completed.
[x] Provider-path errors are classified by `classifyRoutineAnalysisProviderFailure()`.
[x] `AIProviderConfigurationError` maps to `provider_configuration_error`.
[x] `AIProviderResponseError` maps to `provider_response_error`.
[x] Explicit `RoutineAnalysisProviderMappingError` maps to `provider_mapping_error`.
[x] Unknown errors and non-Error thrown values map to `provider_unexpected_error`.
[x] Fallback persists optional internal `providerFailureReason`.
[x] Provider success does not persist `providerFailureReason`.
[x] Missing/not-owned routines do not call provider code or persist failure metadata.
[x] Repository/database persistence errors still propagate and are not classified as provider failures.
[x] Public RoutineAnalysisDto shape is unchanged.
[x] Raw provider errors, stack traces, provider metadata, educational notes, and provider failure reason are not exposed publicly.
[x] No external AI provider was called.
[x] No OpenAI implementation was added.
[x] No Gemini implementation was added.
[x] No dependency was added.
[x] UI was not changed.
[x] Database schema was not changed.
[x] No migration was created.
[x] Routine Safety Engine remains active.
[x] Deterministic fallback remains active.
[x] npm run typecheck passed.
[x] npm run lint passed.
[x] npm run test passed - 48 files, 472 tests.
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
UI or client component changes
Database schema changes
Migrations
Prisma schema changes
Ingredient Explanation API implementation
Routine Safety Engine changes
MockAIProvider output shape changes
ValidatedAIProvider removal or weakening
Raw provider error exposure
Stack trace exposure
providerMetadata exposure
educationalNotes exposure
providerFailureReason exposure in public APIs
Product UI pages
Product submission
Admin product management
SkinJournal
Image upload
Skin score
Medical diagnosis or medical recommendation features
Advanced dashboard analytics or charts
```

## 6. Known follow-up

```txt
OpenAI and Gemini providers remain intentionally unsupported and throw configuration errors.
Current provider-backed Routine Analysis uses the validated mock provider unless configuration selects an unsupported provider.
Provider failures now persist safe internal failure reason codes when deterministic fallback is used.
Repository persistence errors still propagate.
Ingredient explanation and safety-classifier use-case integration remain future work.
```

## 7. Recommended next task

```txt
TASK AI-007 - Implement Ingredient Explanation API using Validated AI Provider with Safe Fallback
```
