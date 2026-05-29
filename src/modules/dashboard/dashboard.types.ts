import type { RoutineSafetyRiskLevel } from "@/domain/routine-safety";
import type {
  SkinJournalStressLevel,
  SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";
import type {
  SensitivityLevel,
  SkinConcern,
  SkinType,
} from "@/modules/skin-profile/skin-profile.types";

export type DashboardSkinProfileSummary =
  | {
      exists: true;
      skinType: SkinType;
      concerns: SkinConcern[];
      sensitivityLevel: SensitivityLevel;
      updatedAt: string;
    }
  | {
      exists: false;
    };

export type DashboardRoutineSummary = {
  total: number;
  morning: number;
  evening: number;
  hasAnyRoutine: boolean;
};

export type DashboardTodayRoutineLogsSummary = {
  localDate: string;
  totalRoutines: number;
  completed: number;
  partial: number;
  skipped: number;
  notLogged: number;
  completionRate: number;
};

export type DashboardLatestRoutineAnalysisSummary =
  | {
      exists: true;
      routineId: string;
      routineName: string;
      riskLevel: RoutineSafetyRiskLevel;
      warningCount: number;
      createdAt: string;
    }
  | {
      exists: false;
    };

export type DashboardLatestJournalSummary =
  | {
      exists: true;
      id: string;
      localDate: string;
      observations: string[];
      symptoms: SkinJournalSymptom[];
      stressLevel?: SkinJournalStressLevel;
      notesPreview?: string;
      productsUsedCount: number;
      createdAt: string;
      updatedAt: string;
    }
  | {
      exists: false;
    };

export type DashboardProfileCompletionSummary = {
  percentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
};

export type DashboardSavedProductsSummary = {
  count: number;
};

export type DashboardRoutineConsistencyLabel =
  | "needs_attention"
  | "building"
  | "good"
  | "excellent";

export type DashboardRoutineConsistencyLevel =
  | "not_started"
  | "building"
  | "consistent";

export type DashboardRoutineConsistencySummary = {
  completedDays: number;
  totalDays: 7;
  rate: number;
  label: DashboardRoutineConsistencyLabel;
  windowDays: 7;
  maintainedDays: number;
  currentStreak: number;
  hasRecentLogs: boolean;
  level: DashboardRoutineConsistencyLevel;
  message: string;
  nextAction: string;
};

export type DashboardJournalTrendStatus = "not_enough_data" | "available";

export type DashboardJournalTrendSummary = {
  recentEntries: number;
  mostCommonSymptom?: SkinJournalSymptom;
  status: DashboardJournalTrendStatus;
  windowDays: 14;
  entriesWithSymptomsCount: number;
  mostCommonSymptomCount: number;
  hasEnoughData: boolean;
  message: string;
  nextAction: string;
  disclaimer: string;
};

export type DashboardNextActionPriority = "high" | "medium" | "low";

export type DashboardNextAction = {
  label: string;
  href: string;
  priority: DashboardNextActionPriority;
};
