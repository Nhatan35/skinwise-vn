import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  AdminPermissionRequiredError,
  requireAdminUser,
} from "@/modules/auth/require-admin-user";
import { AuthenticationRequiredError } from "@/modules/auth/types";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import { toIngredientDto } from "@/modules/ingredients/ingredient.mapper";
import {
  adminCreateIngredientBodySchema,
  adminIngredientListQuerySchema,
} from "@/modules/ingredients/ingredient.schema";
import {
  createIngredientForAdmin,
  DuplicateIngredientInciNameError,
  listIngredientsForAdmin,
} from "@/modules/ingredients/ingredient.use-case";

export const runtime = "nodejs";

type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR";

type ApiError = {
  code: ApiErrorCode;
  message: string;
  details: Record<string, never>;
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

function jsonResponse<TData>(data: TData, status = 200) {
  return NextResponse.json<ApiResponse<TData>>(
    {
      data,
      error: null,
    },
    { status },
  );
}

function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
) {
  return NextResponse.json<ApiResponse<never>>(
    {
      data: null,
      error: {
        code,
        message,
        details: {},
      },
    },
    { status },
  );
}

function unauthorizedResponse() {
  return errorResponse(
    "UNAUTHORIZED",
    "You must be signed in to access this resource.",
    401,
  );
}

function forbiddenResponse() {
  return errorResponse(
    "FORBIDDEN",
    "You do not have permission to access this resource.",
    403,
  );
}

function validationErrorResponse() {
  return errorResponse(
    "VALIDATION_ERROR",
    "Query parameters or request body are invalid.",
    400,
  );
}

function conflictResponse() {
  return errorResponse(
    "CONFLICT",
    "Ingredient INCI name already exists.",
    409,
  );
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

function getQueryParams(request: Request) {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
}

async function getRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ZodError([]);
  }
}

export async function GET(request: Request) {
  try {
    await requireAdminUser();

    const input = adminIngredientListQuerySchema.parse(getQueryParams(request));
    const ingredients = await listIngredientsForAdmin(input);

    return jsonResponse<{ items: IngredientDto[] }>({
      items: ingredients.map(toIngredientDto),
    });
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return unauthorizedResponse();
    }

    if (error instanceof AdminPermissionRequiredError) {
      return forbiddenResponse();
    }

    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const input = adminCreateIngredientBodySchema.parse(
      await getRequestJson(request),
    );
    const ingredient = await createIngredientForAdmin(input);

    return jsonResponse<{ ingredient: IngredientDto }>(
      {
        ingredient: toIngredientDto(ingredient),
      },
      201,
    );
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return unauthorizedResponse();
    }

    if (error instanceof AdminPermissionRequiredError) {
      return forbiddenResponse();
    }

    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    if (error instanceof DuplicateIngredientInciNameError) {
      return conflictResponse();
    }

    return internalErrorResponse();
  }
}
