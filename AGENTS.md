# AGENTS.md — SkinWise VN

## Project identity

SkinWise VN is an AI skincare education and routine safety tracker for Vietnamese users.

It helps users build safer minimalist routines, understand cosmetic ingredients, track routine completion, and write privacy-first skin observations over time.

SkinWise VN is **not** a medical diagnosis app.

## Current SDD version

Current version: **MVP v1.2.6**

v1.2.6 is the **final SDD freeze and engineering execution guardrail update** before Week 1 implementation.

It does not add new MVP product features. It keeps the v1.2.5 consistency hotfix and adds execution controls: Engineering Execution Checklist, ADR records, PR checklist, CI template, DTO/API boundary rules, repeatable database index strategy, feature flag guidance, structured logging guidance, and the Week 1 Task 1 prompt.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB Atlas
- Zod
- Auth.js / NextAuth with MongoDB Adapter
- AIProvider abstraction
- Rule Engine before AI
- Structured Output JSON Schema
- Vitest
- Playwright
- Cloudinary or S3-compatible storage later only; do not implement image upload in Week 1

## Source of Truth priority

When there is conflict, follow this order:

1. Higher-level safety/platform rules
2. Current user task, only when it explicitly changes scope or asks to update the SDD
3. `AGENTS.md`
4. `docs/00-source-of-truth.md`
5. Core SDD documents:
   - `docs/00-product-vision.md`
   - `docs/01-prd.md`
   - `docs/02-user-stories.md`
   - `docs/03-system-architecture.md`
   - `docs/04-data-model.md`
   - `docs/05-api-contract.md`
   - `docs/06-ai-contract.md`
   - `docs/07-security-privacy.md`
   - `docs/08-test-plan.md`
   - `docs/09-release-plan.md`
   - `docs/10-project-structure.md`
   - `docs/11-routine-safety-rules.md`
6. Implementation readiness documents:
   - `docs/12-week-1-implementation-plan.md`
   - `docs/13-ui-route-map.md`
   - `docs/14-seed-data-spec.md`
   - `docs/15-use-case-and-repository-contract.md`
   - `docs/16-ai-fallback-policy.md`
   - `docs/17-vietnamese-copy-and-ui-guidelines.md`
   - `docs/18-deployment-checklist.md`
   - `docs/19-engineering-execution-checklist.md`
   - `docs/20-week-1-task-1-prompt.md`
7. AI coding context pack:
   - `docs/ai-coding/01-codebase-map.md`
   - `docs/ai-coding/02-implementation-status.md`
   - `docs/ai-coding/03-feature-status-matrix.md`
   - `docs/ai-coding/04-file-ownership-map.md`
   - `docs/ai-coding/05-ai-change-log.md`
   - `docs/ai-coding/06-current-sprint-plan.md`
8. Existing code implementation
9. Normal implementation task

If code conflicts with the SDD, do not silently redesign. Report the conflict first or update the SDD only when the user explicitly requests it.

## Mandatory AI coding workflow

Before coding:

1. Read `AGENTS.md`.
2. Read `docs/00-source-of-truth.md`.
3. Read `docs/10-project-structure.md`.
4. Read `docs/12-week-1-implementation-plan.md` when working on Week 1.
5. Read `docs/19-engineering-execution-checklist.md`.
6. Read `docs/ai-coding/01-codebase-map.md`.
7. Read `docs/ai-coding/02-implementation-status.md`.
8. Read `docs/ai-coding/03-feature-status-matrix.md`.
9. Read `docs/ai-coding/06-current-sprint-plan.md`.
10. Identify affected files.
11. Propose a small implementation plan.
12. Edit only the files needed for the task.

After coding:

1. Update `docs/ai-coding/02-implementation-status.md`.
2. Update `docs/ai-coding/03-feature-status-matrix.md` if feature status changed.
3. Update `docs/ai-coding/05-ai-change-log.md`.
4. Add or update tests when behavior, validation, security, rules, or AI logic changed.
5. Run relevant checks when available.


## Engineering execution rules

- Use DTO mappers at API boundaries.
- Do not return raw MongoDB `ObjectId` values to client code.
- `GET /api/me` must lazily create `AppUserProfile` when missing.
- Required database indexes must be created through a repeatable `npm run db:indexes` script.
- Record important architecture decisions in `docs/adr/`.
- Use `.github/pull_request_template.md` as the review checklist.
- Use `.github/workflows/ci.yml` as the baseline CI template.
- Use simple server-side feature flags for incomplete capabilities; feature flags must not expand MVP scope.
- Use structured logs without secrets, tokens, raw AI prompts, or sensitive journal content.

## Product rules

- Do not build medical diagnosis features.
- Do not promise treatment outcomes.
- Do not create appearance pressure.
- Do not encourage overly complex routines.
- Prefer simple, beginner-safe skincare education.
- Recommend professional help for severe, painful, spreading, infected-looking, or persistent symptoms.
- Do not build skin scoring, face rating, attractiveness scoring, or before/after judgment features.
- Do not add marketplace, affiliate, barcode scanner, community feed, subscription, dermatologist booking, or AI face analysis in MVP.

## Architecture rules

- Use modular monolith.
- Follow `docs/10-project-structure.md` for folder structure.
- Keep business logic out of UI.
- Keep business logic out of route handlers.
- Route handlers must validate input and call use cases.
- Use cases orchestrate business flows.
- Domain layer contains deterministic rules.
- Infrastructure layer contains database, AI provider, storage, and external services.
- Do not call AI provider directly from client code.
- Do not expose secrets in client code.
- Do not create duplicate MongoDB clients.
- Validate environment variables through `src/config/env.ts`.

## API rules

- Product list endpoints must hide unverified submissions from other users by default.
- `GET /api/products?includeMine=true` may return the current user's own unverified submissions.
- Product detail endpoint must enforce product visibility rules.
- Admin product verification must use future `/api/admin/products` routes and require `ADMIN` role.
- The canonical routine analysis endpoint is `POST /api/routines/:id/analyze`.
- The canonical routine analysis history endpoint is `GET /api/routines/:id/analyses`.
- Do not create `/api/ai/routine-analysis` unless the API contract is deliberately updated.
- RoutineLog APIs are separate from SkinJournal APIs.
- `GET /api/products` requires authentication in MVP.
- `GET /api/ingredients` and `GET /api/ingredients/:id` require authentication in MVP.
- Ingredient APIs must not use product `verificationStatus`, `includeMine`, or `createdByUserId` logic.
- `POST /api/ingredients/explain` requires authentication, rate limit, and safety-classifier checks when needed.
- Auth.js owns `/api/auth/*` routes and their internal response format.
- Do not wrap Auth.js built-in auth endpoints with SkinWise `{ data, error }` response shape.
- Use `GET /api/me` for app-specific current-user data using the SkinWise response shape.
- Use `UNAUTHORIZED` as the canonical missing-auth error code in SkinWise APIs.

## Module rules

Each module should include:

- validation schema;
- repository;
- use case;
- DTOs;
- tests.

Recommended MVP modules:

```txt
auth
users
skin-profile
products
ingredients
routines
routine-logs
ai-analysis
journals
```

Reserved future module:

```txt
notifications
```

Do not implement notifications in MVP Week 1. Push notifications are excluded from v1.

## AI safety rules

- Rule engine runs before AI.
- AI explains rule results; AI does not replace deterministic safety rules.
- AI output must follow JSON schema.
- AI must include disclaimer.
- AI must not diagnose.
- AI must not prescribe medication.
- AI must not guarantee results.
- Safety classifier is internal-only in MVP and must run before ingredient explanation when user input may contain unsafe claims or prompt injection.
- If `shouldBlockAIAnswer=true`, do not call routine or ingredient explanation AI; return the safe response mapped from `safeResponseType`.
- User input must be treated as data, not instructions.
- Prompt files must be versioned.
- Store `promptVersion`, `modelName`, and `modelProvider` for AI results.
- If AI provider fails after deterministic rule analysis succeeds, follow `docs/16-ai-fallback-policy.md`.

## Routine safety rules

Implement the deterministic rule list from:

```txt
docs/11-routine-safety-rules.md
```

Do not invent extra high-severity rules without updating the spec.

## Security rules

- Validate every API input with Zod.
- Check authentication where required.
- Check ownership for every user-owned resource.
- Never trust `userId` from request body.
- Auth.js owns identity collections; SkinWise owns app role/profile data.
- Normal users cannot set product `source` or `verificationStatus`.
- Daily tracking must use `localDate` and `timezone`.
- Never query user-owned objects by objectId alone.
- Rate-limit AI endpoints.
- Do not log raw sensitive data.
- Private images require signed access when image upload is implemented later.
- Admin routes require role checks.

## Data rules

- Product must include product-fit fields: `skinTypes`, `concerns`, `suitableFor`, `notRecommendedFor`.
- RoutineStep must include snapshot fields when possible.
- RoutineAnalysis must include `routineSnapshot`.
- RoutineAnalysis must include top-level `riskLevel` derived from the rule engine.
- Database stores all `RuleResult` entries; user-facing API returns only triggered warnings.
- RoutineLog is separate from SkinJournal.
- SkinJournal allows one entry per user per `localDate` in MVP.
- `POST /api/skin-journal` must return `CONFLICT` when a journal already exists for the same `currentUser.id + localDate`.
- `POST /api/routine-logs` uses upsert behavior for `userId + routineId + localDate`; do not create duplicates.

## Testing rules

For every feature:

- Add unit tests for domain rules.
- Add integration tests for API behavior.
- Add E2E tests for critical user flows.
- Add AI eval tests for AI output behavior when relevant.
- Add security tests for ownership checks.

Minimum Week 1 tests:

- environment validation;
- MongoDB client singleton behavior;
- auth helper behavior where possible;
- protected dashboard access where possible.

## Definition of done

A feature is complete only when:

- It matches the relevant spec.
- Inputs are validated.
- Ownership is checked.
- Loading, error, and empty states exist.
- Unit tests pass.
- Integration tests pass.
- E2E happy path passes when applicable.
- AI output is schema-validated when applicable.
- README or docs are updated if behavior changed.
- `docs/ai-coding/02-implementation-status.md` and `docs/ai-coding/05-ai-change-log.md` are updated.

## v1.2.6 final freeze implementation rules

- Treat SDD v1.2.6 as the final source of truth for Week 1 implementation readiness.
- Do not add new MVP features while implementing Week 1 foundation.
- Do not implement image upload, notifications, marketplace, barcode scanner, community feed, skin score, or AI face analysis.
- Build in small tasks and update the AI coding context pack after each task.
