# Final Release Checklist - SkinWise VN

Last updated: 2026-05-28

## 1. Release Scope

Release name: SkinWise VN MVP Portfolio Release v1.0

Purpose: confirm the project is ready to share through GitHub, portfolio, CV, mentor review, and BA internship interview.

This release is an MVP portfolio/demo release, not a full commercial production release.

## 2. Source Hygiene

| Check | Status | Notes |
|---|---|---|
| No `.env.local` in release context | Pass | Do not commit or package local secrets. |
| No `.env.production` in release context | Pass | Production secrets belong in Vercel settings only. |
| No real secrets documented | Pass | Docs use placeholders and public URL/status values only. |
| No generated build artifacts | Pass | `.next`, `node_modules`, logs, and tsbuildinfo removed or absent after validation cleanup. |
| `.gitignore` exists | Pass | Includes env, generated, log, zip, and key/certificate exclusions. |
| `.gitattributes` exists | Pass | Normalizes source/docs/config files to LF. |
| `.env.example` uses placeholders only | Pass | Template contains placeholders and empty optional values. |
| `package-lock.json` exists | Pass | Supports `npm ci` reproducibility. |

## 3. Documentation Readiness

| Check | Status | Notes |
|---|---|---|
| README updated | Pass | README is the portfolio entry point. |
| Portfolio case study ready | Pass | `docs/portfolio-case-study.md`. |
| Demo script ready | Pass | `docs/demo-script.md`. |
| Screenshots checklist ready | Pass | `docs/screenshots-checklist.md`. |
| Deployment runbook linked | Pass | `docs/deployment/vercel-deployment.md`. |
| Demo data guide linked | Pass | `docs/ai-coding/07-demo-data-and-demo-script.md`. |
| Known limitations documented | Pass | README, case study, demo script, release notes. |

## 4. Validation Readiness

| Command | Status | Notes |
|---|---|---|
| `npm run lint` | Pass | ESLint completed successfully. |
| `npm run typecheck` | Pass | `tsc --noEmit` completed successfully. |
| `npm run test` | Pass | Latest recorded local validation passed 72 test files and 717 tests. |
| `npm run build` | Pass | Production build passed with temporary non-secret placeholder environment values required by env validation. |
| `npm run test:e2e` | Pass | Latest recorded local validation passed 24 Playwright tests covering public smoke, authenticated dashboard, profile, products, saved products, ingredients, routines, routine analysis, today routine logs, skin journal, settings/data control, account deletion request, and dashboard reflection. |
| `npm audit --omit=dev --audit-level=moderate` | Pass | Reported 0 vulnerabilities. |

## 5. Demo Readiness

| Check | Status | Notes |
|---|---|---|
| Live demo URL documented | Pass | https://skinwise-vn.vercel.app |
| Previously documented production smoke test | Pass | DEPLOY-002 smoke test passed for MVP demo scope. |
| Demo account/data setup documented | Pass | User-owned demo data setup stays manual through authenticated UI. |
| Demo flow ready | Pass | README, demo script, and demo data guide. |
| Screenshots list ready | Pass | Screenshots still need manual capture if they will be included in portfolio assets. |

## 6. Portfolio Readiness

| Check | Status | Notes |
|---|---|---|
| Problem statement clear | Pass | Case study section 2. |
| Target users clear | Pass | Case study section 3. |
| Requirements clear | Pass | Case study functional and non-functional requirement tables. |
| Traceability matrix clear | Pass | Case study section 12. |
| Architecture overview clear | Pass | Case study section 14. |
| API overview clear | Pass | API methods verified from source route handlers. |
| Limitations honest | Pass | Current MVP exclusions are documented. |
| Roadmap realistic | Pass | Roadmap is marked as future work. |

## 7. Final Release Decision

Decision: Ready for portfolio release.

Allowed decisions:

- Ready for portfolio release.
- Ready with minor notes.
- Not ready.

Reason: documentation is complete, lint/typecheck/unit tests/build/E2E validation evidence has been recorded, production audit passed historically, and clean package hygiene checks are safe. Screenshots remain optional manual portfolio polish. Production re-verification remains separate from local E2E validation.

## 8. Optional Next Tasks

These are optional and not required for MVP completion:

- `OPTIONAL-SCREENSHOTS-001 - Capture and add final screenshots`.
- `OPTIONAL-PORTFOLIO-WEBSITE-001 - Publish case study on personal portfolio site`.
