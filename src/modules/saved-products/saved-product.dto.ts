import type { ProductDto } from "@/modules/products/product.dto";

export type SavedProductDto = {
  id: string;
  productId: string;
  product: ProductDto;
  createdAt: string;
  updatedAt: string;
};
