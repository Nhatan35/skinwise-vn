# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-24

## 1. Current phase

```txt
Post Week 6 MVP cleanup, validation, deployment preparation, and portfolio readiness
```

The main Week 1-6 MVP implementation is completed or nearly completed. Current work is not a feature sprint; it is a cleanup and readiness pass.

## 2. Active cleanup tasks

Complete these tasks in order:

```txt
SECURITY-CLEANUP-001
DOCS-SYNC-001
LOCAL-VALIDATION-001
```

## 3. Latest completed task

```txt
PRODUCT-UI-002 - Implement Product Detail UI
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

## 5. Cleanup goals

```txt
[ ] Confirm local env files are ignored and not tracked.
[ ] Confirm .env.example uses placeholders only and matches src/config/env.ts.
[ ] Synchronize README, route/API docs, implementation status, and feature matrix with current source.
[ ] Remove visible UI copy that says implemented features are only planned or Week 1-only.
[ ] Run local validation commands where safe.
[ ] Document commands that cannot be run and why.
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
TASK DEPLOY-001 - Prepare Vercel deployment for SkinWise VN MVP
```

Reason: after cleanup, documentation sync, and local validation, deployment preparation is the next step for verifying production build behavior, environment variable configuration, Auth.js callback URLs, MongoDB connectivity, AI provider mode, and portfolio demo readiness.
