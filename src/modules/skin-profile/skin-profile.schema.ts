import { z } from "zod";

import {
  BUDGET_RANGES,
  EXPERIENCE_LEVELS,
  SENSITIVITY_LEVELS,
  SKIN_CONCERNS,
  SKIN_TYPES,
} from "@/modules/skin-profile/skin-profile.types";

const avoidIngredientsSchema = z.array(z.string()).max(30);

export const createSkinProfileSchema = z
  .object({
    skinType: z.enum(SKIN_TYPES),
    concerns: z.array(z.enum(SKIN_CONCERNS)).min(1),
    sensitivityLevel: z.enum(SENSITIVITY_LEVELS),
    budgetRange: z.enum(BUDGET_RANGES),
    experienceLevel: z.enum(EXPERIENCE_LEVELS),
    avoidIngredients: avoidIngredientsSchema.default([]),
  })
  .strict();

export const updateSkinProfileSchema = z
  .object({
    skinType: z.enum(SKIN_TYPES).optional(),
    concerns: z.array(z.enum(SKIN_CONCERNS)).min(1).optional(),
    sensitivityLevel: z.enum(SENSITIVITY_LEVELS).optional(),
    budgetRange: z.enum(BUDGET_RANGES).optional(),
    experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
    avoidIngredients: avoidIngredientsSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one SkinProfile field is required.",
  });

export type CreateSkinProfileInput = z.infer<typeof createSkinProfileSchema>;
export type UpdateSkinProfileInput = z.infer<typeof updateSkinProfileSchema>;
