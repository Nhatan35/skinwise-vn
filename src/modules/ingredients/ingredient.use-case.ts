import type { IngredientListQueryInput } from "@/modules/ingredients/ingredient.schema";
import {
  findIngredientById,
  searchIngredients,
} from "@/modules/ingredients/ingredient.repository";

export async function listIngredients(input: IngredientListQueryInput) {
  return searchIngredients(input);
}

export async function getIngredientById(id: string) {
  return findIngredientById(id);
}
