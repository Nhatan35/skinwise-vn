export type IngredientExplanationSource = "ai" | "fallback";

export type IngredientExplanationDto = {
  ingredientName: string;
  simpleExplanation: string;
  commonUses: string[];
  suitableFor: string[];
  cautions: string[];
  avoidWith: string[];
  beginnerAdvice: string;
  disclaimer: string;
  source: IngredientExplanationSource;
};
