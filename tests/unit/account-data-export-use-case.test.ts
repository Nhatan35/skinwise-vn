import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/account-data/account-data.repository", () => ({
  countAccountAppDataByUserId: vi.fn(),
  deleteAccountAppDataByUserId: vi.fn(),
  getAccountDataExportSnapshot: vi.fn(),
}));

import {
  deleteAccountAppDataForUser,
  exportAccountDataForUser,
  getAccountAppDataSummaryForUser,
} from "@/modules/account-data/account-data-export.use-case";
import {
  countAccountAppDataByUserId,
  deleteAccountAppDataByUserId,
  getAccountDataExportSnapshot,
  type AccountDataExportSnapshot,
} from "@/modules/account-data/account-data.repository";
import type { CurrentUser } from "@/modules/auth/types";

const mockedGetAccountDataExportSnapshot = vi.mocked(getAccountDataExportSnapshot);
const mockedDeleteAccountAppDataByUserId = vi.mocked(deleteAccountAppDataByUserId);
const mockedCountAccountAppDataByUserId = vi.mocked(countAccountAppDataByUserId);

const authUserId = "auth-user-id";
const exportedAt = new Date("2026-06-01T00:00:00.000Z");
const createdAt = new Date("2026-05-01T00:00:00.000Z");
const updatedAt = new Date("2026-05-02T00:00:00.000Z");
const productId = new ObjectId("665000000000000000000201");

const currentUser: CurrentUser = {
  id: authUserId,
  email: "an@example.com",
  name: "An",
  image: "https://example.com/avatar.png",
};

function createSnapshot(): AccountDataExportSnapshot {
  return {
    appProfile: {
      _id: new ObjectId("665000000000000000000101"),
      userId: authUserId,
      role: "USER",
      onboardingCompleted: true,
      accountDeletionRequestedAt: null,
      createdAt,
      updatedAt,
    },
    skinProfile: {
      _id: new ObjectId("665000000000000000000102"),
      userId: authUserId,
      skinType: "combination",
      concerns: ["dryness"],
      sensitivityLevel: "medium",
      budgetRange: "300k_700k",
      experienceLevel: "beginner",
      avoidIngredients: ["fragrance"],
      createdAt,
      updatedAt,
    },
    savedProducts: [
      {
        savedProduct: {
          _id: new ObjectId("665000000000000000000103"),
          userId: authUserId,
          productId,
          tags: ["To buy"],
          createdAt,
          updatedAt,
        },
        product: {
          _id: productId,
          name: "Gentle Cleanser",
          brand: "SkinWise",
          category: "cleanser",
          priceRange: "budget",
          ingredientsText: "Water, Glycerin",
          keyActives: ["Glycerin"],
          tags: ["gentle"],
          warnings: [],
          skinTypes: ["combination"],
          concerns: ["dryness"],
          suitableFor: ["Beginner routine"],
          notRecommendedFor: [],
          source: "admin",
          verificationStatus: "verified",
          createdAt,
          updatedAt,
        },
      },
    ],
    routines: [
      {
        _id: new ObjectId("665000000000000000000104"),
        userId: authUserId,
        name: "Morning routine",
        timeOfDay: "morning",
        steps: [
          {
            stepId: "step-1",
            category: "cleanser",
            order: 1,
            frequency: "daily",
            customProductName: "Gentle cleanser",
          },
        ],
        createdAt,
        updatedAt,
      },
    ],
    routineLogs: [
      {
        _id: new ObjectId("665000000000000000000105"),
        userId: authUserId,
        routineId: "665000000000000000000104",
        localDate: "2026-06-01",
        timezone: "Asia/Ho_Chi_Minh",
        status: "completed",
        completedStepIds: ["step-1"],
        createdAt,
        updatedAt,
      },
    ],
    routineAnalyses: [
      {
        _id: new ObjectId("665000000000000000000106"),
        userId: authUserId,
        routineId: new ObjectId("665000000000000000000104"),
        routineSnapshot: {
          name: "Morning routine",
          timeOfDay: "morning",
          steps: [],
        },
        riskLevel: "low",
        ruleResults: [],
        aiResult: {
          riskLevel: "low",
          summary: "Routine có nền tảng cơ bản.",
          positiveFindings: ["Có bước làm sạch."],
          warnings: [],
          suggestions: [],
          shouldSeeProfessional: false,
          disclaimer: "Thông tin này chỉ mang tính tham khảo.",
        },
        aiStatus: "fallback_used",
        modelProvider: "deterministic",
        modelName: "routine-safety-engine",
        promptVersion: "routine-analysis-fallback-v1",
        createdAt,
      },
    ],
    skinJournals: [
      {
        _id: new ObjectId("665000000000000000000107"),
        userId: authUserId,
        localDate: "2026-06-01",
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: ["Gentle cleanser"],
        observations: ["Da hơi khô"],
        symptoms: ["dryness"],
        createdAt,
        updatedAt,
      },
    ],
  };
}

describe("account data export/delete use cases", () => {
  beforeEach(() => {
    mockedGetAccountDataExportSnapshot.mockReset();
    mockedDeleteAccountAppDataByUserId.mockReset();
    mockedCountAccountAppDataByUserId.mockReset();
  });

  it("exports only explicit safe DTO fields for the authenticated user", async () => {
    mockedGetAccountDataExportSnapshot.mockResolvedValue(createSnapshot());

    const accountDataExport = await exportAccountDataForUser(
      currentUser,
      exportedAt,
    );
    const serializedExport = JSON.stringify(accountDataExport);

    expect(mockedGetAccountDataExportSnapshot).toHaveBeenCalledWith(authUserId);
    expect(accountDataExport).toMatchObject({
      schemaVersion: "1.0",
      exportedAt: exportedAt.toISOString(),
      user: {
        id: authUserId,
        email: "an@example.com",
        name: "An",
      },
      skinProfile: {
        id: "665000000000000000000102",
      },
      savedProducts: [
        {
          productId: productId.toString(),
          tags: ["To buy"],
          product: {
            id: productId.toString(),
            name: "Gentle Cleanser",
            brand: "SkinWise",
            category: "cleanser",
            keyActives: ["Glycerin"],
          },
        },
      ],
    });
    expect(accountDataExport.routines).toHaveLength(1);
    expect(accountDataExport.routineLogs).toHaveLength(1);
    expect(accountDataExport.routineAnalyses).toHaveLength(1);
    expect(accountDataExport.skinJournals).toHaveLength(1);
    expect(serializedExport).not.toContain("_id");
    expect(serializedExport).not.toContain("userId");
    expect(serializedExport).not.toContain("accessToken");
    expect(serializedExport).not.toContain("refreshToken");
    expect(serializedExport).not.toContain("session");
    expect(serializedExport).not.toContain("ingredientsText");
  });

  it("maps missing optional user-owned data to empty export sections", async () => {
    mockedGetAccountDataExportSnapshot.mockResolvedValue({
      appProfile: null,
      skinProfile: null,
      savedProducts: [],
      routines: [],
      routineLogs: [],
      routineAnalyses: [],
      skinJournals: [],
    });

    await expect(exportAccountDataForUser(currentUser, exportedAt)).resolves.toEqual(
      {
        schemaVersion: "1.0",
        exportedAt: exportedAt.toISOString(),
        user: {
          id: authUserId,
          email: "an@example.com",
          name: "An",
        },
        appProfile: null,
        skinProfile: null,
        savedProducts: [],
        routines: [],
        routineLogs: [],
        routineAnalyses: [],
        skinJournals: [],
      },
    );
  });

  it("deletes app data for the authenticated user and returns idempotent counts", async () => {
    mockedDeleteAccountAppDataByUserId.mockResolvedValue({
      deletedCounts: {
        skinProfiles: 1,
        savedProducts: 2,
        routines: 1,
        routineLogs: 3,
        routineAnalyses: 1,
        skinJournals: 4,
      },
      appUserProfileMatched: true,
      appUserProfileOnboardingReset: true,
    });

    await expect(
      deleteAccountAppDataForUser(authUserId, exportedAt),
    ).resolves.toEqual({
      deleted: true,
      deletedAt: exportedAt.toISOString(),
      deletedCounts: {
        skinProfiles: 1,
        savedProducts: 2,
        routines: 1,
        routineLogs: 3,
        routineAnalyses: 1,
        skinJournals: 4,
      },
      appUserProfile: {
        preserved: true,
        onboardingCompletedReset: true,
      },
    });
    expect(mockedDeleteAccountAppDataByUserId).toHaveBeenCalledWith(
      authUserId,
      exportedAt,
    );
  });

  it("builds a count-only account app data summary without export snapshots", async () => {
    mockedCountAccountAppDataByUserId.mockResolvedValue({
      skinProfiles: 1,
      savedProducts: 2,
      routines: 3,
      routineLogs: 4,
      routineAnalyses: 5,
      skinJournals: 6,
    });

    await expect(
      getAccountAppDataSummaryForUser(authUserId, exportedAt),
    ).resolves.toEqual({
      generatedAt: exportedAt.toISOString(),
      counts: {
        skinProfiles: 1,
        savedProducts: 2,
        routines: 3,
        routineLogs: 4,
        routineAnalyses: 5,
        skinJournals: 6,
      },
      sharedCatalogueData: {
        productsPreserved: true,
        ingredientsPreserved: true,
      },
    });
    expect(mockedCountAccountAppDataByUserId).toHaveBeenCalledWith(authUserId);
    expect(mockedGetAccountDataExportSnapshot).not.toHaveBeenCalled();
    expect(mockedDeleteAccountAppDataByUserId).not.toHaveBeenCalled();
  });
});
