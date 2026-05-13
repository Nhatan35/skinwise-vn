# ADR-0004: Use LocalDate for Daily Tracking

## Status

Accepted

## Context

RoutineLog and SkinJournal represent daily user behavior and observations.

Users in Vietnam and other time zones need daily records to match their local calendar day, not only UTC timestamps.

## Decision

Use `localDate` plus `timezone` for daily tracking.

Canonical examples:

```txt
localDate = "2026-05-13"
timezone = "Asia/Ho_Chi_Minh"
```

## Consequences

Positive:

- daily tracking matches user expectations;
- unique daily records are easier to enforce;
- calendar/timeline UI is simpler.

Trade-offs:

- timezone must be validated;
- date-range queries must be careful around local dates.

## Implementation rules

- RoutineLog uniqueness: `userId + routineId + localDate`;
- SkinJournal uniqueness: `userId + localDate`;
- RoutineLog uses upsert behavior;
- SkinJournal duplicate localDate returns `CONFLICT`;
- PATCH `/api/skin-journal/:id` cannot change `localDate` in MVP.
