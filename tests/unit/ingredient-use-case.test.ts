import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/ingredients/ingredient.repository", () => ({
  createIngredient: vi.fn(),
  findIngredientByNormalizedInciName: vi.fn(),
  findIngredientById: vi.fn(),
  searchIngredientsForAdmin: vi.fn(),
  searchIngredients: vi.fn(),
  updateIngredient: vi.fn(),
}));

import {
  createIngredientForAdmin,
  DuplicateIngredientInciNameError,
  getIngredientById,
  listIngredientsForAdmin,
  listIngredients,
  updateIngredientForAdmin,
} from "@/modules/ingredients/ingredient.use-case";
import {
  createIngredient,
  findIngredientByNormalizedInciName,
  findIngredientById,
  searchIngredientsForAdmin,
  searchIngredients,
  updateIngredient,
} from "@/modules/ingredients/ingredient.repository";
import type { Ingredient } from "@/modules/ingredients/ingredient.types";

const mockedCreateIngredient = vi.mocked(createIngredient);
const mockedFindIngredientByNormalizedInciName = vi.mocked(
  findIngredientByNormalizedInciName,
);
const mockedFindIngredientById = vi.mocked(findIngredientById);
const mockedSearchIngredientsForAdmin = vi.mocked(searchIngredientsForAdmin);
const mockedSearchIngredients = vi.mocked(searchIngredients);
const mockedUpdateIngredient = vi.mocked(updateIngredient);

const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const ingredientId = "665000000000000000000211";

const ingredient = {
  _id: new ObjectId(ingredientId),
  inciName: "Niacinamide",
  aliases: ["Vitamin B3"],
  functions: ["barrier_support"],
  commonUses: ["barrier support"],
  suitableFor: ["oily"],
  cautionFor: ["very sensitive skin"],
  avoidWith: [],
  evidenceLevel: "moderate",
  sourceRefs: ["manual-curation"],
  createdAt: fixedNow,
  updatedAt: fixedNow,
} satisfies Ingredient;

describe("Ingredient use cases", () => {
  beforeEach(() => {
    mockedCreateIngredient.mockReset();
    mockedFindIngredientByNormalizedInciName.mockReset();
    mockedFindIngredientById.mockReset();
    mockedSearchIngredientsForAdmin.mockReset();
    mockedSearchIngredients.mockReset();
    mockedUpdateIngredient.mockReset();
  });

  it("lists ingredients", async () => {
    mockedSearchIngredients.mockResolvedValue([ingredient]);

    await expect(listIngredients({ limit: 20 })).resolves.toEqual([
      ingredient,
    ]);
    expect(mockedSearchIngredients).toHaveBeenCalledWith({ limit: 20 });
  });

  it("passes function filters to the repository", async () => {
    mockedSearchIngredients.mockResolvedValue([ingredient]);

    await listIngredients({ function: "barrier_support", limit: 10 });

    expect(mockedSearchIngredients).toHaveBeenCalledWith({
      function: "barrier_support",
      limit: 10,
    });
  });

  it("passes q search to the repository", async () => {
    mockedSearchIngredients.mockResolvedValue([ingredient]);

    await listIngredients({ q: "nia", limit: 5 });

    expect(mockedSearchIngredients).toHaveBeenCalledWith({
      q: "nia",
      limit: 5,
    });
  });

  it("gets an ingredient by id", async () => {
    mockedFindIngredientById.mockResolvedValue(ingredient);

    await expect(getIngredientById(ingredientId)).resolves.toBe(ingredient);
    expect(mockedFindIngredientById).toHaveBeenCalledWith(ingredientId);
  });

  it("returns null for invalid or missing ids through the repository", async () => {
    mockedFindIngredientById.mockResolvedValue(null);

    await expect(getIngredientById("not-an-object-id")).resolves.toBeNull();
  });

  it("lists ingredients for admin through the admin repository search", async () => {
    mockedSearchIngredientsForAdmin.mockResolvedValue([ingredient]);

    await expect(
      listIngredientsForAdmin({
        function: "barrier_support",
        limit: 50,
        q: "nia",
      }),
    ).resolves.toEqual([ingredient]);
    expect(mockedSearchIngredientsForAdmin).toHaveBeenCalledWith({
      function: "barrier_support",
      limit: 50,
      q: "nia",
    });
  });

  it("creates ingredients for admin when INCI name is not duplicated", async () => {
    mockedFindIngredientByNormalizedInciName.mockResolvedValue(null);
    mockedCreateIngredient.mockResolvedValue(ingredient);

    await expect(
      createIngredientForAdmin({
        aliases: ["Vitamin B3"],
        avoidWith: [],
        cautionFor: ["very sensitive skin"],
        commonUses: ["barrier support"],
        evidenceLevel: "moderate",
        functions: ["barrier_support"],
        inciName: "Niacinamide",
        sourceRefs: ["manual-curation"],
        suitableFor: ["oily"],
      }),
    ).resolves.toBe(ingredient);
    expect(mockedFindIngredientByNormalizedInciName).toHaveBeenCalledWith(
      "Niacinamide",
    );
    expect(mockedCreateIngredient).toHaveBeenCalledWith(
      expect.objectContaining({
        inciName: "Niacinamide",
      }),
    );
  });

  it("rejects duplicate normalized INCI names on create", async () => {
    mockedFindIngredientByNormalizedInciName.mockResolvedValue(ingredient);

    await expect(
      createIngredientForAdmin({
        aliases: [],
        avoidWith: [],
        cautionFor: [],
        commonUses: [],
        evidenceLevel: "basic",
        functions: [],
        inciName: "niacinamide",
        sourceRefs: [],
        suitableFor: [],
      }),
    ).rejects.toBeInstanceOf(DuplicateIngredientInciNameError);
    expect(mockedCreateIngredient).not.toHaveBeenCalled();
  });

  it("updates ingredients for admin", async () => {
    const updatedIngredient = {
      ...ingredient,
      commonUses: ["updated use"],
    } satisfies Ingredient;
    mockedUpdateIngredient.mockResolvedValue(updatedIngredient);

    await expect(
      updateIngredientForAdmin(ingredientId, {
        commonUses: ["updated use"],
      }),
    ).resolves.toBe(updatedIngredient);
    expect(mockedFindIngredientByNormalizedInciName).not.toHaveBeenCalled();
    expect(mockedUpdateIngredient).toHaveBeenCalledWith(ingredientId, {
      commonUses: ["updated use"],
    });
  });

  it("rejects duplicate normalized INCI names from another ingredient on update", async () => {
    const duplicateIngredient = {
      ...ingredient,
      _id: new ObjectId("665000000000000000000212"),
      inciName: "Panthenol",
    } satisfies Ingredient;
    mockedFindIngredientByNormalizedInciName.mockResolvedValue(
      duplicateIngredient,
    );

    await expect(
      updateIngredientForAdmin(ingredientId, {
        inciName: "Panthenol",
      }),
    ).rejects.toBeInstanceOf(DuplicateIngredientInciNameError);
    expect(mockedUpdateIngredient).not.toHaveBeenCalled();
  });

  it("allows updating an unchanged own INCI name", async () => {
    mockedFindIngredientByNormalizedInciName.mockResolvedValue(ingredient);
    mockedUpdateIngredient.mockResolvedValue(ingredient);

    await expect(
      updateIngredientForAdmin(ingredientId, {
        inciName: "Niacinamide",
      }),
    ).resolves.toBe(ingredient);
    expect(mockedUpdateIngredient).toHaveBeenCalledWith(ingredientId, {
      inciName: "Niacinamide",
    });
  });

  it("returns null for missing ingredient updates through the repository", async () => {
    mockedUpdateIngredient.mockResolvedValue(null);

    await expect(
      updateIngredientForAdmin(ingredientId, {
        commonUses: ["updated use"],
      }),
    ).resolves.toBeNull();
  });
});
