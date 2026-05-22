import type {
  AIRiskLevel,
  AIProviderRoutineAnalysisResult,
} from "@/infrastructure/ai/ai-provider";
import { ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER } from "@/modules/ai-analysis/routine-analysis.constants";
import type {
  RoutineAnalysisResult,
  RoutineAnalysisSuggestionPriority,
} from "@/modules/ai-analysis/routine-analysis.types";

const AI_PROVIDER_WARNING_CODE = "AI_PROVIDER_WARNING";
const AI_PROVIDER_WARNING_REASON =
  "This warning was generated from validated AI provider output and should be reviewed as educational guidance.";
const AI_PROVIDER_RECOMMENDATION_TITLE = "AI recommendation";

function toSuggestionPriority(
  riskLevel: AIRiskLevel,
): RoutineAnalysisSuggestionPriority {
  if (riskLevel === "high") {
    return "must_fix";
  }

  if (riskLevel === "medium") {
    return "should_fix";
  }

  return "optional";
}

export function mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
  providerResult: AIProviderRoutineAnalysisResult,
): RoutineAnalysisResult {
  const riskLevel = providerResult.overallRiskLevel;
  const suggestionPriority = toSuggestionPriority(riskLevel);

  return {
    riskLevel,
    summary: providerResult.summary,
    warnings: providerResult.warnings.map((warning) => ({
      code: AI_PROVIDER_WARNING_CODE,
      severity: riskLevel,
      message: warning,
      reason: AI_PROVIDER_WARNING_REASON,
    })),
    suggestions: providerResult.recommendations.map((recommendation) => ({
      title: AI_PROVIDER_RECOMMENDATION_TITLE,
      description: recommendation,
      priority: suggestionPriority,
    })),
    shouldSeeProfessional: riskLevel === "high",
    disclaimer: ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER,
  };
}
