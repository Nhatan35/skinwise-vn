import { randomUUID } from "node:crypto";

import { getProductById } from "@/modules/products/product.use-case";
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

export class RoutineValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoutineValidationError";
  }
}

async function toServerOwnedRoutineStep(
  step: RoutineStepInput,
): Promise<RoutineStep> {
  const baseStep = {
    category: step.category,
    order: step.order,
    frequency: step.frequency,
    ...(step.instructions ? { instructions: step.instructions } : {}),
    stepId: randomUUID(),
  } satisfies Omit<
    RoutineStep,
    | "productId"
    | "customProductName"
    | "productNameSnapshot"
    | "brandSnapshot"
    | "keyActivesSnapshot"
    | "ingredientTextSnapshot"
  >;

  if (step.productId) {
    const product = await getProductById(step.productId);

    if (!product) {
      throw new RoutineValidationError("Selected product is not available.");
    }

    return {
      ...baseStep,
      productId: step.productId,
      productNameSnapshot: product.name,
      ...(product.brand ? { brandSnapshot: product.brand } : {}),
      keyActivesSnapshot: [...product.keyActives],
      ingredientTextSnapshot: product.ingredientsText,
    };
  }

  return {
    ...baseStep,
    customProductName: step.customProductName,
  };
}

async function withServerGeneratedStepIdsAndSnapshots(
  steps: RoutineStepInput[],
): Promise<RoutineStep[]> {
  return Promise.all(steps.map(toServerOwnedRoutineStep));
}

async function toRoutinePersistenceInput(
  input: CreateRoutineInput,
): Promise<RoutinePersistenceInput> {
  return {
    ...input,
    steps: await withServerGeneratedStepIdsAndSnapshots(input.steps),
  };
}

async function toRoutinePersistenceUpdateInput(
  input: UpdateRoutineInput,
): Promise<RoutinePersistenceUpdateInput> {
  const { steps, ...rest } = input;

  return {
    ...rest,
    ...(steps ? { steps: await withServerGeneratedStepIdsAndSnapshots(steps) } : {}),
  };
}

export async function createRoutineForCurrentUser(
  userId: string,
  input: CreateRoutineInput,
) {
  return createRoutineForUser(userId, await toRoutinePersistenceInput(input));
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
    await toRoutinePersistenceUpdateInput(input),
  );
}

export async function deleteRoutineForUser(routineId: string, userId: string) {
  return deleteRoutineByIdAndUserId(routineId, userId);
}
