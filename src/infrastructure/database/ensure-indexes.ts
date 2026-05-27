import "server-only";

import { pathToFileURL } from "node:url";

import type { CreateIndexesOptions } from "mongodb";

import {
  COLLECTION_NAMES,
  getCollection,
  type CollectionName,
} from "@/infrastructure/database/collections";
import { closeMongoClient } from "@/infrastructure/database/mongodb";

type IndexKeyDirection = 1 | -1 | "text";
type IndexKeys = Record<string, IndexKeyDirection>;

export type DatabaseIndexDefinition = {
  collectionName: CollectionName;
  indexes: ReadonlyArray<{
    keys: IndexKeys;
    options?: CreateIndexesOptions;
  }>;
};

export const DATABASE_INDEX_DEFINITIONS = [
  {
    collectionName: COLLECTION_NAMES.APP_USER_PROFILES,
    indexes: [
      {
        keys: { userId: 1 },
        options: { name: "app_user_profiles_userId_unique", unique: true },
      },
      { keys: { role: 1 }, options: { name: "app_user_profiles_role" } },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.SKIN_PROFILES,
    indexes: [
      {
        keys: { userId: 1 },
        options: { name: "skin_profiles_userId_unique", unique: true },
      },
      { keys: { skinType: 1 }, options: { name: "skin_profiles_skinType" } },
      { keys: { concerns: 1 }, options: { name: "skin_profiles_concerns" } },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.PRODUCTS,
    indexes: [
      {
        keys: { name: "text", brand: "text", ingredientsText: "text" },
        options: { name: "products_text_search" },
      },
      { keys: { brand: 1 }, options: { name: "products_brand" } },
      { keys: { category: 1 }, options: { name: "products_category" } },
      { keys: { priceRange: 1 }, options: { name: "products_priceRange" } },
      { keys: { keyActives: 1 }, options: { name: "products_keyActives" } },
      { keys: { skinTypes: 1 }, options: { name: "products_skinTypes" } },
      { keys: { concerns: 1 }, options: { name: "products_concerns" } },
      {
        keys: { verificationStatus: 1 },
        options: { name: "products_verificationStatus" },
      },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.INGREDIENTS,
    indexes: [
      {
        keys: { inciName: 1 },
        options: { name: "ingredients_inciName_unique", unique: true },
      },
      { keys: { aliases: 1 }, options: { name: "ingredients_aliases" } },
      {
        keys: { inciName: "text", aliases: "text", functions: "text" },
        options: { name: "ingredients_text_search" },
      },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.SAVED_PRODUCTS,
    indexes: [
      {
        keys: { userId: 1, productId: 1 },
        options: {
          name: "saved_products_userId_productId_unique",
          unique: true,
        },
      },
      {
        keys: { userId: 1, createdAt: -1 },
        options: { name: "saved_products_userId_createdAt" },
      },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.ROUTINES,
    indexes: [
      {
        keys: { userId: 1, timeOfDay: 1 },
        options: { name: "routines_userId_timeOfDay" },
      },
      {
        keys: { userId: 1, updatedAt: -1 },
        options: { name: "routines_userId_updatedAt" },
      },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.ROUTINE_LOGS,
    indexes: [
      {
        keys: { userId: 1, routineId: 1, localDate: 1 },
        options: {
          name: "routine_logs_userId_routineId_localDate_unique",
          unique: true,
        },
      },
      {
        keys: { userId: 1, localDate: 1 },
        options: { name: "routine_logs_userId_localDate" },
      },
      {
        keys: { userId: 1, routineId: 1 },
        options: { name: "routine_logs_userId_routineId" },
      },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.ROUTINE_ANALYSES,
    indexes: [
      {
        keys: { userId: 1, routineId: 1 },
        options: { name: "routine_analyses_userId_routineId" },
      },
      {
        keys: { userId: 1, createdAt: -1 },
        options: { name: "routine_analyses_userId_createdAt" },
      },
      {
        keys: { userId: 1, riskLevel: 1, createdAt: -1 },
        options: { name: "routine_analyses_userId_riskLevel_createdAt" },
      },
      {
        keys: { promptVersion: 1 },
        options: { name: "routine_analyses_promptVersion" },
      },
      {
        keys: { modelName: 1 },
        options: { name: "routine_analyses_modelName" },
      },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.RATE_LIMITS,
    indexes: [
      {
        keys: { key: 1 },
        options: { name: "rate_limits_key_unique", unique: true },
      },
      {
        keys: { expiresAt: 1 },
        options: {
          name: "rate_limits_expiresAt_ttl",
          expireAfterSeconds: 0,
        },
      },
    ],
  },
  {
    collectionName: COLLECTION_NAMES.SKIN_JOURNALS,
    indexes: [
      {
        keys: { userId: 1, localDate: 1 },
        options: { name: "skin_journals_userId_localDate_unique", unique: true },
      },
      {
        keys: { userId: 1, createdAt: -1 },
        options: { name: "skin_journals_userId_createdAt" },
      },
    ],
  },
] as const satisfies ReadonlyArray<DatabaseIndexDefinition>;

export async function ensureIndexes() {
  const createdIndexes: string[] = [];

  for (const definition of DATABASE_INDEX_DEFINITIONS) {
    const collection = await getCollection(definition.collectionName);

    for (const index of definition.indexes) {
      const indexName = await collection.createIndex(index.keys, index.options);
      createdIndexes.push(`${definition.collectionName}.${indexName}`);
    }
  }

  return {
    status: "created",
    indexCount: createdIndexes.length,
    createdIndexes,
  } as const;
}

export async function main() {
  const result = await ensureIndexes();

  console.info(`db:indexes ${result.status}: ${result.indexCount} indexes ensured`);
}

function isDirectInvocation() {
  const invokedPath = process.argv[1];

  return Boolean(invokedPath && import.meta.url === pathToFileURL(invokedPath).href);
}

if (isDirectInvocation()) {
  main()
    .catch((error: unknown) => {
      console.error("db:indexes failed");
      console.error(error instanceof Error ? error.message : "Unknown error");
      process.exitCode = 1;
    })
    .finally(async () => {
      await closeMongoClient();
    });
}
