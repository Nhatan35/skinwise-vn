import "server-only";

import { z } from "zod";

const aiRiskLevelSchema = z.enum(["low", "medium", "high"]);

const shortTextSchema = z.string().min(1).max(300);
const mediumTextSchema = z.string().min(1).max(600);

export const aiProviderMetadataSchema = z
  .object({
    provider: z.string().min(1).max(80),
    model: z.string().min(1).max(120),
    generatedAt: z.string().datetime(),
    isMock: z.boolean(),
  })
  .strict();

export const aiProviderRoutineAnalysisResultSchema = z
  .object({
    summary: z.string().min(1).max(800),
    overallRiskLevel: aiRiskLevelSchema,
    warnings: z.array(shortTextSchema).max(10),
    recommendations: z.array(mediumTextSchema).max(10),
    educationalNotes: z.array(mediumTextSchema).max(10),
    providerMetadata: aiProviderMetadataSchema,
  })
  .strict();

export const aiProviderIngredientExplanationResultSchema = z
  .object({
    ingredientName: z.string().min(1).max(160),
    shortExplanation: z.string().min(1).max(800),
    benefits: z.array(shortTextSchema).max(8),
    cautions: z.array(shortTextSchema).max(8),
    suitableFor: z.array(shortTextSchema).max(8),
    notSuitableFor: z.array(shortTextSchema).max(8),
    educationalNotes: z.array(mediumTextSchema).max(8),
    providerMetadata: aiProviderMetadataSchema,
  })
  .strict();

export const aiProviderSafetyClassifierResultSchema = z
  .object({
    isAllowed: z.boolean(),
    category: z.string().min(1).max(120),
    reason: mediumTextSchema,
    severity: aiRiskLevelSchema,
    providerMetadata: aiProviderMetadataSchema,
  })
  .strict();
