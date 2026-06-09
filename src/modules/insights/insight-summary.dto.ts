export type InsightSummaryDto = {
  hasEnoughData: boolean;
  insufficientDataReasons: string[];
  routineConsistency: {
    periodDays: number;
    completedDays: number;
    partialDays: number;
    missingDays: number;
    noRoutineConfigured: boolean;
    summaryText: string;
    helperText: string;
  };
  symptomFrequency: {
    periodDays: number;
    topSymptoms: Array<{
      label: string;
      count: number;
    }>;
    summaryText: string;
    helperText: string;
  };
  stressReflection: {
    periodDays: number;
    highStressCount: number;
    mediumStressCount: number;
    lowStressCount: number;
    summaryText: string;
    helperText: string;
  };
  productMentionPattern: {
    periodDays: number;
    topProducts: Array<{
      name: string;
      brand?: string;
      count: number;
    }>;
    summaryText: string;
    helperText: string;
  };
  safetyNote: string;
};
