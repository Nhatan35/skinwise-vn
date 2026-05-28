import type {
  DashboardLatestJournalSummary,
  DashboardJournalTrendSummary,
  DashboardLatestRoutineAnalysisSummary,
  DashboardNextAction,
  DashboardProfileCompletionSummary,
  DashboardRoutineConsistencySummary,
  DashboardRoutineSummary,
  DashboardSavedProductsSummary,
  DashboardSkinProfileSummary,
  DashboardTodayRoutineLogsSummary,
} from "@/modules/dashboard/dashboard.types";

export type DashboardDto = {
  skinProfile: DashboardSkinProfileSummary;
  routines: DashboardRoutineSummary;
  todayRoutineLogs: DashboardTodayRoutineLogsSummary;
  latestRoutineAnalysis: DashboardLatestRoutineAnalysisSummary;
  latestJournal: DashboardLatestJournalSummary;
  profileCompletion: DashboardProfileCompletionSummary;
  savedProducts: DashboardSavedProductsSummary;
  routineConsistency: DashboardRoutineConsistencySummary;
  journalTrend: DashboardJournalTrendSummary;
  nextActions: DashboardNextAction[];
};
