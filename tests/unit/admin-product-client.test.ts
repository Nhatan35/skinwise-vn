import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AdminProductClientError,
  assertProductVerificationStatus,
  createAdminProduct,
  getAdminProductApiPath,
  getAdminProductsApiPath,
  getAdminProductVerificationStatusApiPath,
  listAdminProducts,
  updateAdminProduct,
  updateAdminProductVerificationStatus,
} from "@/modules/products/admin-product.client";
import type { ProductDto } from "@/modules/products/product.dto";
import type { AdminCreateProductBodyInput } from "@/modules/products/product.schema";
import type { ProductVerificationStatus } from "@/modules/products/product.types";

const mockedFetch = vi.fn();
const adminProductClientSource = readFileSync(
  join(process.cwd(), "src/modules/products/admin-product.client.ts"),
  "utf8",
);

function createProduct(overrides: Partial<ProductDto> = {}): ProductDto {
  return {
    id: "665000000000000000000810",
    name: "Admin Review Product",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Niacinamide",
    keyActives: ["Niacinamide"],
    tags: ["review"],
    warnings: [],
    skinTypes: ["oily"],
    concerns: ["oiliness"],
    suitableFor: ["basic serum step"],
    notRecommendedFor: [],
    verificationStatus: "unverified",
    createdAt: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-06-15T00:00:00.000Z",
    ...overrides,
  };
}

function createAdminProductPayload(): AdminCreateProductBodyInput {
  return {
    brand: "SkinWise Demo",
    category: "serum",
    concerns: ["barrier_support"],
    ingredientsText: "Water, Glycerin, Panthenol",
    keyActives: ["Panthenol"],
    name: "Admin Create Product",
    notRecommendedFor: [],
    priceRange: "budget",
    skinTypes: ["sensitive"],
    suitableFor: ["demo catalogue management"],
    tags: ["admin-lite"],
    verificationStatus: "unverified",
    warnings: [],
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

describe("Admin product client helper", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("builds the admin product list API path with supported filters", () => {
    expect(
      getAdminProductsApiPath({
        category: "serum",
        concern: "oiliness",
        priceRange: "budget",
        q: "  niacinamide serum  ",
        skinType: "oily",
        verificationStatus: "unverified",
      }),
    ).toBe(
      "/api/admin/products?q=niacinamide+serum&category=serum&priceRange=budget&skinType=oily&concern=oiliness&verificationStatus=unverified",
    );
    expect(getAdminProductsApiPath()).toBe("/api/admin/products");
  });

  it("lists products through GET /api/admin/products and reads data.items", async () => {
    const products = [
      createProduct({ verificationStatus: "unverified" }),
      createProduct({
        id: "665000000000000000000811",
        verificationStatus: "verified",
      }),
    ];
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items: products },
        error: null,
      }),
    );

    await expect(listAdminProducts()).resolves.toEqual(products);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/admin/products",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("updates verificationStatus through PATCH /api/admin/products/[id]/verification-status", async () => {
    const product = createProduct({ verificationStatus: "reviewed" });
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { product },
        error: null,
      }),
    );

    await expect(
      updateAdminProductVerificationStatus(product.id, "reviewed"),
    ).resolves.toEqual(product);
    expect(getAdminProductVerificationStatusApiPath(product.id)).toBe(
      `/api/admin/products/${product.id}/verification-status`,
    );
    expect(mockedFetch).toHaveBeenCalledWith(
      `/api/admin/products/${product.id}/verification-status`,
      expect.objectContaining({
        body: JSON.stringify({ verificationStatus: "reviewed" }),
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "PATCH",
      }),
    );
  });

  it("creates products through POST /api/admin/products", async () => {
    const product = createProduct({
      name: "Admin Create Product",
      verificationStatus: "unverified",
    });
    const payload = createAdminProductPayload();
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { product },
        error: null,
      }),
    );

    await expect(createAdminProduct(payload)).resolves.toEqual(product);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/admin/products",
      expect.objectContaining({
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "POST",
      }),
    );
  });

  it("updates product content through PATCH /api/admin/products/[id]", async () => {
    const product = createProduct({
      brand: "Updated Brand",
      name: "Updated Product",
      verificationStatus: "reviewed",
    });
    const payload = {
      brand: "Updated Brand",
      name: "Updated Product",
      verificationStatus: "reviewed",
    } as const;
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { product },
        error: null,
      }),
    );

    await expect(updateAdminProduct(product.id, payload)).resolves.toEqual(
      product,
    );
    expect(getAdminProductApiPath(product.id)).toBe(
      `/api/admin/products/${product.id}`,
    );
    expect(mockedFetch).toHaveBeenCalledWith(
      `/api/admin/products/${product.id}`,
      expect.objectContaining({
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "PATCH",
      }),
    );
  });

  it("preserves 401 and 403 admin API errors safely", async () => {
    for (const [status, code] of [
      [401, "UNAUTHORIZED"],
      [403, "FORBIDDEN"],
    ] as const) {
      mockedFetch.mockResolvedValueOnce(
        jsonResponse(
          {
            data: null,
            error: {
              code,
              details: {},
              message: "Blocked.",
            },
          },
          status,
        ),
      );

      await expect(listAdminProducts()).rejects.toMatchObject({
        code,
        message: "Could not load admin products.",
        status,
      });
    }
  });

  it("rejects invalid verification statuses before calling the API", async () => {
    const invalidStatus = "draft" as unknown as ProductVerificationStatus;

    expect(() => assertProductVerificationStatus("draft")).toThrow(
      "Invalid product verification status.",
    );
    await expect(
      updateAdminProductVerificationStatus("product-id", invalidStatus),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("returns safe errors for network failures and invalid envelopes", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("network stack"));

    await expect(listAdminProducts()).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Could not load admin products.",
      status: 500,
    });

    mockedFetch.mockResolvedValueOnce(
      jsonResponse({
        data: { products: [createProduct()] },
        error: null,
      }),
    );

    const invalidEnvelopeRequest = listAdminProducts();

    await expect(invalidEnvelopeRequest).rejects.toBeInstanceOf(
      AdminProductClientError,
    );
    await expect(invalidEnvelopeRequest).rejects.toThrow(
      "Could not load admin products.",
    );
  });

  it("does not import server-only admin guards or repositories", () => {
    for (const forbiddenImport of [
      "server-only",
      "requireAdminUser",
      "getCurrentUser",
      "mongodb",
      "@/infrastructure/database",
      "product.repository",
      "product.use-case",
      "@/modules/auth",
    ]) {
      expect(adminProductClientSource).not.toContain(forbiddenImport);
    }
  });
});
