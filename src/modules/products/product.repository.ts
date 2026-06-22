import "server-only";

import { ObjectId, type Filter } from "mongodb";

import type {
  AdminProductListQueryInput,
  ProductListQueryInput,
} from "@/modules/products/product.schema";
import {
  VISIBLE_PRODUCT_VERIFICATION_STATUSES,
  type Product,
  type ProductCategory,
  type ProductConcern,
  type ProductDocument,
  type ProductPriceRange,
  type ProductSkinType,
  type ProductVerificationStatus,
} from "@/modules/products/product.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

async function getProductCollection() {
  const { getProductsCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getProductsCollection<ProductDocument>();
}

function toObjectId(id: string) {
  if (!mongoObjectIdPattern.test(id)) {
    return null;
  }

  return new ObjectId(id);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toSearchRegex(value: string) {
  return new RegExp(escapeRegex(value), "i");
}

function visibleProductFilter(): Filter<ProductDocument> {
  return {
    verificationStatus: {
      $in: [...VISIBLE_PRODUCT_VERIFICATION_STATUSES],
    },
  };
}

function applySharedProductFilters(
  filter: Filter<ProductDocument>,
  input: Omit<AdminProductListQueryInput, "verificationStatus">,
) {
  if (input.q) {
    const searchRegex = toSearchRegex(input.q);

    filter.$or = [
      { name: searchRegex } as Filter<ProductDocument>,
      { brand: searchRegex } as Filter<ProductDocument>,
      { ingredientsText: searchRegex } as Filter<ProductDocument>,
      { keyActives: searchRegex } as Filter<ProductDocument>,
      { tags: searchRegex } as Filter<ProductDocument>,
    ];
  }

  if (input.category) {
    filter.category = input.category;
  }

  if (input.priceRange) {
    filter.priceRange = input.priceRange;
  }

  if (input.skinType) {
    filter.skinTypes = input.skinType;
  }

  if (input.concern) {
    filter.concerns = input.concern;
  }
}

export async function searchVisibleProducts(
  input: ProductListQueryInput,
): Promise<Product[]> {
  const collection = await getProductCollection();
  const filter: Filter<ProductDocument> = visibleProductFilter();

  applySharedProductFilters(filter, input);

  return collection
    .find(filter)
    .sort({ brand: 1, name: 1 })
    .limit(input.limit)
    .toArray();
}

export async function listVisibleProductsForMatching(): Promise<Product[]> {
  const collection = await getProductCollection();

  return collection
    .find(visibleProductFilter())
    .sort({ brand: 1, name: 1 })
    .toArray();
}

export async function findVisibleProductsByIds(
  ids: string[],
): Promise<Product[]> {
  const objectIds = Array.from(new Set(ids))
    .map(toObjectId)
    .filter((objectId): objectId is ObjectId => objectId !== null);

  if (objectIds.length === 0) {
    return [];
  }

  const collection = await getProductCollection();

  return collection
    .find({
      ...visibleProductFilter(),
      _id: {
        $in: objectIds,
      },
    })
    .sort({ brand: 1, name: 1 })
    .toArray();
}

export async function findVisibleProductById(
  id: string,
): Promise<Product | null> {
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getProductCollection();

  return collection.findOne({
    ...visibleProductFilter(),
    _id: objectId,
  });
}

export async function searchProductsForAdmin(
  input: AdminProductListQueryInput,
): Promise<Product[]> {
  const collection = await getProductCollection();
  const filter: Filter<ProductDocument> = {};

  applySharedProductFilters(filter, input);

  if (input.verificationStatus) {
    filter.verificationStatus = input.verificationStatus;
  }

  return collection.find(filter).sort({ brand: 1, name: 1 }).toArray();
}

export type CreateProductData = Pick<
  ProductDocument,
  | "brand"
  | "category"
  | "concerns"
  | "ingredientsText"
  | "keyActives"
  | "name"
  | "notRecommendedFor"
  | "priceRange"
  | "skinTypes"
  | "source"
  | "suitableFor"
  | "tags"
  | "verificationStatus"
  | "warnings"
> &
  Partial<Pick<ProductDocument, "createdByUserId">>;

export type UpdateProductData = Partial<{
  brand: string;
  category: ProductCategory;
  concerns: ProductConcern[];
  ingredientsText: string;
  keyActives: string[];
  name: string;
  notRecommendedFor: string[];
  priceRange: ProductPriceRange;
  skinTypes: ProductSkinType[];
  suitableFor: string[];
  tags: string[];
  verificationStatus: ProductVerificationStatus;
  warnings: string[];
}>;

export async function createProduct(input: CreateProductData): Promise<Product> {
  const collection = await getProductCollection();
  const now = new Date();
  const product: ProductDocument = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(product);

  return {
    _id: result.insertedId,
    ...product,
  };
}

export async function updateProduct(
  id: string,
  input: UpdateProductData,
): Promise<Product | null> {
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getProductCollection();

  return collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    },
  );
}

export async function findProductById(id: string): Promise<Product | null> {
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getProductCollection();

  return collection.findOne({
    _id: objectId,
  });
}

export async function updateProductVerificationStatus(
  id: string,
  verificationStatus: ProductVerificationStatus,
): Promise<Product | null> {
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getProductCollection();

  return collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        verificationStatus,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    },
  );
}
