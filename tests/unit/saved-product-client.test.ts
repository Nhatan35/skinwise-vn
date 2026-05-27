import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ProductDto } from "@/modules/products/product.dto";
import {
  getSavedProductApiPath,
  getSavedProductsApiPath,
  listSavedProducts,
  removeSavedProduct,
  saveProduct,
  SavedProductClientError,
} from "@/modules/saved-products/saved-product.client";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";

const mockedFetch = vi.fn();

function createProduct(overrides: Partial<ProductDto> = {}): ProductDto {
  return {
    id: "665000000000000000000320",
    name: "Niacinamide 5% Serum",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Niacinamide, Zinc PCA, Panthenol",
    keyActives: ["Niacinamide", "Zinc PCA", "Panthenol"],
    tags: ["oiliness-support", "barrier-support"],
    warnings: ["Introduce gradually if your skin is easily irritated."],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["acne", "oiliness"],
    suitableFor: ["beginner serum step"],
    notRecommendedFor: ["currently irritated skin"],
    verificationStatus: "verified",
    createdAt: "2026-05-24T00:00:00.000Z",
    updatedAt: "2026-05-24T00:00:00.000Z",
    ...overrides,
  };
}

function createSavedProduct(
  overrides: Partial<SavedProductDto> = {},
): SavedProductDto {
  const product = createProduct();

  return {
    id: "665000000000000000000620",
    productId: product.id,
    product,
    createdAt: "2026-05-24T00:00:00.000Z",
    updatedAt: "2026-05-24T00:00:00.000Z",
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

describe("Saved Product client helper", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("builds saved product API paths", () => {
    expect(getSavedProductsApiPath()).toBe("/api/saved-products");
    expect(getSavedProductApiPath("abc/123")).toBe(
      "/api/saved-products/abc%2F123",
    );
  });

  it("lists saved products from data.items", async () => {
    const items = [createSavedProduct()];

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items },
        error: null,
      }),
    );

    await expect(listSavedProducts()).resolves.toEqual(items);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/saved-products",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("saves a product through POST JSON and reads data.item", async () => {
    const item = createSavedProduct();

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { item },
        error: null,
      }),
    );

    await expect(saveProduct(item.productId)).resolves.toEqual(item);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/saved-products",
      expect.objectContaining({
        body: JSON.stringify({ productId: item.productId }),
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "POST",
      }),
    );
  });

  it("removes a saved product through DELETE and reads data.removed", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { removed: true },
        error: null,
      }),
    );

    await expect(removeSavedProduct("abc/123")).resolves.toBe(true);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/saved-products/abc%2F123",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "DELETE",
      }),
    );
  });

  it("throws SavedProductClientError for API error envelopes", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request body is invalid.",
          },
        },
        400,
      ),
    );

    await expect(saveProduct("bad")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Could not save this product.",
      status: 400,
    });
    await expect(saveProduct("bad")).rejects.toBeInstanceOf(
      SavedProductClientError,
    );
  });

  it("throws SavedProductClientError for non-OK HTTP status and preserves code", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Product was not found.",
          },
        },
        404,
      ),
    );

    await expect(saveProduct("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
      message: "Could not save this product.",
      status: 404,
    });
  });

  it("throws SavedProductClientError for invalid JSON responses", async () => {
    mockedFetch.mockResolvedValue(
      new Response("{", {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }),
    );

    await expect(listSavedProducts()).rejects.toBeInstanceOf(
      SavedProductClientError,
    );
  });

  it("throws SavedProductClientError for invalid data shapes", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items: [{ id: "missing-fields" }] },
        error: null,
      }),
    );

    await expect(listSavedProducts()).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Could not load saved products.",
      status: 200,
    });
  });

  it("throws SavedProductClientError for network errors", async () => {
    mockedFetch.mockRejectedValue(new Error("network failure"));

    await expect(removeSavedProduct("product_123")).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Could not remove this saved product.",
      status: 500,
    });
  });
});
