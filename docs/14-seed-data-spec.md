# Seed Data Spec - MVP v1.14 Data Quality Expansion

Last updated: 2026-06-05

## 1. Purpose

Seed data supports local development, tests, portfolio demos, Product Catalogue, Product Detail, Ingredient Library, Product Match, and Routine Safety Analysis.

The v1.14 upgrade improves catalogue realism, Product Match coverage, and ingredient education quality without adding new application features, new schema fields, real AI provider integration, marketplace behavior, medical diagnosis, or treatment claims.

## 2. Data Size Targets

Ingredient catalogue:

```txt
Minimum: 55 curated records
Target range: 55-60 curated records
Current v1.14 seed: 59 curated records
```

Product catalogue:

```txt
Minimum: 55 curated records
Target range: 55-60 curated records
Current v1.14 seed: 58 curated records
```

## 3. Ingredient Coverage

The ingredient seed set should cover:

- Barrier support: ceramides, cholesterol, fatty acids, panthenol, squalane, beta-glucan, oat support.
- Hydration: glycerin, hyaluronic acid, betaine, sodium PCA, urea, trehalose, aloe.
- Oiliness and acne-support positioning: niacinamide, salicylic acid, zinc PCA, benzoyl peroxide, sulfur.
- Exfoliation: AHA/BHA/PHA examples such as salicylic acid, glycolic acid, lactic acid, mandelic acid, and gluconolactone.
- Retinoid-related ingredients: retinol, retinal, adapalene.
- Tone support: azelaic acid, vitamin C/ascorbic acid, sodium ascorbyl phosphate, tranexamic acid, alpha arbutin, kojic acid, licorice root extract.
- Soothing support: centella asiatica, madecassoside, allantoin, bisabolol, green tea extract, oat extract, aloe.
- Sunscreen filters: zinc oxide, titanium dioxide, avobenzone, DHHB, octocrylene, Tinosorb S/BEMT-style UV filter coverage.
- Potential irritants: fragrance/parfum/perfume, essential oil blend, alcohol denat., menthol, tea tree oil.
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

The v1.14 product seed set has this distribution:

| Category | Current count |
|---|---:|
| cleanser | 6 |
| toner | 5 |
| serum | 13 |
| moisturizer | 10 |
| sunscreen | 9 |
| treatment | 9 |
| mask | 4 |
| other | 2 |

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

## 5. MVP v1.14 Data Quality Rules

- Use fictional but realistic product and brand names.
- Preserve deterministic seed product names that tests or demo docs use as anchors.
- Keep seed data schema-compliant and manually curated.
- Use canonical enum values only.
- Do not add fields that the current Product or Ingredient models do not accept.
- Do not introduce duplicate ingredient `inciName` values.
- Do not introduce duplicate product names or duplicate product `brand + name` pairs.
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
- Ingredient count >= 55.
- Product count >= 55.
- Duplicate ingredient `inciName` detection.
- Duplicate product name detection.
- Duplicate product `brand + name` detection.
- Required product category coverage.
- Required skin type coverage.
- Required concern coverage.
- Active conflict demo data.
- Sunscreen demo data.
- Sensitive-skin fragrance demo data.
- Barrier recovery demo data.
- Dark spots / uneven tone support demo data.
- Strong active products must include caution warnings.
- Strong active ingredients must include caution metadata.
- Unit tests verify v1.14 count, uniqueness, coverage, strong-active safety, and Product Match usefulness.

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
