import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/products/product.use-case", () => ({
  getProductById: vi.fn(),
}));

vi.mock("@/modules/saved-products/saved-product.repository", () => ({
  findSavedProductByUserAndProduct: vi.fn(),
  isProductSavedByUser: vi.fn(),
  listSavedProductsByUser: vi.fn(),
  removeSavedProductForUser: vi.fn(),
  saveProductForUser: vi.fn(),
  updateSavedProductMetadataForUser: vi.fn(),
}));

import { getProductById } from "@/modules/products/product.use-case";
import type { Product } from "@/modules/products/product.types";
import {
  findSavedProductByUserAndProduct,
  isProductSavedByUser,
  listSavedProductsByUser,
  removeSavedProductForUser as removeSavedProductRecordForUser,
  saveProductForUser as saveProductRecordForUser,
  updateSavedProductMetadataForUser as updateSavedProductMetadataRecordForUser,
} from "@/modules/saved-products/saved-product.repository";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";
import {
  isProductSavedForUser,
  listSavedProductsForUser,
  removeSavedProductForUser,
  saveProductForUser,
  SavedProductProductNotFoundError,
  updateSavedProductMetadata,
} from "@/modules/saved-products/saved-product.use-case";

const mockedGetProductById = vi.mocked(getProductById);
const mockedFindSavedProductByUserAndProduct = vi.mocked(
  findSavedProductByUserAndProduct,
);
const mockedIsProductSavedByUser = vi.mocked(isProductSavedByUser);
const mockedListSavedProductsByUser = vi.mocked(listSavedProductsByUser);
const mockedRemoveSavedProductRecordForUser = vi.mocked(
  removeSavedProductRecordForUser,
);
const mockedSaveProductRecordForUser = vi.mocked(saveProductRecordForUser);
const mockedUpdateSavedProductMetadataRecordForUser = vi.mocked(
  updateSavedProductMetadataRecordForUser,
);

const userId = "auth-user-id";
const otherUserId = "other-user-id";
const productId = "665000000000000000000320";
const savedProductId = "665000000000000000000620";
const fixedDate = new Date("2026-05-24T00:00:00.000Z");

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    _id: new ObjectId(productId),
    name: "Niacinamide 5% Serum",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Niacinamide, Zinc PCA, Panthenol",
    keyActives: ["Niacinamide"],
    tags: ["oiliness-support"],
    warnings: ["Introduce gradually if your skin is easily irritated."],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "oiliness"],
    suitableFor: ["beginner serum step"],
    notRecommendedFor: ["currently irritated skin"],
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
    _id: new ObjectId(savedProductId),
    userId,
    productId: new ObjectId(productId),
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("Saved Product use cases", () => {
  beforeEach(() => {
    mockedGetProductById.mockReset();
    mockedFindSavedProductByUserAndProduct.mockReset();
    mockedIsProductSavedByUser.mockReset();
    mockedListSavedProductsByUser.mockReset();
    mockedRemoveSavedProductRecordForUser.mockReset();
    mockedSaveProductRecordForUser.mockReset();
    mockedUpdateSavedProductMetadataRecordForUser.mockReset();
  });

  it("lists saved products for only the requested user and skips missing products", async () => {
    const missingProductId = "665000000000000000000399";

    mockedListSavedProductsByUser.mockResolvedValue([
      createSavedProduct(),
      createSavedProduct({
        _id: new ObjectId("665000000000000000000621"),
        productId: new ObjectId(missingProductId),
      }),
    ]);
    mockedGetProductById.mockImplementation(async (id) =>
      id === productId ? createProduct() : null,
    );

    await expect(listSavedProductsForUser(userId)).resolves.toEqual([
      expect.objectContaining({
        id: savedProductId,
        productId,
        product: expect.objectContaining({
          id: productId,
          name: "Niacinamide 5% Serum",
        }),
      }),
    ]);
    expect(mockedListSavedProductsByUser).toHaveBeenCalledWith(userId);
    expect(mockedGetProductById).toHaveBeenCalledWith(productId);
    expect(mockedGetProductById).toHaveBeenCalledWith(missingProductId);
  });

  it("returns an existing saved product idempotently without creating a duplicate", async () => {
    mockedGetProductById.mockResolvedValue(createProduct());
    mockedFindSavedProductByUserAndProduct.mockResolvedValue(
      createSavedProduct(),
    );

    await expect(saveProductForUser(userId, productId)).resolves.toMatchObject({
      id: savedProductId,
      productId,
    });
    expect(mockedGetProductById).toHaveBeenCalledWith(productId);
    expect(mockedFindSavedProductByUserAndProduct).toHaveBeenCalledWith(
      userId,
      productId,
    );
    expect(mockedSaveProductRecordForUser).not.toHaveBeenCalled();
  });

  it("saves a visible product for the authenticated user", async () => {
    mockedGetProductById.mockResolvedValue(createProduct());
    mockedFindSavedProductByUserAndProduct.mockResolvedValue(null);
    mockedSaveProductRecordForUser.mockResolvedValue(createSavedProduct());

    await expect(saveProductForUser(userId, productId)).resolves.toMatchObject({
      product: expect.objectContaining({
        name: "Niacinamide 5% Serum",
      }),
    });
    expect(mockedSaveProductRecordForUser).toHaveBeenCalledWith(
      userId,
      productId,
    );
  });

  it("rejects saving nonexistent or not-visible products", async () => {
    mockedGetProductById.mockResolvedValue(null);

    await expect(
      saveProductForUser(userId, productId),
    ).rejects.toBeInstanceOf(SavedProductProductNotFoundError);
    expect(mockedFindSavedProductByUserAndProduct).not.toHaveBeenCalled();
    expect(mockedSaveProductRecordForUser).not.toHaveBeenCalled();
  });

  it("removes saved products through a user-scoped repository call", async () => {
    mockedRemoveSavedProductRecordForUser.mockResolvedValue(false);

    await expect(
      removeSavedProductForUser(otherUserId, productId),
    ).resolves.toBe(true);
    expect(mockedRemoveSavedProductRecordForUser).toHaveBeenCalledWith(
      otherUserId,
      productId,
    );
  });

  it("checks saved state through a user-scoped repository call", async () => {
    mockedIsProductSavedByUser.mockResolvedValue(true);

    await expect(isProductSavedForUser(userId, productId)).resolves.toBe(true);
    expect(mockedIsProductSavedByUser).toHaveBeenCalledWith(userId, productId);
  });

  it("updates metadata through the owner-scoped repository and returns a safe DTO", async () => {
    mockedUpdateSavedProductMetadataRecordForUser.mockResolvedValue(
      createSavedProduct({
        decisionStatus: "testing",
        plannedRoutineSlot: "evening",
        personalNote: "Muốn thử sau khi routine ổn định hơn.",
      }),
    );
    mockedGetProductById.mockResolvedValue(createProduct());

    const result = await updateSavedProductMetadata(userId, productId, {
      decisionStatus: "testing",
      plannedRoutineSlot: "evening",
      personalNote: "Muốn thử sau khi routine ổn định hơn.",
    });
    const serializedResult = JSON.stringify(result);

    expect(
      mockedUpdateSavedProductMetadataRecordForUser,
    ).toHaveBeenCalledWith(userId, productId, {
      decisionStatus: "testing",
      plannedRoutineSlot: "evening",
      personalNote: "Muốn thử sau khi routine ổn định hơn.",
    });
    expect(mockedGetProductById).toHaveBeenCalledWith(productId);
    expect(result).toMatchObject({
      id: savedProductId,
      productId,
      decisionStatus: "testing",
      plannedRoutineSlot: "evening",
      personalNote: "Muốn thử sau khi routine ổn định hơn.",
    });

    for (const privateField of [
      "userId",
      "_id",
      "ObjectId",
      "owner",
      "ownership",
    ]) {
      expect(serializedResult).not.toContain(privateField);
    }
  });

  it("returns null when the current user has no matching saved product", async () => {
    mockedUpdateSavedProductMetadataRecordForUser.mockResolvedValue(null);

    await expect(
      updateSavedProductMetadata(otherUserId, productId, {
        decisionStatus: "paused",
      }),
    ).resolves.toBeNull();
    expect(mockedGetProductById).not.toHaveBeenCalled();
  });

  it("maps existing saved products without metadata", async () => {
    mockedListSavedProductsByUser.mockResolvedValue([createSavedProduct()]);
    mockedGetProductById.mockResolvedValue(createProduct());

    const [result] = await listSavedProductsForUser(userId);

    expect(result).not.toHaveProperty("decisionStatus");
    expect(result).not.toHaveProperty("plannedRoutineSlot");
    expect(result).not.toHaveProperty("personalNote");
  });
});
