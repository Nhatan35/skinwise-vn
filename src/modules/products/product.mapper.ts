import type { ProductDto } from "@/modules/products/product.dto";
import type { Product } from "@/modules/products/product.types";

export function toProductDto(product: Product): ProductDto {
  return {
    id: product._id.toString(),
    name: product.name,
    brand: product.brand,
    category: product.category,
    priceRange: product.priceRange,
    ingredientsText: product.ingredientsText,
    keyActives: [...product.keyActives],
    tags: [...product.tags],
    warnings: [...product.warnings],
    skinTypes: [...product.skinTypes],
    concerns: [...product.concerns],
    suitableFor: [...product.suitableFor],
    notRecommendedFor: [...product.notRecommendedFor],
    verificationStatus: product.verificationStatus,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
