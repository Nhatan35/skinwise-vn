import type { AIProviderIngredientExplanationResult } from "@/infrastructure/ai";
import {
  INGREDIENT_EXPLANATION_BEGINNER_ADVICE,
  INGREDIENT_EXPLANATION_EDUCATIONAL_DISCLAIMER,
} from "@/modules/ingredients/ingredient-explanation.constants";
import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";

export function toIngredientExplanationDtoFromProvider(
  providerResult: AIProviderIngredientExplanationResult,
): IngredientExplanationDto {
  return {
    ingredientName: providerResult.ingredientName,
    simpleExplanation: providerResult.shortExplanation,
    commonUses: [...providerResult.benefits],
    suitableFor: [...providerResult.suitableFor],
    cautions: [...providerResult.cautions],
    avoidWith: [...providerResult.notSuitableFor],
    beginnerAdvice: INGREDIENT_EXPLANATION_BEGINNER_ADVICE,
    disclaimer: INGREDIENT_EXPLANATION_EDUCATIONAL_DISCLAIMER,
    source: "ai",
  };
}
