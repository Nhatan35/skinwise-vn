# ADR-0005: Use DTO Mappers for API Boundaries

## Status

Accepted

## Context

MongoDB documents use `_id`, `ObjectId`, and `Date` objects.

Client code should not depend on MongoDB-specific representation.

## Decision

Use explicit DTO mapper functions at API boundaries.

Canonical conversion:

```txt
_id/ObjectId -> id: string
Date -> ISO string
future-only/private fields -> omitted from MVP response DTOs
```

## Consequences

Positive:

- cleaner API responses;
- less client coupling to MongoDB;
- easier future database refactor;
- safer field exposure.

Trade-offs:

- requires mapper files and tests;
- every API response needs consistent mapping.

## Implementation rules

- never return raw ObjectId in SkinWise-owned API responses;
- never expose future-only SkinJournal image fields in MVP APIs;
- add mapper unit tests for key models.
