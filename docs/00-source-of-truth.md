# Source of Truth - SkinWise VN

Last updated: 2026-06-06

This file is the current source-of-truth pointer for release/status documentation.

Current status:

```txt
MVP v1.8 - Product release: DONE
MVP v1.8.1 - Documentation truth sync: DONE
MVP v1.8.2 - Final documentation consistency hotfix: DONE
MVP v1.9 - Local validation evidence: PASS
MVP v1.10 - Production smoke/monitoring evidence: PASS, user-reported
MVP v1.11 - Portfolio demo readiness: DONE
MVP v1.12 - Post-MVP backlog planning: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
MVP v1.14 - Data Quality Expansion: DONE
MVP v1.15 - Product Match Explainability & Safety Guardrails: DONE
MVP v1.15.1 - Audit Cleanup & Evidence Sync: DONE
Core MVP: COMPLETE
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Latest completed milestone: MVP v1.15.1 - Audit Cleanup & Evidence Sync
Current phase: Post-MVP controlled improvement
Recommended next task: Portfolio Evidence Package
```

Primary current documents:

- `README.md`
- `AGENTS.md`
- `docs/final-release-checklist.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/production-smoke-test-v1.9.md`
- `docs/production-monitoring-runbook.md`
- `docs/18-deployment-checklist.md`

Historical planning documents remain useful for context, but they should not override the implemented codebase, current release evidence, or the post-MVP backlog.

Evidence boundary:

- Local validation is supported by terminal output.
- Production PASS is based on user-reported manual verification with no blockers reported.
- v1.12 is completed documentation/planning only and did not include source-code changes.
- Portfolio evidence tasks are optional presentation artifacts, not product correctness blockers.
- v1.14 expanded seed data to 58 products and 59 ingredients without schema or feature-scope changes.
- v1.15 improved Product Match/Product Detail explainability, matched-factor labels, caution wording, and profile guidance without schema, route, auth, persistence, or AI-provider changes.
- v1.15.1 synchronized audit/dependency-risk and validation documentation without product behavior, package, schema, route, auth, persistence, or AI-provider changes.
- Do not commit real secrets, OAuth tokens, database URIs, or private user data.
