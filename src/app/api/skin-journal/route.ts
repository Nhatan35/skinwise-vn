import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import {
  createSkinJournalForUser,
  SkinJournalConflictError,
} from "@/modules/journals/create-skin-journal.use-case";
import { listSkinJournalsForUser } from "@/modules/journals/list-skin-journal.use-case";
import {
  createSkinJournalSchema,
  skinJournalListQuerySchema,
} from "@/modules/journals/skin-journal.schema";

export const runtime = "nodejs";

type ApiErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "CONFLICT"
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

function validationErrorResponse(message = "Request body is invalid.") {
  return errorResponse("VALIDATION_ERROR", message, 400);
}

function conflictResponse() {
  return errorResponse(
    "CONFLICT",
    "Skin journal entry already exists for this localDate.",
    409,
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
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = skinJournalListQuerySchema.parse(getQueryParams(request));
    const skinJournals = await listSkinJournalsForUser(currentUser.id, input);

    return jsonResponse<{ skinJournals: SkinJournalDto[] }>({ skinJournals });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse("Query parameters are invalid.");
    }

    return internalErrorResponse();
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = createSkinJournalSchema.parse(await getRequestJson(request));
    const skinJournal = await createSkinJournalForUser(currentUser.id, input);

    return jsonResponse<{ skinJournal: SkinJournalDto }>({ skinJournal }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    if (error instanceof SkinJournalConflictError) {
      return conflictResponse();
    }

    return internalErrorResponse();
  }
}
