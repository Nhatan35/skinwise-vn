# 15-use-case-and-repository-contract.md

# Use Case and Repository Contract — MVP v1.2.6

## 1. Purpose

This document defines how application logic should be organized so AI coding assistants do not put business logic in pages, route handlers, or random utility files.

## 2. Layering rule

```txt
UI / Page
  -> API Route Handler
    -> Use Case
      -> Repository / Domain Service
        -> Database / External Provider
```

Route handlers are thin. Use cases own workflow. Repositories own persistence. Domain services own deterministic rules.

## 3. Common use case shape

Recommended pattern:

```ts
type UseCase<I, O> = {
  execute(input: I): Promise<O>;
};
```

Use cases may also be exported as functions when simpler, but they must remain centralized and testable.

## 4. Repository rules

Repositories must:

- never trust `userId` from request body;
- receive `currentUserId` from authenticated context;
- enforce user-owned query patterns where relevant;
- hide raw database details from route handlers;
- return typed domain/DTO objects;
- avoid leaking MongoDB internals to UI.


## 4.1 DTO mapper rules

Use mappers to convert database/domain records into API-safe DTOs.

Required conversions:

```txt
ObjectId -> string
_id -> id
Date -> ISO string
future/private fields -> omitted
```

Route handlers should return DTOs, not database documents.

## 5. Auth contract

```ts
type CurrentUser = {
  id: string;
  email?: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  onboardingCompleted?: boolean;
};

interface AuthService {
  getCurrentUser(): Promise<CurrentUser | null>;
  requireCurrentUser(): Promise<CurrentUser>;
  requireAdmin(): Promise<CurrentUser>;
  ensureAppUserProfile(authUserId: string): Promise<{
    role: 'USER' | 'ADMIN';
    onboardingCompleted: boolean;
  }>;
}
```

### `/api/me` application-user behavior

`GET /api/me` must lazily create `AppUserProfile` when the authenticated Auth.js user exists but the app profile is missing.

Default app profile:

```txt
role = USER
onboardingCompleted = false
```

Do not return `NOT_FOUND` for first-login AppUserProfile absence in MVP.

## 6. SkinProfile repository contract

```ts
interface SkinProfileRepository {
  findByUserId(userId: string): Promise<SkinProfile | null>;
  createForUser(userId: string, input: CreateSkinProfileInput): Promise<SkinProfile>;
  updateByUserId(userId: string, input: UpdateSkinProfileInput): Promise<SkinProfile>;
}
```

Rules:

- one active skin profile per user;
- never accept `userId` from client body;
- use authenticated user context.

## 7. Product repository contract

```ts
interface ProductRepository {
  listVisibleToUser(userId: string, filter: ProductFilter): Promise<Product[]>;
  findVisibleById(productId: string, userId: string): Promise<Product | null>;
  createUserSubmission(userId: string, input: CreateProductInput): Promise<Product>;
}
```

Visibility rules:

- verified/reviewed products are visible to authenticated users;
- unverified products are visible only to the submitting user when allowed;
- normal users cannot set `source` or `verificationStatus`.

## 8. Ingredient repository contract

```ts
interface IngredientRepository {
  search(input: IngredientSearchInput): Promise<Ingredient[]>;
  findById(ingredientId: string): Promise<Ingredient | null>;
}
```

Ingredient rules:

- no product visibility logic;
- no `includeMine` logic;
- no created-by-user ownership behavior in MVP.

## 9. Routine repository contract

```ts
interface RoutineRepository {
  create(userId: string, input: CreateRoutineInput): Promise<Routine>;
  listByUserId(userId: string): Promise<Routine[]>;
  findByIdAndUserId(routineId: string, userId: string): Promise<Routine | null>;
  updateByIdAndUserId(routineId: string, userId: string, input: UpdateRoutineInput): Promise<Routine>;
  deleteByIdAndUserId(routineId: string, userId: string): Promise<void>;
}
```

Rules:

- never query routine by id alone;
- always include `userId` ownership check;
- routine steps should preserve product snapshots when possible.

## 10. AnalyzeRoutineUseCase contract

```ts
type AnalyzeRoutineInput = {
  routineId: string;
  currentUserId: string;
  locale?: 'vi-VN';
};

type AnalyzeRoutineOutput = {
  analysisId: string;
  routineId: string;
  riskLevel: 'low' | 'medium' | 'high';
  triggeredWarnings: RuleResult[];
  explanationVi: string;
  disclaimerVi: string;
  aiStatus: 'completed' | 'fallback_used';
};
```

Required workflow:

```txt
1. Load routine by routineId + currentUserId.
2. If missing, return NOT_FOUND.
3. Build routine snapshot.
4. Run RoutineSafetyEngine.
5. Derive riskLevel from rule results.
6. Call AI explanation only after deterministic rule engine.
7. Validate AI JSON output.
8. If AI fails, follow docs/16-ai-fallback-policy.md.
9. Store RoutineAnalysis.
10. Return user-facing result with triggered warnings only.
```

## 11. RoutineLog repository contract

```ts
interface RoutineLogRepository {
  upsertDailyLog(userId: string, routineId: string, localDate: string, input: UpsertRoutineLogInput): Promise<RoutineLog>;
  listByDateRange(userId: string, input: RoutineLogDateRangeInput): Promise<RoutineLog[]>;
}
```

Required behavior:

```txt
same userId + routineId + localDate = update existing log, not duplicate
```

## 12. SkinJournal repository contract

```ts
interface SkinJournalRepository {
  createDailyEntry(userId: string, input: CreateSkinJournalInput): Promise<SkinJournal>;
  listByDateRange(userId: string, input: SkinJournalDateRangeInput): Promise<SkinJournal[]>;
  findByIdAndUserId(entryId: string, userId: string): Promise<SkinJournal | null>;
  updateByIdAndUserId(entryId: string, userId: string, input: UpdateSkinJournalInput): Promise<SkinJournal>;
}
```

Required behavior:

```txt
same userId + localDate = CONFLICT, not duplicate
```

## 13. AI provider contract

```ts
interface AIProvider {
  generateStructured<TOutput>(input: {
    promptVersion: string;
    systemPrompt: string;
    userPayload: unknown;
    outputSchemaName: string;
  }): Promise<{
    output: TOutput;
    modelProvider: string;
    modelName: string;
    rawText?: string;
  }>;
}
```

Rules:

- server-only;
- no client calls;
- schema validate output;
- never trust user prompt as instruction;
- store model and prompt metadata.

## 14. Error contract

Use consistent error codes:

```txt
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
CONFLICT
RATE_LIMITED
AI_PROVIDER_FAILED
AI_OUTPUT_INVALID
INTERNAL_ERROR
```

Route handlers should map errors to consistent HTTP responses.

`AI_PROVIDER_FAILED` and `AI_OUTPUT_INVALID` are service-level AI error codes. They may be mapped to `INTERNAL_ERROR` for generic app endpoints, or returned by AI-specific endpoints only when doing so is safe and does not expose secrets, provider internals, or sensitive user input.
