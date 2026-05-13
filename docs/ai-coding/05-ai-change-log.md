# 05-ai-change-log.md

# AI Change Log — SkinWise VN MVP v1.2.6

This file records AI-assisted changes so future coding sessions understand what changed and why.


## 2026-05-13 — v1.2.6 final freeze and engineering execution guardrails

### Task

Finalize the SDD before Week 1 implementation by adding engineering execution guardrails.

### Files Added

```txt
docs/19-engineering-execution-checklist.md
docs/20-week-1-task-1-prompt.md
docs/adr/0001-use-modular-monolith.md
docs/adr/0002-use-authjs-with-app-user-profile.md
docs/adr/0003-rule-engine-before-ai.md
docs/adr/0004-use-local-date-for-daily-tracking.md
docs/adr/0005-use-dto-mappers-for-api-boundaries.md
docs/adr/0006-use-repeatable-db-index-script.md
docs/CHANGELOG-v1.2.6.md
.github/pull_request_template.md
.github/workflows/ci.yml
```

### Files Updated

```txt
AGENTS.md
README.md
docs/00-source-of-truth.md
docs/04-data-model.md
docs/05-api-contract.md
docs/08-test-plan.md
docs/12-week-1-implementation-plan.md
docs/18-deployment-checklist.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/source-notes.md
```

### Reason

v1.2.5 was ready for implementation, but v1.2.6 adds final execution guardrails so AI-assisted coding can be controlled by ADRs, DTO boundary rules, index strategy, CI, PR checklist, feature flags, structured logging, and a precise Week 1 Task 1 prompt.

### Tests

No implementation tests were run because this package is documentation-only. The test plan now includes v1.2.6 execution guardrail test cases.

### Notes

- No product feature was added.
- MVP scope remains unchanged.
- Architecture remains modular monolith.
- Week 1 remains Foundation Setup.
- v1.2.6 is the final freeze before Week 1 implementation.

## 2026-05-13 — v1.2.5 consistency hotfix

### Task

Apply consistency hotfix before Week 1 implementation.

### Files Added

```txt
docs/CHANGELOG-v1.2.5.md
```

### Files Updated

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

### Reason

The v1.2.4 AI coding addendum was directionally correct but needed consistency fixes before code generation. The hotfix prevents AI coding assistants from misinterpreting Auth.js-owned routes, missing-auth error naming, MVP role scope, future image fields, package install guidance, and SkinJournal PATCH behavior.

### Tests

No implementation tests were run because this package is documentation-only. The test plan now includes v1.2.5 consistency hotfix test cases.

### Notes

- No product feature was added.
- MVP scope remains unchanged.
- Architecture remains modular monolith.
- Week 1 remains Foundation Setup.
- After v1.2.5, the SDD can be frozen for Week 1 implementation.

## 2026-05-13 — v1.2.4 documentation update

### Task

Create AI Coding Source of Truth Addendum for SkinWise VN.

### Files Added

```txt
.env.example
docs/00-source-of-truth.md
docs/12-week-1-implementation-plan.md
docs/13-ui-route-map.md
docs/14-seed-data-spec.md
docs/15-use-case-and-repository-contract.md
docs/16-ai-fallback-policy.md
docs/17-vietnamese-copy-and-ui-guidelines.md
docs/18-deployment-checklist.md
docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/CHANGELOG-v1.2.4.md
```

### Files Updated

```txt
AGENTS.md
README.md
docs/03-system-architecture.md
docs/10-project-structure.md
```

### Reason

The project needed a stronger mechanism for AI coding assistants to understand:

- the source of truth;
- current implementation status;
- project structure;
- file ownership;
- allowed sprint scope;
- forbidden MVP scope;
- post-code documentation updates.

### Scope impact

No new product feature was added.

v1.2.4 improves implementation readiness and AI coding governance only.

### Notes

- Notifications remain excluded from MVP implementation.
- Image upload remains future scope.
- Cloudinary/S3 variables are optional and future-facing.
- Rule engine must still run before AI.
- RoutineLog and SkinJournal remain separate.

## Template for future entries

```md
## YYYY-MM-DD — Task title

### Task

Short description.

### Files Added

- `path/to/file`

### Files Updated

- `path/to/file`

### Reason

Why this change was made.

### Tests

- Unit:
- Integration:
- E2E:

### Notes

Any known limitation or follow-up.
```


## 2026-05-13 — v1.2.6 Final Documentation Cleanup

### Task
Clean up final SDD documentation before Week 1 Task 1.

### Files Changed
- `docs/14-seed-data-spec.md`
- `README.md`
- `docs/09-release-plan.md`
- `docs/12-week-1-implementation-plan.md`
- `docs/source-notes.md`
- `docs/CHANGELOG-v1.2.6.md`

### Reason
Align seed data contracts with the canonical data model, update final-freeze wording, and clarify MongoDB Adapter client-sharing guidance.

### Notes
- No product feature added.
- No MVP scope change.
- No architecture change.
- Week 1 remains ready to start after this cleanup.
