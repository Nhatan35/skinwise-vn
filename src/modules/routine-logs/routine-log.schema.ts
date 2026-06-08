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

const routineLogDateRangeQuerySchema = z
  .object({
    from: routineLogLocalDateSchema,
    to: routineLogLocalDateSchema,
  })
  .strict()
  .refine((value) => value.from <= value.to, {
    message: "from must be before or equal to to.",
    path: ["from"],
  })
  .refine((value) => getDateRangeDayCount(value.from, value.to) <= 7, {
    message: "Date range must be 7 days or less.",
    path: ["to"],
  });

export const routineLogQuerySchema = z.union([
  routineLogDateQuerySchema,
  routineLogDateRangeQuerySchema,
]);

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
export type RoutineLogQueryInput = z.infer<typeof routineLogQuerySchema>;
export type UpsertRoutineLogInput = z.infer<typeof upsertRoutineLogSchema>;

function getDateRangeDayCount(from: string, to: string) {
  return getLocalDateDayNumber(to) - getLocalDateDayNumber(from) + 1;
}

function getLocalDateDayNumber(localDate: string) {
  const [year, month, day] = localDate.split("-").map(Number);

  return Date.UTC(year, month - 1, day) / 86_400_000;
}
