# Release Evidence - Routine Coverage Review & Safe Next-Step Guidance

## Summary

Status: DONE / PASS

Task: v1.38 - Routine Coverage Review & Safe Next-Step Guidance

Scope: Post-MVP controlled improvement

Date: 2026-06-13

Environment: Local development validation

Dashboard summary was intentionally skipped to keep v1.38 scoped to the
Routines page and avoid unnecessary dashboard mapper/use-case changes.

## Scope Implemented

- Added a pure Routine Coverage Review helper that accepts existing `RoutineDto[]`.
- Added a Routines page card for habit-support / educational routine structure review.
- Added checklist items for routine presence, morning routine, evening routine, morning sunscreen, and moisturizer.
- Added gentle caution items for missing morning sunscreen, missing moisturizer, and multiple treatment/active steps.
- Added safe next-step guidance without changing routine safety analysis.
- Added focused unit and source-inspection tests.

## User-Facing Behavior

- Routines page now shows `Đánh giá tổng quan routine` after routines finish loading.
- The card explains that the review is a habit and routine-structure check only.
- If no routines exist, the card uses a light empty insight and does not add a second create button near the existing empty-state CTA.
- If a morning routine exists without sunscreen, the card shows a calm note to review the morning routine if it is used during the day.
- If no moisturizer step exists across routines, the card suggests checking whether a moisturizer step would support comfort and stable habits.
- If a routine has two or more treatment/active steps, the card suggests reviewing order, frequency, and skin response tracking.
- If no structural gaps are observed, the card uses a safe positive summary without calling the routine perfect, guaranteed suitable, or absolutely safe.

## Safety Boundaries

- This feature is educational and habit-support only.
- It does not diagnose skin conditions.
- It does not prescribe medication.
- It does not provide treatment recommendations.
- It does not claim a routine is guaranteed safe, guaranteed suitable, or perfect.
- It does not replace professional consultation.
- It does not import or refactor Routine Safety logic.
- It does not call the routine analysis API.

## Explicitly Unchanged

- Database schema unchanged.
- Product Match scoring/ranking unchanged.
- AI provider behavior unchanged.
- Auth unchanged.
- Env unchanged.
- Package dependencies unchanged.
- Routine Safety logic unchanged.
- API contracts unchanged, except no API changes expected for this feature.
- Dashboard update intentionally skipped to keep v1.38 scoped and low-risk.

## Files Changed

Expected v1.38 implementation files:

- `src/modules/routines/routine-coverage-review.ts`
- `src/modules/routines/components/routine-coverage-review-card.tsx`
- `src/modules/routines/components/routine-builder.tsx`
- `tests/unit/routine-coverage-review.test.ts`
- `tests/unit/routine-coverage-review-card-source.test.ts`
- `docs/release-evidence-routine-coverage-review.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`

Existing Product Match polish files may also remain modified in the working tree
from the prior completed task; they are not part of v1.38 implementation scope.

## Tests Added / Updated

- `tests/unit/routine-coverage-review.test.ts`
  - no routines
  - morning routine with sunscreen
  - morning routine without sunscreen
  - no moisturizer
  - multiple treatment steps
  - safe positive summary
  - mixed morning/evening routine
  - no sunscreen caution when there is no morning routine
- `tests/unit/routine-coverage-review-card-source.test.ts`
  - component and helper file presence
  - required safe UI copy
  - forbidden clinical/guarantee copy checks
  - helper purity/source-safety checks
  - card client-safety checks
  - Routine Builder integration

## Validation Commands

Required:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
git diff --check
git diff -- package.json package-lock.json
git diff -- .env .env.local .env.example src/config/env.ts
git diff -- prisma
```

Focused pre-check already run:

```txt
npm run test -- routine-coverage-review
```

## Validation Results

```txt
npm run test -- routine-coverage-review: PASS - 2 files / 14 tests
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 107 files / 1046 tests
npm run build: PASS after elevated rerun; sandboxed attempt compiled successfully, then failed with spawn EPERM
npm run test:e2e: PASS after elevated rerun - 31 passed; sandboxed attempt failed immediately with spawn EPERM
git diff --check: PASS, with a CRLF normalization warning for src/modules/product-match/components/product-match-explanation-card.tsx
git diff -- package.json package-lock.json: PASS - no diff
git diff -- .env .env.local .env.example src/config/env.ts: PASS - no diff
git diff -- prisma: PASS - no diff
```

## Git/Diff Safety

Final diff checks passed.

Expected unchanged areas:

- `package.json`
- `package-lock.json`
- `.env`
- `.env.local`
- `.env.example`
- `src/config/env.ts`
- Prisma/schema files

## Notes / Follow-up

- Production smoke was not part of this local v1.38 implementation task.
- Full screen-reader verification was not rerun.
- Screenshots/demo video were not captured.
- The feature is intentionally scoped to the Routines page.
- Dashboard summary was intentionally skipped to keep v1.38 scoped to the Routines page and avoid unnecessary dashboard mapper/use-case changes.
