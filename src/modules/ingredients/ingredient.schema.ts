import { z } from "zod";

import { INGREDIENT_EVIDENCE_LEVELS } from "@/modules/ingredients/ingredient.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;
const ingredientNameSchema = z.string().trim().min(1).max(160);
const ingredientArrayItemSchema = z.string().trim().max(240);
const sourceRefItemSchema = z.string().trim().max(500);

function lineItemArraySchema(itemSchema: z.ZodString) {
  return z
    .array(itemSchema)
    .max(50)
    .transform((items) => items.map((item) => item.trim()).filter(Boolean))
    .pipe(z.array(itemSchema.min(1)).max(50));
}

const ingredientStringArraySchema = lineItemArraySchema(
  ingredientArrayItemSchema,
);
const ingredientSourceRefsSchema = lineItemArraySchema(sourceRefItemSchema);

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

export const adminIngredientListQuerySchema = ingredientListQuerySchema;

export const ingredientRouteParamsSchema = z
  .object({
    id: z.string().regex(mongoObjectIdPattern),
  })
  .strict();

export const adminCreateIngredientBodySchema = z
  .object({
    aliases: ingredientStringArraySchema.default([]),
    avoidWith: ingredientStringArraySchema.default([]),
    cautionFor: ingredientStringArraySchema.default([]),
    commonUses: ingredientStringArraySchema.default([]),
    evidenceLevel: z.enum(INGREDIENT_EVIDENCE_LEVELS),
    functions: ingredientStringArraySchema.default([]),
    inciName: ingredientNameSchema,
    sourceRefs: ingredientSourceRefsSchema.default([]),
    suitableFor: ingredientStringArraySchema.default([]),
  })
  .strict();

export const adminUpdateIngredientBodySchema = z
  .object({
    aliases: ingredientStringArraySchema.optional(),
    avoidWith: ingredientStringArraySchema.optional(),
    cautionFor: ingredientStringArraySchema.optional(),
    commonUses: ingredientStringArraySchema.optional(),
    evidenceLevel: z.enum(INGREDIENT_EVIDENCE_LEVELS).optional(),
    functions: ingredientStringArraySchema.optional(),
    inciName: ingredientNameSchema.optional(),
    sourceRefs: ingredientSourceRefsSchema.optional(),
    suitableFor: ingredientStringArraySchema.optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one ingredient field must be provided.",
  });

export type AdminIngredientListQueryInput = z.infer<
  typeof adminIngredientListQuerySchema
>;
export type AdminCreateIngredientBodyInput = z.infer<
  typeof adminCreateIngredientBodySchema
>;
export type AdminUpdateIngredientBodyInput = z.infer<
  typeof adminUpdateIngredientBodySchema
>;
