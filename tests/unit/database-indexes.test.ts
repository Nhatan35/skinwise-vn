import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { COLLECTION_NAMES } from "@/infrastructure/database/collections";
import { DATABASE_INDEX_DEFINITIONS } from "@/infrastructure/database/ensure-indexes";

type ExpectedIndexKeys = Record<string, 1 | -1 | "text">;

function getIndexes(collectionName: string) {
  const definition = DATABASE_INDEX_DEFINITIONS.find(
    (indexDefinition) => indexDefinition.collectionName === collectionName,
  );

  expect(definition).toBeDefined();

  return definition?.indexes ?? [];
}

function findIndex(collectionName: string, keys: ExpectedIndexKeys) {
  return getIndexes(collectionName).find(
    (index) => JSON.stringify(index.keys) === JSON.stringify(keys),
  );
}

function expectUniqueIndex(collectionName: string, keys: ExpectedIndexKeys) {
  const index = findIndex(collectionName, keys);
  const options = index?.options as { unique?: boolean } | undefined;

  expect(index).toBeDefined();
  expect(options?.unique).toBe(true);
}

function expectIndex(collectionName: string, keys: ExpectedIndexKeys) {
  expect(findIndex(collectionName, keys)).toBeDefined();
}

function expectTtlIndex(
  collectionName: string,
  keys: ExpectedIndexKeys,
  expireAfterSeconds: number,
) {
  const index = findIndex(collectionName, keys);
  const options = index?.options as
    | { expireAfterSeconds?: number }
    | undefined;

  expect(index).toBeDefined();
  expect(options?.expireAfterSeconds).toBe(expireAfterSeconds);
}

describe("database index definitions", () => {
  it("defines unique user profile indexes", () => {
    expectUniqueIndex(COLLECTION_NAMES.APP_USER_PROFILES, { userId: 1 });
    expectUniqueIndex(COLLECTION_NAMES.SKIN_PROFILES, { userId: 1 });
  });

  it("defines product text search index", () => {
    expectIndex(COLLECTION_NAMES.PRODUCTS, {
      name: "text",
      brand: "text",
      ingredientsText: "text",
    });
  });

  it("defines unique ingredient INCI name index", () => {
    expectUniqueIndex(COLLECTION_NAMES.INGREDIENTS, { inciName: 1 });
  });

  it("defines routine ownership query indexes", () => {
    expectIndex(COLLECTION_NAMES.ROUTINES, { userId: 1, timeOfDay: 1 });
    expectIndex(COLLECTION_NAMES.ROUTINES, { userId: 1, updatedAt: -1 });
  });

  it("defines routine log unique daily upsert index", () => {
    expectUniqueIndex(COLLECTION_NAMES.ROUTINE_LOGS, {
      userId: 1,
      routineId: 1,
      localDate: 1,
    });
  });

  it("defines skin journal unique daily entry index", () => {
    expectUniqueIndex(COLLECTION_NAMES.SKIN_JOURNALS, {
      userId: 1,
      localDate: 1,
    });
  });

  it("defines routine analysis query indexes", () => {
    expectIndex(COLLECTION_NAMES.ROUTINE_ANALYSES, {
      userId: 1,
      routineId: 1,
    });
    expectIndex(COLLECTION_NAMES.ROUTINE_ANALYSES, {
      userId: 1,
      createdAt: -1,
    });
    expectIndex(COLLECTION_NAMES.ROUTINE_ANALYSES, {
      userId: 1,
      riskLevel: 1,
      createdAt: -1,
    });
    expectIndex(COLLECTION_NAMES.ROUTINE_ANALYSES, { promptVersion: 1 });
    expectIndex(COLLECTION_NAMES.ROUTINE_ANALYSES, { modelName: 1 });
  });

  it("defines rate limit indexes", () => {
    expectUniqueIndex(COLLECTION_NAMES.RATE_LIMITS, { key: 1 });
    expectTtlIndex(COLLECTION_NAMES.RATE_LIMITS, { expiresAt: 1 }, 0);
  });

  it("does not define indexes for out-of-scope fields", () => {
    const serializedDefinitions = JSON.stringify(DATABASE_INDEX_DEFINITIONS);

    for (const outOfScopeField of [
      "imageUrl",
      "imageStorageKey",
      "imageVisibility",
      "marketplace",
      "notifications",
      "skinScore",
      "faceAnalysis",
      "payment",
      "subscription",
    ]) {
      expect(serializedDefinitions).not.toContain(outOfScopeField);
    }
  });
});
