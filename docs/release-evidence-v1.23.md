# Release Evidence - v1.23 Account Data Deletion Workflow Hardening

## 1. Release Summary

| Field | Value |
|---|---|
| Version | v1.23 |
| Release type | Post-MVP privacy and data-control hardening |
| Date | 2026-06-11 |
| Branch | main |
| Commit hash | NOT AVAILABLE inside this pre-commit evidence file; starting HEAD before v1.23 changes was `af432f6` |
| Production URL | https://skinwise-vn.vercel.app candidate from README; v1.23 production deletion smoke NOT CHECKED |
| Release owner | TODO |

Do not treat the production URL as v1.23 deletion verification. No production deletion smoke check was performed for this evidence file unless explicitly recorded below.

## 2. Scope

### Included

* Review existing delete app data flow.
* Harden deletion confirmation UX where needed.
* Harden delete API behavior where needed.
* Verify authenticated ownership boundary.
* Add or improve deletion tests.
* Verify post-deletion empty states where possible.
* Add data control/deletion documentation.
* Update source-of-truth/status docs.

### Excluded

* Google account deletion.
* OAuth provider account deletion.
* Admin CRUD.
* Real AI provider.
* Payment/checkout.
* Image upload.
* Skin scoring.
* Medical/treatment advice.
* Marketplace/order workflow.
* Database schema change unless absolutely necessary.
* New collections not already present in the codebase.
* Full redesign of settings or dashboard.

## 3. Implementation Notes

| Area | Notes |
|---|---|
| UI files changed | `src/modules/settings/components/settings-data-control-center.tsx` strengthened destructive confirmation copy and action labels. |
| API/server files changed | No route behavior change required; `DELETE /api/account/app-data` already resolves the current user server-side and ignores client-controlled identity. |
| Repository/use-case files changed | No repository/use-case behavior change required; existing deletion filters are scoped by authenticated `userId`. |
| Test files changed | `tests/unit/delete-account-app-data-api-contract.test.ts`, `tests/unit/account-data-repository.test.ts`, `tests/unit/settings-ui.test.ts`, and `tests/unit/settings-client.test.ts`. |
| Docs changed | `docs/data-control-and-deletion.md`, `docs/release-evidence-v1.23.md`, and status documentation. |
| Behavior changes | User-facing deletion copy now explicitly states irreversibility and the non-deletion boundary for Google/OAuth, shared catalogue data, and other users' data. |

## 4. Deletion Boundary

### Deleted

* Current user's skin profile records.
* Current user's saved product records.
* Current user's routine records.
* Current user's routine log records.
* Current user's routine analysis records.
* Current user's skin journal records.

### Reset

* Existing app user profile is preserved.
* `onboardingCompleted` is reset to `false` when the current user's app profile exists and onboarding was completed.

### Not Deleted

* Google account.
* OAuth provider account.
* OAuth provider configuration.
* Auth.js account/session/verification-token data.
* Global product catalogue data.
* Global ingredient library data.
* Shared catalogue data.
* Other users' data.
* Production configuration.
* Release/audit documentation.

### Ownership Enforcement

`DELETE /api/account/app-data` requires authentication, resolves the current user with the existing server-side auth helper, and calls the deletion use case with only `currentUser.id`.

The route does not need a `Request` parameter because it does not read request body or query identity values. Tests prove that a malicious `userId` in a request body/query is ignored and the use case is still called only with the server-resolved authenticated user id.

## 5. Local Validation

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | PASS | ESLint completed successfully on 2026-06-11. |
| `npm run typecheck` | PASS | TypeScript completed with `tsc --noEmit` on 2026-06-11. |
| `npm run test` | PASS | Vitest passed: 103 test files / 992 tests on 2026-06-11. |
| `npm run build` | PASS | Sandboxed run compiled successfully then failed with `spawn EPERM`; outside-sandbox rerun passed on 2026-06-11. |
| `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; outside-sandbox rerun passed: 31/31 Playwright tests on 2026-06-11. |
| `npm audit --omit=dev --audit-level=moderate` | PASS | 0 vulnerabilities on 2026-06-11. |

Focused pre-validation check:

```txt
npm run test -- tests/unit/delete-account-app-data-api-contract.test.ts tests/unit/account-data-repository.test.ts tests/unit/settings-ui.test.ts tests/unit/settings-client.test.ts
Result: PASS - 4 files / 28 tests
```

## 6. Manual Verification

| Area | Result | Notes |
|---|---|---|
| Delete confirmation experience | NOT CHECKED | Source copy and UI tests updated; browser manual check not performed. |
| Cancel deletion | NOT CHECKED | Browser manual check not performed. |
| Confirm deletion | NOT CHECKED | Browser manual check not performed. |
| Loading state during deletion | NOT CHECKED | Source behavior exists; browser manual check not performed. |
| Success state after deletion | NOT CHECKED | Source behavior exists; browser manual check not performed. |
| Error state when deletion fails | NOT CHECKED | API/client tests cover safe error handling; browser manual check not performed. |
| Post-deletion dashboard state | NOT CHECKED | Browser manual check not performed. |
| Post-deletion skin profile state | NOT CHECKED | Browser manual check not performed. |
| Post-deletion saved products state | NOT CHECKED | Browser manual check not performed. |
| Post-deletion routine state | NOT CHECKED | Browser manual check not performed. |
| Post-deletion journal state | NOT CHECKED | Browser manual check not performed. |
| Post-deletion insights state | NOT CHECKED | Browser manual check not performed. |
| Settings page after deletion | NOT CHECKED | Browser manual check not performed. |
| Data export after deletion | NOT CHECKED | Browser manual check not performed. |
| Browser console | NOT CHECKED | Browser manual check not performed. |
| Browser network tab | NOT CHECKED | Browser manual check not performed. |

Local tests do not count as manual browser verification. Production verification was not performed for v1.23.

## 7. Security and Privacy Check

| Check | Result | Notes |
|---|---|---|
| Auth required | PASS | API contract tests cover unauthenticated rejection. |
| User isolation verified | PASS | Route and repository tests verify server-resolved user id and user-scoped filters. |
| No arbitrary `userId` deletion | PASS | DELETE route does not read client identity values. |
| Malicious client-provided `userId` ignored | PASS | API contract test passes hostile body/query `userId` and verifies the use case receives only `currentUser.id`. |
| No other-user data deletion | PASS | Repository tests verify delete filters target only the authenticated user id and not another user id. |
| No secret exposure | PASS | API response tests include sensitive-string checks. |
| No token exposure | PASS | API response tests include token-sensitive checks. |
| No raw database URI exposure | PASS | API response tests include database URI checks. |
| No OAuth credential exposure | PASS | API response tests include OAuth credential checks. |
| No raw database document exposure | PASS | DELETE response returns DTO counts, not raw documents. |
| No private user data in logs/docs | PASS | Docs avoid private data and raw production evidence. |
| No raw stack trace exposure in UI/API responses | PASS | Error response test verifies generic error output without stack or database internals. |

## 8. Final Decision

| Field | Value |
|---|---|
| v1.23 status | DONE |
| Final decision | PASS WITH NOTES |
| Known blockers | None for local implementation. Manual browser checks and production deletion smoke were not performed. |
| Manual browser verification | NOT CHECKED |
| Production verification | NOT CHECKED |
| Next recommended task | v1.24 - Seed Data Quality Expansion Round 2 |

Decision rules:

* Use PASS only if implementation, tests, docs, and required local validation are complete.
* Use PASS WITH NOTES if implementation and validation pass but there are non-blocking notes, such as manual browser checks not being fully available.
* Use NOT CHECKED if implementation cannot be verified because validation or manual checks were not run.
* Use FAIL if a critical blocker remains.
* Do not mark PASS unless implementation, tests, and validation are actually complete.
* Do not claim production verification unless production was actually checked.
