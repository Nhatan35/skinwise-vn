import {
  getAIProvider,
  type AIProviderIngredientExplanationInput,
} from "@/infrastructure/ai";
import {
  INGREDIENT_EXPLANATION_BEGINNER_ADVICE,
  INGREDIENT_EXPLANATION_EDUCATIONAL_DISCLAIMER,
} from "@/modules/ingredients/ingredient-explanation.constants";
import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";
import { toIngredientExplanationDtoFromProvider } from "@/modules/ingredients/ingredient-explanation.mapper";
import type { IngredientExplanationRequestInput } from "@/modules/ingredients/ingredient-explanation.schema";

const FALLBACK_SIMPLE_EXPLANATION =
  "This ingredient may have skincare-related uses, but more context is needed.";

function buildFallbackIngredientExplanation(
  ingredientName: string,
): IngredientExplanationDto {
  return {
    ingredientName,
    simpleExplanation: FALLBACK_SIMPLE_EXPLANATION,
    commonUses: [],
    suitableFor: [],
    cautions: [
      "Patch test before regular use.",
      "Stop using if irritation occurs.",
    ],
    avoidWith: ["You have known sensitivity to this ingredient."],
    beginnerAdvice: INGREDIENT_EXPLANATION_BEGINNER_ADVICE,
    disclaimer: INGREDIENT_EXPLANATION_EDUCATIONAL_DISCLAIMER,
    source: "fallback",
  };
}

function buildProviderInput(
  input: IngredientExplanationRequestInput,
): AIProviderIngredientExplanationInput {
  const ingredientName = input.ingredientName.trim();

  return {
    ingredientName,
    ...(input.skinType ? { skinType: input.skinType } : {}),
    ...(input.concerns && input.concerns.length > 0
      ? { concerns: [...input.concerns] }
      : {}),
    locale: "vi-VN",
  };
}

export async function explainIngredient(
  input: IngredientExplanationRequestInput,
): Promise<IngredientExplanationDto> {
  const providerInput = buildProviderInput(input);

  try {
    const provider = getAIProvider();
    const providerResult = await provider.explainIngredient(providerInput);

    return toIngredientExplanationDtoFromProvider(providerResult);
  } catch {
    return buildFallbackIngredientExplanation(providerInput.ingredientName);
  }
}
