# Deployment and Production Readiness Checklist - MVP v1.2.6

## 1. Purpose

This checklist tracks whether SkinWise VN is ready to move from local development to a safe Vercel portfolio/demo deployment.

Current task:

```txt
TASK DEPLOY-001 - Prepare Vercel deployment for SkinWise VN MVP
```

Current status:

```txt
Deployment prepared.
Actual Vercel deployment: NOT RUN.
Production URL: NOT PROVIDED.
Production smoke test: NOT TESTED.
```

Detailed runbook:

```txt
docs/deployment/vercel-deployment.md
```

## 2. Pre-Deployment Checks

```txt
[ ] Project builds successfully.
[ ] TypeScript has no blocking errors.
[ ] Lint passes.
[ ] Unit tests pass.
[ ] Integration tests pass where implemented.
[ ] E2E happy path passes where implemented.
[ ] No out-of-scope feature has been added.
[ ] README setup instructions are accurate.
[ ] Deployment runbook is current.
[ ] ADRs still match implementation decisions.
[ ] PR checklist and CI workflow are present if using GitHub.
[ ] .env.example is current and placeholder-only.
```

## 3. Vercel Project Settings

```txt
[ ] Framework Preset: Next.js.
[ ] Root Directory: project root.
[ ] Install Command: npm ci when package-lock.json is present; otherwise npm install.
[ ] Build Command: npm run build.
[ ] Output Directory: leave default for Next.js.
[ ] Node.js Version: Node 20.x recommended.
```

## 4. Environment Variables

Use only variables supported by `src/config/env.ts` and Auth.js runtime inference. This project uses `AUTH_URL` and `APP_BASE_URL`; do not add `NEXTAUTH_URL` unless source code is deliberately changed.

Required for production app boot:

```txt
[ ] APP_ENV="production"
[ ] APP_BASE_URL="https://<your-vercel-domain>"
[ ] MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
[ ] AUTH_SECRET="<secure-production-random-secret>"
[ ] AUTH_URL="https://<your-vercel-domain>"
```

Required for Google OAuth login:

```txt
[ ] AUTH_GOOGLE_ID="<google-oauth-client-id>"
[ ] AUTH_GOOGLE_SECRET="<google-oauth-client-secret>"
```

Google OAuth variables are not required for app boot, but production Google login will not work without them.

Demo AI provider:

```txt
[ ] AI_PROVIDER="mock"
```

Optional/future AI variables:

```txt
[ ] AI_API_KEY=""
[ ] AI_MODEL=""
```

Optional/future Cloudinary variables:

```txt
[ ] CLOUDINARY_CLOUD_NAME=""
[ ] CLOUDINARY_API_KEY=""
[ ] CLOUDINARY_API_SECRET=""
```

Feature flags:

```txt
[ ] FEATURE_AI_ROUTINE_ANALYSIS="false"
[ ] FEATURE_INGREDIENT_EXPLANATION="false"
[ ] FEATURE_IMAGE_UPLOAD="false"
[ ] FEATURE_NOTIFICATIONS="false"
[ ] FEATURE_MARKETPLACE="false"
[ ] FEATURE_SKIN_SCORE="false"
```

Current AI status: provider abstraction, validated wrapper, and mock provider are implemented. OpenAI and Gemini providers are not implemented yet, and production AI integration is not verified.

## 5. Security And Package Checks

```txt
[ ] .env.local exists only locally and is not tracked.
[ ] .env.local is not included in clean zip/source packages.
[ ] .env.example contains placeholders only.
[ ] Production secrets are configured in Vercel Project Settings only.
[ ] Secrets are rotated if they were pushed publicly, uploaded, pasted into chat, screenshotted, or shared externally.
[ ] Clean package excludes .git, .env*, .env*.local, .next, node_modules, .vercel, coverage, dist, out, test-results, playwright-report, tsbuildinfo, nested zip files, logs, and private key/certificate files.
[ ] npm audit --omit=dev --audit-level=moderate passes before DEPLOY-002.
```

Current production dependency audit note:

```txt
TASK SECURITY-AUDIT-001 completed.
npm audit --omit=dev --audit-level=moderate: Pass - found 0 vulnerabilities.
The previous 3 moderate advisories were resolved without npm audit fix --force and without downgrading Next.js.
```

Keep the same-major npm overrides for `postcss` and `qs` until a future safe upstream update makes them unnecessary and the production audit remains clean.

## 6. Database Checks

```txt
[ ] MongoDB Atlas production/demo cluster exists.
[ ] Separate demo database is used for portfolio deployment.
[ ] Database user has least-privilege access where possible.
[ ] Connection string is not committed or printed.
[ ] Atlas network access allows Vercel.
[ ] Database name is verified.
[ ] Required indexes are documented.
[ ] npm run db:indexes exists and has been run for the confirmed demo database if needed.
[ ] npm run db:seed is run only against the intended demo database.
[ ] Unique constraint behavior is planned for SkinJournal userId + localDate.
[ ] Upsert behavior is planned for RoutineLog userId + routineId + localDate.
```

`0.0.0.0/0` is convenient for an MVP demo but less restrictive. Prefer tighter access controls when feasible.

## 7. Auth Checks

```txt
[ ] Auth.js secret is configured and stable for the target environment.
[ ] AUTH_URL matches the deployment domain.
[ ] APP_BASE_URL matches the deployment domain.
[ ] Google OAuth authorized JavaScript origin is https://<your-vercel-domain>.
[ ] Google OAuth authorized redirect URI is https://<your-vercel-domain>/api/auth/callback/google.
[ ] Local redirect URI http://localhost:3000/api/auth/callback/google remains available for development.
[ ] Auth.js uses JWT session strategy unless a new ADR explicitly approves database sessions.
[ ] Protected routes are protected.
[ ] API routes requiring auth reject unauthenticated requests.
[ ] User-owned resources enforce ownership checks.
[ ] Admin-only routes are not exposed unless implemented.
```

## 8. AI Safety Checks

```txt
[ ] AI endpoints are server-only.
[ ] Rule engine runs before AI.
[ ] AI output is schema validated.
[ ] AI fallback policy is implemented before public demo of analysis.
[ ] Rate limits exist for AI endpoints.
[ ] AI_PROVIDER is mock unless a real provider is implemented and verified.
[ ] Unsafe or medical claims are not presented as diagnosis or treatment.
```

## 9. Privacy Checks

```txt
[ ] No raw sensitive data is logged.
[ ] Structured logs avoid secrets, raw AI prompts, access tokens, and sensitive journal content.
[ ] Journal data is private to the owner.
[ ] Skin profile data is private to the owner.
[ ] Product visibility rules are enforced.
[ ] Error messages do not expose internal details.
[ ] SkinWise-owned API responses do not expose raw MongoDB ObjectId values.
[ ] Image upload is disabled unless explicitly implemented later.
```

## 10. UI And Demo Readiness

```txt
[ ] Loading states exist.
[ ] Error states exist.
[ ] Empty states exist.
[ ] No medical diagnosis claims appear in UI.
[ ] No appearance scoring or pressure appears in UI.
[ ] Dashboard shell works after login.
[ ] Seed data is safe and minimal.
[ ] Core MVP flow is testable.
[ ] Known limitations are documented.
[ ] Post-MVP features are not advertised as completed.
```

## 11. Production Smoke Test

Run after a real Vercel deployment exists.

```txt
[ ] / loads successfully.
[ ] Landing page shows current MVP/post Week 6 messaging.
[ ] No false deployment claim appears.
[ ] Google sign-in works.
[ ] User lands on dashboard or intended callback URL.
[ ] Protected routes redirect unauthenticated users.
[ ] /dashboard loads after login.
[ ] /skin-profile loads and can create/update profile.
[ ] /products loads and search/filter works.
[ ] /products/[id] loads.
[ ] /routines loads and can create routine.
[ ] Routine analysis result appears.
[ ] Routine log status can be updated.
[ ] /journal loads and can create/edit/delete entry.
[ ] /api/me returns authenticated user data after login.
[ ] Safety wording avoids diagnosis, treatment promises, skin scoring, and dermatologist replacement claims.
```

## 12. Known Deployment Limitations

```txt
[ ] Actual Vercel deployment has not been executed.
[ ] Production URL has not been provided.
[ ] Production smoke test has not been completed.
[ ] Google OAuth production callback has not been tested.
[ ] MongoDB Atlas production/demo access has not been tested.
[ ] E2E tests are config-only while tests/e2e has no real specs.
[ ] Real OpenAI/Gemini provider is not implemented.
[ ] Image upload is out of scope.
[ ] Marketplace is out of scope.
[ ] Notifications are out of scope.
[ ] Skin score is out of scope.
[ ] Medical diagnosis is out of scope.
```

## 13. Release Note Requirement

Every deployable milestone must update:

```txt
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
```

## 14. Next Task

```txt
TASK DEPLOY-002 - Execute Vercel deployment and run production smoke test
```
