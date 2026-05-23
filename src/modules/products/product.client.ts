import type { ProductDto } from "@/modules/products/product.dto";

const PRODUCTS_API_PATH = "/api/products?limit=50";
const PRODUCT_CATALOGUE_ERROR_MESSAGE =
  "Could not load the product catalogue.";

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

export async function listProducts() {
  let response: Response;

  try {
    response = await fetch(PRODUCTS_API_PATH, {
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
