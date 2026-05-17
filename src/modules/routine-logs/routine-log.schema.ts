import { z } from "zod";

import { ROUTINE_LOG_STATUSES } from "@/modules/routine-logs/routine-log.types";

const localDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const routineLogLocalDateSchema = z.string().regex(localDatePattern, {
  message: "localDate must use YYYY-MM-DD format.",
});

export const routineLogDateQuerySchema = z
  .object({
    localDate: routineLogLocalDateSchema,
  })
  .strict();

export const upsertRoutineLogSchema = z
  .object({
    routineId: z.string().trim().min(1),
    localDate: routineLogLocalDateSchema,
    timezone: z.string().trim().min(1),
    status: z.enum(ROUTINE_LOG_STATUSES),
    completedStepIds: z.array(z.string().trim().min(1)).optional(),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

export type RoutineLogDateQueryInput = z.infer<
  typeof routineLogDateQuerySchema
>;
export type UpsertRoutineLogInput = z.infer<typeof upsertRoutineLogSchema>;
