import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { checkRateLimit } from "@/infrastructure/rate-limiting/rate-limit";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";
import { parseIngredientExplanationRequestText } from "@/modules/ingredients/ingredient-explanation.schema";
import { explainIngredient } from "@/modules/ingredients/explain-ingredient.use-case";

export const runtime = "nodejs";

const INGREDIENT_EXPLANATION_RATE_LIMIT = 10;
const INGREDIENT_EXPLANATION_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const INGREDIENT_EXPLANATION_RATE_LIMIT_MESSAGE =
  "You have reached the ingredient explanation limit. Please try again later.";

type ApiErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

type ApiError = {
  code: ApiErrorCode;
  message: string;
  details: Record<string, unknown>;
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

function rateLimitedResponse(retryAfterSeconds: number) {
  return NextResponse.json<ApiResponse<never>>(
    {
      data: null,
      error: {
        code: "RATE_LIMITED",
        message: INGREDIENT_EXPLANATION_RATE_LIMIT_MESSAGE,
        details: {
          retryAfterSeconds,
        },
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

function internalErrorResponse() {
  return errorResponse("INTERNAL_ERROR", "Something went wrong.", 500);
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const input = parseIngredientExplanationRequestText(await request.text());
    const rateLimit = await checkRateLimit({
      key: `ingredient_explanation:${currentUser.id}`,
      limit: INGREDIENT_EXPLANATION_RATE_LIMIT,
      windowMs: INGREDIENT_EXPLANATION_RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
      return rateLimitedResponse(rateLimit.retryAfterSeconds);
    }

    const explanation = await explainIngredient(input);

    return jsonResponse<{ explanation: IngredientExplanationDto }>({
      explanation,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse();
    }

    return internalErrorResponse();
  }
}
