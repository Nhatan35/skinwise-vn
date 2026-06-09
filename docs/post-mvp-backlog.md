# SkinWise VN Post-MVP Backlog

Last updated: 2026-06-09

## 1. Current Stable Baseline

```txt
Stable MVP release: v1.11-final-mvp / v1.11-portfolio-demo-ready
Post-MVP backlog planning: v1.12 - DONE
Previous post-MVP implementation: v1.13 - UX Polish & Empty State Improvement: DONE
Data quality implementation: v1.14 - Data Quality Expansion: DONE
Product explainability implementation: v1.15 - Product Match Explainability & Safety Guardrails: DONE
Latest completed milestone: v1.20 - Personal Insight Review & Safe Trend Cards: DONE
Current active milestone: None
MVP core scope: COMPLETE
Portfolio demo readiness: COMPLETE
Current phase: Post-MVP controlled improvement
Recommended next task: Portfolio Evidence Package media capture
Local validation: PASS
Production smoke/monitoring: PASS, user-reported
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video
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
| P2 | Release/observability polish | Future optional release evidence candidate | Improves production confidence and debugging when deliberately scoped. |
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

### Candidate Tasks

- Add a simple production smoke-test result template.
- Record deployment id, commit hash, and test date in docs after each release.
- Add manual browser Console/Network checklist.
- Add Vercel function-log checklist.
- Add MongoDB Atlas monitoring checklist.
- Add a standard incident note template.

### Acceptance Criteria

```txt
[ ] Release evidence is repeatable.
[ ] Production issues can be recorded consistently.
[ ] No secrets are copied into docs.
[ ] User-reported evidence and tool/log evidence are clearly separated.
```

### Suggested Version

```txt
Future optional release evidence candidate (unversioned)
```

### Current Note

```txt
v1.15.1 completed audit/dependency-risk and documentation evidence sync only.
This broader release/observability polish item remains a future optional task and is not started.
v1.17 is now used for Routine History & Weekly Progress Review.
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
Portfolio Evidence Package media capture
```

Reason:

- v1.20 Personal Insight Review & Safe Trend Cards is complete and locally validated.
- The previous admin/content candidate has been moved out of the v1.18 slot and remains future optional scope.
- The previous optional real-provider candidate has been moved out of the v1.19 slot and remains future optional scope.
- The next low-risk task should capture optional screenshots/demo evidence rather than adding another product feature immediately.

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
```
