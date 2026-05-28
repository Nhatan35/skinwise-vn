# SkinWise VN

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users manage a skin profile, browse and save skincare products, browse ingredients, build routines, track routine completion, write skin journal entries, and review dashboard summaries.

The project was built for portfolio presentation, BA internship preparation, and full-stack practice. It demonstrates MVP scoping, requirements thinking, safe product boundaries, full-stack implementation, validation, deployment preparation, and portfolio storytelling.

SkinWise VN is not a medical diagnosis app. It does not diagnose diseases, prescribe medication, guarantee treatment outcomes, replace dermatologists or healthcare professionals, score attractiveness, or create appearance pressure.

## Live Demo

Production demo:

- https://skinwise-vn.vercel.app

Previously documented production evidence:

- Deployment target: Vercel.
- Production branch: `main`.
- Production commit: `db72e07`.
- Production smoke test: passed for MVP demo scope.
- Google OAuth production login: passed.
- MongoDB production/demo read/write through authenticated flows: passed.

Current `DEPLOY-VERIFY-001` re-verification status on 2026-05-25:

- Project runtime baseline is now Node.js 24.x with npm 11.x.
- Node 24 local validation passed for lint, typecheck, unit tests, production build, and authenticated Playwright E2E against the safe local test database.
- Public production URL and unauthenticated protected-route redirects were verified.
- Vercel dashboard/build logs/environment variables, Google OAuth production login, authenticated dashboard, MongoDB-backed read/write, sign-out, and Vercel runtime logs were not externally verified in this task.

## Current Status

Current phase: post Week 6 Feature Roadmap v1.2 implementation and validation.

Latest runtime/config task: `RUNTIME-001 - Standardize project runtime on Node 24 and npm 11` locally validated for the current feature scope.

Latest quality task: `MVP-E2E-CLOSEOUT-001 - Close out MVP core journey E2E validation and fix Routine Analysis duplicate React key warning` records the completed local MVP core journey E2E validation evidence and fixes the Routine Analysis duplicate suggestion key in the UI render layer. Authenticated Playwright E2E coverage for the full MVP core journey has passed locally against the safe local E2E MongoDB database; production verification remains separate.

Latest MVP source task: `MVP-DATA-CONTROL-001 - Settings and Privacy Data Control Center`.

Latest closeout task: `MVP-DATA-CONTROL-CLOSEOUT-001 - Settings/Data Control closeout`.

Deployment verification note: `DEPLOY-VERIFY-001` remains partial pending external Vercel, Google Cloud Console, MongoDB Atlas, authenticated production smoke, and runtime-log evidence.

Completed scope:

- Week 1 Foundation.
- Week 2 Skin Profile, Product, and Ingredient backend foundation.
- Week 3 Routine Builder and RoutineLog.
- Week 4 Routine Safety Engine and Routine Analysis.
- Week 5 AI provider abstraction, mock AI provider, validated provider, and Ingredient Explanation API.
- Week 6 Skin Journal, Dashboard enhancement, Product Catalogue UI, and Product Detail UI.
- Feature Roadmap v1.1 Ingredient Library UI.
- Feature Roadmap v1.2 Saved Products.
- Vercel MVP demo deployment and production smoke test.
- Clean package validation stabilization.
- Unauthenticated Playwright smoke tests for landing page and protected route redirects.
- Test-only authenticated Playwright coverage for dashboard, Skin Profile, Product Catalogue, Product Detail, Saved Products, Ingredient Library, Routine Builder, Routine Analysis, Today Routine Checklist, Routine Log deletion, Skin Journal, Settings/Data Control, account deletion request, and dashboard summary reflection.
- Routine Analysis duplicate React key warning fixed for repeated AI recommendation suggestion titles.
- Professional demo data preparation.
- Portfolio case study, demo script, screenshots checklist, release checklist, and release notes.

## Key Features

- Skin Profile.
- Product Catalogue.
- Product Detail.
- Saved Products.
- Ingredient Library.
- Routine Builder.
- Routine Logs.
- Routine Safety Analysis.
- Skin Journal.
- Dashboard summary.
- Settings & Data Control.
- Ingredient Explanation API.
- Demo seed data and demo walkthrough documentation.

## Implemented Routes

Implemented UI routes:

- `/`
- `/dashboard`
- `/onboarding/skin-profile`
- `/skin-profile`
- `/routines`
- `/routine-logs/today`
- `/journal`
- `/products`
- `/products/[id]`
- `/saved-products`
- `/ingredients`
- `/ingredients/[id]`
- `/settings`

Implemented SkinWise API routes:

- `/api/me`
- `/api/account/deletion-request`
- `/api/dashboard`
- `/api/skin-profile`
- `/api/products`
- `/api/products/[id]`
- `/api/saved-products`
- `/api/saved-products/[productId]`
- `/api/ingredients`
- `/api/ingredients/[id]`
- `/api/ingredients/explain`
- `/api/routines`
- `/api/routines/[id]`
- `/api/routines/[id]/analyze`
- `/api/routines/[id]/analyses`
- `/api/routine-logs`
- `/api/routine-logs/[id]`
- `/api/skin-journal`
- `/api/skin-journal/[id]`

Auth.js owns `/api/auth/*` and its response format.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui-style component foundation.
- MongoDB.
- Auth.js / NextAuth.
- Zod.
- Vitest.
- Playwright smoke tests.
- Vercel.

## Demo Flow

Recommended 3-5 minute walkthrough:

```txt
Landing page
-> Login
-> Dashboard
-> Skin Profile
-> Product Catalogue
-> Product Detail
-> Saved Products
-> Ingredient Library
-> Ingredient Detail and Explanation
-> Routine Builder
-> Routine Safety Analysis
-> Routine Logs
-> Skin Journal
-> Dashboard summary
```

## Portfolio Documents

- Portfolio case study: `docs/portfolio-case-study.md`
- Demo script: `docs/demo-script.md`
- Screenshots checklist: `docs/screenshots-checklist.md`
- Demo data and setup guide: `docs/ai-coding/07-demo-data-and-demo-script.md`
- Final release checklist: `docs/final-release-checklist.md`
- Release notes: `docs/release-notes-v1.0.md`
- Vercel deployment runbook: `docs/deployment/vercel-deployment.md`

## Local Setup

### Runtime baseline

Use the project runtime baseline below for local development, CI, and deployment alignment:

```txt
Node.js: 24.x
npm: 11.x
```

Recommended local check:

```bash
node -v
npm -v
```

Expected baseline for this update:

```txt
node: v24.14.0
npm: 11.14.1
```

### Setup commands

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill real values in `.env.local` only. Do not commit, upload, share, screenshot, or package `.env.local`.

Database commands use `.env.local` and must only be run against a known local/development or explicitly safe demo database.

## Validation Commands

Run after applying the Node 24 runtime update and before release packaging:

```bash
node -v
npm -v
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=moderate
```

`npm run build` requires the production-required environment variables defined in `src/config/env.ts`. Use real values locally only in `.env.local` or safe temporary placeholder values for build validation.

`npm run test:e2e` runs Playwright smoke tests against a local/CI dev server with safe placeholder environment values. The suite covers public landing page loading, unauthenticated protected-route redirects, authenticated dashboard access, Skin Profile create/update, Product Catalogue browsing, Product Detail navigation, Saved Products save/list/remove flow, Ingredient Library search/detail/explanation, Routine Builder, Routine Analysis, Today Routine Checklist, Routine Log deletion through UI, Skin Journal create/edit/delete, Settings/Data Control, account deletion request, and Dashboard summary reflection through a test-only Auth.js Credentials provider. The Routine Analysis flow includes a targeted guard for the duplicate React key warning involving repeated `AI recommendation` suggestions.

Authenticated Playwright smoke tests use a test-only Auth.js Credentials provider. It is enabled only when `APP_ENV="test"` and `E2E_TEST_AUTH="true"`, and must never be enabled in production or normal development. The authenticated smoke suite uses the safe local/test MongoDB URI configured in `playwright.config.ts` and seeds deterministic product and ingredient data, including Niacinamide, and resets deterministic E2E-user-owned data through `npm run db:seed:e2e`; a local MongoDB instance must be available at `mongodb://127.0.0.1:27017/skinwise-e2e-check`.

## Environment Variables

Environment validation is defined in `src/config/env.ts`. Use `.env.example` as the placeholder template.

Core variables:

```txt
APP_ENV
APP_BASE_URL
MONGODB_URI
AUTH_SECRET
AUTH_URL
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
AI_PROVIDER
AI_API_KEY
AI_MODEL
E2E_TEST_AUTH
E2E_TEST_USER_EMAIL
E2E_TEST_USER_NAME
```

Optional/future variables:

```txt
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
FEATURE_AI_ROUTINE_ANALYSIS
FEATURE_INGREDIENT_EXPLANATION
FEATURE_IMAGE_UPLOAD
FEATURE_NOTIFICATIONS
FEATURE_MARKETPLACE
FEATURE_SKIN_SCORE
```

Use `AUTH_URL` and `APP_BASE_URL` for the current Auth.js/NextAuth v5-style setup. Do not introduce `NEXTAUTH_URL` unless the source code is deliberately changed to require it.

## AI Integration Status

AI provider abstraction is implemented.

The current usable provider is the validated mock provider. `AI_PROVIDER="mock"` is suitable for local and portfolio demo work without external AI keys.

OpenAI and Gemini provider names are recognized by configuration, but real providers are not implemented in the current MVP.

## Known Limitations

- This is an MVP demo deployment, not a full commercial production release.
- AI routine analysis uses mock/deterministic provider behavior.
- Real OpenAI/Gemini providers are not implemented.
- Product catalogue data is demo/seed-style catalogue data.
- Product CRUD and admin dashboard are not implemented.
- Image upload and AI face analysis are not implemented.
- Skin score and attractiveness scoring are not implemented.
- Marketplace, payment, subscription, and notifications are not implemented.
- Barcode scanner is not implemented.
- Playwright E2E uses a test-only Auth.js Credentials provider for local/CI coverage; real Google OAuth login is not tested by the Playwright suite and production verification remains separate.
- SkinWise VN provides educational skincare support only, not medical diagnosis or treatment advice.

## Future Roadmap

Future ideas, not implemented in the current MVP:

- Capture final screenshots for the portfolio.
- Improve dashboard analytics.
- Improve saved product organization.
- Add admin product management.
- Improve product filtering.
- Expand deterministic routine safety rules.
- Add real AI provider integration with strict safety boundaries.
- Add optional image upload only with privacy safeguards.
- Add notification reminders.

## Documentation Map

- `docs/portfolio-case-study.md`
- `docs/demo-script.md`
- `docs/screenshots-checklist.md`
- `docs/final-release-checklist.md`
- `docs/release-notes-v1.0.md`
- `docs/deployment/vercel-deployment.md`
- `docs/13-ui-route-map.md`
- `docs/18-deployment-checklist.md`
- `docs/21-local-auth-db-troubleshooting.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/ai-coding/07-demo-data-and-demo-script.md`

Historical SDD and planning docs remain in `docs/` for traceability. Older references to "before Week 1 implementation", "Week 1 foundation only", or planned dashboard/journal/product UI should be treated as historical unless confirmed by current source code.

## MVP Principle

Build the safest useful version first:

- simple routine builder;
- deterministic safety rules before AI;
- AI explanations through a provider abstraction;
- privacy-first journal;
- routine consistency tracking;
- no diagnosis;
- no product-selling pressure.

