# 19-engineering-execution-checklist.md

# Engineering Execution Checklist — MVP v1.2.6 Final Freeze

## 1. Purpose

This checklist converts the SDD into implementation guardrails.

It does not add new product features. It defines how Week 1 and later implementation work should be executed so AI-assisted coding remains consistent, testable, secure, and extensible.

## 2. Final freeze rule

MVP v1.2.6 is the final SDD freeze before Week 1 implementation.

Allowed after this point:

- code implementation that follows the SDD;
- documentation updates that record implementation status;
- bug fixes that align code with the SDD;
- ADRs that record implementation decisions;
- tests, CI, scripts, and developer tooling.

Not allowed unless the SDD is explicitly revised:

- new product features;
- new database models outside `docs/04-data-model.md`;
- new public API routes outside `docs/05-api-contract.md`;
- client-side AI provider calls;
- image upload or image analysis;
- marketplace, affiliate, subscription, community, barcode scanner, skin score, or AI face analysis.

## 3. Week 1 execution rules

Week 1 must stay focused on foundation setup.

Before any code task, AI coding assistants must read:

```txt
AGENTS.md
docs/00-source-of-truth.md
docs/10-project-structure.md
docs/12-week-1-implementation-plan.md
docs/19-engineering-execution-checklist.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/06-current-sprint-plan.md
```

After every code task, update:

```txt
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
```

## 4. `/api/me` decision

`GET /api/me` must use lazy AppUserProfile creation.

Canonical behavior:

```txt
If the Auth.js user/session exists but AppUserProfile is missing:
- create AppUserProfile lazily;
- role = USER;
- onboardingCompleted = false;
- return { data: { user }, error: null }.
```

Do not return `NOT_FOUND` for first-login AppUserProfile absence in MVP.

Reason:

- first-login flow should not break;
- app-level user profile can be created deterministically;
- onboarding state can be tracked immediately after authentication.

## 5. API DTO boundary rule

MongoDB internals must not leak into API responses.

Canonical rule:

```txt
Database layer: ObjectId
Repository/domain layer: ObjectId or domain id wrapper
API DTO layer: string id
Client/UI layer: string id
```

Required:

- convert `_id` to `id: string`;
- convert foreign ObjectIds to string IDs;
- convert Date objects to ISO strings in API responses;
- never return raw MongoDB `ObjectId` objects to client code;
- never expose future-only SkinJournal image fields in MVP API request/response DTOs.

Recommended mapper files:

```txt
src/modules/skin-profile/skin-profile.mapper.ts
src/modules/products/product.mapper.ts
src/modules/ingredients/ingredient.mapper.ts
src/modules/routines/routine.mapper.ts
src/modules/routine-logs/routine-log.mapper.ts
src/modules/skin-journal/skin-journal.mapper.ts
src/modules/routine-analysis/routine-analysis.mapper.ts
```

## 6. Database index strategy

Indexes defined in `docs/04-data-model.md` must be created through a repeatable script.

Required script name:

```txt
npm run db:indexes
```

Recommended file:

```txt
src/infrastructure/database/ensure-indexes.ts
```

Minimum required indexes:

```txt
AppUserProfile: unique userId
SkinProfile: unique userId
RoutineLog: unique userId + routineId + localDate
SkinJournal: unique userId + localDate
Ingredient: unique inciName
Product: search/filter indexes defined in data model
Routine: userId + createdAt
RoutineAnalysis: userId + routineId + createdAt
```

Rules:

- index creation must be idempotent;
- unique indexes must match API conflict behavior;
- index failures must fail CI/deployment scripts visibly;
- do not create indexes ad hoc inside route handlers.

## 7. ADR requirement

Important architecture decisions must be recorded in `docs/adr/`.

Use ADRs for:

- framework and architecture choices;
- authentication strategy;
- database/index strategy;
- AI safety pipeline;
- local-date tracking;
- API boundary and DTO rules;
- future migrations that affect architecture.

Do not rewrite accepted ADRs silently. Supersede them with a new ADR if a decision changes.

## 8. Pull request checklist

Use `.github/pull_request_template.md`.

Every implementation PR/task must verify:

```txt
[ ] Scope matches current sprint.
[ ] No out-of-scope MVP feature was added.
[ ] No AI call from client code.
[ ] Route handlers stay thin.
[ ] Use cases contain orchestration logic.
[ ] Input is validated with Zod.
[ ] Auth and ownership checks are present where required.
[ ] API responses use DTOs and string IDs.
[ ] Tests were added or updated when logic changed.
[ ] Implementation status docs were updated.
```

## 9. CI requirements

The implementation repo should include `.github/workflows/ci.yml`.

Minimum CI commands:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
```

When E2E tests become stable:

```txt
npm run test:e2e
```

CI must run before merging or accepting a large AI-generated patch.

## 10. API contract tests

API contract tests must verify the behavior in `docs/05-api-contract.md`.

Minimum contract assertions:

```txt
response shape is always { data, error } for SkinWise-owned APIs
/api/auth/* is owned by Auth.js and is not wrapped
GET /api/me lazily creates AppUserProfile when missing
unauthenticated requests return UNAUTHORIZED
invalid requests return VALIDATION_ERROR
ownership failures return FORBIDDEN or NOT_FOUND according to endpoint policy
SkinJournal duplicate localDate returns CONFLICT
PATCH /api/skin-journal/:id cannot change localDate
RoutineLog upsert does not create duplicate logs
API DTOs never return raw ObjectId
SkinJournal MVP API does not expose imageUrl/imageStorageKey/imageVisibility
```

## 11. Feature flags

Use simple server-side feature flags for incomplete or future capabilities.

Recommended file:

```txt
src/config/features.ts
```

Recommended default values:

```ts
export const features = {
  aiRoutineAnalysis: process.env.FEATURE_AI_ROUTINE_ANALYSIS === "true",
  ingredientExplanation: process.env.FEATURE_INGREDIENT_EXPLANATION === "true",
  imageUpload: false,
  notifications: false,
  marketplace: false,
  skinScore: false,
} as const;
```

Rules:

- do not enable incomplete features in production;
- do not use feature flags to bypass SDD scope;
- `imageUpload`, `notifications`, `marketplace`, and `skinScore` remain false in MVP unless the SDD is explicitly revised.

## 12. Structured logging

Use minimal structured logs for server-side operations.

Recommended fields:

```txt
requestId
userIdHash or userId redacted
endpoint
method
statusCode
latencyMs
errorCode
module
operation
```

Rules:

- do not log secrets;
- do not log access tokens;
- do not log full AI prompts containing sensitive user data;
- do not log raw skin journal notes in production logs;
- log AI provider failures with safe metadata only.

## 13. Security execution rules

Required for protected APIs:

```txt
currentUserId comes from server session
never accept userId from request body for ownership
all user-owned reads include userId filter
all user-owned updates include userId filter
all user-owned deletes include userId filter
```

Required for AI endpoints:

```txt
rate limit before provider call
validate input before provider call
run deterministic safety/rule checks first when applicable
validate structured AI output before use
store AI metadata, not hidden chain-of-thought
```

## 14. Week 1 completion criteria

Week 1 is complete only when:

```txt
[ ] Next.js App Router project exists.
[ ] TypeScript is configured.
[ ] Tailwind CSS is configured.
[ ] shadcn/ui is initialized.
[ ] Base folder structure matches `docs/10-project-structure.md`.
[ ] `src/config/env.ts` validates required environment variables.
[ ] MongoDB reusable client helper exists.
[ ] Auth.js foundation exists.
[ ] `GET /api/me` behavior is decided and implemented as lazy AppUserProfile creation.
[ ] Protected dashboard shell exists.
[ ] Basic loading, error, and empty state patterns exist.
[ ] Vitest setup exists.
[ ] CI template exists or is copied into the repo.
[ ] Implementation status docs are updated.
```

## 15. Do not optimize prematurely

Do not add these before there is a concrete need:

```txt
microservices
RAG/vector database
queue/background job system
complex admin dashboard
payment/subscription system
marketplace infrastructure
image processing pipeline
mobile app
public API platform
```

These are post-MVP decisions and must be evaluated with a new ADR if introduced later.
