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
  adminUpdateIngredientBodySchema,
  ingredientRouteParamsSchema,
} from "@/modules/ingredients/ingredient.schema";
import {
  DuplicateIngredientInciNameError,
  updateIngredientForAdmin,
} from "@/modules/ingredients/ingredient.use-case";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
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
    "Request body or route parameters are invalid.",
    400,
  );
}

function notFoundResponse() {
  return errorResponse("NOT_FOUND", "Ingredient was not found.", 404);
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

async function getRouteParams(context: RouteContext) {
  return ingredientRouteParamsSchema.parse(await context.params);
}

async function getRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ZodError([]);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminUser();

    const { id } = await getRouteParams(context);
    const input = adminUpdateIngredientBodySchema.parse(
      await getRequestJson(request),
    );
    const ingredient = await updateIngredientForAdmin(id, input);

    if (!ingredient) {
      return notFoundResponse();
    }

    return jsonResponse<{ ingredient: IngredientDto }>({
      ingredient: toIngredientDto(ingredient),
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

    if (error instanceof DuplicateIngredientInciNameError) {
      return conflictResponse();
    }

    return internalErrorResponse();
  }
}
