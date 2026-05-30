import type { SkinJournalSymptom } from "@/modules/journals/skin-journal.types";

export type InsightsDayStatus = "completed" | "partial" | "skipped" | "not_logged";
export type InsightsNextActionPriority = "high" | "medium" | "low";

export type InsightsDto = {
  dateRange: {
    from: string;
    to: string;
    totalDays: number;
  };
  routineConsistency: {
    totalRoutineSlots: number;
    completedRoutineSlots: number;
    partialRoutineSlots: number;
    skippedRoutineSlots: number;
    notLoggedRoutineSlots: number;
    completionRate: number;
    maintainedDays: number;
    currentStreak: number;
    bestStreak: number;
  };
  journalActivity: {
    totalEntries: number;
    activeJournalDays: number;
    mostCommonSymptoms: {
      symptom: SkinJournalSymptom;
      count: number;
    }[];
  };
  productUsage: {
    mostUsedProducts: {
      productId: string;
      name: string;
      brand?: string;
      count: number;
    }[];
  };
  calendarDays: {
    localDate: string;
    routineSummary: {
      totalRoutines: number;
      completed: number;
      partial: number;
      skipped: number;
      notLogged: number;
      dayStatus: InsightsDayStatus;
    };
    hasJournalEntry: boolean;
    symptoms: SkinJournalSymptom[];
  }[];
  nextActions: {
    label: string;
    description?: string;
    href: string;
    priority: InsightsNextActionPriority;
  }[];
};
