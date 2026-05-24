# SkinWise VN

SkinWise VN is a skincare routine tracker and educational MVP for Vietnamese users. It helps users build routines, maintain a skin profile, browse products, understand ingredients, analyze routine safety with deterministic rules, track daily routine completion, write private journal entries, and review dashboard summaries.

SkinWise VN is not a medical diagnosis app. It does not diagnose diseases, prescribe medication, guarantee treatment outcomes, replace dermatologists or healthcare professionals, score attractiveness, or create appearance pressure.

## Current Status

Current phase: post Week 6 MVP cleanup, validation, deployment preparation, and portfolio readiness.

The main Week 1-6 MVP implementation is completed or nearly completed:

- Week 1 Foundation: completed.
- Week 2 Skin Profile, Product, and Ingredient backend foundation: completed.
- Week 3 Routine Builder and RoutineLog: completed.
- Week 4 Routine Safety Engine and Routine Analysis: completed.
- Week 5 AI provider abstraction, mock AI provider, validated provider, and Ingredient Explanation API: completed.
- Week 6 Skin Journal, Dashboard enhancement, Product Catalogue UI, and Product Detail UI: completed.

Latest completed task: `PRODUCT-UI-002 - Implement Product Detail UI`.

Current cleanup tasks:

- `SECURITY-CLEANUP-001`
- `DOCS-SYNC-001`
- `LOCAL-VALIDATION-001`

Recommended next task after cleanup and validation: `DEPLOY-001 - Prepare Vercel deployment for SkinWise VN MVP`.

Deployment is not complete unless a real deployed URL exists and has been smoke-tested.

## Implemented MVP Surface

Implemented UI routes include:

- `/`
- `/dashboard`
- `/onboarding/skin-profile`
- `/skin-profile`
- `/routines`
- `/journal`
- `/products`
- `/products/[id]`

Implemented SkinWise API routes include:

- `/api/me`
- `/api/dashboard`
- `/api/skin-profile`
- `/api/products`
- `/api/products/[id]`
- `/api/ingredients`
- `/api/ingredients/[id]`
- `/api/ingredients/explain`
- `/api/routines`
- `/api/routines/[id]`
- `/api/routines/[id]/analyze`
- `/api/routines/[id]/analyses`
- `/api/routine-logs`
- `/api/skin-journal`
- `/api/skin-journal/[id]`

Auth.js owns `/api/auth/*` and its response format.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MongoDB
- Auth.js / NextAuth
- Zod
- AI provider abstraction
- Mock AI provider for local/demo use
- Validated AI provider wrapper
- Deterministic routine safety rule engine
- Vitest
- Playwright configuration

## AI Integration Status

AI provider abstraction is implemented.

The current usable provider is the validated mock provider. `AI_PROVIDER="mock"` is suitable for local and portfolio demo work without external AI keys.

OpenAI and Gemini provider names are recognized by configuration but real providers are not implemented. Production AI integration is deployment/configuration dependent and not verified unless a later task adds and tests a real provider.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill real values in `.env.local` only. Do not commit or share `.env.local`, and do not include it in shared zip/source packages.

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
```

Optional variables currently present in validation:

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

Production secrets must be configured in the deployment provider dashboard, not in committed files. If real secrets were ever pushed publicly, uploaded, or shared externally, rotate them.

AI keys are optional for local/demo use when `AI_PROVIDER="mock"` and AI feature flags remain disabled. Real provider credentials are only meaningful after a real provider integration is implemented and verified.

## Development Commands

Available scripts from `package.json`:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:ui
npm run test:e2e
npm run db:indexes
npm run db:seed
```

Database commands use `.env.local` and must only be run against a known local/development database. Do not seed a production database.

## Documentation Map

Current implementation and planning docs:

- `docs/13-ui-route-map.md`
- `docs/18-deployment-checklist.md`
- `docs/21-local-auth-db-troubleshooting.md`
- `docs/ai-coding/01-codebase-map.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/04-file-ownership-map.md`
- `docs/ai-coding/05-ai-change-log.md`
- `docs/ai-coding/06-current-sprint-plan.md`

Historical SDD and planning docs remain in `docs/` for traceability. Older references to "before Week 1 implementation", "Week 1 foundation only", or planned dashboard/journal/product UI should be treated as historical unless they are confirmed by current source code.

## MVP Principle

Build the safest useful version first:

- simple routine builder;
- deterministic safety rules before AI;
- AI explanations through a provider abstraction;
- privacy-first journal;
- routine consistency tracking;
- no diagnosis;
- no product-selling pressure.
