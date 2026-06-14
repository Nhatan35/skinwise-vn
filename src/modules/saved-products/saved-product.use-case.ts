import { getProductById } from "@/modules/products/product.use-case";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import { toSavedProductDto } from "@/modules/saved-products/saved-product.mapper";
import {
  findSavedProductByUserAndProduct,
  isProductSavedByUser,
  listSavedProductsByUser,
  removeSavedProductForUser as removeSavedProductRecordForUser,
  saveProductForUser as saveProductRecordForUser,
  updateSavedProductMetadataForUser as updateSavedProductMetadataRecordForUser,
} from "@/modules/saved-products/saved-product.repository";
import type { UpdateSavedProductMetadataInput } from "@/modules/saved-products/saved-product.schema";

export class SavedProductProductNotFoundError extends Error {
  constructor(message = "Product was not found.") {
    super(message);
    this.name = "SavedProductProductNotFoundError";
  }
}

function isPresent<TValue>(value: TValue | null): value is TValue {
  return value !== null;
}

export async function listSavedProductsForUser(
  userId: string,
): Promise<SavedProductDto[]> {
  const savedProducts = await listSavedProductsByUser(userId);
  const savedProductDtos = await Promise.all(
    savedProducts.map(async (savedProduct) => {
      const product = await getProductById(savedProduct.productId.toString());

      if (!product) {
        return null;
      }

      return toSavedProductDto(savedProduct, product);
    }),
  );

  return savedProductDtos.filter(isPresent);
}

export async function saveProductForUser(
  userId: string,
  productId: string,
): Promise<SavedProductDto> {
  const product = await getProductById(productId);

  if (!product) {
    throw new SavedProductProductNotFoundError();
  }

  const savedProduct =
    (await findSavedProductByUserAndProduct(userId, productId)) ??
    (await saveProductRecordForUser(userId, productId));

  if (!savedProduct) {
    throw new SavedProductProductNotFoundError();
  }

  return toSavedProductDto(savedProduct, product);
}

export async function removeSavedProductForUser(
  userId: string,
  productId: string,
): Promise<boolean> {
  await removeSavedProductRecordForUser(userId, productId);

  return true;
}

export async function isProductSavedForUser(
  userId: string,
  productId: string,
): Promise<boolean> {
  return isProductSavedByUser(userId, productId);
}

export async function updateSavedProductMetadata(
  userId: string,
  productId: string,
  input: UpdateSavedProductMetadataInput,
): Promise<SavedProductDto | null> {
  const savedProduct = await updateSavedProductMetadataRecordForUser(
    userId,
    productId,
    input,
  );

  if (!savedProduct) {
    return null;
  }

  const product = await getProductById(savedProduct.productId.toString());

  if (!product) {
    return null;
  }

  return toSavedProductDto(savedProduct, product);
}
