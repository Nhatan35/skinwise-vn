import { NextResponse } from "next/server";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { ProductDto } from "@/modules/products/product.dto";
import { toProductDto } from "@/modules/products/product.mapper";
import { getProductById } from "@/modules/products/product.use-case";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ApiErrorCode = "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL_ERROR";

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

function notFoundResponse() {
  return errorResponse("NOT_FOUND", "Product was not found.", 404);
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

async function getRouteId(context: RouteContext) {
  const params = await context.params;

  return params.id;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const product = await getProductById(await getRouteId(context));

    if (!product) {
      return notFoundResponse();
    }

    return jsonResponse<{ product: ProductDto }>({
      product: toProductDto(product),
    });
  } catch {
    return internalErrorResponse();
  }
}
