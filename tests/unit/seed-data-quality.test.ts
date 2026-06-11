import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import { analyzeRoutineSafety } from "@/domain/routine-safety/routine-safety-engine";
import type {
  RoutineSafetyRuleCode,
  RoutineSafetyStep,
} from "@/domain/routine-safety/routine-safety.types";
import { INGREDIENT_EVIDENCE_LEVELS } from "@/modules/ingredients/ingredient.types";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_SKIN_TYPES,
  type Product,
} from "@/modules/products/product.types";
import { scoreProductMatch } from "@/modules/product-match/product-match.scoring";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";
import { validateSeedData } from "../../scripts/seed";

const fixedDate = new Date("2026-06-05T00:00:00.000Z");
const MINIMUM_V1_24_PRODUCT_COUNT = 70;
const MINIMUM_V1_24_INGREDIENT_COUNT = 70;
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
  "gluconolactone",
  "lactobionic acid",
  "kojic acid",
  "tea tree oil",
  "sulfur",
  "vitamin c",
  "ascorbic acid",
] as const;
const unsafeMedicalClaimPhrases = [
  "cure acne",
  "cures acne",
  "treats eczema",
  "fixes rosacea",
  "guaranteed whitening",
  "guaranteed results",
  "permanent results",
  "diagnoses",
  "medical treatment",
  "disease treatment",
  "prescription-strength",
] as const;

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

function ingredientSearchText(
  ingredient: ReturnType<typeof validateSeedData>["ingredients"][number],
) {
  return [
    ingredient.inciName,
    ...ingredient.aliases,
    ...ingredient.functions,
    ...ingredient.commonUses,
    ...ingredient.suitableFor,
    ...ingredient.cautionFor,
    ...ingredient.avoidWith,
    ingredient.evidenceLevel,
    ...ingredient.sourceRefs,
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

function toRoutineSafetyStep(product: Product, order: number): RoutineSafetyStep {
  return {
    stepId: `seed-step-${order}`,
    productId: product._id.toHexString(),
    category: product.category,
    order,
    productNameSnapshot: product.name,
    brandSnapshot: product.brand,
    keyActivesSnapshot: product.keyActives,
    ingredientTextSnapshot: product.ingredientsText,
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

function requireProduct(
  products: Product[],
  predicate: (product: Product) => boolean,
  label: string,
) {
  const product = products.find(predicate);

  expect(product, `Missing seed product for ${label}`).toBeDefined();

  return product as Product;
}

function hasValidIsoishText(value: string) {
  return value.trim().length > 0;
}

describe("v1.24 seed data quality", () => {
  it("keeps product and ingredient counts at the v1.24 baseline", () => {
    const seedData = validateSeedData();

    expect(seedData.products.length).toBeGreaterThanOrEqual(
      MINIMUM_V1_24_PRODUCT_COUNT,
    );
    expect(seedData.ingredients.length).toBeGreaterThanOrEqual(
      MINIMUM_V1_24_INGREDIENT_COUNT,
    );
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

  it("keeps required product fields populated and enum-bound", () => {
    const { products } = validateSeedData();
    const allowedCategories = new Set(PRODUCT_CATEGORIES);
    const allowedSkinTypes = new Set(PRODUCT_SKIN_TYPES);
    const allowedConcerns = new Set(PRODUCT_CONCERNS);

    for (const product of products) {
      expect(hasValidIsoishText(product.name), product.name).toBe(true);
      expect(hasValidIsoishText(product.brand), product.name).toBe(true);
      expect(hasValidIsoishText(product.ingredientsText), product.name).toBe(true);
      expect(product.keyActives.length, product.name).toBeGreaterThan(0);
      expect(product.tags.length, product.name).toBeGreaterThan(0);
      expect(product.skinTypes.length, product.name).toBeGreaterThan(0);
      expect(product.concerns.length, product.name).toBeGreaterThan(0);
      expect(product.suitableFor.length, product.name).toBeGreaterThan(0);
      expect(product.notRecommendedFor.length, product.name).toBeGreaterThan(0);
      expect(allowedCategories.has(product.category), product.name).toBe(true);

      for (const skinType of product.skinTypes) {
        expect(allowedSkinTypes.has(skinType), `${product.name}: ${skinType}`).toBe(true);
      }

      for (const concern of product.concerns) {
        expect(allowedConcerns.has(concern), `${product.name}: ${concern}`).toBe(true);
      }
    }
  });

  it("keeps required ingredient fields populated and evidence-bound", () => {
    const { ingredients } = validateSeedData();
    const allowedEvidenceLevels = new Set(INGREDIENT_EVIDENCE_LEVELS);

    for (const ingredient of ingredients) {
      expect(hasValidIsoishText(ingredient.inciName), ingredient.inciName).toBe(true);
      expect(ingredient.aliases.length, ingredient.inciName).toBeGreaterThan(0);
      expect(ingredient.functions.length, ingredient.inciName).toBeGreaterThan(0);
      expect(ingredient.commonUses.length, ingredient.inciName).toBeGreaterThan(0);
      expect(ingredient.suitableFor.length, ingredient.inciName).toBeGreaterThan(0);
      expect(ingredient.cautionFor.length, ingredient.inciName).toBeGreaterThan(0);
      expect(ingredient.sourceRefs.length, ingredient.inciName).toBeGreaterThan(0);
      expect(allowedEvidenceLevels.has(ingredient.evidenceLevel), ingredient.inciName).toBe(
        true,
      );
    }
  });

  it("includes core ingredient function and soothing coverage", () => {
    const { ingredients } = validateSeedData();
    const inciNames = new Set(
      ingredients.map((ingredient) => ingredient.inciName),
    );
    const ingredientFunctions = new Set(
      ingredients.flatMap((ingredient) => ingredient.functions.map(normalize)),
    );

    expect([...inciNames]).toEqual(
      expect.arrayContaining([
        "Centella Asiatica Extract",
        "Madecassoside",
        "Allantoin",
        "Bisabolol",
        "Green Tea Extract",
        "Oat Extract",
        "Colloidal Oatmeal",
        "Chamomile Extract",
        "Ectoin",
        "Polyglutamic Acid",
      ]),
    );
    expect([...ingredientFunctions]).toEqual(
      expect.arrayContaining([
        "humectant",
        "emollient",
        "occlusive",
        "soothing",
        "antioxidant",
        "exfoliant",
        "barrier_support",
        "uv_filter",
        "fragrance_component",
      ]),
    );
  });

  it("covers all product matching categories, skin types, and concerns", () => {
    const seedData = validateSeedData();

    expect(new Set(seedData.products.map((product) => product.category))).toEqual(
      new Set(PRODUCT_CATEGORIES),
    );
    expect(new Set(seedData.products.flatMap((product) => product.skinTypes))).toEqual(
      new Set(PRODUCT_SKIN_TYPES),
    );
    expect(new Set(seedData.products.flatMap((product) => product.concerns))).toEqual(
      new Set(PRODUCT_CONCERNS),
    );
  });

  it("keeps sunscreen, barrier-support, and strong active products represented", () => {
    const products = validateSeedData().products.map(toProduct);
    const sunscreenProducts = products.filter((product) => product.category === "sunscreen");
    const barrierProducts = products.filter((product) =>
      product.concerns.includes("barrier_support"),
    );
    const strongActiveProducts = products.filter((product) =>
      strongActiveTerms.some((term) => productSearchText(product).includes(term)),
    );

    expect(sunscreenProducts.length).toBeGreaterThanOrEqual(10);
    expect(barrierProducts.length).toBeGreaterThanOrEqual(20);
    expect(strongActiveProducts.length).toBeGreaterThanOrEqual(10);
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
      "Lactobionic Acid",
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

  it("keeps seed copy inside the non-medical claims boundary", () => {
    const seedData = validateSeedData();
    const productCopy = seedData.products.map((product) =>
      [
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
        .toLowerCase(),
    );
    const ingredientCopy = seedData.ingredients.map(ingredientSearchText);

    for (const copy of [...productCopy, ...ingredientCopy]) {
      for (const unsafePhrase of unsafeMedicalClaimPhrases) {
        expect(copy).not.toContain(unsafePhrase);
      }
    }
  });

  it("returns useful product match candidates for common demo profiles", () => {
    const products = validateSeedData().products.map(toProduct);
    const demoProfiles = [
      {
        label: "oily + acne concern",
        profile: createSkinProfile({
          skinType: "oily",
          concerns: ["acne", "oiliness"],
          budgetRange: "300k_700k",
        }),
        minimumCandidates: 4,
      },
      {
        label: "dry + sensitive",
        profile: createSkinProfile({
          skinType: "dry",
          concerns: ["dryness", "barrier_support", "redness"],
          sensitivityLevel: "high",
          budgetRange: "700k_1500k",
        }),
        minimumCandidates: 5,
      },
      {
        label: "combination + dullness/texture",
        profile: createSkinProfile({
          skinType: "combination",
          concerns: ["dark_spots", "texture"],
          budgetRange: "700k_1500k",
          experienceLevel: "intermediate",
        }),
        minimumCandidates: 4,
      },
      {
        label: "normal + sunscreen focus",
        profile: createSkinProfile({
          skinType: "normal",
          concerns: ["dark_spots", "barrier_support"],
          budgetRange: "300k_700k",
        }),
        minimumCandidates: 3,
        productFilter: (product: Product) => product.category === "sunscreen",
      },
      {
        label: "dehydrated-feeling + barrier concern",
        profile: createSkinProfile({
          skinType: "dry",
          concerns: ["dryness", "barrier_support"],
          budgetRange: "300k_700k",
        }),
        minimumCandidates: 5,
      },
    ];

    for (const { label, profile, minimumCandidates, productFilter } of demoProfiles) {
      const candidateProducts = products.filter((product) => {
        const hasSkinType = product.skinTypes.includes(profile.skinType);
        const hasConcern = profile.concerns.some(
          (concern) => concern !== "unknown" && product.concerns.includes(concern),
        );

        return hasSkinType && hasConcern && (!productFilter || productFilter(product));
      });
      const bestMatch = products
        .map((product) => scoreProductMatch({ product, skinProfile: profile }))
        .sort((left, right) => right.matchScore - left.matchScore)[0];

      expect(candidateProducts.length, label).toBeGreaterThanOrEqual(minimumCandidates);
      expect(bestMatch?.matchScore, label).toBeGreaterThanOrEqual(70);
      expect(bestMatch?.matchedSignals.skinType, label).toBe(true);
      expect(bestMatch?.matchedSignals.concerns.length, label).toBeGreaterThan(0);
    }
  });

  it("supports routine safety demo cases with existing safety rules", () => {
    const products = validateSeedData().products.map(toProduct);
    const retinoid = requireProduct(
      products,
      (product) => productSearchText(product).includes("retinal"),
      "retinoid active overlap",
    );
    const exfoliant = requireProduct(
      products,
      (product) =>
        productSearchText(product).includes("salicylic acid") ||
        productSearchText(product).includes("lactobionic acid"),
      "exfoliant active overlap",
    );
    const benzoylPeroxide = requireProduct(
      products,
      (product) => productSearchText(product).includes("benzoyl peroxide"),
      "too many actives",
    );
    const moisturizer = requireProduct(
      products,
      (product) =>
        product.category === "moisturizer" &&
        product.concerns.includes("barrier_support"),
      "barrier support moisturizer",
    );
    const fragrancedToner = requireProduct(
      products,
      (product) =>
        product.category === "toner" &&
        product.ingredientsText.toLowerCase().includes("fragrance"),
      "fragranced toner sensitivity caution",
    );
    const fragrancedMask = requireProduct(
      products,
      (product) =>
        product.category === "mask" &&
        product.ingredientsText.toLowerCase().includes("parfum"),
      "fragranced mask sensitivity caution",
    );
    const activeOverlapResult = analyzeRoutineSafety({
      routine: {
        name: "Seed active overlap demo",
        timeOfDay: "evening",
        steps: [retinoid, exfoliant, benzoylPeroxide, moisturizer].map(
          toRoutineSafetyStep,
        ),
      },
      skinProfile: {
        skinType: "combination",
        sensitivityLevel: "medium",
        experienceLevel: "intermediate",
      },
    });
    const activeRuleCodes = activeOverlapResult.triggeredRules.map(
      (rule) => rule.code,
    );
    const morningResult = analyzeRoutineSafety({
      routine: {
        name: "Seed morning active without sunscreen demo",
        timeOfDay: "morning",
        steps: [exfoliant, moisturizer].map(toRoutineSafetyStep),
      },
      skinProfile: {
        skinType: "dry",
        sensitivityLevel: "medium",
        experienceLevel: "beginner",
      },
    });
    const fragranceResult = analyzeRoutineSafety({
      routine: {
        name: "Seed fragrance caution demo",
        timeOfDay: "evening",
        steps: [fragrancedToner, fragrancedMask, moisturizer].map(
          toRoutineSafetyStep,
        ),
      },
      skinProfile: {
        skinType: "sensitive",
        sensitivityLevel: "high",
        experienceLevel: "beginner",
      },
    });
    const fragranceRuleCodes = fragranceResult.triggeredRules.map(
      (rule) => rule.code,
    );

    expect(activeRuleCodes).toEqual(
      expect.arrayContaining<RoutineSafetyRuleCode>([
        "TOO_MANY_ACTIVES",
        "RETINOID_PLUS_EXFOLIANT",
      ]),
    );
    expect(morningResult.triggeredRules.map((rule) => rule.code)).toContain(
      "MISSING_SUNSCREEN_AM",
    );
    expect(fragranceRuleCodes).toContain("FRAGRANCE_SENSITIVE_CAUTION");
  });
});
