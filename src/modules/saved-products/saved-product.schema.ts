import { z } from "zod";

import { validateSavedProductTags } from "@/modules/saved-products/saved-product-tags";
import {
  SAVED_PRODUCT_DECISION_STATUSES,
  SAVED_PRODUCT_PLANNED_ROUTINE_SLOTS,
} from "@/modules/saved-products/saved-product.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;
const personalNoteSchema = z.string().trim().max(1000);
const savedProductTagsSchema = z.array(z.string()).transform((value, ctx) => {
  const result = validateSavedProductTags(value);

  if (!result.ok) {
    ctx.addIssue({
      code: "custom",
      message: result.error,
    });

    return z.NEVER;
  }

  return result.tags;
});

export const savedProductObjectIdSchema = z
  .string()
  .trim()
  .regex(mongoObjectIdPattern, {
    message: "productId must be a valid MongoDB ObjectId.",
  });

export const saveProductBodySchema = z
  .object({
    productId: savedProductObjectIdSchema,
  })
  .strict();

export const savedProductRouteParamsSchema = z
  .object({
    productId: savedProductObjectIdSchema,
  })
  .strict();

export const updateSavedProductMetadataBodySchema = z
  .object({
    decisionStatus: z.enum(SAVED_PRODUCT_DECISION_STATUSES).optional(),
    plannedRoutineSlot: z
      .enum(SAVED_PRODUCT_PLANNED_ROUTINE_SLOTS)
      .optional(),
    personalNote: personalNoteSchema.optional(),
    tags: savedProductTagsSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one saved product metadata field is required.",
  });

export type SaveProductBodyInput = z.infer<typeof saveProductBodySchema>;
export type SavedProductRouteParamsInput = z.infer<
  typeof savedProductRouteParamsSchema
>;
export type UpdateSavedProductMetadataInput = z.infer<
  typeof updateSavedProductMetadataBodySchema
>;
