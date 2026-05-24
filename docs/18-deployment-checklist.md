# Deployment and Production Readiness Checklist - MVP v1.2.6

## 1. Purpose

This checklist tracks whether SkinWise VN is ready to move from local development to a safe Vercel portfolio/demo deployment.

Current task:

```txt
TASK DEPLOY-002 - Execute Vercel deployment and run production smoke test
```

Current status:

```txt
Deployment status: Deployed for MVP demo.
Actual Vercel deployment: COMPLETED.
Deployment target: Vercel.
Production branch: main.
Production commit: db72e07.
Production URL: https://skinwise-vn.vercel.app
Production smoke test: PASSED.
Google OAuth production login: PASSED.
MongoDB production/demo read/write through authenticated flows: PASSED.
TASK DEPLOY-002: COMPLETED.
```

Detailed runbook:

```txt
docs/deployment/vercel-deployment.md
```

## 2. Pre-Deployment Checks

```txt
[x] Project builds successfully.
[x] TypeScript has no blocking errors.
[x] Lint passes.
[x] Unit tests pass.
[x] Integration tests pass where implemented.
[ ] E2E happy path passes where implemented.
[x] No out-of-scope feature has been added.
[x] README setup instructions are accurate.
[x] Deployment runbook is current.
[ ] ADRs still match implementation decisions.
[ ] PR checklist and CI workflow are present if using GitHub.
[x] .env.example is current and placeholder-only.
```

## 3. Vercel Project Settings

```txt
[x] Framework Preset: Next.js.
[x] Root Directory: project root.
[x] Install Command: npm ci when package-lock.json is present; otherwise npm install.
[x] Build Command: npm run build.
[x] Output Directory: leave default for Next.js.
[x] Node.js Version: Node 20.x recommended.
```

## 4. Environment Variables

Use only variables supported by `src/config/env.ts` and Auth.js runtime inference. This project uses `AUTH_URL` and `APP_BASE_URL`; do not add `NEXTAUTH_URL` unless source code is deliberately changed.

Required for production app boot:

```txt
[x] APP_ENV="production"
[x] APP_BASE_URL="https://skinwise-vn.vercel.app"
[x] MONGODB_URI configured in Vercel Project Settings
[x] AUTH_SECRET configured in Vercel Project Settings
[x] AUTH_URL="https://skinwise-vn.vercel.app"
```

Required for Google OAuth login:

```txt
[x] AUTH_GOOGLE_ID configured in Vercel Project Settings
[x] AUTH_GOOGLE_SECRET configured in Vercel Project Settings
```

Google OAuth variables are not required for app boot, but production Google login will not work without them.

Demo AI provider:

```txt
[x] AI_PROVIDER="mock"
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
[x] .env.local exists only locally and is not tracked.
[x] .env.local is not included in clean zip/source packages.
[x] .env.example contains placeholders only.
[x] Production secrets are configured in Vercel Project Settings only.
[ ] Secrets are rotated if they were pushed publicly, uploaded, pasted into chat, screenshotted, or shared externally.
[x] Clean package excludes .git, .env*, .env*.local, .next, node_modules, .vercel, coverage, dist, out, test-results, playwright-report, tsbuildinfo, nested zip files, logs, and private key/certificate files.
[x] npm audit --omit=dev --audit-level=moderate passes before DEPLOY-002.
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
[x] MongoDB Atlas production/demo cluster exists.
[x] Separate demo database is used for portfolio deployment.
[ ] Database user has least-privilege access where possible.
[x] Connection string is not committed or printed.
[x] Atlas network access allows Vercel.
[x] Database name is verified.
[ ] Required indexes are documented.
[ ] npm run db:indexes exists and has been run for the confirmed demo database if needed.
[ ] npm run db:seed is run only against the intended demo database.
[ ] Unique constraint behavior is planned for SkinJournal userId + localDate.
[ ] Upsert behavior is planned for RoutineLog userId + routineId + localDate.
```

`0.0.0.0/0` is convenient for an MVP demo but less restrictive. Prefer tighter access controls when feasible.

## 7. Auth Checks

```txt
[x] Auth.js secret is configured and stable for the target environment.
[x] AUTH_URL matches the deployment domain.
[x] APP_BASE_URL matches the deployment domain.
[x] Google OAuth authorized JavaScript origin is https://skinwise-vn.vercel.app.
[x] Google OAuth authorized redirect URI is https://skinwise-vn.vercel.app/api/auth/callback/google.
[x] Local redirect URI http://localhost:3000/api/auth/callback/google remains available for development.
[x] Auth.js uses JWT session strategy unless a new ADR explicitly approves database sessions.
[x] Protected routes are protected.
[x] API routes requiring auth reject unauthenticated requests.
[x] User-owned resources enforce ownership checks.
[ ] Admin-only routes are not exposed unless implemented.
```

## 8. AI Safety Checks

```txt
[x] AI endpoints are server-only.
[x] Rule engine runs before AI.
[x] AI output is schema validated.
[x] AI fallback policy is implemented before public demo of analysis.
[x] Rate limits exist for AI endpoints.
[x] AI_PROVIDER is mock unless a real provider is implemented and verified.
[x] Unsafe or medical claims are not presented as diagnosis or treatment.
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
[x] Loading states exist.
[x] Error states exist.
[x] Empty states exist.
[x] No medical diagnosis claims appear in UI.
[x] No appearance scoring or pressure appears in UI.
[x] Dashboard shell works after login.
[x] Seed data is safe and minimal.
[x] Core MVP flow is testable.
[x] Known limitations are documented.
[x] Post-MVP features are not advertised as completed.
```

## 11. Production Smoke Test

Run after a real Vercel deployment exists.

```txt
[x] / loads successfully.
[x] Landing page shows current MVP/post Week 6 messaging.
[x] No false deployment claim appears.
[x] Google sign-in works.
[x] User lands on dashboard or intended callback URL.
[x] Protected routes redirect unauthenticated users.
[x] /dashboard loads after login.
[x] /skin-profile loads and can create/update profile.
[x] /products loads and search/filter works.
[x] /products/[id] loads.
[x] /routines loads and can create routine.
[x] Routine analysis result appears.
[x] Routine log status can be updated.
[x] /journal loads and can create/edit/delete entry.
[x] /api/me returns authenticated user data after login.
[x] Safety wording avoids diagnosis, treatment promises, skin scoring, and dermatologist replacement claims.
```

## 12. Known Deployment Limitations

```txt
[x] Actual Vercel deployment has been executed for MVP demo.
[x] Production URL has been provided: https://skinwise-vn.vercel.app.
[x] Production smoke test has been completed and passed for MVP demo scope.
[x] Google OAuth production callback has been tested.
[x] MongoDB Atlas production/demo read/write access has been tested through authenticated flows.
[ ] E2E tests are config-only while tests/e2e has no real specs.
[x] Real OpenAI/Gemini provider is not implemented.
[x] Image upload is out of scope.
[x] Marketplace is out of scope.
[x] Notifications are out of scope.
[x] Skin score is out of scope.
[x] Medical diagnosis is out of scope.
[x] MVP demo deployment is not a full commercial production release.
[x] Product catalogue data is demo/seed-style catalogue data.
[x] Marketplace/payment/subscription remain out of scope.
[x] The app provides educational skincare support only, not medical diagnosis or treatment advice.
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
TASK PORTFOLIO-001 - Prepare portfolio case study and demo script
```
