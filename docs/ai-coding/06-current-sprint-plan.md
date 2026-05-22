# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

## 1. Current sprint

```txt
TASK AI-007 - Implement Ingredient Explanation API using Validated AI Provider with Safe Fallback
```

## 2. Sprint goal

Add authenticated, rate-limited `POST /api/ingredients/explain` using the existing validated AI provider flow, map provider output into a stable public Ingredient Explanation DTO, and return deterministic safe fallback when provider or mapping behavior fails.

## 3. Completed before this sprint

```txt
TASK AI-001 - AI Provider Abstraction completed
TASK AI-002 - Structured Output Validation completed
TASK AI-003 - Provider Flow Validation completed
TASK AI-004 - Provider-to-product Routine Analysis Contract Mapping completed
TASK AI-005 - Provider-backed Routine Analysis with safe deterministic fallback completed
TASK AI-006 - Provider Failure Observability for Routine Analysis completed
```

TASK AI-006 already classifies Routine Analysis provider-path failures into safe internal reason codes and persists optional internal `providerFailureReason` only when provider fallback is used.

## 4. Completed this sprint

```txt
[x] TASK AI-007 - Implement Ingredient Explanation API using Validated AI Provider with Safe Fallback completed.
[x] `POST /api/ingredients/explain` added.
[x] Endpoint requires authentication.
[x] Endpoint validates strict JSON request input.
[x] Endpoint rate-limits with `ingredient_explanation:${userId}`.
[x] Ingredient Explanation use case calls `getAIProvider().explainIngredient()`.
[x] Provider output validation remains inside `ValidatedAIProvider`.
[x] Provider output maps to a stable public `IngredientExplanationDto`.
[x] Provider success returns `source = "ai"`.
[x] Provider construction/call/validation/mapping failure returns deterministic fallback with `source = "fallback"`.
[x] Invalid client input returns `VALIDATION_ERROR` and does not use fallback.
[x] Public response does not expose raw provider errors, stack traces, provider metadata, educational notes, provider failure reason, or internal provider details.
[x] Routine Analysis behavior is unchanged.
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
[x] npm run test passed - 50 files, 489 tests.
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
Ingredient Explanation currently uses the validated mock provider unless configuration selects an unsupported provider.
Ingredient Explanation does not persist explanations.
Safety-classifier use-case integration remains future work for broader/free-form high-risk ingredient explanation inputs.
```

## 7. Recommended next task

```txt
Continue only with the next explicitly scoped task after TASK AI-007 review.
```
