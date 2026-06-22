# Release Evidence - MVP v1.54 Saved Products Review Queue Filters

## Feature Name

MVP v1.54 - Saved Products Review Queue Filters

## Scope

- Add review queue filters to the authenticated Saved Products page.
- Reuse existing saved-product data only: `decisionStatus`, `plannedRoutineSlot`, and `personalNote`.
- Keep filtering deterministic, client-side, read-only, and order-preserving.
- Share review-needed logic with the v1.53 dashboard saved product decision queue summary.
- Keep the Dashboard savedProductDecisionQueue CTA on the base Saved Products route because the Saved Products page uses local filter state, not URL query state.

## Files Changed

- `src/modules/saved-products/saved-product-review.ts`
- `src/modules/saved-products/saved-product-filters.ts`
- `src/modules/saved-products/components/saved-products-page.tsx`
- `src/modules/dashboard/dashboard.mapper.ts`
- `tests/unit/saved-product-review.test.ts`
- `tests/unit/saved-product-filters.test.ts`
- `tests/unit/saved-products-ui.test.ts`
- `tests/e2e/saved-products.authenticated.spec.ts`
- `README.md`
- `docs/00-source-of-truth.md`
- `docs/02-user-stories.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/final-release-checklist.md`
- `docs/post-mvp-backlog.md`
- `docs/release-evidence-saved-products-review-queue-filters-v1.54.md`

## Behavior Added

- Saved Products page now renders review queue filter chips:
  - `Tất cả`
  - `Cần xem lại`
  - `Đang cân nhắc`
  - `Đang dùng thử`
  - `Tạm dừng`
  - `Muốn giữ lại`
  - `Chưa chọn trạng thái`
  - `Chưa có kế hoạch routine`
  - `Chưa có ghi chú`
- `Cần xem lại` includes products with blank decision status, unknown non-blank decision status, blank planned routine slot, blank personal note, `considering`, or `testing`.
- Paused and kept products are not automatically review-needed unless another review-needed condition applies.
- Unknown non-blank decision status values do not crash and are treated as review-needed.
- Filtered results preserve existing saved-product ordering and do not duplicate products.
- Empty filtered state is shown when no records match.
- Filter controls expose selected state with `aria-pressed`.
- Existing saved-product edit, remove, tag, note, status, routine-slot, and comparison behavior remains unchanged.

## Tests Added / Updated

- Added `tests/unit/saved-product-review.test.ts` for shared review-needed and review-filter logic.
- Updated `tests/unit/saved-product-filters.test.ts` for Saved Products filter integration.
- Updated `tests/unit/saved-products-ui.test.ts` for review filter controls, labels, empty-state copy, accessibility state, and safe disclaimer.
- Updated `tests/e2e/saved-products.authenticated.spec.ts` so the authenticated Saved Products flow selects review queue filters and verifies filtered results.
- Existing dashboard decision queue tests continue to cover the v1.53 Dashboard summary behavior.

## Validation Commands

| Command | Result | Notes |
|---|---:|---|
| `npm run lint` | PASS | ESLint completed successfully. |
| `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| `npm run test` | PASS | 117 test files / 1260 tests passed. |
| `npm run build` | PASS | Sandboxed run compiled then failed with Windows `spawn EPERM`; elevated rerun passed. |
| `npm run test:e2e` | PASS | Sandboxed run failed immediately with Windows `spawn EPERM`; elevated rerun passed with 35/35 Playwright tests. |
| `npm audit --omit=dev --audit-level=moderate` | PASS | Found 0 vulnerabilities. |
| `git diff --check` | PASS | Passed with existing CRLF normalization warnings for previously dirty files. |

Focused pre-final check:

| Command | Result | Notes |
|---|---:|---|
| `npm run test -- saved-product-review saved-product-filters saved-products-ui dashboard-saved-product-decision-queue` | PASS | 5 test files / 117 tests passed after correcting one test expectation. |

## Validation Result

Local validation PASS after elevated reruns for build and E2E due Windows sandbox `spawn EPERM`.

Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.

## Validation Environment

- Node version: v24.14.0
- npm version: 11.14.1
- OS: Microsoft Windows NT 10.0.26200.0
- Validation date/time: 2026-06-17T21:03:47.4644094+07:00
- `.env.local` present: Yes
- MongoDB/test database available: Yes. E2E seed connected to `skinwise-e2e-check`.
- Playwright browser dependencies available: Yes. Full Chromium E2E passed.
- Production-ready claimed: No

## Known Limitations

- MVP v1.48 deployed admin product review smoke remains open.
- Build and E2E required elevated reruns because the sandboxed Windows process hit `spawn EPERM`.
- No deployed production smoke was performed for v1.54.
- No new manual browser, screen-reader, screenshot, or demo-video evidence was captured for v1.54.

## Out-of-Scope Confirmations

- No database schema change.
- No saved product mutation, normalization, or backfill as part of filtering.
- No Product Match scoring change.
- No Routine Safety Engine change.
- No AI call.
- No recommendation ranking.
- No notification, reminder, or review due-date logic.
- No admin product review workflow change.
- No public exposure of private saved-product metadata through public product APIs.
- No routing refactor.
- No URL query contract introduced.
- No new sorting behavior.
- No new npm packages.

## Production-Ready Statement

Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.
