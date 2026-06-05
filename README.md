# SkinWise VN

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users manage a skin profile, browse skincare products and ingredients, save products, build routines, track routine completion, write skin journal entries, and review dashboard/insights summaries.

The project was built for portfolio presentation, BA internship preparation, and full-stack practice. It demonstrates MVP scoping, requirements thinking, safe product boundaries, modular full-stack implementation, validation discipline, CI/E2E coverage, production smoke-check discipline, and release closeout.

SkinWise VN is **not** a medical diagnosis app. It does not diagnose diseases, prescribe medication, guarantee treatment outcomes, replace dermatologists or healthcare professionals, score attractiveness, or create appearance pressure.

## Live Demo

Production demo:

- https://skinwise-vn.vercel.app

Current evidence status:

- MVP portfolio/demo/interview readiness: **READY** at MVP level.
- Core MVP: **COMPLETE**.
- Portfolio demo readiness: **COMPLETE**.
- Post-MVP backlog planning: **COMPLETE**.
- Latest completed milestone: **MVP v1.13 - UX Polish & Empty State Improvement**.
- Current phase: **Post-MVP controlled improvement**.
- Next recommended product task: **MVP v1.14 - Data Quality Expansion**.
- Portfolio evidence tasks: **screenshots, demo video, CV/portfolio case study**.
- Local validation evidence: **PASS** for MVP v1.13 UX polish quality gate.
- Production smoke test evidence: **PASS - user-reported manual verification completed; no blockers reported.**
- Production monitoring evidence: **PASS - user-reported Vercel/browser/OAuth/MongoDB checks completed; no critical blockers reported.**
- Portfolio demo readiness documentation: **MVP v1.11 completed.**
- Post-MVP UX polish: **MVP v1.13 completed locally; production smoke was not rerun for this polish task.**

Evidence boundary:

- Automated local evidence is supported by terminal output.
- Production PASS status is based on the user's reported completed manual verification. Keep screenshots, Vercel deployment id, browser/network notes, or issue records separately if stricter audit evidence is required.
- No real secrets, OAuth tokens, database URIs, or private user data should be committed, uploaded, documented, or screenshotted.

## Current Status

Current completed product release:

```txt
MVP v1.8 - Insights Usability & Progress Story Refinement
```

Completed closeout milestones:

```txt
MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup: DONE
MVP v1.8.2 - Final Documentation Consistency Hotfix: DONE
MVP v1.9 - Local Validation Evidence: PASS
MVP v1.10 - Production Smoke Test & Monitoring Evidence: PASS, user-reported
MVP v1.11 - Portfolio Demo Readiness Polish: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
```

MVP v1.8 is the current completed product release. It refines the existing Insights experience, progress-story copy, calendar readability, journal/product usage safety wording, next actions, and empty/error/loading states without changing the Insights API response shape, adding unsafe AI claims, or introducing medical/product-causality logic.

MVP v1.11 is a documentation and presentation-readiness milestone. It does not add product features or change source logic. It prepares the repository for portfolio review, demo walkthrough, and interview discussion.

MVP v1.12 is a completed post-MVP backlog planning milestone.

MVP v1.13 is a post-MVP UX polish milestone. It improves loading, empty, error, helper, CTA, and first-time guidance states without changing database behavior, authentication, authorization, Product Match rules, Routine Safety rules, or AI provider behavior.

The current phase is post-MVP controlled improvement. The next recommended product task is MVP v1.14 - Data Quality Expansion, focused on product and ingredient data quality without expanding product scope.

## Key Features

- Google OAuth authentication with protected app routes.
- Skin profile onboarding, viewing, editing, and deletion.
- Product catalogue with product detail pages and personalized match explanation on Product Detail.
- Curated demo-safe catalogue with 38 fictional/demo-safe products and 40 educational ingredient records.
- Saved products.
- Personalized Product Match: rule-based educational product matching with score, level, Vietnamese explanations, ingredient highlights, cautions, fallback notes, and Product Detail single-product matching based on existing product/profile metadata.
- Ingredient library with ingredient detail pages.
- Ingredient explanation API using the validated provider flow and safe fallback behavior.
- Routine builder with empty state, morning/evening guidance, selected-product context, and Today Checklist navigation.
- Routine safety analysis with deterministic rule checks, scannable result sections, and safe AI-provider fallback behavior.
- Today routine checklist and routine logs.
- Skin journal.
- Skin Progress Insights with routine consistency, journal activity, reflective product usage, safe next actions, and calendar readability improvements.
- Dashboard summary based on user-owned data.
- Settings and data control center.
- Data export, app-data deletion, and MVP-safe account deletion request marker.
- Demo seed data, demo walkthrough documentation, and portfolio case study.

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
- `/insights`
- `/ingredients`
- `/ingredients/[id]`
- `/settings`

Implemented SkinWise API routes:

- `/api/me`
- `/api/account/app-data`
- `/api/account/deletion-request`
- `/api/account/export`
- `/api/dashboard`
- `/api/skin-profile`
- `/api/products`
- `/api/products/[id]`
- `/api/products/[id]/match`
- `/api/product-match`
- `/api/saved-products`
- `/api/saved-products/[productId]`
- `/api/insights`
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
- `/api/auth/*`

Auth.js owns `/api/auth/*` and its response format.

## Tech Stack

- Next.js App Router.
- TypeScript.
- React.
- Tailwind CSS.
- shadcn/ui-style component foundation.
- MongoDB.
- Auth.js / NextAuth.
- Zod.
- Vitest.
- Playwright.
- GitHub Actions with MongoDB service for E2E.
- Vercel.

## Validation Evidence

Latest local validation evidence:

```txt
Evidence date: 2026-06-04
Environment: Local Windows / PowerShell
Branch: main
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 96 files / 889 tests
npm run build: PASS
npm run test:e2e: PASS - 29/29 Playwright tests
```

Validation note:

```txt
v1.13 did not require database commands because no schema, seed data, indexes, or persistence behavior changed.
The first sandboxed build and E2E attempts failed with spawn EPERM; the same commands passed when rerun outside the sandbox.
Historical v1.9 evidence still records db:indexes, db:seed, audit, and baseline local validation.
```

Production evidence:

```txt
Production URL: https://skinwise-vn.vercel.app
Production smoke test: PASS - user-reported manual verification completed
Production monitoring: PASS - user-reported Vercel/browser/OAuth/MongoDB checks completed
Critical production blockers reported: None
Evidence date: 2026-06-04
Evidence note: preserve screenshots/log snippets separately if strict audit traceability is required
```

## Demo Flow

Recommended 3-5 minute walkthrough:

```txt
Landing page
-> Login
-> Dashboard
-> Skin Profile
-> Product Match
-> Save recommended product
-> Product Detail
-> Saved Products
-> Ingredient Library
-> Ingredient Detail and Explanation
-> Routine Builder
-> Routine Safety Analysis
-> Today Routine Checklist
-> Routine Logs
-> Skin Journal
-> Insights
-> Settings / Data Export
-> Delete Request
-> Sign out
```

## Portfolio Documents

- Portfolio case study: `docs/portfolio-case-study.md`
- Demo script: `docs/demo-script.md`
- Final release checklist: `docs/final-release-checklist.md`
- Deployment checklist: `docs/18-deployment-checklist.md`
- Vercel deployment runbook: `docs/deployment/vercel-deployment.md`
- Production smoke test checklist: `docs/production-smoke-test-v1.9.md`
- Production monitoring/demo recovery runbook: `docs/production-monitoring-runbook.md`
- Demo data and setup guide: `docs/ai-coding/07-demo-data-and-demo-script.md`
- Screenshot checklist: `docs/screenshots-checklist.md`
- Historical release notes v1.3: `docs/release-notes-v1.3.md`
- Historical release notes v1.0: `docs/release-notes-v1.0.md`

## Local Setup

### Runtime baseline

Use the project runtime baseline below for local development, CI, and deployment alignment:

```txt
Node.js: 24.x
npm: 11.x
```

Expected validated baseline:

```txt
node: v24.x
npm: 11.x
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

Run these after meaningful changes:

```bash
node -v
npm -v
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:indexes
npm run db:seed
npm run test:e2e
npm audit --omit=dev --audit-level=moderate
```

## Product Safety Boundaries

SkinWise VN intentionally avoids unsafe or unsupported claims:

- No diagnosis.
- No treatment or cure claims.
- No prescription or medication guidance.
- No dermatologist replacement.
- No skin score, face score, attractiveness score, or before/after pressure.
- No image upload or face/skin image analysis in the MVP.
- No marketplace, payment, cart, checkout, subscription, rating, or review flow.
- No admin CRUD in the current MVP.
- No real external AI provider is required for the MVP demo.

## Known MVP Limitations

These are intentional MVP boundaries, not release blockers:

- AI provider remains mock/fallback-based for MVP safety.
- Product and ingredient data is curated/demo-oriented.
- Full Auth.js hard-delete account automation is not implemented.
- Full commercial monitoring/error tracking is outside the MVP.
- Screenshots are optional; capture them only if needed for CV, portfolio page, or slide deck.
- `npm ci` was not captured in the provided local terminal evidence and can be rerun if strict install evidence is required.

## Final Portfolio Decision

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
Decision: READY for portfolio/demo/interview at MVP level
Current phase: Post-MVP controlled improvement
Next recommended product task: MVP v1.14 - Data Quality Expansion
Portfolio evidence tasks: screenshots, demo video, CV/portfolio case study
```


## Post-MVP Backlog

Post-MVP work is tracked in `docs/post-mvp-backlog.md`. `v1.13 - UX Polish & Empty State Improvement` is complete. The recommended next controlled implementation is `v1.14 - Data Quality Expansion`.
