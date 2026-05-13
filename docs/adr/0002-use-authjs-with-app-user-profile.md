# ADR-0002: Use Auth.js with AppUserProfile

## Status

Accepted

## Context

Auth.js manages authentication identity, sessions, providers, and adapter-owned user/account/session data.

SkinWise VN also needs app-specific user fields such as role and onboarding status.

## Decision

Use Auth.js / NextAuth with MongoDB Adapter for authentication identity.

Use a separate `AppUserProfile` collection for app-specific profile fields:

```txt
userId
role
onboardingCompleted
createdAt
updatedAt
```

`GET /api/me` lazily creates `AppUserProfile` when missing.

Default values:

```txt
role = USER
onboardingCompleted = false
```

## Consequences

Positive:

- Auth.js-owned data is not mixed with app-specific fields;
- first-login flow is smooth;
- authorization logic is explicit;
- future app roles can be added carefully.

Trade-offs:

- one extra app-level collection is required;
- `/api/me` must join Auth.js session/user data with AppUserProfile data.

## Implementation rules

- Auth.js owns `/api/auth/*`;
- SkinWise response wrapper does not apply to Auth.js built-in endpoints;
- app code uses `GET /api/me` for current app user data;
- `userId` must come from server session, not request body.
