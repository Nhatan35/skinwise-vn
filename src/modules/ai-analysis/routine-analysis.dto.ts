import type { RoutineSafetyRiskLevel } from "@/domain/routine-safety";
import type {
  RoutineAnalysisSuggestionPriority,
} from "@/modules/ai-analysis/routine-analysis.types";

export type RoutineAnalysisWarningDto = {
  code: string;
  severity: "low" | "medium" | "high";
  message: string;
  reason: string;
};

export type RoutineAnalysisSuggestionDto = {
  title: string;
  description: string;
  priority: RoutineAnalysisSuggestionPriority;
};

export type RoutineAnalysisDto = {
  analysisId: string;
  routineId: string;
  riskLevel: RoutineSafetyRiskLevel;
  summary: string;
  positiveFindings: string[];
  warnings: RoutineAnalysisWarningDto[];
  suggestions: RoutineAnalysisSuggestionDto[];
  shouldSeeProfessional: boolean;
  disclaimer: string;
  createdAt: string;
};

export type RoutineAnalysisHistoryDto = {
  analyses: RoutineAnalysisDto[];
};
