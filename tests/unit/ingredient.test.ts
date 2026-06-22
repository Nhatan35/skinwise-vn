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
  findOneAndUpdate: vi.fn(),
  insertOne: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getIngredientsCollection: vi.fn(() => collectionMock),
}));

import { toIngredientDto } from "@/modules/ingredients/ingredient.mapper";
import {
  adminCreateIngredientBodySchema,
  adminUpdateIngredientBodySchema,
  ingredientListQuerySchema,
} from "@/modules/ingredients/ingredient.schema";
import {
  createIngredient as createIngredientDocument,
  findIngredientByNormalizedInciName,
  findIngredientById,
  searchIngredients,
  updateIngredient,
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

function createAdminIngredientPayload() {
  return {
    aliases: [" Vitamin B3 ", "", "Nicotinamide"],
    avoidWith: ["known sensitivity"],
    cautionFor: ["very sensitive skin"],
    commonUses: ["barrier support"],
    evidenceLevel: "moderate",
    functions: [" barrier_support ", "oil_control_support"],
    inciName: " Niacinamide ",
    sourceRefs: [" manual-curation "],
    suitableFor: ["oily", "combination"],
  } as const;
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

describe("Admin ingredient schemas", () => {
  it("accepts valid create payloads and normalizes arrays", () => {
    expect(
      adminCreateIngredientBodySchema.parse(createAdminIngredientPayload()),
    ).toEqual({
      aliases: ["Vitamin B3", "Nicotinamide"],
      avoidWith: ["known sensitivity"],
      cautionFor: ["very sensitive skin"],
      commonUses: ["barrier support"],
      evidenceLevel: "moderate",
      functions: ["barrier_support", "oil_control_support"],
      inciName: "Niacinamide",
      sourceRefs: ["manual-curation"],
      suitableFor: ["oily", "combination"],
    });
  });

  it("defaults omitted create array fields to empty arrays", () => {
    expect(
      adminCreateIngredientBodySchema.parse({
        evidenceLevel: "basic",
        inciName: "Panthenol",
      }),
    ).toEqual({
      aliases: [],
      avoidWith: [],
      cautionFor: [],
      commonUses: [],
      evidenceLevel: "basic",
      functions: [],
      inciName: "Panthenol",
      sourceRefs: [],
      suitableFor: [],
    });
  });

  it("rejects empty inciName and invalid evidence levels", () => {
    for (const body of [
      { ...createAdminIngredientPayload(), inciName: "" },
      { ...createAdminIngredientPayload(), inciName: " " },
      { ...createAdminIngredientPayload(), evidenceLevel: "clinical" },
    ]) {
      expect(() => adminCreateIngredientBodySchema.parse(body)).toThrow(
        ZodError,
      );
    }
  });

  it("rejects internal fields and overly long inputs", () => {
    for (const body of [
      { ...createAdminIngredientPayload(), _id: ingredientId },
      { ...createAdminIngredientPayload(), id: ingredientId },
      { ...createAdminIngredientPayload(), createdAt: fixedNow.toISOString() },
      { ...createAdminIngredientPayload(), updatedAt: fixedNow.toISOString() },
      { ...createAdminIngredientPayload(), inciName: "a".repeat(161) },
      { ...createAdminIngredientPayload(), aliases: ["a".repeat(241)] },
      { ...createAdminIngredientPayload(), sourceRefs: ["a".repeat(501)] },
    ]) {
      expect(() => adminCreateIngredientBodySchema.parse(body)).toThrow(
        ZodError,
      );
    }
  });

  it("accepts valid partial updates", () => {
    expect(
      adminUpdateIngredientBodySchema.parse({
        aliases: [" Vitamin B3 ", ""],
        evidenceLevel: "strong",
        inciName: " Niacinamide Updated ",
      }),
    ).toEqual({
      aliases: ["Vitamin B3"],
      evidenceLevel: "strong",
      inciName: "Niacinamide Updated",
    });
  });

  it("rejects empty update payloads, empty inciName, invalid evidenceLevel, and internal fields", () => {
    for (const body of [
      {},
      { inciName: "" },
      { inciName: "   " },
      { evidenceLevel: "clinical" },
      { createdAt: fixedNow.toISOString() },
      { updatedAt: fixedNow.toISOString() },
      { id: ingredientId },
      { _id: ingredientId },
    ]) {
      expect(() => adminUpdateIngredientBodySchema.parse(body)).toThrow(
        ZodError,
      );
    }
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
    collectionMock.findOneAndUpdate.mockReset();
    collectionMock.insertOne.mockReset();
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

  it("finds duplicate ingredients by trimmed case-insensitive INCI name", async () => {
    const ingredient = createIngredient();
    collectionMock.findOne.mockResolvedValue(ingredient);

    await expect(
      findIngredientByNormalizedInciName(" niacinamide "),
    ).resolves.toBe(ingredient);

    const filter = collectionMock.findOne.mock.calls[0]?.[0] as {
      inciName?: RegExp;
    };
    expect(filter.inciName?.test("Niacinamide")).toBe(true);
    expect(filter.inciName?.test("NIACINAMIDE")).toBe(true);
    expect(filter.inciName?.test("Not Niacinamide")).toBe(false);
  });

  it("does not query duplicate lookup for blank normalized INCI names", async () => {
    await expect(findIngredientByNormalizedInciName("   ")).resolves.toBeNull();
    expect(collectionMock.findOne).not.toHaveBeenCalled();
  });

  it("creates ingredients with server timestamps", async () => {
    const insertedId = new ObjectId(ingredientId);
    collectionMock.insertOne.mockResolvedValue({ insertedId });

    const result = await createIngredientDocument({
      aliases: ["Vitamin B3"],
      avoidWith: [],
      cautionFor: [],
      commonUses: ["barrier support"],
      evidenceLevel: "moderate",
      functions: ["barrier_support"],
      inciName: "Niacinamide",
      sourceRefs: ["manual-curation"],
      suitableFor: ["oily"],
    });

    expect(collectionMock.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(Date),
        inciName: "Niacinamide",
        updatedAt: expect.any(Date),
      }),
    );
    expect(result).toMatchObject({
      _id: insertedId,
      inciName: "Niacinamide",
    });
  });

  it("updates only provided ingredient fields and updatedAt", async () => {
    const updatedIngredient = createIngredient({
      commonUses: ["updated use"],
      updatedAt: new Date("2026-05-15T00:00:00.000Z"),
    });
    collectionMock.findOneAndUpdate.mockResolvedValue(updatedIngredient);

    await expect(
      updateIngredient(ingredientId, { commonUses: ["updated use"] }),
    ).resolves.toBe(updatedIngredient);

    const [, update, options] = collectionMock.findOneAndUpdate.mock.calls[0];
    expect(update).toEqual({
      $set: {
        commonUses: ["updated use"],
        updatedAt: expect.any(Date),
      },
    });
    expect(options).toEqual({ returnDocument: "after" });
  });

  it("returns null for invalid update ids without querying", async () => {
    await expect(
      updateIngredient("not-an-object-id", { inciName: "Panthenol" }),
    ).resolves.toBeNull();
    expect(collectionMock.findOneAndUpdate).not.toHaveBeenCalled();
  });
});
