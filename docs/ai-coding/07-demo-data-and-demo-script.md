# Demo Data and Demo Script - SkinWise VN

Last updated: 2026-05-31

## 1. Purpose

`TASK DEMO-DATA-001 - Prepare Professional Demo Data` prepares SkinWise VN for a portfolio and BA internship demo without adding product scope.

The demo data supports a realistic skincare tracking story for a beginner-to-intermediate user with oily or combination-oily skin, acne-prone concerns, clogged-pore texture, post-acne dark spots, mild sensitivity, Product Match review, and Insights review.

SkinWise VN remains an educational skincare MVP. The demo must not claim diagnosis, treatment guarantees, skin scoring, attractiveness scoring, real AI dermatologist behavior, or image-based face/skin analysis.

## 2. Data Ownership Strategy

| Data category | Data | Strategy |
|---|---|---|
| Public/shared demo data | Products and ingredients | Seeded through the existing `scripts/seed.ts` public seed structure. |
| User-owned demo data | Skin profile, saved product example, routines, routine logs, journal entries, routine analysis records | Created manually through the authenticated UI for the real demo account. |

User-owned demo data is intentionally not seeded by default. The project uses Auth.js users and user-scoped collections, so hardcoding a fake `userId` would risk bypassing the real authenticated ownership flow. A future optional `DEMO_USER_ID` seed script can be added only if the target user id and demo database are explicitly confirmed safe.

## 3. Public Shared Seed Data

The existing public seed script contains curated products and ingredients for demo, development, and rule-engine behavior.

Run only against a known safe local or demo database:

```bash
npm run db:seed
```

Do not run seed commands against an important production database unless the target is explicitly confirmed safe.

Public demo product coverage includes:

| Demo need | Seed product examples |
|---|---|
| Basic cleanser | Gentle Low pH Cleanser |
| Hydration layer | Gentle Hydrating Toner |
| Oil-control serum | Niacinamide 5% Serum |
| Post-acne mark support | Azelaic Acid 10% Cream |
| Clogged-pore caution example | BHA 2% Exfoliant |
| Lightweight barrier support | Barrier Repair Moisturizer |
| Morning sunscreen | Daily Lightweight Sunscreen SPF50 |
| Product Match strong/good candidate | Niacinamide 5% Serum, Barrier Repair Moisturizer, or Daily Lightweight Sunscreen SPF50 depending on profile signals |
| Product Match caution candidate | BHA 2% Exfoliant or another active-heavy product with warning text |

Public demo ingredient coverage includes niacinamide, azelaic acid, salicylic acid/BHA, ceramide, panthenol, glycerin, hyaluronic acid, zinc PCA, green tea extract, sunscreen-related entries where represented in product text, and additional active/safety examples used by the routine safety engine.

## 4. Demo User Story

Recommended demo persona:

```txt
Name: Use the authenticated Google account display name.
Skin type: combination or oily.
Concerns: acne, oiliness, dark_spots, texture.
Sensitivity level: medium.
Budget: 300k_700k or 700k_1500k.
Experience level: beginner or intermediate.
Avoid ingredients: fragrance, essential oils.
Goal: keep a simple routine, reduce oiliness, track skin progress, and avoid unsafe active combinations.
```

Use the existing `/skin-profile` or `/onboarding/skin-profile` UI to create this profile.

## 5. Manual Demo Setup Flow

Use the deployed app or local app with a real authenticated demo account.

1. Open `/`.
2. Sign in with Google.
3. Open `/skin-profile`.
4. Create or update the demo skin profile:
   - `skinType`: `combination` or `oily`
   - `concerns`: `acne`, `oiliness`, `dark_spots`, `texture`
   - `sensitivityLevel`: `medium`
   - `budgetRange`: `300k_700k`
   - `experienceLevel`: `beginner` or `intermediate`
   - `avoidIngredients`: `fragrance`, `essential oils`
5. Open `/product-match`.
6. Confirm at least one visible product match appears, including score, level, reasons, cautions, and Save/Saved state.
7. Save one matched product.
8. Open product detail from the matched product card.
9. Open `/saved-products` and confirm the saved product is listed.
10. Open `/products`.
11. Search/filter products for cleanser, niacinamide, azelaic acid, BHA, moisturizer, sunscreen, and toner.
12. Open `/routines`.
13. Create the Morning Routine.
14. Create the Evening Routine.
15. Create the optional caution routine only if you want to demonstrate routine analysis warnings.
16. Run Routine Safety Analysis from `/routines`.
17. Add routine logs for today through `/routine-logs/today` when available.
18. Open `/journal`.
19. Add 5-7 journal entries over recent local dates.
20. Open `/insights` and review routine consistency, journal activity, symptoms, product usage, and calendar days.
21. Return to `/dashboard` and show the resulting summary.

## 6. Recommended Routines

Morning Routine:

| Order | Product | Category | Frequency | Instructions |
|---:|---|---|---|---|
| 1 | Gentle Low pH Cleanser | cleanser | daily | Massage gently, rinse, and avoid over-cleansing. |
| 2 | Niacinamide 5% Serum | serum | daily | Apply a thin layer after cleansing. |
| 3 | Barrier Repair Moisturizer | moisturizer | daily | Use enough to keep skin comfortable. |
| 4 | Daily Lightweight Sunscreen SPF50 | sunscreen | daily | Apply as the last morning step. |

Evening Routine:

| Order | Product | Category | Frequency | Instructions |
|---:|---|---|---|---|
| 1 | Gentle Low pH Cleanser | cleanser | daily | Cleanse sunscreen and daily buildup gently. |
| 2 | Azelaic Acid 10% Cream | treatment | daily | Use as the single evening active if skin feels comfortable. |
| 3 | Barrier Repair Moisturizer | moisturizer | daily | Seal the routine with a simple moisturizer. |

Optional caution routine for safety analysis:

| Order | Product | Category | Frequency | Instructions |
|---:|---|---|---|---|
| 1 | Gentle Low pH Cleanser | cleanser | daily | Keep cleansing gentle. |
| 2 | BHA 2% Exfoliant | treatment | weekly_1_2 | Use occasionally, not every night. |
| 3 | Azelaic Acid 10% Cream | treatment | daily | Avoid stacking too many actives if irritation appears. |
| 4 | Barrier Repair Moisturizer | moisturizer | daily | Keep barrier support in the routine. |

Do not add unsupported safety rules just to force a warning. Use whatever the current deterministic safety engine and mock provider return.

## 7. Suggested Routine Log Pattern

Create routine logs through the `/routines` UI. Use recent local dates when possible, or demonstrate today's log if the UI only supports current-day controls.

| Day | Morning | Evening | Demo note |
|---|---|---|---|
| Day 1 | completed | completed | Routine started consistently. |
| Day 2 | completed | skipped | Evening routine missed due to late schedule. |
| Day 3 | completed | completed | Skin feels less oily by afternoon. |
| Day 4 | completed | completed | Minor dryness managed with moisturizer. |
| Day 5 | skipped | completed | Morning routine missed, evening recovered. |
| Day 6 | completed | completed | Routine feels manageable. |
| Day 7 | completed | completed | Dashboard has meaningful tracking context. |

## 8. Suggested Journal Entries

Create entries through `/journal`. Keep wording educational and observational, not diagnostic.

| Day | Symptoms | Stress | Sleep | Notes |
|---|---|---|---:|---|
| Day 1 | oiliness, new_breakouts, redness | medium | 6.5 | Skin feels oily around the T-zone with a few active blemishes near forehead and chin. Starting a simpler routine and tracking reactions. |
| Day 2 | oiliness, new_breakouts | medium | 7 | Some clogged-pore texture remains. No strong irritation after cleanser, niacinamide, moisturizer, and sunscreen. |
| Day 3 | oiliness | low | 7.5 | Oiliness feels slightly more controlled by afternoon. A few blemishes remain, but skin feels more balanced. |
| Day 4 | dryness | medium | 6 | Mild dryness after active treatment. Added moisturizer carefully and avoided adding another active. |
| Day 5 | new_breakouts | low | 7 | Fewer active-looking blemishes today. Post-acne marks are still visible, so sunscreen remains important. |
| Day 6 | oiliness | medium | 6.5 | Skin feels calmer overall. Missed one routine but continued tracking without adding extra products. |
| Day 7 | other | low | 8 | Routine feels manageable. Less visible redness today; continue tracking progress and avoid overloading actives. |

## 9. Recommended Demo Flow

1. Open landing page.
2. Log in.
3. View Skin Profile.
4. Review Product Match.
5. Save a matched product.
6. Open Product Detail from the matched product card.
7. Open Saved Products.
8. Browse Product Catalogue.
9. View or create Morning Routine.
10. View or create Evening Routine.
11. Run Routine Safety Analysis.
12. Add or view Routine Logs.
13. Add or view Skin Journal entries.
14. Review Insights.
15. View Dashboard summary.

## 10. BA Presentation Angle

Use the demo to explain:

- user persona thinking;
- user journey from profile setup to routine tracking;
- functional requirements such as authenticated routines, Product Match, product browsing, journal entries, Insights, and dashboard summary;
- non-functional requirements such as privacy, validation, route protection, and safe copy;
- MVP scope control through explicit exclusions;
- validation mindset through lint, typecheck, tests, build, audit, and smoke testing;
- traceability from user needs to implemented features.

## 11. Technical Presentation Angle

Use the demo to explain:

- Next.js App Router structure;
- TypeScript and Zod validation;
- Tailwind/shadcn UI foundation;
- MongoDB collections and user ownership;
- Auth.js protected routes and current-user flow;
- DTO mappers at API boundaries;
- deterministic routine safety before AI;
- deterministic Product Match scoring without a new recommendation collection or external AI provider;
- routine-slot based Insights aggregation from user-owned data;
- AI provider abstraction with the mock provider for demo;
- Vitest coverage and deployment readiness;
- Vercel deployment target and environment variable discipline.

## 12. Scope Boundaries

`TASK DEMO-DATA-001` did not add:

- new product features;
- Product CRUD or admin UI;
- real OpenAI/Gemini provider integration;
- image upload or AI face analysis;
- skin score or attractiveness scoring;
- marketplace, payment, subscription, or notifications;
- medical diagnosis or treatment advice;
- new Product Match persistence collection.

Next recommended task: `GitHub Release & Portfolio Submission`.
