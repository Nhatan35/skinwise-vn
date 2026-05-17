import { findLatestRoutineAnalysisByUserId } from "@/modules/ai-analysis/routine-analysis.repository";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { toDashboardDto } from "@/modules/dashboard/dashboard.mapper";
import type { DashboardQueryInput } from "@/modules/dashboard/dashboard.schema";
import { getRoutineLogsForDate } from "@/modules/routine-logs/routine-log.use-case";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";
import { getSkinProfileForUser } from "@/modules/skin-profile/skin-profile.use-case";

export async function getDashboardForUser(
  userId: string,
  input: DashboardQueryInput,
): Promise<DashboardDto> {
  const [skinProfile, routines, routineLogs, latestRoutineAnalysis] =
    await Promise.all([
      getSkinProfileForUser(userId),
      listRoutinesForUser(userId),
      getRoutineLogsForDate(userId, input.localDate),
      findLatestRoutineAnalysisByUserId(userId),
    ]);

  return toDashboardDto({
    skinProfile,
    routines,
    routineLogs,
    latestRoutineAnalysis,
    localDate: input.localDate,
  });
}
