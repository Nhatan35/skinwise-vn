import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import { deleteSkinJournalForUser } from "@/modules/journals/delete-skin-journal.use-case";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import { updateSkinJournalSchema } from "@/modules/journals/skin-journal.schema";
import { updateSkinJournalForUser } from "@/modules/journals/update-skin-journal.use-case";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
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
  return errorResponse("VALIDATION_ERROR", "Request body is invalid.", 400);
}

function notFoundResponse() {
  return errorResponse("NOT_FOUND", "Skin journal entry was not found.", 404);
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

async function getRouteId(context: RouteContext) {
  const params = await context.params;

  return params.id;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = updateSkinJournalSchema.parse(await getRequestJson(request));
    const skinJournal = await updateSkinJournalForUser(
      await getRouteId(context),
      currentUser.id,
      input,
    );

    if (!skinJournal) {
      return notFoundResponse();
    }

    return jsonResponse<{ skinJournal: SkinJournalDto }>({ skinJournal });
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

    const deleted = await deleteSkinJournalForUser(
      await getRouteId(context),
      currentUser.id,
    );

    if (!deleted) {
      return notFoundResponse();
    }

    return jsonResponse({ deleted: true });
  } catch {
    return internalErrorResponse();
  }
}
