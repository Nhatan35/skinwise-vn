# Release Evidence - v1.22 Production Observability & Release Confidence

## 1. Release Summary

| Field | Value |
|---|---|
| Version | v1.22 |
| Verification task | v1.22.1 - Production Deployment & Smoke Verification |
| Release type | Post-MVP production verification |
| Date | 2026-06-11 |
| Manual smoke update date | Not provided |
| Branch | main |
| Commit hash | 3d194a9 |
| Production URL | https://skinwise-vn.vercel.app |
| Deployment URL | Not provided |
| Deployment ID | Not provided |
| Release owner | Not provided |

Production URL source: README candidate production demo URL.

Deployment metadata note: no Vercel deployment-specific URL or deployment id was provided for the manual production smoke update.

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
* Secrets, tokens, private database URLs, private production data, raw Vercel logs, or raw MongoDB records.

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
| Landing page | PASS | Manual browser production check. | User-reported PASS. |
| Protected routes | PASS | Unauthenticated redirect behavior. | User-reported PASS. |
| Google OAuth login | PASS | OAuth sign-in and callback flow. | User-reported PASS. |
| Dashboard after login | PASS | Authenticated dashboard load. | User-reported PASS. |
| Skin Profile | PASS | Create/edit/view flow. | User-reported PASS. |
| Product catalogue | PASS | Catalogue load. | User-reported PASS. |
| Product detail | PASS | Product Detail page load. | User-reported PASS. |
| Product Detail -> Ingredient Library | PASS | v1.37 learning path link. | User-reported PASS. |
| Ingredient detail | PASS | Ingredient Detail page load. | User-reported PASS. |
| Ingredient Detail -> Product Catalogue | PASS | v1.37 learning path link. | User-reported PASS. |
| Product match | PASS | Product Match flow. | User-reported PASS. |
| Saved products | PASS | Save/unsave flow. | User-reported PASS. |
| Routine builder | PASS | Routine Builder flow. | User-reported PASS. |
| Today routine log | PASS | Today Routine Log flow. | User-reported PASS. |
| Journal | PASS | Create/edit/delete flow. | User-reported PASS. |
| Insights | PASS | Insights page load. | User-reported PASS. |
| Settings | PASS | Settings page load. | User-reported PASS. |
| Data export | PASS | Export data flow reachable/works as expected. | User-reported PASS. |
| Deletion request | PASS | Deletion request flow reachable/works as expected. | User-reported PASS. |
| Critical blocker | PASS | Critical blocker review. | None reported. |

## 6. Production Signals

| Signal | Result | Evidence source | Notes |
|---|---|---|---|
| Browser console | PASS | User-reported manual production verification. | No critical errors observed. |
| Browser network tab | PASS | User-reported manual production verification. | No unexpected API 4xx/5xx errors observed. |
| Vercel build/runtime logs | PASS | User-reported manual production verification. | No critical runtime errors observed. |
| MongoDB Atlas signal | PASS | User-reported manual production verification. | Read/write behavior appeared normal during tested flows. |
| OAuth callback behavior | PASS | User-reported manual production verification. | Callback flow worked correctly. |

## 7. Manual Production Verification Checklist

### Public checks

- [x] Open production URL.
- [x] Confirm landing page loads.
- [x] Open `/api/health`.
- [x] Confirm HTTP 200.
- [x] Confirm `status = "ok"`.
- [x] Confirm `version = "v1.22"`.
- [x] Confirm `timestamp` is present.
- [x] Confirm no sensitive data is exposed.

### Authenticated MVP checks

- [x] Sign in with Google OAuth.
- [x] Confirm dashboard loads after login.
- [x] Open Skin Profile and verify create/edit/view.
- [x] Open Product Catalogue.
- [x] Open Product Detail.
- [x] Check Product Detail -> Ingredient Library learning path.
- [x] Open Ingredient Detail.
- [x] Check Ingredient Detail -> Product Catalogue learning path.
- [x] Run Product Match.
- [x] Save/unsave Saved Products.
- [x] Open Routine Builder.
- [x] Check Today Routine Log.
- [x] Create/edit/delete Skin Journal entry.
- [x] Open Insights.
- [x] Open Settings.
- [x] Check Data Export.
- [x] Check Deletion Request.

### Production signal checks

- [x] Browser console has no critical blocking error.
- [x] Browser network tab has no unexpected API 4xx/5xx errors.
- [x] Vercel logs show no critical runtime errors.
- [x] MongoDB Atlas read/write behavior appears normal during tested flows.
- [x] OAuth callback works without critical error.

The direct public HTTP checks for the production URL and `/api/health` are recorded in Sections 4 and 5. Authenticated smoke and production signal checks are recorded as user-reported manual verification.

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

Separate user-reported checks from direct tool evidence.

The manual browser, authenticated smoke, Vercel, MongoDB, and OAuth signal checks are user-reported. Exact verification date, tester name, deployment id, browser/version, and device/OS were not provided.

Use redaction when documenting sensitive operational context.

Unknown fields must remain marked `Not provided`.

## 9. Final Decision

| Field | Value |
|---|---|
| v1.22 status | DONE |
| v1.22.1 status | DONE / PASS |
| Production verification result | PASS - user-reported manual production verification |
| Public production URL | PASS |
| Production `/api/health` | PASS |
| Authenticated MVP smoke flows | PASS |
| Production signals | PASS |
| Known blockers | None reported. |
| Date | Not provided |
| Tester | Not provided |
| Deployment ID | Not provided |
| Browser | Not provided |
| Device/OS | Not provided |
| Later accessibility verification | Screen-Reader Assistive Technology Verification: DONE / PASS; see `docs/release-evidence-screen-reader-verification.md`. |
| Next recommended task | None. |

Status rule:

* v1.22.1 is marked DONE / PASS because production health, main production smoke flows, and available production signals were reported as checked with no critical blocker.
* Do not hide failed or unchecked validation.
