# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-17

## 1. Current sprint

```txt
Dashboard Data Integration - TASK DB-001
```

## 2. Sprint goal

Replace the placeholder `/dashboard` with a real authenticated MVP dashboard that summarizes Skin Profile setup, Routine counts, today's RoutineLog progress by browser localDate, latest Routine Analysis, and simple next actions.

## 3. Allowed tasks this sprint

```txt
Add GET /api/dashboard?localDate=YYYY-MM-DD
Validate localDate and derive userId from authenticated session
Summarize Skin Profile exists/missing state
Summarize Routine counts for morning and evening only
Summarize today's RoutineLogs using completed + partial * 0.5 completion rule
Show latest Routine Analysis if available
Render /dashboard cards using the Dashboard API
Reuse getBrowserLocalDate from RoutineLog client helpers
Add dashboard use-case, API contract, and source-level UI tests
Update AI coding context docs
```

## 4. Not allowed this sprint

```txt
AI Provider abstraction
Ingredient Explanation AI
OpenAI or external LLM/API calls
SkinJournal
Image upload
Skin score
Advanced streak logic
Weekly/monthly analytics or charts
Notifications or reminders
Product submission
Admin product management
Authentication architecture changes
New dependencies
```

## 5. Sprint Definition of Done

```txt
[x] Correct dashboard page path is used: src/app/(dashboard)/dashboard/page.tsx.
[x] No mistaken src/app/dashboard/page.tsx route is created.
[x] GET /api/dashboard?localDate=YYYY-MM-DD exists.
[x] API requires authentication and rejects missing/invalid localDate.
[x] API derives userId from session and rejects client userId query fields.
[x] API returns { data: { dashboard }, error: null }.
[x] Dashboard DTO does not expose userId, _id, ObjectId, or MongoDB internals.
[x] Missing skin profile maps to exists=false.
[x] Missing latest analysis maps to exists=false.
[x] No routines maps to a valid empty dashboard state with completionRate 0.
[x] Routine counts use morning and evening only.
[x] Today routine progress uses RoutineLogs for localDate.
[x] completionRate uses the simple completed + partial * 0.5 rule.
[x] Dashboard UI has loading, error, empty/missing-data, and real card states.
[x] Existing Routine Builder, RoutineLog UI, and Routine Analysis behavior remain in place.
[x] Tests and docs are updated.
```

## 6. Recommended next task

```txt
TASK AI-001 — AI Provider Abstraction, or TASK ING-AI-001 — Ingredient Explanation Foundation depending on the sprint plan.
```
