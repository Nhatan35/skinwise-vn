import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/auth";
import {
  AuthenticationRequiredError,
  type CurrentUser,
} from "@/modules/auth/types";
import {
  getCurrentUser,
  mapSessionToCurrentUser,
  requireCurrentUser,
} from "@/modules/auth/get-current-user";

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>);

function sessionWithExtraFields() {
  return {
    user: {
      id: "auth-user-id",
      email: "an@example.com",
      name: "An",
      image: "https://example.com/avatar.png",
      role: "ADMIN",
      onboardingCompleted: true,
    },
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expires: "2099-01-01T00:00:00.000Z",
  } as Session;
}

describe("current user auth helper", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
  });

  it("maps null session to null", () => {
    expect(mapSessionToCurrentUser(null)).toBeNull();
  });

  it("maps session user id, email, name, and image to CurrentUser", () => {
    expect(mapSessionToCurrentUser(sessionWithExtraFields())).toEqual({
      id: "auth-user-id",
      email: "an@example.com",
      name: "An",
      image: "https://example.com/avatar.png",
    });
  });

  it("does not return the raw session or sensitive fields", () => {
    const rawSession = sessionWithExtraFields();
    const currentUser = mapSessionToCurrentUser(rawSession) as CurrentUser &
      Record<string, unknown>;

    expect(currentUser).not.toBe(rawSession);
    expect(currentUser).not.toHaveProperty("user");
    expect(currentUser).not.toHaveProperty("expires");
    expect(currentUser).not.toHaveProperty("accessToken");
    expect(currentUser).not.toHaveProperty("refreshToken");
    expect(currentUser).not.toHaveProperty("role");
    expect(currentUser).not.toHaveProperty("onboardingCompleted");
  });

  it("returns mapped current user from auth()", async () => {
    mockedAuth.mockResolvedValue(sessionWithExtraFields());

    await expect(getCurrentUser()).resolves.toEqual({
      id: "auth-user-id",
      email: "an@example.com",
      name: "An",
      image: "https://example.com/avatar.png",
    });
  });

  it("throws a clear error when requiring an unauthenticated user", async () => {
    mockedAuth.mockResolvedValue(null);

    await expect(requireCurrentUser()).rejects.toThrow(
      AuthenticationRequiredError,
    );
    await expect(requireCurrentUser()).rejects.toThrow("Authentication required.");
  });
});
