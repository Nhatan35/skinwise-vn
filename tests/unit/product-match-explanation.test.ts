import { describe, expect, it } from "vitest";

import type { ProductMatchDto } from "@/modules/product-match/product-match.dto";
import {
  buildProductMatchExplanation,
  buildProductMatchExplanationViewModel,
  PRODUCT_MATCH_FALLBACK_CAUTION,
  PRODUCT_MATCH_FALLBACK_REASON,
} from "@/modules/product-match/product-match-explanation";

const fixedDate = "2026-05-31T00:00:00.000Z";
const forbiddenClaims = [
  "chữa khỏi",
  "điều trị chắc chắn",
  "đảm bảo",
  "chắc chắn hiệu quả",
  "an toàn tuyệt đối",
  "trị mụn",
  "chữa mụn",
  "diagnosis",
  "cure",
  "guaranteed",
  "will treat acne",
];

function createProductMatch(
  overrides: Partial<ProductMatchDto> = {},
): ProductMatchDto {
  return {
    product: {
      id: "665000000000000000004001",
      name: "Niacinamide 5% Serum",
      brand: "SkinWise Demo",
      category: "serum",
      priceRange: "budget",
      ingredientsText: "Water, Niacinamide, Panthenol",
      keyActives: ["Niacinamide", "Panthenol"],
      tags: ["oiliness-support"],
      warnings: [],
      skinTypes: ["oily"],
      concerns: ["acne", "oiliness"],
      suitableFor: ["beginner routine"],
      notRecommendedFor: [],
      verificationStatus: "verified",
      createdAt: fixedDate,
      updatedAt: fixedDate,
    },
    matchScore: 88,
    matchLevel: "strong",
    reasons: ["Phù hợp với da dầu của bạn."],
    cautions: ["Đây là thông tin tham khảo, không phải tư vấn y tế."],
    matchedSignals: {
      skinType: true,
      skinTypes: ["oily"],
      concerns: ["acne", "oiliness"],
      budget: true,
      sensitivity: false,
      avoidedIngredients: [],
    },
    isSaved: false,
    ...overrides,
  };
}

function expectNoForbiddenClaims(value: unknown) {
  const serialized = JSON.stringify(value).toLocaleLowerCase("vi-VN");

  for (const claim of forbiddenClaims) {
    expect(serialized).not.toContain(claim);
  }
}

describe("Product Match explanation view model", () => {
  it("limits visible reasons to 3 and counts hidden reasons", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: ["reason 1", "reason 2", "reason 3", "reason 4", "reason 5"],
      cautions: ["caution 1"],
    });

    expect(viewModel.visibleReasons).toHaveLength(3);
    expect(viewModel.visibleReasons).toEqual([
      "reason 1",
      "reason 2",
      "reason 3",
    ]);
    expect(viewModel.hiddenReasonsCount).toBe(2);
  });

  it("limits visible cautions to 2 and counts hidden cautions", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: ["reason 1"],
      cautions: ["caution 1", "caution 2", "caution 3", "caution 4"],
    });

    expect(viewModel.visibleCautions).toHaveLength(2);
    expect(viewModel.visibleCautions).toEqual(["caution 1", "caution 2"]);
    expect(viewModel.hiddenCautionsCount).toBe(2);
  });

  it("uses a safe fallback when reasons are empty", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: [],
      cautions: ["caution 1"],
    });

    expect(viewModel.visibleReasons).toEqual([PRODUCT_MATCH_FALLBACK_REASON]);
  });

  it("uses a safe fallback when cautions are empty", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: ["reason 1"],
      cautions: [],
    });

    expect(viewModel.visibleCautions).toEqual([PRODUCT_MATCH_FALLBACK_CAUTION]);
  });

  it("does not mutate input arrays", () => {
    const reasons = ["reason 1", "reason 2", "reason 3", "reason 4"];
    const cautions = ["caution 1", "caution 2", "caution 3"];
    const originalReasons = [...reasons];
    const originalCautions = [...cautions];

    buildProductMatchExplanationViewModel({ reasons, cautions });

    expect(reasons).toEqual(originalReasons);
    expect(cautions).toEqual(originalCautions);
  });

  it("never returns negative hidden counts", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: [],
      cautions: [],
    });

    expect(viewModel.hiddenReasonsCount).toBeGreaterThanOrEqual(0);
    expect(viewModel.hiddenCautionsCount).toBeGreaterThanOrEqual(0);
  });
});

describe("Product Match explanation generator", () => {
  it("builds a richer rule-based explanation from existing match signals and product metadata", () => {
    const explanation = buildProductMatchExplanation(createProductMatch());

    expect(explanation.summary).toContain("88/100");
    expect(explanation.positiveReasons.map((reason) => reason.type)).toEqual(
      expect.arrayContaining([
        "skin_type_match",
        "skin_concern_support",
        "ingredient_or_attribute_fit",
        "budget_fit",
      ]),
    );
    expect(explanation.positiveReasons.map((reason) => reason.message).join(" ")).toContain(
      "da dầu",
    );
    expect(explanation.positiveReasons.map((reason) => reason.message).join(" ")).toContain(
      "mụn, dầu thừa",
    );
    expect(explanation.ingredientHighlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ingredientName: "Niacinamide",
          effect: "positive",
        }),
      ]),
    );
    expect(explanation.usageNote).toContain("thử trên một vùng da nhỏ");
    expectNoForbiddenClaims(explanation);
  });

  it("adds caution reasons and caution ingredient highlights from avoided ingredients without inventing new ingredients", () => {
    const explanation = buildProductMatchExplanation(
      createProductMatch({
        matchScore: 55,
        matchLevel: "cautious",
        matchedSignals: {
          skinType: true,
          skinTypes: ["oily"],
          concerns: ["acne"],
          budget: true,
          sensitivity: true,
          avoidedIngredients: ["fragrance"],
        },
        product: {
          ...createProductMatch().product,
          ingredientsText: "Water, Fragrance, Niacinamide",
          keyActives: ["Fragrance", "Niacinamide"],
          warnings: ["Có thể cần xem kỹ nếu da dễ nhạy cảm."],
        },
      }),
    );

    expect(explanation.cautionReasons.map((reason) => reason.type)).toEqual(
      expect.arrayContaining([
        "sensitivity_caution",
        "avoided_ingredient_match",
      ]),
    );
    expect(explanation.ingredientHighlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ingredientName: "fragrance",
          effect: "caution",
        }),
      ]),
    );
    expect(explanation.ingredientHighlights.map((item) => item.ingredientName)).not.toContain(
      "Salicylic Acid",
    );
  });

  it("returns limited-data notes and no ingredient highlights when ingredient data is missing", () => {
    const explanation = buildProductMatchExplanation(
      createProductMatch({
        product: {
          ...createProductMatch().product,
          ingredientsText: "",
          keyActives: [],
          skinTypes: [],
          concerns: [],
        },
        reasons: [],
        cautions: [],
        matchedSignals: {
          skinType: false,
          skinTypes: [],
          concerns: [],
          budget: false,
          sensitivity: false,
          avoidedIngredients: [],
        },
      }),
    );

    expect(explanation.ingredientHighlights).toEqual([]);
    expect(explanation.dataQualityNotes?.join(" ")).toContain(
      "Chưa đủ dữ liệu thành phần",
    );
    expect(explanation.positiveReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "limited_positive_data",
        }),
      ]),
    );
  });

  it("does not expose raw database or user-owned fields", () => {
    const explanation = buildProductMatchExplanation(createProductMatch());
    const serialized = JSON.stringify(explanation);

    expect(serialized).not.toContain("_id");
    expect(serialized).not.toContain("userId");
    expect(serialized).not.toContain("ObjectId");
  });
});
