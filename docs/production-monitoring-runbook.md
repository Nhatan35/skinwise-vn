# Production Monitoring and Demo Recovery Runbook

Last updated: 2026-06-05

## 1. Purpose

This runbook helps check production errors and recover during portfolio, demo, or interview walkthroughs for SkinWise VN.

Current evidence status:

```txt
MVP v1.9 local validation evidence: PASS
MVP v1.10 production smoke test evidence: PASS, user-reported
MVP v1.10 production monitoring evidence: PASS, user-reported
MVP v1.11 portfolio demo readiness: DONE
MVP v1.12 post-MVP backlog planning: DONE
Latest completed milestone: MVP v1.13 - UX Polish & Empty State Improvement
Current phase: Post-MVP controlled improvement
Critical blockers reported: None
```

Production monitoring PASS is based on the user's reported completed checks. Keep screenshots, deployment ids, and log snippets separately if strict audit evidence is required.

## 2. Where to Check Production Errors

During every demo or post-deployment check, review:

- Vercel deployment logs.
- Vercel function/runtime logs.
- Browser console.
- Browser Network tab.
- MongoDB Atlas monitoring/logs.
- NextAuth/OAuth provider configuration.

## 3. Vercel Logs Checklist

| Check | Expected Result |
|---|---|
| Deployment status | Ready / successful deployment. |
| Build logs | No build-time error. |
| Runtime logs | No repeated 500 error during smoke flows. |
| API route logs | No repeated failure for authenticated flows. |
| Environment variables | Present in Vercel settings; values not exposed in docs/screenshots. |

## 4. Browser Console and Network Checklist

| Check | Expected Result |
|---|---|
| Console | No critical JavaScript/runtime error blocking the demo. |
| Network | No unexpected 500/401/403 during authenticated happy path. |
| OAuth callback | Callback completes and redirects into the app. |
| API response shape | UI handles success/empty/error states cleanly. |
| Data export | Response downloads/returns expected export behavior without exposing secrets. |

## 5. MongoDB Connection Troubleshooting

Check these if the app works locally but fails on production:

- `MONGODB_URI` exists in the production environment.
- Database username and password are valid.
- IP/network access allows the deployment runtime.
- Correct database name is used.
- Connection timeout behavior is checked in function logs and MongoDB Atlas metrics.
- Authenticated read/write flows work through the UI.

## 6. NextAuth/OAuth Troubleshooting

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

## 7. Demo Recovery Playbook

If the production app fails during demo:

1. State calmly that the live deployment has a runtime issue and switch to the documented case study.
2. Open `README.md` and `docs/portfolio-case-study.md`.
3. Show validation evidence from `docs/final-release-checklist.md`.
4. Show the demo flow from `docs/demo-script.md`.
5. Use screenshots if available.
6. Record the issue in a follow-up bug note instead of hiding it.

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

## 8. Current Production Evidence Summary

```txt
Production URL: https://skinwise-vn.vercel.app
Production smoke test: PASS - user-reported manual verification completed
Production monitoring: PASS - user-reported checks completed
Critical blockers reported: None
Evidence date: 2026-06-04
Latest completed milestone: MVP v1.13 - UX Polish & Empty State Improvement
Current phase: Post-MVP controlled improvement
```

## 9. Safety and Privacy Rules

Never place these in documentation, screenshots, commits, or chat logs:

- `.env.local` values.
- OAuth client secrets.
- Auth secrets.
- MongoDB URI.
- Access tokens.
- Personal private notes from a real user account.
- Private email/account details beyond a safe demo label.
