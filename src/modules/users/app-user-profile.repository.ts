import "server-only";

import {
  DEFAULT_APP_USER_PROFILE,
  type AppUserProfile,
  type AppUserProfileDocument,
} from "@/modules/users/app-user-profile.types";

async function getAppUserProfileCollection() {
  const { getAppUserProfilesCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getAppUserProfilesCollection<AppUserProfileDocument>();
}

export async function findAppUserProfileByUserId(
  userId: string,
): Promise<AppUserProfile | null> {
  const collection = await getAppUserProfileCollection();

  return collection.findOne({ userId });
}

export async function ensureAppUserProfile(
  userId: string,
): Promise<AppUserProfile> {
  const collection = await getAppUserProfileCollection();
  const now = new Date();

  const profile = await collection.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        userId,
        role: DEFAULT_APP_USER_PROFILE.role,
        onboardingCompleted: DEFAULT_APP_USER_PROFILE.onboardingCompleted,
        createdAt: now,
        updatedAt: now,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  if (!profile) {
    throw new Error("Failed to ensure AppUserProfile.");
  }

  return profile;
}
