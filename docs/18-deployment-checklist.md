# Deployment and Production Readiness Checklist - SkinWise VN MVP

Last updated: 2026-06-15

## 1. Current Deployment Status

```txt
Deployment status: MVP PORTFOLIO/DEMO/INTERVIEW READY with v1.43 local validation
Production-ready status: NOT CLAIMED for v1.43 without fresh deployed-URL smoke evidence
Current completed product release: MVP v1.8 - Insights Usability & Progress Story Refinement
Documentation closeout: MVP v1.8.1 and MVP v1.8.2 DONE
Fresh local validation evidence: MVP v1.43 PASS
Production smoke/monitoring evidence: historical PASS, user-reported; not freshly rerun for v1.43
Portfolio demo readiness: MVP v1.11 DONE
Post-MVP backlog planning: MVP v1.12 DONE
Latest completed milestone: MVP v1.43 - Release Evidence & Validation Cleanup
Current phase: Post-MVP validation cleanup
Recommended next task: MVP v1.44 - Production Smoke Test & Deployment Evidence
Deployment target: Vercel
Production branch: main
Production URL: https://skinwise-vn.vercel.app
Runtime baseline: Node.js 24.x / npm 11.x
```

Evidence boundary:

- Local validation evidence is supported by terminal output.
- Production smoke/monitoring PASS remains recorded from the previously user-reported stable MVP baseline.
- Production smoke and monitoring were not rerun specifically for v1.43, so production-ready status is not claimed for this milestone.
- Keep deployment id, screenshots, and sanitized logs separately if formal evidence is required.
- Do not expose secrets in docs or screenshots.

## 2. Pre-Deployment Checks

| Check | Status | Notes |
|---|---|---|
| `npm ci` | PASS | v1.43 unsandboxed rerun completed after sandboxed `spawn EPERM`; 749 packages installed. |
| `npm run lint` | PASS | v1.43 `eslint .` completed with no reported errors. |
| `npm run typecheck` | PASS | v1.43 `tsc --noEmit` completed with no reported errors. |
| `npm run test` | PASS | v1.43: 110 test files / 1134 tests passed. |
| `npm run build` | PASS | v1.43 unsandboxed rerun completed after sandboxed `spawn EPERM`. |
| `npm run db:indexes` | NOT RUN for v1.43 | Historical evidence recorded 32 indexes ensured; this command was not part of the v1.43 validation run. |
| E2E seed data | PASS | v1.43 E2E seed matched 70 ingredients and 70 products in `skinwise-e2e-check`. |
| `npm run test:e2e` | PASS | v1.43 unsandboxed rerun passed 31/31 Playwright tests after sandboxed `spawn EPERM`. |
| `npm audit` | PASS | v1.43 `found 0 vulnerabilities`. |
| `npm audit --omit=dev` | PASS | v1.43 `found 0 vulnerabilities`. |
| No out-of-scope feature added | PASS | MVP boundaries preserved. |
| README setup instructions accurate | PASS | Updated for v1.43 status, fresh validation, production evidence boundary, and deferred items. |
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
from the stable MVP baseline. It was not freshly rerun for v1.43.

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
Decision: READY for portfolio/demo/interview at MVP level
Production-ready decision: CONDITIONAL / NOT CLAIMED for v1.43 without fresh deployed-URL smoke evidence
Current phase: Post-MVP validation cleanup
Recommended next task: MVP v1.44 - Production Smoke Test & Deployment Evidence
```
