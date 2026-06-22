# MVP v1.60 - Admin Ingredient Create/Edit Lite Release Evidence

## Scope

MVP v1.60 adds admin-only Ingredient Library create/edit lite without changing user-facing ingredient learning flows.

Implemented scope:

- Admin can open protected `/admin/ingredients`.
- Admin can list/search/filter ingredients.
- Admin can create a new ingredient.
- Admin can edit an existing ingredient.
- Admin ingredient create/edit supports `inciName`, `aliases`, `functions`, `commonUses`, `suitableFor`, `cautionFor`, `avoidWith`, `evidenceLevel`, and `sourceRefs`.
- `sourceRefs` follows the existing model shape: `string[]`.
- `evidenceLevel` follows the existing enum: `basic`, `moderate`, `strong`, `uncertain`.
- Duplicate normalized `inciName` values are rejected server-side.
- User-facing `/ingredients`, `/ingredients/[id]`, `GET /api/ingredients`, `GET /api/ingredients/[id]`, and `POST /api/ingredients/explain` remain preserved.

## Preflight / worktree state

Preflight commands were run before v1.60 implementation:

```txt
git status
git diff --stat
```

Observed state:

- The worktree was already dirty before v1.60.
- Existing dirty work included v1.59 Admin Product Create/Edit Lite files.
- Existing dirty work also included unrelated dashboard, saved-products, docs, route-map, and evidence files from earlier workstreams.
- v1.60 was implemented on top of that dirty worktree without reverting unrelated files.
- v1.60 intentionally changed only ingredient/admin route, ingredient admin UI/client/schema/repository/use-case, E2E seed/test coverage, route constants, and required documentation/evidence files.

## Files changed

Ingredient/admin implementation:

- `src/shared/constants/routes.ts`
- `src/modules/ingredients/ingredient.schema.ts`
- `src/modules/ingredients/ingredient.repository.ts`
- `src/modules/ingredients/ingredient.use-case.ts`
- `src/modules/ingredients/admin-ingredient.client.ts`
- `src/modules/ingredients/components/admin-ingredient-form.tsx`
- `src/modules/ingredients/components/admin-ingredient-management.tsx`
- `src/app/api/admin/ingredients/route.ts`
- `src/app/api/admin/ingredients/[id]/route.ts`
- `src/app/admin/ingredients/page.tsx`

Tests and E2E:

- `tests/unit/ingredient.test.ts`
- `tests/unit/ingredient-use-case.test.ts`
- `tests/unit/admin-ingredient-api-contract.test.ts`
- `tests/unit/admin-ingredient-client.test.ts`
- `tests/unit/admin-ingredient-ui.test.ts`
- `tests/e2e/admin-ingredient-management.smoke.spec.ts`
- `tests/e2e/helpers/test-data.ts`
- `scripts/seed-e2e.ts`

Documentation:

- `README.md`
- `docs/00-source-of-truth.md`
- `docs/02-user-stories.md`
- `docs/04-data-model.md`
- `docs/05-api-contract.md`
- `docs/09-release-plan.md`
- `docs/13-ui-route-map.md`
- `docs/post-mvp-backlog.md`
- `docs/ai-coding/02-implementation-status.md`
- `docs/ai-coding/03-feature-status-matrix.md`
- `docs/ai-coding/06-current-sprint-plan.md`
- `docs/release-evidence-admin-ingredient-create-edit-lite-v1.60.md`

## Behavior added

- Admin ingredient list:
  - protected `/admin/ingredients` page;
  - search by ingredient text fields through the existing ingredient search behavior;
  - function filter;
  - stable sort by `inciName`;
  - loading, error, and empty states.

- Admin ingredient create:
  - `Tao thanh phan` action opens create mode;
  - required client-side feedback for `inciName` and `evidenceLevel`;
  - textarea array fields use one item per line, trim items, remove empty lines, and preserve order;
  - successful create refreshes the admin list and shows success feedback;
  - server-side validation remains authoritative.

- Admin ingredient edit:
  - each ingredient item has a `Chinh sua` action;
  - edit mode pre-fills the current ingredient data;
  - successful save refreshes the admin list and shows success feedback;
  - omitted fields are preserved by partial update behavior.

## API changes

- Added `GET /api/admin/ingredients`.
- Added `POST /api/admin/ingredients`.
- Added `PATCH /api/admin/ingredients/[id]`.
- Preserved `GET /api/ingredients`.
- Preserved `GET /api/ingredients/[id]`.
- Preserved `POST /api/ingredients/explain`.

API security and validation:

- Requires authentication.
- Requires `AppUserProfile.role = "ADMIN"`.
- Rejects unauthenticated users with `UNAUTHORIZED`.
- Rejects non-admin users with `FORBIDDEN`.
- Rejects invalid query/body/route params with `VALIDATION_ERROR`.
- Rejects invalid route ids with `400`.
- Rejects valid missing ingredient ids with `404`.
- Rejects duplicate normalized `inciName` with `409`.
- Rejects direct writes to `_id`, `id`, `createdAt`, and `updatedAt`.
- Does not expose raw database errors to clients.

## UI changes

- Added protected `/admin/ingredients`.
- Added admin ingredient management UI with:
  - page heading;
  - search input;
  - function filter;
  - ingredient list;
  - `Tao thanh phan` action;
  - `Chinh sua` action;
  - create/edit form;
  - saving state;
  - success feedback;
  - error feedback;
  - validation feedback;
  - duplicate ingredient feedback.

Admin create/edit controls are not added to user-facing `/ingredients` or `/ingredients/[id]`.

## Security and permission behavior

- Unauthenticated users are redirected or receive `UNAUTHORIZED` according to the existing admin pattern.
- Non-admin users cannot access `/admin/ingredients` or admin ingredient APIs.
- Admin ingredient APIs derive identity from the authenticated session and admin profile.
- Client payloads cannot set internal timestamp/id fields.
- Public ingredient APIs remain read/explain-only for this feature.

## Duplicate ingredient behavior

- Create trims `inciName` and checks duplicate normalized names case-insensitively.
- Update checks duplicate normalized names only when `inciName` is provided.
- Updating an ingredient to its own current normalized `inciName` is allowed.
- Updating an ingredient to another ingredient's normalized `inciName` is rejected.
- No merge/deduplication workflow is added.

## User-facing ingredient behavior

- `/ingredients` remains user-facing and does not show admin create/edit controls.
- `/ingredients/[id]` remains user-facing and does not show admin management controls.
- Ingredient Library search/filter remains covered by existing and v1.60 E2E.
- Ingredient Detail and Explanation remain covered by existing and v1.60 E2E.
- No publish/unpublish status is added for ingredients.
- No Product-to-Ingredient linking or product ingredient parsing is added.

## Tests added/updated

Unit/API/client/UI:

- Admin create ingredient schema accepts valid payloads.
- Admin create ingredient schema rejects empty `inciName`.
- Admin create ingredient schema rejects invalid `evidenceLevel`.
- Admin create ingredient schema normalizes array fields.
- Admin create ingredient schema rejects internal fields.
- Admin create ingredient schema enforces max lengths.
- Admin update ingredient schema accepts valid partial updates.
- Admin update ingredient schema rejects empty `inciName` when provided.
- Admin update ingredient schema rejects invalid `evidenceLevel`.
- Admin update ingredient schema rejects internal fields.
- Repository duplicate lookup, create timestamp, partial update, and invalid id behavior are covered.
- Use-case create/update duplicate behavior is covered.
- Admin ingredient API unauthenticated, non-admin, success, invalid payload, invalid id, missing id, duplicate, and internal-field behavior is covered.
- Existing public ingredient list/detail/explanation route behavior remains covered.
- Admin ingredient client path, method, error, duplicate, and invalid-response behavior is covered.
- Admin ingredient UI source contract covers create/edit/list/loading/success/error/duplicate states and user-facing boundary.

E2E:

- Added admin ingredient management smoke coverage:
  - unauthenticated users are redirected without seeing admin ingredient data;
  - non-admin users cannot view admin ingredient data;
  - admin can search existing ingredients;
  - admin can create a smoke ingredient;
  - admin can edit the smoke ingredient;
  - user-facing Ingredient Library can find the edited ingredient;
  - user-facing Ingredient Detail and Explanation still work.

## Validation results

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 120 test files / 1343 tests
npm run build: PASS after elevated rerun
npm run test:e2e: PASS after elevated rerun - 39/39 tests
npm audit --omit=dev --audit-level=moderate: PASS - found 0 vulnerabilities
```

Validation notes:

- `npm run build` first compiled successfully in the sandbox and then failed with `spawn EPERM`; the elevated rerun passed.
- `npm run test:e2e` failed immediately in the sandbox with `spawn EPERM`; the elevated rerun passed with 39/39 Playwright tests.
- The first elevated E2E rerun found two selector issues in the new admin ingredient E2E test caused by Vietnamese text encoding drift; selectors were changed to stable input/link/panel selectors and the final E2E rerun passed.

## Known limitations

- This is create/edit lite, not a full Ingredient CMS.
- Ingredient delete and soft delete are not implemented.
- Ingredient publish/unpublish workflow is not implemented.
- Ingredient merge/deduplication is not implemented.
- Bulk CSV import/export is not implemented.
- Ingredient image upload is not implemented.
- Product-to-Ingredient relational mapping is not implemented.
- Deployed v1.48 admin product review smoke evidence remains incomplete.

## Out of scope

- Ingredient delete.
- Ingredient soft delete.
- Ingredient publish/unpublish workflow.
- Ingredient verification workflow.
- Ingredient merge/deduplication.
- Bulk CSV import/export.
- Ingredient image upload.
- Ingredient version history.
- Ingredient audit log.
- AI auto-generate ingredient content.
- Real AI provider change.
- Product ingredient auto-linking.
- Full Product-to-Ingredient relational mapping.
- Medical diagnosis.
- Treatment recommendation.
- Production-ready claim.

## Production readiness note

This feature does not claim production-ready status because MVP v1.48 deployed admin product review smoke evidence remains incomplete.
