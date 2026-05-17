import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { RoutineLog } from "@/modules/routine-logs/routine-log.types";

export function toRoutineLogDto(routineLog: RoutineLog): RoutineLogDto {
  return {
    id: routineLog._id.toString(),
    routineId: routineLog.routineId,
    localDate: routineLog.localDate,
    timezone: routineLog.timezone,
    status: routineLog.status,
    ...(routineLog.completedStepIds
      ? { completedStepIds: [...routineLog.completedStepIds] }
      : {}),
    ...(routineLog.note ? { note: routineLog.note } : {}),
    createdAt: routineLog.createdAt.toISOString(),
    updatedAt: routineLog.updatedAt.toISOString(),
  };
}
