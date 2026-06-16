import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import type { AuthEnvironment } from "@/modules/auth/types";

const DEFAULT_E2E_TEST_USER_EMAIL = "e2e-user@skinwise.test";
const DEFAULT_E2E_TEST_USER_NAME = "SkinWise E2E User";
const DEFAULT_E2E_TEST_ADMIN_EMAIL = "e2e-admin@skinwise.test";
const DEFAULT_E2E_TEST_ADMIN_NAME = "SkinWise E2E Admin";

function normalizeValue(value: string | undefined) {
  return value?.trim() ? value : undefined;
}

function resolveAppEnv(source: NodeJS.ProcessEnv) {
  return normalizeValue(source.APP_ENV) ?? normalizeValue(source.NODE_ENV);
}

export function readAuthEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): AuthEnvironment {
  return {
    APP_ENV: resolveAppEnv(source),
    AUTH_GOOGLE_ID: normalizeValue(source.AUTH_GOOGLE_ID),
    AUTH_GOOGLE_SECRET: normalizeValue(source.AUTH_GOOGLE_SECRET),
    E2E_TEST_AUTH: source.E2E_TEST_AUTH === "true",
    E2E_TEST_ADMIN_EMAIL:
      normalizeValue(source.E2E_TEST_ADMIN_EMAIL) ??
      DEFAULT_E2E_TEST_ADMIN_EMAIL,
    E2E_TEST_ADMIN_NAME:
      normalizeValue(source.E2E_TEST_ADMIN_NAME) ??
      DEFAULT_E2E_TEST_ADMIN_NAME,
    E2E_TEST_USER_EMAIL:
      normalizeValue(source.E2E_TEST_USER_EMAIL) ?? DEFAULT_E2E_TEST_USER_EMAIL,
    E2E_TEST_USER_NAME:
      normalizeValue(source.E2E_TEST_USER_NAME) ?? DEFAULT_E2E_TEST_USER_NAME,
    MONGODB_URI: normalizeValue(source.MONGODB_URI),
  };
}

function hasValue(value: string | undefined) {
  return Boolean(value?.trim());
}

export function hasGoogleCredentials(input: AuthEnvironment) {
  return hasValue(input.AUTH_GOOGLE_ID) && hasValue(input.AUTH_GOOGLE_SECRET);
}

export function hasE2ETestCredentialsProvider(input: AuthEnvironment) {
  return input.APP_ENV === "test" && input.E2E_TEST_AUTH;
}

export function getAuthProviders(input: AuthEnvironment) {
  const providers: NextAuthConfig["providers"] = [];

  if (hasGoogleCredentials(input)) {
    providers.push(
      Google({
        clientId: input.AUTH_GOOGLE_ID,
        clientSecret: input.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  if (hasE2ETestCredentialsProvider(input)) {
    const authorizeE2ETestUser = () => {
      return {
        id: "e2e-user",
        email: input.E2E_TEST_USER_EMAIL,
        name: input.E2E_TEST_USER_NAME,
      };
    };
    const e2eTestProvider = Credentials({
      name: "E2E Test",
      credentials: {},
      authorize: authorizeE2ETestUser,
    });

    providers.push(
      {
        ...e2eTestProvider,
        authorize: authorizeE2ETestUser,
        id: "e2e-test",
      } as (typeof providers)[number],
    );

    const authorizeE2ETestAdmin = () => {
      return {
        id: "e2e-admin",
        email: input.E2E_TEST_ADMIN_EMAIL,
        name: input.E2E_TEST_ADMIN_NAME,
      };
    };
    const e2eAdminTestProvider = Credentials({
      name: "E2E Admin Test",
      credentials: {},
      authorize: authorizeE2ETestAdmin,
    });

    providers.push(
      {
        ...e2eAdminTestProvider,
        authorize: authorizeE2ETestAdmin,
        id: "e2e-admin-test",
      } as (typeof providers)[number],
    );
  }

  return providers;
}

export function createAuthConfig(input: AuthEnvironment): NextAuthConfig {
  return {
    providers: getAuthProviders(input),
    callbacks: {
      authorized({ auth }) {
        return Boolean(auth?.user);
      },
      session({ session, token, user }) {
        const userId = user?.id ?? token?.sub;

        if (session.user && userId) {
          session.user.id = userId;
        }

        return session;
      },
    },
  };
}

export const authConfig = createAuthConfig(readAuthEnvironment());
