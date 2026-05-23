# 00-source-of-truth.md

# SkinWise VN Source of Truth — MVP v1.2.6

## 1. Purpose

This document defines which files are authoritative for SkinWise VN and how AI coding assistants should resolve conflicts.

The goal is to prevent random implementation decisions, duplicate logic, scope creep, and AI-generated code that violates the SDD.

## 2. Version meaning

MVP v1.2.6 is the final SDD freeze before Week 1 implementation.

It does **not** add new product features beyond v1.2.5. It preserves the v1.2.4 AI coding governance layer, the v1.2.5 consistency hotfix, and adds final engineering execution guardrails:

- Engineering Execution Checklist;
- ADR records for major architecture decisions;
- PR checklist;
- CI template;
- API DTO boundary rules;
- `/api/me` lazy AppUserProfile creation decision;
- repeatable database index script rule;
- feature flag guidance;
- structured logging guidance;
- Week 1 Task 1 prompt.

## 3. Source of Truth priority

When documents, code, or prompts disagree, use this priority order:

1. Higher-level safety/platform rules.
2. Explicit current user instruction that asks to revise the SDD or product scope.
3. `AGENTS.md`.
4. `docs/00-source-of-truth.md`.
5. Core SDD documents.
6. Implementation readiness documents.
7. AI coding context pack.
8. Existing code.
9. Normal implementation task.

A normal implementation task does not override the SDD.
Only an explicit SDD/scope revision request can change source-of-truth documents.

## 4. Canonical product scope

The canonical product scope is defined by:

```txt
docs/00-product-vision.md
docs/01-prd.md
docs/02-user-stories.md
docs/06-ai-contract.md
docs/11-routine-safety-rules.md
```

## 5. Canonical architecture

The canonical architecture is defined by:

```txt
docs/03-system-architecture.md
docs/10-project-structure.md
docs/15-use-case-and-repository-contract.md
docs/19-engineering-execution-checklist.md
docs/adr/*.md
```

Runtime-stabilization ADRs currently include Auth.js JWT session strategy with MongoDB Adapter and the local Node DNS preload for MongoDB Atlas SRV lookup.

## 6. Canonical data and API contracts

The canonical data and API behavior is defined by:

```txt
docs/04-data-model.md
docs/05-api-contract.md
docs/14-seed-data-spec.md
docs/16-ai-fallback-policy.md
docs/19-engineering-execution-checklist.md
```

## 7. Canonical implementation state

The current implementation state is defined by:

```txt
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/20-week-1-task-1-prompt.md
docs/21-local-auth-db-troubleshooting.md
```

These files must be updated as implementation progresses.

## 8. Conflict resolution rules

### If code is missing a feature defined in SDD

Do not invent a new design. Implement the smallest version that matches the relevant SDD documents.

### If code has a feature excluded by SDD

Do not expand it. Mark it as out of scope and ask whether to remove, disable, or document it.

### If an API route differs from `docs/05-api-contract.md`

Prefer the API contract unless the user explicitly asks to revise the contract.

### If a data model differs from `docs/04-data-model.md`

Prefer the data model document. If migration is required, document the mismatch before changing code.

### If the user asks to add a new feature

First classify it as:

```txt
MVP scope
Post-MVP scope
Rejected because unsafe or inappropriate
```

Do not implement post-MVP features inside Week 1 foundation.

## 9. Hard no-list for MVP

Do not implement these unless the SDD is deliberately changed:

```txt
marketplace
affiliate monetization
barcode scanner
AI face analysis
skin score
face score
attractiveness score
medical diagnosis
dermatologist booking
community feed
push notifications
subscription/payment
public product API
public ingredient API
image upload
image analysis
```

## 10. Required AI coding behavior

For every implementation task:

1. Read source-of-truth files.
2. Read current implementation status.
3. Identify affected files.
4. Keep task boundaries small.
5. Update status docs after code changes.
6. Add tests when logic, validation, security, or AI behavior changes.
7. Use DTO mappers for API responses.
8. Run CI checks when available.

## 11. Definition of source-of-truth compliance

An implementation is compliant when:

- it does not add out-of-scope features;
- it uses the folder structure from `docs/10-project-structure.md`;
- it follows API routes from `docs/05-api-contract.md`;
- it follows database models from `docs/04-data-model.md`;
- it keeps rule engine before AI;
- it validates AI output before saving;
- it enforces authentication and ownership checks;
- it updates implementation status files;
- it uses DTO mappers and does not leak raw ObjectIds to client code;
- it keeps database indexes repeatable through `npm run db:indexes`;
- it records major architecture decisions in `docs/adr/`.
