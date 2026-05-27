import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/users/app-user-profile.use-case", () => ({
  requestAccountDeletionForUser: vi.fn(),
}));

import * as accountDeletionRoute from "@/app/api/account/deletion-request/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import { requestAccountDeletionForUser } from "@/modules/users/app-user-profile.use-case";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedRequestAccountDeletionForUser = vi.mocked(
  requestAccountDeletionForUser,
);

const authUserId = "auth-user-id";
const requestedAt = new Date("2026-05-27T00:00:00.000Z");

function createProfile(overrides: Partial<AppUserProfile> = {}): AppUserProfile {
  return {
    _id: new ObjectId("665000000000000000000701"),
    userId: authUserId,
    role: "USER",
    onboardingCompleted: true,
    accountDeletionRequestedAt: requestedAt,
    createdAt: new Date("2026-05-01T00:00:00.000Z"),
    updatedAt: requestedAt,
    ...overrides,
  };
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("POST /api/account/deletion-request contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedRequestAccountDeletionForUser.mockReset();
  });

  it("uses Node.js runtime and exports only POST", () => {
    expect(accountDeletionRoute.runtime).toBe("nodejs");
    expect(accountDeletionRoute.POST).toBeTypeOf("function");
    expect((accountDeletionRoute as Record<string, unknown>).GET).toBeUndefined();
    expect((accountDeletionRoute as Record<string, unknown>).DELETE).toBeUndefined();
  });

  it("rejects unauthenticated account deletion requests", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await accountDeletionRoute.POST();

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(response.status).toBe(401);
    expect(mockedRequestAccountDeletionForUser).not.toHaveBeenCalled();
  });

  it("derives userId from the authenticated user and returns a safe envelope", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedRequestAccountDeletionForUser.mockResolvedValue(createProfile());

    const response = await accountDeletionRoute.POST();
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        requested: true,
        accountDeletionRequestedAt: requestedAt.toISOString(),
      },
      error: null,
    });
    expect(mockedRequestAccountDeletionForUser).toHaveBeenCalledWith(authUserId);
    expect(JSON.stringify(body)).not.toContain("userId");
    expect(JSON.stringify(body)).not.toContain("token");
    expect(JSON.stringify(body)).not.toContain("session");
  });

  it("is safe to call more than once and returns the existing timestamp", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedRequestAccountDeletionForUser.mockResolvedValue(
      createProfile({ accountDeletionRequestedAt: requestedAt }),
    );

    const firstResponse = await accountDeletionRoute.POST();
    const secondResponse = await accountDeletionRoute.POST();

    await expect(readJson(firstResponse)).resolves.toMatchObject({
      data: { accountDeletionRequestedAt: requestedAt.toISOString() },
    });
    await expect(readJson(secondResponse)).resolves.toMatchObject({
      data: { accountDeletionRequestedAt: requestedAt.toISOString() },
    });
    expect(mockedRequestAccountDeletionForUser).toHaveBeenCalledTimes(2);
  });

  it("returns generic INTERNAL_ERROR without leaking raw database errors", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedRequestAccountDeletionForUser.mockRejectedValue(
      new Error("MongoServerError secret token session stack"),
    );

    const response = await accountDeletionRoute.POST();
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(500);
    expect(body).toEqual({
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
        details: {},
      },
    });
    expect(serializedBody).not.toContain("MongoServerError");
    expect(serializedBody).not.toContain("secret");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("session");
    expect(serializedBody).not.toContain("stack");
  });
});
