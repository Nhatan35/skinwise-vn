# SkinWise VN Portfolio Case Study

Last updated: 2026-05-24

## 1. Project Overview

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users structure their skincare information, build simple routines, track routine consistency, write skin journal entries, and review dashboard summaries.

The project was built as a portfolio and BA internship preparation project. It demonstrates how a product idea can move from problem definition and requirements into a working full-stack MVP.

SkinWise VN is not a medical diagnosis app. It does not diagnose disease, prescribe medication, guarantee treatment outcomes, replace dermatologists, score skin quality, rate attractiveness, or perform image-based face/skin analysis.

The MVP includes:

- authentication foundation;
- skin profile;
- product catalogue and product detail;
- routine builder;
- routine logs;
- deterministic routine safety analysis;
- skin journal;
- dashboard summary;
- ingredient explanation API;
- mock/validated AI provider abstraction;
- seed/demo data documentation;
- Vercel MVP demo deployment documentation.

The MVP intentionally excludes:

- medical diagnosis;
- real OpenAI/Gemini provider integration;
- image upload and AI face analysis;
- skin score or attractiveness score;
- product CRUD/admin dashboard;
- marketplace, payment, subscription, and notifications;
- barcode scanner.

## 2. Problem Statement

Many skincare beginners struggle to build a consistent and safe routine. Product information is fragmented, routines are hard to track, and users may combine active ingredients without understanding potential irritation risks.

SkinWise VN addresses this by helping users organize profile, product, routine, log, and journal information in one app. It gives educational routine-level safety guidance without making medical claims or promising results.

## 3. Target Users

Primary user:

- A skincare beginner or intermediate user who wants to track skin profile, routines, products, and daily observations.
- Typical demo persona: oily or combination-oily skin, acne-prone concerns, clogged pores or texture concerns, post-acne dark spots, mild sensitivity, and a goal to simplify the routine.

Secondary user:

- BA mentor, portfolio reviewer, interviewer, or technical reviewer evaluating MVP thinking, requirements quality, and implementation discipline.

## 4. User Pain Points

- The user does not know which products fit their skin concerns.
- The user forgets routine steps.
- The user cannot track routine consistency.
- The user cannot connect journal observations with routine usage.
- The user may combine too many active products.
- The user needs simple educational explanations instead of medical claims.

## 5. Business Goals

- Help users structure skincare information.
- Support consistent routine tracking.
- Reduce confusion around routine building.
- Provide educational ingredient and routine guidance.
- Keep MVP scope safe, realistic, and explainable.
- Demonstrate BA and full-stack project capability.

## 6. MVP Scope

Included scope:

- authenticated user flow;
- skin profile;
- product catalogue;
- product detail;
- routine builder;
- routine logs;
- routine safety analysis;
- skin journal;
- dashboard;
- ingredient explanation;
- demo data and demo script.

Excluded scope:

- medical diagnosis;
- image upload;
- AI face analysis;
- skin score;
- product CRUD/admin dashboard;
- marketplace;
- payment/subscription;
- notifications;
- real OpenAI/Gemini provider;
- barcode scanner.

## 7. User Journey

| Step | User Action | System Response | User Value | BA/Product Note |
|---:|---|---|---|---|
| 1 | User lands on the app | Landing page explains the MVP boundary and core value | Understands what the app does | Sets expectations and avoids overclaiming |
| 2 | User signs in | Auth.js handles sign-in and protected routes | Accesses private tracking features | Authentication is required for user-owned data |
| 3 | User creates skin profile | App saves profile under the authenticated user | Personal context for routines and dashboard | User profile is the onboarding foundation |
| 4 | User browses products | Catalogue lists visible reviewed/verified demo products | Finds suitable skincare examples | Public/shared product data supports the demo |
| 5 | User views product detail | App shows product fields, ingredients, warnings, and fit metadata | Understands product role before using it | Detail page supports informed routine building |
| 6 | User builds morning/evening routine | App saves ordered routine steps | User gets a manageable routine structure | Routine steps support product or custom names |
| 7 | User runs routine safety analysis | Deterministic rules and mock provider output create analysis | User sees educational safety guidance | Rule engine runs before AI explanation |
| 8 | User logs routine completion | App creates or updates daily routine log | User tracks consistency | RoutineLog is separate from SkinJournal |
| 9 | User writes journal entries | App stores daily observations and symptoms | User records skin progress context | Journal is private and user-owned |
| 10 | User views dashboard summary | Dashboard summarizes profile, routines, logs, latest journal, and analysis | User sees progress context in one place | Dashboard reuses real user-scoped data |

## 8. Key User Stories

1. As a skincare user, I want to create a skin profile, so that the app can store my skin type, concerns, sensitivity, budget, and experience level.
2. As a skincare user, I want to browse products, so that I can find examples that fit my routine needs.
3. As a skincare user, I want to view product details, so that I can understand key actives, warnings, and suitable skin types before adding a product to a routine.
4. As a skincare user, I want to build morning and evening routines, so that I can follow clear skincare steps.
5. As a skincare user, I want routine safety analysis, so that I can notice possible routine-level risks such as missing sunscreen or combining too many actives.
6. As a skincare user, I want to log routine completion, so that I can track consistency over time.
7. As a skincare user, I want to write skin journal entries, so that I can track observations, symptoms, sleep, stress, and products used.
8. As a skincare user, I want a dashboard, so that I can quickly review my profile, routines, logs, latest journal, and latest analysis.
9. As a skincare user, I want ingredient explanations, so that I can understand ingredients in beginner-friendly educational language.

## 9. Acceptance Criteria

Skin Profile:

- Given I am an authenticated user, when I create a skin profile with valid skin type and concerns, then the system saves the profile under my account and displays it back to me.
- Given I am an authenticated user, when I update my profile, then the system updates only my profile.

Product Catalogue:

- Given I am authenticated, when I open `/products`, then the system displays visible product records.
- Given I use search or filters, when valid query parameters are submitted, then the catalogue returns matching visible products.

Product Detail:

- Given I am authenticated, when I open `/products/[id]` for a visible product, then the system displays product detail data.
- Given the product id is invalid or not visible, when I request the detail page, then the system shows a not-found or error state.

Routine Builder:

- Given I am authenticated, when I create a routine with valid steps, then the system saves it under my account.
- Given I add a product-backed step, when the routine is saved, then product snapshot fields can be stored for analysis stability.

Routine Safety Analysis:

- Given I am authenticated and own the routine, when I run analysis, then the system creates a routine analysis using deterministic safety rules and the current provider flow.
- Given provider behavior fails or is unavailable, then the system uses safe fallback behavior without exposing raw provider errors.

Routine Log:

- Given I am authenticated, when I log routine status for a local date, then the system creates or updates the log for my routine and date.
- Given a log exists for the same user, routine, and date, when I update it, then the system does not create a duplicate.

Skin Journal:

- Given I am authenticated, when I create a journal entry for a local date, then the system stores the entry under my account.
- Given an entry already exists for the same date, when I try to create another one, then the system returns a conflict and expects editing the existing entry.

Dashboard:

- Given I am authenticated, when I open the dashboard, then the system summarizes my profile, routines, today's routine logs, latest journal, latest analysis, and next action.

Ingredient Explanation:

- Given I am authenticated, when I submit a valid ingredient explanation request, then the system returns a safe educational explanation or deterministic fallback.

## 10. Functional Requirements

| Requirement ID | Requirement | Feature Area | Priority | Status | Evidence / Implementation Reference |
|---|---|---|---|---|---|
| FR-001 | The system shall authenticate users and protect private app routes. | Authentication | Must | Completed | `src/app/api/auth/[...nextauth]/route.ts`, `src/modules/auth`, `src/proxy.ts`, `docs/07-security-privacy.md` |
| FR-002 | The system shall let authenticated users create, view, update, and delete their skin profile. | Skin Profile | Must | Completed | `src/app/api/skin-profile/route.ts`, `src/modules/skin-profile`, `/skin-profile` |
| FR-003 | The system shall let authenticated users browse visible products with search/filter support. | Product Catalogue | Must | Completed | `src/app/api/products/route.ts`, `src/modules/products`, `/products` |
| FR-004 | The system shall let authenticated users view product detail for visible products. | Product Detail | Must | Completed | `src/app/api/products/[id]/route.ts`, `src/modules/products/components/product-detail.tsx`, `/products/[id]` |
| FR-005 | The system shall let authenticated users create and manage routines with ordered steps. | Routine Builder | Must | Completed | `src/app/api/routines/route.ts`, `src/app/api/routines/[id]/route.ts`, `src/modules/routines`, `/routines` |
| FR-006 | The system shall let authenticated users log routine completion by local date. | Routine Logs | Must | Completed | `src/app/api/routine-logs/route.ts`, `src/modules/routine-logs` |
| FR-007 | The system shall analyze routines with deterministic safety rules before AI provider explanation. | Routine Safety Analysis | Must | Completed | `src/app/api/routines/[id]/analyze/route.ts`, `src/domain/routine-safety`, `src/modules/ai-analysis` |
| FR-008 | The system shall let authenticated users create, list, update, and delete skin journal entries. | Skin Journal | Must | Completed | `src/app/api/skin-journal/route.ts`, `src/app/api/skin-journal/[id]/route.ts`, `src/modules/journals`, `/journal` |
| FR-009 | The system shall summarize user-owned profile, routines, logs, journal, and analysis data on the dashboard. | Dashboard | Must | Completed | `src/app/api/dashboard/route.ts`, `src/modules/dashboard`, `/dashboard` |
| FR-010 | The system shall provide authenticated ingredient explanations through the validated provider flow. | Ingredient Explanation | Should | Completed | `src/app/api/ingredients/explain/route.ts`, `src/modules/ingredients`, `src/infrastructure/ai` |

## 11. Non-Functional Requirements

| NFR ID | Category | Requirement | Rationale | Evidence / Implementation Reference |
|---|---|---|---|---|
| NFR-001 | Security | Private app APIs must derive user identity from authenticated session. | Prevents user-owned data access by forged request body fields. | `docs/04-data-model.md`, `src/modules/*/*.repository.ts`, API contract tests |
| NFR-002 | Privacy | User-owned records must not expose `userId`, raw ObjectId internals, or private auth data in public DTOs. | Protects user data and keeps API responses stable. | DTO mappers under `src/modules`, `docs/05-api-contract.md` |
| NFR-003 | Validation | API inputs must use Zod or existing schema validation. | Reduces invalid data and unclear behavior. | `src/modules/*/*.schema.ts`, `src/config/env.ts` |
| NFR-004 | Reliability | Routine analysis must fall back safely when provider behavior fails. | Keeps deterministic safety guidance available. | `src/modules/ai-analysis`, `docs/06-ai-contract.md` |
| NFR-005 | Maintainability | Business logic should stay outside UI and route handlers where practical. | Keeps modules testable and easier to review. | Repository/use-case/module structure under `src/modules` |
| NFR-006 | Performance | MVP should use normal Next.js App Router behavior and avoid unnecessary service complexity. | Keeps deployment simple for portfolio use. | `docs/03-system-architecture.md`, Vercel deployment docs |
| NFR-007 | Usability | The app should provide clear workflows for profile, products, routines, journal, and dashboard. | Supports a smooth demo and user journey. | Implemented UI routes under `src/app/(dashboard)` |
| NFR-008 | Safe educational copy | The app must avoid diagnosis, treatment guarantees, skin scores, and dermatologist replacement claims. | Keeps the product safe and realistic. | `docs/00-product-vision.md`, `docs/07-security-privacy.md`, `docs/11-routine-safety-rules.md` |
| NFR-009 | Environment configuration | Secrets must stay outside source and be configured through environment variables. | Prevents credential exposure. | `.env.example`, `src/config/env.ts`, `docs/deployment/vercel-deployment.md` |
| NFR-010 | Testability | Core logic and contracts should be covered by repeatable validation commands. | Supports release confidence. | `tests/unit`, `vitest.config.ts`, `package.json` scripts |

## 12. Requirement Traceability Matrix

| Business Need | User Story | Functional Requirement | Implementation Area | Test / Validation Evidence |
|---|---|---|---|---|
| Users need private account-based tracking | Sign in and access personal data | FR-001 | Auth.js route, auth helpers, proxy protection | Current-task validation: lint/typecheck/test/build; previously documented production smoke test |
| Users need personal skincare context | Create skin profile | FR-002 | `/api/skin-profile`, `/skin-profile` | Unit/API tests in `tests/unit`; current-task validation |
| Users need understandable product examples | Browse product catalogue | FR-003 | `/api/products`, `/products`, `scripts/seed.ts` | Unit/client tests; current-task validation |
| Users need product detail before using products | View product detail | FR-004 | `/api/products/[id]`, `/products/[id]` | Unit/client tests; previously documented production smoke test |
| Users need clear morning/evening steps | Build routines | FR-005 | `/api/routines`, `/routines` | Unit/API/source checks; current-task validation |
| Users need consistency tracking | Log routine completion | FR-006 | `/api/routine-logs`, routine log UI controls | Unit/API/client tests; current-task validation |
| Users need safe routine guidance | Run routine analysis | FR-007 | `/api/routines/[id]/analyze`, routine safety engine | Unit tests and current-task validation |
| Users need progress observations | Create journal entries | FR-008 | `/api/skin-journal`, `/journal` | Unit/API/client tests; current-task validation |
| Users need a quick summary | View dashboard | FR-009 | `/api/dashboard`, `/dashboard` | Unit/API tests; previously documented production smoke test |
| Users need beginner-friendly ingredient education | Explain ingredient | FR-010 | `/api/ingredients/explain`, AI provider abstraction | Unit/API tests; current-task validation |

## 13. Main Features

### Skin Profile

Purpose: capture skin type, concerns, sensitivity, budget, experience level, and avoided ingredients.

User value: gives the user a clear starting point and helps the app summarize personal context.

Main flow: authenticated user creates or updates profile through `/skin-profile` or onboarding.

Scope boundary: no diagnosis, treatment plan, or medical assessment.

### Product Catalogue

Purpose: provide a curated read-only product catalogue for demo and routine building.

User value: lets users browse products by category, skin type, concern, price range, and text search.

Main flow: authenticated user opens `/products`, searches/filters, and reviews product cards.

Scope boundary: no Product CRUD, admin UI, marketplace, affiliate sales, or scraping.

### Product Detail

Purpose: show public product DTO fields in a focused detail page.

User value: helps users understand product category, ingredients, warnings, fit metadata, and suitable use.

Main flow: user selects a product from the catalogue and opens `/products/[id]`.

Scope boundary: no product purchase, product submission, image gallery, or recommendation engine.

### Routine Builder

Purpose: let users create morning and evening routines with ordered steps.

User value: turns scattered product choices into a manageable daily routine.

Main flow: authenticated user creates a routine, adds product-backed or custom steps, and saves it.

Scope boundary: no automatic full routine generation or commercial recommendation flow.

### Routine Logs

Purpose: record whether a routine was completed, partially completed, or skipped on a local date.

User value: helps users track consistency without mixing behavior tracking with skin observations.

Main flow: user marks routine status from `/routines`.

Scope boundary: no advanced streak analytics in the current MVP.

### Routine Safety Analysis

Purpose: analyze routine-level safety using deterministic rules and provider-backed explanation/fallback behavior.

User value: helps users notice possible risks such as missing sunscreen or combining too many active steps.

Main flow: user runs analysis on a saved routine and reviews warnings, suggestions, and risk level.

Scope boundary: not a medical diagnosis, not a prescription, and not a guarantee of skincare outcomes.

### Skin Journal

Purpose: let users record daily observations, symptoms, products used, sleep, stress, and notes.

User value: helps users reflect on routine consistency and skin observations over time.

Main flow: authenticated user creates, edits, lists, and deletes entries from `/journal`.

Scope boundary: no image upload, image analysis, or medical condition tracking.

### Dashboard

Purpose: summarize user-owned profile, routine, routine log, latest journal, and latest routine analysis data.

User value: gives a quick status view and next action.

Main flow: authenticated user opens `/dashboard`.

Scope boundary: no advanced charts, predictive analytics, or skin score.

### Ingredient Explanation

Purpose: explain ingredient names in beginner-friendly educational language through the provider abstraction.

User value: helps users understand ingredients without needing external research.

Main flow: authenticated API request calls `POST /api/ingredients/explain`.

Scope boundary: real OpenAI/Gemini providers are not implemented; current demo behavior uses the validated mock provider/fallback path.

## 14. System Architecture Summary

SkinWise VN uses a modular monolith architecture with Next.js App Router. The app keeps feature logic organized by module under `src/modules`, shared deterministic routine safety rules under `src/domain`, and database/provider integrations under `src/infrastructure`.

Verified technical stack:

- Next.js App Router;
- TypeScript;
- Tailwind CSS and shadcn/ui-style component foundation;
- MongoDB;
- Auth.js / NextAuth;
- Zod validation;
- repository/use-case style organization;
- API routes;
- DTO mapping;
- Vercel deployment target.

The architecture is intentionally simple for an MVP. It avoids microservices and large operational complexity while keeping boundaries clear enough for testing and future growth.

## 15. Data Model Overview

| Entity | Purpose | Ownership | Notes |
|---|---|---|---|
| User | Auth identity | Auth.js-owned | Stored through Auth.js collections and OAuth flow |
| AppUserProfile | App-specific role/onboarding state | User-owned app profile | Lazily ensured by `/api/me` |
| Skin Profile | Skin type, concerns, sensitivity, budget, experience | User-owned | One profile per user |
| Product | Curated skincare product data | Public/shared plus possible future user-submitted ownership | Current MVP uses visible reviewed/verified product reads |
| Ingredient | Ingredient knowledge base data | Public/shared | Readable by authenticated users |
| Routine | Morning/evening routine container | User-owned | Contains ordered Routine Steps |
| Routine Step | Product or custom step inside a routine | User-owned through Routine | Can store product snapshot fields |
| Routine Log | Daily completion tracking | User-owned | Uses `localDate` and `timezone` |
| Skin Journal | Daily observations and notes | User-owned | One entry per user per local date |
| Routine Analysis | Stored routine analysis result | User-owned | Stores deterministic/provider result snapshot |
| Rate Limit | API abuse/cost protection counters | Infrastructure-owned | Used for analysis/explanation rate limits |

Public/shared data: Products and Ingredients.

Authenticated user-owned data: Skin Profile, Routines, Routine Logs, Skin Journal, Routine Analysis, and AppUserProfile.

## 16. API Overview

Methods below were verified from `src/app/api/**/route.ts` during `TASK PORTFOLIO-001`.

| Route | Method | Purpose | Auth Required | Feature Area |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | Auth.js-owned authentication endpoints | Auth.js-managed | Authentication |
| `/api/me` | GET | Return current app user profile/session data | Yes | Authentication/AppUserProfile |
| `/api/dashboard` | GET | Return dashboard summary for local date | Yes | Dashboard |
| `/api/skin-profile` | GET, POST, PATCH, DELETE | View, create/replace, update, delete skin profile | Yes | Skin Profile |
| `/api/products` | GET | List visible products with query filters | Yes | Product Catalogue |
| `/api/products/[id]` | GET | Return visible product detail | Yes | Product Detail |
| `/api/ingredients` | GET | List ingredients | Yes | Ingredients |
| `/api/ingredients/[id]` | GET | Return ingredient detail | Yes | Ingredients |
| `/api/ingredients/explain` | POST | Explain ingredient through validated provider/fallback flow | Yes | Ingredient Explanation |
| `/api/routines` | GET, POST | List and create routines | Yes | Routine Builder |
| `/api/routines/[id]` | GET, PATCH, DELETE | View, update, delete owned routine | Yes | Routine Builder |
| `/api/routines/[id]/analyze` | POST | Run routine safety analysis | Yes | Routine Analysis |
| `/api/routines/[id]/analyses` | GET | List routine analysis history | Yes | Routine Analysis |
| `/api/routine-logs` | GET, PUT | List logs by local date and upsert routine log | Yes | Routine Logs |
| `/api/skin-journal` | GET, POST | List and create journal entries | Yes | Skin Journal |
| `/api/skin-journal/[id]` | PATCH, DELETE | Update or delete owned journal entry | Yes | Skin Journal |

## 17. Testing and Validation Evidence

Validation commands used by the project:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=moderate
```

Current-task validation evidence for `TASK PORTFOLIO-001`:

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | Passed | ESLint completed successfully. |
| `npm run typecheck` | Passed | `tsc --noEmit` completed successfully. |
| `npm run test` | Passed | Vitest passed 60 test files and 603 tests. |
| `npm run build` | Passed | Production build passed with temporary non-secret placeholder environment values required by env validation. |
| `npm audit --omit=dev --audit-level=moderate` | Passed | Production dependency audit reported 0 vulnerabilities. |

Previously documented validation evidence:

- DEPLOY-002 production smoke test passed for MVP demo scope.
- QA-REGRESSION-001 validation passed after the LF/CRLF test stabilization.
- DEMO-DATA-001 validation passed after public seed/demo documentation updates.

## 18. Deployment Summary

Documented deployment evidence:

- Deployment target: Vercel.
- Production URL: https://skinwise-vn.vercel.app
- Production branch: `main`.
- Production commit: `db72e07`.
- Production smoke test: passed for MVP demo scope.
- Google OAuth production login: passed.
- MongoDB production/demo read/write through authenticated flows: passed.
- Production secrets are configured outside the repository in Vercel Project Settings.
- `.env.local` must not be committed, uploaded, shared, or included in source packages.

This is an MVP demo deployment, not a full commercial production release.

## 19. Challenges and Solutions

| Challenge | Solution |
|---|---|
| Managing MVP scope | Explicitly separated included MVP features from future/out-of-scope features. |
| Avoiding medical diagnosis claims | Wrote safety boundaries into product vision, AI contract, routine safety rules, and demo docs. |
| Separating public and user-owned data | Seeded public product/ingredient data, while user-owned demo data is created through authenticated UI. |
| Designing routine safety guidance safely | Deterministic rule engine runs before AI provider explanation/fallback. |
| Testing UI and utility behavior | Added unit/API/client/source checks and repeated lint/typecheck/test/build validation. |
| Handling environment validation | Centralized environment validation in `src/config/env.ts` and documented Vercel variables. |
| Preparing realistic demo data without fake dashboard logic | Improved public seed data and documented manual user-owned setup with a real demo account. |

## 20. What I Learned

From a BA perspective, this project helped me practice:

- defining a clear problem statement;
- separating user pain points from feature ideas;
- controlling MVP scope;
- writing user stories and acceptance criteria;
- connecting requirements to implementation evidence;
- preparing a demo story for reviewers.

From a technical perspective, this project helped me practice:

- building a modular Next.js App Router app;
- using TypeScript and Zod for safer contracts;
- designing MongoDB user ownership rules;
- protecting routes and APIs with Auth.js;
- writing DTO mappers and use-case/repository boundaries;
- validating with lint, typecheck, tests, build, audit, and smoke testing;
- preparing a deployment-ready portfolio project.

## 21. Limitations

The current MVP has honest portfolio/demo limitations:

- It is an MVP demo deployment, not a full commercial production release.
- Real OpenAI/Gemini providers are not implemented.
- The current demo provider is mock/validated.
- Product data is demo/seed-style catalogue data.
- Product CRUD and admin dashboard are not implemented.
- Image upload and AI face analysis are not implemented.
- Skin score and attractiveness scoring are not implemented.
- Marketplace, payment, subscription, and notifications are not implemented.
- E2E tests are config-only unless real specs are added later.
- The app provides educational support only and must not be used as medical diagnosis or treatment advice.

## 22. Future Roadmap

Short-term:

- final screenshots;
- final release package;
- optional E2E smoke test coverage;
- better dashboard analytics.

Medium-term:

- saved products;
- admin product management;
- improved product filtering;
- more routine safety rules.

Long-term:

- real AI provider integration with strict safety boundaries;
- notification reminders;
- optional image upload only with privacy safeguards;
- product recommendation support.

These roadmap items are future ideas and are not implemented in the current MVP unless explicitly stated elsewhere.

## 23. Interview Talking Points

| Question | Suggested Answer |
|---|---|
| What is this project about? | SkinWise VN is an educational skincare tracking MVP that helps users manage skin profile, products, routines, logs, journal entries, and dashboard summaries. |
| What problem does it solve? | It helps skincare beginners organize routine information and avoid confusion around product use and active combinations. |
| Who are the users? | The primary user is a beginner or intermediate skincare user. Secondary users are reviewers evaluating product thinking and technical implementation. |
| What was your MVP scope? | The MVP focused on profile, product browsing, routines, logs, routine safety analysis, journal, dashboard, and safe ingredient explanation. |
| How did you prioritize features? | I prioritized features that support the core user journey from profile setup to routine tracking and dashboard review. |
| What requirements did you define? | I defined user stories, acceptance criteria, functional requirements, non-functional requirements, API contracts, data model, and safety boundaries. |
| What are the main functional requirements? | Authentication, skin profile, product catalogue/detail, routine builder/logs/analysis, journal, dashboard, and ingredient explanation. |
| What are the non-functional requirements? | Security, privacy, validation, maintainability, safe educational copy, environment discipline, testability, and deployment readiness. |
| How did you validate the project? | Through lint, typecheck, unit tests, build, production dependency audit, deployment preparation, and production smoke testing. |
| What would you improve next? | I would prepare final screenshots, add E2E smoke tests, improve dashboard analytics, and later add safe saved-product/admin workflows. |
| What did you learn as a BA? | I learned to control scope, write clearer acceptance criteria, trace requirements to implementation, and prepare a reviewer-friendly demo. |
| What did you learn technically? | I learned full-stack structure with Next.js, TypeScript, MongoDB, Auth.js, Zod, API DTO boundaries, tests, and deployment preparation. |

## 24. Final Portfolio Summary

SkinWise VN is a strong portfolio project because it combines product thinking, BA documentation, and full-stack implementation. It shows a complete MVP user journey, clear safety boundaries, user-owned data protection, validation discipline, and a practical deployment/demo story.

For BA internship preparation, it demonstrates problem framing, user stories, acceptance criteria, functional and non-functional requirements, traceability, and demo communication.

For junior full-stack practice, it demonstrates Next.js App Router, TypeScript, MongoDB, Auth.js, Zod validation, modular code organization, API contracts, testing, and deployment readiness.
