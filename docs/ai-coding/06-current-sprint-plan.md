# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-25

## 1. Current phase

```txt
Post Week 6 E2E smoke cleanup and deployment re-verification preparation
```

The main Week 1-6 MVP implementation is completed. Current required release work is complete; remaining tasks are optional portfolio polish only.

## 2. Current deployment task

Current task:

```txt
E2E-001 - Add Playwright smoke tests for critical user flows
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
TASK QA-REGRESSION-001: COMPLETED.
TASK DEMO-DATA-001: COMPLETED.
TASK PORTFOLIO-001: COMPLETED.
TASK FINAL-RELEASE-001: COMPLETED.
E2E-001: COMPLETED.
Clean package validation is robust across LF and CRLF line endings.
Professional public/shared demo seed data and authenticated manual demo setup are documented.
Portfolio case study, demo script, and screenshots checklist are prepared.
Final release checklist and release notes are prepared.
Unauthenticated Playwright smoke tests are implemented for the public landing page and protected-route redirects.
```

## 3. Latest completed task

```txt
E2E-001 - Add Playwright smoke tests for critical user flows
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
[x] Fix LF/CRLF-sensitive clean package validation in Routine Builder unit test.
[x] Add root .gitattributes for line-ending normalization.
[x] Prepare portfolio-ready public/shared product and ingredient demo seed data.
[x] Document safe authenticated manual setup for user-owned demo data.
[x] Document BA and technical demo walkthrough.
[x] Prepare portfolio case study.
[x] Prepare presentation-ready demo script.
[x] Prepare screenshots checklist.
[x] Prepare final release checklist.
[x] Prepare release notes v1.0.
[x] Polish README as portfolio entry point.
[x] Add unauthenticated Playwright smoke tests.
[x] Run `npm run test:e2e` in CI with safe placeholder environment values.
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
DEPLOY-001 - Verify Vercel deployment configuration and production smoke check.
```

Reason: build validation and unauthenticated E2E smoke tests pass locally/CI-style. The next step is deployment configuration review and production smoke re-verification, not new product scope.
