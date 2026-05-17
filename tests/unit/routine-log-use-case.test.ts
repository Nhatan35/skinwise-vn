import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/routines/routine.repository", () => ({
  findRoutineByIdAndUserId: vi.fn(),
}));

vi.mock("@/modules/routine-logs/routine-log.repository", () => ({
  findRoutineLogsByDate: vi.fn(),
  upsertRoutineLog: vi.fn(),
}));

import {
  getRoutineLogsForDate,
  RoutineLogValidationError,
  upsertRoutineLogForUser,
} from "@/modules/routine-logs/routine-log.use-case";
import {
  findRoutineLogsByDate,
  upsertRoutineLog,
} from "@/modules/routine-logs/routine-log.repository";
import type { RoutineLog } from "@/modules/routine-logs/routine-log.types";
import { findRoutineByIdAndUserId } from "@/modules/routines/routine.repository";
import type { Routine } from "@/modules/routines/routine.types";

const mockedFindRoutineByIdAndUserId = vi.mocked(findRoutineByIdAndUserId);
const mockedFindRoutineLogsByDate = vi.mocked(findRoutineLogsByDate);
const mockedUpsertRoutineLog = vi.mocked(upsertRoutineLog);

const userId = "auth-user-id";
const otherUserId = "other-user-id";
const routineId = "665000000000000000000460";
const routineLogId = "665000000000000000000461";
const fixedDate = new Date("2026-05-17T00:00:00.000Z");

function createRoutine(overrides: Partial<Routine> = {}): Routine {
  return {
    _id: new ObjectId(routineId),
    userId,
    name: "Routine buoi sang",
    timeOfDay: "morning",
    steps: [
      {
        stepId: "step-1",
        customProductName: "Sua rua mat",
        category: "cleanser",
        order: 1,
        frequency: "daily",
      },
      {
        stepId: "step-2",
        customProductName: "Kem chong nang",
        category: "sunscreen",
        order: 2,
        frequency: "daily",
      },
    ],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createRoutineLog(overrides: Partial<RoutineLog> = {}): RoutineLog {
  return {
    _id: new ObjectId(routineLogId),
    userId,
    routineId,
    localDate: "2026-05-17",
    timezone: "Asia/Ho_Chi_Minh",
    status: "partial",
    completedStepIds: ["step-1"],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("RoutineLog use case", () => {
  beforeEach(() => {
    mockedFindRoutineByIdAndUserId.mockReset();
    mockedFindRoutineLogsByDate.mockReset();
    mockedUpsertRoutineLog.mockReset();
  });

  it("returns logs for the requested authenticated user and localDate", async () => {
    mockedFindRoutineLogsByDate.mockResolvedValue([createRoutineLog()]);

    await expect(getRoutineLogsForDate(userId, "2026-05-17")).resolves.toEqual([
      {
        id: routineLogId,
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "partial",
        completedStepIds: ["step-1"],
        createdAt: fixedDate.toISOString(),
        updatedAt: fixedDate.toISOString(),
      },
    ]);
    expect(mockedFindRoutineLogsByDate).toHaveBeenCalledWith(
      userId,
      "2026-05-17",
    );
  });

  it("does not allow logging a routine that does not belong to the user", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(null);

    await expect(
      upsertRoutineLogForUser(otherUserId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "completed",
      }),
    ).resolves.toBeNull();

    expect(mockedFindRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      otherUserId,
    );
    expect(mockedUpsertRoutineLog).not.toHaveBeenCalled();
  });

  it("upserts a completed log and normalizes completedStepIds to all routine stepIds", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedUpsertRoutineLog.mockResolvedValue(
      createRoutineLog({
        status: "completed",
        completedStepIds: ["step-1", "step-2"],
      }),
    );

    await expect(
      upsertRoutineLogForUser(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "completed",
      }),
    ).resolves.toMatchObject({
      status: "completed",
      completedStepIds: ["step-1", "step-2"],
    });

    expect(mockedUpsertRoutineLog).toHaveBeenCalledWith(userId, {
      routineId,
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "completed",
      completedStepIds: ["step-1", "step-2"],
    });
  });

  it("upserts a partial log and preserves valid completedStepIds", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedUpsertRoutineLog.mockResolvedValue(createRoutineLog());

    await expect(
      upsertRoutineLogForUser(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "partial",
        completedStepIds: ["step-1"],
        note: "  Bo qua chong nang.  ",
      }),
    ).resolves.toMatchObject({
      status: "partial",
      completedStepIds: ["step-1"],
    });

    expect(mockedUpsertRoutineLog).toHaveBeenCalledWith(userId, {
      routineId,
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "partial",
      completedStepIds: ["step-1"],
      note: "Bo qua chong nang.",
    });
  });

  it("rejects unknown completedStepIds", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());

    await expect(
      upsertRoutineLogForUser(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "partial",
        completedStepIds: ["step-999"],
      }),
    ).rejects.toBeInstanceOf(RoutineLogValidationError);

    expect(mockedUpsertRoutineLog).not.toHaveBeenCalled();
  });

  it("rejects partial logs with no completed steps or all completed steps", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());

    await expect(
      upsertRoutineLogForUser(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "partial",
        completedStepIds: [],
      }),
    ).rejects.toBeInstanceOf(RoutineLogValidationError);

    await expect(
      upsertRoutineLogForUser(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "partial",
        completedStepIds: ["step-1", "step-2"],
      }),
    ).rejects.toBeInstanceOf(RoutineLogValidationError);
  });

  it("allows skipped logs without completedStepIds", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedUpsertRoutineLog.mockResolvedValue(
      createRoutineLog({
        status: "skipped",
        completedStepIds: undefined,
        note: undefined,
      }),
    );

    await expect(
      upsertRoutineLogForUser(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "skipped",
      }),
    ).resolves.toMatchObject({
      status: "skipped",
    });

    expect(mockedUpsertRoutineLog).toHaveBeenCalledWith(userId, {
      routineId,
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "skipped",
    });
  });

  it("rejects skipped logs that include completedStepIds", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());

    await expect(
      upsertRoutineLogForUser(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "skipped",
        completedStepIds: ["step-1"],
      }),
    ).rejects.toBeInstanceOf(RoutineLogValidationError);

    expect(mockedUpsertRoutineLog).not.toHaveBeenCalled();
  });
});
