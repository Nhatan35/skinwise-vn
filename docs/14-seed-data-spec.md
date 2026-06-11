# Seed Data Specification - MVP v1.24 Seed Data Quality Expansion Round 2

Last updated: 2026-06-11

## 1. Purpose

Seed data supports realistic demo, local development, automated testing, and portfolio/interview walkthrough flows for SkinWise VN.

The v1.24 seed baseline supports these existing MVP flows:

- Product Catalogue.
- Product Detail.
- Ingredient Library.
- Product Match.
- Routine Builder.
- Routine Safety Analysis.
- Insights/demo scenarios.
- Portfolio/interview walkthroughs.

The v1.24 closeout is documentation, release evidence, status sync, and validation work. It does not add product features, schema fields, collections, enum values, diagnosis logic, treatment advice, skin scoring, image analysis, admin CRUD, payment, checkout, marketplace, order workflow, or real AI provider integration.

## 2. Current v1.24 Baseline

| Field | Value |
|---|---:|
| Last updated milestone | v1.24 |
| Product seed count | 70 |
| Ingredient seed count | 70 |
| Minimum product count | 70 |
| Minimum ingredient count | 70 |

Current product category coverage from `scripts/seed.ts`:

| Category | Current count |
|---|---:|
| cleanser | 7 |
| moisturizer | 12 |
| sunscreen | 11 |
| serum | 16 |
| treatment | 10 |
| toner | 6 |
| mask | 5 |
| other | 3 |

Current product skin type coverage from `scripts/seed.ts`:

| Skin type | Current count |
|---|---:|
| oily | 28 |
| dry | 36 |
| combination | 54 |
| normal | 58 |
| sensitive | 37 |
| unknown | 4 |

Current product concern coverage from `scripts/seed.ts`:

| Concern | Current count |
|---|---:|
| acne | 14 |
| oiliness | 21 |
| dryness | 36 |
| redness | 29 |
| dark_spots | 24 |
| texture | 27 |
| barrier_support | 44 |
| unknown | 4 |

Historical baseline:

| Milestone | Product count | Ingredient count | Notes |
|---|---:|---:|---|
| v1.14 | 58 | 59 | Historical data quality expansion baseline only. Not the current baseline. |
| v1.24 | 70 | 70 | Current seed data quality baseline. |

## 3. Product Data Requirements

Product records must use the existing schema and canonical enum values only:

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

Product seed data requirements:

- Minimum 70 records.
- Required fields must be present and non-empty where enforced by the Zod schema.
- Product categories must use existing `PRODUCT_CATEGORIES` values only.
- Product skin types must use existing `PRODUCT_SKIN_TYPES` values only.
- Product concerns must use existing `PRODUCT_CONCERNS` values only.
- Coverage must include all current product categories, skin types, and concerns.
- Product names must be unique.
- Product `brand + name` pairs must be unique.
- Strong-active products must include caution warnings when strong-active signals are present.
- Sunscreen, barrier-support, fragrance-caution, uneven-tone, and active-overlap demo coverage must remain represented.
- Product copy must stay within cosmetic education and product-fit support. It must not introduce diagnosis, treatment, cure, guarantee, or medical recommendation claims.

## 4. Ingredient Data Requirements

Ingredient records must use the existing schema only:

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

Ingredient seed data requirements:

- Minimum 70 records.
- Required fields must be present and non-empty where enforced by the Zod schema.
- Ingredient `inciName` values must be unique.
- Ingredient aliases must be unique across records when aliases exist.
- Evidence level must use an existing `INGREDIENT_EVIDENCE_LEVELS` value.
- Function/category coverage should include humectants, emollients, occlusives, soothing support, antioxidants, exfoliants, barrier support, UV filters, fragrance components, oil-balance support, active ingredients, texture support, and tone support where present in the existing seed data.
- Strong active ingredients must include caution metadata when required by the seed validator/tests.
- Ingredient copy must remain safe educational copy and must not imply diagnosis, treatment, cure, guaranteed outcomes, or medical advice.

## 5. Product Match Coverage

The v1.24 seed quality tests verify Product Match usefulness for these supported demo profiles:

- Oily/acne-prone.
- Dry/sensitive.
- Combination/dullness or texture.
- Normal/sunscreen focus.
- Dehydrated-feeling/barrier concern.

Each supported demo profile must have enough candidate products and a useful top match according to the existing deterministic Product Match scoring rules. The seed data must improve demo coverage without rewriting Product Match logic.

## 6. Routine Safety Coverage

The v1.24 seed quality tests verify Routine Safety Analysis demo support for these existing-rule cases:

- Active overlap.
- Retinoid plus exfoliant caution.
- Too many actives caution.
- Sunscreen reminder for a morning routine without sunscreen.
- Barrier support via moisturizer coverage.
- Sensitivity/fragrance caution.

The seed data must improve Routine Safety demo coverage without rewriting Routine Safety Analysis logic.

## 7. Safety and Claims Boundary

SkinWise VN seed data is curated demo/educational data. It is not medical guidance.

The seed data and supporting copy must not claim:

- Diagnosis.
- Treatment advice.
- Cure claims.
- Guaranteed results.
- Medical recommendation logic.
- Permanent removal of acne, scars, melasma, rosacea, eczema, dermatitis, or other medical concerns.
- Suitability for everyone.
- Zero risk.
- Doctor or dermatologist endorsement unless a verified source system exists.

Allowed wording should remain cautious and educational, for example:

```txt
supports
may help support
commonly used for
use with caution
patch test first
introduce slowly
consult a professional for medical concerns
```

## 8. Validation

Required v1.24 validation commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=moderate
```

The v1.24 seed data quality baseline is enforced by `scripts/seed.ts` and `tests/unit/seed-data-quality.test.ts`.

Validation covers:

- Product count minimum: 70.
- Ingredient count minimum: 70.
- Zod schema compliance.
- Required product fields.
- Required ingredient fields.
- Duplicate ingredient `inciName` detection.
- Duplicate ingredient alias detection.
- Duplicate product name detection.
- Duplicate product `brand + name` detection.
- Required product category coverage.
- Required skin type coverage.
- Required concern coverage.
- Sunscreen demo data.
- Active-overlap demo data.
- Sensitive-skin fragrance demo data.
- Barrier recovery demo data.
- Uneven-tone demo data.
- Strong active product caution warnings.
- Strong active ingredient caution metadata.
- Product Match demo profile coverage.
- Routine Safety demo case coverage.
- Non-medical claims boundary.

The seed script must preserve existing upsert behavior:

- Ingredients use `inciName` as stable identity.
- Products use `brand + name + source` as stable identity.
