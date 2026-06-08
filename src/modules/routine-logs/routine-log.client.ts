import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { RoutineLogStatus } from "@/modules/routine-logs/routine-log.types";
import type { RoutineDto } from "@/modules/routines/routine.dto";

const ROUTINE_LOGS_API_PATH = "/api/routine-logs";

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

export class RoutineLogClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "RoutineLogClientError";
    this.code = code;
    this.status = status;
  }
}

type ApiError = {
  code: string;
  details?: unknown;
  message: string;
};

type ApiResponse<TData> =
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function getRoutineLogsEndpoint(localDate: string) {
  return `${ROUTINE_LOGS_API_PATH}?localDate=${encodeURIComponent(localDate)}`;
}

export function getRoutineLogsRangeEndpoint(from: string, to: string) {
  const params = new URLSearchParams({
    from,
    to,
  });

  return `${ROUTINE_LOGS_API_PATH}?${params.toString()}`;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isRoutineLogStatus(value: unknown): value is RoutineLogStatus {
  return value === "completed" || value === "partial" || value === "skipped";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isApiError(value: unknown): value is ApiError {
  return isRecord(value) && isString(value.code) && isString(value.message);
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (!isRecord(value)) {
    return false;
  }

  if (value.error === null) {
    return "data" in value && value.data !== null;
  }

  return value.data === null && isApiError(value.error);
}

function isRoutineLogDto(value: unknown): value is RoutineLogDto {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.routineId) &&
    isString(value.localDate) &&
    isString(value.timezone) &&
    isRoutineLogStatus(value.status) &&
    (value.completedStepIds === undefined ||
      isStringArray(value.completedStepIds)) &&
    (value.note === undefined || isString(value.note)) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
}

async function readApiResponse(
  response: Response,
): Promise<ApiResponse<unknown>> {
  try {
    const body: unknown = await response.json();

    if (isApiResponse(body)) {
      return body;
    }
  } catch {
    return {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body.",
      },
    };
  }

  return {
    data: null,
    error: {
      code: "INTERNAL_ERROR",
      message: "Invalid response body.",
    },
  };
}

async function listRoutineLogs(endpoint: string, errorMessage: string) {
  let response: Response;

  try {
    response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new RoutineLogClientError(errorMessage);
  }

  const body = await readApiResponse(response);

  if (!response.ok || body.error !== null || body.data === null) {
    throw new RoutineLogClientError(
      errorMessage,
      body.error?.code,
      response.status,
    );
  }

  if (!isRecord(body.data) || !Array.isArray(body.data.routineLogs)) {
    throw new RoutineLogClientError(
      errorMessage,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  if (!body.data.routineLogs.every(isRoutineLogDto)) {
    throw new RoutineLogClientError(
      errorMessage,
      "INTERNAL_ERROR",
      response.status,
    );
  }

  return body.data.routineLogs;
}

export function listRoutineLogsForDate(localDate: string) {
  return listRoutineLogs(
    getRoutineLogsEndpoint(localDate),
    "Could not load routine logs for this date.",
  );
}

export function listRoutineLogsForDateRange(from: string, to: string) {
  return listRoutineLogs(
    getRoutineLogsRangeEndpoint(from, to),
    "Could not load routine logs for this date range.",
  );
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
