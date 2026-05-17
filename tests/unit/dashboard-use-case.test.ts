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

import { findLatestRoutineAnalysisByUserId } from "@/modules/ai-analysis/routine-analysis.repository";
import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";
import { getDashboardForUser } from "@/modules/dashboard/dashboard.use-case";
import { getRoutineLogsForDate } from "@/modules/routine-logs/routine-log.use-case";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
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

describe("Dashboard use case", () => {
  beforeEach(() => {
    mockedGetSkinProfileForUser.mockReset();
    mockedListRoutinesForUser.mockReset();
    mockedGetRoutineLogsForDate.mockReset();
    mockedFindLatestRoutineAnalysisByUserId.mockReset();
  });

  it("returns missing optional sections safely", async () => {
    mockedGetSkinProfileForUser.mockResolvedValue(null);
    mockedListRoutinesForUser.mockResolvedValue([]);
    mockedGetRoutineLogsForDate.mockResolvedValue([]);
    mockedFindLatestRoutineAnalysisByUserId.mockResolvedValue(null);

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
      nextActions: [
        {
          label: "Hoàn thiện hồ sơ da",
          href: "/skin-profile",
          priority: "high",
        },
        {
          label: "Tạo routine đầu tiên",
          href: "/routines",
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

    mockedGetSkinProfileForUser.mockResolvedValue(createSkinProfile());
    mockedListRoutinesForUser.mockResolvedValue(routines);
    mockedGetRoutineLogsForDate.mockResolvedValue([
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
    ]);
    mockedFindLatestRoutineAnalysisByUserId.mockResolvedValue(createAnalysis());

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
    expect(JSON.stringify(dashboard)).not.toContain("userId");
    expect(JSON.stringify(dashboard)).not.toContain("_id");
  });

  it("recommends logging progress and analyzing routine when needed", async () => {
    mockedGetSkinProfileForUser.mockResolvedValue(createSkinProfile());
    mockedListRoutinesForUser.mockResolvedValue([createRoutine()]);
    mockedGetRoutineLogsForDate.mockResolvedValue([]);
    mockedFindLatestRoutineAnalysisByUserId.mockResolvedValue(null);

    const dashboard = await getDashboardForUser(userId, { localDate });

    expect(dashboard.nextActions).toEqual([
      {
        label: "Ghi nhận routine hôm nay",
        href: "/routines",
        priority: "medium",
      },
      {
        label: "Phân tích an toàn routine",
        href: "/routines",
        priority: "medium",
      },
    ]);
  });

  it("passes userId and localDate to user-scoped data loaders", async () => {
    mockedGetSkinProfileForUser.mockResolvedValue(null);
    mockedListRoutinesForUser.mockResolvedValue([]);
    mockedGetRoutineLogsForDate.mockResolvedValue([]);
    mockedFindLatestRoutineAnalysisByUserId.mockResolvedValue(null);

    await getDashboardForUser(userId, { localDate });

    expect(mockedGetSkinProfileForUser).toHaveBeenCalledWith(userId);
    expect(mockedListRoutinesForUser).toHaveBeenCalledWith(userId);
    expect(mockedGetRoutineLogsForDate).toHaveBeenCalledWith(userId, localDate);
    expect(mockedFindLatestRoutineAnalysisByUserId).toHaveBeenCalledWith(userId);
  });
});
