# Feature Status Matrix - SkinWise VN MVP v1.2.6

Last updated: 2026-05-24

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
| Deployment | Completed | N/A | Vercel production URL | MongoDB production/demo read/write through authenticated flows | Local validation; production smoke | `TASK DEPLOY-002` completed MVP demo deployment at https://skinwise-vn.vercel.app; production smoke test passed |
| E2E Tests | Partially completed | N/A | Playwright config exists | N/A | Config only | `test:e2e` script exists, but no real E2E spec files are present in `tests/e2e` |
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
