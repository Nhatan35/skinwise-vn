import "server-only";

export type AIRiskLevel = "low" | "medium" | "high";

export type AISafetySeverity = "low" | "medium" | "high";

export type AISafetyContextType =
  | "routine"
  | "ingredient"
  | "skin_profile"
  | "general";

export type AIProviderMetadata = {
  provider: string;
  model: string;
  generatedAt: string;
  isMock: boolean;
};

export type AIProviderRoutineStepInput = {
  stepOrder: number;
  productName?: string;
  productCategory?: string;
  ingredients?: string[];
  instructions?: string;
};

export type AIProviderSkinProfileContext = {
  skinType?: string;
  sensitivityLevel?: string;
  concerns?: string[];
  experienceLevel?: string;
};

export type AIProviderRoutineAnalysisInput = {
  routineId: string;
  routineName: string;
  timeOfDay: "morning" | "evening" | "weekly" | "anytime";
  steps: AIProviderRoutineStepInput[];
  skinProfile?: AIProviderSkinProfileContext;
  locale?: string;
};

export type AIProviderRoutineAnalysisResult = {
  summary: string;
  overallRiskLevel: AIRiskLevel;
  warnings: string[];
  recommendations: string[];
  educationalNotes: string[];
  providerMetadata: AIProviderMetadata;
};

export type AIProviderIngredientExplanationInput = {
  ingredientName: string;
  skinType?: string;
  concerns?: string[];
  locale?: string;
};

export type AIProviderIngredientExplanationResult = {
  ingredientName: string;
  shortExplanation: string;
  benefits: string[];
  cautions: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  educationalNotes: string[];
  providerMetadata: AIProviderMetadata;
};

export type AIProviderSafetyClassifierInput = {
  text: string;
  contextType: AISafetyContextType;
};

export type AIProviderSafetyClassifierResult = {
  isAllowed: boolean;
  category: string;
  reason: string;
  severity: AISafetySeverity;
  providerMetadata: AIProviderMetadata;
};

export interface AIProvider {
  analyzeRoutine(
    input: AIProviderRoutineAnalysisInput,
  ): Promise<AIProviderRoutineAnalysisResult>;

  explainIngredient(
    input: AIProviderIngredientExplanationInput,
  ): Promise<AIProviderIngredientExplanationResult>;

  classifySafety(
    input: AIProviderSafetyClassifierInput,
  ): Promise<AIProviderSafetyClassifierResult>;
}
