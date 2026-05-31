# SkinWise VN

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users manage a skin profile, browse skincare products and ingredients, save products, build routines, track routine completion, write skin journal entries, and review dashboard summaries.

The project was built for portfolio presentation, BA internship preparation, and full-stack practice. It demonstrates MVP scoping, requirements thinking, safe product boundaries, full-stack implementation, validation, CI/E2E stabilization, deployment verification, and release closeout.

SkinWise VN is not a medical diagnosis app. It does not diagnose diseases, prescribe medication, guarantee treatment outcomes, replace dermatologists or healthcare professionals, score attractiveness, or create appearance pressure.

## Live Demo

Production demo:

- https://skinwise-vn.vercel.app

Production verification status:

- Vercel production deployment: verified.
- Google OAuth production login: verified.
- MongoDB-backed authenticated read/write flows: verified.
- Protected route behavior: verified.
- Core MVP user journeys: verified.
- Screenshot capture: intentionally skipped because it is not required for this submission.

## Current Status

Current phase: **MVP final closeout / portfolio-ready release**.

Completed closeout tasks:

- `MVP-RELEASE-HYGIENE-001` - clean release package and rerun core validation.
- `MVP-CI-FIX-001` - add MongoDB service for GitHub Actions E2E and stabilize Playwright selectors for the Vietnamese UI.
- `MVP-PRODUCTION-VERIFY-001` - verify production deployment, OAuth, MongoDB-backed flows, protected routes, and runtime readiness.

Final validation baseline:

```txt
Node.js: v24.14.0
npm: 11.14.1
Unit test files: 84 passed / 84
Unit tests: 777 passed / 777
Database indexes: 32 indexes ensured
Playwright E2E: 28 passed / 28
```

## Key Features

- Google OAuth authentication with protected app routes.
- Skin profile onboarding, viewing, and editing.
- Product catalogue with product detail pages.
- Saved products.
- Personalized Product Match: rule-based educational product matching based on skin type, concerns, sensitivity, budget, and avoided ingredients.
- Ingredient library with ingredient detail pages.
- Ingredient explanation API using the validated provider flow.
- Routine builder.
- Routine safety analysis with deterministic rule checks and safe AI-provider fallback behavior.
- Today routine checklist and routine logs.
- Skin journal.
- Dashboard summary based on user-owned data.
- Settings and data control center.
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
- `/product-match`
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
- `/api/product-match`
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
- Playwright.
- GitHub Actions with MongoDB service for E2E.
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
-> Product Match
-> Saved Products
-> Ingredient Library
-> Ingredient Detail and Explanation
-> Routine Builder
-> Routine Safety Analysis
-> Today Routine Checklist
-> Skin Journal
-> Settings / Data Control
-> Sign out
```

## Portfolio Documents

- Portfolio case study: `docs/portfolio-case-study.md`
- Demo script: `docs/demo-script.md`
- Final release checklist: `docs/final-release-checklist.md`
- Release notes: `docs/release-notes-v1.0.md`
- Vercel deployment runbook: `docs/deployment/vercel-deployment.md`
- Demo data and setup guide: `docs/ai-coding/07-demo-data-and-demo-script.md`
- Screenshot checklist: `docs/screenshots-checklist.md` — optional only; screenshots are not required for the current submission.

## Local Setup

### Runtime baseline

Use the project runtime baseline below for local development, CI, and deployment alignment:

```txt
Node.js: 24.x
npm: 11.x
```

Expected validated baseline:

```txt
node: v24.14.0
npm: 11.14.1
```

### Setup commands

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Fill real values in `.env.local` only. Do not commit, upload, share, screenshot, or package `.env.local`.

Database commands use `.env.local` and must only be run against a known local/development or explicitly safe demo database.

## Validation Commands

Run these before release packaging or after meaningful changes:

```bash
node -v
npm -v
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:indexes
npm run test:e2e
npm audit --omit=dev --audit-level=moderate
```

Latest validation evidence:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 84 files / 777 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run test:e2e: PASS - 28/28 tests
```

`npm run build` requires the production-required environment variables defined in `src/config/env.ts`. Use real values locally only in `.env.local` or safe temporary placeholder values for build validation.

`npm run test:e2e` runs Playwright tests against a local/CI dev server with safe placeholder environment values and a test-only Auth.js Credentials provider. The suite covers public landing page loading, unauthenticated protected-route redirects, authenticated dashboard access, Skin Profile create/update, Product Catalogue browsing, Product Detail navigation, Product Match review/save/detail flow, Saved Products save/list/remove flow, Ingredient Library search/detail/explanation, Routine Builder, Routine Analysis, Today Routine Checklist, Routine Log deletion through UI, Skin Journal create/edit/delete, Settings/Data Control, account deletion request, and Dashboard summary reflection.

## MVP Scope and Known Limitations

This MVP intentionally focuses on skincare tracking, routine management, product/ingredient education, safe routine analysis, and portfolio-quality engineering evidence.

Out of scope for this MVP:

- Real AI provider integration.
- Image upload.
- AI face analysis.
- Skin scoring or appearance scoring.
- Marketplace, cart, payment, or checkout.
- Admin product/ingredient CRUD.
- Notifications.
- Full commercial monitoring and analytics.

## Release Status

SkinWise VN is ready as an MVP portfolio/submission release.

Final closeout status:

- Source hygiene: completed.
- Local validation: completed.
- CI/E2E MongoDB support: completed.
- Production verification: completed by project owner.
- Screenshots: skipped intentionally; not required for this submission.
