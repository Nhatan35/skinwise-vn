# SkinWise VN

**SDD version:** MVP v1.2.6

Current SDD version: **v1.2.6 — Final Freeze and Engineering Execution Guardrails**

SkinWise VN is an AI skincare education and routine safety tracker for Vietnamese users.

It helps users build minimalist routines, understand cosmetic ingredients, detect common routine safety issues, track routine consistency, and log skin observations over time.

## Important positioning

SkinWise VN is not a medical diagnosis application.

It does not:

- diagnose skin diseases;
- prescribe medication;
- guarantee treatment outcomes;
- replace dermatologists or medical professionals;
- score attractiveness;
- create appearance pressure.

## What changed in v1.2.6

v1.2.6 is the final SDD freeze before Week 1 implementation.

It does not add product features. It adds engineering execution guardrails so AI-assisted coding can be controlled through:

- Engineering Execution Checklist;
- ADR records for major architecture decisions;
- PR checklist;
- CI template;
- DTO/API boundary rules;
- `/api/me` lazy AppUserProfile creation decision;
- repeatable database index script rule;
- feature flag guidance;
- structured logging guidance;
- Week 1 Task 1 prompt.

## What changed in v1.2.5

v1.2.5 does not add new MVP product features.

It is a consistency hotfix before Week 1 implementation. It keeps the v1.2.4 implementation-readiness and AI coding governance layer, and fixes:

- Auth.js `/api/auth/*` ownership and adds app-specific `GET /api/me`;
- canonical `UNAUTHORIZED` error-code naming;
- MVP role enum as `USER | ADMIN`;
- SkinJournal future image fields so they are not exposed in MVP APIs;
- Auth.js / NextAuth v5-compatible install guidance;
- PATCH `/api/skin-journal/:id` request contract;
- test-plan coverage for the consistency rules.

The v1.2.4 governance layer includes:

- source-of-truth hierarchy;
- codebase map;
- implementation status tracker;
- feature status matrix;
- file ownership map;
- AI change log;
- current sprint plan;
- Week 1 implementation plan;
- UI route map;
- seed data spec;
- repository/use case contract;
- AI fallback policy;
- Vietnamese copy guidelines;
- deployment checklist;
- engineering execution checklist;
- ADR records;
- PR checklist;
- CI template;
- Week 1 Task 1 prompt;
- `.env.example`.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB Atlas
- Zod
- Auth.js / NextAuth with MongoDB Adapter
- AIProvider abstraction
- Rule Engine before AI
- Structured Output JSON Schema
- Vitest
- Playwright
- Cloudinary or S3-compatible storage later only

## Core features

- Authentication.
- Skin profile onboarding.
- Product mini database.
- Ingredient knowledge base.
- Morning/evening routine builder.
- RoutineLog for daily completion tracking.
- Rule-based routine safety analysis.
- AI explanation in Vietnamese.
- Skin journal with local-date tracking.
- Dashboard.
- Ingredient search and explanation.
- Product visibility rules for reviewed/verified products and user-owned unverified submissions.

## Architecture summary

SkinWise VN uses a modular monolith architecture.

```txt
UI Layer
  -> API Layer
    -> Application / Use Case Layer
      -> Domain Layer
        -> Infrastructure Layer
```

AI flow:

```txt
Routine data
  -> Rule Engine
    -> AI Explanation
      -> Structured JSON Output
```

Canonical routine analysis endpoint:

```txt
POST /api/routines/:id/analyze
GET  /api/routines/:id/analyses
```

## Local setup

Planned setup:

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables

Use `AUTH_*` variables consistently for Auth.js / NextAuth v5-style setup.

See `.env.example` for the full list.

Core variables:

```txt
APP_ENV=
APP_BASE_URL=
MONGODB_URI=
AUTH_SECRET=
AUTH_URL=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
```

Optional future image upload variables:

```txt
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Do not implement image upload in Week 1 unless the SDD scope is explicitly changed.

Do not mix `AUTH_*` and `NEXTAUTH_*` conventions without documenting why.

## Development commands

Planned commands:

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Development workflow using SDD

Before coding:

1. Read `AGENTS.md`.
2. Read `docs/00-source-of-truth.md`.
3. Read `docs/ai-coding/01-codebase-map.md`.
4. Read `docs/ai-coding/02-implementation-status.md`.
5. Read `docs/ai-coding/03-feature-status-matrix.md`.
6. Read `docs/ai-coding/06-current-sprint-plan.md`.
7. Confirm feature scope.
8. Write a small implementation plan.

During coding:

1. Create/update validation schema.
2. Create/update repository.
3. Create/update use case.
4. Create/update API route.
5. Create/update UI.
6. Add tests.
7. Validate against acceptance criteria.

After coding:

1. Update `docs/ai-coding/02-implementation-status.md`.
2. Update `docs/ai-coding/03-feature-status-matrix.md`.
3. Update `docs/ai-coding/05-ai-change-log.md`.

## Documentation map

```txt
AGENTS.md
README.md
.env.example

docs/00-source-of-truth.md
docs/00-product-vision.md
docs/01-prd.md
docs/02-user-stories.md
docs/03-system-architecture.md
docs/04-data-model.md
docs/05-api-contract.md
docs/06-ai-contract.md
docs/07-security-privacy.md
docs/08-test-plan.md
docs/09-release-plan.md
docs/10-project-structure.md
docs/11-routine-safety-rules.md
docs/12-week-1-implementation-plan.md
docs/13-ui-route-map.md
docs/14-seed-data-spec.md
docs/15-use-case-and-repository-contract.md
docs/16-ai-fallback-policy.md
docs/17-vietnamese-copy-and-ui-guidelines.md
docs/18-deployment-checklist.md
docs/19-engineering-execution-checklist.md
docs/20-week-1-task-1-prompt.md
docs/source-notes.md

docs/ai-coding/01-codebase-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/04-file-ownership-map.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md

docs/prompts/routine-analysis.prompt.md
docs/prompts/ingredient-explainer.prompt.md
docs/prompts/safety-classifier.prompt.md

docs/CHANGELOG-v1.2.md
docs/CHANGELOG-v1.2.1.md
docs/CHANGELOG-v1.2.2.md
docs/CHANGELOG-v1.2.3.md
docs/CHANGELOG-v1.2.4.md
docs/CHANGELOG-v1.2.5.md
docs/CHANGELOG-v1.2.6.md
```

## MVP principle

Build the safest useful version first:

- simple routine builder;
- deterministic safety rules;
- AI explanation;
- privacy-first journal;
- routine consistency tracking;
- no diagnosis;
- no product-selling pressure.

## Current next step

After this v1.2.6 final freeze, start:

```txt
Week 1 — Foundation Setup
```

Use:

```txt
docs/12-week-1-implementation-plan.md
docs/ai-coding/06-current-sprint-plan.md
```
