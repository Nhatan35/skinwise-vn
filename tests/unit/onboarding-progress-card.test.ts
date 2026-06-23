import { describe, expect, it } from "vitest";

import {
  buildOnboardingSteps,
  getNextIncompleteOnboardingStep,
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
    routineCoverage: {
      hasRoutines: false,
      totalRoutines: 0,
      hasMorningRoutine: false,
      hasEveningRoutine: false,
      hasMorningSunscreen: false,
      hasMoisturizer: false,
      summary: "Chưa có routine để xem lại ở mức tổng quan.",
      coverageItems: [],
      cautionItems: [],
      nextAction: {
        label: "Tạo routine đầu tiên",
        description: "Bắt đầu với một routine đơn giản.",
        actionType: "create-routine",
        href: routes.ROUTINES,
      },
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

function withCompletedSkinProfile(): Partial<DashboardDto> {
  return {
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
  };
}

function withSavedProduct(): Partial<DashboardDto> {
  return {
    savedProducts: {
      count: 1,
    },
  };
}

function withRoutine(
  overrides: Partial<DashboardDto["routines"]> = {},
): Partial<DashboardDto> {
  return {
    routines: {
      total: 1,
      morning: 1,
      evening: 0,
      hasAnyRoutine: true,
      ...overrides,
    },
  };
}

function withTodayRoutineLog(
  overrides: Partial<DashboardDto["todayRoutineLogs"]> = {},
): Partial<DashboardDto> {
  return {
    todayRoutineLogs: {
      localDate: "2026-05-31",
      totalRoutines: 1,
      completed: 1,
      partial: 0,
      skipped: 0,
      notLogged: 0,
      completionRate: 100,
      ...overrides,
    },
  };
}

function withLatestJournal(): Partial<DashboardDto> {
  return {
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
  };
}

describe("buildOnboardingSteps", () => {
  it("keeps the first-session journey at exactly five guided steps", () => {
    const steps = buildOnboardingSteps(createDashboard());

    expect(steps).toHaveLength(5);
    expect(steps.map((step) => step.id)).toEqual([
      "skin-profile",
      "saved-product",
      "first-routine",
      "today-log",
      "first-journal",
    ]);
  });

  it("returns complete step data for every onboarding step", () => {
    const steps = buildOnboardingSteps(createDashboard());

    for (const step of steps) {
      expect(step.id).toBeTypeOf("string");
      expect(step.label).toBeTypeOf("string");
      expect(step.description).toBeTypeOf("string");
      expect(step.outcome).toBeTypeOf("string");
      expect(step.ctaLabel).toBeTypeOf("string");
      expect(step.href).toBeTypeOf("string");
      expect(step.completed).toBeTypeOf("boolean");
      expect(step.label.trim().length).toBeGreaterThan(0);
      expect(step.description.trim().length).toBeGreaterThan(0);
      expect(step.outcome.trim().length).toBeGreaterThan(0);
      expect(step.ctaLabel.trim().length).toBeGreaterThan(0);
      expect(step.href.trim().length).toBeGreaterThan(0);
    }
  });

  it("uses the guided onboarding profile route for the first incomplete step", () => {
    const steps = buildOnboardingSteps(createDashboard());

    expect(getNextIncompleteOnboardingStep(steps)).toMatchObject({
      id: "skin-profile",
      label: "Cập nhật hồ sơ da",
      ctaLabel: "Cập nhật hồ sơ da",
      href: routes.ONBOARDING_SKIN_PROFILE,
      completed: false,
    });
  });

  it("returns saving a suitable product after skin profile is completed", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        ...withCompletedSkinProfile(),
      }),
    );

    expect(countCompletedSteps(steps)).toBe(1);
    expect(getNextIncompleteOnboardingStep(steps)).toMatchObject({
      id: "saved-product",
      label: "Lưu sản phẩm phù hợp",
      ctaLabel: "Xem sản phẩm phù hợp",
      href: routes.PRODUCT_MATCH,
    });
  });

  it("returns creating the first routine after skin profile and saved product are completed", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        ...withCompletedSkinProfile(),
        ...withSavedProduct(),
      }),
    );

    expect(countCompletedSteps(steps)).toBe(2);
    expect(getNextIncompleteOnboardingStep(steps)).toMatchObject({
      id: "first-routine",
      label: "Tạo routine đầu tiên",
      ctaLabel: "Tạo routine đầu tiên",
      href: routes.ROUTINES,
    });
  });

  it("returns logging today's routine after a routine is created", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        ...withCompletedSkinProfile(),
        ...withSavedProduct(),
        ...withRoutine(),
      }),
    );

    expect(countCompletedSteps(steps)).toBe(3);
    expect(getNextIncompleteOnboardingStep(steps)).toMatchObject({
      id: "today-log",
      label: "Ghi nhận routine hôm nay",
      ctaLabel: "Ghi nhận routine hôm nay",
      href: routes.TODAY_LOG,
    });
  });

  it.each([
    { completed: 1, partial: 0, skipped: 0 },
    { completed: 0, partial: 1, skipped: 0 },
    { completed: 0, partial: 0, skipped: 1 },
  ])(
    "returns writing the first journal after any routine log count is present",
    ({ completed, partial, skipped }) => {
      const steps = buildOnboardingSteps(
        createDashboard({
          ...withCompletedSkinProfile(),
          ...withSavedProduct(),
          ...withRoutine(),
          ...withTodayRoutineLog({
            completed,
            partial,
            skipped,
          }),
        }),
      );

      expect(countCompletedSteps(steps)).toBe(4);
      expect(getNextIncompleteOnboardingStep(steps)).toMatchObject({
        id: "first-journal",
        label: "Viết nhật ký da đầu tiên",
        ctaLabel: "Viết nhật ký da",
        href: routes.JOURNAL,
      });
    },
  );

  it("returns no next incomplete step when onboarding is complete", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        ...withCompletedSkinProfile(),
        ...withSavedProduct(),
        ...withRoutine(),
        ...withTodayRoutineLog(),
        ...withLatestJournal(),
      }),
    );

    expect(countCompletedSteps(steps)).toBe(5);
    expect(getNextIncompleteOnboardingStep(steps)).toBeUndefined();
  });

  it("marks routine complete when total routines is greater than zero", () => {
    const steps = buildOnboardingSteps(
      createDashboard({
        ...withCompletedSkinProfile(),
        ...withSavedProduct(),
        ...withRoutine({
          morning: 0,
          evening: 1,
          hasAnyRoutine: false,
        }),
      }),
    );

    expect(countCompletedSteps(steps)).toBe(3);
    expect(getNextIncompleteOnboardingStep(steps)?.id).toBe("today-log");
  });
});
