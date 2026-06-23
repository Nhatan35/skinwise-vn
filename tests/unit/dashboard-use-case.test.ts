import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/skin-profile/skin-profile.use-case", () => ({
  getSkinProfileForUser: vi.fn(),
}));

vi.mock("@/modules/routines/routine.use-case", () => ({
  listRoutinesForUser: vi.fn(),
}));

vi.mock("@/modules/routine-logs/routine-log.use-case", () => ({
  getRoutineLogsForDate: vi.fn(),
  getRoutineLogsForDateRange: vi.fn(),
}));

vi.mock("@/modules/ai-analysis/routine-analysis.repository", () => ({
  findLatestRoutineAnalysisByUserId: vi.fn(),
}));

vi.mock("@/modules/journals/list-skin-journal.use-case", () => ({
  listSkinJournalsForUser: vi.fn(),
}));

vi.mock("@/modules/saved-products/saved-product.repository", () => ({
  listSavedProductsByUser: vi.fn(),
}));

import { findLatestRoutineAnalysisByUserId } from "@/modules/ai-analysis/routine-analysis.repository";
import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";
import { getDashboardForUser } from "@/modules/dashboard/dashboard.use-case";
import { listSkinJournalsForUser } from "@/modules/journals/list-skin-journal.use-case";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import {
  getRoutineLogsForDate,
  getRoutineLogsForDateRange,
} from "@/modules/routine-logs/routine-log.use-case";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";
import type { Routine } from "@/modules/routines/routine.types";
import { listSavedProductsByUser } from "@/modules/saved-products/saved-product.repository";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";
import { getSkinProfileForUser } from "@/modules/skin-profile/skin-profile.use-case";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";
import { routes } from "@/shared/constants/routes";

const mockedGetSkinProfileForUser = vi.mocked(getSkinProfileForUser);
const mockedListRoutinesForUser = vi.mocked(listRoutinesForUser);
const mockedGetRoutineLogsForDate = vi.mocked(getRoutineLogsForDate);
const mockedGetRoutineLogsForDateRange = vi.mocked(getRoutineLogsForDateRange);
const mockedFindLatestRoutineAnalysisByUserId = vi.mocked(
  findLatestRoutineAnalysisByUserId,
);
const mockedListSkinJournalsForUser = vi.mocked(listSkinJournalsForUser);
const mockedListSavedProductsByUser = vi.mocked(listSavedProductsByUser);

const userId = "auth-user-id";
const localDate = "2026-05-17";
const sevenDayFromLocalDate = "2026-05-11";
const fourteenDayFromLocalDate = "2026-05-04";
const fixedDate = new Date("2026-05-17T00:00:00.000Z");
const morningRoutineId = "665000000000000000000500";
const eveningRoutineId = "665000000000000000000501";
const staleRoutineId = "665000000000000000000502";

function createSkinProfile(): SkinProfile {
  return {
    _id: new ObjectId("665000000000000000000510"),
    userId,
    skinType: "oily",
    concerns: ["acne", "redness"],
    sensitivityLevel: "medium",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredients: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

function createRoutine(overrides: Partial<Routine> = {}): Routine {
  return {
    _id: new ObjectId(morningRoutineId),
    userId,
    name: "Morning Routine",
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
    ...overrides,
  };
}

function createRoutineLog(
  overrides: Partial<RoutineLogDto> = {},
): RoutineLogDto {
  return {
    id: "log-1",
    routineId: morningRoutineId,
    localDate,
    timezone: "Asia/Ho_Chi_Minh",
    status: "completed",
    completedStepIds: ["step-1"],
    createdAt: fixedDate.toISOString(),
    updatedAt: fixedDate.toISOString(),
    ...overrides,
  };
}

function createAnalysis(): RoutineAnalysis {
  return {
    _id: new ObjectId("665000000000000000000520"),
    userId,
    routineId: new ObjectId(morningRoutineId),
    routineSnapshot: {
      name: "Morning Routine",
      timeOfDay: "morning",
      steps: [],
    },
    riskLevel: "low",
    ruleResults: [],
    aiResult: {
      riskLevel: "low",
      summary: "Routine looks safe.",
      positiveFindings: [],
      warnings: [
        {
          code: "MISSING_SUNSCREEN_AM",
          severity: "low",
          message: "Add sunscreen.",
          reason: "Sunscreen matters.",
        },
        {
          code: "MISSING_MOISTURIZER",
          severity: "low",
          message: "Add moisturizer.",
          reason: "Moisturizer matters.",
        },
      ],
      suggestions: [],
      shouldSeeProfessional: false,
      disclaimer: "Educational only.",
    },
    aiStatus: "fallback_used",
    modelProvider: "deterministic",
    modelName: "routine-safety-engine",
    promptVersion: "routine-analysis-fallback-v1",
    createdAt: fixedDate,
  };
}

function createJournal(overrides: Partial<SkinJournalDto> = {}): SkinJournalDto {
  return {
    id: "journal-1",
    localDate,
    timezone: "Asia/Ho_Chi_Minh",
    productsUsed: ["Gentle Low pH Cleanser", "Barrier Repair Moisturizer"],
    observations: ["Skin felt calmer after the evening routine."],
    symptoms: ["redness", "dryness"],
    stressLevel: "medium",
    notes: "Short private journal note.",
    createdAt: fixedDate.toISOString(),
    updatedAt: fixedDate.toISOString(),
    ...overrides,
  };
}

function createSavedProduct(
  overrides: Partial<SavedProduct> = {},
): SavedProduct {
  return {
    _id: new ObjectId("665000000000000000000600"),
    userId,
    productId: new ObjectId("665000000000000000000700"),
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function mockDashboardSources(input: {
  skinProfile?: SkinProfile | null;
  routines?: Routine[];
  routineLogs?: RoutineLogDto[];
  routineLogsLast7Days?: RoutineLogDto[];
  latestRoutineAnalysis?: RoutineAnalysis | null;
  latestJournals?: SkinJournalDto[];
  todayJournals?: SkinJournalDto[];
  journalsLast14Days?: SkinJournalDto[];
  savedProducts?: SavedProduct[];
  savedProductCount?: number;
}) {
  const savedProducts =
    input.savedProducts ??
    Array.from(
      {
        length: input.savedProductCount ?? (input.skinProfile ? 1 : 0),
      },
      (_, index) =>
        createSavedProduct({
          _id: new ObjectId(
            `6650000000000000000006${String(index).padStart(2, "0")}`,
          ),
          productId: new ObjectId(
            `6650000000000000000007${String(index).padStart(2, "0")}`,
          ),
        }),
    );

  mockedGetSkinProfileForUser.mockResolvedValue(input.skinProfile ?? null);
  mockedListRoutinesForUser.mockResolvedValue(input.routines ?? []);
  mockedGetRoutineLogsForDate.mockResolvedValue(input.routineLogs ?? []);
  mockedGetRoutineLogsForDateRange.mockResolvedValue(
    input.routineLogsLast7Days ?? [],
  );
  mockedFindLatestRoutineAnalysisByUserId.mockResolvedValue(
    input.latestRoutineAnalysis ?? null,
  );
  mockedListSkinJournalsForUser
    .mockResolvedValueOnce(input.latestJournals ?? [])
    .mockResolvedValueOnce(input.todayJournals ?? [])
    .mockResolvedValueOnce(input.journalsLast14Days ?? []);
  mockedListSavedProductsByUser.mockResolvedValue(savedProducts);
}

describe("Dashboard use case", () => {
  beforeEach(() => {
    mockedGetSkinProfileForUser.mockReset();
    mockedListRoutinesForUser.mockReset();
    mockedGetRoutineLogsForDate.mockReset();
    mockedGetRoutineLogsForDateRange.mockReset();
    mockedFindLatestRoutineAnalysisByUserId.mockReset();
    mockedListSkinJournalsForUser.mockReset();
    mockedListSavedProductsByUser.mockReset();
  });

  it("returns missing optional sections safely", async () => {
    mockDashboardSources({});

    await expect(getDashboardForUser(userId, { localDate })).resolves.toEqual({
      skinProfile: { exists: false },
      routines: {
        total: 0,
        morning: 0,
        evening: 0,
        hasAnyRoutine: false,
      },
      routineCoverage: expect.objectContaining({
        hasRoutines: false,
        totalRoutines: 0,
        hasMorningRoutine: false,
        hasEveningRoutine: false,
        hasMorningSunscreen: false,
        hasMoisturizer: false,
        coverageItems: expect.arrayContaining([
          expect.objectContaining({
            id: "routine-created",
            status: "missing",
          }),
        ]),
        cautionItems: [],
        nextAction: expect.objectContaining({
          actionType: "create-routine",
          href: routes.ROUTINES,
        }),
      }),
      todayRoutineLogs: {
        localDate,
        totalRoutines: 0,
        completed: 0,
        partial: 0,
        skipped: 0,
        notLogged: 0,
        completionRate: 0,
      },
      latestRoutineAnalysis: { exists: false },
      latestJournal: { exists: false },
      profileCompletion: {
        percentage: 0,
        completedFields: 0,
        totalFields: 5,
        missingFields: [
          "skinType",
          "concerns",
          "sensitivityLevel",
          "budgetRange",
          "experienceLevel",
        ],
      },
      savedProducts: { count: 0 },
      savedProductTags: {
        totalSavedProducts: 0,
        taggedProductCount: 0,
        untaggedProductCount: 0,
        topTags: [],
      },
      savedProductDecisionQueue: {
        totalSavedProducts: 0,
        consideringCount: 0,
        testingCount: 0,
        pausedCount: 0,
        keptCount: 0,
        unsetDecisionStatusCount: 0,
        withoutPlannedRoutineSlotCount: 0,
        withoutPersonalNoteCount: 0,
        reviewNeededCount: 0,
        nextAction: {
          label: "Xem lại sản phẩm đã lưu",
          description: "Lưu sản phẩm để bắt đầu xây dựng hàng chờ xem lại.",
          href: routes.SAVED_PRODUCTS,
        },
      },
      routineConsistency: {
        completedDays: 0,
        totalDays: 7,
        rate: 0,
        label: "needs_attention",
        windowDays: 7,
        maintainedDays: 0,
        currentStreak: 0,
        hasRecentLogs: false,
        level: "not_started",
        message: "Bạn chưa có dữ liệu routine trong 7 ngày gần đây.",
        nextAction: "Bắt đầu ghi nhận routine hôm nay.",
      },
      journalTrend: {
        recentEntries: 0,
        status: "not_enough_data",
        windowDays: 14,
        entriesWithSymptomsCount: 0,
        mostCommonSymptomCount: 0,
        hasEnoughData: false,
        message: "Cần thêm nhật ký để xem xu hướng rõ hơn.",
        nextAction: "Hãy ghi nhật ký da thêm vài lần trong tuần này.",
        disclaimer:
          "Thông tin này chỉ giúp theo dõi cá nhân và không thay thế tư vấn chuyên môn.",
      },
      nextActions: [
        {
          label: "Hoàn thiện hồ sơ da",
          href: "/onboarding/skin-profile",
          priority: "high",
        },
      ],
    });
  });

  it("summarizes no saved product personal tags when there are no saved products", async () => {
    mockDashboardSources({
      savedProductCount: 0,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.savedProductTags).toEqual({
      totalSavedProducts: 0,
      taggedProductCount: 0,
      untaggedProductCount: 0,
      topTags: [],
    });
  });

  it("summarizes saved products without personal tags", async () => {
    mockDashboardSources({
      savedProducts: [
        createSavedProduct({
          _id: new ObjectId("665000000000000000000610"),
          productId: new ObjectId("665000000000000000000710"),
        }),
        createSavedProduct({
          _id: new ObjectId("665000000000000000000611"),
          productId: new ObjectId("665000000000000000000711"),
        }),
      ],
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.savedProductTags).toEqual({
      totalSavedProducts: 2,
      taggedProductCount: 0,
      untaggedProductCount: 2,
      topTags: [],
    });
  });

  it("summarizes top personal tags across saved products", async () => {
    mockDashboardSources({
      savedProducts: [
        createSavedProduct({
          _id: new ObjectId("665000000000000000000620"),
          productId: new ObjectId("665000000000000000000720"),
          tags: ["dưỡng ẩm", "dùng sáng"],
        }),
        createSavedProduct({
          _id: new ObjectId("665000000000000000000621"),
          productId: new ObjectId("665000000000000000000721"),
          tags: ["dưỡng ẩm", "chống nắng"],
        }),
        createSavedProduct({
          _id: new ObjectId("665000000000000000000622"),
          productId: new ObjectId("665000000000000000000722"),
          tags: ["dùng tối"],
        }),
      ],
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.savedProductTags).toMatchObject({
      totalSavedProducts: 3,
      taggedProductCount: 3,
      untaggedProductCount: 0,
      topTags: [
        { label: "dưỡng ẩm", count: 2 },
        { label: "chống nắng", count: 1 },
        { label: "dùng sáng", count: 1 },
        { label: "dùng tối", count: 1 },
      ],
    });
  });

  it("counts duplicate tags once per saved product", async () => {
    mockDashboardSources({
      savedProducts: [
        createSavedProduct({
          tags: ["dưỡng ẩm", "dưỡng ẩm", " Dưỡng ẩm "],
        }),
      ],
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.savedProductTags).toEqual({
      totalSavedProducts: 1,
      taggedProductCount: 1,
      untaggedProductCount: 0,
      topTags: [{ label: "dưỡng ẩm", count: 1 }],
    });
  });

  it("adds dashboard routine coverage when a morning routine is missing sunscreen", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.routineCoverage.hasMorningRoutine).toBe(true);
    expect(dashboard.routineCoverage.hasMorningSunscreen).toBe(false);
    expect(
      dashboard.routineCoverage.cautionItems.some(
        (item) => item.id === "missing-morning-sunscreen",
      ),
    ).toBe(true);
    expect(dashboard.routineCoverage.nextAction.actionType).toBe(
      "review-morning-routine",
    );
    expect(dashboard.routineCoverage.nextAction.href).toBe(routes.ROUTINES);
  });

  it("marks moisturizer and morning sunscreen covered when routine steps include both", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [
        createRoutine({
          steps: [
            {
              stepId: "step-cleanser",
              customProductName: "Cleanser",
              category: "cleanser",
              order: 1,
              frequency: "daily",
            },
            {
              stepId: "step-moisturizer",
              customProductName: "Moisturizer",
              category: "moisturizer",
              order: 2,
              frequency: "daily",
            },
            {
              stepId: "step-sunscreen",
              customProductName: "Sunscreen",
              category: "sunscreen",
              order: 3,
              frequency: "daily",
            },
          ],
        }),
      ],
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.routineCoverage.hasMorningSunscreen).toBe(true);
    expect(dashboard.routineCoverage.hasMoisturizer).toBe(true);
    expect(dashboard.routineCoverage.nextAction.href).toBe(routes.ROUTINES);
  });

  it("surfaces dashboard routine coverage caution for multiple active steps", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [
        createRoutine({
          steps: [
            {
              stepId: "step-cleanser",
              customProductName: "Cleanser",
              category: "cleanser",
              order: 1,
              frequency: "daily",
            },
            {
              stepId: "step-active-1",
              customProductName: "Active 1",
              category: "treatment",
              order: 2,
              frequency: "daily",
            },
            {
              stepId: "step-active-2",
              customProductName: "Active 2",
              category: "treatment",
              order: 3,
              frequency: "weekly_1_2",
            },
            {
              stepId: "step-moisturizer",
              customProductName: "Moisturizer",
              category: "moisturizer",
              order: 4,
              frequency: "daily",
            },
            {
              stepId: "step-sunscreen",
              customProductName: "Sunscreen",
              category: "sunscreen",
              order: 5,
              frequency: "daily",
            },
          ],
        }),
      ],
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(
      dashboard.routineCoverage.cautionItems.some(
        (item) => item.id === "multiple-treatments",
      ),
    ).toBe(true);
    expect(dashboard.routineCoverage.nextAction.actionType).toBe(
      "review-treatment-pacing",
    );
    expect(dashboard.routineCoverage.nextAction.label).toContain("active");
  });

  it("builds a dashboard summary from current user data", async () => {
    const routines = [
      createRoutine(),
      createRoutine({
        _id: new ObjectId(eveningRoutineId),
        name: "Evening Routine",
        timeOfDay: "evening",
      }),
      createRoutine({
        _id: new ObjectId("665000000000000000000503"),
        name: "Second Evening Routine",
        timeOfDay: "evening",
      }),
    ];
    const longNotes = `  ${"Hydration felt better after moisturizer. ".repeat(5)}  `;
    const latestJournal = createJournal({ notes: longNotes });

    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines,
      routineLogs: [
        createRoutineLog({ routineId: morningRoutineId, status: "completed" }),
        createRoutineLog({
          id: "log-2",
          routineId: eveningRoutineId,
          status: "partial",
          completedStepIds: ["step-1"],
        }),
        createRoutineLog({
          id: "log-stale",
          routineId: staleRoutineId,
          status: "skipped",
        }),
      ],
      routineLogsLast7Days: [
        createRoutineLog({ localDate: "2026-05-11", status: "completed" }),
        createRoutineLog({ localDate: "2026-05-12", status: "partial" }),
        createRoutineLog({ localDate: "2026-05-13", status: "skipped" }),
        createRoutineLog({ localDate: "2026-05-17", status: "completed" }),
      ],
      latestRoutineAnalysis: createAnalysis(),
      latestJournals: [latestJournal],
      todayJournals: [latestJournal],
      journalsLast14Days: [
        latestJournal,
        createJournal({ id: "journal-2", localDate: "2026-05-15", symptoms: ["redness"] }),
        createJournal({ id: "journal-3", localDate: "2026-05-12", symptoms: ["dryness"] }),
      ],
      savedProductCount: 4,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.skinProfile).toEqual({
      exists: true,
      skinType: "oily",
      concerns: ["acne", "redness"],
      sensitivityLevel: "medium",
      updatedAt: fixedDate.toISOString(),
    });
    expect(dashboard.routines).toEqual({
      total: 3,
      morning: 1,
      evening: 2,
      hasAnyRoutine: true,
    });
    expect(dashboard.routines).not.toHaveProperty("both");
    expect(dashboard.routineCoverage).toMatchObject({
      hasRoutines: true,
      totalRoutines: 3,
      hasMorningRoutine: true,
      hasEveningRoutine: true,
      hasMorningSunscreen: false,
      hasMoisturizer: false,
      nextAction: {
        actionType: "review-morning-routine",
        href: routes.ROUTINES,
      },
    });
    expect(dashboard.todayRoutineLogs).toEqual({
      localDate,
      totalRoutines: 3,
      completed: 1,
      partial: 1,
      skipped: 0,
      notLogged: 1,
      completionRate: 50,
    });
    expect(dashboard.profileCompletion).toEqual({
      percentage: 100,
      completedFields: 5,
      totalFields: 5,
      missingFields: [],
    });
    expect(dashboard.savedProducts).toEqual({ count: 4 });
    expect(dashboard.savedProductTags).toEqual({
      totalSavedProducts: 4,
      taggedProductCount: 0,
      untaggedProductCount: 4,
      topTags: [],
    });
    expect(dashboard.savedProductDecisionQueue).toEqual({
      totalSavedProducts: 4,
      consideringCount: 0,
      testingCount: 0,
      pausedCount: 0,
      keptCount: 0,
      unsetDecisionStatusCount: 4,
      withoutPlannedRoutineSlotCount: 4,
      withoutPersonalNoteCount: 4,
      reviewNeededCount: 4,
      nextAction: {
        label: "Xem lại sản phẩm đã lưu",
        description:
          "Xem các sản phẩm còn thiếu trạng thái, kế hoạch routine hoặc ghi chú cá nhân.",
        href: routes.SAVED_PRODUCTS,
      },
    });
    expect(dashboard.routineConsistency).toEqual({
      completedDays: 3,
      totalDays: 7,
      rate: 43,
      label: "building",
      windowDays: 7,
      maintainedDays: 3,
      currentStreak: 1,
      hasRecentLogs: true,
      level: "building",
      message:
        "Bạn đã duy trì routine trong 3/7 ngày gần đây. Hãy tiếp tục ghi nhận đều hơn để xây dựng thói quen.",
      nextAction:
        "Cố gắng hoàn thành routine thêm vài ngày nữa trong tuần này.",
    });
    expect(dashboard.journalTrend).toEqual({
      recentEntries: 3,
      mostCommonSymptom: "redness",
      status: "available",
      windowDays: 14,
      entriesWithSymptomsCount: 3,
      mostCommonSymptomCount: 2,
      hasEnoughData: true,
      message: "Dữ liệu gần đây cho thấy bạn thường ghi nhận: Đỏ da.",
      nextAction: "Tiếp tục ghi nhận để theo dõi thay đổi theo thời gian.",
      disclaimer:
        "Thông tin này chỉ giúp theo dõi cá nhân và không thay thế tư vấn chuyên môn.",
    });
    expect(dashboard.latestRoutineAnalysis).toEqual({
      exists: true,
      routineId: morningRoutineId,
      routineName: "Morning Routine",
      riskLevel: "low",
      warningCount: 2,
      createdAt: fixedDate.toISOString(),
    });
    expect(dashboard.latestJournal).toMatchObject({
      exists: true,
      id: "journal-1",
      localDate,
      observations: ["Skin felt calmer after the evening routine."],
      symptoms: ["redness", "dryness"],
      stressLevel: "medium",
      productsUsedCount: 2,
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
    });
    expect(dashboard.latestJournal.exists).toBe(true);
    if (!dashboard.latestJournal.exists) {
      throw new Error("Expected dashboard latest journal to exist.");
    }
    expect(dashboard.latestJournal.notesPreview).toContain(
      "Hydration felt better after moisturizer.",
    );
    expect(dashboard.latestJournal.notesPreview).toMatch(/\.\.\.$/);
    expect(dashboard.latestJournal.notesPreview).not.toBe(longNotes);
    expect(JSON.stringify(dashboard)).not.toContain("userId");
    expect(JSON.stringify(dashboard)).not.toContain("_id");
    expect(JSON.stringify(dashboard)).not.toContain("ObjectId");
  });


  it("keeps journal trend low-data when recent journals have no symptoms", async () => {
    const firstJournal = createJournal({
      id: "journal-no-symptom-1",
      localDate: "2026-05-17",
      symptoms: [],
    });
    const secondJournal = createJournal({
      id: "journal-no-symptom-2",
      localDate: "2026-05-16",
      symptoms: [],
    });

    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      routineLogs: [createRoutineLog()],
      latestJournals: [firstJournal],
      todayJournals: [firstJournal],
      journalsLast14Days: [firstJournal, secondJournal],
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.journalTrend).toMatchObject({
      recentEntries: 2,
      status: "not_enough_data",
      entriesWithSymptomsCount: 0,
      mostCommonSymptomCount: 0,
      hasEnoughData: false,
      message:
        "Bạn đã ghi nhật ký gần đây, nhưng chưa có đủ triệu chứng được ghi nhận để tóm tắt xu hướng.",
      nextAction:
        "Khi ghi nhật ký, bạn có thể chọn triệu chứng nếu có để theo dõi rõ hơn.",
    });
    expect(dashboard.journalTrend).not.toHaveProperty("mostCommonSymptom");
  });

  it("marks strong routine consistency and current streak from maintained days", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      routineLogs: [createRoutineLog()],
      routineLogsLast7Days: [
        createRoutineLog({ localDate: "2026-05-12", status: "completed" }),
        createRoutineLog({ localDate: "2026-05-13", status: "partial" }),
        createRoutineLog({ localDate: "2026-05-14", status: "completed" }),
        createRoutineLog({ localDate: "2026-05-15", status: "completed" }),
        createRoutineLog({ localDate: "2026-05-16", status: "partial" }),
        createRoutineLog({ localDate: "2026-05-17", status: "completed" }),
      ],
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.routineConsistency).toMatchObject({
      completedDays: 6,
      maintainedDays: 6,
      rate: 86,
      label: "excellent",
      currentStreak: 6,
      hasRecentLogs: true,
      level: "consistent",
      message: "Bạn đang duy trì routine khá đều trong 7 ngày gần đây.",
      nextAction: "Tiếp tục duy trì và ghi chú thay đổi của da.",
    });
  });

  it("returns latestJournal exists false when no journal exists", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      routineLogs: [createRoutineLog()],
      latestRoutineAnalysis: createAnalysis(),
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.latestJournal).toEqual({ exists: false });
  });

  it("does not crash when journal optional fields are empty", async () => {
    const journal = createJournal({
      observations: [],
      symptoms: [],
      productsUsed: [],
      notes: undefined,
      stressLevel: undefined,
    });

    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      routineLogs: [createRoutineLog()],
      latestRoutineAnalysis: createAnalysis(),
      latestJournals: [journal],
      todayJournals: [journal],
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.latestJournal).toEqual({
      exists: true,
      id: "journal-1",
      localDate,
      observations: [],
      symptoms: [],
      productsUsedCount: 0,
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
    });
  });

  it("recommends creating a routine when profile exists but no routines exist", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Tạo routine đầu tiên",
        href: "/routines",
        priority: "high",
      },
    ]);
  });

  it("recommends logging today's routine when routines exist but today is not logged", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Ghi nhận routine hôm nay",
        href: "/routine-logs/today",
        priority: "medium",
      },
    ]);
  });

  it("recommends adding today's journal after routine logging is handled", async () => {
    const oldJournal = createJournal({
      id: "journal-old",
      localDate: "2026-05-16",
    });

    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      routineLogs: [createRoutineLog()],
      latestJournals: [oldJournal],
      todayJournals: [],
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.latestJournal).toMatchObject({
      exists: true,
      id: "journal-old",
      localDate: "2026-05-16",
    });
    expect(dashboard.nextActions).toEqual([
      {
        label: "Thêm nhật ký da hôm nay",
        href: "/journal",
        priority: "medium",
      },
    ]);
  });

  it("recommends routine safety insight when journal exists today but no analysis exists", async () => {
    const todayJournal = createJournal();

    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      routineLogs: [createRoutineLog()],
      latestJournals: [todayJournal],
      todayJournals: [todayJournal],
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Xem phân tích an toàn routine",
        href: "/routines",
        priority: "medium",
      },
    ]);
  });

  it("shows an up-to-date state when required tracking is complete", async () => {
    const todayJournal = createJournal();

    mockDashboardSources({
      skinProfile: createSkinProfile(),
      routines: [createRoutine()],
      routineLogs: [createRoutineLog()],
      latestRoutineAnalysis: createAnalysis(),
      latestJournals: [todayJournal],
      todayJournals: [todayJournal],
      savedProductCount: 1,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Xem insights cá nhân",
        href: "/insights",
        priority: "low",
      },
    ]);
  });

  it("recommends Product Match when profile exists but no products are saved", async () => {
    mockDashboardSources({
      skinProfile: createSkinProfile(),
      savedProductCount: 0,
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Tìm sản phẩm phù hợp với hồ sơ da",
        href: "/product-match",
        priority: "medium",
      },
    ]);
  });

  it("passes userId and localDate to user-scoped data loaders", async () => {
    mockDashboardSources({});

    await getDashboardForUser(userId, { localDate });

    expect(mockedGetSkinProfileForUser).toHaveBeenCalledWith(userId);
    expect(mockedListRoutinesForUser).toHaveBeenCalledWith(userId);
    expect(mockedGetRoutineLogsForDate).toHaveBeenCalledWith(userId, localDate);
    expect(mockedGetRoutineLogsForDateRange).toHaveBeenCalledWith(
      userId,
      sevenDayFromLocalDate,
      localDate,
    );
    expect(mockedFindLatestRoutineAnalysisByUserId).toHaveBeenCalledWith(userId);
    expect(mockedListSkinJournalsForUser).toHaveBeenCalledWith(userId, {
      limit: 1,
    });
    expect(mockedListSkinJournalsForUser).toHaveBeenCalledWith(userId, {
      from: localDate,
      to: localDate,
      limit: 1,
    });
    expect(mockedListSkinJournalsForUser).toHaveBeenCalledWith(userId, {
      from: fourteenDayFromLocalDate,
      to: localDate,
      limit: 14,
    });
    expect(mockedListSavedProductsByUser).toHaveBeenCalledWith(userId);
  });
});
