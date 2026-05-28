# Feature Status Matrix - SkinWise VN MVP v1.2.6

Last updated: 2026-05-28

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
| Skin Profile | Completed | `/api/skin-profile` GET/POST/PATCH/DELETE | `/onboarding/skin-profile`, `/skin-profile` | `skin_profiles`; app onboarding marker | Unit/API/source checks; production smoke; authenticated E2E spec | User-scoped profile create/view/edit/delete passed MVP demo smoke test; Playwright covers create/update through safe test auth |
| Product Catalogue | Completed | `GET /api/products` | `/products`; product picker in routines; product selection in journal | `products` collection and indexes | Unit/API/client/source checks; production smoke; authenticated E2E spec | Read-only visible product list with search/filter support; deterministic local/test product seed data supports Playwright |
| Product Detail UI | Completed | `GET /api/products/[id]` | `/products/[id]` | Existing product collection | Unit/client/source checks; production smoke; authenticated E2E spec | Product detail page passed MVP demo smoke test; Playwright covers detail navigation from the catalogue |
| Saved Products | Completed | `GET`/`POST /api/saved-products`; `DELETE /api/saved-products/[productId]` | `/saved-products`; Save/Saved actions in product catalogue and detail | `saved_products` with unique `userId + productId` index | Unit/API/client/repository/source checks; authenticated E2E spec | User-owned product bookmarks with idempotent save/remove; no product schema change, marketplace, cart, recommendation, or sharing |
| Ingredient Library | Completed | `GET /api/ingredients`, `GET /api/ingredients/[id]` | `/ingredients`, `/ingredients/[id]` | `ingredients` collection and indexes | Unit/API/client/source checks; authenticated E2E spec | Authenticated read-only ingredient library with q search, detail view, and safe educational copy |
| Ingredient Explanation | Completed | `POST /api/ingredients/explain` | Explanation panel inside `/ingredients/[id]` | No persistence | Unit/API/client/source checks; authenticated E2E spec | Uses provider abstraction and validated mock provider with deterministic fallback; no external AI calls or explanation persistence |
| Routine Builder | Completed | `/api/routines` GET/POST; `/api/routines/[id]` GET/PATCH/DELETE | `/routines` | `routines` collection and indexes | Unit/API/source checks; production smoke; authenticated E2E spec | Playwright covers authenticated routine creation with deterministic E2E data and stable selectors |
| Routine Analysis | Completed | `POST /api/routines/[id]/analyze`; `GET /api/routines/[id]/analyses` | Analysis panel inside `/routines` | `routine_analyses`; `rate_limits` | Unit/API/source checks; production smoke; authenticated E2E spec | Playwright covers authenticated routine analysis using the existing mock/deterministic provider path; no real OpenAI/Gemini key required |
| Routine Logs | Completed | `GET /api/routine-logs`; `PUT /api/routine-logs`; `DELETE /api/routine-logs/:id` | Daily controls inside `/routines`; dedicated `/routine-logs/today` checklist page with update and delete support | `routine_logs` with unique date/routine index | Unit/API/client/source checks; production smoke; authenticated E2E spec | Playwright covers Today Checklist access, completed status update, routine log deletion through UI, and protected `/routine-logs/today` redirect smoke without adding analytics, streaks, or new collections |
| Skin Journal | Completed | `GET`/`POST /api/skin-journal`; `PATCH`/`DELETE /api/skin-journal/[id]` | `/journal` timeline with create/edit/delete and product labels | `skin_journals` with user/localDate unique index | Unit/API/client/source checks; production smoke; authenticated E2E spec | Playwright covers authenticated Skin Journal create/edit/delete and dashboard latest journal reflection |
| Dashboard | Completed | `GET /api/dashboard?localDate=YYYY-MM-DD` | `/dashboard` | Reuses user-scoped collections | Unit/API/source checks; production smoke; authenticated E2E spec | Playwright covers stable dashboard card visibility and reflection after user-owned routine, log, journal, skin profile, and analysis activity |
| Settings / Data Control | Completed in source | `GET /api/me`; `POST /api/account/deletion-request`; `DELETE /api/routine-logs/:id` | Protected `/settings` page, account overview, data management cards, account deletion request, routine log delete support | `app_user_profiles.accountDeletionRequestedAt`; user-owned `routine_logs` | Unit/API/source checks; authenticated E2E spec | Playwright covers settings account overview, data cards, protected `/settings` redirect smoke, and MVP-safe account deletion request marker. No hard-delete Auth.js identity, no bulk delete, no export, no GDPR compliance claims |
| AI Provider Abstraction | Completed | Used by routine analysis and ingredient explanation use cases | N/A | N/A | Unit | `MockAIProvider`, `ValidatedAIProvider`, provider factory, output validation, and fallback behavior exist |
| Real AI provider integration | Not started | OpenAI/Gemini providers throw configuration errors | N/A | N/A | Unit coverage for unsupported state | Real OpenAI/Gemini providers are not implemented; MVP demo uses `AI_PROVIDER="mock"` |
| Runtime baseline | Partially completed | N/A | Node 24.x / npm 11.x documented for local, CI, and deployment | N/A | Current feature local validation passed, including authenticated E2E against the safe local MongoDB test URI | `.nvmrc`, `package.json` engines, GitHub Actions, README, and deployment docs target Node 24.x / npm 11.x; external deployment verification remains separate |
| Deployment | Partially completed | N/A | Vercel target configuration and deployment docs | Environment-dependent MongoDB configuration | Build/audit/local validation; partial public smoke | DEPLOY-VERIFY-001 verified historical local Node 20 validation plus public URL and unauthenticated protected-route redirects. RUNTIME-001 updates the current baseline to Node 24.x / npm 11.x and requires full rerun validation; Vercel env/logs, Google OAuth login, authenticated dashboard, MongoDB read/write, sign-out, and runtime logs still need external evidence |
| Clean Package Validation | Completed | N/A | N/A | N/A | Unit/source checks | `TASK QA-REGRESSION-001` fixed LF/CRLF line-ending sensitivity in the Routine Builder unit test and added `.gitattributes`; no feature scope changed |
| Demo Data and Demo Script | Completed | Public seed data through `scripts/seed.ts`; user-owned setup through existing APIs/UI | Authenticated manual walkthrough | Public `products` and `ingredients`; user-owned collections stay scoped by real authenticated user | Seed validation through script schemas; full validation commands | `TASK DEMO-DATA-001` prepared portfolio-ready public demo data and documented manual setup for skin profile, routines, logs, journal, and dashboard without fake users or new feature scope |
| Portfolio Documentation | Completed | Verified API methods documented from source | Case study, demo script, screenshot checklist | N/A | Current-task validation; documentation review | `TASK PORTFOLIO-001` prepared BA/full-stack portfolio materials without adding feature scope |
| Final Release Package | Completed | N/A | README, final checklist, release notes | N/A | Final validation; package hygiene check | `TASK FINAL-RELEASE-001` prepared the portfolio-ready release documentation package without adding feature scope |
| E2E Tests | Partially completed | Test-only Auth.js Credentials provider enabled only for `APP_ENV="test"` and `E2E_TEST_AUTH="true"` | Playwright smoke specs exist | Safe local/test MongoDB URI plus deterministic product/ingredient seed and E2E-user-owned data reset command | Playwright smoke/authenticated specs require local MongoDB and the project Node/npm baseline | Core MVP journey now has authenticated Playwright coverage in source: Routine Builder, Routine Analysis, Today Checklist, Routine Log delete, Skin Journal, Settings/Data Control, account deletion request, and Dashboard reflection. Real Google OAuth login is still not tested in CI |
| Production monitoring | Not started | N/A | N/A | N/A | N/A | Not configured |
| Product submission / Product CRUD | Not started | `POST /api/products` not implemented | No UI | Existing product collection only | N/A | Future/admin workflow only |
| Notifications | Out of scope | No | No | No | No | Reserved future capability |
| Image Upload | Out of scope | No | No | No | No | Future only; do not expose image fields in MVP APIs |
| Marketplace | Out of scope | No | No | No | No | Not part of MVP |
| Payment/Subscription | Out of scope | No | No | No | No | Not part of MVP |
| AI Face Analysis | Out of scope | No | No | No | No | Not allowed in MVP |
| Skin Score | Out of scope | No | No | No | No | Avoids appearance pressure |
| Medical Diagnosis | Out of scope | No | No | No | No | SkinWise VN is educational only |

## Update Rule

Update this file whenever a feature starts, becomes partially completed, is completed, is deliberately moved out of scope, or when API/UI/DB/test status changes.

