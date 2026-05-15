import type { ObjectId, WithId } from "mongodb";

import type {
  RoutineSafetyRiskLevel,
  RoutineSafetyRuleResult,
} from "@/domain/routine-safety";
import type {
  RoutineStep,
  RoutineTimeOfDay,
} from "@/modules/routines/routine.types";

export const ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER = "deterministic";
export const ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME = "routine-safety-engine";
export const ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION =
  "routine-analysis-fallback-v1";

export type RoutineAnalysisSuggestionPriority =
  | "must_fix"
  | "should_fix"
  | "optional";

export type RoutineAnalysisWarning = {
  code: string;
  severity: "low" | "medium" | "high";
  message: string;
  reason: string;
};

export type RoutineAnalysisSuggestion = {
  title: string;
  description: string;
  priority: RoutineAnalysisSuggestionPriority;
};

export type RoutineAnalysisResult = {
  riskLevel: RoutineSafetyRiskLevel;
  summary: string;
  warnings: RoutineAnalysisWarning[];
  suggestions: RoutineAnalysisSuggestion[];
  shouldSeeProfessional: boolean;
  disclaimer: string;
};

export type RoutineAnalysisAiStatus = "fallback_used";

export type RoutineAnalysisSnapshot = {
  name: string;
  timeOfDay: RoutineTimeOfDay;
  steps: RoutineStep[];
};

export type RoutineAnalysisDocument = {
  userId: string;
  routineId: ObjectId;
  routineSnapshot: RoutineAnalysisSnapshot;
  riskLevel: RoutineSafetyRiskLevel;
  ruleResults: RoutineSafetyRuleResult[];
  aiResult: RoutineAnalysisResult;
  aiStatus: RoutineAnalysisAiStatus;
  modelProvider: typeof ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER;
  modelName: typeof ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME;
  promptVersion: typeof ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION;
  createdAt: Date;
};

export type RoutineAnalysis = WithId<RoutineAnalysisDocument>;

export type CreateRoutineAnalysisInput = Omit<
  RoutineAnalysisDocument,
  "userId" | "createdAt"
>;
