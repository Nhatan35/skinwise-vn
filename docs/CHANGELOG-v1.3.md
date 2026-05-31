# CHANGELOG v1.3

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
