# SkinWise VN

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users understand their skin profile, track routines, compare products, browse skincare ingredients, save products, write skin journal entries, and review personal skincare patterns safely without making medical claims.

The project was built for portfolio presentation, GitHub review, CV/resume support, recruiter review, interview explanation, BA internship preparation, and full-stack practice. It demonstrates MVP scoping, requirements thinking, safe product boundaries, modular full-stack implementation, validation discipline, CI/E2E coverage, production smoke-check discipline, and release closeout.

SkinWise VN is **not** a medical diagnosis app. It does not diagnose diseases, prescribe medication, guarantee treatment outcomes, replace dermatologists or healthcare professionals, score attractiveness, or create appearance pressure.

## Live Demo

Production demo:

- https://skinwise-vn.vercel.app

Current evidence status:

- MVP portfolio/demo/interview readiness: **READY** at MVP level.
- Core MVP: **COMPLETE**.
- Portfolio demo readiness: **COMPLETE**.
- Post-MVP backlog planning: **COMPLETE**.
- Latest completed milestone: **MVP v1.23 - Account Data Deletion Workflow Hardening**.
- Current active milestone: **None**.
- Current phase: **Post-MVP controlled improvement**.
- Recommended next task: **v1.24 - Seed Data Quality Expansion Round 2**.
- Portfolio Evidence Package documentation: **PREPARED** in `docs/portfolio-evidence-package.md`.
- Portfolio media evidence tasks: **screenshots and demo video are intentionally skipped for v1.22 and are not claimed unless actual files are captured separately**.
- Local validation evidence: **PASS** for MVP v1.23 implementation validation.
- Production health endpoint evidence: **PASS - direct public check of `/api/health` returned HTTP 200 and the expected v1.22 JSON contract.**
- Production smoke test evidence: **PARTIAL / DEFERRED for v1.22.1 - public URL and `/api/health` were checked, but authenticated MVP flows were not checked.**
- Production monitoring evidence: **NOT CHECKED for v1.22.1 - historical/user-reported Vercel/browser/OAuth/MongoDB checks remain historical only.**
- v1.23 deletion smoke evidence: **NOT CHECKED for manual browser and production deletion flows.**
- Portfolio demo readiness documentation: **MVP v1.11 completed.**
- Post-MVP UX polish: **MVP v1.13 completed locally; production smoke was not rerun for this polish task.**

Evidence boundary:

- Automated local evidence is supported by terminal output.
- Historical production PASS status is based on the user's previously reported manual verification. Keep screenshots, Vercel deployment id, browser/network notes, or issue records separately if stricter audit evidence is required.
- Current v1.22.1 verification is partial direct public verification only; it does not create screenshot, demo-video, authenticated MVP flow, browser console, Vercel log, Atlas, traffic, performance, or user-metric evidence.
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
MVP v1.14 - Data Quality Expansion: DONE
MVP v1.15 - Product Match Explainability & Safety Guardrails: DONE
MVP v1.15.1 - Audit Cleanup & Evidence Sync: DONE
MVP v1.16 - Saved Product Comparison & Decision Support: DONE
MVP v1.17 - Routine History & Weekly Progress Review: DONE
MVP v1.18 - Skin Journal Filters & Reflection Review: DONE
MVP v1.19 - Account Data Summary & Privacy Control Review: DONE
MVP v1.20 - Personal Insight Review & Safe Trend Cards: DONE
MVP v1.21 - Insight Explainability & Tracking Quality Checklist: DONE
MVP v1.22 - Production Observability & Release Confidence: DONE
MVP v1.23 - Account Data Deletion Workflow Hardening: DONE
```

MVP v1.8 is the current completed product release. It refines the existing Insights experience, progress-story copy, calendar readability, journal/product usage safety wording, next actions, and empty/error/loading states without changing the Insights API response shape, adding unsafe AI claims, or introducing medical/product-causality logic.

MVP v1.11 is a documentation and presentation-readiness milestone. It does not add product features or change source logic. It prepares the repository for portfolio review, demo walkthrough, and interview discussion.

MVP v1.12 is a completed post-MVP backlog planning milestone.

MVP v1.13 is a post-MVP UX polish milestone. It improves loading, empty, error, helper, CTA, and first-time guidance states without changing database behavior, authentication, authorization, Product Match rules, Routine Safety rules, or AI provider behavior.

MVP v1.14 is a post-MVP data quality milestone. It expands curated product and ingredient seed data, strengthens seed quality assertions, and improves Product Match demo coverage without changing schema, routes, authentication, authorization, or scoring logic.

MVP v1.15 is a controlled post-MVP product improvement milestone. It improves Product Match reasoning, matched-factor labels, caution notes for strong actives/fragrance signals, missing/unknown-profile guidance, and Product Detail decision support without changing database schema, routes, authentication, authorization, persistence behavior, or AI-provider behavior.

MVP v1.15.1 is an audit, dependency-risk, validation, and documentation evidence cleanup patch after v1.15. It does not add product features or change Product Match/Product Detail behavior.

MVP v1.21 extends the existing Personal Insight Review with calculation metadata and a tracking data-availability checklist without adding diagnosis, treatment advice, causation claims, skin scoring, risk scoring, health grading, schema changes, or AI provider changes.

MVP v1.22 is a completed controlled post-MVP release-confidence milestone. It improves production confidence by adding a safe public health check endpoint, health API contract test, release evidence documentation, production incident note template, and monitoring/release checklist updates. It does not add product features, database schema changes, real AI provider integration, external observability vendors, diagnosis logic, treatment advice, skin scoring, image upload, admin CRUD, marketplace, payment, checkout, or order workflow.

MVP v1.23 is the latest controlled post-MVP privacy and data-control hardening milestone. It hardens the existing account app-data deletion workflow with clearer destructive confirmation copy, user-isolation tests, sensitive-response checks, and data-control documentation. It does not delete Google/OAuth accounts, shared product catalogue data, shared ingredient library data, other users' data, production configuration, or release documentation.

The current phase remains post-MVP controlled improvement. The Portfolio Evidence Package documentation has been prepared; optional screenshot and demo-video capture remain separate media evidence tasks and are intentionally skipped for v1.22.

## Key Features

- Google OAuth authentication with protected app routes.
- Skin profile onboarding, viewing, editing, and deletion.
- Product catalogue with product detail pages and personalized match explanation on Product Detail.
- Curated demo-safe catalogue with 58 fictional/demo-safe products and 59 educational ingredient records.
- Saved products and saved product comparison.
- Personalized Product Match: rule-based educational product matching with score, level, matched-factor labels, Vietnamese explanations, ingredient highlights, caution notes, fallback guidance, and Product Detail single-product matching based on existing product/profile metadata.
- Ingredient library with ingredient detail pages.
- Ingredient explanation API using the validated provider flow and safe fallback behavior.
- Routine builder with empty state, morning/evening guidance, selected-product context, and Today Checklist navigation.
- Routine safety analysis with deterministic rule checks, scannable result sections, and safe AI-provider fallback behavior.
- Today routine checklist, routine logs, and weekly routine review.
- Skin journal with loaded-entry filters.
- Skin Progress Insights with routine consistency, journal activity, reflective product usage, safe next actions, calendar readability improvements, Personal Insight Review cards, calculation explanations, and tracking quality checklist.
- Dashboard summary based on user-owned data.
- Settings and data control center.
- Data export, hardened app-data deletion, and MVP-safe account deletion request marker.
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
- `/api/health`
- `/api/skin-profile`
- `/api/products`
- `/api/products/[id]`
- `/api/products/[id]/match`
- `/api/product-match`
- `/api/saved-products`
- `/api/saved-products/[productId]`
- `/api/insights`
- `/api/insights/summary`
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
Evidence date: 2026-06-11
Environment: Local Windows / PowerShell
Branch: main
Runtime baseline: Node.js 24.x / npm 11.x
npm ci: NOT RUN for v1.23
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 103 files / 992 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 31/31 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Validation note:

```txt
v1.23 hardened only the existing account app-data deletion workflow, tests, and documentation.
Existing product features, database schema, auth architecture, authorization model, persistence scope, AI-provider behavior, and shared catalogue behavior remain unchanged.
Sandboxed build and E2E attempts failed with spawn EPERM; the same commands passed when rerun outside the sandbox. `npm ci` was not run for v1.23.
E2E global setup seeded the local test database with the expanded v1.14 seed data.
npm audit --omit=dev --audit-level=moderate was verified clean for production dependencies.
```

Production evidence:

```txt
Production URL: https://skinwise-vn.vercel.app
Production URL public reachability: PASS - direct unauthenticated HTTP 200 on 2026-06-11
Production /api/health: PASS - direct unauthenticated HTTP 200 and expected v1.22 JSON contract on 2026-06-11
Production smoke/monitoring evidence for v1.22.1: PARTIAL / DEFERRED - public URL and /api/health were checked; authenticated MVP flows and production platform signals were not checked
Historical production smoke/monitoring evidence: PASS - previously user-reported stable MVP baseline from 2026-06-04
Critical production blockers reported from direct v1.22.1 public checks: None
Evidence note: preserve screenshots/log snippets separately if strict audit traceability is required; do not treat historical/user-reported evidence as v1.22.1 direct verification
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

- Portfolio evidence package: `docs/portfolio-evidence-package.md`
- Portfolio case study: `docs/portfolio-case-study.md`
- Demo script: `docs/demo-script.md`
- Final release checklist: `docs/final-release-checklist.md`
- v1.22 release evidence: `docs/release-evidence-v1.22.md`
- v1.23 release evidence: `docs/release-evidence-v1.23.md`
- Data control and deletion boundary: `docs/data-control-and-deletion.md`
- Production incident note template: `docs/production-incident-note-template.md`
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
- Screenshots and demo video are optional media evidence; capture them only if needed for CV, portfolio page, LinkedIn, or slide deck, and do not claim they exist until actual files are produced.
- v1.22 `/api/health` only verifies that the app route is reachable. It does not verify database connectivity, OAuth connectivity, AI provider connectivity, or external service health by design.
- `npm ci` was not rerun for v1.23; latest required v1.23 validation commands passed.
- Manual browser deletion smoke and production deletion verification were not performed for v1.23.

## Final Portfolio Decision

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.12 - Post-MVP Backlog Planning: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
MVP v1.14 - Data Quality Expansion: DONE
MVP v1.15 - Product Match Explainability & Safety Guardrails: DONE
MVP v1.15.1 - Audit Cleanup & Evidence Sync: DONE
MVP v1.16 - Saved Product Comparison & Decision Support: DONE
MVP v1.17 - Routine History & Weekly Progress Review: DONE
MVP v1.18 - Skin Journal Filters & Reflection Review: DONE
MVP v1.19 - Account Data Summary & Privacy Control Review: DONE
MVP v1.20 - Personal Insight Review & Safe Trend Cards: DONE
MVP v1.21 - Insight Explainability & Tracking Quality Checklist: DONE
MVP v1.22 - Production Observability & Release Confidence: DONE
MVP v1.22.1 - Production Deployment & Smoke Verification: NOT DONE
MVP v1.23 - Account Data Deletion Workflow Hardening: DONE
Decision: READY for portfolio/demo/interview at MVP level
Current phase: Post-MVP controlled improvement
Portfolio Evidence Package: Documentation prepared; optional media capture remains separate and is intentionally skipped
```


## Post-MVP Backlog

Post-MVP work is tracked in `docs/post-mvp-backlog.md`. `v1.23 - Account Data Deletion Workflow Hardening` is complete. The Portfolio Evidence Package is presentation/evidence work, not a product correctness blocker; screenshot and demo-video capture remain optional media tasks and are intentionally skipped.
