import type {
  InsightCalculationMetaDto,
  InsightSummaryDto,
  TrackingQualityChecklistDto,
  TrackingQualityStatus,
} from "@/modules/insights/insight-summary.dto";
import { buildLocalDateRange } from "@/modules/insights/insights.mapper";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type {
  SkinJournalStressLevel,
  SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";
import type { Product } from "@/modules/products/product.types";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { Routine } from "@/modules/routines/routine.types";

const TOP_SUMMARY_ITEM_LIMIT = 3;
const ROUTINE_TRACKING_PERIOD_DAYS = 7 as const;
const JOURNAL_TRACKING_PERIOD_DAYS = 30 as const;

type ProductMentionSummary =
  InsightSummaryDto["productMentionPattern"]["topProducts"][number];
type TrackingQualityChecklistItem =
  TrackingQualityChecklistDto["checklistItems"][number];

const symptomDisplayLabels: Record<SkinJournalSymptom, string> = {
  dryness: "khô da",
  oiliness: "dầu nhiều",
  redness: "đỏ da",
  stinging: "châm chích",
  new_breakouts: "nốt mụn mới",
  itchiness: "ngứa",
  other: "khác",
};

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

function getSymptomDisplayLabel(symptom: SkinJournalSymptom) {
  return symptomDisplayLabels[symptom] ?? symptom;
}

function buildRoutineCalculationMeta(
  periodDays: number,
): InsightCalculationMetaDto {
  return {
    periodDays,
    dataSourceLabel: "Routine logs from your account only",
    calculationLabel:
      "Completed days, partial days, and no-log days were counted from your routine tracking records.",
    safetyText:
      "This only shows your tracking consistency. It does not indicate skin improvement or skin decline.",
  };
}

function buildSymptomCalculationMeta(
  periodDays: number,
): InsightCalculationMetaDto {
  return {
    periodDays,
    dataSourceLabel: "Symptoms recorded in your journal entries",
    calculationLabel:
      "Repeated symptom labels were counted and sorted by frequency.",
    safetyText:
      "This only reflects what you recorded. It does not confirm a skin condition.",
  };
}

function buildStressCalculationMeta(
  periodDays: number,
): InsightCalculationMetaDto {
  return {
    periodDays,
    dataSourceLabel: "Stress levels recorded in your journal entries",
    calculationLabel: "Low, medium, and high stress labels were counted.",
    safetyText:
      "This does not identify stress as a cause of any skin change. It only summarizes your recorded notes.",
  };
}

function buildProductCalculationMeta(
  periodDays: number,
): InsightCalculationMetaDto {
  return {
    periodDays,
    dataSourceLabel: "Products mentioned in your journal entries",
    calculationLabel:
      "Product names appearing in journal entries were counted.",
    safetyText:
      "This does not confirm that a product helped or harmed your skin.",
  };
}

function buildRoutineConsistency(input: {
  from: string;
  to: string;
  routines: Routine[];
  routineLogs: RoutineLogDto[];
}) {
  const localDates = buildLocalDateRange(input.from, input.to);
  const calculationMeta = buildRoutineCalculationMeta(localDates.length);
  const routineIds = new Set(input.routines.map((routine) => routine._id.toString()));
  const noRoutineConfigured = routineIds.size === 0;

  if (noRoutineConfigured) {
    return {
      periodDays: localDates.length,
      completedDays: 0,
      partialDays: 0,
      missingDays: 0,
      noRoutineConfigured,
      calculationMeta,
      summaryText: "Bạn chưa có routine nào được thiết lập.",
      helperText:
        "Hãy tạo hoặc hoàn thành routine để bắt đầu xem tóm tắt thói quen.",
    };
  }

  const logsByDate = new Map<string, RoutineLogDto[]>();

  for (const routineLog of input.routineLogs) {
    if (!routineIds.has(routineLog.routineId)) {
      continue;
    }

    const routineLogsForDate = logsByDate.get(routineLog.localDate) ?? [];

    routineLogsForDate.push(routineLog);
    logsByDate.set(routineLog.localDate, routineLogsForDate);
  }

  let completedDays = 0;
  let partialDays = 0;
  let missingDays = 0;

  for (const localDate of localDates) {
    const routineLogsForDate = logsByDate.get(localDate) ?? [];
    const latestLogByRoutineId = new Map<string, RoutineLogDto>();

    for (const routineLog of routineLogsForDate) {
      if (!latestLogByRoutineId.has(routineLog.routineId)) {
        latestLogByRoutineId.set(routineLog.routineId, routineLog);
      }
    }

    if (latestLogByRoutineId.size === 0) {
      missingDays += 1;
      continue;
    }

    const completedRoutineCount = Array.from(latestLogByRoutineId.values()).filter(
      (routineLog) => routineLog.status === "completed",
    ).length;

    if (
      latestLogByRoutineId.size === routineIds.size &&
      completedRoutineCount === routineIds.size
    ) {
      completedDays += 1;
      continue;
    }

    partialDays += 1;
  }

  return {
    periodDays: localDates.length,
    completedDays,
    partialDays,
    missingDays,
    noRoutineConfigured,
    calculationMeta,
    summaryText: `Bạn đã hoàn thành routine trong ${completedDays}/${localDates.length} ngày gần đây.`,
    helperText:
      "Đây chỉ là mẫu theo dõi cá nhân để xem lại thói quen, không phải kết luận về thay đổi trên da.",
  };
}

function buildSymptomFrequency(journals: SkinJournalDto[], periodDays: number) {
  const symptomCounts = new Map<SkinJournalSymptom, number>();

  for (const journal of journals) {
    for (const symptom of journal.symptoms ?? []) {
      symptomCounts.set(symptom, (symptomCounts.get(symptom) ?? 0) + 1);
    }
  }

  const topSymptoms = Array.from(symptomCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) =>
      sortByCountDescendingThenLabel(left, right, (item) => item.label),
    )
    .slice(0, TOP_SUMMARY_ITEM_LIMIT);
  const topSymptom = topSymptoms[0];

  return {
    periodDays,
    topSymptoms,
    calculationMeta: buildSymptomCalculationMeta(periodDays),
    summaryText: topSymptom
      ? `${getSymptomDisplayLabel(topSymptom.label)} là triệu chứng được ghi nhiều nhất trong 30 ngày gần đây.`
      : "Chưa có ghi chú triệu chứng gần đây.",
    helperText: topSymptom
      ? "Nội dung này chỉ phản ánh những gì bạn đã ghi trong nhật ký và không xác nhận tình trạng da."
      : "Hãy thêm nhật ký da để xem tần suất triệu chứng tại đây.",
  };
}

function buildStressReflection(journals: SkinJournalDto[], periodDays: number) {
  const stressCounts: Record<SkinJournalStressLevel, number> = {
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const journal of journals) {
    if (journal.stressLevel) {
      stressCounts[journal.stressLevel] += 1;
    }
  }

  const totalStressEntries =
    stressCounts.high + stressCounts.medium + stressCounts.low;

  return {
    periodDays,
    highStressCount: stressCounts.high,
    mediumStressCount: stressCounts.medium,
    lowStressCount: stressCounts.low,
    calculationMeta: buildStressCalculationMeta(periodDays),
    summaryText:
      totalStressEntries > 0
        ? `Bạn đã ghi nhận mức căng thẳng cao trong ${stressCounts.high} ngày nhật ký.`
        : "Chưa có ghi chú mức độ stress gần đây.",
    helperText:
      totalStressEntries > 0
        ? "Bạn có thể tiếp tục quan sát stress và ghi chú da cùng nhau, nhưng không nên xem đây là kết luận nguyên nhân."
        : "Hãy thêm nhật ký để xem thẻ tự quan sát này.",
  };
}

function buildProductMentionPattern(input: {
  journals: SkinJournalDto[];
  products: Product[];
  periodDays: number;
}) {
  const productById = new Map(
    input.products.map((product) => [product._id.toString(), product]),
  );
  const productMentionCounts = new Map<string, number>();

  for (const journal of input.journals) {
    const productIdsInEntry = new Set(journal.productsUsed ?? []);

    for (const productId of productIdsInEntry) {
      if (!productById.has(productId)) {
        continue;
      }

      productMentionCounts.set(productId, (productMentionCounts.get(productId) ?? 0) + 1);
    }
  }

  const topProducts = Array.from(productMentionCounts.entries())
    .map(([productId, count]) => {
      const product = productById.get(productId);

      if (!product) {
        return null;
      }

      return {
        name: product.name,
        ...(product.brand ? { brand: product.brand } : {}),
        count,
      };
    })
    .filter(
      (product): product is ProductMentionSummary => product !== null,
    )
    .sort((left, right) =>
      sortByCountDescendingThenLabel(
        left,
        right,
        (item) => `${item.brand ?? ""} ${item.name}`,
      ),
    )
    .slice(0, TOP_SUMMARY_ITEM_LIMIT);
  const topProduct = topProducts[0];

  return {
    periodDays: input.periodDays,
    topProducts,
    calculationMeta: buildProductCalculationMeta(input.periodDays),
    summaryText: topProduct
      ? `${topProduct.name} xuất hiện trong ${topProduct.count} mục nhật ký.`
      : "Chưa tìm thấy sản phẩm nào được nhắc đến trong nhật ký gần đây.",
    helperText: topProduct
      ? "Hãy xem lại ghi chú của chính bạn trước khi thay đổi routine. Nội dung này không xác nhận hiệu quả, tác hại hoặc nguyên nhân từ sản phẩm."
      : "Khi bạn ghi sản phẩm đã dùng trong nhật ký, phần này sẽ tóm tắt tần suất xuất hiện.",
  };
}

function countRoutineLoggedDays(input: {
  routines: Routine[];
  routineLogs: RoutineLogDto[];
}) {
  const routineIds = new Set(input.routines.map((routine) => routine._id.toString()));
  const loggedDates = new Set<string>();

  if (routineIds.size === 0) {
    return 0;
  }

  for (const routineLog of input.routineLogs) {
    if (routineIds.has(routineLog.routineId)) {
      loggedDates.add(routineLog.localDate);
    }
  }

  return loggedDates.size;
}

function countSymptomMentions(journals: SkinJournalDto[]) {
  return journals.reduce(
    (total, journal) => total + (journal.symptoms?.length ?? 0),
    0,
  );
}

function countStressNotes(journals: SkinJournalDto[]) {
  return journals.filter((journal) => Boolean(journal.stressLevel)).length;
}

function countResolvedProductMentions(input: {
  journals: SkinJournalDto[];
  products: Product[];
}) {
  const productIds = new Set(input.products.map((product) => product._id.toString()));
  let totalMentions = 0;

  for (const journal of input.journals) {
    const productIdsInEntry = new Set(journal.productsUsed ?? []);

    for (const productId of productIdsInEntry) {
      if (productIds.has(productId)) {
        totalMentions += 1;
      }
    }
  }

  return totalMentions;
}

function getTrackingQualityStatus(input: {
  count: number;
  availableCount: number;
  notConfigured?: boolean;
}): TrackingQualityStatus {
  if (input.notConfigured) {
    return "not_configured";
  }

  if (input.count >= input.availableCount) {
    return "available";
  }

  if (input.count > 0) {
    return "limited";
  }

  return "not_enough_data";
}

function getRoutineTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "not_configured") {
    return "No routine is configured yet. Create a routine when you want routine-log tracking to appear here.";
  }

  if (status === "available") {
    return "You have routine logs available for recent review.";
  }

  if (status === "limited") {
    return "A few routine log days are available. More consistent logging may make future reviews clearer.";
  }

  return "No routine logs were found in the last 7 days.";
}

function getJournalTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "You have journal entries available for recent review.";
  }

  if (status === "limited") {
    return "A few journal entries are available. More entries may make future review clearer.";
  }

  return "No journal entries were found in the last 30 days.";
}

function getSymptomTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "You have symptom notes available for personal reflection.";
  }

  if (status === "limited") {
    return "Some symptom notes are available for personal reflection.";
  }

  return "No symptom notes were found in recent journal entries.";
}

function getStressTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "You have stress notes available for recent review.";
  }

  if (status === "limited") {
    return "Some stress notes are available. More entries may make future review clearer.";
  }

  return "No stress notes were found in recent journal entries.";
}

function getProductMentionTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "You have product mentions available for recent review.";
  }

  if (status === "limited") {
    return "A few product mentions are available for personal reflection.";
  }

  return "No product mentions were found in recent journal entries.";
}

function buildChecklistSummaryText(items: TrackingQualityChecklistItem[]) {
  const availableCount = items.filter((item) => item.status === "available").length;
  const unavailableCount = items.filter(
    (item) =>
      item.status === "not_enough_data" || item.status === "not_configured",
  ).length;

  if (availableCount === items.length) {
    return "Your recent tracking data is available across the checklist.";
  }

  if (unavailableCount === items.length) {
    return "Your recent tracking data is still limited. Continue logging routines or journal entries to build a clearer personal record.";
  }

  return "Your recent tracking data is available in some areas and limited in others.";
}

function buildTrackingQualityChecklist(input: {
  routines: Routine[];
  routineLogs: RoutineLogDto[];
  journals: SkinJournalDto[];
  products: Product[];
}): TrackingQualityChecklistDto {
  const routineLoggedDays = countRoutineLoggedDays({
    routines: input.routines,
    routineLogs: input.routineLogs,
  });
  const journalEntryCount = input.journals.length;
  const symptomMentionCount = countSymptomMentions(input.journals);
  const stressNoteCount = countStressNotes(input.journals);
  const productMentionCount = countResolvedProductMentions({
    journals: input.journals,
    products: input.products,
  });

  // These thresholds describe tracking data availability only.
  // They are not medical thresholds, health scores, risk scores, or skin condition ratings.
  const routineStatus = getTrackingQualityStatus({
    count: routineLoggedDays,
    availableCount: 5,
    notConfigured: input.routines.length === 0,
  });
  const journalStatus = getTrackingQualityStatus({
    count: journalEntryCount,
    availableCount: 5,
  });
  const symptomStatus = getTrackingQualityStatus({
    count: symptomMentionCount,
    availableCount: 5,
  });
  const stressStatus = getTrackingQualityStatus({
    count: stressNoteCount,
    availableCount: 5,
  });
  const productStatus = getTrackingQualityStatus({
    count: productMentionCount,
    availableCount: 3,
  });
  const checklistItems: TrackingQualityChecklistItem[] = [
    {
      key: "routine_logs",
      label: "Routine logs in the last 7 days",
      status: routineStatus,
      count: routineLoggedDays,
      periodDays: ROUTINE_TRACKING_PERIOD_DAYS,
      helperText: getRoutineTrackingHelperText(routineStatus),
    },
    {
      key: "journal_entries",
      label: "Journal entries in the last 30 days",
      status: journalStatus,
      count: journalEntryCount,
      periodDays: JOURNAL_TRACKING_PERIOD_DAYS,
      helperText: getJournalTrackingHelperText(journalStatus),
    },
    {
      key: "symptom_notes",
      label: "Symptom notes in the last 30 days",
      status: symptomStatus,
      count: symptomMentionCount,
      periodDays: JOURNAL_TRACKING_PERIOD_DAYS,
      helperText: getSymptomTrackingHelperText(symptomStatus),
    },
    {
      key: "stress_notes",
      label: "Stress notes in the last 30 days",
      status: stressStatus,
      count: stressNoteCount,
      periodDays: JOURNAL_TRACKING_PERIOD_DAYS,
      helperText: getStressTrackingHelperText(stressStatus),
    },
    {
      key: "product_mentions",
      label: "Product mentions in the last 30 days",
      status: productStatus,
      count: productMentionCount,
      periodDays: JOURNAL_TRACKING_PERIOD_DAYS,
      helperText: getProductMentionTrackingHelperText(productStatus),
    },
  ];

  return {
    routinePeriodDays: ROUTINE_TRACKING_PERIOD_DAYS,
    journalPeriodDays: JOURNAL_TRACKING_PERIOD_DAYS,
    checklistItems,
    summaryText: buildChecklistSummaryText(checklistItems),
    safetyNote:
      "This checklist only reflects tracking data availability. It is not a skin score or medical assessment.",
  };
}

function buildInsufficientDataReasons(input: {
  routineLogs: RoutineLogDto[];
  journals: SkinJournalDto[];
  topProducts: InsightSummaryDto["productMentionPattern"]["topProducts"];
}) {
  const reasons: string[] = [];

  if (input.routineLogs.length === 0) {
    reasons.push("No routine logs were found for the last 7 days.");
  }

  if (input.journals.length === 0) {
    reasons.push("No recent journal entries were found.");
  }

  if (input.topProducts.length === 0) {
    reasons.push("No product mentions were found in recent journal entries.");
  }

  return reasons;
}

export function toInsightSummaryDto(input: {
  routineDateRange: {
    from: string;
    to: string;
  };
  journalDateRange: {
    from: string;
    to: string;
  };
  routines: Routine[];
  routineLogs: RoutineLogDto[];
  journals: SkinJournalDto[];
  products: Product[];
}): InsightSummaryDto {
  const journalPeriodDays = buildLocalDateRange(
    input.journalDateRange.from,
    input.journalDateRange.to,
  ).length;
  const routineConsistency = buildRoutineConsistency({
    from: input.routineDateRange.from,
    to: input.routineDateRange.to,
    routines: input.routines,
    routineLogs: input.routineLogs,
  });
  const symptomFrequency = buildSymptomFrequency(
    input.journals,
    journalPeriodDays,
  );
  const stressReflection = buildStressReflection(
    input.journals,
    journalPeriodDays,
  );
  const productMentionPattern = buildProductMentionPattern({
    journals: input.journals,
    products: input.products,
    periodDays: journalPeriodDays,
  });
  const trackingQualityChecklist = buildTrackingQualityChecklist({
    routines: input.routines,
    routineLogs: input.routineLogs,
    journals: input.journals,
    products: input.products,
  });
  const hasEnoughData = input.routineLogs.length > 0 || input.journals.length > 0;

  return {
    hasEnoughData,
    insufficientDataReasons: buildInsufficientDataReasons({
      routineLogs: input.routineLogs,
      journals: input.journals,
      topProducts: productMentionPattern.topProducts,
    }),
    routineConsistency,
    symptomFrequency,
    stressReflection,
    productMentionPattern,
    trackingQualityChecklist,
    safetyNote:
      "Các thẻ này chỉ dựa trên dữ liệu bạn đã tự ghi lại, không phải kết luận y khoa, không phải chẩn đoán và không xác nhận nguyên nhân.",
  };
}
