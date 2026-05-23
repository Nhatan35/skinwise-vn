# 07-security-privacy.md

# Security and Privacy — MVP v1.2.6

## 1. Security goals

SkinWise VN must protect user routines, skin profiles, journals, and images.

Primary risks:

- Cross-user data access.
- Insecure AI endpoints.
- Prompt injection.
- Sensitive image leakage.
- Excessive logging.
- Unvalidated API input.
- API abuse causing high AI cost.

## 2. Authentication

Use Auth.js / NextAuth with MongoDB Adapter for MVP identity persistence and JWT session strategy for App Router/proxy compatibility.

Requirements:

- Auth.js owns authentication identity collections: `users`, `accounts`, and `verification_tokens`.
- The `sessions` collection name remains reserved in adapter configuration, but the current runtime uses `session.strategy = "jwt"`; do not rely on database sessions unless an ADR updates this decision.
- SkinWise owns app-specific role/profile data separately.
- Server-side session validation must use the shared auth helpers.
- `src/proxy.ts` must remain edge-safe and must use `authConfig`, not the MongoDB Adapter setup.
- `AUTH_SECRET` must be stable per environment because changing it invalidates existing encrypted auth cookies.
- Clear local browser site data after changing `AUTH_SECRET` or session strategy.
- No secrets in client code.
- Never commit `.env.local`, database passwords, OAuth client secrets, or Auth.js secrets.
- Secure cookies in production.
- Environment variables validated at startup.
- Optional OAuth providers may be added only through documented provider configuration.

## 3. Authorization

Every user-owned route must check current user.

Rule:

```txt
Do not trust userId from request body.
Use session user id from server.
```

## 4. Object ownership check

Never query user-owned objects by object id only.

Bad:

```ts
findOne({ _id: routineId })
```

Good:

```ts
findOne({ _id: routineId, userId: currentUser.id })
```

This prevents Broken Object Level Authorization.

## 5. API validation

Use Zod for all:

- request body;
- query params;
- route params;
- AI output validation.

Reject invalid requests with `VALIDATION_ERROR`.

## 6. Rate limiting

Rate-limit:

- AI analysis endpoint.
- Ingredient explanation endpoint.
- Product submission endpoint.
- Login attempts if credential auth is enabled.

Suggested MVP limits:

```txt
Routine analysis: 10 requests / user / hour
Ingredient explanation: 20 requests / user / hour
Product creation: 30 requests / user / day
Journal creation: 100 requests / user / day
Routine log create/update: 100 requests / user / day
Anonymous endpoints: stricter limits
```

Implementation note:

- `POST /api/routines/:id/analyze` uses a MongoDB-backed per-user limiter.
- Routine analysis uses key format `routine_analysis:${userId}` and allows 10 requests per 60 minutes.
- Store rate limit counters in the `rate_limits` collection with a unique `key` index and TTL `expiresAt` index.
- Do not use in-memory rate limiting for production API behavior.
- Return `RATE_LIMITED` with a human-readable message when the limit is exceeded.

## 7. Sensitive data handling

Sensitive or private fields:

- skin profile;
- skin concerns;
- journal notes;
- symptoms;
- images;
- AI analysis history.

Rules:

- Do not log raw journal notes.
- Do not log raw image URLs if private.
- Do not expose internal storage keys to client.
- Do not include email in analytics events.
- Use hashed user id in logs.

## 8. Image upload privacy

If image upload is implemented:

- Store images private by default.
- Use signed URLs for access.
- Restrict image access by user ownership.
- Allow deletion.
- Avoid sending raw images to AI in MVP.
- Strip metadata where possible.
- Set file type and size limits.

Suggested limits:

```txt
Max file size: 5MB
Allowed types: jpg, jpeg, png, webp
```

## 9. Data deletion

User must be able to delete:

- skin profile;
- routines;
- routine analyses;
- journal entries;
- uploaded images.

Account deletion should remove or anonymize user-owned data.

## 10. AI data minimization

When calling AI:

- send only required fields;
- remove user identity;
- remove email/name;
- summarize routine rather than sending full private history;
- avoid raw images in MVP;
- store prompt version and model metadata, not full hidden prompt.


## 11. Safety classifier blocked-flow logging

When `SafetyClassifierResult.shouldBlockAIAnswer = true`:

- Do not call downstream routine or ingredient explanation AI.
- Return the safe response mapped from `safeResponseType`.
- Log only risk category, risk level, request id, and hashed user id.
- Do not log raw user text, full routine notes, journal notes, or private ingredient/product context.
- Store the minimum data needed for debugging abuse patterns and safety monitoring.

## 12. Logging rules

Allowed logs:

```txt
requestId
hashedUserId
endpoint
statusCode
latency
errorCode
aiProvider
aiModel
promptVersion
tokenUsage
```

Avoid logging:

```txt
email
full name
journal notes
raw symptoms description
private image URL
full prompt containing sensitive user data
```

## 13. Security checklist

```txt
[ ] All APIs require auth where needed.
[ ] All user-owned data checks ownership.
[ ] All inputs validated with Zod.
[ ] All AI outputs validated against schema.
[ ] AI endpoints are rate-limited.
[ ] No secrets in client bundle.
[ ] Private images require signed access.
[ ] Delete flows remove related data.
[ ] Admin routes require ADMIN role.
[ ] Logs avoid sensitive personal data.
```


## 14. MVP app API authentication policy

For MVP simplicity and safety:

```txt
[ ] All application APIs require authentication unless explicitly documented as public.
[ ] GET /api/products requires authentication in MVP.
[ ] GET /api/ingredients requires authentication in MVP.
[ ] GET /api/ingredients/:id requires authentication in MVP.
[ ] POST /api/ingredients/explain requires authentication and rate limit.
```

Public landing-page routes can be added later, but should not reuse private app API routes without a deliberate API contract update.
