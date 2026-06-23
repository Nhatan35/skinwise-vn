import { toProductDto } from "@/modules/products/product.mapper";
import type { Product } from "@/modules/products/product.types";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";

function toSavedProductTags(value: unknown) {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === "string")
    : [];
}

export function toSavedProductDto(
  savedProduct: SavedProduct,
  product: Product,
): SavedProductDto {
  return {
    id: savedProduct._id.toString(),
    productId: savedProduct.productId.toString(),
    product: toProductDto(product),
    ...(savedProduct.decisionStatus
      ? { decisionStatus: savedProduct.decisionStatus }
      : {}),
    ...(savedProduct.plannedRoutineSlot
      ? { plannedRoutineSlot: savedProduct.plannedRoutineSlot }
      : {}),
    ...(savedProduct.personalNote
      ? { personalNote: savedProduct.personalNote }
      : {}),
    tags: toSavedProductTags(savedProduct.tags),
    createdAt: savedProduct.createdAt.toISOString(),
    updatedAt: savedProduct.updatedAt.toISOString(),
  };
}
