import { describe, expect, it } from "vitest";

import {
  createAuthConfig,
  getAuthProviders,
  hasE2ETestCredentialsProvider,
  hasGoogleCredentials,
} from "@/modules/auth/auth.config";
import type { AuthEnvironment } from "@/modules/auth/types";

function authEnv(overrides: Partial<AuthEnvironment> = {}): AuthEnvironment {
  return {
    E2E_TEST_AUTH: false,
    E2E_TEST_ADMIN_EMAIL: "e2e-admin@skinwise.test",
    E2E_TEST_ADMIN_NAME: "SkinWise E2E Admin",
    E2E_TEST_USER_EMAIL: "e2e-user@skinwise.test",
    E2E_TEST_USER_NAME: "SkinWise E2E User",
    ...overrides,
  };
}

function providerIds(providers: ReturnType<typeof getAuthProviders>) {
  return providers.map((provider) => (provider as { id?: string }).id);
}

describe("Auth.js edge-safe config", () => {
  it("disables Google provider when AUTH_GOOGLE_ID is missing", () => {
    const input = authEnv({ AUTH_GOOGLE_SECRET: "test-secret" });

    expect(hasGoogleCredentials(input)).toBe(false);
    expect(getAuthProviders(input)).toEqual([]);
  });

  it("disables Google provider when AUTH_GOOGLE_SECRET is missing", () => {
    const input = authEnv({ AUTH_GOOGLE_ID: "test-id" });

    expect(hasGoogleCredentials(input)).toBe(false);
    expect(getAuthProviders(input)).toEqual([]);
  });

  it("enables Google provider when both Google credentials are present", () => {
    const providers = getAuthProviders(authEnv({
      AUTH_GOOGLE_ID: "test-id",
      AUTH_GOOGLE_SECRET: "test-secret",
    }));

    expect(providerIds(providers)).toEqual(["google"]);
  });

  it("does not configure credentials, password, fake, mock, or e2e providers by default", () => {
    const providers = getAuthProviders(authEnv({
      AUTH_GOOGLE_ID: "test-id",
      AUTH_GOOGLE_SECRET: "test-secret",
    }));

    expect(providerIds(providers)).not.toContain("credentials");
    expect(providerIds(providers)).not.toContain("password");
    expect(providerIds(providers)).not.toContain("fake");
    expect(providerIds(providers)).not.toContain("mock");
    expect(providerIds(providers)).not.toContain("e2e-test");
    expect(providerIds(providers)).not.toContain("e2e-admin-test");
  });

  it("enables the E2E test credentials provider only in test mode", () => {
    const input = authEnv({
      APP_ENV: "test",
      E2E_TEST_AUTH: true,
    });

    expect(hasE2ETestCredentialsProvider(input)).toBe(true);
    expect(providerIds(getAuthProviders(input))).toEqual([
      "e2e-test",
      "e2e-admin-test",
    ]);
  });

  it.each(["development", "production"])(
    "does not enable the E2E test credentials provider in %s",
    (APP_ENV) => {
      const input = authEnv({
        APP_ENV,
        E2E_TEST_AUTH: true,
      });

      expect(hasE2ETestCredentialsProvider(input)).toBe(false);
      expect(providerIds(getAuthProviders(input))).not.toContain("e2e-test");
      expect(providerIds(getAuthProviders(input))).not.toContain(
        "e2e-admin-test",
      );
    },
  );

  it("can add the E2E test credentials provider when Google credentials are missing", () => {
    const providers = getAuthProviders(
      authEnv({
        APP_ENV: "test",
        E2E_TEST_AUTH: true,
      }),
    );

    expect(providerIds(providers)).toEqual(["e2e-test", "e2e-admin-test"]);
  });

  it("keeps Google and E2E providers independent when both are configured", () => {
    const providers = getAuthProviders(
      authEnv({
        APP_ENV: "test",
        AUTH_GOOGLE_ID: "test-id",
        AUTH_GOOGLE_SECRET: "test-secret",
        E2E_TEST_AUTH: true,
      }),
    );

    expect(providerIds(providers)).toEqual([
      "google",
      "e2e-test",
      "e2e-admin-test",
    ]);
  });

  it("returns the stable E2E user from the test credentials provider", async () => {
    const providers = getAuthProviders(
      authEnv({
        APP_ENV: "test",
        E2E_TEST_AUTH: true,
        E2E_TEST_USER_EMAIL: "custom-e2e@skinwise.test",
        E2E_TEST_USER_NAME: "Custom E2E User",
      }),
    );
    const provider = providers.find(
      (item) => (item as { id?: string }).id === "e2e-test",
    );

    expect(provider).toBeDefined();

    const user = await (
      provider as unknown as {
        authorize: (
          credentials: Record<string, unknown>,
          request: Request,
        ) => Promise<unknown>;
      }
    ).authorize({}, new Request("http://localhost"));

    expect(user).toEqual({
      id: "e2e-user",
      email: "custom-e2e@skinwise.test",
      name: "Custom E2E User",
    });
  });

  it("returns the stable E2E admin from the admin test credentials provider", async () => {
    const providers = getAuthProviders(
      authEnv({
        APP_ENV: "test",
        E2E_TEST_ADMIN_EMAIL: "custom-admin@skinwise.test",
        E2E_TEST_ADMIN_NAME: "Custom E2E Admin",
        E2E_TEST_AUTH: true,
      }),
    );
    const provider = providers.find(
      (item) => (item as { id?: string }).id === "e2e-admin-test",
    );

    expect(provider).toBeDefined();

    const user = await (
      provider as unknown as {
        authorize: (
          credentials: Record<string, unknown>,
          request: Request,
        ) => Promise<unknown>;
      }
    ).authorize({}, new Request("http://localhost"));

    expect(user).toEqual({
      id: "e2e-admin",
      email: "custom-admin@skinwise.test",
      name: "Custom E2E Admin",
    });
  });

  it("does not query AppUserProfile in callbacks", () => {
    const callbacks = createAuthConfig(authEnv()).callbacks ?? {};
    const callbackSource = Object.values(callbacks).map(String).join("\n");

    expect(callbackSource).not.toContain("AppUserProfile");
    expect(callbackSource).not.toContain("app_user_profiles");
    expect(callbackSource).not.toContain("getAppUserProfilesCollection");
  });

  it("maps session.user.id from token.sub when available", async () => {
    const sessionCallback = createAuthConfig(authEnv()).callbacks?.session;

    const session = await sessionCallback?.({
      session: { user: { email: "an@example.com", name: "An" } },
      token: { sub: "auth-user-id" },
    } as never);

    expect(session?.user?.id).toBe("auth-user-id");
  });

  it("maps session.user.id from database user when available", async () => {
    const sessionCallback = createAuthConfig(authEnv()).callbacks?.session;

    const session = await sessionCallback?.({
      session: { user: { email: "an@example.com", name: "An" } },
      user: { id: "database-user-id" },
      token: {},
    } as never);

    expect(session?.user?.id).toBe("database-user-id");
  });

  it("does not add role or onboardingCompleted to session user", async () => {
    const sessionCallback = createAuthConfig(authEnv()).callbacks?.session;

    const session = await sessionCallback?.({
      session: { user: { email: "an@example.com", name: "An" } },
      token: { sub: "auth-user-id" },
    } as never);
    const sessionUser = session?.user as Record<string, unknown> | undefined;

    expect(sessionUser).not.toHaveProperty("role");
    expect(sessionUser).not.toHaveProperty("onboardingCompleted");
  });
});
