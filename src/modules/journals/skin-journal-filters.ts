import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import {
  SKIN_JOURNAL_STRESS_LEVELS,
  SKIN_JOURNAL_SYMPTOMS,
  type SkinJournalStressLevel,
  type SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";

export type SkinJournalDateRangeFilter =
  | "all"
  | "last7Days"
  | "last14Days"
  | "last30Days";

export type SkinJournalFilterState = {
  dateRange?: SkinJournalDateRangeFilter;
  productId?: string;
  stressLevel?: SkinJournalStressLevel;
  symptom?: SkinJournalSymptom;
};

export type SkinJournalFilterOptions = {
  productIds: string[];
  stressLevels: SkinJournalStressLevel[];
  symptoms: SkinJournalSymptom[];
};

const daysByDateRange: Record<
  Exclude<SkinJournalDateRangeFilter, "all">,
  number
> = {
  last7Days: 7,
  last14Days: 14,
  last30Days: 30,
};

export function hasActiveSkinJournalFilters(filters: SkinJournalFilterState) {
  return Boolean(
    filters.symptom ||
      filters.stressLevel ||
      filters.productId ||
      (filters.dateRange && filters.dateRange !== "all"),
  );
}

export function filterSkinJournalEntries(
  entries: SkinJournalDto[],
  filters: SkinJournalFilterState,
  options: {
    currentLocalDate: string;
  },
) {
  return entries.filter((entry) => {
    if (filters.symptom && !entry.symptoms.includes(filters.symptom)) {
      return false;
    }

    if (filters.stressLevel && entry.stressLevel !== filters.stressLevel) {
      return false;
    }

    if (filters.productId && !entry.productsUsed.includes(filters.productId)) {
      return false;
    }

    return isEntryWithinJournalDateRange(
      entry,
      filters.dateRange ?? "all",
      options.currentLocalDate,
    );
  });
}

export function getSkinJournalFilterOptions(
  entries: SkinJournalDto[],
): SkinJournalFilterOptions {
  const symptoms = new Set<SkinJournalSymptom>();
  const stressLevels = new Set<SkinJournalStressLevel>();
  const productIds = new Set<string>();

  for (const entry of entries) {
    for (const symptom of entry.symptoms) {
      symptoms.add(symptom);
    }

    if (entry.stressLevel) {
      stressLevels.add(entry.stressLevel);
    }

    for (const productId of entry.productsUsed) {
      productIds.add(productId);
    }
  }

  return {
    productIds: Array.from(productIds).sort((first, second) =>
      first.localeCompare(second),
    ),
    stressLevels: SKIN_JOURNAL_STRESS_LEVELS.filter((stressLevel) =>
      stressLevels.has(stressLevel),
    ),
    symptoms: SKIN_JOURNAL_SYMPTOMS.filter((symptom) => symptoms.has(symptom)),
  };
}

export function isEntryWithinJournalDateRange(
  entry: Pick<SkinJournalDto, "localDate">,
  dateRange: SkinJournalDateRangeFilter,
  currentLocalDate: string,
) {
  if (dateRange === "all") {
    return true;
  }

  const days = daysByDateRange[dateRange];
  const fromLocalDate = addLocalDateDays(currentLocalDate, -(days - 1));

  return entry.localDate >= fromLocalDate && entry.localDate <= currentLocalDate;
}

export function addLocalDateDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const normalizedYear = date.getUTCFullYear();
  const normalizedMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const normalizedDay = String(date.getUTCDate()).padStart(2, "0");

  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}
