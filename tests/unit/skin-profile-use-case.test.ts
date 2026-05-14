import { beforeEach, describe, expect, it, vi } from "vitest";
import { ObjectId } from "mongodb";

vi.mock("@/modules/skin-profile/skin-profile.repository", () => ({
  createOrReplaceSkinProfileForUser: vi.fn(),
  deleteSkinProfileByUserId: vi.fn(),
  findSkinProfileByUserId: vi.fn(),
  updateSkinProfileByUserId: vi.fn(),
}));

vi.mock("@/modules/users/app-user-profile.repository", () => ({
  markAppUserProfileOnboardingCompleted: vi.fn(),
}));

import {
  createOrReplaceSkinProfileForCurrentUser,
  updateSkinProfileForUser,
} from "@/modules/skin-profile/skin-profile.use-case";
import {
  createOrReplaceSkinProfileForUser,
  updateSkinProfileByUserId,
} from "@/modules/skin-profile/skin-profile.repository";
import type { CreateSkinProfileInput } from "@/modules/skin-profile/skin-profile.schema";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";
import { markAppUserProfileOnboardingCompleted } from "@/modules/users/app-user-profile.repository";

const mockedCreateOrReplaceSkinProfileForUser = vi.mocked(
  createOrReplaceSkinProfileForUser,
);
const mockedUpdateSkinProfileByUserId = vi.mocked(updateSkinProfileByUserId);
const mockedMarkAppUserProfileOnboardingCompleted = vi.mocked(
  markAppUserProfileOnboardingCompleted,
);

const authUserId = "auth-user-id";
const validCreateInput = {
  skinType: "oily",
  concerns: ["acne", "oiliness"],
  sensitivityLevel: "medium",
  budgetRange: "300k_700k",
  experienceLevel: "beginner",
  avoidIngredients: ["fragrance"],
} as const satisfies CreateSkinProfileInput;
const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const profile = {
  _id: new ObjectId("665000000000000000000030"),
  userId: authUserId,
  skinType: "oily",
  concerns: ["acne", "oiliness"],
  sensitivityLevel: "medium",
  budgetRange: "300k_700k",
  experienceLevel: "beginner",
  avoidIngredients: ["fragrance"],
  createdAt: fixedNow,
  updatedAt: fixedNow,
} satisfies SkinProfile;
const appUserProfile = {
  _id: new ObjectId("665000000000000000000031"),
  userId: authUserId,
  role: "USER",
  onboardingCompleted: true,
  createdAt: fixedNow,
  updatedAt: fixedNow,
} satisfies AppUserProfile;

describe("SkinProfile use cases", () => {
  beforeEach(() => {
    mockedCreateOrReplaceSkinProfileForUser.mockReset();
    mockedUpdateSkinProfileByUserId.mockReset();
    mockedMarkAppUserProfileOnboardingCompleted.mockReset();
  });

  it("marks onboarding complete after creating or replacing a profile", async () => {
    mockedCreateOrReplaceSkinProfileForUser.mockResolvedValue(profile);
    mockedMarkAppUserProfileOnboardingCompleted.mockResolvedValue(appUserProfile);

    await expect(
      createOrReplaceSkinProfileForCurrentUser(authUserId, validCreateInput),
    ).resolves.toBe(profile);

    expect(mockedCreateOrReplaceSkinProfileForUser).toHaveBeenCalledWith(
      authUserId,
      validCreateInput,
    );
    expect(
      mockedMarkAppUserProfileOnboardingCompleted,
    ).toHaveBeenCalledWith(authUserId);
    expect(
      mockedMarkAppUserProfileOnboardingCompleted.mock.invocationCallOrder[0],
    ).toBeGreaterThan(
      mockedCreateOrReplaceSkinProfileForUser.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it("does not mark onboarding complete when profile creation fails", async () => {
    mockedCreateOrReplaceSkinProfileForUser.mockRejectedValue(
      new Error("create failed"),
    );

    await expect(
      createOrReplaceSkinProfileForCurrentUser(authUserId, validCreateInput),
    ).rejects.toThrow("create failed");

    expect(
      mockedMarkAppUserProfileOnboardingCompleted,
    ).not.toHaveBeenCalled();
  });

  it("does not mark onboarding complete when updating a profile", async () => {
    mockedUpdateSkinProfileByUserId.mockResolvedValue(profile);

    await updateSkinProfileForUser(authUserId, { sensitivityLevel: "high" });

    expect(mockedUpdateSkinProfileByUserId).toHaveBeenCalledWith(authUserId, {
      sensitivityLevel: "high",
    });
    expect(
      mockedMarkAppUserProfileOnboardingCompleted,
    ).not.toHaveBeenCalled();
  });
});
