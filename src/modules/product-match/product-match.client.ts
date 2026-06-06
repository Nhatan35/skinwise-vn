import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  PRODUCT_VERIFICATION_STATUSES,
} from "@/modules/products/product.types";
import type {
  ProductDetailMatchResponseDto,
  ProductMatchDto,
  ProductMatchExplanationDto,
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
const PRODUCT_DETAIL_MATCH_ERROR_MESSAGE =
  "Không thể tải giải thích phù hợp cá nhân hóa.";
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

export function getProductMatchForProductApiPath(productId: string) {
  return `/api/products/${encodeURIComponent(productId)}/match`;
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

function isProductMatchExplanationReason(value: unknown) {
  return (
    isRecord(value) &&
    isString(value.type) &&
    isString(value.message) &&
    (value.relatedIngredients === undefined ||
      isStringArray(value.relatedIngredients)) &&
    (value.relatedConcerns === undefined ||
      (Array.isArray(value.relatedConcerns) &&
        value.relatedConcerns.every((concern) =>
          isOneOf(SKIN_CONCERNS, concern),
        )))
  );
}

function isProductMatchIngredientHighlight(value: unknown) {
  return (
    isRecord(value) &&
    isString(value.ingredientName) &&
    isOneOf(["positive", "caution", "neutral"] as const, value.effect) &&
    isString(value.reason)
  );
}

function isProductMatchExplanationDto(
  value: unknown,
): value is ProductMatchExplanationDto {
  return (
    isRecord(value) &&
    isString(value.summary) &&
    Array.isArray(value.positiveReasons) &&
    value.positiveReasons.every(isProductMatchExplanationReason) &&
    Array.isArray(value.cautionReasons) &&
    value.cautionReasons.every(isProductMatchExplanationReason) &&
    Array.isArray(value.ingredientHighlights) &&
    value.ingredientHighlights.every(isProductMatchIngredientHighlight) &&
    isString(value.usageNote) &&
    (value.dataQualityNotes === undefined ||
      isStringArray(value.dataQualityNotes))
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
    (value.matchedSignals.skinTypes === undefined ||
      (Array.isArray(value.matchedSignals.skinTypes) &&
        value.matchedSignals.skinTypes.every((skinType) =>
          isOneOf(SKIN_TYPES, skinType),
        ))) &&
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

function sanitizeProductMatchDto(item: ProductMatchDto): ProductMatchDto {
  if (!isRecord(item) || !isProductMatchExplanationDto(item.matchExplanation)) {
    return {
      product: item.product,
      matchScore: item.matchScore,
      matchLevel: item.matchLevel,
      reasons: item.reasons,
      cautions: item.cautions,
      matchedSignals: item.matchedSignals,
      isSaved: item.isSaved,
    };
  }

  return item;
}

function sanitizeProductMatchResponseDto(
  response: ProductMatchResponseDto,
): ProductMatchResponseDto {
  return {
    ...response,
    items: response.items.map(sanitizeProductMatchDto),
  };
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

function isProductDetailMatchResponseDto(
  value: unknown,
): value is ProductDetailMatchResponseDto {
  if (
    !isRecord(value) ||
    !isString(value.productId) ||
    !isBoolean(value.matchAvailable) ||
    !isBoolean(value.skinProfileExists)
  ) {
    return false;
  }

  if (value.matchAvailable) {
    return value.skinProfileExists === true && isProductMatchDto(value.match);
  }

  return (
    isOneOf(
      ["NO_SKIN_PROFILE", "NO_INGREDIENT_DATA", "MATCH_UNAVAILABLE"] as const,
      value.matchUnavailableReason,
    ) && isProductMatchExplanationDto(value.matchExplanation)
  );
}

function sanitizeProductDetailMatchResponseDto(
  response: ProductDetailMatchResponseDto,
): ProductDetailMatchResponseDto {
  if (!response.matchAvailable) {
    return response;
  }

  return {
    ...response,
    match: sanitizeProductMatchDto(response.match),
  };
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

  return sanitizeProductMatchResponseDto(body.data);
}

export async function getProductMatchForProduct(
  productId: string,
): Promise<ProductDetailMatchResponseDto> {
  let response: Response;

  try {
    response = await fetch(getProductMatchForProductApiPath(productId), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new ProductMatchClientError(PRODUCT_DETAIL_MATCH_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw new ProductMatchClientError(
      PRODUCT_DETAIL_MATCH_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  if (!isProductDetailMatchResponseDto(body.data)) {
    throw new ProductMatchClientError(
      PRODUCT_DETAIL_MATCH_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return sanitizeProductDetailMatchResponseDto(body.data);
}
