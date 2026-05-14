import { NextResponse } from "next/server";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import { toMeUserDto } from "@/modules/users/app-user-profile.mapper";
import { ensureAppUserProfile } from "@/modules/users/app-user-profile.repository";
import type { MeUserDto } from "@/modules/users/app-user-profile.types";

export const runtime = "nodejs";

type ApiErrorCode = "UNAUTHORIZED" | "INTERNAL_ERROR";

type ApiError = {
  code: ApiErrorCode;
  message: string;
  details: Record<string, never>;
};

type ApiMeResponse =
  | {
      data: {
        user: MeUserDto;
      };
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

function unauthorizedResponse() {
  return NextResponse.json<ApiMeResponse>(
    {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    },
    { status: 401 },
  );
}

function internalErrorResponse() {
  return NextResponse.json<ApiMeResponse>(
    {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
        details: {},
      },
    },
    { status: 500 },
  );
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const profile = await ensureAppUserProfile(currentUser.id);
    const user = toMeUserDto(currentUser, profile);

    return NextResponse.json<ApiMeResponse>(
      {
        data: { user },
        error: null,
      },
      { status: 200 },
    );
  } catch {
    return internalErrorResponse();
  }
}
