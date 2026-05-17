import type { RoutineLogStatus } from "@/modules/routine-logs/routine-log.types";

export type RoutineLogDto = {
  id: string;
  routineId: string;
  localDate: string;
  timezone: string;
  status: RoutineLogStatus;
  completedStepIds?: string[];
  note?: string;
  createdAt: string;
  updatedAt: string;
};
