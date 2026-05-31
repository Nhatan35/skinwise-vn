import { describe, expect, it } from "vitest";

import {
  buildOnboardingSteps,
  type OnboardingStep,
} from "@/modules/dashboard/components/onboarding-progress-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { routes } from "@/shared/constants/routes";

function createDashboard(overrides: Partial<DashboardDto> = {}): DashboardDto {
  const baseDashboard: DashboardDto = {
    skinProfile: {
      exists: false,
    },
    routines: {
      total: 0,
      morning: 0,
      evening: 0,
      hasAnyRoutine: false,
    },
    todayRoutineLogs: {
      localDate: "2026-05-31",
      totalRoutines: 0,
      completed: 0,
      partial: 0,
      skipped: 0,
      notLogged: 0,
      completionRate: 0,
    },
    latestRoutineAnalysis: {
      exists: false,
    },
    latestJournal: {
      exists: false,
    },
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
    savedProducts: {
      count: 0,
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
      message: "Chưa có dữ liệu routine.",
      nextAction: "Tạo routine đầu tiên.",
    },
    journalTrend: {
      recentEntries: 0,
      status: "not_enough_data",
      windowDays: 14,
      entriesWithSymptomsCount: 0,
      mostCommonSymptomCount: 0,
      hasEnoughData: false,
      message: "Chưa có đủ dữ liệu nhật ký.",
      nextAction: "Viết nhật ký da đầu tiên.",
      disclaimer: "Thông tin chỉ mang tính tham khảo.",
    },
    nextActions: [],
  };

  return {
    ...baseDashboard,
    ...overrides,
  };
}

function countCompletedSteps(steps: OnboardingStep[]) {
  return steps.filter((step) => step.completed).length;
}

function getNextIncompleteStep(steps: OnboardingStep[]) {
  return steps.find((step) => !step.completed);
}

describe("buildOnboardingSteps", () => {
  it("returns zero completed steps when the user has not completed setup", () => {
    const steps = buildOnboardingSteps(createDashboard());

    expect(steps).toHaveLength(5);
    expect(countCompletedSteps(steps)).toBe(0);
    expect(getNextIncompleteStep(steps)).toMatchObject({
      label: "Hoàn thiện hồ sơ da",
      href: routes.SKIN_PROFILE,
    });
  });

  it("marks skin profile complete only when profile completion is 100 percent", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        skinProfile: {
          exists: true,
          skinType: "oily",
          concerns: ["acne"],
          sensitivityLevel: "medium",
          updatedAt: "2026-05-31T00:00:00.000Z",
        },
        profileCompletion: {
          percentage: 100,
          completedFields: 5,
          totalFields: 5,
          missingFields: [],
        },
      }),
    );

    expect(countCompletedSteps(steps)).toBe(1);
  });

  it("marks saved product complete after the user saves a product", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        profileCompletion: {
          percentage: 100,
          completedFields: 5,
          totalFields: 5,
          missingFields: [],
        },
        savedProducts: {
          count: 1,
        },
      }),
    );

    expect(countCompletedSteps(steps)).toBe(2);
  });

  it("marks routine complete when hasAnyRoutine is true", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        profileCompletion: {
          percentage: 100,
          completedFields: 5,
          totalFields: 5,
          missingFields: [],
        },
        savedProducts: {
          count: 1,
        },
        routines: {
          total: 1,
          morning: 1,
          evening: 0,
          hasAnyRoutine: true,
        },
      }),
    );

    expect(countCompletedSteps(steps)).toBe(3);
  });

  it("marks routine complete when total routines is greater than zero", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        profileCompletion: {
          percentage: 100,
          completedFields: 5,
          totalFields: 5,
          missingFields: [],
        },
        savedProducts: {
          count: 1,
        },
        routines: {
          total: 1,
          morning: 0,
          evening: 1,
          hasAnyRoutine: false,
        },
      }),
    );

    expect(countCompletedSteps(steps)).toBe(3);
  });

  it.each([
    { completed: 1, partial: 0, skipped: 0 },
    { completed: 0, partial: 1, skipped: 0 },
    { completed: 0, partial: 0, skipped: 1 },
  ])(
    "marks today's routine log complete when any log count is present",
    ({ completed, partial, skipped }) => {
      const steps = buildOnboardingSteps(
        createDashboard({
          profileCompletion: {
            percentage: 100,
            completedFields: 5,
            totalFields: 5,
            missingFields: [],
          },
          savedProducts: {
            count: 1,
          },
          routines: {
            total: 1,
            morning: 1,
            evening: 0,
            hasAnyRoutine: true,
          },
          todayRoutineLogs: {
            localDate: "2026-05-31",
            totalRoutines: 1,
            completed,
            partial,
            skipped,
            notLogged: 0,
            completionRate: 100,
          },
        }),
      );

      expect(countCompletedSteps(steps)).toBe(4);
    },
  );

  it("marks onboarding complete when the user has a latest journal entry", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        profileCompletion: {
          percentage: 100,
          completedFields: 5,
          totalFields: 5,
          missingFields: [],
        },
        savedProducts: {
          count: 1,
        },
        routines: {
          total: 1,
          morning: 1,
          evening: 0,
          hasAnyRoutine: true,
        },
        todayRoutineLogs: {
          localDate: "2026-05-31",
          totalRoutines: 1,
          completed: 1,
          partial: 0,
          skipped: 0,
          notLogged: 0,
          completionRate: 100,
        },
        latestJournal: {
          exists: true,
          id: "journal-1",
          localDate: "2026-05-31",
          observations: ["Da ổn định hơn."],
          symptoms: ["oiliness"],
          productsUsedCount: 1,
          createdAt: "2026-05-31T00:00:00.000Z",
          updatedAt: "2026-05-31T00:00:00.000Z",
        },
      }),
    );

    expect(countCompletedSteps(steps)).toBe(5);
    expect(getNextIncompleteStep(steps)).toBeUndefined();
  });
});
