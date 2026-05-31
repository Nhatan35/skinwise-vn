import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/product-match/product-match.use-case", () => ({
  getProductMatchesForUser: vi.fn(),
}));

import * as productMatchRoute from "@/app/api/product-match/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import { getProductMatchesForUser } from "@/modules/product-match/product-match.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetProductMatchesForUser = vi.mocked(getProductMatchesForUser);

const authUserId = "auth-user-id";
const productId = "665000000000000000003001";
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
        id: productId,
        name: "Gentle Cleanser",
        brand: "SkinWise Demo",
        category: "cleanser",
        priceRange: "budget",
        ingredientsText: "Water, Glycerin",
        keyActives: [],
        tags: [],
        warnings: [],
        skinTypes: ["oily"],
        concerns: ["acne"],
        suitableFor: [],
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

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function mockAuthenticatedUser() {
  mockedGetCurrentUser.mockResolvedValue({
    id: authUserId,
    email: "an@example.com",
    name: "An",
  });
}

describe("/api/product-match contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetProductMatchesForUser.mockReset();
    mockedGetProductMatchesForUser.mockResolvedValue(productMatchResponse);
  });

  it("uses Node.js runtime and exports GET only", () => {
    expect(productMatchRoute.runtime).toBe("nodejs");
    expect(productMatchRoute.GET).toBeTypeOf("function");
    expect(productMatchRoute).not.toHaveProperty("POST");
    expect(productMatchRoute).not.toHaveProperty("PUT");
  });

  it("requires authentication", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await productMatchRoute.GET(
      new Request("http://localhost/api/product-match"),
    );

    expect(response.status).toBe(401);
    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "UNAUTHORIZED",
      },
    });
    expect(mockedGetProductMatchesForUser).not.toHaveBeenCalled();
  });

  it("uses default limit when omitted and returns ProductMatchResponseDto directly inside data", async () => {
    mockAuthenticatedUser();

    const response = await productMatchRoute.GET(
      new Request("http://localhost/api/product-match"),
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: productMatchResponse,
      error: null,
    });
    expect(body).not.toHaveProperty("skinProfileExists");
    expect(body).not.toHaveProperty("productMatch");
    expect(body.data).not.toHaveProperty("productMatch");
    expect(mockedGetProductMatchesForUser).toHaveBeenCalledWith(authUserId, {
      limit: 12,
    });
  });

  it("accepts valid limit query params", async () => {
    mockAuthenticatedUser();

    const response = await productMatchRoute.GET(
      new Request("http://localhost/api/product-match?limit=8"),
    );

    expect(response.status).toBe(200);
    expect(mockedGetProductMatchesForUser).toHaveBeenCalledWith(authUserId, {
      limit: 8,
    });
  });

  it("returns skinProfileExists=false when the profile is missing", async () => {
    mockAuthenticatedUser();
    mockedGetProductMatchesForUser.mockResolvedValue({
      skinProfileExists: false,
      generatedAt,
      items: [],
    });

    const response = await productMatchRoute.GET(
      new Request("http://localhost/api/product-match"),
    );

    expect(response.status).toBe(200);
    await expect(readJson(response)).resolves.toEqual({
      data: {
        skinProfileExists: false,
        generatedAt,
        items: [],
      },
      error: null,
    });
  });

  it("rejects invalid limit query params before calling the use case", async () => {
    mockAuthenticatedUser();

    for (const url of [
      "http://localhost/api/product-match?limit=0",
      "http://localhost/api/product-match?limit=25",
      "http://localhost/api/product-match?limit=1.5",
      "http://localhost/api/product-match?limit=abc",
      "http://localhost/api/product-match?limit=8&userId=other-user-id",
    ]) {
      const response = await productMatchRoute.GET(new Request(url));

      expect(response.status).toBe(400);
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }
    expect(mockedGetProductMatchesForUser).not.toHaveBeenCalled();
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedGetProductMatchesForUser.mockRejectedValue(
      new Error("MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret stack"),
    );

    const response = await productMatchRoute.GET(
      new Request("http://localhost/api/product-match"),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(500);
    expect(body).toEqual({
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
        details: {},
      },
    });
    expect(serializedBody).not.toContain("MONGODB_URI");
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("stack");
  });
});
