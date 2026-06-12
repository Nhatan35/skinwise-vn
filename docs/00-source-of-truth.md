# Source of Truth - SkinWise VN

Last updated: 2026-06-12

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
MVP v1.16 - Saved Product Comparison & Decision Support: DONE
MVP v1.17 - Routine History & Weekly Progress Review: DONE
MVP v1.18 - Skin Journal Filters & Reflection Review: DONE
MVP v1.19 - Account Data Summary & Privacy Control Review: DONE
MVP v1.20 - Personal Insight Review & Safe Trend Cards: DONE
MVP v1.21 - Insight Explainability & Tracking Quality Checklist: DONE
MVP v1.22 - Production Observability & Release Confidence: DONE
MVP v1.22.1 - Production Deployment & Smoke Verification: IN PROGRESS / NOT DONE
MVP v1.23 - Account Data Deletion Workflow Hardening: DONE
MVP v1.24 - Seed Data Quality Expansion Round 2: NOT DONE / VALIDATION BLOCKED
MVP v1.25 - First-Session Guided Experience Polish: DONE, scoped validation only
MVP v1.25.1 - Seed Baseline Regression & Documentation Consistency Hotfix: DONE, scoped validation only
MVP v1.26 - Product Match Explanation Clarity & Safe Decision Support Polish: DONE, scoped validation only
MVP v1.27 - Product Detail to Saved Products Decision Support Polish: DONE, scoped validation only
MVP v1.28 - Saved Products to Routine Decision Support Polish: DONE, scoped validation only
MVP v1.29 - Routine to Routine Log / Journal Decision Support Polish: DONE, scoped validation only
MVP v1.30 - Insights Interpretation & Dashboard Next Action Polish: DONE, scoped validation only
MVP v1.31 - Core Flow Recovery, Empty State & Navigation Consistency Polish: DONE, scoped validation only
Core MVP: COMPLETE
Portfolio demo readiness: COMPLETE
Post-MVP backlog planning: COMPLETE
Latest completed scoped task: MVP v1.31 - Core Flow Recovery, Empty State & Navigation Consistency Polish
Current phase: Post-MVP controlled improvement
Current active milestone: None
Production status: v1.22.1 production smoke verification: PARTIAL / DEFERRED
v1.24 status: Implementation complete, validation blocked - `npm run build` and `npm run test:e2e` did not pass in the current environment
v1.25 status: DONE within scoped local validation - `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.25.1 status: DONE within scoped local validation - restored v1.24 70/70 seed baseline consistency and missing v1.24 release evidence; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.26 status: DONE within scoped local validation - Product Match explanation clarity, safe caution visibility, no-profile guidance, and next-action copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.27 status: DONE within scoped local validation - Product Detail save-decision guidance, Saved Products empty-state clarity, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.28 status: DONE within scoped local validation - Saved Products to Routine context, CTA clarity, routine empty-state guidance, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.29 status: DONE within scoped local validation - Routine to Routine Log / Journal CTA clarity, routine log guidance, journal empty-state/after-save next actions, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.30 status: DONE within scoped local validation - Insights interpretation, insufficient-data guidance, Dashboard next-action reason copy, CTA clarity, and safe reference copy polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
v1.31 status: DONE within scoped local validation - selected core-flow empty states, recoverable errors, missing-resource fallbacks, retry clarity, and route consistency polished; `npm run lint`, `npm run typecheck`, and `npm run test` passed; build/E2E/manual/production verification were not run
Recommended next task: TBD / Backlog grooming
```

Primary current documents:

- `README.md`
- `AGENTS.md`
- `docs/final-release-checklist.md`
- `docs/release-evidence-v1.22.md`
- `docs/release-evidence-v1.23.md`
- `docs/release-evidence-v1.24.md`
- `docs/data-control-and-deletion.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/production-smoke-test-v1.9.md`
- `docs/production-monitoring-runbook.md`
- `docs/production-incident-note-template.md`
- `docs/18-deployment-checklist.md`

Historical planning documents remain useful for context, but they should not override the implemented codebase, current release evidence, or the post-MVP backlog.

Evidence boundary:

- Local validation is supported by terminal output.
- Production PASS is based on user-reported manual verification with no blockers reported.
- v1.22.1 direct verification checked the public production URL and `/api/health` only; authenticated MVP flows and production platform signals remain NOT CHECKED.
- v1.12 is completed documentation/planning only and did not include source-code changes.
- Portfolio evidence tasks are optional presentation artifacts, not product correctness blockers.
- v1.14 expanded seed data to 58 products and 59 ingredients without schema or feature-scope changes.
- v1.24 seed data implementation currently contains 70 products and 70 ingredients with v1.24 seed quality tests, but v1.24 is NOT DONE because build/E2E validation did not pass.
- v1.25 improved dashboard first-session onboarding guidance and next-step copy without seed data, schema, auth, Product Match scoring, or Routine Safety logic changes. Scoped validation passed with lint, typecheck, and unit tests only.
- v1.25.1 restored repository consistency after a seed baseline regression: `scripts/seed.ts` and `tests/unit/seed-data-quality.test.ts` again use the v1.24 70/70 baseline, `docs/release-evidence-v1.24.md` exists again, and docs keep v1.24 validation-blocked.
- v1.26 polished the existing Product Match explainability UI as a follow-up to v1.15, improving product-fit labels, safe caution wording, no-profile guidance, and next-action copy without changing scoring/ranking, seed data, schema, auth, AI-provider behavior, or Product Detail/Product Match API contracts.
- v1.27 polished Product Detail to Saved Products decision support as a follow-up to v1.26, improving product-detail summary labels, save/unsave helper copy, after-save next actions, Saved Products empty-state guidance, and safe reference copy without changing Product Match scoring/ranking, Routine logic, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.28 polished Saved Products to Routine decision support as a follow-up to v1.26 and v1.27, improving saved-product review context, Routine CTA clarity, routine empty-state guidance, and safe gradual-addition reference copy without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.29 polished Routine to Routine Log / Journal decision support as a follow-up to v1.26, v1.27, and v1.28, improving Routine next-action clarity, Today Routine Log guidance, Journal empty-state/after-save next actions, and safe short-term interpretation copy without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Journal logic, Insights logic, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.30 polished Insights interpretation and Dashboard next-action clarity as a follow-up to v1.29, improving personal-tracking interpretation copy, insufficient-data guidance, Dashboard next-action reason copy, and CTA clarity without changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Routine Log logic, Journal logic, Insights calculations, Dashboard state model, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.31 polished core-flow recovery, empty-state, retry, missing-resource, and navigation consistency states after v1.30 without adding a new global error framework, changing Product Match scoring/ranking, Product Detail behavior, Saved Products persistence, Routine logic, Routine Log logic, Journal logic, Insights calculations, Dashboard state model, schema, seed data, auth, AI-provider behavior, or API contracts.
- v1.15 improved Product Match/Product Detail explainability, matched-factor labels, caution wording, and profile guidance without schema, route, auth, persistence, or AI-provider changes.
- v1.15.1 synchronized audit/dependency-risk and validation documentation without product behavior, package, schema, route, auth, persistence, or AI-provider changes.
- v1.21 added Personal Insight Review calculation metadata and a tracking data-availability checklist without diagnosis, treatment advice, causation claims, skin scoring, risk scoring, health grading, schema changes, or AI-provider changes.
- v1.22 added a safe public health endpoint, health API contract test, release evidence documentation, production incident note template, and monitoring/release checklist updates without database, auth, AI-provider, or product-feature changes.
- v1.22.1 is not complete because browser/OAuth/Vercel/MongoDB Atlas verification was unavailable in this run.
- v1.23 hardened the existing account app-data deletion workflow with clearer destructive confirmation copy, explicit user-isolation tests, sensitive-response checks, and data-control documentation without schema, auth architecture, product-scope, or shared-catalogue deletion changes.
- v1.24 closeout created/updated seed data documentation and release evidence, but required validation is blocked in the current environment; do not mark v1.24 DONE until all required commands pass.
- Build, E2E, manual browser verification, and production verification were not run for v1.25.
- Build, E2E, manual browser verification, and production verification were not run for v1.25.1.
- Build, E2E, manual browser verification, and production verification were not run for v1.26.
- Build, E2E, manual browser verification, and production verification were not run for v1.27.
- Build, E2E, manual browser verification, and production verification were not run for v1.28.
- Build, E2E, manual browser verification, and production verification were not run for v1.29.
- Build, E2E, manual browser verification, and production verification were not run for v1.30.
- Build, E2E, manual browser verification, and production verification were not run for v1.31.
- Do not commit real secrets, OAuth tokens, database URIs, or private user data.
