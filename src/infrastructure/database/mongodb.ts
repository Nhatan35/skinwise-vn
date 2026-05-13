import "server-only";

import { MongoClient, type Db } from "mongodb";

import { env } from "@/config/env";

const MISSING_MONGODB_URI_MESSAGE =
  "MONGODB_URI is required before using MongoDB infrastructure.";
const INVALID_MONGODB_URI_MESSAGE =
  "MONGODB_URI must start with mongodb:// or mongodb+srv://.";

type GlobalWithMongoClient = typeof globalThis & {
  __skinwiseMongoClientPromise?: Promise<MongoClient>;
};

let productionClientPromise: Promise<MongoClient> | undefined;

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
  return new MongoClient(uri);
}

function createMongoClientPromise() {
  const uri = requireMongoUri(env.MONGODB_URI);
  const client = createMongoClient(uri);

  return client.connect();
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (env.APP_ENV === "development") {
    const globalForMongo = globalThis as GlobalWithMongoClient;

    globalForMongo.__skinwiseMongoClientPromise ??= createMongoClientPromise();

    return globalForMongo.__skinwiseMongoClientPromise;
  }

  productionClientPromise ??= createMongoClientPromise();

  return productionClientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getMongoClientPromise();
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();

  return client.db();
}
