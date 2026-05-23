import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getProductsApiPath,
  listProducts,
  ProductClientError,
} from "@/modules/products/product.client";
import type { ProductDto } from "@/modules/products/product.dto";

const mockedFetch = vi.fn();
const productClientSource = readFileSync(
  join(process.cwd(), "src/modules/products/product.client.ts"),
  "utf8",
);

function createProduct(overrides: Partial<ProductDto> = {}): ProductDto {
  return {
    id: "product_123",
    name: "Example Gentle Cleanser",
    brand: "Example Brand",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin",
    keyActives: [],
    tags: [],
    warnings: [],
    skinTypes: [],
    concerns: [],
    suitableFor: [],
    notRecommendedFor: [],
    verificationStatus: "verified",
    createdAt: "2026-05-22T00:00:00.000Z",
    updatedAt: "2026-05-22T00:00:00.000Z",
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

describe("Product client helper", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("lists products through GET /api/products?limit=50 and reads data.items", async () => {
    const products = [createProduct()];
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items: products },
        error: null,
      }),
    );

    await expect(listProducts()).resolves.toEqual(products);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/products?limit=50",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("builds supported product catalogue query params safely", () => {
    expect(
      getProductsApiPath({
        category: "cleanser",
        concern: "barrier_support",
        limit: 12,
        priceRange: "budget",
        q: "  gentle cleanser  ",
        skinType: "sensitive",
      }),
    ).toBe(
      "/api/products?q=gentle+cleanser&category=cleanser&priceRange=budget&skinType=sensitive&concern=barrier_support&limit=12",
    );
  });

  it("passes search and filter params to the Product API without expecting a new route", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items: [] },
        error: null,
      }),
    );

    await expect(
      listProducts({
        category: "sunscreen",
        limit: 50,
        q: "spf",
      }),
    ).resolves.toEqual([]);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/products?q=spf&category=sunscreen&limit=50",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("does not expect data.products from the product API envelope", () => {
    expect(productClientSource).toContain("body.data.items");
    expect(productClientSource).not.toContain("data.products");
  });

  it("rejects envelopes that omit data.items", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { products: [createProduct()] },
        error: null,
      }),
    );

    await expect(listProducts()).rejects.toThrow(
      "Could not load the product catalogue.",
    );
  });

  it("returns a safe error when product list fetch fails", async () => {
    mockedFetch.mockRejectedValue(new Error("MongoServerError stack trace"));

    await expect(listProducts()).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Could not load the product catalogue.",
    });
  });

  it("returns ProductClientError for invalid product envelopes", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "INTERNAL_ERROR",
            message: "raw backend error",
          },
        },
        500,
      ),
    );

    await expect(listProducts()).rejects.toBeInstanceOf(ProductClientError);
    await expect(listProducts()).rejects.toThrow(
      "Could not load the product catalogue.",
    );
  });

  it("has no server-only repository, use-case, or database imports", () => {
    for (const forbiddenImport of [
      "server-only",
      "getCurrentUser",
      "mongodb",
      "@/infrastructure/database",
      "product.repository",
      "product.use-case",
      "Product CRUD",
      "saved products",
    ]) {
      expect(productClientSource).not.toContain(forbiddenImport);
    }
  });
});
