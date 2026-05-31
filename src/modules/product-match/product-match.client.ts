import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  PRODUCT_VERIFICATION_STATUSES,
} from "@/modules/products/product.types";
import type {
  ProductMatchDto,
  ProductMatchLevel,
  ProductMatchResponseDto,
} from "@/modules/product-match/product-match.dto";
import {
  BUDGET_RANGES,
  EXPERIENCE_LEVELS,
  SENSITIVITY_LEVELS,
  SKIN_CONCERNS,
  SKIN_TYPES,
} from "@/modules/skin-profile/skin-profile.types";

const PRODUCT_MATCH_API_PATH = "/api/product-match";
const PRODUCT_MATCH_ERROR_MESSAGE = "Không thể tải gợi ý sản phẩm.";
const matchLevels: ProductMatchLevel[] = [
  "strong",
  "good",
  "cautious",
  "low",
];

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

export type ProductMatchClientParams = {
  limit?: number;
};

export class ProductMatchClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "ProductMatchClientError";
    this.code = code;
    this.status = status;
  }
}

export function getProductMatchApiPath(params?: ProductMatchClientParams) {
  const searchParams = new URLSearchParams();

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();

  return queryString
    ? `${PRODUCT_MATCH_API_PATH}?${queryString}`
    : PRODUCT_MATCH_API_PATH;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
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

function isProductDto(value: unknown) {
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

function isProductMatchDto(value: unknown): value is ProductMatchDto {
  return (
    isRecord(value) &&
    isProductDto(value.product) &&
    isNumber(value.matchScore) &&
    isOneOf(matchLevels, value.matchLevel) &&
    isStringArray(value.reasons) &&
    isStringArray(value.cautions) &&
    isRecord(value.matchedSignals) &&
    isBoolean(value.matchedSignals.skinType) &&
    Array.isArray(value.matchedSignals.concerns) &&
    value.matchedSignals.concerns.every((concern) =>
      isOneOf(SKIN_CONCERNS, concern),
    ) &&
    isBoolean(value.matchedSignals.budget) &&
    isBoolean(value.matchedSignals.sensitivity) &&
    isStringArray(value.matchedSignals.avoidedIngredients) &&
    isBoolean(value.isSaved)
  );
}

function isSkinProfileSummary(value: unknown) {
  return (
    isRecord(value) &&
    isOneOf(SKIN_TYPES, value.skinType) &&
    Array.isArray(value.concerns) &&
    value.concerns.every((concern) => isOneOf(SKIN_CONCERNS, concern)) &&
    isOneOf(SENSITIVITY_LEVELS, value.sensitivityLevel) &&
    isOneOf(BUDGET_RANGES, value.budgetRange) &&
    isOneOf(EXPERIENCE_LEVELS, value.experienceLevel) &&
    isNumber(value.avoidIngredientsCount)
  );
}

function isProductMatchResponseDto(
  value: unknown,
): value is ProductMatchResponseDto {
  return (
    isRecord(value) &&
    isBoolean(value.skinProfileExists) &&
    isString(value.generatedAt) &&
    Array.isArray(value.items) &&
    value.items.every(isProductMatchDto) &&
    (value.skinProfileSummary === undefined ||
      isSkinProfileSummary(value.skinProfileSummary))
  );
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

function toClientError(response: Response, error?: ApiError | null) {
  return new ProductMatchClientError(
    PRODUCT_MATCH_ERROR_MESSAGE,
    error?.code,
    response.status,
  );
}

export async function getProductMatches(
  params?: ProductMatchClientParams,
): Promise<ProductMatchResponseDto> {
  let response: Response;

  try {
    response = await fetch(getProductMatchApiPath(params), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new ProductMatchClientError(PRODUCT_MATCH_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw toClientError(response, body.error);
  }

  if (!isProductMatchResponseDto(body.data)) {
    throw new ProductMatchClientError(
      PRODUCT_MATCH_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data;
}
