import type { RoutineAnalysis } from "@/modules/ai-analysis/routine-analysis.types";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import type {
  DashboardJournalTrendSummary,
  DashboardLatestJournalSummary,
  DashboardNextAction,
  DashboardRoutineConsistencyLabel,
  DashboardRoutineConsistencyLevel,
  DashboardRoutineConsistencySummary,
} from "@/modules/dashboard/dashboard.types";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { Routine } from "@/modules/routines/routine.types";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";
import { routes } from "@/shared/constants/routes";

const NOTES_PREVIEW_MAX_LENGTH = 120;
const symptomDisplayLabels: Record<
  SkinJournalDto["symptoms"][number],
  string
> = {
  dryness: "Khô căng",
  oiliness: "Dầu thừa",
  redness: "Đỏ da",
  stinging: "Châm chích",
  new_breakouts: "Mụn mới",
  itchiness: "Ngứa",
  other: "Khác",
};


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

function addLocalDateDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const normalizedYear = date.getUTCFullYear();
  const normalizedMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const normalizedDay = String(date.getUTCDate()).padStart(2, "0");

  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}

function isMaintainedRoutineLog(routineLog: RoutineLogDto) {
  return routineLog.status === "completed" || routineLog.status === "partial";
}

function getRoutineConsistencyLevel(
  maintainedDays: number,
): DashboardRoutineConsistencyLevel {
  if (maintainedDays === 0) {
    return "not_started";
  }

  if (maintainedDays <= 4) {
    return "building";
  }

  return "consistent";
}

function getRoutineConsistencyMessage(maintainedDays: number) {
  if (maintainedDays === 0) {
    return "Bạn chưa có dữ liệu routine trong 7 ngày gần đây.";
  }

  if (maintainedDays <= 4) {
    return `Bạn đã duy trì routine trong ${maintainedDays}/7 ngày gần đây. Hãy tiếp tục ghi nhận đều hơn để xây dựng thói quen.`;
  }

  return "Bạn đang duy trì routine khá đều trong 7 ngày gần đây.";
}

function getRoutineConsistencyNextAction(maintainedDays: number) {
  if (maintainedDays === 0) {
    return "Bắt đầu ghi nhận routine hôm nay.";
  }

  if (maintainedDays <= 4) {
    return "Cố gắng hoàn thành routine thêm vài ngày nữa trong tuần này.";
  }

  return "Tiếp tục duy trì và ghi chú thay đổi của da.";
}

function getCurrentRoutineStreak(
  maintainedLocalDates: Set<string>,
  currentLocalDate: string,
) {
  let currentStreak = 0;

  for (let dayOffset = 0; dayOffset > -7; dayOffset -= 1) {
    if (!maintainedLocalDates.has(addLocalDateDays(currentLocalDate, dayOffset))) {
      break;
    }

    currentStreak += 1;
  }

  return currentStreak;
}

export function mapRoutineConsistencySummary(
  routineLogs: RoutineLogDto[],
  currentLocalDate: string,
): DashboardRoutineConsistencySummary {
  const maintainedLocalDates = new Set<string>();

  for (const routineLog of routineLogs) {
    if (isMaintainedRoutineLog(routineLog)) {
      maintainedLocalDates.add(routineLog.localDate);
    }
  }

  const maintainedDays = maintainedLocalDates.size;
  const totalDays = 7 as const;
  const rate = Math.round((maintainedDays / totalDays) * 100);
  const label: DashboardRoutineConsistencyLabel =
    maintainedDays <= 1
      ? "needs_attention"
      : maintainedDays <= 3
        ? "building"
        : maintainedDays <= 5
          ? "good"
          : "excellent";

  return {
    completedDays: maintainedDays,
    totalDays,
    rate,
    label,
    windowDays: totalDays,
    maintainedDays,
    currentStreak: getCurrentRoutineStreak(
      maintainedLocalDates,
      currentLocalDate,
    ),
    hasRecentLogs: maintainedDays > 0,
    level: getRoutineConsistencyLevel(maintainedDays),
    message: getRoutineConsistencyMessage(maintainedDays),
    nextAction: getRoutineConsistencyNextAction(maintainedDays),
  };
}

function getJournalTrendMessage(input: {
  hasEnoughEntries: boolean;
  entriesWithSymptomsCount: number;
  mostCommonSymptom?: SkinJournalDto["symptoms"][number];
}) {
  if (!input.hasEnoughEntries) {
    return "Cần thêm nhật ký để xem xu hướng rõ hơn.";
  }

  if (!input.mostCommonSymptom || input.entriesWithSymptomsCount === 0) {
    return "Bạn đã ghi nhật ký gần đây, nhưng chưa có đủ triệu chứng được ghi nhận để tóm tắt xu hướng.";
  }

  return `Dữ liệu gần đây cho thấy bạn thường ghi nhận: ${symptomDisplayLabels[input.mostCommonSymptom]}.`;
}

function getJournalTrendNextAction(input: {
  hasEnoughEntries: boolean;
  entriesWithSymptomsCount: number;
  mostCommonSymptom?: SkinJournalDto["symptoms"][number];
}) {
  if (!input.hasEnoughEntries) {
    return "Hãy ghi nhật ký da thêm vài lần trong tuần này.";
  }

  if (!input.mostCommonSymptom || input.entriesWithSymptomsCount === 0) {
    return "Khi ghi nhật ký, bạn có thể chọn triệu chứng nếu có để theo dõi rõ hơn.";
  }

  return "Tiếp tục ghi nhận để theo dõi thay đổi theo thời gian.";
}

export function mapJournalTrendSummary(
  journals: SkinJournalDto[],
): DashboardJournalTrendSummary {
  const symptomCounts = new Map<SkinJournalDto["symptoms"][number], number>();
  const latestSymptomLocalDates = new Map<
    SkinJournalDto["symptoms"][number],
    string
  >();
  let entriesWithSymptomsCount = 0;

  for (const journal of journals) {
    const symptoms = journal.symptoms ?? [];

    if (symptoms.length > 0) {
      entriesWithSymptomsCount += 1;
    }

    for (const symptom of symptoms) {
      symptomCounts.set(symptom, (symptomCounts.get(symptom) ?? 0) + 1);

      const latestLocalDate = latestSymptomLocalDates.get(symptom);

      if (!latestLocalDate || journal.localDate > latestLocalDate) {
        latestSymptomLocalDates.set(symptom, journal.localDate);
      }
    }
  }

  let mostCommonSymptom: SkinJournalDto["symptoms"][number] | undefined;
  let mostCommonSymptomCount = 0;

  for (const [symptom, count] of symptomCounts) {
    const mostCommonSymptomLocalDate = mostCommonSymptom
      ? latestSymptomLocalDates.get(mostCommonSymptom)
      : undefined;
    const currentSymptomLocalDate = latestSymptomLocalDates.get(symptom);
    const isMoreRecentTie =
      count === mostCommonSymptomCount &&
      !!currentSymptomLocalDate &&
      (!mostCommonSymptomLocalDate ||
        currentSymptomLocalDate > mostCommonSymptomLocalDate);

    if (count > mostCommonSymptomCount || isMoreRecentTie) {
      mostCommonSymptom = symptom;
      mostCommonSymptomCount = count;
    }
  }

  const hasEnoughEntries = journals.length >= 2;
  const hasEnoughData = hasEnoughEntries && symptomCounts.size > 0;
  const status: DashboardJournalTrendSummary["status"] = hasEnoughData
    ? "available"
    : "not_enough_data";
  const messageInput = {
    hasEnoughEntries,
    entriesWithSymptomsCount,
    mostCommonSymptom,
  };

  return {
    recentEntries: journals.length,
    ...(mostCommonSymptom ? { mostCommonSymptom } : {}),
    status,
    windowDays: 14,
    entriesWithSymptomsCount,
    mostCommonSymptomCount,
    hasEnoughData,
    message: getJournalTrendMessage(messageInput),
    nextAction: getJournalTrendNextAction(messageInput),
    disclaimer:
      "Thông tin này chỉ mang tính theo dõi cá nhân, không thay thế tư vấn y khoa.",
  };
}

export function buildDashboardNextActions(input: {
  hasSkinProfile: boolean;
  savedProductCount: number;
  hasAnyRoutine: boolean;
  hasAnyRoutineLogToday: boolean;
  hasJournalToday: boolean;
  hasLatestRoutineAnalysis: boolean;
}): DashboardNextAction[] {
  if (!input.hasSkinProfile) {
    return [
      {
        label: "Hoàn thiện hồ sơ da",
        href: routes.ONBOARDING_SKIN_PROFILE,
        priority: "high",
      },
    ];
  }

  if (input.savedProductCount === 0) {
    return [
      {
        label: "Tìm sản phẩm phù hợp với hồ sơ da",
        href: routes.PRODUCT_MATCH,
        priority: "medium",
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
  journalsLast14Days: SkinJournalDto[];
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
    input.localDate,
  );
  const journalTrend = mapJournalTrendSummary(input.journalsLast14Days);

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
      savedProductCount: input.savedProductCount,
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
