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
    dataSourceLabel: "Routine log trong tài khoản của bạn",
    calculationLabel:
      "Đếm số ngày hoàn thành, một phần và chưa có log từ ghi nhận routine.",
    safetyText:
      "Thông tin này chỉ cho thấy mức độ ghi nhận thói quen, không kết luận da tốt hơn hay xấu đi.",
  };
}

function buildSymptomCalculationMeta(
  periodDays: number,
): InsightCalculationMetaDto {
  return {
    periodDays,
    dataSourceLabel: "Dấu hiệu hoặc cảm nhận trong journal của bạn",
    calculationLabel:
      "Các nhãn được ghi lặp lại được đếm và sắp xếp theo tần suất.",
    safetyText:
      "Thông tin này chỉ phản ánh những gì bạn đã ghi, không xác nhận tình trạng da.",
  };
}

function buildStressCalculationMeta(
  periodDays: number,
): InsightCalculationMetaDto {
  return {
    periodDays,
    dataSourceLabel: "Mức stress được ghi trong journal",
    calculationLabel: "Đếm số lần bạn chọn mức stress thấp, vừa hoặc cao.",
    safetyText:
      "Thông tin này không xác định stress là nguyên nhân của thay đổi trên da; chỉ tóm tắt ghi chú đã nhập.",
  };
}

function buildProductCalculationMeta(
  periodDays: number,
): InsightCalculationMetaDto {
  return {
    periodDays,
    dataSourceLabel: "Sản phẩm được nhắc trong journal",
    calculationLabel:
      "Đếm số lần tên sản phẩm xuất hiện trong các mục journal gần đây.",
    safetyText:
      "Thông tin này không xác nhận sản phẩm có lợi hay gây khó chịu cho da.",
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
    return "Chưa có routine nào. Hãy tạo routine khi bạn muốn phần theo dõi routine log xuất hiện ở đây.";
  }

  if (status === "available") {
    return "Bạn đã có routine log gần đây để xem lại.";
  }

  if (status === "limited") {
    return "Đã có một vài ngày ghi nhận routine. Ghi đều hơn sẽ giúp lần xem lại sau rõ hơn.";
  }

  return "Chưa tìm thấy routine log trong 7 ngày gần đây.";
}

function getJournalTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "Bạn đã có journal gần đây để xem lại.";
  }

  if (status === "limited") {
    return "Đã có một vài journal. Thêm ghi nhận sẽ giúp phần xem lại rõ hơn.";
  }

  return "Chưa tìm thấy journal trong 30 ngày gần đây.";
}

function getSymptomTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "Bạn đã có ghi nhận dấu hiệu để tự quan sát.";
  }

  if (status === "limited") {
    return "Đã có một số ghi nhận dấu hiệu để tự quan sát.";
  }

  return "Chưa tìm thấy ghi nhận dấu hiệu trong journal gần đây.";
}

function getStressTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "Bạn đã có ghi nhận stress để xem lại.";
  }

  if (status === "limited") {
    return "Đã có một số ghi nhận stress. Thêm journal sẽ giúp phần xem lại rõ hơn.";
  }

  return "Chưa tìm thấy ghi nhận stress trong journal gần đây.";
}

function getProductMentionTrackingHelperText(status: TrackingQualityStatus) {
  if (status === "available") {
    return "Bạn đã có sản phẩm được nhắc trong journal để xem lại.";
  }

  if (status === "limited") {
    return "Đã có một vài sản phẩm được nhắc để tự quan sát.";
  }

  return "Chưa tìm thấy sản phẩm được nhắc trong journal gần đây.";
}

function buildChecklistSummaryText(items: TrackingQualityChecklistItem[]) {
  const availableCount = items.filter((item) => item.status === "available").length;
  const unavailableCount = items.filter(
    (item) =>
      item.status === "not_enough_data" || item.status === "not_configured",
  ).length;

  if (availableCount === items.length) {
    return "Dữ liệu theo dõi gần đây đã có ở các mục chính trong checklist.";
  }

  if (unavailableCount === items.length) {
    return "Dữ liệu theo dõi gần đây còn hạn chế. Hãy tiếp tục ghi nhận routine hoặc journal để có bối cảnh cá nhân rõ hơn.";
  }

  return "Một số mục đã có dữ liệu, một số mục vẫn cần thêm ghi nhận.";
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
      label: "Routine log trong 7 ngày gần đây",
      status: routineStatus,
      count: routineLoggedDays,
      periodDays: ROUTINE_TRACKING_PERIOD_DAYS,
      helperText: getRoutineTrackingHelperText(routineStatus),
    },
    {
      key: "journal_entries",
      label: "Journal trong 30 ngày gần đây",
      status: journalStatus,
      count: journalEntryCount,
      periodDays: JOURNAL_TRACKING_PERIOD_DAYS,
      helperText: getJournalTrackingHelperText(journalStatus),
    },
    {
      key: "symptom_notes",
      label: "Ghi nhận dấu hiệu trong 30 ngày gần đây",
      status: symptomStatus,
      count: symptomMentionCount,
      periodDays: JOURNAL_TRACKING_PERIOD_DAYS,
      helperText: getSymptomTrackingHelperText(symptomStatus),
    },
    {
      key: "stress_notes",
      label: "Ghi nhận stress trong 30 ngày gần đây",
      status: stressStatus,
      count: stressNoteCount,
      periodDays: JOURNAL_TRACKING_PERIOD_DAYS,
      helperText: getStressTrackingHelperText(stressStatus),
    },
    {
      key: "product_mentions",
      label: "Sản phẩm được nhắc trong 30 ngày gần đây",
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
      "Checklist này chỉ phản ánh mức độ có dữ liệu theo dõi, không phải đánh giá làn da hay tư vấn chuyên môn.",
  };
}

function buildInsufficientDataReasons(input: {
  routineLogs: RoutineLogDto[];
  journals: SkinJournalDto[];
  topProducts: InsightSummaryDto["productMentionPattern"]["topProducts"];
}) {
  const reasons: string[] = [];

  if (input.routineLogs.length === 0) {
    reasons.push("Chưa có routine log trong 7 ngày gần đây.");
  }

  if (input.journals.length === 0) {
    reasons.push("Chưa có journal gần đây.");
  }

  if (input.topProducts.length === 0) {
    reasons.push("Chưa có sản phẩm được nhắc trong journal gần đây.");
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
      "Các thẻ này chỉ dựa trên dữ liệu bạn đã tự ghi lại, không thay thế tư vấn chuyên môn và không xác nhận nguyên nhân.",
  };
}
