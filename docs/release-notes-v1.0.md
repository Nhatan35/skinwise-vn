# SkinWise VN MVP Portfolio Release v1.0

Release date: 2026-05-24

Latest QA cleanup update: 2026-05-25

## 1. Release Scope

SkinWise VN MVP Portfolio Release v1.0 is the final portfolio-ready MVP package for GitHub, portfolio review, CV/project explanation, mentor review, and BA internship interview preparation.

This release packages the completed Week 1-6 MVP implementation, deployment evidence, QA stabilization, demo data preparation, portfolio documentation, release checklist, and release notes.

This is an MVP demo/portfolio release, not a full commercial production release.

## 2. Completed Feature Areas

- Foundation.
- Authentication foundation.
- Skin Profile.
- Product Catalogue.
- Product Detail.
- Routine Builder.
- Routine Logs.
- Routine Safety Analysis.
- Skin Journal.
- Dashboard.
- Ingredient Explanation.
- Demo data.
- Portfolio documentation.
- Deployment documentation.

## 3. Quality and Readiness Tasks

- Vercel MVP demo deployment.
- Previously documented production smoke test.
- QA regression fix for LF/CRLF-safe clean package validation.
- Root `.gitattributes` line-ending normalization.
- Production dependency audit cleanup.
- Unauthenticated Playwright smoke test coverage.
- Demo data preparation.
- Portfolio case study.
- Presentation-ready demo script.
- Screenshots checklist.
- Final release checklist.
- Final README cleanup.

## 4. Deployment Summary

Documented deployment evidence:

- Production URL: https://skinwise-vn.vercel.app
- Deployment target: Vercel.
- Production branch: `main`.
- Production commit: `db72e07`.
- Previously documented production smoke test: passed.
- Google OAuth production login: passed.
- MongoDB production/demo read/write through authenticated flows: passed.

Production secrets are configured outside the repository in Vercel Project Settings. No real secrets are documented in this release note.

## 5. Validation Summary

Current validation after `E2E-001` cleanup:

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | Pass | ESLint completed successfully. |
| `npm run typecheck` | Pass | `tsc --noEmit` completed successfully. |
| `npm run test` | Pass | Vitest passed 60 test files and 603 tests. |
| `npm run build` | Pass | Production build passed with temporary non-secret placeholder environment values required by env validation. |
| `npm run test:e2e` | Pass | Playwright smoke tests cover the public landing page and unauthenticated protected-route redirects. |
| `npm audit --omit=dev --audit-level=moderate` | Pass | Reported 0 vulnerabilities. |

## 6. Known Limitations

- Real OpenAI/Gemini providers are not implemented.
- Current AI behavior uses mock/validated provider behavior for demo.
- The app is not a medical diagnosis tool.
- The app is not a dermatologist replacement.
- The app does not guarantee skincare treatment outcomes.
- Image upload and AI face analysis are not implemented.
- Skin score and attractiveness scoring are not implemented.
- Product CRUD and admin dashboard are not implemented.
- Marketplace, payment, subscription, and notifications are not implemented.
- Barcode scanner is not implemented.
- Product catalogue data is demo/seed-style data.
- E2E coverage is smoke-level only; authenticated E2E flows and real Google OAuth login are not tested in CI.
- Screenshots are not included unless captured separately through an optional screenshot task.

## 7. Next Possible Improvements

Future work, not implemented in this release:

- `OPTIONAL-SCREENSHOTS-001 - Capture and add final screenshots`.
- Add authenticated E2E coverage when a safe test-login mechanism exists.
- `OPTIONAL-PORTFOLIO-WEBSITE-001 - Publish case study on personal portfolio site`.
- Saved products.
- Admin product management.
- Improved product filtering.
- More routine safety rules.
- Better dashboard analytics.
- Real AI provider integration with strict safety boundaries.
- Optional image upload only with privacy safeguards.
- Notification reminders.

## 8. Release Decision

Release decision: Ready for portfolio release.

Reason: final documentation is complete, validation passed, production dependency audit passed, and clean package hygiene checks are safe. Screenshots remain optional manual portfolio polish.
