# Deployment and Production Readiness Checklist - SkinWise VN MVP

Last updated: 2026-06-16

## 1. Current Deployment Status

```txt
Deployment status: MVP PORTFOLIO/DEMO/INTERVIEW READY with v1.48 local pre-deploy validation PASS
Production-ready status: NOT CLAIMED because v1.48 deployed admin product review smoke evidence is missing or incomplete
Current completed product release: MVP v1.8 - Insights Usability & Progress Story Refinement
Documentation closeout: MVP v1.8.1 and MVP v1.8.2 DONE
Fresh local validation evidence: MVP v1.48 local pre-deploy validation PASS
Production smoke/monitoring evidence: historical PASS, user-reported; v1.48 deployed admin product review smoke evidence is missing or incomplete
Portfolio demo readiness: MVP v1.11 DONE
Post-MVP backlog planning: MVP v1.12 DONE
Latest completed local validation: MVP v1.48 local pre-deploy validation PASS
Current phase: Post-MVP controlled product improvement
Current active milestone: MVP v1.48 deployed smoke remains open
Recommended next task: Complete deployed smoke evidence for MVP v1.48
Deployment target: Vercel
Production branch: main
Production URL: https://skinwise-vn.vercel.app
Runtime baseline: Node.js 24.x / npm 11.x
```

Evidence boundary:

- Local validation evidence is supported by terminal output.
- Production smoke/monitoring PASS remains recorded from the previously user-reported stable MVP baseline.
- v1.48 deployed admin product review smoke evidence is missing or incomplete, so production-ready status is not claimed.
- Keep deployment id, screenshots, and sanitized logs separately if formal evidence is required.
- Do not expose secrets in docs or screenshots.

## 2. Pre-Deployment Checks

| Check | Status | Notes |
|---|---|---|
| `npm ci` | PASS | v1.48 local pre-deploy validation passed. |
| `npm run lint` | PASS | v1.48 local pre-deploy validation passed. |
| `npm run typecheck` | PASS | v1.48 local pre-deploy validation passed. |
| `npm run test` | PASS | v1.48: 114 test files / 1171 tests passed. |
| `npm run build` | PASS | v1.48 local pre-deploy validation passed. |
| isolated admin product review smoke | PASS | v1.48: 3/3 tests passed. |
| `npm run db:indexes` | NOT RUN for v1.48 | Database index verification was not part of the v1.48 evidence lock. |
| E2E seed data | NOT SEPARATELY RECORDED for v1.48 | Full E2E passed, but separate seed-output evidence was not recorded for v1.48. |
| `npm run test:e2e` | PASS | v1.48: 34/34 Playwright tests passed. |
| `npm audit` | NOT RUN for v1.48 | Audit was not part of the v1.48 evidence lock. |
| `npm audit --omit=dev` | NOT RUN for v1.48 | Production audit was not part of the v1.48 evidence lock. |
| No out-of-scope feature added | PASS | MVP boundaries preserved. |
| README setup instructions accurate | PASS | Updated for v1.48 local validation, incomplete deployed smoke evidence, production evidence boundary, and deferred items. |
| Runtime baseline documented | PASS | Node 24.x / npm 11.x. |
| CI workflow present | PASS | GitHub Actions workflow includes MongoDB service. |
| `.env.example` placeholder-only | PASS | No real secret values. |

## 3. Vercel Project Settings

| Setting | Expected Value | Status |
|---|---|---|
| Framework Preset | Next.js | PASS, user-reported |
| Root Directory | Project root | PASS, user-reported |
| Install Command | `npm ci` | PASS, expected |
| Build Command | `npm run build` | PASS, expected |
| Output Directory | Default Next.js output | PASS, expected |
| Node.js Version | Node 24.x | PASS, expected |
| Production Branch | `main` | PASS, expected |

## 4. Production Environment Variables

Production secrets must be stored in Vercel Project Settings only. Do not commit or document real secret values.

Required production variables:

```txt
APP_ENV=production
APP_BASE_URL=https://skinwise-vn.vercel.app
AUTH_URL=https://skinwise-vn.vercel.app
AUTH_SECRET=<secure-production-secret>
AUTH_GOOGLE_ID=<google-oauth-client-id>
AUTH_GOOGLE_SECRET=<google-oauth-client-secret>
MONGODB_URI=<mongodb-atlas-production-uri>
AI_PROVIDER=mock
NEXT_TELEMETRY_DISABLED=1
```

MVP feature flags:

```txt
FEATURE_AI_ROUTINE_ANALYSIS=false
FEATURE_INGREDIENT_EXPLANATION=false
FEATURE_IMAGE_UPLOAD=false
FEATURE_NOTIFICATIONS=false
FEATURE_MARKETPLACE=false
FEATURE_SKIN_SCORE=false
```

## 5. Google OAuth Checklist

| Check | Status | Notes |
|---|---|---|
| Google OAuth client exists | PASS | User-reported checked. |
| Production redirect URI configured | PASS | Expected URI: `https://skinwise-vn.vercel.app/api/auth/callback/google`. |
| `AUTH_GOOGLE_ID` set in Vercel | PASS | User-reported checked; value not exposed. |
| `AUTH_GOOGLE_SECRET` set in Vercel | PASS | User-reported checked; value not exposed. |
| Production Google login works | PASS | User-reported production smoke verification completed. |

## 6. MongoDB Atlas Checklist

| Check | Status | Notes |
|---|---|---|
| Production MongoDB URI configured | PASS | User-reported checked; value not exposed. |
| Database user has required access | PASS | User-reported authenticated flows work. |
| Network access allows Vercel runtime | PASS | User-reported checked through production behavior. |
| Authenticated read/write works | PASS | User-reported checked through app flows. |

## 7. Manual Production Smoke Test

Status note: the table below is historical, user-reported production evidence
from the stable MVP baseline. v1.48 deployed admin product review smoke evidence
is missing or incomplete.

| Flow | Status |
|---|---|
| Public landing page loads | PASS |
| Protected route redirects unauthenticated users | PASS |
| Google OAuth login | PASS |
| Dashboard after login | PASS |
| Skin Profile create/update/read/delete | PASS |
| Product Match review/save/detail navigation | PASS |
| Product Catalogue | PASS |
| Product Detail | PASS |
| Saved Products save/remove | PASS |
| Ingredient library/detail/explanation | PASS |
| Routine Builder create/update | PASS |
| Routine Analysis mock/fallback | PASS |
| Today Routine Log complete/delete | PASS |
| Routine Logs | PASS |
| Skin Journal create/edit/delete | PASS |
| Insights review | PASS |
| Settings/Data Control export/delete request | PASS |
| Sign out and protected route redirect | PASS |

## 8. Final Deployment Decision

```txt
MVP v1.8 - Core MVP product release: DONE
MVP v1.8.1 - Documentation truth sync: DONE
MVP v1.8.2 - Final documentation consistency hotfix: DONE
MVP v1.9 - Local validation evidence: PASS
MVP v1.10 - Production smoke/monitoring evidence: PASS, user-reported
MVP v1.11 - Portfolio demo readiness: DONE
MVP v1.12 - Post-MVP backlog planning: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
MVP v1.14 - Data Quality Expansion: DONE
MVP v1.15 - Product Match Explainability & Safety Guardrails: DONE
MVP v1.15.1 - Audit Cleanup & Evidence Sync: DONE
MVP v1.43 - Release Evidence & Validation Cleanup: DONE / PASS, local validation; production smoke not freshly verified
MVP v1.44 - Admin Product Review API Foundation: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.45 - Admin Product Review UI & Workflow Polish: DONE / PASS, local lint/typecheck/unit/build; production smoke not performed
MVP v1.46 - Admin Product Review Browser Smoke & Evidence: DONE / MIXED, local browser smoke found Auth.js MissingSecret blocker; authenticated admin workflow blocked by missing demo account/data; production smoke not performed
MVP v1.47 - Admin Product Review Repeatable Smoke Data & Auth Config Fix: DONE / PASS locally, repeatable E2E admin/non-admin auth, unverified smoke product, admin browser smoke, and full E2E passed; production smoke not performed
MVP v1.48 - Deployed Admin Product Review Smoke Verification: BLOCKED / DEPLOYED SMOKE INCOMPLETE, local pre-deploy validation PASS; deployed smoke evidence missing or incomplete; production-ready not claimed
Decision: READY for portfolio/demo/interview at MVP level
Production-ready decision: NOT CLAIMED for v1.48 because deployed admin product review smoke evidence is missing or incomplete
Current phase: Post-MVP controlled product improvement
Current active milestone: MVP v1.48 deployed smoke remains open
Recommended next task: Complete deployed smoke evidence for MVP v1.48
```
