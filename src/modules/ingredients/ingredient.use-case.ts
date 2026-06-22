import type {
  AdminCreateIngredientBodyInput,
  AdminIngredientListQueryInput,
  AdminUpdateIngredientBodyInput,
  IngredientListQueryInput,
} from "@/modules/ingredients/ingredient.schema";
import {
  createIngredient,
  findIngredientByNormalizedInciName,
  findIngredientById,
  searchIngredientsForAdmin,
  searchIngredients,
  updateIngredient,
} from "@/modules/ingredients/ingredient.repository";

export class DuplicateIngredientInciNameError extends Error {
  constructor() {
    super("Ingredient INCI name already exists.");
    this.name = "DuplicateIngredientInciNameError";
  }
}

export async function listIngredients(input: IngredientListQueryInput) {
  return searchIngredients(input);
}

export async function getIngredientById(id: string) {
  return findIngredientById(id);
}

export async function listIngredientsForAdmin(
  input: AdminIngredientListQueryInput,
) {
  return searchIngredientsForAdmin(input);
}

export async function createIngredientForAdmin(
  input: AdminCreateIngredientBodyInput,
) {
  const duplicateIngredient = await findIngredientByNormalizedInciName(
    input.inciName,
  );

  if (duplicateIngredient) {
    throw new DuplicateIngredientInciNameError();
  }

  return createIngredient(input);
}

export async function updateIngredientForAdmin(
  id: string,
  input: AdminUpdateIngredientBodyInput,
) {
  if (input.inciName) {
    const duplicateIngredient = await findIngredientByNormalizedInciName(
      input.inciName,
    );

    if (duplicateIngredient && duplicateIngredient._id.toString() !== id) {
      throw new DuplicateIngredientInciNameError();
    }
  }

  return updateIngredient(id, input);
}
