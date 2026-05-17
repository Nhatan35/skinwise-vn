import { describe, expect, it, vi } from "vitest";

import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import {
  buildCompletedRoutineLogPayload,
  buildPartialRoutineLogPayload,
  buildSkippedRoutineLogPayload,
  getBrowserLocalDate,
  getBrowserTimezone,
  getCompletedStepCount,
  getRoutineLogStatusLabel,
  groupRoutineLogsByRoutineId,
  RoutineLogClientValidationError,
} from "@/modules/routine-logs/routine-log.client";
import type { RoutineDto } from "@/modules/routines/routine.dto";

function createRoutine(): RoutineDto {
  return {
    id: "routine-1",
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
      {
        stepId: "step-2",
        customProductName: "Serum",
        category: "serum",
        order: 2,
        frequency: "daily",
      },
      {
        stepId: "step-3",
        customProductName: "Sunscreen",
        category: "sunscreen",
        order: 3,
        frequency: "daily",
      },
    ],
    createdAt: "2026-05-17T00:00:00.000Z",
    updatedAt: "2026-05-17T00:00:00.000Z",
  };
}

function createRoutineLog(overrides: Partial<RoutineLogDto> = {}): RoutineLogDto {
  return {
    id: "log-1",
    routineId: "routine-1",
    localDate: "2026-05-17",
    timezone: "Asia/Ho_Chi_Minh",
    status: "partial",
    completedStepIds: ["step-1"],
    createdAt: "2026-05-17T00:00:00.000Z",
    updatedAt: "2026-05-17T00:00:00.000Z",
    ...overrides,
  };
}

describe("RoutineLog client helpers", () => {
  it("formats browser local date with local date parts", () => {
    expect(getBrowserLocalDate(new Date(2026, 4, 7))).toBe("2026-05-07");
  });

  it("returns browser timezone when available", () => {
    const dateTimeFormatSpy = vi.spyOn(Intl, "DateTimeFormat").mockReturnValue({
      resolvedOptions: () => ({ timeZone: "Asia/Ho_Chi_Minh" }),
    } as unknown as Intl.DateTimeFormat);

    expect(getBrowserTimezone()).toBe("Asia/Ho_Chi_Minh");
    dateTimeFormatSpy.mockRestore();
  });

  it("falls back to UTC when timezone is unavailable", () => {
    const dateTimeFormatSpy = vi.spyOn(Intl, "DateTimeFormat").mockReturnValue({
      resolvedOptions: () => ({}),
    } as unknown as Intl.DateTimeFormat);

    expect(getBrowserTimezone()).toBe("UTC");
    dateTimeFormatSpy.mockRestore();
  });

  it("builds completed payload with all routine stepIds", () => {
    const payload = buildCompletedRoutineLogPayload(
      createRoutine(),
      "2026-05-17",
      "Asia/Ho_Chi_Minh",
    );

    expect(payload).toEqual({
      routineId: "routine-1",
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "completed",
      completedStepIds: ["step-1", "step-2", "step-3"],
    });
  });

  it("builds skipped payload with empty completedStepIds", () => {
    const payload = buildSkippedRoutineLogPayload(
      createRoutine(),
      "2026-05-17",
      "Asia/Ho_Chi_Minh",
    );

    expect(payload).toEqual({
      routineId: "routine-1",
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "skipped",
      completedStepIds: [],
    });
  });

  it("builds partial payload with selected valid stepIds", () => {
    const payload = buildPartialRoutineLogPayload(
      createRoutine(),
      ["step-1", "step-2", "step-2"],
      "2026-05-17",
      "Asia/Ho_Chi_Minh",
    );

    expect(payload).toEqual({
      routineId: "routine-1",
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "partial",
      completedStepIds: ["step-1", "step-2"],
    });
  });

  it("rejects partial payload with zero selected steps", () => {
    expect(() =>
      buildPartialRoutineLogPayload(
        createRoutine(),
        [],
        "2026-05-17",
        "Asia/Ho_Chi_Minh",
      ),
    ).toThrow(RoutineLogClientValidationError);
  });

  it("rejects partial payload with all routine stepIds", () => {
    expect(() =>
      buildPartialRoutineLogPayload(
        createRoutine(),
        ["step-1", "step-2", "step-3"],
        "2026-05-17",
        "Asia/Ho_Chi_Minh",
      ),
    ).toThrow("Nếu đã hoàn thành tất cả các bước, hãy chọn Hoàn thành.");
  });

  it("does not include server-owned fields in payloads", () => {
    const payload = buildCompletedRoutineLogPayload(
      createRoutine(),
      "2026-05-17",
      "Asia/Ho_Chi_Minh",
    );

    for (const forbiddenField of [
      "userId",
      "id",
      "_id",
      "createdAt",
      "updatedAt",
    ]) {
      expect(payload).not.toHaveProperty(forbiddenField);
    }
  });

  it("maps status labels for display", () => {
    expect(getRoutineLogStatusLabel()).toBe("Chưa ghi nhận");
    expect(getRoutineLogStatusLabel("completed")).toBe("Hoàn thành");
    expect(getRoutineLogStatusLabel("partial")).toBe("Một phần");
    expect(getRoutineLogStatusLabel("skipped")).toBe("Bỏ qua");
  });

  it("groups routine logs by routineId", () => {
    const logs = [
      createRoutineLog({ id: "log-1", routineId: "routine-1" }),
      createRoutineLog({ id: "log-2", routineId: "routine-2" }),
    ];

    expect(groupRoutineLogsByRoutineId(logs)).toEqual({
      "routine-1": logs[0],
      "routine-2": logs[1],
    });
  });

  it("counts completed steps that belong to the routine", () => {
    expect(
      getCompletedStepCount(
        createRoutine(),
        createRoutineLog({ completedStepIds: ["step-1", "unknown"] }),
      ),
    ).toBe(1);
  });
});
