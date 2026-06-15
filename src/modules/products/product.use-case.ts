import type {
  AdminProductListQueryInput,
  ProductListQueryInput,
} from "@/modules/products/product.schema";
import {
  findProductById,
  findVisibleProductById,
  searchProductsForAdmin,
  searchVisibleProducts,
  updateProductVerificationStatus,
} from "@/modules/products/product.repository";
import type { ProductVerificationStatus } from "@/modules/products/product.types";

export async function listProducts(input: ProductListQueryInput) {
  return searchVisibleProducts(input);
}

export async function getProductById(id: string) {
  return findVisibleProductById(id);
}

export async function listProductsForAdmin(input: AdminProductListQueryInput) {
  return searchProductsForAdmin(input);
}

export async function getProductByIdForAdmin(id: string) {
  return findProductById(id);
}

export async function updateProductVerificationStatusForAdmin(
  id: string,
  verificationStatus: ProductVerificationStatus,
) {
  return updateProductVerificationStatus(id, verificationStatus);
}
