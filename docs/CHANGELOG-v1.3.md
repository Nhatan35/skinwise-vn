# CHANGELOG v1.3

## 2026-05-31 - Personalized Product Match

### Added

- Added protected `/product-match` dashboard route for educational product matches based on the authenticated user's Skin Profile.
- Added authenticated `GET /api/product-match` API returning `ProductMatchResponseDto` directly inside the standard `{ data, error }` envelope.
- Added deterministic rule-based product matching engine with match score, match level, reasons, cautions, matched signals, and saved-product state.
- Added visible-product candidate loading for matching without applying the user-facing API limit before scoring.
- Added dashboard navigation and dashboard next-action support for Product Match.
- Added unit coverage for scoring, use case orchestration, API contract, client parsing, repository source behavior, UI source behavior, dashboard route wiring, and auth route protection.
- Added authenticated Playwright coverage for reviewing Product Match results, saving a matched product, and opening product details.

### Safety and scope

- Product Match is deterministic and does not call external AI providers.
- No diagnosis, skin score, appearance score, treatment guarantee, product-causality claim, face analysis, image analysis, marketplace, cart, checkout, payment, or new recommendations collection was added.
- Product candidates reuse existing visible-product rules and saved status reuses existing saved-products behavior.

### Changed

- Localized Product Match visible UI copy to Vietnamese.
- Localized Product Match generated reasons and cautions to Vietnamese while keeping raw product names, brand names, ingredient values, IDs, and API enum values unchanged.
- Corrected README route documentation for `/insights`, `/api/insights`, `/product-match`, and `/api/product-match`.
- Updated API contract and UI route map documentation for the localized Product Match contract and page states.
- Updated affected Product Match tests for localized copy.

### Tests

- Product Match scoring, API contract, client, use-case, repository, UI, and Playwright E2E coverage remain in place.
- Scoring, API/client fixtures, UI source assertions, and Product Match E2E heading assertions were updated for Vietnamese copy.

### Validation

```txt
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 84 files / 777 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run test:e2e: PASS - 28/28 tests
```

## 2026-05-31 - Post-MVP Skin Progress Insights & Calendar

### Added

- Added focused unit coverage for Insights schema, mapper, use case, client, API contract, and UI source behavior.
- Added authenticated Playwright coverage for the protected `/insights` route using the existing test-auth and E2E helper setup.
- Added `docs/22-post-mvp-insights-plan.md` for the full feature contract, safety boundaries, DTO, acceptance criteria, tests, and limitations.

### Updated

- Documented `GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD`.
- Documented the active routine-slot based `InsightsDto`.
- Updated route documentation for `/insights`, dashboard navigation, and protected route matching.
- Updated AI coding docs to mark Insights as a Post-MVP v1.3 feature.

### Safety and scope

- No skin score, diagnosis, medication recommendation, treatment claim, product-causality claim, face analysis, image analysis, marketplace, or payment feature was added.
- No Mongoose dependency or database schema migration was added.
- Product usage remains based on visible product lookup and skips invalid, missing, hidden, or unauthorized products.

### Validation

```txt
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 78 files / 745 tests
npm run build: PASS
npm run test:e2e: PASS - 25/25 tests
```
