# 03-feature-status-matrix.md

# Feature Status Matrix — SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

| Feature | Status | API | UI | DB | Tests | Notes |
|---|---|---|---|---|---|---|
| Documentation SDD | Done | N/A | N/A | N/A | N/A | v1.2.6 final freeze ready |
| Engineering guardrails | Done | N/A | N/A | N/A | N/A | ADRs, PR checklist, CI template, execution checklist |
| Next.js foundation | Done | N/A | Basic home placeholder | N/A | Smoke | Week 1 Task 1 initialized; Task 1.1 uses system font stack and Next.js 16 proxy convention |
| Tooling and UI foundation | Done | N/A | Shared UI primitives and state components | N/A | Smoke | shadcn/ui initialized under `src/shared/components/ui` |
| Environment validation | Done | N/A | N/A | N/A | Unit | Zod parser in `src/config/env.ts`; no DB/Auth/AI calls |
| Feature flags | Done | N/A | N/A | N/A | Smoke | Week 1 config only; incomplete features false |
| MongoDB connection | Done | N/A | N/A | Helper only | Unit | Server-only helper exists; no real DB call in unit tests |
| DB index script | Done | N/A | N/A | Index definitions | Unit | Repeatable `npm run db:indexes` implemented; real run requires `MONGODB_URI` |
| Testing foundation | Done | N/A | N/A | N/A | Smoke | Vitest and Playwright configs created; unit smoke test added |
| Auth foundation | Done | Auth.js route + `GET /api/me` | No sign-in UI | MongoDB Adapter gated + AppUserProfile lazy upsert | Unit | Week 1 Task 7 added current-user API without wrapping `/api/auth/*` |
| AppUserProfile foundation | Done | `GET /api/me` reflects onboarding state | N/A | `app_user_profiles` lazy upsert + onboarding completion marker | Unit | Successful SkinProfile POST marks onboarding complete server-side; no dashboard data integration |
| Protected dashboard shell | Done | N/A | Protected `/dashboard` shell with placeholders plus Skin Profile and Routines nav links | N/A | Unit | Routines navigation now points to `/routines`; no dashboard data fetches |
| Skin Profile | Done | `/api/skin-profile` GET/POST/PATCH/DELETE | First-time onboarding at `/onboarding/skin-profile`; main view/edit route at `/skin-profile` | User-scoped `skin_profiles` repository | Unit/API/source checks | `/skin-profile` loads with GET and updates with PATCH only; onboarding POST still marks onboarding complete |
| Product mini database | Not Started | No | No | No | No | Seed spec added |
| Ingredient knowledge base | Not Started | No | No | No | No | Seed spec added |
| Routine API foundation | Done | `/api/routines` GET/POST; `/api/routines/[id]` GET/PATCH/DELETE | Used by `/routines` UI | User-scoped `routines` repository and indexes | Unit/API/source checks | `userId` is session-derived, `_id` maps to `id`, `stepId` is server-generated, no Product snapshot lookup |
| Routine Builder UI foundation | Done | Existing Routine API only | Protected `/routines` list/create/edit/delete UI | Routine collection foundation exists | Unit/source checks | Uses `customProductName`; no Product picker, Product module, detail route, analysis route, or dashboard data integration |
| RoutineLog | Not Started | No | No | No | No | Must use upsert |
| SkinJournal | Not Started | No | No | No | No | One entry per localDate |
| Routine Safety Engine | Not Started | No | No | No | No | Rule engine before AI |
| Routine Analysis API | Not Started | No | No | No | No | `POST /api/routines/:id/analyze` |
| AI Provider Abstraction | Not Started | No | N/A | No | No | Server-only |
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
