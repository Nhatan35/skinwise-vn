import { describe, expect, it } from "vitest";

import type { ProductDto } from "@/modules/products/product.dto";
import { buildProductDetailDecisionSupport } from "@/modules/products/product-detail-decision-support";

const fixedDate = "2026-05-31T00:00:00.000Z";
const unsafeClaims = [
  "chữa khỏi",
  "điều trị chắc chắn",
  "đảm bảo hết mụn",
  "đảm bảo hiệu quả",
  "an toàn tuyệt đối",
  "phù hợp 100%",
  "phù hợp tuyệt đối",
  "trị mụn chắc chắn",
  "hiệu quả 100%",
  "sản phẩm này sẽ trị mụn",
  "sản phẩm này chữa mụn",
  "cure",
  "guaranteed",
  "100% effective",
  "perfectly safe",
  "will treat acne",
  "medical diagnosis",
];

function createProduct(overrides: Partial<ProductDto> = {}): ProductDto {
  return {
    id: "665000000000000000007001",
    name: "Niacinamide 5% Serum",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "mid",
    ingredientsText: "Water, Glycerin, Niacinamide, Panthenol",
    keyActives: ["Niacinamide", "Panthenol"],
    tags: ["barrier-support"],
    warnings: ["Nên theo dõi phản ứng da khi dùng sản phẩm mới."],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "oiliness"],
    suitableFor: ["Routine cơ bản cần sản phẩm nhẹ"],
    notRecommendedFor: [],
    verificationStatus: "reviewed",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function expectNoUnsafeClaims(value: string) {
  const lowerValue = value.toLocaleLowerCase("vi-VN");

  for (const unsafeClaim of unsafeClaims) {
    expect(lowerValue).not.toContain(unsafeClaim);
  }
}

describe("Product Detail decision support", () => {
  it("builds safe overview, suitable signals, and serum routine tips", () => {
    const decisionSupport = buildProductDetailDecisionSupport(createProduct());

    expect(decisionSupport.overview).toContain("serum");
    expect(decisionSupport.overview).toContain("mụn");
    expect(decisionSupport.suitableFor).toEqual(
      expect.arrayContaining([
        "Có thể hỗ trợ mối quan tâm: mụn",
        "Có thể hỗ trợ mối quan tâm: dầu thừa",
      ]),
    );
    expect(decisionSupport.routineUsageTips).toContain(
      "Có thể cân nhắc dùng sau toner và trước kem dưỡng.",
    );
    expectNoUnsafeClaims(
      [
        decisionSupport.overview,
        ...decisionSupport.suitableFor,
        ...decisionSupport.routineUsageTips,
      ].join(" "),
    );
  });

  it("adds data quality and caution notes when ingredients text is missing", () => {
    const decisionSupport = buildProductDetailDecisionSupport(
      createProduct({
        ingredientsText: "",
      }),
    );

    expect(decisionSupport.dataQualityNotes).toEqual(
      expect.arrayContaining([
        "Dữ liệu thành phần chưa đầy đủ. Bạn nên kiểm tra bảng thành phần trên bao bì hoặc website chính thức của sản phẩm.",
      ]),
    );
    expect(decisionSupport.cautions).toEqual(
      expect.arrayContaining([
        "Nên kiểm tra nhãn sản phẩm thực tế vì dữ liệu thành phần chưa đầy đủ.",
      ]),
    );
  });

  it("builds sunscreen routine tips for morning use", () => {
    const decisionSupport = buildProductDetailDecisionSupport(
      createProduct({
        category: "sunscreen",
        concerns: [],
      }),
    );

    expect(decisionSupport.routineUsageTips).toContain(
      "Thường dùng buổi sáng, ở bước cuối routine ban ngày.",
    );
  });

  it("adds low-frequency and patch-test cautions for treatment products", () => {
    const decisionSupport = buildProductDetailDecisionSupport(
      createProduct({
        category: "treatment",
        keyActives: ["BHA"],
      }),
    );

    expect(decisionSupport.cautions.join(" ")).toContain(
      "nên bắt đầu với tần suất thấp",
    );
    expect(decisionSupport.cautions.join(" ")).toContain("Nên patch test");
  });

  it("limits many ingredients and cautions", () => {
    const decisionSupport = buildProductDetailDecisionSupport(
      createProduct({
        ingredientsText:
          "Water, Glycerin, Niacinamide, Panthenol, BHA, Zinc PCA, Allantoin, Betaine, Green Tea",
        keyActives: [],
        warnings: [
          "Caution 1",
          "Caution 2",
          "Caution 3",
          "Caution 4",
          "Caution 5",
        ],
        notRecommendedFor: ["Nhóm 1", "Nhóm 2"],
      }),
    );

    expect(decisionSupport.ingredientHighlights.length).toBeLessThanOrEqual(8);
    expect(decisionSupport.cautions.length).toBeLessThanOrEqual(4);
  });

  it("adds a data quality note when skin type and concern data is missing", () => {
    const decisionSupport = buildProductDetailDecisionSupport(
      createProduct({
        concerns: [],
        skinTypes: [],
      }),
    );

    expect(decisionSupport.suitableFor.length).toBeGreaterThan(0);
    expect(decisionSupport.dataQualityNotes).toContain(
      "Dữ liệu về loại da hoặc mối quan tâm của sản phẩm chưa đầy đủ.",
    );
  });

  it("dedupes ingredient highlights without mutating the product input", () => {
    const product = createProduct({
      keyActives: ["Niacinamide", "BHA", "Niacinamide"],
    });
    const originalKeyActives = [...product.keyActives];

    const decisionSupport = buildProductDetailDecisionSupport(product);

    expect(decisionSupport.ingredientHighlights).toEqual([
      "Niacinamide",
      "BHA",
    ]);
    expect(product.keyActives).toEqual(originalKeyActives);
  });

  it("falls back to ingredientsText when keyActives is empty", () => {
    const decisionSupport = buildProductDetailDecisionSupport(
      createProduct({
        keyActives: [],
        ingredientsText: "Water, Glycerin, Niacinamide, Panthenol",
      }),
    );

    expect(decisionSupport.ingredientHighlights).toEqual([
      "Water",
      "Glycerin",
      "Niacinamide",
      "Panthenol",
    ]);
    expect(decisionSupport.ingredientHighlights.length).toBeLessThanOrEqual(8);
  });

  it("keeps ingredient highlights empty and notes missing data when no ingredient data exists", () => {
    const decisionSupport = buildProductDetailDecisionSupport(
      createProduct({
        keyActives: [],
        ingredientsText: "",
      }),
    );

    expect(decisionSupport.ingredientHighlights).toEqual([]);
    expect(decisionSupport.dataQualityNotes).toEqual(
      expect.arrayContaining([
        "Dữ liệu thành phần chưa đầy đủ. Bạn nên kiểm tra bảng thành phần trên bao bì hoặc website chính thức của sản phẩm.",
      ]),
    );
  });
});
