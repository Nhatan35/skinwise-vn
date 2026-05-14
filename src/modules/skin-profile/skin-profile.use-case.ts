import type {
  CreateSkinProfileInput,
  UpdateSkinProfileInput,
} from "@/modules/skin-profile/skin-profile.schema";
import {
  createOrReplaceSkinProfileForUser,
  deleteSkinProfileByUserId,
  findSkinProfileByUserId,
  updateSkinProfileByUserId,
} from "@/modules/skin-profile/skin-profile.repository";

export async function getSkinProfileForUser(userId: string) {
  return findSkinProfileByUserId(userId);
}

export async function createOrReplaceSkinProfileForCurrentUser(
  userId: string,
  input: CreateSkinProfileInput,
) {
  return createOrReplaceSkinProfileForUser(userId, input);
}

export async function updateSkinProfileForUser(
  userId: string,
  input: UpdateSkinProfileInput,
) {
  return updateSkinProfileByUserId(userId, input);
}

export async function deleteSkinProfileForUser(userId: string) {
  return deleteSkinProfileByUserId(userId);
}
