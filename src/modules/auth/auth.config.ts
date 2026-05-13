import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import type { AuthEnvironment } from "@/modules/auth/types";

export function readAuthEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): AuthEnvironment {
  return {
    APP_ENV: source.APP_ENV ?? source.NODE_ENV,
    AUTH_GOOGLE_ID: source.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: source.AUTH_GOOGLE_SECRET,
    MONGODB_URI: source.MONGODB_URI,
  };
}

function hasValue(value: string | undefined) {
  return Boolean(value?.trim());
}

export function hasGoogleCredentials(input: AuthEnvironment) {
  return hasValue(input.AUTH_GOOGLE_ID) && hasValue(input.AUTH_GOOGLE_SECRET);
}

export function getAuthProviders(input: AuthEnvironment) {
  if (!hasGoogleCredentials(input)) {
    return [];
  }

  return [
    Google({
      clientId: input.AUTH_GOOGLE_ID,
      clientSecret: input.AUTH_GOOGLE_SECRET,
    }),
  ];
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
