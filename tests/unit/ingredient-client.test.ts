import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  explainIngredient,
  getIngredient,
  getIngredientApiPath,
  getIngredientsApiPath,
  IngredientClientError,
  listIngredients,
} from "@/modules/ingredients/ingredient.client";
import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";

const mockedFetch = vi.fn();

function createIngredient(
  overrides: Partial<IngredientDto> = {},
): IngredientDto {
  return {
    id: "665000000000000000000220",
    inciName: "Niacinamide",
    aliases: ["Vitamin B3", "Nicotinamide"],
    functions: ["barrier_support", "oil_balance"],
    commonUses: ["barrier support", "oiliness support"],
    suitableFor: ["oily", "combination"],
    cautionFor: ["very sensitive skin"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
    createdAt: "2026-05-24T00:00:00.000Z",
    updatedAt: "2026-05-24T00:00:00.000Z",
    ...overrides,
  };
}

function createExplanation(
  overrides: Partial<IngredientExplanationDto> = {},
): IngredientExplanationDto {
  return {
    ingredientName: "Niacinamide",
    simpleExplanation:
      "Niacinamide is explained in simple educational skincare terms.",
    commonUses: ["May help users understand cosmetic ingredient lists."],
    suitableFor: ["oily skin"],
    cautions: ["Tolerance can vary by person."],
    avoidWith: ["known sensitivity"],
    beginnerAdvice: "Introduce gradually and follow product instructions.",
    disclaimer: "Educational information only.",
    source: "fallback",
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

describe("Ingredient client helper", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("builds the default ingredient list API path", () => {
    expect(getIngredientsApiPath({ limit: 50 })).toBe(
      "/api/ingredients?limit=50",
    );
  });

  it("builds the ingredient list API path with trimmed q", () => {
    expect(
      getIngredientsApiPath({
        limit: 50,
        q: "  niacinamide serum  ",
      }),
    ).toBe("/api/ingredients?q=niacinamide+serum&limit=50");
  });

  it("builds the ingredient list API path with a function filter", () => {
    expect(
      getIngredientsApiPath({
        function: "barrier_support",
        limit: 50,
      }),
    ).toBe("/api/ingredients?function=barrier_support&limit=50");
  });

  it("combines trimmed q, function, and limit filters", () => {
    expect(
      getIngredientsApiPath({
        function: "barrier_support",
        limit: 50,
        q: "  niacinamide  ",
      }),
    ).toBe(
      "/api/ingredients?q=niacinamide&function=barrier_support&limit=50",
    );
  });

  it("builds encoded ingredient detail API paths", () => {
    expect(getIngredientApiPath("ingredient id/with spaces")).toBe(
      "/api/ingredients/ingredient%20id%2Fwith%20spaces",
    );
  });

  it("lists ingredients from data.items", async () => {
    const ingredients = [createIngredient()];

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items: ingredients },
        error: null,
      }),
    );

    await expect(listIngredients()).resolves.toEqual(ingredients);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/ingredients?limit=50",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("loads one ingredient from data.ingredient", async () => {
    const ingredient = createIngredient();

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { ingredient },
        error: null,
      }),
    );

    await expect(getIngredient(ingredient.id)).resolves.toEqual(ingredient);
    expect(mockedFetch).toHaveBeenCalledWith(
      `/api/ingredients/${ingredient.id}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("posts explanation JSON and reads data.explanation", async () => {
    const explanation = createExplanation();

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { explanation },
        error: null,
      }),
    );

    await expect(
      explainIngredient({ ingredientName: " Niacinamide " }),
    ).resolves.toEqual(explanation);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/ingredients/explain",
      expect.objectContaining({
        body: JSON.stringify({ ingredientName: "Niacinamide" }),
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "POST",
      }),
    );
  });

  it("throws IngredientClientError for API error envelopes", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "Query parameters are invalid.",
          },
        },
        400,
      ),
    );

    await expect(listIngredients({ q: "bad" })).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Could not load the ingredient library.",
      status: 400,
    });
    await expect(listIngredients({ q: "bad" })).rejects.toBeInstanceOf(
      IngredientClientError,
    );
  });

  it("throws IngredientClientError for invalid JSON responses", async () => {
    mockedFetch.mockResolvedValue(
      new Response("{", {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }),
    );

    await expect(listIngredients()).rejects.toBeInstanceOf(
      IngredientClientError,
    );
  });

  it("throws IngredientClientError for invalid data shapes", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items: [{ id: "missing-fields" }] },
        error: null,
      }),
    );

    await expect(listIngredients()).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Could not load the ingredient library.",
      status: 200,
    });
  });

  it("throws IngredientClientError for network errors", async () => {
    mockedFetch.mockRejectedValue(new Error("network failure"));

    await expect(getIngredient("ingredient_123")).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Could not load the ingredient details.",
      status: 500,
    });
  });

  it("preserves status and code for non-OK detail responses", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Ingredient was not found.",
          },
        },
        404,
      ),
    );

    await expect(getIngredient("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
      message: "Could not load the ingredient details.",
      status: 404,
    });
  });

  it("preserves RATE_LIMITED errors for explanations", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "RATE_LIMITED",
            message: "Please try again later.",
          },
        },
        429,
      ),
    );

    await expect(
      explainIngredient({ ingredientName: "Niacinamide" }),
    ).rejects.toMatchObject({
      code: "RATE_LIMITED",
      message: "Could not explain this ingredient.",
      status: 429,
    });
  });
});
