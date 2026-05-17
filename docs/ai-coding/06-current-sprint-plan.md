# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-17

## 1. Current sprint

```txt
RoutineLog UI Integration - TASK RL-002
```

## 2. Sprint goal

Add RoutineLog UI integration to the existing protected `/routines` page so users can load today's routine logs using browser localDate, see each routine's current status, and mark a routine as completed, skipped, or partially completed with selected routine steps.

## 3. Allowed tasks this sprint

```txt
Load GET /api/routine-logs?localDate=YYYY-MM-DD from the /routines UI
Generate localDate from browser local date parts, not UTC ISO slicing
Derive timezone with Intl.DateTimeFormat().resolvedOptions().timeZone and fallback to UTC
Display Vietnamese RoutineLog status badges
Add completed and skipped quick actions
Add partial step checklist with safe client validation
Call canonical PUT /api/routine-logs only
Update local UI state after successful save
Show friendly Vietnamese loading, success, and error states
Add pure helper and source-level tests
Update AI coding context docs
```

## 4. Not allowed this sprint

```txt
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
RoutineLog note input
```

## 5. Sprint Definition of Done

```txt
[x] /routines loads today's RoutineLogs with localDate.
[x] localDate is generated from browser local date parts.
[x] timezone is included in RoutineLog PUT payloads.
[x] Status badge supports Chưa ghi nhận, Hoàn thành, Một phần, and Bỏ qua.
[x] Users can mark a routine completed.
[x] Users can mark a routine skipped.
[x] Users can mark a routine partial by selecting completed steps.
[x] Partial state rejects zero selected steps and all selected steps.
[x] Partial action is disabled for routines with fewer than 2 steps.
[x] Successful PUT updates local UI state.
[x] Failed GET/PUT shows friendly Vietnamese errors.
[x] No server-only code is imported into client components.
[x] Routine Builder create/edit/delete, Product Picker, and Routine Analysis UI remain in place.
[x] Tests and docs are updated.
```

## 6. Recommended next task

```txt
TASK DB-001 — Dashboard Data Integration
```
