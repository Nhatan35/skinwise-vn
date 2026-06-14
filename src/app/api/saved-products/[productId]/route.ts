import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import {
  savedProductRouteParamsSchema,
  updateSavedProductMetadataBodySchema,
} from "@/modules/saved-products/saved-product.schema";
import {
  removeSavedProductForUser,
  updateSavedProductMetadata,
} from "@/modules/saved-products/saved-product.use-case";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

type ApiErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
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

function validationErrorResponse() {
  return errorResponse(
    "VALIDATION_ERROR",
    "Request body or route parameters are invalid.",
    400,
  );
}

function notFoundResponse() {
  return errorResponse("NOT_FOUND", "Saved product was not found.", 404);
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

async function getRouteParams(context: RouteContext) {
  return savedProductRouteParamsSchema.parse(await context.params);
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
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const { productId } = await getRouteParams(context);
    const input = updateSavedProductMetadataBodySchema.parse(
      await getRequestJson(request),
    );
    const item = await updateSavedProductMetadata(
      currentUser.id,
      productId,
      input,
    );

    if (!item) {
      return notFoundResponse();
    }

    return jsonResponse<{ item: SavedProductDto }>({ item });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
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
