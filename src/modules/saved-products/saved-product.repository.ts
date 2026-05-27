import "server-only";

import { ObjectId } from "mongodb";

import type {
  SavedProduct,
  SavedProductDocument,
} from "@/modules/saved-products/saved-product.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

async function getSavedProductCollection() {
  const { getSavedProductsCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getSavedProductsCollection<SavedProductDocument>();
}

function toSavedProductObjectId(productId: string) {
  if (!mongoObjectIdPattern.test(productId)) {
    return null;
  }

  return new ObjectId(productId);
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

export async function listSavedProductsByUser(
  userId: string,
): Promise<SavedProduct[]> {
  const collection = await getSavedProductCollection();

  return collection.find({ userId }).sort({ createdAt: -1 }).toArray();
}

export async function findSavedProductByUserAndProduct(
  userId: string,
  productId: string,
): Promise<SavedProduct | null> {
  const productObjectId = toSavedProductObjectId(productId);

  if (!productObjectId) {
    return null;
  }

  const collection = await getSavedProductCollection();

  return collection.findOne({ userId, productId: productObjectId });
}

export async function isProductSavedByUser(
  userId: string,
  productId: string,
): Promise<boolean> {
  const savedProduct = await findSavedProductByUserAndProduct(userId, productId);

  return savedProduct !== null;
}

export async function saveProductForUser(
  userId: string,
  productId: string,
): Promise<SavedProduct | null> {
  const productObjectId = toSavedProductObjectId(productId);

  if (!productObjectId) {
    return null;
  }

  const collection = await getSavedProductCollection();
  const now = new Date();

  try {
    return await collection.findOneAndUpdate(
      { userId, productId: productObjectId },
      {
        $set: {
          updatedAt: now,
        },
        $setOnInsert: {
          userId,
          productId: productObjectId,
          createdAt: now,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
      },
    );
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return findSavedProductByUserAndProduct(userId, productId);
    }

    throw error;
  }
}

export async function removeSavedProductForUser(
  userId: string,
  productId: string,
): Promise<boolean> {
  const productObjectId = toSavedProductObjectId(productId);

  if (!productObjectId) {
    return false;
  }

  const collection = await getSavedProductCollection();
  const result = await collection.deleteOne({ userId, productId: productObjectId });

  return result.deletedCount > 0;
}
