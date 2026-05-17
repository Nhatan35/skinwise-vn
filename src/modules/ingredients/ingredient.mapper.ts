import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import type { Ingredient } from "@/modules/ingredients/ingredient.types";

export function toIngredientDto(ingredient: Ingredient): IngredientDto {
  return {
    id: ingredient._id.toString(),
    inciName: ingredient.inciName,
    aliases: [...ingredient.aliases],
    functions: [...ingredient.functions],
    commonUses: [...ingredient.commonUses],
    suitableFor: [...ingredient.suitableFor],
    cautionFor: [...ingredient.cautionFor],
    avoidWith: [...ingredient.avoidWith],
    evidenceLevel: ingredient.evidenceLevel,
    sourceRefs: [...ingredient.sourceRefs],
    createdAt: ingredient.createdAt.toISOString(),
    updatedAt: ingredient.updatedAt.toISOString(),
  };
}
