import "server-only";

import type {
  CreateSkinProfileInput,
  UpdateSkinProfileInput,
} from "@/modules/skin-profile/skin-profile.schema";
import type {
  SkinProfile,
  SkinProfileDocument,
} from "@/modules/skin-profile/skin-profile.types";

async function getSkinProfileCollection() {
  const { getSkinProfilesCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getSkinProfilesCollection<SkinProfileDocument>();
}

export async function findSkinProfileByUserId(
  userId: string,
): Promise<SkinProfile | null> {
  const collection = await getSkinProfileCollection();

  return collection.findOne({ userId });
}

export async function createOrReplaceSkinProfileForUser(
  userId: string,
  input: CreateSkinProfileInput,
): Promise<SkinProfile> {
  const collection = await getSkinProfileCollection();
  const now = new Date();

  const profile = await collection.findOneAndUpdate(
    { userId },
    {
      $set: {
        skinType: input.skinType,
        concerns: input.concerns,
        sensitivityLevel: input.sensitivityLevel,
        budgetRange: input.budgetRange,
        experienceLevel: input.experienceLevel,
        avoidIngredients: input.avoidIngredients,
        updatedAt: now,
      },
      $setOnInsert: {
        userId,
        createdAt: now,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  if (!profile) {
    throw new Error("Failed to create or replace SkinProfile.");
  }

  return profile;
}

export async function updateSkinProfileByUserId(
  userId: string,
  input: UpdateSkinProfileInput,
): Promise<SkinProfile | null> {
  const collection = await getSkinProfileCollection();

  return collection.findOneAndUpdate(
    { userId },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    },
  );
}

export async function deleteSkinProfileByUserId(
  userId: string,
): Promise<SkinProfile | null> {
  const collection = await getSkinProfileCollection();

  return collection.findOneAndDelete({ userId });
}
