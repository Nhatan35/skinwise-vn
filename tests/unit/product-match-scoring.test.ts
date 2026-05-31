import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import type { Product } from "@/modules/products/product.types";
import {
  alignsBudget,
  detectAvoidedIngredients,
  getMatchLevel,
  hasStrongWarnings,
  scoreProductMatch,
} from "@/modules/product-match/product-match.scoring";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

const fixedDate = new Date("2026-05-31T00:00:00.000Z");

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    _id: new ObjectId("665000000000000000001001"),
    name: "Gentle Cleanser",
    brand: "SkinWise Demo",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Panthenol",
    keyActives: ["Panthenol"],
    tags: ["barrier-support"],
    warnings: [],
    skinTypes: ["oily", "combination", "sensitive"],
    concerns: ["acne", "oiliness", "barrier_support"],
    suitableFor: ["basic routine"],
    notRecommendedFor: [],
    source: "admin",
    verificationStatus: "verified",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createSkinProfile(
  overrides: Partial<SkinProfile> = {},
): SkinProfile {
  return {
    _id: new ObjectId("665000000000000000001101"),
    userId: "auth-user-id",
    skinType: "oily",
    concerns: ["acne", "oiliness"],
    sensitivityLevel: "medium",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredients: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("Product Match scoring", () => {
  it("returns a high score and reasons when skin type, concerns, budget, verification, and category match", () => {
    const result = scoreProductMatch({
      product: createProduct(),
      skinProfile: createSkinProfile(),
    });

    expect(result.matchScore).toBe(100);
    expect(result.matchLevel).toBe("strong");
    expect(result.reasons).toEqual(
      expect.arrayContaining([
        "Matches your oily skin type.",
        "Matches your acne concern.",
        "Matches your oiliness concern.",
        "Fits your selected budget range.",
        "Verified product information.",
        "Beginner-friendly product category.",
      ]),
    );
    expect(result.matchedSignals).toMatchObject({
      skinType: true,
      concerns: ["acne", "oiliness"],
      budget: true,
      sensitivity: false,
      avoidedIngredients: [],
    });
  });

  it("penalizes avoided ingredients, adds caution, and never allows a strong match", () => {
    const result = scoreProductMatch({
      product: createProduct({
        ingredientsText: "Water, Fragrance, Glycerin",
        keyActives: ["Fragrance"],
      }),
      skinProfile: createSkinProfile({
        avoidIngredients: ["fragrance"],
      }),
    });

    expect(result.matchScore).toBe(65);
    expect(result.matchLevel).toBe("good");
    expect(result.matchedSignals.avoidedIngredients).toEqual(["fragrance"]);
    expect(result.cautions).toEqual(
      expect.arrayContaining([
        "This product may contain an ingredient you prefer to avoid: fragrance.",
      ]),
    );
  });

  it("uses cautious level for avoided ingredients plus strong warnings when score remains at least 40", () => {
    const result = scoreProductMatch({
      product: createProduct({
        category: "serum",
        ingredientsText: "Water, Fragrance, Retinol",
        keyActives: ["Retinol"],
        warnings: ["Can irritate sensitive skin."],
      }),
      skinProfile: createSkinProfile({
        avoidIngredients: ["fragrance"],
        experienceLevel: "intermediate",
      }),
    });

    expect(result.matchScore).toBeGreaterThanOrEqual(40);
    expect(result.matchLevel).toBe("cautious");
  });

  it("adds sensitivity caution and does not label high-sensitivity strong-warning products as strong", () => {
    const result = scoreProductMatch({
      product: createProduct({
        keyActives: ["Retinol"],
        warnings: ["Can irritate sensitive skin."],
      }),
      skinProfile: createSkinProfile({
        sensitivityLevel: "high",
      }),
    });

    expect(result.matchLevel).not.toBe("strong");
    expect(result.matchedSignals.sensitivity).toBe(true);
    expect(result.cautions).toEqual(
      expect.arrayContaining([
        "Review the ingredient list carefully if your skin is highly sensitive.",
      ]),
    );
  });

  it("penalizes beginner users when the product is treatment-heavy", () => {
    const result = scoreProductMatch({
      product: createProduct({
        category: "treatment",
        keyActives: ["Salicylic Acid"],
      }),
      skinProfile: createSkinProfile(),
    });

    expect(result.cautions).toEqual(
      expect.arrayContaining([
        "Introduce treatment products slowly, especially if you are a beginner.",
      ]),
    );
    expect(result.matchScore).toBeLessThan(100);
  });

  it("clamps score to minimum 0 and maximum 100", () => {
    const lowResult = scoreProductMatch({
      product: createProduct({
        category: "treatment",
        ingredientsText: "Fragrance, Alcohol Denat, Retinol",
        keyActives: ["Retinol"],
        warnings: ["Can irritate sensitive skin."],
        skinTypes: [],
        concerns: [],
        notRecommendedFor: ["sensitive or oily skin"],
      }),
      skinProfile: createSkinProfile({
        sensitivityLevel: "high",
        avoidIngredients: ["fragrance", "alcohol denat", "retinol"],
      }),
    });
    const highResult = scoreProductMatch({
      product: createProduct(),
      skinProfile: createSkinProfile({
        concerns: ["acne", "oiliness", "barrier_support"],
      }),
    });

    expect(lowResult.matchScore).toBe(0);
    expect(highResult.matchScore).toBe(100);
  });

  it("produces expected match levels from scores and overrides", () => {
    expect(
      getMatchLevel(95, {
        avoidedIngredients: [],
        hasStrongWarnings: false,
        highSensitivity: false,
      }),
    ).toBe("strong");
    expect(
      getMatchLevel(70, {
        avoidedIngredients: [],
        hasStrongWarnings: false,
        highSensitivity: false,
      }),
    ).toBe("good");
    expect(
      getMatchLevel(45, {
        avoidedIngredients: [],
        hasStrongWarnings: false,
        highSensitivity: false,
      }),
    ).toBe("cautious");
    expect(
      getMatchLevel(10, {
        avoidedIngredients: [],
        hasStrongWarnings: false,
        highSensitivity: false,
      }),
    ).toBe("low");
    expect(
      getMatchLevel(95, {
        avoidedIngredients: ["fragrance"],
        hasStrongWarnings: false,
        highSensitivity: false,
      }),
    ).toBe("good");
  });

  it("handles missing or empty optional-like product fields safely", () => {
    const result = scoreProductMatch({
      product: createProduct({
        category: "other",
        priceRange: "unknown",
        ingredientsText: "",
        keyActives: [],
        tags: [],
        warnings: [],
        skinTypes: [],
        concerns: [],
        notRecommendedFor: [],
        verificationStatus: "reviewed",
      }),
      skinProfile: createSkinProfile({
        avoidIngredients: [],
      }),
    });

    expect(result.matchScore).toBe(40);
    expect(result.matchLevel).toBe("cautious");
    expect(result.matchedSignals).toEqual({
      skinType: false,
      concerns: [],
      budget: false,
      sensitivity: false,
      avoidedIngredients: [],
    });
  });

  it("handles budget, avoided ingredient, and strong-warning helpers deterministically", () => {
    expect(alignsBudget("under_300k", "budget")).toBe(true);
    expect(alignsBudget("300k_700k", "mid")).toBe(true);
    expect(alignsBudget("700k_1500k", "premium")).toBe(true);
    expect(alignsBudget("above_1500k", "premium")).toBe(true);
    expect(alignsBudget("300k_700k", "unknown")).toBe(false);
    expect(
      detectAvoidedIngredients([" fragrance ", "Fragrance"], createProduct()),
    ).toEqual([]);
    expect(
      detectAvoidedIngredients(
        ["salicylic acid"],
        createProduct({
          ingredientsText: "",
          keyActives: ["Salicylic Acid"],
          tags: [],
        }),
      ),
    ).toEqual(["salicylic acid"]);
    expect(
      hasStrongWarnings(
        createProduct({
          keyActives: ["Benzoyl Peroxide"],
          warnings: [],
        }),
      ),
    ).toBe(true);
  });
});
