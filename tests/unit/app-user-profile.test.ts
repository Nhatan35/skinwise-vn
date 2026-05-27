import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const collectionMock = {
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getAppUserProfilesCollection: vi.fn(() => collectionMock),
}));

import {
  ensureAppUserProfile,
  findAppUserProfileByUserId,
  markAppUserProfileOnboardingCompleted,
  requestAccountDeletionForUser,
} from "@/modules/users/app-user-profile.repository";
import { toMeUserDto } from "@/modules/users/app-user-profile.mapper";
import {
  APP_USER_ROLES,
  DEFAULT_APP_USER_PROFILE,
  type AppUserProfile,
} from "@/modules/users/app-user-profile.types";
import type { CurrentUser } from "@/modules/auth/types";

const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const authUserId = "auth-user-id";

function createCurrentUser(): CurrentUser {
  return {
    id: authUserId,
    email: "an@example.com",
    name: "An",
    image: "https://example.com/avatar.png",
  };
}

function createProfile(overrides: Partial<AppUserProfile> = {}): AppUserProfile {
  return {
    _id: new ObjectId("665000000000000000000001"),
    userId: authUserId,
    role: "USER",
    onboardingCompleted: false,
    accountDeletionRequestedAt: null,
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  };
}

describe("AppUserProfile mapper and types", () => {
  it("maps current user and profile to the /api/me DTO", () => {
    expect(toMeUserDto(createCurrentUser(), createProfile())).toEqual({
      id: authUserId,
      email: "an@example.com",
      name: "An",
      role: "USER",
      onboardingCompleted: false,
      accountDeletionRequestStatus: "not_requested",
    });
  });

  it("maps account deletion request status safely when a request exists", () => {
    const requestedAt = new Date("2026-05-15T00:00:00.000Z");

    expect(
      toMeUserDto(
        createCurrentUser(),
        createProfile({ accountDeletionRequestedAt: requestedAt }),
      ),
    ).toMatchObject({
      accountDeletionRequestedAt: requestedAt.toISOString(),
      accountDeletionRequestStatus: "requested",
    });
  });

  it("does not expose MongoDB internals, raw profile, session, token, or image", () => {
    const dto = toMeUserDto(createCurrentUser(), createProfile()) as Record<
      string,
      unknown
    >;

    expect(dto).not.toHaveProperty("_id");
    expect(dto).not.toHaveProperty("ObjectId");
    expect(dto).not.toHaveProperty("userId");
    expect(dto).not.toHaveProperty("createdAt");
    expect(dto).not.toHaveProperty("updatedAt");
    expect(dto).not.toHaveProperty("profile");
    expect(dto).not.toHaveProperty("session");
    expect(dto).not.toHaveProperty("token");
    expect(dto).not.toHaveProperty("accessToken");
    expect(dto).not.toHaveProperty("refreshToken");
    expect(dto).not.toHaveProperty("image");
  });

  it("uses safe default AppUserProfile values", () => {
    expect(DEFAULT_APP_USER_PROFILE).toEqual({
      role: "USER",
      onboardingCompleted: false,
    });
  });

  it("limits MVP app user roles to USER and ADMIN", () => {
    expect(APP_USER_ROLES).toEqual(["USER", "ADMIN"]);
    expect(APP_USER_ROLES).not.toContain("CONTENT_REVIEWER");
    expect(APP_USER_ROLES).not.toContain("SUBSCRIBER");
    expect(APP_USER_ROLES).not.toContain("MARKETPLACE_SELLER");
  });
});

describe("AppUserProfile repository", () => {
  beforeEach(() => {
    collectionMock.findOne.mockReset();
    collectionMock.findOneAndUpdate.mockReset();
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  it("finds an app user profile by userId", async () => {
    const profile = createProfile();
    collectionMock.findOne.mockResolvedValue(profile);

    await expect(findAppUserProfileByUserId(authUserId)).resolves.toBe(profile);
    expect(collectionMock.findOne).toHaveBeenCalledWith({
      userId: authUserId,
    });
  });

  it("ensures an app user profile with atomic upsert defaults", async () => {
    const profile = createProfile();
    collectionMock.findOneAndUpdate.mockResolvedValue(profile);

    await expect(ensureAppUserProfile(authUserId)).resolves.toBe(profile);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: authUserId },
      {
        $setOnInsert: {
          userId: authUserId,
          role: "USER",
          onboardingCompleted: false,
          createdAt: fixedNow,
          updatedAt: fixedNow,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  });

  it("accepts opaque Auth.js user ids without coercing them to ObjectId", async () => {
    const profile = createProfile();
    collectionMock.findOneAndUpdate.mockResolvedValue(profile);

    await expect(ensureAppUserProfile("auth-user-id")).resolves.toBe(profile);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: "auth-user-id" },
      expect.objectContaining({
        $setOnInsert: expect.objectContaining({
          userId: "auth-user-id",
        }),
      }),
      expect.objectContaining({
        upsert: true,
        returnDocument: "after",
      }),
    );
  });

  it("does not update updatedAt outside $setOnInsert on existing profiles", async () => {
    collectionMock.findOneAndUpdate.mockResolvedValue(createProfile());

    await ensureAppUserProfile(authUserId);

    const update = collectionMock.findOneAndUpdate.mock.calls[0]?.[1] as Record<
      string,
      unknown
    >;

    expect(update).not.toHaveProperty("$set");
    expect(update).toHaveProperty("$setOnInsert");
  });

  it("marks onboarding as completed with an atomic upsert", async () => {
    const completedProfile = createProfile({ onboardingCompleted: true });
    collectionMock.findOneAndUpdate.mockResolvedValue(completedProfile);

    await expect(
      markAppUserProfileOnboardingCompleted(authUserId),
    ).resolves.toBe(completedProfile);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: authUserId },
      {
        $set: {
          onboardingCompleted: true,
          updatedAt: fixedNow,
        },
        $setOnInsert: {
          userId: authUserId,
          role: "USER",
          createdAt: fixedNow,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  });

  it("preserves existing roles when marking onboarding complete", async () => {
    collectionMock.findOneAndUpdate.mockResolvedValue(
      createProfile({ onboardingCompleted: true, role: "ADMIN" }),
    );

    await markAppUserProfileOnboardingCompleted(authUserId);

    const update = collectionMock.findOneAndUpdate.mock.calls[0]?.[1] as Record<
      string,
      Record<string, unknown>
    >;

    expect(update.$set).toEqual({
      onboardingCompleted: true,
      updatedAt: fixedNow,
    });
    expect(update.$set).not.toHaveProperty("role");
    expect(update.$setOnInsert).toMatchObject({
      role: "USER",
    });
  });

  it("requests account deletion with an idempotent profile upsert", async () => {
    const requestedProfile = createProfile({
      accountDeletionRequestedAt: fixedNow,
      updatedAt: fixedNow,
    });
    collectionMock.findOne.mockResolvedValue(null);
    collectionMock.findOneAndUpdate.mockResolvedValue(requestedProfile);

    await expect(requestAccountDeletionForUser(authUserId)).resolves.toBe(
      requestedProfile,
    );

    expect(collectionMock.findOne).toHaveBeenCalledWith({ userId: authUserId });
    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: authUserId },
      {
        $set: {
          accountDeletionRequestedAt: fixedNow,
          updatedAt: fixedNow,
        },
        $setOnInsert: {
          userId: authUserId,
          role: "USER",
          onboardingCompleted: false,
          createdAt: fixedNow,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  });

  it("does not overwrite an existing account deletion request timestamp", async () => {
    const originalRequestedAt = new Date("2026-05-01T00:00:00.000Z");
    const requestedProfile = createProfile({
      accountDeletionRequestedAt: originalRequestedAt,
      updatedAt: fixedNow,
    });
    collectionMock.findOne.mockResolvedValue(
      createProfile({ accountDeletionRequestedAt: originalRequestedAt }),
    );
    collectionMock.findOneAndUpdate.mockResolvedValue(requestedProfile);

    await expect(requestAccountDeletionForUser(authUserId)).resolves.toBe(
      requestedProfile,
    );

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: authUserId },
      {
        $set: {
          updatedAt: fixedNow,
        },
      },
      {
        upsert: false,
        returnDocument: "after",
      },
    );

    const update = collectionMock.findOneAndUpdate.mock.calls[0]?.[1] as Record<
      string,
      Record<string, unknown>
    >;
    expect(update.$set).not.toHaveProperty("accountDeletionRequestedAt");
  });
});
