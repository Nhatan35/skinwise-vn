# ADR-0006: Use Repeatable Database Index Script

## Status

Accepted

## Context

The data model defines unique constraints and query indexes.

Relying on manual index creation can cause inconsistent local, staging, and production behavior.

## Decision

Create an idempotent database index script.

Required command:

```txt
npm run db:indexes
```

Recommended file:

```txt
src/infrastructure/database/ensure-indexes.ts
```

## Consequences

Positive:

- predictable unique constraints;
- fewer production surprises;
- easier onboarding and deployment;
- contract tests can rely on real indexes.

Trade-offs:

- requires a database connection during setup/deployment;
- index changes must be reviewed carefully.

## Implementation rules

- do not create indexes inside route handlers;
- index script must be safe to run multiple times;
- unique index errors must map to documented API `CONFLICT` behavior where appropriate.
