import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import { saveProductBodySchema } from "@/modules/saved-products/saved-product.schema";
import {
  listSavedProductsForUser,
  saveProductForUser,
  SavedProductProductNotFoundError,
} from "@/modules/saved-products/saved-product.use-case";

export const runtime = "nodejs";

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
  return errorResponse("VALIDATION_ERROR", "Request body is invalid.", 400);
}

function notFoundResponse() {
  return errorResponse("NOT_FOUND", "Product was not found.", 404);
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

async function getRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ZodError([]);
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const items = await listSavedProductsForUser(currentUser.id);

    return jsonResponse<{ items: SavedProductDto[] }>({ items });
  } catch {
    return internalErrorResponse();
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = saveProductBodySchema.parse(await getRequestJson(request));
    const item = await saveProductForUser(currentUser.id, input.productId);

    return jsonResponse<{ item: SavedProductDto }>({ item }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    if (error instanceof SavedProductProductNotFoundError) {
      return notFoundResponse();
    }

    return internalErrorResponse();
  }
}
