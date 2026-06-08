import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";

export type RoutineWeeklyReviewDayStatus =
  | "completed"
  | "partial"
  | "skipped"
  | "not_logged";

export type RoutineWeeklyReviewDay = {
  completedCount: number;
  localDate: string;
  partialCount: number;
  skippedCount: number;
  status: RoutineWeeklyReviewDayStatus;
  totalLogs: number;
};

export type RoutineWeeklyReview = {
  completedRoutineLogs: number;
  completionRate: number | null;
  days: RoutineWeeklyReviewDay[];
  from: string;
  hasLogs: boolean;
  loggedDays: number;
  to: string;
  totalDays: 7;
  totalRoutineLogs: number;
};

export function addLocalDateDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const normalizedYear = date.getUTCFullYear();
  const normalizedMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const normalizedDay = String(date.getUTCDate()).padStart(2, "0");

  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}

export function buildSevenDayLocalDateRange(referenceLocalDate: string) {
  return Array.from({ length: 7 }, (_value, index) =>
    addLocalDateDays(referenceLocalDate, index - 6),
  );
}

export function buildRoutineWeeklyReview(input: {
  referenceLocalDate: string;
  routineLogs: RoutineLogDto[];
}): RoutineWeeklyReview {
  const localDates = buildSevenDayLocalDateRange(input.referenceLocalDate);
  const localDateSet = new Set(localDates);
  const logsByDate = new Map<string, RoutineLogDto[]>();

  for (const routineLog of input.routineLogs) {
    if (!localDateSet.has(routineLog.localDate)) {
      continue;
    }

    const logsForDate = logsByDate.get(routineLog.localDate) ?? [];

    logsForDate.push(routineLog);
    logsByDate.set(routineLog.localDate, logsForDate);
  }

  const days = localDates.map((localDate) =>
    buildRoutineWeeklyReviewDay(localDate, logsByDate.get(localDate) ?? []),
  );
  const totalRoutineLogs = days.reduce((total, day) => total + day.totalLogs, 0);
  const completedRoutineLogs = days.reduce(
    (total, day) => total + day.completedCount,
    0,
  );

  return {
    completedRoutineLogs,
    completionRate:
      totalRoutineLogs > 0
        ? Math.round((completedRoutineLogs / totalRoutineLogs) * 100)
        : null,
    days,
    from: localDates[0] ?? input.referenceLocalDate,
    hasLogs: totalRoutineLogs > 0,
    loggedDays: days.filter((day) => day.status !== "not_logged").length,
    to: input.referenceLocalDate,
    totalDays: 7,
    totalRoutineLogs,
  };
}

function buildRoutineWeeklyReviewDay(
  localDate: string,
  routineLogs: RoutineLogDto[],
): RoutineWeeklyReviewDay {
  let completedCount = 0;
  let partialCount = 0;
  let skippedCount = 0;

  for (const routineLog of routineLogs) {
    if (routineLog.status === "completed") {
      completedCount += 1;
    } else if (routineLog.status === "partial") {
      partialCount += 1;
    } else if (routineLog.status === "skipped") {
      skippedCount += 1;
    }
  }

  const totalLogs = routineLogs.length;

  return {
    completedCount,
    localDate,
    partialCount,
    skippedCount,
    status: getRoutineWeeklyReviewDayStatus({
      completedCount,
      partialCount,
      skippedCount,
      totalLogs,
    }),
    totalLogs,
  };
}

function getRoutineWeeklyReviewDayStatus(input: {
  completedCount: number;
  partialCount: number;
  skippedCount: number;
  totalLogs: number;
}): RoutineWeeklyReviewDayStatus {
  if (input.totalLogs === 0) {
    return "not_logged";
  }

  if (input.completedCount === input.totalLogs) {
    return "completed";
  }

  if (input.skippedCount === input.totalLogs) {
    return "skipped";
  }

  return "partial";
}
