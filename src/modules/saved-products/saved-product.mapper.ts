import { toProductDto } from "@/modules/products/product.mapper";
import type { Product } from "@/modules/products/product.types";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";

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
    createdAt: savedProduct.createdAt.toISOString(),
    updatedAt: savedProduct.updatedAt.toISOString(),
  };
}
