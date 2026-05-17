import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
  ProductVerificationStatus,
} from "@/modules/products/product.types";

export type ProductDto = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  priceRange: ProductPriceRange;
  ingredientsText: string;
  keyActives: string[];
  tags: string[];
  warnings: string[];
  skinTypes: ProductSkinType[];
  concerns: ProductConcern[];
  suitableFor: string[];
  notRecommendedFor: string[];
  verificationStatus: ProductVerificationStatus;
  createdAt: string;
  updatedAt: string;
};
