# 03-feature-status-matrix.md

# Feature Status Matrix — SkinWise VN MVP v1.2.6

Last updated: 2026-05-13

| Feature | Status | API | UI | DB | Tests | Notes |
|---|---|---|---|---|---|---|
| Documentation SDD | Done | N/A | N/A | N/A | N/A | v1.2.6 final freeze ready |
| Engineering guardrails | Done | N/A | N/A | N/A | N/A | ADRs, PR checklist, CI template, execution checklist |
| Next.js foundation | Done | N/A | Basic home placeholder | N/A | Smoke | Week 1 Task 1 initialized |
| Environment validation | Not Started | N/A | N/A | N/A | No | Week 1 |
| Feature flags | Done | N/A | N/A | N/A | Smoke | Week 1 config only; incomplete features false |
| MongoDB connection | Not Started | N/A | N/A | No | No | Week 1 |
| DB index script | In Progress | N/A | N/A | No | No | `npm run db:indexes` placeholder exists; real indexes later |
| Testing foundation | Done | N/A | N/A | N/A | Smoke | Vitest and Playwright configs created; unit smoke test added |
| Auth foundation | Not Started | Partial later | Partial later | Auth.js adapter later | No | Week 1; `/api/me` lazy profile creation |
| Protected dashboard shell | Not Started | N/A | No | N/A | No | Week 1 |
| Skin Profile | Not Started | No | No | No | No | Week 2 |
| Product mini database | Not Started | No | No | No | No | Seed spec added |
| Ingredient knowledge base | Not Started | No | No | No | No | Seed spec added |
| Routine Builder | Not Started | No | No | No | No | Week 3 |
| RoutineLog | Not Started | No | No | No | No | Must use upsert |
| SkinJournal | Not Started | No | No | No | No | One entry per localDate |
| Routine Safety Engine | Not Started | No | No | No | No | Rule engine before AI |
| Routine Analysis API | Not Started | No | No | No | No | `POST /api/routines/:id/analyze` |
| AI Provider Abstraction | Not Started | No | N/A | No | No | Server-only |
| Ingredient Explanation | Not Started | No | No | No | No | Safety classifier when needed |
| Deployment | Not Started | N/A | N/A | N/A | No | Use deployment checklist |
| Notifications | Out of Scope | No | No | No | No | Reserved future only |
| Image Upload | Out of Scope | No | No | No | No | Future only |
| Marketplace | Out of Scope | No | No | No | No | Not MVP |
| AI Face Analysis | Out of Scope | No | No | No | No | Not allowed in MVP |
| Skin Score | Out of Scope | No | No | No | No | Avoid appearance pressure |

## Status definitions

```txt
Not Started = no implementation yet
In Progress = partially implemented
Done = implemented and documented
Blocked = cannot proceed due to dependency
Out of Scope = intentionally excluded from MVP
```

## Update rule

Update this file whenever:

- a feature starts;
- a feature becomes partially implemented;
- API/UI/DB/test status changes;
- a feature is deliberately moved out of scope;
- a new feature is proposed and classified.
