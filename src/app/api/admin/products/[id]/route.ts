import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  AdminPermissionRequiredError,
  requireAdminUser,
} from "@/modules/auth/require-admin-user";
import { AuthenticationRequiredError } from "@/modules/auth/types";
import type { ProductDto } from "@/modules/products/product.dto";
import { toProductDto } from "@/modules/products/product.mapper";
import {
  adminUpdateProductBodySchema,
  productRouteParamsSchema,
} from "@/modules/products/product.schema";
import { updateProductForAdmin } from "@/modules/products/product.use-case";

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
  return errorResponse("NOT_FOUND", "Product was not found.", 404);
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

async function getRouteParams(context: RouteContext) {
  return productRouteParamsSchema.parse(await context.params);
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
    const input = adminUpdateProductBodySchema.parse(
      await getRequestJson(request),
    );
    const product = await updateProductForAdmin(id, input);

    if (!product) {
      return notFoundResponse();
    }

    return jsonResponse<{ product: ProductDto }>({
      product: toProductDto(product),
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
