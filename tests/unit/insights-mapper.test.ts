import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import { toInsightsDto } from "@/modules/insights/insights.mapper";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { Product } from "@/modules/products/product.types";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { Routine } from "@/modules/routines/routine.types";
import { routes } from "@/shared/constants/routes";

const fixedIsoDate = "2026-05-01T00:00:00.000Z";
const fixedDate = new Date(fixedIsoDate);
const morningRoutineId = "665000000000000000000101";
const eveningRoutineId = "665000000000000000000102";
const visibleProductId = "665000000000000000000201";
const secondVisibleProductId = "665000000000000000000202";
const hiddenProductId = "665000000000000000000203";

function createRoutine(id: string, name: string): Routine {
  return {
    _id: new ObjectId(id),
    userId: "auth-user-id",
    name,
    timeOfDay: "morning",
    steps: [
      {
        stepId: `${id}-step`,
        customProductName: `${name} cleanser`,
        category: "cleanser",
        order: 1,
        frequency: "daily",
      },
    ],
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

function createRoutineLog(
  routineId: string,
  localDate: string,
  status: RoutineLogDto["status"],
): RoutineLogDto {
  return {
    id: `${routineId}-${localDate}`,
    routineId,
    localDate,
    timezone: "Asia/Ho_Chi_Minh",
    status,
    createdAt: fixedIsoDate,
    updatedAt: fixedIsoDate,
  };
}

function createJournal(
  localDate: string,
  overrides: Partial<SkinJournalDto> = {},
): SkinJournalDto {
  return {
    id: `${localDate}-journal`,
    localDate,
    timezone: "Asia/Ho_Chi_Minh",
    productsUsed: [],
    observations: ["Self-tracked observation."],
    symptoms: [],
    createdAt: fixedIsoDate,
    updatedAt: fixedIsoDate,
    ...overrides,
  };
}

function createProduct(id: string, name: string, brand?: string): Product {
  return {
    _id: new ObjectId(id),
    name,
    brand: brand ?? "",
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

describe("Insights mapper", () => {
  it("builds routine-slot based consistency, journal activity, product usage, and calendar days", () => {
    const insights = toInsightsDto({
      from: "2026-05-01",
      to: "2026-05-04",
      routines: [
        createRoutine(morningRoutineId, "Morning routine"),
        createRoutine(eveningRoutineId, "Evening routine"),
      ],
      routineLogs: [
        createRoutineLog(morningRoutineId, "2026-05-01", "completed"),
        createRoutineLog(eveningRoutineId, "2026-05-01", "completed"),
        createRoutineLog(morningRoutineId, "2026-05-02", "completed"),
        createRoutineLog(eveningRoutineId, "2026-05-02", "partial"),
        createRoutineLog(morningRoutineId, "2026-05-03", "skipped"),
        createRoutineLog("other-routine", "2026-05-01", "completed"),
      ],
      journals: [
        createJournal("2026-05-01", {
          productsUsed: [visibleProductId, hiddenProductId, "not-an-object-id"],
          symptoms: ["dryness", "redness"],
        }),
        createJournal("2026-05-02", {
          productsUsed: [visibleProductId, visibleProductId, secondVisibleProductId],
          symptoms: ["dryness", "oiliness"],
        }),
        createJournal("2026-05-03", {
          symptoms: ["itchiness", "new_breakouts", "other", "stinging"],
        }),
      ],
      products: [
        createProduct(visibleProductId, "Gentle Cleanser", "Example"),
        createProduct(secondVisibleProductId, "Barrier Cream"),
      ],
    });

    expect(insights.dateRange).toEqual({
      from: "2026-05-01",
      to: "2026-05-04",
      totalDays: 4,
    });
    expect(insights.routineConsistency).toEqual({
      totalRoutineSlots: 8,
      completedRoutineSlots: 3,
      partialRoutineSlots: 1,
      skippedRoutineSlots: 1,
      notLoggedRoutineSlots: 3,
      completionRate: 38,
      maintainedDays: 1,
      currentStreak: 0,
      bestStreak: 1,
    });
    expect(insights.journalActivity.totalEntries).toBe(3);
    expect(insights.journalActivity.activeJournalDays).toBe(3);
    expect(insights.journalActivity.mostCommonSymptoms[0]).toEqual({
      symptom: "dryness",
      count: 2,
    });
    expect(insights.journalActivity.mostCommonSymptoms).toHaveLength(5);
    expect(insights.journalActivity).toMatchObject({
      totalEntries: 3,
      activeJournalDays: 3,
    });
    expect(insights.productUsage.mostUsedProducts).toEqual([
      {
        productId: visibleProductId,
        name: "Gentle Cleanser",
        brand: "Example",
        count: 2,
      },
      {
        productId: secondVisibleProductId,
        name: "Barrier Cream",
        count: 1,
      },
    ]);
    expect(insights.productUsage.mostUsedProducts).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productId: hiddenProductId,
        }),
      ]),
    );
    expect(insights.calendarDays.map((day) => day.localDate)).toEqual([
      "2026-05-01",
      "2026-05-02",
      "2026-05-03",
      "2026-05-04",
    ]);
    expect(
      insights.calendarDays.map((day) => day.routineSummary.dayStatus),
    ).toEqual(["completed", "partial", "partial", "not_logged"]);
    expect(insights.calendarDays[2]?.routineSummary).toMatchObject({
      completed: 0,
      partial: 0,
      skipped: 1,
      notLogged: 1,
      dayStatus: "partial",
    });
    expect(insights.calendarDays[0]?.hasJournalEntry).toBe(true);
    expect(insights.calendarDays[0]?.symptoms).toEqual(["dryness", "redness"]);
    expect(insights.calendarDays[3]?.hasJournalEntry).toBe(false);
    expect(insights.calendarDays[3]?.symptoms).toEqual([]);
  });

  it("returns neutral empty state data and safe next actions without medical wording", () => {
    const insights = toInsightsDto({
      from: "2026-05-31",
      to: "2026-05-31",
      routines: [],
      routineLogs: [],
      journals: [],
      products: [],
    });
    const serializedActions = JSON.stringify(insights.nextActions).toLowerCase();

    expect(insights.routineConsistency).toEqual({
      totalRoutineSlots: 0,
      completedRoutineSlots: 0,
      partialRoutineSlots: 0,
      skippedRoutineSlots: 0,
      notLoggedRoutineSlots: 0,
      completionRate: 0,
      maintainedDays: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
    expect(insights.calendarDays).toEqual([
      {
        localDate: "2026-05-31",
        routineSummary: {
          totalRoutines: 0,
          completed: 0,
          partial: 0,
          skipped: 0,
          notLogged: 0,
          dayStatus: "not_logged",
        },
        hasJournalEntry: false,
        symptoms: [],
      },
    ]);
    expect(insights.nextActions).toEqual([
      {
        label: "Tạo routine chăm sóc da",
        description:
          "Bạn cần có routine trước khi Insights có thể theo dõi độ đều đặn.",
        href: routes.ROUTINES,
        priority: "high",
      },
      {
        label: "Thêm nhật ký da",
        description:
          "Một ghi chú ngắn giúp kết nối cảm nhận của da với routine log gần đây.",
        href: routes.JOURNAL,
        priority: "medium",
      },
      {
        label: "Ghi thêm vài nhật ký da",
        description:
          "Thêm dữ liệu tự ghi nhận sẽ giúp phần xu hướng dễ đọc hơn.",
        href: routes.JOURNAL,
        priority: "low",
      },
    ]);
    expect(serializedActions).not.toContain("diagnosis");
    expect(serializedActions).not.toContain("medication");
    expect(serializedActions).not.toContain("skin score");
    expect(serializedActions).not.toContain("caused");
  });
});
