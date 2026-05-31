import { toProductDto } from "@/modules/products/product.mapper";
import type { Product } from "@/modules/products/product.types";
import type { ProductMatchDto } from "@/modules/product-match/product-match.dto";
import type { ProductMatchScoringResult } from "@/modules/product-match/product-match.scoring";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

export function toProductMatchDto(input: {
  product: Product;
  scoring: ProductMatchScoringResult;
  isSaved: boolean;
}): ProductMatchDto {
  return {
    product: toProductDto(input.product),
    matchScore: input.scoring.matchScore,
    matchLevel: input.scoring.matchLevel,
    reasons: [...input.scoring.reasons],
    cautions: [...input.scoring.cautions],
    matchedSignals: {
      skinType: input.scoring.matchedSignals.skinType,
      concerns: [...input.scoring.matchedSignals.concerns],
      budget: input.scoring.matchedSignals.budget,
      sensitivity: input.scoring.matchedSignals.sensitivity,
      avoidedIngredients: [
        ...input.scoring.matchedSignals.avoidedIngredients,
      ],
    },
    isSaved: input.isSaved,
  };
}

export function toProductMatchSkinProfileSummary(profile: SkinProfile) {
  return {
    skinType: profile.skinType,
    concerns: [...profile.concerns],
    sensitivityLevel: profile.sensitivityLevel,
    budgetRange: profile.budgetRange,
    experienceLevel: profile.experienceLevel,
    avoidIngredientsCount: profile.avoidIngredients.length,
  };
}
