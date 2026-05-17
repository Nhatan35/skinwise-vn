import "server-only";

import { ObjectId, type Filter } from "mongodb";

import type { ProductListQueryInput } from "@/modules/products/product.schema";
import {
  VISIBLE_PRODUCT_VERIFICATION_STATUSES,
  type Product,
  type ProductDocument,
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

export async function searchVisibleProducts(
  input: ProductListQueryInput,
): Promise<Product[]> {
  const collection = await getProductCollection();
  const filter: Filter<ProductDocument> = visibleProductFilter();

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

  return collection
    .find(filter)
    .sort({ brand: 1, name: 1 })
    .limit(input.limit)
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
