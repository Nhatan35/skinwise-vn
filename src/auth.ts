import "server-only";

import * as dns from "node:dns";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import type { MongoClient } from "mongodb";

import {
  createAuthConfig,
  readAuthEnvironment,
} from "@/modules/auth/auth.config";
import type { AuthEnvironment } from "@/modules/auth/types";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

type MongoAdapterInput = Pick<AuthEnvironment, "APP_ENV" | "MONGODB_URI">;
type MongoClientProvider = () => Promise<MongoClient>;

const AUTH_ADAPTER_COLLECTIONS = {
  Users: "users",
  Accounts: "accounts",
  Sessions: "sessions",
  VerificationTokens: "verification_tokens",
} as const;

export function shouldUseMongoAdapter(input: MongoAdapterInput) {
  if (input.APP_ENV === "production") {
    if (!input.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is required for Auth.js MongoDB adapter in production.",
      );
    }

    return true;
  }

  return Boolean(input.MONGODB_URI);
}

async function getSharedMongoClientPromise() {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  const { getMongoClientPromise } = await import(
    "@/infrastructure/database/mongodb"
  );

  return getMongoClientPromise();
}

export function createAuthAdapter(
  input: MongoAdapterInput,
  getClientPromise: MongoClientProvider = getSharedMongoClientPromise,
) {
  if (!shouldUseMongoAdapter(input)) {
    return undefined;
  }

  return MongoDBAdapter(getClientPromise, {
    collections: AUTH_ADAPTER_COLLECTIONS,
  });
}

export function createAuthOptions(input: AuthEnvironment): NextAuthConfig {
  const adapter = createAuthAdapter(input);

  return {
    ...createAuthConfig(input),
    adapter,
    session: {
      strategy: "jwt",
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth(() =>
  createAuthOptions(readAuthEnvironment()),
);