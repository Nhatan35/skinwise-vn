# Vercel Deployment Runbook - SkinWise VN MVP

## Current Deployment Status

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

SkinWise VN is a skincare routine tracker and educational MVP. It is not a medical diagnosis app, does not prescribe medication, does not guarantee treatment outcomes, and must not add skin scoring, attractiveness scoring, image analysis, marketplace, notifications, or other out-of-scope features during deployment.

This is an MVP demo deployment, not a full commercial production release.

## Vercel Project Settings

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | Project root |
| Install Command | `npm ci` when `package-lock.json` is present; otherwise `npm install` |
| Build Command | `npm run build` |
| Output Directory | Leave default for Next.js |
| Node.js Version | Node 20.x recommended |

## Environment Variable Checklist

Configure production values only in Vercel Project Settings -> Environment Variables. Do not commit production secrets.

For the deployed MVP demo, `APP_BASE_URL` and `AUTH_URL` must match:

```txt
https://skinwise-vn.vercel.app
```

Do not document real secret values. This project uses `AUTH_URL` and `APP_BASE_URL`; do not introduce `NEXTAUTH_URL` unless the source code is deliberately changed.

### Required For Production App Boot

```txt
APP_ENV="production"
APP_BASE_URL="https://<your-vercel-domain>"
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
AUTH_SECRET="<secure-production-random-secret>"
AUTH_URL="https://<your-vercel-domain>"
```

### Required For Google OAuth Login

```txt
AUTH_GOOGLE_ID="<google-oauth-client-id>"
AUTH_GOOGLE_SECRET="<google-oauth-client-secret>"
```

Google OAuth variables are not required for app boot, but production Google login will not work without them.

### Demo AI Provider

```txt
AI_PROVIDER="mock"
```

Use the mock provider for this MVP demo deployment. OpenAI and Gemini providers are not implemented in this task.

### Optional/Future AI Variables

```txt
AI_API_KEY=""
AI_MODEL=""
```

Leave these empty unless a real provider is implemented and verified later.

### Optional/Future Cloudinary Variables

```txt
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Image upload is out of scope for the current MVP.

### Feature Flags

```txt
FEATURE_AI_ROUTINE_ANALYSIS="false"
FEATURE_INGREDIENT_EXPLANATION="false"
FEATURE_IMAGE_UPLOAD="false"
FEATURE_NOTIFICATIONS="false"
FEATURE_MARKETPLACE="false"
FEATURE_SKIN_SCORE="false"
```

Do not enable unfinished or out-of-scope features for the MVP demo.

## Deployment Result

```txt
TASK DEPLOY-002: completed.
Production URL: https://skinwise-vn.vercel.app
Deployment target: Vercel.
Production branch: main.
Production commit: db72e07.
Deployment status: Ready / deployed for MVP demo.
Production smoke test: passed.
Google OAuth production login: passed.
Authenticated MVP flows: passed.
MongoDB production/demo read/write through authenticated flows: passed.
AI provider: AI_PROVIDER="mock".
Secrets documented: no.
```

Known MVP demo limitations:

- The deployment is an MVP demo deployment, not a full commercial production release.
- AI routine analysis uses mock/deterministic provider behavior.
- Product catalogue data is demo/seed-style catalogue data.
- Real OpenAI/Gemini providers are not implemented.
- Image upload and AI face analysis remain out of scope.
- Skin score remains out of scope.
- Marketplace, payment, subscription, and notifications remain out of scope.
- The app provides educational skincare support only, not medical diagnosis or treatment advice.

## Security Rules

- Never upload `.env.local`.
- Never commit `.env.local`.
- Never paste secrets into docs, README files, screenshots, reports, issue descriptions, or pull request descriptions.
- Configure production secrets only in Vercel Project Settings -> Environment Variables.
- Keep `.env.example` placeholder-only.
- Exclude `.next`, `node_modules`, `.vercel`, generated reports, local test results, and zip artifacts from source packages.
- Rotate any secret that was pushed publicly, uploaded, screenshotted, pasted into chat, or shared externally.

## Production Dependency Audit

Current DEPLOY-001 follow-up audit status:

```txt
TASK SECURITY-AUDIT-001: completed.
Audit command: npm audit --omit=dev --audit-level=moderate
Current result: Pass - found 0 vulnerabilities.
```

`npm audit fix --force` was not used because the original audit recommendation for the PostCSS advisory would have installed an unsafe breaking Next.js downgrade. The production audit was resolved by keeping `next@16.2.6` and applying same-major npm overrides for the affected transitive packages:

```txt
postcss@8.5.15
qs@6.15.2
```

Do not remove these overrides unless a future Next.js or upstream dependency update resolves the advisories safely and `npm audit --omit=dev --audit-level=moderate` still passes.

## MongoDB Atlas Production Readiness

- Use a separate demo database for portfolio deployment.
- Verify the database user has only the permissions needed for the demo app.
- Verify Atlas network access allows Vercel serverless functions to connect.
- `0.0.0.0/0` is convenient for an MVP demo but less restrictive; use a tighter access policy if available.
- Verify the database name in the connection string.
- Run `npm run db:indexes` only against the intended demo database when the target is confirmed.
- Run `npm run db:seed` only against the intended demo database.
- Do not print or paste the MongoDB URI.

## Google OAuth Production Setup

In Google Cloud Console, configure the OAuth client for the deployed domain.

Authorized JavaScript origin:

```txt
https://<your-vercel-domain>
```

Authorized redirect URI:

```txt
https://<your-vercel-domain>/api/auth/callback/google
```

Preserve the local redirect URI for development:

```txt
http://localhost:3000/api/auth/callback/google
```

Vercel variables must match the OAuth client:

```txt
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
```

`AUTH_URL` and `APP_BASE_URL` must match the production domain. Test Google login after deployment.

## Deployment Steps

1. Verify the repo and clean package contain no local secrets or generated artifacts.
2. Ensure `.env.local` is not tracked by Git.
3. Ensure `.env.local` is not included in the clean zip.
4. Push the clean repo to GitHub.
5. Connect the GitHub repo to Vercel.
6. Select the Next.js framework preset.
7. Set the root directory to the project root.
8. Set the install command to `npm ci`.
9. Set the build command to `npm run build`.
10. Leave the output directory as the default for Next.js.
11. Add production environment variables in Vercel.
12. Trigger deployment.
13. Verify Vercel build logs.
14. Open the production URL.
15. Run production smoke tests.

## Production Smoke Test Checklist

### Public

- `/` loads successfully.
- Landing page shows correct MVP/post Week 6 messaging.
- No outdated Week 1-only copy appears.
- No false deployment claim appears.

### Auth

- Sign-in page works.
- Google sign-in works.
- User lands on dashboard or intended callback URL.
- Sign-out works if implemented.

### Protected Routes Unauthenticated

- `/dashboard` redirects to sign-in.
- `/products` redirects to sign-in.
- `/products/[id]` redirects to sign-in if protected.
- `/skin-profile` redirects to sign-in.
- `/routines` redirects to sign-in.
- `/journal` redirects to sign-in.

### Authenticated MVP

- `/dashboard` loads.
- `/skin-profile` loads.
- User can create or update skin profile.
- `/products` loads.
- Product search and filters work.
- `/products/[id]` loads.
- `/routines` loads.
- User can create a routine.
- User can add a product to a routine.
- User can analyze a routine.
- Routine analysis result appears.
- User can log routine status.
- `/journal` loads.
- User can create a journal entry.
- User can edit a journal entry.
- User can delete a journal entry.
- Dashboard summary reflects relevant data.

### API

- `/api/me` returns authenticated user data after login.
- Product APIs respond correctly.
- Routine APIs respond correctly after login.
- Journal APIs respond correctly after login.

### Safety

- App does not diagnose disease.
- App does not promise treatment results.
- App does not create skin score or attractiveness score.
- App displays educational/safety disclaimers where appropriate.
- App does not present itself as a replacement for dermatologists.
