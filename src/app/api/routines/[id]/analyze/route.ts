import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import { analyzeRoutineForCurrentUser } from "@/modules/ai-analysis/analyze-routine.use-case";
import type { RoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.dto";
import { parseAnalyzeRoutineRequestText } from "@/modules/ai-analysis/routine-analysis.schema";

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
  return errorResponse("NOT_FOUND", "Routine was not found.", 404);
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

async function getRouteId(context: RouteContext) {
  const params = await context.params;

  return params.id;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    parseAnalyzeRoutineRequestText(await request.text());

    const analysis = await analyzeRoutineForCurrentUser({
      routineId: await getRouteId(context),
      currentUserId: currentUser.id,
    });

    if (!analysis) {
      return notFoundResponse();
    }

    return jsonResponse<RoutineAnalysisDto>(analysis, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}
