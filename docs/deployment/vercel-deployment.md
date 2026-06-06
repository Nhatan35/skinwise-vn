# Vercel Deployment Runbook - SkinWise VN

Last updated: 2026-06-06

## 1. Current Deployment Status

```txt
Deployment target: Vercel
Production URL: https://skinwise-vn.vercel.app
Production branch: main
Runtime baseline: Node.js 24.x / npm 11.x
Local validation: PASS
Production smoke/monitoring: PASS, user-reported
Portfolio readiness: MVP v1.11 DONE
Post-MVP backlog planning: MVP v1.12 DONE
Latest completed milestone: MVP v1.15 - Product Match Explainability & Safety Guardrails
Current phase: Post-MVP controlled improvement
Recommended next task: Portfolio Evidence Package
```

This document explains the expected Vercel setup and how to verify/recover production behavior.

## 2. Required Vercel Settings

| Setting | Expected Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | Project root |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Default Next.js output |
| Node.js Version | Node 24.x |
| Production Branch | `main` |

## 3. Required Environment Variables

Do not place real values in docs, screenshots, commits, or chat logs.

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

MVP feature flags should remain disabled unless intentionally implemented:

```txt
FEATURE_AI_ROUTINE_ANALYSIS=false
FEATURE_INGREDIENT_EXPLANATION=false
FEATURE_IMAGE_UPLOAD=false
FEATURE_NOTIFICATIONS=false
FEATURE_MARKETPLACE=false
FEATURE_SKIN_SCORE=false
```

## 4. Google OAuth Redirect URI

Expected production redirect URI:

```txt
https://skinwise-vn.vercel.app/api/auth/callback/google
```

## 5. Production Smoke Test

Use `docs/production-smoke-test-v1.9.md` for the production evidence table.

Current status:

```txt
Production smoke test: PASS - user-reported manual verification completed
Production monitoring: PASS - user-reported checks completed
Critical blockers reported: None
```

## 6. Recovery Steps

If production fails:

1. Check Vercel deployment status.
2. Check build logs.
3. Check function/runtime logs.
4. Check browser console.
5. Check browser Network tab.
6. Check OAuth redirect URI and secrets.
7. Check MongoDB Atlas access and connection string.
8. Record issue as FAIL/BLOCKED in the smoke checklist.

## 7. Final Deployment Decision

```txt
MVP v1.11 - Portfolio Demo Readiness: DONE
MVP v1.13 - UX Polish & Empty State Improvement: DONE
MVP v1.14 - Data Quality Expansion: DONE
MVP v1.15 - Product Match Explainability & Safety Guardrails: DONE
Deployment readiness: READY at MVP level
Current phase: Post-MVP controlled improvement
```
