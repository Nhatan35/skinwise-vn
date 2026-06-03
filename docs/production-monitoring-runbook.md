# Production Monitoring and Demo Recovery Runbook

Last updated: 2026-06-03

## 1. Purpose

This runbook helps check production errors and recover during portfolio, demo, or interview walkthroughs for SkinWise VN.

It supports `MVP v1.9 - Production Monitoring & Demo Evidence Stabilization`. It does not prove production readiness unless the checks are actually executed and evidence is recorded.

## 2. Where to Check Production Errors

- Vercel deployment logs.
- Vercel function logs.
- Browser console.
- Browser Network tab.
- MongoDB Atlas monitoring/logs.
- NextAuth/OAuth provider configuration.

## 3. Vercel Logs Checklist

- Deployment status is Ready.
- Build errors are absent on the target deployment.
- Runtime errors are not appearing during smoke-test flows.
- API route errors are reviewed for failing requests.
- Environment variable issues are checked without exposing values.

## 4. MongoDB Connection Troubleshooting

- `MONGODB_URI` exists in the production environment.
- Database username and password are valid.
- IP/network access is configured for the deployment runtime.
- Correct database name is used.
- Connection timeout behavior is checked in function logs and MongoDB Atlas metrics.

## 5. NextAuth/OAuth Troubleshooting

The source environment schema uses `AUTH_URL` and `AUTH_SECRET`. Some hosting or Auth.js references may call these `NEXTAUTH_URL` and `NEXTAUTH_SECRET`; keep the configured names aligned with the actual project schema unless the code is deliberately changed.

- `NEXTAUTH_URL` / project `AUTH_URL` matches the deployed URL.
- `NEXTAUTH_SECRET` / project `AUTH_SECRET` is configured as a secure production secret.
- Google client ID is configured.
- Google client secret is configured.
- Authorized redirect URI includes `https://skinwise-vn.vercel.app/api/auth/callback/google`.
- OAuth consent screen status supports the demo account.

## 6. Environment Variable Checklist

Required production variables, based on `src/config/env.ts`:

```txt
APP_ENV
APP_BASE_URL
MONGODB_URI
AUTH_SECRET
AUTH_URL
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
AI_PROVIDER
```

Optional or feature-gated variables:

```txt
AI_API_KEY
AI_MODEL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
FEATURE_AI_ROUTINE_ANALYSIS
FEATURE_INGREDIENT_EXPLANATION
FEATURE_IMAGE_UPLOAD
FEATURE_NOTIFICATIONS
FEATURE_MARKETPLACE
FEATURE_SKIN_SCORE
NEXT_TELEMETRY_DISABLED
```

Local vs production differences:

- Local values belong in `.env.local`.
- Production values belong in the deployment provider dashboard.
- Do not commit `.env` files.
- Do not expose secrets in docs, screenshots, logs, PRs, issue comments, or demo recordings.

## 7. Safe Logging Rules

- Do not log access tokens.
- Do not log refresh tokens.
- Do not log OAuth secrets.
- Do not log database URI.
- Do not log full user profile data.
- Do not expose sensitive skincare notes unnecessarily.

## 8. Demo Recovery Checklist

- Refresh the page.
- Sign out and sign in again.
- Check Vercel deployment health.
- Check environment variables without exposing values.
- Check MongoDB availability.
- Use prepared demo account/data if available.
- Fall back to screenshots or recorded demo if production is unavailable.

## 9. Known Non-goals

- No diagnosis.
- No medical claim.
- No face analysis.
- No skin scoring.
- No prescription or treatment recommendation.
