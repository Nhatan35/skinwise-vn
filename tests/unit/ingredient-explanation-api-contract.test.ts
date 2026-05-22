import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/ingredients/explain-ingredient.use-case", () => ({
  explainIngredient: vi.fn(),
}));

vi.mock("@/infrastructure/rate-limiting/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

import * as ingredientExplanationRoute from "@/app/api/ingredients/explain/route";
import { checkRateLimit } from "@/infrastructure/rate-limiting/rate-limit";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";
import { explainIngredient } from "@/modules/ingredients/explain-ingredient.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedCheckRateLimit = vi.mocked(checkRateLimit);
const mockedExplainIngredient = vi.mocked(explainIngredient);

const userId = "auth-user-id";

const aiExplanation = {
  ingredientName: "niacinamide",
  simpleExplanation: "Niacinamide is explained in simple skincare terms.",
  commonUses: ["Supports cosmetic ingredient education."],
  suitableFor: ["oily skin"],
  cautions: ["Tolerance can vary."],
  avoidWith: ["known sensitivity"],
  beginnerAdvice: "Introduce gradually and follow product instructions.",
  disclaimer:
    "Thông tin này chỉ mang tính giáo dục về mỹ phẩm và không thay thế tư vấn y tế.",
  source: "ai",
} as const satisfies IngredientExplanationDto;

const fallbackExplanation = {
  ingredientName: "niacinamide",
  simpleExplanation:
    "This ingredient may have skincare-related uses, but more context is needed.",
  commonUses: [],
  suitableFor: [],
  cautions: [
    "Patch test before regular use.",
    "Stop using if irritation occurs.",
  ],
  avoidWith: ["You have known sensitivity to this ingredient."],
  beginnerAdvice: "Introduce gradually and follow product instructions.",
  disclaimer:
    "Thông tin này chỉ mang tính giáo dục về mỹ phẩm và không thay thế tư vấn y tế.",
  source: "fallback",
} as const satisfies IngredientExplanationDto;

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/ingredients/explain", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function mockAuthenticatedUser() {
  mockedGetCurrentUser.mockResolvedValue({
    id: userId,
    email: "an@example.com",
    name: "An",
  });
}

describe("Ingredient Explanation API contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedCheckRateLimit.mockReset();
    mockedExplainIngredient.mockReset();
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      limit: 10,
      remaining: 9,
      retryAfterSeconds: 3600,
    });
    mockedExplainIngredient.mockResolvedValue(aiExplanation);
  });

  it("exports the expected POST route and Node.js runtime", () => {
    expect(ingredientExplanationRoute.runtime).toBe("nodejs");
    expect(ingredientExplanationRoute.POST).toBeTypeOf("function");
  });

  it("requires authentication", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await ingredientExplanationRoute.POST(
      jsonRequest({ ingredientName: "niacinamide" }),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "UNAUTHORIZED",
      },
    });
    expect(response.status).toBe(401);
    expect(mockedCheckRateLimit).not.toHaveBeenCalled();
    expect(mockedExplainIngredient).not.toHaveBeenCalled();
  });

  it("returns an AI explanation in the expected response envelope", async () => {
    mockAuthenticatedUser();

    const response = await ingredientExplanationRoute.POST(
      jsonRequest({
        ingredientName: " niacinamide ",
        skinType: "oily",
        concerns: ["acne", "oiliness"],
      }),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        explanation: aiExplanation,
      },
      error: null,
    });
    expect(mockedCheckRateLimit).toHaveBeenCalledWith({
      key: `ingredient_explanation:${userId}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });
    expect(mockedExplainIngredient).toHaveBeenCalledWith({
      ingredientName: "niacinamide",
      skinType: "oily",
      concerns: ["acne", "oiliness"],
    });
    expect(serializedBody).not.toContain("providerMetadata");
    expect(serializedBody).not.toContain("educationalNotes");
    expect(serializedBody).not.toContain("providerFailureReason");
  });

  it("returns fallback explanation as a successful response", async () => {
    mockAuthenticatedUser();
    mockedExplainIngredient.mockResolvedValue(fallbackExplanation);

    const response = await ingredientExplanationRoute.POST(
      jsonRequest({ ingredientName: "niacinamide" }),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        explanation: fallbackExplanation,
      },
      error: null,
    });
    expect(response.status).toBe(200);
  });

  it("rejects invalid request bodies with VALIDATION_ERROR before rate limiting", async () => {
    mockAuthenticatedUser();

    for (const body of [
      {},
      { ingredientName: "" },
      { ingredientName: "   " },
      { ingredientName: 123 },
      { ingredientName: "niacinamide", skinType: "very_oily" },
      { ingredientName: "niacinamide", concerns: ["diagnosis"] },
      {
        ingredientName: "niacinamide",
        concerns: [
          "acne",
          "oiliness",
          "dryness",
          "redness",
          "dark_spots",
          "texture",
          "barrier_support",
          "unknown",
          "acne",
        ],
      },
      { ingredientName: "niacinamide", providerMetadata: "client-owned" },
    ]) {
      const response = await ingredientExplanationRoute.POST(
        jsonRequest(body),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedCheckRateLimit).not.toHaveBeenCalled();
    expect(mockedExplainIngredient).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with VALIDATION_ERROR", async () => {
    mockAuthenticatedUser();

    const response = await ingredientExplanationRoute.POST(
      new Request("http://localhost/api/ingredients/explain", {
        method: "POST",
        body: "{",
      }),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedCheckRateLimit).not.toHaveBeenCalled();
    expect(mockedExplainIngredient).not.toHaveBeenCalled();
  });

  it("returns RATE_LIMITED with Retry-After when the user exceeds the limit", async () => {
    mockAuthenticatedUser();
    mockedCheckRateLimit.mockResolvedValue({
      allowed: false,
      limit: 10,
      remaining: 0,
      retryAfterSeconds: 120,
    });

    const response = await ingredientExplanationRoute.POST(
      jsonRequest({ ingredientName: "niacinamide" }),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "RATE_LIMITED",
        message:
          "You have reached the ingredient explanation limit. Please try again later.",
        details: {
          retryAfterSeconds: 120,
        },
      },
    });
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("120");
    expect(mockedExplainIngredient).not.toHaveBeenCalled();
  });

  it("returns generic INTERNAL_ERROR without leaking route-level errors", async () => {
    mockAuthenticatedUser();
    mockedCheckRateLimit.mockRejectedValue(
      new Error(
        "MongoServerError MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await ingredientExplanationRoute.POST(
      jsonRequest({ ingredientName: "niacinamide" }),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(500);
    expect(body).toEqual({
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
        details: {},
      },
    });
    expect(serializedBody).not.toContain("MongoServerError");
    expect(serializedBody).not.toContain("MONGODB_URI");
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("session");
    expect(serializedBody).not.toContain("stack");
  });
});
