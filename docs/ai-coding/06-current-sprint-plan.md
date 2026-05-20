# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-20

## 1. Current sprint

```txt
TASK AI-001 - AI Provider Abstraction
```

## 2. Sprint goal

Implement a clean, testable, server-only AI Provider Abstraction for future OpenAI/Gemini integration without calling external AI APIs, requiring AI keys, changing UI/client components, or changing existing routine safety logic.

## 3. Completed before this sprint

```txt
TASK DOC-001 - Documentation Consistency Cleanup after DB-001 completed
```

TASK DOC-001 synchronized documentation after DB-001 and set TASK AI-001 as the next recommended task.

## 4. Allowed tasks this sprint

```txt
Add src/infrastructure/ai/ai-provider.ts with the exact TASK AI-001 AIProvider contract
Add MockAIProvider only
Add AI provider error classes
Add getAIProvider() factory behavior for mock/openai/gemini/unsupported names
Add focused unit tests for factory and MockAIProvider behavior
Update AI coding context docs
Run npm run typecheck, npm run lint, and npm run test
```

## 5. Not allowed this sprint

```txt
External AI API calls
Real OpenAI provider implementation
Real Gemini provider implementation
AI key requirements
New dependencies
Routine Analysis API behavior changes
Ingredient Explanation API implementation
UI or client component changes
Routine Safety Engine changes
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
[x] src/infrastructure/ai/ai-provider.ts defines the exact TASK AI-001 AIProvider interface.
[x] src/infrastructure/ai/mock-ai-provider.ts implements deterministic MockAIProvider.
[x] src/infrastructure/ai/ai-provider.errors.ts defines AIProviderError, AIProviderConfigurationError, and AIProviderResponseError.
[x] src/infrastructure/ai/ai-provider.factory.ts defaults missing/empty/mock AI_PROVIDER values to MockAIProvider.
[x] src/infrastructure/ai/ai-provider.factory.ts throws configuration errors for openai, gemini, and unsupported providers.
[x] src/infrastructure/ai/index.ts re-exports provider types, MockAIProvider, factory, and error classes.
[x] tests/unit/ai-provider.test.ts covers factory and MockAIProvider behavior.
[x] No external AI API is called.
[x] No AI key is required.
[x] OpenAI provider is not implemented yet.
[x] Gemini provider is not implemented yet.
```

## 7. Recommended next task

```txt
TASK AI-002 — Structured Output Validation
```
