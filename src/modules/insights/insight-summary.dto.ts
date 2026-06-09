export type InsightCalculationMetaDto = {
  periodDays: number;
  dataSourceLabel: string;
  calculationLabel: string;
  safetyText: string;
};

export type TrackingQualityStatus =
  | "available"
  | "limited"
  | "not_enough_data"
  | "not_configured";

export type TrackingQualityChecklistItemKey =
  | "routine_logs"
  | "journal_entries"
  | "symptom_notes"
  | "stress_notes"
  | "product_mentions";

export type TrackingQualityChecklistItemDto = {
  key: TrackingQualityChecklistItemKey;
  label: string;
  status: TrackingQualityStatus;
  count: number;
  periodDays: number;
  helperText: string;
};

export type TrackingQualityChecklistDto = {
  routinePeriodDays: 7;
  journalPeriodDays: 30;
  checklistItems: TrackingQualityChecklistItemDto[];
  summaryText: string;
  safetyNote: string;
};

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
    calculationMeta: InsightCalculationMetaDto;
  };
  symptomFrequency: {
    periodDays: number;
    topSymptoms: Array<{
      label: string;
      count: number;
    }>;
    summaryText: string;
    helperText: string;
    calculationMeta: InsightCalculationMetaDto;
  };
  stressReflection: {
    periodDays: number;
    highStressCount: number;
    mediumStressCount: number;
    lowStressCount: number;
    summaryText: string;
    helperText: string;
    calculationMeta: InsightCalculationMetaDto;
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
    calculationMeta: InsightCalculationMetaDto;
  };
  trackingQualityChecklist: TrackingQualityChecklistDto;
  safetyNote: string;
};
