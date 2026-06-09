import { z } from "zod";

import { insightsLocalDateSchema } from "@/modules/insights/insights.schema";

export const insightSummaryQuerySchema = z
  .object({
    to: insightsLocalDateSchema.optional(),
  })
  .strict();

export type InsightSummaryQueryInput = z.infer<
  typeof insightSummaryQuerySchema
>;
