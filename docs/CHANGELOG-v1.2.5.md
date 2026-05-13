# SkinWise VN SDD v1.2.5 — Consistency Hotfix before Week 1 Implementation

Date: 2026-05-13

## Summary

v1.2.5 is a consistency hotfix on top of v1.2.4.

It does **not** add new MVP product features, does **not** change the product positioning, and does **not** change the architecture.

The purpose is to remove ambiguity before Week 1 implementation so AI coding assistants can follow the Source of Truth without generating incorrect auth routes, inconsistent error codes, out-of-scope roles, or MVP image-upload behavior.

## Fixed

### Auth.js route ownership

- Clarified that Auth.js owns `/api/auth/*` routes and their internal response format.
- Removed the custom SkinWise-style documentation for `GET /api/auth/session`.
- Added app-specific `GET /api/me` for current user data.
- Defined `GET /api/me` response with `id`, `email`, `name`, `role`, and `onboardingCompleted`.

### Error-code consistency

- Standardized missing-auth errors on `UNAUTHORIZED`.
- Replaced `UNAUTHENTICATED` in the use-case/repository error contract.
- Clarified that `AI_PROVIDER_FAILED` and `AI_OUTPUT_INVALID` are service-level AI codes or safe AI endpoint codes.

### Data model consistency

- Confirmed `Product` uses a single `brand` field.
- Standardized MVP role enum to `USER | ADMIN`.
- Marked `CONTENT_REVIEWER` as post-MVP.
- Marked SkinJournal image fields as reserved future fields only.
- Clarified that image fields must not be exposed in MVP SkinJournal API request/response and must not trigger image upload/storage/analysis implementation.

### Week 1 Auth.js setup guidance

- Split package install guidance into:
  - `npm install zod mongodb @auth/mongodb-adapter`
  - `npm install next-auth@beta`
- Added instruction to use the current official Auth.js / NextAuth v5-compatible command at implementation time.
- Clarified that NextAuth v4 conventions should not be used unless the SDD is explicitly revised.
- Clarified `AUTH_*` variable usage and `AUTH_SECRET` importance.
- Clarified MongoDB Adapter requires an already-connected MongoClient.

### SkinJournal PATCH contract

- Added request body for `PATCH /api/skin-journal/:id`.
- Clarified `localDate` cannot be changed through PATCH in MVP.
- Clarified users must create a separate entry for a different date.
- Clarified future image fields must not be accepted in MVP request bodies.

### Test plan

Added v1.2.5 consistency tests for:

- `GET /api/me`;
- Auth.js-owned `/api/auth/*` routes;
- `UNAUTHORIZED` error-code consistency;
- Product `brand` field uniqueness;
- MVP role enum;
- SkinJournal reserved image fields;
- PATCH `/api/skin-journal/:id` rejecting `localDate` changes.

## Updated files

```txt
AGENTS.md
README.md
docs/00-source-of-truth.md
docs/04-data-model.md
docs/05-api-contract.md
docs/08-test-plan.md
docs/12-week-1-implementation-plan.md
docs/15-use-case-and-repository-contract.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/05-ai-change-log.md
docs/source-notes.md
```

## Unchanged

The following remain unchanged:

- no medical diagnosis;
- no treatment guarantees;
- no skin score;
- no AI face analysis;
- no marketplace;
- no affiliate monetization;
- no push notifications in MVP;
- no image upload/image analysis in MVP;
- rule engine runs before AI;
- RoutineLog and SkinJournal remain separate;
- `POST /api/routines/:id/analyze` remains the canonical routine analysis endpoint;
- Week 1 remains Foundation Setup.

## Freeze guidance

After v1.2.5, the SDD can be treated as frozen for Week 1 implementation.

Before coding, read:

```txt
AGENTS.md
docs/00-source-of-truth.md
docs/12-week-1-implementation-plan.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/06-current-sprint-plan.md
```

After coding, update:

```txt
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
```
