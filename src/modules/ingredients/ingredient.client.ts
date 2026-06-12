import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";

const INGREDIENTS_API_BASE_PATH = "/api/ingredients";
const INGREDIENT_EXPLANATION_API_PATH = "/api/ingredients/explain";
const DEFAULT_INGREDIENT_LIMIT = 50;
const INGREDIENT_LIBRARY_ERROR_MESSAGE =
  "Could not load the ingredient library.";
const INGREDIENT_DETAIL_ERROR_MESSAGE = "Could not load the ingredient details.";
const INGREDIENT_EXPLANATION_ERROR_MESSAGE =
  "Could not explain this ingredient.";
const INGREDIENT_EVIDENCE_LEVELS = [
  "basic",
  "moderate",
  "strong",
  "uncertain",
] as const;
const INGREDIENT_EXPLANATION_SOURCES = ["ai", "fallback"] as const;

export type IngredientListClientInput = {
  function?: string;
  limit?: number;
  q?: string;
};

export type IngredientExplanationClientInput = {
  ingredientName: string;
  concerns?: string[];
  skinType?: string;
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

export class IngredientClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "IngredientClientError";
    this.code = code;
    this.status = status;
  }
}

export function getIngredientsApiPath(input: IngredientListClientInput = {}) {
  const params = new URLSearchParams();
  const q = input.q?.trim();
  const ingredientFunction = input.function?.trim();
  const limit = input.limit ?? DEFAULT_INGREDIENT_LIMIT;

  if (q) {
    params.set("q", q);
  }

  if (ingredientFunction) {
    params.set("function", ingredientFunction);
  }

  params.set("limit", String(limit));

  return `${INGREDIENTS_API_BASE_PATH}?${params.toString()}`;
}

export function getIngredientApiPath(ingredientId: string) {
  return `${INGREDIENTS_API_BASE_PATH}/${encodeURIComponent(ingredientId)}`;
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

function isApiError(value: unknown): value is ApiError {
  return (
    isRecord(value) &&
    isString(value.code) &&
    isString(value.message)
  );
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

function isIngredientEvidenceLevel(
  value: unknown,
): value is IngredientDto["evidenceLevel"] {
  return (
    typeof value === "string" &&
    INGREDIENT_EVIDENCE_LEVELS.some((level) => level === value)
  );
}

function isIngredientDto(value: unknown): value is IngredientDto {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.inciName) &&
    isStringArray(value.aliases) &&
    isStringArray(value.functions) &&
    isStringArray(value.commonUses) &&
    isStringArray(value.suitableFor) &&
    isStringArray(value.cautionFor) &&
    isStringArray(value.avoidWith) &&
    isIngredientEvidenceLevel(value.evidenceLevel) &&
    isStringArray(value.sourceRefs) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
}

function isIngredientExplanationSource(
  value: unknown,
): value is IngredientExplanationDto["source"] {
  return (
    typeof value === "string" &&
    INGREDIENT_EXPLANATION_SOURCES.some((source) => source === value)
  );
}

function isIngredientExplanationDto(
  value: unknown,
): value is IngredientExplanationDto {
  return (
    isRecord(value) &&
    isString(value.ingredientName) &&
    isString(value.simpleExplanation) &&
    isStringArray(value.commonUses) &&
    isStringArray(value.suitableFor) &&
    isStringArray(value.cautions) &&
    isStringArray(value.avoidWith) &&
    isString(value.beginnerAdvice) &&
    isString(value.disclaimer) &&
    isIngredientExplanationSource(value.source)
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

function buildExplanationPayload(input: IngredientExplanationClientInput) {
  const ingredientName = input.ingredientName.trim();
  const concerns = input.concerns?.filter((concern) => concern.trim());

  return {
    ingredientName,
    ...(input.skinType ? { skinType: input.skinType } : {}),
    ...(concerns && concerns.length > 0 ? { concerns } : {}),
  };
}

export async function listIngredients(
  input: IngredientListClientInput = {},
): Promise<IngredientDto[]> {
  let response: Response;

  try {
    response = await fetch(getIngredientsApiPath(input), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new IngredientClientError(INGREDIENT_LIBRARY_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw new IngredientClientError(
      INGREDIENT_LIBRARY_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  if (!isRecord(body.data) || !Array.isArray(body.data.items)) {
    throw new IngredientClientError(
      INGREDIENT_LIBRARY_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  if (!body.data.items.every(isIngredientDto)) {
    throw new IngredientClientError(
      INGREDIENT_LIBRARY_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.items;
}

export async function getIngredient(
  ingredientId: string,
): Promise<IngredientDto> {
  let response: Response;

  try {
    response = await fetch(getIngredientApiPath(ingredientId), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new IngredientClientError(INGREDIENT_DETAIL_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw new IngredientClientError(
      INGREDIENT_DETAIL_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  if (!isRecord(body.data) || !isIngredientDto(body.data.ingredient)) {
    throw new IngredientClientError(
      INGREDIENT_DETAIL_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.ingredient;
}

export async function explainIngredient(
  input: IngredientExplanationClientInput,
): Promise<IngredientExplanationDto> {
  let response: Response;

  try {
    response = await fetch(INGREDIENT_EXPLANATION_API_PATH, {
      body: JSON.stringify(buildExplanationPayload(input)),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new IngredientClientError(INGREDIENT_EXPLANATION_ERROR_MESSAGE);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw new IngredientClientError(
      INGREDIENT_EXPLANATION_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  if (
    !isRecord(body.data) ||
    !isIngredientExplanationDto(body.data.explanation)
  ) {
    throw new IngredientClientError(
      INGREDIENT_EXPLANATION_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.explanation;
}
