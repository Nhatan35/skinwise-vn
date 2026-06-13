import { describe, expect, it } from "vitest";

import { buildRoutineCoverageReview } from "@/modules/routines/routine-coverage-review";
import type { RoutineDto, RoutineStepDto } from "@/modules/routines/routine.dto";
import type {
  RoutineStepCategory,
  RoutineTimeOfDay,
} from "@/modules/routines/routine.types";

function createStep(
  category: RoutineStepCategory,
  overrides: Partial<RoutineStepDto> = {},
): RoutineStepDto {
  return {
    stepId: `${category}-step`,
    category,
    customProductName: `${category} product`,
    frequency: "daily",
    order: 1,
    ...overrides,
  };
}

function createRoutine({
  id,
  name,
  steps,
  timeOfDay,
}: {
  id: string;
  name: string;
  steps: RoutineStepDto[];
  timeOfDay: RoutineTimeOfDay;
}): RoutineDto {
  return {
    id,
    name,
    timeOfDay,
    steps,
    createdAt: "2026-06-13T00:00:00.000Z",
    updatedAt: "2026-06-13T00:00:00.000Z",
  };
}

describe("buildRoutineCoverageReview", () => {
  it("returns an empty habit-support review when there are no routines", () => {
    const review = buildRoutineCoverageReview([]);

    expect(review.hasRoutines).toBe(false);
    expect(review.totalRoutines).toBe(0);
    expect(review.hasMorningRoutine).toBe(false);
    expect(review.hasEveningRoutine).toBe(false);
    expect(review.hasMorningSunscreen).toBe(false);
    expect(review.hasMoisturizer).toBe(false);
    expect(review.cautionItems).toEqual([]);
    expect(review.nextAction.actionType).toBe("create-routine");
    expect(review.nextAction.label).toBe("Tạo routine đầu tiên");
  });

  it("does not add a sunscreen caution when there is no morning routine", () => {
    const review = buildRoutineCoverageReview([
      createRoutine({
        id: "evening-routine",
        name: "Evening routine",
        timeOfDay: "evening",
        steps: [createStep("moisturizer")],
      }),
    ]);

    expect(review.hasMorningRoutine).toBe(false);
    expect(review.cautionItems.map((item) => item.id)).not.toContain(
      "missing-morning-sunscreen",
    );
  });

  it("marks morning sunscreen as covered when a morning routine has sunscreen", () => {
    const review = buildRoutineCoverageReview([
      createRoutine({
        id: "morning-routine",
        name: "Morning routine",
        timeOfDay: "morning",
        steps: [createStep("cleanser"), createStep("sunscreen")],
      }),
    ]);

    expect(review.hasMorningRoutine).toBe(true);
    expect(review.hasMorningSunscreen).toBe(true);
    expect(review.cautionItems.map((item) => item.id)).not.toContain(
      "missing-morning-sunscreen",
    );
  });

  it("adds a gentle missing sunscreen caution for morning routines without sunscreen", () => {
    const review = buildRoutineCoverageReview([
      createRoutine({
        id: "morning-routine",
        name: "Morning routine",
        timeOfDay: "morning",
        steps: [createStep("cleanser"), createStep("moisturizer")],
      }),
    ]);

    expect(review.hasMorningRoutine).toBe(true);
    expect(review.hasMorningSunscreen).toBe(false);
    expect(review.cautionItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "missing-morning-sunscreen",
          severity: "info",
        }),
      ]),
    );
    expect(review.nextAction.actionType).toBe("review-morning-routine");
  });

  it("adds a moisturizer note when no routine step is moisturizer", () => {
    const review = buildRoutineCoverageReview([
      createRoutine({
        id: "morning-routine",
        name: "Morning routine",
        timeOfDay: "morning",
        steps: [createStep("cleanser"), createStep("sunscreen")],
      }),
    ]);

    expect(review.hasMoisturizer).toBe(false);
    expect(review.cautionItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "missing-moisturizer",
          severity: "info",
        }),
      ]),
    );
  });

  it("adds a treatment pacing caution when a routine has multiple treatment steps", () => {
    const review = buildRoutineCoverageReview([
      createRoutine({
        id: "evening-routine",
        name: "Evening actives",
        timeOfDay: "evening",
        steps: [
          createStep("cleanser"),
          createStep("treatment", { stepId: "treatment-1", order: 2 }),
          createStep("treatment", { stepId: "treatment-2", order: 3 }),
          createStep("moisturizer", { order: 4 }),
        ],
      }),
    ]);

    expect(review.routinesWithMultipleTreatments).toEqual([
      {
        routineId: "evening-routine",
        routineName: "Evening actives",
        treatmentStepCount: 2,
      },
    ]);
    expect(review.cautionItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "multiple-treatments",
          severity: "caution",
        }),
      ]),
    );
  });

  it("returns a safe positive summary when sunscreen and moisturizer are present", () => {
    const review = buildRoutineCoverageReview([
      createRoutine({
        id: "morning-routine",
        name: "Morning routine",
        timeOfDay: "morning",
        steps: [
          createStep("cleanser"),
          createStep("moisturizer"),
          createStep("sunscreen"),
        ],
      }),
    ]);

    expect(review.cautionItems).toEqual([]);
    expect(review.summary).toBe(
      "Chưa thấy thiếu hụt cấu trúc lớn từ dữ liệu routine hiện có. Bạn có thể tiếp tục theo dõi cảm nhận của da và cập nhật routine khi cần.",
    );
    expect(review.summary).not.toContain("hoàn hảo");
    expect(review.summary).not.toContain("an toàn tuyệt đối");
    expect(review.summary).not.toContain("chắc chắn phù hợp");
    expect(review.nextAction.actionType).toBe("keep-monitoring");
  });

  it("sets morning and evening coverage correctly for mixed routines", () => {
    const review = buildRoutineCoverageReview([
      createRoutine({
        id: "morning-routine",
        name: "Morning routine",
        timeOfDay: "morning",
        steps: [createStep("sunscreen")],
      }),
      createRoutine({
        id: "evening-routine",
        name: "Evening routine",
        timeOfDay: "evening",
        steps: [createStep("moisturizer")],
      }),
    ]);

    expect(review.totalRoutines).toBe(2);
    expect(review.hasMorningRoutine).toBe(true);
    expect(review.hasEveningRoutine).toBe(true);
    expect(review.hasMorningSunscreen).toBe(true);
    expect(review.hasMoisturizer).toBe(true);
  });
});
