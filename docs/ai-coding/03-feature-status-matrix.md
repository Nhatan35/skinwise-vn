# 03-feature-status-matrix.md

# Feature Status Matrix — SkinWise VN MVP v1.2.6

Last updated: 2026-05-22

| Feature | Status | API | UI | DB | Tests | Notes |
|---|---|---|---|---|---|---|
| Documentation SDD | Done | N/A | N/A | N/A | N/A | v1.2.6 final freeze ready |
| Engineering guardrails | Done | N/A | N/A | N/A | N/A | ADRs, PR checklist, CI template, execution checklist |
| Next.js foundation | Done | N/A | Basic home placeholder | N/A | Smoke | Week 1 Task 1 initialized; Task 1.1 uses system font stack and Next.js 16 proxy convention |
| Tooling and UI foundation | Done | N/A | Shared UI primitives and state components | N/A | Smoke | shadcn/ui initialized under `src/shared/components/ui` |
| Environment validation | Done | N/A | N/A | N/A | Unit | Zod parser in `src/config/env.ts`; no DB/Auth/AI calls |
| Feature flags | Done | N/A | N/A | N/A | Smoke | Week 1 config only; incomplete features false |
| MongoDB connection | Done | N/A | N/A | Helper only | Unit | Server-only helper exists; no real DB call in unit tests |
| DB index script | Done | N/A | N/A | Index definitions | Unit | Repeatable `npm run db:indexes` implemented, including rate limit unique/TTL indexes; real run requires `MONGODB_URI` |
| Testing foundation | Done | N/A | N/A | N/A | Smoke | Vitest and Playwright configs created; unit smoke test added |
| Auth foundation | Done | Auth.js route + `GET /api/me` | No sign-in UI | MongoDB Adapter gated + AppUserProfile lazy upsert | Unit | Week 1 Task 7 added current-user API without wrapping `/api/auth/*` |
| AppUserProfile foundation | Done | `GET /api/me` reflects onboarding state | N/A | `app_user_profiles` lazy upsert + onboarding completion marker | Unit | Successful SkinProfile POST marks onboarding complete server-side; no dashboard data integration |
| Protected dashboard shell | Done | `GET /api/dashboard?localDate=YYYY-MM-DD` | Protected `/dashboard` renders real data cards plus Skin Profile and Routines nav links | Existing Skin Profile, Routine, RoutineLog, and Routine Analysis data | Unit/API/source checks | DB-001 replaced placeholder cards with data-driven dashboard summary; advanced analytics/charts are not implemented |
| Skin Profile | Done | `/api/skin-profile` GET/POST/PATCH/DELETE | First-time onboarding at `/onboarding/skin-profile`; main view/edit route at `/skin-profile` | User-scoped `skin_profiles` repository | Unit/API/source checks | `/skin-profile` loads with GET and updates with PATCH only; onboarding POST still marks onboarding complete |
| Product mini database | Done | `GET /api/products`; `GET /api/products/[id]` | Consumed by Routine Builder Product Picker only | `products` collection helpers and canonical indexes | Unit/API/index checks | Read-only authenticated foundation; returns only reviewed/verified products; no Product UI page, POST API, includeMine, admin, seed script, external APIs, or image upload |
| Ingredient knowledge base | Done | `GET /api/ingredients`; `GET /api/ingredients/[id]` | No | `ingredients` collection helpers and canonical indexes | Unit/API/index checks | Read-only authenticated foundation; no Ingredient explanation AI API, admin UI, seed script, or safety classifier integration |
| Routine API foundation | Done | `/api/routines` GET/POST; `/api/routines/[id]` GET/PATCH/DELETE | Used by `/routines` UI | User-scoped `routines` repository and indexes | Unit/API/source checks | `userId` is session-derived, `_id` maps to `id`, `stepId` is server-generated; selected product steps get server-populated snapshots |
| Routine Builder UI foundation | Done | Existing Routine API + Product API + Routine Analysis API + RoutineLog API | Protected `/routines` list/create/edit/delete/analyze/log UI with Product Picker | Routine collection foundation exists | Unit/source checks | Supports visible product selection via `/api/products?limit=50`, manual `customProductName`, analysis controls, and daily RoutineLog controls; no Product UI page, detail route, or analysis route |
| Routine Product Picker + Snapshot Population | Done | Routine create/update calls Product use-case for selected visible `productId`; invalid product returns `VALIDATION_ERROR` | Product Picker inside existing Routine Builder; manual fallback preserved | Routine steps persist `productId` plus server-owned Product snapshots | Unit/API/source checks | Client never submits snapshot fields or client-owned fields; Product API response shape remains `data.items` |
| RoutineLog | Done | `GET /api/routine-logs?localDate=YYYY-MM-DD`; `PUT /api/routine-logs` | `/routines` status badge + completed/skipped/partial controls with step checklist | `routine_logs` collection helper + unique/query indexes | Unit/API/repository/use-case/source/helper checks | Backend foundation plus RL-002 UI integration implemented; canonical PUT upsert by `userId + routineId + localDate`; UI uses browser localDate + timezone; dashboard now consumes today's RoutineLog summary through DB-001 |
| Dashboard Data Integration | Done | `GET /api/dashboard?localDate=YYYY-MM-DD` | `/dashboard` cards for Skin Profile, today's routine progress, routine counts, latest analysis, and next actions | Reuses existing user-scoped collections | Unit/API/source checks | Uses browser localDate from client; no weekly/monthly charts, advanced streaks, AI insights, or SkinJournal |
| SkinJournal | Not Started | No | No | No | No | One entry per localDate |
| Routine Safety Engine | Done | Used by Routine Analysis API | No | No | Unit | Deterministic engine under `src/domain/routine-safety`; still independent from AI/provider code |
| Routine Analysis API | Done | `POST /api/routines/:id/analyze`; `GET /api/routines/:id/analyses`; per-user 429 rate limit on analyze | No | `routine_analyses` repository; `rate_limits` collection with unique key + TTL indexes | Unit/API/source checks | Deterministic fallback only; stores all rule results internally and returns triggered warnings only; real AI not implemented |
| Routine Analysis UI foundation | Done | Uses `POST /api/routines/:id/analyze` and `GET /api/routines/:id/analyses` | Per-routine panel inside existing `/routines` page | No new DB | Unit/source checks | Displays API-provided DTO data only; no new routes, client rules, real AI, or dashboard integration |
| AI Provider Abstraction | Done | No public API | N/A | No | Unit | Server-only `src/infrastructure/ai`; `MockAIProvider` and `getAIProvider()` implemented; OpenAI/Gemini not implemented; no external AI API calls; no AI key required |
| AI Structured Output Validation | Done | No public API | N/A | No | Unit | Strict Zod validation for current AIProvider output types; no external AI call |
| Ingredient Explanation | Not Started | No | No | No | No | Safety classifier when needed |
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
