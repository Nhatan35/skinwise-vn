import { z } from "zod";

export const ingredientListQuerySchema = z
  .object({
    q: z.string().trim().max(160).optional(),
    function: z.string().trim().max(80).optional(),
    limit: z.coerce.number().int().positive().max(50).default(20),
  })
  .strict();

export type IngredientListQueryInput = z.infer<
  typeof ingredientListQuerySchema
>;
