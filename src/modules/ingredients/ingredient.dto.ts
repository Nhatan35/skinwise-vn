import type {
  IngredientEvidenceLevel,
} from "@/modules/ingredients/ingredient.types";

export type IngredientDto = {
  id: string;
  inciName: string;
  aliases: string[];
  functions: string[];
  commonUses: string[];
  suitableFor: string[];
  cautionFor: string[];
  avoidWith: string[];
  evidenceLevel: IngredientEvidenceLevel;
  sourceRefs: string[];
  createdAt: string;
  updatedAt: string;
};
