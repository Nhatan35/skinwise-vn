import type { ProductDto } from "@/modules/products/product.dto";

export const UNKNOWN_PRODUCT_LABEL = "Unknown product";

export type ProductLookup = Record<string, ProductDto>;

export type JournalProductLabel = {
  id: string;
  label: string;
};

export function getProductDisplayName(product?: ProductDto | null) {
  const brand = product?.brand?.trim() ?? "";
  const name = product?.name?.trim() ?? "";

  if (brand && name) {
    return `${brand} - ${name}`;
  }

  if (name) {
    return name;
  }

  if (brand) {
    return brand;
  }

  return UNKNOWN_PRODUCT_LABEL;
}

export function buildProductLookup(products?: ProductDto[] | null) {
  const lookup = Object.create(null) as ProductLookup;

  for (const product of products ?? []) {
    if (!product.id) {
      continue;
    }

    lookup[product.id] = product;
  }

  return lookup;
}

export function resolveJournalProductLabels(
  productsUsed?: string[] | null,
  productLookup: ProductLookup = {},
) {
  return (productsUsed ?? []).map<JournalProductLabel>((productId) => ({
    id: productId,
    label: getProductDisplayName(productLookup[productId]),
  }));
}
