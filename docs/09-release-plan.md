# 09-release-plan.md

# Release Plan - SkinWise VN Current MVP Status

## 1. Six-week MVP roadmap

### Week 1: Foundation

- Create Next.js project.
- Configure TypeScript.
- Configure Tailwind and shadcn/ui.
- Setup MongoDB connection.
- Setup environment validation.
- Setup Auth.js / NextAuth with consistent `AUTH_*` variables.
- Add AGENTS.md and docs folder.
- Add base layout and dashboard shell.
- Add folder structure from `docs/10-project-structure.md`.
- Add DTO mapper pattern for API responses.
- Add feature flag config.
- Add repeatable database index script placeholder.
- Add PR checklist and CI workflow template.

### Week 2: Skin Profile, Product Database, and Ingredient Knowledge Base

- Implement SkinProfile schema.
- Implement SkinProfile APIs.
- Implement skin profile UI.
- Implement Product schema with product-fit fields.
- Seed initial product data.
- Implement product search and filters.
- Implement Ingredient schema.
- Seed initial ingredient data.
- Implement `GET /api/ingredients`.
- Implement `GET /api/ingredients/:id`.

### Week 3: Routine Builder and RoutineLog

- Implement Routine schema.
- Implement RoutineStep snapshot fields.
- Implement Routine APIs.
- Implement create/edit/delete routine.
- Implement routine step ordering.
- Implement RoutineLog schema and APIs.
- Add ownership checks.

### Week 4: Routine Safety Engine

- Implement domain rule engine.
- Implement rule table from `docs/11-routine-safety-rules.md`.
- Implement safety rule test cases.
- Implement active ingredient normalization before rules run.
- Implement `POST /api/routines/:id/analyze`.
- Implement `GET /api/routines/:id/analyses`.
- Store all rule results and routine snapshot.
- Store top-level `RoutineAnalysis.riskLevel`.
- Build analysis result UI.

### Week 5: AI Explanation and Ingredient Explainer

- Implement AIProvider abstraction.
- Add routine-analysis prompt.
- Add ingredient-explainer prompt.
- Add safety-classifier prompt.
- Implement `POST /api/ingredients/explain`.
- Implement `modules/ai-analysis/explain-ingredient.use-case.ts`.
- Run safety classifier before ingredient explanation when user input may contain unsafe claims or prompt injection.
- Add structured output validation for `RoutineAnalysisResult`.
- Add structured output validation for `IngredientExplanationResult`.
- Save AI analysis metadata.
- Add AI error handling.
- Add AI eval tests.

### Week 6: Skin Journal and Polish

- Implement SkinJournal schema with localDate/timezone.
- Implement journal APIs.
- Implement journal timeline UI.
- Add dashboard cards.
- Add RoutineLog consistency summary.
- Add error/loading/empty states.
- Add README updates.
- Prepare portfolio case study.

## 2. MVP release checklist

```txt
[ ] User can sign in.
[ ] User can create skin profile.
[ ] User can search products.
[ ] Product list hides other users' unverified submissions.
[ ] User can see their own unverified submitted products only with includeMine=true.
[ ] Product has product-fit fields.
[ ] User can search ingredients.
[ ] User can view ingredient details.
[ ] User can request AI ingredient explanation through POST /api/ingredients/explain.
[ ] Ingredient explanation follows IngredientExplanationResult schema.
[ ] Safety classifier runs before ingredient explanation when needed.
[ ] User can create routine.
[ ] RoutineStep has snapshot fields.
[ ] User can create RoutineLog.
[ ] User can run routine safety analysis through POST /api/routines/:id/analyze.
[ ] Rule engine runs before AI.
[ ] RoutineAnalysis stores routineSnapshot.
[ ] RoutineAnalysis stores top-level riskLevel.
[ ] Database stores all RuleResult entries; API exposes only triggered warnings.
[ ] AI output follows JSON schema.
[ ] Disclaimer appears in AI result.
[ ] User can create skin journal using localDate/timezone.
[ ] localDate validation uses YYYY-MM-DD format.
[ ] All user-owned APIs check ownership.
[ ] Unit tests pass.
[ ] Integration tests pass.
[ ] E2E happy path passes.
[ ] No secrets are exposed.
[ ] README setup is accurate.
```

## 3. Beta release checklist

```txt
[ ] Add persistent rate limiting storage.
[ ] Add admin product review UI.
[ ] Add AI response caching.
[ ] Add prompt version dashboard.
[ ] Expand ingredient knowledge base.
[ ] Add admin ingredient management.
[ ] Add ingredient/product comparison.
[ ] Add image upload with private access.
[ ] Add data deletion flow.
[ ] Add basic observability.
[ ] Add stronger AI eval dataset.
```

## 4. Future scalability plan

### Stage 1: Modular monolith

- Single app.
- Single database.
- Simple deployment.
- Strong module boundaries.

### Stage 2: Background workers

- Add queue for AI analysis.
- Add retry for AI provider failures.
- Add scheduled reminders.

### Stage 3: Search and knowledge base

- Expand ingredient knowledge base.
- Add vector search for ingredient/product explanations.
- Add product verification workflow.

### Stage 4: Service extraction

Extract:

- AI Analysis Service.
- Product Knowledge Service.
- Notification Worker.
- Image Processing Service.

## 5. Release risks

| Risk | Mitigation |
|---|---|
| AI gives unsafe advice | Rule engine, structured output, safety prompt, eval tests |
| Privacy concerns | Data minimization, deletion, private images |
| Product database too small | Support custom product input |
| Unverified product data appears publicly | Product visibility rule and tests |
| Historical analysis changes after product edit | Product and routine snapshots |
| High AI cost | Rate limits, caching, prompt optimization |
| Scope creep | Keep marketplace and diagnosis out of MVP |


## 6. Current release status

```txt
MVP v1.6 - Catalogue Data Quality & Ingredient Metadata Upgrade: COMPLETED
MVP v1.6.1 - Validation Evidence & Documentation Truth Sync: COMPLETED
MVP v1.7 - Routine Builder Usability & Demo Flow Refinement: COMPLETED
MVP v1.8 - Insights Usability & Progress Story Refinement: COMPLETED
MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup: COMPLETED
MVP v1.8.2 - Final Documentation Consistency Hotfix: COMPLETED
```

Current release documentation is available in:

```txt
docs/final-release-checklist.md
docs/14-seed-data-spec.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/06-current-sprint-plan.md
docs/portfolio-case-study.md
docs/demo-script.md
```

Historical v1.3 release notes and changelog remain preserved in `docs/release-notes-v1.3.md` and `docs/CHANGELOG-v1.3.md`.

Current status:

```txt
Core implementation release: MVP v1.8 completed
Completed documentation cleanup patch: MVP v1.8.1 completed
Latest documentation consistency hotfix: MVP v1.8.2 completed
MVP core scope: COMPLETED
Documentation truth sync: COMPLETED FOR v1.8.1
Final documentation consistency hotfix: COMPLETED FOR v1.8.2
Validation evidence: HISTORICAL v1.8 EVIDENCE RECORDED; v1.8.2 FULL VALIDATION NOT RERUN
Portfolio review: READY FOR CURRENT MVP STATE
Demo review: READY FOR CURRENT MVP STATE
Interview demo: READY FOR CURRENT MVP STATE
Production URL: https://skinwise-vn.vercel.app
Current production smoke test evidence: NOT RUN UNTIL MANUALLY VERIFIED
Current production monitoring/demo recovery evidence: PENDING UNTIL MANUALLY VERIFIED
```

Latest historical MVP v1.8 validation evidence:

```txt
Node.js: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 96 files / 889 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run db:seed: PASS - 40 ingredients / 38 products
npm run test:e2e: PASS - 29/29 tests
npm audit: NOT RUN during v1.8
```

Validation not rerun in this v1.8.2 documentation hotfix. Pending local verification on Node.js 24.x and npm 11.x.

Next release task:

```txt
MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
```

MVP v2.0 or later is optional future enhancement scope only and is not required for MVP portfolio/demo/interview readiness.

## 7. Historical SDD freeze note

After v1.2.6, the SDD is considered frozen for Week 1 Implementation Plan. v1.2.6 is the final freeze before Week 1 implementation and supersedes v1.2.5 by adding final engineering execution guardrails and documentation cleanup without changing MVP product scope.

Allowed changes after this point:

- bug fixes in documentation;
- implementation notes discovered during Week 1;
- security corrections.

Not allowed without deliberate product review:

- new MVP features;
- medical diagnosis features;
- marketplace/affiliate scope;
- public product or ingredient APIs beyond the documented MVP auth policy.
