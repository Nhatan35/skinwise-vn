# 14-seed-data-spec.md

# Seed Data Spec — MVP v1.2.6 Final

## 1. Purpose

This document defines the minimum safe seed data for SkinWise VN MVP.

Seed data exists to support demos, development, tests, and AI/rule-engine behavior. It must not make medical claims, guarantee results, imply product endorsement, or expand MVP scope.

This document must stay aligned with `docs/04-data-model.md`. If the data model changes later, this seed spec must be updated in the same patch.

## 2. Seed data rules

- Keep seed data small, curated, and auditable.
- Use only fields that exist in the canonical data model unless a field is explicitly marked as a non-persisted authoring note.
- Mark product verification status clearly.
- Do not use seed data to imply endorsement.
- Do not claim a product treats, cures, or guarantees improvement.
- Include enough variety to test routine categories and safety rules.
- Ingredient explanations must be educational and cautious.
- Seed scripts must not silently create new schema fields.

## 3. Ingredient seed minimum

Minimum ingredient records:

| Ingredient | Functions / Type | Common use | Safety notes |
|---|---|---|---|
| Niacinamide | active, barrier support | oil-control support, barrier support | usually beginner-friendly but irritation can still happen |
| Salicylic Acid / BHA | exfoliant | clogged pore support, exfoliation | avoid overuse; caution with sensitive skin |
| Glycolic Acid / AHA | exfoliant | surface exfoliation | avoid overuse; sunscreen is important |
| Lactic Acid / AHA | exfoliant | gentler exfoliation support | still can irritate |
| Retinol | retinoid | texture support | introduce slowly; avoid pregnancy-related advice beyond professional referral |
| Retinal | retinoid | texture support | introduce slowly |
| Adapalene | retinoid-like active in some markets | acne-related support | do not prescribe; advise professional guidance |
| Benzoyl Peroxide | acne-related active | blemish support | can dry/irritate; avoid making prescription claims |
| Vitamin C / Ascorbic Acid | antioxidant | antioxidant/brightening support | can irritate sensitive skin |
| Fragrance / Parfum | fragrance | scent | potential irritant for sensitive skin |
| Essential Oil | fragrance/volatile | scent | potential irritant |
| Ceramide | barrier support | skin barrier support | generally supportive |
| Hyaluronic Acid | humectant | hydration support | generally supportive |
| Panthenol | soothing/support | calming support | generally supportive |
| Centella Asiatica | soothing/support | calming support | generally supportive |
| Sunscreen Filters | UV protection | sun protection | daily use is important; do not overclaim |

## 4. Ingredient seed contract

Ingredient seed data must align with `docs/04-data-model.md`.

Persisted seed records must use this shape:

```ts
type IngredientSeed = {
  inciName: string;
  aliases: string[];
  functions: string[];
  commonUses: string[];
  suitableFor: string[];
  cautionFor: string[];
  avoidWith: string[];
  evidenceLevel: "basic" | "moderate" | "strong" | "uncertain";
  sourceRefs: string[];
};
```

Do not persist these non-model fields into the `Ingredient` collection:

```txt
name
category
summaryVi
beginnerNotesVi
cautionNotesVi
educationalDisclaimerVi
```

If authoring notes are helpful during manual content review, keep them outside the persisted record, for example in a separate draft document or local fixture comment. They must not be inserted into the production `Ingredient` collection unless the canonical data model is explicitly revised.

Example valid ingredient seed:

```ts
const niacinamideSeed: IngredientSeed = {
  inciName: "Niacinamide",
  aliases: ["Vitamin B3", "Nicotinamide"],
  functions: ["barrier_support", "oil_control_support"],
  commonUses: ["barrier support", "oiliness support", "beginner-friendly active"],
  suitableFor: ["oily", "combination", "normal", "barrier_support"],
  cautionFor: ["very sensitive skin", "recently irritated skin"],
  avoidWith: [],
  evidenceLevel: "moderate",
  sourceRefs: ["manual-curation"]
};
```

## 5. Product seed minimum

MVP seed products should cover at least:

| Category | Minimum count | Purpose |
|---|---:|---|
| cleanser | 2 | routine foundation |
| moisturizer | 2 | barrier support |
| sunscreen | 2 | morning routine safety |
| serum | 2 | active/support examples |
| treatment | 2 | rule engine examples |
| toner | 1 | optional step example |
| other | 1 | fallback/custom behavior |

Total recommended seed count: 12–20 products.

## 6. Product seed contract

Product seed data must align with `docs/04-data-model.md`.

Persisted seed records must use this shape:

```ts
type ProductSeed = {
  name: string;
  brand: string;
  category: "cleanser" | "moisturizer" | "sunscreen" | "treatment" | "toner" | "serum" | "mask" | "other";
  priceRange: "budget" | "mid" | "premium" | "unknown";
  ingredientsText: string;
  keyActives: string[];
  tags: string[];
  warnings: string[];
  skinTypes: Array<"oily" | "dry" | "combination" | "normal" | "sensitive" | "unknown">;
  concerns: Array<"acne" | "oiliness" | "dryness" | "redness" | "dark_spots" | "texture" | "barrier_support" | "unknown">;
  suitableFor: string[];
  notRecommendedFor: string[];
  source: "manual";
  verificationStatus: "reviewed" | "verified";
};
```

Do not use these values in MVP product seed data:

```txt
priceRange: "mid_range"
source: "seed"
```

Rationale:

- `priceRange` must use the canonical enum value `"mid"` from the Product model.
- `source` must use `"manual"` because `"seed"` is not part of the Product model. Seed data is inserted manually/administratively, but the persisted value remains model-compliant.
- `verificationStatus` should be `"reviewed"` or `"verified"` so seed products can appear safely in demo/search flows.

Example valid product seed:

```ts
const exampleCleanserSeed: ProductSeed = {
  name: "Example Gentle Cleanser",
  brand: "Example Brand",
  category: "cleanser",
  priceRange: "budget",
  ingredientsText: "Water, Glycerin, Mild Surfactant, Panthenol",
  keyActives: ["Panthenol"],
  tags: ["gentle", "basic-routine"],
  warnings: [],
  skinTypes: ["normal", "combination", "sensitive"],
  concerns: ["dryness", "barrier_support"],
  suitableFor: ["basic morning routine", "basic evening routine"],
  notRecommendedFor: ["known allergy to listed ingredients"],
  source: "manual",
  verificationStatus: "reviewed"
};
```

## 7. Seed data safety examples

Good product note:

```txt
Phù hợp để minh họa routine cơ bản. Người dùng vẫn nên patch test và theo dõi phản ứng da.
```

Bad product note:

```txt
Trị sạch mụn sau 7 ngày.
```

Good ingredient note:

```txt
Thành phần này thường được dùng để hỗ trợ hàng rào bảo vệ da, nhưng mỗi người có thể phản ứng khác nhau.
```

Bad ingredient note:

```txt
Thành phần này chắc chắn chữa khỏi mụn.
```

## 8. Rule engine seed requirements

Seed data must allow testing these cases:

- morning routine missing sunscreen;
- routine with too many strong actives;
- retinoid plus AHA/BHA caution;
- sensitive skin plus fragrance caution;
- beginner routine too complex;
- moisturizing/barrier support missing.

## 9. Seed script location

Recommended future location:

```txt
scripts/seed.ts
src/infrastructure/database/seed-data/
```

Do not create a seed script until database foundation exists.

When a seed script is created, it must:

- validate seed data against Zod schemas before insertion;
- use the canonical enum values from `docs/04-data-model.md`;
- avoid creating fields not present in the target collection model;
- be idempotent where practical;
- avoid overwriting user-created data.
