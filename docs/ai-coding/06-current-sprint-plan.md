# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-24

## 1. Current phase

```txt
Post Week 6 MVP cleanup, validation, deployment preparation, and portfolio readiness
```

The main Week 1-6 MVP implementation is completed or nearly completed. Current work is deployment preparation and readiness verification, not new feature work.

## 2. Current deployment task

Current task:

```txt
TASK DEPLOY-001 - Prepare Vercel deployment for SkinWise VN MVP
```

Status:

```txt
Deployment prepared.
Actual Vercel deployment: NOT RUN.
Production URL: NOT PROVIDED.
Production smoke test: NOT TESTED.
```

## 3. Latest completed task

```txt
TASK DEPLOY-001 - Prepare Vercel deployment for SkinWise VN MVP
```

## 4. Completed MVP implementation status

```txt
Week 1 Foundation completed
Week 2 Skin Profile, Product, and Ingredient backend foundation completed
Week 3 Routine Builder and RoutineLog completed
Week 4 Routine Safety Engine and Routine Analysis completed
Week 5 AI provider abstraction, mock AI provider, validated AI provider, and Ingredient Explanation API completed
Week 6 Skin Journal, Dashboard enhancement, Product Catalogue UI, and Product Detail UI completed
```

## 5. Deployment preparation goals

```txt
[x] Confirm local env files are ignored and not tracked.
[x] Confirm .env.example uses placeholders only and matches src/config/env.ts.
[x] Add exact Vercel deployment runbook.
[x] Document production environment variables supported by source.
[x] Document MongoDB Atlas and Google OAuth production setup.
[x] Add Node 20 marker for Vercel/local version alignment.
[x] Create clean deployment package excluding secrets and generated artifacts.
[x] Run local validation commands.
[ ] Execute real Vercel deployment.
[ ] Configure production environment variables in Vercel.
[ ] Configure/test Google OAuth production callback.
[ ] Verify MongoDB Atlas production/demo access from Vercel.
[ ] Run production smoke test.
```

## 6. Not allowed in this phase

```txt
No new product feature.
No Product CRUD.
No admin review workflow.
No saved products.
No image upload.
No AI face analysis.
No skin score.
No diagnosis.
No marketplace.
No payment/subscription.
No production deployment claim without evidence.
No real AI provider completion claim without implementation and verification.
```

## 7. Validation scope

Run available scripts from `package.json` where safe:

```txt
npm install
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:indexes
npm run db:seed
npm run dev
```

Database commands must only run against a known local/development database. Do not seed production data.

## 8. Recommended next task

```txt
TASK DEPLOY-002 - Execute Vercel deployment and run production smoke test
```

Reason: deployment preparation is complete locally, but the Vercel project, production environment variables, MongoDB Atlas access, Google OAuth production callback, deployed URL, and production smoke test still require external setup and verification.
