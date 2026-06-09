import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { toInsightSummaryDto } from "@/modules/insights/insight-summary.mapper";
import { getInsightSummaryForUser } from "@/modules/insights/insight-summary.use-case";
import { findSkinJournalEntriesByDateRangeForInsights } from "@/modules/journals/skin-journal.repository";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { SkinJournal } from "@/modules/journals/skin-journal.types";
import { findVisibleProductsByIds } from "@/modules/products/product.repository";
import type { Product } from "@/modules/products/product.types";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import { getRoutineLogsForDateRange } from "@/modules/routine-logs/routine-log.use-case";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";
import type { Routine } from "@/modules/routines/routine.types";

const mockedFindSkinJournalEntriesByDateRangeForInsights = vi.mocked(
  findSkinJournalEntriesByDateRangeForInsights,
);
const mockedFindVisibleProductsByIds = vi.mocked(findVisibleProductsByIds);
const mockedGetRoutineLogsForDateRange = vi.mocked(getRoutineLogsForDateRange);
const mockedListRoutinesForUser = vi.mocked(listRoutinesForUser);

const userId = "auth-user-id";
const fixedDate = new Date("2026-06-07T00:00:00.000Z");
const fixedIsoDate = fixedDate.toISOString();
const morningRoutineId = "665000000000000000001201";
const eveningRoutineId = "665000000000000000001202";
const productAId = "665000000000000000001301";
const productBId = "665000000000000000001302";
const hiddenProductId = "665000000000000000001303";
const routineDateRange = {
  from: "2026-06-01",
  to: "2026-06-07",
};
const journalDateRange = {
  from: "2026-05-09",
  to: "2026-06-07",
};

function createRoutine(id: string, name: string): Routine {
  return {
    _id: new ObjectId(id),
    userId,
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
    observations: ["Self-tracked note."],
    symptoms: [],
    createdAt: fixedIsoDate,
    updatedAt: fixedIsoDate,
    ...overrides,
  };
}

function createJournalDocument(
  localDate: string,
  overrides: Partial<SkinJournal> = {},
): SkinJournal {
  return {
    _id: new ObjectId("665000000000000000001401"),
    userId,
    localDate,
    timezone: "Asia/Ho_Chi_Minh",
    productsUsed: [],
    observations: ["Self-tracked note."],
    symptoms: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
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

function createDefaultSummaryInput(overrides: {
  routines?: Routine[];
  routineLogs?: RoutineLogDto[];
  journals?: SkinJournalDto[];
  products?: Product[];
} = {}) {
  return {
    routineDateRange,
    journalDateRange,
    routines: [
      createRoutine(morningRoutineId, "Morning routine"),
      createRoutine(eveningRoutineId, "Evening routine"),
    ],
    routineLogs: [],
    journals: [],
    products: [],
    ...overrides,
  };
}

function createFullSevenDayLogs() {
  return [
    "2026-06-01",
    "2026-06-02",
    "2026-06-03",
    "2026-06-04",
    "2026-06-05",
    "2026-06-06",
    "2026-06-07",
  ].flatMap((localDate) => [
    createRoutineLog(morningRoutineId, localDate, "completed"),
    createRoutineLog(eveningRoutineId, localDate, "completed"),
  ]);
}

function getChecklistItem(
  summary: ReturnType<typeof toInsightSummaryDto>,
  key: string,
) {
  const item = summary.trackingQualityChecklist.checklistItems.find(
    (checklistItem) => checklistItem.key === key,
  );

  if (!item) {
    throw new Error(`Missing checklist item: ${key}`);
  }

  return item;
}

function collectForbiddenKeys(
  value: unknown,
  forbiddenKeys: string[],
  path = "$",
): string[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectForbiddenKeys(item, forbiddenKeys, `${path}[${index}]`),
    );
  }

  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, nestedValue]) => {
      const currentPath = `${path}.${key}`;
      const currentMatch = forbiddenKeys.includes(key) ? [currentPath] : [];

      return [
        ...currentMatch,
        ...collectForbiddenKeys(nestedValue, forbiddenKeys, currentPath),
      ];
    },
  );
}

describe("Insight summary mapper", () => {
  it("classifies routine consistency with 0 logs", () => {
    const summary = toInsightSummaryDto(createDefaultSummaryInput());

    expect(summary.routineConsistency).toMatchObject({
      periodDays: 7,
      completedDays: 0,
      partialDays: 0,
      missingDays: 7,
      noRoutineConfigured: false,
    });
    expect(summary.hasEnoughData).toBe(false);
  });

  it("classifies routine consistency with partial and skipped logs", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        routineLogs: [
          createRoutineLog(morningRoutineId, "2026-06-01", "completed"),
          createRoutineLog(eveningRoutineId, "2026-06-01", "completed"),
          createRoutineLog(morningRoutineId, "2026-06-02", "completed"),
          createRoutineLog(morningRoutineId, "2026-06-03", "skipped"),
          createRoutineLog(eveningRoutineId, "2026-06-03", "completed"),
        ],
      }),
    );

    expect(summary.routineConsistency).toMatchObject({
      completedDays: 1,
      partialDays: 2,
      missingDays: 4,
    });
  });

  it("classifies routine consistency with full 7-day completed logs", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        routineLogs: createFullSevenDayLogs(),
      }),
    );

    expect(summary.routineConsistency).toMatchObject({
      completedDays: 7,
      partialDays: 0,
      missingDays: 0,
    });
  });

  it("adds calculation metadata to every personal insight card", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [
          createJournal("2026-06-01", {
            productsUsed: [productAId],
            stressLevel: "medium",
            symptoms: ["dryness"],
          }),
        ],
        products: [createProduct(productAId, "Gentle Cleanser", "Example")],
        routineLogs: [createRoutineLog(morningRoutineId, "2026-06-01", "partial")],
      }),
    );

    expect(summary.routineConsistency.calculationMeta).toMatchObject({
      periodDays: 7,
      dataSourceLabel: "Routine logs from your account only",
    });
    expect(summary.routineConsistency.calculationMeta.calculationLabel).toContain(
      "partial days",
    );
    expect(summary.symptomFrequency.calculationMeta).toMatchObject({
      periodDays: 30,
      dataSourceLabel: "Symptoms recorded in your journal entries",
    });
    expect(summary.stressReflection.calculationMeta).toMatchObject({
      periodDays: 30,
      dataSourceLabel: "Stress levels recorded in your journal entries",
    });
    expect(summary.productMentionPattern.calculationMeta).toMatchObject({
      periodDays: 30,
      dataSourceLabel: "Products mentioned in your journal entries",
    });
  });

  it("builds a tracking quality checklist with available data states", () => {
    const journalDates = [
      "2026-06-01",
      "2026-06-02",
      "2026-06-03",
      "2026-06-04",
      "2026-06-05",
    ];
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        routineLogs: createFullSevenDayLogs(),
        journals: journalDates.map((localDate) =>
          createJournal(localDate, {
            productsUsed: [productAId],
            stressLevel: "high",
            symptoms: ["dryness"],
          }),
        ),
        products: [createProduct(productAId, "Gentle Cleanser", "Example")],
      }),
    );

    expect(getChecklistItem(summary, "routine_logs")).toMatchObject({
      status: "available",
      count: 7,
      periodDays: 7,
    });
    expect(getChecklistItem(summary, "journal_entries")).toMatchObject({
      status: "available",
      count: 5,
      periodDays: 30,
    });
    expect(getChecklistItem(summary, "symptom_notes")).toMatchObject({
      status: "available",
      count: 5,
    });
    expect(getChecklistItem(summary, "stress_notes")).toMatchObject({
      status: "available",
      count: 5,
    });
    expect(getChecklistItem(summary, "product_mentions")).toMatchObject({
      status: "available",
      count: 5,
    });
    expect(summary.trackingQualityChecklist.safetyNote.toLowerCase()).toContain(
      "not a skin score",
    );
    expect(summary.trackingQualityChecklist.safetyNote.toLowerCase()).toContain(
      "medical assessment",
    );
  });

  it("builds a tracking quality checklist with partial data states", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        routineLogs: [createRoutineLog(morningRoutineId, "2026-06-01", "partial")],
        journals: [
          createJournal("2026-06-01", {
            productsUsed: [productAId],
            stressLevel: "medium",
            symptoms: ["dryness"],
          }),
          createJournal("2026-06-02", {
            productsUsed: [productAId],
            symptoms: ["redness"],
          }),
        ],
        products: [createProduct(productAId, "Gentle Cleanser", "Example")],
      }),
    );

    expect(getChecklistItem(summary, "routine_logs")).toMatchObject({
      status: "limited",
      count: 1,
    });
    expect(getChecklistItem(summary, "journal_entries")).toMatchObject({
      status: "limited",
      count: 2,
    });
    expect(getChecklistItem(summary, "symptom_notes")).toMatchObject({
      status: "limited",
      count: 2,
    });
    expect(getChecklistItem(summary, "stress_notes")).toMatchObject({
      status: "limited",
      count: 1,
    });
    expect(getChecklistItem(summary, "product_mentions")).toMatchObject({
      status: "limited",
      count: 2,
    });
  });

  it("marks routine tracking as not configured when no routine exists", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        routines: [],
        routineLogs: [],
      }),
    );

    expect(getChecklistItem(summary, "routine_logs")).toMatchObject({
      status: "not_configured",
      count: 0,
    });
  });

  it("marks journal-derived tracking as not enough data when no journal entries exist", () => {
    const summary = toInsightSummaryDto(createDefaultSummaryInput());

    expect(getChecklistItem(summary, "journal_entries")).toMatchObject({
      status: "not_enough_data",
      count: 0,
    });
    expect(getChecklistItem(summary, "symptom_notes")).toMatchObject({
      status: "not_enough_data",
      count: 0,
    });
    expect(getChecklistItem(summary, "stress_notes")).toMatchObject({
      status: "not_enough_data",
      count: 0,
    });
    expect(getChecklistItem(summary, "product_mentions")).toMatchObject({
      status: "not_enough_data",
      count: 0,
    });
  });

  it("uses safe checklist statuses and no score-like fields", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        routineLogs: [createRoutineLog(morningRoutineId, "2026-06-01", "partial")],
        journals: [
          createJournal("2026-06-01", {
            productsUsed: [productAId],
            stressLevel: "low",
            symptoms: ["dryness"],
          }),
        ],
        products: [createProduct(productAId, "Gentle Cleanser", "Example")],
      }),
    );
    const allowedStatuses = [
      "available",
      "limited",
      "not_enough_data",
      "not_configured",
    ];
    const forbiddenScoreLikeFields = [
      "skinScore",
      "score",
      "grade",
      "rating",
      "riskLevel",
      "healthRating",
      "severity",
      "medicalStatus",
    ];

    for (const item of summary.trackingQualityChecklist.checklistItems) {
      expect(allowedStatuses).toContain(item.status);
    }
    expect(collectForbiddenKeys(summary, forbiddenScoreLikeFields)).toEqual([]);
  });

  it("does not count all days as missed when no routine is configured", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        routines: [],
        routineLogs: [],
      }),
    );

    expect(summary.routineConsistency).toMatchObject({
      completedDays: 0,
      partialDays: 0,
      missingDays: 0,
      noRoutineConfigured: true,
    });
  });

  it("counts symptom frequency from recent journal entries", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [
          createJournal("2026-06-01", {
            symptoms: ["dryness", "redness"],
          }),
          createJournal("2026-06-02", {
            symptoms: ["dryness", "itchiness"],
          }),
          createJournal("2026-06-03", {
            symptoms: ["dryness"],
          }),
        ],
      }),
    );

    expect(summary.symptomFrequency.topSymptoms).toEqual([
      {
        label: "dryness",
        count: 3,
      },
      {
        label: "itchiness",
        count: 1,
      },
      {
        label: "redness",
        count: 1,
      },
    ]);
  });

  it("returns empty symptom frequency when no symptoms were logged", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [createJournal("2026-06-01")],
      }),
    );

    expect(summary.symptomFrequency.topSymptoms).toEqual([]);
    expect(summary.symptomFrequency.summaryText).toContain(
      "Chưa có ghi chú triệu chứng",
    );
  });

  it("counts mixed stress levels without causal wording", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [
          createJournal("2026-06-01", { stressLevel: "high" }),
          createJournal("2026-06-02", { stressLevel: "high" }),
          createJournal("2026-06-03", { stressLevel: "medium" }),
          createJournal("2026-06-04", { stressLevel: "low" }),
        ],
      }),
    );

    expect(summary.stressReflection).toMatchObject({
      highStressCount: 2,
      mediumStressCount: 1,
      lowStressCount: 1,
    });
    expect(JSON.stringify(summary.stressReflection).toLowerCase()).not.toContain(
      "stress caused",
    );
  });

  it("returns safe empty stress data when no stress levels were logged", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [createJournal("2026-06-01")],
      }),
    );

    expect(summary.stressReflection).toMatchObject({
      highStressCount: 0,
      mediumStressCount: 0,
      lowStressCount: 0,
    });
    expect(summary.stressReflection.summaryText).toContain(
      "Chưa có ghi chú mức độ stress",
    );
  });

  it("counts repeated product mentions without exposing product identifiers", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [
          createJournal("2026-06-01", {
            productsUsed: [productAId, productAId, productBId, hiddenProductId],
          }),
          createJournal("2026-06-02", {
            productsUsed: [productAId],
          }),
          createJournal("2026-06-03", {
            productsUsed: [productBId],
          }),
        ],
        products: [
          createProduct(productAId, "Gentle Cleanser", "Example"),
          createProduct(productBId, "Barrier Cream", "Example"),
        ],
      }),
    );

    expect(summary.productMentionPattern.topProducts).toEqual([
      {
        name: "Barrier Cream",
        brand: "Example",
        count: 2,
      },
      {
        name: "Gentle Cleanser",
        brand: "Example",
        count: 2,
      },
    ]);
    expect(JSON.stringify(summary)).not.toContain(productAId);
    expect(JSON.stringify(summary)).not.toContain(productBId);
    expect(JSON.stringify(summary)).not.toContain(hiddenProductId);
  });

  it("returns an empty product mention pattern when no products were recorded", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [createJournal("2026-06-01")],
      }),
    );

    expect(summary.productMentionPattern.topProducts).toEqual([]);
    expect(summary.productMentionPattern.summaryText).toContain(
      "Chưa tìm thấy sản phẩm",
    );
  });

  it("sets insufficient and partial data states correctly", () => {
    const insufficientSummary = toInsightSummaryDto(createDefaultSummaryInput());
    const partialSummary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [createJournal("2026-06-01")],
      }),
    );

    expect(insufficientSummary.hasEnoughData).toBe(false);
    expect(insufficientSummary.insufficientDataReasons).toContain(
      "No routine logs were found for the last 7 days.",
    );
    expect(insufficientSummary.insufficientDataReasons).toContain(
      "No recent journal entries were found.",
    );
    expect(partialSummary.hasEnoughData).toBe(true);
  });

  it("does not produce unsafe summary text", () => {
    const summary = toInsightSummaryDto(
      createDefaultSummaryInput({
        journals: [
          createJournal("2026-06-01", {
            productsUsed: [productAId],
            stressLevel: "high",
            symptoms: ["new_breakouts"],
          }),
        ],
        products: [createProduct(productAId, "Gentle Cleanser", "Example")],
        routineLogs: [createRoutineLog(morningRoutineId, "2026-06-01", "partial")],
      }),
    );
    const serializedSummary = JSON.stringify(summary).toLowerCase();

    for (const forbiddenPhrase of [
      "caused your acne",
      "this product caused",
      "you have acne because",
      "confirmed condition",
      "you should use this treatment",
      "your skin score is",
      "diagnosed with",
      "cure your",
      "this confirms acne",
      "this confirms irritation",
      "this product is harmful",
      "this product is effective",
      "stress caused",
      "routine caused",
      "skipping your routine caused",
      "improved your skin",
      "made your skin worse",
    ]) {
      expect(serializedSummary).not.toContain(forbiddenPhrase);
    }

    expect(serializedSummary).toContain("không phải chẩn đoán");
    expect(serializedSummary).toContain("không xác nhận nguyên nhân");
  });
});

describe("Insight summary use case", () => {
  beforeEach(() => {
    mockedListRoutinesForUser.mockReset();
    mockedGetRoutineLogsForDateRange.mockReset();
    mockedFindSkinJournalEntriesByDateRangeForInsights.mockReset();
    mockedFindVisibleProductsByIds.mockReset();
    mockedListRoutinesForUser.mockResolvedValue([
      createRoutine(morningRoutineId, "Morning routine"),
    ]);
    mockedGetRoutineLogsForDateRange.mockResolvedValue([
      createRoutineLog(morningRoutineId, "2026-06-07", "completed"),
    ]);
    mockedFindSkinJournalEntriesByDateRangeForInsights.mockResolvedValue([
      createJournalDocument("2026-06-07", {
        _id: new ObjectId("665000000000000000001402"),
        productsUsed: [productAId],
        stressLevel: "medium",
        symptoms: ["dryness"],
      }),
    ]);
    mockedFindVisibleProductsByIds.mockResolvedValue([
      createProduct(productAId, "Gentle Cleanser", "Example"),
    ]);
  });

  it("uses the explicit to date to build separate 7-day and 30-day ranges", async () => {
    await getInsightSummaryForUser(userId, { to: "2026-06-07" });

    expect(mockedListRoutinesForUser).toHaveBeenCalledWith(userId);
    expect(mockedGetRoutineLogsForDateRange).toHaveBeenCalledWith(
      userId,
      "2026-06-01",
      "2026-06-07",
    );
    expect(mockedFindSkinJournalEntriesByDateRangeForInsights).toHaveBeenCalledWith(
      userId,
      "2026-05-09",
      "2026-06-07",
    );
    expect(mockedFindVisibleProductsByIds).toHaveBeenCalledWith([productAId]);
  });

  it("returns only count-based summary data from user-owned records", async () => {
    const summary = await getInsightSummaryForUser(userId, {
      to: "2026-06-07",
    });
    const serializedSummary = JSON.stringify(summary);

    expect(summary.hasEnoughData).toBe(true);
    expect(summary.routineConsistency.completedDays).toBe(1);
    expect(summary.symptomFrequency.topSymptoms).toEqual([
      {
        label: "dryness",
        count: 1,
      },
    ]);
    expect(summary.productMentionPattern.topProducts).toEqual([
      {
        name: "Gentle Cleanser",
        brand: "Example",
        count: 1,
      },
    ]);
    expect(serializedSummary).not.toContain(productAId);
    expect(serializedSummary).not.toContain("auth-user-id");
    expect(serializedSummary).not.toContain("_id");
  });
});
