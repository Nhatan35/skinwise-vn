# Portfolio Evidence Package - SkinWise VN

Last updated: 2026-06-22

## 1. Purpose

This package prepares SkinWise VN for portfolio, GitHub README, CV/resume, recruiter review, interview explanation, and a 3-5 minute demo.

This is a presentation and evidence package only. It does not change product behavior, database schema, authentication, authorization, API contracts, dependencies, environment configuration, or deployment configuration.

## 2. Product Positioning

SkinWise VN is an educational skincare tracking MVP that helps users understand their skin profile, track routines, compare products, and review personal skincare patterns safely without making medical claims.

Use these phrases:

- educational skincare tracking;
- personal routine organization;
- product comparison support;
- personal skincare history;
- non-medical guidance;
- safety-aware routine review;
- educational decision support.

Do not present the app as:

- a medical diagnosis tool;
- a treatment recommendation system;
- a dermatologist replacement;
- a skin scoring system;
- a face analysis or image diagnosis system;
- a marketplace or commerce platform.

## 3. Evidence Status

| Evidence item | Status | Notes |
|---|---|---|
| README presentation | Prepared | `README.md` summarizes status, features, routes, validation evidence, safety boundaries, and portfolio docs. |
| Portfolio case study | Prepared | `docs/portfolio-case-study.md` explains problem, scope, BA angle, architecture, evidence, demo flow, and limitations. |
| Demo script | Prepared | `docs/demo-script.md` supports a 3-5 minute walkthrough and interview Q&A. |
| Demo data checklist | Prepared | `docs/ai-coding/07-demo-data-and-demo-script.md` separates seeded public data from user-owned demo data. |
| Screenshot checklist | Prepared | `docs/screenshots-checklist.md` lists recommended captures and safety rules. |
| Actual screenshot files | Not verified | This package does not claim screenshots exist in the repository. |
| Demo video file | Not recorded | This package does not claim a demo video exists. |
| CV/resume summary | Drafted | See section 5. |
| Latest local validation | PASS | v1.62 local validation passed for lint, typecheck, 122 test files / 1353 tests, build after elevated rerun, and full E2E after elevated rerun with 42/42 tests. |
| Admin product review browser smoke | PASS locally | v1.47 local Playwright/Chrome smoke verified unauthenticated redirect without Auth.js 500, non-admin block, admin list/search/filter/update/revert, public visibility regression, console/network checks, and no browser-visible secret exposure. |
| Historical production smoke/monitoring | PASS, user-reported | Recorded from the stable MVP baseline on 2026-06-04. |
| Latest scoped task app validation | PASS locally | v1.62 Admin Content Dashboard Lite, v1.60 Admin Ingredient Create/Edit Lite, and v1.59 Admin Product Create/Edit Lite passed local validation. v1.48 deployed admin product review smoke evidence remains missing or incomplete, so production-ready is not claimed. |

No new deployed smoke PASS, screenshot, video, traffic, performance, production-ready, or user-metric evidence is claimed by this file.

## 4. Recruiter Summary

SkinWise VN is a portfolio-ready full-stack educational skincare tracking MVP built with Next.js App Router, TypeScript, MongoDB, Auth.js, Zod, Tailwind CSS, Vitest, and Playwright. It demonstrates BA-style scope control, authenticated user-owned data flows, rule-based product comparison support, deterministic routine safety review before AI explanation, privacy-conscious journaling, explainable dashboard/insights summaries, and release evidence discipline.

The strongest presentation angle is not "AI skincare advice." The stronger and safer angle is: a scoped full-stack MVP with clear requirements, safe product boundaries, explainable rules, protected personal data, and a complete demo journey.

## 5. CV / Resume Draft

Short version:

```txt
Built SkinWise VN, a full-stack educational skincare tracking MVP using Next.js, TypeScript, MongoDB, Auth.js, Zod, Tailwind CSS, Vitest, and Playwright. Implemented authenticated skin profile, product comparison, saved products, routine tracking, deterministic routine safety review, skin journal, explainable insights, settings/data export, and portfolio-ready release documentation with non-medical safety boundaries.
```

Bullet version:

- Built a full-stack educational skincare tracking MVP with protected user-owned data flows across skin profile, products, product match, routines, routine logs, journal, insights, and settings/data export.
- Designed rule-based Product Match and deterministic Routine Safety Analysis so guidance stays explainable, testable, and non-medical.
- Used an AI-provider abstraction as an explanation/fallback layer rather than a safety decision-maker.
- Documented release evidence, demo flow, portfolio case study, safety boundaries, and post-MVP backlog for recruiter and interview review.
- Latest v1.62 local validation passed. v1.48 deployed admin product review smoke evidence is missing or incomplete, so production-ready is not claimed.

## 6. Interview Narrative

Use this order:

1. Problem: skincare beginners need help organizing routines, products, and observations without unsafe medical claims.
2. Scope: the MVP focuses on profile, products, ingredients, routines, logs, journal, insights, and data control.
3. Safety: no diagnosis, no treatment promises, no skin score, no face/image analysis, and no marketplace behavior.
4. Architecture: modular monolith with App Router pages, thin API handlers, use cases, domain rules, repositories, MongoDB, DTO boundaries, and environment validation.
5. Rules before AI: deterministic routine safety rules run first; AI only explains or falls back safely.
6. Validation: v1.21 local validation and user-reported production smoke evidence are preserved as dated evidence.
7. Limitation: demo data is curated and educational; real provider integration, admin workflows, and commercial monitoring remain post-MVP options.

## 7. 3-5 Minute Demo Run Of Show

| Time | Show | Point to make |
|---|---|---|
| 0:00-0:30 | Landing page | Educational tracking MVP, not medical advice. |
| 0:30-1:00 | Login and Dashboard | Protected personal skincare workspace. |
| 1:00-1:30 | Skin Profile | Personalization context without diagnosis. |
| 1:30-2:10 | Product Match, Product Detail, Saved Products | Rule-based product comparison and explainability. |
| 2:10-2:40 | Ingredient Library | Beginner-friendly ingredient education. |
| 2:40-3:25 | Routine Builder and Routine Safety Analysis | Deterministic caution review before AI explanation. |
| 3:25-4:10 | Today Routine, Journal, Insights | Personal history, safe reflection, calculation explanations, and tracking data availability over time. |
| 4:10-4:40 | Settings and Data Export | Privacy and data-control thinking. |
| 4:40-5:00 | Close | MVP scope, validation evidence, limitations, next steps. |

## 8. Screenshot And Video Capture Plan

Recommended screenshot order:

```txt
Landing -> Dashboard -> Skin Profile -> Product Match -> Product Detail -> Routine Analysis -> Journal -> Insights -> Settings/Data Export
```

Suggested file naming if screenshots are captured later:

```txt
portfolio-01-landing.png
portfolio-02-dashboard.png
portfolio-03-skin-profile.png
portfolio-04-product-match.png
portfolio-05-product-detail.png
portfolio-06-routine-analysis.png
portfolio-07-journal.png
portfolio-08-insights.png
portfolio-09-settings-export.png
```

Demo video structure:

```txt
Length: 3-5 minutes
Format: screen recording with short narration
Content: use docs/demo-script.md
Evidence rule: do not claim the video exists until the file is actually recorded and stored
```

Before capturing screenshots or video:

- use a safe demo account;
- hide private email details where possible;
- avoid private journal content;
- close developer tools if secrets or tokens are visible;
- do not show `.env.local`, OAuth settings, database URIs, tokens, or provider keys;
- do not claim live production behavior was revalidated unless it was checked during that capture session.

## 9. Evidence Boundary

Historical validation evidence:

```txt
Evidence date: 2026-06-15
npm ci: PASS after unsandboxed rerun; sandboxed attempt failed with spawn EPERM
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 110 files / 1134 tests
npm run build: PASS after unsandboxed rerun; sandboxed attempt failed with spawn EPERM
npm run test:e2e: PASS after unsandboxed rerun - 31/31 Playwright tests; sandboxed attempt failed with spawn EPERM
npm audit: PASS - found 0 vulnerabilities
npm audit --omit=dev: PASS - found 0 vulnerabilities
```

Historical production evidence:

```txt
Production URL: https://skinwise-vn.vercel.app
Production smoke/monitoring: PASS, user-reported
Evidence date: 2026-06-04
Strict audit artifacts such as screenshots, deployment ids, browser logs, and sanitized Vercel logs are not included in this repository package unless stored separately.
```

Admin deployed smoke validation boundary:

```txt
MVP v1.48 deployed admin product review smoke verification.
Product validation commands: PASS for npm ci, lint, typecheck, unit tests, build, isolated admin product review smoke, and full E2E.
Browser smoke: PASS locally in v1.47 - unauthenticated redirect, non-admin block, admin list/search/filter/update/revert, public visibility, console/network, and no browser-visible secret exposure verified.
Deployed admin product review smoke: NOT RUN / INCOMPLETE.
Production-ready claimed: No.
Screenshot capture: Not run.
Demo video recording: Not run.
```

## 10. Package Links

- README: `README.md`
- Portfolio case study: `docs/portfolio-case-study.md`
- Demo script: `docs/demo-script.md`
- Screenshot checklist: `docs/screenshots-checklist.md`
- Demo data checklist: `docs/ai-coding/07-demo-data-and-demo-script.md`
- Final release checklist: `docs/final-release-checklist.md`
- Post-MVP backlog: `docs/post-mvp-backlog.md`
- Admin product review browser smoke evidence: `docs/release-evidence-admin-product-review-browser-smoke.md`
- Admin product review repeatable smoke evidence: `docs/release-evidence-admin-product-review-repeatable-smoke-v1.47.md`
- Admin product review deployed smoke evidence: `docs/release-evidence-admin-product-review-deployed-smoke-v1.48.md`
