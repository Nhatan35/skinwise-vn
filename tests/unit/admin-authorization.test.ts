import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/users/app-user-profile.repository", () => ({
  findAppUserProfileByUserId: vi.fn(),
}));

import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  AdminPermissionRequiredError,
  requireAdminUser,
} from "@/modules/auth/require-admin-user";
import { AuthenticationRequiredError } from "@/modules/auth/types";
import { findAppUserProfileByUserId } from "@/modules/users/app-user-profile.repository";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedFindAppUserProfileByUserId = vi.mocked(findAppUserProfileByUserId);

const authUserId = "auth-user-id";
const fixedDate = new Date("2026-06-15T00:00:00.000Z");

function createProfile(
  overrides: Partial<AppUserProfile> = {},
): AppUserProfile {
  return {
    _id: new ObjectId("665000000000000000000701"),
    userId: authUserId,
    role: "USER",
    onboardingCompleted: true,
    accountDeletionRequestedAt: null,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("Admin authorization helper", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedFindAppUserProfileByUserId.mockReset();
  });

  it("rejects unauthenticated users without loading an app profile", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    await expect(requireAdminUser()).rejects.toBeInstanceOf(
      AuthenticationRequiredError,
    );
    expect(mockedFindAppUserProfileByUserId).not.toHaveBeenCalled();
  });

  it("rejects authenticated non-admin users based on AppUserProfile role", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedFindAppUserProfileByUserId.mockResolvedValue(createProfile());

    await expect(requireAdminUser()).rejects.toBeInstanceOf(
      AdminPermissionRequiredError,
    );
    expect(mockedFindAppUserProfileByUserId).toHaveBeenCalledWith(authUserId);
  });

  it("rejects authenticated users with no AppUserProfile as non-admin", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedFindAppUserProfileByUserId.mockResolvedValue(null);

    await expect(requireAdminUser()).rejects.toBeInstanceOf(
      AdminPermissionRequiredError,
    );
  });

  it("returns the current user and profile for ADMIN role", async () => {
    const currentUser = {
      id: authUserId,
      email: "admin@example.com",
      name: "Admin",
    };
    const profile = createProfile({ role: "ADMIN" });

    mockedGetCurrentUser.mockResolvedValue(currentUser);
    mockedFindAppUserProfileByUserId.mockResolvedValue(profile);

    await expect(requireAdminUser()).resolves.toEqual({
      currentUser,
      profile,
    });
  });
});
