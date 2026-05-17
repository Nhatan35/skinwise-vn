import "server-only";

import { ObjectId, type Filter } from "mongodb";

import type { IngredientListQueryInput } from "@/modules/ingredients/ingredient.schema";
import type {
  Ingredient,
  IngredientDocument,
} from "@/modules/ingredients/ingredient.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

async function getIngredientCollection() {
  const { getIngredientsCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getIngredientsCollection<IngredientDocument>();
}

function toObjectId(id: string) {
  if (!mongoObjectIdPattern.test(id)) {
    return null;
  }

  return new ObjectId(id);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toSearchRegex(value: string) {
  return new RegExp(escapeRegex(value), "i");
}

export async function searchIngredients(
  input: IngredientListQueryInput,
): Promise<Ingredient[]> {
  const collection = await getIngredientCollection();
  const filter: Filter<IngredientDocument> = {};

  if (input.q) {
    const searchRegex = toSearchRegex(input.q);

    filter.$or = [
      { inciName: searchRegex } as Filter<IngredientDocument>,
      { aliases: searchRegex } as Filter<IngredientDocument>,
      { functions: searchRegex } as Filter<IngredientDocument>,
      { commonUses: searchRegex } as Filter<IngredientDocument>,
    ];
  }

  if (input.function) {
    filter.functions = input.function;
  }

  return collection
    .find(filter)
    .sort({ inciName: 1 })
    .limit(input.limit)
    .toArray();
}

export async function findIngredientById(
  id: string,
): Promise<Ingredient | null> {
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getIngredientCollection();

  return collection.findOne({ _id: objectId });
}
