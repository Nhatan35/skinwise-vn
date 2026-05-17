import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const toArrayMock = vi.fn();
const limitMock = vi.fn(() => ({ toArray: toArrayMock }));
const sortMock = vi.fn(() => ({ limit: limitMock }));
const collectionMock = {
  find: vi.fn((filter?: unknown) => {
    void filter;

    return { sort: sortMock };
  }),
  findOne: vi.fn((filter?: unknown): unknown => {
    void filter;

    return undefined;
  }),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getIngredientsCollection: vi.fn(() => collectionMock),
}));

import { toIngredientDto } from "@/modules/ingredients/ingredient.mapper";
import { ingredientListQuerySchema } from "@/modules/ingredients/ingredient.schema";
import {
  findIngredientById,
  searchIngredients,
} from "@/modules/ingredients/ingredient.repository";
import type { Ingredient } from "@/modules/ingredients/ingredient.types";

const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const ingredientId = "665000000000000000000210";

function createIngredient(
  overrides: Partial<Ingredient> = {},
): Ingredient {
  return {
    _id: new ObjectId(ingredientId),
    inciName: "Niacinamide",
    aliases: ["Vitamin B3", "Nicotinamide"],
    functions: ["barrier_support", "oil_control_support"],
    commonUses: ["barrier support", "oiliness support"],
    suitableFor: ["oily", "combination"],
    cautionFor: ["very sensitive skin"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  };
}

describe("Ingredient query schema", () => {
  it("validates list query input and defaults limit", () => {
    expect(
      ingredientListQuerySchema.parse({
        q: " niacinamide ",
        function: " barrier_support ",
      }),
    ).toEqual({
      q: "niacinamide",
      function: "barrier_support",
      limit: 20,
    });
  });

  it("rejects unknown query params and invalid limit", () => {
    expect(() =>
      ingredientListQuerySchema.parse({ includeMine: "true" }),
    ).toThrow(ZodError);
    expect(() => ingredientListQuerySchema.parse({ limit: "51" })).toThrow(
      ZodError,
    );
  });
});

describe("Ingredient mapper", () => {
  it("maps _id to id and serializes dates as ISO strings", () => {
    expect(toIngredientDto(createIngredient())).toEqual({
      id: ingredientId,
      inciName: "Niacinamide",
      aliases: ["Vitamin B3", "Nicotinamide"],
      functions: ["barrier_support", "oil_control_support"],
      commonUses: ["barrier support", "oiliness support"],
      suitableFor: ["oily", "combination"],
      cautionFor: ["very sensitive skin"],
      avoidWith: [],
      evidenceLevel: "moderate",
      sourceRefs: ["manual-curation"],
      createdAt: fixedNow.toISOString(),
      updatedAt: fixedNow.toISOString(),
    });
  });

  it("does not expose _id or raw ObjectId values", () => {
    const dto = toIngredientDto(createIngredient()) as Record<string, unknown>;
    const serializedDto = JSON.stringify(dto);

    expect(dto).not.toHaveProperty("_id");
    expect(serializedDto).not.toContain("ObjectId");
    expect(dto.createdAt).toBeTypeOf("string");
    expect(dto.updatedAt).toBeTypeOf("string");
  });

  it("copies arrays safely in mapper output", () => {
    const ingredient = createIngredient();
    const dto = toIngredientDto(ingredient);

    dto.aliases.push("mutated alias");
    dto.functions.push("mutated function");
    dto.commonUses.push("mutated use");
    dto.suitableFor.push("mutated skin type");
    dto.cautionFor.push("mutated caution");
    dto.avoidWith.push("mutated avoid");
    dto.sourceRefs.push("mutated source");

    expect(ingredient.aliases).toEqual(["Vitamin B3", "Nicotinamide"]);
    expect(ingredient.functions).toEqual([
      "barrier_support",
      "oil_control_support",
    ]);
    expect(ingredient.commonUses).toEqual([
      "barrier support",
      "oiliness support",
    ]);
    expect(ingredient.suitableFor).toEqual(["oily", "combination"]);
    expect(ingredient.cautionFor).toEqual(["very sensitive skin"]);
    expect(ingredient.avoidWith).toEqual([]);
    expect(ingredient.sourceRefs).toEqual(["manual-curation"]);
  });
});

describe("Ingredient repository", () => {
  beforeEach(() => {
    collectionMock.find.mockReset();
    collectionMock.findOne.mockReset();
    sortMock.mockReset();
    limitMock.mockReset();
    toArrayMock.mockReset();
    collectionMock.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({ limit: limitMock });
    limitMock.mockReturnValue({ toArray: toArrayMock });
  });

  it("lists ingredients with default searchable ordering and limit", async () => {
    const ingredient = createIngredient();
    toArrayMock.mockResolvedValue([ingredient]);

    await expect(searchIngredients({ limit: 20 })).resolves.toEqual([
      ingredient,
    ]);
    expect(collectionMock.find).toHaveBeenCalledWith({});
    expect(sortMock).toHaveBeenCalledWith({ inciName: 1 });
    expect(limitMock).toHaveBeenCalledWith(20);
  });

  it("filters ingredients by function", async () => {
    toArrayMock.mockResolvedValue([]);

    await searchIngredients({
      function: "barrier_support",
      limit: 10,
    });

    expect(collectionMock.find).toHaveBeenCalledWith({
      functions: "barrier_support",
    });
    expect(limitMock).toHaveBeenCalledWith(10);
  });

  it("searches ingredients by q across canonical searchable fields", async () => {
    toArrayMock.mockResolvedValue([]);

    await searchIngredients({ q: "nia", limit: 5 });

    const filter = collectionMock.find.mock.calls[0]?.[0] as {
      $or?: Array<Record<string, RegExp>>;
    };
    expect(filter.$or).toEqual([
      { inciName: expect.any(RegExp) },
      { aliases: expect.any(RegExp) },
      { functions: expect.any(RegExp) },
      { commonUses: expect.any(RegExp) },
    ]);
    expect(filter.$or?.[0]?.inciName.test("Niacinamide")).toBe(true);
    expect(limitMock).toHaveBeenCalledWith(5);
  });

  it("finds an ingredient by MongoDB ObjectId", async () => {
    const ingredient = createIngredient();
    collectionMock.findOne.mockResolvedValue(ingredient);

    await expect(findIngredientById(ingredientId)).resolves.toBe(ingredient);

    const filter = collectionMock.findOne.mock.calls[0]?.[0] as {
      _id?: ObjectId;
    };
    expect(filter._id?.toString()).toBe(ingredientId);
  });

  it("returns null for invalid ingredient ids without querying", async () => {
    await expect(findIngredientById("not-an-object-id")).resolves.toBeNull();
    expect(collectionMock.findOne).not.toHaveBeenCalled();
  });
});
