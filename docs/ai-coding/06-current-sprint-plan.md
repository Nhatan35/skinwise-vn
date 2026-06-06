# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-06

## 1. Current Phase

```txt
Post-MVP controlled improvement
```

Status:

```txt
Product implementation: COMPLETE at MVP level
Stable baseline: v1.11-final-mvp / v1.11-portfolio-demo-ready
Post-MVP backlog: CREATED in v1.12
UX polish implementation: DONE in v1.13
Data quality expansion: DONE in v1.14
Product Match explainability and safety guardrails: DONE in v1.15
Latest completed milestone: MVP v1.15 - Product Match Explainability & Safety Guardrails
Recommended next task: Portfolio Evidence Package
Database/schema changes in v1.15: NONE
Auth/authorization changes in v1.15: NONE
Persistence changes in v1.15: NONE
AI-provider changes in v1.15: NONE
```

MVP v1.15 is a controlled post-MVP product improvement milestone. It improves Product Match and Product Detail explainability, caution wording, and profile guidance without adding a new feature area or changing database persistence.

## 2. Objective

Improve Product Match and Product Detail decision support while preserving:

```txt
Core MVP behavior
Database persistence behavior
Authentication and authorization behavior
Existing Product Match API routes
Routine safety rules
AI provider abstraction and fallback behavior
Portfolio/demo readiness
```

## 3. Completed v1.15 Scope

```txt
[x] Audited existing Product Match scoring, explanation helpers, UI, Product Detail decision support, and tests.
[x] Added matched skin type detail to generated Product Match DTOs as an additive optional client field.
[x] Improved Product Match explanation copy for matched skin type, selected concerns, ingredient/attribute signals, usage, and uncertainty.
[x] Improved Product Match caution notes for exfoliating acids, multiple exfoliating acids, retinoid/BPO-style strong actives, fragrance/essential oils, sensitive skin, and dry/barrier-prone caution signals.
[x] Improved Product Detail decision support for good-fit, caution, routine usage, and data-quality/uncertainty guidance.
[x] Improved no-profile and unknown-profile guidance without changing SkinProfile schema.
[x] Added focused unit coverage for v1.15 explainability and safety behavior.
[x] Ran required local validation before marking the milestone DONE.
```

## 4. Non-Goals

```txt
No medical diagnosis.
No clinical advice or clinician-level recommendation.
No skin image upload.
No skin score.
No admin panel.
No marketplace, payment, cart, checkout, notification, review, or rating flow.
No database schema, collection, index, or persistence behavior change.
No auth or authorization logic change.
No route contract change beyond additive generated DTO explanation detail.
No real AI provider integration.
No large recommendation engine rewrite.
No production smoke rerun claim for this sprint.
```

## 5. Validation Evidence

Local validation from v1.15:

```txt
Evidence date: 2026-06-06
Environment: Local Windows / PowerShell
Branch: main
npm ci: PASS
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 899 tests
npm run build: PASS
npm run test:e2e: PASS - 29/29 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

Validation notes:

```txt
Sandboxed npm ci, build, and E2E attempts failed with spawn EPERM.
The same commands passed when rerun outside the sandbox.
E2E global setup seeded the local test database with the expanded v1.14 seed data.
Production smoke and monitoring were not rerun for v1.15.
```

Production verification from the stable baseline:

```txt
Production URL: https://skinwise-vn.vercel.app
Production smoke test: PASS - user-reported manual verification completed for the stable MVP baseline
Production monitoring: PASS - user-reported checks completed for the stable MVP baseline
Critical blockers reported: None
Evidence date: 2026-06-04
```

## 6. Post-MVP Priority Direction

Recommended order after v1.15:

```txt
P2 - Product and ingredient data quality: DONE in v1.14
P2 - Product Match explainability and safety guardrails: DONE in v1.15
P4 - Portfolio assets: Recommended next presentation/evidence task
P2 - Production observability/release confidence: Future controlled task
P3 - Admin/content management: Optional future task
P3 - Optional real AI provider integration: Optional high-control future task
```

## 7. Next Recommended Task

```txt
Portfolio Evidence Package
```

Reason:

```txt
The product is portfolio/demo ready at MVP level after v1.15. The next practical step is presentation evidence: screenshots, demo video, and CV/portfolio case-study polish. These are not product correctness blockers.
```

## 8. Suggested Commit

```bash
git add .
git commit -m "feat: improve product match explanations and safety guidance"
git push
```
