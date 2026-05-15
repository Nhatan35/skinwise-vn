# 02-implementation-status.md

# Implementation Status — SkinWise VN MVP v1.2.6

Last updated: 2026-05-15

## 1. Current phase

```txt
TASK-RA-001 Routine Analysis API rate limiting implemented
```

The SDD v1.2.6 final freeze is complete. Week 1 Tasks 1-7 initialized the Next.js App Router foundation, shadcn/ui tooling, shared UI foundation, package scripts, base folder structure, feature flag config, Zod environment validation, MongoDB infrastructure, Auth.js foundation, protected dashboard shell, and `GET /api/me` with lazy AppUserProfile creation. Week 2 delivered the Skin Profile API, onboarding UI, onboarding flow integration, and protected `/skin-profile` view/edit route. Week 3 Task 1 implemented the Routine API foundation. Week 3 Task 2 implemented the protected `/routines` UI foundation. Week 3 Task 3 implemented the domain-only Routine Safety Engine foundation. Week 3 Task 4 implemented the Routine Analysis API foundation. Week 3 Task 5 implemented the Routine Analysis UI foundation inside the existing `/routines` page. TASK-RA-001 implemented MongoDB-backed per-user rate limiting for `POST /api/routines/[id]/analyze` using `routine_analysis:${userId}`, 10 requests per 60 minutes, `RATE_LIMITED` 429 responses, and `Retry-After`. The analysis UI calls the existing API routes with `fetch`, sends no client-owned analysis data, reads `body.data.analyses` for history, and displays only API-provided DTO fields. Product picker, Product module, Ingredient module, real AI provider integration, external LLM/API calls, Journal, Routine Logs, dashboard data integration, skin score, image upload, and medical diagnosis were not implemented.

## 2. Completed documentation

```txt
[x] Product vision
[x] PRD
[x] User stories
[x] System architecture
[x] Data model
[x] API contract
[x] AI contract
[x] Security and privacy rules
[x] Test plan
[x] Release plan
[x] Project structure
[x] Routine safety rules
[x] Prompt files
[x] Source-of-truth index
[x] Week 1 implementation plan
[x] UI route map
[x] Seed data spec
[x] Use case and repository contract
[x] AI fallback policy
[x] Vietnamese copy guidelines
[x] Deployment checklist
[x] AI coding context pack
[x] v1.2.5 consistency hotfix before Week 1 implementation
[x] v1.2.6 final freeze and engineering execution guardrails
[x] Engineering Execution Checklist
[x] ADR records
[x] PR checklist template
[x] CI template
[x] Week 1 Task 1 prompt
```

## 3. Completed code

```txt
[x] Next.js project initialized
[x] TypeScript configured
[x] Tailwind configured
[x] shadcn/ui initialized
[x] Base folder structure created
[x] Environment validation implemented
[x] MongoDB helper implemented
[x] Auth.js foundation implemented
[x] Protected dashboard shell implemented
[x] GET /api/me lazy AppUserProfile foundation implemented
[x] Test setup implemented
[x] Feature flag config implemented
[x] Database index script implemented
[x] CI exists in implementation repo
[x] Basic package scripts configured
[x] Shared UI foundation components implemented
[x] Skin Profile API foundation implemented
[x] Foundation stabilization patch implemented
[x] Skin Profile onboarding UI implemented
[x] Skin Profile onboarding flow integration implemented
[x] Skin Profile view/edit route implemented
[x] Routine API foundation implemented
[x] Routine Builder UI foundation implemented
[x] Routine Safety Engine foundation implemented
[x] Routine Analysis API foundation implemented
[x] Routine Analysis UI foundation implemented
[x] Routine Analysis API per-user rate limiting implemented
```

## 4. In progress

```txt
None
```

## 5. Not started

```txt
Product module
Ingredient module
RoutineLog module
SkinJournal module
AI provider abstraction
Ingredient explanation API
Dashboard data integration
Deployment setup
```

## 6. Known gaps

```txt
MongoDB helper and index definitions exist, but `npm run db:indexes` has not been run against a real database in this task because it requires MONGODB_URI. Real environments must run it to ensure the `rate_limits` unique key and TTL indexes.
Protected `/dashboard` shell exists, but it intentionally renders placeholder cards only and does not call business APIs or query dashboard data. It now exposes minimal navigation links to `/skin-profile` and `/routines`.
Skin Profile onboarding UI remains available at `/onboarding/skin-profile` for first-time onboarding, while `/skin-profile` is the main protected view/edit route.
Routine API CRUD exists for authenticated users, and `/routines` provides the UI foundation for listing, creating, editing, deleting, analyzing, and viewing analysis history for routines. Product picker, Product snapshot lookup/population, Routine Logs, and dashboard data integration are intentionally not implemented.
Routine Safety Engine exists as a deterministic foundation under `src/domain/routine-safety`; Week 3 Task 4 wires it into Routine Analysis API persistence and public DTO mapping only.
Routine Analysis API exists with deterministic fallback metadata only and now rate-limits authenticated analyze requests per user. It does not call OpenAI, LLM clients, external APIs, Product/Ingredient modules, dashboard, Journal, or RoutineLog features.
Routine Analysis UI exists only inside `/routines`; no `/routines/[id]`, `/routines/[id]/analysis`, or `/routines/[id]/analyses` UI routes were created.
Routine Analysis rate limiting uses the MongoDB `rate_limits` collection and requires `npm run db:indexes` to ensure the unique key and TTL indexes in real environments.
Optional `npm run test:e2e` reported the smoke test as `ok` during TASK-RA-001, but the command wrapper timed out waiting for the process to exit.
npm install reported 2 moderate audit vulnerabilities; npm audit fix --force was not run by task constraint.
`DELETE /api/skin-profile` does not reset `AppUserProfile.onboardingCompleted`; no reset behavior is specified for the current task.
```

## 7. Do not work on yet

```txt
Image upload
AI face analysis
Skin score
Marketplace
Affiliate monetization
Barcode scanner
Community feed
Push notifications
Subscription/payment
Admin review UI
Large-scale product crawling
```

## 8. Next recommended task

```txt
Continue only with the next explicitly scoped task after review.
```

Recommended next coding task:

```txt
Prepare the next explicitly scoped task after review. Do not begin Product, Ingredient, real AI provider integration, Journal, Routine Logs, dashboard data integration, Product picker, skin score, image upload, or medical diagnosis without a new task.
```

## 9. Update rule

After each coding task, update:

```txt
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
```


## Final Freeze Cleanup

Final documentation cleanup completed for v1.2.6. Seed data spec now aligns with the canonical data model, README/release-plan version wording is corrected, and MongoDB Adapter client-sharing wording is clarified. Current implementation phase is tracked in section 1 above.
