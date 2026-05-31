# Feature Status Matrix - SkinWise VN MVP Final Closeout

Last updated: 2026-05-29

## 1. Status categories

```txt
Completed
Partially completed
Not started
Out of scope
```

> Final closeout note:
> SkinWise VN MVP is now marked as ready for portfolio/submission.
> Production verification is completed by the project owner.
> Screenshot capture is intentionally skipped because it is not required for this submission.

## 2. Final validation evidence

```txt
npm ci: PASS
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS — 72 files / 719 tests
npm run build: PASS
npm audit --omit=dev --audit-level=moderate: PASS — 0 vulnerabilities
npm run db:indexes: PASS — 32 indexes ensured
npm run test:e2e: PASS — 24/24 tests
```

## 3. Feature status matrix

| Feature | Status | API | UI | DB | Tests | Notes |
|---|---|---|---|---|---|---|
| Authentication | Completed | Auth.js `/api/auth/*`; `GET /api/me` | Auth.js sign-in flow; protected dashboard shell | Auth.js MongoDB Adapter plus AppUserProfile | Unit; production smoke; authenticated E2E support through safe test-only provider | Google OAuth production login verified for MVP demo. Test-only Credentials provider remains gated by `APP_ENV="test"` and `E2E_TEST_AUTH="true"`. |
| Skin Profile | Completed | `/api/skin-profile` GET/POST/PATCH/DELETE | `/onboarding/skin-profile`; `/skin-profile` | `skin_profiles`; AppUserProfile onboarding marker | Unit/API/source checks; production smoke; authenticated E2E spec | User-scoped skin profile create/view/edit/delete is implemented. Playwright covers create/update through safe test auth. |
| Product Catalogue | Completed | `GET /api/products` | `/products`; product picker in routines; product selection in journal | `products` collection and indexes | Unit/API/client/source checks; production smoke; authenticated E2E spec | Read-only visible product list with search/filter support. Deterministic local/test product seed data supports Playwright. |
| Product Detail UI | Completed | `GET /api/products/[id]` | `/products/[id]` | Existing `products` collection | Unit/client/source checks; production smoke; authenticated E2E spec | Product detail navigation from catalogue is implemented and covered. |
| Saved Products | Completed | `GET`/`POST /api/saved-products`; `DELETE /api/saved-products/[productId]` | `/saved-products`; Save/Saved actions in Product Catalogue and Product Detail | `saved_products` with unique `userId + productId` index | Unit/API/client/repository/source checks; authenticated E2E spec | User-owned product bookmarks with idempotent save/remove. No product schema change, marketplace, cart, recommendation algorithm, or public sharing. |
| Ingredient Library | Completed | `GET /api/ingredients`; `GET /api/ingredients/[id]` | `/ingredients`; `/ingredients/[id]` | `ingredients` collection and indexes | Unit/API/client/source checks; authenticated E2E spec | Authenticated read-only ingredient library with search, detail view, and educational copy. |
| Ingredient Explanation | Completed | `POST /api/ingredients/explain` | Explanation panel inside `/ingredients/[id]` | No persistence | Unit/API/client/source checks; authenticated E2E spec | Uses provider abstraction and validated mock provider with deterministic fallback. No external AI calls or explanation persistence in MVP. |
| Routine Builder | Completed | `/api/routines` GET/POST; `/api/routines/[id]` GET/PATCH/DELETE | `/routines` | `routines` collection and indexes | Unit/API/source checks; production smoke; authenticated E2E spec | Playwright covers authenticated routine creation with deterministic E2E data and stable selectors. |
| Routine Analysis | Completed | `POST /api/routines/[id]/analyze`; `GET /api/routines/[id]/analyses` | Analysis panel inside `/routines` | `routine_analyses`; `rate_limits` | Unit/API/source checks; production smoke; authenticated E2E spec with duplicate-key warning guard | Routine analysis uses mock/deterministic provider path for MVP. Duplicate suggestion titles render with unique React keys. Real OpenAI/Gemini provider is not required for MVP. |
| Routine Logs | Completed | `GET /api/routine-logs`; `PUT /api/routine-logs`; `DELETE /api/routine-logs/[id]` | Daily controls inside `/routines`; dedicated `/routine-logs/today` checklist with update/delete support | `routine_logs` with unique date/routine indexes | Unit/API/client/source checks; production smoke; authenticated E2E spec | Playwright covers Today Checklist access, completed status update, routine log deletion through UI, and protected `/routine-logs/today` redirect smoke. |
| Skin Journal | Completed | `GET`/`POST /api/skin-journal`; `PATCH`/`DELETE /api/skin-journal/[id]` | `/journal` timeline with create/edit/delete and product labels | `skin_journals` with user/localDate unique index | Unit/API/client/source checks; production smoke; authenticated E2E spec | Playwright covers authenticated Skin Journal create/edit/delete and dashboard latest journal reflection. |
| Dashboard | Completed | `GET /api/dashboard?localDate=YYYY-MM-DD` | `/dashboard` | Reuses user-scoped collections | Unit/API/source checks; production smoke; authenticated E2E spec | Dashboard uses real authenticated-user data for profile completion, saved product count, routine consistency, journal trends, and deterministic next actions. No fake analytics or new collections. |
| Post-MVP v1.3 Skin Progress Insights & Calendar | Completed | `GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD` | `/insights` | Reuses user-scoped `routines`, `routine_logs`, `skin_journals`, and visible `products` | Unit/API/client/UI tests and authenticated E2E spec | Implemented, tested, documented, and validated under Node v24.14.0 / npm 11.14.1. |
| Settings / Data Control | Completed | `GET /api/me`; `POST /api/account/deletion-request`; `DELETE /api/routine-logs/[id]` | Protected `/settings` page, account overview, data management cards, account deletion request, routine log delete support | `app_user_profiles.accountDeletionRequestedAt`; user-owned `routine_logs` | Unit/API/source checks; authenticated E2E spec | MVP-safe data control center. No Auth.js hard-delete, bulk delete, export, notification workflow, or legal compliance claim. |
| AI Provider Abstraction | Completed | Used by Routine Analysis and Ingredient Explanation use cases | N/A | N/A | Unit | `MockAIProvider`, `ValidatedAIProvider`, provider factory, output validation, and fallback behavior exist. |
| Runtime baseline | Completed | N/A | Node 24.x / npm 11.x documented for local, CI, and deployment | N/A | Local validation and CI configuration | `.nvmrc`, `package.json` engines, GitHub Actions, README, and deployment docs target Node 24.x / npm 11.x. Local validation passed on Node v24.14.0 / npm 11.14.1. |
| Deployment | Completed | N/A | Vercel production deployment | MongoDB Atlas production/demo configuration | Production smoke; production verification by project owner | Production URL `https://skinwise-vn.vercel.app` verified. Google OAuth login, authenticated dashboard, protected routes, MongoDB-backed read/write flows, sign-out, and runtime review are marked completed by project owner. |
| CI / GitHub Actions | Completed | N/A | GitHub Actions CI workflow | MongoDB service container for E2E | Lint, typecheck, unit tests, build, audit, db indexes, E2E | CI workflow includes MongoDB service on `27017:27017`, health check, Node 24.x, Playwright Chromium install, database index step, and `npm run test:e2e`. |
| E2E Tests | Completed | Test-only Auth.js Credentials provider enabled only for safe test environment | Playwright smoke and authenticated MVP core journey specs | Safe local/test MongoDB URI plus deterministic seed/reset logic | Latest E2E: 24/24 passed | Covers public landing page, protected redirects, authenticated dashboard, Skin Profile, Product Catalogue/Detail, Saved Products, Ingredient Library/Explanation, Routine Builder, Routine Analysis, Today Checklist, Routine Log delete, Skin Journal, Settings/Data Control, account deletion request, and dashboard reflection. |
| Clean Package Validation | Completed | N/A | N/A | N/A | Package hygiene check; source checks | Release package excludes `.env.local`, `.env`, `node_modules`, `.next`, `.git`, test artifacts, build artifacts, and generated tsbuildinfo files. |
| Demo Data and Demo Script | Completed | Public seed data through `scripts/seed.ts`; user-owned setup through existing APIs/UI | Authenticated manual walkthrough | Public `products` and `ingredients`; user-owned collections scoped by real authenticated user | Seed validation through script schemas; full validation commands | Portfolio-ready demo data and walkthrough are documented without fake users, fake dashboard output, or auth bypass. |
| Portfolio Documentation | Completed | Verified API methods documented from source | Case study, demo script, documentation walkthrough | N/A | Documentation review | Portfolio docs explain the problem, scope, requirements, architecture, features, validation, deployment summary, limitations, and roadmap. |
| Screenshot Capture | Out of scope | N/A | N/A | N/A | N/A | Intentionally skipped. Screenshots are not required for this submission. |
| Final Release Package | Completed | N/A | README, final checklist, release notes, final docs | N/A | Final validation and package hygiene | MVP final closeout is completed and ready for portfolio/submission. |
| Real AI provider integration | Not started | OpenAI/Gemini providers not enabled for MVP | N/A | N/A | Unit coverage for unsupported state | Real OpenAI/Gemini providers remain post-MVP. MVP uses `AI_PROVIDER="mock"`. |
| Production monitoring | Not started | N/A | N/A | N/A | N/A | Monitoring/error tracking is optional post-MVP work. |
| Product submission / Product CRUD | Not started | `POST /api/products` not implemented | No admin/product submission UI | Existing product collection only | N/A | Future/admin workflow only. |
| Data export / hard-delete account | Not started | No full export or Auth.js hard-delete flow | No full export/delete UI | Existing user-owned collections only | N/A | Optional post-MVP privacy enhancement. Current MVP includes account deletion request marker only. |
| Notifications | Out of scope | No | No | No | No | Reserved future capability. |
| Image Upload | Out of scope | No | No | No | No | Future only; MVP APIs avoid exposing image fields. |
| Marketplace | Out of scope | No | No | No | No | Not part of MVP. |
| Payment/Subscription | Out of scope | No | No | No | No | Not part of MVP. |
| AI Face Analysis | Out of scope | No | No | No | No | Not part of MVP. |
| Skin Score | Out of scope | No | No | No | No | Avoided to reduce appearance-pressure framing. |
| Medical Diagnosis | Out of scope | No | No | No | No | SkinWise VN is educational only and does not diagnose or replace professional medical advice. |

## 4. Final MVP status

```txt
SkinWise VN MVP — FINAL DONE FOR PORTFOLIO / SUBMISSION
```

## 4.1 Post-MVP v1.3 Insights validation

```txt
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 78 files / 745 tests
npm run build: PASS
npm run test:e2e: PASS - 25/25 tests
```

Post-MVP v1.3 Insights status:

```txt
Implemented: YES
Tested: YES
Documented: YES
Production-ready for the validated MVP environment: YES
Environment blocked: NO
```

Completed closeout tasks:

```txt
MVP-RELEASE-HYGIENE-001: DONE
MVP-CI-FIX-001: DONE
MVP-PRODUCTION-VERIFY-001: DONE
MVP-FINAL-CLOSEOUT-001: DONE
```

## 5. Optional post-MVP tasks

These are optional future improvements, not blockers for MVP submission:

```txt
POST-MVP-001 - Real AI provider integration
POST-MVP-002 - Admin Product/Ingredient CRUD
POST-MVP-003 - Data export and Auth.js hard-delete account flow
POST-MVP-004 - Monitoring and error tracking
POST-MVP-005 - Image upload
POST-MVP-006 - Portfolio website publishing
```

## 6. Update rule

Update this file only when a feature starts, becomes completed, is deliberately moved out of scope, or when API/UI/DB/test/deployment status materially changes.
