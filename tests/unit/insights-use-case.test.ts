import { ObjectId } from "mongodb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/journals/skin-journal.repository", () => ({
  findSkinJournalEntriesByDateRangeForInsights: vi.fn(),
}));

vi.mock("@/modules/products/product.repository", () => ({
  findVisibleProductsByIds: vi.fn(),
}));

vi.mock("@/modules/routine-logs/routine-log.use-case", () => ({
  getRoutineLogsForDateRange: vi.fn(),
}));

vi.mock("@/modules/routines/routine.use-case", () => ({
  listRoutinesForUser: vi.fn(),
}));

import {
  getDefaultInsightsDateRange,
  getInsightsForUser,
} from "@/modules/insights/insights.use-case";
import { findSkinJournalEntriesByDateRangeForInsights } from "@/modules/journals/skin-journal.repository";
import type { SkinJournal } from "@/modules/journals/skin-journal.types";
import { findVisibleProductsByIds } from "@/modules/products/product.repository";
import type { Product } from "@/modules/products/product.types";
import { getRoutineLogsForDateRange } from "@/modules/routine-logs/routine-log.use-case";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";
import type { Routine } from "@/modules/routines/routine.types";

const mockedFindSkinJournalEntriesByDateRangeForInsights = vi.mocked(
  findSkinJournalEntriesByDateRangeForInsights,
);
const mockedFindVisibleProductsByIds = vi.mocked(findVisibleProductsByIds);
const mockedGetRoutineLogsForDateRange = vi.mocked(getRoutineLogsForDateRange);
const mockedListRoutinesForUser = vi.mocked(listRoutinesForUser);

const userId = "auth-user-id";
const routineId = "665000000000000000000301";
const productId = "665000000000000000000302";
const hiddenProductId = "665000000000000000000303";
const fixedDate = new Date("2026-05-31T04:00:00.000Z");

function createRoutine(): Routine {
  return {
    _id: new ObjectId(routineId),
    userId,
    name: "Morning routine",
    timeOfDay: "morning",
    steps: [
      {
        stepId: "step-1",
        customProductName: "Cleanser",
        category: "cleanser",
        order: 1,
        frequency: "daily",
      },
    ],
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

function createRoutineLog(): RoutineLogDto {
  return {
    id: "log-1",
    routineId,
    localDate: "2026-05-31",
    timezone: "Asia/Ho_Chi_Minh",
    status: "completed",
    createdAt: fixedDate.toISOString(),
    updatedAt: fixedDate.toISOString(),
  };
}

function createJournal(): SkinJournal {
  return {
    _id: new ObjectId("665000000000000000000304"),
    userId,
    localDate: "2026-05-31",
    timezone: "Asia/Ho_Chi_Minh",
    productsUsed: [productId, hiddenProductId, "not-an-object-id", productId],
    observations: ["Self-tracked observation."],
    symptoms: ["dryness"],
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

function createProduct(): Product {
  return {
    _id: new ObjectId(productId),
    name: "Gentle Cleanser",
    brand: "Example",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "water",
    keyActives: [],
    tags: [],
    warnings: [],
    skinTypes: ["sensitive"],
    concerns: ["dryness"],
    suitableFor: [],
    notRecommendedFor: [],
    source: "admin",
    verificationStatus: "verified",
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

describe("Insights use case", () => {
  beforeEach(() => {
    mockedListRoutinesForUser.mockReset();
    mockedGetRoutineLogsForDateRange.mockReset();
    mockedFindSkinJournalEntriesByDateRangeForInsights.mockReset();
    mockedFindVisibleProductsByIds.mockReset();
    mockedListRoutinesForUser.mockResolvedValue([createRoutine()]);
    mockedGetRoutineLogsForDateRange.mockResolvedValue([createRoutineLog()]);
    mockedFindSkinJournalEntriesByDateRangeForInsights.mockResolvedValue([
      createJournal(),
    ]);
    mockedFindVisibleProductsByIds.mockResolvedValue([createProduct()]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the explicit validated range and scopes every data load to the authenticated user", async () => {
    const insights = await getInsightsForUser(userId, {
      from: "2026-05-01",
      to: "2026-05-31",
    });

    expect(mockedListRoutinesForUser).toHaveBeenCalledWith(userId);
    expect(mockedGetRoutineLogsForDateRange).toHaveBeenCalledWith(
      userId,
      "2026-05-01",
      "2026-05-31",
    );
    expect(mockedFindSkinJournalEntriesByDateRangeForInsights).toHaveBeenCalledWith(
      userId,
      "2026-05-01",
      "2026-05-31",
    );
    expect(mockedFindVisibleProductsByIds).toHaveBeenCalledTimes(1);
    expect(mockedFindVisibleProductsByIds).toHaveBeenCalledWith([
      productId,
      hiddenProductId,
      "not-an-object-id",
    ]);
    expect(insights.productUsage.mostUsedProducts).toEqual([
      {
        productId,
        name: "Gentle Cleanser",
        brand: "Example",
        count: 1,
      },
    ]);
    expect(JSON.stringify(insights)).not.toContain(hiddenProductId);
  });

  it("defaults to the latest 30-day range including the server local date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 31, 12));

    expect(getDefaultInsightsDateRange()).toEqual({
      from: "2026-05-02",
      to: "2026-05-31",
    });

    await getInsightsForUser(userId, {});

    expect(mockedGetRoutineLogsForDateRange).toHaveBeenCalledWith(
      userId,
      "2026-05-02",
      "2026-05-31",
    );
    expect(mockedFindSkinJournalEntriesByDateRangeForInsights).toHaveBeenCalledWith(
      userId,
      "2026-05-02",
      "2026-05-31",
    );
  });

  it("returns a neutral response when the user has no routines, logs, or journals", async () => {
    mockedListRoutinesForUser.mockResolvedValue([]);
    mockedGetRoutineLogsForDateRange.mockResolvedValue([]);
    mockedFindSkinJournalEntriesByDateRangeForInsights.mockResolvedValue([]);
    mockedFindVisibleProductsByIds.mockResolvedValue([]);

    const insights = await getInsightsForUser(userId, {
      from: "2026-05-31",
      to: "2026-05-31",
    });

    expect(insights.routineConsistency.totalRoutineSlots).toBe(0);
    expect(insights.routineConsistency.completionRate).toBe(0);
    expect(insights.calendarDays).toHaveLength(1);
    expect(insights.calendarDays[0]?.routineSummary.dayStatus).toBe(
      "not_logged",
    );
    expect(mockedFindVisibleProductsByIds).toHaveBeenCalledWith([]);
  });
});
