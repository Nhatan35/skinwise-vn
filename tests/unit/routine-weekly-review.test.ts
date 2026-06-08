import { describe, expect, it } from "vitest";

import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import {
  addLocalDateDays,
  buildRoutineWeeklyReview,
  buildSevenDayLocalDateRange,
} from "@/modules/routine-logs/routine-weekly-review";

function createRoutineLog(
  overrides: Partial<RoutineLogDto> = {},
): RoutineLogDto {
  return {
    id: "log-1",
    routineId: "routine-1",
    localDate: "2026-05-17",
    timezone: "Asia/Ho_Chi_Minh",
    status: "completed",
    completedStepIds: ["step-1"],
    createdAt: "2026-05-17T00:00:00.000Z",
    updatedAt: "2026-05-17T00:00:00.000Z",
    ...overrides,
  };
}

describe("Routine weekly review helper", () => {
  it("builds the last 7 local dates including the reference date", () => {
    expect(buildSevenDayLocalDateRange("2026-05-17")).toEqual([
      "2026-05-11",
      "2026-05-12",
      "2026-05-13",
      "2026-05-14",
      "2026-05-15",
      "2026-05-16",
      "2026-05-17",
    ]);
  });

  it("handles month boundaries with local-date math", () => {
    expect(addLocalDateDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addLocalDateDays("2028-03-01", -1)).toBe("2028-02-29");
  });

  it("returns safe empty review data when no logs exist", () => {
    const review = buildRoutineWeeklyReview({
      referenceLocalDate: "2026-05-17",
      routineLogs: [],
    });

    expect(review).toMatchObject({
      completedRoutineLogs: 0,
      completionRate: null,
      from: "2026-05-11",
      hasLogs: false,
      loggedDays: 0,
      to: "2026-05-17",
      totalDays: 7,
      totalRoutineLogs: 0,
    });
    expect(review.days).toHaveLength(7);
    expect(review.days.every((day) => day.status === "not_logged")).toBe(true);
  });

  it("calculates logged days, total logs, completed logs, and rounded completion rate", () => {
    const review = buildRoutineWeeklyReview({
      referenceLocalDate: "2026-05-17",
      routineLogs: [
        createRoutineLog({
          id: "log-1",
          localDate: "2026-05-17",
          status: "completed",
        }),
        createRoutineLog({
          id: "log-2",
          localDate: "2026-05-16",
          routineId: "routine-2",
          status: "partial",
        }),
        createRoutineLog({
          id: "log-3",
          localDate: "2026-05-15",
          routineId: "routine-3",
          status: "skipped",
        }),
      ],
    });

    expect(review.loggedDays).toBe(3);
    expect(review.totalRoutineLogs).toBe(3);
    expect(review.completedRoutineLogs).toBe(1);
    expect(review.completionRate).toBe(33);
    expect(review.hasLogs).toBe(true);
  });

  it("marks all completed logs on a day as completed", () => {
    const review = buildRoutineWeeklyReview({
      referenceLocalDate: "2026-05-17",
      routineLogs: [
        createRoutineLog({ id: "log-1", localDate: "2026-05-17" }),
        createRoutineLog({
          id: "log-2",
          localDate: "2026-05-17",
          routineId: "routine-2",
        }),
      ],
    });

    expect(review.days.at(-1)).toMatchObject({
      completedCount: 2,
      status: "completed",
      totalLogs: 2,
    });
  });

  it("marks all skipped logs on a day as skipped", () => {
    const review = buildRoutineWeeklyReview({
      referenceLocalDate: "2026-05-17",
      routineLogs: [
        createRoutineLog({ id: "log-1", status: "skipped" }),
        createRoutineLog({
          id: "log-2",
          routineId: "routine-2",
          status: "skipped",
        }),
      ],
    });

    expect(review.days.at(-1)).toMatchObject({
      skippedCount: 2,
      status: "skipped",
      totalLogs: 2,
    });
  });

  it("marks partial or mixed same-day logs as partial", () => {
    const review = buildRoutineWeeklyReview({
      referenceLocalDate: "2026-05-17",
      routineLogs: [
        createRoutineLog({ id: "log-1", status: "completed" }),
        createRoutineLog({
          id: "log-2",
          routineId: "routine-2",
          status: "skipped",
        }),
        createRoutineLog({
          id: "log-3",
          routineId: "routine-3",
          status: "partial",
        }),
      ],
    });

    expect(review.days.at(-1)).toMatchObject({
      completedCount: 1,
      partialCount: 1,
      skippedCount: 1,
      status: "partial",
      totalLogs: 3,
    });
  });

  it("ignores routine logs outside the 7-day window", () => {
    const review = buildRoutineWeeklyReview({
      referenceLocalDate: "2026-05-17",
      routineLogs: [
        createRoutineLog({ id: "log-1", localDate: "2026-05-10" }),
        createRoutineLog({ id: "log-2", localDate: "2026-05-11" }),
      ],
    });

    expect(review.totalRoutineLogs).toBe(1);
    expect(review.days[0]).toMatchObject({
      localDate: "2026-05-11",
      status: "completed",
    });
  });
});
