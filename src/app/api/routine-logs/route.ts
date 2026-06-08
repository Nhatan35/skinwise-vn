import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import {
  routineLogQuerySchema,
  upsertRoutineLogSchema,
} from "@/modules/routine-logs/routine-log.schema";
import {
  getRoutineLogsForDate,
  getRoutineLogsForDateRange,
  RoutineLogValidationError,
  upsertRoutineLogForUser,
} from "@/modules/routine-logs/routine-log.use-case";

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

function validationErrorResponse(message = "Request body is invalid.") {
  return errorResponse("VALIDATION_ERROR", message, 400);
}

function notFoundResponse() {
  return errorResponse("NOT_FOUND", "Routine was not found.", 404);
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

    const input = routineLogQuerySchema.parse(getQueryParams(request));
    const routineLogs =
      "localDate" in input
        ? await getRoutineLogsForDate(currentUser.id, input.localDate)
        : await getRoutineLogsForDateRange(
            currentUser.id,
            input.from,
            input.to,
          );

    return jsonResponse<{ routineLogs: RoutineLogDto[] }>({ routineLogs });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse("Query parameters are invalid.");
    }

    return internalErrorResponse();
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = upsertRoutineLogSchema.parse(await getRequestJson(request));
    const routineLog = await upsertRoutineLogForUser(currentUser.id, input);

    if (!routineLog) {
      return notFoundResponse();
    }

    return jsonResponse<{ routineLog: RoutineLogDto }>({ routineLog });
  } catch (error) {
    if (error instanceof ZodError || error instanceof RoutineLogValidationError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}
