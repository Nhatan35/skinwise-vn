# CHANGELOG-v1.2.1.md

# SkinWise VN SDD v1.2.1 Changelog

## Purpose

v1.2.1 is a consistency and implementation-readiness patch on top of v1.2.

It does not change product positioning, MVP scope, or safety direction. It only clarifies release planning, API visibility, data model queryability, safety-classifier block flow, local-date validation, and test coverage.

## Changes

### 1. Release plan consistency

Updated `docs/09-release-plan.md`:

- Added Ingredient Knowledge Base implementation to Week 2.
- Added `GET /api/ingredients`.
- Added `GET /api/ingredients/:id`.
- Added Ingredient Explainer implementation to Week 5.
- Added `POST /api/ingredients/explain`.
- Added `explain-ingredient.use-case.ts`.
- Added safety-classifier requirement before ingredient explanation when needed.
- Replaced beta item `Add ingredient search` with:
  - Expand ingredient knowledge base.
  - Add admin ingredient management.
  - Add ingredient/product comparison.

### 2. MVP release checklist

Updated `docs/09-release-plan.md`:

- Added ingredient search.
- Added ingredient detail view.
- Added AI ingredient explanation.
- Added `IngredientExplanationResult` schema validation.
- Added safety classifier before ingredient explanation.
- Added product visibility release checks.
- Added top-level `RoutineAnalysis.riskLevel`.
- Added RuleResult storage/triggered-warning API behavior.

### 3. Product visibility and trust rules

Updated `docs/05-api-contract.md`:

- Added `includeMine?: boolean` to `GET /api/products`.
- Default product search returns only `verified` and `reviewed` products.
- `includeMine=true` returns the current user's own unverified submissions.
- Unverified user submissions from other users must not be public.
- Added visibility rules for `GET /api/products/:id`.
- Clarified that `POST /api/products` is for user-submitted products only.
- Clarified that future admin product management must use `/api/admin/products` and require `ADMIN` role.

### 4. RoutineAnalysis queryability and rule storage

Updated `docs/04-data-model.md`:

- Added top-level `riskLevel` to `RoutineAnalysis`.
- Added index `userId, riskLevel, createdAt`.
- Clarified that top-level risk level is derived from the deterministic rule engine.
- Clarified that AI explanation must not override risk level.
- Clarified that database stores all RuleResult entries.
- Clarified that user-facing API exposes only triggered warnings.

### 5. Index wording cleanup

Updated `docs/04-data-model.md`:

- Changed `unique compound index: userId` to `unique index: userId` for single-field indexes.
- Confirmed Product index list does not duplicate `index: brand`.

### 6. localDate/timezone validation

Updated `docs/04-data-model.md` and `docs/05-api-contract.md`:

- Added `localDate` regex validation: `/^\d{4}-\d{2}-\d{2}$/`.
- Clarified `timezone` must be an IANA timezone string.
- Clarified localDate range queries can use lexicographic comparison because `YYYY-MM-DD` sorts correctly.

### 7. Safety classifier block flow

Updated `docs/06-ai-contract.md` and `docs/07-security-privacy.md`:

- If `shouldBlockAIAnswer = true`, do not call routine explanation AI.
- If `shouldBlockAIAnswer = true`, do not call ingredient explanation AI.
- Return a safe educational response, professional-guidance recommendation, or refusal depending on `safeResponseType`.
- Log only category/risk metadata, not raw sensitive text.

### 8. Test plan fixes

Updated `docs/08-test-plan.md`:

- Fixed duplicate heading numbering.
- Added product visibility tests.
- Added top-level RoutineAnalysis riskLevel tests.
- Added RuleResult exposure tests.
- Added SafetyClassifier block-flow tests.
- Added localDate validation tests.

### 9. AI coding assistant instructions

Updated `AGENTS.md`:

- Added product visibility rules.
- Added admin product verification route guidance.
- Added SafetyClassifier block-flow rule.
- Added RoutineAnalysis riskLevel requirement.
- Added RuleResult storage vs API exposure rule.

### 10. README/source notes

Updated:

- `README.md` marks the current SDD version as v1.2.1.
- `docs/source-notes.md` version updated to v1.2.1.

## Implementation recommendation

After v1.2.1, do not continue editing SDD unless a new product decision appears.

Next step:

```txt
Create Week 1 Implementation Plan.
Do not code yet.
```
