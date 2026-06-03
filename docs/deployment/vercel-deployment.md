# Vercel Deployment Runbook - SkinWise VN MVP

Last updated: 2026-06-03

## Current Deployment Status

```txt
Deployment status: MVP PORTFOLIO/DEMO/INTERVIEW READY; CURRENT PRODUCTION EVIDENCE PENDING
Production URL: https://skinwise-vn.vercel.app
Production branch: main
Runtime baseline: Node.js 24.x / npm 11.x
Current completed product release: MVP v1.8 - Insights Usability & Progress Story Refinement
Completed documentation cleanup patch: MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup - DONE
Latest documentation consistency hotfix: MVP v1.8.2 - Final Documentation Consistency Hotfix - DONE
Next main task: MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
```

This is an MVP demo/portfolio deployment, not a full commercial production release.

Current v1.8.2 note: production smoke test evidence is NOT RUN until manually verified, and monitoring/demo recovery evidence is PENDING until manually verified.

SkinWise VN is a skincare routine tracker and educational MVP. It is not a medical diagnosis app, does not prescribe medication, does not guarantee treatment outcomes, and must not add skin scoring, attractiveness scoring, image analysis, marketplace, payment, or other out-of-scope features during this release.

## Vercel Project Settings

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | Project root |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Leave default for Next.js |
| Node.js Version | Node 24.x |
| Production Branch | `main` |

## Environment Variables

Configure production values only in Vercel Project Settings -> Environment Variables. Do not commit production secrets.

Required production values:

```txt
APP_ENV="production"
APP_BASE_URL="https://skinwise-vn.vercel.app"
AUTH_URL="https://skinwise-vn.vercel.app"
AUTH_SECRET="<secure-production-random-secret>"
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
AUTH_GOOGLE_ID="<google-oauth-client-id>"
AUTH_GOOGLE_SECRET="<google-oauth-client-secret>"
AI_PROVIDER="mock"
NEXT_TELEMETRY_DISABLED="1"
```

MVP feature flags:

```txt
FEATURE_AI_ROUTINE_ANALYSIS="false"
FEATURE_INGREDIENT_EXPLANATION="false"
FEATURE_IMAGE_UPLOAD="false"
FEATURE_NOTIFICATIONS="false"
FEATURE_MARKETPLACE="false"
FEATURE_SKIN_SCORE="false"
```

Optional values may remain empty when their feature flag is disabled:

```txt
AI_API_KEY=""
AI_MODEL=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## Google OAuth

Authorized redirect URI for production:

```txt
https://skinwise-vn.vercel.app/api/auth/callback/google
```

If a custom domain is added later, add the matching callback URL as well:

```txt
https://<custom-domain>/api/auth/callback/google
```

## MongoDB Atlas

Production `MONGODB_URI` must use MongoDB Atlas or another reachable production database. It must not use `127.0.0.1` or `localhost` in Vercel.

Checklist:

- Database user has the required read/write access.
- Password is URL-encoded when it contains special characters.
- Atlas Network Access allows the Vercel runtime to connect.
- Cluster is available and not paused.

## Deployment Steps

1. Push the final commit to `main`.
2. Confirm GitHub Actions CI passes.
3. Confirm Vercel creates a Production deployment.
4. Confirm deployment status is `Ready`.
5. Open the production URL.
6. Run the manual MVP smoke test.
7. Review Vercel runtime logs after smoke testing.

## Manual Production Smoke Test

Use `docs/production-smoke-test-v1.9.md` for the current v1.9 smoke-test evidence table. The checklist below describes expected behavior only; it is not current production evidence unless executed.

| Flow | Expected Result |
|---|---|
| Landing page | Page loads without 500/blank screen. |
| Protected route while signed out | Redirects to sign-in flow. |
| Google OAuth login | Login succeeds and returns to app. |
| Dashboard | Authenticated dashboard loads. |
| Skin Profile | Create/update/read works. |
| Product Catalogue | List/search works. |
| Product Detail | Detail route opens from catalogue and Product Match flows. |
| Product Match | Rule-based educational matches, score/level, reasons/cautions, save state, and detail navigation work. |
| Saved Products | Save/remove works. |
| Ingredient Library | List/search/detail works. |
| Routine Builder | Create/update works. |
| Routine Analysis | Mock/fallback result appears without crash. |
| Today Routine Log | Complete/delete works. |
| Skin Journal | Create/edit/delete works. |
| Insights | Skin Progress Insights and calendar route load with user-owned data. |
| Settings/Data Control | Page and deletion request flow work. |
| Sign out | Session ends and protected routes redirect. |

## Final Verification Result

Current v1.8.2 documentation hotfix does not rerun production verification.

```txt
MVP v1.8 - Core MVP product release: DONE
MVP v1.8.1 - Documentation truth sync: DONE
MVP v1.8.2 - Final documentation consistency hotfix: DONE
MVP v1.9 - Production smoke/monitoring/demo recovery evidence: NEXT
```
