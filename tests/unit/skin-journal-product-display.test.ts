import { describe, expect, it } from "vitest";

import {
  buildProductLookup,
  getProductDisplayName,
  resolveJournalProductLabels,
} from "@/modules/journals/skin-journal-product-display";
import type { ProductDto } from "@/modules/products/product.dto";

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

describe("SkinJournal product display helpers", () => {
  it("displays Brand - Product Name when both brand and name exist", () => {
    expect(getProductDisplayName(createProduct())).toBe(
      "Example Brand - Example Gentle Cleanser",
    );
  });

  it("displays product name when brand is missing", () => {
    expect(getProductDisplayName(createProduct({ brand: "" }))).toBe(
      "Example Gentle Cleanser",
    );
  });

  it("displays brand when product name is missing", () => {
    expect(getProductDisplayName(createProduct({ name: "" }))).toBe(
      "Example Brand",
    );
  });

  it("displays Unknown product for missing product data", () => {
    expect(getProductDisplayName(null)).toBe("Unknown product");
    expect(getProductDisplayName(createProduct({ brand: "", name: "" }))).toBe(
      "Unknown product",
    );
  });

  it("buildProductLookup uses public product id and does not mutate products", () => {
    const products = [
      createProduct({ id: "product_123" }),
      createProduct({ id: "product_456", name: "Barrier Cream" }),
    ];
    const originalProducts = structuredClone(products);
    const lookup = buildProductLookup(products);

    expect(Object.keys(lookup)).toEqual(["product_123", "product_456"]);
    expect(lookup.product_123?.id).toBe("product_123");
    expect(products).toEqual(originalProducts);
  });

  it("resolves journal product labels and handles unknown ids safely", () => {
    const lookup = buildProductLookup([createProduct()]);

    expect(
      resolveJournalProductLabels(["product_123", "deleted_product"], lookup),
    ).toEqual([
      {
        id: "product_123",
        label: "Example Brand - Example Gentle Cleanser",
      },
      {
        id: "deleted_product",
        label: "Unknown product",
      },
    ]);
  });

  it("handles empty productsUsed safely", () => {
    expect(resolveJournalProductLabels(undefined, {})).toEqual([]);
    expect(resolveJournalProductLabels([], buildProductLookup(null))).toEqual([]);
  });

  it("does not expose _id or userId in display output", () => {
    const unsafeProduct = {
      ...createProduct(),
      _id: "mongo-id",
      userId: "private-user",
    } as unknown as ProductDto;
    const labels = resolveJournalProductLabels(
      ["product_123"],
      buildProductLookup([unsafeProduct]),
    );
    const serializedLabels = JSON.stringify(labels);

    expect(serializedLabels).not.toContain("mongo-id");
    expect(serializedLabels).not.toContain("private-user");
  });
});
