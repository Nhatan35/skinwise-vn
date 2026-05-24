# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-24

## 1. Current phase

```txt
Post Week 6 MVP cleanup, validation, deployment preparation, and portfolio readiness
```

The main Week 1-6 MVP implementation is completed or nearly completed. Current work is post-deployment portfolio/demo polish and readiness documentation, not new feature work.

## 2. Current deployment task

Current task:

```txt
TASK DEPLOY-002 - Execute Vercel deployment and run production smoke test
```

Status:

```txt
Deployment status: Deployed for MVP demo.
Actual Vercel deployment: COMPLETED.
Deployment target: Vercel.
Production branch: main.
Production commit: db72e07.
Production URL: https://skinwise-vn.vercel.app
Production smoke test: PASSED.
Google OAuth production login: PASSED.
MongoDB production/demo read/write through authenticated flows: PASSED.
TASK DEPLOY-002: COMPLETED.
```

## 3. Latest completed task

```txt
TASK DEPLOY-002 - Execute Vercel deployment and run production smoke test
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
[x] Execute real Vercel deployment.
[x] Configure production environment variables in Vercel.
[x] Configure/test Google OAuth production callback.
[x] Verify MongoDB Atlas production/demo access from Vercel.
[x] Run production smoke test.
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
TASK PORTFOLIO-001 - Prepare portfolio case study and demo script
```

Reason: MVP demo deployment is complete and smoke-tested. The next useful step is portfolio polish, demo scripting, final README polish, or post-deployment cleanup without adding new product scope.
