# ADR 0007: Use Auth.js JWT Sessions with MongoDB Adapter

Date: 2026-05-23

## Status

Accepted

## Context

SkinWise VN uses Auth.js / NextAuth and MongoDB Atlas. The MongoDB Adapter is required for persistent identity/account data, but protected routes are enforced through `src/proxy.ts`, which must remain edge-safe and cannot import the full MongoDB-backed Auth.js server setup.

During local Google OAuth testing, database connectivity was stabilized, but session handling still produced encrypted-cookie errors after session strategy and secret changes.

## Decision

Use the MongoDB Adapter for Auth.js identity/account persistence, but force runtime sessions to use JWT:

```ts
session: {
  strategy: "jwt",
}
```

`src/proxy.ts` continues to use the edge-safe `authConfig` only.

## Consequences

Positive:

- Route protection remains compatible with the proxy/middleware path.
- Auth.js can persist users/accounts through MongoDB without requiring database sessions.
- Session token decoding depends on stable `AUTH_SECRET`, not a database session lookup.
- The app avoids database-session/proxy mismatch during local development.

Trade-offs:

- Session invalidation relies on JWT/cookie behavior rather than deleting database session rows.
- Changing `AUTH_SECRET` invalidates existing encrypted session cookies and requires users to sign in again.
- Local browser site data must be cleared after changing session strategy or `AUTH_SECRET`.

## Rules

```txt
Do not switch back to database sessions without a new ADR.
Do not import MongoDB Adapter setup into `auth.config.ts` or `src/proxy.ts`.
Do not trust client-provided userId; continue deriving user identity from the server session.
```
