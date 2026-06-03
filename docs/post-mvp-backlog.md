# SkinWise VN Post-MVP Backlog

Last updated: 2026-06-04

## 1. Current Stable Baseline

```txt
Stable MVP release: v1.11-final-mvp / v1.11-portfolio-demo-ready
Current planning sprint: v1.12 - Post-MVP Backlog Planning
MVP core scope: COMPLETE
Local validation: PASS
Production smoke/monitoring: PASS, user-reported
Portfolio screenshots/demo polish: intentionally skipped for now
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
4. Do not add medical diagnosis, treatment claims, prescription advice, skin score, or face/image analysis.
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
| P1 | UX polish and empty states | Do first | Makes the existing MVP easier to use without risky architecture changes. |
| P1 | Error/loading/helper copy | Do first | Improves confidence during demo and real use. |
| P2 | Data quality expansion | Do after UX polish | Makes Product Match and Ingredient Library feel more realistic. |
| P2 | Release/observability polish | Do after UX polish | Improves production confidence and debugging. |
| P3 | Admin/content management | Optional | Useful only if product/ingredient content will grow. |
| P3 | Real AI provider integration | Optional, high control needed | Valuable, but requires safety, cost, fallback, and validation controls. |
| P4 | Portfolio assets | Skipped for now | Useful for presentation, but intentionally not required at this stage. |

## 5. P1 - UX Polish & Empty State Improvement

### Goal

Improve the user experience of the existing app without changing core business logic.

### Candidate Tasks

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
You have not saved any products yet.
Browse the product catalogue and save products you want to compare later.
CTA: Browse products
```

Routine empty state:

```txt
No routine created yet.
Create a morning or evening routine to start tracking your skincare habits.
CTA: Create routine
```

Journal empty state:

```txt
No journal entries yet.
Add your first skin journal entry to track how your skin feels over time.
CTA: Add journal entry
```

Error state:

```txt
We could not load your skincare data.
Please refresh the page or try again later.
```

### Acceptance Criteria

```txt
[ ] Existing app routes still work.
[ ] First-time users have clear next actions.
[ ] Empty states are not blank or confusing.
[ ] Error messages are user-friendly and not overly technical.
[ ] Loading copy feels specific to the page.
[ ] No database schema change.
[ ] No auth/business-rule change.
[ ] Existing tests pass.
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

### Candidate Tasks

- Add more curated skincare products.
- Add more ingredients.
- Improve category coverage.
- Add better skin concern tags.
- Review ingredient benefit/risk explanations.
- Improve seed data naming consistency.
- Add source notes for curated educational data where appropriate.

### Acceptance Criteria

```txt
[ ] Seed script still runs successfully.
[ ] Product catalogue loads correctly.
[ ] Product detail pages still work.
[ ] Product Match still works with expanded data.
[ ] Ingredient library and ingredient detail still work.
[ ] No unsafe medical claims are added.
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
v1.15 - Release Evidence & Observability Polish
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
v1.16 - Admin Content Management Foundation
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
No diagnosis.
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
v1.17 - Optional Real AI Provider Integration
```

## 10. P4 - Portfolio Assets

### Goal

Improve external presentation. This is intentionally skipped for now, but can be resumed later.

### Candidate Tasks

- Capture 8-10 screenshots.
- Add a short demo video.
- Add architecture diagram.
- Add README screenshot section.
- Add CV-ready project summary.

### Status

```txt
SKIPPED for now by user decision.
Not a blocker for post-MVP development.
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
Skin score
Medical treatment recommendation
Large architecture rewrite
```

These items either increase product risk, safety risk, or implementation complexity beyond the current MVP direction.

## 12. Recommended Next Task

The next implementation task should be:

```txt
v1.13 - UX Polish & Empty State Improvement
```

Reason:

- It improves the current MVP immediately.
- It has low technical risk.
- It does not require schema changes.
- It makes first-time user flows clearer.
- It prepares the app for stronger post-MVP work later.

## 13. v1.13 Starter Checklist

```txt
[ ] Review main routes for missing loading states.
[ ] Review main routes for weak empty states.
[ ] Review form pages for unclear validation copy.
[ ] Review API failure states in client components.
[ ] Add next-action CTAs where useful.
[ ] Keep copy concise and skincare-focused.
[ ] Run lint/typecheck/test/build/e2e.
[ ] Update docs/ai-coding/06-current-sprint-plan.md for v1.13 when starting implementation.
```

## 14. Decision Log

```txt
2026-06-04: Created post-MVP backlog after MVP v1.11 portfolio demo readiness.
2026-06-04: Portfolio screenshots/demo polish intentionally skipped for now.
2026-06-04: Recommended next development task is v1.13 UX Polish & Empty State Improvement.
```
