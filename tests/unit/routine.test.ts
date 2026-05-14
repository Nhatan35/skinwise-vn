import { ObjectId } from "mongodb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const toArrayMock = vi.fn();
const sortMock = vi.fn(() => ({ toArray: toArrayMock }));
const collectionMock = {
  insertOne: vi.fn(),
  find: vi.fn(() => ({ sort: sortMock })),
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
  findOneAndDelete: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getRoutinesCollection: vi.fn(() => collectionMock),
}));

import { toRoutineDto } from "@/modules/routines/routine.mapper";
import {
  createRoutineSchema,
  type CreateRoutineInput,
  updateRoutineSchema,
} from "@/modules/routines/routine.schema";
import {
  createRoutineForUser,
  deleteRoutineByIdAndUserId,
  findRoutineByIdAndUserId,
  listRoutinesByUserId,
  updateRoutineByIdAndUserId,
} from "@/modules/routines/routine.repository";
import type {
  Routine,
  RoutinePersistenceInput,
} from "@/modules/routines/routine.types";

const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const authUserId = "auth-user-id";
const routineId = "665000000000000000000110";

const validCreateInput = {
  name: "Routine buoi sang",
  timeOfDay: "morning",
  steps: [
    {
      customProductName: "Sua rua mat diu nhe",
      category: "cleanser",
      order: 1,
      frequency: "daily",
      instructions: "Massage nhe trong 30 giay.",
    },
  ],
} as const satisfies CreateRoutineInput;

const validPersistenceInput = {
  ...validCreateInput,
  steps: [
    {
      ...validCreateInput.steps[0],
      stepId: "server-step-id",
    },
  ],
} satisfies RoutinePersistenceInput;

function createRoutine(overrides: Partial<Routine> = {}): Routine {
  return {
    _id: new ObjectId(routineId),
    userId: authUserId,
    name: "Routine buoi sang",
    timeOfDay: "morning",
    steps: [
      {
        stepId: "server-step-id",
        customProductName: "Sua rua mat diu nhe",
        category: "cleanser",
        order: 1,
        frequency: "daily",
        instructions: "Massage nhe trong 30 giay.",
      },
    ],
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  };
}

describe("Routine schemas", () => {
  it("validates create input", () => {
    expect(createRoutineSchema.parse(validCreateInput)).toEqual(validCreateInput);
  });

  it("rejects missing name", () => {
    expect(() =>
      createRoutineSchema.parse({
        timeOfDay: "morning",
        steps: validCreateInput.steps,
      }),
    ).toThrow(ZodError);
  });

  it("rejects invalid timeOfDay", () => {
    expect(() =>
      createRoutineSchema.parse({
        ...validCreateInput,
        timeOfDay: "afternoon",
      }),
    ).toThrow(ZodError);
  });

  it("rejects more than 15 steps", () => {
    expect(() =>
      createRoutineSchema.parse({
        ...validCreateInput,
        steps: Array.from({ length: 16 }, (_, index) => ({
          ...validCreateInput.steps[0],
          order: index + 1,
        })),
      }),
    ).toThrow(ZodError);
  });

  it("rejects a step without productId or customProductName", () => {
    expect(() =>
      createRoutineSchema.parse({
        ...validCreateInput,
        steps: [
          {
            category: "cleanser",
            order: 1,
            frequency: "daily",
          },
        ],
      }),
    ).toThrow(ZodError);
  });

  it("rejects invalid productId", () => {
    expect(() =>
      createRoutineSchema.parse({
        ...validCreateInput,
        steps: [
          {
            productId: "not-a-mongo-id",
            category: "cleanser",
            order: 1,
            frequency: "daily",
          },
        ],
      }),
    ).toThrow(ZodError);
  });

  it("rejects invalid category and frequency", () => {
    expect(() =>
      createRoutineSchema.parse({
        ...validCreateInput,
        steps: [
          {
            ...validCreateInput.steps[0],
            category: "exfoliating_device",
          },
        ],
      }),
    ).toThrow(ZodError);

    expect(() =>
      createRoutineSchema.parse({
        ...validCreateInput,
        steps: [
          {
            ...validCreateInput.steps[0],
            frequency: "hourly",
          },
        ],
      }),
    ).toThrow(ZodError);
  });

  it("rejects client-owned root fields", () => {
    for (const field of [
      "userId",
      "id",
      "_id",
      "createdAt",
      "updatedAt",
    ]) {
      expect(() =>
        createRoutineSchema.parse({
          ...validCreateInput,
          [field]: "client-value",
        }),
      ).toThrow(ZodError);
    }
  });

  it("rejects client-provided stepId and snapshot fields", () => {
    for (const field of [
      "stepId",
      "productNameSnapshot",
      "brandSnapshot",
      "keyActivesSnapshot",
      "ingredientTextSnapshot",
    ]) {
      expect(() =>
        createRoutineSchema.parse({
          ...validCreateInput,
          steps: [
            {
              ...validCreateInput.steps[0],
              [field]: "client-value",
            },
          ],
        }),
      ).toThrow(ZodError);
    }
  });

  it("validates partial update input", () => {
    expect(updateRoutineSchema.parse({ name: "Routine toi" })).toEqual({
      name: "Routine toi",
    });
  });

  it("rejects empty update bodies", () => {
    expect(() => updateRoutineSchema.parse({})).toThrow(ZodError);
  });

  it("rejects client-owned root fields on update", () => {
    for (const field of [
      "userId",
      "id",
      "_id",
      "createdAt",
      "updatedAt",
      "stepId",
    ]) {
      expect(() =>
        updateRoutineSchema.parse({
          [field]: "client-value",
        }),
      ).toThrow(ZodError);
    }
  });

  it("rejects client-provided stepId and snapshot fields inside update steps", () => {
    const forbiddenStepFields = [
      ["stepId", "client-step-id"],
      ["productNameSnapshot", "Client product"],
      ["brandSnapshot", "Client brand"],
      ["keyActivesSnapshot", ["client-active"]],
      ["ingredientTextSnapshot", "Client ingredients"],
    ] as const;

    for (const [field, value] of forbiddenStepFields) {
      expect(() =>
        updateRoutineSchema.parse({
          steps: [
            {
              ...validCreateInput.steps[0],
              [field]: value,
            },
          ],
        }),
      ).toThrow(ZodError);
    }
  });
});

describe("Routine mapper", () => {
  it("maps a database document to an API-safe DTO", () => {
    expect(toRoutineDto(createRoutine())).toEqual({
      id: routineId,
      name: "Routine buoi sang",
      timeOfDay: "morning",
      steps: [
        {
          stepId: "server-step-id",
          customProductName: "Sua rua mat diu nhe",
          category: "cleanser",
          order: 1,
          frequency: "daily",
          instructions: "Massage nhe trong 30 giay.",
        },
      ],
      createdAt: fixedNow.toISOString(),
      updatedAt: fixedNow.toISOString(),
    });
  });

  it("does not expose MongoDB internals or userId", () => {
    const dto = toRoutineDto(createRoutine()) as Record<string, unknown>;
    const serializedDto = JSON.stringify(dto);

    expect(dto).not.toHaveProperty("_id");
    expect(dto).not.toHaveProperty("userId");
    expect(serializedDto).not.toContain("ObjectId");
    expect(dto.createdAt).toBeTypeOf("string");
    expect(dto.updatedAt).toBeTypeOf("string");
  });
});

describe("Routine repository", () => {
  beforeEach(() => {
    collectionMock.insertOne.mockReset();
    collectionMock.find.mockReset();
    collectionMock.findOne.mockReset();
    collectionMock.findOneAndUpdate.mockReset();
    collectionMock.findOneAndDelete.mockReset();
    sortMock.mockReset();
    toArrayMock.mockReset();
    collectionMock.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({ toArray: toArrayMock });
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a routine for the authenticated user", async () => {
    collectionMock.insertOne.mockResolvedValue({
      insertedId: new ObjectId(routineId),
    });

    await expect(
      createRoutineForUser(authUserId, validPersistenceInput),
    ).resolves.toEqual(createRoutine());

    expect(collectionMock.insertOne).toHaveBeenCalledWith({
      userId: authUserId,
      ...validPersistenceInput,
      createdAt: fixedNow,
      updatedAt: fixedNow,
    });
  });

  it("lists routines scoped by userId and recent updates", async () => {
    const routine = createRoutine();
    toArrayMock.mockResolvedValue([routine]);

    await expect(listRoutinesByUserId(authUserId)).resolves.toEqual([routine]);
    expect(collectionMock.find).toHaveBeenCalledWith({ userId: authUserId });
    expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
  });

  it("finds a routine by _id and userId", async () => {
    const routine = createRoutine();
    collectionMock.findOne.mockResolvedValue(routine);

    await expect(
      findRoutineByIdAndUserId(routineId, authUserId),
    ).resolves.toBe(routine);

    const filter = collectionMock.findOne.mock.calls[0]?.[0] as {
      _id?: ObjectId;
      userId?: string;
    };
    expect(filter._id?.toString()).toBe(routineId);
    expect(filter.userId).toBe(authUserId);
  });

  it("updates a routine by _id and userId", async () => {
    const routine = createRoutine({ name: "Routine toi" });
    collectionMock.findOneAndUpdate.mockResolvedValue(routine);

    await expect(
      updateRoutineByIdAndUserId(routineId, authUserId, {
        name: "Routine toi",
      }),
    ).resolves.toBe(routine);

    const filter = collectionMock.findOneAndUpdate.mock.calls[0]?.[0] as {
      _id?: ObjectId;
      userId?: string;
    };
    expect(filter._id?.toString()).toBe(routineId);
    expect(filter.userId).toBe(authUserId);
    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ userId: authUserId }),
      {
        $set: {
          name: "Routine toi",
          updatedAt: fixedNow,
        },
      },
      {
        returnDocument: "after",
      },
    );
  });

  it("deletes a routine by _id and userId", async () => {
    const routine = createRoutine();
    collectionMock.findOneAndDelete.mockResolvedValue(routine);

    await expect(
      deleteRoutineByIdAndUserId(routineId, authUserId),
    ).resolves.toBe(routine);

    const filter = collectionMock.findOneAndDelete.mock.calls[0]?.[0] as {
      _id?: ObjectId;
      userId?: string;
    };
    expect(filter._id?.toString()).toBe(routineId);
    expect(filter.userId).toBe(authUserId);
  });

  it("returns null safely for invalid routine ids", async () => {
    await expect(
      findRoutineByIdAndUserId("not-a-routine-id", authUserId),
    ).resolves.toBeNull();
    await expect(
      updateRoutineByIdAndUserId("not-a-routine-id", authUserId, {
        name: "Routine toi",
      }),
    ).resolves.toBeNull();
    await expect(
      deleteRoutineByIdAndUserId("not-a-routine-id", authUserId),
    ).resolves.toBeNull();

    expect(collectionMock.findOne).not.toHaveBeenCalled();
    expect(collectionMock.findOneAndUpdate).not.toHaveBeenCalled();
    expect(collectionMock.findOneAndDelete).not.toHaveBeenCalled();
  });
});
