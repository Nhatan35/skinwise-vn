import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/routines/routine.repository", () => ({
  createRoutineForUser: vi.fn(),
  deleteRoutineByIdAndUserId: vi.fn(),
  findRoutineByIdAndUserId: vi.fn(),
  listRoutinesByUserId: vi.fn(),
  updateRoutineByIdAndUserId: vi.fn(),
}));

import {
  createRoutineForCurrentUser,
  deleteRoutineForUser,
  getRoutineForUser,
  listRoutinesForUser,
  updateRoutineForUser,
} from "@/modules/routines/routine.use-case";
import {
  createRoutineForUser,
  deleteRoutineByIdAndUserId,
  findRoutineByIdAndUserId,
  listRoutinesByUserId,
  updateRoutineByIdAndUserId,
} from "@/modules/routines/routine.repository";
import type {
  CreateRoutineInput,
  UpdateRoutineInput,
} from "@/modules/routines/routine.schema";
import type {
  Routine,
  RoutinePersistenceInput,
  RoutinePersistenceUpdateInput,
} from "@/modules/routines/routine.types";

const mockedCreateRoutineForUser = vi.mocked(createRoutineForUser);
const mockedListRoutinesByUserId = vi.mocked(listRoutinesByUserId);
const mockedFindRoutineByIdAndUserId = vi.mocked(findRoutineByIdAndUserId);
const mockedUpdateRoutineByIdAndUserId = vi.mocked(updateRoutineByIdAndUserId);
const mockedDeleteRoutineByIdAndUserId = vi.mocked(deleteRoutineByIdAndUserId);

const authUserId = "auth-user-id";
const routineId = "665000000000000000000120";
const fixedNow = new Date("2026-05-14T00:00:00.000Z");

const validCreateInput = {
  name: "Routine buoi sang",
  timeOfDay: "morning",
  steps: [
    {
      customProductName: "Sua rua mat diu nhe",
      category: "cleanser",
      order: 1,
      frequency: "daily",
    },
  ],
} as const satisfies CreateRoutineInput;

const validUpdateInput = {
  steps: [
    {
      productId: "665000000000000000000121",
      category: "moisturizer",
      order: 1,
      frequency: "daily",
    },
  ],
} as const satisfies UpdateRoutineInput;

const routine = {
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
    },
  ],
  createdAt: fixedNow,
  updatedAt: fixedNow,
} satisfies Routine;

describe("Routine use cases", () => {
  beforeEach(() => {
    mockedCreateRoutineForUser.mockReset();
    mockedListRoutinesByUserId.mockReset();
    mockedFindRoutineByIdAndUserId.mockReset();
    mockedUpdateRoutineByIdAndUserId.mockReset();
    mockedDeleteRoutineByIdAndUserId.mockReset();
  });

  it("creates a routine for the authenticated user and generates stepId", async () => {
    mockedCreateRoutineForUser.mockResolvedValue(routine);

    await expect(
      createRoutineForCurrentUser(authUserId, validCreateInput),
    ).resolves.toBe(routine);

    const persistenceInput = mockedCreateRoutineForUser.mock.calls[0]?.[1] as
      | RoutinePersistenceInput
      | undefined;

    expect(mockedCreateRoutineForUser).toHaveBeenCalledWith(
      authUserId,
      expect.objectContaining({
        name: validCreateInput.name,
        timeOfDay: validCreateInput.timeOfDay,
      }),
    );
    expect(persistenceInput?.steps[0]?.stepId).toBeTypeOf("string");
    expect(persistenceInput?.steps[0]?.stepId.length).toBeGreaterThan(0);
    expect(persistenceInput?.steps[0]).not.toHaveProperty(
      "productNameSnapshot",
    );
  });

  it("lists routines for the authenticated user", async () => {
    mockedListRoutinesByUserId.mockResolvedValue([routine]);

    await expect(listRoutinesForUser(authUserId)).resolves.toEqual([routine]);
    expect(mockedListRoutinesByUserId).toHaveBeenCalledWith(authUserId);
  });

  it("finds routines by routine id and userId", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(routine);

    await expect(getRoutineForUser(routineId, authUserId)).resolves.toBe(
      routine,
    );
    expect(mockedFindRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      authUserId,
    );
  });

  it("updates routines by routine id and userId and regenerates stepId when steps change", async () => {
    mockedUpdateRoutineByIdAndUserId.mockResolvedValue(routine);

    await expect(
      updateRoutineForUser(routineId, authUserId, validUpdateInput),
    ).resolves.toBe(routine);

    const persistenceInput = mockedUpdateRoutineByIdAndUserId.mock.calls[0]?.[2] as
      | RoutinePersistenceUpdateInput
      | undefined;

    expect(mockedUpdateRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      authUserId,
      expect.objectContaining({
        steps: expect.any(Array),
      }),
    );
    expect(persistenceInput?.steps?.[0]?.stepId).toBeTypeOf("string");
    expect(persistenceInput?.steps?.[0]?.productId).toBe(
      "665000000000000000000121",
    );
  });

  it("updates routines without touching steps when steps are not provided", async () => {
    mockedUpdateRoutineByIdAndUserId.mockResolvedValue(routine);

    await updateRoutineForUser(routineId, authUserId, { name: "Routine toi" });

    expect(mockedUpdateRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      authUserId,
      {
        name: "Routine toi",
      },
    );
  });

  it("deletes routines by routine id and userId", async () => {
    mockedDeleteRoutineByIdAndUserId.mockResolvedValue(routine);

    await expect(deleteRoutineForUser(routineId, authUserId)).resolves.toBe(
      routine,
    );
    expect(mockedDeleteRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      authUserId,
    );
  });
});
