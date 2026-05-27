import "server-only";

import * as dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

import { getEnv, type Env } from "@/config/env";

const MISSING_MONGODB_URI_MESSAGE =
  "MONGODB_URI is required before using MongoDB infrastructure.";
const INVALID_MONGODB_URI_MESSAGE =
  "MONGODB_URI must start with mongodb:// or mongodb+srv://.";

const MONGODB_DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

type GlobalWithMongoClient = typeof globalThis & {
  __skinwiseMongoClientPromise?: Promise<MongoClient>;
};

let productionClientPromise: Promise<MongoClient> | undefined;

function configureMongoDnsServers(): void {
  dns.setServers(MONGODB_DNS_SERVERS);
}

export function requireMongoUri(uri: string | undefined): string {
  if (!uri) {
    throw new Error(MISSING_MONGODB_URI_MESSAGE);
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(INVALID_MONGODB_URI_MESSAGE);
  }

  return uri;
}

export function createMongoClient(uri: string): MongoClient {
  configureMongoDnsServers();

  return new MongoClient(uri);
}

function createMongoClientPromise(currentEnv: Env): Promise<MongoClient> {
  const uri = requireMongoUri(currentEnv.MONGODB_URI);
  const client = createMongoClient(uri);

  return client.connect();
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const currentEnv = getEnv();

  if (currentEnv.APP_ENV === "development") {
    const globalForMongo = globalThis as GlobalWithMongoClient;

    globalForMongo.__skinwiseMongoClientPromise ??=
      createMongoClientPromise(currentEnv);

    return globalForMongo.__skinwiseMongoClientPromise;
  }

  productionClientPromise ??= createMongoClientPromise(currentEnv);

  return productionClientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getMongoClientPromise();
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();

  return client.db();
}

export async function closeMongoClient(): Promise<void> {
  const currentEnv = getEnv();

  if (currentEnv.APP_ENV === "development") {
    const globalForMongo = globalThis as GlobalWithMongoClient;
    const clientPromise = globalForMongo.__skinwiseMongoClientPromise;

    globalForMongo.__skinwiseMongoClientPromise = undefined;

    if (clientPromise) {
      const client = await clientPromise;
      await client.close();
    }

    return;
  }

  const clientPromise = productionClientPromise;

  productionClientPromise = undefined;

  if (clientPromise) {
    const client = await clientPromise;
    await client.close();
  }
}
