import type {
  RoutineAnalysisDto,
  RoutineAnalysisHistoryDto,
} from "@/modules/ai-analysis/routine-analysis.dto";
import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";

export function toRoutineAnalysisDto(
  analysis: RoutineAnalysis,
): RoutineAnalysisDto {
  return {
    analysisId: analysis._id.toString(),
    routineId: analysis.routineId.toString(),
    riskLevel: analysis.riskLevel,
    summary: analysis.aiResult.summary,
    positiveFindings: [...(analysis.aiResult.positiveFindings ?? [])],
    warnings: analysis.aiResult.warnings.map((warning) => ({ ...warning })),
    suggestions: analysis.aiResult.suggestions.map((suggestion) => ({
      ...suggestion,
    })),
    shouldSeeProfessional: analysis.aiResult.shouldSeeProfessional,
    disclaimer: analysis.aiResult.disclaimer,
    createdAt: analysis.createdAt.toISOString(),
  };
}

export function toRoutineAnalysisHistoryDto(
  analyses: RoutineAnalysis[],
): RoutineAnalysisHistoryDto {
  return {
    analyses: analyses.map(toRoutineAnalysisDto),
  };
}
