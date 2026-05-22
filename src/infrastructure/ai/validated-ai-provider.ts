import "server-only";

import type {
  AIProvider,
  AIProviderIngredientExplanationInput,
  AIProviderIngredientExplanationResult,
  AIProviderRoutineAnalysisInput,
  AIProviderRoutineAnalysisResult,
  AIProviderSafetyClassifierInput,
  AIProviderSafetyClassifierResult,
} from "@/infrastructure/ai/ai-provider";
import {
  validateIngredientExplanationOutput,
  validateRoutineAnalysisOutput,
  validateSafetyClassifierOutput,
} from "@/infrastructure/ai/ai-output.validator";

export class ValidatedAIProvider implements AIProvider {
  constructor(private readonly innerProvider: AIProvider) {}

  async analyzeRoutine(
    input: AIProviderRoutineAnalysisInput,
  ): Promise<AIProviderRoutineAnalysisResult> {
    const output = await this.innerProvider.analyzeRoutine(input);

    return validateRoutineAnalysisOutput(output);
  }

  async explainIngredient(
    input: AIProviderIngredientExplanationInput,
  ): Promise<AIProviderIngredientExplanationResult> {
    const output = await this.innerProvider.explainIngredient(input);

    return validateIngredientExplanationOutput(output);
  }

  async classifySafety(
    input: AIProviderSafetyClassifierInput,
  ): Promise<AIProviderSafetyClassifierResult> {
    const output = await this.innerProvider.classifySafety(input);

    return validateSafetyClassifierOutput(output);
  }
}
