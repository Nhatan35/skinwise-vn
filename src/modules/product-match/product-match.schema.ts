import { z } from "zod";

export const PRODUCT_MATCH_DEFAULT_LIMIT = 12;
export const PRODUCT_MATCH_MAX_LIMIT = 24;

export const productMatchQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(PRODUCT_MATCH_MAX_LIMIT)
      .default(PRODUCT_MATCH_DEFAULT_LIMIT),
  })
  .strict();

export type ProductMatchQueryInput = z.infer<typeof productMatchQuerySchema>;
