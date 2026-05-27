import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import { savedProductRouteParamsSchema } from "@/modules/saved-products/saved-product.schema";
import { removeSavedProductForUser } from "@/modules/saved-products/saved-product.use-case";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

type ApiErrorCode = "UNAUTHORIZED" | "VALIDATION_ERROR" | "INTERNAL_ERROR";

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

function validationErrorResponse() {
  return errorResponse("VALIDATION_ERROR", "Route parameters are invalid.", 400);
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

async function getRouteParams(context: RouteContext) {
  return savedProductRouteParamsSchema.parse(await context.params);
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const { productId } = await getRouteParams(context);

    await removeSavedProductForUser(currentUser.id, productId);

    return jsonResponse({ removed: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}
