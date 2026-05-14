import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { RoutineDto } from "@/modules/routines/routine.dto";
import { toRoutineDto } from "@/modules/routines/routine.mapper";
import { updateRoutineSchema } from "@/modules/routines/routine.schema";
import {
  deleteRoutineForUser,
  getRoutineForUser,
  updateRoutineForUser,
} from "@/modules/routines/routine.use-case";

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

export async function GET(_request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const routine = await getRoutineForUser(await getRouteId(context), currentUser.id);

    if (!routine) {
      return notFoundResponse();
    }

    return jsonResponse<{ routine: RoutineDto }>({
      routine: toRoutineDto(routine),
    });
  } catch {
    return internalErrorResponse();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = updateRoutineSchema.parse(await getRequestJson(request));
    const routine = await updateRoutineForUser(
      await getRouteId(context),
      currentUser.id,
      input,
    );

    if (!routine) {
      return notFoundResponse();
    }

    return jsonResponse<{ routine: RoutineDto }>({
      routine: toRoutineDto(routine),
    });
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

    const deletedRoutine = await deleteRoutineForUser(
      await getRouteId(context),
      currentUser.id,
    );

    if (!deletedRoutine) {
      return notFoundResponse();
    }

    return jsonResponse({ deleted: true });
  } catch {
    return internalErrorResponse();
  }
}
