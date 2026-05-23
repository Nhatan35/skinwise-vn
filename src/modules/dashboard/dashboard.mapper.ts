import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import type {
  DashboardLatestJournalSummary,
  DashboardNextAction,
} from "@/modules/dashboard/dashboard.types";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { Routine } from "@/modules/routines/routine.types";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";
import { routes } from "@/shared/constants/routes";

const NOTES_PREVIEW_MAX_LENGTH = 120;

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

function toNotesPreview(notes: string | undefined) {
  const normalizedNotes = notes?.trim().replace(/\s+/g, " ");

  if (!normalizedNotes) {
    return undefined;
  }

  if (normalizedNotes.length <= NOTES_PREVIEW_MAX_LENGTH) {
    return normalizedNotes;
  }

  return `${normalizedNotes.slice(0, NOTES_PREVIEW_MAX_LENGTH).trimEnd()}...`;
}

export function mapLatestJournalSummary(
  journal: SkinJournalDto | null,
): DashboardLatestJournalSummary {
  if (!journal) {
    return {
      exists: false,
    } as const;
  }

  const notesPreview = toNotesPreview(journal.notes);

  return {
    exists: true,
    id: journal.id,
    localDate: journal.localDate,
    observations: [...(journal.observations ?? [])],
    symptoms: [...(journal.symptoms ?? [])],
    ...(journal.stressLevel ? { stressLevel: journal.stressLevel } : {}),
    ...(notesPreview ? { notesPreview } : {}),
    productsUsedCount: journal.productsUsed?.length ?? 0,
    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
  };
}

export function buildDashboardNextActions(input: {
  hasSkinProfile: boolean;
  hasAnyRoutine: boolean;
  hasAnyRoutineLogToday: boolean;
  hasJournalToday: boolean;
  hasLatestRoutineAnalysis: boolean;
}): DashboardNextAction[] {
  if (!input.hasSkinProfile) {
    return [
      {
        label: "Hoàn thiện hồ sơ da",
        href: routes.SKIN_PROFILE,
        priority: "high",
      },
    ];
  }

  if (!input.hasAnyRoutine) {
    return [
      {
        label: "Tạo routine đầu tiên",
        href: routes.ROUTINES,
        priority: "high",
      },
    ];
  }

  if (input.hasAnyRoutine && !input.hasAnyRoutineLogToday) {
    return [
      {
        label: "Ghi nhận routine hôm nay",
        href: routes.ROUTINES,
        priority: "medium",
      },
    ];
  }

  if (!input.hasJournalToday) {
    return [
      {
        label: "Thêm nhật ký da hôm nay",
        href: routes.JOURNAL,
        priority: "medium",
      },
    ];
  }

  if (input.hasAnyRoutine && !input.hasLatestRoutineAnalysis) {
    return [
      {
        label: "Xem phân tích an toàn routine",
        href: routes.ROUTINES,
        priority: "medium",
      },
    ];
  }

  return [
    {
      label: "Hôm nay bạn đã cập nhật đủ theo dõi skincare",
      href: routes.DASHBOARD,
      priority: "low",
    },
  ];
}

export function toDashboardDto(input: {
  skinProfile: SkinProfile | null;
  routines: Routine[];
  routineLogs: RoutineLogDto[];
  latestRoutineAnalysis: RoutineAnalysis | null;
  latestJournal: SkinJournalDto | null;
  hasJournalToday: boolean;
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
  const latestJournal = mapLatestJournalSummary(input.latestJournal);

  return {
    skinProfile,
    routines,
    todayRoutineLogs,
    latestRoutineAnalysis,
    latestJournal,
    nextActions: buildDashboardNextActions({
      hasSkinProfile: skinProfile.exists,
      hasAnyRoutine: routines.hasAnyRoutine,
      hasAnyRoutineLogToday:
        todayRoutineLogs.completed + todayRoutineLogs.partial + todayRoutineLogs.skipped >
        0,
      hasJournalToday: input.hasJournalToday,
      hasLatestRoutineAnalysis: latestRoutineAnalysis.exists,
    }),
  };
}
