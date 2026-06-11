# Release Evidence - v1.24 Seed Data Quality Expansion Round 2

## 1. Release Summary

| Field | Value |
|---|---|
| Version | v1.24 |
| Release type | Post-MVP seed data quality improvement |
| Date | 2026-06-11 |
| Branch | main |
| Commit hash | 20aedae28c6a92f01cbd052046285a6b3ccee423 |
| Production URL | https://skinwise-vn.vercel.app from README; production verification NOT CHECKED for v1.24 |
| Release owner | TODO |

Do not treat the production URL as v1.24 production verification. No v1.24 production smoke check was performed in this closeout run.

v1.25.1 consistency note:

* The v1.24 seed baseline and this evidence file were restored during `v1.25.1 - Seed Baseline Regression & Documentation Consistency Hotfix`.
* The restored seed baseline contains 70 products and 70 ingredients.
* This restoration does not mark v1.24 DONE.
* v1.24 build/E2E validation blockers remain deferred unless separately rerun and passed.

## 2. Scope

### Included

* Review current seed product and ingredient data.
* Confirm product seed count is at least 70.
* Confirm ingredient seed count is at least 70.
* Verify category coverage.
* Verify skin type coverage.
* Verify concern coverage.
* Verify Product Match demo support.
* Verify Routine Safety Analysis demo support.
* Verify seed data quality tests.
* Update seed data documentation.
* Create v1.24 release evidence.
* Update source-of-truth/status docs.
* Update final release checklist.
* Run required local validation commands where the environment allowed the command to complete.

### Excluded

* Admin CRUD.
* Real AI provider integration.
* Database schema change.
* Product schema change.
* Ingredient schema change.
* New collections.
* New enum values.
* Payment/checkout.
* Marketplace/order workflow.
* Image upload.
* Skin image analysis.
* Skin scoring.
* Diagnosis.
* Treatment advice.
* Medical recommendation logic.
* Production database seeding.

## 3. Data Changes

| Field | Value |
|---|---:|
| Previous product count | 58 |
| New product count | 70 |
| Previous ingredient count | 59 |
| New ingredient count | 70 |

Previous baseline values are confirmed from historical v1.14 documentation. Current v1.24 values are confirmed from `scripts/seed.ts` through `validateSeedData()`.

Current product category coverage:

| Category | Count |
|---|---:|
| cleanser | 7 |
| moisturizer | 12 |
| sunscreen | 11 |
| serum | 16 |
| treatment | 10 |
| toner | 6 |
| mask | 5 |
| other | 3 |

Current skin type coverage:

| Skin type | Count |
|---|---:|
| oily | 28 |
| dry | 36 |
| combination | 54 |
| normal | 58 |
| sensitive | 37 |
| unknown | 4 |

Current concern coverage:

| Concern | Count |
|---|---:|
| acne | 14 |
| oiliness | 21 |
| dryness | 36 |
| redness | 29 |
| dark_spots | 24 |
| texture | 27 |
| barrier_support | 44 |
| unknown | 4 |

Demo support verified from seed data/tests:

* Product Match demo support covers oily/acne-prone, dry/sensitive, combination/dullness-texture, normal/sunscreen, and dehydrated/barrier concern profiles.
* Routine Safety demo support covers active overlap, retinoid plus exfoliant, too many actives, morning missing sunscreen, barrier support, and fragrance/sensitive-skin caution.
* Sunscreen products: 11.
* Barrier-support products: 44.
* Strong-active products: 16.

## 4. Quality Rules

Rules enforced by `scripts/seed.ts` and/or `tests/unit/seed-data-quality.test.ts`:

* Product count minimum: 70.
* Ingredient count minimum: 70.
* Required product fields must be schema-compliant.
* Required ingredient fields must be schema-compliant.
* No duplicate product names.
* No duplicate brand + product name pairs.
* No duplicate ingredient INCI/common names.
* No duplicate ingredient aliases across records when aliases exist.
* Valid product categories.
* Valid product skin types.
* Valid product concerns.
* Valid ingredient evidence levels.
* Ingredient function/category coverage for common demo ingredient roles.
* Skin type coverage.
* Concern coverage.
* Strong active product warning coverage.
* Strong active ingredient caution coverage.
* Sunscreen coverage.
* Barrier support coverage.
* Product Match demo profile coverage.
* Routine Safety demo case coverage.
* Safety and cosmetic claims boundary.

## 5. Tests Added or Updated

| Test file path | Status | Notes |
|---|---|---|
| `tests/unit/seed-data-quality.test.ts` | Existing v1.24 tests verified | Enforces v1.24 70/70 minimum count baseline, uniqueness, schema compliance, category/skin type/concern coverage, strong-active caution coverage, non-medical claims boundary, Product Match demo candidates, and Routine Safety demo cases. |
| `tests/unit/ui-foundation.test.ts` | Updated | Increased the timeout for the dynamic shared-component import test to avoid a full-suite false failure in the current slower validation environment. No product behavior changed. |

The seed data quality test file enforces the v1.24 minimum baseline through:

```txt
MINIMUM_V1_24_PRODUCT_COUNT = 70
MINIMUM_V1_24_INGREDIENT_COUNT = 70
```

## 6. Local Validation

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | PASS | ESLint completed successfully. |
| `npm run typecheck` | PASS | TypeScript completed with `tsc --noEmit`. |
| `npm run test` | PASS | Initial run failed because `tests/unit/ui-foundation.test.ts` timed out at 5s; after increasing that test timeout to 15s, rerun passed: 103 test files / 997 tests. |
| `npm run build` | FAIL | Command was attempted twice and timed out in this environment after compiling successfully and reaching `Running TypeScript ...`. Do not mark v1.24 DONE. |
| `npm run test:e2e` | FAIL | Command timed out in this environment while starting the Playwright web server. No E2E PASS is claimed. |
| `npm audit --omit=dev --audit-level=moderate` | PASS | 0 vulnerabilities. |

Environment note:

```txt
npm ci completed with EBADENGINE warnings because the archive was validated under Node v22.16.0 / npm 10.9.2 while package.json requires Node 24.x / npm 11.x.
```

## 7. Manual Verification

| Area | Result | Notes |
|---|---|---|
| Product Catalogue loads | NOT CHECKED | Manual browser verification was not performed. |
| Product Detail loads for seeded products | NOT CHECKED | Manual browser verification was not performed. |
| Ingredient Library loads | NOT CHECKED | Manual browser verification was not performed. |
| Product Match still returns useful results | NOT CHECKED | Automated seed quality tests passed after the test-timeout stabilization; manual browser verification was not performed. |
| Routine Builder still works | NOT CHECKED | Manual browser verification was not performed. |
| Routine Safety Analysis still works | NOT CHECKED | Automated seed quality tests passed after the test-timeout stabilization; manual browser verification was not performed. |
| No obvious unsafe medical claims appear in UI copy | NOT CHECKED | Seed copy is covered by automated seed quality tests; full UI manual browser review was not performed. |
| Browser console has no blocking error during smoke check | NOT CHECKED | Manual browser verification was not performed. |

`npm run test:e2e` does not count as manual browser verification. No production verification was performed for v1.24.

## 8. Known Limitations

* v1.24 cannot be closed as DONE because required validation did not fully pass in this environment.
* `npm run build` timed out twice after successful compilation while running TypeScript in Next.js build.
* `npm run test:e2e` timed out while starting the Playwright web server.
* v1.25.1 restored this v1.24 evidence file after it was missing from the repository.
* Validation environment uses Node v22.16.0 / npm 10.9.2, while the project declares Node 24.x / npm 11.x.
* Seed data is curated demo data, not medical advice.
* Product information is simplified for MVP/demo use.
* No real AI provider is used.
* No admin CRUD is available yet.
* No production seed verification was performed.
* Manual browser verification was NOT CHECKED.

## 9. Final Decision

| Field | Value |
|---|---|
| v1.24 implementation state | Implementation appears complete for seed data count/tests/docs closeout scope. |
| v1.24 validation state | BLOCKED / FAILED local validation because `npm run build` and `npm run test:e2e` did not pass. |
| Final decision | FAIL |
| v1.24 status | NOT DONE |
| Production verification | NOT CHECKED |
| Manual browser verification | NOT CHECKED |
| Next required action | Re-run required validation in the project-supported Node 24.x / npm 11.x environment, investigate Next build/E2E timeouts, and only then mark v1.24 DONE if all required commands pass. |

Decision rule applied: v1.24 is not marked DONE because not all required validation commands passed.
