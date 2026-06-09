import { NextResponse } from "next/server";

import {
  deleteAccountAppDataForUser,
  getAccountAppDataSummaryForUser,
} from "@/modules/account-data/account-data-export.use-case";
import type { AccountAppDataSummaryDto } from "@/modules/account-data/account-app-data-summary.dto";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";
import { getCurrentUser } from "@/modules/auth/get-current-user";

export const runtime = "nodejs";

type ApiErrorCode = "UNAUTHORIZED" | "INTERNAL_ERROR";

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

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const summary = await getAccountAppDataSummaryForUser(currentUser.id);

    return jsonResponse<{ summary: AccountAppDataSummaryDto }>({ summary });
  } catch {
    return internalErrorResponse();
  }
}

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const result = await deleteAccountAppDataForUser(currentUser.id);

    return jsonResponse<DeleteAccountAppDataDto>(result);
  } catch {
    return internalErrorResponse();
  }
}
