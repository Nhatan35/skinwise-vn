# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-17

## 1. Current sprint

```txt
RoutineLog Foundation - TASK RL-001
```

## 2. Sprint goal

Implement the authenticated backend foundation for RoutineLog so users can record whether they completed, partially completed, or skipped one routine on a specific local calendar date. The foundation stores `localDate` as a `YYYY-MM-DD` string, stores `timezone`, upserts by `userId + routineId + localDate`, and validates ownership plus completed routine step IDs.

## 3. Allowed tasks this sprint

```txt
Create RoutineLog module types/schema/dto/mapper/repository/use-case
Create GET /api/routine-logs?localDate=YYYY-MM-DD
Create PUT /api/routine-logs as canonical upsert endpoint
Use existing routine_logs collection helper and indexes
Validate routine ownership through the Routine repository/use-case boundary
Validate completedStepIds against Routine.steps stepId values
Reject client-submitted userId/id/_id/timestamps/unknown fields
Add schema, mapper, repository, use-case, API, and index unit tests
Update AI coding context docs, data model docs, and API contract docs
```

## 4. Not allowed this sprint

```txt
RoutineLog UI
Routine page checkboxes
Dashboard data integration
Streak calculation
Weekly/monthly analytics
AI insights
AI provider integration
Ingredient explanation AI API
SkinJournal implementation
Image upload
Skin score
Product submission
Admin product management
Authentication architecture changes
External APIs
New dependencies
```

## 5. Sprint Definition of Done

```txt
[x] src/modules/routine-logs foundation files exist.
[x] RoutineLog schema is strict and rejects unknown/server-owned fields.
[x] RoutineLog DTO maps _id to id and omits userId/_id/ObjectId internals.
[x] RoutineLog repository supports upsert by userId + routineId + localDate.
[x] RoutineLog use-case validates routine ownership.
[x] RoutineLog use-case validates completedStepIds against Routine.steps.
[x] GET /api/routine-logs?localDate=YYYY-MM-DD requires authentication.
[x] GET returns only logs for the authenticated user and localDate.
[x] PUT /api/routine-logs requires authentication and derives userId from session.
[x] PUT /api/routine-logs is the canonical upsert endpoint.
[x] Existing Routine/Product/Ingredient behavior remains covered by tests.
[x] No RoutineLog UI, dashboard integration, streaks, AI insights, Journal, image upload, or medical diagnosis was implemented.
```

## 6. Recommended next task

```txt
TASK RL-002 — RoutineLog UI integration
```
