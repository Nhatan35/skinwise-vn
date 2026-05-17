import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import type { DashboardNextAction } from "@/modules/dashboard/dashboard.types";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { Routine } from "@/modules/routines/routine.types";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";
import { routes } from "@/shared/constants/routes";

export function mapSkinProfileSummary(profile: SkinProfile | null) {
  if (!profile) {
    return {
      exists: false,
    } as const;
  }

  return {
    exists: true,
    skinType: profile.skinType,
    concerns: [...profile.concerns],
    sensitivityLevel: profile.sensitivityLevel,
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export function mapRoutineSummary(routines: Routine[]) {
  const morning = routines.filter((routine) => routine.timeOfDay === "morning")
    .length;
  const evening = routines.filter((routine) => routine.timeOfDay === "evening")
    .length;

  return {
    total: routines.length,
    morning,
    evening,
    hasAnyRoutine: routines.length > 0,
  };
}

export function mapTodayRoutineLogsSummary(
  routines: Routine[],
  routineLogs: RoutineLogDto[],
  localDate: string,
) {
  const routineIds = new Set(
    routines.map((routine) => routine._id.toString()),
  );
  const ownedRoutineLogs = routineLogs.filter((routineLog) =>
    routineIds.has(routineLog.routineId),
  );
  const loggedRoutineIds = new Set<string>();
  let completed = 0;
  let partial = 0;
  let skipped = 0;

  for (const routineLog of ownedRoutineLogs) {
    if (loggedRoutineIds.has(routineLog.routineId)) {
      continue;
    }

    loggedRoutineIds.add(routineLog.routineId);

    if (routineLog.status === "completed") {
      completed += 1;
    } else if (routineLog.status === "partial") {
      partial += 1;
    } else if (routineLog.status === "skipped") {
      skipped += 1;
    }
  }

  const totalRoutines = routines.length;
  const notLogged = Math.max(totalRoutines - loggedRoutineIds.size, 0);
  // Simple MVP rule: completed = 1 point, partial = 0.5 point, skipped/not logged = 0.
  const completionRate =
    totalRoutines === 0
      ? 0
      : Math.round(((completed + partial * 0.5) / totalRoutines) * 100);

  return {
    localDate,
    totalRoutines,
    completed,
    partial,
    skipped,
    notLogged,
    completionRate,
  };
}

export function mapLatestRoutineAnalysisSummary(
  analysis: RoutineAnalysis | null,
) {
  if (!analysis) {
    return {
      exists: false,
    } as const;
  }

  return {
    exists: true,
    routineId: analysis.routineId.toString(),
    routineName: analysis.routineSnapshot.name,
    riskLevel: analysis.riskLevel,
    warningCount: analysis.aiResult.warnings.length,
    createdAt: analysis.createdAt.toISOString(),
  };
}

export function buildDashboardNextActions(input: {
  hasSkinProfile: boolean;
  hasAnyRoutine: boolean;
  hasAnyRoutineLogToday: boolean;
  hasLatestRoutineAnalysis: boolean;
}): DashboardNextAction[] {
  const actions: DashboardNextAction[] = [];

  if (!input.hasSkinProfile) {
    actions.push({
      label: "Hoàn thiện hồ sơ da",
      href: routes.SKIN_PROFILE,
      priority: "high",
    });
  }

  if (!input.hasAnyRoutine) {
    actions.push({
      label: "Tạo routine đầu tiên",
      href: routes.ROUTINES,
      priority: "high",
    });
  }

  if (input.hasAnyRoutine && !input.hasAnyRoutineLogToday) {
    actions.push({
      label: "Ghi nhận routine hôm nay",
      href: routes.ROUTINES,
      priority: "medium",
    });
  }

  if (input.hasAnyRoutine && !input.hasLatestRoutineAnalysis) {
    actions.push({
      label: "Phân tích an toàn routine",
      href: routes.ROUTINES,
      priority: "medium",
    });
  }

  if (actions.length === 0) {
    actions.push({
      label: "Xem lại tiến độ routine hôm nay",
      href: routes.ROUTINES,
      priority: "low",
    });
  }

  return actions;
}

export function toDashboardDto(input: {
  skinProfile: SkinProfile | null;
  routines: Routine[];
  routineLogs: RoutineLogDto[];
  latestRoutineAnalysis: RoutineAnalysis | null;
  localDate: string;
}): DashboardDto {
  const skinProfile = mapSkinProfileSummary(input.skinProfile);
  const routines = mapRoutineSummary(input.routines);
  const todayRoutineLogs = mapTodayRoutineLogsSummary(
    input.routines,
    input.routineLogs,
    input.localDate,
  );
  const latestRoutineAnalysis = mapLatestRoutineAnalysisSummary(
    input.latestRoutineAnalysis,
  );

  return {
    skinProfile,
    routines,
    todayRoutineLogs,
    latestRoutineAnalysis,
    nextActions: buildDashboardNextActions({
      hasSkinProfile: skinProfile.exists,
      hasAnyRoutine: routines.hasAnyRoutine,
      hasAnyRoutineLogToday:
        todayRoutineLogs.completed + todayRoutineLogs.partial + todayRoutineLogs.skipped >
        0,
      hasLatestRoutineAnalysis: latestRoutineAnalysis.exists,
    }),
  };
}
