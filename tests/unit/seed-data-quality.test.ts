import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import type { Product } from "@/modules/products/product.types";
import { scoreProductMatch } from "@/modules/product-match/product-match.scoring";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";
import { validateSeedData } from "../../scripts/seed";

const fixedDate = new Date("2026-06-05T00:00:00.000Z");
const strongActiveTerms = [
  "aha",
  "bha",
  "retinol",
  "retinal",
  "retinoid",
  "adapalene",
  "benzoyl peroxide",
  "salicylic acid",
  "glycolic acid",
  "lactic acid",
  "mandelic acid",
  "kojic acid",
  "tea tree oil",
  "sulfur",
  "vitamin c",
  "ascorbic acid",
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function uniqueCount(values: string[]) {
  return new Set(values.map(normalize)).size;
}

function productSearchText(product: Product) {
  return [
    product.name,
    product.brand,
    product.ingredientsText,
    ...product.keyActives,
    ...product.tags,
    ...product.warnings,
    ...product.suitableFor,
    ...product.notRecommendedFor,
  ]
    .join(" ")
    .toLowerCase();
}

function toProduct(product: ReturnType<typeof validateSeedData>["products"][number]): Product {
  return {
    _id: new ObjectId(),
    ...product,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

function createSkinProfile(
  overrides: Partial<SkinProfile>,
): SkinProfile {
  return {
    _id: new ObjectId(),
    userId: "seed-quality-user",
    skinType: "unknown",
    concerns: ["unknown"],
    sensitivityLevel: "medium",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredients: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("v1.14 seed data quality", () => {
  it("keeps product and ingredient counts at the v1.14 baseline", () => {
    const seedData = validateSeedData();

    expect(seedData.products.length).toBeGreaterThanOrEqual(55);
    expect(seedData.ingredients.length).toBeGreaterThanOrEqual(55);
  });

  it("keeps product and ingredient identities unique", () => {
    const seedData = validateSeedData();
    const productNames = seedData.products.map((product) => product.name);
    const productBrandNamePairs = seedData.products.map(
      (product) => `${product.brand}::${product.name}`,
    );
    const ingredientNames = seedData.ingredients.map(
      (ingredient) => ingredient.inciName,
    );

    expect(uniqueCount(productNames)).toBe(productNames.length);
    expect(uniqueCount(productBrandNamePairs)).toBe(productBrandNamePairs.length);
    expect(uniqueCount(ingredientNames)).toBe(ingredientNames.length);
  });



  it("keeps ingredient aliases unique across ingredient records", () => {
    const { ingredients } = validateSeedData();
    const aliasOwners = new Map<string, string>();

    for (const ingredient of ingredients) {
      for (const alias of ingredient.aliases) {
        const normalizedAlias = normalize(alias);
        const existingOwner = aliasOwners.get(normalizedAlias);

        expect(
          existingOwner,
          `${alias} is used by both ${existingOwner} and ${ingredient.inciName}`,
        ).toBeUndefined();

        aliasOwners.set(normalizedAlias, ingredient.inciName);
      }
    }
  });

  it("includes core soothing ingredient coverage", () => {
    const { ingredients } = validateSeedData();
    const inciNames = new Set(
      ingredients.map((ingredient) => ingredient.inciName),
    );

    expect([...inciNames]).toEqual(
      expect.arrayContaining([
        "Centella Asiatica Extract",
        "Madecassoside",
        "Allantoin",
        "Bisabolol",
        "Green Tea Extract",
        "Oat Extract",
      ]),
    );
  });

  it("covers all product matching categories, skin types, and concerns", () => {
    const seedData = validateSeedData();

    expect(new Set(seedData.products.map((product) => product.category))).toEqual(
      new Set([
        "cleanser",
        "moisturizer",
        "sunscreen",
        "treatment",
        "toner",
        "serum",
        "mask",
        "other",
      ]),
    );
    expect(new Set(seedData.products.flatMap((product) => product.skinTypes))).toEqual(
      new Set(["oily", "dry", "combination", "normal", "sensitive", "unknown"]),
    );
    expect(new Set(seedData.products.flatMap((product) => product.concerns))).toEqual(
      new Set([
        "acne",
        "oiliness",
        "dryness",
        "redness",
        "dark_spots",
        "texture",
        "barrier_support",
        "unknown",
      ]),
    );
  });

  it("keeps strong active products and ingredients safety-bounded", () => {
    const seedData = validateSeedData();
    const strongActiveIngredients = new Set([
      "Salicylic Acid",
      "Benzoyl Peroxide",
      "Sulfur",
      "Tea Tree Oil",
      "Retinol",
      "Retinal",
      "Adapalene",
      "Glycolic Acid",
      "Lactic Acid",
      "Mandelic Acid",
      "Gluconolactone",
      "Kojic Acid",
      "Vitamin C",
      "Sodium Ascorbyl Phosphate",
    ]);

    for (const product of seedData.products.map(toProduct)) {
      const activeText = productSearchText(product);

      if (strongActiveTerms.some((term) => activeText.includes(term))) {
        expect(product.warnings.length, product.name).toBeGreaterThan(0);
      }
    }

    for (const ingredient of seedData.ingredients) {
      if (strongActiveIngredients.has(ingredient.inciName)) {
        expect(ingredient.cautionFor.length, ingredient.inciName).toBeGreaterThan(0);
      }
    }
  });

  it("returns useful product match candidates for common demo profiles", () => {
    const products = validateSeedData().products.map(toProduct);
    const demoProfiles = [
      createSkinProfile({
        skinType: "oily",
        concerns: ["acne", "oiliness"],
        budgetRange: "300k_700k",
      }),
      createSkinProfile({
        skinType: "dry",
        concerns: ["dryness", "barrier_support"],
        budgetRange: "700k_1500k",
      }),
      createSkinProfile({
        skinType: "sensitive",
        concerns: ["redness", "barrier_support"],
        sensitivityLevel: "high",
        budgetRange: "300k_700k",
      }),
      createSkinProfile({
        skinType: "combination",
        concerns: ["dark_spots", "texture"],
        budgetRange: "700k_1500k",
        experienceLevel: "intermediate",
      }),
    ];

    for (const skinProfile of demoProfiles) {
      const bestMatch = products
        .map((product) => scoreProductMatch({ product, skinProfile }))
        .sort((left, right) => right.matchScore - left.matchScore)[0];

      expect(bestMatch?.matchScore).toBeGreaterThanOrEqual(70);
      expect(bestMatch?.matchedSignals.skinType).toBe(true);
      expect(bestMatch?.matchedSignals.concerns.length).toBeGreaterThan(0);
    }
  });
});
