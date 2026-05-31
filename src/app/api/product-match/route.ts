import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import { productMatchQuerySchema } from "@/modules/product-match/product-match.schema";
import { getProductMatchesForUser } from "@/modules/product-match/product-match.use-case";

export const runtime = "nodejs";

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
  return errorResponse("VALIDATION_ERROR", "Query parameters are invalid.", 400);
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

function getQueryParams(request: Request) {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
}

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = productMatchQuerySchema.parse(getQueryParams(request));
    const productMatch = await getProductMatchesForUser(currentUser.id, input);

    return jsonResponse<ProductMatchResponseDto>(productMatch);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}
