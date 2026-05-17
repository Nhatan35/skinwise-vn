import type { ProductListQueryInput } from "@/modules/products/product.schema";
import {
  findVisibleProductById,
  searchVisibleProducts,
} from "@/modules/products/product.repository";

export async function listProducts(input: ProductListQueryInput) {
  return searchVisibleProducts(input);
}

export async function getProductById(id: string) {
  return findVisibleProductById(id);
}
