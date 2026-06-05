# Demo Data and Demo Script - SkinWise VN

Last updated: 2026-06-05

## 1. Current Release Context

```txt
MVP v1.9 local validation: PASS
MVP v1.10 production smoke/monitoring: PASS, user-reported
MVP v1.11 portfolio demo readiness: DONE
MVP v1.12 post-MVP backlog planning: DONE
Latest completed milestone: MVP v1.14 - Data Quality Expansion
Current phase: Post-MVP controlled improvement
Recommended next task: Portfolio Evidence Package
Production URL: https://skinwise-vn.vercel.app
```

This document explains what demo data should exist before presenting SkinWise VN. It complements `docs/demo-script.md` and `docs/portfolio-case-study.md`.

## 2. Data Ownership Strategy

| Data category | Data | Strategy |
|---|---|---|
| Public/shared demo data | Products and ingredients | Seeded through `scripts/seed.ts`. |
| User-owned demo data | Skin profile, saved products, routines, routine logs, journal entries, routine analysis records | Created manually through the authenticated UI for the real demo account. |

User-owned demo data should not be hardcoded into the public seed script because it must remain scoped to the authenticated user.

## 3. Public Shared Seed Data

The existing public seed script supports Product Catalogue, Product Match, Ingredient Library, routine safety behavior, and demo walkthroughs.

Expected seeded data:

```txt
Products: 58
Ingredients: 59
```

Safe seed command for local/demo database only:

```bash
npm run db:seed
```

Do not run seed commands against an unknown or sensitive production database unless the target database is explicitly safe.

## 4. User-Owned Demo Data Checklist

Create this through the production UI using the authenticated demo account:

| Data | Target | Reason |
|---|---:|---|
| Skin Profile | 1 complete profile | Enables Product Match and personalized explanation. |
| Saved Products | 3-5 products | Shows user curation. |
| Morning Routine | 1 routine | Shows routine organization. |
| Evening Routine | 1 routine | Shows routine organization. |
| Routine Analysis | 1-2 examples | Shows safety/caution reasoning. |
| Routine Logs | 3-5 entries | Powers routine consistency story. |
| Skin Journal | 5-7 entries | Powers reflection and Insights story. |
| Insights data | Visible activity | Prevents empty demo screen. |
| Data Export | Checked once | Shows data control. |

## 5. Suggested Demo Profile

Use safe, non-medical wording:

```txt
Skin type: Combination / oily-prone
Main concerns: oiliness, occasional breakouts, uneven texture
Sensitivity: mild sensitivity
Routine goal: build a simple, consistent routine
Avoided claims: no diagnosis, no treatment guarantee
```

## 6. Suggested Demo Routine

Morning:

```txt
Cleanser -> Hydrating serum -> Moisturizer -> Sunscreen
```

Evening:

```txt
Cleanser -> Gentle treatment product -> Moisturizer
```

Keep the routine simple. Avoid showing too many actives at once unless the point is to demonstrate caution handling.

## 7. Demo Walkthrough

Use the fuller script in `docs/demo-script.md`. The short flow is:

```txt
Landing
-> Login
-> Dashboard
-> Skin Profile
-> Product Match
-> Product Detail
-> Saved Products
-> Ingredient Library
-> Routine Builder
-> Routine Analysis
-> Today Routine
-> Journal
-> Insights
-> Settings/Data Export
```

## 8. Demo Safety Notes

Do not show:

- real private emails if avoidable;
- real private journal notes;
- `.env.local`;
- Vercel secret values;
- MongoDB URI;
- OAuth tokens;
- medical diagnosis claims;
- before/after appearance claims.

Use these phrases:

- educational guidance;
- rule-based match;
- caution note;
- safe fallback;
- reflection over time;
- not medical advice.

## 9. Readiness Decision

```txt
Demo data readiness: READY after user-owned demo data is created or confirmed
Portfolio demo readiness: READY at MVP level
Portfolio evidence tasks: screenshots, demo video, CV/portfolio case study
```
