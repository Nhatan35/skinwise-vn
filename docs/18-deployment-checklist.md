# 18-deployment-checklist.md

# Deployment and Production Readiness Checklist — MVP v1.2.6

## 1. Purpose

This checklist ensures SkinWise VN can move from local development to a safe portfolio/demo deployment.

## 2. Pre-deployment checks

```txt
[ ] Project builds successfully.
[ ] TypeScript has no blocking errors.
[ ] Lint passes.
[ ] Unit tests pass.
[ ] Integration tests pass where implemented.
[ ] E2E happy path passes where implemented.
[ ] No out-of-scope feature has been added.
[ ] README setup instructions are accurate.
[ ] ADRs still match implementation decisions.
[ ] PR checklist and CI workflow are present if using GitHub.
[ ] .env.example is current.
```

## 3. Environment variables

```txt
[ ] APP_ENV is set.
[ ] APP_BASE_URL is set.
[ ] MONGODB_URI is set.
[ ] AUTH_SECRET is generated securely.
[ ] AUTH_URL matches deployment URL.
[ ] OAuth credentials are configured if login provider is enabled.
[ ] AI_API_KEY is stored server-side only if AI endpoints are enabled.
[ ] AI_MODEL is documented if AI endpoints are enabled.
```

## 4. Database checks

```txt
[ ] MongoDB Atlas production/demo cluster exists.
[ ] Database user has least-privilege access where possible.
[ ] Connection string is not committed.
[ ] Required indexes are documented.
[ ] `npm run db:indexes` exists and has been run for target environment.
[ ] Unique constraint behavior is planned for SkinJournal userId + localDate.
[ ] Upsert behavior is planned for RoutineLog userId + routineId + localDate.
```

## 5. Auth checks

```txt
[ ] Auth.js secret is configured.
[ ] Login callback URL matches deployment domain.
[ ] Protected routes are protected.
[ ] API routes requiring auth reject unauthenticated requests.
[ ] User-owned resources enforce ownership checks.
[ ] Admin-only routes are not exposed unless implemented.
```

## 6. AI safety checks

```txt
[ ] AI endpoints are server-only.
[ ] Rule engine runs before AI.
[ ] AI output is schema validated.
[ ] AI fallback policy is implemented before public demo of analysis.
[ ] Prompt versions are stored.
[ ] Model provider and model name are stored.
[ ] Rate limits exist for AI endpoints.
[ ] Unsafe claims are blocked or safely redirected.
```

## 7. Privacy checks

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

## 8. UI readiness checks

```txt
[ ] Loading states exist.
[ ] Error states exist.
[ ] Empty states exist.
[ ] Vietnamese copy follows docs/17-vietnamese-copy-and-ui-guidelines.md.
[ ] No medical diagnosis claims appear in UI.
[ ] No appearance scoring or pressure appears in UI.
[ ] Dashboard shell works after login.
```

## 9. Demo readiness

```txt
[ ] Seed data is safe and minimal.
[ ] Demo account or onboarding flow is documented.
[ ] Core MVP flow is testable.
[ ] Known limitations are documented.
[ ] Post-MVP features are not advertised as completed.
```

## 10. Release note requirement

Every deployable milestone must update:

```txt
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
```
