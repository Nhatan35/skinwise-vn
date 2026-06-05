# Production Smoke Test Checklist - MVP v1.10

Last updated: 2026-06-05

## Purpose

This file records the production smoke-test evidence for SkinWise VN after the local validation evidence was completed.

Milestone context:

```txt
MVP v1.8 - Product release: DONE
MVP v1.8.1 - Documentation truth sync: DONE
MVP v1.8.2 - Final documentation consistency hotfix: DONE
MVP v1.9 - Local validation evidence: PASS
MVP v1.10 - Production smoke test and monitoring evidence: PASS, user-reported
MVP v1.11 - Portfolio demo readiness: DONE
MVP v1.12 - Post-MVP backlog planning: DONE
Latest completed milestone: MVP v1.13 - UX Polish & Empty State Improvement
Current phase: Post-MVP controlled improvement
```

Allowed statuses:

```txt
PASS
FAIL
BLOCKED
NOT RUN
```

Use `PASS` only after verification. This file records production PASS based on the user's reported completed manual verification with no blockers reported.

## Test Context

```txt
Production URL: https://skinwise-vn.vercel.app
Evidence date: 2026-06-04
Tester: Tran Nhat An / project owner
Environment: Vercel production deployment
Browser/device: Manual browser verification, exact browser not captured
Authentication: Google OAuth demo account
Evidence strength: User-reported manual verification; no screenshots/log snippets included in repository
Critical blockers reported: None
```

Do not record real secrets, OAuth tokens, database URIs, private notes, or sensitive user profile data in this file.

## Pre-Smoke Local Validation Evidence

| Check | Status | Evidence / Notes |
|---|---|---|
| Lint | PASS | `npm run lint` completed with no reported errors. |
| Typecheck | PASS | `npm run typecheck` completed with no reported errors. |
| Unit tests | PASS | 96 test files; 889 tests passed. |
| Production build | PASS | `npm run build` completed successfully. |
| Database indexes | PASS | 32 indexes ensured. |
| Database seed | PASS | 40 ingredients and 38 products matched/updated in `skinwise-e2e-check`. |
| E2E tests | PASS | 29/29 Playwright tests passed. |
| Security audit | PASS | 0 vulnerabilities found. |
| Install evidence | NOT CAPTURED | `npm ci` was not shown in the provided terminal log. |

## Production Smoke Checklist

| Item | Status | Evidence / Notes |
|---|---|---|
| Public landing page loads | PASS | User-reported production verification completed; no blocker reported. |
| Protected route redirects unauthenticated user to sign-in | PASS | User-reported production verification completed; no blocker reported. |
| Google OAuth login works | PASS | User-reported production verification completed; no blocker reported. |
| Dashboard loads after login | PASS | User-reported production verification completed; no blocker reported. |
| Skin Profile create/edit/delete works | PASS | User-reported production verification completed; no blocker reported. |
| Product catalogue loads | PASS | User-reported production verification completed; no blocker reported. |
| Product match works | PASS | User-reported production verification completed; no blocker reported. |
| Product detail page works | PASS | User-reported production verification completed; no blocker reported. |
| Save/unsave product works | PASS | User-reported production verification completed; no blocker reported. |
| Ingredient library loads | PASS | User-reported production verification completed; no blocker reported. |
| Ingredient detail/explanation works | PASS | User-reported production verification completed; no blocker reported. |
| Routine builder works | PASS | User-reported production verification completed; no blocker reported. |
| Routine analysis works | PASS | User-reported production verification completed; no blocker reported. |
| Today checklist works | PASS | User-reported production verification completed; no blocker reported. |
| Routine logs work | PASS | User-reported production verification completed; no blocker reported. |
| Skin journal works | PASS | User-reported production verification completed; no blocker reported. |
| Insights page works | PASS | User-reported production verification completed; no blocker reported. |
| Settings page works | PASS | User-reported production verification completed; no blocker reported. |
| Data export works | PASS | User-reported production verification completed; no blocker reported. |
| Data delete request flow works | PASS | User-reported production verification completed; no blocker reported. |
| Sign out works | PASS | User-reported production verification completed; no blocker reported. |

## Production Monitoring Checklist

| Area | Status | Evidence / Notes |
|---|---|---|
| Vercel deployment status | PASS | User-reported checked; no blocker reported. |
| Vercel build logs | PASS | User-reported checked; no blocker reported. |
| Vercel function/runtime logs | PASS | User-reported checked; no critical runtime blocker reported. |
| Browser console | PASS | User-reported checked; no critical blocker reported. |
| Browser Network tab | PASS | User-reported checked; no critical API failure reported. |
| Google OAuth callback | PASS | User-reported checked; login flow works. |
| MongoDB authenticated read/write | PASS | User-reported checked through authenticated production flows. |
| Secrets exposure check | PASS | No secrets intentionally documented. |

## Result

```txt
Production smoke test evidence: PASS
Production monitoring evidence: PASS
Critical production blockers: None reported
Portfolio demo readiness impact: READY at MVP level
Portfolio evidence tasks: screenshots, demo video, CV/portfolio case study
```

## Evidence Improvement Note

For stricter traceability, capture and store outside public docs if appropriate:

- Vercel deployment id.
- Browser/version/device.
- Screenshots of main flows.
- Console/network screenshots with no secrets.
- Vercel log snippets with no secrets.
- A dated issue list if any flow fails later.
