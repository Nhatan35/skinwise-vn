import type {
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
  nextActions: DashboardNextAction[];
};
