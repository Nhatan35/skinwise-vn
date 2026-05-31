# Current Sprint Plan — SkinWise VN MVP Final Closeout

Last updated: 2026-05-31

## 1. Current phase

```txt
No active MVP sprint. SkinWise VN MVP final closeout is completed.
```

The SkinWise VN MVP has completed the core feature scope, release hygiene, CI/E2E stabilization, production verification, and final documentation closeout.

Current final status:

```txt
MVP core features: DONE
Release hygiene: DONE
CI MongoDB E2E support: DONE
Playwright E2E selector stabilization: DONE
Production verification: DONE
Screenshot capture: SKIPPED — not required for this submission
Final documentation closeout: DONE
MVP v1.3 final release documentation sync: DONE
```

Final release status:

```txt
SkinWise VN MVP — READY FOR PORTFOLIO / SUBMISSION
```

## 2. Latest completed tasks

```txt
MVP-RELEASE-HYGIENE-001 — Clean release package and rerun core validation: DONE
MVP-CI-FIX-001 — Add MongoDB service for GitHub Actions E2E and stabilize E2E selectors: DONE
MVP-PRODUCTION-VERIFY-001 — Verify production deployment, OAuth, MongoDB runtime, and core flows: DONE
MVP-FINAL-CLOSEOUT-001 — Final repository polish and release handoff: DONE
```

## 3. Final validation evidence

Latest local validation evidence:

```txt
npm ci: PASS
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS — 84 files / 777 tests
npm run build: PASS
npm audit --omit=dev --audit-level=moderate: PASS — 0 vulnerabilities
npm run db:indexes: PASS — 32 indexes ensured
npm run test:e2e: PASS — 28/28 tests
```

Validation summary:

```txt
Core quality checks: PASS
Database index validation: PASS
Authenticated E2E journey: PASS
Unauthenticated protected-route smoke coverage: PASS
Final MVP validation: PASS
```

## 4. Production verification status

Production verification is completed by the project owner.

Production status:

```txt
Vercel production deployment: PASS
Production URL: https://skinwise-vn.vercel.app
Production branch: main
Google OAuth production login: PASS
MongoDB production/demo read/write through authenticated flows: PASS
Protected route redirects: PASS
Authenticated MVP flows: PASS
Sign-out and post-sign-out protection: PASS
Runtime logs reviewed: PASS
```

Important note:

```txt
This is an MVP portfolio/demo deployment, not a full commercial production hardening claim.
```

## 5. Screenshot status

Screenshot capture is intentionally skipped.

```txt
Screenshot capture: SKIPPED — not required for this submission
```

The project is documented through:

```txt
Live demo
README
Portfolio case study
Demo script
Release checklist
Release notes
Release notes v1.3
Validation evidence
Production verification evidence
```

No further screenshot task is required for the current MVP submission.

## 6. Completed MVP implementation status

```txt
Week 1 Foundation: DONE
Week 2 Skin Profile, Product, and Ingredient backend foundation: DONE
Week 3 Routine Builder and RoutineLog: DONE
Week 4 Routine Safety Engine and Routine Analysis: DONE
Week 5 AI provider abstraction, mock AI provider, validated AI provider, and Ingredient Explanation API: DONE
Week 6 Skin Journal, Dashboard enhancement, Product Catalogue UI, and Product Detail UI: DONE

Ingredient Library UI: DONE
Saved Products: DONE
Today Routine Checklist: DONE
Settings and Privacy Data Control Center: DONE
RoutineLog deletion: DONE
Core authenticated E2E journey coverage: DONE
Vietnamese UI/E2E selector stabilization: DONE
CI MongoDB E2E support: DONE
Production verification: DONE
Final release documentation: DONE
```

## 7. Completed deployment and release goals

```txt
[x] Confirm local env files are ignored and not tracked.
[x] Confirm .env.example uses placeholders only.
[x] Document production environment variables.
[x] Document MongoDB Atlas and Google OAuth production setup.
[x] Update runtime baseline to Node 24.x / npm 11.x.
[x] Create clean release package excluding secrets and generated artifacts.
[x] Run local validation commands.
[x] Execute Vercel production deployment.
[x] Configure production environment variables in Vercel.
[x] Configure/test Google OAuth production callback.
[x] Verify MongoDB production/demo access from Vercel.
[x] Run production smoke test.
[x] Add root .gitattributes for line-ending normalization.
[x] Prepare portfolio case study.
[x] Prepare demo script.
[x] Prepare final release checklist.
[x] Prepare release notes v1.0.
[x] Prepare release notes v1.3.
[x] Polish README as portfolio entry point.
[x] Add unauthenticated Playwright smoke tests.
[x] Add authenticated Playwright E2E coverage.
[x] Add deterministic local/test E2E seed support.
[x] Add GitHub Actions MongoDB service for E2E.
[x] Run local E2E successfully with 28/28 tests.
[x] Mark screenshot capture as skipped because it is not required.
[x] Complete final documentation closeout.
```

## 8. Not allowed in the final MVP scope

```txt
No unrelated product feature.
No Product CRUD.
No admin review workflow.
No public sharing of saved products.
No cart, checkout, marketplace, payment, likes, ratings, reviews, or recommendation algorithm.
No image upload.
No AI face analysis.
No skin score.
No diagnosis.
No marketplace.
No payment/subscription.
No real AI provider completion claim without implementation and verification.
No full commercial production hardening claim.
```

## 9. Post-MVP v1.3 final release task

Current post-MVP task:

```txt
MVP-v1.3-FIX-002 - Final Release Documentation Sync
```

Scope:

```txt
Synchronize final release, portfolio, demo, deployment, changelog, release notes, and AI coding status documentation.
Record latest known validation evidence for Node v24.14.0 / npm 11.14.1.
Confirm Product Match and Insights are documented as completed.
Keep scope documentation-only; no Product Match logic, API shape, database schema, or UI behavior change.
Run validation under Node 24.x / npm 11.x when possible.
```

Status:

```txt
Implementation: Existing application behavior preserved.
Tests: Existing Product Match and Insights coverage preserved.
Documentation: Final release docs synchronized for v1.3.
Production-ready decision: PASS for the latest known validated MVP environment.
Environment baseline: Node 24.x / npm 11.x required.
```

Validation:

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

Safety boundaries:

```txt
No skin score.
No diagnosis.
No medication or treatment guarantee.
No face or image analysis.
No product-causality claim.
No external AI provider.
No Mongoose, schema migration, or recommendation collection.
No cart, checkout, marketplace, payment, likes, ratings, reviews, or product CRUD.
```

Recently completed Post-MVP v1.3 tasks:

```txt
MVP-v1.3-001 - Personalized Product Match: DONE
POST-MVP-v1.3-INSIGHTS - Skin Progress Insights & Calendar hardening: DONE
```

## 10. Known MVP limitations

```txt
AI provider remains mock/fallback-safe for MVP.
Real OpenAI/Gemini provider integration is not implemented.
Image upload is out of scope.
AI face analysis is out of scope.
Marketplace/payment/subscription is out of scope.
Admin Product/Ingredient CRUD is out of scope.
Production monitoring/error tracking is not part of the MVP closeout.
Product catalogue data is demo/seed-style catalogue data.
Medical diagnosis is out of scope.
```

## 11. Recommended next task

There is no required product-feature task for MVP submission.

```txt
Required MVP tasks: NONE
Current status: FINAL DONE
Next recommended task: GitHub Release & Portfolio Submission
```

Optional post-MVP tasks, only if continuing development:

```txt
POST-MVP-001 — Real AI provider integration
POST-MVP-002 — Admin Product/Ingredient CRUD
POST-MVP-003 — Data export and hard-delete account flow
POST-MVP-004 — Monitoring and error tracking
POST-MVP-005 — Image upload
POST-MVP-006 — Portfolio website publishing
```

Recommendation:

```txt
Do not open post-MVP feature work until the GitHub release and portfolio submission are completed.
```

## 12. Update rule

After any future post-MVP coding task, update:

```txt
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/final-release-checklist.md
docs/release-notes-v1.3.md
```

For the current MVP release, this sprint plan is final.
