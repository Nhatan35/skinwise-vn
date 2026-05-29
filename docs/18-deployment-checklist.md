# Deployment and Production Readiness Checklist - SkinWise VN MVP v1.0

Last updated: 2026-05-29

## 1. Current Deployment Status

```txt
Deployment status: VERIFIED FOR MVP PORTFOLIO RELEASE
Deployment target: Vercel
Production branch: main
Production URL: https://skinwise-vn.vercel.app
Runtime baseline: Node.js 24.x / npm 11.x
Screenshot capture: skipped - not required for this submission
```

Production verification was completed by the project owner for the MVP demo scope.

Verified areas:

- Vercel production deployment.
- Production environment variables configured outside source control.
- Google OAuth production login.
- MongoDB-backed authenticated read/write flows.
- Protected route redirects.
- Authenticated dashboard.
- Skin Profile flow.
- Product Catalogue and Product Detail flow.
- Saved Products flow.
- Ingredient Library and Ingredient Detail flow.
- Routine Builder and Routine Analysis flow.
- Today Routine Log flow.
- Skin Journal flow.
- Settings/Data Control flow.
- Sign out behavior.
- Runtime readiness for MVP demo use.

## 2. Pre-Deployment Checks

| Check | Status | Notes |
|---|---|---|
| Project builds successfully | PASS | `npm run build` passed. |
| TypeScript has no blocking errors | PASS | `npm run typecheck` passed. |
| Lint passes | PASS | `npm run lint` passed. |
| Unit tests pass | PASS | 72 files / 719 tests passed. |
| E2E tests pass | PASS | 24/24 Playwright tests passed. |
| Database indexes verified | PASS | 32 indexes ensured. |
| Production audit passed | PASS | 0 recorded production vulnerabilities in final validation. |
| No out-of-scope feature added | PASS | MVP boundaries preserved. |
| README setup instructions accurate | PASS | Updated for final closeout. |
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
| Google OAuth client exists | PASS | Verified by project owner. |
| Production redirect URI configured | PASS | `https://skinwise-vn.vercel.app/api/auth/callback/google`. |
| `AUTH_GOOGLE_ID` set in Vercel | PASS | Value stored outside source control. |
| `AUTH_GOOGLE_SECRET` set in Vercel | PASS | Value stored outside source control. |
| Production Google login works | PASS | Verified by project owner. |

## 6. MongoDB Atlas Checklist

| Check | Status | Notes |
|---|---|---|
| Production MongoDB URI configured | PASS | Stored in Vercel environment variables. |
| Database user has required access | PASS | Verified through authenticated read/write flows. |
| Network access allows Vercel runtime | PASS | Verified through production usage. |
| Authenticated read/write works | PASS | Verified by project owner. |

## 7. Manual Production Smoke Test

| Flow | Status |
|---|---|
| Public landing page loads | PASS |
| Protected route redirects unauthenticated users | PASS |
| Google OAuth login | PASS |
| Dashboard after login | PASS |
| Skin Profile create/update/read | PASS |
| Product catalogue/detail | PASS |
| Saved Products save/remove | PASS |
| Ingredient library/detail | PASS |
| Routine Builder create/update | PASS |
| Routine Analysis mock/fallback | PASS |
| Today Routine Log complete/delete | PASS |
| Skin Journal create/edit/delete | PASS |
| Settings/Data Control | PASS |
| Sign out and protected route redirect | PASS |

## 8. Final Deployment Decision

```txt
MVP-PRODUCTION-VERIFY-001 — DONE
```

SkinWise VN is ready for MVP portfolio/submission use.
