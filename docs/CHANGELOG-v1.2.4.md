# CHANGELOG-v1.2.4.md

# SkinWise VN SDD v1.2.4 — AI Coding Source of Truth Addendum

Date: 2026-05-13

## Summary

v1.2.4 updates the SDD package to help AI coding assistants understand the project source of truth, current implementation status, codebase structure, file ownership, sprint scope, and post-change documentation workflow.

This version does **not** add new MVP product features.

## Added

### Source of Truth

- Added `docs/00-source-of-truth.md`.
- Defined conflict resolution hierarchy.
- Clarified that normal implementation prompts do not override the SDD.

### Week 1 Implementation Readiness

- Added `docs/12-week-1-implementation-plan.md`.
- Added concrete Week 1 checklist.
- Added allowed/not-allowed Week 1 boundaries.
- Added expected foundation files.

### UI Route Map

- Added `docs/13-ui-route-map.md`.
- Mapped public and protected routes.
- Clarified Week 1 should only create landing/login/dashboard foundation.

### Seed Data Spec

- Added `docs/14-seed-data-spec.md`.
- Defined minimum ingredient and product seed requirements.
- Added safe seed data rules.

### Use Case and Repository Contract

- Added `docs/15-use-case-and-repository-contract.md`.
- Defined repository and use case boundaries.
- Added contracts for SkinProfile, Product, Ingredient, Routine, RoutineLog, SkinJournal, AI provider, and AnalyzeRoutineUseCase.

### AI Fallback Policy

- Added `docs/16-ai-fallback-policy.md`.
- Clarified behavior when AI fails after deterministic rule engine succeeds.
- Added fallback behavior for routine analysis, ingredient explanation, and safety classifier.

### Vietnamese Copy Guidelines

- Added `docs/17-vietnamese-copy-and-ui-guidelines.md`.
- Added safe Vietnamese UI copy examples.
- Added wording to avoid medical claims and appearance pressure.

### Deployment Checklist

- Added `docs/18-deployment-checklist.md`.
- Added production readiness checks for env, database, auth, AI safety, privacy, UI, and demo deployment.

### AI Coding Context Pack

Added:

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

### Environment Example

- Added `.env.example`.
- Clarified `AUTH_*` convention.
- Marked Cloudinary variables as optional/future only.

## Updated

- Updated `AGENTS.md` with stronger AI coding workflow and source-of-truth priority.
- Updated `README.md` to v1.2.4 and added the new documentation map.
- Clarified notifications are reserved for future and excluded from MVP implementation.
- Clarified image upload/storage is future scope and not part of Week 1.

## Unchanged

The following remain unchanged in product scope:

- no medical diagnosis;
- no treatment guarantees;
- no skin score;
- no AI face analysis;
- no marketplace;
- no affiliate monetization;
- no push notifications in MVP;
- rule engine runs before AI;
- RoutineLog and SkinJournal remain separate;
- `POST /api/routines/:id/analyze` remains the canonical routine analysis endpoint.

## Upgrade guidance from v1.2.3

Use v1.2.4 as the current source of truth for starting Week 1 implementation.

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
