import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/product-match/product-match.use-case", () => ({
  getProductMatchForUserAndProduct: vi.fn(),
}));

import * as productDetailMatchRoute from "@/app/api/products/[id]/match/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { ProductDetailMatchResponseDto } from "@/modules/product-match/product-match.dto";
import { buildUnavailableProductMatchExplanation } from "@/modules/product-match/product-match-explanation";
import { getProductMatchForUserAndProduct } from "@/modules/product-match/product-match.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetProductMatchForUserAndProduct = vi.mocked(
  getProductMatchForUserAndProduct,
);

const authUserId = "auth-user-id";
const productId = "665000000000000000003001";
const generatedAt = "2026-05-31T10:00:00.000Z";

function routeContext(id: string) {
  return {
    params: Promise.resolve({ id }),
  };
}

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

function createAvailableResponse(): ProductDetailMatchResponseDto {
  return {
    productId,
    matchAvailable: true,
    skinProfileExists: true,
    match: {
      product: {
        id: productId,
        name: "Gentle Cleanser",
        brand: "SkinWise Demo",
        category: "cleanser",
        priceRange: "budget",
        ingredientsText: "Water, Glycerin",
        keyActives: ["Glycerin"],
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
      matchExplanation: {
        summary: "Sản phẩm này có thể phù hợp dựa trên dữ liệu hiện có.",
        positiveReasons: [],
        cautionReasons: [],
        ingredientHighlights: [],
        usageNote: "Hãy patch test trước.",
        dataQualityNotes: [],
      },
    },
  };
}

describe("/api/products/[id]/match contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetProductMatchForUserAndProduct.mockReset();
    mockedGetProductMatchForUserAndProduct.mockResolvedValue(
      createAvailableResponse(),
    );
  });

  it("uses Node.js runtime and exports GET only", () => {
    expect(productDetailMatchRoute.runtime).toBe("nodejs");
    expect(productDetailMatchRoute.GET).toBeTypeOf("function");
    expect(productDetailMatchRoute).not.toHaveProperty("POST");
    expect(productDetailMatchRoute).not.toHaveProperty("PUT");
  });

  it("requires authentication", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await productDetailMatchRoute.GET(
      new Request(`http://localhost/api/products/${productId}/match`),
      routeContext(productId),
    );

    expect(response.status).toBe(401);
    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "UNAUTHORIZED",
      },
    });
    expect(mockedGetProductMatchForUserAndProduct).not.toHaveBeenCalled();
  });

  it("returns current user's single-product match explanation", async () => {
    mockAuthenticatedUser();

    const response = await productDetailMatchRoute.GET(
      new Request(
        `http://localhost/api/products/${productId}/match?userId=other-user-id`,
      ),
      routeContext(productId),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: createAvailableResponse(),
      error: null,
    });
    expect(mockedGetProductMatchForUserAndProduct).toHaveBeenCalledWith(
      authUserId,
      productId,
    );
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("ObjectId");
  });

  it("returns NOT_FOUND for missing products", async () => {
    mockAuthenticatedUser();
    mockedGetProductMatchForUserAndProduct.mockResolvedValue(null);

    const response = await productDetailMatchRoute.GET(
      new Request(`http://localhost/api/products/${productId}/match`),
      routeContext(productId),
    );

    expect(response.status).toBe(404);
    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
  });

  it("returns no-profile fallback without match level", async () => {
    mockAuthenticatedUser();
    mockedGetProductMatchForUserAndProduct.mockResolvedValue({
      productId,
      matchAvailable: false,
      skinProfileExists: false,
      matchUnavailableReason: "NO_SKIN_PROFILE",
      matchExplanation:
        buildUnavailableProductMatchExplanation("NO_SKIN_PROFILE"),
    });

    const response = await productDetailMatchRoute.GET(
      new Request(`http://localhost/api/products/${productId}/match`),
      routeContext(productId),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: {
        matchAvailable: false,
        skinProfileExists: false,
        matchUnavailableReason: "NO_SKIN_PROFILE",
      },
      error: null,
    });
    expect(serializedBody).not.toContain("matchLevel");
    expect(serializedBody).not.toContain("matchScore");
    expect(serializedBody).not.toContain('"usageNote":null');
  });

  it("returns no-ingredient-data fallback without match level", async () => {
    mockAuthenticatedUser();
    mockedGetProductMatchForUserAndProduct.mockResolvedValue({
      productId,
      matchAvailable: false,
      skinProfileExists: true,
      matchUnavailableReason: "NO_INGREDIENT_DATA",
      matchExplanation:
        buildUnavailableProductMatchExplanation("NO_INGREDIENT_DATA"),
    });

    const response = await productDetailMatchRoute.GET(
      new Request(`http://localhost/api/products/${productId}/match`),
      routeContext(productId),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: {
        matchAvailable: false,
        skinProfileExists: true,
        matchUnavailableReason: "NO_INGREDIENT_DATA",
      },
      error: null,
    });
    expect(serializedBody).not.toContain("matchLevel");
    expect(serializedBody).not.toContain("matchScore");
    expect(serializedBody).not.toContain('"usageNote":null');
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedGetProductMatchForUserAndProduct.mockRejectedValue(
      new Error("MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret stack"),
    );

    const response = await productDetailMatchRoute.GET(
      new Request(`http://localhost/api/products/${productId}/match`),
      routeContext(productId),
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
