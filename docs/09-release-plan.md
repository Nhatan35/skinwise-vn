# Release Plan - SkinWise VN Current MVP Status

Last updated: 2026-06-15

## 1. Current Release Chain

```txt
MVP v1.8 - Insights Usability & Progress Story Refinement: DONE
MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup: DONE
MVP v1.8.2 - Final Documentation Consistency Hotfix: DONE
MVP v1.9 - Local Validation Evidence: PASS
MVP v1.10 - Production Smoke Test & Monitoring Evidence: PASS, user-reported
MVP v1.11 - Portfolio Demo Readiness Polish: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
MVP v1.14 - Data Quality Expansion: DONE
MVP v1.15 - Product Match Explainability & Safety Guardrails: DONE
MVP v1.15.1 - Audit Cleanup & Evidence Sync: DONE
MVP v1.16 through MVP v1.42: preserved in `docs/00-source-of-truth.md`
MVP v1.43 - Release Evidence & Validation Cleanup: DONE / PASS, local validation; production smoke not freshly verified
MVP v1.44 - Admin Product Review API Foundation: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
```

The MVP product scope is complete. Current work is controlled post-MVP improvement with explicit release-evidence boundaries. v1.44 adds a small admin-only Product Review API foundation without full admin UI, marketplace/payment, product hard delete, or production-ready claims. The full current release chain is maintained in `docs/00-source-of-truth.md`.

## 2. Historical Six-Week MVP Roadmap

### Week 1: Foundation

- Next.js project.
- TypeScript.
- Tailwind/shadcn-style UI foundation.
- MongoDB connection.
- Environment validation.
- Auth.js / NextAuth setup.
- Project docs and structure.

### Week 2: Skin Profile, Product Database, Ingredient Knowledge Base

- SkinProfile schema and APIs.
- Skin profile UI.
- Product schema and seed data.
- Product search/list/detail foundation.
- Ingredient schema, seed data, list/detail APIs.

### Week 3: Routine Builder and RoutineLog

- Routine schema and APIs.
- Routine steps and product snapshots.
- Routine builder UI.
- Routine log model and daily tracking.

### Week 4: Routine Safety and Product Matching

- Routine safety rules.
- Routine analysis flow.
- Product Match rule engine.
- Personalized product match explanations.

### Week 5: AI Provider Abstraction and Fallbacks

- Provider abstraction.
- Mock/fallback provider behavior.
- Ingredient explanation flow.
- Safe output validation.

### Week 6: Journal, Dashboard, Insights, Settings

- Skin Journal.
- Dashboard summary.
- Product Catalogue and Product Detail polish.
- Insights.
- Settings/Data Control.
- Export/deletion-related flows.

## 3. Completed Closeout Milestones

| Milestone | Status | Purpose |
|---|---|---|
| MVP v1.8 | DONE | Final product usability refinement for Insights/progress story. |
| MVP v1.8.1 | DONE | Documentation truth sync and evidence cleanup. |
| MVP v1.8.2 | DONE | Final documentation consistency hotfix. |
| MVP v1.9 | PASS | Local validation evidence captured. |
| MVP v1.10 | PASS, user-reported | Production smoke and monitoring verification recorded. |
| MVP v1.11 | DONE | Portfolio/demo readiness documentation polished. |
| MVP v1.12 | DONE | Post-MVP backlog created and future work prioritised. |
| MVP v1.13 | DONE | UX states polished without feature, schema, auth, or business-rule expansion. |
| MVP v1.14 | DONE | Product and ingredient seed data expanded without schema or feature-scope changes. |
| MVP v1.15 | DONE | Product Match and Product Detail explainability, caution wording, and profile guidance improved without schema or route changes. |
| MVP v1.15.1 | DONE | npm audit/dependency-risk evidence reviewed and documentation synchronized without product behavior or dependency changes. |
| MVP v1.43 | DONE / PASS | Fresh local validation, audit, E2E evidence, README cleanup, and deferred production/AI/media boundary clarification. |

## 4. Validation Evidence

Local evidence:

```txt
Evidence date: 2026-06-06
Environment: Local Windows / PowerShell
Branch: main
npm ci: PASS
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 899 tests
npm run build: PASS
npm run test:e2e: PASS - 29/29 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Fresh v1.43 local evidence:

```txt
Evidence date: 2026-06-15
Environment: Microsoft Windows 10.0.26200 / PowerShell
Node: v24.14.0
npm: 11.14.1
npm ci: PASS after unsandboxed rerun; sandboxed attempt failed with spawn EPERM
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 110 files / 1134 tests
npm run build: PASS after unsandboxed rerun; sandboxed attempt failed with spawn EPERM
npm run test:e2e: PASS after unsandboxed rerun - 31 passed
npm audit: PASS - found 0 vulnerabilities
npm audit --omit=dev: PASS - found 0 vulnerabilities
Production smoke on deployed URL: NOT RUN for v1.43
```

Validation notes:

```txt
v1.15 improved Product Match/Product Detail explainability and safety guidance.
v1.15.1 synchronized audit/release evidence and did not change product behavior.
No database schema, route, auth, authorization, persistence, or AI-provider behavior changed in v1.15.1.
Sandboxed npm ci, build, and E2E attempts failed with spawn EPERM; the same commands passed when rerun outside the sandbox.
E2E global setup seeded the local test database with the expanded v1.14 seed data.
npm audit --omit=dev --audit-level=moderate was verified clean for production dependencies.
```

Production evidence:

```txt
Production URL: https://skinwise-vn.vercel.app
Production smoke test: PASS - user-reported manual verification completed
Production monitoring: PASS - user-reported checks completed
Critical blockers reported: None
Evidence date: 2026-06-04
```

## 5. Current Release Decision

```txt
Release decision: READY for portfolio/demo/interview at MVP level
Product scope decision: freeze core MVP features
Documentation decision: v1.11 portfolio demo package complete
Post-MVP planning decision: v1.12 backlog created
Post-MVP UX polish decision: v1.13 complete
Post-MVP data quality decision: v1.14 complete
Post-MVP explainability and safety decision: v1.15 complete
Audit cleanup and evidence sync decision: v1.15.1 complete
Release evidence and validation cleanup decision: v1.43 complete
Admin product review API foundation decision: v1.44 complete
Current phase: Post-MVP controlled product improvement
Recommended next task: MVP v1.45 - Admin Product Review UI & Workflow Polish
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video
```

## 6. Recommended Next Work

Do next:

```txt
1. Keep the completed MVP baseline stable.
2. Use the prepared Portfolio Evidence Package for interview/demo readiness.
3. Keep portfolio evidence tasks separate from product correctness.
4. Avoid large feature expansion until data quality/release confidence work is deliberately scoped.
```

Do not do next unless intentionally starting post-MVP:

```txt
Do not add marketplace/payment.
Do not add image upload/skin score.
Do not add real AI provider without safety design.
Do not refactor core architecture without a clear defect.
Do not expand scope before portfolio submission.
```

## 7. Optional Future Roadmap

### Post-MVP candidates

- Admin product review UI and workflow polish on top of the v1.44 API foundation.
- Admin ingredient management.
- More complete account deletion automation.
- Stronger observability and error tracking.
- More curated product/ingredient data.
- Optional real AI provider integration with strict output validation and safety policy.
- Optional portfolio media evidence tasks such as screenshots and demo video.

Recommended next task:

```txt
MVP v1.45 - Admin Product Review UI & Workflow Polish
```

Keep this optional and scoped: use the existing v1.44 admin API foundation, avoid full CRUD unless explicitly scheduled, and continue not to claim production-ready status until fresh deployed-URL smoke evidence is recorded.
