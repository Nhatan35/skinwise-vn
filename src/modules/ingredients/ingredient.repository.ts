import "server-only";

import { ObjectId, type Filter } from "mongodb";

import type {
  AdminCreateIngredientBodyInput,
  AdminIngredientListQueryInput,
  AdminUpdateIngredientBodyInput,
  IngredientListQueryInput,
} from "@/modules/ingredients/ingredient.schema";
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

function toExactCaseInsensitiveRegex(value: string) {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}

export type CreateIngredientData = AdminCreateIngredientBodyInput;
export type UpdateIngredientData = AdminUpdateIngredientBodyInput;

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

export async function searchIngredientsForAdmin(
  input: AdminIngredientListQueryInput,
): Promise<Ingredient[]> {
  return searchIngredients(input);
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

export async function findIngredientByNormalizedInciName(
  inciName: string,
): Promise<Ingredient | null> {
  const normalizedInciName = inciName.trim();

  if (!normalizedInciName) {
    return null;
  }

  const collection = await getIngredientCollection();

  return collection.findOne({
    inciName: toExactCaseInsensitiveRegex(normalizedInciName),
  });
}

export async function createIngredient(
  input: CreateIngredientData,
): Promise<Ingredient> {
  const collection = await getIngredientCollection();
  const now = new Date();
  const ingredient: IngredientDocument = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(ingredient);

  return {
    _id: result.insertedId,
    ...ingredient,
  };
}

export async function updateIngredient(
  id: string,
  input: UpdateIngredientData,
): Promise<Ingredient | null> {
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getIngredientCollection();

  return collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
}
