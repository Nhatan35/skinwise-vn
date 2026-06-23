import type {
  DashboardLatestJournalSummary,
  DashboardJournalTrendSummary,
  DashboardLatestRoutineAnalysisSummary,
  DashboardNextAction,
  DashboardProfileCompletionSummary,
  DashboardRoutineCoverageSummary,
  DashboardRoutineConsistencySummary,
  DashboardRoutineSummary,
  DashboardSavedProductDecisionQueueSummary,
  DashboardSavedProductTagsSummary,
  DashboardSavedProductsSummary,
  DashboardSkinProfileSummary,
  DashboardTodayRoutineLogsSummary,
} from "@/modules/dashboard/dashboard.types";

export type DashboardDto = {
  skinProfile: DashboardSkinProfileSummary;
  routines: DashboardRoutineSummary;
  routineCoverage: DashboardRoutineCoverageSummary;
  todayRoutineLogs: DashboardTodayRoutineLogsSummary;
  latestRoutineAnalysis: DashboardLatestRoutineAnalysisSummary;
  latestJournal: DashboardLatestJournalSummary;
  profileCompletion: DashboardProfileCompletionSummary;
  savedProducts: DashboardSavedProductsSummary;
  savedProductTags: DashboardSavedProductTagsSummary;
  savedProductDecisionQueue: DashboardSavedProductDecisionQueueSummary;
  routineConsistency: DashboardRoutineConsistencySummary;
  journalTrend: DashboardJournalTrendSummary;
  nextActions: DashboardNextAction[];
};
