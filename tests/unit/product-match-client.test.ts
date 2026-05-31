import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import {
  getProductMatchApiPath,
  getProductMatches,
  ProductMatchClientError,
} from "@/modules/product-match/product-match.client";

const fetchMock = vi.fn<typeof fetch>();
const generatedAt = "2026-05-31T10:00:00.000Z";

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
