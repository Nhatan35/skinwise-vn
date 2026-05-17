import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/ingredients/ingredient.repository", () => ({
  findIngredientById: vi.fn(),
  searchIngredients: vi.fn(),
}));

import {
  getIngredientById,
  listIngredients,
} from "@/modules/ingredients/ingredient.use-case";
import {
  findIngredientById,
  searchIngredients,
} from "@/modules/ingredients/ingredient.repository";
import type { Ingredient } from "@/modules/ingredients/ingredient.types";

const mockedFindIngredientById = vi.mocked(findIngredientById);
const mockedSearchIngredients = vi.mocked(searchIngredients);

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
    mockedFindIngredientById.mockReset();
    mockedSearchIngredients.mockReset();
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
});
