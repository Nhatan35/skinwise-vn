# Feature Status Matrix - SkinWise VN MVP v1.2.6

Last updated: 2026-05-25

Status categories used in this file:

```txt
Completed
Partially completed
Not started
Out of scope
```

| Feature | Status | API | UI | DB | Tests | Notes |
|---|---|---|---|---|---|---|
| Authentication | Completed | Auth.js `/api/auth/*`; `GET /api/me` | Auth.js default sign-in flow; protected dashboard shell | Auth.js MongoDB Adapter plus app user profile | Unit; production smoke | Google OAuth production login passed for MVP demo |
| Skin Profile | Completed | `/api/skin-profile` GET/POST/PATCH/DELETE | `/onboarding/skin-profile`, `/skin-profile` | `skin_profiles`; app onboarding marker | Unit/API/source checks; production smoke | User-scoped profile create/view/edit/delete passed MVP demo smoke test |
| Product Catalogue | Completed | `GET /api/products` | `/products`; product picker in routines; product selection in journal | `products` collection and indexes | Unit/API/client/source checks; production smoke | Read-only visible product list with search/filter support; demo/seed-style catalogue data |
| Product Detail UI | Completed | `GET /api/products/[id]` | `/products/[id]` | Existing product collection | Unit/client/source checks; production smoke | Product detail page passed MVP demo smoke test |
| Ingredients | Completed | `GET /api/ingredients`, `GET /api/ingredients/[id]` | Not started as dedicated UI | `ingredients` collection and indexes | Unit/API/source checks | Authenticated read-only ingredient API exists; no ingredient UI yet |
| Ingredient Explanation AI API | Completed | `POST /api/ingredients/explain` | No dedicated UI | No persistence | Unit/API/source checks | Uses provider abstraction and validated mock provider with deterministic fallback; no external AI calls |
| Routine Builder | Completed | `/api/routines` GET/POST; `/api/routines/[id]` GET/PATCH/DELETE | `/routines` | `routines` collection and indexes | Unit/API/source checks; production smoke | Create routine, add product, and saved routine display passed MVP demo smoke test |
| Routine Analysis | Completed | `POST /api/routines/[id]/analyze`; `GET /api/routines/[id]/analyses` | Analysis panel inside `/routines` | `routine_analyses`; `rate_limits` | Unit/API/source checks; production smoke | Deterministic/mock provider flow passed MVP demo smoke test; no real OpenAI/Gemini key required |
| Routine Logs | Completed | `GET /api/routine-logs`; `PUT /api/routine-logs` | Daily controls inside `/routines` | `routine_logs` with unique date/routine index | Unit/API/client/source checks; production smoke | Routine log status update and dashboard reflection passed MVP demo smoke test |
| Skin Journal | Completed | `GET`/`POST /api/skin-journal`; `PATCH`/`DELETE /api/skin-journal/[id]` | `/journal` timeline with create/edit/delete and product labels | `skin_journals` with user/localDate unique index | Unit/API/client/source checks; production smoke | Create/edit/delete and dashboard latest journal summary passed MVP demo smoke test |
| Dashboard | Completed | `GET /api/dashboard?localDate=YYYY-MM-DD` | `/dashboard` | Reuses user-scoped collections | Unit/API/source checks; production smoke | Authenticated dashboard and user data summaries passed MVP demo smoke test |
| AI Provider Abstraction | Completed | Used by routine analysis and ingredient explanation use cases | N/A | N/A | Unit | `MockAIProvider`, `ValidatedAIProvider`, provider factory, output validation, and fallback behavior exist |
| Real AI provider integration | Not started | OpenAI/Gemini providers throw configuration errors | N/A | N/A | Unit coverage for unsupported state | Real OpenAI/Gemini providers are not implemented; MVP demo uses `AI_PROVIDER="mock"` |
| Deployment | Partially completed | N/A | Vercel target configuration and deployment docs | Environment-dependent MongoDB configuration | Build/audit/local validation; production re-verification pending | Previous DEPLOY-002 notes document an MVP demo deployment, but this E2E cleanup did not re-verify Vercel production; run `DEPLOY-VERIFY-001` before claiming current deployment readiness |
| Clean Package Validation | Completed | N/A | N/A | N/A | Unit/source checks | `TASK QA-REGRESSION-001` fixed LF/CRLF line-ending sensitivity in the Routine Builder unit test and added `.gitattributes`; no feature scope changed |
| Demo Data and Demo Script | Completed | Public seed data through `scripts/seed.ts`; user-owned setup through existing APIs/UI | Authenticated manual walkthrough | Public `products` and `ingredients`; user-owned collections stay scoped by real authenticated user | Seed validation through script schemas; full validation commands | `TASK DEMO-DATA-001` prepared portfolio-ready public demo data and documented manual setup for skin profile, routines, logs, journal, and dashboard without fake users or new feature scope |
| Portfolio Documentation | Completed | Verified API methods documented from source | Case study, demo script, screenshot checklist | N/A | Current-task validation; documentation review | `TASK PORTFOLIO-001` prepared BA/full-stack portfolio materials without adding feature scope |
| Final Release Package | Completed | N/A | README, final checklist, release notes | N/A | Final validation; package hygiene check | `TASK FINAL-RELEASE-001` prepared the portfolio-ready release documentation package without adding feature scope |
| E2E Tests | Partially completed | N/A | Playwright smoke specs exist | N/A | Playwright smoke tests | Public landing page and unauthenticated protected-route redirects are covered; authenticated E2E flows and real Google OAuth login are not tested in CI |
| Production monitoring | Not started | N/A | N/A | N/A | N/A | Not configured |
| Product submission / Product CRUD | Not started | `POST /api/products` not implemented | No UI | Existing product collection only | N/A | Future/admin workflow only |
| Ingredient UI | Not started | Ingredient API exists | No `/ingredients` UI route | Existing ingredient collection | N/A | Future UI task |
| Notifications | Out of scope | No | No | No | No | Reserved future capability |
| Image Upload | Out of scope | No | No | No | No | Future only; do not expose image fields in MVP APIs |
| Marketplace | Out of scope | No | No | No | No | Not part of MVP |
| Payment/Subscription | Out of scope | No | No | No | No | Not part of MVP |
| AI Face Analysis | Out of scope | No | No | No | No | Not allowed in MVP |
| Skin Score | Out of scope | No | No | No | No | Avoids appearance pressure |
| Medical Diagnosis | Out of scope | No | No | No | No | SkinWise VN is educational only |

## Update Rule

Update this file whenever a feature starts, becomes partially completed, is completed, is deliberately moved out of scope, or when API/UI/DB/test status changes.
