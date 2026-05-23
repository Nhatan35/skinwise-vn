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
}));

vi.mock("@/modules/ai-analysis/routine-analysis.repository", () => ({
  findLatestRoutineAnalysisByUserId: vi.fn(),
}));

vi.mock("@/modules/journals/list-skin-journal.use-case", () => ({
  listSkinJournalsForUser: vi.fn(),
}));

import { findLatestRoutineAnalysisByUserId } from "@/modules/ai-analysis/routine-analysis.repository";
import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";
import { getDashboardForUser } from "@/modules/dashboard/dashboard.use-case";
import { listSkinJournalsForUser } from "@/modules/journals/list-skin-journal.use-case";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import { getRoutineLogsForDate } from "@/modules/routine-logs/routine-log.use-case";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";
import type { Routine } from "@/modules/routines/routine.types";
import { getSkinProfileForUser } from "@/modules/skin-profile/skin-profile.use-case";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

const mockedGetSkinProfileForUser = vi.mocked(getSkinProfileForUser);
const mockedListRoutinesForUser = vi.mocked(listRoutinesForUser);
const mockedGetRoutineLogsForDate = vi.mocked(getRoutineLogsForDate);
const mockedFindLatestRoutineAnalysisByUserId = vi.mocked(
  findLatestRoutineAnalysisByUserId,
);
const mockedListSkinJournalsForUser = vi.mocked(listSkinJournalsForUser);

const userId = "auth-user-id";
const localDate = "2026-05-17";
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

function mockDashboardSources(input: {
  skinProfile?: SkinProfile | null;
  routines?: Routine[];
  routineLogs?: RoutineLogDto[];
  latestRoutineAnalysis?: RoutineAnalysis | null;
  latestJournals?: SkinJournalDto[];
  todayJournals?: SkinJournalDto[];
}) {
  mockedGetSkinProfileForUser.mockResolvedValue(input.skinProfile ?? null);
  mockedListRoutinesForUser.mockResolvedValue(input.routines ?? []);
  mockedGetRoutineLogsForDate.mockResolvedValue(input.routineLogs ?? []);
  mockedFindLatestRoutineAnalysisByUserId.mockResolvedValue(
    input.latestRoutineAnalysis ?? null,
  );
  mockedListSkinJournalsForUser
    .mockResolvedValueOnce(input.latestJournals ?? [])
    .mockResolvedValueOnce(input.todayJournals ?? []);
}

describe("Dashboard use case", () => {
  beforeEach(() => {
    mockedGetSkinProfileForUser.mockReset();
    mockedListRoutinesForUser.mockReset();
    mockedGetRoutineLogsForDate.mockReset();
    mockedFindLatestRoutineAnalysisByUserId.mockReset();
    mockedListSkinJournalsForUser.mockReset();
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
      nextActions: [
        {
          label: "Hoàn thiện hồ sơ da",
          href: "/skin-profile",
          priority: "high",
        },
      ],
    });
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
      latestRoutineAnalysis: createAnalysis(),
      latestJournals: [latestJournal],
      todayJournals: [latestJournal],
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
    expect(dashboard.todayRoutineLogs).toEqual({
      localDate,
      totalRoutines: 3,
      completed: 1,
      partial: 1,
      skipped: 0,
      notLogged: 1,
      completionRate: 50,
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
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Ghi nhận routine hôm nay",
        href: "/routines",
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
    });

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Hôm nay bạn đã cập nhật đủ theo dõi skincare",
        href: "/dashboard",
        priority: "low",
      },
    ]);
  });

  it("passes userId and localDate to user-scoped data loaders", async () => {
    mockDashboardSources({});

    await getDashboardForUser(userId, { localDate });

    expect(mockedGetSkinProfileForUser).toHaveBeenCalledWith(userId);
    expect(mockedListRoutinesForUser).toHaveBeenCalledWith(userId);
    expect(mockedGetRoutineLogsForDate).toHaveBeenCalledWith(userId, localDate);
    expect(mockedFindLatestRoutineAnalysisByUserId).toHaveBeenCalledWith(userId);
    expect(mockedListSkinJournalsForUser).toHaveBeenCalledWith(userId, {
      limit: 1,
    });
    expect(mockedListSkinJournalsForUser).toHaveBeenCalledWith(userId, {
      from: localDate,
      to: localDate,
      limit: 1,
    });
  });
});
