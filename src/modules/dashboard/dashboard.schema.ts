import { z } from "zod";

import { routineLogLocalDateSchema } from "@/modules/routine-logs/routine-log.schema";

export const dashboardQuerySchema = z
  .object({
    localDate: routineLogLocalDateSchema,
  })
  .strict();

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
