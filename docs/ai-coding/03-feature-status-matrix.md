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
| Authentication | Completed | Auth.js `/api/auth/*`; `GET /api/me` | Auth.js default sign-in flow; protected dashboard shell | Auth.js MongoDB Adapter plus app user profile | Unit | Uses JWT session strategy with MongoDB Adapter for identity/account persistence |
| Skin Profile | Completed | `/api/skin-profile` GET/POST/PATCH/DELETE | `/onboarding/skin-profile`, `/skin-profile` | `skin_profiles`; app onboarding marker | Unit/API/source checks | User-scoped profile create/view/edit/delete; onboarding POST marks onboarding complete |
| Product Catalogue | Completed | `GET /api/products` | `/products`; product picker in routines; product selection in journal | `products` collection and indexes | Unit/API/client/source checks | Read-only visible product list with search/filter support |
| Product Detail UI | Completed | `GET /api/products/[id]` | `/products/[id]` | Existing product collection | Unit/client/source checks | Implemented by `PRODUCT-UI-002 - Implement Product Detail UI` |
| Ingredients | Completed | `GET /api/ingredients`, `GET /api/ingredients/[id]` | Not started as dedicated UI | `ingredients` collection and indexes | Unit/API/source checks | Authenticated read-only ingredient API exists; no ingredient UI yet |
| Ingredient Explanation AI API | Completed | `POST /api/ingredients/explain` | No dedicated UI | No persistence | Unit/API/source checks | Uses provider abstraction and validated mock provider with deterministic fallback; no external AI calls |
| Routine Builder | Completed | `/api/routines` GET/POST; `/api/routines/[id]` GET/PATCH/DELETE | `/routines` | `routines` collection and indexes | Unit/API/source checks | Supports create/edit/delete, product picker, snapshots, and manual product fallback |
| Routine Analysis | Completed | `POST /api/routines/[id]/analyze`; `GET /api/routines/[id]/analyses` | Analysis panel inside `/routines` | `routine_analyses`; `rate_limits` | Unit/API/source checks | Deterministic rule engine runs before provider explanation; provider failure uses fallback |
| Routine Logs | Completed | `GET /api/routine-logs`; `PUT /api/routine-logs` | Daily controls inside `/routines` | `routine_logs` with unique date/routine index | Unit/API/client/source checks | Upsert by user/routine/localDate; dashboard consumes today's status |
| Skin Journal | Completed | `GET`/`POST /api/skin-journal`; `PATCH`/`DELETE /api/skin-journal/[id]` | `/journal` timeline with create/edit/delete and product labels | `skin_journals` with user/localDate unique index | Unit/API/client/source checks | Private, user-scoped, one entry per localDate; no image upload or AI journal analysis |
| Dashboard | Completed | `GET /api/dashboard?localDate=YYYY-MM-DD` | `/dashboard` | Reuses user-scoped collections | Unit/API/source checks | Shows profile, routines, today log progress, latest journal, latest analysis, and next action |
| AI Provider Abstraction | Completed | Used by routine analysis and ingredient explanation use cases | N/A | N/A | Unit | `MockAIProvider`, `ValidatedAIProvider`, provider factory, output validation, and fallback behavior exist |
| Real AI provider integration | Not started | OpenAI/Gemini providers throw configuration errors | N/A | N/A | Unit coverage for unsupported state | Production AI integration is not verified |
| Deployment | Partially completed | N/A | N/A | N/A | Local validation and clean package verification | `TASK DEPLOY-001` prepared Vercel docs, env checklist, Node 20 marker, and clean zip; actual Vercel deployment and production smoke test are not run |
| E2E Tests | Partially completed | N/A | Playwright config exists | N/A | Config only | `test:e2e` script exists, but no real E2E spec files are present in `tests/e2e` |
| Production monitoring | Not started | N/A | N/A | N/A | N/A | Not configured |
| Product submission / Product CRUD | Not started | `POST /api/products` not implemented | No UI | Existing product collection only | N/A | Future/admin workflow only |
| Ingredient UI | Not started | Ingredient API exists | No `/ingredients` UI route | Existing ingredient collection | N/A | Future UI task |
| Notifications | Out of scope | No | No | No | No | Reserved future capability |
| Image Upload | Out of scope | No | No | No | No | Future only; do not expose image fields in MVP APIs |
| Marketplace | Out of scope | No | No | No | No | Not part of MVP |
| AI Face Analysis | Out of scope | No | No | No | No | Not allowed in MVP |
| Skin Score | Out of scope | No | No | No | No | Avoids appearance pressure |
| Medical Diagnosis | Out of scope | No | No | No | No | SkinWise VN is educational only |

## Update Rule

Update this file whenever a feature starts, becomes partially completed, is completed, is deliberately moved out of scope, or when API/UI/DB/test status changes.
