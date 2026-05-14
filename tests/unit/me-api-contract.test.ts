import { ObjectId } from "mongodb";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/users/app-user-profile.repository", () => ({
  ensureAppUserProfile: vi.fn(),
}));

import * as meRoute from "@/app/api/me/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import { ensureAppUserProfile } from "@/modules/users/app-user-profile.repository";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedEnsureAppUserProfile = vi.mocked(ensureAppUserProfile);

const authUserId = "auth-user-id";

const profile = {
  _id: new ObjectId("665000000000000000000002"),
  userId: authUserId,
  role: "USER" as const,
  onboardingCompleted: false,
  createdAt: new Date("2026-05-14T00:00:00.000Z"),
  updatedAt: new Date("2026-05-14T00:00:00.000Z"),
};
const completedProfile = {
  ...profile,
  onboardingCompleted: true,
};

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("GET /api/me contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedEnsureAppUserProfile.mockReset();
  });

  it("exports only the GET method for HTTP handlers", () => {
    expect(meRoute.GET).toBeTypeOf("function");
    expect(meRoute.runtime).toBe("nodejs");
    expect((meRoute as Record<string, unknown>).POST).toBeUndefined();
    expect((meRoute as Record<string, unknown>).PATCH).toBeUndefined();
    expect((meRoute as Record<string, unknown>).DELETE).toBeUndefined();
  });

  it("returns UNAUTHORIZED with SkinWise response shape when unauthenticated", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await meRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(response.status).toBe(401);
    expect(mockedEnsureAppUserProfile).not.toHaveBeenCalled();
  });

  it("returns current user data with lazy AppUserProfile fields", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
      image: "https://example.com/avatar.png",
    });
    mockedEnsureAppUserProfile.mockResolvedValue(profile);

    const response = await meRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: {
        user: {
          id: authUserId,
          email: "an@example.com",
          name: "An",
          role: "USER",
          onboardingCompleted: false,
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedEnsureAppUserProfile).toHaveBeenCalledWith(authUserId);
  });

  it("can return onboardingCompleted true from AppUserProfile data", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedEnsureAppUserProfile.mockResolvedValue(completedProfile);

    const response = await meRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: {
        user: {
          id: authUserId,
          email: "an@example.com",
          name: "An",
          role: "USER",
          onboardingCompleted: true,
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
  });

  it("does not expose AppUserProfile userId in the API response", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedEnsureAppUserProfile.mockResolvedValue(profile);

    const response = await meRoute.GET();
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(JSON.stringify(body)).not.toContain('"userId"');
  });

  it("uses lazy profile creation instead of returning NOT_FOUND for missing profile", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedEnsureAppUserProfile.mockResolvedValue(profile);

    const response = await meRoute.GET();
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(JSON.stringify(body)).not.toContain("NOT_FOUND");
    expect(mockedEnsureAppUserProfile).toHaveBeenCalledWith(authUserId);
  });

  it("returns generic INTERNAL_ERROR without leaking raw database errors", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: authUserId,
      email: "an@example.com",
      name: "An",
    });
    mockedEnsureAppUserProfile.mockRejectedValue(
      new Error(
        "MongoServerError: MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await meRoute.GET();
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
    expect(serializedBody).not.toContain("MONGODB_URI");
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("session");
    expect(serializedBody).not.toContain("stack");
  });
});
