import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/skin-profile/skin-profile.use-case", () => ({
  getSkinProfileForUser: vi.fn(),
  createOrReplaceSkinProfileForCurrentUser: vi.fn(),
  updateSkinProfileForUser: vi.fn(),
  deleteSkinProfileForUser: vi.fn(),
}));

import * as skinProfileRoute from "@/app/api/skin-profile/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  createOrReplaceSkinProfileForCurrentUser,
  deleteSkinProfileForUser,
  getSkinProfileForUser,
  updateSkinProfileForUser,
} from "@/modules/skin-profile/skin-profile.use-case";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetSkinProfileForUser = vi.mocked(getSkinProfileForUser);
const mockedCreateOrReplaceSkinProfileForCurrentUser = vi.mocked(
  createOrReplaceSkinProfileForCurrentUser,
);
const mockedUpdateSkinProfileForUser = vi.mocked(updateSkinProfileForUser);
const mockedDeleteSkinProfileForUser = vi.mocked(deleteSkinProfileForUser);

const authUserId = "auth-user-id";
const otherUserId = "other-user-id";
const fixedDate = new Date("2026-05-14T00:00:00.000Z");

const validRequestBody = {
  skinType: "oily",
  concerns: ["acne", "oiliness"],
  sensitivityLevel: "medium",
  budgetRange: "300k_700k",
  experienceLevel: "beginner",
  avoidIngredients: ["fragrance"],
};

function createProfile(overrides: Partial<SkinProfile> = {}): SkinProfile {
  return {
    _id: new ObjectId("665000000000000000000020"),
    userId: authUserId,
    skinType: "oily",
    concerns: ["acne", "oiliness"],
    sensitivityLevel: "medium",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredients: ["fragrance"],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/skin-profile", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function mockAuthenticatedUser(userId = authUserId) {
  mockedGetCurrentUser.mockResolvedValue({
    id: userId,
    email: "an@example.com",
    name: "An",
  });
}

describe("/api/skin-profile contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetSkinProfileForUser.mockReset();
    mockedCreateOrReplaceSkinProfileForCurrentUser.mockReset();
    mockedUpdateSkinProfileForUser.mockReset();
    mockedDeleteSkinProfileForUser.mockReset();
  });

  it("uses the Node.js runtime and exports the expected handlers", () => {
    expect(skinProfileRoute.runtime).toBe("nodejs");
    expect(skinProfileRoute.GET).toBeTypeOf("function");
    expect(skinProfileRoute.POST).toBeTypeOf("function");
    expect(skinProfileRoute.PATCH).toBeTypeOf("function");
    expect(skinProfileRoute.DELETE).toBeTypeOf("function");
  });

  it("returns UNAUTHORIZED for unauthenticated requests", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await skinProfileRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(response.status).toBe(401);
    expect(mockedGetSkinProfileForUser).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND when the current user has no profile", async () => {
    mockAuthenticatedUser();
    mockedGetSkinProfileForUser.mockResolvedValue(null);

    const response = await skinProfileRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Skin profile was not found.",
        details: {},
      },
    });
    expect(response.status).toBe(404);
    expect(mockedGetSkinProfileForUser).toHaveBeenCalledWith(authUserId);
  });

  it("returns the current user's profile without MongoDB internals", async () => {
    mockAuthenticatedUser();
    mockedGetSkinProfileForUser.mockResolvedValue(createProfile());

    const response = await skinProfileRoute.GET();
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        profile: {
          id: "665000000000000000000020",
          skinType: "oily",
          concerns: ["acne", "oiliness"],
          sensitivityLevel: "medium",
          budgetRange: "300k_700k",
          experienceLevel: "beginner",
          avoidIngredients: ["fragrance"],
          createdAt: fixedDate.toISOString(),
          updatedAt: fixedDate.toISOString(),
        },
      },
      error: null,
    });
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("userId");
  });

  it("creates or replaces a profile for the authenticated user", async () => {
    mockAuthenticatedUser();
    mockedCreateOrReplaceSkinProfileForCurrentUser.mockResolvedValue(
      createProfile(),
    );

    const response = await skinProfileRoute.POST(jsonRequest(validRequestBody));

    expect(response.status).toBe(201);
    expect(mockedCreateOrReplaceSkinProfileForCurrentUser).toHaveBeenCalledWith(
      authUserId,
      validRequestBody,
    );
  });

  it("rejects invalid create input", async () => {
    mockAuthenticatedUser();

    const response = await skinProfileRoute.POST(
      jsonRequest({
        ...validRequestBody,
        concerns: [],
      }),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedCreateOrReplaceSkinProfileForCurrentUser).not.toHaveBeenCalled();
  });

  it("rejects request body userId and never uses it", async () => {
    mockAuthenticatedUser();

    const response = await skinProfileRoute.POST(
      jsonRequest({
        ...validRequestBody,
        userId: otherUserId,
      }),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedCreateOrReplaceSkinProfileForCurrentUser).not.toHaveBeenCalled();
  });

  it("updates the current user's profile", async () => {
    mockAuthenticatedUser();
    mockedUpdateSkinProfileForUser.mockResolvedValue(
      createProfile({ sensitivityLevel: "high" }),
    );

    const response = await skinProfileRoute.PATCH(
      jsonRequest({ sensitivityLevel: "high" }),
    );

    expect(response.status).toBe(200);
    expect(mockedUpdateSkinProfileForUser).toHaveBeenCalledWith(authUserId, {
      sensitivityLevel: "high",
    });
  });

  it("returns NOT_FOUND when updating a missing profile", async () => {
    mockAuthenticatedUser();
    mockedUpdateSkinProfileForUser.mockResolvedValue(null);

    const response = await skinProfileRoute.PATCH(
      jsonRequest({ sensitivityLevel: "high" }),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
    expect(response.status).toBe(404);
  });

  it("rejects empty update bodies", async () => {
    mockAuthenticatedUser();

    const response = await skinProfileRoute.PATCH(jsonRequest({}));

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedUpdateSkinProfileForUser).not.toHaveBeenCalled();
  });

  it("deletes the current user's profile", async () => {
    mockAuthenticatedUser();
    mockedDeleteSkinProfileForUser.mockResolvedValue(createProfile());

    const response = await skinProfileRoute.DELETE();

    await expect(readJson(response)).resolves.toEqual({
      data: {
        deleted: true,
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedDeleteSkinProfileForUser).toHaveBeenCalledWith(authUserId);
  });

  it("returns NOT_FOUND when deleting a missing profile", async () => {
    mockAuthenticatedUser();
    mockedDeleteSkinProfileForUser.mockResolvedValue(null);

    const response = await skinProfileRoute.DELETE();

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
    expect(response.status).toBe(404);
  });

  it("uses only the authenticated user id for ownership", async () => {
    mockAuthenticatedUser(authUserId);
    mockedGetSkinProfileForUser.mockResolvedValue(createProfile());

    await skinProfileRoute.GET();

    expect(mockedGetSkinProfileForUser).toHaveBeenCalledWith(authUserId);
    expect(mockedGetSkinProfileForUser).not.toHaveBeenCalledWith(otherUserId);
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedGetSkinProfileForUser.mockRejectedValue(
      new Error(
        "MongoServerError MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await skinProfileRoute.GET();
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
