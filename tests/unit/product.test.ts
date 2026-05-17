import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const toArrayMock = vi.fn();
const limitMock = vi.fn(() => ({ toArray: toArrayMock }));
const sortMock = vi.fn(() => ({ limit: limitMock }));
const collectionMock = {
  find: vi.fn((filter?: unknown) => {
    void filter;

    return { sort: sortMock };
  }),
  findOne: vi.fn((filter?: unknown): unknown => {
    void filter;

    return undefined;
  }),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getProductsCollection: vi.fn(() => collectionMock),
}));

import { toProductDto } from "@/modules/products/product.mapper";
import { productListQuerySchema } from "@/modules/products/product.schema";
import {
  findVisibleProductById,
  searchVisibleProducts,
} from "@/modules/products/product.repository";
import type { Product } from "@/modules/products/product.types";

const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const productId = "665000000000000000000310";
const createdByUserId = new ObjectId("665000000000000000000311");

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    _id: new ObjectId(productId),
    name: "Example Gentle Cleanser",
    brand: "Example Brand",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Panthenol",
    keyActives: ["Panthenol"],
    tags: ["gentle", "basic-routine"],
    warnings: ["Patch test first"],
    skinTypes: ["normal", "combination", "sensitive"],
    concerns: ["dryness", "barrier_support"],
    suitableFor: ["basic morning routine"],
    notRecommendedFor: ["known allergy to listed ingredients"],
    source: "user_submitted",
    verificationStatus: "verified",
    createdByUserId,
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  };
}

describe("Product query schema", () => {
  it("validates list query input and defaults limit", () => {
    expect(
      productListQuerySchema.parse({
        q: " cleanser ",
        category: "cleanser",
        priceRange: "budget",
        skinType: "sensitive",
        concern: "barrier_support",
      }),
    ).toEqual({
      q: "cleanser",
      category: "cleanser",
      priceRange: "budget",
      skinType: "sensitive",
      concern: "barrier_support",
      limit: 20,
    });
  });

  it("rejects unknown query params and invalid enums", () => {
    expect(() =>
      productListQuerySchema.parse({ includeMine: "true" }),
    ).toThrow(ZodError);
    expect(() =>
      productListQuerySchema.parse({ category: "device" }),
    ).toThrow(ZodError);
    expect(() => productListQuerySchema.parse({ limit: "51" })).toThrow(
      ZodError,
    );
  });
});

describe("Product mapper", () => {
  it("maps _id to id, serializes dates, and exposes verificationStatus", () => {
    expect(toProductDto(createProduct())).toEqual({
      id: productId,
      name: "Example Gentle Cleanser",
      brand: "Example Brand",
      category: "cleanser",
      priceRange: "budget",
      ingredientsText: "Water, Glycerin, Panthenol",
      keyActives: ["Panthenol"],
      tags: ["gentle", "basic-routine"],
      warnings: ["Patch test first"],
      skinTypes: ["normal", "combination", "sensitive"],
      concerns: ["dryness", "barrier_support"],
      suitableFor: ["basic morning routine"],
      notRecommendedFor: ["known allergy to listed ingredients"],
      verificationStatus: "verified",
      createdAt: fixedNow.toISOString(),
      updatedAt: fixedNow.toISOString(),
    });
  });

  it("does not expose _id, createdByUserId, source, or raw ObjectId values", () => {
    const dto = toProductDto(createProduct()) as Record<string, unknown>;
    const serializedDto = JSON.stringify(dto);

    expect(dto).not.toHaveProperty("_id");
    expect(dto).not.toHaveProperty("createdByUserId");
    expect(dto).not.toHaveProperty("source");
    expect(serializedDto).not.toContain("ObjectId");
    expect(dto.createdAt).toBeTypeOf("string");
    expect(dto.updatedAt).toBeTypeOf("string");
  });

  it("copies arrays safely in mapper output", () => {
    const product = createProduct();
    const dto = toProductDto(product);

    dto.keyActives.push("mutated active");
    dto.tags.push("mutated tag");
    dto.warnings.push("mutated warning");
    dto.skinTypes.push("oily");
    dto.concerns.push("acne");
    dto.suitableFor.push("mutated suitable");
    dto.notRecommendedFor.push("mutated not recommended");

    expect(product.keyActives).toEqual(["Panthenol"]);
    expect(product.tags).toEqual(["gentle", "basic-routine"]);
    expect(product.warnings).toEqual(["Patch test first"]);
    expect(product.skinTypes).toEqual([
      "normal",
      "combination",
      "sensitive",
    ]);
    expect(product.concerns).toEqual(["dryness", "barrier_support"]);
    expect(product.suitableFor).toEqual(["basic morning routine"]);
    expect(product.notRecommendedFor).toEqual([
      "known allergy to listed ingredients",
    ]);
  });
});

describe("Product repository", () => {
  beforeEach(() => {
    collectionMock.find.mockReset();
    collectionMock.findOne.mockReset();
    sortMock.mockReset();
    limitMock.mockReset();
    toArrayMock.mockReset();
    collectionMock.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({ limit: limitMock });
    limitMock.mockReturnValue({ toArray: toArrayMock });
  });

  it("lists only reviewed or verified products by default", async () => {
    const product = createProduct();
    toArrayMock.mockResolvedValue([product]);

    await expect(searchVisibleProducts({ limit: 20 })).resolves.toEqual([
      product,
    ]);

    expect(collectionMock.find).toHaveBeenCalledWith({
      verificationStatus: {
        $in: ["reviewed", "verified"],
      },
    });
    expect(JSON.stringify(collectionMock.find.mock.calls[0]?.[0])).not.toContain(
      "unverified",
    );
    expect(sortMock).toHaveBeenCalledWith({ brand: 1, name: 1 });
    expect(limitMock).toHaveBeenCalledWith(20);
  });

  it("applies product filters", async () => {
    toArrayMock.mockResolvedValue([]);

    await searchVisibleProducts({
      category: "cleanser",
      priceRange: "budget",
      skinType: "sensitive",
      concern: "barrier_support",
      limit: 10,
    });

    expect(collectionMock.find).toHaveBeenCalledWith({
      verificationStatus: {
        $in: ["reviewed", "verified"],
      },
      category: "cleanser",
      priceRange: "budget",
      skinTypes: "sensitive",
      concerns: "barrier_support",
    });
    expect(limitMock).toHaveBeenCalledWith(10);
  });

  it("searches products by q across canonical searchable fields", async () => {
    toArrayMock.mockResolvedValue([]);

    await searchVisibleProducts({ q: "panthenol", limit: 5 });

    const filter = collectionMock.find.mock.calls[0]?.[0] as {
      $or?: Array<Record<string, RegExp>>;
    };
    expect(filter.$or).toEqual([
      { name: expect.any(RegExp) },
      { brand: expect.any(RegExp) },
      { ingredientsText: expect.any(RegExp) },
      { keyActives: expect.any(RegExp) },
      { tags: expect.any(RegExp) },
    ]);
    expect(filter.$or?.[2]?.ingredientsText.test("Water, Panthenol")).toBe(
      true,
    );
  });

  it("finds visible products by id with verification visibility", async () => {
    const product = createProduct();
    collectionMock.findOne.mockResolvedValue(product);

    await expect(findVisibleProductById(productId)).resolves.toBe(product);

    const filter = collectionMock.findOne.mock.calls[0]?.[0] as {
      _id?: ObjectId;
      verificationStatus?: { $in?: string[] };
    };
    expect(filter._id?.toString()).toBe(productId);
    expect(filter.verificationStatus?.$in).toEqual(["reviewed", "verified"]);
  });

  it("returns null for invalid product ids without querying", async () => {
    await expect(findVisibleProductById("not-an-object-id")).resolves.toBeNull();
    expect(collectionMock.findOne).not.toHaveBeenCalled();
  });
});
