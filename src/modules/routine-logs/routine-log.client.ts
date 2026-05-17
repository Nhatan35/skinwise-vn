import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { RoutineLogStatus } from "@/modules/routine-logs/routine-log.types";
import type { RoutineDto } from "@/modules/routines/routine.dto";

export type RoutineLogUpsertPayload = {
  routineId: string;
  localDate: string;
  timezone: string;
  status: RoutineLogStatus;
  completedStepIds: string[];
};

export class RoutineLogClientValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoutineLogClientValidationError";
  }
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function getBrowserLocalDate(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

export function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function groupRoutineLogsByRoutineId(routineLogs: RoutineLogDto[]) {
  return routineLogs.reduce<Record<string, RoutineLogDto>>(
    (logsByRoutineId, routineLog) => ({
      ...logsByRoutineId,
      [routineLog.routineId]: routineLog,
    }),
    {},
  );
}

export function getRoutineLogStatusLabel(status?: RoutineLogStatus) {
  if (status === "completed") {
    return "Hoàn thành";
  }

  if (status === "partial") {
    return "Một phần";
  }

  if (status === "skipped") {
    return "Bỏ qua";
  }

  return "Chưa ghi nhận";
}

export function getRoutineStepIds(routine: RoutineDto) {
  return routine.steps.map((step) => step.stepId);
}

export function getCompletedStepCount(
  routine: RoutineDto,
  log?: RoutineLogDto,
) {
  if (!log?.completedStepIds?.length) {
    return 0;
  }

  const routineStepIds = new Set(getRoutineStepIds(routine));

  return log.completedStepIds.filter((stepId) => routineStepIds.has(stepId))
    .length;
}

export function buildCompletedRoutineLogPayload(
  routine: RoutineDto,
  localDate: string,
  timezone: string,
): RoutineLogUpsertPayload {
  return {
    routineId: routine.id,
    localDate,
    timezone,
    status: "completed",
    completedStepIds: getRoutineStepIds(routine),
  };
}

export function buildSkippedRoutineLogPayload(
  routine: RoutineDto,
  localDate: string,
  timezone: string,
): RoutineLogUpsertPayload {
  return {
    routineId: routine.id,
    localDate,
    timezone,
    status: "skipped",
    completedStepIds: [],
  };
}

export function buildPartialRoutineLogPayload(
  routine: RoutineDto,
  selectedStepIds: string[],
  localDate: string,
  timezone: string,
): RoutineLogUpsertPayload {
  const routineStepIds = getRoutineStepIds(routine);
  const knownStepIds = new Set(routineStepIds);
  const uniqueSelectedStepIds = Array.from(new Set(selectedStepIds)).filter(
    (stepId) => knownStepIds.has(stepId),
  );

  if (routineStepIds.length < 2) {
    throw new RoutineLogClientValidationError(
      "Routine cần ít nhất 2 bước để ghi nhận một phần.",
    );
  }

  if (uniqueSelectedStepIds.length === 0) {
    throw new RoutineLogClientValidationError(
      "Vui lòng chọn ít nhất một bước đã hoàn thành.",
    );
  }

  if (uniqueSelectedStepIds.length >= routineStepIds.length) {
    throw new RoutineLogClientValidationError(
      "Nếu đã hoàn thành tất cả các bước, hãy chọn Hoàn thành.",
    );
  }

  return {
    routineId: routine.id,
    localDate,
    timezone,
    status: "partial",
    completedStepIds: uniqueSelectedStepIds,
  };
}
