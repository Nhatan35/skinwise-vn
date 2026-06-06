# SkinWise VN - Portfolio Case Study

Last updated: 2026-06-06

## 1. Executive Summary

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users organize their skin profile, review rule-based product matches, understand products and ingredients, build routines, track daily completion, write skin journal entries, and review progress insights over time.

This project was built as a portfolio-ready full-stack MVP and BA practice project. It demonstrates problem framing, MVP scoping, requirement discipline, safe product boundaries, modular full-stack implementation, testing, release evidence, production smoke-test discipline, and demo readiness.

Production demo:

```txt
https://skinwise-vn.vercel.app
```

Current portfolio status:

```txt
MVP v1.8 - Product release: DONE
MVP v1.8.1 - Documentation truth sync: DONE
MVP v1.8.2 - Final documentation consistency hotfix: DONE
MVP v1.9 - Local validation evidence: PASS
MVP v1.10 - Production smoke/monitoring evidence: PASS, user-reported
MVP v1.11 - Portfolio demo readiness: DONE
MVP v1.12 - Post-MVP backlog planning: DONE
Latest completed milestone: MVP v1.15 - Product Match Explainability & Safety Guardrails
Current phase: Post-MVP controlled improvement
Recommended next task: Portfolio Evidence Package
```

Evidence note: local validation is supported by command output. Production smoke and monitoring PASS remain recorded from the previously user-reported stable MVP baseline and were not rerun specifically for v1.15. Keep screenshots/log excerpts separately if a reviewer requires stricter traceability.

## 2. Problem Statement

Skincare beginners often struggle with:

- remembering their skin profile and concerns;
- understanding what products and ingredients are for;
- choosing products that fit their profile without overclaiming medical outcomes;
- building a safe and consistent routine;
- tracking whether they completed their routine;
- recording observations over time;
- distinguishing educational guidance from diagnosis or medical advice.

SkinWise VN addresses these needs with a safe MVP focused on organization, education, routine consistency, and reflection rather than medical diagnosis, treatment, or appearance scoring.

## 3. Target Users

Primary users:

- Vietnamese skincare beginners;
- users who want to organize a skincare routine;
- users who want lightweight product and ingredient education;
- users who want a personal routine log and skin journal;
- users who want progress reflection without unsafe claims.

This MVP does not target clinical diagnosis, prescription treatment, or commercial skincare purchase conversion.

## 4. Product Scope

### In scope

- Authentication and protected user-owned data.
- Skin Profile onboarding and management.
- Product Catalogue and Product Detail.
- Rule-based Product Match.
- Saved Products.
- Ingredient Library and Ingredient Detail.
- Ingredient Explanation with safe fallback behavior.
- Routine Builder.
- Routine Safety Analysis.
- Today Routine Checklist and Routine Logs.
- Skin Journal.
- Insights and Dashboard summary.
- Settings/Data Control, data export, app data deletion, account deletion request marker.
- Demo data, smoke checklist, release checklist, and portfolio documentation.

### Out of scope

- Medical diagnosis.
- Medication prescription.
- Treatment guarantee.
- Dermatologist replacement.
- Skin score, appearance score, attractiveness scoring, or before/after pressure.
- Image upload or image-based skin analysis.
- Marketplace, cart, checkout, payment, subscription, ratings, or reviews.
- Admin product management in the current MVP.
- Required real external AI integration.

## 5. Core User Journey

The intended demo story is:

```txt
A skincare beginner logs in
-> creates or reviews their Skin Profile
-> checks product matches
-> opens product details and ingredient context
-> saves useful products
-> builds morning/evening routines
-> runs routine safety analysis
-> completes today's routine
-> writes journal entries
-> reviews progress insights
-> exports or controls their data in Settings
```

## 6. BA Perspective

### Requirement thinking shown in this project

| BA concern | How SkinWise VN demonstrates it |
|---|---|
| Problem framing | Focuses on skincare organization and education, not medical decision-making. |
| Scope control | Excludes marketplace, image analysis, admin CRUD, payments, and diagnosis from MVP. |
| User journey | Connects profile, product match, product detail, routine, journal, and insights. |
| Business rules | Product Match and Routine Analysis use deterministic rules and safety boundaries. |
| Non-functional awareness | Includes protected routes, privacy boundaries, validation, fallback, and evidence docs. |
| Traceability | Docs map features to routes, APIs, tests, and release evidence. |
| Release discipline | Local validation, smoke test, monitoring runbook, and final checklist are documented. |

### Requirement examples

| Requirement type | Example |
|---|---|
| Functional | User can create and update a Skin Profile. |
| Functional | User can run Product Match based on profile data. |
| Functional | User can save and unsave products. |
| Non-functional | Protected app routes require authentication. |
| Non-functional | Product guidance must remain educational and non-medical. |
| Business rule | Product Match must not guarantee skincare outcomes. |
| Data rule | User-owned data must be scoped to the authenticated user. |
| Safety rule | Routine Analysis must include caution wording for potentially risky combinations. |

## 7. Technical Architecture Summary

SkinWise VN uses a modular Next.js application structure with clear boundaries:

```txt
App Router pages/routes
-> API route handlers
-> application/use-case services
-> domain rules and validation
-> repository/infrastructure layer
-> MongoDB persistence
```

Key technical choices:

- Next.js App Router for full-stack routing.
- Auth.js/NextAuth for authentication.
- MongoDB for document storage.
- Zod for environment/data validation boundaries.
- DTO mappers for API response consistency.
- Vitest for unit tests.
- Playwright for E2E tests.
- Vercel for production deployment.

## 8. Validation and Release Evidence

Local validation evidence:

```txt
Evidence date: 2026-06-06
Environment: Local Windows / PowerShell
Branch: main
Runtime baseline: Node.js 24.x / npm 11.x
npm ci: PASS
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 899 tests
npm run build: PASS
npm run test:e2e: PASS - 29/29 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Production evidence:

```txt
Production URL: https://skinwise-vn.vercel.app
Production smoke/monitoring evidence: PASS - previously user-reported stable MVP baseline
Production smoke and monitoring were not rerun specifically for v1.15 because v1.15 was validated locally as a controlled Product Match/Product Detail explainability update.
Critical blockers reported: None
Evidence date: 2026-06-04
```

Production evidence can be strengthened with screenshots, Vercel deployment id, browser/network notes, and issue records if the project is submitted for a formal audit. These are portfolio evidence tasks, not product correctness blockers.

## 9. Demo Script Summary

Use this 3-5 minute structure:

1. Introduce the problem and safety boundary.
2. Show landing page and Google login.
3. Show Dashboard as the personal skincare hub.
4. Show Skin Profile.
5. Run Product Match.
6. Open Product Detail and save a product.
7. Show Ingredient Library and explanation.
8. Build or review a routine.
9. Run Routine Safety Analysis.
10. Complete Today Routine.
11. Add/review Skin Journal.
12. Show Insights.
13. Show Settings/Data Export.
14. Close with validation evidence and MVP boundaries.

## 10. Demo Data Checklist

Recommended demo account data:

- 1 complete Skin Profile.
- 3-5 Saved Products.
- 1 Morning Routine.
- 1 Evening Routine.
- 1 Routine Safety Analysis example.
- 3-5 Routine Logs.
- 5-7 Skin Journal entries.
- Insights page with visible activity.
- Data Export tested once.
- Account deletion request flow understood but used carefully.

## 11. Screenshots Checklist

Screenshots are optional, but useful for a portfolio page or slide deck:

- Landing page.
- Dashboard.
- Skin Profile.
- Product Catalogue.
- Product Match result.
- Product Detail with match explanation.
- Saved Products.
- Ingredient Library.
- Ingredient Detail/Explanation.
- Routine Builder.
- Routine Analysis.
- Today Routine.
- Skin Journal.
- Insights.
- Settings/Data Export.

## 12. Strong Interview Talking Points

- I controlled MVP scope instead of building too many features.
- I separated educational skincare guidance from medical claims.
- I used deterministic rules before depending on external AI.
- I protected user-owned data behind authentication.
- I validated the project with unit tests, E2E tests, build checks, lint, typecheck, database seed/index scripts, audit, production smoke checks, and release documentation.
- I prepared the project for demo with a clear case study, demo script, and evidence checklist.

## 13. Limitations and Future Improvements

Intentional MVP limitations:

- Product/ingredient data is curated and demo-oriented.
- External AI provider use is not required for the MVP.
- Admin CRUD is out of MVP scope.
- Marketplace/payment is out of MVP scope.
- Full production observability with external monitoring tools is out of MVP scope.

Future improvements:

- Portfolio Evidence Package for screenshots, demo video, and CV/portfolio case-study polish.
- Admin product/ingredient management.
- Better analytics and structured progress review.
- Optional real provider integration with strict safety controls.
- More robust production monitoring.
- Optional screenshot/demo video portfolio evidence.
- More complete account deletion workflow.

## 14. Closing Statement

SkinWise VN is valuable as a portfolio project because it shows both BA thinking and full-stack execution. It defines a clear user problem, controls MVP scope, implements a complete core journey, documents safety boundaries, validates quality, verifies production readiness, and presents the result in a form suitable for demo, interview, and portfolio review.
