import { findLatestRoutineAnalysisByUserId } from "@/modules/ai-analysis/routine-analysis.repository";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { toDashboardDto } from "@/modules/dashboard/dashboard.mapper";
import type { DashboardQueryInput } from "@/modules/dashboard/dashboard.schema";
import { listSkinJournalsForUser } from "@/modules/journals/list-skin-journal.use-case";
import {
  getRoutineLogsForDate,
  getRoutineLogsForDateRange,
} from "@/modules/routine-logs/routine-log.use-case";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";
import { countSavedProductsByUser } from "@/modules/saved-products/saved-product.repository";
import { getSkinProfileForUser } from "@/modules/skin-profile/skin-profile.use-case";

function addLocalDateDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const normalizedYear = date.getUTCFullYear();
  const normalizedMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const normalizedDay = String(date.getUTCDate()).padStart(2, "0");

  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}

export async function getDashboardForUser(
  userId: string,
  input: DashboardQueryInput,
): Promise<DashboardDto> {
  const sevenDayFromLocalDate = addLocalDateDays(input.localDate, -6);
  const fourteenDayFromLocalDate = addLocalDateDays(input.localDate, -13);
  const [
    skinProfile,
    routines,
    routineLogs,
    routineLogsLast7Days,
    latestRoutineAnalysis,
    latestJournals,
    todayJournals,
    journalsLast14Days,
    savedProductCount,
  ] = await Promise.all([
    getSkinProfileForUser(userId),
    listRoutinesForUser(userId),
    getRoutineLogsForDate(userId, input.localDate),
    getRoutineLogsForDateRange(userId, sevenDayFromLocalDate, input.localDate),
    findLatestRoutineAnalysisByUserId(userId),
    listSkinJournalsForUser(userId, { limit: 1 }),
    listSkinJournalsForUser(userId, {
      from: input.localDate,
      to: input.localDate,
      limit: 1,
    }),
    listSkinJournalsForUser(userId, {
      from: fourteenDayFromLocalDate,
      to: input.localDate,
      limit: 14,
    }),
    countSavedProductsByUser(userId),
  ]);

  return toDashboardDto({
    skinProfile,
    routines,
    routineLogs,
    routineLogsLast7Days,
    latestRoutineAnalysis,
    latestJournal: latestJournals[0] ?? null,
    journalsLast14Days,
    savedProductCount,
    hasJournalToday: todayJournals.length > 0,
    localDate: input.localDate,
  });
}
