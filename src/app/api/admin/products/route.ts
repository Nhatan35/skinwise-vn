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
  adminCreateProductBodySchema,
  adminProductListQuerySchema,
} from "@/modules/products/product.schema";
import {
  createProductForAdmin,
  listProductsForAdmin,
} from "@/modules/products/product.use-case";

export const runtime = "nodejs";

type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
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

    const input = adminProductListQuerySchema.parse(getQueryParams(request));
    const products = await listProductsForAdmin(input);

    return jsonResponse<{ items: ProductDto[] }>({
      items: products.map(toProductDto),
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
    const adminUser = await requireAdminUser();

    const input = adminCreateProductBodySchema.parse(
      await getRequestJson(request),
    );
    const product = await createProductForAdmin(input, {
      createdByUserId: adminUser.profile._id,
    });

    return jsonResponse<{ product: ProductDto }>(
      {
        product: toProductDto(product),
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

    return internalErrorResponse();
  }
}
