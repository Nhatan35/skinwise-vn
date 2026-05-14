import type { WithId } from "mongodb";

export const SKIN_TYPES = [
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
  "unknown",
] as const;

export const SKIN_CONCERNS = [
  "acne",
  "oiliness",
  "dryness",
  "redness",
  "dark_spots",
  "texture",
  "barrier_support",
  "unknown",
] as const;

export const SENSITIVITY_LEVELS = ["low", "medium", "high", "unknown"] as const;

export const BUDGET_RANGES = [
  "under_300k",
  "300k_700k",
  "700k_1500k",
  "above_1500k",
] as const;

export const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export type SkinType = (typeof SKIN_TYPES)[number];
export type SkinConcern = (typeof SKIN_CONCERNS)[number];
export type SensitivityLevel = (typeof SENSITIVITY_LEVELS)[number];
export type BudgetRange = (typeof BUDGET_RANGES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export type SkinProfileDocument = {
  userId: string;
  skinType: SkinType;
  concerns: SkinConcern[];
  sensitivityLevel: SensitivityLevel;
  budgetRange: BudgetRange;
  experienceLevel: ExperienceLevel;
  avoidIngredients: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type SkinProfile = WithId<SkinProfileDocument>;
