import { z, ZodError } from "zod";

import {
  SKIN_CONCERNS,
  SKIN_TYPES,
} from "@/modules/skin-profile/skin-profile.types";

export const ingredientExplanationRequestSchema = z
  .object({
    ingredientName: z.string().trim().min(1).max(160),
    skinType: z.enum(SKIN_TYPES).optional(),
    concerns: z.array(z.enum(SKIN_CONCERNS)).max(8).optional(),
  })
  .strict();

export type IngredientExplanationRequestInput = z.infer<
  typeof ingredientExplanationRequestSchema
>;

export function parseIngredientExplanationRequestText(
  requestText: string,
): IngredientExplanationRequestInput {
  try {
    return ingredientExplanationRequestSchema.parse(JSON.parse(requestText));
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }

    throw new ZodError([]);
  }
}
