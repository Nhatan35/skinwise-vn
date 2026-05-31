import type { ProductDto } from "@/modules/products/product.dto";
import type {
  BudgetRange,
  ExperienceLevel,
  SensitivityLevel,
  SkinConcern,
  SkinType,
} from "@/modules/skin-profile/skin-profile.types";

export type ProductMatchLevel = "strong" | "good" | "cautious" | "low";

export type ProductMatchDto = {
  product: ProductDto;
  matchScore: number;
  matchLevel: ProductMatchLevel;
  reasons: string[];
  cautions: string[];
  matchedSignals: {
    skinType: boolean;
    concerns: SkinConcern[];
    budget: boolean;
    sensitivity: boolean;
    avoidedIngredients: string[];
  };
  isSaved: boolean;
};

export type ProductMatchSkinProfileSummaryDto = {
  skinType: SkinType;
  concerns: SkinConcern[];
  sensitivityLevel: SensitivityLevel;
  budgetRange: BudgetRange;
  experienceLevel: ExperienceLevel;
  avoidIngredientsCount: number;
};

export type ProductMatchResponseDto = {
  skinProfileExists: boolean;
  generatedAt: string;
  skinProfileSummary?: ProductMatchSkinProfileSummaryDto;
  items: ProductMatchDto[];
};
