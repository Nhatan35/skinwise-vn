# Release Evidence - MVP v1.53 Dashboard Saved Product Decision Queue Summary

## Status

DONE / PASS locally

Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.

## Feature Name

MVP v1.53 - Dashboard Saved Product Decision Queue Summary

## Scope

Implemented a read-only dashboard summary for saved-product decision queue status.

In scope:
- Add `savedProductDecisionQueue` to the Dashboard DTO/API response.
- Compute deterministic summary counts from existing saved-product records.
- Render a new dashboard card named "Hàng chờ xem lại sản phẩm".
- Add focused mapper, API contract, dashboard UI, and E2E coverage.
- Update documentation and release evidence.

Out of scope:
- Database schema changes.
- Saved-product record creation, update, deletion, normalization, or backfill.
- Product Match scoring changes.
- Routine Safety Engine changes.
- AI behavior changes or AI calls.
- Recommendation ranking.
- Notification/reminder logic.
- Admin product review workflow changes.
- Public exposure of private saved-product metadata.

## Files Changed

Implementation:
- `src/modules/dashboard/dashboard.types.ts`
- `src/modules/dashboard/dashboard.dto.ts`
- `src/modules/dashboard/dashboard.mapper.ts`
- `src/modules/dashboard/components/dashboard-overview.tsx`
- `src/modules/dashboard/components/saved-product-decision-queue-card.tsx`

Tests:
- `tests/unit/dashboard-saved-product-decision-queue.test.ts`
- `tests/unit/dashboard-use-case.test.ts`
- `tests/unit/dashboard-api-contract.test.ts`
- `tests/unit/dashboard-ui.test.ts`
- `tests/unit/onboarding-progress-card.test.ts`
- `tests/e2e/dashboard-summary.authenticated.spec.ts`

Documentation:
- `docs/00-source-of-truth.md`
- `docs/02-user-stories.md`
- `docs/05-api-contract.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/release-evidence-dashboard-saved-product-decision-queue-v1.53.md`

## Behavior Added

- Dashboard API now returns `savedProductDecisionQueue`.
- The summary includes:
  - `totalSavedProducts`
  - `consideringCount`
  - `testingCount`
  - `pausedCount`
  - `keptCount`
  - `unsetDecisionStatusCount`
  - `withoutPlannedRoutineSlotCount`
  - `withoutPersonalNoteCount`
  - `reviewNeededCount`
  - `nextAction.label`
  - `nextAction.description`
  - `nextAction.href`
- Blank decision status, planned routine slot, and personal note values are handled as missing when they are missing, null, undefined, empty, or whitespace-only.
- Unknown non-blank decision status values are treated as review-needed without being counted under supported decision status categories.
- `reviewNeededCount` counts each saved product at most once.
- Dashboard UI shows the "Hàng chờ xem lại sản phẩm" card with empty, review-needed, and complete states.
- The CTA points to the saved products page.

## Tests Added / Updated

- Added focused mapper tests for:
  - no saved products;
  - each supported decision status;
  - missing, null, empty, and whitespace-only decision status;
  - unknown non-blank decision status;
  - missing, null, empty, and whitespace-only planned routine slot;
  - missing, null, empty, and whitespace-only personal note;
  - mixed saved product states;
  - no double-counting in `reviewNeededCount`;
  - complete state.
- Updated dashboard use-case tests to expect `savedProductDecisionQueue`.
- Updated Dashboard API contract tests to verify the new field and required subfields.
- Updated dashboard UI source tests for card wiring, labels, state branches, CTA, and safe disclaimer.
- Updated authenticated dashboard E2E smoke to expect the new card.

## Validation Environment

- Node version: v24.14.0
- npm version: 11.14.1
- OS: Microsoft Windows NT 10.0.26200.0
- Validation date/time: 2026-06-17T15:34:54.3892967+07:00
- `.env.local`: present locally; not tracked by Git based on `git ls-files .env.local`
- MongoDB/test database available: Yes for local/E2E validation; no URI or credential was printed.
- Playwright browser dependencies available: Yes; full E2E passed after elevated rerun.
- Production-ready claimed: No

## Validation Commands

| Command | Result | Notes |
|---|---|---|
| `npm run test -- dashboard-saved-product-decision-queue dashboard-use-case dashboard-api-contract dashboard-ui onboarding-progress-card` | PASS | 5 test files / 68 tests passed. |
| `npm run lint` | PASS | ESLint completed successfully. |
| `npm run typecheck` | PASS | Initial pre-final run found one invalid test fixture cast; fixture was corrected and rerun passed. |
| `npm run test` | PASS | 116 test files / 1224 tests passed. |
| `npm run build` | PASS after elevated rerun | Sandboxed run compiled successfully but failed with Windows `spawn EPERM`; elevated rerun passed. |
| `npm run test:e2e` | PASS after elevated rerun | Sandboxed run failed immediately with Windows `spawn EPERM`; elevated rerun passed with 35 tests. |
| `npm audit --omit=dev --audit-level=moderate` | PASS | Found 0 vulnerabilities. |
| `git diff --check` | PASS | Passed with existing CRLF normalization warnings; no whitespace errors reported. |

## Validation Result

Local validation passed for the requested commands, with build and E2E requiring elevated reruns because the sandboxed process spawning failed with Windows `spawn EPERM`.

## Known Limitations

- MVP v1.48 deployed admin product review smoke remains open.
- Production-ready is not claimed.
- Production smoke was not performed for v1.53.
- The feature summarizes existing saved-product metadata only; it does not create reminders, due dates, or product recommendations.

## Out-of-Scope Confirmations

- No database schema change.
- No saved product mutation.
- No saved product normalization or backfill.
- No Product Match scoring change.
- No Routine Safety Engine change.
- No AI call.
- No recommendation ranking.
- No notification/reminder logic.
- No admin workflow change.
- No public exposure of private saved-product metadata through public product APIs.

## Production-Ready Statement

Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.
