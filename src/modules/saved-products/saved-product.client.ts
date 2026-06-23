import type { ProductDto } from "@/modules/products/product.dto";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  PRODUCT_VERIFICATION_STATUSES,
} from "@/modules/products/product.types";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import type { UpdateSavedProductMetadataInput } from "@/modules/saved-products/saved-product.schema";
import {
  SAVED_PRODUCT_DECISION_STATUSES,
  SAVED_PRODUCT_PLANNED_ROUTINE_SLOTS,
} from "@/modules/saved-products/saved-product.types";

const SAVED_PRODUCTS_API_PATH = "/api/saved-products";
const SAVED_PRODUCTS_LIST_ERROR_MESSAGE = "Could not load saved products.";
const SAVE_PRODUCT_ERROR_MESSAGE = "Could not save this product.";
const REMOVE_SAVED_PRODUCT_ERROR_MESSAGE =
  "Could not remove this saved product.";
const UPDATE_SAVED_PRODUCT_METADATA_ERROR_MESSAGE =
  "Could not update this saved product.";

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

export class SavedProductClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "SavedProductClientError";
    this.code = code;
    this.status = status;
  }
}

export function getSavedProductsApiPath() {
  return SAVED_PRODUCTS_API_PATH;
}

export function getSavedProductApiPath(productId: string) {
  return `${SAVED_PRODUCTS_API_PATH}/${encodeURIComponent(productId)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isOneOf<TValues extends readonly string[]>(
  values: TValues,
  value: unknown,
): value is TValues[number] {
  return typeof value === "string" && values.some((item) => item === value);
}

function isApiError(value: unknown): value is ApiError {
  return isRecord(value) && isString(value.code) && isString(value.message);
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (!isRecord(value)) {
    return false;
  }

  if (value.error === null) {
    return "data" in value && value.data !== null;
  }

  return value.data === null && isApiError(value.error);
}

function isProductDto(value: unknown): value is ProductDto {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.brand) &&
    isOneOf(PRODUCT_CATEGORIES, value.category) &&
    isOneOf(PRODUCT_PRICE_RANGES, value.priceRange) &&
    isString(value.ingredientsText) &&
    isStringArray(value.keyActives) &&
    isStringArray(value.tags) &&
    isStringArray(value.warnings) &&
    Array.isArray(value.skinTypes) &&
    value.skinTypes.every((skinType) =>
      isOneOf(PRODUCT_SKIN_TYPES, skinType),
    ) &&
    Array.isArray(value.concerns) &&
    value.concerns.every((concern) => isOneOf(PRODUCT_CONCERNS, concern)) &&
    isStringArray(value.suitableFor) &&
    isStringArray(value.notRecommendedFor) &&
    isOneOf(PRODUCT_VERIFICATION_STATUSES, value.verificationStatus) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
}

function isSavedProductDto(value: unknown): value is SavedProductDto {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.productId) &&
    isProductDto(value.product) &&
    (!("decisionStatus" in value) ||
      isOneOf(SAVED_PRODUCT_DECISION_STATUSES, value.decisionStatus)) &&
    (!("plannedRoutineSlot" in value) ||
      isOneOf(
        SAVED_PRODUCT_PLANNED_ROUTINE_SLOTS,
        value.plannedRoutineSlot,
      )) &&
    (!("personalNote" in value) || isString(value.personalNote)) &&
    isStringArray(value.tags) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
}

function hasOwnField<TObject extends object>(
  value: TObject,
  field: keyof TObject,
) {
  return Object.prototype.hasOwnProperty.call(value, field);
}

function toSavedProductMetadataRequestBody(
  input: UpdateSavedProductMetadataInput,
): UpdateSavedProductMetadataInput {
  const body: UpdateSavedProductMetadataInput = {};

  if (hasOwnField(input, "decisionStatus") && input.decisionStatus !== undefined) {
    body.decisionStatus = input.decisionStatus;
  }

  if (
    hasOwnField(input, "plannedRoutineSlot") &&
    input.plannedRoutineSlot !== undefined
  ) {
    body.plannedRoutineSlot = input.plannedRoutineSlot;
  }

  if (hasOwnField(input, "personalNote") && input.personalNote !== undefined) {
    body.personalNote = input.personalNote;
  }

  if (hasOwnField(input, "tags") && input.tags !== undefined) {
    body.tags = input.tags;
  }

  return body;
}

async function readApiResponse(
  response: Response,
): Promise<ApiResponse<unknown>> {
  try {
    const body: unknown = await response.json();

    if (isApiResponse(body)) {
      return body;
    }
  } catch {
    return {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body.",
      },
    };
  }

  return {
    data: null,
    error: {
      code: "INTERNAL_ERROR",
      message: "Invalid response body.",
    },
  };
}

function toClientError(
  message: string,
  response: Response,
  error?: ApiError | null,
) {
  return new SavedProductClientError(
    message,
    error?.code,
    response.status,
  );
}

export async function listSavedProducts(): Promise<SavedProductDto[]> {
  let response: Response;

  try {
    response = await fetch(getSavedProductsApiPath(), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new SavedProductClientError(SAVED_PRODUCTS_LIST_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw toClientError(
      SAVED_PRODUCTS_LIST_ERROR_MESSAGE,
      response,
      body.error,
    );
  }

  if (!isRecord(body.data) || !Array.isArray(body.data.items)) {
    throw new SavedProductClientError(
      SAVED_PRODUCTS_LIST_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  if (!body.data.items.every(isSavedProductDto)) {
    throw new SavedProductClientError(
      SAVED_PRODUCTS_LIST_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.items;
}

export async function saveProduct(
  productId: string,
): Promise<SavedProductDto> {
  let response: Response;

  try {
    response = await fetch(getSavedProductsApiPath(), {
      body: JSON.stringify({ productId }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new SavedProductClientError(SAVE_PRODUCT_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw toClientError(SAVE_PRODUCT_ERROR_MESSAGE, response, body.error);
  }

  if (!isRecord(body.data) || !isSavedProductDto(body.data.item)) {
    throw new SavedProductClientError(
      SAVE_PRODUCT_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.item;
}

export async function removeSavedProduct(productId: string): Promise<true> {
  let response: Response;

  try {
    response = await fetch(getSavedProductApiPath(productId), {
      headers: {
        Accept: "application/json",
      },
      method: "DELETE",
    });
  } catch {
    throw new SavedProductClientError(REMOVE_SAVED_PRODUCT_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw toClientError(
      REMOVE_SAVED_PRODUCT_ERROR_MESSAGE,
      response,
      body.error,
    );
  }

  if (!isRecord(body.data) || body.data.removed !== true) {
    throw new SavedProductClientError(
      REMOVE_SAVED_PRODUCT_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.removed;
}

export async function updateSavedProductMetadata(
  productId: string,
  input: UpdateSavedProductMetadataInput,
): Promise<SavedProductDto> {
  let response: Response;

  try {
    response = await fetch(getSavedProductApiPath(productId), {
      body: JSON.stringify(toSavedProductMetadataRequestBody(input)),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
  } catch {
    throw new SavedProductClientError(
      UPDATE_SAVED_PRODUCT_METADATA_ERROR_MESSAGE,
    );
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw toClientError(
      UPDATE_SAVED_PRODUCT_METADATA_ERROR_MESSAGE,
      response,
      body.error,
    );
  }

  if (!isRecord(body.data) || !isSavedProductDto(body.data.item)) {
    throw new SavedProductClientError(
      UPDATE_SAVED_PRODUCT_METADATA_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.item;
}
