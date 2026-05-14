import { randomUUID } from "node:crypto";

import type {
  CreateRoutineInput,
  RoutineStepInput,
  UpdateRoutineInput,
} from "@/modules/routines/routine.schema";
import {
  createRoutineForUser,
  deleteRoutineByIdAndUserId,
  findRoutineByIdAndUserId,
  listRoutinesByUserId,
  updateRoutineByIdAndUserId,
} from "@/modules/routines/routine.repository";
import type {
  RoutinePersistenceInput,
  RoutinePersistenceUpdateInput,
  RoutineStep,
} from "@/modules/routines/routine.types";

function withServerGeneratedStepIds(steps: RoutineStepInput[]): RoutineStep[] {
  return steps.map((step) => ({
    ...step,
    stepId: randomUUID(),
  }));
}

function toRoutinePersistenceInput(
  input: CreateRoutineInput,
): RoutinePersistenceInput {
  return {
    ...input,
    steps: withServerGeneratedStepIds(input.steps),
  };
}

function toRoutinePersistenceUpdateInput(
  input: UpdateRoutineInput,
): RoutinePersistenceUpdateInput {
  const { steps, ...rest } = input;

  return {
    ...rest,
    ...(steps ? { steps: withServerGeneratedStepIds(steps) } : {}),
  };
}

export async function createRoutineForCurrentUser(
  userId: string,
  input: CreateRoutineInput,
) {
  return createRoutineForUser(userId, toRoutinePersistenceInput(input));
}

export async function listRoutinesForUser(userId: string) {
  return listRoutinesByUserId(userId);
}

export async function getRoutineForUser(routineId: string, userId: string) {
  return findRoutineByIdAndUserId(routineId, userId);
}

export async function updateRoutineForUser(
  routineId: string,
  userId: string,
  input: UpdateRoutineInput,
) {
  return updateRoutineByIdAndUserId(
    routineId,
    userId,
    toRoutinePersistenceUpdateInput(input),
  );
}

export async function deleteRoutineForUser(routineId: string, userId: string) {
  return deleteRoutineByIdAndUserId(routineId, userId);
}
