import type {
  DashboardLatestJournalSummary,
  DashboardLatestRoutineAnalysisSummary,
  DashboardNextAction,
  DashboardRoutineSummary,
  DashboardSkinProfileSummary,
  DashboardTodayRoutineLogsSummary,
} from "@/modules/dashboard/dashboard.types";

export type DashboardDto = {
  skinProfile: DashboardSkinProfileSummary;
  routines: DashboardRoutineSummary;
  todayRoutineLogs: DashboardTodayRoutineLogsSummary;
  latestRoutineAnalysis: DashboardLatestRoutineAnalysisSummary;
  latestJournal: DashboardLatestJournalSummary;
  nextActions: DashboardNextAction[];
};
