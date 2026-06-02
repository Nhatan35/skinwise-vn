import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ProductDetailMatchResponseDto,
  ProductMatchResponseDto,
} from "@/modules/product-match/product-match.dto";
import {
  getProductMatchForProduct,
  getProductMatchForProductApiPath,
  getProductMatchApiPath,
  getProductMatches,
  ProductMatchClientError,
} from "@/modules/product-match/product-match.client";

const fetchMock = vi.fn<typeof fetch>();
const generatedAt = "2026-05-31T10:00:00.000Z";
const productId = "665000000000000000004001";

const productMatchResponse: ProductMatchResponseDto = {
  skinProfileExists: true,
  generatedAt,
  skinProfileSummary: {
    skinType: "oily",
    concerns: ["acne"],
    sensitivityLevel: "medium",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredientsCount: 0,
  },
  items: [
    {
      product: {
        id: "665000000000000000004001",
        name: "Gentle Cleanser",
        brand: "SkinWise Demo",
        category: "cleanser",
        priceRange: "budget",
        ingredientsText: "Water, Glycerin",
        keyActives: [],
        tags: ["barrier-support"],
        warnings: [],
        skinTypes: ["oily"],
        concerns: ["acne"],
        suitableFor: ["beginner routine"],
        notRecommendedFor: [],
        verificationStatus: "verified",
        createdAt: generatedAt,
        updatedAt: generatedAt,
      },
      matchScore: 95,
      matchLevel: "strong",
      reasons: ["Phù hợp với da dầu của bạn."],
      cautions: ["Đây là thông tin tham khảo, không phải tư vấn y tế."],
      matchedSignals: {
        skinType: true,
        concerns: ["acne"],
        budget: true,
        sensitivity: false,
        avoidedIngredients: [],
      },
      isSaved: true,
    },
  ],
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

describe("Product Match client", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("builds Product Match API paths without undefined query params", () => {
    expect(getProductMatchApiPath()).toBe("/api/product-match");
    expect(getProductMatchApiPath({})).toBe("/api/product-match");
    expect(getProductMatchApiPath({ limit: 8 })).toBe(
      "/api/product-match?limit=8",
    );
    expect(getProductMatchApiPath()).not.toContain("undefined");
    expect(getProductMatchForProductApiPath(productId)).toBe(
      `/api/products/${productId}/match`,
    );
  });

  it("parses the direct data envelope for ProductMatchResponseDto", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: productMatchResponse,
        error: null,
      }),
    );

    await expect(getProductMatches({ limit: 8 })).resolves.toEqual(
      productMatchResponse,
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/product-match?limit=8", {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  });

  it("accepts a valid optional matchExplanation field", async () => {
    const responseWithExplanation: ProductMatchResponseDto = {
      ...productMatchResponse,
      items: productMatchResponse.items.map((item) => ({
        ...item,
        matchExplanation: {
          summary:
            "Sản phẩm này có thể phù hợp dựa trên dữ liệu sản phẩm hiện có.",
          positiveReasons: [
            {
              type: "skin_type_match",
              message:
                "Loại da trong hồ sơ của bạn có tín hiệu khớp với metadata sản phẩm.",
              relatedIngredients: ["Glycerin"],
              relatedConcerns: ["acne"],
            },
          ],
          cautionReasons: [
            {
              type: "general_patch_test",
              message:
                "Nên patch test trước khi sử dụng sản phẩm mới trong routine.",
            },
          ],
          ingredientHighlights: [
            {
              ingredientName: "Glycerin",
              effect: "positive",
              reason:
                "Dữ liệu sản phẩm liệt kê thành phần này trong bảng thành phần.",
            },
          ],
          usageNote:
            "Hãy patch test trước và đưa sản phẩm vào routine từ từ.",
          dataQualityNotes: [],
        },
      })),
    };

    fetchMock.mockResolvedValue(
      jsonResponse({
        data: responseWithExplanation,
        error: null,
      }),
    );

    await expect(getProductMatches()).resolves.toEqual(responseWithExplanation);
  });

  it("drops malformed optional matchExplanation without rejecting the otherwise valid response", async () => {
    const responseWithMalformedExplanation = {
      ...productMatchResponse,
      items: productMatchResponse.items.map((item) => ({
        ...item,
        matchExplanation: {
          summary: 123,
          positiveReasons: "not-an-array",
        },
      })),
    };

    fetchMock.mockResolvedValue(
      jsonResponse({
        data: responseWithMalformedExplanation,
        error: null,
      }),
    );

    await expect(getProductMatches()).resolves.toEqual(productMatchResponse);
  });

  it("parses the no-profile response shape", async () => {
    const noProfileResponse: ProductMatchResponseDto = {
      skinProfileExists: false,
      generatedAt,
      items: [],
    };

    fetchMock.mockResolvedValue(
      jsonResponse({
        data: noProfileResponse,
        error: null,
      }),
    );

    await expect(getProductMatches()).resolves.toEqual(noProfileResponse);
  });

  it("parses a single-product matchAvailable=true response", async () => {
    const detailMatchResponse: ProductDetailMatchResponseDto = {
      productId,
      matchAvailable: true,
      skinProfileExists: true,
      match: {
        ...productMatchResponse.items[0],
        matchExplanation: {
          summary:
            "Sản phẩm này có thể phù hợp dựa trên dữ liệu sản phẩm hiện có.",
          positiveReasons: [],
          cautionReasons: [],
          ingredientHighlights: [],
          usageNote: "Hãy patch test trước.",
          dataQualityNotes: [],
        },
      },
    };

    fetchMock.mockResolvedValue(
      jsonResponse({
        data: detailMatchResponse,
        error: null,
      }),
    );

    await expect(getProductMatchForProduct(productId)).resolves.toEqual(
      detailMatchResponse,
    );
    expect(fetchMock).toHaveBeenCalledWith(`/api/products/${productId}/match`, {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  });

  it("parses single-product unavailable fallback responses", async () => {
    const noProfileResponse: ProductDetailMatchResponseDto = {
      productId,
      matchAvailable: false,
      skinProfileExists: false,
      matchUnavailableReason: "NO_SKIN_PROFILE",
      matchExplanation: {
        summary:
          "Hoàn thành hồ sơ da để xem giải thích mức độ phù hợp được cá nhân hóa.",
        positiveReasons: [],
        cautionReasons: [],
        ingredientHighlights: [],
        usageNote:
          "Hãy hoàn thành hồ sơ da trước khi sử dụng đánh giá phù hợp được cá nhân hóa.",
        dataQualityNotes: [
          "Chưa thể cá nhân hóa vì người dùng chưa có hồ sơ da hoàn chỉnh.",
        ],
      },
    };

    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        data: noProfileResponse,
        error: null,
      }),
    );

    await expect(getProductMatchForProduct(productId)).resolves.toEqual(
      noProfileResponse,
    );

    const noIngredientResponse: ProductDetailMatchResponseDto = {
      productId,
      matchAvailable: false,
      skinProfileExists: true,
      matchUnavailableReason: "NO_INGREDIENT_DATA",
      matchExplanation: {
        summary:
          "Chưa đủ dữ liệu thành phần để giải thích mức độ phù hợp của sản phẩm này.",
        positiveReasons: [],
        cautionReasons: [],
        ingredientHighlights: [],
        usageNote: "Hãy kiểm tra nhãn sản phẩm và patch test trước khi sử dụng.",
        dataQualityNotes: [
          "Dữ liệu thành phần hiện chưa đủ để tạo giải thích chi tiết.",
        ],
      },
    };

    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        data: noIngredientResponse,
        error: null,
      }),
    );

    await expect(getProductMatchForProduct(productId)).resolves.toEqual(
      noIngredientResponse,
    );
  });

  it("drops malformed optional matchExplanation on a single-product available response", async () => {
    const detailMatchResponse = {
      productId,
      matchAvailable: true,
      skinProfileExists: true,
      match: {
        ...productMatchResponse.items[0],
        matchExplanation: {
          summary: 123,
        },
      },
    };

    fetchMock.mockResolvedValue(
      jsonResponse({
        data: detailMatchResponse,
        error: null,
      }),
    );

    await expect(getProductMatchForProduct(productId)).resolves.toEqual({
      productId,
      matchAvailable: true,
      skinProfileExists: true,
      match: productMatchResponse.items[0],
    });
  });

  it("maps API errors to ProductMatchClientError", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "Query parameters are invalid.",
            details: {},
          },
        },
        400,
      ),
    );

    await expect(getProductMatches({ limit: 25 })).rejects.toMatchObject({
      name: "ProductMatchClientError",
      code: "VALIDATION_ERROR",
      message: "Không thể tải gợi ý sản phẩm.",
      status: 400,
    });
  });

  it("rejects raw or incorrectly wrapped success response shapes", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(productMatchResponse));

    await expect(getProductMatches()).rejects.toBeInstanceOf(
      ProductMatchClientError,
    );

    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productMatch: productMatchResponse,
        },
        error: null,
      }),
    );

    await expect(getProductMatches()).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      status: 200,
    });

    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productMatch: {
            productId,
            matchAvailable: true,
          },
        },
        error: null,
      }),
    );

    await expect(getProductMatchForProduct(productId)).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      status: 200,
    });
  });

  it("uses the safe generic error when fetch or response parsing fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network secret"));

    await expect(getProductMatches()).rejects.toMatchObject({
      name: "ProductMatchClientError",
      code: "INTERNAL_ERROR",
      message: "Không thể tải gợi ý sản phẩm.",
      status: 500,
    });

    fetchMock.mockResolvedValueOnce(
      new Response("{", {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }),
    );

    await expect(getProductMatches()).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      status: 200,
    });
  });
});
