import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import type {
  DashboardJournalTrendSummary,
  DashboardLatestJournalSummary,
  DashboardNextAction,
  DashboardRoutineConsistencyLabel,
  DashboardRoutineConsistencySummary,
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

const profileCompletionFields = [
  "skinType",
  "concerns",
  "sensitivityLevel",
  "budgetRange",
  "experienceLevel",
] as const;

type ProfileCompletionField = (typeof profileCompletionFields)[number];

export function mapProfileCompletionSummary(profile: SkinProfile | null) {
  const totalFields = profileCompletionFields.length;

  if (!profile) {
    return {
      percentage: 0,
      completedFields: 0,
      totalFields,
      missingFields: [...profileCompletionFields],
    };
  }

  const missingFields: ProfileCompletionField[] = [];

  if (!profile.skinType || profile.skinType === "unknown") {
    missingFields.push("skinType");
  }

  if (
    !profile.concerns ||
    profile.concerns.length === 0 ||
    profile.concerns.every((concern) => concern === "unknown")
  ) {
    missingFields.push("concerns");
  }

  if (!profile.sensitivityLevel || profile.sensitivityLevel === "unknown") {
    missingFields.push("sensitivityLevel");
  }

  if (!profile.budgetRange) {
    missingFields.push("budgetRange");
  }

  if (!profile.experienceLevel) {
    missingFields.push("experienceLevel");
  }

  const completedFields = totalFields - missingFields.length;

  return {
    percentage: Math.round((completedFields / totalFields) * 100),
    completedFields,
    totalFields,
    missingFields,
  };
}

export function mapRoutineSummary(routines: Routine[]) {
  const morning = routines.filter(
    (routine) => routine.timeOfDay === "morning",
  ).length;
  const evening = routines.filter(
    (routine) => routine.timeOfDay === "evening",
  ).length;

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
  const routineIds = new Set(routines.map((routine) => routine._id.toString()));
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

export function mapRoutineConsistencySummary(
  routineLogs: RoutineLogDto[],
): DashboardRoutineConsistencySummary {
  const completedLocalDates = new Set<string>();

  for (const routineLog of routineLogs) {
    if (routineLog.status === "completed" || routineLog.status === "partial") {
      completedLocalDates.add(routineLog.localDate);
    }
  }

  const completedDays = completedLocalDates.size;
  const totalDays = 7 as const;
  const rate = Math.round((completedDays / totalDays) * 100);
  const label: DashboardRoutineConsistencyLabel =
    completedDays <= 1
      ? "needs_attention"
      : completedDays <= 3
        ? "building"
        : completedDays <= 5
          ? "good"
          : "excellent";

  return {
    completedDays,
    totalDays,
    rate,
    label,
  };
}

export function mapJournalTrendSummary(
  journals: SkinJournalDto[],
): DashboardJournalTrendSummary {
  const symptomCounts = new Map<SkinJournalDto["symptoms"][number], number>();

  for (const journal of journals) {
    for (const symptom of journal.symptoms ?? []) {
      symptomCounts.set(symptom, (symptomCounts.get(symptom) ?? 0) + 1);
    }
  }

  let mostCommonSymptom: SkinJournalDto["symptoms"][number] | undefined;
  let mostCommonSymptomCount = 0;

  for (const [symptom, count] of symptomCounts) {
    if (count > mostCommonSymptomCount) {
      mostCommonSymptom = symptom;
      mostCommonSymptomCount = count;
    }
  }

  return {
    recentEntries: journals.length,
    ...(mostCommonSymptom ? { mostCommonSymptom } : {}),
    status: journals.length >= 2 ? "available" : "not_enough_data",
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
        href: routes.TODAY_LOG,
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
  routineLogsLast7Days: RoutineLogDto[];
  latestRoutineAnalysis: RoutineAnalysis | null;
  latestJournal: SkinJournalDto | null;
  journalsLast7Days: SkinJournalDto[];
  savedProductCount: number;
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
  const profileCompletion = mapProfileCompletionSummary(input.skinProfile);
  const savedProducts = { count: input.savedProductCount };
  const routineConsistency = mapRoutineConsistencySummary(
    input.routineLogsLast7Days,
  );
  const journalTrend = mapJournalTrendSummary(input.journalsLast7Days);

  return {
    skinProfile,
    routines,
    todayRoutineLogs,
    latestRoutineAnalysis,
    latestJournal,
    profileCompletion,
    savedProducts,
    routineConsistency,
    journalTrend,
    nextActions: buildDashboardNextActions({
      hasSkinProfile: skinProfile.exists,
      hasAnyRoutine: routines.hasAnyRoutine,
      hasAnyRoutineLogToday:
        todayRoutineLogs.completed +
          todayRoutineLogs.partial +
          todayRoutineLogs.skipped >
        0,
      hasJournalToday: input.hasJournalToday,
      hasLatestRoutineAnalysis: latestRoutineAnalysis.exists,
    }),
  };
}
