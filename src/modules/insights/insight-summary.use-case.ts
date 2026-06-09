import type { InsightSummaryDto } from "@/modules/insights/insight-summary.dto";
import { toInsightSummaryDto } from "@/modules/insights/insight-summary.mapper";
import type { InsightSummaryQueryInput } from "@/modules/insights/insight-summary.schema";
import { addLocalDateDays } from "@/modules/insights/insights.mapper";
import { getServerLocalDate } from "@/modules/insights/insights.use-case";
import { toSkinJournalDto } from "@/modules/journals/skin-journal.mapper";
import { findSkinJournalEntriesByDateRangeForInsights } from "@/modules/journals/skin-journal.repository";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import { findVisibleProductsByIds } from "@/modules/products/product.repository";
import { getRoutineLogsForDateRange } from "@/modules/routine-logs/routine-log.use-case";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";

const ROUTINE_SUMMARY_PERIOD_DAYS = 7;
const JOURNAL_SUMMARY_PERIOD_DAYS = 30;

function getProductIdsFromJournals(journals: SkinJournalDto[]) {
  return Array.from(
    new Set(journals.flatMap((journal) => journal.productsUsed ?? [])),
  );
}

function resolveInsightSummaryDateRanges(input: InsightSummaryQueryInput) {
  const to = input.to ?? getServerLocalDate();

  return {
    routineDateRange: {
      from: addLocalDateDays(to, -(ROUTINE_SUMMARY_PERIOD_DAYS - 1)),
      to,
    },
    journalDateRange: {
      from: addLocalDateDays(to, -(JOURNAL_SUMMARY_PERIOD_DAYS - 1)),
      to,
    },
  };
}

export async function getInsightSummaryForUser(
  userId: string,
  input: InsightSummaryQueryInput,
): Promise<InsightSummaryDto> {
  const { routineDateRange, journalDateRange } =
    resolveInsightSummaryDateRanges(input);
  const [routines, routineLogs, journalDocuments] = await Promise.all([
    listRoutinesForUser(userId),
    getRoutineLogsForDateRange(
      userId,
      routineDateRange.from,
      routineDateRange.to,
    ),
    findSkinJournalEntriesByDateRangeForInsights(
      userId,
      journalDateRange.from,
      journalDateRange.to,
    ),
  ]);
  const journals = journalDocuments.map(toSkinJournalDto);
  const products = await findVisibleProductsByIds(getProductIdsFromJournals(journals));

  return toInsightSummaryDto({
    routineDateRange,
    journalDateRange,
    routines,
    routineLogs,
    journals,
    products,
  });
}
