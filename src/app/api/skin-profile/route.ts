import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { SkinProfileDto } from "@/modules/skin-profile/skin-profile.dto";
import { toSkinProfileDto } from "@/modules/skin-profile/skin-profile.mapper";
import {
  createSkinProfileSchema,
  updateSkinProfileSchema,
} from "@/modules/skin-profile/skin-profile.schema";
import {
  createOrReplaceSkinProfileForCurrentUser,
  deleteSkinProfileForUser,
  getSkinProfileForUser,
  updateSkinProfileForUser,
} from "@/modules/skin-profile/skin-profile.use-case";

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
  return errorResponse("NOT_FOUND", "Skin profile was not found.", 404);
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

    const profile = await getSkinProfileForUser(currentUser.id);

    if (!profile) {
      return notFoundResponse();
    }

    return jsonResponse<{ profile: SkinProfileDto }>({
      profile: toSkinProfileDto(profile),
    });
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

    const input = createSkinProfileSchema.parse(await getRequestJson(request));
    const profile = await createOrReplaceSkinProfileForCurrentUser(
      currentUser.id,
      input,
    );

    return jsonResponse<{ profile: SkinProfileDto }>(
      {
        profile: toSkinProfileDto(profile),
      },
      201,
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = updateSkinProfileSchema.parse(await getRequestJson(request));
    const profile = await updateSkinProfileForUser(currentUser.id, input);

    if (!profile) {
      return notFoundResponse();
    }

    return jsonResponse<{ profile: SkinProfileDto }>({
      profile: toSkinProfileDto(profile),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const deletedProfile = await deleteSkinProfileForUser(currentUser.id);

    if (!deletedProfile) {
      return notFoundResponse();
    }

    return jsonResponse({ deleted: true });
  } catch {
    return internalErrorResponse();
  }
}
