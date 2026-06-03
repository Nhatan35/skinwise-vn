# Deployment and Production Readiness Checklist - SkinWise VN MVP

Last updated: 2026-06-03

## 1. Current Deployment Status

```txt
Deployment status: MVP PORTFOLIO/DEMO/INTERVIEW READY; CURRENT PRODUCTION EVIDENCE PENDING
Current completed product release: MVP v1.8 - Insights Usability & Progress Story Refinement
Current documentation cleanup patch/task: MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup
Recommended next task: MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
Deployment target: Vercel
Production branch: main
Production URL: https://skinwise-vn.vercel.app
Runtime baseline: Node.js 24.x / npm 11.x
Latest historical validated runtime: Node v24.14.0 / npm 11.14.1
Screenshot capture: skipped - not required for this submission
Current checklist: docs/final-release-checklist.md
Historical v1.3 release notes: docs/release-notes-v1.3.md
```

The project is no longer missing core MVP scope before portfolio/demo/interview use. MVP v1.8 completes the core product release, and v1.8.1 synchronizes release documentation.

Current evidence boundary:

- Portfolio/demo/interview readiness is achieved at MVP level.
- Current production smoke test evidence is still pending unless `docs/production-smoke-test-v1.9.md` is executed and updated with real results.
- Current production monitoring/demo recovery evidence is still pending unless the runbook checks are executed against the live deployment.
- Validation not rerun in this task. Pending local verification on Node.js 24.x and npm 11.x.
- Historical deployment verification notes remain preserved in older records, but are not treated as fresh v1.8.1 production evidence.

## 2. Pre-Deployment Checks

| Check | Status | Notes |
|---|---|---|
| `npm ci` | NOT RUN | Validation not rerun in this task. Pending local verification on Node.js 24.x and npm 11.x. |
| `npm run lint` | NOT RUN | Validation not rerun in this task. Pending local verification on Node.js 24.x and npm 11.x. |
| `npm run typecheck` | NOT RUN | Validation not rerun in this task. Pending local verification on Node.js 24.x and npm 11.x. |
| `npm run test` | NOT RUN | Validation not rerun in this task. Pending local verification on Node.js 24.x and npm 11.x. |
| `npm run build` | NOT RUN | Validation not rerun in this task. Pending local verification on Node.js 24.x and npm 11.x. |
| `npm run db:indexes` | NOT RUN | Not run in this documentation-only task; requires confirmed safe database target. |
| `npm run db:seed` | NOT RUN | Not run in this documentation-only task; requires confirmed safe local/development/demo database target. |
| `npm run test:e2e` | NOT RUN | Not run in this documentation-only task; requires browser/test auth/database setup. |
| `npm audit --omit=dev --audit-level=moderate` | NOT RUN | Not run in this documentation-only task. |
| No out-of-scope feature added | PASS | MVP boundaries preserved. |
| README setup instructions accurate | PASS | Updated for v1.8.1 documentation truth sync. |
| Runtime baseline documented | PASS | Node 24.x / npm 11.x. |
| CI workflow present | PASS | GitHub Actions workflow includes MongoDB service. |
| `.env.example` placeholder-only | PASS | No real secret values. |

## 3. Vercel Project Settings

| Setting | Expected Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | Project root |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Default Next.js output |
| Node.js Version | Node 24.x |
| Production Branch | `main` |

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

Optional provider/media variables may remain empty for MVP if the related feature is disabled.

## 5. Google OAuth Checklist

| Check | Status | Notes |
|---|---|---|
| Google OAuth client exists | PENDING | Re-check during MVP v1.9 production smoke test. |
| Production redirect URI configured | PENDING | Expected URI: `https://skinwise-vn.vercel.app/api/auth/callback/google`. Re-check during v1.9. |
| `AUTH_GOOGLE_ID` set in Vercel | PENDING | Confirm in Vercel settings without exposing the value. |
| `AUTH_GOOGLE_SECRET` set in Vercel | PENDING | Confirm in Vercel settings without exposing the value. |
| Production Google login works | PENDING | Verify during v1.9 production smoke test. |

## 6. MongoDB Atlas Checklist

| Check | Status | Notes |
|---|---|---|
| Production MongoDB URI configured | PENDING | Confirm in Vercel settings without exposing the value. |
| Database user has required access | PENDING | Verify during v1.9 production smoke test. |
| Network access allows Vercel runtime | PENDING | Verify during v1.9 production smoke test. |
| Authenticated read/write works | PENDING | Verify through authenticated flows during v1.9. |

## 7. Manual Production Smoke Test

| Flow | Status |
|---|---|
| Public landing page loads | NOT RUN |
| Protected route redirects unauthenticated users | NOT RUN |
| Google OAuth login | NOT RUN |
| Dashboard after login | NOT RUN |
| Skin Profile create/update/read/delete | NOT RUN |
| Product Match review/save/detail navigation | NOT RUN |
| Product Catalogue | NOT RUN |
| Product Detail | NOT RUN |
| Saved Products save/remove | NOT RUN |
| Ingredient library/detail/explanation | NOT RUN |
| Routine Builder create/update | NOT RUN |
| Routine Analysis mock/fallback | NOT RUN |
| Today Routine Log complete/delete | NOT RUN |
| Routine Logs | NOT RUN |
| Skin Journal create/edit/delete | NOT RUN |
| Insights review | NOT RUN |
| Settings/Data Control export/delete request | NOT RUN |
| Sign out and protected route redirect | NOT RUN |

## 8. Final Deployment Decision

```txt
MVP v1.8 - Core MVP product release: DONE
MVP v1.8.1 - Documentation truth sync: DONE
MVP v1.9 - Production smoke/monitoring/demo recovery evidence: NEXT
```

SkinWise VN is ready for MVP portfolio/demo/interview use. Full production evidence and monitoring hardening remain next-step work for MVP v1.9.
