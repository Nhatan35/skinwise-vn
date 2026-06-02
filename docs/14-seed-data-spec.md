# Seed Data Spec - MVP v1.6 Catalogue Data Quality Upgrade

Last updated: 2026-06-02

## 1. Purpose

Seed data supports local development, tests, portfolio demos, Product Catalogue, Product Detail, Ingredient Library, Product Match, and Routine Safety Analysis.

The v1.6 upgrade improves catalogue realism and metadata quality without adding new application features, new schema fields, real AI provider integration, marketplace behavior, medical diagnosis, or treatment claims.

## 2. Data Size Targets

Ingredient catalogue:

```txt
Minimum: 30 curated records
Target range: 30-40 curated records
Current v1.6 seed: 40 curated records
```

Product catalogue:

```txt
Minimum: 35 curated records
Target range: 35-45 curated records
Current v1.6 seed: 38 curated records
```

## 3. Ingredient Coverage

The ingredient seed set should cover:

- Barrier support: ceramides, cholesterol, fatty acids, panthenol, squalane.
- Hydration: glycerin, hyaluronic acid, betaine, sodium PCA, urea-style humectant coverage where represented.
- Oiliness and acne-support positioning: niacinamide, salicylic acid, zinc PCA, benzoyl peroxide, sulfur.
- Exfoliation: AHA/BHA/PHA examples such as salicylic acid, glycolic acid, lactic acid, mandelic acid, and gluconolactone.
- Retinoid-related ingredients: retinol, retinal, adapalene.
- Tone support: azelaic acid, vitamin C/ascorbic acid, tranexamic acid, alpha arbutin, licorice root extract.
- Soothing support: centella asiatica, madecassoside, allantoin, green tea extract.
- Sunscreen filters: zinc oxide, avobenzone, Tinosorb S/BEMT-style UV filter coverage.
- Potential irritants: fragrance/parfum/perfume, essential oil blend, alcohol denat., menthol.
- Texture, emollient, and occlusive support: dimethicone, shea butter, petrolatum, squalane.

Ingredient records must use the existing schema:

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

## 4. Product Coverage

The v1.6 product seed set targets this distribution:

| Category | Target count |
|---|---:|
| cleanser | 4 |
| toner | 3 |
| serum | 9 |
| moisturizer | 6 |
| sunscreen | 6 |
| treatment | 7 |
| mask | 2 |
| other | 1 |

Products must cover these skin types:

```txt
oily, dry, combination, normal, sensitive, unknown
```

Products must cover these concerns:

```txt
acne, oiliness, dryness, redness, dark_spots, texture, barrier_support, unknown
```

Product records must use the existing schema and canonical enum values:

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

## 5. MVP v1.6 Data Quality Rules

- Use fictional but realistic product and brand names.
- Preserve deterministic seed product names that tests or demo docs use as anchors.
- Keep seed data schema-compliant and manually curated.
- Use canonical enum values only.
- Do not add fields that the current Product or Ingredient models do not accept.
- Do not introduce duplicate ingredient `inciName` values.
- Do not introduce duplicate product `brand + name` pairs.
- Include meaningful warnings, `suitableFor`, and `notRecommendedFor` metadata.
- Include enough sunscreen, exfoliant, retinoid, benzoyl peroxide, fragrance, and barrier-support products to demo matching and routine-safety behavior.
- Keep catalogue/list performance unchanged; seed data quality should improve existing flows without requiring catalogue-wide personalized explanation generation.

## 6. Routine Safety Demo Support

The seed catalogue should support:

- Missing sunscreen warning in a morning routine without a sunscreen step.
- Active conflict examples using routine-safety-recognized aliases:
  - `mandelic acid` or `AHA`
  - `salicylic acid` or `BHA`
  - `retinol`, `retinal`, `adapalene`, or `retinoid`
  - `benzoyl peroxide`
- Sensitive-skin fragrance caution examples using:
  - `fragrance`
  - `parfum`
  - `perfume`
  - `essential oil blend`
- Barrier recovery examples using:
  - ceramide
  - panthenol
  - glycerin
  - cholesterol
  - fatty acids
  - squalane
- Uneven tone support examples using:
  - sunscreen
  - azelaic acid
  - vitamin C / ascorbic acid
  - tranexamic acid
  - alpha arbutin
  - niacinamide

## 7. Seed Validation

`scripts/seed.ts` validates seed records before writing to MongoDB.

Validation covers:

- Zod schema compliance.
- Ingredient count >= 30.
- Product count >= 35.
- Duplicate ingredient `inciName` detection.
- Duplicate product `brand + name` detection.
- Required product category coverage.
- Required skin type coverage.
- Required concern coverage.
- Active conflict demo data.
- Sunscreen demo data.
- Sensitive-skin fragrance demo data.
- Barrier recovery demo data.
- Dark spots / uneven tone support demo data.

The seed script must preserve existing upsert behavior:

- Ingredients use `inciName` as stable identity.
- Products use `brand + name + source` as stable identity.

## 8. Safety And Claim Boundaries

Seed data is manually curated demo data. It is educational and not medical advice.

Do not use seed data to claim:

- diagnosis;
- treatment or cure;
- guaranteed results;
- permanent removal of acne, scars, melasma, rosacea, eczema, dermatitis, or other medical concerns;
- suitability for everyone;
- zero risk;
- dermatologist or doctor endorsement unless an actual verified source system exists.

User-facing metadata should use cautious wording such as:

```txt
supports
may help support
commonly used for
use with caution
patch test first
introduce slowly
consult a professional for medical concerns
```
