# Release Plan - SkinWise VN Current MVP Status

Last updated: 2026-06-05

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
```

The MVP product scope is complete. Current work is no longer core feature implementation; it has moved into controlled post-MVP improvements. The active post-MVP backlog is `docs/post-mvp-backlog.md`.

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

## 4. Validation Evidence

Local evidence:

```txt
Evidence date: 2026-06-04
Environment: Local Windows / PowerShell
Branch: main
npm ci: PASS
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 894 tests
npm run build: PASS
npm run test:e2e: PASS - 29/29 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Validation notes:

```txt
v1.14 expanded curated seed data to 58 products and 59 ingredients.
No schema, route, auth, authorization, Product Match scoring, or AI-provider behavior changed.
Sandboxed npm ci, build, and E2E attempts failed with spawn EPERM; the same commands passed when rerun outside the sandbox.
E2E global setup seeded the local test database with the expanded v1.14 seed data.
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
Current phase: Post-MVP controlled improvement
Recommended next task: Portfolio Evidence Package
```

## 6. Recommended Next Work

Do next:

```txt
1. Keep the completed MVP baseline stable.
2. Prepare Portfolio Evidence Package if the goal is interview/demo readiness.
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

- Admin product/ingredient management.
- More complete account deletion automation.
- Stronger observability and error tracking.
- More curated product/ingredient data.
- Optional real AI provider integration with strict output validation and safety policy.
- Portfolio evidence tasks such as screenshots, demo video, and CV/portfolio case study.

Recommended next task:

```txt
Portfolio Evidence Package
```

This is presentation/evidence work, not a product blocker.
