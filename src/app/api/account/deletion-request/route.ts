import { NextResponse } from "next/server";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import { requestAccountDeletionForUser } from "@/modules/users/app-user-profile.use-case";

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

export async function POST() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const profile = await requestAccountDeletionForUser(currentUser.id);
    const accountDeletionRequestedAt = profile.accountDeletionRequestedAt;

    if (!accountDeletionRequestedAt) {
      return internalErrorResponse();
    }

    return jsonResponse({
      requested: true,
      accountDeletionRequestedAt: accountDeletionRequestedAt.toISOString(),
    });
  } catch {
    return internalErrorResponse();
  }
}
