import type { InsightsDto } from "@/modules/insights/insights.dto";
import { addLocalDateDays, toInsightsDto } from "@/modules/insights/insights.mapper";
import type { InsightsQueryInput } from "@/modules/insights/insights.schema";
import { toSkinJournalDto } from "@/modules/journals/skin-journal.mapper";
import { findSkinJournalEntriesByDateRangeForInsights } from "@/modules/journals/skin-journal.repository";
import { findVisibleProductsByIds } from "@/modules/products/product.repository";
import { getRoutineLogsForDateRange } from "@/modules/routine-logs/routine-log.use-case";
import { listRoutinesForUser } from "@/modules/routines/routine.use-case";

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function getServerLocalDate(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

export function getDefaultInsightsDateRange(referenceDate = new Date()) {
  const to = getServerLocalDate(referenceDate);

  return {
    from: addLocalDateDays(to, -29),
    to,
  };
}

function resolveDateRange(input: InsightsQueryInput) {
  if (input.from && input.to) {
    return {
      from: input.from,
      to: input.to,
    };
  }

  return getDefaultInsightsDateRange();
}

function getProductIdsFromJournals(journals: { productsUsed: string[] }[]) {
  return Array.from(
    new Set(journals.flatMap((journal) => journal.productsUsed ?? [])),
  );
}

export async function getInsightsForUser(
  userId: string,
  input: InsightsQueryInput,
): Promise<InsightsDto> {
  const dateRange = resolveDateRange(input);
  const [routines, routineLogs, journalDocuments] = await Promise.all([
    listRoutinesForUser(userId),
    getRoutineLogsForDateRange(userId, dateRange.from, dateRange.to),
    findSkinJournalEntriesByDateRangeForInsights(
      userId,
      dateRange.from,
      dateRange.to,
    ),
  ]);
  const journals = journalDocuments.map(toSkinJournalDto);
  const products = await findVisibleProductsByIds(getProductIdsFromJournals(journals));

  return toInsightsDto({
    from: dateRange.from,
    to: dateRange.to,
    routines,
    routineLogs,
    journals,
    products,
  });
}
