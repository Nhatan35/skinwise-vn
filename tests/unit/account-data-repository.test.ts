import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const appUserProfilesCollection = {
  findOne: vi.fn(),
  updateOne: vi.fn(),
};
const skinProfilesCollection = {
  findOne: vi.fn(),
  deleteMany: vi.fn(),
};
const savedProductsCollection = {
  find: vi.fn(),
  deleteMany: vi.fn(),
};
const productsCollection = {
  find: vi.fn(),
};
const routinesCollection = {
  find: vi.fn(),
  deleteMany: vi.fn(),
};
const routineLogsCollection = {
  find: vi.fn(),
  deleteMany: vi.fn(),
};
const routineAnalysesCollection = {
  find: vi.fn(),
  deleteMany: vi.fn(),
};
const skinJournalsCollection = {
  find: vi.fn(),
  deleteMany: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getAppUserProfilesCollection: vi.fn(() => appUserProfilesCollection),
  getIngredientsCollection: vi.fn(),
  getProductsCollection: vi.fn(() => productsCollection),
  getRoutineAnalysesCollection: vi.fn(() => routineAnalysesCollection),
  getRoutineLogsCollection: vi.fn(() => routineLogsCollection),
  getRoutinesCollection: vi.fn(() => routinesCollection),
  getSavedProductsCollection: vi.fn(() => savedProductsCollection),
  getSkinJournalsCollection: vi.fn(() => skinJournalsCollection),
  getSkinProfilesCollection: vi.fn(() => skinProfilesCollection),
}));

import {
  getIngredientsCollection,
  getProductsCollection,
} from "@/infrastructure/database/collections";
import {
  deleteAccountAppDataByUserId,
  getAccountDataExportSnapshot,
} from "@/modules/account-data/account-data.repository";

const authUserId = "auth-user-id";
const productId = new ObjectId("665000000000000000000201");
const fixedDate = new Date("2026-06-01T00:00:00.000Z");
const originalAccountDeletionRequestedAt = new Date(
  "2026-05-20T00:00:00.000Z",
);

function createAppUserProfile(overrides: Record<string, unknown> = {}) {
  return {
    _id: new ObjectId("665000000000000000000101"),
    userId: authUserId,
    role: "ADMIN",
    onboardingCompleted: true,
    accountDeletionRequestedAt: originalAccountDeletionRequestedAt,
    createdAt: new Date("2026-05-01T00:00:00.000Z"),
    updatedAt: new Date("2026-05-10T00:00:00.000Z"),
    ...overrides,
  };
}

function findSortToArray<TValue>(values: TValue[]) {
  return {
    sort: vi.fn(() => ({
      toArray: vi.fn().mockResolvedValue(values),
    })),
  };
}

function findToArray<TValue>(values: TValue[]) {
  return {
    toArray: vi.fn().mockResolvedValue(values),
  };
}

describe("account data repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    appUserProfilesCollection.findOne.mockResolvedValue(null);
    appUserProfilesCollection.updateOne.mockResolvedValue({
      matchedCount: 1,
      modifiedCount: 1,
    });
    skinProfilesCollection.findOne.mockResolvedValue(null);
    skinProfilesCollection.deleteMany.mockResolvedValue({ deletedCount: 0 });
    savedProductsCollection.find.mockReturnValue(findSortToArray([]));
    savedProductsCollection.deleteMany.mockResolvedValue({ deletedCount: 0 });
    productsCollection.find.mockReturnValue(findToArray([]));
    routinesCollection.find.mockReturnValue(findSortToArray([]));
    routinesCollection.deleteMany.mockResolvedValue({ deletedCount: 0 });
    routineLogsCollection.find.mockReturnValue(findSortToArray([]));
    routineLogsCollection.deleteMany.mockResolvedValue({ deletedCount: 0 });
    routineAnalysesCollection.find.mockReturnValue(findSortToArray([]));
    routineAnalysesCollection.deleteMany.mockResolvedValue({ deletedCount: 0 });
    skinJournalsCollection.find.mockReturnValue(findSortToArray([]));
    skinJournalsCollection.deleteMany.mockResolvedValue({ deletedCount: 0 });
  });

  it("reads export data with current-user filters and only linked products", async () => {
    savedProductsCollection.find.mockReturnValue(
      findSortToArray([
        {
          _id: new ObjectId("665000000000000000000202"),
          userId: authUserId,
          productId,
          createdAt: fixedDate,
          updatedAt: fixedDate,
        },
      ]),
    );
    productsCollection.find.mockReturnValue(
      findToArray([
        {
          _id: productId,
          name: "Cleanser",
          brand: "SkinWise",
          category: "cleanser",
          priceRange: "budget",
          ingredientsText: "Water",
          keyActives: [],
          tags: [],
          warnings: [],
          skinTypes: ["combination"],
          concerns: ["dryness"],
          suitableFor: [],
          notRecommendedFor: [],
          source: "admin",
          verificationStatus: "verified",
          createdAt: fixedDate,
          updatedAt: fixedDate,
        },
      ]),
    );

    const snapshot = await getAccountDataExportSnapshot(authUserId);

    expect(appUserProfilesCollection.findOne).toHaveBeenCalledWith({
      userId: authUserId,
    });
    expect(skinProfilesCollection.findOne).toHaveBeenCalledWith({
      userId: authUserId,
    });
    expect(savedProductsCollection.find).toHaveBeenCalledWith({
      userId: authUserId,
    });
    expect(routinesCollection.find).toHaveBeenCalledWith({ userId: authUserId });
    expect(routineLogsCollection.find).toHaveBeenCalledWith({
      userId: authUserId,
    });
    expect(routineAnalysesCollection.find).toHaveBeenCalledWith({
      userId: authUserId,
    });
    expect(skinJournalsCollection.find).toHaveBeenCalledWith({
      userId: authUserId,
    });
    expect(productsCollection.find).toHaveBeenCalledWith({
      _id: {
        $in: [productId],
      },
    });
    expect(snapshot.savedProducts[0]?.product?._id.toString()).toBe(
      productId.toString(),
    );
  });

  it("deletes only user-owned skincare app data and preserves catalogue/auth collections", async () => {
    appUserProfilesCollection.findOne.mockResolvedValue(createAppUserProfile());
    skinProfilesCollection.deleteMany.mockResolvedValue({ deletedCount: 1 });
    savedProductsCollection.deleteMany.mockResolvedValue({ deletedCount: 2 });
    routinesCollection.deleteMany.mockResolvedValue({ deletedCount: 3 });
    routineLogsCollection.deleteMany.mockResolvedValue({ deletedCount: 4 });
    routineAnalysesCollection.deleteMany.mockResolvedValue({ deletedCount: 5 });
    skinJournalsCollection.deleteMany.mockResolvedValue({ deletedCount: 6 });

    await expect(
      deleteAccountAppDataByUserId(authUserId, fixedDate),
    ).resolves.toEqual({
      deletedCounts: {
        skinProfiles: 1,
        savedProducts: 2,
        routines: 3,
        routineLogs: 4,
        routineAnalyses: 5,
        skinJournals: 6,
      },
      appUserProfileMatched: true,
      appUserProfileOnboardingReset: true,
    });

    for (const collection of [
      skinProfilesCollection,
      savedProductsCollection,
      routinesCollection,
      routineLogsCollection,
      routineAnalysesCollection,
      skinJournalsCollection,
    ]) {
      expect(collection.deleteMany).toHaveBeenCalledWith({ userId: authUserId });
      expect(collection.deleteMany).not.toHaveBeenCalledWith({});
    }

    expect(appUserProfilesCollection.updateOne).toHaveBeenCalledWith(
      { userId: authUserId },
      {
        $set: {
          onboardingCompleted: false,
          updatedAt: fixedDate,
        },
      },
    );
    const appProfileUpdate = appUserProfilesCollection.updateOne.mock
      .calls[0]?.[1] as Record<string, Record<string, unknown>>;
    expect(appProfileUpdate.$set).not.toHaveProperty("role");
    expect(appProfileUpdate.$set).not.toHaveProperty(
      "accountDeletionRequestedAt",
    );
    expect(appProfileUpdate.$set).not.toHaveProperty("createdAt");
    expect(getProductsCollection).not.toHaveBeenCalled();
    expect(getIngredientsCollection).not.toHaveBeenCalled();
  });

  it("is idempotent and does not update app_user_profiles when onboarding is already reset", async () => {
    appUserProfilesCollection.findOne.mockResolvedValue(
      createAppUserProfile({ onboardingCompleted: false }),
    );

    await expect(
      deleteAccountAppDataByUserId(authUserId, fixedDate),
    ).resolves.toMatchObject({
      deletedCounts: {
        skinProfiles: 0,
        savedProducts: 0,
        routines: 0,
        routineLogs: 0,
        routineAnalyses: 0,
        skinJournals: 0,
      },
      appUserProfileMatched: true,
      appUserProfileOnboardingReset: false,
    });

    expect(appUserProfilesCollection.updateOne).not.toHaveBeenCalled();
  });
});
