import type { InsightSummaryDto } from "@/modules/insights/insight-summary.dto";
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

type ProductMentionSummary =
  InsightSummaryDto["productMentionPattern"]["topProducts"][number];

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

function buildRoutineConsistency(input: {
  from: string;
  to: string;
  routines: Routine[];
  routineLogs: RoutineLogDto[];
}) {
  const localDates = buildLocalDateRange(input.from, input.to);
  const routineIds = new Set(input.routines.map((routine) => routine._id.toString()));
  const noRoutineConfigured = routineIds.size === 0;

  if (noRoutineConfigured) {
    return {
      periodDays: localDates.length,
      completedDays: 0,
      partialDays: 0,
      missingDays: 0,
      noRoutineConfigured,
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
    summaryText: `Bạn đã hoàn thành routine trong ${completedDays}/${localDates.length} ngày gần đây.`,
    helperText:
      "Đây chỉ là mẫu theo dõi cá nhân để xem lại thói quen, không phải kết luận về thay đổi trên da.",
  };
}

function buildSymptomFrequency(journals: SkinJournalDto[]) {
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
    periodDays: 30,
    topSymptoms,
    summaryText: topSymptom
      ? `${getSymptomDisplayLabel(topSymptom.label)} là triệu chứng được ghi nhiều nhất trong 30 ngày gần đây.`
      : "Chưa có ghi chú triệu chứng gần đây.",
    helperText: topSymptom
      ? "Nội dung này chỉ phản ánh những gì bạn đã ghi trong nhật ký và không xác nhận tình trạng da."
      : "Hãy thêm nhật ký da để xem tần suất triệu chứng tại đây.",
  };
}

function buildStressReflection(journals: SkinJournalDto[]) {
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
    periodDays: 30,
    highStressCount: stressCounts.high,
    mediumStressCount: stressCounts.medium,
    lowStressCount: stressCounts.low,
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
    periodDays: 30,
    topProducts,
    summaryText: topProduct
      ? `${topProduct.name} xuất hiện trong ${topProduct.count} mục nhật ký.`
      : "Chưa tìm thấy sản phẩm nào được nhắc đến trong nhật ký gần đây.",
    helperText: topProduct
      ? "Hãy xem lại ghi chú của chính bạn trước khi thay đổi routine. Nội dung này không xác nhận hiệu quả, tác hại hoặc nguyên nhân từ sản phẩm."
      : "Khi bạn ghi sản phẩm đã dùng trong nhật ký, phần này sẽ tóm tắt tần suất xuất hiện.",
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
  const routineConsistency = buildRoutineConsistency({
    from: input.routineDateRange.from,
    to: input.routineDateRange.to,
    routines: input.routines,
    routineLogs: input.routineLogs,
  });
  const symptomFrequency = buildSymptomFrequency(input.journals);
  const stressReflection = buildStressReflection(input.journals);
  const productMentionPattern = buildProductMentionPattern({
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
    safetyNote:
      "Các thẻ này chỉ dựa trên dữ liệu bạn đã tự ghi lại, không phải kết luận y khoa, không phải chẩn đoán và không xác nhận nguyên nhân.",
  };
}
