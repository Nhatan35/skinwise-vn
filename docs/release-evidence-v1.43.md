# MVP v1.43 - Release Evidence & Validation Cleanup

## Purpose

MVP v1.43 standardizes the current release status, fresh local validation
evidence, npm audit status, E2E status, and portfolio/deployment evidence
boundaries for SkinWise VN.

This milestone does not add product features. It is a cleanup and evidence
milestone for portfolio demo, GitHub review, mentor review, and interview
discussion.

It does not claim production-ready status because no fresh production smoke
test was performed against the deployed URL during v1.43.

## Validation Environment

- Date: 2026-06-15T11:42:38.0550661+07:00
- OS: Microsoft Windows 10.0.26200
- Node: v24.14.0
- npm: 11.14.1
- Shell: PowerShell
- Workspace: `C:\projects\skinwise-vn`

## Scope

- README current status cleanup.
- Fresh validation run.
- npm audit verification.
- Build verification.
- E2E verification or documented limitation.
- Deferred item clarification.
- Docs consistency review.
- No product feature work.
- No business logic changes unless validation failures required a clear,
  safe fix.

## Validation Results

| Check | Command | Status | Notes |
|---|---|---|---|
| Install | `npm ci` | PASS | Initial sandboxed attempt failed with `spawn EPERM`; unsandboxed rerun installed 749 packages and completed. Install output reported 2 high severity vulnerabilities, but direct audit commands below returned 0 vulnerabilities. |
| Lint | `npm run lint` | PASS | ESLint completed successfully. |
| Typecheck | `npm run typecheck` | PASS | `tsc --noEmit` completed successfully. |
| Unit tests | `npm run test` | PASS | 110 test files / 1134 tests passed. |
| Build | `npm run build` | PASS | Sandboxed run compiled successfully then failed with `spawn EPERM`; unsandboxed rerun completed successfully. |
| E2E | `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; unsandboxed rerun passed 31 Playwright tests. |
| Audit | `npm audit` | PASS | `found 0 vulnerabilities`. |
| Production audit | `npm audit --omit=dev` | PASS | `found 0 vulnerabilities`. |

## Important Command Output

Environment:

```txt
node -v: v24.14.0
npm -v: 11.14.1
Date: 2026-06-15T11:42:38.0550661+07:00
OS: Microsoft Windows 10.0.26200
```

Install:

```txt
npm ci: sandboxed attempt FAIL - spawn EPERM
npm ci: unsandboxed rerun PASS
added 749 packages, and audited 750 packages in 45s
2 high severity vulnerabilities
```

Audit follow-up:

```txt
npm audit: PASS - found 0 vulnerabilities
npm audit --omit=dev: PASS - found 0 vulnerabilities
```

No `npm audit fix` was run because direct `npm audit` and
`npm audit --omit=dev` did not identify actionable vulnerabilities after the
install completed.

Unit tests:

```txt
Test Files  110 passed (110)
Tests       1134 passed (1134)
Duration    5.71s
```

Build:

```txt
npm run build: sandboxed attempt FAIL - compiled successfully, then spawn EPERM
npm run build: unsandboxed rerun PASS
Generated 20 static pages and completed route generation.
```

E2E prerequisites checked before full E2E:

```txt
MongoDB port check: 127.0.0.1:27017 reachable
Playwright version: 1.60.0
```

E2E:

```txt
npm run test:e2e: sandboxed attempt FAIL - spawn EPERM
db:seed connected database: skinwise-e2e-check
ingredients matched: 70
products matched: 70
Running 31 tests using 8 workers
31 passed (40.5s)
```

## Changes Made

- `README.md`: updated top-level current status, fresh validation table,
  production evidence boundary, deferred items, and release-history wording.
- `docs/release-evidence-v1.43.md`: created this release evidence file.
- Current status documents: synchronized v1.43 status, local validation
  evidence, production-smoke boundary, and deferred status.

No product feature, business logic, database schema, API contract, package,
environment schema, AI provider, scoring, routine safety, marketplace, image
upload, or medical-scope change was made for v1.43.

## Deferred Items

- Real OpenAI/Gemini provider integration: Deferred / not verified.
- Production smoke test on deployed URL for v1.43: Deferred / not verified.
- Production monitoring evidence for v1.43: Deferred / not verified.
- Screenshots and demo video: Optional portfolio artifacts, not captured by
  this milestone.
- v1.24 seed-data closeout: Historically NOT DONE / VALIDATION BLOCKED; v1.43
  fresh validation does not retroactively close that milestone.
- Marketplace/payment: Out of MVP scope.
- Skin score, face score, attractiveness scoring, medical diagnosis, treatment
  claims, and image-based skin analysis: Out of MVP scope for safety reasons.
- Image upload: Deferred / not implemented.
- Admin product management: Post-MVP option, not required for v1.43.

## Docs Consistency Review

Reviewed README and docs for these release/evidence terms:

```txt
current release
latest release
v1.8
v1.24
v1.42
v1.43
production ready
production-ready
E2E pass
validation blocked
NOT DONE
deferred
smoke test
audit
build pass
```

Findings:

- README mixed the current portfolio status with older v1.8 product-release
  wording. It now separates current v1.43 release evidence from historical
  release history.
- Several docs preserve historical production smoke status as user-reported
  PASS. v1.43 keeps that history but does not claim fresh production smoke.
- v1.24 remains historical NOT DONE / VALIDATION BLOCKED. v1.43 local build
  and E2E pass do not automatically reclassify v1.24.
- Current validation evidence now points to v1.43 where current status is
  being summarized.

## Final Release Decision

- Ready for portfolio demo: Yes, with evidence boundaries.
- Ready for production deployment: Conditional / not claimed as production-ready.
- Known limitations:
  - No fresh production smoke test was run against the deployed URL for v1.43.
  - Historical production PASS remains user-reported.
  - Strict production traceability still needs deployment id, screenshots,
    browser/version, device/OS, tester/date, sanitized logs, or equivalent
    external evidence.
  - Real external AI provider integration is not verified.
  - Screenshots and demo video are not included.

## Next Recommended Milestone

```txt
MVP v1.44 - Production Smoke Test & Deployment Evidence
```

Recommended scope:

- Perform fresh deployed-URL smoke test.
- Record date, tester, browser/version, device/OS, deployed URL, deployment id,
  and sanitized evidence.
- Verify `/api/health`, unauthenticated redirects, Google OAuth, core
  authenticated flows, browser console, network tab, Vercel runtime logs, and
  MongoDB read/write behavior without exposing secrets.
