## Scope

- [ ] This change matches the current sprint plan.
- [ ] No out-of-scope MVP feature was added.
- [ ] No new public API route was added unless defined in `docs/05-api-contract.md`.
- [ ] No new database model was added unless defined in `docs/04-data-model.md`.
- [ ] No business logic was added directly to `page.tsx` or `route.ts`.

## Architecture

- [ ] Route handlers are thin and delegate to use cases.
- [ ] Use cases contain orchestration logic.
- [ ] Repositories handle persistence only.
- [ ] Domain rules remain deterministic and testable.
- [ ] DTO mappers convert database documents to API-safe responses.
- [ ] API responses do not expose raw MongoDB `ObjectId`.

## Security

- [ ] Auth is checked where required.
- [ ] Ownership is checked for user-owned resources.
- [ ] `userId` comes from server session, not request body.
- [ ] Input is validated with Zod.
- [ ] Secrets are not exposed in client code.
- [ ] AI provider is not called from client code.

## AI Safety

- [ ] Rule engine runs before AI where applicable.
- [ ] AI output is validated before use.
- [ ] AI failure fallback is implemented where applicable.
- [ ] No medical diagnosis or treatment guarantee is introduced.

## Tests

- [ ] Unit tests added/updated when logic changed.
- [ ] Integration tests added/updated when API behavior changed.
- [ ] E2E tests added/updated when user flow changed.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.

## Docs

- [ ] `docs/ai-coding/02-implementation-status.md` updated.
- [ ] `docs/ai-coding/03-feature-status-matrix.md` updated.
- [ ] `docs/ai-coding/05-ai-change-log.md` updated.
- [ ] New or changed architecture decisions are recorded in `docs/adr/`.
