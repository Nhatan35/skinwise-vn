import type { InsightsDto, InsightsDayStatus } from "@/modules/insights/insights.dto";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { SkinJournalSymptom } from "@/modules/journals/skin-journal.types";
import type { Product } from "@/modules/products/product.types";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { Routine } from "@/modules/routines/routine.types";
import { routes } from "@/shared/constants/routes";

export function addLocalDateDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const normalizedYear = date.getUTCFullYear();
  const normalizedMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const normalizedDay = String(date.getUTCDate()).padStart(2, "0");

  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}

export function buildLocalDateRange(from: string, to: string) {
  const dates: string[] = [];
  let current = from;

  while (current <= to) {
    dates.push(current);
    current = addLocalDateDays(current, 1);
  }

  return dates;
}

function getDayStatus(input: {
  totalRoutines: number;
  loggedCount: number;
  completed: number;
  skipped: number;
}): InsightsDayStatus {
  if (input.totalRoutines === 0 || input.loggedCount === 0) {
    return "not_logged";
  }

  if (input.completed === input.totalRoutines) {
    return "completed";
  }

  if (input.skipped === input.totalRoutines) {
    return "skipped";
  }

  return "partial";
}

function sortByCountDescendingThenLabel<TItem extends { count: number }>(
  left: TItem,
  right: TItem,
  getLabel: (item: TItem) => string,
) {
  if (right.count !== left.count) {
    return right.count - left.count;
  }

  return getLabel(left).localeCompare(getLabel(right));
}

function getCurrentStreak(calendarDays: InsightsDto["calendarDays"]) {
  let currentStreak = 0;

  for (let index = calendarDays.length - 1; index >= 0; index -= 1) {
    if (calendarDays[index]?.routineSummary.dayStatus !== "completed") {
      break;
    }

    currentStreak += 1;
  }

  return currentStreak;
}

function getBestStreak(calendarDays: InsightsDto["calendarDays"]) {
  let bestStreak = 0;
  let runningStreak = 0;

  for (const day of calendarDays) {
    if (day.routineSummary.dayStatus === "completed") {
      runningStreak += 1;
      bestStreak = Math.max(bestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  }

  return bestStreak;
}

function buildJournalSummaries(journals: SkinJournalDto[]) {
  const journalDates = new Set<string>();
  const symptomsByDate = new Map<string, Set<SkinJournalSymptom>>();
  const symptomCounts = new Map<SkinJournalSymptom, number>();
  const productUsageCounts = new Map<string, number>();

  for (const journal of journals) {
    journalDates.add(journal.localDate);

    const symptomsForDate = symptomsByDate.get(journal.localDate) ?? new Set<SkinJournalSymptom>();

    for (const symptom of journal.symptoms ?? []) {
      symptomsForDate.add(symptom);
      symptomCounts.set(symptom, (symptomCounts.get(symptom) ?? 0) + 1);
    }

    if (symptomsForDate.size > 0) {
      symptomsByDate.set(journal.localDate, symptomsForDate);
    }

    const productIdsInEntry = new Set(journal.productsUsed ?? []);

    for (const productId of productIdsInEntry) {
      productUsageCounts.set(productId, (productUsageCounts.get(productId) ?? 0) + 1);
    }
  }

  const mostCommonSymptoms = Array.from(symptomCounts.entries())
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((left, right) =>
      sortByCountDescendingThenLabel(left, right, (item) => item.symptom),
    )
    .slice(0, 5);

  return {
    journalDates,
    mostCommonSymptoms,
    productUsageCounts,
    symptomsByDate,
  };
}

type MostUsedProduct = InsightsDto["productUsage"]["mostUsedProducts"][number];

function buildMostUsedProducts(input: {
  productUsageCounts: Map<string, number>;
  products: Product[];
}) {
  const visibleProductById = new Map(
    input.products.map((product) => [product._id.toString(), product]),
  );

  return Array.from(input.productUsageCounts.entries())
    .map(([productId, count]) => {
      const product = visibleProductById.get(productId);

      if (!product) {
        return null;
      }

      return {
        productId,
        name: product.name,
        ...(product.brand ? { brand: product.brand } : {}),
        count,
      };
    })
    .filter((product): product is MostUsedProduct => product !== null)
    .sort((left, right) =>
      sortByCountDescendingThenLabel(left, right, (item) => `${item.brand ?? ""} ${item.name}`),
    )
    .slice(0, 5);
}

function buildNextActions(input: {
  completionRate: number;
  totalRoutines: number;
  totalEntries: number;
  hasRoutineLogOnReferenceDate: boolean;
  hasJournalOnReferenceDate: boolean;
}) {
  const nextActions: InsightsDto["nextActions"] = [];

  if (input.totalRoutines === 0) {
    nextActions.push({
      label: "Tạo routine chăm sóc da",
      description:
        "Bạn cần có routine trước khi Insights có thể theo dõi độ đều đặn.",
      href: routes.ROUTINES,
      priority: "high",
    });
  } else if (!input.hasRoutineLogOnReferenceDate) {
    nextActions.push({
      label: "Ghi nhận routine hôm nay",
      description: "Cập nhật checklist để lịch độ đều đặn phản ánh dữ liệu mới nhất.",
      href: routes.TODAY_LOG,
      priority: "high",
    });
  }

  if (!input.hasJournalOnReferenceDate) {
    nextActions.push({
      label: "Thêm nhật ký da",
      description:
        "Một ghi chú ngắn giúp kết nối cảm nhận của da với routine log gần đây.",
      href: routes.JOURNAL,
      priority: "medium",
    });
  }

  if (input.totalRoutines > 0 && input.completionRate < 50) {
    nextActions.push({
      label: "Xem lại routine",
      description:
        "Nếu routine khó duy trì, bạn có thể cân nhắc làm gọn các bước để dễ ghi nhận hơn.",
      href: routes.ROUTINES,
      priority: "medium",
    });
  }

  if (input.totalEntries < 3) {
    nextActions.push({
      label: "Ghi thêm vài nhật ký da",
      description:
        "Thêm dữ liệu tự ghi nhận sẽ giúp phần xu hướng dễ đọc hơn.",
      href: routes.JOURNAL,
      priority: "low",
    });
  }

  return nextActions;
}

export function toInsightsDto(input: {
  from: string;
  to: string;
  routines: Routine[];
  routineLogs: RoutineLogDto[];
  journals: SkinJournalDto[];
  products: Product[];
}): InsightsDto {
  const localDates = buildLocalDateRange(input.from, input.to);
  const routineIds = new Set(input.routines.map((routine) => routine._id.toString()));
  const totalRoutines = routineIds.size;
  const logsByDate = new Map<string, RoutineLogDto[]>();

  for (const routineLog of input.routineLogs) {
    if (!routineIds.has(routineLog.routineId)) {
      continue;
    }

    const existingLogs = logsByDate.get(routineLog.localDate) ?? [];

    existingLogs.push(routineLog);
    logsByDate.set(routineLog.localDate, existingLogs);
  }

  const journalSummary = buildJournalSummaries(input.journals);
  const calendarDays = localDates.map((localDate) => {
    const routineLogsForDate = logsByDate.get(localDate) ?? [];
    const loggedRoutineIds = new Set<string>();
    let completed = 0;
    let partial = 0;
    let skipped = 0;

    for (const routineLog of routineLogsForDate) {
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

    const notLogged = Math.max(totalRoutines - loggedRoutineIds.size, 0);
    const dayStatus = getDayStatus({
      totalRoutines,
      loggedCount: loggedRoutineIds.size,
      completed,
      skipped,
    });

    return {
      localDate,
      routineSummary: {
        totalRoutines,
        completed,
        partial,
        skipped,
        notLogged,
        dayStatus,
      },
      hasJournalEntry: journalSummary.journalDates.has(localDate),
      symptoms: Array.from(journalSummary.symptomsByDate.get(localDate) ?? []).sort(),
    };
  });

  const totalRoutineSlots = localDates.length * totalRoutines;
  const completedRoutineSlots = calendarDays.reduce(
    (total, day) => total + day.routineSummary.completed,
    0,
  );
  const partialRoutineSlots = calendarDays.reduce(
    (total, day) => total + day.routineSummary.partial,
    0,
  );
  const skippedRoutineSlots = calendarDays.reduce(
    (total, day) => total + day.routineSummary.skipped,
    0,
  );
  const notLoggedRoutineSlots = calendarDays.reduce(
    (total, day) => total + day.routineSummary.notLogged,
    0,
  );
  const completionRate =
    totalRoutineSlots === 0
      ? 0
      : Math.round((completedRoutineSlots / totalRoutineSlots) * 100);
  const referenceDay = calendarDays.at(-1);

  return {
    dateRange: {
      from: input.from,
      to: input.to,
      totalDays: localDates.length,
    },
    routineConsistency: {
      totalRoutineSlots,
      completedRoutineSlots,
      partialRoutineSlots,
      skippedRoutineSlots,
      notLoggedRoutineSlots,
      completionRate,
      maintainedDays: calendarDays.filter(
        (day) => day.routineSummary.dayStatus === "completed",
      ).length,
      currentStreak: getCurrentStreak(calendarDays),
      bestStreak: getBestStreak(calendarDays),
    },
    journalActivity: {
      totalEntries: input.journals.length,
      activeJournalDays: journalSummary.journalDates.size,
      mostCommonSymptoms: journalSummary.mostCommonSymptoms,
    },
    productUsage: {
      mostUsedProducts: buildMostUsedProducts({
        productUsageCounts: journalSummary.productUsageCounts,
        products: input.products,
      }),
    },
    calendarDays,
    nextActions: buildNextActions({
      completionRate,
      totalRoutines,
      totalEntries: input.journals.length,
      hasRoutineLogOnReferenceDate:
        (referenceDay?.routineSummary.completed ?? 0) +
          (referenceDay?.routineSummary.partial ?? 0) +
          (referenceDay?.routineSummary.skipped ?? 0) >
        0,
      hasJournalOnReferenceDate: journalSummary.journalDates.has(input.to),
    }),
  };
}
