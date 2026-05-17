import type { WithId } from "mongodb";

export const ROUTINE_LOG_STATUSES = [
  "completed",
  "partial",
  "skipped",
] as const;

export type RoutineLogStatus = (typeof ROUTINE_LOG_STATUSES)[number];

export type RoutineLogDocument = {
  userId: string;
  routineId: string;
  localDate: string;
  timezone: string;
  status: RoutineLogStatus;
  completedStepIds?: string[];
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RoutineLog = WithId<RoutineLogDocument>;

export type RoutineLogPersistenceInput = {
  routineId: string;
  localDate: string;
  timezone: string;
  status: RoutineLogStatus;
  completedStepIds?: string[];
  note?: string;
};
