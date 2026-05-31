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
├── scripts/
│   └── configure-node-dns.cjs
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

## 3.1 Scripts structure

```txt
scripts/
└── configure-node-dns.cjs
```

Rules:

- `scripts/configure-node-dns.cjs` is a local Node.js preload used by `npm run dev` to set DNS servers before Next.js/Auth.js performs MongoDB Atlas SRV lookups.
- Do not add business logic, database queries, or application state to preload scripts.
- If the DNS workaround is removed, first verify that `node -e "require('dns').resolveSrv('_mongodb._tcp.<cluster-host>', console.log)"` succeeds without `dns.setServers(...)` on the target development machines.

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

### Current v1.2 Saved Products module

The implemented Saved Products feature follows the same modular-monolith pattern:

```txt
src/modules/saved-products/
â”œâ”€â”€ saved-product.types.ts
â”œâ”€â”€ saved-product.schema.ts
â”œâ”€â”€ saved-product.dto.ts
â”œâ”€â”€ saved-product.mapper.ts
â”œâ”€â”€ saved-product.repository.ts
â”œâ”€â”€ saved-product.use-case.ts
â”œâ”€â”€ saved-product.client.ts
â””â”€â”€ components/
    â”œâ”€â”€ saved-products-page.tsx
    â”œâ”€â”€ saved-product-card.tsx
    â””â”€â”€ saved-product-toggle-button.tsx
```

Implemented routes:

```txt
src/app/(dashboard)/saved-products/page.tsx
src/app/api/saved-products/route.ts
src/app/api/saved-products/[productId]/route.ts
```

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

## 9. Runtime support scripts

`package.json` currently starts local development through:

```txt
node --require ./scripts/configure-node-dns.cjs ./node_modules/next/dist/bin/next dev
```

This is intentionally documented because local Windows/Node.js DNS resolution may fail for MongoDB Atlas `mongodb+srv://` even when `nslookup` succeeds. The preload sets DNS servers at process startup so Auth.js and MongoDB driver SRV lookups use the same known-good resolvers.

## 10. Post-MVP v1.3 Insights structure

The Skin Progress Insights & Calendar feature follows the existing modular-monolith pattern and does not introduce Mongoose or a new database architecture.

Implemented route files:

```txt
src/app/(dashboard)/insights/page.tsx
src/app/api/insights/route.ts
```

Implemented module files:

```txt
src/modules/insights/insights.client.ts
src/modules/insights/insights.dto.ts
src/modules/insights/insights.mapper.ts
src/modules/insights/insights.schema.ts
src/modules/insights/insights.types.ts
src/modules/insights/insights.use-case.ts
src/modules/insights/index.ts
src/modules/insights/components/insights-page.tsx
src/modules/insights/components/insights-overview-cards.tsx
src/modules/insights/components/routine-consistency-calendar.tsx
src/modules/insights/components/symptom-trend-card.tsx
src/modules/insights/components/product-usage-card.tsx
src/modules/insights/components/insights-next-actions-card.tsx
```

Related existing modules:

```txt
src/modules/routines/
src/modules/routine-logs/
src/modules/journals/
src/modules/products/
```

Test files:

```txt
tests/unit/insights-schema.test.ts
tests/unit/insights-mapper.test.ts
tests/unit/insights-use-case.test.ts
tests/unit/insights-client.test.ts
tests/unit/insights-api-contract.test.ts
tests/unit/insights-ui.test.ts
tests/e2e/insights.authenticated.spec.ts
```

Ownership rules:

- `src/app/api/insights/route.ts` validates query input, checks authentication, and calls the use case.
- `insights.use-case.ts` orchestrates user-scoped routines, routine logs, skin journal entries, and visible product lookup.
- `insights.mapper.ts` owns routine-slot calculations, calendar day summaries, symptom counts, product usage mapping, streaks, and next actions.
- Client components may import only client-safe helpers, DTO types, shared UI, and route constants.
- Product usage must resolve products through existing visible-product repository logic and skip invalid or hidden products.
