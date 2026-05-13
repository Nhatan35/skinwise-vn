# 10-project-structure.md

# Project Structure — MVP v1.2.6

## 1. Goal

This document defines the folder and file conventions AI coding assistants must follow when implementing SkinWise VN.

Do not create random folders outside this structure without updating this document.

## 2. Root structure

```txt
skinwise-vn/
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── adr/
├── public/
├── src/
├── tests/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
└── .env.example
```

## 3. Source structure

```txt
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── routines/
│   │   ├── journal/
│   │   └── products/
│   ├── api/
│   │   ├── auth/
│   │   ├── skin-profile/
│   │   ├── products/
│   │   ├── ingredients/
│   │   │   ├── route.ts
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── explain/
│   │   │       └── route.ts
│   │   ├── routines/
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── analyze/
│   │   │       │   └── route.ts
│   │   │       └── analyses/
│   │   │           └── route.ts
│   │   ├── routine-logs/
│   │   └── skin-journal/
│   ├── layout.tsx
│   └── page.tsx
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── skin-profile/
│   ├── products/
│   ├── ingredients/
│   ├── routines/
│   ├── routine-logs/
│   ├── ai-analysis/
│   │   ├── ai-analysis.schema.ts
│   │   ├── ai-analysis.dto.ts
│   │   ├── analyze-routine.use-case.ts
│   │   ├── explain-ingredient.use-case.ts
│   │   ├── classify-safety.use-case.ts
│   │   └── __tests__/
│   ├── journals/
│   └── notifications/        # reserved for future; do not implement in MVP Week 1
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── rules/
│   │   ├── routine-safety-engine.ts
│   │   └── routine-safety-rules.ts
│   └── errors/
│
├── infrastructure/
│   ├── database/
│   │   ├── mongodb.ts
│   │   ├── collections.ts
│   │   └── ensure-indexes.ts
│   ├── ai/
│   │   ├── ai-provider.ts
│   │   └── openai-provider.ts
│   ├── storage/
│   └── logging/
│
├── shared/
│   ├── components/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   └── validators/
│
└── config/
    ├── env.ts
    ├── app.ts
    └── features.ts
```

## 4. Module file convention

Each module should follow this pattern when relevant:

```txt
modules/<module-name>/
├── <module-name>.schema.ts
├── <module-name>.dto.ts
├── <module-name>.mapper.ts
├── <module-name>.repository.ts
├── <module-name>.use-case.ts
├── <module-name>.service.ts
├── <module-name>.errors.ts
└── __tests__/
    ├── <module-name>.unit.test.ts
    └── <module-name>.integration.test.ts
```

Example:

```txt
modules/routines/
├── routine.schema.ts
├── routine.dto.ts
├── routine.repository.ts
├── create-routine.use-case.ts
├── update-routine.use-case.ts
├── get-routine.use-case.ts
└── __tests__/
```


## 5. Ingredient module convention

```txt
modules/ingredients/
├── ingredient.schema.ts
├── ingredient.dto.ts
├── ingredient.repository.ts
├── search-ingredients.use-case.ts
├── get-ingredient.use-case.ts
└── __tests__/
    ├── ingredient.unit.test.ts
    └── ingredient.integration.test.ts
```

Ingredient explanation is orchestrated from `modules/ai-analysis/explain-ingredient.use-case.ts`, because it combines ingredient data, optional skin profile context, safety classification, and AI output validation.

## 6. Route handler rule

Route handlers must be thin.

Allowed:

- parse request;
- authenticate session;
- validate input;
- call use case;
- return response.

Not allowed:

- direct database queries;
- skincare business rules;
- AI provider calls;
- long conditional business logic.

## 7. Test structure

```txt
tests/
├── unit/
├── integration/
├── e2e/
└── evals/
```

## 8. Naming rules

- Use kebab-case for files.
- Use PascalCase for React components.
- Use camelCase for functions and variables.
- Use UPPER_SNAKE_CASE for rule codes.
- Use explicit use case names: `AnalyzeRoutineUseCase`, `CreateRoutineLogUseCase`.


## 9. Engineering guardrail files

These files are part of the implementation governance layer:

```txt
docs/19-engineering-execution-checklist.md
docs/20-week-1-task-1-prompt.md
docs/adr/
.github/pull_request_template.md
.github/workflows/ci.yml
```

Do not delete them during implementation.

## 10. DTO mapper rule

Each module that returns API data should use a mapper file when converting database documents to API DTOs.

Mapper responsibilities:

```txt
ObjectId -> string id
Date -> ISO string
private/future fields -> omitted
database naming -> API naming
```

API route handlers should not manually shape complex response objects when a module mapper exists.
