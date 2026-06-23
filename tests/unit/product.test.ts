import { ObjectId } from "mongodb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const toArrayMock = vi.fn();
const limitMock = vi.fn(() => ({ toArray: toArrayMock }));
const sortMock = vi.fn(() => ({
  limit: limitMock,
  toArray: toArrayMock,
}));
const collectionMock = {
  find: vi.fn((filter?: unknown) => {
    void filter;

    return { sort: sortMock };
  }),
  findOne: vi.fn((filter?: unknown): unknown => {
    void filter;

    return undefined;
  }),
  findOneAndUpdate: vi.fn(),
  insertOne: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getProductsCollection: vi.fn(() => collectionMock),
}));

import { toProductDto } from "@/modules/products/product.mapper";
import {
  adminCreateProductBodySchema,
  adminProductListQuerySchema,
  adminUpdateProductBodySchema,
  productListQuerySchema,
  updateProductVerificationStatusBodySchema,
} from "@/modules/products/product.schema";
import {
  createProduct as createProductRecord,
  findProductById,
  findVisibleProductById,
  searchProductsForAdmin,
  searchVisibleProducts,
  updateProduct as updateProductRecord,
  updateProductVerificationStatus,
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

function createAdminProductPayload() {
  return {
    brand: "SkinWise Demo",
    category: "serum",
    concerns: ["barrier_support"],
    ingredientsText: " Water, Glycerin, Panthenol ",
    keyActives: [" Panthenol ", "", "Glycerin"],
    name: " Admin Lite Product ",
    notRecommendedFor: ["known allergy to listed ingredients"],
    priceRange: "budget",
    skinTypes: ["sensitive"],
    suitableFor: ["basic routine"],
    tags: [" demo ", ""],
    warnings: ["Patch test first"],
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

  it("validates admin product list query input without includeMine semantics", () => {
    expect(
      adminProductListQuerySchema.parse({
        q: " pending ",
        category: "serum",
        verificationStatus: "unverified",
      }),
    ).toEqual({
      q: "pending",
      category: "serum",
      verificationStatus: "unverified",
    });

    expect(() =>
      adminProductListQuerySchema.parse({ verificationStatus: "draft" }),
    ).toThrow(ZodError);
    expect(() =>
      adminProductListQuerySchema.parse({ includeMine: "true" }),
    ).toThrow(ZodError);
  });

  it("validates admin verificationStatus update body strictly", () => {
    expect(
      updateProductVerificationStatusBodySchema.parse({
        verificationStatus: "reviewed",
      }),
    ).toEqual({
      verificationStatus: "reviewed",
    });

    expect(() =>
      updateProductVerificationStatusBodySchema.parse({
        verificationStatus: "draft",
      }),
    ).toThrow(ZodError);
    expect(() =>
      updateProductVerificationStatusBodySchema.parse({
        verificationStatus: "verified",
        source: "admin",
      }),
    ).toThrow(ZodError);
  });

  it("validates admin create product bodies and defaults unverified status", () => {
    expect(adminCreateProductBodySchema.parse(createAdminProductPayload())).toEqual({
      brand: "SkinWise Demo",
      category: "serum",
      concerns: ["barrier_support"],
      ingredientsText: "Water, Glycerin, Panthenol",
      keyActives: ["Panthenol", "Glycerin"],
      name: "Admin Lite Product",
      notRecommendedFor: ["known allergy to listed ingredients"],
      priceRange: "budget",
      skinTypes: ["sensitive"],
      suitableFor: ["basic routine"],
      tags: ["demo"],
      verificationStatus: "unverified",
      warnings: ["Patch test first"],
    });

    expect(
      adminCreateProductBodySchema.parse({
        ...createAdminProductPayload(),
        verificationStatus: "reviewed",
      }),
    ).toMatchObject({
      verificationStatus: "reviewed",
    });
  });

  it("rejects invalid admin create product bodies", () => {
    for (const body of [
      { ...createAdminProductPayload(), name: " " },
      { ...createAdminProductPayload(), brand: "" },
      { ...createAdminProductPayload(), category: "device" },
      { ...createAdminProductPayload(), priceRange: "luxury" },
      { ...createAdminProductPayload(), skinTypes: ["reactive"] },
      { ...createAdminProductPayload(), concerns: ["wrinkles"] },
      { ...createAdminProductPayload(), source: "admin" },
      {
        ...createAdminProductPayload(),
        createdByUserId: createdByUserId.toString(),
      },
      { ...createAdminProductPayload(), createdAt: fixedNow.toISOString() },
      { ...createAdminProductPayload(), updatedAt: fixedNow.toISOString() },
      { ...createAdminProductPayload(), _id: productId },
      { ...createAdminProductPayload(), id: productId },
    ]) {
      expect(() => adminCreateProductBodySchema.parse(body)).toThrow(ZodError);
    }
  });

  it("validates admin update product bodies as partial strict updates", () => {
    expect(
      adminUpdateProductBodySchema.parse({
        brand: " Updated Brand ",
        keyActives: [" Niacinamide ", ""],
        verificationStatus: "verified",
      }),
    ).toEqual({
      brand: "Updated Brand",
      keyActives: ["Niacinamide"],
      verificationStatus: "verified",
    });

    expect(() => adminUpdateProductBodySchema.parse({})).toThrow(ZodError);
  });

  it("rejects invalid admin update product bodies", () => {
    for (const body of [
      { verificationStatus: "draft" },
      { name: "" },
      { brand: " " },
      { category: "device" },
      { source: "admin" },
      { createdByUserId: createdByUserId.toString() },
      { createdAt: fixedNow.toISOString() },
      { updatedAt: fixedNow.toISOString() },
      { _id: productId },
      { id: productId },
    ]) {
      expect(() => adminUpdateProductBodySchema.parse(body)).toThrow(ZodError);
    }
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
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
    collectionMock.find.mockReset();
    collectionMock.findOne.mockReset();
    collectionMock.findOneAndUpdate.mockReset();
    collectionMock.insertOne.mockReset();
    sortMock.mockReset();
    limitMock.mockReset();
    toArrayMock.mockReset();
    collectionMock.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({
      limit: limitMock,
      toArray: toArrayMock,
    });
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

  it("keeps unverified products out of the public catalogue filter", async () => {
    toArrayMock.mockResolvedValue([
      createProduct({ verificationStatus: "reviewed" }),
      createProduct({ verificationStatus: "verified" }),
    ]);

    await searchVisibleProducts({ limit: 50 });

    expect(collectionMock.find).toHaveBeenCalledWith({
      verificationStatus: {
        $in: ["reviewed", "verified"],
      },
    });
    expect(collectionMock.find).not.toHaveBeenCalledWith(
      expect.objectContaining({
        verificationStatus: "unverified",
      }),
    );
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

  it("admin search can list products across all verification statuses", async () => {
    const unverifiedProduct = createProduct({ verificationStatus: "unverified" });
    const verifiedProduct = createProduct({ verificationStatus: "verified" });
    toArrayMock.mockResolvedValue([unverifiedProduct, verifiedProduct]);

    await expect(searchProductsForAdmin({})).resolves.toEqual([
      unverifiedProduct,
      verifiedProduct,
    ]);

    expect(collectionMock.find).toHaveBeenCalledWith({});
    expect(JSON.stringify(collectionMock.find.mock.calls[0]?.[0])).not.toContain(
      '"$in"',
    );
    expect(sortMock).toHaveBeenCalledWith({ brand: 1, name: 1 });
    expect(limitMock).not.toHaveBeenCalled();
  });

  it("admin search can filter specifically to unverified products", async () => {
    toArrayMock.mockResolvedValue([]);

    await searchProductsForAdmin({
      q: "pending",
      category: "serum",
      verificationStatus: "unverified",
    });

    const filter = collectionMock.find.mock.calls[0]?.[0] as {
      $or?: Array<Record<string, RegExp>>;
      category?: string;
      verificationStatus?: string;
    };

    expect(filter.category).toBe("serum");
    expect(filter.verificationStatus).toBe("unverified");
    expect(filter.$or?.[0]?.name.test("Pending product")).toBe(true);
  });

  it("creates admin-managed products with server-owned timestamps", async () => {
    const insertedId = new ObjectId("665000000000000000000398");
    collectionMock.insertOne.mockResolvedValue({ insertedId });

    await expect(
      createProductRecord({
        brand: "SkinWise Demo",
        category: "serum",
        concerns: ["barrier_support"],
        createdByUserId,
        ingredientsText: "Water, Panthenol",
        keyActives: ["Panthenol"],
        name: "Admin Lite Product",
        notRecommendedFor: [],
        priceRange: "budget",
        skinTypes: ["sensitive"],
        source: "admin",
        suitableFor: ["demo catalogue management"],
        tags: ["admin-lite"],
        verificationStatus: "unverified",
        warnings: [],
      }),
    ).resolves.toMatchObject({
      _id: insertedId,
      source: "admin",
      verificationStatus: "unverified",
    });

    expect(collectionMock.insertOne).toHaveBeenCalledWith({
      brand: "SkinWise Demo",
      category: "serum",
      concerns: ["barrier_support"],
      createdAt: fixedNow,
      createdByUserId,
      ingredientsText: "Water, Panthenol",
      keyActives: ["Panthenol"],
      name: "Admin Lite Product",
      notRecommendedFor: [],
      priceRange: "budget",
      skinTypes: ["sensitive"],
      source: "admin",
      suitableFor: ["demo catalogue management"],
      tags: ["admin-lite"],
      updatedAt: fixedNow,
      verificationStatus: "unverified",
      warnings: [],
    });
  });

  it("updates only provided product fields plus server-owned updatedAt", async () => {
    const updatedProduct = createProduct({
      name: "Updated Lite Product",
      verificationStatus: "reviewed",
    });
    collectionMock.findOneAndUpdate.mockResolvedValue(updatedProduct);

    await expect(
      updateProductRecord(productId, {
        name: "Updated Lite Product",
        verificationStatus: "reviewed",
      }),
    ).resolves.toBe(updatedProduct);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: new ObjectId(productId),
      },
      {
        $set: {
          name: "Updated Lite Product",
          updatedAt: fixedNow,
          verificationStatus: "reviewed",
        },
      },
      {
        returnDocument: "after",
      },
    );
  });

  it("admin content update returns null for invalid product ids without querying", async () => {
    await expect(
      updateProductRecord("not-an-object-id", {
        name: "Updated Lite Product",
      }),
    ).resolves.toBeNull();
    expect(collectionMock.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it("admin find by id does not apply public visibility filters", async () => {
    const product = createProduct({ verificationStatus: "unverified" });
    collectionMock.findOne.mockResolvedValue(product);

    await expect(findProductById(productId)).resolves.toBe(product);

    const filter = collectionMock.findOne.mock.calls[0]?.[0] as {
      _id?: ObjectId;
      verificationStatus?: unknown;
    };
    expect(filter._id?.toString()).toBe(productId);
    expect(filter).not.toHaveProperty("verificationStatus");
  });

  it("admin updates verificationStatus and server-owned updatedAt only", async () => {
    const updatedProduct = createProduct({
      verificationStatus: "reviewed",
      updatedAt: fixedNow,
    });
    collectionMock.findOneAndUpdate.mockResolvedValue(updatedProduct);

    await expect(
      updateProductVerificationStatus(productId, "reviewed"),
    ).resolves.toBe(updatedProduct);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: new ObjectId(productId),
      },
      {
        $set: {
          verificationStatus: "reviewed",
          updatedAt: fixedNow,
        },
      },
      {
        returnDocument: "after",
      },
    );
  });

  it("admin update returns null for invalid product ids without querying", async () => {
    await expect(
      updateProductVerificationStatus("not-an-object-id", "reviewed"),
    ).resolves.toBeNull();
    expect(collectionMock.findOneAndUpdate).not.toHaveBeenCalled();
  });
});
