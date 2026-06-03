# Production Smoke Test Checklist - MVP v1.9

Last updated: 2026-06-03

## Purpose

This checklist is for `MVP v1.9 - Production Monitoring & Demo Evidence Stabilization`.

It is a production smoke test checklist, not production evidence by itself. Production smoke test evidence remains `NOT RUN` until manually verified against the deployed app and recorded with date, environment, tester, and relevant notes.

Allowed statuses:

```txt
NOT RUN
PASS
FAIL
BLOCKED
```

Use `PASS` only after a real verification run succeeds. Use `FAIL` only after a real verification run fails.

## Test Context

```txt
Production URL: https://skinwise-vn.vercel.app
Current completed product release: MVP v1.8 - Insights Usability & Progress Story Refinement
Completed documentation cleanup patch: MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup - DONE
Latest documentation consistency hotfix: MVP v1.8.2 - Final Documentation Consistency Hotfix - DONE
Next recommended task: MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
Default evidence status: NOT RUN
```

## Production Smoke Checklist

| Item | Status | Evidence / Notes |
|---|---|---|
| Public landing page loads | NOT RUN | Pending v1.9 verification. |
| Protected route redirects unauthenticated user to sign-in | NOT RUN | Pending v1.9 verification. |
| Google OAuth login works if OAuth environment variables are configured | NOT RUN | Pending v1.9 verification. |
| Dashboard loads after login | NOT RUN | Pending v1.9 verification. |
| Skin Profile create/edit/delete works | NOT RUN | Pending v1.9 verification. |
| Product catalogue loads | NOT RUN | Pending v1.9 verification. |
| Product match works | NOT RUN | Pending v1.9 verification. |
| Product detail page works | NOT RUN | Pending v1.9 verification. |
| Save/unsave product works | NOT RUN | Pending v1.9 verification. |
| Ingredient library loads | NOT RUN | Pending v1.9 verification. |
| Ingredient detail/explanation works | NOT RUN | Pending v1.9 verification. |
| Routine builder works | NOT RUN | Pending v1.9 verification. |
| Routine analysis works | NOT RUN | Pending v1.9 verification. |
| Today checklist works | NOT RUN | Pending v1.9 verification. |
| Routine logs work | NOT RUN | Pending v1.9 verification. |
| Skin journal works | NOT RUN | Pending v1.9 verification. |
| Insights page works | NOT RUN | Pending v1.9 verification. |
| Settings page works | NOT RUN | Pending v1.9 verification. |
| Data export works | NOT RUN | Pending v1.9 verification. |
| Data delete request flow works | NOT RUN | Pending v1.9 verification. |
| Sign out works | NOT RUN | Pending v1.9 verification. |

## Evidence Recording Notes

When this checklist is executed, record:

- date and time;
- deployed URL and Vercel deployment identifier if available;
- browser and device;
- authenticated demo account identity without exposing secrets;
- PASS/FAIL/BLOCKED notes for each item;
- whether Vercel logs, browser console, browser Network tab, and MongoDB Atlas metrics were checked.

Do not record real secrets, OAuth tokens, database URIs, private notes, or sensitive user profile data in this file.
