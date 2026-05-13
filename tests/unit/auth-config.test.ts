import { describe, expect, it } from "vitest";

import {
  createAuthConfig,
  getAuthProviders,
  hasGoogleCredentials,
} from "@/modules/auth/auth.config";

function providerIds(providers: ReturnType<typeof getAuthProviders>) {
  return providers.map((provider) => provider.id);
}

describe("Auth.js edge-safe config", () => {
  it("disables Google provider when AUTH_GOOGLE_ID is missing", () => {
    const input = { AUTH_GOOGLE_SECRET: "test-secret" };

    expect(hasGoogleCredentials(input)).toBe(false);
    expect(getAuthProviders(input)).toEqual([]);
  });

  it("disables Google provider when AUTH_GOOGLE_SECRET is missing", () => {
    const input = { AUTH_GOOGLE_ID: "test-id" };

    expect(hasGoogleCredentials(input)).toBe(false);
    expect(getAuthProviders(input)).toEqual([]);
  });

  it("enables Google provider when both Google credentials are present", () => {
    const providers = getAuthProviders({
      AUTH_GOOGLE_ID: "test-id",
      AUTH_GOOGLE_SECRET: "test-secret",
    });

    expect(providerIds(providers)).toEqual(["google"]);
  });

  it("does not configure credentials, password, fake, or mock providers", () => {
    const providers = getAuthProviders({
      AUTH_GOOGLE_ID: "test-id",
      AUTH_GOOGLE_SECRET: "test-secret",
    });

    expect(providerIds(providers)).not.toContain("credentials");
    expect(providerIds(providers)).not.toContain("password");
    expect(providerIds(providers)).not.toContain("fake");
    expect(providerIds(providers)).not.toContain("mock");
  });

  it("does not query AppUserProfile in callbacks", () => {
    const callbacks = createAuthConfig({}).callbacks ?? {};
    const callbackSource = Object.values(callbacks).map(String).join("\n");

    expect(callbackSource).not.toContain("AppUserProfile");
    expect(callbackSource).not.toContain("app_user_profiles");
    expect(callbackSource).not.toContain("getAppUserProfilesCollection");
  });

  it("maps session.user.id from token.sub when available", async () => {
    const sessionCallback = createAuthConfig({}).callbacks?.session;

    const session = await sessionCallback?.({
      session: { user: { email: "an@example.com", name: "An" } },
      token: { sub: "auth-user-id" },
    } as never);

    expect(session?.user?.id).toBe("auth-user-id");
  });

  it("maps session.user.id from database user when available", async () => {
    const sessionCallback = createAuthConfig({}).callbacks?.session;

    const session = await sessionCallback?.({
      session: { user: { email: "an@example.com", name: "An" } },
      user: { id: "database-user-id" },
      token: {},
    } as never);

    expect(session?.user?.id).toBe("database-user-id");
  });

  it("does not add role or onboardingCompleted to session user", async () => {
    const sessionCallback = createAuthConfig({}).callbacks?.session;

    const session = await sessionCallback?.({
      session: { user: { email: "an@example.com", name: "An" } },
      token: { sub: "auth-user-id" },
    } as never);
    const sessionUser = session?.user as Record<string, unknown> | undefined;

    expect(sessionUser).not.toHaveProperty("role");
    expect(sessionUser).not.toHaveProperty("onboardingCompleted");
  });
});
