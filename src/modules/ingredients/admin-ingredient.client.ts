import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import type {
  AdminCreateIngredientBodyInput,
  AdminIngredientListQueryInput,
  AdminUpdateIngredientBodyInput,
} from "@/modules/ingredients/ingredient.schema";
import { INGREDIENT_EVIDENCE_LEVELS } from "@/modules/ingredients/ingredient.types";

const ADMIN_INGREDIENTS_API_BASE_PATH = "/api/admin/ingredients";
const ADMIN_INGREDIENT_CREATE_ERROR_MESSAGE =
  "Could not create admin ingredient.";
const ADMIN_INGREDIENT_LIST_ERROR_MESSAGE =
  "Could not load admin ingredients.";
const ADMIN_INGREDIENT_SAVE_ERROR_MESSAGE =
  "Could not save admin ingredient.";

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

export class AdminIngredientClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "AdminIngredientClientError";
    this.code = code;
    this.status = status;
  }
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

export function getAdminIngredientsApiPath(
  input: AdminIngredientListQueryInput = { limit: 50 },
) {
  const params = new URLSearchParams();
  const q = input.q?.trim();
  const ingredientFunction = input.function?.trim();
  const limit = input.limit ?? 50;

  if (q) {
    params.set("q", q);
  }

  if (ingredientFunction) {
    params.set("function", ingredientFunction);
  }

  params.set("limit", String(limit));

  return `${ADMIN_INGREDIENTS_API_BASE_PATH}?${params.toString()}`;
}

export function getAdminIngredientApiPath(ingredientId: string) {
  return `${ADMIN_INGREDIENTS_API_BASE_PATH}/${encodeURIComponent(
    ingredientId,
  )}`;
}

export async function listAdminIngredients(
  input: AdminIngredientListQueryInput = { limit: 50 },
) {
  let response: Response;

  try {
    response = await fetch(getAdminIngredientsApiPath(input), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new AdminIngredientClientError(ADMIN_INGREDIENT_LIST_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ items: IngredientDto[] }>(response);

  if (!response.ok || !hasApiData(body) || !Array.isArray(body.data.items)) {
    throw new AdminIngredientClientError(
      ADMIN_INGREDIENT_LIST_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  if (!body.data.items.every(isIngredientDto)) {
    throw new AdminIngredientClientError(
      ADMIN_INGREDIENT_LIST_ERROR_MESSAGE,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.items;
}

export async function createAdminIngredient(
  input: AdminCreateIngredientBodyInput,
) {
  let response: Response;

  try {
    response = await fetch(ADMIN_INGREDIENTS_API_BASE_PATH, {
      body: JSON.stringify(input),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new AdminIngredientClientError(ADMIN_INGREDIENT_CREATE_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ ingredient: IngredientDto }>(response);

  if (
    !response.ok ||
    !hasApiData(body) ||
    !isIngredientDto(body.data.ingredient)
  ) {
    throw new AdminIngredientClientError(
      ADMIN_INGREDIENT_CREATE_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  return body.data.ingredient;
}

export async function updateAdminIngredient(
  ingredientId: string,
  input: AdminUpdateIngredientBodyInput,
) {
  let response: Response;

  try {
    response = await fetch(getAdminIngredientApiPath(ingredientId), {
      body: JSON.stringify(input),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
  } catch {
    throw new AdminIngredientClientError(ADMIN_INGREDIENT_SAVE_ERROR_MESSAGE);
  }

  const body = await readApiResponse<{ ingredient: IngredientDto }>(response);

  if (
    !response.ok ||
    !hasApiData(body) ||
    !isIngredientDto(body.data.ingredient)
  ) {
    throw new AdminIngredientClientError(
      ADMIN_INGREDIENT_SAVE_ERROR_MESSAGE,
      body.error?.code,
      response.status,
    );
  }

  return body.data.ingredient;
}
