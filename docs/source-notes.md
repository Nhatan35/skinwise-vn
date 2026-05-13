# Source Notes

This SDD v1.2.6 continues to use the following public documentation references inherited from the v1.2.2/v1.2.3 verification work:

- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Next.js dynamic route segments: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- Auth.js environment variables: https://authjs.dev/guides/environment-variables
- Auth.js MongoDB Adapter: https://authjs.dev/getting-started/adapters/mongodb
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OWASP API1:2023 Broken Object Level Authorization: https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/

These references support architecture choices around App Router route handlers, dynamic route segments, Auth.js `AUTH_*` environment variable convention, MongoDB Adapter strategy, structured AI JSON outputs, and object ownership checks.


## v1.2.2 verification notes

The v1.2.2 hotfix aligns the SDD with:

- Next.js Route Handlers using `route.ts` inside the `app` directory.
- Auth.js `AUTH_*` environment variable convention.
- Auth.js MongoDB Adapter using an application-provided shared MongoClient or client provider.
- OpenAI Structured Outputs for JSON Schema adherence.
- OWASP API1:2023 Broken Object Level Authorization guidance.


## v1.2.3 polish note

The v1.2.3 update is documentation polish only. It corrects version labels, heading numbering, SkinJournal conflict behavior, RoutineLog upsert behavior, and finalizes the SDD for Week 1 Implementation Plan.


## v1.2.4 source-of-truth note

The v1.2.4 update adds AI coding source-of-truth and implementation-readiness documents. It does not add new MVP product features. It prepares the repository for Week 1 implementation by adding source priority, codebase map, implementation status, feature matrix, file ownership, current sprint plan, AI fallback behavior, seed data spec, UI route map, deployment checklist, and `.env.example`.


## v1.2.5 consistency hotfix note

The v1.2.5 update is a consistency hotfix before implementation. It does not add new MVP features. It aligns Auth.js route ownership, canonical API error codes, MVP role enum, SkinJournal image-field scope, Auth.js / NextAuth v5-compatible installation guidance, and SkinJournal PATCH contract details.

Additional Auth.js verification notes:

- Auth.js recommends an `auth.ts` setup and `/app/api/auth/[...nextauth]/route.ts` route handler that exports `GET` and `POST` from Auth.js handlers.
- Auth.js supports `AUTH_*` environment variable inference and requires `AUTH_SECRET` for secure deployments.
- The MongoDB Adapter must receive a shared MongoClient or client provider from the app's database helper, following the official Auth.js MongoDB Adapter guidance. Do not create a new MongoClient per request.


## v1.2.6 final freeze note

The v1.2.6 update is the final SDD freeze before Week 1 implementation.

It does not add product features. It adds engineering execution guardrails:

- Engineering Execution Checklist;
- ADR records;
- PR checklist;
- CI template;
- DTO/API boundary rules;
- `/api/me` lazy AppUserProfile creation decision;
- repeatable database index script rule;
- feature flag guidance;
- structured logging guidance;
- Week 1 Task 1 prompt.

This update prepares the project for controlled AI-assisted implementation.


## v1.2.6 final documentation cleanup note

A final cleanup pass aligns `docs/14-seed-data-spec.md` with `docs/04-data-model.md`, updates README and release-plan wording from v1.2.5 to v1.2.6, and softens MongoDB Adapter wording so the intent is clear: use a shared MongoDB client/client provider and never create a new `MongoClient` per request.

This cleanup does not add product features, change architecture, or expand MVP scope.
