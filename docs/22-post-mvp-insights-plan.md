# Post-MVP v1.3 Skin Progress Insights & Calendar

Last updated: 2026-05-31

## Feature name

Skin Progress Insights & Calendar.

## Problem statement

Users can log routines and skin journal entries, but they need one protected place to review recent self-tracked consistency, journal activity, symptoms, product mentions, and simple next actions without turning the app into diagnosis or appearance scoring.

## User value

- Helps users review whether they are maintaining routine habits.
- Makes journal patterns easier to scan across a selected local-date range.
- Summarizes self-tracked symptoms and product mentions without causal claims.
- Provides safe next actions that point back to existing tracking workflows.

## Scope

- Protected `/insights` dashboard route.
- Authenticated `GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD`.
- Default latest 30-day range including today when both query dates are omitted.
- Maximum range: 90 days.
- Routine-slot based consistency metrics for multiple routines per day.
- Journal activity aggregation for current-user SkinJournal entries.
- Product usage aggregation from journal `productsUsed` values.
- Calendar rows for every local date in the selected range.
- Safe deterministic next actions.
- Unit/API/client/UI coverage and authenticated E2E coverage when local E2E dependencies are available.

## Out of scope

- Skin score.
- Medical diagnosis.
- Treatment, medication, or cure recommendations.
- Product causality claims such as "product caused acne".
- AI skin diagnosis, face analysis, image analysis, or before/after judging.
- Routine history schema changes such as `activeFrom` or `archivedAt`.
- Mongoose or new database architecture.

## Route

```txt
/insights
```

- Protected dashboard route.
- Dashboard navigation label: `Insights`.
- Page title: `Skin Progress Insights`.
- Relationship: calls `GET /api/insights` through the client helper in `src/modules/insights/insights.client.ts`.

## API endpoint

```txt
GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD
```

Authentication:

- Required.
- Unauthenticated requests return `401 UNAUTHORIZED`.
- The route derives `userId` from `getCurrentUser()` and never accepts client-submitted ownership.

Validation:

- `from` and `to` are optional only when both are omitted.
- If one date is provided without the other, return `400 VALIDATION_ERROR`.
- Dates must use `YYYY-MM-DD`.
- Dates must be real calendar dates.
- `from` must be before or equal to `to`.
- Date range cannot exceed 90 days.
- Unknown query fields are rejected.

Success response:

```json
{
  "data": {
    "insights": "InsightsDto"
  },
  "error": null
}
```

Error response:

```json
{
  "data": null,
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## DTO

The active DTO is routine-slot based. Do not replace it with the older day-only `completedDays` structure.

```ts
type InsightsDto = {
  dateRange: {
    from: string;
    to: string;
    totalDays: number;
  };
  routineConsistency: {
    totalRoutineSlots: number;
    completedRoutineSlots: number;
    partialRoutineSlots: number;
    skippedRoutineSlots: number;
    notLoggedRoutineSlots: number;
    completionRate: number;
    maintainedDays: number;
    currentStreak: number;
    bestStreak: number;
  };
  journalActivity: {
    totalEntries: number;
    activeJournalDays: number;
    mostCommonSymptoms: {
      symptom: string;
      count: number;
    }[];
  };
  productUsage: {
    mostUsedProducts: {
      productId: string;
      name: string;
      brand?: string;
      count: number;
    }[];
  };
  calendarDays: {
    localDate: string;
    routineSummary: {
      totalRoutines: number;
      completed: number;
      partial: number;
      skipped: number;
      notLogged: number;
      dayStatus: "completed" | "partial" | "skipped" | "not_logged";
    };
    hasJournalEntry: boolean;
    symptoms: string[];
  }[];
  nextActions: {
    label: string;
    description?: string;
    href: string;
    priority: "high" | "medium" | "low";
  }[];
};
```

## Routine-slot calculation

- `totalRoutineSlots = totalDays * totalRoutines`.
- `completedRoutineSlots`, `partialRoutineSlots`, and `skippedRoutineSlots` count logged routine slots in the selected range.
- `notLoggedRoutineSlots` is derived from the calendar summaries and clamped at zero.
- `completionRate = Math.round(completedRoutineSlots / totalRoutineSlots * 100)`.
- If `totalRoutineSlots = 0`, `completionRate = 0`.
- `maintainedDays` counts days where the day status is `completed`.
- `currentStreak` counts completed days backward from the range end date.
- `bestStreak` is the longest completed-day streak in the selected range.
- The baseline uses the user's current routines because the project does not currently implement historical routine activation fields.

## Calendar dayStatus rules

Priority order:

1. `not_logged` when `totalRoutines = 0` or the day has no logs.
2. `completed` when all routine slots for the day are completed.
3. `skipped` when all routine slots for the day are skipped.
4. `partial` for any other day with at least one log.

This avoids marking a day as fully skipped when some routine slots are missing.

## Product usage rules

- Counts product IDs from SkinJournal `productsUsed`.
- Deduplicates products within a single journal entry before counting.
- Resolves products in one batch through the visible Product repository helper.
- Skips invalid ObjectId strings, missing products, hidden products, deleted products, and unauthorized products.
- Does not perform product causality analysis.

## Safety constraints

The feature summarizes self-tracked data only. It must not include skin scores, diagnosis, treatment recommendations, medication recommendations, image analysis, face analysis, appearance ratings, or product-causality claims.

Required UI disclaimer:

```txt
This page summarizes your self-tracked data and is not medical advice.
```

## UI sections

- Page title and subtitle.
- Date range information.
- Overview cards.
- Routine completion rate.
- Current streak.
- Best streak.
- Journal entry count.
- Most common symptom.
- Routine consistency calendar and legend.
- Symptom trend card.
- Product usage card.
- Next actions card.
- Loading state.
- Error state.
- Empty state.

## Acceptance criteria

- `/insights` exists and is protected.
- Dashboard navigation includes Insights.
- `GET /api/insights` requires authentication.
- Query validation rejects invalid formats, invalid real dates, reversed ranges, partial ranges, unknown fields, and ranges over 90 days.
- API success response is `{ data: { insights }, error: null }`.
- API errors use the SkinWise `{ data: null, error }` envelope.
- Data is scoped to the authenticated user.
- Product usage only returns visible products.
- Calendar includes every date in the selected range.
- Routine consistency supports multiple routines per day.
- UI copy stays neutral, non-medical, and tracking-focused.
- Unit, API contract, client, UI, and E2E coverage are present.

## Test coverage

Focused tests live under:

```txt
tests/unit/insights-schema.test.ts
tests/unit/insights-mapper.test.ts
tests/unit/insights-use-case.test.ts
tests/unit/insights-client.test.ts
tests/unit/insights-api-contract.test.ts
tests/unit/insights-ui.test.ts
tests/e2e/insights.authenticated.spec.ts
```

Related route protection and navigation tests:

```txt
tests/unit/auth-middleware.test.ts
tests/unit/dashboard-shell.test.ts
```

## Known limitations

- Current routine list is used as the expected routine-slot baseline for the selected range.
- There is no historical routine activation model.
- Product usage is based on product mentions in journal entries, not proof of effect.
- E2E requires the existing local/test MongoDB setup used by the project Playwright configuration.
