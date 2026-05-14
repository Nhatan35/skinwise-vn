import { z } from "zod";

import {
  ROUTINE_STEP_CATEGORIES,
  ROUTINE_STEP_FREQUENCIES,
  ROUTINE_TIME_OF_DAY,
} from "@/modules/routines/routine.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;
const routineNameSchema = z.string().trim().min(1).max(100);
const productIdSchema = z.string().regex(mongoObjectIdPattern);
const customProductNameSchema = z.string().trim().min(1).max(160);
const instructionsSchema = z.string().trim().min(1).max(1000);

export const routineStepInputSchema = z
  .object({
    productId: productIdSchema.optional(),
    customProductName: customProductNameSchema.optional(),
    category: z.enum(ROUTINE_STEP_CATEGORIES),
    order: z.number().int().positive(),
    frequency: z.enum(ROUTINE_STEP_FREQUENCIES),
    instructions: instructionsSchema.optional(),
  })
  .strict()
  .refine((value) => value.productId || value.customProductName, {
    message: "A routine step requires productId or customProductName.",
  });

const routineStepsSchema = z.array(routineStepInputSchema).min(1).max(15);

export const createRoutineSchema = z
  .object({
    name: routineNameSchema,
    timeOfDay: z.enum(ROUTINE_TIME_OF_DAY),
    steps: routineStepsSchema,
  })
  .strict();

export const updateRoutineSchema = z
  .object({
    name: routineNameSchema.optional(),
    timeOfDay: z.enum(ROUTINE_TIME_OF_DAY).optional(),
    steps: routineStepsSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one Routine field is required.",
  });

export type RoutineStepInput = z.infer<typeof routineStepInputSchema>;
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
