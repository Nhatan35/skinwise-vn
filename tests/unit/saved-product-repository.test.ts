import { ObjectId, type Collection, type Document } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/infrastructure/database/collections", () => ({
  getSavedProductsCollection: vi.fn(),
}));

import { getSavedProductsCollection } from "@/infrastructure/database/collections";
import {
  findSavedProductByUserAndProduct,
  isProductSavedByUser,
  listSavedProductsByUser,
  removeSavedProductForUser,
  saveProductForUser,
} from "@/modules/saved-products/saved-product.repository";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";

const mockedGetSavedProductsCollection = vi.mocked(getSavedProductsCollection);

const userId = "auth-user-id";
const productId = "665000000000000000000320";
const savedProductId = "665000000000000000000620";
const fixedDate = new Date("2026-05-24T00:00:00.000Z");

function createSavedProduct(overrides: Partial<SavedProduct> = {}): SavedProduct {
  return {
    _id: new ObjectId(savedProductId),
    userId,
    productId: new ObjectId(productId),
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createCollectionMock() {
  return {
    deleteOne: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  };
}

function setCollectionMock(collection: ReturnType<typeof createCollectionMock>) {
  mockedGetSavedProductsCollection.mockResolvedValue(
    collection as unknown as Collection<Document>,
  );
}

describe("Saved Product repository", () => {
  beforeEach(() => {
    mockedGetSavedProductsCollection.mockReset();
  });

  it("lists saved products scoped by userId and sorted by newest saved", async () => {
    const savedProduct = createSavedProduct();
    const toArray = vi.fn().mockResolvedValue([savedProduct]);
    const sort = vi.fn().mockReturnValue({ toArray });
    const collection = createCollectionMock();

    collection.find.mockReturnValue({ sort });
    setCollectionMock(collection);

    await expect(listSavedProductsByUser(userId)).resolves.toEqual([
      savedProduct,
    ]);
    expect(collection.find).toHaveBeenCalledWith({ userId });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("finds saved products by both userId and productId", async () => {
    const savedProduct = createSavedProduct();
    const collection = createCollectionMock();

    collection.findOne.mockResolvedValue(savedProduct);
    setCollectionMock(collection);

    await expect(
      findSavedProductByUserAndProduct(userId, productId),
    ).resolves.toBe(savedProduct);

    const filter = collection.findOne.mock.calls[0]?.[0] as
      | { productId: ObjectId; userId: string }
      | undefined;

    expect(filter?.userId).toBe(userId);
    expect(filter?.productId.toString()).toBe(productId);
  });

  it("rejects invalid product ids before querying", async () => {
    const collection = createCollectionMock();

    setCollectionMock(collection);

    await expect(
      findSavedProductByUserAndProduct(userId, "not-an-object-id"),
    ).resolves.toBeNull();
    expect(collection.findOne).not.toHaveBeenCalled();
  });

  it("checks saved state through the user-scoped lookup", async () => {
    const collection = createCollectionMock();

    collection.findOne.mockResolvedValue(createSavedProduct());
    setCollectionMock(collection);

    await expect(isProductSavedByUser(userId, productId)).resolves.toBe(true);
  });

  it("upserts saved products with a user-product unique key", async () => {
    const savedProduct = createSavedProduct();
    const collection = createCollectionMock();

    collection.findOneAndUpdate.mockResolvedValue(savedProduct);
    setCollectionMock(collection);

    await expect(saveProductForUser(userId, productId)).resolves.toBe(
      savedProduct,
    );

    const [filter, update, options] = collection.findOneAndUpdate.mock
      .calls[0] as [
      { productId: ObjectId; userId: string },
      {
        $set: { updatedAt: Date };
        $setOnInsert: { createdAt: Date; productId: ObjectId; userId: string };
      },
      { returnDocument: "after"; upsert: boolean },
    ];

    expect(filter.userId).toBe(userId);
    expect(filter.productId.toString()).toBe(productId);
    expect(update.$setOnInsert.userId).toBe(userId);
    expect(update.$setOnInsert.productId.toString()).toBe(productId);
    expect(options).toMatchObject({
      returnDocument: "after",
      upsert: true,
    });
  });

  it("handles duplicate key races by returning the existing saved product", async () => {
    const savedProduct = createSavedProduct();
    const collection = createCollectionMock();

    collection.findOneAndUpdate.mockRejectedValue({ code: 11000 });
    collection.findOne.mockResolvedValue(savedProduct);
    setCollectionMock(collection);

    await expect(saveProductForUser(userId, productId)).resolves.toBe(
      savedProduct,
    );
    expect(collection.findOne).toHaveBeenCalled();
  });

  it("removes only the user-scoped saved product record", async () => {
    const collection = createCollectionMock();

    collection.deleteOne.mockResolvedValue({ deletedCount: 1 });
    setCollectionMock(collection);

    await expect(removeSavedProductForUser(userId, productId)).resolves.toBe(
      true,
    );

    const filter = collection.deleteOne.mock.calls[0]?.[0] as
      | { productId: ObjectId; userId: string }
      | undefined;

    expect(filter?.userId).toBe(userId);
    expect(filter?.productId.toString()).toBe(productId);
  });
});
