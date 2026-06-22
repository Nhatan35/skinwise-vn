import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import type { Product } from "@/modules/products/product.types";
import { toProductDto } from "@/modules/products/product.mapper";
import { toSavedProductDto } from "@/modules/saved-products/saved-product.mapper";
import {
  parseSavedProductTagsInput,
  validateSavedProductTags,
} from "@/modules/saved-products/saved-product-tags";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";

const productId = new ObjectId("665000000000000000000320");
const savedProductId = new ObjectId("665000000000000000000620");
const fixedDate = new Date("2026-05-24T00:00:00.000Z");

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    _id: productId,
    name: "Niacinamide 5% Serum",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Niacinamide",
    keyActives: ["Niacinamide"],
    tags: ["oiliness-support"],
    warnings: [],
    skinTypes: ["oily"],
    concerns: ["oiliness"],
    suitableFor: [],
    notRecommendedFor: [],
    source: "manual",
    verificationStatus: "verified",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createSavedProduct(
  overrides: Partial<SavedProduct> = {},
): SavedProduct {
  return {
    _id: savedProductId,
    userId: "auth-user-id",
    productId,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("saved product personal tags", () => {
  it("trims and accepts valid personal tags", () => {
    expect(validateSavedProductTags([" To buy ", "Patch test"])).toEqual({
      ok: true,
      tags: ["To buy", "Patch test"],
    });
    expect(parseSavedProductTagsInput("To buy, Morning routine")).toEqual({
      ok: true,
      tags: ["To buy", "Morning routine"],
    });
    expect(parseSavedProductTagsInput("   ")).toEqual({
      ok: true,
      tags: [],
    });
  });

  it.each([
    [[""], "empty"],
    [["To buy", "to buy"], "duplicate"],
    [["not allowed!"], "invalid characters"],
    [["a".repeat(31)], "too long"],
    [
      ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
      "too many",
    ],
  ])("rejects %s tags", (tags) => {
    expect(validateSavedProductTags(tags).ok).toBe(false);
  });

  it("maps missing saved product tags to an empty DTO array", () => {
    expect(toSavedProductDto(createSavedProduct(), createProduct())).toMatchObject({
      tags: [],
    });
  });

  it("keeps user-owned saved tags separate from public product tags", () => {
    const savedProductDto = toSavedProductDto(
      createSavedProduct({ tags: ["To buy", "Patch test"] }),
      createProduct({ tags: ["oiliness-support"] }),
    );
    const publicProductDto = toProductDto(createProduct());

    expect(savedProductDto.tags).toEqual(["To buy", "Patch test"]);
    expect(savedProductDto.product.tags).toEqual(["oiliness-support"]);
    expect(JSON.stringify(publicProductDto)).not.toContain("To buy");
    expect(JSON.stringify(publicProductDto)).not.toContain("Patch test");
  });
});
