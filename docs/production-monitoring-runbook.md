# Production Monitoring and Demo Recovery Runbook

Last updated: 2026-06-13

## 1. Purpose

This runbook helps check production errors and recover during portfolio, demo, or interview walkthroughs for SkinWise VN.

Current evidence status:

```txt
MVP v1.9 local validation evidence: PASS
MVP v1.10 production smoke test evidence: PASS, user-reported
MVP v1.10 production monitoring evidence: PASS, user-reported
MVP v1.11 portfolio demo readiness: DONE
MVP v1.12 post-MVP backlog planning: DONE
MVP v1.22 production observability/release confidence: DONE
MVP v1.22.1 production deployment/smoke verification: DONE / PASS, user-reported manual verification
MVP v1.23 account data deletion workflow hardening: DONE
Latest completed product milestone: MVP v1.37 - Product ↔ Ingredient Learning Path Polish
Latest completed verification task: Screen-Reader Assistive Technology Verification
Latest completed MVP quality task: MVP Product Match Explainability Polish
Current active milestone: None
Current phase: Post-MVP controlled improvement
Critical blockers reported: None
```

Production monitoring PASS is based on user-reported manual production verification. Authenticated MVP flows, browser console/network, Vercel logs, MongoDB Atlas read/write behavior, and OAuth callback behavior were reported as checked with no critical blockers observed. Exact verification date, tester name, deployment id, browser/version, and device/OS were not provided. Keep screenshots, deployment ids, and log snippets separately if strict audit evidence is required.

Screen-Reader Assistive Technology Verification is also DONE / PASS based on manual production/browser verification. Keyboard-only and screen-reader checks passed with no critical accessibility blockers observed. Date, tester, browser, device/OS, and screen reader used were not provided. See `docs/release-evidence-screen-reader-verification.md`.

MVP Empty / Loading / Error State Polish is DONE / PASS based on local validation. It improved user-facing recovery states without changing production monitoring, API contracts, schema, auth, AI behavior, or scoring logic.

MVP Form Validation & Inline Feedback Polish is DONE / PASS based on local validation. It improved existing form/action guidance and safe inline feedback without changing production monitoring, API contracts, schema, auth, AI behavior, scoring logic, matching logic, or environment configuration.

MVP Product Match Explainability Polish is DONE / PASS based on local validation. It improved Product Match, Product Detail, and Saved Products comparison explanation copy without changing production monitoring, API contracts, schema, auth, AI behavior, scoring logic, matching logic, or environment configuration.

## 2. Where to Check Production Errors

During every demo or post-deployment check, review:

- `/api/health`.
- Vercel deployment logs.
- Vercel function/runtime logs.
- Browser console.
- Browser Network tab.
- MongoDB Atlas monitoring/logs.
- NextAuth/OAuth provider configuration.

## 3. Health Endpoint Check

Open:

```txt
/api/health
```

Confirm:

- HTTP `200`.
- `status = "ok"`.
- `version = "v1.22"`.
- `timestamp` is present and uses an ISO date string.
- No secret, token, database URI, OAuth credential, private user data, user id, email, password, or raw database document is exposed.

Intentional limitation:

- The v1.22 health endpoint only verifies that the app route is reachable.
- It does not verify database connectivity, OAuth connectivity, AI provider connectivity, or external service health.
- This limitation is intentional for safety and simplicity.

## 4. Vercel Logs Checklist

| Check | Expected Result |
|---|---|
| Deployment status | Ready / successful deployment. |
| Build logs | No build-time error. |
| Runtime logs | No repeated 500 error during smoke flows. |
| API route logs | No repeated failure for authenticated flows. |
| Environment variables | Present in Vercel settings; values not exposed in docs/screenshots. |

## 5. Browser Console and Network Checklist

| Check | Expected Result |
|---|---|
| Console | No critical JavaScript/runtime error blocking the demo. |
| Network | No unexpected 500/401/403 during authenticated happy path. |
| OAuth callback | Callback completes and redirects into the app. |
| API response shape | UI handles success/empty/error states cleanly. |
| Data export | Response downloads/returns expected export behavior without exposing secrets. |

## 6. MongoDB Connection Troubleshooting

Check these if the app works locally but fails on production:

- `MONGODB_URI` exists in the production environment.
- Database username and password are valid.
- IP/network access allows the deployment runtime.
- Correct database name is used.
- Connection timeout behavior is checked in function logs and MongoDB Atlas metrics.
- Authenticated read/write flows work through the UI.

## 7. NextAuth/OAuth Troubleshooting

The source environment schema uses `AUTH_URL` and `AUTH_SECRET`. Some Auth.js references may call these `NEXTAUTH_URL` and `NEXTAUTH_SECRET`; keep configured names aligned with the actual project schema unless the code is deliberately changed.

Check:

- Google OAuth client exists.
- Redirect URI is configured:

```txt
https://skinwise-vn.vercel.app/api/auth/callback/google
```

- `AUTH_GOOGLE_ID` is set in Vercel.
- `AUTH_GOOGLE_SECRET` is set in Vercel.
- `AUTH_URL` matches the production URL.
- `AUTH_SECRET` is set and not exposed.

## 8. Demo Recovery Playbook

If the production app fails during demo:

1. State calmly that the live deployment has a runtime issue and switch to the documented case study.
2. Open `README.md` and `docs/portfolio-case-study.md`.
3. Show validation evidence from `docs/final-release-checklist.md`.
4. Show the demo flow from `docs/demo-script.md`.
5. Use screenshots if available.
6. Record the issue using `docs/production-incident-note-template.md` instead of hiding it.

If Google OAuth fails:

- Check Vercel env variables.
- Check Google redirect URI.
- Check browser network request for `/api/auth/*`.
- Use the case study and validation evidence as backup.

If MongoDB fails:

- Check Vercel function logs.
- Check Atlas network access.
- Check database user permissions.
- Check the target database name.

## 9. Current Production Evidence Summary

```txt
Production URL: https://skinwise-vn.vercel.app
Production URL public reachability: PASS - direct unauthenticated HTTP 200 on 2026-06-11
Production /api/health: PASS - direct unauthenticated HTTP 200 with expected v1.22 JSON contract on 2026-06-11
Manual Browser & Production Smoke Verification: DONE / PASS
Evidence source: User-reported manual production verification
Evidence date: Not provided
Tester: Not provided
Deployment ID: Not provided
Browser: Not provided
Device/OS: Not provided
Authenticated MVP production smoke: PASS
Production signals: PASS
Browser console critical errors: None observed
Unexpected Network 4xx/5xx errors: None observed
Vercel critical runtime errors: None observed
MongoDB read/write issue: None observed
OAuth callback flow: PASS
Critical blockers reported: None
Evidence dates: historical user-reported baseline 2026-06-04; direct public checks 2026-06-11; manual production smoke date not provided
Latest completed product milestone: MVP v1.37 - Product ↔ Ingredient Learning Path Polish
Screen-Reader Assistive Technology Verification: DONE / PASS
MVP Form Validation & Inline Feedback Polish: DONE / PASS
MVP Product Match Explainability Polish: DONE / PASS
Keyboard-only verification: PASS
Screen-reader verification: PASS
Critical accessibility blockers: None observed
Latest completed verification task: Screen-Reader Assistive Technology Verification
Latest completed MVP quality task: MVP Product Match Explainability Polish
Current active milestone: None
Current phase: Post-MVP controlled improvement
```

## 10. Safety and Privacy Rules

Never place these in documentation, screenshots, commits, or chat logs:

- `.env.local` values.
- OAuth client secrets.
- Auth secrets.
- MongoDB URI.
- Access tokens.
- Personal private notes from a real user account.
- Private email/account details beyond a safe demo label.
