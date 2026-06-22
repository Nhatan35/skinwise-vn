import type { ProductDto } from "@/modules/products/product.dto";
import type {
  AdminCreateProductBodyInput,
  AdminUpdateProductBodyInput,
} from "@/modules/products/product.schema";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  PRODUCT_VERIFICATION_STATUSES,
  type ProductCategory,
  type ProductConcern,
  type ProductPriceRange,
  type ProductSkinType,
  type ProductVerificationStatus,
} from "@/modules/products/product.types";

const ADMIN_PRODUCTS_API_BASE_PATH = "/api/admin/products";
const ADMIN_PRODUCT_CREATE_ERROR_MESSAGE = "Could not create admin product.";
const ADMIN_PRODUCT_LIST_ERROR_MESSAGE = "Could not load admin products.";
const ADMIN_PRODUCT_SAVE_ERROR_MESSAGE = "Could not save admin product.";
const ADMIN_PRODUCT_UPDATE_ERROR_MESSAGE =
  "Could not update product verification status.";

export type AdminProductListClientInput = {
  category?: ProductCategory;
  concern?: ProductConcern;
  priceRange?: ProductPriceRange;
  q?: string;
  skinType?: ProductSkinType;
  verificationStatus?: ProductVerificationStatus;
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

export class AdminProductClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "AdminProductClientError";
    this.code = code;
    this.status = status;
  }
}

function includesValue<const TValues extends readonly string[]>(
  values: TValues,
  value: string,
): value is TValues[number] {
  return (values as readonly string[]).includes(value);
}

function assertValue<const TValues extends readonly string[]>(
  values: TValues,
  value: string,
  label: string,
) {
  if (!includesValue(values, value)) {
    throw new AdminProductClientError(
      `Invalid ${label}.`,
      "VALIDATION_ERROR",
      400,
    );
  }

  return value;
}

export function assertProductVerificationStatus(
  value: string,
): ProductVerificationStatus {
  return assertValue(
    PRODUCT_VERIFICATION_STATUSES,
    value,
    "product verification status",
  ) as ProductVerificationStatus;
}

export function getAdminProductsApiPath(
  input: AdminProductListClientInput = {},
) {
  const params = new URLSearchParams();
  const q = input.q?.trim();

  if (q) {
    params.set("q", q);
  }

  if (input.category) {
    params.set(
      "category",
      assertValue(PRODUCT_CATEGORIES, input.category, "category"),
    );
  }

  if (input.priceRange) {
    params.set(
      "priceRange",
      assertValue(PRODUCT_PRICE_RANGES, input.priceRange, "price range"),
    );
  }

  if (input.skinType) {
    params.set(
      "skinType",
      assertValue(PRODUCT_SKIN_TYPES, input.skinType, "skin type"),
    );
  }

  if (input.concern) {
    params.set(
      "concern",
      assertValue(PRODUCT_CONCERNS, input.concern, "concern"),
    );
  }

  if (input.verificationStatus) {
    params.set(
      "verificationStatus",
      assertProductVerificationStatus(input.verificationStatus),
    );
  }

  const queryString = params.toString();

  return queryString
    ? `${ADMIN_PRODUCTS_API_BASE_PATH}?${queryString}`
    : ADMIN_PRODUCTS_API_BASE_PATH;
}

export function getAdminProductVerificationStatusApiPath(productId: string) {
  return `${ADMIN_PRODUCTS_API_BASE_PATH}/${encodeURIComponent(
    productId,
  )}/verification-status`;
}

export function getAdminProductApiPath(productId: string) {
  return `${ADMIN_PRODUCTS_API_BASE_PATH}/${encodeURIComponent(productId)}`;
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

function hasApiData<TData>(
  body: ApiResponse<TData>,
): body is { data: TData; error: null } {
  return body.error === null && body.data !== null;
}

export async function listAdminProducts(
  input: AdminProductListClientInput = {},
) {
  let response: Response;

  try {
    response = await fetch(getAdminProductsApiPath(input), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new AdminProductClientError(ADMIN_PRODUCT_LIST_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ items: ProductDto[] }>(response);

  if (!response.ok || !hasApiData(body) || !Array.isArray(body.data.items)) {
    throw new AdminProductClientError(
      ADMIN_PRODUCT_LIST_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  return body.data.items;
}

export async function createAdminProduct(input: AdminCreateProductBodyInput) {
  let response: Response;

  try {
    response = await fetch(ADMIN_PRODUCTS_API_BASE_PATH, {
      body: JSON.stringify(input),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new AdminProductClientError(ADMIN_PRODUCT_CREATE_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ product: ProductDto }>(response);

  if (!response.ok || !hasApiData(body) || !body.data.product) {
    throw new AdminProductClientError(
      ADMIN_PRODUCT_CREATE_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  return body.data.product;
}

export async function updateAdminProduct(
  productId: string,
  input: AdminUpdateProductBodyInput,
) {
  let response: Response;

  try {
    response = await fetch(getAdminProductApiPath(productId), {
      body: JSON.stringify(input),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
  } catch {
    throw new AdminProductClientError(ADMIN_PRODUCT_SAVE_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ product: ProductDto }>(response);

  if (!response.ok || !hasApiData(body) || !body.data.product) {
    throw new AdminProductClientError(
      ADMIN_PRODUCT_SAVE_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  return body.data.product;
}

export async function updateAdminProductVerificationStatus(
  productId: string,
  verificationStatus: ProductVerificationStatus,
) {
  const nextStatus = assertProductVerificationStatus(verificationStatus);
  let response: Response;

  try {
    response = await fetch(getAdminProductVerificationStatusApiPath(productId), {
      body: JSON.stringify({ verificationStatus: nextStatus }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
  } catch {
    throw new AdminProductClientError(ADMIN_PRODUCT_UPDATE_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ product: ProductDto }>(response);

  if (!response.ok || !hasApiData(body) || !body.data.product) {
    throw new AdminProductClientError(
      ADMIN_PRODUCT_UPDATE_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  return body.data.product;
}
