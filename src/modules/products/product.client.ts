import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
} from "@/modules/products/product.types";

const PRODUCTS_API_BASE_PATH = "/api/products";
const DEFAULT_PRODUCT_LIMIT = 50;
const PRODUCT_CATALOGUE_ERROR_MESSAGE =
  "Could not load the product catalogue.";
const PRODUCT_DETAIL_ERROR_MESSAGE = "Could not load the product details.";

export type ProductListClientInput = {
  category?: ProductCategory;
  concern?: ProductConcern;
  limit?: number;
  priceRange?: ProductPriceRange;
  q?: string;
  skinType?: ProductSkinType;
};

type ApiError = {
  code: string;
  details?: unknown;
  message: string;
};

type ApiResponse<TData> =
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

export class ProductClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "ProductClientError";
    this.code = code;
    this.status = status;
  }
}

export function getProductsApiPath(input: ProductListClientInput = {}) {
  const params = new URLSearchParams();
  const limit = input.limit ?? DEFAULT_PRODUCT_LIMIT;
  const q = input.q?.trim();

  if (q) {
    params.set("q", q);
  }

  if (input.category) {
    params.set("category", input.category);
  }

  if (input.priceRange) {
    params.set("priceRange", input.priceRange);
  }

  if (input.skinType) {
    params.set("skinType", input.skinType);
  }

  if (input.concern) {
    params.set("concern", input.concern);
  }

  params.set("limit", String(limit));

  return `${PRODUCTS_API_BASE_PATH}?${params.toString()}`;
}

export function getProductApiPath(productId: string) {
  return `${PRODUCTS_API_BASE_PATH}/${encodeURIComponent(productId)}`;
}

async function readApiResponse<TData>(
  response: Response,
): Promise<ApiResponse<TData>> {
  try {
    return (await response.json()) as ApiResponse<TData>;
  } catch {
    return {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body.",
      },
    };
  }
}

export async function listProducts(input: ProductListClientInput = {}) {
  let response: Response;

  try {
    response = await fetch(getProductsApiPath(input), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new ProductClientError(PRODUCT_CATALOGUE_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ items: ProductDto[] }>(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw new ProductClientError(
      PRODUCT_CATALOGUE_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  if (!Array.isArray(body.data.items)) {
    throw new ProductClientError(PRODUCT_CATALOGUE_ERROR_MESSAGE);
  }

  return body.data.items;
}

export async function getProduct(productId: string) {
  let response: Response;

  try {
    response = await fetch(getProductApiPath(productId), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new ProductClientError(PRODUCT_DETAIL_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ product: ProductDto }>(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw new ProductClientError(
      PRODUCT_DETAIL_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  if (!body.data.product) {
    throw new ProductClientError(
      PRODUCT_DETAIL_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.product;
}
