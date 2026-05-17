import type { RoutineSafetyRiskLevel } from "@/domain/routine-safety";
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

export type DashboardNextActionPriority = "high" | "medium" | "low";

export type DashboardNextAction = {
  label: string;
  href: string;
  priority: DashboardNextActionPriority;
};
