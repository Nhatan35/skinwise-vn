import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

import { parseEnv } from "@/config/env";

function envSource(source: Record<string, string | undefined>) {
  return source as NodeJS.ProcessEnv;
}

function withoutEnvKey(source: NodeJS.ProcessEnv, key: string) {
  const copy = { ...source };
  delete copy[key];
  return copy as NodeJS.ProcessEnv;
}

const productionBase = envSource({
  APP_ENV: "production",
  APP_BASE_URL: "https://skinwise.example",
  AUTH_SECRET: "test-auth-secret",
  AUTH_URL: "https://skinwise.example",
  MONGODB_URI: "mongodb+srv://user:pass@example.mongodb.net/skinwise",
});

describe("parseEnv", () => {
  it("defaults APP_ENV to development when APP_ENV is missing", () => {
    expect(parseEnv(envSource({})).APP_ENV).toBe("development");
  });

  it.each(["staging", "prod"])(
    "fails when APP_ENV is invalid: %s",
    (APP_ENV) => {
      expect(() => parseEnv(envSource({ APP_ENV }))).toThrow(ZodError);
    },
  );

  it("defaults feature flags to false when they are missing", () => {
    const parsed = parseEnv(envSource({}));

    expect(parsed.FEATURE_AI_ROUTINE_ANALYSIS).toBe(false);
    expect(parsed.FEATURE_INGREDIENT_EXPLANATION).toBe(false);
    expect(parsed.FEATURE_IMAGE_UPLOAD).toBe(false);
    expect(parsed.FEATURE_NOTIFICATIONS).toBe(false);
    expect(parsed.FEATURE_MARKETPLACE).toBe(false);
    expect(parsed.FEATURE_SKIN_SCORE).toBe(false);
  });

  it("defaults E2E test auth to disabled with a stable test user", () => {
    const parsed = parseEnv(envSource({}));

    expect(parsed.E2E_TEST_AUTH).toBe(false);
    expect(parsed.E2E_TEST_USER_EMAIL).toBe("e2e-user@skinwise.test");
    expect(parsed.E2E_TEST_USER_NAME).toBe("SkinWise E2E User");
  });

  it("allows E2E test auth only in test app environment", () => {
    const parsed = parseEnv(
      envSource({
        APP_ENV: "test",
        E2E_TEST_AUTH: "true",
      }),
    );

    expect(parsed.APP_ENV).toBe("test");
    expect(parsed.E2E_TEST_AUTH).toBe(true);
  });

  it.each(["production", "development"])(
    "rejects E2E test auth in %s app environment",
    (APP_ENV) => {
      const input =
        APP_ENV === "production"
          ? {
              ...productionBase,
              E2E_TEST_AUTH: "true",
            }
          : {
              APP_ENV,
              E2E_TEST_AUTH: "true",
            };

      expect(() => parseEnv(envSource(input))).toThrow(
        "E2E_TEST_AUTH can only be enabled when APP_ENV is test.",
      );
    },
  );

  it("parses true and false feature flag strings into booleans", () => {
    const parsed = parseEnv(
      envSource({
        FEATURE_MARKETPLACE: "true",
        FEATURE_NOTIFICATIONS: "false",
      }),
    );

    expect(parsed.FEATURE_MARKETPLACE).toBe(true);
    expect(parsed.FEATURE_NOTIFICATIONS).toBe(false);
  });

  it.each(["yes", "1", "0", "TRUE"])(
    "fails when a feature flag value is invalid: %s",
    (FEATURE_AI_ROUTINE_ANALYSIS) => {
      expect(() =>
        parseEnv(envSource({ FEATURE_AI_ROUTINE_ANALYSIS })),
      ).toThrow(ZodError);
    },
  );

  it("fails in production when MONGODB_URI is missing", () => {
    expect(() => parseEnv(withoutEnvKey(productionBase, "MONGODB_URI"))).toThrow(
      ZodError,
    );
  });

  it("fails in production when AUTH_SECRET is missing", () => {
    expect(() => parseEnv(withoutEnvKey(productionBase, "AUTH_SECRET"))).toThrow(
      ZodError,
    );
  });

  it("fails in production when AUTH_URL is missing", () => {
    expect(() => parseEnv(withoutEnvKey(productionBase, "AUTH_URL"))).toThrow(
      ZodError,
    );
  });

  it("fails when APP_BASE_URL is not a URL", () => {
    expect(() => parseEnv(envSource({ APP_BASE_URL: "not-a-url" }))).toThrow(
      ZodError,
    );
  });

  it("fails when AUTH_URL is not a URL", () => {
    expect(() => parseEnv(envSource({ AUTH_URL: "not-a-url" }))).toThrow(
      ZodError,
    );
  });

  it("fails when MONGODB_URI does not use a MongoDB scheme", () => {
    expect(() =>
      parseEnv(envSource({ MONGODB_URI: "postgres://example" })),
    ).toThrow(ZodError);
  });

  it("normalizes empty strings to undefined", () => {
    const parsed = parseEnv(
      envSource({
        AI_API_KEY: "",
        AUTH_SECRET: "",
        MONGODB_URI: "",
      }),
    );

    expect(parsed.AI_API_KEY).toBeUndefined();
    expect(parsed.AUTH_SECRET).toBeUndefined();
    expect(parsed.MONGODB_URI).toBeUndefined();
  });

  it("fails when AI_PROVIDER is invalid", () => {
    expect(() => parseEnv(envSource({ AI_PROVIDER: "anthropic" }))).toThrow(
      ZodError,
    );
  });

  it.each(["FEATURE_AI_ROUTINE_ANALYSIS", "FEATURE_INGREDIENT_EXPLANATION"])(
    "requires AI credentials when %s is enabled",
    (flag) => {
      expect(() => parseEnv(envSource({ [flag]: "true" }))).toThrow(ZodError);
    },
  );

  it("passes with mock AI provider when an AI feature flag is enabled", () => {
    const parsed = parseEnv(
      envSource({
        AI_API_KEY: "test-key",
        AI_MODEL: "mock-model",
        AI_PROVIDER: "mock",
        FEATURE_AI_ROUTINE_ANALYSIS: "true",
      }),
    );

    expect(parsed.AI_PROVIDER).toBe("mock");
    expect(parsed.FEATURE_AI_ROUTINE_ANALYSIS).toBe(true);
  });

  it("requires Cloudinary credentials when image upload is enabled", () => {
    expect(() =>
      parseEnv(envSource({ FEATURE_IMAGE_UPLOAD: "true" })),
    ).toThrow(ZodError);
  });
});
