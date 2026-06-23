import type { ObjectId } from "mongodb";

import type {
  AdminCreateProductBodyInput,
  AdminProductListQueryInput,
  AdminUpdateProductBodyInput,
  ProductListQueryInput,
} from "@/modules/products/product.schema";
import {
  createProduct,
  findProductById,
  findVisibleProductById,
  searchProductsForAdmin,
  searchVisibleProducts,
  updateProduct,
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

export async function createProductForAdmin(
  input: AdminCreateProductBodyInput,
  options: {
    createdByUserId?: ObjectId;
  } = {},
) {
  return createProduct({
    ...input,
    ...(options.createdByUserId
      ? { createdByUserId: options.createdByUserId }
      : {}),
    source: "admin",
  });
}

export async function getProductByIdForAdmin(id: string) {
  return findProductById(id);
}

export async function updateProductForAdmin(
  id: string,
  input: AdminUpdateProductBodyInput,
) {
  return updateProduct(id, input);
}

export async function updateProductVerificationStatusForAdmin(
  id: string,
  verificationStatus: ProductVerificationStatus,
) {
  return updateProductVerificationStatus(id, verificationStatus);
}
