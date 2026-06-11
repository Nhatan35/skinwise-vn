# SkinWise VN Post-MVP Backlog

Last updated: 2026-06-11

## 1. Current Stable Baseline

```txt
Stable MVP release: v1.11-final-mvp / v1.11-portfolio-demo-ready
Post-MVP backlog planning: v1.12 - DONE
Previous post-MVP implementation: v1.13 - UX Polish & Empty State Improvement: DONE
Data quality implementation: v1.14 - Data Quality Expansion: DONE
Product explainability implementation: v1.15 - Product Match Explainability & Safety Guardrails: DONE
Previous completed milestone: v1.21 - Insight Explainability & Tracking Quality Checklist: DONE
Production observability implementation: v1.22 - Production Observability & Release Confidence: DONE
Production smoke verification: v1.22.1 - Production Deployment & Smoke Verification: PARTIAL / DEFERRED
Account data deletion hardening: v1.23 - Account Data Deletion Workflow Hardening: DONE
Seed data quality closeout: v1.24 - Seed Data Quality Expansion Round 2: NOT DONE / VALIDATION BLOCKED
First-session guided experience polish: v1.25 - First-Session Guided Experience Polish: DONE, scoped validation only
Seed baseline consistency hotfix: v1.25.1 - Seed Baseline Regression & Documentation Consistency Hotfix: DONE, scoped validation only
Product Match clarity polish: v1.26 - Product Match Explanation Clarity & Safe Decision Support Polish: DONE, scoped validation only
Product Detail to Saved Products decision-support polish: v1.27 - Product Detail to Saved Products Decision Support Polish: DONE, scoped validation only
Latest completed scoped task: v1.27 - Product Detail to Saved Products Decision Support Polish
Current active milestone: None
Current active milestone status: None
MVP core scope: COMPLETE
Portfolio demo readiness: COMPLETE
Current phase: Post-MVP controlled improvement
Recommended next task: TBD / Backlog grooming
Local validation: PASS for v1.27 scoped lint/typecheck/unit tests; v1.24 closeout remains validation-blocked
Production URL public reachability: PASS
Production health endpoint: PASS
Full production smoke/monitoring for v1.22.1: PARTIAL / DEFERRED
Historical production smoke/monitoring: PASS, user-reported
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video intentionally skipped for this milestone
```

This backlog starts **after** the stable MVP. It must not rewrite history or turn optional future ideas into MVP blockers.

## 2. Purpose

The purpose of this backlog is to keep future work controlled, prioritised, and safe.

Post-MVP work should improve one of these areas:

- first-time user experience;
- UI clarity and empty states;
- product and ingredient data quality;
- maintainability and documentation;
- observability and release confidence;
- optional future AI/admin capabilities with strict boundaries.

## 3. Post-MVP Working Rules

Before starting any backlog item, follow these rules:

```txt
1. Create a small branch or commit scope for one task only.
2. Do not mix UX polish, data expansion, AI integration, and admin features in one task.
3. Do not change database schema unless the selected task explicitly requires it.
4. Do not add clinical assessment, treatment claims, prescription advice, skin/face scoring, or face/image analysis.
5. Do not expose secrets, OAuth credentials, database URIs, tokens, or private user data.
6. Keep mock/fallback behavior working even if a future real AI provider is added.
7. Run validation before marking a task complete.
```

Recommended validation for source-code tasks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

For documentation-only tasks, a full test rerun is optional, but the changed docs must remain consistent with the implemented codebase.

## 4. Priority Summary

| Priority | Theme | Recommended Status | Why It Matters |
|---|---|---|---|
| P1 | UX polish and empty states | DONE in v1.13 | Makes the existing MVP easier to use without risky architecture changes. |
| P1 | Error/loading/helper copy | DONE in v1.13 | Improves confidence during demo and real use. |
| P2 | Data quality expansion | DONE in v1.14 | Makes Product Match and Ingredient Library feel more realistic. |
| P2 | Product Match explainability and safety guardrails | DONE in v1.15 | Makes matching and Product Detail decisions clearer without medical overclaiming. |
| P2 | Audit cleanup and evidence sync | DONE in v1.15.1 | Keeps npm audit/dependency-risk evidence and release docs truthful without product behavior changes. |
| P2 | Saved Product Comparison & Decision Support | DONE in v1.16 | Lets users compare 2-3 saved products using existing educational product data without ranking or recommendations. |
| P2 | Routine History & Weekly Progress Review | DONE in v1.17 | Helps users review 7-day routine consistency using existing routine log data and habit-tracking copy. |
| P2 | Skin Journal Filters & Reflection Review | DONE in v1.18 | Helps users review loaded journal notes by symptom, stress level, product usage, and recent time range with reflection-only copy. |
| P2 | Account Data Summary & Privacy Control Review | DONE in v1.19 | Helps users understand user-owned skincare data counts before export/delete actions. |
| P2 | Personal Insight Review & Safe Trend Cards | DONE in v1.20 | Adds strict count-only `/api/insights/summary` and safe reflection cards on `/insights` without medical or causal claims. |
| P2 | Insight Explainability & Tracking Quality Checklist | DONE in v1.21 | Explains how each personal insight card is calculated and shows data-availability status without scores, grades, or medical assessment. |
| P2 | Production Observability & Release Confidence | DONE in v1.22 | Adds safe `/api/health`, health API contract coverage, release evidence, incident note template, and monitoring/checklist updates. |
| P2 | Production Deployment & Smoke Verification | IN PROGRESS / NOT DONE in v1.22.1 | Public URL and `/api/health` passed direct checks; authenticated MVP flows and production signals remain unchecked. |
| P2 | Account Data Deletion Workflow Hardening | DONE in v1.23 | Hardens existing app-data deletion confirmation, ownership tests, sensitive-response checks, and deletion-boundary documentation. |
| P2 | Seed Data Quality Expansion Round 2 closeout | NOT DONE in v1.24 | Seed implementation and docs were synchronized to 70 products / 70 ingredients, but build/E2E validation is blocked in the current environment. |
| P2 | First-Session Guided Experience Polish | DONE in v1.25 | Improves dashboard onboarding guidance and next-step clarity without adding product scope; scoped validation passed with lint, typecheck, and unit tests. |
| P2 | Seed Baseline Regression & Documentation Consistency Hotfix | DONE in v1.25.1 | Restores v1.24 seed baseline/test/evidence consistency without marking v1.24 DONE or resolving deferred build/E2E blockers. |
| P2 | Product Match Explanation Clarity & Safe Decision Support Polish | DONE in v1.26 | Follow-up polish to v1.15 Product Match explainability; improves explanation labels, caution visibility, no-profile guidance, and next-action clarity without changing scoring, seed data, schema, or API contracts. |
| P2 | Product Detail to Saved Products Decision Support Polish | DONE in v1.27 | Follow-up polish after v1.26; improves Product Detail save-decision guidance and Saved Products empty-state clarity without changing Product Match scoring/ranking, Routine logic, seed data, schema, or API contracts. |
| P3 | Admin/content management | Optional | Useful only if product/ingredient content will grow. |
| P3 | Real AI provider integration | Optional, high control needed | Valuable, but requires safety, cost, fallback, and validation controls. |
| P4 | Portfolio assets | Documentation package prepared; media capture optional | Useful for presentation, but not required for product correctness. |

## 5. P1 - UX Polish & Empty State Improvement

### Goal

Improve the user experience of the existing app without changing core business logic.

### Status

```txt
v1.13 - UX Polish & Empty State Improvement: DONE
```

### Completed Tasks

- Improve loading states on main app pages.
- Improve empty states for first-time users.
- Add helpful next-action CTAs.
- Improve form validation copy.
- Improve API error messages shown to users.
- Improve mobile spacing on core pages.
- Improve dashboard section hierarchy.
- Make button labels more consistent.
- Add short helper text where the user may not understand the next step.

### Target Routes

```txt
/dashboard
/skin-profile
/onboarding/skin-profile
/products
/products/[id]
/product-match
/saved-products
/ingredients
/ingredients/[id]
/routines
/routine-logs/today
/journal
/insights
/settings
```

### Example Improvements

Saved products empty state:

```txt
Chưa có sản phẩm đã lưu
Hãy khám phá danh mục sản phẩm và lưu những sản phẩm bạn muốn xem lại hoặc so sánh sau.
CTA: Xem sản phẩm
```

Routine empty state:

```txt
Chưa có routine nào
Hãy tạo routine buổi sáng hoặc buổi tối để bắt đầu theo dõi thói quen chăm sóc da của bạn.
CTA: Tạo routine
```

Journal empty state:

```txt
Chưa có nhật ký da
Hãy thêm nhật ký đầu tiên để theo dõi cảm nhận của làn da theo thời gian.
CTA: Thêm nhật ký
```

Error state:

```txt
Không thể tải dữ liệu chăm sóc da.
Vui lòng thử lại hoặc làm mới trang.
```

### Acceptance Criteria

```txt
[x] Existing app routes still work.
[x] First-time users have clear next actions.
[x] Empty states are not blank or confusing.
[x] Error messages are user-friendly and not overly technical.
[x] Loading copy feels specific to the page.
[x] No database schema change.
[x] No auth/business-rule change.
[x] Existing tests pass.
```

### Suggested Version

```txt
v1.13 - UX Polish & Empty State Improvement
```

### Suggested Commit

```bash
git add .
git commit -m "feat: improve post-MVP UX states"
```

## 6. P2 - Product & Ingredient Data Quality

### Goal

Make the product catalogue and ingredient library feel more realistic and useful.

### Status

```txt
v1.14 - Data Quality Expansion: DONE
```

### Completed Tasks

- Expanded curated skincare products from 38 to 58.
- Expanded curated ingredients from 40 to 59.
- Improve category coverage.
- Add better skin concern tags.
- Review ingredient benefit/risk explanations.
- Improve seed data naming consistency.
- Add source notes for curated educational data where appropriate.

### Acceptance Criteria

```txt
[x] Seed validation passes successfully.
[x] Product catalogue loads correctly.
[x] Product detail pages still work.
[x] Product Match still works with expanded data.
[x] Ingredient library and ingredient detail still work.
[x] No unsafe medical claims are added.
```

### Suggested Version

```txt
v1.14 - Data Quality Expansion
```

### Suggested Commit

```bash
git add .
git commit -m "data: expand skincare product and ingredient seed data"
```

## 7. P2 - Production Observability & Release Confidence

### Goal

Improve confidence in production behavior and release handover.

### Status

```txt
v1.22 - Production Observability & Release Confidence: DONE
Validation for v1.22: PASS
Production smoke at v1.22 closeout: NOT CHECKED
```

### Completed Tasks

- Added safe public `GET /api/health` endpoint.
- Added health API contract test.
- Added repeatable release evidence document at `docs/release-evidence-v1.22.md`.
- Added production incident note template at `docs/production-incident-note-template.md`.
- Updated the production monitoring runbook with the health endpoint check and limitation.
- Updated final release/status documentation.

### Acceptance Criteria

```txt
[x] Release evidence is repeatable.
[x] Production issues can be recorded consistently.
[x] No secrets are copied into docs.
[x] User-reported evidence and tool/log evidence are clearly separated.
[x] Health endpoint is public, stable, and dependency-light.
[x] Health endpoint does not require auth, database, AI provider, OAuth, or environment variables.
[x] Required validation passed before marking DONE.
```

### Suggested Version

```txt
v1.22 - Production Observability & Release Confidence
```

### Current Note

```txt
v1.22 improves production confidence by adding a safe public health check endpoint, health API contract test, release evidence documentation, production incident note template, and monitoring/release checklist updates.
The health endpoint only verifies that the app route is reachable; it intentionally does not check database, OAuth, AI provider, or external service health.
Production smoke was not performed as part of the v1.22 local repository update. v1.22.1 later checked the public production URL and `/api/health`, but full authenticated smoke remains incomplete.
```

## 7A. P2 - Product Match Explainability & Safety Guardrails

### Goal

Improve Product Match and Product Detail decision support without changing the database schema or adding clinical advice behavior.

### Status

```txt
v1.15 - Product Match Explainability & Safety Guardrails: DONE
```

### Completed Tasks

- Improved Product Match explanations for matched skin type, selected concerns, ingredient/attribute signals, routine usage, and uncertainty notes.
- Improved caution notes for exfoliating acids, retinoids, benzoyl peroxide, fragrance/essential oils, dry/barrier-prone mismatch, and high-sensitivity profiles.
- Improved Product Detail decision-support wording for good-fit signals, caution notes, routine placement, and data-quality uncertainty.
- Improved no-profile and unknown-profile guidance without changing SkinProfile schema.
- Added focused unit coverage and reran full lint/typecheck/test/build/E2E/audit validation.

### Acceptance Criteria

```txt
[x] Product Match explains why products may fit the saved profile.
[x] Matched skin type and selected concern signals are visible.
[x] Strong active and sensitive-skin caution notes are generated.
[x] Product Detail includes clearer fit, caution, routine usage, and uncertainty guidance.
[x] Missing or incomplete profile states guide the user clearly.
[x] Wording remains educational and non-medical.
[x] No schema, route, auth, persistence, or AI-provider change.
[x] Validation passed before marking DONE.
```

## 7B. P2 - Saved Product Comparison & Decision Support

### Goal

Allow users to compare 2-3 saved products side by side using existing educational skincare product fields.

### Status

```txt
v1.16 - Saved Product Comparison & Decision Support: DONE
```

### Scope

- Saved product comparison selection.
- Comparison panel for 2-3 saved products.
- Safe educational disclaimer.
- No schema/API expansion.
- No recommendation engine.

### Acceptance Criteria

```txt
[x] Users can select and deselect saved products for comparison.
[x] Users can compare 2-3 saved products.
[x] Users cannot select more than 3 saved products.
[x] Removing a saved product removes it from comparison selection.
[x] Comparison uses existing ProductDto fields only.
[x] Copy remains educational and does not rank products.
[x] No database schema, collection, API route, marketplace, cart, checkout, payment, review, rating, social, or AI-driven advice scope is added.
[x] Validation passes before marking DONE.
```

### Suggested Version

```txt
v1.16 - Saved Product Comparison & Decision Support
```

## 7C. P2 - Routine History & Weekly Progress Review

### Goal

Help users review routine consistency over the last 7 days using existing routine log data.

### Status

```txt
v1.17 - Routine History & Weekly Progress Review: DONE
Validation for v1.17: PASS
```

### Scope

- Weekly routine review card on `/routine-logs/today`.
- 7-day routine summary using existing routine log data.
- Logged-day count and routine-log completion percentage.
- Completed, partial, skipped, and not-logged day states.
- Safe habit-tracking disclaimer.
- No schema or collection expansion.
- No scoring, clinical assessment, treatment guidance, or AI-driven product advice.
- No full analytics dashboard.

### Acceptance Criteria

```txt
[x] Weekly review card appears on /routine-logs/today.
[x] The existing today routine checklist still works.
[x] The card shows the last 7 local dates including today.
[x] The card shows logged-day count and completion percentage when data exists.
[x] The card shows a calm empty state when no recent routine logs exist.
[x] Copy frames the feature as habit tracking, not clinical evaluation.
[x] No database collection, schema redesign, marketplace, checkout, payment, review, rating, notification, image, or AI provider scope is added.
[x] Validation passes before marking DONE.
```

### Suggested Version

```txt
v1.17 - Routine History & Weekly Progress Review
```

## 7D. P2 - Skin Journal Filters & Reflection Review

### Goal

Help users review self-tracked skin journal entries by symptom, stress level, product usage, and recent time range where existing loaded data supports it.

### Status

```txt
v1.18 - Skin Journal Filters & Reflection Review: DONE
Validation for v1.18: PASS
```

### Scope

- Journal filter panel on `/journal`.
- Client-side filter helper for currently loaded journal entries.
- Result count and clear-filter action.
- Filter-specific empty state separate from the original no-journal empty state.
- Safe reflection disclaimer.
- Product-used filter based on existing `productsUsed` ids and available product labels.
- No schema expansion or API redesign.
- No product causality conclusions.
- No clinical assessment, skin/health scoring, treatment guidance, image analysis, or AI-driven advice.

### Acceptance Criteria

```txt
[x] Filter panel appears on /journal.
[x] Users can filter loaded journal entries by symptom, stress level, product usage, and recent local-date range.
[x] Multiple filters use AND logic.
[x] Users can clear all active filters.
[x] Result count reflects matching loaded entries.
[x] A filter-specific empty state appears when entries exist but none match the active filters.
[x] Original no-journal empty state remains intact.
[x] Existing create, edit, and delete flows remain unchanged.
[x] Active filters remain stable after create, update, and delete actions.
[x] Copy frames the feature as reflection over self-tracked notes.
[x] Validation passes before marking DONE.
```

### Suggested Version

```txt
v1.18 - Skin Journal Filters & Reflection Review
```

## 7E. P2 - Account Data Summary & Privacy Control Review

### Goal

Help users understand what user-owned skincare data is stored before export/delete actions.

### Status

```txt
v1.19 - Account Data Summary & Privacy Control Review: DONE
Validation for v1.19: PASS
```

### Scope

- Account app-data summary card on `/settings`.
- User-owned skincare data counts for skin profiles, saved products, routines, routine logs, routine analyses, and skin journals.
- Shared catalogue preservation copy for products and ingredients.
- Privacy-safe export/delete copy.
- GET `/api/account/app-data` count-only summary response.
- Existing DELETE `/api/account/app-data` behavior preserved.
- Tests and docs.
- No secrets, token values, session values, provider account identifiers, database identifiers, or raw export snapshots displayed.
- No OAuth account deletion claim.
- No shared catalogue deletion.
- No new database collection or schema redesign.

### Acceptance Criteria

```txt
[x] Summary card appears on /settings.
[x] Summary counts use authenticated user-owned app data.
[x] Shared catalogue preservation is explained.
[x] Export/delete copy clarifies user-owned app-data scope.
[x] Summary loading/error is isolated to the card.
[x] Loading the summary does not trigger destructive actions.
[x] Summary refreshes after successful app-data deletion.
[x] Existing export, app-data deletion, and account deletion request flows remain intact.
[x] GET /api/account/app-data returns only summary data.
[x] DELETE /api/account/app-data behavior remains intact.
[x] Validation passes before marking DONE.
```

### Suggested Version

```txt
v1.19 - Account Data Summary & Privacy Control Review
```

## 7F. P2 - Personal Insight Review & Safe Trend Cards

### Goal

Help users review their own routine-log and skin-journal tracking patterns through strict count-based reflection cards on `/insights`.

### Status

```txt
v1.20 - Personal Insight Review & Safe Trend Cards: DONE
Validation for v1.20: PASS
```

### Scope

- Added authenticated `GET /api/insights/summary`.
- Added a strict summary DTO with no database IDs, user IDs, routine IDs, journal IDs, product IDs, raw documents, session data, token data, or provider account data.
- Added Personal Insight Review on `/insights`.
- Added routine consistency, journal symptom frequency, stress reflection, and product mention pattern cards.
- Added insufficient-data and partial-data fallbacks.
- Added focused unit, API contract, client, UI source, and authenticated E2E coverage.
- No schema change, AI provider change, medical interpretation, diagnosis, causation claim, product effectiveness claim, product harm claim, or skin score.

### Acceptance Criteria

```txt
[x] /api/insights/summary requires authentication.
[x] Summary data is scoped to the authenticated user.
[x] Summary response is count-only and does not expose forbidden identifiers or auth/session/provider fields.
[x] /insights shows Personal Insight Review without replacing existing insights cards.
[x] Routine consistency uses the last 7 local dates.
[x] Journal symptom, stress, and product summaries use the last 30 local dates.
[x] Empty and missing-data states are safe and helpful.
[x] Copy remains reflection-only and non-medical.
[x] Validation passes before marking DONE.
```

### Known Limitations

```txt
Routine configuration uses currently configured routines; there is no active/archive routine flag.
Product mention cards depend on existing journal productsUsed data and visible product lookup.
Stress reflection uses the existing low/medium/high journal stress labels only.
```

### Suggested Version

```txt
v1.20 - Personal Insight Review & Safe Trend Cards
```

## 7G. P2 - Insight Explainability & Tracking Quality Checklist

### Goal

Help users understand how each Personal Insight Review card was calculated and whether recent tracking data is available, limited, missing, or not configured.

### Status

```txt
v1.21 - Insight Explainability & Tracking Quality Checklist: DONE
Validation for v1.21: PASS
```

### Scope

- Extended `GET /api/insights/summary` with calculation metadata for routine consistency, symptom frequency, stress reflection, and product mention pattern cards.
- Added a tracking quality checklist for routine logs, journal entries, symptom notes, stress notes, and product mentions.
- Added checklist and calculation explanation UI on `/insights`.
- Kept response data summary-only and count-based.
- Preserved existing v1.20 summary fields and existing `/api/insights` behavior.
- Added unit, API contract, client, UI source, and authenticated E2E coverage.
- No schema change, AI provider change, diagnosis, treatment advice, causation claim, product effectiveness claim, product harm claim, risk score, skin score, health grade, or medical assessment.

### Acceptance Criteria

```txt
[x] /insights shows calculation explanations for Personal Insight Review cards.
[x] /insights shows Tracking Quality Checklist.
[x] Checklist uses safe data-availability labels only.
[x] GET /api/insights/summary returns calculation metadata.
[x] GET /api/insights/summary returns tracking quality checklist data.
[x] Existing v1.20 response fields remain present.
[x] Summary response does not expose database IDs, user IDs, routine IDs, journal IDs, product IDs, raw documents, session fields, or token fields.
[x] Summary response does not expose score-like fields such as score, grade, rating, riskLevel, healthRating, severity, or medicalStatus.
[x] Copy avoids diagnosis, treatment, causation, product effectiveness, product harm, stress causation, routine causation, and skin scoring claims.
[x] Validation passes before marking DONE.
```

### Known Limitations

```txt
Routine not_configured status is based on whether the user has any configured routine.
Product mention checklist counts only resolved visible product mentions, not hidden or unresolved product identifiers.
Checklist thresholds describe data availability only and are not medical thresholds or quality scores.
Production smoke was not rerun for v1.21; local validation passed.
```

### Suggested Version

```txt
v1.21 - Insight Explainability & Tracking Quality Checklist
```

## 7H. P2 - Production Deployment & Smoke Verification

### Goal

Verify that the v1.22 release actually works in the deployed production environment.

### Status

```txt
v1.22.1 - Production Deployment & Smoke Verification: NOT DONE
Local validation for v1.22.1: PASS
Production URL public reachability: PASS
Production /api/health: PASS
Authenticated MVP production smoke: NOT CHECKED
Production signals: NOT CHECKED
```

### Scope

- Verify production URL reachability.
- Verify production `/api/health`.
- Record local validation rerun.
- Record production smoke result truthfully.
- Record production signal checks truthfully.
- Keep historical/user-reported production evidence separate from v1.22.1 direct verification.

### Current Result

```txt
Direct public production checks passed for the landing URL and /api/health.
Full production smoke remains incomplete because browser/OAuth/Vercel/MongoDB Atlas access was unavailable to the coding assistant.
```

### Acceptance Criteria

```txt
[x] Local validation rerun is recorded.
[x] Production URL public reachability is recorded.
[x] Production /api/health result is recorded.
[x] Authenticated production flows are not marked PASS without being checked.
[x] Production signals are not marked PASS without being checked.
[ ] Google OAuth login checked in production.
[ ] Dashboard after login checked in production.
[ ] Main authenticated MVP flows checked in production.
[ ] Browser console/network checked in production.
[ ] Vercel build/function logs checked.
[ ] MongoDB Atlas signal checked.
```

### Suggested Version

```txt
v1.22.1 - Production Deployment & Smoke Verification
```

## 7I. P2 - Account Data Deletion Workflow Hardening

### Goal

Harden the existing user app-data deletion workflow so it is safer, clearer, better tested, and better documented without expanding MVP scope.

### Status

```txt
v1.23 - Account Data Deletion Workflow Hardening: DONE
Validation for v1.23: PASS
Manual browser deletion smoke: NOT CHECKED
Production deletion verification: NOT CHECKED
```

### Scope

- Reviewed existing Settings delete app data UI.
- Reviewed `DELETE /api/account/app-data`.
- Confirmed the API requires authentication and resolves the current user server-side.
- Confirmed the deletion use case receives only the server-resolved current user id.
- Confirmed repository deletion filters target only current-user app data.
- Hardened destructive confirmation copy and action labels.
- Added tests for malicious client-provided `userId` values, user isolation, sensitive response boundaries, and no client deletion body.
- Added data control/deletion documentation and v1.23 release evidence.

### Acceptance Criteria

```txt
[x] Delete app data confirmation UX reviewed and clarified.
[x] Delete API requires authentication.
[x] Delete API scopes deletion to the current authenticated user.
[x] Delete API ignores client-provided userId values.
[x] User cannot delete another user's data.
[x] Shared product and ingredient catalogue data are not deleted.
[x] Delete response does not expose sensitive data.
[x] Error response does not expose stack trace or database internals.
[x] Unit/API contract tests pass.
[x] Repository deletion tests pass.
[x] Settings UI/client tests pass.
[x] Required local validation passes before marking DONE.
```

### Known Limitations

```txt
Manual browser deletion smoke was not performed.
Production deletion verification was not performed.
v1.22.1 authenticated production smoke and production signal checks remain PARTIAL / DEFERRED.
```

### Suggested Version

```txt
v1.23 - Account Data Deletion Workflow Hardening
```

## 8. P3 - Admin / Content Management

### Goal

Make product and ingredient data easier to maintain without editing seed files manually.

### Candidate Tasks

- Add admin-only product list.
- Add admin-only product create/edit forms.
- Add admin-only ingredient list.
- Add admin-only ingredient create/edit forms.
- Add admin access guard.
- Add audit-friendly validation for content changes.

### Risks

This is larger than UX polish because it touches access control and content-writing flows.

### Acceptance Criteria

```txt
[ ] Admin routes are protected.
[ ] Normal users cannot access admin pages.
[ ] Product/ingredient edits validate input.
[ ] No secret or privileged data is exposed to users.
[ ] Existing public catalogue behavior is preserved.
```

### Suggested Version

```txt
Future optional admin/content candidate (unversioned)
```

## 9. P3 - Real AI Provider Integration

### Goal

Optionally connect a real AI provider while preserving strict fallback and validation behavior.

### Candidate Tasks

- Add provider adapter behind existing AI abstraction.
- Add timeout handling.
- Add output validation before display.
- Add fallback to deterministic/mock response on provider failure.
- Add safe logging without storing private prompts or secrets.
- Add rate limiting if needed.

### Safety Rules

```txt
No clinical assessment.
No treatment guarantee.
No prescription guidance.
No skin scoring.
No face/image analysis.
No raw unvalidated AI output displayed directly.
```

### Acceptance Criteria

```txt
[ ] App still works if AI provider fails.
[ ] AI output is validated before display.
[ ] API keys are not committed.
[ ] Fallback path is tested.
[ ] User-facing copy remains educational and safe.
```

### Suggested Version

```txt
Future optional real provider integration candidate (unversioned)
```

## 10. P4 - Portfolio Assets

### Goal

Improve external presentation without changing product behavior.

### Candidate Tasks

- [x] Create central Portfolio Evidence Package document.
- [x] Add CV/resume-ready project summary.
- [x] Add recruiter/interview narrative.
- [x] Add screenshot and demo-video capture plan.
- [ ] Capture 8-10 screenshots.
- [ ] Add a short demo video.
- [ ] Add architecture diagram if needed for a portfolio page.
- [ ] Add README screenshot section only after actual screenshots exist.

### Status

```txt
Portfolio Evidence Package documentation: PREPARED
Actual screenshots: NOT VERIFIED in repository
Demo video: NOT RECORDED in repository
Not a blocker for product correctness or post-MVP development
```

## 11. Not Recommended Right Now

Do not start these until the smaller post-MVP backlog is stable:

```txt
Marketplace
Cart
Checkout
Payment
Public reviews/ratings
Notifications
Image upload
Face/skin analysis
Skin/face scoring
Medical treatment recommendation
Large architecture rewrite
```

These items either increase product risk, safety risk, or implementation complexity beyond the current MVP direction.

## 12. Recommended Next Task

The recommended next task is:

```txt
TBD / Backlog grooming
```

Reason:

- v1.25.1 seed baseline consistency hotfix passed scoped local validation with lint, typecheck, and unit tests.
- v1.25 first-session guided experience polish remains preserved.
- v1.26 Product Match clarity polish passed scoped local validation with lint, typecheck, and unit tests.
- v1.27 Product Detail to Saved Products decision-support polish passed scoped local validation with lint, typecheck, and unit tests.
- v1.26 is a follow-up polish pass; historical v1.15 Product Match Explainability & Safety Guardrails remains the original explainability implementation milestone.
- v1.27 is a follow-up polish pass after v1.26; it improves Product Detail save-decision guidance and Saved Products empty-state clarity without adding product scope.
- v1.25 improved dashboard onboarding guidance without adding new product scope.
- v1.24 seed implementation and closeout documentation now reflect 70 products and 70 ingredients.
- v1.24 seed quality tests enforce the 70/70 baseline and passed after a test-timeout stabilization.
- v1.24 remains deferred and cannot be closed as DONE because `npm run build` and `npm run test:e2e` timed out in the current environment.
- v1.22.1 full production smoke remains partial/deferred and should not be claimed as PASS.
- The previous admin/content candidate remains future optional backlog scope.
- The previous optional real-provider candidate remains future optional backlog scope.
- Portfolio screenshots and demo video are intentionally skipped and remain optional media evidence.

## 13. v1.13 Completion Checklist

```txt
[x] Review main routes for missing loading states.
[x] Review main routes for weak empty states.
[x] Review form pages for unclear validation copy.
[x] Review API failure states in client components.
[x] Add next-action CTAs where useful.
[x] Keep copy concise and skincare-focused.
[x] Run lint/typecheck/test/build/e2e.
[x] Update docs/ai-coding/06-current-sprint-plan.md for v1.13 completion.
```

## 14. Decision Log

```txt
2026-06-04: Created post-MVP backlog after MVP v1.11 portfolio demo readiness.
2026-06-04: Portfolio screenshots/demo polish recorded as optional evidence work.
2026-06-04: Recommended next development task was v1.13 UX Polish & Empty State Improvement.
2026-06-04: Completed v1.13 UX Polish & Empty State Improvement with local lint/typecheck/test/build/E2E PASS.
2026-06-05: Synchronized documentation status so v1.13 is latest completed and v1.14 Data Quality Expansion is the next recommended product task.
2026-06-05: Completed v1.14 Data Quality Expansion with 58 products, 59 ingredients, seed quality assertions, and local validation PASS.
2026-06-06: Completed v1.15 Product Match Explainability & Safety Guardrails with local lint/typecheck/test/build/E2E/audit PASS; Portfolio Evidence Package remains the next presentation task.
2026-06-06: Completed v1.15.1 Audit Cleanup & Evidence Sync with production npm audit PASS, confirmed shadcn/MCP/hono dependency path, no package changes, and synchronized evidence docs.
2026-06-07: Prepared Portfolio Evidence Package documentation with recruiter summary, CV/resume copy, demo run of show, media capture plan, and explicit evidence boundaries; screenshots and demo video remain optional media tasks.
2026-06-08: Completed v1.16 Saved Product Comparison & Decision Support with lint/typecheck/test/build/E2E/audit PASS; sandboxed build and E2E hit spawn EPERM, then passed outside the sandbox. Moved the prior release/observability candidate out of the v1.16 slot.
2026-06-08: Started v1.17 Routine History & Weekly Progress Review as the active product-improvement sprint; release/observability polish remains a future optional evidence candidate.
2026-06-08: Completed v1.17 Routine History & Weekly Progress Review with node/npm/lint/typecheck/test/build/E2E/audit PASS; sandboxed build and E2E hit spawn EPERM, then passed outside the sandbox.
2026-06-08: Started v1.18 Skin Journal Filters & Reflection Review as the active product-improvement sprint; the prior admin/content candidate is now future optional and unversioned.
2026-06-08: Completed v1.18 Skin Journal Filters & Reflection Review with node/npm/lint/typecheck/test/build/E2E/audit PASS; sandboxed build and E2E hit spawn EPERM, then passed outside the sandbox.
2026-06-08: Started v1.19 Account Data Summary & Privacy Control Review as the active privacy/data-control sprint; optional real-provider integration remains future optional and unversioned.
2026-06-08: Completed v1.19 Account Data Summary & Privacy Control Review with node/npm/lint/typecheck/test/build/E2E/audit PASS; sandboxed build and E2E hit spawn EPERM, then passed outside the sandbox.
2026-06-09: Completed v1.20 Personal Insight Review & Safe Trend Cards with node/npm/lint/typecheck/test/build/E2E/audit PASS; sandboxed build and E2E hit spawn EPERM, then passed outside the sandbox. The first outside-sandbox E2E rerun exposed a strict duplicate-disclaimer locator, which was fixed before final E2E PASS.
2026-06-09: Completed v1.21 Insight Explainability & Tracking Quality Checklist with lint/typecheck/test/build/E2E/audit PASS; sandboxed build and E2E hit spawn EPERM, then passed outside the sandbox. The first outside-sandbox E2E rerun exposed a duplicate safe-disclaimer locator, which was fixed before final E2E PASS.
2026-06-11: Completed v1.22 Production Observability & Release Confidence with safe public /api/health, health API contract test, release evidence, production incident note template, and monitoring/checklist updates. Required local validation passed; sandboxed build and E2E hit spawn EPERM, then passed outside the sandbox. Production smoke was not performed.
2026-06-11: Started v1.22.1 Production Deployment & Smoke Verification. Local validation passed, public production URL returned HTTP 200, and production /api/health returned HTTP 200 with the expected v1.22 contract. Full production smoke remains NOT DONE because authenticated browser/OAuth checks and Vercel/MongoDB Atlas production signal checks were unavailable.
2026-06-11: Completed v1.23 Account Data Deletion Workflow Hardening with clearer destructive confirmation copy, user-isolation API/repository tests, sensitive-response checks, data-control documentation, and required local validation PASS. Manual browser deletion smoke and production deletion verification were not performed.
2026-06-11: Attempted v1.24 Seed Data Quality Expansion Round 2 closeout. Confirmed 70 products and 70 ingredients, created v1.24 release evidence, updated seed data/status docs, and stabilized one slow UI foundation import test timeout. `npm run lint`, `npm run typecheck`, `npm run test`, and `npm audit --omit=dev --audit-level=moderate` passed. `npm run build` and `npm run test:e2e` timed out in the current Node 22/npm 10 environment, so v1.24 remains NOT DONE.
2026-06-11: Completed v1.25 First-Session Guided Experience Polish with clearer dashboard onboarding step guidance, a first-incomplete-step "Bước nên làm tiếp theo" block, onboarding helper tests, and scoped local validation PASS for `npm run lint`, `npm run typecheck`, and `npm run test`. Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.25. v1.24 remains deferred and validation-blocked.
2026-06-11: Completed v1.25.1 Seed Baseline Regression & Documentation Consistency Hotfix. Restored `scripts/seed.ts` and `tests/unit/seed-data-quality.test.ts` to the v1.24 70/70 baseline, restored missing `docs/release-evidence-v1.24.md`, preserved v1.25 dashboard/onboarding UX polish, and kept v1.24 NOT DONE / VALIDATION BLOCKED. Scoped validation PASS: `npm run lint`, `npm run typecheck`, and `npm run test`. Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.25.1.
2026-06-11: Completed v1.26 Product Match Explanation Clarity & Safe Decision Support Polish as a follow-up to v1.15. Improved Product Match explanation labels, product-fit score wording, safety note visibility, no-profile guidance, and result-card next-action copy without changing matching score/ranking, seed data, schema, auth, AI, or API contracts. Scoped validation PASS: `npm run lint`, `npm run typecheck`, and `npm run test`. Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.26. v1.24 remains deferred and validation-blocked.
2026-06-11: Completed v1.27 Product Detail to Saved Products Decision Support Polish as a follow-up to v1.26. Improved Product Detail summary and safety labels, save/unsave helper copy, after-save next actions, Saved Products empty-state guidance, and safe reference wording without changing Product Match scoring/ranking, Routine logic, seed data, schema, auth, AI, or API contracts. Scoped validation PASS: `npm run lint`, `npm run typecheck`, and `npm run test`. Build, E2E, manual browser verification, production verification, screenshots, and demo video were not run or created for v1.27. v1.24 remains deferred and validation-blocked.
```
