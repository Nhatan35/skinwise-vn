# 03-feature-status-matrix.md

# Feature Status Matrix — SkinWise VN MVP v1.2.6

Last updated: 2026-05-23

| Feature | Status | API | UI | DB | Tests | Notes |
|---|---|---|---|---|---|---|
| Documentation SDD | Done | N/A | N/A | N/A | N/A | v1.2.6 final freeze ready |
| Engineering guardrails | Done | N/A | N/A | N/A | N/A | ADRs, PR checklist, CI template, execution checklist |
| Next.js foundation | Done | N/A | Basic home placeholder | N/A | Smoke | Week 1 Task 1 initialized; Task 1.1 uses system font stack and Next.js 16 proxy convention |
| Tooling and UI foundation | Done | N/A | Shared UI primitives and state components | N/A | Smoke | shadcn/ui initialized under `src/shared/components/ui` |
| Environment validation | Done | N/A | N/A | N/A | Unit | Zod parser in `src/config/env.ts`; no DB/Auth/AI calls |
| Feature flags | Done | N/A | N/A | N/A | Smoke | Week 1 config only; incomplete features false |
| MongoDB connection | Done | N/A | N/A | Shared helper + local runtime check | Unit + local runtime | Server-only helper exists; local `npm run db:indexes` verified MongoDB Atlas connection and 30 indexes ensured |
| DB index script | Done | N/A | N/A | Index definitions | Unit + local runtime | Repeatable `npm run db:indexes` implemented; script loads `.env.local` and has been verified against MongoDB Atlas locally |
| Testing foundation | Done | N/A | N/A | N/A | Smoke | Vitest and Playwright configs created; unit smoke test added |
| Auth foundation | Done | Auth.js route + `GET /api/me` | No sign-in UI | MongoDB Adapter for identity/account data + JWT sessions + AppUserProfile lazy upsert | Unit + local OAuth runtime | Uses shared MongoDB client provider, process-level DNS preload for local SRV lookup, and `session.strategy = "jwt"` |
| AppUserProfile foundation | Done | `GET /api/me` reflects onboarding state | N/A | `app_user_profiles` lazy upsert + onboarding completion marker | Unit | Successful SkinProfile POST marks onboarding complete server-side; no dashboard data integration |
| Protected dashboard shell | Done | `GET /api/dashboard?localDate=YYYY-MM-DD` | Protected `/dashboard` renders real data cards plus Skin Profile and Routines nav links | Existing Skin Profile, Routine, RoutineLog, and Routine Analysis data | Unit/API/source checks | DB-001 replaced placeholder cards with data-driven dashboard summary; advanced analytics/charts are not implemented |
| Skin Profile | Done | `/api/skin-profile` GET/POST/PATCH/DELETE | First-time onboarding at `/onboarding/skin-profile`; main view/edit route at `/skin-profile` | User-scoped `skin_profiles` repository | Unit/API/source checks | `/skin-profile` loads with GET and updates with PATCH only; onboarding POST still marks onboarding complete |
| Product mini database | Done | `GET /api/products`; `GET /api/products/[id]` | `/products` catalogue UI plus Routine Builder Product Picker and SkinJournal product selection/name resolution | `products` collection helpers and canonical indexes | Unit/API/index/client/source checks | Read-only authenticated foundation; returns only reviewed/verified products from `data.items`; `/products` supports search/filtering via existing Product API params and is active in dashboard navigation; no Product CRUD, POST API, product submission, includeMine UI, admin, saved product library, seed script, external APIs, AI recommendation, skin score, or image upload |
| Ingredient knowledge base | Done | `GET /api/ingredients`; `GET /api/ingredients/[id]`; `POST /api/ingredients/explain` | No | `ingredients` collection helpers and canonical indexes | Unit/API/index checks | Read-only authenticated foundation plus AI-007 ingredient explanation endpoint; no admin UI, seed script, or safety classifier integration |
| Routine API foundation | Done | `/api/routines` GET/POST; `/api/routines/[id]` GET/PATCH/DELETE | Used by `/routines` UI | User-scoped `routines` repository and indexes | Unit/API/source checks | `userId` is session-derived, `_id` maps to `id`, `stepId` is server-generated; selected product steps get server-populated snapshots |
| Routine Builder UI foundation | Done | Existing Routine API + Product API + Routine Analysis API + RoutineLog API | Protected `/routines` list/create/edit/delete/analyze/log UI with Product Picker | Routine collection foundation exists | Unit/source checks | Supports visible product selection via `/api/products?limit=50`, manual `customProductName`, analysis controls, and daily RoutineLog controls; no Product detail route or analysis route |
| Routine Product Picker + Snapshot Population | Done | Routine create/update calls Product use-case for selected visible `productId`; invalid product returns `VALIDATION_ERROR` | Product Picker inside existing Routine Builder; manual fallback preserved | Routine steps persist `productId` plus server-owned Product snapshots | Unit/API/source checks | Client never submits snapshot fields or client-owned fields; Product API response shape remains `data.items` |
| RoutineLog | Done | `GET /api/routine-logs?localDate=YYYY-MM-DD`; `PUT /api/routine-logs` | `/routines` status badge + completed/skipped/partial controls with step checklist | `routine_logs` collection helper + unique/query indexes | Unit/API/repository/use-case/source/helper checks | Backend foundation plus RL-002 UI integration implemented; canonical PUT upsert by `userId + routineId + localDate`; UI uses browser localDate + timezone; dashboard now consumes today's RoutineLog summary through DB-001 |
| Dashboard Data Integration | Done | `GET /api/dashboard?localDate=YYYY-MM-DD` | `/dashboard` cards for Skin Profile, today's routine progress, routine counts, latest journal, latest analysis, and next actions | Reuses existing user-scoped collections including SkinJournal | Unit/API/source checks | Uses browser localDate from client; latestJournal is DTO-safe with notes preview only; next action now prioritizes today's journal after routine logging; no weekly/monthly charts, advanced streaks, AI insights, or journal analytics |
| SkinJournal | Done | `POST /api/skin-journal`; `GET /api/skin-journal`; `PATCH /api/skin-journal/[id]`; `DELETE /api/skin-journal/[id]`; consumes `GET /api/products?limit=50` in UI | `/journal` timeline UI with list/create/edit/delete, product selection, and readable product labels | `skin_journals` collection helper and canonical indexes; no journal product snapshots | Unit/API/index/source/client/helper checks | Authenticated, user-scoped, one entry per localDate, duplicate creates return `CONFLICT`; `productsUsed` remains product ID strings, Product API list is parsed from `data.items`, unresolved products display `Unknown product`, future image fields remain excluded; no image upload, AI journal analysis, calendar heatmap, analytics view, saved product library, Product CRUD UI, or backend product ownership changes |
| Routine Safety Engine | Done | Used by Routine Analysis API | No | No | Unit | Deterministic engine under `src/domain/routine-safety`; still independent from AI/provider code |
| Routine Analysis API | Done | `POST /api/routines/:id/analyze`; `GET /api/routines/:id/analyses`; per-user 429 rate limit on analyze | No | `routine_analyses` repository stores optional internal provider failure reason; `rate_limits` collection with unique key + TTL indexes | Unit/API/source checks | Runs Routine Safety Engine first, then attempts `getAIProvider().analyzeRoutine()` through `ValidatedAIProvider`; provider success is mapped, safety-guarded, and saved as `provider_used`; provider failures save deterministic `fallback_used` with safe internal fallback observability; real OpenAI/Gemini not implemented and external AI calls inactive |
| Routine Analysis UI foundation | Done | Uses `POST /api/routines/:id/analyze` and `GET /api/routines/:id/analyses` | Per-routine panel inside existing `/routines` page | No new DB | Unit/source checks | Displays API-provided DTO data only; no new routes, client rules, real AI, or dashboard integration |
| AI Provider Abstraction | Done | `POST /api/ingredients/explain` consumes `getAIProvider().explainIngredient()` through module use case | N/A | No | Unit | Server-only `src/infrastructure/ai`; `MockAIProvider`, `ValidatedAIProvider`, `getAIProvider()`, safe Routine Analysis provider failure classification, and Ingredient Explanation fallback usage are implemented; OpenAI/Gemini not implemented; no external AI API calls; no AI key required |
| AI Structured Output Validation | Done | No public API | N/A | No | Unit | Strict Zod validation for current AIProvider output types; invalid output throws `AIProviderResponseError`; no external AI call |
| AI Provider Flow Validation | Done | No public API | N/A | No | Unit | `getAIProvider()` wraps successfully constructed providers with `ValidatedAIProvider`; mock mode returns `ValidatedAIProvider` around `MockAIProvider` |
| AI Provider Routine Analysis Contract Mapping | Done | No public API | N/A | No | Unit | Validated provider routine analysis output maps into product-facing `RoutineAnalysisResult` without exposing `providerMetadata` or `educationalNotes`; Routine Analysis use case now consumes this mapper before applying the deterministic safety guard |
| Ingredient Explanation | Done | `POST /api/ingredients/explain`; authenticated; rate-limited; strict request validation | No | No persistence | Unit/API/source checks | Uses `getAIProvider().explainIngredient()` through `ValidatedAIProvider`, maps provider output to public DTO, returns deterministic fallback with `source = "fallback"` on provider/mapping failure, and does not expose provider metadata, educational notes, raw provider errors, or provider failure reasons |
| Deployment | Not Started | N/A | N/A | N/A | No | Use deployment checklist |
| Notifications | Out of Scope | No | No | No | No | Reserved future only |
| Image Upload | Out of Scope | No | No | No | No | Future only |
| Marketplace | Out of Scope | No | No | No | No | Not MVP |
| AI Face Analysis | Out of Scope | No | No | No | No | Not allowed in MVP |
| Skin Score | Out of Scope | No | No | No | No | Avoid appearance pressure |

## Status definitions

```txt
Not Started = no implementation yet
In Progress = partially implemented
Done = implemented and documented
Blocked = cannot proceed due to dependency
Out of Scope = intentionally excluded from MVP
```

## Update rule

Update this file whenever:

- a feature starts;
- a feature becomes partially implemented;
- API/UI/DB/test status changes;
- a feature is deliberately moved out of scope;
- a new feature is proposed and classified.
