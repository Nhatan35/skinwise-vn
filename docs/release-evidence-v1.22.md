# Release Evidence - v1.22 Production Observability & Release Confidence

## 1. Release Summary

| Field | Value |
|---|---|
| Version | v1.22 |
| Verification task | v1.22.1 - Production Deployment & Smoke Verification |
| Release type | Post-MVP production verification |
| Date | 2026-06-11 |
| Branch | main |
| Commit hash | 3d194a9 |
| Production URL | https://skinwise-vn.vercel.app |
| Deployment URL | NOT AVAILABLE |
| Release owner | TODO |

Production URL source: README candidate production demo URL.

Deployment URL note: no Vercel deployment-specific URL was available from repository files or safe public checks.

## 2. Scope

### Included

* Safe public health check endpoint.
* Health API contract test.
* Release evidence template.
* Production incident note template.
* Monitoring runbook update.
* Final release checklist update.
* Source of truth status update.
* v1.22.1 local validation rerun.
* v1.22.1 safe public production URL and `/api/health` checks.

### Excluded

* Admin CRUD.
* Real AI provider integration.
* Database schema change.
* Payment/checkout.
* Image upload.
* Skin scoring.
* Diagnosis logic.
* Medical or treatment advice.
* Marketplace/order workflow.
* Browser/OAuth/Vercel/Atlas verification without access.

## 3. Local Validation

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | PASS | ESLint completed successfully on 2026-06-11. |
| `npm run typecheck` | PASS | TypeScript completed with `tsc --noEmit` on 2026-06-11. |
| `npm run test` | PASS | Vitest passed: 103 test files / 991 tests on 2026-06-11. |
| `npm run build` | PASS | Sandboxed run compiled successfully then failed with `spawn EPERM`; outside-sandbox rerun passed on 2026-06-11. |
| `npm run test:e2e` | PASS | Sandboxed run failed immediately with `spawn EPERM`; outside-sandbox rerun passed: 31/31 Playwright tests on 2026-06-11. |
| `npm audit --omit=dev --audit-level=moderate` | PASS | 0 vulnerabilities on 2026-06-11. |

Local validation confirms the local release candidate only. It does not prove production flows passed.

## 4. Production Health Endpoint

### `/api/health`

| Field | Value |
|---|---|
| Result | PASS |
| URL checked | https://skinwise-vn.vercel.app/api/health |
| Check type | Direct unauthenticated public HTTPS request with `curl.exe` |
| HTTP status | 200 |
| Response contract | PASS |
| Sensitive data exposure | PASS |
| Evidence date | 2026-06-11 |

Observed safe response:

```json
{
  "status": "ok",
  "app": "SkinWise VN",
  "version": "v1.22",
  "timestamp": "2026-06-11T03:31:59.333Z",
  "checks": {
    "app": "ok"
  }
}
```

Sensitive exposure check:

```txt
No secret, auth_secret, mongodb_uri, auth_google_secret, google_client_secret, ai_api_key, openai_api_key, token, accesstoken, refreshtoken, userid, email, password, rawdocument, or process.env string was present in the serialized health response.
```

## 5. Production Smoke Result

| Area | Result | What was tested | Notes |
|---|---|---|---|
| Production URL | PASS | Direct unauthenticated public HTTPS request to `https://skinwise-vn.vercel.app/`. | Returned HTTP 200 with Vercel headers. |
| `/api/health` | PASS | Direct unauthenticated public HTTPS request to `https://skinwise-vn.vercel.app/api/health`. | Returned HTTP 200 and expected v1.22 JSON contract. |
| Landing page | PASS | Public landing page reachability by HTTP status. | Returned HTTP 200. Browser rendering and visual review were not checked. |
| Google OAuth login | NOT CHECKED | No browser/OAuth test account access available to the coding assistant. | Do not treat historical OAuth evidence as v1.22.1 verification. |
| Dashboard after login | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Skin Profile | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Product catalogue | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Product detail | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Product match | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Saved products | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Routine builder | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Today routine checklist | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Journal | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Insights | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Settings | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Data export | NOT CHECKED | Requires authenticated production browser session. | Not checked. |
| Critical blocker | NOT CHECKED | Full authenticated production smoke was not completed. | No blocker was found in public URL or health checks, but auth-dependent MVP flows remain unchecked. |

## 6. Production Signals

| Signal | Result | Evidence source | Notes |
|---|---|---|---|
| Browser console | NOT CHECKED | Browser access not available in this verification run. | No claim made. |
| Browser network tab | NOT CHECKED | Browser access not available in this verification run. | Public HTTP checks were done with `curl.exe`; this is not a browser network-tab check. |
| Vercel build logs | NOT CHECKED | Vercel dashboard/log access not available. | No claim made. |
| Vercel function logs | NOT CHECKED | Vercel dashboard/log access not available. | No claim made. |
| MongoDB Atlas signal | NOT CHECKED | MongoDB Atlas access not available. | No claim made. |
| OAuth callback behavior | NOT CHECKED | OAuth/browser test access not available. | No claim made. |

## 7. Manual Production Verification Checklist

### Public checks

- [ ] Open production URL.
- [ ] Confirm landing page loads.
- [ ] Open `/api/health`.
- [ ] Confirm HTTP 200.
- [ ] Confirm `status = "ok"`.
- [ ] Confirm `version = "v1.22"`.
- [ ] Confirm `timestamp` is present.
- [ ] Confirm no sensitive data is exposed.

### Authenticated MVP checks

- [ ] Sign in with Google OAuth.
- [ ] Confirm dashboard loads after login.
- [ ] Open Skin Profile.
- [ ] Open Product Catalogue.
- [ ] Open Product Detail.
- [ ] Run Product Match.
- [ ] Open Saved Products.
- [ ] Open Routine Builder.
- [ ] Check Today Routine Checklist.
- [ ] Create or view Skin Journal entry.
- [ ] Open Insights.
- [ ] Open Settings.
- [ ] Check Data Export if available.

### Production signal checks

- [ ] Browser console has no critical blocking error.
- [ ] Browser network tab has no repeated HTTP 500 errors.
- [ ] Vercel latest deployment is successful.
- [ ] Vercel function logs show no critical repeated runtime errors.
- [ ] MongoDB Atlas monitoring shows no critical connection issue.
- [ ] OAuth callback works without critical error.

The direct public HTTP checks for the production URL and `/api/health` are recorded in Sections 4 and 5. Checklist items above remain unchecked because this checklist is for follow-up manual browser/platform verification.

## 8. Evidence Boundary

Do not paste:

* Secrets.
* Raw database URI.
* OAuth credentials.
* Private user data.
* Passwords.
* Cookies.
* Private request headers.
* Raw production database documents.
* Tokens.
* Access tokens.
* Refresh tokens.

Separate user-reported checks from direct verification evidence.

Historical production evidence remains historical/user-reported unless explicitly rechecked for v1.22.1.

Use redaction when documenting sensitive operational context.

Unchecked items must remain marked `NOT CHECKED`.

## 9. Final Decision

| Field | Value |
|---|---|
| v1.22 status | DONE |
| v1.22.1 status | NOT DONE |
| Production verification result | NOT CHECKED - partial public checks only |
| Public production URL | PASS |
| Production `/api/health` | PASS |
| Authenticated MVP smoke flows | NOT CHECKED |
| Production signals | NOT CHECKED |
| Known blockers | No blocker found in public URL or health checks. Full production smoke remains incomplete because browser/OAuth/Vercel/Atlas access was unavailable. |
| Next recommended task | Complete manual authenticated production smoke and production signal checks using the checklist above. |

Status rule:

* v1.22.1 can be marked DONE only after production health, main production smoke flows, and available production signals are checked with no critical blocker.
* Partial public checks do not prove authenticated MVP production flows.
* Do not hide failed or unchecked validation.
