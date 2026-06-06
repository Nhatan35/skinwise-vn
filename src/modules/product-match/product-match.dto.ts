import type { ProductDto } from "@/modules/products/product.dto";
import type {
  BudgetRange,
  ExperienceLevel,
  SensitivityLevel,
  SkinConcern,
  SkinType,
} from "@/modules/skin-profile/skin-profile.types";

export type ProductMatchLevel = "strong" | "good" | "cautious" | "low";

export type ProductMatchExplanationReason = {
  type: string;
  message: string;
  relatedIngredients?: string[];
  relatedConcerns?: SkinConcern[];
};

export type ProductMatchIngredientHighlight = {
  ingredientName: string;
  effect: "positive" | "caution" | "neutral";
  reason: string;
};

export type ProductMatchExplanationDto = {
  summary: string;
  positiveReasons: ProductMatchExplanationReason[];
  cautionReasons: ProductMatchExplanationReason[];
  ingredientHighlights: ProductMatchIngredientHighlight[];
  usageNote: string;
  dataQualityNotes?: string[];
};

export type ProductMatchDto = {
  product: ProductDto;
  matchScore: number;
  matchLevel: ProductMatchLevel;
  reasons: string[];
  cautions: string[];
  matchedSignals: {
    skinType: boolean;
    skinTypes?: SkinType[];
    concerns: SkinConcern[];
    budget: boolean;
    sensitivity: boolean;
    avoidedIngredients: string[];
  };
  isSaved: boolean;
  matchExplanation?: ProductMatchExplanationDto;
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

export type ProductMatchUnavailableReason =
  | "NO_SKIN_PROFILE"
  | "NO_INGREDIENT_DATA"
  | "MATCH_UNAVAILABLE";

export type ProductDetailMatchResponseDto =
  | {
      productId: string;
      matchAvailable: true;
      skinProfileExists: true;
      match: ProductMatchDto;
    }
  | {
      productId: string;
      matchAvailable: false;
      skinProfileExists: boolean;
      matchUnavailableReason: ProductMatchUnavailableReason;
      matchExplanation: ProductMatchExplanationDto;
    };
