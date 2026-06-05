# SkinWise VN Demo Script

Last updated: 2026-06-05

## 1. Demo Objective

Show SkinWise VN as a complete educational skincare tracking MVP. The demo should communicate the user problem, MVP scope, main workflows, safety boundaries, validation evidence, and portfolio readiness clearly in 3-5 minutes.

Do not present the app as a medical diagnosis tool, dermatologist replacement, skin scoring tool, image analysis product, marketplace, or real external AI product.

## 2. Current Demo Readiness

```txt
Production URL: https://skinwise-vn.vercel.app
MVP v1.9 local validation: PASS
MVP v1.10 production smoke/monitoring: PASS, user-reported
MVP v1.11 portfolio demo readiness: DONE
MVP v1.12 post-MVP backlog planning: DONE
Latest completed milestone: MVP v1.13 - UX Polish & Empty State Improvement
Current phase: Post-MVP controlled improvement
Next recommended product task: MVP v1.14 - Data Quality Expansion
Portfolio evidence tasks: screenshots, demo video, CV/portfolio case study
Critical blockers reported: None
```

Evidence note: production PASS status is based on the user's reported manual verification. Keep screenshots or log snippets separately if a stricter review needs trace evidence.

## 3. Demo Account Preparation

Use a real authenticated demo account through Google login.

Before the demo:

- confirm the production app opens;
- confirm Google sign-in works;
- confirm the account has a demo Skin Profile;
- confirm Product Match has meaningful candidates;
- confirm at least one saved product exists;
- confirm at least one morning routine and one evening routine exist;
- confirm routine analysis can be shown safely;
- confirm routine logs and journal entries exist;
- confirm Insights is not empty, or explain the empty state if intentionally clean;
- confirm no private secrets, tokens, database URIs, or sensitive personal data are visible on screen.

## 4. Recommended Demo Data

Public/shared data is seeded through `scripts/seed.ts`:

```txt
Products: 38
Ingredients: 40
```

User-owned demo data should be created through the authenticated UI:

- 1 Skin Profile.
- 3-5 Saved Products.
- 1 Morning Routine.
- 1 Evening Routine.
- 1 Routine Safety Analysis result.
- 3-5 Routine Logs.
- 5-7 Skin Journal entries.
- Insights with visible activity.
- Data Export checked once.

## 5. 3-5 Minute Demo Flow

### 0:00-0:30 — Opening

Say:

```txt
SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users organize their skin profile, understand products and ingredients, build safer routines, track daily completion, write journal entries, and review progress insights. It is not a medical diagnosis app and does not replace dermatologists.
```

Show:

- Landing page.
- Main value proposition.
- Safety boundary.

### 0:30-1:00 — Authentication and Dashboard

Show:

- Google login.
- Protected dashboard.
- Dashboard summary.

Say:

```txt
The app keeps personal skincare data behind authentication. After login, the dashboard gives the user a lightweight overview of profile, routine, journal, and progress context.
```

### 1:00-1:30 — Skin Profile

Show:

- Skin Profile page.
- Main profile fields.
- Edit/update flow if needed.

Say:

```txt
The Skin Profile is the context used by product matching and guidance. It keeps the MVP personalized without making medical claims.
```

### 1:30-2:10 — Product Match, Product Detail, Saved Products

Show:

- Product Match page.
- Match score/level/explanation.
- Product Detail personalized match section.
- Save/unsave product.
- Saved Products page.

Say:

```txt
Product Match is rule-based educational guidance. It explains why a product may fit the user's profile and highlights cautions, but it never guarantees outcomes.
```

### 2:10-2:40 — Ingredient Library

Show:

- Ingredient Library.
- Ingredient Detail.
- Ingredient Explanation/fallback behavior.

Say:

```txt
The Ingredient Library helps beginners understand common cosmetic ingredients in a safer, educational format.
```

### 2:40-3:25 — Routine Builder and Safety Analysis

Show:

- Routine Builder.
- Morning/evening routine.
- Routine Safety Analysis.
- Today Routine Checklist.

Say:

```txt
The routine flow helps users organize products into a routine and review potential caution areas. The analysis uses safe rules and fallback behavior rather than unsupported diagnosis.
```

### 3:25-4:10 — Journal and Insights

Show:

- Skin Journal.
- Routine Logs.
- Insights page.

Say:

```txt
The journal and insights flow helps users reflect on consistency and observations over time. The app avoids claiming product causality or medical improvement.
```

### 4:10-4:40 — Settings and Data Control

Show:

- Settings/Data Control.
- Data Export.
- App data deletion or account deletion request marker.

Say:

```txt
The Settings page shows data control thinking: users can export their app data and request deletion-related actions.
```

### 4:40-5:00 — Close

Say:

```txt
This project is portfolio-ready because it combines BA thinking and full-stack execution: clear problem scope, safe requirements, implemented user journey, validation evidence, production smoke-check discipline, and demo-ready documentation.
```

## 6. Do Not Say During Demo

Avoid these claims:

- "This app diagnoses skin conditions."
- "This product will cure acne."
- "The AI knows the best routine for you."
- "This replaces a dermatologist."
- "The score measures skin quality or attractiveness."
- "The product database is a verified commercial catalogue."

Use safer language:

- "educational guidance";
- "rule-based match";
- "may be suitable based on profile";
- "caution note";
- "reflection over time";
- "not medical advice".

## 7. Backup Plan During Demo

If Google OAuth fails:

- show README and screenshots if available;
- explain protected routes and local/E2E validation evidence;
- open the demo script and portfolio case study.

If a production API request fails:

- show Vercel function logs if appropriate;
- explain the expected behavior from the E2E test coverage;
- record the issue as a production follow-up instead of hiding it.

If demo data is missing:

- show the empty state intentionally;
- explain that user-owned demo data is created through the authenticated UI;
- create a minimal Skin Profile and one routine live only if time allows.

## 8. Common Interview Q&A

| Question | Suggested answer |
|---|---|
| Why did you build this? | To practice building a scoped full-stack MVP with BA-level requirements discipline and safe product boundaries. |
| Why rule-based match instead of full AI? | Rule-based matching is safer, more explainable, easier to test, and better for MVP validation. |
| How did you control scope? | I excluded diagnosis, image analysis, marketplace, payments, admin CRUD, and unsupported AI claims. |
| How did you validate it? | Local lint, typecheck, 889 unit tests, production build, database seed/index scripts, 29 E2E tests, audit, production smoke check, and release docs. |
| What is the strongest BA part? | Problem framing, scope control, safety requirements, user journey traceability, and release evidence. |
| What would you improve next? | The next recommended product task is v1.14 Data Quality Expansion. Screenshots, a demo video, and CV/portfolio case study polish are portfolio evidence tasks, not product blockers. |

## 9. Final Demo Checklist

Before presenting:

- [ ] Production URL opens.
- [ ] Google login works.
- [ ] Demo account has Skin Profile.
- [ ] Product Match has results.
- [ ] Saved Products has at least one item.
- [ ] Routine Builder has morning/evening example.
- [ ] Routine Analysis works.
- [ ] Today Routine can be completed.
- [ ] Journal has sample entries.
- [ ] Insights has visible activity or clear empty state.
- [ ] Settings/Data Export works.
- [ ] No secrets visible.
- [ ] Browser console/network checked.
- [ ] Vercel logs checked.
