import type { WithId } from "mongodb";

export const INGREDIENT_EVIDENCE_LEVELS = [
  "basic",
  "moderate",
  "strong",
  "uncertain",
] as const;

export type IngredientEvidenceLevel =
  (typeof INGREDIENT_EVIDENCE_LEVELS)[number];

export type IngredientDocument = {
  inciName: string;
  aliases: string[];
  functions: string[];
  commonUses: string[];
  suitableFor: string[];
  cautionFor: string[];
  avoidWith: string[];
  evidenceLevel: IngredientEvidenceLevel;
  sourceRefs: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Ingredient = WithId<IngredientDocument>;
