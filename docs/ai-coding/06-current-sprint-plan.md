# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-02

## 1. Current Sprint

```txt
MVP v1.6 - Catalogue Data Quality & Ingredient Metadata Upgrade
```

Status:

```txt
Implementation: DONE
Documentation sync: DONE
Validation: record final command results in the task report
```

## 2. Objective

Improve the quality, realism, and usefulness of the curated skincare catalogue and ingredient library so portfolio demos for Product Catalogue, Product Detail, Product Match, Ingredient Library, and Routine Safety Analysis are more convincing.

This sprint is seed-data and documentation work. It does not add new user-facing features or rewrite matching, scoring, routine safety, Auth.js, or API response architecture.

## 3. Scope

Completed scope:

```txt
[x] Expand ingredient seed data to at least 30 curated records.
[x] Expand product seed data to at least 35 curated records.
[x] Improve category, skin type, concern, active, warning, suitableFor, and notRecommendedFor metadata.
[x] Add seed validation assertions for counts, duplicate identities, required coverage, and demo support signals.
[x] Support routine-safety demo cases for missing sunscreen, active conflict, fragrance caution, barrier recovery, and uneven tone support.
[x] Update seed data spec and AI coding status docs.
[x] Update README current phase and next recommendation.
```

## 4. Non-Goals

```txt
No real AI provider integration.
No LLM or external API call.
No image upload or face analysis.
No skin score.
No marketplace, cart, checkout, payment, shipping, subscription, ratings, or reviews.
No admin CRUD.
No medical diagnosis, treatment claim, cure claim, or guaranteed result.
No new product matching algorithm.
No Product Match scoring or match-level rewrite.
No Routine Safety rule rewrite.
No database schema change.
No new dependency.
```

## 5. Acceptance Criteria

```txt
Ingredient count >= 30.
Product count >= 35.
Seed data is schema-compliant.
No duplicate ingredient inciName.
No duplicate product brand/name pair.
All product categories are covered.
All product skin types are covered.
All product concerns are covered.
Warnings and caution metadata are meaningful and educational.
Routine safety demo aliases are present in product keyActives or ingredientsText.
No diagnosis, treatment, or guaranteed-result claim is added.
Relevant documentation is synced.
Validation commands pass or failures are reported honestly.
```

## 6. Validation Commands

Run:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Run if local MongoDB is available and safe:

```txt
npm run db:indexes
npm run db:seed
```

Do not run npm audit for this sprint unless explicitly requested.

## 7. Current Seed Coverage

```txt
Ingredients: 40 curated records.
Products: 38 curated records.
Categories: cleanser, toner, serum, moisturizer, sunscreen, treatment, mask, other.
Skin types: oily, dry, combination, normal, sensitive, unknown.
Concerns: acne, oiliness, dryness, redness, dark_spots, texture, barrier_support, unknown.
Routine safety aliases: mandelic acid, salicylic acid, retinol, benzoyl peroxide, fragrance, parfum, essential oil blend.
```

## 8. Recommended Next Task

```txt
MVP v1.7 - Routine Builder Usability & Demo Flow Refinement
```

This is a recommendation only and is not part of MVP v1.6.
