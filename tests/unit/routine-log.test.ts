import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const toArrayMock = vi.fn();
const sortMock = vi.fn(() => ({ toArray: toArrayMock }));
const collectionMock = {
  deleteOne: vi.fn(),
  find: vi.fn((filter?: unknown) => {
    void filter;

    return { sort: sortMock };
  }),
  findOne: vi.fn((filter?: unknown): unknown => {
    void filter;

    return undefined;
  }),
  findOneAndUpdate: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getRoutineLogsCollection: vi.fn(() => collectionMock),
}));

import { toRoutineLogDto } from "@/modules/routine-logs/routine-log.mapper";
import {
  routineLogDateQuerySchema,
  routineLogQuerySchema,
  upsertRoutineLogSchema,
} from "@/modules/routine-logs/routine-log.schema";
import {
  deleteRoutineLogByIdAndUserId,
  findRoutineLogByRoutineAndDate,
  findRoutineLogsByDate,
  findRoutineLogsByDateRange,
  upsertRoutineLog,
} from "@/modules/routine-logs/routine-log.repository";
import type { RoutineLog } from "@/modules/routine-logs/routine-log.types";

const userId = "auth-user-id";
const routineId = "665000000000000000000450";
const routineLogId = "665000000000000000000451";
const fixedDate = new Date("2026-05-17T00:00:00.000Z");
const laterDate = new Date("2026-05-17T01:00:00.000Z");

function createRoutineLog(overrides: Partial<RoutineLog> = {}): RoutineLog {
  return {
    _id: new ObjectId(routineLogId),
    userId,
    routineId,
    localDate: "2026-05-17",
    timezone: "Asia/Ho_Chi_Minh",
    status: "completed",
    completedStepIds: ["step-1", "step-2"],
    note: "Da hoan thanh routine.",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("RoutineLog schema", () => {
  it("accepts a valid completed log", () => {
    expect(
      upsertRoutineLogSchema.parse({
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "completed",
        completedStepIds: ["step-1", "step-2"],
      }),
    ).toEqual({
      routineId,
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "completed",
      completedStepIds: ["step-1", "step-2"],
    });
  });

  it("accepts a valid partial log with completedStepIds", () => {
    expect(
      upsertRoutineLogSchema.parse({
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "partial",
        completedStepIds: ["step-1"],
      }),
    ).toMatchObject({
      status: "partial",
      completedStepIds: ["step-1"],
    });
  });

  it("accepts a valid skipped log without completedStepIds", () => {
    expect(
      upsertRoutineLogSchema.parse({
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "skipped",
      }),
    ).toMatchObject({
      status: "skipped",
      timezone: "Asia/Ho_Chi_Minh",
    });
  });

  it("accepts and trims timezone and note", () => {
    expect(
      upsertRoutineLogSchema.parse({
        routineId,
        localDate: "2026-05-17",
        timezone: " Asia/Ho_Chi_Minh ",
        status: "partial",
        completedStepIds: ["step-1"],
        note: "  Da bo qua buoc treatment.  ",
      }),
    ).toMatchObject({
      timezone: "Asia/Ho_Chi_Minh",
      note: "Da bo qua buoc treatment.",
    });
  });

  it("rejects invalid localDate format", () => {
    expect(() =>
      upsertRoutineLogSchema.parse({
        routineId,
        localDate: "17-05-2026",
        timezone: "Asia/Ho_Chi_Minh",
        status: "completed",
      }),
    ).toThrow(ZodError);
    expect(() => routineLogDateQuerySchema.parse({})).toThrow(ZodError);
  });

  it("accepts exactly one valid RoutineLog query mode", () => {
    expect(routineLogQuerySchema.parse({ localDate: "2026-05-17" })).toEqual({
      localDate: "2026-05-17",
    });
    expect(
      routineLogQuerySchema.parse({
        from: "2026-05-11",
        to: "2026-05-17",
      }),
    ).toEqual({
      from: "2026-05-11",
      to: "2026-05-17",
    });
  });

  it("rejects mixed or incomplete RoutineLog query modes", () => {
    for (const query of [
      {
        localDate: "2026-05-17",
        from: "2026-05-11",
        to: "2026-05-17",
      },
      { from: "2026-05-11" },
      { to: "2026-05-17" },
      { localDate: "2026-05-17", unknown: "field" },
    ]) {
      expect(() => routineLogQuerySchema.parse(query)).toThrow(ZodError);
    }
  });

  it("rejects invalid RoutineLog range queries", () => {
    for (const query of [
      { from: "2026-05-18", to: "2026-05-17" },
      { from: "2026-05-10", to: "2026-05-17" },
      { from: "2026/05/11", to: "2026-05-17" },
    ]) {
      expect(() => routineLogQuerySchema.parse(query)).toThrow(ZodError);
    }
  });

  it("rejects unknown and server-owned fields", () => {
    const forbiddenFields = ["userId", "id", "_id", "createdAt", "updatedAt"];

    for (const field of forbiddenFields) {
      expect(() =>
        upsertRoutineLogSchema.parse({
          routineId,
          localDate: "2026-05-17",
          timezone: "Asia/Ho_Chi_Minh",
          status: "completed",
          [field]: "client-value",
        }),
      ).toThrow(ZodError);
    }

    expect(() =>
      upsertRoutineLogSchema.parse({
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "completed",
        skippedStepIds: ["step-2"],
      }),
    ).toThrow(ZodError);
  });

  it("limits note length", () => {
    expect(() =>
      upsertRoutineLogSchema.parse({
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "skipped",
        note: "x".repeat(501),
      }),
    ).toThrow(ZodError);
  });
});

describe("RoutineLog mapper", () => {
  it("maps _id to id, serializes dates, and preserves completedStepIds", () => {
    expect(toRoutineLogDto(createRoutineLog())).toEqual({
      id: routineLogId,
      routineId,
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "completed",
      completedStepIds: ["step-1", "step-2"],
      note: "Da hoan thanh routine.",
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
    });
  });

  it("does not expose userId, _id, or raw ObjectId values", () => {
    const dto = toRoutineLogDto(createRoutineLog()) as Record<string, unknown>;
    const serializedDto = JSON.stringify(dto);

    expect(dto).not.toHaveProperty("userId");
    expect(dto).not.toHaveProperty("_id");
    expect(serializedDto).not.toContain("ObjectId");
    expect(dto.createdAt).toBeTypeOf("string");
    expect(dto.updatedAt).toBeTypeOf("string");
  });

  it("copies completedStepIds safely in mapper output", () => {
    const routineLog = createRoutineLog();
    const dto = toRoutineLogDto(routineLog);

    dto.completedStepIds?.push("mutated-step");

    expect(routineLog.completedStepIds).toEqual(["step-1", "step-2"]);
  });
});

describe("RoutineLog repository", () => {
  beforeEach(() => {
    vi.useRealTimers();
    collectionMock.find.mockReset();
    collectionMock.findOne.mockReset();
    collectionMock.findOneAndUpdate.mockReset();
    collectionMock.deleteOne.mockReset();
    sortMock.mockReset();
    toArrayMock.mockReset();
    collectionMock.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({ toArray: toArrayMock });
  });

  it("finds logs by authenticated user and localDate", async () => {
    const routineLog = createRoutineLog();
    toArrayMock.mockResolvedValue([routineLog]);

    await expect(findRoutineLogsByDate(userId, "2026-05-17")).resolves.toEqual([
      routineLog,
    ]);

    expect(collectionMock.find).toHaveBeenCalledWith({
      userId,
      localDate: "2026-05-17",
    });
    expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
  });

  it("finds logs by authenticated user and localDate range", async () => {
    const routineLog = createRoutineLog();
    toArrayMock.mockResolvedValue([routineLog]);

    await expect(
      findRoutineLogsByDateRange(userId, "2026-05-11", "2026-05-17"),
    ).resolves.toEqual([routineLog]);

    expect(collectionMock.find).toHaveBeenCalledWith({
      userId,
      localDate: {
        $gte: "2026-05-11",
        $lte: "2026-05-17",
      },
    });
    expect(sortMock).toHaveBeenCalledWith({ localDate: -1, updatedAt: -1 });
  });

  it("finds one log by userId, routineId, and localDate", async () => {
    const routineLog = createRoutineLog();
    collectionMock.findOne.mockResolvedValue(routineLog);

    await expect(
      findRoutineLogByRoutineAndDate(userId, routineId, "2026-05-17"),
    ).resolves.toBe(routineLog);

    expect(collectionMock.findOne).toHaveBeenCalledWith({
      userId,
      routineId,
      localDate: "2026-05-17",
    });
  });

  it("upserts a new RoutineLog by userId, routineId, and localDate", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
    const routineLog = createRoutineLog();
    collectionMock.findOneAndUpdate.mockResolvedValue(routineLog);

    await expect(
      upsertRoutineLog(userId, {
        routineId,
        localDate: "2026-05-17",
        timezone: "Asia/Ho_Chi_Minh",
        status: "completed",
        completedStepIds: ["step-1", "step-2"],
        note: "Da hoan thanh routine.",
      }),
    ).resolves.toBe(routineLog);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId, routineId, localDate: "2026-05-17" },
      expect.objectContaining({
        $set: expect.objectContaining({
          timezone: "Asia/Ho_Chi_Minh",
          status: "completed",
          completedStepIds: ["step-1", "step-2"],
          note: "Da hoan thanh routine.",
          updatedAt: fixedDate,
        }),
        $setOnInsert: {
          userId,
          routineId,
          localDate: "2026-05-17",
          createdAt: fixedDate,
        },
      }),
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  });

  it("updates an existing RoutineLog for the same unique key", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(laterDate);
    const routineLog = createRoutineLog({
      status: "partial",
      completedStepIds: ["step-1"],
      updatedAt: laterDate,
    });
    collectionMock.findOneAndUpdate.mockResolvedValue(routineLog);

    await upsertRoutineLog(userId, {
      routineId,
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "partial",
      completedStepIds: ["step-1"],
    });

    const update = collectionMock.findOneAndUpdate.mock.calls[0]?.[1] as {
      $set?: Record<string, unknown>;
      $setOnInsert?: Record<string, unknown>;
      $unset?: Record<string, unknown>;
    };

    expect(update.$set?.status).toBe("partial");
    expect(update.$set?.completedStepIds).toEqual(["step-1"]);
    expect(update.$set?.updatedAt).toEqual(laterDate);
    expect(update.$set).not.toHaveProperty("createdAt");
    expect(update.$setOnInsert?.createdAt).toEqual(laterDate);
    expect(update.$unset).toEqual({ note: "" });
  });

  it("unsets optional fields when they are omitted on a later write", async () => {
    collectionMock.findOneAndUpdate.mockResolvedValue(
      createRoutineLog({
        status: "skipped",
        completedStepIds: undefined,
        note: undefined,
      }),
    );

    await upsertRoutineLog(userId, {
      routineId,
      localDate: "2026-05-17",
      timezone: "Asia/Ho_Chi_Minh",
      status: "skipped",
    });

    const update = collectionMock.findOneAndUpdate.mock.calls[0]?.[1] as {
      $unset?: Record<string, unknown>;
    };

    expect(update.$unset).toEqual({
      completedStepIds: "",
      note: "",
    });
  });

  it("deletes routine logs only when both _id and userId match", async () => {
    collectionMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await expect(
      deleteRoutineLogByIdAndUserId(userId, routineLogId),
    ).resolves.toBe(true);

    expect(collectionMock.deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(routineLogId),
      userId,
    });
  });

  it("does not delete routine logs by id alone or with invalid ObjectId", async () => {
    await expect(
      deleteRoutineLogByIdAndUserId(userId, "invalid-id"),
    ).resolves.toBe(false);

    expect(collectionMock.deleteOne).not.toHaveBeenCalled();
  });

  it("returns false when the routine log is missing or belongs to another user", async () => {
    collectionMock.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await expect(
      deleteRoutineLogByIdAndUserId(userId, routineLogId),
    ).resolves.toBe(false);
  });
});
