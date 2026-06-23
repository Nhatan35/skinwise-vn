import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AdminIngredientClientError,
  createAdminIngredient,
  getAdminIngredientApiPath,
  getAdminIngredientsApiPath,
  listAdminIngredients,
  updateAdminIngredient,
} from "@/modules/ingredients/admin-ingredient.client";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import type { AdminCreateIngredientBodyInput } from "@/modules/ingredients/ingredient.schema";

const mockedFetch = vi.fn();

function createIngredient(
  overrides: Partial<IngredientDto> = {},
): IngredientDto {
  return {
    aliases: ["Vitamin B3"],
    avoidWith: [],
    cautionFor: ["very sensitive skin"],
    commonUses: ["barrier support"],
    createdAt: "2026-06-21T00:00:00.000Z",
    evidenceLevel: "moderate",
    functions: ["barrier_support"],
    id: "665000000000000000000820",
    inciName: "Niacinamide",
    sourceRefs: ["manual-curation"],
    suitableFor: ["oily"],
    updatedAt: "2026-06-21T00:00:00.000Z",
    ...overrides,
  };
}

function createAdminIngredientPayload(): AdminCreateIngredientBodyInput {
  return {
    aliases: ["Vitamin B3"],
    avoidWith: [],
    cautionFor: ["very sensitive skin"],
    commonUses: ["barrier support"],
    evidenceLevel: "moderate",
    functions: ["barrier_support"],
    inciName: "Niacinamide",
    sourceRefs: ["manual-curation"],
    suitableFor: ["oily"],
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

describe("Admin ingredient client", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("builds admin ingredient API paths", () => {
    expect(
      getAdminIngredientsApiPath({
        function: "barrier_support",
        limit: 50,
        q: " niacinamide ",
      }),
    ).toBe(
      "/api/admin/ingredients?q=niacinamide&function=barrier_support&limit=50",
    );
    expect(getAdminIngredientsApiPath()).toBe(
      "/api/admin/ingredients?limit=50",
    );
    expect(getAdminIngredientApiPath("ingredient id/with spaces")).toBe(
      "/api/admin/ingredients/ingredient%20id%2Fwith%20spaces",
    );
  });

  it("lists admin ingredients through GET /api/admin/ingredients", async () => {
    const ingredients = [createIngredient()];

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { items: ingredients },
        error: null,
      }),
    );

    await expect(listAdminIngredients()).resolves.toEqual(ingredients);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/admin/ingredients?limit=50",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("creates admin ingredients through POST /api/admin/ingredients", async () => {
    const ingredient = createIngredient();
    const payload = createAdminIngredientPayload();

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { ingredient },
        error: null,
      }),
    );

    await expect(createAdminIngredient(payload)).resolves.toEqual(ingredient);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/admin/ingredients",
      expect.objectContaining({
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "POST",
      }),
    );
  });

  it("updates admin ingredients through PATCH /api/admin/ingredients/[id]", async () => {
    const ingredient = createIngredient({ commonUses: ["updated use"] });
    const payload = {
      commonUses: ["updated use"],
    };

    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { ingredient },
        error: null,
      }),
    );

    await expect(
      updateAdminIngredient(ingredient.id, payload),
    ).resolves.toEqual(ingredient);
    expect(mockedFetch).toHaveBeenCalledWith(
      `/api/admin/ingredients/${ingredient.id}`,
      expect.objectContaining({
        body: JSON.stringify(payload),
        method: "PATCH",
      }),
    );
  });

  it("preserves API error status and code, including duplicate conflicts", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "CONFLICT",
            message: "Ingredient INCI name already exists.",
          },
        },
        409,
      ),
    );

    await expect(
      createAdminIngredient(createAdminIngredientPayload()),
    ).rejects.toMatchObject({
      code: "CONFLICT",
      message: "Could not create admin ingredient.",
      status: 409,
    });
  });

  it("throws AdminIngredientClientError for invalid JSON and invalid DTO shapes", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response("{", {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }),
    );

    await expect(listAdminIngredients()).rejects.toBeInstanceOf(
      AdminIngredientClientError,
    );

    mockedFetch.mockResolvedValueOnce(
      jsonResponse({
        data: { ingredient: { id: "missing-fields" } },
        error: null,
      }),
    );

    await expect(
      createAdminIngredient(createAdminIngredientPayload()),
    ).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      status: 200,
    });
  });

  it("throws AdminIngredientClientError for network failures", async () => {
    mockedFetch.mockRejectedValue(new Error("network failure"));

    await expect(
      updateAdminIngredient("665000000000000000000820", {
        inciName: "Panthenol",
      }),
    ).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Could not save admin ingredient.",
      status: 500,
    });
  });
});
