import type {
  BudgetRange,
  ExperienceLevel,
  SensitivityLevel,
  SkinConcern,
  SkinType,
} from "@/modules/skin-profile/skin-profile.types";

export type SkinProfileDto = {
  id: string;
  skinType: SkinType;
  concerns: SkinConcern[];
  sensitivityLevel: SensitivityLevel;
  budgetRange: BudgetRange;
  experienceLevel: ExperienceLevel;
  avoidIngredients: string[];
  createdAt: string;
  updatedAt: string;
};
