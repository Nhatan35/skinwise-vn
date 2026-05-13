# CHANGELOG-v1.2.6.md

# SkinWise VN SDD v1.2.6 — Final Freeze and Engineering Execution Guardrails

Date: 2026-05-13

## Summary

v1.2.6 is the final documentation freeze before Week 1 implementation.

This version does not add new MVP product features, does not change product positioning, and does not change the modular monolith architecture.

It adds engineering execution guardrails so AI-assisted implementation can proceed safely and consistently.

## Added

```txt
docs/19-engineering-execution-checklist.md
docs/20-week-1-task-1-prompt.md
docs/adr/0001-use-modular-monolith.md
docs/adr/0002-use-authjs-with-app-user-profile.md
docs/adr/0003-rule-engine-before-ai.md
docs/adr/0004-use-local-date-for-daily-tracking.md
docs/adr/0005-use-dto-mappers-for-api-boundaries.md
docs/adr/0006-use-repeatable-db-index-script.md
.github/pull_request_template.md
.github/workflows/ci.yml
```

## Clarified

```txt
GET /api/me must lazily create AppUserProfile when missing.
API responses must use DTOs and string IDs, not raw MongoDB ObjectIds.
Database indexes must be created through a repeatable script.
ADR records should be used for important architecture decisions.
CI should run lint, typecheck, tests, and build.
Feature flags may guard incomplete features but must not expand MVP scope.
Structured logging should avoid secrets and sensitive user content.
```

## Not changed

```txt
No new product feature.
No new MVP scope.
No new AI capability.
No marketplace.
No image upload.
No AI face analysis.
No skin score.
No notification system.
No payment/subscription.
No microservices.
No RAG/vector database.
No queue/background-job requirement.
```


## Final documentation cleanup

A final cleanup pass was applied after reviewing v1.2.6-final for implementation readiness.

Updated:

```txt
docs/14-seed-data-spec.md
README.md
docs/09-release-plan.md
docs/12-week-1-implementation-plan.md
docs/source-notes.md
```

Cleanup details:

```txt
Aligned IngredientSeed with the canonical Ingredient model.
Aligned ProductSeed with the canonical Product model.
Removed seed-only enum drift such as priceRange = mid_range and source = seed.
Added docs/CHANGELOG-v1.2.6.md to the README documentation map.
Updated README current next step wording from v1.2.5 hotfix to v1.2.6 final freeze.
Updated release-plan freeze wording from v1.2.5 to v1.2.6.
Clarified MongoDB Adapter wording: use a shared MongoClient or client provider; do not create a new MongoClient per request.
```

This cleanup does not add features, does not change product positioning, does not change MVP scope, and does not change architecture.

## Freeze decision

After v1.2.6, the SDD is frozen for Week 1 implementation.

Normal implementation tasks do not override the SDD. Only an explicit SDD/scope revision request can change source-of-truth documents.
