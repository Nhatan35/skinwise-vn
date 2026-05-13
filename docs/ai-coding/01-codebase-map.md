# 01-codebase-map.md

# Codebase Map — SkinWise VN MVP v1.2.6

## 1. Purpose

This file tells AI coding assistants what each folder and major file is responsible for.

It must be updated whenever the implementation structure changes.

## 2. Current repository state

Current package state: **SDD/documentation package, pre-implementation**.

The repository currently contains documentation and prompts. The actual Next.js source code may not exist yet until Week 1 implementation starts.

## 3. Planned root structure

```txt
skinwise-vn/
├── .github/
├── docs/
│   └── adr/
├── public/
├── src/
├── tests/
├── AGENTS.md
├── README.md
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── playwright.config.ts
└── vitest.config.ts
```

## 4. Documentation structure

```txt
docs/
├── 00-source-of-truth.md
├── 00-product-vision.md
├── 01-prd.md
├── 02-user-stories.md
├── 03-system-architecture.md
├── 04-data-model.md
├── 05-api-contract.md
├── 06-ai-contract.md
├── 07-security-privacy.md
├── 08-test-plan.md
├── 09-release-plan.md
├── 10-project-structure.md
├── 11-routine-safety-rules.md
├── 12-week-1-implementation-plan.md
├── 13-ui-route-map.md
├── 14-seed-data-spec.md
├── 15-use-case-and-repository-contract.md
├── 16-ai-fallback-policy.md
├── 17-vietnamese-copy-and-ui-guidelines.md
├── 18-deployment-checklist.md
├── 19-engineering-execution-checklist.md
├── 20-week-1-task-1-prompt.md
├── adr/
├── ai-coding/
├── prompts/
└── CHANGELOG-*.md
```

## 5. Planned source map

### `src/app/`

Purpose:

- Next.js App Router pages;
- layouts;
- route handlers;
- route groups.

Rules:

- pages must stay thin;
- route handlers must stay thin;
- no direct AI provider calls from UI;
- no direct database queries in pages.

### `src/modules/`

Purpose:

- application modules;
- validation schemas;
- DTOs;
- DTO mappers;
- repositories;
- use cases;
- module tests.

Expected modules:

```txt
auth
users
skin-profile
products
ingredients
routines
routine-logs
ai-analysis
journals
```

Reserved future module:

```txt
notifications
```

### `src/domain/`

Purpose:

- deterministic business rules;
- entities;
- value objects;
- domain errors.

Key future files:

```txt
src/domain/rules/routine-safety-engine.ts
src/domain/rules/routine-safety-rules.ts
```

Rules:

- routine safety rules must be deterministic;
- no AI provider calls here;
- no UI code here.

### `src/infrastructure/`

Purpose:

- MongoDB client;
- database collection helpers;
- repeatable index creation script;
- AI provider implementation;
- storage provider later;
- logging.

Rules:

- server-only;
- no React components;
- no business workflow orchestration.

### `src/shared/`

Purpose:

- shared components;
- constants;
- shared types;
- utility functions;
- shared validators.

Rules:

- do not hide feature-specific business logic here;
- move feature-specific logic to modules.

### `src/config/`

Purpose:

- environment validation;
- app-wide config;
- route constants if needed.

Key future files:

```txt
src/config/env.ts
src/config/app.ts
src/config/features.ts
```

### `.github/`

Purpose:

- pull request checklist;
- CI quality checks.

Key files:

```txt
.github/pull_request_template.md
.github/workflows/ci.yml
```

Rules:

- keep CI aligned with package scripts;
- use PR checklist for AI-generated patches.

## 6. Planned test map

```txt
tests/unit/
tests/integration/
tests/e2e/
tests/evals/
```

Rules:

- domain rules get unit tests;
- API behavior gets integration tests;
- critical user flows get E2E tests;
- AI output behavior gets eval tests.

## 7. Update requirement

Whenever code files are added, update this document with:

- new folder purpose;
- new module ownership;
- status of implemented files;
- any deviation from `docs/10-project-structure.md`.
