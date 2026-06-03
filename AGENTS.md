# AGENTS.md — SkinWise VN

## 1. Project identity

SkinWise VN is a skincare routine tracker and educational MVP for Vietnamese users.

The app helps users:

- build and manage skincare routines;
- create and update a personal skin profile;
- browse skincare products and product details;
- understand cosmetic ingredients;
- receive AI-assisted ingredient explanations through a provider abstraction;
- analyze routine safety using deterministic skincare rules;
- track routine completion through routine logs;
- write privacy-first skin journal entries;
- view dashboard summaries.

SkinWise VN is **not** a medical diagnosis app.

The product must not:

- diagnose skin diseases or medical conditions;
- prescribe medication;
- guarantee treatment outcomes;
- replace advice from a licensed dermatologist or healthcare professional;
- create appearance pressure;
- rate attractiveness, skin quality, face quality, or before/after appearance.

---

## 2. Current project phase

Current phase:

```txt
MVP v1.8.2 - Final Documentation Consistency Hotfix
```

The main MVP implementation and MVP v1.8 product release are completed.

Known implementation status:

- Week 1 — Foundation: completed.
- Week 2 — Skin Profile, Product, and Ingredient backend foundation: completed.
- Week 3 — Routine Builder and RoutineLog: completed.
- Week 4 — Routine Safety Engine and Routine Analysis: completed.
- Week 5 — AI provider abstraction, mock AI provider, validated AI provider, and Ingredient Explanation API: completed.
- Week 6 — Skin Journal, Dashboard enhancement, Product Catalogue UI, and Product Detail UI: completed.

Latest completed product release:

```txt
MVP v1.8 - Insights Usability & Progress Story Refinement
```

Completed documentation cleanup patch:

```txt
MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup - DONE
```

Latest documentation consistency hotfix:

```txt
MVP v1.8.2 - Final Documentation Consistency Hotfix - DONE
```

Recommended next task:

```txt
MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
```

MVP core scope is completed and the product is ready for portfolio/demo/interview use as an MVP. Production smoke test evidence is NOT RUN until manually verified, production monitoring evidence is PENDING until manually verified, and a full validation rerun remains NOT RUN for v1.8.2 unless actually executed.

---

## 3. Important status correction

Some older documentation may still describe the project as:

- before Week 1 implementation;
- Week 1/Foundation only;
- dashboard not implemented;
- journal not implemented;
- product catalogue UI not implemented;
- product detail UI not implemented;
- current sprint is `LOCAL-AUTH-DB-001`;
- SDD v1.2.6 final freeze before Week 1 implementation;
- `/journal` not implemented;
- `/api/skin-journal` not implemented;
- dashboard route planned only;
- no dashboard behavior implemented.

These statements are historical and may be outdated.


Any older statement that describes `SDD v1.2.6` as `final` or `frozen` for Week 1 readiness is historical. For the current post-Week-6 phase, `SDD v1.2.6` is a reference document only and is not immutable.

If the current user task explicitly asks to update documentation, specs, SDD notes, or implementation scope, follow the current task while still respecting higher-level safety, security, and platform rules.

For the current post-Week-6 phase, old SDD notes are historical planning artifacts. They may provide context, but they must not override the actual implemented code, current task scope, security rules, or product safety rules.

When working on cleanup, documentation synchronization, validation, deployment preparation, or portfolio readiness:

1. Inspect the actual source code first.
2. Treat current implementation as the factual source for docs synchronization.
3. Update outdated documentation instead of redesigning working implementation to match old planning documents.
4. Clearly mark old planning or SDD notes as historical if they are still useful.
5. Do not delete useful historical records unless explicitly requested.

---

## 4. Tech stack

SkinWise VN uses:

- Next.js App Router
- TypeScript
- MongoDB
- Auth.js / NextAuth
- Tailwind CSS
- Zod
- AI provider abstraction
- Mock AI provider for local/demo use
- Validated AI provider wrapper where implemented
- Deterministic routine safety rule engine
- Vitest or the existing project test setup
- Playwright only if real E2E setup exists in the repository
- Vercel as the likely deployment target, if deployment is prepared later

Do not assume a dependency, service, or external provider exists unless it is present in `package.json`, source code, or deployment configuration.

---

## 5. Decision priority and evidence priority

This section resolves conflicts between instructions, evidence, documentation, and implementation status.

The priority order below controls decision-making. It does not define the order in which files must be read.

### 5.1 Non-overridable rules

Always follow these first:

1. Higher-level safety, security, and platform rules.
2. Project safety and security rules in this file, including:
   - secret handling;
   - medical-safety boundaries;
   - ownership checks;
   - no overclaiming;
   - no fake deployment evidence;
   - no unsafe AI behavior.

The current user task, source code, documentation, SDD notes, or implementation convenience must not override these rules.

### 5.2 Current user task scope

The current user task has priority only for the explicit scope requested by the user.

Use the current task to decide:

- which task is being performed;
- which files are relevant;
- whether documentation, SDD notes, or implementation should be updated;
- whether the requested work changes the previous plan.

The current user task may update documentation, specs, SDD notes, or implementation only when it explicitly asks for that type of change.

The current user task must not be interpreted as permission to:

- bypass safety or security rules;
- expose secrets;
- weaken validation;
- redesign unrelated architecture;
- add unrelated features;
- claim unverified deployment or AI readiness.

### 5.3 Factual implementation evidence

When deciding what currently exists in the application, use this evidence order:

1. Actual source code implementation.
2. Actual package scripts and test setup in `package.json`.
3. Current environment validation logic, especially `src/config/env.ts`.
4. Current route handlers under `src/app/api`.
5. Current UI routes under `src/app`.
6. Current tests.
7. Current documentation files.
8. Historical planning documents and old SDD notes.

Important interpretation rules:

- `AGENTS.md` defines how to work on the repository. It does not prove that a feature is implemented.
- Actual source code is the factual source for current implementation status.
- For documentation sync, inspect the actual source code first and update outdated docs.
- For environment setup, inspect the actual environment validation schema before editing examples.
- For route/API documentation, inspect real `src/app` and `src/app/api` routes before updating docs.
- For package commands, inspect `package.json`; do not invent scripts.
- For validation, run available scripts only if they exist.
- If code and docs conflict, update docs unless the current user task explicitly asks to change implementation.
- Do not redesign working implementation to match outdated planning documents.

### 5.4 Historical SDD interpretation

Old SDD notes, including `SDD v1.2.6`, are historical planning/specification artifacts unless the current user task explicitly reactivates or updates them.

Do not treat old SDD wording such as `final`, `frozen`, or `source of truth` as blocking current task-driven documentation updates, implementation corrections, cleanup, validation, deployment preparation, or portfolio-readiness work.

If old SDD notes conflict with current source code, current docs-sync requirements, or the current task, prefer the current source code and current task scope while preserving useful historical context where appropriate.

---

## 6. Mandatory Codex workflow

This workflow defines the minimum inspection and editing process before changing files.

It is an operational checklist, not a source-of-truth priority list. Reading or inspecting `AGENTS.md` early does not make it higher priority than higher-level safety, security, platform rules, or explicit current task scope.

Before editing files:

1. Inspect repository structure.
2. Check current Git state:

```bash
git status --short
```

3. Inspect `package.json`.
4. Inspect actual app routes under `src/app`.
5. Inspect actual API routes under `src/app/api`.
6. Inspect environment validation logic, especially:

```txt
src/config/env.ts
```

7. Inspect relevant modules, repositories, use cases, schemas, DTOs, and tests.
8. Identify the minimum affected files.
9. Create a small implementation plan.
10. Edit only files required for the current task.

After editing files:

1. Re-check changed files:

```bash
git status --short
git diff --stat
```

2. Review the actual diff.
3. Update documentation only when behavior/status changed or when the task is documentation sync.
4. Run the smallest relevant validation command when possible.
5. If a command cannot be run, mark it as `NOT RUN` and explain why.
6. If a command fails, identify the root cause before applying fixes.
7. Do not suppress, bypass, or hide failures.
8. Do not leave local-only secrets, generated artifacts, or temporary files in the final diff.

---

## 7. Global engineering rules

- Do not add new product features unless explicitly requested.
- Do not modify unrelated application logic.
- Do not refactor architecture unless strictly required to fix a validation issue.
- Do not remove tests just to make checks pass.
- Do not weaken TypeScript strictness.
- Do not bypass lint, typecheck, test, or build errors.
- Do not suppress errors without understanding the root cause.
- Keep changes minimal, safe, focused, and production-minded.
- Prefer factual updates over marketing language.
- Keep documentation professional and portfolio-friendly.
- Do not create fake deployment evidence.
- Do not claim deployment is complete unless there is real deployment evidence.
- Do not claim real OpenAI, Gemini, or production AI integration is complete unless it is actually implemented, configured, and verified.
- Do not change public API behavior unless the current task requires it.
- Do not rename files or move modules unless strictly necessary.
- Do not introduce large dependencies without explicit approval.
- Do not make broad formatting-only changes across unrelated files.

---

## 8. Security and secret-handling rules

Never print, expose, copy, commit, or document real secrets.

Sensitive values include:

- MongoDB connection strings;
- `MONGODB_URI`;
- `AUTH_SECRET`;
- `AUTH_GOOGLE_ID`;
- `AUTH_GOOGLE_SECRET`;
- Google OAuth Client ID;
- Google OAuth Client Secret;
- AI provider API keys;
- OpenAI keys;
- Gemini keys;
- deployment tokens;
- access tokens;
- private credentials;
- real database names, usernames, or passwords;
- production URLs that reveal private infrastructure when not intended for public docs.

Environment file rules:

- `.env.local` may exist locally.
- Never print `.env.local` values.
- Never copy `.env.local` values into docs, reports, tests, examples, screenshots, or final answers.
- Check whether `.env.local` is tracked with a safe command such as:

```bash
git ls-files .env.local
```

- If `.env.local` is tracked, remove it from Git tracking without deleting the local developer file when possible:

```bash
git rm --cached .env.local
```

- `.env.local` must not be included in Git commits.
- `.env.local` must not be included in shared zip/source packages.
- `.env.example` must contain placeholders only.
- Production secrets must be configured in the deployment provider dashboard.
- If secrets were pushed publicly, committed, uploaded, or shared externally, recommend rotating them.

Required `.gitignore` protection should include:

```txt
.env
.env.*
.env.local
.env*.local
.vercel
node_modules
.next
out
dist
build
coverage
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
```

Do not add real secrets to:

- README;
- documentation;
- `.env.example`;
- tests;
- seed files;
- screenshots;
- final reports;
- issue descriptions;
- pull request descriptions;
- commit messages.

---

## 9. Environment configuration rules

Environment variables must follow the actual source code validation schema.

Before editing `.env.example`, inspect the real schema first, especially:

```txt
src/config/env.ts
```

Likely variables may include:

```txt
APP_ENV
APP_BASE_URL
MONGODB_URI
AUTH_SECRET
AUTH_URL
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
AI_PROVIDER
AI_API_KEY
AI_MODEL
```

Important rules:

- Do not introduce `NEXTAUTH_URL` unless the source code actually supports or requires it.
- This project appears to use `AUTH_URL` and `APP_BASE_URL`; verify this in code before editing docs.
- Keep `.env.example` synchronized with actual validation logic.
- Use placeholders only in `.env.example`.
- Do not remove environment validation logic.
- Do not weaken environment validation to make commands pass.
- Do not print actual env values during validation.

Recommended local setup documentation:

```bash
cp .env.example .env.local
```

Then developers must fill real values locally.

For local/demo use, AI keys may be optional when:

```txt
AI_PROVIDER="mock"
```

If `AI_PROVIDER` is set to a real provider, require only the variables that the actual source code requires for that provider.

---

## 10. Product safety rules

- Do not build medical diagnosis features.
- Do not prescribe medication.
- Do not promise treatment outcomes.
- Do not create appearance pressure.
- Do not encourage overly complex routines.
- Prefer simple, beginner-safe skincare education.
- Recommend professional help for severe, painful, spreading, infected-looking, infected, or persistent symptoms.
- Do not add skin scoring, face rating, attractiveness scoring, or before/after judgment features.
- Do not add AI face analysis.
- Do not add marketplace, affiliate, barcode scanner, community feed, subscription, dermatologist booking, push notifications, or image upload unless explicitly approved as future scope.
- Use careful educational wording, not medical certainty.
- Avoid fear-based skincare language.
- Keep the tone supportive, factual, and beginner-friendly.

---

## 11. Architecture rules

- Use modular monolith architecture.
- Keep business logic out of UI components.
- Keep business logic out of route handlers.
- Route handlers validate input and call use cases/services.
- Use cases orchestrate business flows.
- Domain layer contains deterministic business and safety rules.
- Infrastructure layer contains database, AI provider, storage, and external services.
- Do not call AI providers directly from client code.
- Do not expose secrets in client code.
- Do not create duplicate MongoDB clients.
- Validate environment variables through the project environment config.
- Use DTO mappers at API boundaries where applicable.
- Do not return raw MongoDB `ObjectId` values to client code.
- Do not query user-owned documents by object ID alone.
- Keep ownership checks close to repository/use-case boundaries.
- Do not move business rules into React components.
- Do not duplicate validation schemas unnecessarily.
- Keep route handlers thin and predictable.

---

## 12. API rules

Auth and user identity:

- Auth.js owns `/api/auth/*` routes and their internal response format.
- Do not wrap Auth.js built-in auth endpoints with the SkinWise `{ data, error }` response shape.
- Use `/api/me` for app-specific current-user data.
- Use `UNAUTHORIZED` as the canonical missing-auth error code in SkinWise APIs when applicable.
- Never trust `userId` from request body.
- Always derive current user from the authenticated session.

General API rules:

- Validate every API input with Zod or the project’s existing validation approach.
- Check authentication where required.
- Check ownership for every user-owned resource.
- Return consistent app-level error responses where implemented.
- Do not leak internal stack traces to users.
- Do not expose raw database documents if DTOs are expected.
- Do not expose secrets, tokens, or private provider errors.

Product and ingredient APIs:

- Product visibility rules must be enforced by product APIs.
- Product list endpoints should hide unverified submissions from other users by default when that behavior exists.
- `GET /api/products?includeMine=true` may return the current user’s own unverified submissions if implemented.
- Product detail endpoint must enforce product visibility rules.
- Normal users must not set privileged product fields such as `source` or `verificationStatus`.
- Ingredient APIs must not use product-only logic such as `verificationStatus`, `includeMine`, or `createdByUserId` unless the implementation explicitly supports it.

Routine APIs:

- The canonical routine analysis endpoint is:

```txt
POST /api/routines/[id]/analyze
```

- The canonical routine analysis history endpoint is:

```txt
GET /api/routines/[id]/analyses
```

- Do not create `/api/ai/routine-analysis` unless the API contract is deliberately updated.
- RoutineLog APIs are separate from SkinJournal APIs.
- Routine logs should not create duplicate records for the same user/routine/local date if upsert behavior is intended.

Skin journal APIs:

- SkinJournal is separate from RoutineLog.
- SkinJournal should enforce the MVP rule of one journal entry per user per local date if that rule exists in implementation.
- Journal content is sensitive and must not be logged raw.

AI APIs:

- AI-related endpoints must be authenticated if the implementation requires it.
- AI-related endpoints should be rate-limited when required by implementation.
- AI output must be schema-validated where applicable.
- AI must not replace deterministic safety rules.

---

## 13. Module rules

Each major module should preferably include:

- validation schema;
- repository or data-access layer;
- use case/service;
- DTOs or response mappers;
- tests where applicable.

Likely MVP modules:

```txt
auth
users
skin-profile
products
ingredients
routines
routine-logs
routine-analysis
ai-analysis
skin-journal
dashboard
```

Reserved or future modules:

```txt
notifications
image-upload
admin
marketplace
community
```

Do not implement reserved/future modules unless explicitly requested.

---

## 14. AI integration rules

The project may include:

- AI provider interface;
- mock AI provider;
- validated provider wrapper;
- local/demo explanation flow;
- structured output validation;
- prompt versioning where implemented.

Do not claim production AI integration is complete unless a real provider is implemented, configured, and verified.

Use accurate wording:

```txt
AI provider abstraction implemented.
Mock provider available for local/demo use.
Real provider integration is deployment/configuration dependent.
Production AI integration not yet verified.
```

AI safety rules:

- Deterministic rule engine runs before AI for routine safety analysis.
- AI explains or formats results; AI does not replace deterministic safety rules.
- AI output must be schema-validated when applicable.
- AI must include appropriate disclaimers.
- AI must not diagnose.
- AI must not prescribe medication.
- AI must not guarantee results.
- User input must be treated as data, not instructions.
- Prompt injection must not override system/developer safety rules.
- Do not log raw AI prompts, raw sensitive journal content, tokens, or secrets.
- If the AI provider fails after deterministic rule analysis succeeds, return deterministic results and a safe fallback explanation where implemented.
- If the safety classifier blocks an AI response, do not call the AI provider; return the mapped safe response where implemented.

---

## 15. Routine safety rules

Routine safety analysis should rely on deterministic rules before AI.

Rules should be based on the project’s actual implementation and/or the specification file if present:

```txt
docs/11-routine-safety-rules.md
```

Do not invent extra high-severity rules without updating the spec.

Routine safety output should distinguish:

- deterministic rule warnings;
- risk level;
- triggered warnings;
- AI-generated explanation if available;
- fallback explanation if AI is unavailable.

AI may explain the result, but the deterministic rule engine owns the safety decision.

---

## 16. Data rules

Product data:

- Product data should include product-fit fields where implemented, such as:
  - `skinTypes`;
  - `concerns`;
  - `suitableFor`;
  - `notRecommendedFor`.
- Product detail UI should display only fields that actually exist and are safe to show.

Routine data:

- Routine steps should preserve product snapshot data where implemented.
- RoutineAnalysis should preserve enough routine snapshot data to make past analysis understandable where implemented.
- RoutineAnalysis should include top-level risk level derived from the rule engine where implemented.
- Database may store all rule results while user-facing API returns only triggered warnings if that is the implemented behavior.

RoutineLog and SkinJournal:

- RoutineLog is separate from SkinJournal.
- Daily tracking should use `localDate` and timezone-aware logic where implemented.
- `POST /api/routine-logs` may use upsert behavior for `userId + routineId + localDate`; do not create duplicates if this is the intended behavior.
- SkinJournal may allow one entry per user per `localDate` in MVP.
- `POST /api/skin-journal` should return a conflict response if a journal already exists for the same user/date where this rule exists.

Ownership:

- User-owned data must always be scoped by authenticated user ownership.
- Never query, update, or delete user-owned resources by object ID alone.

---

## 17. Documentation rules

When updating docs, keep them factual and synchronized with actual source code.

Important documentation targets may include:

```txt
README.md
docs/13-ui-route-map.md
docs/ai-coding/02-implementation-status.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
docs/18-deployment-checklist.md
```

README should accurately state:

- MVP v1.8 is the completed product release.
- MVP core scope is completed.
- MVP v1.8.1 is the completed documentation cleanup patch.
- MVP v1.8.2 is the latest completed documentation consistency hotfix.
- MVP v1.9 is the next recommended task.
- Portfolio/demo/interview readiness is achieved at MVP level.
- Production smoke test and monitoring/demo recovery evidence are pending unless actually verified.
- Real production AI provider integration is not verified unless actually verified.
- `.env.local` must not be committed or shared.

Route documentation should be generated from actual routes, not assumptions.

API documentation should be generated from actual route handlers, not assumptions.

Feature matrix categories should be:

```txt
Completed
Partially completed
Not started
Out of scope
```

Do not delete useful historical notes unnecessarily. Mark them as historical if they are no longer current.

---

## 18. Route documentation rules

When updating route documentation, inspect actual routes under:

```txt
src/app
```

Document UI routes that actually exist, such as:

```txt
/
 /dashboard
/onboarding/skin-profile
/skin-profile
/routines
/journal
/products
/products/[id]
```

Also document auth-related pages if present.

For each UI route, document:

- route path;
- purpose;
- implementation status;
- public/authenticated/onboarding classification;
- important data/API dependencies if obvious from code.

Do not document a route as implemented unless it exists in the source code.

Do not document a route as missing if it exists in the source code.

---

## 19. API documentation rules

When updating API documentation, inspect actual route handlers under:

```txt
src/app/api
```

Document API routes that actually exist, such as:

```txt
/api/auth/[...nextauth]
/api/dashboard
/api/me
/api/skin-profile
/api/products
/api/products/[id]
/api/ingredients
/api/ingredients/[id]
/api/ingredients/explain
/api/routines
/api/routines/[id]
/api/routines/[id]/analyze
/api/routines/[id]/analyses
/api/routine-logs
/api/skin-journal
/api/skin-journal/[id]
```

For each API route, document:

- route path;
- supported methods if clear from source;
- purpose;
- authentication requirement if clear from source;
- implementation status.

Do not guess methods. Inspect `route.ts` files.

---

## 20. UI copy rules

Visible UI copy must not imply outdated status.

Do not say or imply:

- the project is only Week 1/Foundation;
- dashboard is not implemented if it exists;
- journal is not implemented if it exists;
- products UI is only planned if it exists;
- product detail UI is only planned if it exists;
- implemented features are still only planned;
- deployment is complete without evidence;
- production AI integration is complete without verification.

Keep UI copy:

- concise;
- accurate;
- portfolio-friendly;
- non-medical;
- non-overclaiming;
- beginner-friendly.

Obvious files to inspect during UI copy cleanup:

```txt
src/app/page.tsx
src/app/(dashboard)/layout.tsx
```

Also inspect other route shell files if they contain outdated project status copy.

---

## 21. Testing and validation rules

Inspect `package.json` before running commands.

Important scripts may include:

```txt
dev
start
build
lint
typecheck
test
test:watch
test:ui
test:e2e
db:indexes
db:seed
```

Do not invent missing scripts.

Preferred validation order:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:indexes
npm run db:seed
npm run dev
```

Environment check must happen before database commands.

Environment validation rules:

- Confirm `.env.local` exists locally if local validation requires it.
- Confirm required variables are present.
- Do not print actual values.
- Follow actual source code schema.
- Do not require `NEXTAUTH_URL` unless source code requires it.

Database command safety:

- Only run `db:indexes` if environment is configured safely.
- Only run `db:seed` against a local/development database.
- Do not seed production databases.
- Do not print database URI.
- If database target looks unsafe or unclear, mark the command as `NOT RUN`.

`npm run dev` handling:

- Run only long enough to confirm local startup if possible.
- Do not leave an uncontrolled long-running process.
- If the environment does not support a long-running dev server, mark as `NOT RUN` or partially verified with reason.

E2E handling:

- If `test:e2e` exists, inspect whether real E2E test files and browser/runtime setup exist.
- Do not require E2E to pass unless E2E is actually implemented and configured.
- If E2E is not implemented or not configured, document it as a remaining risk or future task.

---

## 22. Manual smoke test checklist

When completing local validation, include manual smoke test checklist for:

```txt
/
 /dashboard
/onboarding/skin-profile
/skin-profile
/routines
/journal
/products
/products/[id]
```

Manual route checks should confirm:

- page loads;
- authenticated redirects work where required;
- loading states are acceptable;
- empty states are acceptable;
- error states are understandable;
- no outdated Week 1/Foundation copy appears;
- no medical overclaim appears.

Manual flow checklist should include:

- sign in with Google;
- view dashboard;
- create or update skin profile;
- complete onboarding skin profile if applicable;
- view product catalogue;
- search/filter products;
- open product detail page;
- create routine;
- add product to routine;
- analyze routine;
- view routine analysis result;
- log routine status;
- create journal entry;
- edit journal entry;
- delete journal entry.

If manual smoke test is not performed, mark it as:

```txt
NOT TESTED
```

and explain why.

---

## 23. Failure handling

If a command fails:

1. Read the error carefully.
2. Classify the failure:
   - dependency issue;
   - environment issue;
   - TypeScript issue;
   - lint issue;
   - test issue;
   - build issue;
   - database issue;
   - auth issue;
   - route/runtime issue.
3. Identify the root cause.
4. Apply or recommend the smallest safe fix.
5. Do not change unrelated files.
6. Do not suppress the error without understanding it.
7. Do not remove tests.
8. Do not weaken TypeScript or lint rules.
9. Re-run the smallest relevant command after a fix when possible.

Never turn off failing tests or checks just to produce a green report.

---

## 24. Deployment rules

Deployment is not complete unless there is real deployment evidence.

Do not claim deployment readiness unless:

- security cleanup is complete;
- `.env.example` is safe and current;
- `.env.local` is not tracked;
- docs are synchronized;
- lint passes;
- typecheck passes;
- tests pass or failures are understood and accepted;
- production build passes;
- deployment provider configuration is prepared;
- production environment variables are configured in the provider dashboard;
- the deployed app has been opened and smoke-tested.

For Vercel deployment preparation:

- Do not commit production secrets.
- Configure secrets in Vercel dashboard.
- Confirm required build command from `package.json`.
- Confirm output/build behavior from Next.js.
- Confirm MongoDB network access and connection safety.
- Confirm Auth.js callback URLs.
- Confirm Google OAuth authorized redirect URI.
- Confirm `APP_BASE_URL` and `AUTH_URL` match the deployed URL.
- Confirm `AI_PROVIDER` configuration.
- Use mock AI provider if real provider is not configured.
- Do not claim real provider integration is verified until tested.

---

## 25. Definition of done

A task is complete only when:

- It matches the requested scope.
- Changes are minimal and focused.
- No real secrets are exposed.
- No unrelated application logic is changed.
- Relevant docs are updated when status or behavior changed.
- Relevant tests/checks are run when possible.
- Commands that cannot be run are marked `NOT RUN` with reasons.
- Failures are clearly explained.
- Final report is factual and does not overclaim readiness.

A feature is complete only when:

- It matches the relevant spec or current implementation requirement.
- Inputs are validated.
- Ownership is checked where required.
- Loading, error, and empty states exist where relevant.
- Unit tests pass where applicable.
- Integration tests pass where applicable.
- E2E happy path passes when implemented and configured.
- AI output is schema-validated where applicable.
- README or docs are updated if behavior changed.
- Implementation status docs and change log are updated when the task requires them.

---

## 26. Final reporting rules

For cleanup, validation, deployment preparation, or portfolio-readiness tasks, final reports should include:

1. Executive Summary
2. Files Changed
3. Security Cleanup Summary
4. Documentation Sync Summary
5. Validation Report
6. Issues Found
7. Remaining Risks
8. Recommended Next Task
9. Final Readiness Decision

Validation report format:

```txt
- npm install: PASS / FAIL / NOT RUN
- env check: PASS / FAIL / NOT RUN
- npm run lint: PASS / FAIL / NOT RUN
- npm run typecheck: PASS / FAIL / NOT RUN
- npm run test: PASS / FAIL / NOT RUN
- npm run build: PASS / FAIL / NOT RUN
- npm run db:indexes: PASS / FAIL / NOT RUN
- npm run db:seed: PASS / FAIL / NOT RUN
- npm run dev: PASS / FAIL / NOT RUN
- Manual smoke test: PASS / FAIL / NOT TESTED
- E2E tests if present: PASS / FAIL / NOT RUN / NOT IMPLEMENTED
```

Issue table format:

```md
| Issue | Severity | Cause | Fix Applied / Recommended |
|---|---|---|---|
```

Severity must be one of:

```txt
Critical
High
Medium
Low
```

Final readiness decision must be exactly one of:

```txt
Ready for deployment
Almost ready for deployment
Not ready for deployment
```

Decision rules:

- Use `Ready for deployment` only when security cleanup is done, docs are synced, validation passes, and deployment configuration is ready.
- Use `Almost ready for deployment` when cleanup/docs are done and local validation mostly passes, but real deployment is not completed.
- Use `Not ready for deployment` when there are unresolved critical/high issues, exposed secrets, failing build/typecheck, or missing required environment setup.

---

## 27. Current recommended next task

After `MVP v1.8.2 - Final Documentation Consistency Hotfix`, the recommended next task is:

```txt
MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
```

Reason:

- MVP v1.8 is the completed product release.
- MVP core scope is portfolio/demo/interview ready at MVP level.
- Current production smoke test evidence is pending unless actually verified.
- Current production monitoring and demo recovery evidence are pending unless actually verified.
- MVP v1.9 should verify production behavior, environment variables, Auth.js callback URLs, MongoDB connectivity, Vercel logs, and demo recovery paths without adding new product scope.

---

## 28. Non-goals unless explicitly requested

Do not implement these unless the user explicitly asks and the scope is approved:

- new skincare recommendation engine;
- medical diagnosis;
- prescription guidance;
- image upload;
- AI face analysis;
- before/after image scoring;
- attractiveness scoring;
- skin scoring;
- marketplace;
- affiliate links;
- product purchasing;
- barcode scanner;
- dermatologist booking;
- community feed;
- push notifications;
- subscriptions;
- admin dashboard expansion;
- production monitoring platform;
- real AI provider integration beyond existing abstraction/configuration work;
- full E2E suite if not already configured.

---

## 29. Safe wording examples

Use this style in docs and final reports:

```txt
MVP v1.8 - Insights Usability & Progress Story Refinement is the completed product release.
MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup is the completed documentation cleanup patch.
MVP v1.8.2 - Final Documentation Consistency Hotfix is the latest completed documentation consistency hotfix.
MVP v1.9 - Production Monitoring & Demo Evidence Stabilization is the recommended next task.
SkinWise VN is ready for portfolio/demo/interview use as an MVP.
AI provider abstraction is implemented, with a mock provider available for local/demo use.
Production AI provider integration is deployment/configuration dependent and not verified unless explicitly tested.
Production smoke test evidence and monitoring/demo recovery evidence are pending unless actually verified and recorded.
```

Avoid this style:

```txt
The app is fully production-ready.
The AI integration is complete.
The project is deployed.
The dashboard is planned only.
The journal is not implemented.
The project is still in Week 1 Foundation.
```

---

## 30. Short operating principle

When unsure:

1. Inspect the real code.
2. Protect secrets.
3. Avoid overclaiming.
4. Make the smallest safe change.
5. Validate what changed.
6. Report facts clearly.
